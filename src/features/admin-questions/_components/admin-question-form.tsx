'use client'

import * as React from 'react'
import { Save } from 'lucide-react'
import { Button, Input, Label } from '@/components/ui'
import type {
  AdminQuestionCategory,
  AdminQuestionFormState,
} from '../_types/admin-questions.types'

type AdminQuestionFormProps = {
  form: AdminQuestionFormState
  isSaving: boolean
  onSubmit: (event: React.FormEvent) => void
  onUpdateForm: (field: keyof AdminQuestionFormState, value: string) => void
}

// Form create draft soal berisi input minimum sesuai A2 MVP.
export function AdminQuestionForm({
  form,
  isSaving,
  onSubmit,
  onUpdateForm,
}: AdminQuestionFormProps) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5 dark:bg-surface">
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
              onChange={(event) => onUpdateForm('category', event.target.value as AdminQuestionCategory)}
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
              onChange={(event) => onUpdateForm('difficulty', event.target.value)}
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
            <Input id="package-code" value={form.package_code} onChange={(event) => onUpdateForm('package_code', event.target.value)} placeholder="SKD_01" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="question-number">No</Label>
            <Input id="question-number" type="number" min={1} value={form.number} onChange={(event) => onUpdateForm('number', event.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="question-text">Pertanyaan</Label>
          <textarea id="question-text" value={form.text} onChange={(event) => onUpdateForm('text', event.target.value)} className="min-h-28 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-headline" placeholder="Tulis pertanyaan..." required />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {(['a', 'b', 'c', 'd', 'e'] as const).map((option) => (
            <div key={option} className="space-y-2">
              <Label htmlFor={`option-${option}`}>Pilihan {option.toUpperCase()}{option === 'e' ? ' (opsional)' : ''}</Label>
              <Input id={`option-${option}`} value={form[`option_${option}`]} onChange={(event) => onUpdateForm(`option_${option}`, event.target.value)} required={option !== 'e'} />
            </div>
          ))}
        </div>

        {form.category === 'TKP' ? (
          <div className="grid gap-3 sm:grid-cols-5">
            {(['a', 'b', 'c', 'd', 'e'] as const).map((option) => (
              <div key={option} className="space-y-2">
                <Label htmlFor={`tkp-${option}`}>Bobot {option.toUpperCase()}</Label>
                <Input id={`tkp-${option}`} type="number" min={1} max={5} value={form[`tkp_${option}`]} onChange={(event) => onUpdateForm(`tkp_${option}`, event.target.value)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="answer-key">Kunci Jawaban</Label>
            <select
              id="answer-key"
              value={form.answer_key}
              onChange={(event) => onUpdateForm('answer_key', event.target.value)}
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
          <textarea id="question-explanation" value={form.explanation} onChange={(event) => onUpdateForm('explanation', event.target.value)} className="min-h-28 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-headline" placeholder="Tulis pembahasan..." required />
        </div>

        {/* Submit menyimpan draft saja; publish tetap aksi eksplisit di list. */}
        <Button type="submit" className="h-14 w-full" isLoading={isSaving} loadingLabel="Menyimpan...">
          <Save className="h-5 w-5" aria-hidden="true" />
          Simpan Draft
        </Button>
      </div>
    </form>
  )
}
