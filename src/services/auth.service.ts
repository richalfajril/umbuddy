import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'
import { prisma } from '@/lib/prisma'

const USER_ROLE = {
  USER: 'USER',
} as const

const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
} as const

type TransactionClient = Omit<
  typeof prisma,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

interface RegisterData {
  name: string
  email: string
  password: string
}

interface OAuthUserData {
  name: string
  email: string
  provider: string
  avatarUrl?: string | null
  emailVerified?: boolean
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

    return prisma.$transaction(async (tx: TransactionClient) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password_hash: passwordHash,
          status: USER_STATUS.PENDING_VERIFICATION,
          role: USER_ROLE.USER,
        }
      })

      await tx.userProfile.create({ data: { user_id: user.id } })
      await tx.userProgression.create({ data: { user_id: user.id, level: 1, total_xp: 0 } })
      await tx.userSettings.create({ data: { user_id: user.id } })
      await tx.onboardingState.create({ data: { user_id: user.id } })

      return user
    })
  }

  /**
   * Ensure OAuth users have the same canonical Umbuddy records as email users.
   * NextAuth can issue a JWT without a database adapter, so we create the
   * application-owned rows here before allowing the OAuth sign-in to continue.
   */
  static async upsertOAuthUser({
    name,
    email,
    provider,
    avatarUrl,
    emailVerified = false,
  }: OAuthUserData) {
    const normalizedEmail = email.toLowerCase()

    return prisma.$transaction(async (tx: TransactionClient) => {
      const existingUser = await tx.user.findUnique({
        where: { email: normalizedEmail },
      })

      const user = existingUser
        ? await tx.user.update({
            where: { id: existingUser.id },
            data: {
              name: existingUser.name || name,
              oauth_provider: provider,
              email_verified: existingUser.email_verified || emailVerified,
              status:
                existingUser.status === USER_STATUS.PENDING_VERIFICATION && emailVerified
                  ? USER_STATUS.ACTIVE
                  : existingUser.status,
            },
          })
        : await tx.user.create({
            data: {
              name,
              email: normalizedEmail,
              oauth_provider: provider,
              email_verified: emailVerified,
              status: emailVerified ? USER_STATUS.ACTIVE : USER_STATUS.PENDING_VERIFICATION,
              role: USER_ROLE.USER,
              registration_source: provider,
            },
          })

      await tx.userProfile.upsert({
        where: { user_id: user.id },
        update: {
          avatar_url: avatarUrl ?? undefined,
        },
        create: {
          user_id: user.id,
          avatar_url: avatarUrl,
        },
      })
      await tx.userProgression.upsert({
        where: { user_id: user.id },
        update: {},
        create: { user_id: user.id, level: 1, total_xp: 0 },
      })
      await tx.userSettings.upsert({
        where: { user_id: user.id },
        update: {},
        create: { user_id: user.id },
      })
      await tx.onboardingState.upsert({
        where: { user_id: user.id },
        update: {},
        create: { user_id: user.id },
      })

      return user
    })
  }
}
