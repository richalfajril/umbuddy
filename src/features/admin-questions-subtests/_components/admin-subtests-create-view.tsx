'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, FileUp } from 'lucide-react'
import { Button } from '@/components/ui'
import { useToastStore } from '@/stores/useToastStore'

export function AdminSubtestsCreateView() {
  const router = useRouter()
  const { addToast } = useToastStore()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Form states
  const [packageName, setPackageName] = React.useState('')
  const [category, setCategory] = React.useState('CAMPURAN')
  const [maxQuestions, setMaxQuestions] = React.useState('15')
  const [file, setFile] = React.useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!packageName) {
      addToast({ type: 'error', title: 'Validasi Gagal', message: 'Nama Subtes wajib diisi.' })
      return
    }
    if (!file) {
      addToast({ type: 'error', title: 'Validasi Gagal', message: 'File Excel wajib diunggah untuk membuat subtes.' })
      return
    }

    setIsSubmitting(true)
    
    // TODO: Connect to actual /api/v1/admin/questions/import endpoint
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      addToast({
        type: 'success',
        title: 'Subtes Berhasil Dibuat',
        message: `Paket ${packageName} berhasil di-import dari file Excel.`
      })
      router.push('/admin/questions/subtests')
    }, 1500)
  }

  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/questions/subtests"
              className="grid min-h-11 min-w-11 place-items-center rounded-2xl border border-border bg-background text-muted transition-colors hover:bg-surface hover:text-headline"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-display text-2xl font-black leading-tight sm:text-3xl text-headline">
                Tambah Subtes
              </h1>
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
                <label htmlFor="maxQuestions" className="text-sm font-bold text-headline">
                  Maksimal Soal <span className="text-red-500">*</span>
                </label>
                <input
                  id="maxQuestions"
                  type="number"
                  value={maxQuestions}
                  onChange={(e) => setMaxQuestions(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-headline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-surface"
                />
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
