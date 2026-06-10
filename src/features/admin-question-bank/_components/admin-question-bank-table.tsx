'use client'

import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import { AdminTable, AdminTableHeader, AdminTableHead, AdminTableBody, AdminTableRow, AdminTableCell } from '@/components/molecules'
import { Button } from '@/components/ui'
import { QUESTION_STATUS_COLORS } from '../_constants/admin-question-bank.constants'
import type { AdminQuestion } from '../_types/admin-question-bank.types'

interface AdminQuestionBankTableProps {
  questions: AdminQuestion[]
}

export function AdminQuestionBankTable({ questions }: AdminQuestionBankTableProps) {
  if (questions.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/50 p-8 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted/20 text-muted">
          <AlertCircle className="h-8 w-8" />
        </div>
        <p className="mt-4 font-display text-lg font-black text-headline">Tidak Ada Soal</p>
        <p className="mt-1 text-sm font-semibold text-muted">
          Coba sesuaikan filter pencarian untuk menemukan soal.
        </p>
      </div>
    )
  }

  return (
    <AdminTable>
      <AdminTableHeader>
        <tr>
          <AdminTableHead>Paket & No</AdminTableHead>
          <AdminTableHead>Kategori</AdminTableHead>
          <AdminTableHead>Pertanyaan</AdminTableHead>
          <AdminTableHead>Status</AdminTableHead>
          <AdminTableHead className="text-right sticky right-0 bg-surface shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">Aksi</AdminTableHead>
        </tr>
      </AdminTableHeader>
      <AdminTableBody>
        {questions.map((q) => (
          <AdminTableRow key={q.id}>
            <AdminTableCell>
              <div className="font-bold text-headline">{q.package_code}</div>
              <div className="text-xs text-muted">No. {q.number}</div>
            </AdminTableCell>
            <AdminTableCell>
              <span className="font-bold text-headline">{q.category}</span>
            </AdminTableCell>
            <AdminTableCell>
              <p className="line-clamp-2 max-w-lg text-sm text-body">
                {q.text}
              </p>
            </AdminTableCell>
            <AdminTableCell>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${QUESTION_STATUS_COLORS[q.status] || ''}`}>
                {q.status}
              </span>
            </AdminTableCell>
            <AdminTableCell className="text-right sticky right-0 bg-background/95 backdrop-blur-sm group-hover:bg-surface transition-colors">
              <Button variant="secondary" size="sm" className="rounded-lg">
                Detail
              </Button>
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTableBody>
    </AdminTable>
  )
}
