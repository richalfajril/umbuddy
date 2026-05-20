import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EmailQuotaService } from '@/services/email-quota.service'
import { getRedisClient } from '@/lib/redis/client'

const redis = {
  ttl: vi.fn(),
  incr: vi.fn(),
  expire: vi.fn(),
  set: vi.fn(),
}

vi.mock('@/lib/redis/client', () => ({
  getRedisClient: vi.fn(() => redis),
}))

describe('U1 EmailQuotaService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    redis.ttl.mockResolvedValue(-2)
    redis.incr.mockResolvedValue(1)
    redis.expire.mockResolvedValue(1)
    redis.set.mockResolvedValue('OK')
  })

  it('allows verification email when quota is available', async () => {
    const result = await EmailQuotaService.consumeAuthEmailQuota({
      type: 'verification',
      email: 'Pejuang@Umbuddy.com',
      ip: '127.0.0.1',
    })

    expect(result.allowed).toBe(true)
    expect(result.keys.daily).toMatch(/^email:daily:verification:/)
    expect(result.keys.cooldown).toContain('email:cooldown:verify:pejuang@umbuddy.com')
    expect(redis.set).toHaveBeenCalledWith(result.keys.cooldown, '1', { ex: 900 })
  })

  it('blocks verification when daily limit is exceeded', async () => {
    redis.incr
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(81)

    const result = await EmailQuotaService.consumeAuthEmailQuota({
      type: 'verification',
      email: 'pejuang@umbuddy.com',
      ip: '127.0.0.1',
    })

    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('daily_limit')
    expect(redis.set).not.toHaveBeenCalled()
  })

  it('blocks duplicate pending verification during cooldown', async () => {
    redis.ttl.mockResolvedValue(300)

    const result = await EmailQuotaService.consumeAuthEmailQuota({
      type: 'verification',
      email: 'pending@umbuddy.com',
      ip: '127.0.0.1',
    })

    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('cooldown')
    expect(redis.incr).not.toHaveBeenCalled()
  })

  it('uses a separate quota bucket for password reset', async () => {
    const result = await EmailQuotaService.consumeAuthEmailQuota({
      type: 'password-reset',
      email: 'active@umbuddy.com',
      ip: '127.0.0.1',
    })

    expect(result.allowed).toBe(true)
    expect(result.keys.daily).toMatch(/^email:daily:password-reset:/)
    expect(result.keys.cooldown).toContain('email:cooldown:password-reset:active@umbuddy.com')
  })

  it('blocks per-IP abuse before consuming the daily quota', async () => {
    redis.incr.mockResolvedValueOnce(6)

    const result = await EmailQuotaService.consumeAuthEmailQuota({
      type: 'verification',
      email: 'pejuang@umbuddy.com',
      ip: '127.0.0.1',
    })

    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('ip_limit')
    expect(redis.incr).toHaveBeenCalledTimes(1)
  })

  it('uses the shared Redis client', async () => {
    await EmailQuotaService.consumeAuthEmailQuota({
      type: 'verification',
      email: 'pejuang@umbuddy.com',
      ip: '127.0.0.1',
    })

    expect(getRedisClient).toHaveBeenCalled()
  })
})
