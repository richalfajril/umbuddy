import * as React from 'react'

/**
 * BentoDashboardLayout — Layout utama app (post-login).
 *
 * Digunakan oleh: U5 Dashboard, U4 Analytics, U14 XP Map.
 * Sesuai Layout_Patterns.md: "Bento Dashboard Layout"
 *
 * Karakteristik:
 * - Mobile: TopBar di atas + BottomNav di bawah, konten scroll
 * - Desktop: Sidebar tetap di kiri + konten di kanan (flex row)
 * - Bento grid card untuk konten utama
 * - Safe area bottom untuk notch/gesture bar
 *
 * Struktur:
 * Mobile:
 *   TopBar (sticky top)
 *   main content (scrollable)
 *   BottomNav (sticky bottom)
 *
 * Desktop (md+):
 *   Sidebar (fixed left) | main content (scrollable)
 */

interface BentoDashboardLayoutProps {
  /** TopBar komponen (logo, notif bell, XP chip) */
  topBar: React.ReactNode
  /** BottomNav — ditampilkan hanya di mobile */
  bottomNav: React.ReactNode
  /** Sidebar — ditampilkan hanya di desktop (md+) */
  sidebar?: React.ReactNode
  /** Konten utama dashboard (grid bento) */
  children: React.ReactNode
}

/**
 * Layout dashboard dengan TopBar + BottomNav (mobile) dan Sidebar (desktop).
 * Server Component — navigasi di-handle oleh Next.js Link.
 */
export function BentoDashboardLayout({
  topBar,
  bottomNav,
  sidebar,
  children,
}: BentoDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-surface dark:bg-dark-background">
      {/* ── MOBILE LAYOUT ── */}
      <div className="flex flex-col min-h-screen md:hidden">
        {/* TopBar sticky */}
        <header className="sticky top-0 z-40 w-full bg-background dark:bg-dark-surface border-b border-border dark:border-dark-border">
          {topBar}
        </header>

        {/* Konten scrollable */}
        <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
          {children}
        </main>

        {/* BottomNav sticky */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background dark:bg-dark-surface border-t border-border dark:border-dark-border safe-area-bottom">
          {bottomNav}
        </nav>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:flex min-h-screen">
        {/* Sidebar tetap */}
        {sidebar && (
          <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-border dark:border-dark-border bg-background dark:bg-dark-surface overflow-y-auto">
            {sidebar}
          </aside>
        )}

        {/* Konten utama */}
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 bg-background dark:bg-dark-surface border-b border-border dark:border-dark-border">
            {topBar}
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
