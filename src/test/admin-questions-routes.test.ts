import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminQuestionService } from '@/server/admin-questions'

vi.mock('@/server/admin-auth', () => ({
  AdminAuthService: {
    getCurrentAdmin: vi.fn(),
  },
}))

vi.mock('@/server/auth/config', () => ({
  authConfig: {},
}))

vi.mock('@/server/admin-questions', () => {
  class AdminQuestionError extends Error {
    constructor(
      public readonly code: string,
      message: string,
      public readonly status = 400,
      public readonly details: Array<{ field: string; message: string }> = []
    ) {
      super(message)
    }
  }

  return {
    AdminQuestionError,
    AdminQuestionService: {
      listQuestions: vi.fn(),
      createQuestion: vi.fn(),
      getQuestion: vi.fn(),
      updateQuestion: vi.fn(),
      publishQuestion: vi.fn(),
      archiveQuestion: vi.fn(),
      restoreQuestion: vi.fn(),
    },
    isAdminQuestionCategory: vi.fn((value: unknown) => ['TWK', 'TIU', 'TKP'].includes(String(value))),
    isAdminQuestionStatus: vi.fn((value: unknown) => ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'FLAGGED'].includes(String(value))),
    parseAdminQuestionMutationPayload: vi.fn((payload: unknown) => {
      const data = payload as Record<string, unknown>
      if (!data?.category || !data?.package_code || !data?.text) {
        throw new AdminQuestionError('VALIDATION_ERROR', 'Data soal belum valid.', 400, [
          { field: 'text', message: 'Pertanyaan wajib diisi.' },
        ])
      }

      return data
    }),
  }
})

// Context admin mock yang aman untuk guard route handler.
const adminSession = {
  sessionId: 'admin-session-1',
  admin: {
    id: 'admin-1',
    email: 'admin@umbuddy.com',
    role: 'CONTENT',
    last_login_at: null,
  },
} as const

// Response soal mock yang mewakili bentuk aman dari AdminQuestionService.
const questionResponse = {
  id: 'question-1',
  category: 'TWK',
  package_code: 'PKG-1',
  number: 1,
  text: 'Apa dasar negara Indonesia?',
  options: {
    A: { text: 'Pancasila' },
    B: { text: 'UUD 1945' },
    C: { text: 'Bhinneka Tunggal Ika' },
    D: { text: 'NKRI' },
  },
  answer_key: 'A',
  tkp_weights: null,
  explanation: 'Pancasila adalah dasar negara Indonesia.',
  difficulty: 'easy',
  subtest_id: null,
  material_id: null,
  sub_material_id: null,
  image_urls: [] as string[],
  status: 'DRAFT',
  created_at: '2026-05-20T00:00:00.000Z',
  updated_at: '2026-05-20T00:00:00.000Z',
} as const

describe('A2 admin question API routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects admin question list without admin session', async () => {
    vi.mocked(AdminAuthService.getCurrentAdmin).mockResolvedValue(null)
    const { GET } = await import('@/app/api/v1/admin/questions/route')

    const response = await GET(new Request('http://localhost/api/v1/admin/questions'))
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error.code).toBe('UNAUTHORIZED')
    expect(AdminQuestionService.listQuestions).not.toHaveBeenCalled()
  })

  it('lists admin questions with safe filters when admin session exists', async () => {
    vi.mocked(AdminAuthService.getCurrentAdmin).mockResolvedValue(adminSession)
    vi.mocked(AdminQuestionService.listQuestions).mockResolvedValue({
      questions: [questionResponse],
      page: 1,
      page_size: 20,
      total: 1,
    })
    const { GET } = await import('@/app/api/v1/admin/questions/route')

    const response = await GET(new Request('http://localhost/api/v1/admin/questions?status=draft&category=twk&page=1'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.questions).toHaveLength(1)
    expect(AdminQuestionService.listQuestions).toHaveBeenCalledWith(adminSession.admin, {
      status: 'DRAFT',
      category: 'TWK',
      keyword: undefined,
      page: 1,
      page_size: 20,
    })
  })

  it('rejects invalid create question payload before service call', async () => {
    vi.mocked(AdminAuthService.getCurrentAdmin).mockResolvedValue(adminSession)
    const { POST } = await import('@/app/api/v1/admin/questions/route')

    const response = await POST(new Request('http://localhost/api/v1/admin/questions', {
      method: 'POST',
      body: JSON.stringify({ category: 'TWK' }),
    }))
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error.code).toBe('VALIDATION_ERROR')
    expect(AdminQuestionService.createQuestion).not.toHaveBeenCalled()
  })

  it('creates a draft question through the admin service', async () => {
    vi.mocked(AdminAuthService.getCurrentAdmin).mockResolvedValue(adminSession)
    vi.mocked(AdminQuestionService.createQuestion).mockResolvedValue(questionResponse)
    const { POST } = await import('@/app/api/v1/admin/questions/route')

    const response = await POST(new Request('http://localhost/api/v1/admin/questions', {
      method: 'POST',
      body: JSON.stringify({
        category: 'TWK',
        package_code: 'PKG-1',
        number: 1,
        text: 'Apa dasar negara Indonesia?',
      }),
    }))
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body.question.id).toBe('question-1')
    expect(AdminQuestionService.createQuestion).toHaveBeenCalledWith(adminSession.admin, expect.objectContaining({
      category: 'TWK',
      package_code: 'PKG-1',
    }))
  })

  it('publishes a draft question only for an authenticated admin', async () => {
    vi.mocked(AdminAuthService.getCurrentAdmin).mockResolvedValue(adminSession)
    vi.mocked(AdminQuestionService.publishQuestion).mockResolvedValue({
      ...questionResponse,
      status: 'PUBLISHED',
    })
    const { POST } = await import('@/app/api/v1/admin/questions/[id]/publish/route')

    const response = await POST(
      new Request('http://localhost/api/v1/admin/questions/question-1/publish', { method: 'POST' }),
      { params: Promise.resolve({ id: 'question-1' }) }
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.question.status).toBe('PUBLISHED')
    expect(AdminQuestionService.publishQuestion).toHaveBeenCalledWith(adminSession.admin, 'question-1')
  })
})
