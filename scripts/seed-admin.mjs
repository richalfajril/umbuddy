import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { randomBytes, scryptSync } from 'node:crypto'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Memuat .env.local untuk development lokal tanpa menambah dependency dotenv.
function loadEnvLocal() {
  try {
    const content = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIndex = trimmed.indexOf('=')
      if (eqIndex === -1) continue
      const key = trimmed.slice(0, eqIndex).trim()
      const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '')
      if (key && !process.env[key]) process.env[key] = value
    }
  } catch {
    // Production/CI boleh mengandalkan environment variable platform.
  }
}

// Hash password admin harus sama formatnya dengan AdminAuthService.
function hashAdminPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = scryptSync(password, salt, 64)
  return `${salt}:${derivedKey.toString('hex')}`
}

// Validasi password admin mengikuti rule A1: minimal 12 karakter dan kompleks.
function isStrongAdminPassword(password) {
  return (
    password.length >= 12 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

// Seed hanya memakai env agar credential admin tidak pernah hardcoded di repo.
async function main() {
  loadEnvLocal()

  const databaseUrl = process.env.DATABASE_URL
  const email = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_SEED_PASSWORD
  const role = process.env.ADMIN_SEED_ROLE ?? 'SUPER_ADMIN'

  if (!databaseUrl) throw new Error('DATABASE_URL wajib diisi.')
  if (!email) throw new Error('ADMIN_SEED_EMAIL wajib diisi.')
  if (!password) throw new Error('ADMIN_SEED_PASSWORD wajib diisi.')
  if (!['SUPER_ADMIN', 'CONTENT', 'SUPPORT'].includes(role)) {
    throw new Error('ADMIN_SEED_ROLE harus SUPER_ADMIN, CONTENT, atau SUPPORT.')
  }
  if (!isStrongAdminPassword(password)) {
    throw new Error('ADMIN_SEED_PASSWORD minimal 12 karakter dan harus berisi huruf besar, huruf kecil, angka, dan simbol.')
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg(databaseUrl),
  })

  try {
    const admin = await prisma.admin.upsert({
      where: { email },
      create: {
        email,
        password_hash: hashAdminPassword(password),
        role,
        is_active: true,
      },
      update: {
        password_hash: hashAdminPassword(password),
        role,
        is_active: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    })

    console.log('✅ Admin seed berhasil')
    console.log(`ID: ${admin.id}`)
    console.log(`Email: ${admin.email}`)
    console.log(`Role: ${admin.role}`)
    console.log('Password: memakai ADMIN_SEED_PASSWORD dari environment; tidak dicetak demi keamanan.')
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error('❌ Admin seed gagal')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
