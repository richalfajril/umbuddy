import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE, AdminAuthService } from '@/server/admin-auth'

// Endpoint logout admin mencabut session DB dan menghapus cookie httpOnly.
export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value
  await AdminAuthService.logout(token)

  const response = NextResponse.json({ message: 'Logout admin berhasil.' })
  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}
