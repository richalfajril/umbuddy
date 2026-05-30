import * as React from 'react'

/**
 * HeroLayout — Layout untuk halaman publik/marketing.
 *
 * Digunakan oleh: U0 Landing Page, halaman maintenance, halaman error.
 * Sesuai Layout_Patterns.md: "The Hero Layout"
 *
 * Karakteristik:
 * - Navbar transparan di atas (slot navbar)
 * - Full-viewport hero section
 * - Konten bisa scroll ke bawah (sections)
 * - Footer di paling bawah
 * - Background: putih / dark-slate
 * - Tidak ada sidebar, tidak ada bottom nav
 */

interface HeroLayoutProps {
  /** Komponen Navbar (transparan, overlay hero) */
  navbar?: React.ReactNode
  /** Konten hero section utama */
  hero: React.ReactNode
  /** Section-section di bawah hero (Features, Testimonials, FAQ, dll) */
  children?: React.ReactNode
  /** Footer */
  footer?: React.ReactNode
}

/**
 * Layout template untuk halaman public/landing.
 * Server Component — tidak ada state/interaksi.
 */
export function HeroLayout({ navbar, hero, children, footer }: HeroLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar — sticky transparan, di atas semua konten */}
      {navbar && (
        <header className="sticky top-0 z-50 w-full">
          {navbar}
        </header>
      )}

      {/* Hero Section — renders directly below sticky navbar */}
      <div className="relative w-full">
        {hero}
      </div>

      {/* Content Sections — Features, Testimonials, FAQ, dll */}
      {children && (
        <main className="flex-1 w-full">
          {children}
        </main>
      )}

      {/* Footer */}
      {footer && (
        <footer className="w-full mt-auto">
          {footer}
        </footer>
      )}
    </div>
  )
}
