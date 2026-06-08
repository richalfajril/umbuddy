import * as React from 'react'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminDashboardShell } from '@/features/admin-dashboard/_components/admin-dashboard-shell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await AdminAuthService.getCachedCurrentAdmin()

  // Jika tidak ada session, render children tanpa shell agar halaman login (/admin/login)
  // bisa tampil bersih tanpa sidebar dashboard. Proteksi rute ada di level Flow.
  if (!session) {
    return <>{children}</>
  }

  // Jika ada session, bungkus dengan persisten shell
  return (
    <AdminDashboardShell adminEmail={session.admin.email} adminRole={session.admin.role}>
      {children}
    </AdminDashboardShell>
  )
}
