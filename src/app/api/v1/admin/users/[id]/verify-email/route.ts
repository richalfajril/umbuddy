import { NextResponse } from 'next/server'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminUsersService } from '@/server/admin-users/admin-users.service'
import { apiErrorResponse } from '@/server/api/route-utils'
import { validateDto } from '@/server/validation/dto'
import { ManualEmailVerificationDto } from '@/server/validation/admin-users/manual-email-verification.dto'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // 1. Verifikasi Admin
    const session = await AdminAuthService.getCurrentAdmin()
    if (!session) {
      return apiErrorResponse('UNAUTHORIZED', 'Sesi admin tidak valid', 401)
    }

    // 2. Parse Body & Validate
    const body = await request.json().catch(() => ({}))
    const validation = await validateDto(ManualEmailVerificationDto, body)
    
    if (!validation.data) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Data tidak valid', details: validation.errors } },
        { status: 400 }
      )
    }

    // 3. Eksekusi
    const { reason } = validation.data
    const result = await AdminUsersService.manuallyVerifyUserEmail(
      id,
      session.admin.id,
      reason?.trim() || 'Email diverifikasi manual oleh admin.'
    )

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('[API_ADMIN_USERS_VERIFY_EMAIL]', error)
    if (error instanceof Error && error.message === 'User tidak ditemukan') {
      return apiErrorResponse('NOT_FOUND', 'User tidak ditemukan', 404)
    }
    return apiErrorResponse('INTERNAL_ERROR', 'Gagal memverifikasi email pengguna', 500)
  }
}
