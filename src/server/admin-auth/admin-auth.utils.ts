import 'server-only'
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

// Hash token session admin sebelum disimpan agar cookie mentah tidak ada di database.
export function hashAdminToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

// Token session dibuat random dan URL-safe untuk disimpan sebagai httpOnly cookie.
export function createAdminSessionToken(): string {
  return randomBytes(32).toString('base64url')
}

// Hash password admin memakai scrypt bawaan Node agar tidak menambah dependency berbayar/baru.
export function hashAdminPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = scryptSync(password, salt, 64)
  return `${salt}:${derivedKey.toString('hex')}`
}

// Verifikasi password memakai timingSafeEqual untuk menghindari timing leak sederhana.
export function verifyAdminPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) return false

  const derivedKey = scryptSync(password, salt, 64)
  const keyBuffer = Buffer.from(hash, 'hex')
  if (derivedKey.length !== keyBuffer.length) return false

  return timingSafeEqual(derivedKey, keyBuffer)
}

// Normalisasi email admin memastikan lookup dan seed tidak membuat variasi casing.
export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase()
}

// Password admin minimal lebih ketat dari user karena melindungi area backoffice.
export function isStrongAdminPassword(password: string): boolean {
  return (
    password.length >= 12 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}
