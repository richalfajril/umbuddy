'use client'

import * as React from 'react'
import { AlertCircle, Eye, MoreHorizontal } from 'lucide-react'
import { AdminTable, AdminTableHeader, AdminTableHead, AdminTableBody, AdminTableRow, AdminTableCell, AdminTableTextSkeleton } from '@/components/molecules'
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
          <AdminTableHead>Paket & No</AdminTableHead>
          <AdminTableHead>Kategori</AdminTableHead>
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
                <AdminTableTextSkeleton className="w-32" />
                <div className="mt-2">
                  <AdminTableTextSkeleton className="w-14" />
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <AdminTableTextSkeleton className="w-14" />
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
              <div className="font-bold text-headline">{q.package_code}</div>
              <div className="text-xs text-muted">No. {q.number}</div>
            </AdminTableCell>
            <AdminTableCell>
              <span className="font-bold text-headline">{q.category}</span>
            </AdminTableCell>
            <AdminTableCell>
              <p className="truncate max-w-lg text-sm text-body">
                {q.text}
              </p>
            </AdminTableCell>
            <AdminTableCell>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${QUESTION_STATUS_COLORS[q.status] || ''}`}>
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
  // Dropdown lokal mencegah overlay global dan menyamakan pola aksi tabel admin.
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef<HTMLTableCellElement>(null)

  // Menutup menu aksi ketika admin klik area di luar cell.
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <AdminTableCell
      ref={ref}
      className={`sticky right-0 border-l border-border bg-background text-right shadow-[-4px_0_12px_rgba(0,0,0,0.05)] transition-colors group-hover:bg-surface/95 ${isOpen ? 'z-[60]' : 'z-10'}`}
    >
      <div className="relative flex justify-end">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-xl p-2 transition ${isOpen ? 'bg-surface text-headline' : 'text-muted hover:bg-surface hover:text-headline'}`}
          title="Aksi Lainnya"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>

        {isOpen && (
          <div className="absolute right-10 top-0 z-[70] w-44 animate-in fade-in zoom-in-95 rounded-xl border border-border bg-background p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] dark:bg-surface">
            <div className="px-3 py-1.5 text-left text-xs font-bold text-muted">Aksi</div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-primary transition hover:bg-primary/10"
            >
              <Eye className="h-4 w-4 text-primary" />
              Detail
            </button>
          </div>
        )}
      </div>
    </AdminTableCell>
  )
}
