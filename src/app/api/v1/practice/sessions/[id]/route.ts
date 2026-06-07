import { NextResponse } from 'next/server'
import { PracticeService } from '@/server/services/practice.service'
import { apiErrorResponse, getRequiredUserId } from '@/server/api/route-utils'
import { practiceErrorResponse } from '@/server/api/practice.route-utils'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_req: Request, context: RouteContext) {
  const userId = await getRequiredUserId()
  if (!userId) {
    return apiErrorResponse('UNAUTHORIZED', 'Kamu perlu masuk dulu untuk melihat sesi latihan.', 401)
  }

  const { id } = await context.params

  try {
    const session = await PracticeService.getSession(userId, id)
    return NextResponse.json(session)
  } catch (caughtError) {
    return practiceErrorResponse(caughtError)
  }
}
