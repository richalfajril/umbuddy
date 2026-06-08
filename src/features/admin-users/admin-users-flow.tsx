import { redirect } from 'next/navigation'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminUsersService } from '@/server/admin-users/admin-users.service'
import { AdminUsersView } from './_components/admin-users-view'

// Server component penjaga otentikasi untuk fitur admin users.
export async function AdminUsersFlow() {
  const session = await AdminAuthService.getCachedCurrentAdmin()

  if (!session) {
    redirect('/admin/login')
  }

  // Pre-fetch data pertama kali agar SSR kencang (Limit default 15)
  const initialData = await AdminUsersService.listUsers({
    page: 1,
    limit: 15,
  })

  // Oper data aman ke komponen UI klien
  return <AdminUsersView initialData={initialData} />
}
