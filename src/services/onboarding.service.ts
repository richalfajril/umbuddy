import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

const DIAGNOSTIC_MODE = 'DIAGNOSTIC'
const ONBOARDING_REWARD_XP = 50
const DIAGNOSTIC_DURATION_SECONDS = 15 * 60
const ANSWER_OPTIONS = ['A', 'B', 'C', 'D', 'E'] as const

const CATEGORY_CONFIG = {
  TWK: { count: 5, maxScore: 150, label: 'TWK', packageCode: 'U18_DIAGNOSTIC_TWK' },
  TIU: { count: 5, maxScore: 175, label: 'TIU', packageCode: 'U18_DIAGNOSTIC_TIU' },
  TKP: { count: 5, maxScore: 225, label: 'TKP', packageCode: 'U18_DIAGNOSTIC_TKP' },
} as const

type DiagnosticCategory = keyof typeof CATEGORY_CONFIG

type TransactionClient = Omit<
  typeof prisma,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

export interface OnboardingProfileInput {
  target_instansi: string
  target_score: number
  exam_date: string
  province: string
  city: string
  institution?: string
  major?: string
  phone?: string
}

export interface DiagnosticAnswerInput {
  question_id: string
  selected_option: string
  time_spent: number
}

interface PrivateDiagnosticQuestion {
  id: string
  category: DiagnosticCategory
  text: string
  options: Record<string, string>
  answer_key?: string | null
  tkp_weights?: Record<string, number> | null
  explanation?: string | null
  source: 'db' | 'fallback'
}

export interface PublicDiagnosticQuestion {
  id: string
  category: DiagnosticCategory
  text: string
  options: Record<string, string>
  source: 'db' | 'fallback'
}

interface DiagnosticMetadata {
  diagnostic?: {
    fallback_used?: boolean
    questions?: PrivateDiagnosticQuestion[]
  }
}

export class OnboardingError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400
  ) {
    super(message)
  }
}

function sanitizeText(value: string, maxLength = 120): string {
  return value
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
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

function toPublicQuestion(question: PrivateDiagnosticQuestion): PublicDiagnosticQuestion {
  return {
    id: question.id,
    category: question.category,
    text: question.text,
    options: question.options,
    source: question.source,
  }
}

function normalizeScore(score: number): number {
  return Number(score.toFixed(2))
}

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}

function getFallbackQuestions(): PrivateDiagnosticQuestion[] {
  const buildQuestion = (
    id: string,
    category: DiagnosticCategory,
    text: string,
    answerOrWeights: string | Record<string, number>
  ): PrivateDiagnosticQuestion => ({
    id,
    category,
    text,
    options: {
      A: 'Pilihan A',
      B: 'Pilihan B',
      C: 'Pilihan C',
      D: 'Pilihan D',
      E: 'Pilihan E',
    },
    answer_key: typeof answerOrWeights === 'string' ? answerOrWeights : null,
    tkp_weights: typeof answerOrWeights === 'string' ? null : answerOrWeights,
    explanation: 'Soal fallback diagnostik dipakai sementara sampai bank soal published tersedia.',
    source: 'fallback',
  })

  return [
    ...Array.from({ length: CATEGORY_CONFIG.TWK.count }, (_, index) =>
      buildQuestion(`fallback-twk-${index + 1}`, 'TWK', `Mini TWK ${index + 1}: pilih jawaban yang paling tepat.`, index % 2 === 0 ? 'A' : 'C')
    ),
    ...Array.from({ length: CATEGORY_CONFIG.TIU.count }, (_, index) =>
      buildQuestion(`fallback-tiu-${index + 1}`, 'TIU', `Mini TIU ${index + 1}: pilih jawaban yang paling logis.`, index % 2 === 0 ? 'B' : 'D')
    ),
    ...Array.from({ length: CATEGORY_CONFIG.TKP.count }, (_, index) =>
      buildQuestion(`fallback-tkp-${index + 1}`, 'TKP', `Mini TKP ${index + 1}: pilih respons kerja terbaik.`, {
        A: 1,
        B: 2,
        C: 3,
        D: 4,
        E: 5 - (index % 2),
      })
    ),
  ]
}

function getDiagnosticQuestionsFromMetadata(metadata: unknown): PrivateDiagnosticQuestion[] {
  const diagnosticMetadata = metadata as DiagnosticMetadata | null
  const questions = diagnosticMetadata?.diagnostic?.questions
  return Array.isArray(questions) ? questions : []
}

function getWeakestCategory(scores: Record<DiagnosticCategory, number>) {
  const entries = (Object.keys(CATEGORY_CONFIG) as DiagnosticCategory[]).map((category) => ({
    category,
    score: scores[category],
    ratio: scores[category] / CATEGORY_CONFIG[category].maxScore,
  }))

  return entries.sort((a, b) => a.ratio - b.ratio)[0]
}

function getRecommendation(category: DiagnosticCategory) {
  const recommendationByCategory: Record<DiagnosticCategory, string> = {
    TWK: 'Mulai dari latihan TWK ringan: Pancasila, UUD 1945, dan nasionalisme. Kamu cukup bangun fondasi dulu.',
    TIU: 'Fokus ke TIU dasar: deret angka, analogi, dan logika analitis. Pelan tapi rapi, nanti speed ikut naik.',
    TKP: 'Perkuat TKP dengan pola pelayanan publik, integritas, dan kerja sama. Cari jawaban yang paling matang, bukan paling ekstrem.',
  }

  return recommendationByCategory[category]
}

export class OnboardingService {
  private static async ensureOnboardingOpen(userId: string) {
    const onboarding = await prisma.onboardingState.findUnique({
      where: { user_id: userId },
      select: { completed_at: true },
    })

    if (onboarding?.completed_at) {
      throw new OnboardingError(
        'ONBOARDING_ALREADY_COMPLETED',
        'Onboarding kamu sudah selesai. Yuk lanjut ke dashboard.',
        409
      )
    }
  }

  static async getStatus(userId: string) {
    const [profile, onboarding, diagnosticAttempt] = await Promise.all([
      prisma.userProfile.findUnique({
        where: { user_id: userId },
      }),
      prisma.onboardingState.findUnique({
        where: { user_id: userId },
      }),
      prisma.diagnosticAttempt.findFirst({
        where: { user_id: userId },
        orderBy: { completed_at: 'desc' },
      }),
    ])

    const currentStep = onboarding?.completed_at
      ? 'completed'
      : onboarding?.profile_completed_at
        ? 'diagnostic'
        : 'profile'

    return {
      current_step: currentStep,
      profile_completed: Boolean(onboarding?.profile_completed_at),
      diagnostic_completed: Boolean(onboarding?.diagnostic_completed_at),
      completed: Boolean(onboarding?.completed_at),
      profile: profile
        ? {
            target_instansi: profile.target_instansi,
            target_score: profile.target_score,
            exam_date: profile.exam_date?.toISOString() ?? null,
            province: profile.province,
            city: profile.city,
            institution: profile.institution,
            major: profile.major,
          }
        : null,
      result: diagnosticAttempt
        ? this.toResultPayload(diagnosticAttempt)
        : null,
    }
  }

  static async saveProfile(userId: string, input: OnboardingProfileInput) {
    await this.ensureOnboardingOpen(userId)

    const targetInstansi = sanitizeText(input.target_instansi)
    const province = sanitizeText(input.province)
    const city = sanitizeText(input.city)
    const institution = input.institution ? sanitizeText(input.institution) : undefined
    const major = input.major ? sanitizeText(input.major) : undefined
    const phone = input.phone ? sanitizeText(input.phone, 32) : undefined
    const examDate = new Date(input.exam_date)

    if (!targetInstansi || !province || !city || Number.isNaN(examDate.getTime())) {
      throw new OnboardingError('VALIDATION_ERROR', 'Data profil onboarding belum lengkap.', 400)
    }

    return prisma.$transaction(async (tx: TransactionClient) => {
      await tx.user.update({
        where: { id: userId },
        data: phone ? { phone } : {},
      })

      const profile = await tx.userProfile.upsert({
        where: { user_id: userId },
        update: {
          target_instansi: targetInstansi,
          target_score: input.target_score,
          exam_date: examDate,
          province,
          city,
          institution,
          major,
        },
        create: {
          user_id: userId,
          target_instansi: targetInstansi,
          target_score: input.target_score,
          exam_date: examDate,
          province,
          city,
          institution,
          major,
        },
      })

      await tx.onboardingState.upsert({
        where: { user_id: userId },
        update: {
          profile_completed_at: new Date(),
        },
        create: {
          user_id: userId,
          profile_completed_at: new Date(),
        },
      })

      return {
        profile: {
          target_instansi: profile.target_instansi,
          target_score: profile.target_score,
          exam_date: profile.exam_date?.toISOString() ?? null,
          province: profile.province,
          city: profile.city,
          institution: profile.institution,
          major: profile.major,
        },
      }
    })
  }

  static async startDiagnostic(userId: string) {
    await this.ensureOnboardingOpen(userId)

    let existingFallbackSession:
      | { id: string; questions: PrivateDiagnosticQuestion[] }
      | null = null

    const existingSession = await prisma.practiceSession.findFirst({
      where: {
        user_id: userId,
        mode: DIAGNOSTIC_MODE,
        status: 'IN_PROGRESS',
      },
      orderBy: { started_at: 'desc' },
    })

    if (existingSession) {
      const questions = getDiagnosticQuestionsFromMetadata(existingSession.metadata)
      const hasFallbackQuestions = questions.some((question) => question.source === 'fallback')
      if (questions.length > 0 && !hasFallbackQuestions) {
        return {
          diagnostic_session_id: existingSession.id,
          duration_seconds: DIAGNOSTIC_DURATION_SECONDS,
          questions: questions.map(toPublicQuestion),
          fallback_used: questions.some((question) => question.source === 'fallback'),
        }
      }

      if (questions.length > 0 && hasFallbackQuestions) {
        existingFallbackSession = {
          id: existingSession.id,
          questions,
        }
      }
    }

    const questions = await this.selectDiagnosticQuestions()
    const fallbackUsed = questions.some((question) => question.source === 'fallback')

    if (fallbackUsed && existingFallbackSession) {
      return {
        diagnostic_session_id: existingFallbackSession.id,
        duration_seconds: DIAGNOSTIC_DURATION_SECONDS,
        questions: existingFallbackSession.questions.map(toPublicQuestion),
        fallback_used: true,
      }
    }

    const session = await prisma.practiceSession.create({
      data: {
        user_id: userId,
        category: 'TWK',
        difficulty: 'mixed',
        mode: DIAGNOSTIC_MODE,
        status: 'IN_PROGRESS',
        metadata: toInputJson({
          diagnostic: {
            fallback_used: fallbackUsed,
            duration_seconds: DIAGNOSTIC_DURATION_SECONDS,
            questions,
          },
        }),
      },
    })

    return {
      diagnostic_session_id: session.id,
      duration_seconds: DIAGNOSTIC_DURATION_SECONDS,
      questions: questions.map(toPublicQuestion),
      fallback_used: fallbackUsed,
    }
  }

  static async submitDiagnostic(userId: string, sessionId: string, answers: DiagnosticAnswerInput[]) {
    const existingAttempt = await prisma.diagnosticAttempt.findFirst({
      where: {
        user_id: userId,
        source_session_id: sessionId,
      },
      orderBy: { completed_at: 'desc' },
    })

    if (existingAttempt) {
      const existingReward = await prisma.userXpEvent.findUnique({
        where: { idempotency_key: `onboarding:${userId}:diagnostic` },
      })
      return {
        result: this.toResultPayload(existingAttempt),
        recommendations: this.toRecommendationPayload(existingAttempt),
        reward: {
          xp: existingReward?.total_xp ?? 0,
          already_claimed: Boolean(existingReward),
        },
      }
    }

    await this.ensureOnboardingOpen(userId)

    const session = await prisma.practiceSession.findFirst({
      where: {
        id: sessionId,
        user_id: userId,
        mode: DIAGNOSTIC_MODE,
        status: { in: ['IN_PROGRESS', 'EXPIRED'] },
      },
    })

    if (!session) {
      throw new OnboardingError('NOT_FOUND', 'Sesi diagnostic tidak ditemukan.', 404)
    }

    const questions = getDiagnosticQuestionsFromMetadata(session.metadata)
    if (questions.length === 0) {
      throw new OnboardingError('INVALID_SESSION', 'Sesi diagnostic tidak memiliki daftar soal valid.', 400)
    }

    const answersByQuestionId = new Map(answers.map((answer) => [answer.question_id, answer]))
    const unknownAnswer = answers.find((answer) => !questions.some((question) => question.id === answer.question_id))
    if (unknownAnswer) {
      throw new OnboardingError('INVALID_ANSWER', 'Jawaban berisi soal yang tidak termasuk sesi diagnostic.', 400)
    }

    const categoryScores: Record<DiagnosticCategory, number> = {
      TWK: 0,
      TIU: 0,
      TKP: 0,
    }
    let totalTimeSpent = 0

    const attempts = questions.map((question) => {
      const answer = answersByQuestionId.get(question.id)
      const selectedOption = answer?.selected_option
      const timeSpent = answer?.time_spent ?? 0
      totalTimeSpent += timeSpent

      let score = 0
      let correct: boolean | null = null

      if (selectedOption && question.category === 'TKP') {
        const selectedWeight = question.tkp_weights?.[selectedOption] ?? 0
        const maxCategoryScore = CATEGORY_CONFIG.TKP.maxScore
        score = (selectedWeight / 5) * (maxCategoryScore / CATEGORY_CONFIG.TKP.count)
      } else if (selectedOption && question.answer_key) {
        correct = selectedOption === question.answer_key
        score = correct
          ? CATEGORY_CONFIG[question.category].maxScore / CATEGORY_CONFIG[question.category].count
          : 0
      }

      categoryScores[question.category] += score

      return {
        question,
        selectedOption: selectedOption ?? null,
        correct,
        score,
        timeSpent,
      }
    })

    const scoreTwk = normalizeScore(categoryScores.TWK)
    const scoreTiu = normalizeScore(categoryScores.TIU)
    const scoreTkp = normalizeScore(categoryScores.TKP)
    const totalScore = normalizeScore(scoreTwk + scoreTiu + scoreTkp)
    const averageTime = answers.length > 0 ? totalTimeSpent / answers.length : 0

    return prisma.$transaction(async (tx: TransactionClient) => {
      const dbAttempts = attempts.filter((attempt) => attempt.question.source === 'db')
      if (dbAttempts.length > 0) {
        await tx.practiceAttempt.createMany({
          data: dbAttempts.map((attempt) => ({
            session_id: sessionId,
            question_id: attempt.question.id,
            selected_option: attempt.selectedOption,
            correct: attempt.correct,
            score: normalizeScore(attempt.score),
            time_spent: attempt.timeSpent,
          })),
        })
      }

      await tx.practiceSession.update({
        where: { id: sessionId },
        data: {
          status: 'SUBMITTED',
          completed_at: new Date(),
          score: totalScore,
          average_time: averageTime,
          metadata: toInputJson({
            ...(session.metadata && typeof session.metadata === 'object' && !Array.isArray(session.metadata) ? session.metadata : {}),
            diagnostic_result: {
              answers: attempts.map((attempt) => ({
                question_id: attempt.question.id,
                selected_option: attempt.selectedOption,
                correct: attempt.correct,
                score: normalizeScore(attempt.score),
                time_spent: attempt.timeSpent,
              })),
            },
          }),
        },
      })

      const diagnosticAttempt = await tx.diagnosticAttempt.create({
        data: {
          user_id: userId,
          source_session_id: sessionId,
          score_twk: scoreTwk,
          score_tiu: scoreTiu,
          score_tkp: scoreTkp,
          total_score: totalScore,
          completed_at: new Date(),
        },
      })

      await tx.onboardingState.upsert({
        where: { user_id: userId },
        update: {
          diagnostic_completed_at: new Date(),
          completed_at: new Date(),
          reward_claimed_at: new Date(),
        },
        create: {
          user_id: userId,
          diagnostic_completed_at: new Date(),
          completed_at: new Date(),
          reward_claimed_at: new Date(),
        },
      })

      const idempotencyKey = `onboarding:${userId}:diagnostic`
      const existingReward = await tx.userXpEvent.findUnique({
        where: { idempotency_key: idempotencyKey },
      })
      const rewardXp = totalScore > 0 ? ONBOARDING_REWARD_XP : 0

      if (!existingReward && rewardXp > 0) {
        await tx.userXpEvent.create({
          data: {
            user_id: userId,
            source_type: 'ONBOARDING_DIAGNOSTIC',
            source_id: diagnosticAttempt.id,
            idempotency_key: idempotencyKey,
            base_xp: rewardXp,
            total_xp: rewardXp,
            reason: 'Selesai onboarding diagnostic test',
          },
        })

        await tx.userProgression.upsert({
          where: { user_id: userId },
          update: {
            total_xp: {
              increment: rewardXp,
            },
            last_xp_earned_at: new Date(),
          },
          create: {
            user_id: userId,
            total_xp: rewardXp,
            level: 1,
            last_xp_earned_at: new Date(),
          },
        })
      }

      return {
        result: this.toResultPayload(diagnosticAttempt),
        recommendations: this.toRecommendationPayload(diagnosticAttempt),
        reward: { xp: existingReward?.total_xp ?? rewardXp, already_claimed: Boolean(existingReward) },
      }
    })
  }

  private static async selectDiagnosticQuestions(): Promise<PrivateDiagnosticQuestion[]> {
    const categories = Object.keys(CATEGORY_CONFIG) as DiagnosticCategory[]
    const dbQuestionsByCategory = await Promise.all(
      categories.map((category) =>
        prisma.question.findMany({
          where: {
            category,
            package_code: CATEGORY_CONFIG[category].packageCode,
            status: 'PUBLISHED',
            deleted_at: null,
          },
          orderBy: { number: 'asc' },
          take: CATEGORY_CONFIG[category].count,
        })
      )
    )

    const selectedQuestions = categories.flatMap((category, categoryIndex) =>
      dbQuestionsByCategory[categoryIndex].map((question) => ({
        id: question.id,
        category,
        text: question.text,
        options: toOptions(question.options),
        answer_key: question.answer_key,
        tkp_weights: toWeights(question.tkp_weights),
        explanation: question.explanation,
        source: 'db' as const,
      }))
    )

    const fallbackQuestions = getFallbackQuestions()
    const completedQuestions = categories.flatMap((category) => {
      const categoryQuestions = selectedQuestions.filter((question) => question.category === category)
      const missingCount = CATEGORY_CONFIG[category].count - categoryQuestions.length
      if (missingCount <= 0) return categoryQuestions

      return [
        ...categoryQuestions,
        ...fallbackQuestions
          .filter((question) => question.category === category)
          .slice(0, missingCount),
      ]
    })

    return completedQuestions
  }

  private static toResultPayload(attempt: {
    id: string
    score_twk: number | null
    score_tiu: number | null
    score_tkp: number | null
    total_score: number | null
    completed_at: Date | null
  }) {
    const scores = {
      TWK: attempt.score_twk ?? 0,
      TIU: attempt.score_tiu ?? 0,
      TKP: attempt.score_tkp ?? 0,
    }
    const weakest = getWeakestCategory(scores)

    return {
      diagnostic_attempt_id: attempt.id,
      score_twk: scores.TWK,
      score_tiu: scores.TIU,
      score_tkp: scores.TKP,
      total_score: attempt.total_score ?? 0,
      weakest_category: weakest.category,
      readiness:
        (attempt.total_score ?? 0) >= 380
          ? 'SIAP_MENANJAK'
          : (attempt.total_score ?? 0) >= 260
            ? 'MULAI_TERBENTUK'
            : 'PERLU_PONDASI',
      completed_at: attempt.completed_at?.toISOString() ?? null,
    }
  }

  private static toRecommendationPayload(attempt: {
    score_twk: number | null
    score_tiu: number | null
    score_tkp: number | null
  }) {
    const scores = {
      TWK: attempt.score_twk ?? 0,
      TIU: attempt.score_tiu ?? 0,
      TKP: attempt.score_tkp ?? 0,
    }
    const weakest = getWeakestCategory(scores)

    return {
      primary_category: weakest.category,
      title: `Mulai dari ${CATEGORY_CONFIG[weakest.category].label}`,
      message: getRecommendation(weakest.category),
    }
  }
}
