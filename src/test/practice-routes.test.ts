import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getServerSession } from 'next-auth'
import { PracticeService } from '@/services/practice.service'

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

vi.mock('@/server/auth/config', () => ({
  authConfig: {},
}))

vi.mock('@/services/practice.service', () => {
  class PracticeError extends Error {
    constructor(
      public readonly code: string,
      message: string,
      public readonly status = 400
    ) {
      super(message)
    }
  }

  return {
    PracticeError,
    PracticeService: {
      startSession: vi.fn(),
      getSession: vi.fn(),
      autosaveAnswers: vi.fn(),
      submitSession: vi.fn(),
      getHistory: vi.fn(),
    },
  }
})

describe('U2 practice API routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects practice start without session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const { POST } = await import('@/app/api/v1/practice/sessions/route')

    const response = await POST(new Request('http://localhost/api/v1/practice/sessions', {
      method: 'POST',
      body: JSON.stringify({ category: 'TWK', difficulty: 'mixed', mode: 'QUICK', question_count: 5 }),
    }))
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error.code).toBe('UNAUTHORIZED')
    expect(PracticeService.startSession).not.toHaveBeenCalled()
  })

  it('rejects invalid practice start body before service call', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', revoked: false },
    } as Awaited<ReturnType<typeof getServerSession>>)
    const { POST } = await import('@/app/api/v1/practice/sessions/route')

    const response = await POST(new Request('http://localhost/api/v1/practice/sessions', {
      method: 'POST',
      body: JSON.stringify({ category: 'HACKED', difficulty: 'mixed', mode: 'QUICK' }),
    }))

    expect(response.status).toBe(400)
    expect(PracticeService.startSession).not.toHaveBeenCalled()
  })

  it('rejects practice submit payload that tries to send a client score', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', revoked: false },
    } as Awaited<ReturnType<typeof getServerSession>>)
    const { POST } = await import('@/app/api/v1/practice/sessions/[id]/submit/route')

    const response = await POST(
      new Request('http://localhost/api/v1/practice/sessions/practice-1/submit', {
        method: 'POST',
        body: JSON.stringify({
          answers: [
            { question_id: 'q1', selected_option: 'A', time_spent: 5, score: 100 },
          ],
        }),
      }),
      { params: Promise.resolve({ id: 'practice-1' }) }
    )

    expect(response.status).toBe(400)
    expect(PracticeService.submitSession).not.toHaveBeenCalled()
  })
})
