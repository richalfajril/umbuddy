import { NextResponse } from 'next/server'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminQuestionError } from '@/server/admin-questions'

// Membaca session admin dari cookie httpOnly untuk semua endpoint admin v1.
export async function getRequiredAdmin() {
  return AdminAuthService.getCurrentAdmin()
}

// Bentuk error admin dibuat konsisten dan tidak membocorkan detail internal.
export function adminErrorResponse(
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

// Error domain admin questions dipetakan ke response JSON yang ramah backoffice.
export function adminQuestionErrorResponse(error: unknown) {
  if (error instanceof AdminQuestionError) {
    return adminErrorResponse(error.code, error.message, error.status, error.details)
  }

  console.error('Admin question API error:', error)
  return adminErrorResponse('INTERNAL_ERROR', 'Aksi soal belum bisa diproses. Coba lagi sebentar.', 500)
}

// Helper JSON parser agar route handler tetap tipis.
export async function readAdminJson(req: Request) {
  try {
    return { payload: await req.json(), error: null }
  } catch {
    return {
      payload: null,
      error: adminErrorResponse('INVALID_JSON', 'Request body harus JSON valid.', 400),
    }
  }
}

