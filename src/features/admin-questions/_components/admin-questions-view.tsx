'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Archive, CheckCircle2, RotateCcw, Save, Search } from 'lucide-react'
import { Button, Input, Label } from '@/components/ui'
import { AdminDashboardShell } from '@/features/admin-dashboard/_components'
import { useToastStore } from '@/stores/useToastStore'
import {
  adminQuestionCategoryFilters,
  adminQuestionStatusFilters,
  initialAdminQuestionForm,
} from '../_constants/admin-questions.constants'
import type {
  AdminQuestionCategory,
  AdminQuestionFormState,
  AdminQuestionListItem,
  AdminQuestionsResponse,
} from '../_types/admin-questions.types'
import {
  buildAdminQuestionPayload,
  getQuestionStatusClass,
  readAdminQuestionApiError,
} from '../_utils/admin-questions.utils'

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
        <header className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
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
          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <Input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Cari teks atau kode paket"
                  className="pl-10"
                />
              </div>
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-[44px] rounded-xl border border-border bg-background px-3 text-sm font-bold text-headline">
                {adminQuestionStatusFilters.map((item) => (
                  <option key={item.label} value={item.value}>{item.label}</option>
                ))}
              </select>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="min-h-[44px] rounded-xl border border-border bg-background px-3 text-sm font-bold text-headline">
                {adminQuestionCategoryFilters.map((item) => (
                  <option key={item.label} value={item.value}>{item.label}</option>
                ))}
              </select>
              <Button type="button" variant="secondary" isLoading={isLoading} onClick={() => void loadQuestions()}>
                Filter
              </Button>
            </div>

            {/* Tabel dibuat overflow-x agar teks panjang tetap aman di layar kecil. */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.12em] text-muted">
                  <tr className="border-b border-border">
                    <th className="py-3 pr-3">Paket</th>
                    <th className="py-3 pr-3">No</th>
                    <th className="py-3 pr-3">Kategori</th>
                    <th className="py-3 pr-3">Pertanyaan</th>
                    <th className="py-3 pr-3">Status</th>
                    <th className="py-3 pr-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question) => (
                    <tr key={question.id} className="border-b border-border/70 align-top">
                      <td className="py-4 pr-3 font-black">{question.package_code}</td>
                      <td className="py-4 pr-3 font-bold">{question.number}</td>
                      <td className="py-4 pr-3 font-black text-primary">{question.category}</td>
                      <td className="max-w-md py-4 pr-3 text-body">
                        <p className="line-clamp-2">{question.text}</p>
                        <p className="mt-1 text-xs font-bold text-muted">
                          Difficulty: {question.difficulty ?? '-'} · Kunci: {question.answer_key ?? 'TKP'}
                        </p>
                      </td>
                      <td className="py-4 pr-3">
                        <span className={['inline-flex rounded-full border px-3 py-1 text-xs font-black', getQuestionStatusClass(question.status)].join(' ')}>
                          {question.status}
                        </span>
                      </td>
                      <td className="py-4 pr-3">
                        <div className="flex flex-wrap gap-2">
                          {question.status === 'DRAFT' || question.status === 'FLAGGED' ? (
                            <button
                              type="button"
                              onClick={() => void runQuestionAction(question.id, 'publish')}
                              className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-primary/30 px-2 text-xs font-black text-primary"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                              Publish
                            </button>
                          ) : null}
                          {question.status !== 'ARCHIVED' ? (
                            <button
                              type="button"
                              onClick={() => void runQuestionAction(question.id, 'archive')}
                              className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-error/30 px-2 text-xs font-black text-error"
                            >
                              <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                              Archive
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => void runQuestionAction(question.id, 'restore')}
                              className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-xp/40 px-2 text-xs font-black text-xp-dark"
                            >
                              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                              Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty state sederhana untuk filter yang belum menemukan data. */}
              {questions.length === 0 ? (
                <div className="py-12 text-center text-sm font-bold text-muted">
                  Belum ada soal pada filter ini.
                </div>
              ) : null}
            </div>
          </section>

          {/* Form create draft berisi field minimum sesuai A2 MVP. */}
          <form onSubmit={createDraft} className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Create Draft
            </p>
            <h2 className="mt-1 text-xl font-black text-headline">
              Tambah Soal Baru
            </h2>

            <div className="mt-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="question-category">Kategori</Label>
                  <select
                    id="question-category"
                    value={form.category}
                    onChange={(event) => updateForm('category', event.target.value as AdminQuestionCategory)}
                    className="min-h-[44px] w-full rounded-xl border border-border bg-background px-3 text-sm font-bold text-headline"
                  >
                    <option value="TWK">TWK</option>
                    <option value="TIU">TIU</option>
                    <option value="TKP">TKP</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="question-difficulty">Difficulty</Label>
                  <select
                    id="question-difficulty"
                    value={form.difficulty}
                    onChange={(event) => updateForm('difficulty', event.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-border bg-background px-3 text-sm font-bold text-headline"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                <div className="space-y-2">
                  <Label htmlFor="package-code">Kode Paket</Label>
                  <Input id="package-code" value={form.package_code} onChange={(event) => updateForm('package_code', event.target.value)} placeholder="SKD_01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="question-number">No</Label>
                  <Input id="question-number" type="number" min={1} value={form.number} onChange={(event) => updateForm('number', event.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question-text">Pertanyaan</Label>
                <textarea id="question-text" value={form.text} onChange={(event) => updateForm('text', event.target.value)} className="min-h-28 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-headline" placeholder="Tulis pertanyaan..." required />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {(['a', 'b', 'c', 'd', 'e'] as const).map((option) => (
                  <div key={option} className="space-y-2">
                    <Label htmlFor={`option-${option}`}>Pilihan {option.toUpperCase()}{option === 'e' ? ' (opsional)' : ''}</Label>
                    <Input id={`option-${option}`} value={form[`option_${option}`]} onChange={(event) => updateForm(`option_${option}`, event.target.value)} required={option !== 'e'} />
                  </div>
                ))}
              </div>

              {form.category === 'TKP' ? (
                <div className="grid gap-3 sm:grid-cols-5">
                  {(['a', 'b', 'c', 'd', 'e'] as const).map((option) => (
                    <div key={option} className="space-y-2">
                      <Label htmlFor={`tkp-${option}`}>Bobot {option.toUpperCase()}</Label>
                      <Input id={`tkp-${option}`} type="number" min={1} max={5} value={form[`tkp_${option}`]} onChange={(event) => updateForm(`tkp_${option}`, event.target.value)} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="answer-key">Kunci Jawaban</Label>
                  <select
                    id="answer-key"
                    value={form.answer_key}
                    onChange={(event) => updateForm('answer_key', event.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-border bg-background px-3 text-sm font-bold text-headline"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="question-explanation">Pembahasan</Label>
                <textarea id="question-explanation" value={form.explanation} onChange={(event) => updateForm('explanation', event.target.value)} className="min-h-28 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-headline" placeholder="Tulis pembahasan..." required />
              </div>

              {/* Submit menyimpan draft saja; publish tetap aksi eksplisit di list. */}
              <Button type="submit" className="h-14 w-full" isLoading={isSaving} loadingLabel="Menyimpan...">
                <Save className="h-5 w-5" aria-hidden="true" />
                Simpan Draft
              </Button>
            </div>
          </form>
        </div>
      </div>
      </section>
    </AdminDashboardShell>
  )
}
