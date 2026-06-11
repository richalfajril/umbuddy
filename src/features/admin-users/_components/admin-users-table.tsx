'use client'

import * as React from 'react'
import Link from 'next/link'
import { MoreHorizontal, AlertCircle, ShieldAlert, CheckCircle2, User } from 'lucide-react'
import { AdminTable, AdminTableHeader, AdminTableHead, AdminTableBody, AdminTableRow, AdminTableCell, AdminTableTextSkeleton } from '@/components/molecules'
import { USER_PROGRESSION_RANKS } from '@/features/shared/_constants/user-app.constants'
import type { AdminUserListItem } from '../_types/admin-users.types'

interface AdminUsersTableProps {
  users: AdminUserListItem[]
  page: number
  limit: number
  isLoading?: boolean
  onChangeStatusClick: (userId: string, currentStatus: string, name: string) => void
}

export function AdminUsersTable({ users, page, limit, isLoading = false, onChangeStatusClick }: AdminUsersTableProps) {
  // Empty state hanya muncul setelah request selesai dan tidak ada pengguna.
  if (!isLoading && users.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/50 p-8 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted/20 text-muted">
          <AlertCircle className="h-8 w-8" />
        </div>
        <p className="mt-4 font-display text-lg font-black text-headline">Tidak Ada Data</p>
        <p className="mt-1 text-sm font-semibold text-muted">
          Coba sesuaikan filter pencarian atau rentang data.
        </p>
      </div>
    )
  }

  // Baris skeleton menjaga layout tabel stabil saat refetch data pengguna.
  const loadingRows = Array.from({ length: Math.min(Math.max(users.length, 5), 8) })

  return (
    <AdminTable>
      <AdminTableHeader>
        <tr>
          <AdminTableHead>No</AdminTableHead>
          <AdminTableHead className="min-w-[200px]">Nama</AdminTableHead>
          <AdminTableHead>Role</AdminTableHead>
          <AdminTableHead>Email</AdminTableHead>
          <AdminTableHead>No HP</AdminTableHead>
          <AdminTableHead>Tanggal Lahir</AdminTableHead>
          <AdminTableHead>Institusi</AdminTableHead>
          <AdminTableHead>Jurusan</AdminTableHead>
          <AdminTableHead>Kota/Kabupaten</AdminTableHead>
          <AdminTableHead>Provinsi</AdminTableHead>
          <AdminTableHead>Instansi</AdminTableHead>
          <AdminTableHead>Target Skor</AdminTableHead>
          <AdminTableHead>Pangkat</AdminTableHead>
          <AdminTableHead className="text-right min-w-[140px]">XP</AdminTableHead>
          <AdminTableHead>Bergabung</AdminTableHead>
          <AdminTableHead>Status</AdminTableHead>
          <AdminTableHead className="text-right sticky right-0 bg-surface shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">Aksi</AdminTableHead>
        </tr>
      </AdminTableHeader>
      <AdminTableBody>
        {isLoading ? (
          loadingRows.map((_, index) => (
            <AdminTableRow key={`user-loading-${index}`}>
              {Array.from({ length: 16 }).map((__, cellIndex) => (
                <AdminTableCell key={`user-loading-${index}-${cellIndex}`}>
                  <AdminTableTextSkeleton className={cellIndex === 1 ? 'w-36' : cellIndex === 3 ? 'w-44' : 'w-20'} />
                </AdminTableCell>
              ))}
              <AdminTableCell className="sticky right-0 border-l border-border bg-background text-right shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">
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
        ) : users.map((user, index) => {
          const rankJabatan = user.progression ? USER_PROGRESSION_RANKS.find(r => user.progression!.total_xp >= r.requiredXp)?.jabatan || 'Pemula' : '-'
          const rankGolongan = user.progression ? USER_PROGRESSION_RANKS.find(r => user.progression!.total_xp >= r.requiredXp)?.golongan || 'I/a' : '-'

          return (
            <AdminTableRow key={user.id}>
              <AdminTableCell className="text-muted font-medium">
                {(page - 1) * limit + index + 1}
              </AdminTableCell>
              <AdminTableCell>
                <div>
                  <p className="font-bold text-headline">{user.name}</p>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <span className="inline-flex rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                  {user.role}
                </span>
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex items-center gap-1.5 text-sm">
                  {user.email}
                  {user.email_verified && (
                    <span title="Email Terverifikasi" className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </span>
                  )}
                </div>
              </AdminTableCell>
              <AdminTableCell className="text-muted">
                {user.phone || '-'}
              </AdminTableCell>
              <AdminTableCell className="text-muted">
                {user.profile?.birth_date ? new Date(user.profile.birth_date).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'short', year: 'numeric'
                }) : '-'}
              </AdminTableCell>
              <AdminTableCell className="text-muted">
                {user.profile?.institution || '-'}
              </AdminTableCell>
              <AdminTableCell className="text-muted">
                {user.profile?.major || '-'}
              </AdminTableCell>
              <AdminTableCell className="text-muted">
                {user.profile?.city || '-'}
              </AdminTableCell>
              <AdminTableCell className="text-muted">
                {user.profile?.province || '-'}
              </AdminTableCell>
              <AdminTableCell className="text-muted">
                {user.profile?.target_instansi || '-'}
              </AdminTableCell>
              <AdminTableCell className="text-muted">
                {user.profile?.target_score || '-'}
              </AdminTableCell>
              <AdminTableCell>
                {user.progression ? (
                  <div>
                    <p className="font-semibold text-sm text-headline">{rankJabatan} {rankGolongan}</p>
                  </div>
                ) : (
                  <span className="text-muted">-</span>
                )}
              </AdminTableCell>
              <AdminTableCell className="text-muted font-mono text-right">
                {user.progression ? user.progression.total_xp.toLocaleString('id-ID') : '-'}
              </AdminTableCell>
              <AdminTableCell className="font-semibold text-muted">
                {new Date(user.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </AdminTableCell>
              <AdminTableCell>
                <StatusBadge status={user.status} />
              </AdminTableCell>
              <ActionCell user={user} onChangeStatusClick={onChangeStatusClick} />
            </AdminTableRow>
          )
        })}
        {!isLoading && limit > users.length && Array.from({ length: limit - users.length }).map((_, i) => (
          <AdminTableRow key={`empty-${i}`} className="h-[65px] hover:bg-transparent">
            <AdminTableCell colSpan={17} className="text-transparent border-0">&nbsp;</AdminTableCell>
          </AdminTableRow>
        ))}
      </AdminTableBody>
    </AdminTable>
  )
}

function ActionCell({ 
  user, 
  onChangeStatusClick 
}: { 
  user: AdminUserListItem
  onChangeStatusClick: (userId: string, currentStatus: string, name: string) => void 
}) {
  // State dropdown lokal menjaga menu aksi tidak memengaruhi baris lain.
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef<HTMLTableCellElement>(null)

  // Menutup dropdown saat klik di luar cell aksi.
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <AdminTableCell 
      ref={ref}
      className={`text-right sticky right-0 bg-background group-hover:bg-surface/95 transition-colors shadow-[-4px_0_12px_rgba(0,0,0,0.05)] border-l border-border ${isOpen ? 'z-[60]' : 'z-10'}`}
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
          <div className="absolute right-10 top-0 w-44 animate-in fade-in zoom-in-95 rounded-xl border border-border bg-background p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-[70]">
            <div className="px-3 py-1.5 text-xs font-bold text-muted text-left">Aksi</div>
            <button
              onClick={() => {
                setIsOpen(false)
                onChangeStatusClick(user.id, user.status, user.name)
              }}
              className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-amber-600 dark:text-amber-500 transition hover:bg-amber-500/10"
            >
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              Moderasi
            </button>
            <Link
              href={`/admin/users/${user.id}`}
              onClick={() => setIsOpen(false)}
              prefetch
              transitionTypes={['app-nav']}
              className="group flex w-full items-center gap-2.5 mt-1 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-primary transition hover:bg-primary/10"
            >
              <User className="h-4 w-4 text-primary" />
              Detail akun
            </Link>
          </div>
        )}
      </div>
    </AdminTableCell>
  )
}

function StatusBadge({ status }: { status: string }) {
  // Status aktif diberi aksen hijau agar cepat dikenali admin.
  if (status === 'ACTIVE') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
        <CheckCircle2 className="h-3.5 w-3.5" /> Active
      </span>
    )
  }
  
  // Status suspend menandai akun yang perlu moderasi lanjutan.
  if (status === 'SUSPENDED') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-bold text-orange-500 dark:text-orange-400">
        <ShieldAlert className="h-3.5 w-3.5" /> Suspended
      </span>
    )
  }

  // Status banned diberi warna bahaya untuk keputusan moderasi final.
  if (status === 'BANNED') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-500 dark:text-red-400">
        <AlertCircle className="h-3.5 w-3.5" /> Banned
      </span>
    )
  }

  // Pending
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-bold text-muted">
      Pending
    </span>
  )
}
