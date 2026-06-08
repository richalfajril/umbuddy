import { NextResponse } from 'next/server'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminUsersService } from '@/server/admin-users/admin-users.service'
import { apiErrorResponse } from '@/server/api/route-utils'

export async function GET(request: Request) {
  try {
    // 1. Verifikasi Admin
    const session = await AdminAuthService.getCurrentAdmin()
    if (!session) {
      return apiErrorResponse('UNAUTHORIZED', 'Sesi admin tidak valid', 401)
    }

    // 2. Parse Parameter
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '15', 10)
    const keyword = url.searchParams.get('keyword') || undefined
    const status = url.searchParams.get('status') || undefined
    const instansi = url.searchParams.get('instansi') || undefined
    const registrationSource = url.searchParams.get('registrationSource') || undefined

    // 3. Ambil data
    const result = await AdminUsersService.listUsers({
      page,
      limit,
      keyword,
      status,
      instansi,
      registrationSource
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API_ADMIN_USERS_LIST]', error)
    return apiErrorResponse('INTERNAL_ERROR', 'Gagal memuat daftar pengguna', 500)
  }
}
