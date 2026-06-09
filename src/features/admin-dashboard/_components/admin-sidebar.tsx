'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, FileQuestion, LayoutDashboard, Settings, ShieldCheck, Users, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ThemeToggle } from '@/components/atoms/theme-toggle'
import { AdminLogoutButton } from '@/features/admin-auth/_components/admin-logout-button'
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
    <aside className="flex h-full w-60 flex-col border-r border-border bg-background text-headline">
      {/* Header brand backoffice menjaga konteks area admin. */}
      <div className="flex min-h-16 items-center justify-between border-b border-border px-3">
        <Link
          href="/admin/dashboard"
          prefetch
          transitionTypes={['app-nav']}
          className="flex items-center gap-2"
          onClick={onCloseMobile}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-display text-lg font-black text-primary-foreground shadow-md shadow-primary/25">
            U
          </span>
          <span>
            <span className="block text-[11px] font-black uppercase tracking-[0.16em] text-primary">
              Umbuddy
            </span>
            <span className="block text-sm font-black leading-tight">
              Backoffice
            </span>
          </span>
        </Link>
        <button
          type="button"
          onClick={onCloseMobile}
          className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border text-headline transition hover:bg-surface lg:hidden"
          aria-label="Tutup menu admin"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Identitas admin tampil singkat tanpa token/session internal. */}
      <div className="mx-3 mt-3 rounded-xl border border-primary/25 bg-primary/10 p-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-black">{adminEmail}</p>
            <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-primary">{adminRole}</p>
          </div>
        </div>
      </div>

      {/* Navigasi fitur admin memakai active state berdasarkan pathname. */}
      <nav className="mt-4 flex-1 space-y-1.5 px-3" aria-label="Navigasi admin">
        {ADMIN_DASHBOARD_NAV_ITEMS.map((item) => {
          const Icon = adminNavIcons[item.icon]
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.isSoon ? '/admin/dashboard' : item.href}
              prefetch={item.prefetch === true}
              transitionTypes={['app-nav']}
              onClick={onCloseMobile}
              className={[
                'group flex min-h-11 items-center gap-2 rounded-xl px-2.5 py-2 transition',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/15'
                  : 'bg-surface text-body hover:bg-surface-hover hover:text-headline',
                item.isSoon ? 'opacity-70' : '',
              ].join(' ')}
            >
              <span className={[
                'grid h-8 w-8 shrink-0 place-items-center rounded-lg',
                isActive ? 'bg-white/20' : 'bg-background text-body group-hover:bg-primary/20 group-hover:text-primary',
              ].join(' ')}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-xs font-black">
                  {item.label}
                  {item.isSoon && (
                    <span className="rounded-full border border-border bg-background px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-muted">
                      Soon
                    </span>
                  )}
                </span>
                <span className="sr-only">
                  {item.description}
                </span>
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Logout diletakkan di bawah agar mudah ditemukan tanpa mengganggu navigasi utama. */}
      <div className="grid gap-2 border-t border-border p-3">
        <ThemeToggle variant="inline" />
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
          className="fixed inset-0 z-40 bg-headline/45 backdrop-blur-sm lg:hidden"
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
