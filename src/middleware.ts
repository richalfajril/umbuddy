import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Global Edge Middleware for Umbuddy V1.
 * 
 * Sesuai SECURITY.md & U1_Authentication.md:
 * - Menjaga rute terproteksi (/dashboard) agar hanya bisa diakses oleh user aktif.
 * - Mengelola alur pengalihan (redirect) otomatis untuk onboarding (U18).
 * - Menangani pencabutan sesi (session revocation) secara realtime.
 */
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // 1. Abaikan aset statis dan API internal NextAuth
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/logo') ||
    pathname.startsWith('/mascot') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const isAuthPage = pathname.startsWith('/auth')

  // 2. Jika user BELUM TEROTENTIKASI
  if (!token) {
    // Lindungi rute rahasia/private, alihkan ke halaman login
    if (!isAuthPage && pathname !== '/') {
      const loginUrl = new URL('/auth/login', req.url)
      loginUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // 3. Jika user SUDAH TEROTENTIKASI
  const isRevoked = token.revoked === true
  if (isRevoked) {
    // Sesi telah kedaluwarsa atau dicabut (misal: password telah diganti dari peranti lain)
    const response = NextResponse.redirect(new URL('/auth/login', req.url))
    // Bersihkan cookies NextAuth secara aman
    response.cookies.delete('next-auth.session-token')
    response.cookies.delete('next-auth.csrf-token')
    return response
  }

  // Jika sudah masuk, cegah mengakses halaman auth (login, register, forgot/reset password)
  if (isAuthPage && pathname !== '/auth/error') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  const onboardingRequired = token.onboardingRequired === true

  // Alur pengalihan Onboarding (U18)
  if (onboardingRequired && pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }

  if (!onboardingRequired && pathname === '/onboarding') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  // Hanya jalankan middleware pada rute-rute kritikal untuk efisiensi
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/auth/:path*'],
}
