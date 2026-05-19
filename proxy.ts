import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/practice',
  '/battle',
  '/leaderboard',
  '/settings',
  '/profile',
  '/onboarding',
]

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthPage = pathname.startsWith('/auth')

  if (!isProtectedPath(pathname) && !isAuthPage) {
    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token || token.revoked) {
    if (isAuthPage) {
      return NextResponse.next()
    }

    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPage && pathname !== '/auth/error') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const onboardingRequired = Boolean(token.onboardingRequired)
  if (onboardingRequired && pathname !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  if (!onboardingRequired && pathname === '/onboarding') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/practice/:path*',
    '/battle/:path*',
    '/leaderboard/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/onboarding/:path*',
    '/auth/:path*',
  ],
}
