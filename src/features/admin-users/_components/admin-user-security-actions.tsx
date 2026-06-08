'use client'

import * as React from 'react'
import { Loader2, LogOut, ShieldAlert } from 'lucide-react'
import { useToastStore } from '@/stores/useToastStore'
import type { AdminUserSupportNote } from '../_types/admin-users.types'

interface AdminUserSecurityActionsProps {
  userId: string
  onActionSuccess: (note: AdminUserSupportNote) => void
}

export function AdminUserSecurityActions({ userId, onActionSuccess }: AdminUserSecurityActionsProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const { addToast } = useToastStore()

  const handleForceLogout = async () => {
    if (!window.confirm('PERINGATAN: Tindakan ini akan memaksa pengguna keluar dari semua perangkat yang sedang aktif. Anda yakin?')) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/force-logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Sesi pengguna dipaksa keluar oleh admin.' }),
      })

      const json = await res.json()
      
      if (!res.ok) {
        throw new Error(json.error?.message || 'Gagal melakukan force logout')
      }

      addToast({
        type: 'success',
        title: 'Force Logout Berhasil',
        message: `${json.data.revokedSessions} sesi aktif telah diakhiri.`
      })

      if (json.data.note) {
        const formattedNote = {
          id: json.data.note.id,
          category: json.data.note.category,
          note: json.data.note.note,
          admin_id: json.data.note.admin_id,
          created_at: json.data.note.created_at,
        }
        onActionSuccess(formattedNote)
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error instanceof Error ? error.message : 'Terjadi kesalahan sistem.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 shadow-sm dark:bg-surface">
      <h3 className="font-display text-lg font-black text-red-500 flex items-center gap-2">
        <ShieldAlert className="h-5 w-5" />
        Aksi Keamanan
      </h3>
      <p className="mt-2 text-xs font-semibold text-muted">
        Tindakan di bawah ini akan berdampak langsung pada sesi pengguna yang sedang aktif.
      </p>
      
      <div className="mt-4">
        <button
          onClick={handleForceLogout}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600 disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          Paksa Logout (Force Logout)
        </button>
      </div>
    </div>
  )
}
