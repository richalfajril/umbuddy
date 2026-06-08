import { NextResponse } from 'next/server'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminUsersService } from '@/server/admin-users/admin-users.service'
import { apiErrorResponse } from '@/server/api/route-utils'

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

    // 2. Parse Body
    const body = await request.json()
    const { status, reason } = body

    if (!status || typeof status !== 'string') {
      return apiErrorResponse('BAD_REQUEST', 'Status tidak valid', 400)
    }

    // 3. Update Status
    const result = await AdminUsersService.updateUserStatus(
      id, 
      status, 
      session.admin.id, 
      reason || 'Status diubah secara manual via dasbor'
    )

    return NextResponse.json({ success: true, user: result })
  } catch (error) {
    console.error('[API_ADMIN_USERS_STATUS]', error)
    return apiErrorResponse('INTERNAL_ERROR', 'Gagal memperbarui status pengguna', 500)
  }
}
