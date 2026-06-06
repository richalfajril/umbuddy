'use client'

import * as React from 'react'
import { Menu } from 'lucide-react'
import { AdminSidebar } from './admin-sidebar'
import { AdminButton } from '@/features/admin-shared/_components/ui'

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
    <div className="min-h-screen bg-surface/60 text-headline">
      {/* Sidebar khusus fitur admin, responsive menjadi drawer di mobile. */}
      <AdminSidebar
        adminEmail={adminEmail}
        adminRole={adminRole}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      {/* Header mobile memberi akses hamburger tanpa memenuhi area desktop. */}
      <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:hidden">
        <AdminButton
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Buka menu admin"
        >
          <Menu className="h-5 w-5" />
        </AdminButton>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Umbuddy</p>
          <p className="text-sm font-semibold text-headline">Backoffice</p>
        </div>
      </header>

      {/* Konten utama bergeser pada desktop agar tidak tertutup sidebar. */}
      <main className="lg:pl-72">
        {children}
      </main>
    </div>
  )
}
