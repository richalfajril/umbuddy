'use client'

import { AlertCircle, Archive, CheckCircle2, Eye, MoreHorizontal, Pencil } from 'lucide-react'
import { AdminActionMenu, AdminTable, AdminTableBody, AdminTableCell, AdminTableHead, AdminTableHeader, AdminTableRow, AdminTableTextSkeleton } from '@/components/molecules'
import type { SubtestPackage } from '../_types/admin-subtests.types'

type AdminSubtestsTableProps = {
  isLoading: boolean
  page: number
  limit: number
  filteredCount: number
  subtests: SubtestPackage[]
  onDeleteClick: (subtest: SubtestPackage) => void
  onPublishClick: (subtest: SubtestPackage) => void
}

// Tabel subtes menampilkan paket soal, jumlah soal, tanggal, dan aksi admin.
export function AdminSubtestsTable({
  isLoading,
  page,
  limit,
  filteredCount,
  subtests,
  onDeleteClick,
  onPublishClick,
}: AdminSubtestsTableProps) {
  // Loading skeleton hanya mengganti teks/list, bukan card atau tombol utama.
  const loadingRows = Array.from({ length: Math.min(Math.max(subtests.length, 5), 8) })

  if (!isLoading && filteredCount === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/50 p-8 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted/20 text-muted">
          <AlertCircle className="h-8 w-8" />
        </div>
        <p className="mt-4 font-display text-lg font-black text-headline">Belum Ada Subtes</p>
        <p className="mt-1 text-sm font-semibold text-muted">
          Coba sesuaikan pencarian atau tambahkan paket subtes baru.
        </p>
      </div>
    )
  }

  return (
    <AdminTable>
      <AdminTableHeader>
        <tr>
          <AdminTableHead>No</AdminTableHead>
          <AdminTableHead>Nama Subtes / Paket</AdminTableHead>
          <AdminTableHead>Kategori</AdminTableHead>
          <AdminTableHead>Status</AdminTableHead>
          <AdminTableHead>Total Soal</AdminTableHead>
          <AdminTableHead>Tanggal Dibuat</AdminTableHead>
          <AdminTableHead>Terakhir Diubah</AdminTableHead>
          <AdminTableHead className="sticky right-0 bg-surface text-right shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">Aksi</AdminTableHead>
        </tr>
      </AdminTableHeader>
      <AdminTableBody>
        {isLoading ? (
          loadingRows.map((_, index) => (
            <AdminTableRow key={`subtest-loading-${index}`}>
              <AdminTableCell><AdminTableTextSkeleton className="w-8" /></AdminTableCell>
              <AdminTableCell><AdminTableTextSkeleton className="w-40" /></AdminTableCell>
              <AdminTableCell><AdminTableTextSkeleton className="w-16" /></AdminTableCell>
              <AdminTableCell><AdminTableTextSkeleton className="w-20" /></AdminTableCell>
              <AdminTableCell><AdminTableTextSkeleton className="w-20" /></AdminTableCell>
              <AdminTableCell><AdminTableTextSkeleton className="w-24" /></AdminTableCell>
              <AdminTableCell><AdminTableTextSkeleton className="w-24" /></AdminTableCell>
              <AdminTableCell className="sticky right-0 border-l border-border bg-background text-right shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">
                <button type="button" disabled className="rounded-xl p-2 text-muted opacity-60" title="Memuat aksi">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </AdminTableCell>
            </AdminTableRow>
          ))
        ) : (
          subtests.map((st, i) => (
            <AdminTableRow key={st.id}>
              <AdminTableCell className="font-medium text-muted">{((page - 1) * limit) + i + 1}</AdminTableCell>
              <AdminTableCell className="font-bold text-headline">{st.packageCode}</AdminTableCell>
              <AdminTableCell>
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                  {st.category}
                </span>
              </AdminTableCell>
              <AdminTableCell>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black tracking-wider ${
                  st.status === 'PUBLISHED'
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-muted/30 bg-muted/10 text-muted'
                }`}>
                  {st.status === 'PUBLISHED' ? 'Published' : 'Archived'}
                </span>
              </AdminTableCell>
              <AdminTableCell className="text-muted">{st.totalQuestions} Soal</AdminTableCell>
              <AdminTableCell className="text-muted">
                {new Date(st.createdAt).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </AdminTableCell>
              <AdminTableCell className="text-muted">
                {new Date(st.updatedAt).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </AdminTableCell>
              <SubtestActionCell subtest={st} onDeleteClick={onDeleteClick} onPublishClick={onPublishClick} />
            </AdminTableRow>
          ))
        )}
        {!isLoading && filteredCount > 0 && limit > subtests.length && (
          Array.from({ length: limit - subtests.length }).map((_, i) => (
            <AdminTableRow key={`empty-${i}`} className="h-[65px] hover:bg-transparent">
              <AdminTableCell colSpan={8} className="border-0 text-transparent">&nbsp;</AdminTableCell>
            </AdminTableRow>
          ))
        )}
      </AdminTableBody>
    </AdminTable>
  )
}

function SubtestActionCell({
  subtest,
  onDeleteClick,
  onPublishClick,
}: {
  subtest: SubtestPackage
  onDeleteClick: (subtest: SubtestPackage) => void
  onPublishClick: (subtest: SubtestPackage) => void
}) {
  // Item aksi subtes memakai wrapper dropdown standar admin.
  const actionItems = [
    {
      label: 'Detail',
      icon: Eye,
      tone: 'default' as const,
      href: `/admin/subtests/${encodeURIComponent(subtest.packageCode)}`,
    },
    {
      label: 'Edit',
      icon: Pencil,
      tone: 'warning' as const,
      href: `/admin/subtests/${encodeURIComponent(subtest.packageCode)}/edit`,
    },
    ...(subtest.status === 'PUBLISHED' ? [{
      label: 'Arsipkan',
      icon: Archive,
      tone: 'danger' as const,
      onClick: () => onDeleteClick(subtest),
    }] : [{
      label: 'Publikasi',
      icon: CheckCircle2,
      tone: 'primary' as const,
      onClick: () => onPublishClick(subtest),
    }]),
  ]

  return (
    <AdminTableCell
      className="sticky right-0 z-10 border-l border-border bg-background text-right shadow-[-4px_0_12px_rgba(0,0,0,0.05)] transition-colors group-hover:bg-surface/95"
    >
      <AdminActionMenu items={actionItems} />
    </AdminTableCell>
  )
}
