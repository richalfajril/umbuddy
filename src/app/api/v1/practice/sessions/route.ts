import { NextResponse } from 'next/server'
import { validateDto } from '@/server/validation/dto'
import { PracticeService } from '@/server/services/practice.service'
import { errorResponse, getRequiredUserId, practiceErrorResponse, readJson } from '../_utils'
import { StartPracticeSessionDto } from '@/server/validation/practice/start-session.dto'

export async function POST(req: Request) {
  const userId = await getRequiredUserId()
  if (!userId) {
    return errorResponse('UNAUTHORIZED', 'Kamu perlu masuk dulu untuk mulai latihan.', 401)
  }

  const { payload, error } = await readJson(req)
  if (error) return error

  const validation = await validateDto(StartPracticeSessionDto, payload)
  if (validation.data === null) {
    return errorResponse('VALIDATION_ERROR', 'Data latihan belum valid.', 400, validation.errors)
  }

  try {
    const session = await PracticeService.startSession(userId, {
      category: validation.data.category,
      difficulty: validation.data.difficulty,
      mode: validation.data.mode,
      question_count: validation.data.question_count,
    })

    return NextResponse.json(session)
  } catch (caughtError) {
    return practiceErrorResponse(caughtError)
  }
}
