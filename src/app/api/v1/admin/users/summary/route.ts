import { NextResponse } from 'next/server'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminUsersService } from '@/server/admin-users/admin-users.service'
import { apiErrorResponse } from '@/server/api/route-utils'

export async function GET() {
  try {
    // 1. Verifikasi Admin
    const session = await AdminAuthService.getCurrentAdmin()
    if (!session) {
      return apiErrorResponse('UNAUTHORIZED', 'Sesi admin tidak valid', 401)
    }

    // 2. Ambil data agregasi
    const data = await AdminUsersService.getUserSummaryStats()
    return NextResponse.json({ data })
  } catch (error) {
    console.error('[API_ADMIN_USERS_SUMMARY]', error)
    return apiErrorResponse('INTERNAL_ERROR', 'Gagal memuat ringkasan statistik pengguna', 500)
  }
}
