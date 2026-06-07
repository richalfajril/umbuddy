import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/server/auth/config'
import { OnboardingError } from '@/services/onboarding.service'

export async function getRequiredUserId() {
  const session = await getServerSession(authConfig)
  if (!session?.user?.id || session.user.revoked) {
    return null
  }

  return session.user.id
}

export function errorResponse(
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

export function onboardingErrorResponse(error: unknown) {
  if (error instanceof OnboardingError) {
    return errorResponse(error.code, error.message, error.status)
  }

  console.error('Onboarding API error:', error)
  return errorResponse('INTERNAL_ERROR', 'Duh, sistem onboarding lagi tersandung. Coba lagi sebentar ya.', 500)
}

export async function readJson(req: Request) {
  try {
    return { payload: await req.json(), error: null }
  } catch {
    return {
      payload: null,
      error: errorResponse('INVALID_JSON', 'Request body harus JSON valid', 400),
    }
  }
}
