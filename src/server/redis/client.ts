/**
 * src/server/redis/client.ts
 * Upstash Redis client — SERVER-ONLY.
 *
 * ⚠️ SERVER-ONLY — Upstash REST token tidak boleh exposed ke browser.
 *
 * Digunakan untuk:
 * - Cache battle state: battle:{id}:state
 * - Leaderboard cache: leaderboard:{type}:{scope_id}
 * - Notification badge count: notification_badge:{user_id}
 * - Presence: presence:user:{user_id}
 * - Rate limiting
 *
 * Sesuai 00_Data_Model.md: Redis Contracts.
 * Sesuai SECURITY.md: realtime channels harus authenticated, Redis sebagai checkpoint.
 */

import 'server-only'
import { Redis } from '@upstash/redis'

/**
 * Singleton Upstash Redis client.
 * Menggunakan REST API (HTTP) — aman untuk serverless/edge environment.
 */
function createRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    throw new Error(
      '[Redis] Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN env vars'
    )
  }

  return new Redis({ url, token })
}

/**
 * Redis client singleton.
 * Lazy-initialized untuk menghindari error pada build time jika env belum ada.
 */
let redisInstance: Redis | null = null

export function getRedisClient(): Redis {
  if (!redisInstance) {
    redisInstance = createRedisClient()
  }
  return redisInstance
}

// ── Redis Key Helpers ─────────────────────────────────────────────────────────
// Sesuai 00_Data_Model.md Redis Contracts — centralized key generation.

export const RedisKeys = {
  battleState: (battleId: string) => `battle:${battleId}:state`,
  userPresence: (userId: string) => `presence:user:${userId}`,
  leaderboard: (type: string, scopeId: string) => `leaderboard:${type}:${scopeId}`,
  notificationBadge: (userId: string) => `notification_badge:${userId}`,
} as const
