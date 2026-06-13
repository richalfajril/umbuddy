import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminSyncFlow } from '@/features/admin-sync/admin-sync-flow'

export const metadata: Metadata = {
  title: 'Manajemen Subtes | Umbuddy Admin',
}

export default async function AdminSyncPage() {
  // Menjaga halaman sinkronisasi hanya bisa dibuka oleh admin yang valid.
  const admin = await AdminAuthService.getCachedCurrentAdmin()
  if (!admin) redirect('/admin/login')
  return <AdminSyncFlow />
}
