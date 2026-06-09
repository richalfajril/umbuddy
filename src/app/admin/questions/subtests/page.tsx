import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminTaxonomyView } from '@/features/admin-question-taxonomy/_components'

export const metadata: Metadata = {
  title: 'Manajemen Subtes | Umbuddy Admin',
}

export default async function AdminSubtestsPage() {
  const admin = await AdminAuthService.getCachedCurrentAdmin()
  if (!admin) redirect('/admin/login')
  return <AdminTaxonomyView />
}
