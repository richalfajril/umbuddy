'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { createPortal } from 'react-dom'
import { LogOut } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { useToastStore } from '@/stores/useToastStore'

interface LogoutButtonProps {
  className?: string
}

/**
 * Logout action with confirmation modal.
 * Kept as a small client boundary so app shell components can remain reusable.
 */
export function LogoutButton({ className = '' }: LogoutButtonProps) {
  // Router dipakai untuk mengarahkan user setelah signOut tanpa full page reload berlebih.
  const router = useRouter()
  const addToast = useToastStore((state) => state.addToast)
  // Modal confirmation mencegah logout tidak sengaja dari sidebar/bottom nav.
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSigningOut, setIsSigningOut] = React.useState(false)

  // Logout memakai redirect false agar toast sukses sempat tampil sebelum route diganti.
  const handleLogout = async () => {
    try {
      setIsSigningOut(true)
      const result = await signOut({
        redirect: false,
        callbackUrl: '/auth/login',
      })

      addToast({
        type: 'success',
        title: 'Logout berhasil',
        message: 'Sesi Kamu sudah ditutup dengan aman.',
      })

      router.replace(result.url || '/auth/login')
      router.refresh()
    } catch {
      setIsSigningOut(false)
      addToast({
        type: 'error',
        title: 'Logout gagal',
        message: 'Coba lagi sebentar ya.',
      })
    }
  }

  // Portal memastikan modal logout berada di atas dashboard meski tombol ada di sidebar.
  const modal =
    isOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/65 px-4 backdrop-blur-sm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            aria-describedby="logout-description"
          >
            <Card className="w-full max-w-sm border-error/30 bg-background p-6 text-center shadow-2xl shadow-error/10 dark:bg-surface">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/12 text-error">
                <LogOut className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 id="logout-title" className="font-display text-2xl font-black text-heading">
                Yakin mau keluar?
              </h2>
              <p id="logout-description" className="mt-3 text-sm leading-6 text-body">
                Sesi belajar Kamu akan ditutup di perangkat ini.
              </p>
              {/* Dua aksi dibuat eksplisit agar user bisa membatalkan tanpa side effect. */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                  disabled={isSigningOut}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  isLoading={isSigningOut}
                  loadingLabel="Keluar..."
                  onClick={handleLogout}
                >
                  Ya, Keluar
                </Button>
              </div>
            </Card>
          </div>,
          document.body
        )
      : null

  return (
    <>
      {/* Trigger logout tetap sederhana agar bisa dipakai di Sidebar dan navigasi lain. */}
      <button
        type="button"
        className={[
          'flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-2xl bg-surface text-[11px] font-bold text-body transition-colors',
          'hover:bg-error/10 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error',
          className,
        ].join(' ')}
        onClick={() => setIsOpen(true)}
      >
        <LogOut className="h-5 w-5" aria-hidden="true" />
        Keluar
      </button>
      {modal}
    </>
  )
}
