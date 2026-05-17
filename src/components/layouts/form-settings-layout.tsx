import * as React from 'react'

/**
 * FormSettingsLayout — Layout untuk form-based pages.
 *
 * Digunakan oleh: U1 Auth (login/register), U18 Onboarding, U19 Settings.
 * Sesuai Layout_Patterns.md: "Form & Settings Layout"
 *
 * Karakteristik:
 * - Single column terpusat, max-width 400–480px
 * - Konten card di tengah layar (vertikal + horizontal)
 * - Sticky CTA button di bawah (mobile)
 * - Logo di atas form
 * - Background: putih atau abu muda
 * - Tidak ada navbar kompleks, tidak ada bottom nav
 * - Mobile-first: padding horizontal 16px
 */

interface FormSettingsLayoutProps {
  /** Logo atau header kecil di atas form */
  header?: React.ReactNode
  /** Konten utama form */
  children: React.ReactNode
  /** CTA sticky di bawah — biasanya tombol Submit */
  stickyFooter?: React.ReactNode
  /** Lebar maksimal card form. Default: 448px (max-w-md) */
  maxWidth?: 'sm' | 'md' | 'lg'
}

const maxWidthClasses = {
  sm: 'max-w-sm',   // 384px
  md: 'max-w-md',   // 448px
  lg: 'max-w-lg',   // 512px
}

/**
 * Layout terpusat untuk form auth, onboarding, dan settings.
 * Server Component.
 */
export function FormSettingsLayout({
  header,
  children,
  stickyFooter,
  maxWidth = 'md',
}: FormSettingsLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Scrollable content area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className={['w-full', maxWidthClasses[maxWidth]].join(' ')}>
          {/* Logo / header form */}
          {header && (
            <div className="flex flex-col items-center mb-6">
              {header}
            </div>
          )}

          {/* Form content */}
          <div className="card">
            {children}
          </div>
        </div>
      </main>

      {/* Sticky CTA footer (mobile-friendly) */}
      {stickyFooter && (
        <div className="sticky bottom-0 z-10 w-full bg-background border-t border-border px-4 py-3 safe-area-bottom">
          <div className={['mx-auto', maxWidthClasses[maxWidth]].join(' ')}>
            {stickyFooter}
          </div>
        </div>
      )}
    </div>
  )
}
