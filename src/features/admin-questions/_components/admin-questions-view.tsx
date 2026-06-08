'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminDashboardShell } from '@/features/admin-dashboard/_components/admin-dashboard-shell'
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
import { AdminQuestionTable } from './admin-question-table'

type AdminQuestionsViewProps = {
  initialQuestions: AdminQuestionListItem[]
  initialTotal: number
  adminEmail: string
  adminRole: string
}

// UI utama A2 MVP untuk list dan create draft question.
export function AdminQuestionsView({
  initialQuestions,
  initialTotal,
  adminEmail,
  adminRole,
}: AdminQuestionsViewProps) {
  // State list, filter, dan form dikelola lokal agar MVP tetap cepat.
  const [questions, setQuestions] = React.useState(initialQuestions)
  const [total, setTotal] = React.useState(initialTotal)
  const [status, setStatus] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [keyword, setKeyword] = React.useState('')
  const [form, setForm] = React.useState<AdminQuestionFormState>(initialAdminQuestionForm)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const { addToast } = useToastStore()

  // Helper update field form agar input tetap controlled dan ringkas.
  const updateForm = (field: keyof AdminQuestionFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  // Fetch list soal memakai filter admin saat ini.
  const loadQuestions = React.useCallback(async () => {
    setIsLoading(true)
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (category) params.set('category', category)
    if (keyword.trim()) params.set('keyword', keyword.trim())

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
  }, [addToast, category, keyword, status])

  // Submit create draft mengirim payload sesuai kontrak admin questions.
  const createDraft = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/v1/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildAdminQuestionPayload(form)),
      })

      if (!response.ok) throw new Error(await readAdminQuestionApiError(response))

      setForm(initialAdminQuestionForm)
      addToast({
        type: 'success',
        title: 'Draft Soal Tersimpan',
        message: 'Soal masuk Draft dan siap direview sebelum publish.',
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
    <AdminDashboardShell adminEmail={adminEmail} adminRole={adminRole}>
      <section className="min-h-screen bg-background px-4 py-6 text-headline sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header halaman admin questions menjaga konteks backoffice dan akses balik. */}
          <header className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-surface">
            <div>
              <Link href="/admin/dashboard" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-black text-primary hover:underline">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Kembali ke Admin
              </Link>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.22em] text-primary">
                Question Management
              </p>
              <h1 className="mt-1 text-2xl font-black text-headline">
                Kurasi <span className="text-primary">Bank Soal</span>
              </h1>
              <p className="mt-1 text-sm text-body">
                Login sebagai {adminEmail} ({adminRole}). Buat draft, review, lalu publish soal berkualitas.
              </p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-black text-primary-dark dark:text-primary">
              {total} soal ditemukan
            </div>
          </header>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            {/* Panel list soal berisi filter dan tabel padat untuk admin content. */}
            <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5 dark:bg-surface">
              <AdminQuestionFilters
                keyword={keyword}
                status={status}
                category={category}
                isLoading={isLoading}
                onKeywordChange={setKeyword}
                onStatusChange={setStatus}
                onCategoryChange={setCategory}
                onFilter={() => void loadQuestions()}
              />
              <AdminQuestionTable
                questions={questions}
                onRunAction={(questionId, action) => void runQuestionAction(questionId, action)}
              />
            </section>

            {/* Form create draft berisi field minimum sesuai A2 MVP. */}
            <AdminQuestionForm
              form={form}
              isSaving={isSaving}
              onSubmit={createDraft}
              onUpdateForm={updateForm}
            />
          </div>
        </div>
      </section>
    </AdminDashboardShell>
  )
}
