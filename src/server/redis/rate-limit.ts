import 'server-only'
import { getRedisClient } from './client'

interface RateLimitResult {
  allowed: boolean
  retryAfterSeconds: number
}

export function getClientIp(headers?: Headers | Record<string, unknown>) {
  if (!headers) return 'unknown'

  const forwardedFor =
    headers instanceof Headers ? headers.get('x-forwarded-for') : headers['x-forwarded-for']
  const realIp = headers instanceof Headers ? headers.get('x-real-ip') : headers['x-real-ip']
  const rawHeader = forwardedFor ?? realIp
  const rawIp = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader

  return typeof rawIp === 'string' ? rawIp.split(',')[0]?.trim() || 'unknown' : 'unknown'
}

/**
 * Fixed-window limiter backed by Upstash Redis.
 * Redis TTL is set only for the first hit so every key has a bounded lifetime.
 */
export async function rateLimitByKey(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const redis = getRedisClient()
  const redisKey = `rate_limit:${key}`
  const count = await redis.incr(redisKey)

  if (count === 1) {
    await redis.expire(redisKey, windowSeconds)
  }

  if (count <= limit) {
    return { allowed: true, retryAfterSeconds: 0 }
  }

  const ttl = await redis.ttl(redisKey)
  return {
    allowed: false,
    retryAfterSeconds: ttl > 0 ? ttl : windowSeconds,
  }
}
