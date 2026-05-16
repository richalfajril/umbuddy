import type { Metadata, Viewport } from 'next'
import { inter, nunito } from '@/lib/fonts'
import './globals.css'

/**
 * SEO Metadata — diisi dengan branding Umbuddy.
 * Sesuai AGENTS.md: "Konsisten gunakan nama Umbuddy di semua copy."
 */
export const metadata: Metadata = {
  title: {
    default: 'Umbuddy — Belajar CPNS Seru, Bersaing, dan Naik Level!',
    template: '%s | Umbuddy',
  },
  description:
    'Platform simulasi CPNS yang terasa seperti game. Latihan soal TWK, TIU, TKP, battle bareng teman, dan kejar Leaderboard. Gratis!',
  keywords: ['CPNS', 'latihan soal CPNS', 'simulasi CAT', 'SKD', 'TWK', 'TIU', 'TKP', 'belajar CPNS'],
  authors: [{ name: 'Umbuddy' }],
  creator: 'Umbuddy',
  // Gunakan || bukan ?? agar string kosong ("") dari .env.local
  // juga di-fallback ke URL default. new URL("") akan throw Invalid URL.
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || 'https://umbuddy.com'
  ),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Umbuddy',
    title: 'Umbuddy — Belajar CPNS Seru, Bersaing, dan Naik Level!',
    description:
      'Platform simulasi CPNS yang terasa seperti game. Gratis, gamified, dan kompetitif.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Umbuddy — Belajar CPNS Seru!',
    description:
      'Platform simulasi CPNS gamified. Latihan, battle, leaderboard. Gratis!',
  },
  /* PWA manifest — sesuai next-pwa yang sudah dikonfigurasi di next.config.ts */
  manifest: '/manifest.json',
  icons: {
    icon: '/logo/logo_only.png',
    apple: '/logo/logo_only.png',
  },
}

/**
 * Viewport config — mobile-first, tema warna untuk browser chrome (Android).
 * theme-color: primary green Umbuddy agar address bar match branding.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#74C332' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

/**
 * Root Layout — Server Component.
 *
 * Menerapkan dua font via CSS variables:
 * - --font-inter  → font-sans (body text, soal)
 * - --font-nunito → font-display (heading, CTA, skor)
 *
 * Class `h-full` pada html & body diperlukan agar layout flexbox
 * bekerja dengan benar di seluruh halaman (terutama sticky bottom nav).
 */
import { Providers } from './providers'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${nunito.variable} h-full`}
      /* suppressHydrationWarning diperlukan karena dark mode class
       * di-inject oleh ThemeProvider (client-side) — menghindari
       * hydration mismatch antara server dan client render. */
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased bg-background text-body">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
