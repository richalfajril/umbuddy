'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import { ArrowLeft, FileUp } from 'lucide-react'
import { Button } from '@/components/ui'
import { useToastStore } from '@/stores/useToastStore'

export function AdminSubtestsCreateView() {
  const router = useRouter()
  const { addToast } = useToastStore()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // State untuk form
  const [packageName, setPackageName] = React.useState('')
  const [category, setCategory] = React.useState('CAMPURAN')
  const [totalQuestions, setTotalQuestions] = React.useState<number | null>(null)
  const [isParsing, setIsParsing] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [parsedQuestions, setParsedQuestions] = React.useState<unknown[]>([])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setIsParsing(true)
      
      try {
        const buffer = await selectedFile.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'buffer' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        // Kita perlu menyimpan data berformat objek untuk dikirimkan (submit).
        // Catatan: sheet_to_json dengan parameter header: 1 mengembalikan format array of arrays.
        // Sebaiknya kita parsing ulang menjadi objek murni untuk dikirim ke backend.
        const jsonObjects = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet)
        const validObjects = jsonObjects.filter((obj) => obj && (obj['Soal'] || obj['Subtes'] || obj['No']))
        
        setTotalQuestions(validObjects.length)
        setParsedQuestions(validObjects)
      } catch (error) {
        console.error('Error parsing excel:', error)
        addToast({ type: 'error', title: 'Gagal Membaca File', message: 'Pastikan file Excel memiliki format yang valid.' })
        setTotalQuestions(null)
        setParsedQuestions([])
      } finally {
        setIsParsing(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!packageName) {
      addToast({ type: 'error', title: 'Validasi Gagal', message: 'Nama Subtes wajib diisi.' })
      return
    }
    if (!file || parsedQuestions.length === 0) {
      addToast({ type: 'error', title: 'Validasi Gagal', message: 'File Excel wajib diunggah dan harus berisi minimal 1 soal.' })
      return
    }

    setIsSubmitting(true)
    
    try {
      const res = await fetch('/api/v1/admin/questions/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageCode: packageName,
          category,
          questions: parsedQuestions
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan pada server.')
      }

      addToast({
        type: 'success',
        title: 'Subtes Berhasil Dibuat',
        message: data.message || `Paket ${packageName} berhasil di-import.`
      })
      router.push('/admin/questions/subtests')
    } catch (error: unknown) {
      console.error('Import Submit Error:', error)
      addToast({ type: 'error', title: 'Gagal Import', message: error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 rounded-3xl border border-border bg-background p-5 sm:p-7 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-surface">
          <div className="flex items-start gap-4 sm:items-center">
            <Link
              href="/admin/questions/subtests"
              className="mt-1 grid min-h-11 min-w-11 shrink-0 place-items-center rounded-2xl border border-border bg-background text-muted transition-colors hover:bg-surface hover:text-headline sm:mt-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                Question Packages
              </p>
              <h1 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl text-headline">
                Tambah <span className="text-primary">Subtes</span>
              </h1>
              <p className="mt-1 text-sm text-body">
                Buat wadah paket soal baru dan unggah dari Excel.
              </p>
            </div>
          </div>
        </header>

        {/* Form Area */}
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
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="Masukkan nama subtes (contoh: UM05_Wawasan Kebangsaan)"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-headline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-surface"
              />
              <p className="text-xs text-muted">Akan digunakan sebagai <code>package_code</code> di database.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-bold text-headline">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                  Total Soal <span className="text-muted font-normal">(Otomatis)</span>
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
                Import Soal (Excel) <span className="text-red-500">*</span>
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
                      {file ? file.name : 'Klik atau seret file Excel ke sini'}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Mendukung format .xlsx dan .xls'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
              <Link href="/admin/questions/subtests">
                <Button variant="secondary" type="button" className="rounded-xl">
                  Batal
                </Button>
              </Link>
              <Button type="submit" isLoading={isSubmitting} loadingLabel="Mengimpor..." className="rounded-xl">
                Simpan & Import Soal
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
