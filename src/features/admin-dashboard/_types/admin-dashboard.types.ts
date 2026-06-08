import type { PublicAdmin } from '@/server/admin-auth'

// Key icon yang dipetakan di sidebar agar constants tetap sederhana dan mudah dibaca.
export type AdminNavIconKey = 'dashboard' | 'questions' | 'users' | 'notifications' | 'settings'

// Item navigasi admin yang hanya berisi fitur backoffice.
export type AdminNavItem = {
  label: string
  href: string
  icon: AdminNavIconKey
  description: string
  isSoon?: boolean
  prefetch?: boolean
}

// Props view dashboard admin berisi admin publik tanpa token/session rahasia.
export type AdminDashboardViewProps = {
  admin: { role: string }
}
