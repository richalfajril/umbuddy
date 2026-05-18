import { NextResponse } from 'next/server'
import { AuthService } from '@/services/auth.service'
import { getClientIp, rateLimitByKey } from '@/lib/redis/rate-limit'
import { validateDto } from '@/lib/validation/dto'
import { RegisterUserDto } from './register.dto'

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
      message: 'Jika email dapat didaftarkan, instruksi verifikasi akan dikirim.',
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
  try {
    const ip = getClientIp(req.headers)
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

    const user = await AuthService.registerUser({
      name: validation.data.name.trim(),
      email: validation.data.email.trim().toLowerCase(),
      password: validation.data.password,
    })

    return NextResponse.json(
      { 
        message: 'Registrasi berhasil. Silakan verifikasi email sebelum masuk.',
        verification_required: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      },
      { status: 201 }
    )
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
      return registrationAcceptedResponse()
    }

    return errorResponse('INTERNAL_ERROR', 'Terjadi kesalahan saat pendaftaran', 500)
  }
}
