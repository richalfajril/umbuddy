import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'
import { prisma } from '@/lib/prisma'
import { UserRole, UserStatus, Prisma } from '@prisma/client'

interface RegisterData {
  name: string
  email: string
  password: string
}

export class AuthService {
  static hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex')
    const derivedKey = scryptSync(password, salt, 64)
    return `${salt}:${derivedKey.toString('hex')}`
  }

  static verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':')
    const derivedKey = scryptSync(password, salt, 64)
    const keyBuffer = Buffer.from(hash, 'hex')
    return timingSafeEqual(derivedKey, keyBuffer)
  }

  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        progression: true,
      }
    })
  }

  static async registerUser({ name, email, password }: RegisterData) {
    const existingUser = await this.findUserByEmail(email)
    if (existingUser) {
      throw new Error('Email sudah terdaftar')
    }

    const passwordHash = this.hashPassword(password)

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password_hash: passwordHash,
          status: UserStatus.PENDING_VERIFICATION,
          role: UserRole.USER,
        }
      })

      await tx.userProfile.create({ data: { user_id: user.id } })
      await tx.userProgression.create({ data: { user_id: user.id, level: 1, total_xp: 0 } })
      await tx.userSettings.create({ data: { user_id: user.id } })
      await tx.onboardingState.create({ data: { user_id: user.id } })

      return user
    })
  }
}
