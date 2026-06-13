'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import { ArrowLeft, FileUp, Save } from 'lucide-react'
import { AdminPageHeader } from '@/components/organisms'
import { Button } from '@/components/ui'
import { useToastStore } from '@/stores/useToastStore'

type AdminSubtestsEditViewProps = {
  initialPackageCode: string
  initialCategory: string
  initialTotalQuestions: number
}

// View edit subtes memakai pola form create, tetapi file Excel bersifat opsional.
export function AdminSubtestsEditView({
  initialPackageCode,
  initialCategory,
  initialTotalQuestions,
}: AdminSubtestsEditViewProps) {
  const router = useRouter()
  const { addToast } = useToastStore()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // State form edit menyimpan nama paket, kategori, dan hasil parsing Excel opsional.
  const [packageName, setPackageName] = React.useState(initialPackageCode)
  const [category, setCategory] = React.useState(initialCategory)
  const [totalQuestions, setTotalQuestions] = React.useState<number | null>(initialTotalQuestions)
  const [isParsing, setIsParsing] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [parsedQuestions, setParsedQuestions] = React.useState<unknown[]>([])

  // Membaca Excel baru jika admin ingin mengganti isi soal dalam paket.
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return

    const selectedFile = event.target.files[0]
    setFile(selectedFile)
    setIsParsing(true)

    try {
      const buffer = await selectedFile.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'buffer' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const jsonObjects = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet)
      const validObjects = jsonObjects.filter((obj) => obj && (obj['Soal'] || obj['Subtes'] || obj['No']))

      setTotalQuestions(validObjects.length)
      setParsedQuestions(validObjects)
    } catch (error) {
      console.error('Error parsing excel:', error)
      addToast({
        type: 'error',
        title: 'Gagal Membaca File',
        message: 'Pastikan file Excel memiliki format yang valid.',
      })
      setTotalQuestions(initialTotalQuestions)
      setParsedQuestions([])
      setFile(null)
    } finally {
      setIsParsing(false)
    }
  }

  // Submit edit memperbarui metadata paket dan opsional mengganti isi soal dari Excel baru.
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!packageName.trim()) {
      addToast({ type: 'error', title: 'Validasi Gagal', message: 'Nama Subtes wajib diisi.' })
      return
    }

    if (file && parsedQuestions.length === 0) {
      addToast({
        type: 'error',
        title: 'Validasi Gagal',
        message: 'File Excel harus berisi minimal 1 soal jika ingin mengganti isi paket.',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/v1/admin/questions/packages/${encodeURIComponent(initialPackageCode)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageCode: packageName.trim(),
          category,
          questions: file ? parsedQuestions : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan pada server.')
      }

      addToast({
        type: 'success',
        title: 'Subtes Berhasil Diubah',
        message: data.message || `Paket ${packageName} berhasil diperbarui.`,
      })
      router.push('/admin/subtests')
    } catch (error) {
      console.error('Edit Subtest Error:', error)
      addToast({
        type: 'error',
        title: 'Gagal Menyimpan',
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPageHeader
          icon={
            <Link
              href="/admin/subtests"
              className="grid h-full w-full place-items-center text-muted transition-colors hover:text-headline"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          }
          eyebrow="Question Packages"
          title={<>Edit <span className="text-primary">Subtes</span></>}
          description="Ubah nama paket, kategori, atau ganti isi soal dari Excel baru."
          actions={
            <Button className="w-full gap-2 rounded-xl sm:w-auto" onClick={handleSubmit} isLoading={isSubmitting}>
              <Save className="h-4 w-4" />
              Simpan Perubahan
            </Button>
          }
        />

        <div className="rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8 dark:bg-surface">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="packageName" className="text-sm font-bold text-headline">
                Nama Subtes <span className="text-red-500">*</span>
              </label>
              <input
                id="packageName"
                type="text"
                value={packageName}
                onChange={(event) => setPackageName(event.target.value)}
                placeholder="Masukkan nama subtes"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-headline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-surface"
              />
              <p className="text-xs text-muted">Mengubah nama akan memperbarui <code>package_code</code> semua soal dalam paket ini.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-bold text-headline">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-headline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-surface"
                >
                  <option value="CAMPURAN">Campuran (Sesuai Excel)</option>
                  <option value="TWK">TWK (Tes Wawasan Kebangsaan)</option>
                  <option value="TIU">TIU (Tes Intelegensia Umum)</option>
                  <option value="TKP">TKP (Tes Karakteristik Pribadi)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-headline">
                  Total Soal <span className="font-normal text-muted">(Saat Ini / Excel Baru)</span>
                </label>
                <div className="flex w-full items-center rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm text-headline dark:bg-surface/50">
                  {isParsing ? (
                    <span className="animate-pulse text-muted">Menghitung...</span>
                  ) : (
                    <span className="font-bold">
                      {totalQuestions !== null ? `${totalQuestions} Soal` : '-'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-headline">
                Ganti Isi Soal (Excel) <span className="font-normal text-muted">(Opsional)</span>
              </label>
              <div className="relative rounded-2xl border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                    <FileUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-headline">
                      {file ? file.name : 'Unggah Excel baru jika ingin mengganti soal'}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Kosongkan jika hanya mengubah nama atau kategori'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
              <Link href="/admin/subtests">
                <Button variant="secondary" type="button" className="rounded-xl">
                  Batal
                </Button>
              </Link>
              <Button type="submit" isLoading={isSubmitting} loadingLabel="Menyimpan..." className="rounded-xl">
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
