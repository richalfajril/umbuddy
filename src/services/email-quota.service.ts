import { createHash } from 'node:crypto'
import { getRedisClient } from '@/lib/redis/client'

type AuthEmailType = 'verification' | 'password-reset'
type BlockReason = 'daily_limit' | 'cooldown' | 'ip_limit'

interface ConsumeAuthEmailQuotaInput {
  type: AuthEmailType
  email: string
  ip: string
}

interface ConsumeAuthEmailQuotaResult {
  allowed: boolean
  reason?: BlockReason
  keys: {
    daily: string
    cooldown: string
    ip: string
  }
}

const EMAIL_DAILY_LIMITS: Record<AuthEmailType, number> = {
  verification: 80,
  'password-reset': 20,
}

const EMAIL_IP_DAILY_LIMIT = 5
const EMAIL_COOLDOWN_SECONDS = 15 * 60

function toDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function secondsUntilNextUtcDay(date = new Date()) {
  const nextDay = new Date(date)
  nextDay.setUTCHours(24, 0, 0, 0)
  return Math.max(60, Math.ceil((nextDay.getTime() - date.getTime()) / 1000))
}

function hashForLog(value: string) {
  return createHash('sha256').update(value).digest('hex').slice(0, 12)
}

function logQuotaDecision(
  status: 'allowed' | 'blocked',
  type: AuthEmailType,
  email: string,
  ip: string,
  reason?: BlockReason
) {
  console.info('[EmailQuota]', {
    status,
    type,
    reason: reason ?? 'ok',
    email_hash: hashForLog(email.trim().toLowerCase()),
    ip_hash: hashForLog(ip || 'unknown'),
  })
}

export class EmailQuotaService {
  static keys(type: AuthEmailType, email: string, ip: string, dateKey = toDateKey()) {
    const normalizedEmail = email.trim().toLowerCase()
    return {
      daily: `email:daily:${type}:${dateKey}`,
      cooldown: `email:cooldown:${type === 'verification' ? 'verify' : 'password-reset'}:${normalizedEmail}`,
      ip: `email:ip:${type}:${ip || 'unknown'}:${dateKey}`,
    }
  }

  static async consumeAuthEmailQuota({
    type,
    email,
    ip,
  }: ConsumeAuthEmailQuotaInput): Promise<ConsumeAuthEmailQuotaResult> {
    const redis = getRedisClient()
    const keys = this.keys(type, email, ip)
    const dailyTtl = secondsUntilNextUtcDay()

    const cooldownTtl = await redis.ttl(keys.cooldown)
    if (cooldownTtl > 0) {
      logQuotaDecision('blocked', type, email, ip, 'cooldown')
      return { allowed: false, reason: 'cooldown', keys }
    }

    const ipCount = await redis.incr(keys.ip)
    if (ipCount === 1) {
      await redis.expire(keys.ip, dailyTtl)
    }
    if (ipCount > EMAIL_IP_DAILY_LIMIT) {
      logQuotaDecision('blocked', type, email, ip, 'ip_limit')
      return { allowed: false, reason: 'ip_limit', keys }
    }

    const dailyCount = await redis.incr(keys.daily)
    if (dailyCount === 1) {
      await redis.expire(keys.daily, dailyTtl)
    }
    if (dailyCount > EMAIL_DAILY_LIMITS[type]) {
      logQuotaDecision('blocked', type, email, ip, 'daily_limit')
      return { allowed: false, reason: 'daily_limit', keys }
    }

    await redis.set(keys.cooldown, '1', { ex: EMAIL_COOLDOWN_SECONDS })
    logQuotaDecision('allowed', type, email, ip)

    return { allowed: true, keys }
  }
}
