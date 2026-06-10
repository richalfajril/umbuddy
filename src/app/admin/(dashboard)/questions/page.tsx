import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminDashboardSoalFlow } from '@/features/admin-questions-dashboard'

export const metadata: Metadata = {
  title: 'Dashboard Soal | Umbuddy Admin',
}

export default async function AdminDashboardSoalPage() {
  const session = await AdminAuthService.getCachedCurrentAdmin()
  if (!session) redirect('/admin/login')

  return <AdminDashboardSoalFlow />
}
