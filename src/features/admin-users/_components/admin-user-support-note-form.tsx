'use client'

import * as React from 'react'
import { Loader2, PlusCircle } from 'lucide-react'
import { useToastStore } from '@/stores/useToastStore'
import type { AdminUserSupportNote } from '../_types/admin-users.types'

interface AdminUserSupportNoteFormProps {
  userId: string
  onNoteAdded: (newNote: AdminUserSupportNote) => void
}

export function AdminUserSupportNoteForm({ userId, onNoteAdded }: AdminUserSupportNoteFormProps) {
  const [note, setNote] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const { addToast } = useToastStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (note.trim().length < 3) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      })

      const json = await res.json()
      
      if (!res.ok) {
        throw new Error(json.error?.message || 'Gagal menambahkan catatan')
      }

      onNoteAdded({
        id: json.data.id,
        category: json.data.category,
        note: json.data.note,
        admin_id: json.data.adminId,
        created_at: json.data.createdAt,
      })

      setNote('')
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Catatan moderasi berhasil ditambahkan.'
      })
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
    <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-border bg-surface p-4 shadow-sm">
      <label htmlFor="support-note" className="mb-2 block text-sm font-bold text-headline">
        Tambah Catatan Manual
      </label>
      <textarea
        id="support-note"
        rows={3}
        className="block w-full rounded-xl border border-border bg-background p-3 text-sm font-medium text-headline transition placeholder:text-muted focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
        placeholder="Tulis keluhan, pelanggaran, atau catatan moderasi di sini..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={isLoading}
        required
        minLength={3}
        maxLength={1000}
      />
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={isLoading || note.trim().length < 3}
          className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-black text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
          Tambah Catatan
        </button>
      </div>
    </form>
  )
}
