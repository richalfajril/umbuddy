'use client'

import * as React from 'react'
import Link from 'next/link'
import { MoreHorizontal, AlertCircle, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react'
import type { AdminUserListItem } from '../_types/admin-users.types'

interface AdminUsersTableProps {
  users: AdminUserListItem[]
  onChangeStatusClick: (userId: string, currentStatus: string, name: string) => void
}

export function AdminUsersTable({ users, onChangeStatusClick }: AdminUsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 p-8 text-center">
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
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Role / Instansi</th>
            <th className="px-6 py-4">Bergabung</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-background">
          {users.map((user) => (
            <tr key={user.id} className="transition hover:bg-surface/50">
              <td className="px-6 py-4">
                <div>
                  <p className="font-bold text-headline">{user.name}</p>
                  <p className="text-xs text-muted">{user.email}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <span className="inline-flex rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                    {user.role}
                  </span>
                  {user.profile?.target_instansi && (
                    <p className="mt-1 text-xs font-semibold text-muted max-w-[200px] truncate">
                      {user.profile.target_instansi}
                    </p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 font-semibold text-muted">
                {new Date(user.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={user.status} />
              </td>
              <td className="px-6 py-4 text-right">
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
          ))}
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
