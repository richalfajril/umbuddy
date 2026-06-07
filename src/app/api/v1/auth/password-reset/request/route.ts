import { NextResponse } from 'next/server'
import { AuthService } from '@/server/auth/auth.service'
import { EmailQuotaService } from '@/server/email/email-quota.service'
import { EMAIL_FROM, getResendClient } from '@/server/email/client'
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
  const canCreateReset = await AuthService.canCreatePasswordResetRequest(normalizedEmail)
  if (!canCreateReset) {
    return successResponse()
  }

  const quota = await EmailQuotaService.consumeAuthEmailQuota({
    type: 'password-reset',
    email: normalizedEmail,
    ip,
  })
  if (!quota.allowed) {
    return successResponse()
  }

  const resetRequest = await AuthService.createPasswordResetRequest(normalizedEmail)

  if (!resetRequest) {
    return successResponse()
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? new URL(req.url).origin
  const resetUrl = new URL('/auth/reset-password', baseUrl)
  resetUrl.searchParams.set('token', resetRequest.token)

  try {
    await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: resetRequest.email,
      subject: 'Reset Password Umbuddy',
      text: [
        `Halo ${resetRequest.name},`,
        '',
        'Gunakan link berikut untuk reset password Umbuddy. Link berlaku 1 jam:',
        resetUrl.toString(),
        '',
        'Jika kamu tidak meminta reset password, abaikan email ini.',
      ].join('\n'),
    })
  } catch (error) {
    console.error('Password reset email error:', error)
  }

  return successResponse()
}
