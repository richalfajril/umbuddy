'use client'

import * as React from 'react'
import { Loader2, LogOut, ShieldAlert, MailWarning } from 'lucide-react'
import { useToastStore } from '@/stores/useToastStore'
import type { AdminUserSupportNote } from '../_types/admin-users.types'

interface AdminUserSecurityActionsProps {
  userId: string
  onActionSuccess: (note: AdminUserSupportNote) => void
}

export function AdminUserSecurityActions({ userId, onActionSuccess }: AdminUserSecurityActionsProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isResetLoading, setIsResetLoading] = React.useState(false)
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

  const handleTriggerResetPassword = async () => {
    if (!window.confirm('Kirim tautan reset password ke email pengguna? Ini akan menggunakan kuota email sistem.')) return

    setIsResetLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Admin memicu pengiriman tautan reset password ke email pengguna.' }),
      })

      const json = await res.json()
      
      if (!res.ok) {
        throw new Error(json.error?.message || 'Gagal mengirim email reset password')
      }

      addToast({
        type: 'success',
        title: 'Email Terkirim',
        message: 'Tautan reset password berhasil dikirim ke pengguna.'
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
      setIsResetLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 shadow-sm dark:bg-surface">
      <h3 className="font-display text-lg font-black text-red-500 flex items-center gap-2">
        <ShieldAlert className="h-5 w-5" />
        Aksi Keamanan
      </h3>
      <p className="mt-2 text-xs font-semibold text-muted">
        Gunakan dengan hati-hati. Tindakan di bawah ini berdampak langsung pada sesi dan kredensial pengguna.
      </p>
      
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={handleForceLogout}
          disabled={isLoading || isResetLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600 disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          Paksa Logout (Force Logout)
        </button>

        <button
          onClick={handleTriggerResetPassword}
          disabled={isLoading || isResetLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500/10 border border-orange-500/20 px-4 py-2 text-sm font-bold text-orange-500 transition hover:bg-orange-500/20 disabled:pointer-events-none disabled:opacity-50"
        >
          {isResetLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailWarning className="h-4 w-4" />}
          Kirim Link Reset Password
        </button>
      </div>
    </div>
  )
}
