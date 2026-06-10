import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminTryoutsFlow } from '@/features/admin-tryouts'

export const metadata: Metadata = {
  title: 'Manajemen Try Out | Umbuddy Admin',
}

export default async function AdminTryOutsPage() {
  const session = await AdminAuthService.getCachedCurrentAdmin()
  if (!session) redirect('/admin/login')

  return <AdminTryoutsFlow />
}
