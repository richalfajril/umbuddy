import { NextResponse } from 'next/server'
import { PracticeService } from '@/server/services/practice.service'
import { apiErrorResponse, getRequiredUserId } from '@/server/api/route-utils'
import { practiceErrorResponse } from '@/server/api/practice.route-utils'

export async function GET(req: Request) {
  const userId = await getRequiredUserId()
  if (!userId) {
    return apiErrorResponse('UNAUTHORIZED', 'Kamu perlu masuk dulu untuk melihat riwayat latihan.', 401)
  }

  const url = new URL(req.url)
  const page = Number(url.searchParams.get('page') ?? '1')
  const pageSize = Number(url.searchParams.get('page_size') ?? '10')

  try {
    const history = await PracticeService.getHistory(userId, page, pageSize)
    return NextResponse.json(history)
  } catch (caughtError) {
    return practiceErrorResponse(caughtError)
  }
}
