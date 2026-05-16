import type { NextConfig } from 'next'
// @ts-expect-error — next-pwa does not ship official types yet
import withPWA from 'next-pwa'

/**
 * Umbuddy Next.js Configuration
 *
 * next-pwa: Enables PWA manifest + service worker for "Add to Home Screen"
 * (Required by 00_Nonfunctional_Requirements.md - Mobile Experience).
 *
 * Security headers: Improve Lighthouse Security score and reduce XSS surface.
 *
 * NOTE: PWA is disabled in dev mode to prevent service worker conflicts.
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * Turbopack config (Next.js 16 default bundler).
   * next-pwa@5.x menggunakan webpack plugin secara internal, sehingga
   * Next.js 16 menampilkan warning "webpack config without turbopack config".
   * Menambahkan `turbopack: {}` memberitahu Next.js bahwa kita aware
   * menggunakan Turbopack — warning hilang tanpa mengubah behavior.
   *
   * NOTE: PWA service worker di-generate oleh next-pwa saat `next build`.
   * Di dev mode, next-pwa sudah di-disable, jadi tidak ada konflik nyata.
   */
  turbopack: {},

  // Compiler optimizations
  compiler: {
    // Remove console logs in production (except errors)
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error'] }
      : false,
  },

  // Image domains for Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Security & performance headers (target Lighthouse > 95)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

// Wrap with next-pwa (PWA disabled in dev environment)
const withPWAConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

export default withPWAConfig(nextConfig)
