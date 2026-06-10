'use client'

import * as React from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui'
import { QUESTION_CATEGORIES, QUESTION_STATUS, QUESTION_STATUS_COLORS } from '../_constants/admin-question-bank.constants'
import type { AdminQuestion, AdminQuestionFilters, AdminQuestionListResponse } from '../_types/admin-question-bank.types'
import { useToastStore } from '@/stores/useToastStore'

export function AdminQuestionBankView({ initialData }: { initialData: AdminQuestionListResponse }) {
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

  // Simple debounce effect for filters
  React.useEffect(() => {
    const timer = setTimeout(() => {
      loadQuestions(filters)
    }, 400)
    return () => clearTimeout(timer)
  }, [filters, loadQuestions])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))
  }

  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-7 dark:bg-surface">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                Question Management
              </p>
              <h1 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl text-headline">
                Bank <span className="text-primary">Soal</span>
              </h1>
              <p className="mt-2 text-sm font-medium text-muted">
                Kelola seluruh konten soal, publikasi, dan draf untuk simulasi CAT.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="w-full gap-2 rounded-xl sm:w-auto">
                <Plus className="h-4 w-4" />
                Tambah Soal
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-surface">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Cari teks soal..."
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-surface/50"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
              className="rounded-xl border border-border bg-background py-2.5 pl-3 pr-8 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-surface/50"
            >
              {QUESTION_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              className="rounded-xl border border-border bg-background py-2.5 pl-3 pr-8 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-surface/50"
            >
              {QUESTION_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm dark:bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-body">
              <thead className="bg-surface text-xs font-bold uppercase text-headline dark:bg-surface/50">
                <tr>
                  <th className="px-6 py-4">Paket & No</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Pertanyaan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {questions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted">
                      Tidak ada soal yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  questions.map((q) => (
                    <tr key={q.id} className="transition-colors hover:bg-surface/50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="font-bold text-headline">{q.package_code}</div>
                        <div className="text-xs text-muted">No. {q.number}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-bold text-headline">
                        {q.category}
                      </td>
                      <td className="px-6 py-4">
                        <p className="line-clamp-2 max-w-lg text-sm text-body">
                          {q.text}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${QUESTION_STATUS_COLORS[q.status] || ''}`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <Button variant="secondary" size="sm" className="rounded-lg">
                          Detail
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Simple Pagination Footer */}
          <div className="flex items-center justify-between border-t border-border bg-surface px-6 py-3 dark:bg-surface/50">
            <span className="text-sm text-muted">
              Menampilkan {questions.length} dari total {total} soal.
            </span>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                disabled={filters.page === 1 || isLoading}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Sebelumnya
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                disabled={questions.length < filters.limit || isLoading}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
