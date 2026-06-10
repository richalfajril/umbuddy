import * as React from 'react'
import { redirect } from 'next/navigation'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminDashboardShell } from '@/features/admin-dashboard/_components/admin-dashboard-shell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await AdminAuthService.getCachedCurrentAdmin()

  // Jika tidak ada session, redirect ke halaman login
  if (!session) {
    redirect('/admin/login')
  }

  // Jika ada session, bungkus dengan persisten shell
  return (
    <AdminDashboardShell adminEmail={session.admin.email} adminRole={session.admin.role}>
      {children}
    </AdminDashboardShell>
  )
}
