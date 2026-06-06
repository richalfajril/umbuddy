'use client'

import * as React from 'react'
import { Menu } from 'lucide-react'
import { AdminSidebar } from './admin-sidebar'

type AdminDashboardShellProps = {
  adminEmail: string
  adminRole: string
  children: React.ReactNode
}

// Shell backoffice mengatur sidebar desktop dan drawer mobile tanpa menyentuh auth guard server.
export function AdminDashboardShell({
  adminEmail,
  adminRole,
  children,
}: AdminDashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Sidebar khusus fitur admin, responsive menjadi drawer di mobile. */}
      <AdminSidebar
        adminEmail={adminEmail}
        adminRole={adminRole}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      {/* Header mobile memberi akses hamburger tanpa memenuhi area desktop. */}
      <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-white/10 bg-slate-950/90 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/10"
          aria-label="Buka menu admin"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Umbuddy</p>
          <p className="text-sm font-black">Backoffice</p>
        </div>
      </header>

      {/* Konten utama bergeser pada desktop agar tidak tertutup sidebar. */}
      <main className="lg:pl-72">
        {children}
      </main>
    </div>
  )
}
