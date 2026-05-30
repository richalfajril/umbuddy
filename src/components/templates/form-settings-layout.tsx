import * as React from 'react'
import { BookOpen, Medal, Sparkles, Target, Trophy, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/atoms/theme-toggle'

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
  /** Matikan hover/press pada card form untuk halaman yang murni input. */
  staticCard?: boolean
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
  staticCard = false,
}: FormSettingsLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden bg-dot-pattern [&::after]:hidden">
      {/* Ambient auth background: branded, light, and intentionally behind the form. */}
      <div className="glow-blob-primary -top-[80px] -left-[80px] opacity-100 dark:opacity-60" />
      <div className="glow-blob-secondary -bottom-[80px] -right-[80px] opacity-95 dark:opacity-55" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <BookOpen className="absolute left-[9%] top-[22%] hidden h-12 w-12 text-primary/16 sm:block dark:text-primary/12" />
        <Target className="absolute right-[12%] top-[20%] h-11 w-11 text-xp/18 dark:text-xp/14" />
        <Trophy className="absolute bottom-[18%] left-[15%] hidden h-14 w-14 text-xp/16 lg:block dark:text-xp/12" />
        <Medal className="absolute bottom-[20%] right-[15%] hidden h-12 w-12 text-primary/18 md:block dark:text-primary/14" />
        <Sparkles className="absolute right-[26%] top-[38%] hidden h-8 w-8 text-beige/24 xl:block dark:text-xp/16" />
        <Zap className="absolute bottom-[34%] left-[26%] hidden h-8 w-8 text-primary/18 xl:block dark:text-primary/14" />
      </div>

      {/* Scrollable content area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-16 relative z-10">
        <div className={['w-full', maxWidthClasses[maxWidth]].join(' ')}>
          {/* Logo / header form */}
          {header && (
            <div className="flex flex-col items-center mb-6">
              {header}
            </div>
          )}

          {/* Form content */}
          <div className={[staticCard ? 'form-card-static' : 'card', 'p-5 sm:p-8'].join(' ')}>
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

      {/* Floating Theme Toggle */}
      <ThemeToggle />
    </div>
  )
}
