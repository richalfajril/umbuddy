'use client'

import * as React from 'react'
import { Database, Search } from 'lucide-react'
import { Button } from '@/components/ui'
import { QUESTION_CATEGORIES, QUESTION_STATUS, QUESTION_STATUS_COLORS } from '../_constants/admin-question-bank.constants'
import type { AdminQuestion, AdminQuestionFilters, AdminQuestionListResponse } from '../_types/admin-question-bank.types'
import { useToastStore } from '@/stores/useToastStore'
import { AdminQuestionBankTable } from './admin-question-bank-table'
import { SmartPagination } from '@/components/molecules'

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

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handleLimitChange = (newLimit: number) => {
    setFilters(prev => ({ ...prev, limit: newLimit, page: 1 }))
  }

  const totalPages = Math.ceil(total / filters.limit)

  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-7 dark:bg-surface">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4 sm:items-center">
              <div className="mt-1 grid min-h-11 min-w-11 shrink-0 place-items-center rounded-2xl border border-border bg-background text-muted sm:mt-0">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                  Read-Only Database
                </p>
                <h1 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl text-headline">
                  Bank <span className="text-primary">Soal</span>
                </h1>
                <p className="mt-2 text-sm font-medium text-muted">
                  Lihat seluruh inventaris soal yang telah diimpor ke sistem.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Table Section */}
        <section className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm dark:bg-surface">
          {/* Filters Area */}
          <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
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
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any, page: 1 }))}
                className="rounded-xl border border-border bg-background py-2.5 pl-3 pr-8 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-surface/50"
              >
                {QUESTION_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any, page: 1 }))}
                className="rounded-xl border border-border bg-background py-2.5 pl-3 pr-8 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-surface/50"
              >
                {QUESTION_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <AdminQuestionBankTable questions={questions} />
          </div>
          
          {/* Smart Pagination Controls */}
          <SmartPagination
            page={filters.page}
            limit={filters.limit}
            total={total}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            isLoading={isLoading}
          />
        </section>

      </div>
    </section>
  )
}
