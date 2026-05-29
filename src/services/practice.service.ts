import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

const PRACTICE_DURATION_SECONDS = 5 * 60
const PRACTICE_SUBMIT_GRACE_SECONDS = 30
const DEFAULT_QUESTION_COUNT = 5
const MAX_QUESTION_COUNT = 10
const ANSWER_OPTIONS = ['A', 'B', 'C', 'D', 'E'] as const
const PRACTICE_XP_SOURCE = 'PRACTICE_SESSION'

export type PracticeCategory = 'TWK' | 'TIU' | 'TKP'
export type PracticeDifficulty = 'easy' | 'medium' | 'hard' | 'mixed'
export type PracticeMode = 'QUICK' | 'GUIDED'

type TransactionClient = Omit<
  typeof prisma,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

export interface PracticeSessionInput {
  category: PracticeCategory
  difficulty: PracticeDifficulty
  mode: PracticeMode
  question_count?: number
}

export interface PracticeAnswerInput {
  question_id: string
  selected_option: string
  time_spent: number
  flagged?: boolean
}

interface PrivatePracticeQuestion {
  id: string
  category: PracticeCategory
  text: string
  options: Record<string, string>
  answer_key?: string | null
  tkp_weights?: Record<string, number> | null
  explanation?: string | null
  source: 'db' | 'fallback'
}

interface PracticeMetadata {
  practice?: {
    duration_seconds?: number
    fallback_used?: boolean
    questions?: PrivatePracticeQuestion[]
    autosave?: PracticeAnswerInput[]
  }
  practice_result?: PracticeResultPayload
}

interface PracticeReviewItem {
  question_id: string
  category: PracticeCategory
  text: string
  options: Record<string, string>
  selected_option: string | null
  answer_key: string | null
  correct: boolean | null
  score: number
  time_spent: number
  explanation: string | null
}

interface PracticeResultPayload {
  session_id: string
  score: number
  correct_count: number
  total_questions: number
  average_time: number
  breakdown: Record<PracticeCategory, { attempted: number; correct: number; score: number }>
  review: PracticeReviewItem[]
  recommendations: Array<{ category: PracticeCategory; message: string }>
  xp_award: { xp: number; already_claimed: boolean }
}

export class PracticeError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400
  ) {
    super(message)
  }
}

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}

function normalizeScore(score: number): number {
  return Number(score.toFixed(2))
}

function toOptions(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key, option]) => ANSWER_OPTIONS.includes(key as (typeof ANSWER_OPTIONS)[number]) && typeof option === 'string')
      .map(([key, option]) => [key, String(option)])
  )
}

function toWeights(value: unknown): Record<string, number> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const weights = Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => ANSWER_OPTIONS.includes(key as (typeof ANSWER_OPTIONS)[number]))
      .map(([key, score]) => [key, Number(score)])
      .filter(([, score]) => Number.isFinite(score))
  )

  return Object.keys(weights).length > 0 ? weights : null
}

function toPublicQuestion(question: PrivatePracticeQuestion) {
  return {
    id: question.id,
    category: question.category,
    text: question.text,
    options: question.options,
    source: question.source,
  }
}

function getPracticeQuestionsFromMetadata(metadata: unknown): PrivatePracticeQuestion[] {
  const practiceMetadata = metadata as PracticeMetadata | null
  const questions = practiceMetadata?.practice?.questions
  return Array.isArray(questions) ? questions : []
}

function getPracticeResultFromMetadata(metadata: unknown): PracticeResultPayload | null {
  const practiceMetadata = metadata as PracticeMetadata | null
  return practiceMetadata?.practice_result ?? null
}

function getDurationSeconds(metadata: unknown): number {
  const practiceMetadata = metadata as PracticeMetadata | null
  const duration = practiceMetadata?.practice?.duration_seconds
  return Number.isFinite(duration) && duration ? Number(duration) : PRACTICE_DURATION_SECONDS
}

function mergeMetadata(metadata: unknown, patch: Partial<PracticeMetadata>): Prisma.InputJsonValue {
  const current =
    metadata && typeof metadata === 'object' && !Array.isArray(metadata)
      ? (metadata as Record<string, unknown>)
      : {}

  return toInputJson({
    ...current,
    ...patch,
    practice: {
      ...((current.practice && typeof current.practice === 'object' && !Array.isArray(current.practice))
        ? current.practice
        : {}),
      ...(patch.practice ?? {}),
    },
  })
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

function getFallbackQuestions(category: PracticeCategory, count: number): PrivatePracticeQuestion[] {
  const fallbackByCategory: Record<PracticeCategory, Array<Omit<PrivatePracticeQuestion, 'source'>>> = {
    TWK: [
      {
        id: 'fallback-practice-twk-1',
        category: 'TWK',
        text: 'Nilai Pancasila yang paling tampak saat warga bermusyawarah untuk menyelesaikan masalah lingkungan adalah ...',
        options: {
          A: 'Keadilan sosial',
          B: 'Persatuan Indonesia',
          C: 'Kerakyatan yang dipimpin oleh hikmat kebijaksanaan',
          D: 'Ketuhanan Yang Maha Esa',
          E: 'Kemanusiaan yang adil dan beradab',
        },
        answer_key: 'C',
        explanation: 'Musyawarah untuk mufakat merupakan pengamalan utama sila keempat Pancasila.',
      },
      {
        id: 'fallback-practice-twk-2',
        category: 'TWK',
        text: 'Contoh bela negara non-fisik bagi pelajar adalah ...',
        options: {
          A: 'Menolak semua budaya asing',
          B: 'Belajar tekun dan berprestasi untuk bangsa',
          C: 'Membatasi pergaulan antardaerah',
          D: 'Menyebarkan informasi tanpa verifikasi',
          E: 'Menghindari kegiatan sosial',
        },
        answer_key: 'B',
        explanation: 'Bela negara non-fisik bisa dilakukan lewat kompetensi, prestasi, dan kontribusi positif.',
      },
    ],
    TIU: [
      {
        id: 'fallback-practice-tiu-1',
        category: 'TIU',
        text: '2, 4, 8, 16, ...',
        options: { A: '18', B: '24', C: '30', D: '32', E: '36' },
        answer_key: 'D',
        explanation: 'Deret dikali 2, sehingga setelah 16 adalah 32.',
      },
      {
        id: 'fallback-practice-tiu-2',
        category: 'TIU',
        text: 'BUKU : MEMBACA = PENSIL : ...',
        options: { A: 'Menulis', B: 'Kertas', C: 'Meja', D: 'Menghapus', E: 'Belajar' },
        answer_key: 'A',
        explanation: 'Buku digunakan untuk membaca, pensil digunakan untuk menulis.',
      },
    ],
    TKP: [
      {
        id: 'fallback-practice-tkp-1',
        category: 'TKP',
        text: 'Rekan kerja baru tampak kesulitan memahami prosedur kantor. Sikap Kamu adalah ...',
        options: {
          A: 'Membiarkan agar ia belajar sendiri',
          B: 'Menegurnya karena lambat beradaptasi',
          C: 'Menyapanya dan menawarkan bantuan seperlunya',
          D: 'Meminta atasan menggantinya',
          E: 'Mengambil semua pekerjaannya',
        },
        tkp_weights: { A: 2, B: 1, C: 5, D: 3, E: 4 },
        explanation: 'Pilihan C menunjukkan inisiatif, kerja sama, dan empati yang proporsional.',
      },
      {
        id: 'fallback-practice-tkp-2',
        category: 'TKP',
        text: 'Saat sistem digital baru diterapkan, respons terbaik adalah ...',
        options: {
          A: 'Menunggu sampai diwajibkan',
          B: 'Belajar dari panduan dan rekan yang paham',
          C: 'Tetap memakai cara manual',
          D: 'Mengajak rekan menolak perubahan',
          E: 'Mengikuti pelatihan dengan terpaksa',
        },
        tkp_weights: { A: 4, B: 5, C: 2, D: 1, E: 3 },
        explanation: 'Pilihan B paling proaktif dan adaptif terhadap perubahan teknologi.',
      },
    ],
  }

  const baseQuestions = fallbackByCategory[category].map((question) => ({
    ...question,
    source: 'fallback' as const,
  }))

  return Array.from({ length: count }, (_, index) => baseQuestions[index % baseQuestions.length]).map((question, index) => ({
    ...question,
    id: index < baseQuestions.length ? question.id : `${question.id}-${index + 1}`,
  }))
}

function getBestOption(question: PrivatePracticeQuestion) {
  if (question.answer_key) return question.answer_key
  if (!question.tkp_weights) return null

  return Object.entries(question.tkp_weights).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null
}

function getRecommendation(category: PracticeCategory, score: number) {
  if (score >= 80) {
    return `Mantap, ${category} kamu mulai stabil. Naikkan ritme dengan soal level berikutnya.`
  }

  const messages: Record<PracticeCategory, string> = {
    TWK: 'Perkuat TWK dari fondasi Pancasila, UUD 1945, nasionalisme, dan bela negara.',
    TIU: 'Latih TIU pelan tapi konsisten: analogi, deret, perbandingan, dan silogisme.',
    TKP: 'Bangun pola TKP: pilih respons yang empatik, profesional, dan solutif.',
  }

  return messages[category]
}

export class PracticeService {
  static async startSession(userId: string, input: PracticeSessionInput) {
    const questionCount = Math.max(1, Math.min(input.question_count ?? DEFAULT_QUESTION_COUNT, MAX_QUESTION_COUNT))
    const questions = await this.selectQuestions(input.category, input.difficulty, questionCount)
    const fallbackUsed = questions.some((question) => question.source === 'fallback')

    const session = await prisma.practiceSession.create({
      data: {
        user_id: userId,
        category: input.category,
        difficulty: input.difficulty,
        mode: input.mode,
        status: 'IN_PROGRESS',
        metadata: toInputJson({
          practice: {
            duration_seconds: PRACTICE_DURATION_SECONDS,
            fallback_used: fallbackUsed,
            questions,
          },
        }),
      },
    })

    return {
      session_id: session.id,
      duration_seconds: PRACTICE_DURATION_SECONDS,
      questions: questions.map(toPublicQuestion),
      fallback_used: fallbackUsed,
    }
  }

  static async getSession(userId: string, sessionId: string) {
    const session = await prisma.practiceSession.findFirst({
      where: {
        id: sessionId,
        user_id: userId,
      },
    })

    if (!session) {
      throw new PracticeError('NOT_FOUND', 'Sesi latihan tidak ditemukan.', 404)
    }

    const result = getPracticeResultFromMetadata(session.metadata)
    const questions = getPracticeQuestionsFromMetadata(session.metadata)

    return {
      session_id: session.id,
      status: session.status,
      duration_seconds: PRACTICE_DURATION_SECONDS,
      questions: questions.map(toPublicQuestion),
      result,
    }
  }

  static async autosaveAnswers(userId: string, sessionId: string, answers: PracticeAnswerInput[]) {
    const session = await this.getOwnedInProgressSession(userId, sessionId)
    await this.ensureSessionCanAcceptAnswers(session)
    const questions = getPracticeQuestionsFromMetadata(session.metadata)
    this.validateAnswersForSession(questions, answers)

    await prisma.practiceSession.update({
      where: { id: sessionId },
      data: {
        metadata: mergeMetadata(session.metadata, {
          practice: {
            autosave: answers,
          },
        }),
      },
    })

    return { saved: true, answer_count: answers.length }
  }

  static async submitSession(userId: string, sessionId: string, answers: PracticeAnswerInput[]) {
    const existing = await prisma.practiceSession.findFirst({
      where: {
        id: sessionId,
        user_id: userId,
        mode: { not: 'DIAGNOSTIC' },
      },
    })

    if (!existing) {
      throw new PracticeError('NOT_FOUND', 'Sesi latihan tidak ditemukan.', 404)
    }

    const existingResult = getPracticeResultFromMetadata(existing.metadata)
    if (existing.status === 'SUBMITTED' && existingResult) {
      return existingResult
    }

    if (existing.status !== 'IN_PROGRESS' && existing.status !== 'EXPIRED') {
      throw new PracticeError('INVALID_SESSION_STATUS', 'Sesi latihan ini sudah tidak aktif.', 409)
    }

    const questions = getPracticeQuestionsFromMetadata(existing.metadata)
    if (questions.length === 0) {
      throw new PracticeError('INVALID_SESSION', 'Sesi latihan tidak memiliki daftar soal valid.', 400)
    }

    this.validateAnswersForSession(questions, answers)
    const result = this.calculateResult(sessionId, questions, answers, false)

    return prisma.$transaction(async (tx: TransactionClient) => {
      const dbReviewItems = result.review.filter((item) => questions.find((question) => question.id === item.question_id)?.source === 'db')
      if (dbReviewItems.length > 0) {
        await tx.practiceAttempt.createMany({
          data: dbReviewItems.map((item) => ({
            session_id: sessionId,
            question_id: item.question_id,
            selected_option: item.selected_option,
            correct: item.correct,
            score: item.score,
            time_spent: item.time_spent,
            flagged: answers.find((answer) => answer.question_id === item.question_id)?.flagged ?? false,
          })),
        })
      }

      const idempotencyKey = `practice:${userId}:${sessionId}`
      const existingReward = await tx.userXpEvent.findUnique({
        where: { idempotency_key: idempotencyKey },
      })
      const xpAward = existingReward ? 0 : this.calculateXpAward(result.score, result.total_questions)
      const resultWithReward: PracticeResultPayload = {
        ...result,
        xp_award: {
          xp: existingReward?.total_xp ?? xpAward,
          already_claimed: Boolean(existingReward),
        },
      }

      await tx.practiceSession.update({
        where: { id: sessionId },
        data: {
          status: 'SUBMITTED',
          completed_at: new Date(),
          score: result.score,
          average_time: result.average_time,
          metadata: mergeMetadata(existing.metadata, {
            practice_result: resultWithReward,
          }),
        },
      })

      if (!existingReward) {
        await tx.userXpEvent.create({
          data: {
            user_id: userId,
            source_type: PRACTICE_XP_SOURCE,
            source_id: sessionId,
            idempotency_key: idempotencyKey,
            base_xp: xpAward,
            total_xp: xpAward,
            reason: 'Selesai quick practice',
          },
        })

        await tx.userProgression.upsert({
          where: { user_id: userId },
          update: {
            total_xp: {
              increment: xpAward,
            },
            last_xp_earned_at: new Date(),
          },
          create: {
            user_id: userId,
            total_xp: xpAward,
            level: 1,
            last_xp_earned_at: new Date(),
          },
        })
      }

      return resultWithReward
    })
  }

  static async getHistory(userId: string, page = 1, pageSize = 10) {
    const safePage = Math.max(1, page)
    const safePageSize = Math.max(1, Math.min(pageSize, 20))
    const sessions = await prisma.practiceSession.findMany({
      where: {
        user_id: userId,
        mode: { not: 'DIAGNOSTIC' },
        status: 'SUBMITTED',
      },
      orderBy: { completed_at: 'desc' },
      skip: (safePage - 1) * safePageSize,
      take: safePageSize,
    })

    return {
      sessions: sessions.map((session) => ({
        session_id: session.id,
        category: session.category,
        difficulty: session.difficulty,
        mode: session.mode,
        score: session.score,
        average_time: session.average_time,
        completed_at: session.completed_at?.toISOString() ?? null,
      })),
      page: safePage,
      page_size: safePageSize,
    }
  }

  private static async getOwnedInProgressSession(userId: string, sessionId: string) {
    const session = await prisma.practiceSession.findFirst({
      where: {
        id: sessionId,
        user_id: userId,
        mode: { not: 'DIAGNOSTIC' },
        status: 'IN_PROGRESS',
      },
    })

    if (!session) {
      throw new PracticeError('NOT_FOUND', 'Sesi latihan aktif tidak ditemukan.', 404)
    }

    return session
  }

  private static async ensureSessionCanAcceptAnswers(session: {
    id: string
    started_at: Date
    metadata: Prisma.JsonValue | null
  }) {
    const durationSeconds = getDurationSeconds(session.metadata)
    const startedAt = session.started_at instanceof Date ? session.started_at : new Date(session.started_at)
    const expiresAt = new Date(startedAt.getTime() + (durationSeconds + PRACTICE_SUBMIT_GRACE_SECONDS) * 1000)

    if (Date.now() <= expiresAt.getTime()) return

    await prisma.practiceSession.update({
      where: { id: session.id },
      data: {
        status: 'EXPIRED',
        completed_at: new Date(),
      },
    })

    throw new PracticeError(
      'PRACTICE_EXPIRED',
      'Waktu latihan sudah habis. Mulai latihan baru ya.',
      410
    )
  }

  private static async selectQuestions(category: PracticeCategory, difficulty: PracticeDifficulty, count: number): Promise<PrivatePracticeQuestion[]> {
    const dbQuestions = await prisma.question.findMany({
      where: {
        category,
        status: 'PUBLISHED',
        deleted_at: null,
        ...(difficulty === 'mixed' ? {} : { difficulty }),
      },
      orderBy: [{ package_code: 'asc' }, { number: 'asc' }],
      take: 50,
    })

    const selected = shuffle(dbQuestions).slice(0, count).map((question) => ({
      id: question.id,
      category,
      text: question.text,
      options: toOptions(question.options),
      answer_key: question.answer_key,
      tkp_weights: toWeights(question.tkp_weights),
      explanation: question.explanation,
      source: 'db' as const,
    }))

    const missing = count - selected.length
    if (missing <= 0) return selected

    return [
      ...selected,
      ...getFallbackQuestions(category, missing),
    ]
  }

  private static validateAnswersForSession(questions: PrivatePracticeQuestion[], answers: PracticeAnswerInput[]) {
    const questionIds = new Set(questions.map((question) => question.id))
    const seenIds = new Set<string>()

    for (const answer of answers) {
      if (!questionIds.has(answer.question_id)) {
        throw new PracticeError('INVALID_ANSWER', 'Jawaban berisi soal yang bukan bagian dari sesi latihan.', 400)
      }

      if (seenIds.has(answer.question_id)) {
        throw new PracticeError('INVALID_ANSWER', 'Jawaban tidak boleh memiliki question_id duplikat.', 400)
      }

      if (!ANSWER_OPTIONS.includes(answer.selected_option as (typeof ANSWER_OPTIONS)[number])) {
        throw new PracticeError('INVALID_ANSWER', 'Pilihan jawaban harus A, B, C, D, atau E.', 400)
      }

      seenIds.add(answer.question_id)
    }
  }

  private static calculateResult(
    sessionId: string,
    questions: PrivatePracticeQuestion[],
    answers: PracticeAnswerInput[],
    rewardAlreadyClaimed: boolean
  ): PracticeResultPayload {
    const answersByQuestionId = new Map(answers.map((answer) => [answer.question_id, answer]))
    const breakdown: PracticeResultPayload['breakdown'] = {
      TWK: { attempted: 0, correct: 0, score: 0 },
      TIU: { attempted: 0, correct: 0, score: 0 },
      TKP: { attempted: 0, correct: 0, score: 0 },
    }
    let correctCount = 0
    let totalQuestionScore = 0
    let totalTime = 0

    const review = questions.map((question) => {
      const answer = answersByQuestionId.get(question.id)
      const selectedOption = answer?.selected_option ?? null
      const timeSpent = answer?.time_spent ?? 0
      const answerKey = getBestOption(question)
      let score = 0
      let correct: boolean | null = null

      if (selectedOption && question.category === 'TKP') {
        const maxWeight = Math.max(...Object.values(question.tkp_weights ?? { E: 5 }))
        const selectedWeight = question.tkp_weights?.[selectedOption] ?? 0
        score = maxWeight > 0 ? (selectedWeight / maxWeight) * 100 : 0
        correct = selectedWeight === maxWeight
      } else if (selectedOption && question.answer_key) {
        correct = selectedOption === question.answer_key
        score = correct ? 100 : 0
      }

      if (correct) correctCount += 1
      totalQuestionScore += score
      totalTime += timeSpent
      breakdown[question.category].attempted += 1
      breakdown[question.category].score += score
      if (correct) breakdown[question.category].correct += 1

      return {
        question_id: question.id,
        category: question.category,
        text: question.text,
        options: question.options,
        selected_option: selectedOption,
        answer_key: answerKey,
        correct,
        score: normalizeScore(score),
        time_spent: timeSpent,
        explanation: question.explanation ?? null,
      }
    })

    for (const category of Object.keys(breakdown) as PracticeCategory[]) {
      const categoryBreakdown = breakdown[category]
      categoryBreakdown.score = categoryBreakdown.attempted > 0
        ? normalizeScore(categoryBreakdown.score / categoryBreakdown.attempted)
        : 0
    }

    const score = questions.length > 0 ? normalizeScore(totalQuestionScore / questions.length) : 0
    const averageTime = answers.length > 0 ? normalizeScore(totalTime / answers.length) : 0
    const weakestCategory = (Object.keys(breakdown) as PracticeCategory[])
      .filter((category) => breakdown[category].attempted > 0)
      .sort((a, b) => breakdown[a].score - breakdown[b].score)[0] ?? questions[0]?.category ?? 'TWK'

    return {
      session_id: sessionId,
      score,
      correct_count: correctCount,
      total_questions: questions.length,
      average_time: averageTime,
      breakdown,
      review,
      recommendations: [
        {
          category: weakestCategory,
          message: getRecommendation(weakestCategory, breakdown[weakestCategory].score),
        },
      ],
      xp_award: {
        xp: 0,
        already_claimed: rewardAlreadyClaimed,
      },
    }
  }

  private static calculateXpAward(score: number, totalQuestions: number) {
    if (totalQuestions === 0) return 0
    return 10 + Math.round(score / 10)
  }
}
