'use client'

import * as React from 'react'
import { AdminButton } from '@/features/admin-shared/_components/ui'

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
    <AdminButton
      type="button"
      variant="outline"
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? 'Logout...' : 'Logout Admin'}
    </AdminButton>
  )
}
