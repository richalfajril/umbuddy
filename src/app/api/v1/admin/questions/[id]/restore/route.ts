import { NextResponse } from 'next/server'
import { AdminQuestionService } from '@/server/admin-questions'
import { apiErrorResponse } from '@/server/api/route-utils'
import { adminQuestionErrorResponse, getRequiredAdmin } from '@/server/api/admin.route-utils'

type RouteContext = {
  params: Promise<{ id: string }>
}

// Endpoint restore mengembalikan Archived menjadi Draft untuk review ulang.
export async function POST(_req: Request, context: RouteContext) {
  const session = await getRequiredAdmin()
  if (!session) return apiErrorResponse('UNAUTHORIZED', 'Kamu perlu login sebagai admin.', 401)

  const { id } = await context.params

  try {
    const question = await AdminQuestionService.restoreQuestion(session.admin, id)
    return NextResponse.json({ question })
  } catch (error) {
    return adminQuestionErrorResponse(error)
  }
}

