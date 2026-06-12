'use client'

import Link from 'next/link'
import { ArrowLeft, FileQuestion, AlertCircle } from 'lucide-react'
import { AdminPageHeader, AdminTableLayout } from '@/components/organisms'
import { AdminTable, AdminTableBody, AdminTableCell, AdminTableHead, AdminTableHeader, AdminTableRow } from '@/components/molecules'
import { QUESTION_STATUS_COLORS } from '@/features/admin-question-bank/_constants/admin-question-bank.constants'
import type { AdminQuestionListResponse } from '@/features/admin-question-bank/_types/admin-question-bank.types'

type AdminSubtestDetailViewProps = {
  packageCode: string
  initialData: AdminQuestionListResponse
}

// View detail subtes menampilkan soal yang tergabung dalam satu package_code.
export function AdminSubtestDetailView({
  packageCode,
  initialData,
}: AdminSubtestDetailViewProps) {
  const questions = initialData.questions

  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header sub-page memakai icon kiri sebagai tombol kembali ke daftar subtes. */}
        <AdminPageHeader
          icon={
            <Link
              href="/admin/subtests"
              prefetch
              transitionTypes={['app-nav']}
              className="grid h-full w-full place-items-center text-muted transition-colors hover:text-headline"
              aria-label="Kembali ke manajemen subtes"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          }
          eyebrow="Question Packages"
          title={<>Detail <span className="text-primary">Subtes</span></>}
          description={`Paket ${packageCode} berisi ${initialData.total.toLocaleString('id-ID')} soal.`}
          actions={
            <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-black text-primary-dark dark:text-primary">
              {initialData.total.toLocaleString('id-ID')} soal
            </div>
          }
        />

        {/* Tabel soal detail subtes memakai layout tabel admin yang konsisten. */}
        <AdminTableLayout>
          <SubtestQuestionsTable questions={questions} />
        </AdminTableLayout>
      </div>
    </section>
  )
}

function SubtestQuestionsTable({ questions }: { questions: AdminQuestionListResponse['questions'] }) {
  // Empty state menjaga detail subtes tetap jelas saat package belum memiliki soal.
  if (questions.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/50 p-8 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted/20 text-muted">
          <AlertCircle className="h-8 w-8" />
        </div>
        <p className="mt-4 font-display text-lg font-black text-headline">Belum Ada Soal</p>
        <p className="mt-1 text-sm font-semibold text-muted">
          Paket subtes ini belum memiliki soal yang bisa ditampilkan.
        </p>
      </div>
    )
  }

  return (
    <AdminTable>
      <AdminTableHeader>
        <tr>
          <AdminTableHead>No</AdminTableHead>
          <AdminTableHead>Kategori</AdminTableHead>
          <AdminTableHead>Pertanyaan</AdminTableHead>
          <AdminTableHead>Jawaban</AdminTableHead>
          <AdminTableHead>Status</AdminTableHead>
          <AdminTableHead>Terakhir Diubah</AdminTableHead>
        </tr>
      </AdminTableHeader>
      <AdminTableBody>
        {questions.map((question) => (
          <AdminTableRow key={question.id}>
            <AdminTableCell className="font-bold text-muted">
              {question.number}
            </AdminTableCell>
            <AdminTableCell>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                <FileQuestion className="h-3.5 w-3.5" />
                {question.category}
              </span>
            </AdminTableCell>
            <AdminTableCell>
              <p className="max-w-xl truncate text-sm font-semibold text-headline">
                {question.text || 'Soal belum memiliki teks.'}
              </p>
            </AdminTableCell>
            <AdminTableCell className="font-mono text-sm font-black text-headline">
              {question.answer_key || '-'}
            </AdminTableCell>
            <AdminTableCell>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${QUESTION_STATUS_COLORS[question.status] || ''}`}>
                {question.status}
              </span>
            </AdminTableCell>
            <AdminTableCell className="font-semibold text-muted">
              {new Date(question.updated_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTableBody>
    </AdminTable>
  )
}
