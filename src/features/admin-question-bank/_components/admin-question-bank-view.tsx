'use client'

import * as React from 'react'
import { Database, Search } from 'lucide-react'
import { QUESTION_CATEGORIES, QUESTION_STATUS } from '../_constants/admin-question-bank.constants'
import type { AdminQuestion, AdminQuestionFilters, AdminQuestionListResponse, QuestionCategory, QuestionStatus } from '../_types/admin-question-bank.types'
import { useToastStore } from '@/stores/useToastStore'
import { AdminQuestionBankTable } from './admin-question-bank-table'
import { AdminPageHeader, AdminTableLayout } from '@/components/organisms'

export function AdminQuestionBankView({ initialData }: { initialData: AdminQuestionListResponse }) {
  // Filter lokal mengontrol pencarian, kategori, status, dan pagination bank soal.
  const [filters, setFilters] = React.useState<AdminQuestionFilters>({
    category: 'ALL',
    status: 'ALL',
    packageCode: '',
    search: '',
    page: 1,
    limit: 20,
  })

  const [questions, setQuestions] = React.useState<AdminQuestion[]>(initialData.questions)
  const [total, setTotal] = React.useState(initialData.total)
  const [isLoading, setIsLoading] = React.useState(false)
  const { addToast } = useToastStore()
  const hasHydratedRef = React.useRef(false)

  // Memuat ulang bank soal hanya saat admin mengubah filter setelah data awal server-side tersedia.
  const loadQuestions = React.useCallback(async (currentFilters: AdminQuestionFilters) => {
    setIsLoading(true)
    const params = new URLSearchParams()
    params.set('page', currentFilters.page.toString())
    params.set('page_size', currentFilters.limit.toString())
    if (currentFilters.search.trim()) params.set('keyword', currentFilters.search.trim())
    if (currentFilters.category !== 'ALL') params.set('category', currentFilters.category)
    if (currentFilters.status !== 'ALL') params.set('status', currentFilters.status)

    try {
      const response = await fetch(`/api/v1/admin/questions?${params.toString()}`)
      if (!response.ok) throw new Error('Gagal memuat data bank soal')
      const data = await response.json()
      setQuestions(data.questions)
      setTotal(data.total)
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error Fetching',
        message: error instanceof Error ? error.message : 'Terjadi kesalahan tidak dikenal.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  // Debounce filter tanpa melakukan refetch ganda pada render pertama.
  React.useEffect(() => {
    if (!hasHydratedRef.current) {
      hasHydratedRef.current = true
      return
    }

    const timer = setTimeout(() => {
      loadQuestions(filters)
    }, 400)
    return () => clearTimeout(timer)
  }, [filters, loadQuestions])

  // Mengubah keyword selalu mengembalikan admin ke halaman pertama.
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))
  }

  // Memuat halaman berikutnya melalui API tanpa full route reload.
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  // Mengubah jumlah baris mengulang pagination dari halaman pertama.
  const handleLimitChange = (newLimit: number) => {
    setFilters(prev => ({ ...prev, limit: newLimit, page: 1 }))
  }

  // Filter kategori mengikuti enum kategori soal dari server.
  const handleCategoryChange = (value: QuestionCategory | 'ALL') => {
    setFilters(prev => ({ ...prev, category: value, page: 1 }))
  }

  // Filter status mengikuti status publish bank soal.
  const handleStatusChange = (value: QuestionStatus | 'ALL') => {
    setFilters(prev => ({ ...prev, status: value, page: 1 }))
  }

  // Total halaman diturunkan dari total server dan limit aktif.
  const totalPages = Math.ceil(total / filters.limit)

  // Kontrol filter dikirim ke layout agar wrapper tabel tetap satu pola.
  const filtersNode = (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-[320px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Cari teks soal..."
          className="block w-full rounded-3xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm font-semibold text-headline transition placeholder:text-muted focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filters.category}
          onChange={(e) => handleCategoryChange(e.target.value as QuestionCategory | 'ALL')}
          className="rounded-3xl border border-border bg-surface py-2.5 pl-3 pr-8 text-sm font-semibold text-headline transition focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
        >
          {QUESTION_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select
          value={filters.status}
          onChange={(e) => handleStatusChange(e.target.value as QuestionStatus | 'ALL')}
          className="rounded-3xl border border-border bg-surface py-2.5 pl-3 pr-8 text-sm font-semibold text-headline transition focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
        >
          {QUESTION_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
    </div>
  )

  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <AdminPageHeader
          icon={<Database className="h-5 w-5 text-primary" />}
          eyebrow="Read-Only Database"
          title={<>Bank <span className="text-primary">Soal</span></>}
          description="Lihat seluruh inventaris soal yang telah diimpor ke sistem."
        />

        {/* Tabel bank soal memakai initial server-side data lalu refetch ringan saat filter berubah. */}
        <AdminTableLayout
          filters={filtersNode}
          pagination={{
            page: filters.page,
            limit: filters.limit,
            total,
            totalPages,
            onPageChange: handlePageChange,
            onLimitChange: handleLimitChange,
            isLoading,
          }}
        >
          <AdminQuestionBankTable questions={questions} isLoading={isLoading} />
        </AdminTableLayout>

      </div>
    </section>
  )
}
