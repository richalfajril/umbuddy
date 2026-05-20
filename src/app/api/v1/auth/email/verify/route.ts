import { NextResponse } from 'next/server'
import { AuthService } from '@/services/auth.service'
import { getClientIp, rateLimitByKey } from '@/lib/redis/rate-limit'
import { validateDto } from '@/lib/validation/dto'
import { EmailVerifyDto } from './verify.dto'

function errorResponse(
  code: string,
  message: string,
  status: number,
  details: Array<{ field: string; message: string }> = []
) {
  return NextResponse.json({ error: { code, message, details } }, { status })
}

export async function POST(req: Request) {
  const ip = getClientIp(req.headers)
  const rateLimit = await rateLimitByKey(`auth:email-verify:${ip}`, 10, 15 * 60)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMITED',
          message: 'Terlalu banyak percobaan verifikasi. Coba lagi nanti.',
          details: [],
        },
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      }
    )
  }

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return errorResponse('INVALID_JSON', 'Request body harus JSON valid', 400)
  }

  const validation = await validateDto(EmailVerifyDto, payload)
  if (validation.data === null) {
    return errorResponse('VALIDATION_ERROR', 'Token verifikasi tidak valid.', 400, validation.errors)
  }

  try {
    await AuthService.verifyEmailWithToken(validation.data.token)
    return NextResponse.json({
      message: 'Email berhasil diverifikasi. Kamu sudah bisa masuk.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'EMAIL_VERIFICATION_TOKEN_INVALID') {
      return errorResponse(
        'EMAIL_VERIFICATION_TOKEN_INVALID',
        'Link verifikasi tidak valid atau sudah kedaluwarsa.',
        400
      )
    }

    console.error('Email verification error:', error)
    return errorResponse('INTERNAL_ERROR', 'Terjadi kesalahan saat verifikasi email.', 500)
  }
}
