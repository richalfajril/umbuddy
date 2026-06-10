'use client'

import * as React from 'react'
import { useToastStore } from '@/stores/useToastStore'
import { initialAdminQuestionForm } from '../_constants/admin-questions.constants'
import type {
  AdminQuestionFormState,
  AdminQuestionListItem,
  AdminQuestionsResponse,
} from '../_types/admin-questions.types'
import {
  buildAdminQuestionPayload,
  readAdminQuestionApiError,
} from '../_utils/admin-questions.utils'
import { AdminQuestionFilters } from './admin-question-filters'
import { AdminQuestionForm } from './admin-question-form'
import { SmartPagination } from '@/components/molecules'
import { AdminQuestionTable } from './admin-question-table'

type AdminQuestionsViewProps = {
  initialQuestions: AdminQuestionListItem[]
  initialTotal: number
}

// UI utama A2 MVP untuk list dan create draft question.
export function AdminQuestionsView({
  initialQuestions,
  initialTotal,
}: AdminQuestionsViewProps) {
  // State list, filter, dan form dikelola lokal agar MVP tetap cepat.
  const [questions, setQuestions] = React.useState(initialQuestions)
  const [total, setTotal] = React.useState(initialTotal)
  const [status, setStatus] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [keyword, setKeyword] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [form, setForm] = React.useState<AdminQuestionFormState>(initialAdminQuestionForm)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const { addToast } = useToastStore()

  // Helper update field form agar input tetap controlled dan ringkas.
  const updateForm = (field: keyof AdminQuestionFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  // Edit handler: mapping dari response item ke form state
  const handleEditQuestion = (question: AdminQuestionListItem) => {
    setEditingId(question.id)
    setForm({
      category: question.category,
      package_code: question.package_code,
      number: question.number.toString(),
      text: question.text || '',
      option_a: question.options['A']?.text || '',
      option_b: question.options['B']?.text || '',
      option_c: question.options['C']?.text || '',
      option_d: question.options['D']?.text || '',
      option_e: question.options['E']?.text || '',
      answer_key: question.answer_key || 'A',
      tkp_a: question.tkp_weights?.['A']?.toString() || '1',
      tkp_b: question.tkp_weights?.['B']?.toString() || '2',
      tkp_c: question.tkp_weights?.['C']?.toString() || '3',
      tkp_d: question.tkp_weights?.['D']?.toString() || '4',
      tkp_e: question.tkp_weights?.['E']?.toString() || '5',
      explanation: question.explanation || '',
      difficulty: question.difficulty || 'medium',
    })
    // Auto scroll ke form jika form ada di bawah (mobile view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm(initialAdminQuestionForm)
  }

  const isFirstRender = React.useRef(true)

  // Mengambil list soal memakai filter admin saat ini.
  const loadQuestions = React.useCallback(async (
    targetPage = page,
    currentLimit = limit,
    currentStatus = status,
    currentCategory = category,
    currentKeyword = keyword
  ) => {
    setIsLoading(true)
    const params = new URLSearchParams()
    params.set('page', targetPage.toString())
    params.set('limit', currentLimit.toString())
    if (currentStatus) params.set('status', currentStatus)
    if (currentCategory) params.set('category', currentCategory)
    if (currentKeyword.trim()) params.set('keyword', currentKeyword.trim())

    try {
      const response = await fetch(`/api/v1/admin/questions?${params.toString()}`)
      if (!response.ok) throw new Error(await readAdminQuestionApiError(response))
      const data = (await response.json()) as AdminQuestionsResponse
      setQuestions(data.questions)
      setTotal(data.total)
    } catch (error) {
      addToast({
        type: 'error',
        title: 'List Soal Gagal Dimuat',
        message: error instanceof Error ? error.message : 'Coba lagi sebentar.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [addToast, category, keyword, status, page, limit])

  // Smart Search: debounce keyword, status, category changes
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const timer = setTimeout(() => {
      setPage(1)
      loadQuestions(1, limit, status, category, keyword)
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, status, category])

  const handleFilter = () => {
    setPage(1)
    loadQuestions(1, limit, status, category, keyword)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
    loadQuestions(1, newLimit, status, category, keyword)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    loadQuestions(newPage, limit, status, category, keyword)
  }

  // Submit create draft atau update draft mengirim payload sesuai kontrak.
  const saveQuestion = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      const isEdit = editingId !== null
      const url = isEdit ? `/api/v1/admin/questions/${editingId}` : '/api/v1/admin/questions'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildAdminQuestionPayload(form)),
      })

      if (!response.ok) throw new Error(await readAdminQuestionApiError(response))

      setForm(initialAdminQuestionForm)
      setEditingId(null)
      addToast({
        type: 'success',
        title: isEdit ? 'Perubahan Tersimpan' : 'Draft Soal Tersimpan',
        message: isEdit ? 'Soal berhasil diperbarui.' : 'Soal masuk Draft dan siap direview sebelum publish.',
      })
      await loadQuestions()
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gagal Menyimpan Soal',
        message: error instanceof Error ? error.message : 'Cek lagi format soal.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Aksi status dipakai untuk publish/archive/restore satu soal.
  const runQuestionAction = async (questionId: string, action: 'publish' | 'archive' | 'restore') => {
    try {
      const response = await fetch(`/api/v1/admin/questions/${questionId}/${action}`, { method: 'POST' })
      if (!response.ok) throw new Error(await readAdminQuestionApiError(response))
      await loadQuestions()
      addToast({
        type: 'success',
        title: 'Status Soal Diperbarui',
        message: 'Workflow soal berhasil diproses.',
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Aksi Soal Gagal',
        message: error instanceof Error ? error.message : 'Coba lagi sebentar.',
      })
    }
  }

  return (
    <section className="px-4 py-6 pb-24 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header halaman admin questions menjaga konteks backoffice. */}
        <header className="flex flex-col gap-4 rounded-3xl border border-border bg-background p-5 sm:p-7 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-surface">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Question Management
            </p>
            <h1 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl text-headline">
              Kurasi <span className="text-primary">Bank Soal</span>
            </h1>
            <p className="mt-1 text-sm text-body">
              Login untuk membuat draft, me-review, lalu mem-publish soal berkualitas.
            </p>
          </div>
          <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-black text-primary-dark dark:text-primary">
            {total} soal ditemukan
          </div>
        </header>

        <div className="grid gap-6 items-start xl:grid-cols-[minmax(0,1fr)_420px]">
          {/* Panel list soal berisi filter dan tabel padat untuk admin content. */}
          <section className="min-w-0 rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-6 dark:bg-surface">
            <AdminQuestionFilters
              keyword={keyword}
              status={status}
              category={category}
              isLoading={isLoading}
              onKeywordChange={setKeyword}
              onStatusChange={setStatus}
              onCategoryChange={setCategory}
              onFilter={handleFilter}
            />
            <AdminQuestionTable
              questions={questions}
              onRunAction={(questionId, action) => void runQuestionAction(questionId, action)}
              onEditQuestion={handleEditQuestion}
            />
            
            <SmartPagination
              page={page}
              limit={limit}
              total={total}
              totalPages={Math.ceil(total / limit)}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              isLoading={isLoading}
            />
          </section>

          {/* Form create/edit berisi field minimum sesuai A2 MVP. */}
          <AdminQuestionForm
            form={form}
            isSaving={isSaving}
            isEditMode={editingId !== null}
            onSubmit={saveQuestion}
            onUpdateForm={updateForm}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      </div>
    </section>
  )
}
