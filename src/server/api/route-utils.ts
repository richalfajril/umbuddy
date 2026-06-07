import { NextResponse } from 'next/server'
import { getUserSession } from '@/server/auth/session'

// Mendapatkan ID user dari session, null jika tidak ada atau di-revoke.
export async function getRequiredUserId() {
  const session = await getUserSession()
  if (!session?.user?.id || session.user.revoked) {
    return null
  }

  return session.user.id
}

// Format error API yang konsisten untuk seluruh route.
export function apiErrorResponse(
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

// Helper JSON parser yang aman dengan error response seragam.
export async function readApiJson(req: Request) {
  try {
    return { payload: await req.json(), error: null }
  } catch {
    return {
      payload: null,
      error: apiErrorResponse('INVALID_JSON', 'Request body harus JSON valid', 400),
    }
  }
}
