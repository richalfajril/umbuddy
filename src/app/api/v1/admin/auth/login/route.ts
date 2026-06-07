import { NextResponse } from 'next/server'
import { getClientIp, rateLimitByKey } from '@/server/redis/rate-limit'
import {
  ADMIN_LOGIN_RATE_LIMIT,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  AdminAuthService,
} from '@/server/admin-auth'

// Response error admin auth dibuat generic untuk mencegah enumerasi email admin.
function adminAuthError(message = 'Email atau password admin tidak valid.', status = 401) {
  return NextResponse.json(
    {
      error: {
        code: status === 429 ? 'RATE_LIMITED' : 'INVALID_CREDENTIALS',
        message,
        details: [],
      },
    },
    { status }
  )
}

// Endpoint login admin membuat session cookie httpOnly yang terpisah dari NextAuth user.
export async function POST(req: Request) {
  const ip = getClientIp(req.headers)

  try {
    let payload: unknown
    try {
      payload = await req.json()
    } catch {
      return adminAuthError('Request body harus JSON valid.', 400)
    }

    const data = payload as { email?: unknown; password?: unknown }
    const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : ''
    const password = typeof data.password === 'string' ? data.password : ''

    if (!email || !password) {
      return adminAuthError()
    }

    const limit = await rateLimitByKey(
      `admin:login:${email}:${ip}`,
      ADMIN_LOGIN_RATE_LIMIT.attempts,
      ADMIN_LOGIN_RATE_LIMIT.windowSeconds
    )

    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMITED',
            message: 'Terlalu banyak percobaan login admin. Coba lagi nanti.',
            details: [],
          },
        },
        {
          status: 429,
          headers: { 'Retry-After': String(limit.retryAfterSeconds) },
        }
      )
    }

    const result = await AdminAuthService.login({
      email,
      password,
      ip,
      userAgent: req.headers.get('user-agent'),
    })

    const response = NextResponse.json({
      admin: result.admin,
      expires_at: result.expiresAt.toISOString(),
    })

    response.cookies.set(ADMIN_SESSION_COOKIE, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_SESSION_TTL_SECONDS,
    })

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'INVALID_CREDENTIALS') {
      return adminAuthError()
    }

    console.error('Admin login error:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Login admin belum berhasil. Coba lagi sebentar.',
          details: [],
        },
      },
      { status: 500 }
    )
  }
}
