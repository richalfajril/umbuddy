'use client'

import * as React from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { useToastStore } from '@/stores/useToastStore'
import type { AdminUserSupportNote } from '../_types/admin-users.types'

interface AdminUserVerificationActionsProps {
  userId: string
  isEmailVerified: boolean
  onVerified: (newStatus: string, note: AdminUserSupportNote | null) => void
}

export function AdminUserVerificationActions({ userId, isEmailVerified, onVerified }: AdminUserVerificationActionsProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const { addToast } = useToastStore()

  if (isEmailVerified) return null

  const handleVerify = async () => {
    if (!window.confirm('Verifikasi email pengguna ini secara manual? Status pengguna akan menjadi ACTIVE jika masih pending.')) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Email diverifikasi manual oleh admin.' }),
      })

      const json = await res.json()
      
      if (!res.ok) {
        throw new Error(json.error?.message || 'Gagal memverifikasi email')
      }

      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Email berhasil diverifikasi secara manual.'
      })

      // Jika ada note baru yang dibuat server, format ke SupportNote
      let formattedNote = null
      if (json.data.note) {
        formattedNote = {
          id: json.data.note.id,
          category: json.data.note.category,
          note: json.data.note.note,
          admin_id: json.data.note.admin_id,
          created_at: json.data.note.created_at,
        }
      }

      onVerified(json.data.status, formattedNote)
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gagal',
        message: error instanceof Error ? error.message : 'Silakan coba lagi.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleVerify}
      disabled={isLoading}
      className="mt-2 inline-flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary/10 border border-primary/20 disabled:pointer-events-none disabled:opacity-50"
    >
      {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
      Verifikasi Email Manual
    </button>
  )
}
