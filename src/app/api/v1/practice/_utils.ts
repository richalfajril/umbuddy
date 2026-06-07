import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/server/auth/config'
import { PracticeError } from '@/server/services/practice.service'

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

export function practiceErrorResponse(error: unknown) {
  if (error instanceof PracticeError) {
    return errorResponse(error.code, error.message, error.status)
  }

  console.error('Practice API error:', error)
  return errorResponse('INTERNAL_ERROR', 'Duh, latihan belum bisa diproses. Coba lagi sebentar ya.', 500)
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
