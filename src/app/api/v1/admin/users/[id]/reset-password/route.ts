import { NextResponse } from 'next/server'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminUsersService } from '@/server/admin-users/admin-users.service'
import { getClientIp } from '@/server/redis/rate-limit'
import { apiErrorResponse } from '@/server/api/route-utils'
import { validateDto } from '@/server/validation/dto'
import { AdminPasswordResetDto } from '@/server/validation/admin-users/admin-password-reset.dto'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await AdminAuthService.getCurrentAdmin()
    if (!session) {
      return apiErrorResponse('UNAUTHORIZED', 'Sesi admin tidak valid', 401)
    }

    const body = await request.json().catch(() => ({}))
    const validation = await validateDto(AdminPasswordResetDto, body)
    
    if (!validation.data) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Data tidak valid', details: validation.errors } },
        { status: 400 }
      )
    }

    const ip = getClientIp(request.headers)
    const baseUrl = process.env.NEXTAUTH_URL ?? new URL(request.url).origin
    const { reason } = validation.data

    const result = await AdminUsersService.triggerPasswordResetEmail(
      id,
      session.admin.id,
      ip,
      baseUrl,
      reason?.trim() || 'Admin memicu pengiriman tautan reset password ke email pengguna.'
    )

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('[API_ADMIN_USERS_RESET_PASSWORD]', error)
    if (error instanceof Error && error.message === 'User tidak ditemukan') {
      return apiErrorResponse('NOT_FOUND', 'User tidak ditemukan', 404)
    }
    // Mengembalikan pesan error secara eksplisit ke UI jika AuthEmailService gagal (misal: limit kuota, rate limit)
    if (error instanceof Error) {
      return apiErrorResponse('BAD_REQUEST', error.message, 400)
    }
    return apiErrorResponse('INTERNAL_ERROR', 'Gagal memicu reset password', 500)
  }
}
