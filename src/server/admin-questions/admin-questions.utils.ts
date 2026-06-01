import type { Prisma } from '@prisma/client'
import {
  ADMIN_QUESTION_CATEGORIES,
  ADMIN_QUESTION_DIFFICULTIES,
  ADMIN_QUESTION_OPTIONS,
  ADMIN_QUESTION_STATUSES,
} from './admin-questions.constants'
import type {
  AdminQuestionCategory,
  AdminQuestionListItem,
  AdminQuestionMutationInput,
  AdminQuestionStatus,
} from './admin-questions.types'

// Error domain A2 agar route handler bisa mengembalikan response aman dan konsisten.
export class AdminQuestionError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
    public readonly details: Array<{ field: string; message: string }> = []
  ) {
    super(message)
  }
}

// Mengecek nilai category dari query/body sebelum dipakai di Prisma.
export function isAdminQuestionCategory(value: unknown): value is AdminQuestionCategory {
  return typeof value === 'string' && ADMIN_QUESTION_CATEGORIES.includes(value as AdminQuestionCategory)
}

// Mengecek nilai status dari query sebelum dipakai sebagai filter.
export function isAdminQuestionStatus(value: unknown): value is AdminQuestionStatus {
  return typeof value === 'string' && ADMIN_QUESTION_STATUSES.includes(value as AdminQuestionStatus)
}

// Mengubah unknown JSON options menjadi object A-E yang aman.
function normalizeOptions(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const options = Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => ADMIN_QUESTION_OPTIONS.includes(key as (typeof ADMIN_QUESTION_OPTIONS)[number]))
      .map(([key, option]) => [key, typeof option === 'string' ? option.trim() : ''])
      .filter(([, option]) => option.length > 0)
  )

  return Object.keys(options).length > 0 ? options : null
}

// Mengubah unknown JSON TKP weights menjadi object skor 1-5 yang aman.
function normalizeTkpWeights(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const weights = Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => ADMIN_QUESTION_OPTIONS.includes(key as (typeof ADMIN_QUESTION_OPTIONS)[number]))
      .map(([key, score]) => {
        const normalizedScore = Number(score)
        return [key, normalizedScore] as const
      })
      .filter(([, score]) => Number.isInteger(score) && score >= 1 && score <= 5)
  )

  return Object.keys(weights).length > 0 ? weights : null
}

// Validasi payload create/update agar answer key dan bobot TKP tidak bisa dipalsukan client.
export function parseAdminQuestionMutationPayload(payload: unknown): AdminQuestionMutationInput {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new AdminQuestionError('VALIDATION_ERROR', 'Data soal harus berupa objek.', 400)
  }

  const data = payload as Record<string, unknown>
  const category = data.category
  const packageCode = typeof data.package_code === 'string' ? data.package_code.trim() : ''
  const number = typeof data.number === 'number' ? data.number : Number(data.number)
  const text = typeof data.text === 'string' ? data.text.trim() : ''
  const explanation = typeof data.explanation === 'string' ? data.explanation.trim() : ''
  const difficulty = typeof data.difficulty === 'string' ? data.difficulty.trim().toLowerCase() : ''
  const options = normalizeOptions(data.options)
  const details: Array<{ field: string; message: string }> = []

  if (!isAdminQuestionCategory(category)) details.push({ field: 'category', message: 'Kategori harus TWK, TIU, atau TKP.' })
  if (!packageCode) details.push({ field: 'package_code', message: 'Kode paket wajib diisi.' })
  if (!Number.isInteger(number) || number < 1) details.push({ field: 'number', message: 'Nomor soal harus angka positif.' })
  if (!text || text.length > 5000) details.push({ field: 'text', message: 'Pertanyaan wajib diisi dan maksimal 5000 karakter.' })
  if (!explanation || explanation.length > 5000) details.push({ field: 'explanation', message: 'Pembahasan wajib diisi dan maksimal 5000 karakter.' })
  if (!options) details.push({ field: 'options', message: 'Pilihan jawaban wajib diisi.' })

  const requiredOptions = ['A', 'B', 'C', 'D']
  for (const option of requiredOptions) {
    if (!options?.[option]) details.push({ field: `options.${option}`, message: `Pilihan ${option} wajib diisi.` })
  }

  if (difficulty && !ADMIN_QUESTION_DIFFICULTIES.includes(difficulty as (typeof ADMIN_QUESTION_DIFFICULTIES)[number])) {
    details.push({ field: 'difficulty', message: 'Difficulty harus easy, medium, atau hard.' })
  }

  const answerKey = typeof data.answer_key === 'string' ? data.answer_key.trim().toUpperCase() : ''
  const tkpWeights = normalizeTkpWeights(data.tkp_weights)

  if (category === 'TKP') {
    for (const option of Object.keys(options ?? {})) {
      if (!tkpWeights?.[option]) details.push({ field: `tkp_weights.${option}`, message: `Bobot TKP untuk ${option} wajib 1-5.` })
    }
  } else {
    if (!ADMIN_QUESTION_OPTIONS.includes(answerKey as (typeof ADMIN_QUESTION_OPTIONS)[number]) || !options?.[answerKey]) {
      details.push({ field: 'answer_key', message: 'Kunci jawaban harus sesuai pilihan yang tersedia.' })
    }
  }

  if (details.length > 0 || !isAdminQuestionCategory(category) || !options) {
    throw new AdminQuestionError('VALIDATION_ERROR', 'Data soal belum valid.', 400, details)
  }

  return {
    category,
    package_code: packageCode,
    number,
    text,
    options,
    answer_key: category === 'TKP' ? null : answerKey,
    tkp_weights: category === 'TKP' ? tkpWeights : null,
    explanation,
    difficulty: difficulty || null,
  }
}

// Mengubah data Prisma Question menjadi response aman untuk backoffice.
export function toAdminQuestionListItem(question: {
  id: string
  category: AdminQuestionCategory
  package_code: string
  number: number
  text: string
  options: Prisma.JsonValue
  answer_key: string | null
  tkp_weights: Prisma.JsonValue | null
  explanation: string | null
  difficulty: string | null
  status: AdminQuestionStatus
  created_at: Date
  updated_at: Date
}): AdminQuestionListItem {
  return {
    id: question.id,
    category: question.category,
    package_code: question.package_code,
    number: question.number,
    text: question.text,
    options: normalizeOptions(question.options) ?? {},
    answer_key: question.answer_key,
    tkp_weights: normalizeTkpWeights(question.tkp_weights),
    explanation: question.explanation,
    difficulty: question.difficulty,
    status: question.status,
    created_at: question.created_at.toISOString(),
    updated_at: question.updated_at.toISOString(),
  }
}

// Helper deteksi unique constraint Prisma tanpa mengekspos error internal.
export function isUniqueConstraintError(error: unknown) {
  return Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: unknown }).code === 'P2002')
}

// JSON helper agar Prisma menerima object hasil validasi sebagai Json input.
export function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}
