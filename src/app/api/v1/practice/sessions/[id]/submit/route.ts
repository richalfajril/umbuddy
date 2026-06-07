import { NextResponse } from 'next/server'
import { validateDto } from '@/server/validation/dto'
import { PracticeService } from '@/services/practice.service'
import { errorResponse, getRequiredUserId, practiceErrorResponse, readJson } from '../../../_utils'
import { validatePracticeAnswers } from '../_answer-validation'
import { PracticeAnswersDto } from '../answers/answers.dto'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function POST(req: Request, context: RouteContext) {
  const userId = await getRequiredUserId()
  if (!userId) {
    return errorResponse('UNAUTHORIZED', 'Kamu perlu masuk dulu untuk mengunci jawaban.', 401)
  }

  const { id } = await context.params
  const { payload, error } = await readJson(req)
  if (error) return error

  const validation = await validateDto(PracticeAnswersDto, payload)
  if (validation.data === null) {
    return errorResponse('VALIDATION_ERROR', 'Jawaban latihan belum valid.', 400, validation.errors)
  }

  const answers = validatePracticeAnswers(validation.data.answers)
  if (!answers.ok) {
    return errorResponse('VALIDATION_ERROR', 'Jawaban latihan belum valid.', 400, answers.errors)
  }

  try {
    const result = await PracticeService.submitSession(userId, id, answers.answers)
    return NextResponse.json(result)
  } catch (caughtError) {
    return practiceErrorResponse(caughtError)
  }
}
