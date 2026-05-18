import { NextResponse } from 'next/server'
import { AuthService } from '@/services/auth.service'
import { getClientIp, rateLimitByKey } from '@/lib/redis/rate-limit'
import { validateDto } from '@/lib/validation/dto'
import { PasswordResetConfirmDto } from './confirm.dto'

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
  const rateLimit = await rateLimitByKey(`auth:password-reset-confirm:${ip}`, 10, 15 * 60)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMITED',
          message: 'Terlalu banyak percobaan reset password. Coba lagi nanti.',
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

  const validation = await validateDto(PasswordResetConfirmDto, payload)
  if (validation.data === null) {
    return errorResponse('VALIDATION_ERROR', 'Invalid request data', 400, validation.errors)
  }

  try {
    await AuthService.resetPasswordWithToken(
      validation.data.token,
      validation.data.new_password
    )

    return NextResponse.json({
      message: 'Password berhasil direset. Silakan masuk ulang dengan password baru.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'RESET_TOKEN_INVALID') {
      return errorResponse(
        'RESET_TOKEN_INVALID',
        'Token reset tidak valid atau sudah kedaluwarsa.',
        400
      )
    }

    console.error('Password reset confirm error:', error)
    return errorResponse('INTERNAL_ERROR', 'Terjadi kesalahan saat reset password', 500)
  }
}
