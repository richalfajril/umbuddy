'use client'

import { Archive, CheckCircle2, RotateCcw } from 'lucide-react'
import type { AdminQuestionListItem } from '../_types/admin-questions.types'
import { getQuestionStatusClass } from '../_utils/admin-questions.utils'

type AdminQuestionTableProps = {
  questions: AdminQuestionListItem[]
  onRunAction: (questionId: string, action: 'publish' | 'archive' | 'restore') => void
}

// Tabel list soal dipisah agar render baris dan action workflow tidak memenuhi view utama.
export function AdminQuestionTable({
  questions,
  onRunAction,
}: AdminQuestionTableProps) {
  return (
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
                      onClick={() => onRunAction(question.id, 'publish')}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-primary/30 px-2 text-xs font-black text-primary"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Publish
                    </button>
                  ) : null}
                  {question.status !== 'ARCHIVED' ? (
                    <button
                      type="button"
                      onClick={() => onRunAction(question.id, 'archive')}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-error/30 px-2 text-xs font-black text-error"
                    >
                      <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                      Archive
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRunAction(question.id, 'restore')}
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
  )
}
