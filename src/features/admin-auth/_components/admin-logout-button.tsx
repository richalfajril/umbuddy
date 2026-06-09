'use client'

import * as React from 'react'
import { Button } from '@/components/ui'

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
    <Button
      variant="danger"
      type="button"
      onClick={handleLogout}
      isLoading={isLoading}
      loadingLabel="Logout..."
      className="w-full h-11"
    >
      Logout Admin
    </Button>
  )
}
