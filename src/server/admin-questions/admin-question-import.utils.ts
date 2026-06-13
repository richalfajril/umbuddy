import { Prisma, QuestionStatus } from '@prisma/client'
import type { QuestionCategory } from '@prisma/client'
import { parseTkpWeightMap } from './admin-questions.utils'

type ExcelRow = Record<string, unknown>

type ImportContext = {
  packageCode: string
  globalCategory: string
  adminId: string
}

type ImportedQuestionDraft = {
  category: QuestionCategory
  package_code: string
  number: number
  text: string
  image_urls: string[]
  options: Prisma.InputJsonValue
  answer_key: string | null
  tkp_weights: Prisma.InputJsonValue | typeof Prisma.JsonNull
  explanation: string
  difficulty: string
  status: QuestionStatus
  created_by: string
  updated_by: string
  materialName: string | null
  subMaterialName: string | null
}

type TaxonomyClient = Pick<Prisma.TransactionClient, 'questionSubtest' | 'questionMaterial' | 'questionSubMaterial'>

type QuestionTaxonomy = {
  subtest_id: string
  material_id: string | null
  sub_material_id: string | null
}

// Menyamakan nama header Excel agar spasi, kapital, dan pemisah kecil tidak membuat field kosong.
function normalizeHeader(value: string) {
  return value.toLowerCase().replace(/[\s_/-]+/g, '')
}

// Membentuk key cache taxonomy agar lookup Materi/Sub-Materi tidak diulang untuk setiap soal.
function getTaxonomyCacheKey(draft: Pick<ImportedQuestionDraft, 'category' | 'materialName' | 'subMaterialName'>) {
  return [
    draft.category,
    draft.materialName?.trim().toLowerCase() ?? '',
    draft.subMaterialName?.trim().toLowerCase() ?? '',
  ].join('\u0000')
}

// Membaca nilai cell dari beberapa kemungkinan header Excel agar format lama tetap kompatibel.
function readCell(row: ExcelRow, keys: string[]) {
  const normalizedRow = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [normalizeHeader(key), value])
  )

  for (const key of keys) {
    const value = row[key] ?? normalizedRow[normalizeHeader(key)]
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim()
    }
  }

  return ''
}

// Menentukan apakah isi cell adalah referensi gambar berbasis URL/path/nama file.
function isImageReference(value: string) {
  return /^data:image\/[a-z0-9.+-]+;base64,/i.test(value)
    || /\.(png|jpe?g|webp|gif|svg)$/i.test(value)
    || /^https?:\/\/.+\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(value)
}

// Menormalkan opsi Excel agar opsi teks dan opsi gambar bisa disimpan dalam format JSON yang sama.
function readOption(row: ExcelRow, key: 'A' | 'B' | 'C' | 'D' | 'E') {
  const value = readCell(row, [key])

  if (!value) return {}
  if (isImageReference(value)) return { image_url: value }

  return { text: value }
}

// Mengambil kategori dari kolom Subtes atau override global dari form admin.
function readCategory(row: ExcelRow, globalCategory: string): QuestionCategory {
  const rawCategory = globalCategory === 'CAMPURAN'
    ? readCell(row, ['Subtes', 'Subtes (TWK, TIU, TKP)']).toUpperCase()
    : globalCategory.toUpperCase()

  if (rawCategory === 'TIU' || rawCategory === 'TKP') return rawCategory

  return 'TWK'
}

// Membentuk draft soal dari satu baris Excel sebelum diberi ID taxonomy.
export function buildImportedQuestionDraft(row: ExcelRow, index: number, context: ImportContext): ImportedQuestionDraft {
  const category = readCategory(row, context.globalCategory)
  const rawKeyOrWeight = readCell(row, ['Kunci/Bobot', 'Kunci/Bobot (bobot 1-5)']).toUpperCase()
  const questionImage = readCell(row, ['Gambar'])
  const tkpWeights = category === 'TKP' ? parseTkpWeightMap(rawKeyOrWeight) : null

  return {
    category,
    package_code: context.packageCode,
    number: Number(readCell(row, ['No']) || index + 1),
    text: readCell(row, ['Soal']),
    image_urls: questionImage ? [questionImage] : [],
    options: {
      A: readOption(row, 'A'),
      B: readOption(row, 'B'),
      C: readOption(row, 'C'),
      D: readOption(row, 'D'),
      E: readOption(row, 'E'),
    } as Prisma.InputJsonValue,
    answer_key: category === 'TKP' ? null : rawKeyOrWeight,
    tkp_weights: tkpWeights ? (tkpWeights as Prisma.InputJsonValue) : Prisma.JsonNull,
    explanation: readCell(row, ['Pembahasan']),
    difficulty: 'MEDIUM',
    status: QuestionStatus.PUBLISHED,
    created_by: context.adminId,
    updated_by: context.adminId,
    materialName: readCell(row, ['Materi']) || null,
    subMaterialName: readCell(row, ['Sub-Materi', 'Sub Materi']) || null,
  }
}

// Membuat/mengambil taxonomy CPNS dari kolom Subtes, Materi, dan Sub-Materi.
export async function resolveQuestionTaxonomy(
  tx: TaxonomyClient,
  draft: Pick<ImportedQuestionDraft, 'category' | 'materialName' | 'subMaterialName'>
): Promise<QuestionTaxonomy> {
  const subtest = await tx.questionSubtest.upsert({
    where: { code: draft.category },
    update: {},
    create: {
      code: draft.category,
      name: draft.category,
    },
  })

  let materialId: string | null = null
  let subMaterialId: string | null = null

  if (draft.materialName) {
    const existingMaterial = await tx.questionMaterial.findFirst({
      where: {
        subtest_id: subtest.id,
        name: draft.materialName,
      },
      select: { id: true },
    })

    const material = existingMaterial ?? await tx.questionMaterial.create({
      data: {
        subtest_id: subtest.id,
        name: draft.materialName,
      },
      select: { id: true },
    })

    materialId = material.id

    if (draft.subMaterialName) {
      const existingSubMaterial = await tx.questionSubMaterial.findFirst({
        where: {
          material_id: material.id,
          name: draft.subMaterialName,
        },
        select: { id: true },
      })

      const subMaterial = existingSubMaterial ?? await tx.questionSubMaterial.create({
        data: {
          material_id: material.id,
          name: draft.subMaterialName,
        },
        select: { id: true },
      })

      subMaterialId = subMaterial.id
    }
  }

  return {
    subtest_id: subtest.id,
    material_id: materialId,
    sub_material_id: subMaterialId,
  }
}

// Menyiapkan semua taxonomy unik di luar transaksi insert agar upload besar tidak terkena timeout.
export async function resolveQuestionTaxonomyMap(
  db: TaxonomyClient,
  drafts: Array<Pick<ImportedQuestionDraft, 'category' | 'materialName' | 'subMaterialName'>>
) {
  const taxonomyByKey = new Map<string, QuestionTaxonomy>()

  for (const draft of drafts) {
    const cacheKey = getTaxonomyCacheKey(draft)

    if (!taxonomyByKey.has(cacheKey)) {
      taxonomyByKey.set(cacheKey, await resolveQuestionTaxonomy(db, draft))
    }
  }

  return taxonomyByKey
}

// Mengambil taxonomy hasil cache untuk draft soal tertentu.
export function getResolvedQuestionTaxonomy(
  taxonomyByKey: Map<string, QuestionTaxonomy>,
  draft: Pick<ImportedQuestionDraft, 'category' | 'materialName' | 'subMaterialName'>
) {
  const taxonomy = taxonomyByKey.get(getTaxonomyCacheKey(draft))

  if (!taxonomy) {
    throw new Error('Taxonomy soal belum berhasil disiapkan.')
  }

  return taxonomy
}

// Menghapus field bantu sebelum data dikirim ke Prisma Question.
export function toQuestionCreateInput(
  draft: ImportedQuestionDraft,
  taxonomy: QuestionTaxonomy
) {
  const question = {
    category: draft.category,
    package_code: draft.package_code,
    number: draft.number,
    text: draft.text,
    image_urls: draft.image_urls,
    options: draft.options,
    answer_key: draft.answer_key,
    tkp_weights: draft.tkp_weights,
    explanation: draft.explanation,
    difficulty: draft.difficulty,
    status: draft.status,
    created_by: draft.created_by,
    updated_by: draft.updated_by,
  }

  return {
    ...question,
    ...taxonomy,
  }
}
