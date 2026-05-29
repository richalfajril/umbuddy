import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PracticeService } from '@/services/practice.service'
import { prisma } from '@/lib/prisma'

type PracticeSession = Awaited<ReturnType<typeof prisma.practiceSession.create>>

vi.mock('@/lib/prisma', () => {
  const mockPrisma = {
    practiceSession: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
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
    explanation: 'Pembahasan TWK',
    source: 'db',
  },
  {
    id: 'q-twk-2',
    category: 'TWK',
    text: 'TWK sample 2',
    options: { A: 'Salah', B: 'Benar', C: 'Salah', D: 'Salah', E: 'Salah' },
    answer_key: 'B',
    tkp_weights: null,
    explanation: 'Pembahasan TWK 2',
    source: 'db',
  },
] as const

describe('U2 PracticeService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts quick practice with fallback questions when published bank is empty', async () => {
    vi.mocked(prisma.question.findMany).mockResolvedValue([])
    vi.mocked(prisma.practiceSession.create).mockResolvedValue({
      id: 'practice-1',
    } as unknown as PracticeSession)

    const result = await PracticeService.startSession('user-1', {
      category: 'TWK',
      difficulty: 'mixed',
      mode: 'QUICK',
      question_count: 5,
    })

    expect(result.session_id).toBe('practice-1')
    expect(result.questions).toHaveLength(5)
    expect(result.fallback_used).toBe(true)
    expect(result.questions[0]).not.toHaveProperty('answer_key')
  })

  it('computes practice score server-side and creates idempotent XP reward', async () => {
    vi.mocked(prisma.practiceSession.findFirst).mockResolvedValue({
      id: 'practice-1',
      user_id: 'user-1',
      mode: 'QUICK',
      status: 'IN_PROGRESS',
      started_at: new Date(),
      metadata: {
        practice: {
          questions: privateQuestions,
        },
      },
    } as unknown as PracticeSession)
    vi.mocked(prisma.userXpEvent.findUnique).mockResolvedValue(null)

    const result = await PracticeService.submitSession('user-1', 'practice-1', [
      { question_id: 'q-twk-1', selected_option: 'A', time_spent: 20 },
      { question_id: 'q-twk-2', selected_option: 'C', time_spent: 22 },
    ])

    expect(result.score).toBe(50)
    expect(result.correct_count).toBe(1)
    expect(result.xp_award.xp).toBe(15)
    expect(prisma.practiceAttempt.createMany).toHaveBeenCalled()
    expect(prisma.userXpEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          source_type: 'PRACTICE_SESSION',
          idempotency_key: 'practice:user-1:practice-1',
          total_xp: 15,
        }),
      })
    )
    expect(prisma.userProgression.upsert).toHaveBeenCalled()
  })

  it('returns existing submitted result without awarding duplicate XP', async () => {
    vi.mocked(prisma.practiceSession.findFirst).mockResolvedValue({
      id: 'practice-1',
      user_id: 'user-1',
      mode: 'QUICK',
      status: 'SUBMITTED',
      metadata: {
        practice_result: {
          session_id: 'practice-1',
          score: 80,
          correct_count: 4,
          total_questions: 5,
          average_time: 18,
          breakdown: {
            TWK: { attempted: 5, correct: 4, score: 80 },
            TIU: { attempted: 0, correct: 0, score: 0 },
            TKP: { attempted: 0, correct: 0, score: 0 },
          },
          review: [],
          recommendations: [],
          xp_award: { xp: 18, already_claimed: true },
        },
      },
    } as unknown as PracticeSession)

    const result = await PracticeService.submitSession('user-1', 'practice-1', [
      { question_id: 'q-twk-1', selected_option: 'A', time_spent: 20 },
    ])

    expect(result.score).toBe(80)
    expect(prisma.userXpEvent.create).not.toHaveBeenCalled()
    expect(prisma.userProgression.upsert).not.toHaveBeenCalled()
  })

  it('submits stale practice sessions when timer has ended', async () => {
    vi.mocked(prisma.practiceSession.findFirst).mockResolvedValue({
      id: 'practice-expired',
      user_id: 'user-1',
      mode: 'QUICK',
      status: 'IN_PROGRESS',
      started_at: new Date(Date.now() - 331_000),
      metadata: {
        practice: {
          duration_seconds: 300,
          questions: privateQuestions,
        },
      },
    } as unknown as PracticeSession)

    const result = await PracticeService.submitSession('user-1', 'practice-expired', [
      { question_id: 'q-twk-1', selected_option: 'A', time_spent: 20 },
    ])

    expect(prisma.practiceSession.update).toHaveBeenCalledWith({
      where: { id: 'practice-expired' },
      data: expect.objectContaining({
        status: 'SUBMITTED',
      }),
    })
    expect(result.score).toBe(50)
    expect(prisma.userXpEvent.create).toHaveBeenCalled()
  })
})
