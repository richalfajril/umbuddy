import * as XLSX from 'xlsx'

type EmbeddedImage = {
  row: number
  col: number
  dataUrl: string
}

const IMAGE_HEADERS = new Set(['Gambar', 'A', 'B', 'C', 'D', 'E'])

// Membaca integer little-endian dari buffer ZIP.
function readUint16(view: DataView, offset: number) {
  return view.getUint16(offset, true)
}

// Membaca integer 32-bit little-endian dari buffer ZIP.
function readUint32(view: DataView, offset: number) {
  return view.getUint32(offset, true)
}

// Mengubah byte gambar menjadi data URL agar bisa dikirim lewat payload JSON saat import.
function toDataUrl(bytes: Uint8Array, mimeType: string) {
  let binary = ''
  const chunkSize = 8192

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.slice(index, index + chunkSize))
  }

  return `data:${mimeType};base64,${btoa(binary)}`
}

// Menebak MIME type dari ekstensi file media di dalam arsip XLSX.
function getMimeType(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase()

  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg'
  if (extension === 'webp') return 'image/webp'
  if (extension === 'gif') return 'image/gif'
  if (extension === 'svg') return 'image/svg+xml'

  return 'image/png'
}

// Mendekompresi entry ZIP XLSX dengan browser Compression Streams tanpa library baru.
async function inflateZipData(data: Uint8Array, method: number) {
  if (method === 0) return data

  if (method !== 8 || typeof DecompressionStream === 'undefined') {
    throw new Error('Browser belum mendukung ekstraksi gambar embedded dari file XLSX ini.')
  }

  const compressedBuffer = new Uint8Array(data).buffer
  const stream = new Blob([compressedBuffer]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
  const arrayBuffer = await new Response(stream).arrayBuffer()

  return new Uint8Array(arrayBuffer)
}

// Membaca isi ZIP dari XLSX agar file drawing/media embedded bisa diakses.
async function readZipEntries(buffer: ArrayBuffer) {
  const view = new DataView(buffer)
  const entries = new Map<string, Uint8Array>()
  const maxSearchStart = Math.max(0, view.byteLength - 66000)
  let endOfCentralDirectory = -1

  for (let offset = view.byteLength - 22; offset >= maxSearchStart; offset -= 1) {
    if (readUint32(view, offset) === 0x06054b50) {
      endOfCentralDirectory = offset
      break
    }
  }

  if (endOfCentralDirectory === -1) return entries

  const totalEntries = readUint16(view, endOfCentralDirectory + 10)
  let centralOffset = readUint32(view, endOfCentralDirectory + 16)

  for (let index = 0; index < totalEntries; index += 1) {
    if (readUint32(view, centralOffset) !== 0x02014b50) break

    const method = readUint16(view, centralOffset + 10)
    const compressedSize = readUint32(view, centralOffset + 20)
    const fileNameLength = readUint16(view, centralOffset + 28)
    const extraLength = readUint16(view, centralOffset + 30)
    const commentLength = readUint16(view, centralOffset + 32)
    const localHeaderOffset = readUint32(view, centralOffset + 42)
    const fileNameStart = centralOffset + 46
    const fileNameBytes = new Uint8Array(buffer, fileNameStart, fileNameLength)
    const fileName = new TextDecoder().decode(fileNameBytes)

    if (readUint32(view, localHeaderOffset) === 0x04034b50) {
      const localNameLength = readUint16(view, localHeaderOffset + 26)
      const localExtraLength = readUint16(view, localHeaderOffset + 28)
      const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength
      const compressedData = new Uint8Array(buffer, dataStart, compressedSize)
      const data = await inflateZipData(compressedData, method)

      entries.set(fileName, data)
    }

    centralOffset += 46 + fileNameLength + extraLength + commentLength
  }

  return entries
}

// Mengambil atribut XML dari tag relasi/drawing tanpa parser DOM agar tetap ringan.
function readXmlAttributes(tag: string) {
  const attributes: Record<string, string> = {}
  const pattern = /([\w:]+)="([^"]*)"/g
  let match = pattern.exec(tag)

  while (match) {
    attributes[match[1]] = match[2]
    match = pattern.exec(tag)
  }

  return attributes
}

// Membaca file XML dari entry XLSX.
function readXml(entries: Map<string, Uint8Array>, path: string) {
  const data = entries.get(path)
  return data ? new TextDecoder().decode(data) : ''
}

// Menggabungkan relative path relasi XLSX menjadi path internal yang bisa dicari di ZIP.
function resolveXlsxPath(basePath: string, target: string) {
  const baseSegments = basePath.split('/').slice(0, -1)
  const targetSegments = target.split('/')

  for (const segment of targetSegments) {
    if (!segment || segment === '.') continue
    if (segment === '..') {
      baseSegments.pop()
      continue
    }

    baseSegments.push(segment)
  }

  return baseSegments.join('/')
}

// Membaca daftar relasi XML untuk worksheet dan drawing.
function readRelationships(xml: string) {
  const relationships = new Map<string, string>()
  const pattern = /<Relationship\b[^>]*>/g
  let match = pattern.exec(xml)

  while (match) {
    const attributes = readXmlAttributes(match[0])

    if (attributes.Id && attributes.Target) {
      relationships.set(attributes.Id, attributes.Target)
    }

    match = pattern.exec(xml)
  }

  return relationships
}

// Menentukan path worksheet berdasarkan nama sheet pertama yang dibaca library XLSX.
function resolveWorksheetPath(entries: Map<string, Uint8Array>, sheetName: string) {
  const workbookXml = readXml(entries, 'xl/workbook.xml')
  const workbookRels = readRelationships(readXml(entries, 'xl/_rels/workbook.xml.rels'))
  const sheetPattern = /<sheet\b[^>]*>/g
  let match = sheetPattern.exec(workbookXml)

  while (match) {
    const attributes = readXmlAttributes(match[0])

    if (attributes.name === sheetName && attributes['r:id']) {
      const target = workbookRels.get(attributes['r:id'])
      return target ? resolveXlsxPath('xl/workbook.xml', target) : 'xl/worksheets/sheet1.xml'
    }

    match = sheetPattern.exec(workbookXml)
  }

  return 'xl/worksheets/sheet1.xml'
}

// Membaca posisi gambar embedded dari drawing XML dan mengubahnya ke data URL.
function readDrawingImages(entries: Map<string, Uint8Array>, drawingPath: string) {
  const images: EmbeddedImage[] = []
  const drawingXml = readXml(entries, drawingPath)
  const relsPath = drawingPath.replace('/drawings/', '/drawings/_rels/') + '.rels'
  const drawingRels = readRelationships(readXml(entries, relsPath))
  const anchorPattern = /<xdr:(?:twoCellAnchor|oneCellAnchor)\b[\s\S]*?<\/xdr:(?:twoCellAnchor|oneCellAnchor)>/g
  let match = anchorPattern.exec(drawingXml)

  while (match) {
    const anchor = match[0]
    const row = Number(anchor.match(/<xdr:row>(\d+)<\/xdr:row>/)?.[1])
    const col = Number(anchor.match(/<xdr:col>(\d+)<\/xdr:col>/)?.[1])
    const embedId = anchor.match(/<a:blip\b[^>]*r:embed="([^"]+)"/)?.[1]
    const target = embedId ? drawingRels.get(embedId) : null

    if (Number.isFinite(row) && Number.isFinite(col) && target) {
      const mediaPath = resolveXlsxPath(drawingPath, target)
      const media = entries.get(mediaPath)

      if (media) {
        images.push({
          row,
          col,
          dataUrl: toDataUrl(media, getMimeType(mediaPath)),
        })
      }
    }

    match = anchorPattern.exec(drawingXml)
  }

  return images
}

// Mengekstrak gambar embedded dari worksheet pertama dan memetakan gambar ke koordinat cell.
async function extractEmbeddedImages(buffer: ArrayBuffer, sheetName: string) {
  const entries = await readZipEntries(buffer)
  const worksheetPath = resolveWorksheetPath(entries, sheetName)
  const worksheetXml = readXml(entries, worksheetPath)
  const drawingId = worksheetXml.match(/<drawing\b[^>]*r:id="([^"]+)"/)?.[1]

  if (!drawingId) return new Map<string, string>()

  const worksheetRelsPath = worksheetPath.replace('/worksheets/', '/worksheets/_rels/') + '.rels'
  const worksheetRels = readRelationships(readXml(entries, worksheetRelsPath))
  const drawingTarget = worksheetRels.get(drawingId)

  if (!drawingTarget) return new Map<string, string>()

  const drawingPath = resolveXlsxPath(worksheetPath, drawingTarget)
  const imagesByCell = new Map<string, string>()

  for (const image of readDrawingImages(entries, drawingPath)) {
    imagesByCell.set(`${image.row}:${image.col}`, image.dataUrl)
  }

  return imagesByCell
}

// Membaca header Excel dari baris pertama untuk mengetahui kolom target gambar.
function readHeaderByColumn(worksheet: XLSX.WorkSheet) {
  const headers = new Map<number, string>()
  const range = worksheet['!ref'] ? XLSX.utils.decode_range(worksheet['!ref']) : null

  if (!range) return headers

  for (let col = range.s.c; col <= range.e.c; col += 1) {
    const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col })
    const header = worksheet[cellAddress]?.v

    if (header !== undefined && header !== null) {
      headers.set(col, String(header).trim())
    }
  }

  return headers
}

// Menggabungkan hasil sheet_to_json dengan gambar embedded pada kolom Gambar/A-E.
function attachEmbeddedImagesToRows(
  rows: Record<string, unknown>[],
  worksheet: XLSX.WorkSheet,
  imagesByCell: Map<string, string>
) {
  const range = worksheet['!ref'] ? XLSX.utils.decode_range(worksheet['!ref']) : null

  if (!range || imagesByCell.size === 0) return rows

  const headers = readHeaderByColumn(worksheet)

  return rows.map((row, index) => {
    const excelRowIndex = range.s.r + index + 1
    const nextRow = { ...row }

    for (const [col, header] of headers) {
      if (!IMAGE_HEADERS.has(header)) continue

      const image = imagesByCell.get(`${excelRowIndex}:${col}`)

      if (image) {
        nextRow[header] = image
      }
    }

    return nextRow
  })
}

// Parser utama Excel admin yang menjaga output tetap berupa array object untuk API import.
export async function parseAdminQuestionExcel(buffer: ArrayBuffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const firstSheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[firstSheetName]
  const jsonObjects = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet)
  const imagesByCell = await extractEmbeddedImages(buffer, firstSheetName)

  return attachEmbeddedImagesToRows(jsonObjects, worksheet, imagesByCell)
}
