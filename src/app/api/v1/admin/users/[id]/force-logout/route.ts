import { NextResponse } from 'next/server'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminUsersService } from '@/server/admin-users/admin-users.service'
import { apiErrorResponse } from '@/server/api/route-utils'
import { validateDto } from '@/server/validation/dto'
import { ForceLogoutDto } from '@/server/validation/admin-users/force-logout.dto'

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
    const validation = await validateDto(ForceLogoutDto, body)
    
    if (!validation.data) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Data tidak valid', details: validation.errors } },
        { status: 400 }
      )
    }

    const { reason } = validation.data
    const result = await AdminUsersService.forceLogoutUser(
      id,
      session.admin.id,
      reason?.trim() || 'Sesi pengguna dipaksa keluar oleh admin.'
    )

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('[API_ADMIN_USERS_FORCE_LOGOUT]', error)
    if (error instanceof Error && error.message === 'User tidak ditemukan') {
      return apiErrorResponse('NOT_FOUND', 'User tidak ditemukan', 404)
    }
    return apiErrorResponse('INTERNAL_ERROR', 'Gagal melakukan force logout', 500)
  }
}
