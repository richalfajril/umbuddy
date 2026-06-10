'use client'

import * as React from 'react'
import Link from 'next/link'
import { MoreHorizontal, AlertCircle, ShieldAlert, ChevronRight, CheckCircle2, Copy } from 'lucide-react'
import { useToastStore } from '@/stores/useToastStore'
import { USER_PROGRESSION_RANKS } from '@/features/shared/_constants/user-app.constants'
import type { AdminUserListItem } from '../_types/admin-users.types'

interface AdminUsersTableProps {
  users: AdminUserListItem[]
  page: number
  limit: number
  onChangeStatusClick: (userId: string, currentStatus: string, name: string) => void
}

export function AdminUsersTable({ users, page, limit, onChangeStatusClick }: AdminUsersTableProps) {
  const addToast = useToastStore(state => state.addToast)

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
    addToast({ message: 'ID tersalin ke clipboard', type: 'success' })
  }
  if (users.length === 0) {
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

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm text-body">
        <thead className="bg-surface text-xs font-black uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-4 whitespace-nowrap">No</th>
            <th className="px-4 py-4 min-w-[200px]">Nama</th>
            <th className="px-4 py-4 whitespace-nowrap">Role</th>
            <th className="px-4 py-4 whitespace-nowrap">Email</th>
            <th className="px-4 py-4 whitespace-nowrap">No HP</th>
            <th className="px-4 py-4 whitespace-nowrap">Tanggal Lahir</th>
            <th className="px-4 py-4 whitespace-nowrap">Institusi</th>
            <th className="px-4 py-4 whitespace-nowrap">Jurusan</th>
            <th className="px-4 py-4 whitespace-nowrap">Kota/Kabupaten</th>
            <th className="px-4 py-4 whitespace-nowrap">Provinsi</th>
            <th className="px-4 py-4 whitespace-nowrap">Instansi</th>
            <th className="px-4 py-4 whitespace-nowrap">Target Skor</th>
            <th className="px-4 py-4 whitespace-nowrap">Pangkat</th>
            <th className="px-4 py-4 whitespace-nowrap text-right">XP</th>
            <th className="px-4 py-4 whitespace-nowrap">Bergabung</th>
            <th className="px-4 py-4 whitespace-nowrap">Status</th>
            <th className="px-4 py-4 text-right whitespace-nowrap sticky right-0 bg-surface shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-background">
          {users.map((user, index) => {
            let rankJabatan = '-'
            let rankGolongan = ''
            if (user.progression?.total_xp) {
              const rank = USER_PROGRESSION_RANKS.slice().reverse().find(r => user.progression!.total_xp >= r.requiredXp) || USER_PROGRESSION_RANKS[0]
              rankJabatan = rank.jabatan
              rankGolongan = rank.golongan
            }

            return (
              <tr key={user.id} className="transition hover:bg-surface/50 group">
                <td className="px-4 py-4 text-muted font-medium whitespace-nowrap">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="font-bold text-headline">{user.name}</p>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-sm">
                    {user.email}
                    {user.email_verified && (
                      <span title="Email Terverifikasi" className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-muted">
                  {user.phone || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-muted">
                  {user.profile?.birth_date ? new Date(user.profile.birth_date).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  }) : '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-muted">
                  {user.profile?.institution || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-muted">
                  {user.profile?.major || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-muted">
                  {user.profile?.city || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-muted">
                  {user.profile?.province || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-muted">
                  {user.profile?.target_instansi || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-muted">
                  {user.profile?.target_score || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {user.progression ? (
                    <div>
                      <p className="font-semibold text-sm text-headline">{rankJabatan} {rankGolongan}</p>
                      <p className="text-xs text-muted mt-0.5">Lv. {user.progression.level}</p>
                    </div>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-muted font-mono text-right">
                  {user.progression ? user.progression.total_xp.toLocaleString('id-ID') : '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap font-semibold text-muted">
                  {new Date(user.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-4 py-4 text-right whitespace-nowrap sticky right-0 bg-background group-hover:bg-surface/95 transition-colors shadow-[-4px_0_12px_rgba(0,0,0,0.05)] border-l border-border">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onChangeStatusClick(user.id, user.status, user.name)}
                      className="rounded-xl p-2 text-muted transition hover:bg-surface hover:text-headline"
                      title="Ubah Status"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    <Link
                      href={`/admin/users/${user.id}`}
                      prefetch
                      transitionTypes={['app-nav']}
                      className="inline-flex items-center gap-1 rounded-xl bg-surface px-3 py-2 text-xs font-bold text-headline transition hover:bg-border"
                    >
                      Detail
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'ACTIVE') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
        <CheckCircle2 className="h-3.5 w-3.5" /> Active
      </span>
    )
  }
  
  if (status === 'SUSPENDED') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-bold text-orange-500 dark:text-orange-400">
        <ShieldAlert className="h-3.5 w-3.5" /> Suspended
      </span>
    )
  }

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
