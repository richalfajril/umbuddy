import { redirect } from 'next/navigation'

// Flow root admin menjaga /admin sebagai redirect eksplisit ke dashboard backoffice.
export function AdminRootRedirect() {
  redirect('/admin/dashboard')
  return null
}
