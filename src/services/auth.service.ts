import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'
import { prisma } from '@/lib/prisma'
import { UserRole, UserStatus } from '@prisma/client'

interface RegisterData {
  name: string
  email: string
  password: string
}

/**
 * AuthService — Logika bisnis untuk autentikasi dan manajemen user.
 * 
 * Aturan Phase 1B:
 * - Gunakan crypto built-in (scrypt) untuk hashing (Zero dependency hashing).
 * - Format hash: salt:key (hex).
 */
export class AuthService {
  /**
   * Hash password menggunakan scrypt.
   * Return format: "salt:hash" dalam hex.
   */
  static hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex')
    const derivedKey = scryptSync(password, salt, 64)
    return `${salt}:${derivedKey.toString('hex')}`
  }

  /**
   * Verifikasi password terhadap hash yang tersimpan.
   */
  static verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':')
    const derivedKey = scryptSync(password, salt, 64)
    const keyBuffer = Buffer.from(hash, 'hex')
    return timingSafeEqual(derivedKey, keyBuffer)
  }

  /**
   * Cari user berdasarkan email.
   */
  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        progression: true,
      }
    })
  }

  /**
   * Registrasi user baru (Email/Password).
   */
  static async registerUser({ name, email, password }: RegisterData) {
    const existingUser = await this.findUserByEmail(email)
    if (existingUser) {
      throw new Error('Email sudah terdaftar')
    }

    const passwordHash = this.hashPassword(password)

    // Gunakan Database Transaction untuk integritas data
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password_hash: passwordHash,
          status: UserStatus.PENDING_VERIFICATION,
          role: UserRole.USER,
        }
      })

      // Inisialisasi profile dasar
      await tx.userProfile.create({
        data: {
          user_id: user.id,
        }
      })

      // Inisialisasi progression (XP & Level)
      await tx.userProgression.create({
        data: {
          user_id: user.id,
          level: 1,
          total_xp: 0,
        }
      })

      // Inisialisasi settings
      await tx.userSettings.create({
        data: {
          user_id: user.id,
        }
      })

      // Inisialisasi onboarding state
      await tx.onboardingState.create({
        data: {
          user_id: user.id,
        }
      })

      return user
    })
  }
}
