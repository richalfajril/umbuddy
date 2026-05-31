import { redirect } from 'next/navigation'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminLoginForm } from './_components/admin-login-form'

// Flow server admin login memastikan admin yang sudah punya session tidak melihat form lagi.
export async function AdminAuthFlow() {
  const session = await AdminAuthService.getCurrentAdmin()

  if (session) {
    redirect('/admin/dashboard')
  }

  return <AdminLoginForm />
}
