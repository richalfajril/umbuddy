'use client'

import * as React from 'react'
import { Button } from '@/components/ui'
import { ADMIN_AUTH_ROUTES } from '../_constants/admin-auth.constants'
import { logoutAdmin } from '../_services/admin-auth.service'

// Tombol logout admin memakai fetch agar user tetap diarahkan rapi ke halaman login.
export function AdminLogoutButton() {
  const [isLoading, setIsLoading] = React.useState(false)

  // Logout admin memanggil endpoint khusus admin dan menghapus cookie httpOnly dari server.
  const handleLogout = async () => {
    setIsLoading(true)
    try {
      // Logout admin dibungkus service agar endpoint tetap konsisten dengan fitur admin-auth.
      await logoutAdmin()
      window.location.href = ADMIN_AUTH_ROUTES.login
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
