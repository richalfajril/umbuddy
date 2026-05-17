/**
 * src/lib/prisma/client.ts
 * Prisma Client singleton — SERVER-ONLY.
 *
 * ⚠️ SERVER-ONLY — database credentials tidak boleh exposed ke browser.
 *
 * Pattern: Global singleton untuk menghindari "too many connections" di development
 * akibat hot reload Next.js yang membuat instance baru setiap save.
 *
 * Referensi: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 *
 * SECURITY.md: Gunakan connection pooling (DATABASE_URL port 6543).
 * Prisma v7: koneksi dikonfigurasi di prisma.config.ts, bukan di schema.
 */

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Deklarasi global untuk menyimpan instance di antara hot reload
declare global {
  var __prismaClient: PrismaClient | undefined
}

/**
 * Prisma Client singleton.
 * Di development: reuse instance dari global untuk mencegah connection flooding.
 * Di production: buat instance baru (no global pollution).
 */
function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('[Prisma] Missing DATABASE_URL env var')
  }

  const adapter = new PrismaPg(databaseUrl)

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })
}

const prisma = global.__prismaClient ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.__prismaClient = prisma
}

export { prisma }
