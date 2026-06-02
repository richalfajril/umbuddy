import { redirect } from 'next/navigation'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminDashboardView } from './_components'

// Flow dashboard admin menjaga guard session sebelum render layout backoffice.
export async function AdminDashboardFlow() {
  const session = await AdminAuthService.getCurrentAdmin()

  if (!session) {
    redirect('/admin/login')
  }

  // Session publik admin dikirim ke view tanpa token atau data sensitif.
  return <AdminDashboardView admin={session.admin} />
}
