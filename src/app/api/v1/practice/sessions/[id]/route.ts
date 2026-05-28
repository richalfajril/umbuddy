import { NextResponse } from 'next/server'
import { PracticeService } from '@/services/practice.service'
import { errorResponse, getRequiredUserId, practiceErrorResponse } from '../../_utils'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_req: Request, context: RouteContext) {
  const userId = await getRequiredUserId()
  if (!userId) {
    return errorResponse('UNAUTHORIZED', 'Kamu perlu masuk dulu untuk melihat sesi latihan.', 401)
  }

  const { id } = await context.params

  try {
    const session = await PracticeService.getSession(userId, id)
    return NextResponse.json(session)
  } catch (caughtError) {
    return practiceErrorResponse(caughtError)
  }
}
