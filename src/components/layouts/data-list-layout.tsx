import * as React from 'react'

/**
 * DataListLayout — Layout untuk halaman list/tabel dengan filter & search.
 *
 * Digunakan oleh: U9 Leaderboard, U7 Friends, U20 Notification Center,
 *                 A2 Question Management, A3 User Management.
 * Sesuai Layout_Patterns.md: "Data List/Filter Layout"
 *
 * Karakteristik:
 * - Header sticky: judul halaman + tombol aksi (opsional)
 * - Filter/Search bar sticky di bawah header
 * - List konten scrollable (stacked cards di mobile, tabel di desktop)
 * - Infinite scroll atau pagination di bawah list
 * - BottomNav tetap tersedia (tidak zero-nav seperti FocusExam)
 *
 * Struktur:
 *   PageHeader (sticky)
 *   FilterBar (sticky)
 *   ListContent (scrollable)
 *   Pagination
 *   BottomNav (mobile)
 */

interface DataListLayoutProps {
  /** Header halaman: judul + aksi (misal tombol Add/Filter) */
  pageHeader: React.ReactNode
  /** Search bar dan filter chips */
  filterBar?: React.ReactNode
  /** List items atau tabel */
  children: React.ReactNode
  /** Pagination atau load-more button */
  pagination?: React.ReactNode
  /** BottomNav untuk mobile — sama seperti BentoDashboardLayout */
  bottomNav?: React.ReactNode
  /** Sidebar untuk desktop */
  sidebar?: React.ReactNode
}

/**
 * Layout untuk halaman list data dengan search, filter, dan pagination.
 * Server Component — filter state di-handle oleh URL searchParams.
 */
export function DataListLayout({
  pageHeader,
  filterBar,
  children,
  pagination,
  bottomNav,
  sidebar,
}: DataListLayoutProps) {
  return (
    <div className="min-h-screen bg-surface dark:bg-dark-background">

      {/* ── MOBILE ── */}
      <div className="flex flex-col min-h-screen md:hidden">
        {/* Page header sticky */}
        <header className="sticky top-0 z-40 bg-background dark:bg-dark-surface border-b border-border dark:border-dark-border">
          {pageHeader}
          {/* Filter bar tepat di bawah header */}
          {filterBar && (
            <div className="px-4 py-2 border-t border-border dark:border-dark-border bg-background dark:bg-dark-surface">
              {filterBar}
            </div>
          )}
        </header>

        {/* List scrollable */}
        <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-3">
          {children}
          {pagination && <div className="pt-2">{pagination}</div>}
        </main>

        {/* BottomNav sticky */}
        {bottomNav && (
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background dark:bg-dark-surface border-t border-border dark:border-dark-border safe-area-bottom">
            {bottomNav}
          </nav>
        )}
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex min-h-screen">
        {sidebar && (
          <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-border dark:border-dark-border bg-background dark:bg-dark-surface overflow-y-auto">
            {sidebar}
          </aside>
        )}

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 bg-background dark:bg-dark-surface border-b border-border dark:border-dark-border">
            {pageHeader}
            {filterBar && (
              <div className="px-6 py-3 border-t border-border dark:border-dark-border">
                {filterBar}
              </div>
            )}
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
            {pagination && <div className="mt-6">{pagination}</div>}
          </main>
        </div>
      </div>
    </div>
  )
}
