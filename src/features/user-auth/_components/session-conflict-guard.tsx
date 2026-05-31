'use client'

import * as React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Button, Card } from '@/components/ui'

/**
 * Global forced-logout guard for JWT sessions revoked by `users.session_version`.
 * The modal is intentionally blocking so stale devices cannot keep using the UI
 * after the same account logs in elsewhere.
 */
export function SessionConflictGuard() {
  // Session NextAuth dibaca global untuk mendeteksi token yang sudah direvoke server.
  const { data: session, status } = useSession()
  const isRevoked = status === 'authenticated' && Boolean(session?.user?.revoked)
  const [isSigningOut, setIsSigningOut] = React.useState(false)

  // Guard tidak merender apapun selama session masih valid.
  if (!isRevoked) return null

  // Sign out paksa mengarahkan user kembali ke login dengan alasan session conflict.
  const handleSignOut = () => {
    setIsSigningOut(true)
    void signOut({ callbackUrl: '/auth/login?reason=session-conflict' })
  }

  return (
    // Modal blocking dipakai agar device lama tidak lanjut memakai UI setelah login device baru.
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="session-conflict-title"
      aria-describedby="session-conflict-description"
    >
      <Card className="w-full max-w-md border-primary/40 bg-background p-6 text-center shadow-2xl shadow-primary/10 dark:border-primary/30 dark:bg-surface">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-2xl">
          !
        </div>
        <h2 id="session-conflict-title" className="font-display text-2xl font-black text-heading">
          Akun sedang aktif di device lain
        </h2>
        <p id="session-conflict-description" className="mt-3 text-sm leading-6 text-body">
          Sesi di perangkat ini sudah ditutup karena akun Kamu login di perangkat lain.
          Masuk lagi kalau ini memang Kamu.
        </p>
        {/* CTA tunggal menghindari ambiguity: sesi lama harus ditutup sebelum lanjut. */}
        <Button
          type="button"
          className="mt-6 w-full"
          isLoading={isSigningOut}
          loadingLabel="Menutup sesi..."
          onClick={handleSignOut}
        >
          Masuk Lagi
        </Button>
      </Card>
    </div>
  )
}
