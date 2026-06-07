import { NextResponse } from 'next/server'
import { validateDto } from '@/server/validation/dto'
import { OnboardingService, type DiagnosticAnswerInput } from '@/server/services/onboarding.service'
import { apiErrorResponse, getRequiredUserId, readApiJson } from '@/server/api/route-utils'
import { onboardingErrorResponse } from '@/server/api/onboarding.route-utils'
import { DiagnosticSubmitDto } from '@/server/validation/onboarding/submit.dto'

type RouteContext = {
  params: Promise<{ id: string }>
}

const ANSWER_OPTIONS = ['A', 'B', 'C', 'D', 'E']

type AnswerValidationResult =
  | { ok: true; answers: DiagnosticAnswerInput[] }
  | { ok: false; errors: Array<{ field: string; message: string }> }

function validateAnswers(payload: unknown[]): AnswerValidationResult {
  const seenQuestionIds = new Set<string>()
  const answers: DiagnosticAnswerInput[] = []

  for (const [index, item] of payload.entries()) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return { ok: false, errors: [{ field: `answers.${index}`, message: 'Jawaban harus berupa objek.' }] }
    }

    const answer = item as Record<string, unknown>
    const allowedKeys = ['question_id', 'selected_option', 'time_spent']
    const unknownKeys = Object.keys(answer).filter((key) => !allowedKeys.includes(key))
    if (unknownKeys.length > 0) {
      return { ok: false, errors: [{ field: `answers.${index}`, message: 'Jawaban hanya boleh berisi question_id, selected_option, dan time_spent.' }] }
    }

    if (typeof answer.question_id !== 'string' || answer.question_id.length < 1) {
      return { ok: false, errors: [{ field: `answers.${index}.question_id`, message: 'question_id wajib diisi.' }] }
    }

    if (seenQuestionIds.has(answer.question_id)) {
      return { ok: false, errors: [{ field: `answers.${index}.question_id`, message: 'question_id tidak boleh duplikat.' }] }
    }

    if (typeof answer.selected_option !== 'string' || !ANSWER_OPTIONS.includes(answer.selected_option)) {
      return { ok: false, errors: [{ field: `answers.${index}.selected_option`, message: 'selected_option harus A, B, C, D, atau E.' }] }
    }

    const timeSpent = answer.time_spent
    if (typeof timeSpent !== 'number' || !Number.isInteger(timeSpent) || timeSpent < 0 || timeSpent > 900) {
      return { ok: false, errors: [{ field: `answers.${index}.time_spent`, message: 'time_spent harus dalam rentang 0 sampai 900 detik.' }] }
    }

    seenQuestionIds.add(answer.question_id)
    answers.push({
      question_id: answer.question_id,
      selected_option: answer.selected_option,
      time_spent: timeSpent,
    })
  }

  return { ok: true, answers }
}

export async function POST(req: Request, context: RouteContext) {
  const userId = await getRequiredUserId()
  if (!userId) {
    return apiErrorResponse('UNAUTHORIZED', 'Kamu perlu masuk dulu untuk mengunci jawaban.', 401)
  }

  const { id } = await context.params
  const { payload, error } = await readApiJson(req)
  if (error) return error

  const validation = await validateDto(DiagnosticSubmitDto, payload)
  if (validation.data === null) {
    return apiErrorResponse(
      'VALIDATION_ERROR',
      'Jawaban diagnostic belum valid.',
      400,
      validation.errors
    )
  }

  const answers = validateAnswers(validation.data.answers)
  if (!answers.ok) {
    return apiErrorResponse('VALIDATION_ERROR', 'Jawaban diagnostic belum valid.', 400, answers.errors)
  }

  try {
    const result = await OnboardingService.submitDiagnostic(userId, id, answers.answers)
    return NextResponse.json(result)
  } catch (caughtError) {
    return onboardingErrorResponse(caughtError)
  }
}
