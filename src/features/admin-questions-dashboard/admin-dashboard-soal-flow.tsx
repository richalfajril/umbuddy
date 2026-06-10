import { AdminAuthService } from '@/server/admin-auth'
import { AdminDashboardSoalService } from '@/server/admin-questions/admin-dashboard-soal.service'
import { AdminDashboardSoalView } from './_components/admin-dashboard-soal-view'
import { redirect } from 'next/navigation'

export async function AdminDashboardSoalFlow() {
  const session = await AdminAuthService.getCachedCurrentAdmin()
  if (!session) redirect('/admin/login')

  const metrics = await AdminDashboardSoalService.getMetrics(session)

  return <AdminDashboardSoalView metrics={metrics} />
}
