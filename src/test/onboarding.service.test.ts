import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OnboardingService } from '@/server/services/onboarding.service'
import { prisma } from '@/server/db'

type PracticeSession = Awaited<ReturnType<typeof prisma.practiceSession.create>>
type DiagnosticAttempt = Awaited<ReturnType<typeof prisma.diagnosticAttempt.create>>

vi.mock('@/server/db', () => {
  const mockPrisma = {
    user: {
      update: vi.fn(),
    },
    userProfile: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    onboardingState: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    diagnosticAttempt: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    practiceSession: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    practiceAttempt: {
      createMany: vi.fn(),
    },
    question: {
      findMany: vi.fn(),
    },
    userXpEvent: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    userProgression: {
      upsert: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(mockPrisma)),
  }

  return { prisma: mockPrisma }
})

const privateQuestions = [
  {
    id: 'q-twk-1',
    category: 'TWK',
    text: 'TWK sample',
    options: { A: 'Benar', B: 'Salah', C: 'Salah', D: 'Salah', E: 'Salah' },
    answer_key: 'A',
    tkp_weights: null,
    explanation: null,
    source: 'db',
  },
  {
    id: 'q-tiu-1',
    category: 'TIU',
    text: 'TIU sample',
    options: { A: 'Salah', B: 'Benar', C: 'Salah', D: 'Salah', E: 'Salah' },
    answer_key: 'B',
    tkp_weights: null,
    explanation: null,
    source: 'db',
  },
  {
    id: 'q-tkp-1',
    category: 'TKP',
    text: 'TKP sample',
    options: { A: 'Satu', B: 'Dua', C: 'Tiga', D: 'Empat', E: 'Lima' },
    answer_key: null,
    tkp_weights: { A: 1, B: 2, C: 3, D: 4, E: 5 },
    explanation: null,
    source: 'db',
  },
] as const

describe('U18 OnboardingService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('saves onboarding profile only for the current user', async () => {
    vi.mocked(prisma.userProfile.upsert).mockResolvedValue({
      user_id: 'user-1',
      target_instansi: 'Kementerian Keuangan',
      target_score: 430,
      exam_date: new Date('2026-08-01'),
      province: 'Jawa Barat',
      city: 'Bandung',
      institution: 'ITB',
      major: 'Akuntansi',
    } as Awaited<ReturnType<typeof prisma.userProfile.upsert>>)

    await OnboardingService.saveProfile('user-1', {
      target_instansi: 'Kementerian Keuangan',
      target_score: 430,
      exam_date: '2026-08-01',
      province: 'Jawa Barat',
      city: 'Bandung',
      institution: 'ITB',
      major: 'Akuntansi',
      phone: '08123456789',
    })

    expect(prisma.userProfile.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { user_id: 'user-1' },
      })
    )
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { phone: '08123456789' },
    })
  })

  it('starts diagnostic with safe fallback questions when published bank is empty', async () => {
    vi.mocked(prisma.onboardingState.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.practiceSession.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.question.findMany).mockResolvedValue([])
    vi.mocked(prisma.practiceSession.create).mockResolvedValue({
      id: 'session-1',
    } as unknown as PracticeSession)

    const result = await OnboardingService.startDiagnostic('user-1')

    expect(result.diagnostic_session_id).toBe('session-1')
    expect(result.questions).toHaveLength(15)
    expect(result.fallback_used).toBe(true)
    expect(result.questions[0]).not.toHaveProperty('answer_key')
    expect(result.questions[0]).not.toHaveProperty('tkp_weights')
  })

  it('blocks diagnostic start after onboarding is already completed', async () => {
    vi.mocked(prisma.onboardingState.findUnique).mockResolvedValue({
      user_id: 'user-1',
      completed_at: new Date('2026-01-01'),
    } as Awaited<ReturnType<typeof prisma.onboardingState.findUnique>>)

    await expect(OnboardingService.startDiagnostic('user-1')).rejects.toMatchObject({
      code: 'ONBOARDING_ALREADY_COMPLETED',
    })
    expect(prisma.practiceSession.findFirst).not.toHaveBeenCalled()
  })

  it('computes diagnostic score server-side and creates idempotent XP reward', async () => {
    vi.mocked(prisma.onboardingState.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.practiceSession.findFirst).mockResolvedValue({
      id: 'session-1',
      user_id: 'user-1',
      mode: 'DIAGNOSTIC',
      metadata: {
        diagnostic: {
          questions: privateQuestions,
        },
      },
    } as unknown as PracticeSession)
    vi.mocked(prisma.diagnosticAttempt.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.diagnosticAttempt.create).mockResolvedValue({
      id: 'attempt-1',
      user_id: 'user-1',
      source_session_id: 'session-1',
      score_twk: 21.43,
      score_tiu: 25,
      score_tkp: 7.5,
      total_score: 53.93,
      completed_at: new Date('2026-01-01'),
    } as DiagnosticAttempt)
    vi.mocked(prisma.userXpEvent.findUnique).mockResolvedValue(null)

    const result = await OnboardingService.submitDiagnostic('user-1', 'session-1', [
      { question_id: 'q-twk-1', selected_option: 'A', time_spent: 10 },
      { question_id: 'q-tiu-1', selected_option: 'B', time_spent: 12 },
      { question_id: 'q-tkp-1', selected_option: 'E', time_spent: 15 },
    ])

    expect(result.result.total_score).toBe(53.93)
    expect(prisma.practiceAttempt.createMany).toHaveBeenCalled()
    expect(prisma.userXpEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          source_type: 'ONBOARDING_DIAGNOSTIC',
          idempotency_key: 'onboarding:user-1:diagnostic',
          total_xp: 50,
        }),
      })
    )
    expect(prisma.userProgression.upsert).toHaveBeenCalled()
  })

  it('returns existing diagnostic result on duplicate submit without duplicate reward', async () => {
    vi.mocked(prisma.onboardingState.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.practiceSession.findFirst).mockResolvedValue({
      id: 'session-1',
      user_id: 'user-1',
      mode: 'DIAGNOSTIC',
      metadata: {},
    } as PracticeSession)
    vi.mocked(prisma.diagnosticAttempt.findFirst).mockResolvedValue({
      id: 'attempt-1',
      user_id: 'user-1',
      source_session_id: 'session-1',
      score_twk: 10,
      score_tiu: 20,
      score_tkp: 30,
      total_score: 60,
      completed_at: new Date('2026-01-01'),
    } as DiagnosticAttempt)
    vi.mocked(prisma.userXpEvent.findUnique).mockResolvedValue({
      total_xp: 50,
    } as Awaited<ReturnType<typeof prisma.userXpEvent.findUnique>>)

    const result = await OnboardingService.submitDiagnostic('user-1', 'session-1', [
      { question_id: 'q-twk-1', selected_option: 'A', time_spent: 10 },
    ])

    expect(result.reward.already_claimed).toBe(true)
    expect(prisma.userXpEvent.create).not.toHaveBeenCalled()
    expect(prisma.userProgression.upsert).not.toHaveBeenCalled()
  })

  it('submits diagnostic sessions when the timer has ended', async () => {
    vi.mocked(prisma.diagnosticAttempt.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.onboardingState.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.practiceSession.findFirst).mockResolvedValue({
      id: 'session-expired',
      user_id: 'user-1',
      mode: 'DIAGNOSTIC',
      status: 'IN_PROGRESS',
      started_at: new Date(Date.now() - 901_000),
      metadata: {
        diagnostic: {
          questions: privateQuestions,
        },
      },
    } as unknown as PracticeSession)
    vi.mocked(prisma.userXpEvent.findUnique).mockResolvedValue(null)

    const result = await OnboardingService.submitDiagnostic('user-1', 'session-expired', [
      { question_id: 'q-twk-1', selected_option: 'A', time_spent: 10 },
    ])

    expect(prisma.practiceSession.update).toHaveBeenCalledWith({
      where: { id: 'session-expired' },
      data: expect.objectContaining({
        status: 'SUBMITTED',
      }),
    })
    expect(result.result.total_score).toBeGreaterThan(0)
    expect(result.reward.already_claimed).toBe(false)
  })

  it('submits unanswered timed-out diagnostic with zero score and no XP reward', async () => {
    vi.mocked(prisma.diagnosticAttempt.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.onboardingState.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.practiceSession.findFirst).mockResolvedValue({
      id: 'session-empty',
      user_id: 'user-1',
      mode: 'DIAGNOSTIC',
      status: 'IN_PROGRESS',
      started_at: new Date(Date.now() - 901_000),
      metadata: {
        diagnostic: {
          questions: privateQuestions,
        },
      },
    } as unknown as PracticeSession)
    vi.mocked(prisma.diagnosticAttempt.create).mockResolvedValue({
      id: 'attempt-empty',
      user_id: 'user-1',
      source_session_id: 'session-empty',
      score_twk: 0,
      score_tiu: 0,
      score_tkp: 0,
      total_score: 0,
      completed_at: new Date('2026-01-01'),
    } as DiagnosticAttempt)
    vi.mocked(prisma.userXpEvent.findUnique).mockResolvedValue(null)

    const result = await OnboardingService.submitDiagnostic('user-1', 'session-empty', [])

    expect(result.result.total_score).toBe(0)
    expect(result.reward).toEqual({ xp: 0, already_claimed: false })
    expect(prisma.userXpEvent.create).not.toHaveBeenCalled()
    expect(prisma.userProgression.upsert).not.toHaveBeenCalled()
  })
})
