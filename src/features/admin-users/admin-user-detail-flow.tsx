import { redirect } from 'next/navigation'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminUsersService } from '@/server/admin-users/admin-users.service'
import { AdminUserDetailView } from './_components/admin-user-detail-view'

export async function AdminUserDetailFlow({ userId }: { userId: string }) {
  const session = await AdminAuthService.getCachedCurrentAdmin()

  if (!session) {
    redirect('/admin/login')
  }

  let userDetail
  try {
    userDetail = await AdminUsersService.getUserDetail(userId)
  } catch (error) {
    // Jika tidak ketemu, redirect kembali ke list
    console.error(error)
    redirect('/admin/users')
  }

  return <AdminUserDetailView user={userDetail} />
}
