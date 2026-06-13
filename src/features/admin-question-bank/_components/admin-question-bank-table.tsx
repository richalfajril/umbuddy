'use client'

import * as React from 'react'
import { AlertCircle, Eye, MoreHorizontal } from 'lucide-react'
import { AdminActionMenu, AdminTable, AdminTableHeader, AdminTableHead, AdminTableBody, AdminTableRow, AdminTableCell, AdminTableTextSkeleton } from '@/components/molecules'
import { QUESTION_STATUS_COLORS } from '../_constants/admin-question-bank.constants'
import type { AdminQuestion } from '../_types/admin-question-bank.types'

interface AdminQuestionBankTableProps {
  questions: AdminQuestion[]
  isLoading?: boolean
}

export function AdminQuestionBankTable({ questions, isLoading = false }: AdminQuestionBankTableProps) {
  // Empty state hanya muncul ketika refetch selesai dan tidak ada hasil.
  if (!isLoading && questions.length === 0) {
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

  // Baris skeleton menjaga tabel terasa cepat saat filter/pagination refetch.
  const loadingRows = Array.from({ length: Math.min(Math.max(questions.length, 5), 8) })

  return (
    <AdminTable>
      <AdminTableHeader>
        <tr>
          <AdminTableHead>No</AdminTableHead>
          <AdminTableHead>Paket</AdminTableHead>
          <AdminTableHead>Kategori</AdminTableHead>
          <AdminTableHead>Materi</AdminTableHead>
          <AdminTableHead>Sub-Materi</AdminTableHead>
          <AdminTableHead>Pertanyaan</AdminTableHead>
          <AdminTableHead>Status</AdminTableHead>
          <AdminTableHead className="text-right sticky right-0 bg-surface shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">Aksi</AdminTableHead>
        </tr>
      </AdminTableHeader>
      <AdminTableBody>
        {isLoading ? (
          loadingRows.map((_, index) => (
            <AdminTableRow key={`question-loading-${index}`}>
              <AdminTableCell>
                <AdminTableTextSkeleton className="w-10" />
              </AdminTableCell>
              <AdminTableCell>
                <AdminTableTextSkeleton className="w-32" />
              </AdminTableCell>
              <AdminTableCell>
                <AdminTableTextSkeleton className="w-14" />
              </AdminTableCell>
              <AdminTableCell>
                <AdminTableTextSkeleton className="w-28" />
              </AdminTableCell>
              <AdminTableCell>
                <AdminTableTextSkeleton className="w-28" />
              </AdminTableCell>
              <AdminTableCell>
                <AdminTableTextSkeleton className="w-[min(420px,60vw)] max-w-full" />
              </AdminTableCell>
              <AdminTableCell>
                <AdminTableTextSkeleton className="w-20" />
              </AdminTableCell>
              <AdminTableCell className="sticky right-0 border-l border-border bg-background/95 text-right shadow-[-4px_0_12px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                <button
                  type="button"
                  disabled
                  className="rounded-xl p-2 text-muted opacity-60"
                  title="Memuat aksi"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </AdminTableCell>
            </AdminTableRow>
          ))
        ) : questions.map((q) => (
          <AdminTableRow key={q.id}>
            <AdminTableCell>
              <span className="font-bold text-headline">{q.number}</span>
            </AdminTableCell>
            <AdminTableCell>
              <span className="font-bold text-headline">{q.package_code}</span>
            </AdminTableCell>
            <AdminTableCell>
              <span className="font-bold text-headline">{q.category}</span>
            </AdminTableCell>
            <AdminTableCell>
              <span className="text-sm font-semibold text-body">{q.material_name ?? '-'}</span>
            </AdminTableCell>
            <AdminTableCell>
              <span className="text-sm font-semibold text-body">{q.sub_material_name ?? '-'}</span>
            </AdminTableCell>
            <AdminTableCell>
              <p className="truncate max-w-lg text-sm text-body">
                {q.text}
              </p>
            </AdminTableCell>
            <AdminTableCell>
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black tracking-wider ${QUESTION_STATUS_COLORS[q.status] || ''}`}>
                {q.status}
              </span>
            </AdminTableCell>
            <QuestionActionCell />
          </AdminTableRow>
        ))}
      </AdminTableBody>
    </AdminTable>
  )
}

function QuestionActionCell() {
  // Item aksi bank soal memakai wrapper dropdown standar admin.
  const actionItems = [
    {
      label: 'Detail',
      icon: Eye,
      tone: 'default' as const,
    },
  ]

  return (
    <AdminTableCell
      className="sticky right-0 z-10 border-l border-border bg-background text-right shadow-[-4px_0_12px_rgba(0,0,0,0.05)] transition-colors group-hover:bg-surface/95"
    >
      <AdminActionMenu items={actionItems} />
    </AdminTableCell>
  )
}
