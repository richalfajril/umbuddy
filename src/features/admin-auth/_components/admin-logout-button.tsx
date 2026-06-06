'use client'

import * as React from 'react'

// Tombol logout admin memakai fetch agar user tetap diarahkan rapi ke halaman login.
export function AdminLogoutButton() {
  const [isLoading, setIsLoading] = React.useState(false)

  // Logout admin memanggil endpoint khusus admin dan menghapus cookie httpOnly dari server.
  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/v1/admin/auth/logout', { method: 'POST' })
      window.location.href = '/admin/login'
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-black text-headline transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? 'Logout...' : 'Logout Admin'}
    </button>
  )
}
