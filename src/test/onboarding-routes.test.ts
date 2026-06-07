import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getServerSession } from 'next-auth'
import { OnboardingService } from '@/server/services/onboarding.service'

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

vi.mock('@/server/auth/config', () => ({
  authConfig: {},
}))

vi.mock('@/server/services/onboarding.service', () => {
  class OnboardingError extends Error {
    constructor(
      public readonly code: string,
      message: string,
      public readonly status = 400
    ) {
      super(message)
    }
  }

  return {
    OnboardingError,
    OnboardingService: {
      saveProfile: vi.fn(),
      startDiagnostic: vi.fn(),
      submitDiagnostic: vi.fn(),
      getStatus: vi.fn(),
    },
  }
})

describe('U18 onboarding API routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects profile submit without session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const { POST } = await import('@/app/api/v1/onboarding/profile/route')

    const response = await POST(new Request('http://localhost/api/v1/onboarding/profile', {
      method: 'POST',
      body: JSON.stringify({}),
    }))
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error.code).toBe('UNAUTHORIZED')
  })

  it('rejects invalid profile body before service call', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', revoked: false },
    } as Awaited<ReturnType<typeof getServerSession>>)
    const { POST } = await import('@/app/api/v1/onboarding/profile/route')

    const response = await POST(new Request('http://localhost/api/v1/onboarding/profile', {
      method: 'POST',
      body: JSON.stringify({ target_instansi: 'A', target_score: 'hacked' }),
    }))

    expect(response.status).toBe(400)
    expect(OnboardingService.saveProfile).not.toHaveBeenCalled()
  })

  it('starts diagnostic only with a valid session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    const { POST } = await import('@/app/api/v1/onboarding/diagnostic/start/route')

    const response = await POST()

    expect(response.status).toBe(401)
    expect(OnboardingService.startDiagnostic).not.toHaveBeenCalled()
  })

  it('rejects diagnostic submit payload that tries to send a client score', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', revoked: false },
    } as Awaited<ReturnType<typeof getServerSession>>)
    const { POST } = await import('@/app/api/v1/onboarding/diagnostic/[id]/submit/route')

    const response = await POST(
      new Request('http://localhost/api/v1/onboarding/diagnostic/session-1/submit', {
        method: 'POST',
        body: JSON.stringify({
          answers: [
            { question_id: 'q1', selected_option: 'A', time_spent: 5, score: 550 },
          ],
        }),
      }),
      { params: Promise.resolve({ id: 'session-1' }) }
    )

    expect(response.status).toBe(400)
    expect(OnboardingService.submitDiagnostic).not.toHaveBeenCalled()
  })
})
