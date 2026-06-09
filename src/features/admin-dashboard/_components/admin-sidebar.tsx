'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, FileQuestion, LayoutDashboard, Settings, ShieldCheck, Users, X, MoreVertical } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ThemeToggle } from '@/components/atoms/theme-toggle'
import { AdminLogoutButton } from '@/features/admin-auth/_components/admin-logout-button'
import { ADMIN_DASHBOARD_NAV_ITEMS } from '../_constants/admin-dashboard.constants'
import type { AdminNavIconKey, AdminNavItem } from '../_types/admin-dashboard.types'

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

export function AdminSidebar({
  adminEmail,
  adminRole,
  isMobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname()

  // Kelompokkan navigasi agar sesuai desain referensi.
  const groups = [
    {
      title: 'Dashboard',
      items: ADMIN_DASHBOARD_NAV_ITEMS.filter((i) => i.icon === 'dashboard'),
    },
    {
      title: 'Manajemen Tryout',
      items: ADMIN_DASHBOARD_NAV_ITEMS.filter((i) => i.icon === 'questions'),
    },
    {
      title: 'Manajemen Data',
      items: ADMIN_DASHBOARD_NAV_ITEMS.filter((i) => i.icon !== 'dashboard' && i.icon !== 'questions'),
    },
  ]

  const sidebarContent = (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-background text-headline">
      {/* Header Logo Clean */}
      <div className="flex min-h-16 items-center justify-between px-6 pt-2">
        <Link
          href="/admin/dashboard"
          prefetch
          transitionTypes={['app-nav']}
          className="flex items-center gap-3"
          onClick={onCloseMobile}
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-display text-lg font-black text-white">
            U
          </span>
          <span className="text-xl font-black text-primary tracking-tight">
            umbuddy
          </span>
        </Link>
        <button
          type="button"
          onClick={onCloseMobile}
          className="grid min-h-11 min-w-11 place-items-center rounded-xl text-headline hover:bg-surface lg:hidden"
          aria-label="Tutup menu admin"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigasi Grouped */}
      <nav className="mt-8 flex-1 space-y-6 overflow-y-auto px-4 pb-4" aria-label="Navigasi admin">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-2 px-3 text-xs font-bold text-muted">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
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
                      'group flex items-center gap-3 rounded-lg px-3 py-2.5 transition',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-headline hover:bg-surface hover:text-primary',
                      item.isSoon ? 'opacity-70' : '',
                    ].join(' ')}
                  >
                    <span className={[
                      'grid h-5 w-5 place-items-center',
                      isActive ? 'text-primary' : 'text-body group-hover:text-primary',
                    ].join(' ')}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex flex-1 items-center gap-2 text-sm font-medium">
                      {item.label}
                      {item.isSoon && (
                        <span className="rounded-full border border-border bg-background px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-muted">
                          Soon
                        </span>
                      )}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile Footer Clean */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface border border-border text-xs font-bold text-headline">
            {adminRole === 'SUPER_ADMIN' ? 'SA' : 'AD'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-headline">Admin Umbuddy</p>
            <p className="truncate text-xs text-muted">{adminEmail}</p>
          </div>
          <button className="shrink-0 p-1 text-muted hover:text-headline">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <ThemeToggle variant="inline" />
          <div className="flex-1">
            <AdminLogoutButton />
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        {sidebarContent}
      </div>

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Tutup overlay menu admin"
          className="fixed inset-0 z-40 bg-headline/45 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

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
