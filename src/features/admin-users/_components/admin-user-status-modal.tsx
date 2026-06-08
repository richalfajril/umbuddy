'use client'

import * as React from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'

interface AdminUserStatusModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userName: string
  currentStatus: string
  onStatusUpdated: () => void
}

export function AdminUserStatusModal({
  isOpen,
  onClose,
  userId,
  userName,
  currentStatus,
  onStatusUpdated
}: AdminUserStatusModalProps) {
  const [newStatus, setNewStatus] = React.useState(currentStatus)
  const [reason, setReason] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')

  // Sinkronisasi status saat modal dibuka dengan user berbeda
  React.useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewStatus(currentStatus)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReason('')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('')
    }
  }, [isOpen, currentStatus])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newStatus === currentStatus) {
      onClose()
      return
    }

    if (!reason.trim()) {
      setError('Alasan harus diisi untuk pencatatan audit trail.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/v1/admin/users/${userId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, reason })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal menyimpan perubahan status')
      }

      onStatusUpdated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
        <div className="border-b border-border bg-surface px-6 py-4">
          <h2 className="font-display text-xl font-black text-headline">Moderasi Akun</h2>
          <p className="mt-1 text-sm font-semibold text-muted">
            Ubah status akun untuk <span className="font-bold text-headline">{userName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-headline">
                Pilih Status Baru
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-headline transition focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
              >
                <option value="ACTIVE">ACTIVE (Aktif Normal)</option>
                <option value="PENDING_VERIFICATION">PENDING (Menunggu Verifikasi)</option>
                <option value="SUSPENDED">SUSPENDED (Ditangguhkan Sementara)</option>
                <option value="BANNED">BANNED (Diblokir Permanen)</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-headline">
                Alasan / Catatan Admin (Wajib)
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Misal: Indikasi spam, permintaan user, dsb."
                className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-headline transition focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
              <p className="mt-2 text-xs font-semibold text-muted">
                Catatan ini akan tersimpan di audit log dan User Support Notes.
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-2xl px-5 py-2.5 text-sm font-bold text-muted transition hover:bg-surface hover:text-headline disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || newStatus === currentStatus}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-2.5 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary-dark disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Simpan Perubahan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
