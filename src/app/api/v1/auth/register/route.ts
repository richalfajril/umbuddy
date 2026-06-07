import { NextResponse } from 'next/server'
import { AuthService } from '@/server/auth/auth.service'
import { AuthEmailService } from '@/server/email/auth-email.service'
import { getClientIp, rateLimitByKey } from '@/server/redis/rate-limit'
import { validateDto } from '@/server/validation/dto'
import { RegisterUserDto } from '@/server/validation/auth/register.dto'

function errorResponse(
  code: string,
  message: string,
  status: number,
  details: Array<{ field: string; message: string }> = []
) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  )
}

function registrationAcceptedResponse() {
  return NextResponse.json(
    {
      message: 'Jika email dapat didaftarkan, instruksi verifikasi akan dikirim. Jika belum masuk, coba lagi nanti atau lanjut dengan Google.',
      verification_required: true,
    },
    { status: 202 }
  )
}


/**
 * API Route: /api/v1/auth/register
 * 
 * Sesuai AGENTS.md: "Seluruh endpoint REST wajib memiliki rute dengan awalan /api/v1/."
 * Sesuai U1_Authentication.md: "Registration flow via Email/Password."
 */
export async function POST(req: Request) {
  let normalizedEmail = ''
  let ip = 'unknown'

  try {
    ip = getClientIp(req.headers)
    const rateLimit = await rateLimitByKey(`auth:register:${ip}`, 5, 15 * 60)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMITED',
            message: 'Terlalu banyak percobaan registrasi. Coba lagi nanti.',
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

    const validation = await validateDto(RegisterUserDto, payload)
    if (validation.data === null) {
      return errorResponse(
        'VALIDATION_ERROR',
        'Invalid request data',
        400,
        validation.errors
      )
    }

    normalizedEmail = validation.data.email.trim().toLowerCase()

    await AuthService.registerUser({
      name: validation.data.name.trim(),
      email: normalizedEmail,
      password: validation.data.password,
    })

    await AuthEmailService.sendVerificationEmail(
      normalizedEmail,
      ip,
      process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    )

    return registrationAcceptedResponse()
  } catch (error: unknown) {
    console.error('Registration API error:', error)
    
    const message = error instanceof Error ? error.message : ''
    if (message === 'INVALID_NAME') {
      return errorResponse(
        'VALIDATION_ERROR',
        'Invalid request data',
        400,
        [{ field: 'name', message: 'Nama tidak valid' }]
      )
    }

    if (message === 'Email sudah terdaftar') {
      if (normalizedEmail) {
        await AuthEmailService.sendVerificationEmail(
          normalizedEmail,
          ip,
          process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
        )
      }
      return registrationAcceptedResponse()
    }

    return errorResponse('INTERNAL_ERROR', 'Terjadi kesalahan saat pendaftaran', 500)
  }
}
