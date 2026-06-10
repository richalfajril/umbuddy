'use client'

import { Archive, CheckCircle2, RotateCcw, Pencil } from 'lucide-react'
import type { AdminQuestionListItem } from '../_types/admin-questions.types'
import { getQuestionStatusClass } from '../_utils/admin-questions.utils'
import { AdminTable, AdminTableHeader, AdminTableHead, AdminTableBody, AdminTableRow, AdminTableCell } from '@/components/molecules'

type AdminQuestionTableProps = {
  questions: AdminQuestionListItem[]
  limit: number
  onRunAction: (questionId: string, action: 'publish' | 'archive' | 'restore') => void
  onEditQuestion: (question: AdminQuestionListItem) => void
}

// Tabel list soal dipisah agar render baris dan action workflow tidak memenuhi view utama.
export function AdminQuestionTable({
  questions,
  limit,
  onRunAction,
  onEditQuestion,
}: AdminQuestionTableProps) {
  return (
    <div className="mt-5">
      <AdminTable>
        <AdminTableHeader>
          <tr>
            <AdminTableHead>Paket</AdminTableHead>
            <AdminTableHead>No</AdminTableHead>
            <AdminTableHead>Kategori</AdminTableHead>
            <AdminTableHead>Pertanyaan</AdminTableHead>
            <AdminTableHead>Status</AdminTableHead>
            <AdminTableHead>Aksi</AdminTableHead>
          </tr>
        </AdminTableHeader>
        <AdminTableBody>
          {questions.map((question) => (
            <AdminTableRow key={question.id} className="align-top">
              <AdminTableCell className="font-black text-headline">{question.package_code}</AdminTableCell>
              <AdminTableCell className="font-bold">{question.number}</AdminTableCell>
              <AdminTableCell className="font-black text-primary">{question.category}</AdminTableCell>
              <AdminTableCell className="max-w-md text-body">
                <p className="line-clamp-2">{question.text}</p>
                <p className="mt-1 text-xs font-bold text-muted">
                  Difficulty: {question.difficulty ?? '-'} · Kunci: {question.answer_key ?? 'TKP'}
                </p>
              </AdminTableCell>
              <AdminTableCell>
                <span className={['inline-flex rounded-full border px-3 py-1 text-xs font-black', getQuestionStatusClass(question.status)].join(' ')}>
                  {question.status}
                </span>
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex flex-wrap gap-2">
                  {question.status === 'DRAFT' && (
                    <button
                      type="button"
                      onClick={() => onEditQuestion(question)}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-muted/30 px-2 text-xs font-black text-headline transition hover:bg-muted/5"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </button>
                  )}

                  {question.status === 'PUBLISHED' ? (
                    <button
                      type="button"
                      onClick={() => onRunAction(question.id, 'archive')}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-red-500/30 px-2 text-xs font-black text-red-500 transition hover:bg-red-500/10"
                    >
                      <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                      Arsip
                    </button>
                  ) : question.status === 'ARCHIVED' ? (
                    <button
                      type="button"
                      onClick={() => onRunAction(question.id, 'restore')}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-muted/30 px-2 text-xs font-black text-headline transition hover:bg-muted/5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      Restore
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRunAction(question.id, 'publish')}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-green-500/30 px-2 text-xs font-black text-green-600 transition hover:bg-green-500/10"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Publish
                    </button>
                  )}
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
          {limit > questions.length && Array.from({ length: limit - questions.length }).map((_, i) => (
            <AdminTableRow key={`empty-${i}`} className="h-[65px] hover:bg-transparent">
              <AdminTableCell colSpan={6} className="text-transparent border-0">&nbsp;</AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>

      {/* Empty state sederhana untuk filter yang belum menemukan data. */}
      {questions.length === 0 ? (
        <div className="py-12 text-center text-sm font-bold text-muted">
          Belum ada soal pada filter ini.
        </div>
      ) : null}
    </div>
  )
}
