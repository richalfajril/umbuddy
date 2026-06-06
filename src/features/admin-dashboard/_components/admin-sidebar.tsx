'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, FileQuestion, LayoutDashboard, Settings, ShieldCheck, Users, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AdminLogoutButton } from '@/features/admin-auth/_components/admin-logout-button'
import { AdminBadge, AdminButton } from '@/features/admin-shared/_components/ui'
import { ADMIN_DASHBOARD_NAV_ITEMS } from '../_constants/admin-dashboard.constants'
import type { AdminNavIconKey } from '../_types/admin-dashboard.types'

// Pemetaan icon sidebar tetap lokal agar constants tidak membawa komponen React.
const adminNavIcons: Record<AdminNavIconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  questions: FileQuestion,
  users: Users,
  notifications: Bell,
  settings: Settings,
}

type AdminSidebarProps = {
  adminEmail: string
  adminRole: string
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

// Sidebar admin berisi navigasi backoffice dan state mobile drawer.
export function AdminSidebar({
  adminEmail,
  adminRole,
  isMobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname()

  // Konten sidebar dipakai ulang untuk desktop dan drawer mobile.
  const sidebarContent = (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-background text-headline">
      {/* Header brand backoffice menjaga konteks area admin. */}
      <div className="flex min-h-20 items-center justify-between border-b border-border px-5">
        <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={onCloseMobile}>
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary font-semibold text-primary-foreground">
            U
          </span>
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Umbuddy
            </span>
            <span className="block text-base font-semibold leading-tight">
              Backoffice
            </span>
          </span>
        </Link>
        <AdminButton
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCloseMobile}
          className="lg:hidden"
          aria-label="Tutup menu admin"
        >
          <X className="h-5 w-5" />
        </AdminButton>
      </div>

      {/* Identitas admin tampil singkat tanpa token/session internal. */}
      <div className="mx-4 mt-4 rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-background text-primary ring-1 ring-border">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{adminEmail}</p>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{adminRole}</p>
          </div>
        </div>
      </div>

      {/* Navigasi fitur admin memakai active state berdasarkan pathname. */}
      <nav className="mt-5 flex-1 space-y-2 px-4" aria-label="Navigasi admin">
        {ADMIN_DASHBOARD_NAV_ITEMS.map((item) => {
          const Icon = adminNavIcons[item.icon]
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.isSoon ? '/admin/dashboard' : item.href}
              onClick={onCloseMobile}
              className={[
                'group flex min-h-12 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-primary-light text-primary-dark dark:bg-primary/15 dark:text-primary'
                  : 'text-body hover:bg-surface hover:text-headline',
                item.isSoon ? 'opacity-70' : '',
              ].join(' ')}
            >
              <span className={[
                'grid h-9 w-9 shrink-0 place-items-center rounded-md',
                isActive ? 'bg-background/80' : 'bg-surface group-hover:bg-background',
              ].join(' ')}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 font-semibold">
                  {item.label}
                  {item.isSoon && (
                    <AdminBadge variant="outline" className="px-1.5 py-0 text-[10px] uppercase tracking-[0.12em]">
                      Soon
                    </AdminBadge>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted">
                  {item.description}
                </span>
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Logout diletakkan di bawah agar mudah ditemukan tanpa mengganggu navigasi utama. */}
      <div className="border-t border-border p-4">
        <AdminLogoutButton />
      </div>
    </aside>
  )

  return (
    <>
      {/* Sidebar desktop selalu terlihat di viewport besar. */}
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        {sidebarContent}
      </div>

      {/* Overlay mobile menutup area konten saat drawer aktif. */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Tutup overlay menu admin"
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Drawer mobile masuk dari kiri ke kanan dengan transisi ringan. */}
      <div
        className={[
          'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-out lg:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {sidebarContent}
      </div>
    </>
  )
}
