import { NextResponse } from 'next/server'
import { AdminQuestionService } from '@/server/admin-questions'
import { adminErrorResponse, adminQuestionErrorResponse, getRequiredAdmin } from '../../../_utils'

type RouteContext = {
  params: Promise<{ id: string }>
}

// Endpoint archive adalah soft delete agar riwayat attempt tetap aman.
export async function POST(_req: Request, context: RouteContext) {
  const session = await getRequiredAdmin()
  if (!session) return adminErrorResponse('UNAUTHORIZED', 'Kamu perlu login sebagai admin.', 401)

  const { id } = await context.params

  try {
    const question = await AdminQuestionService.archiveQuestion(session.admin, id)
    return NextResponse.json({ question })
  } catch (error) {
    return adminQuestionErrorResponse(error)
  }
}

