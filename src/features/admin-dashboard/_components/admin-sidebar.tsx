'use client'

import { ThemeToggle } from '@/components/atoms/theme-toggle'
import { AdminLogoutButton } from '@/features/admin-auth/_components/admin-logout-button'
import type { LucideIcon } from 'lucide-react'
import { Bell, ClipboardList, Database, FileQuestion, LayoutDashboard, Package, RefreshCw, Settings, ShieldCheck, Users, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ADMIN_DASHBOARD_NAV_ITEMS } from '../_constants/admin-dashboard.constants'
import type { AdminNavIconKey } from '../_types/admin-dashboard.types'

const adminNavIcons: Record<AdminNavIconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  questions: FileQuestion,
  subtests: Package,
  tryouts: ClipboardList,
  bank: Database,
  sync: RefreshCw,
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

  const soalIcons = ['questions', 'subtests', 'tryouts', 'bank', 'sync']
  const groups = [
    {
      title: 'Dashboard',
      items: ADMIN_DASHBOARD_NAV_ITEMS.filter((i) => i.icon === 'dashboard'),
    },
    {
      title: 'Manajemen Soal',
      items: ADMIN_DASHBOARD_NAV_ITEMS.filter((i) => soalIcons.includes(i.icon)),
    },
    {
      title: 'Manajemen Data',
      items: ADMIN_DASHBOARD_NAV_ITEMS.filter((i) => i.icon !== 'dashboard' && !soalIcons.includes(i.icon)),
    },
  ]

  const sidebarContent = (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-background text-headline">
      {/* Header Logo Clean using image */}
      <div className="relative flex h-[72px] items-center justify-center px-6 pt-2">
        <Link
          href="/admin/dashboard"
          prefetch
          transitionTypes={['app-nav']}
          className="flex items-center"
          onClick={onCloseMobile}
        >
          <Image
            src="/logo/logo_text.png"
            alt="Umbuddy Logo"
            width={320}
            height={80}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>
        <button
          type="button"
          onClick={onCloseMobile}
          className="absolute right-4 top-4 grid min-h-11 min-w-11 place-items-center rounded-xl text-headline hover:bg-surface lg:hidden"
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

      {/* Profile & Logout (Dipertahankan bentuk chunky di bagian bawah) */}
      <div className="grid gap-3 border-t border-border p-4">
        {/* Identitas admin bergaya chunky original */}
        <div className="rounded-xl border border-primary/25 bg-primary/10 p-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black">{adminEmail}</p>
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-primary">{adminRole}</p>
            </div>
          </div>
        </div>
        <AdminLogoutButton />
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

      {/* Floating Theme Toggle di kanan bawah (jangan terlalu mepet bawah agar tidak menabrak native UI device) */}
      <div className="fixed bottom-6 right-6 z-50 drop-shadow-md hidden lg:block">
        <ThemeToggle variant="floating" />
      </div>
    </>
  )
}
