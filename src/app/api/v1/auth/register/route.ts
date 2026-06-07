import { NextResponse } from 'next/server'
import { AuthService } from '@/server/auth/auth.service'
import { EmailQuotaService } from '@/server/email/email-quota.service'
import { EMAIL_FROM, getResendClient } from '@/server/email/client'
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

async function sendVerificationEmail(email: string, ip: string) {
  const canCreateVerification = await AuthService.canCreateEmailVerificationRequest(email)
  if (!canCreateVerification) return

  const quota = await EmailQuotaService.consumeAuthEmailQuota({
    type: 'verification',
    email,
    ip,
  })
  if (!quota.allowed) return

  const verificationRequest = await AuthService.createEmailVerificationRequest(email)
  if (!verificationRequest) return

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const verifyUrl = new URL('/auth/login', baseUrl)
  verifyUrl.searchParams.set('verify_token', verificationRequest.token)

  try {
    await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: verificationRequest.email,
      subject: 'Verifikasi Email Umbuddy',
      text: [
        `Halo ${verificationRequest.name},`,
        '',
        'Klik link berikut untuk mengaktifkan akun Umbuddy kamu. Link berlaku 24 jam:',
        verifyUrl.toString(),
        '',
        'Kalau kamu tidak membuat akun Umbuddy, abaikan email ini.',
      ].join('\n'),
    })
  } catch (error) {
    console.error('Email verification send error:', error)
  }
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

    await sendVerificationEmail(normalizedEmail, ip)

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
        await sendVerificationEmail(normalizedEmail, ip)
      }
      return registrationAcceptedResponse()
    }

    return errorResponse('INTERNAL_ERROR', 'Terjadi kesalahan saat pendaftaran', 500)
  }
}
