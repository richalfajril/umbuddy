import { NextResponse } from 'next/server'
import {
  AdminQuestionService,
  isAdminQuestionCategory,
  isAdminQuestionStatus,
  parseAdminQuestionMutationPayload,
} from '@/server/admin-questions'
import { adminErrorResponse, adminQuestionErrorResponse, getRequiredAdmin, readAdminJson } from '../_utils'

// Endpoint list soal admin dengan filter ringan sesuai API spec A2.
export async function GET(req: Request) {
  const session = await getRequiredAdmin()
  if (!session) return adminErrorResponse('UNAUTHORIZED', 'Kamu perlu login sebagai admin.', 401)

  const url = new URL(req.url)
  const status = url.searchParams.get('status')?.toUpperCase()
  const category = url.searchParams.get('category')?.toUpperCase()
  const page = Number(url.searchParams.get('page') ?? 1)
  const pageSize = Number(url.searchParams.get('page_size') ?? 20)
  const keyword = url.searchParams.get('keyword') ?? undefined

  try {
    const result = await AdminQuestionService.listQuestions(session.admin, {
      status: isAdminQuestionStatus(status) ? status : undefined,
      category: isAdminQuestionCategory(category) ? category : undefined,
      keyword,
      page,
      page_size: pageSize,
    })

    return NextResponse.json(result)
  } catch (error) {
    return adminQuestionErrorResponse(error)
  }
}

// Endpoint create soal selalu menyimpan sebagai Draft.
export async function POST(req: Request) {
  const session = await getRequiredAdmin()
  if (!session) return adminErrorResponse('UNAUTHORIZED', 'Kamu perlu login sebagai admin.', 401)

  const { payload, error } = await readAdminJson(req)
  if (error) return error

  try {
    const input = parseAdminQuestionMutationPayload(payload)
    const question = await AdminQuestionService.createQuestion(session.admin, input)
    return NextResponse.json({ question }, { status: 201 })
  } catch (caughtError) {
    return adminQuestionErrorResponse(caughtError)
  }
}

