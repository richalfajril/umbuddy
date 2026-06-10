import type { Metadata } from 'next'
import { AdminUsersFlow } from '@/features/admin-data-users/admin-users-flow'

export const metadata: Metadata = {
  title: 'User Management - Umbuddy Backoffice',
  description: 'Direktori pengguna dan moderasi akun Umbuddy.',
}

export default function AdminUsersPage() {
  return <AdminUsersFlow />
}
