'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, FileQuestion, LayoutDashboard, Settings, ShieldCheck, Users, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-slate-950 text-white">
      {/* Header brand backoffice menjaga konteks area admin. */}
      <div className="flex min-h-20 items-center justify-between border-b border-white/10 px-5">
        <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={onCloseMobile}>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary font-display text-xl font-black text-primary-foreground shadow-lg shadow-primary/30">
            U
          </span>
          <span>
            <span className="block text-sm font-black uppercase tracking-[0.18em] text-primary">
              Umbuddy
            </span>
            <span className="block text-lg font-black leading-tight">
              Backoffice
            </span>
          </span>
        </Link>
        <button
          type="button"
          onClick={onCloseMobile}
          className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-white/10 text-white transition hover:bg-white/10 lg:hidden"
          aria-label="Tutup menu admin"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Identitas admin tampil singkat tanpa token/session internal. */}
      <div className="mx-4 mt-4 rounded-2xl border border-primary/25 bg-primary/10 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-black">{adminEmail}</p>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{adminRole}</p>
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
                'group flex min-h-14 items-center gap-3 rounded-2xl border px-3 py-3 transition',
                isActive
                  ? 'border-primary/50 bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'border-white/10 bg-white/[0.04] text-slate-200 hover:border-primary/40 hover:bg-white/[0.08]',
                item.isSoon ? 'opacity-70' : '',
              ].join(' ')}
            >
              <span className={[
                'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
                isActive ? 'bg-white/20' : 'bg-white/10 group-hover:bg-primary/20',
              ].join(' ')}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-black">
                  {item.label}
                  {item.isSoon && (
                    <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em]">
                      Soon
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-xs opacity-75">
                  {item.description}
                </span>
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Logout diletakkan di bawah agar mudah ditemukan tanpa mengganggu navigasi utama. */}
      <div className="border-t border-white/10 p-4">
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
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
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
