import { NextResponse } from 'next/server'
import { PracticeService } from '@/services/practice.service'
import { errorResponse, getRequiredUserId, practiceErrorResponse } from '../_utils'

export async function GET(req: Request) {
  const userId = await getRequiredUserId()
  if (!userId) {
    return errorResponse('UNAUTHORIZED', 'Kamu perlu masuk dulu untuk melihat riwayat latihan.', 401)
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
