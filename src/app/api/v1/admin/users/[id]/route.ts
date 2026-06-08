import { NextResponse } from 'next/server'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminUsersService } from '@/server/admin-users/admin-users.service'
import { apiErrorResponse } from '@/server/api/route-utils'

export async function GET(
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

    // 2. Ambil data
    const user = await AdminUsersService.getUserDetail(id)
    return NextResponse.json(user)
  } catch (error) {
    console.error('[API_ADMIN_USERS_DETAIL]', error)
    return apiErrorResponse('NOT_FOUND', 'Gagal memuat detail pengguna atau user tidak ditemukan', 404)
  }
}
