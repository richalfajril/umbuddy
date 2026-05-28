import type { PracticeAnswerInput } from '@/services/practice.service'

const ANSWER_OPTIONS = ['A', 'B', 'C', 'D', 'E']

type AnswerValidationResult =
  | { ok: true; answers: PracticeAnswerInput[] }
  | { ok: false; errors: Array<{ field: string; message: string }> }

export function validatePracticeAnswers(payload: unknown[]): AnswerValidationResult {
  const seenQuestionIds = new Set<string>()
  const answers: PracticeAnswerInput[] = []

  for (const [index, item] of payload.entries()) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return { ok: false, errors: [{ field: `answers.${index}`, message: 'Jawaban harus berupa objek.' }] }
    }

    const answer = item as Record<string, unknown>
    const allowedKeys = ['question_id', 'selected_option', 'time_spent', 'flagged']
    const unknownKeys = Object.keys(answer).filter((key) => !allowedKeys.includes(key))
    if (unknownKeys.length > 0) {
      return { ok: false, errors: [{ field: `answers.${index}`, message: 'Jawaban hanya boleh berisi question_id, selected_option, time_spent, dan flagged.' }] }
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
    if (typeof timeSpent !== 'number' || !Number.isInteger(timeSpent) || timeSpent < 0 || timeSpent > 300) {
      return { ok: false, errors: [{ field: `answers.${index}.time_spent`, message: 'time_spent harus dalam rentang 0 sampai 300 detik.' }] }
    }

    if (answer.flagged !== undefined && typeof answer.flagged !== 'boolean') {
      return { ok: false, errors: [{ field: `answers.${index}.flagged`, message: 'flagged harus boolean.' }] }
    }

    seenQuestionIds.add(answer.question_id)
    answers.push({
      question_id: answer.question_id,
      selected_option: answer.selected_option,
      time_spent: timeSpent,
      flagged: answer.flagged === true,
    })
  }

  return { ok: true, answers }
}
