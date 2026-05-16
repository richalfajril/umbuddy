/**
 * prisma.config.ts — Konfigurasi Prisma v7
 *
 * Di Prisma v7, koneksi database TIDAK lagi di schema.prisma.
 * Semua konfigurasi koneksi dipindah ke sini.
 *
 * Referensi: https://pris.ly/d/config-datasource
 *
 * SECURITY.md: runtime wajib pakai DATABASE_URL (pooled, port 6543).
 * Untuk migrate (prisma migrate dev/deploy), gunakan DIRECT_URL (port 5432).
 * Di Prisma v7 directUrl sudah dihapus — saat migrate, swap ke DIRECT_URL manual.
 */

// Prisma CLI tidak kenal .env.local (konvensi Next.js).
// Parse manual menggunakan Node.js fs agar tidak perlu install dotenv terpisah.
import { readFileSync } from 'fs'
import { resolve } from 'path'

function loadEnvLocal() {
  try {
    const envPath = resolve(process.cwd(), '.env.local')
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
      if (key && !process.env[key]) process.env[key] = val
    }
  } catch {
    // .env.local tidak ada (production/CI) — lanjutkan
  }
}
loadEnvLocal()

import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // DATABASE_URL: Supabase Supavisor pooled (port 6543) — untuk runtime & migrate
    // Saat menjalankan prisma migrate, ganti sementara ke DIRECT_URL (port 5432)
    url: env('DATABASE_URL'),
  },
})
