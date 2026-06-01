import { NextResponse } from 'next/server'
import { AdminQuestionService, parseAdminQuestionMutationPayload } from '@/server/admin-questions'
import { adminErrorResponse, adminQuestionErrorResponse, getRequiredAdmin, readAdminJson } from '../../_utils'

type RouteContext = {
  params: Promise<{ id: string }>
}

// Endpoint detail soal untuk preview/edit drawer.
export async function GET(_req: Request, context: RouteContext) {
  const session = await getRequiredAdmin()
  if (!session) return adminErrorResponse('UNAUTHORIZED', 'Kamu perlu login sebagai admin.', 401)

  const { id } = await context.params

  try {
    const question = await AdminQuestionService.getQuestion(session.admin, id)
    return NextResponse.json({ question })
  } catch (error) {
    return adminQuestionErrorResponse(error)
  }
}

// Endpoint update hanya mengizinkan perubahan pada soal Draft.
export async function PUT(req: Request, context: RouteContext) {
  const session = await getRequiredAdmin()
  if (!session) return adminErrorResponse('UNAUTHORIZED', 'Kamu perlu login sebagai admin.', 401)

  const { id } = await context.params
  const { payload, error } = await readAdminJson(req)
  if (error) return error

  try {
    const input = parseAdminQuestionMutationPayload(payload)
    const question = await AdminQuestionService.updateQuestion(session.admin, id, input)
    return NextResponse.json({ question })
  } catch (caughtError) {
    return adminQuestionErrorResponse(caughtError)
  }
}

