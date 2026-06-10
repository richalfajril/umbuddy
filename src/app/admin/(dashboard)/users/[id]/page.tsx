import type { Metadata } from 'next'
import { AdminUserDetailFlow } from '@/features/admin-users/admin-user-detail-flow'

export const metadata: Metadata = {
  title: 'Detail Pengguna - Umbuddy Backoffice',
}

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AdminUserDetailFlow userId={id} />
}
