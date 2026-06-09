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

  // Jalankan query list dan summary paralel agar halaman users tidak waterfall saat dibuka.
  const [initialData, initialSummary] = await Promise.all([
    AdminUsersService.listUsers({
      page: 1,
      limit: 15,
    }),
    AdminUsersService.getUserSummaryStats(),
  ])

  // Oper data aman ke komponen UI klien
  return <AdminUsersView initialData={initialData} initialSummary={initialSummary} />
}
