import { redirect } from 'next/navigation'

// Route admin root diarahkan ke dashboard eksplisit agar URL backoffice konsisten.
export default function AdminPage() {
  redirect('/admin/dashboard')
}
