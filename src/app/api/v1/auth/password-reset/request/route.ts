import { NextResponse } from 'next/server'

import { AuthEmailService } from '@/server/email/auth-email.service'
import { getClientIp, rateLimitByKey } from '@/server/redis/rate-limit'
import { validateDto } from '@/server/validation/dto'
import { PasswordResetRequestDto } from '@/server/validation/auth/password-reset-request.dto'

function successResponse() {
  return NextResponse.json(
    {
      message: 'Jika email terdaftar dan aktif, instruksi reset password akan dikirim.',
    },
    { status: 202 }
  )
}

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
  const rateLimit = await rateLimitByKey(`auth:password-reset:${ip}`, 5, 15 * 60)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMITED',
          message: 'Terlalu banyak permintaan reset password. Coba lagi nanti.',
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

  const validation = await validateDto(PasswordResetRequestDto, payload)
  if (validation.data === null) {
    return errorResponse('VALIDATION_ERROR', 'Invalid request data', 400, validation.errors)
  }

  const normalizedEmail = validation.data.email.trim().toLowerCase()
  const baseUrl = process.env.NEXTAUTH_URL ?? new URL(req.url).origin

  await AuthEmailService.sendPasswordResetEmail(normalizedEmail, ip, baseUrl)

  return successResponse()
}
