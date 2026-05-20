import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthService } from '@/services/auth.service'
import { EmailQuotaService } from '@/services/email-quota.service'
import { getResendClient } from '@/lib/email/client'

vi.mock('@/services/auth.service', () => ({
  AuthService: {
    registerUser: vi.fn(),
    canCreateEmailVerificationRequest: vi.fn(),
    createEmailVerificationRequest: vi.fn(),
    canCreatePasswordResetRequest: vi.fn(),
    createPasswordResetRequest: vi.fn(),
  },
}))

vi.mock('@/services/email-quota.service', () => ({
  EmailQuotaService: {
    consumeAuthEmailQuota: vi.fn(),
  },
}))

const send = vi.fn()
vi.mock('@/lib/email/client', () => ({
  EMAIL_FROM: 'Umbuddy <no-reply@umbuddy.com>',
  getResendClient: vi.fn(() => ({
    emails: { send },
  })),
}))

vi.mock('@/lib/redis/rate-limit', () => ({
  getClientIp: vi.fn(() => '127.0.0.1'),
  rateLimitByKey: vi.fn(() => Promise.resolve({ allowed: true, retryAfterSeconds: 0 })),
}))

describe('U1 auth email routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(EmailQuotaService.consumeAuthEmailQuota).mockResolvedValue({
      allowed: true,
      keys: {
        daily: 'email:daily:verification:2026-05-20',
        cooldown: 'email:cooldown:verify:user@umbuddy.com',
        ip: 'email:ip:verification:127.0.0.1:2026-05-20',
      },
    })
  })

  it('keeps register response generic and does not expose created user', async () => {
    vi.mocked(AuthService.registerUser).mockResolvedValue({
      id: 'user-1',
      email: 'new@umbuddy.com',
      name: 'New User',
    } as Awaited<ReturnType<typeof AuthService.registerUser>>)
    vi.mocked(AuthService.canCreateEmailVerificationRequest).mockResolvedValue(true)
    vi.mocked(AuthService.createEmailVerificationRequest).mockResolvedValue({
      email: 'new@umbuddy.com',
      name: 'New User',
      token: 'verification-token',
      expiresAt: new Date(),
    })

    const { POST } = await import('@/app/api/v1/auth/register/route')
    const response = await POST(new Request('http://localhost/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'New User',
        email: 'new@umbuddy.com',
        password: 'securepassword123',
      }),
    }))
    const body = await response.json()

    expect(response.status).toBe(202)
    expect(body.user).toBeUndefined()
    expect(body.verification_required).toBe(true)
    expect(getResendClient).toHaveBeenCalled()
  })

  it('does not send verification email when quota blocks it', async () => {
    vi.mocked(AuthService.registerUser).mockRejectedValue(new Error('Email sudah terdaftar'))
    vi.mocked(AuthService.canCreateEmailVerificationRequest).mockResolvedValue(true)
    vi.mocked(EmailQuotaService.consumeAuthEmailQuota).mockResolvedValue({
      allowed: false,
      reason: 'cooldown',
      keys: {
        daily: 'email:daily:verification:2026-05-20',
        cooldown: 'email:cooldown:verify:pending@umbuddy.com',
        ip: 'email:ip:verification:127.0.0.1:2026-05-20',
      },
    })

    const { POST } = await import('@/app/api/v1/auth/register/route')
    const response = await POST(new Request('http://localhost/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Pending User',
        email: 'pending@umbuddy.com',
        password: 'securepassword123',
      }),
    }))

    expect(response.status).toBe(202)
    expect(AuthService.createEmailVerificationRequest).not.toHaveBeenCalled()
    expect(send).not.toHaveBeenCalled()
  })

  it('does not send verification email for active users', async () => {
    vi.mocked(AuthService.registerUser).mockRejectedValue(new Error('Email sudah terdaftar'))
    vi.mocked(AuthService.canCreateEmailVerificationRequest).mockResolvedValue(false)

    const { POST } = await import('@/app/api/v1/auth/register/route')
    const response = await POST(new Request('http://localhost/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Active User',
        email: 'active@umbuddy.com',
        password: 'securepassword123',
      }),
    }))

    expect(response.status).toBe(202)
    expect(EmailQuotaService.consumeAuthEmailQuota).not.toHaveBeenCalled()
    expect(send).not.toHaveBeenCalled()
  })

  it('keeps password reset response generic when quota blocks it', async () => {
    vi.mocked(AuthService.canCreatePasswordResetRequest).mockResolvedValue(true)
    vi.mocked(EmailQuotaService.consumeAuthEmailQuota).mockResolvedValue({
      allowed: false,
      reason: 'daily_limit',
      keys: {
        daily: 'email:daily:password-reset:2026-05-20',
        cooldown: 'email:cooldown:password-reset:active@umbuddy.com',
        ip: 'email:ip:password-reset:127.0.0.1:2026-05-20',
      },
    })

    const { POST } = await import('@/app/api/v1/auth/password-reset/request/route')
    const response = await POST(new Request('http://localhost/api/v1/auth/password-reset/request', {
      method: 'POST',
      body: JSON.stringify({
        email: 'active@umbuddy.com',
      }),
    }))
    const body = await response.json()

    expect(response.status).toBe(202)
    expect(body.message).toContain('Jika email terdaftar dan aktif')
    expect(AuthService.createPasswordResetRequest).not.toHaveBeenCalled()
    expect(send).not.toHaveBeenCalled()
  })
})
