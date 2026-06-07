import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { prisma } from '@/server/db'

const USER_ROLE = {
  USER: 'USER',
} as const

const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  LOCKED: 'LOCKED',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
} as const

const FAILED_LOGIN_LIMIT = 5
const FAILED_LOGIN_WINDOW_MS = 15 * 60 * 1000
const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000
const EMAIL_VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000

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

interface PasswordResetRequestResult {
  email: string
  name: string
  token: string
  expiresAt: Date
}

interface EmailVerificationRequestResult {
  email: string
  name: string
  token: string
  expiresAt: Date
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

function sanitizeDisplayName(name: string): string {
  return name
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100)
}

function getFallbackNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] || 'Umbuddy User'
  return sanitizeDisplayName(localPart.replace(/[._-]+/g, ' ')) || 'Umbuddy User'
}

export class AuthService {
  static hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex')
    const derivedKey = scryptSync(password, salt, 64)
    return `${salt}:${derivedKey.toString('hex')}`
  }

  static verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':')
    if (!salt || !hash) return false
    const derivedKey = scryptSync(password, salt, 64)
    const keyBuffer = Buffer.from(hash, 'hex')
    if (derivedKey.length !== keyBuffer.length) return false
    return timingSafeEqual(derivedKey, keyBuffer)
  }

  static async findUserByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase()
    return prisma.user.findFirst({
      where: { 
        email: normalizedEmail,
        deleted_at: null
      },
      include: {
        profile: true,
        progression: true,
        onboarding: true,
      }
    })
  }

  static async getUserSessionState(userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deleted_at: null,
      },
      select: {
        id: true,
        role: true,
        status: true,
        session_version: true,
        onboarding: {
          select: {
            completed_at: true,
          },
        },
      },
    })

    if (!user) return null

    return {
      id: user.id,
      role: user.role,
      status: user.status,
      sessionVersion: user.session_version,
      onboardingRequired: user.onboarding?.completed_at === null || !user.onboarding,
    }
  }

  /**
   * Rotates the server-side session version after a successful login.
   * JWT sessions are stateless, so this is the lightweight V1 mechanism that
   * makes older devices detect a revoked session on their next session refresh.
   */
  static async rotateUserSession(userId: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { session_version: { increment: 1 } },
      select: {
        id: true,
        role: true,
        status: true,
        session_version: true,
        onboarding: {
          select: {
            completed_at: true,
          },
        },
      },
    })

    return {
      id: user.id,
      role: user.role,
      status: user.status,
      sessionVersion: user.session_version,
      onboardingRequired: user.onboarding?.completed_at === null || !user.onboarding,
    }
  }

  static async registerUser({ name, email, password }: RegisterData) {
    const normalizedEmail = email.trim().toLowerCase()
    const safeName = sanitizeDisplayName(name)
    if (safeName.length < 2) {
      throw new Error('INVALID_NAME')
    }

    const existingUser = await this.findUserByEmail(normalizedEmail)
    if (existingUser) {
      throw new Error('Email sudah terdaftar')
    }

    const passwordHash = this.hashPassword(password)

    return prisma.$transaction(async (tx: TransactionClient) => {
      const user = await tx.user.create({
        data: {
          name: safeName,
          email: normalizedEmail,
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
    const normalizedEmail = email.trim().toLowerCase()
    const safeName = sanitizeDisplayName(name) || getFallbackNameFromEmail(normalizedEmail)

    return prisma.$transaction(async (tx: TransactionClient) => {
      const existingUser = await tx.user.findFirst({
        where: { 
          email: normalizedEmail,
          deleted_at: null
        },
      })

      let user

      if (existingUser) {
        user = await tx.user.update({
          where: { id: existingUser.id },
          data: {
            name: existingUser.name || safeName,
            oauth_provider: provider,
            email_verified: existingUser.email_verified || emailVerified,
            status:
              existingUser.status === USER_STATUS.PENDING_VERIFICATION && emailVerified
                ? USER_STATUS.ACTIVE
                : existingUser.status,
          },
        })

        // Hanya perbarui avatar jika ada yang baru dari provider OAuth
        if (avatarUrl) {
          await tx.userProfile.updateMany({
            where: { user_id: user.id },
            data: { avatar_url: avatarUrl },
          })
        }
      } else {
        user = await tx.user.create({
          data: {
            name: safeName,
            email: normalizedEmail,
            oauth_provider: provider,
            email_verified: emailVerified,
            status: emailVerified ? USER_STATUS.ACTIVE : USER_STATUS.PENDING_VERIFICATION,
            role: USER_ROLE.USER,
            registration_source: provider,
          },
        })

        // Buat relasi wajib untuk user baru
        await tx.userProfile.create({
          data: {
            user_id: user.id,
            avatar_url: avatarUrl,
          },
        })
        await tx.userProgression.create({
          data: { user_id: user.id, level: 1, total_xp: 0 },
        })
        await tx.userSettings.create({
          data: { user_id: user.id },
        })
        await tx.onboardingState.create({
          data: { user_id: user.id },
        })
      }

      return user
    })
  }

  static async recordFailedLogin(userId: string, metadata: Record<string, string | null>) {
    const windowStart = new Date(Date.now() - FAILED_LOGIN_WINDOW_MS)

    return prisma.$transaction(async (tx: TransactionClient) => {
      await tx.securityEvent.create({
        data: {
          user_id: userId,
          event_type: 'AUTH_LOGIN_FAILED',
          severity: 'MEDIUM',
          metadata,
        },
      })

      const failedCount = await tx.securityEvent.count({
        where: {
          user_id: userId,
          event_type: 'AUTH_LOGIN_FAILED',
          created_at: {
            gte: windowStart,
          },
        },
      })

      if (failedCount >= FAILED_LOGIN_LIMIT) {
        await tx.user.update({
          where: { id: userId },
          data: { status: USER_STATUS.LOCKED },
        })

        await tx.securityEvent.create({
          data: {
            user_id: userId,
            event_type: 'AUTH_ACCOUNT_LOCKED',
            severity: 'HIGH',
            metadata: {
              reason: 'too_many_failed_login_attempts',
              failed_count: String(failedCount),
            },
          },
        })

        return { locked: true, failedCount }
      }

      return { locked: false, failedCount }
    })
  }

  static async recordSuccessfulLogin(userId: string, metadata: Record<string, string | null>) {
    await prisma.securityEvent.create({
      data: {
        user_id: userId,
        event_type: 'AUTH_LOGIN_SUCCESS',
        severity: 'LOW',
        metadata,
      },
    })
  }

  static async createPasswordResetRequest(email: string): Promise<PasswordResetRequestResult | null> {
    const user = await this.findUserByEmail(email)
    if (!user || user.status !== USER_STATUS.ACTIVE) {
      return null
    }

    const token = randomBytes(32).toString('base64url')
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS)
    const tokenHash = hashToken(token)

    await prisma.$transaction(async (tx: TransactionClient) => {
      await tx.passwordResetToken.create({
        data: {
          user_id: user.id,
          token_hash: tokenHash,
          expires_at: expiresAt,
        },
      })

      await tx.securityEvent.create({
        data: {
          user_id: user.id,
          event_type: 'AUTH_PASSWORD_RESET_REQUESTED',
          severity: 'LOW',
          metadata: { email: user.email },
        },
      })
    })

    return {
      email: user.email,
      name: user.name,
      token,
      expiresAt,
    }
  }

  static async canCreatePasswordResetRequest(email: string) {
    const user = await this.findUserByEmail(email)
    return Boolean(user && user.status === USER_STATUS.ACTIVE)
  }

  static async canCreateEmailVerificationRequest(email: string) {
    const user = await this.findUserByEmail(email)
    return Boolean(
      user &&
        user.status === USER_STATUS.PENDING_VERIFICATION &&
        !user.email_verified
    )
  }

  static async createEmailVerificationRequest(email: string): Promise<EmailVerificationRequestResult | null> {
    const user = await this.findUserByEmail(email)
    if (
      !user ||
      user.status !== USER_STATUS.PENDING_VERIFICATION ||
      user.email_verified
    ) {
      return null
    }

    const token = randomBytes(32).toString('base64url')
    const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_TTL_MS)
    const tokenHash = hashToken(token)

    await prisma.$transaction(async (tx: TransactionClient) => {
      await tx.emailVerificationToken.create({
        data: {
          user_id: user.id,
          token_hash: tokenHash,
          expires_at: expiresAt,
        },
      })

      await tx.securityEvent.create({
        data: {
          user_id: user.id,
          event_type: 'AUTH_EMAIL_VERIFICATION_REQUESTED',
          severity: 'LOW',
          metadata: { email: user.email },
        },
      })
    })

    return {
      email: user.email,
      name: user.name,
      token,
      expiresAt,
    }
  }

  static async verifyEmailWithToken(token: string) {
    const tokenHash = hashToken(token)

    return prisma.$transaction(async (tx: TransactionClient) => {
      const verificationToken = await tx.emailVerificationToken.findFirst({
        where: {
          token_hash: tokenHash,
          used_at: null,
          expires_at: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      })

      if (
        !verificationToken ||
        verificationToken.user.deleted_at ||
        verificationToken.user.status !== USER_STATUS.PENDING_VERIFICATION
      ) {
        throw new Error('EMAIL_VERIFICATION_TOKEN_INVALID')
      }

      await tx.user.update({
        where: { id: verificationToken.user_id },
        data: {
          email_verified: true,
          status: USER_STATUS.ACTIVE,
        },
      })

      await tx.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { used_at: new Date() },
      })

      await tx.securityEvent.create({
        data: {
          user_id: verificationToken.user_id,
          event_type: 'AUTH_EMAIL_VERIFIED',
          severity: 'LOW',
          metadata: { email: verificationToken.user.email },
        },
      })

      return { userId: verificationToken.user_id }
    })
  }

  static async resetPasswordWithToken(token: string, newPassword: string) {
    const tokenHash = hashToken(token)
    const passwordHash = this.hashPassword(newPassword)

    return prisma.$transaction(async (tx: TransactionClient) => {
      const resetToken = await tx.passwordResetToken.findFirst({
        where: {
          token_hash: tokenHash,
          used_at: null,
          expires_at: {
            gt: new Date(),
          },
        },
      })

      if (!resetToken) {
        throw new Error('RESET_TOKEN_INVALID')
      }

      await tx.user.update({
        where: { id: resetToken.user_id },
        data: {
          password_hash: passwordHash,
          session_version: { increment: 1 },
          status: USER_STATUS.ACTIVE,
        },
      })

      await tx.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used_at: new Date() },
      })

      await tx.authSession.updateMany({
        where: {
          user_id: resetToken.user_id,
          revoked_at: null,
        },
        data: { revoked_at: new Date() },
      })

      await tx.securityEvent.create({
        data: {
          user_id: resetToken.user_id,
          event_type: 'AUTH_PASSWORD_RESET_COMPLETED',
          severity: 'MEDIUM',
          metadata: { sessions_revoked: 'true' },
        },
      })

      return { userId: resetToken.user_id }
    })
  }
}
