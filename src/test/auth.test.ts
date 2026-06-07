import { vi, describe, it, expect, beforeEach } from 'vitest'
import { AuthService } from '@/server/auth/auth.service'
import { prisma } from '@/server/db'

type User = Awaited<ReturnType<typeof prisma.user.create>>
type SecurityEvent = Awaited<ReturnType<typeof prisma.securityEvent.create>>


// Mock Prisma client to prevent real database connections during tests
vi.mock('@/server/db', () => {
  const mockPrisma = {
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    userProfile: {
      create: vi.fn(),
      upsert: vi.fn(),
    },
    userProgression: {
      create: vi.fn(),
      upsert: vi.fn(),
    },
    userSettings: {
      create: vi.fn(),
      upsert: vi.fn(),
    },
    onboardingState: {
      create: vi.fn(),
      upsert: vi.fn(),
    },
    securityEvent: {
      create: vi.fn(),
      count: vi.fn(),
    },
    passwordResetToken: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    emailVerificationToken: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    authSession: {
      updateMany: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(mockPrisma)),
  }
  return { prisma: mockPrisma }
})

describe('U1 Auth — AuthService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Password Hashing & Timing-Safe Verification', () => {
    it('should hash a password with random salt and verify it successfully', () => {
      const password = 'PejuangCPNS2026!'
      const hash = AuthService.hashPassword(password)

      expect(hash).toContain(':')
      const [salt, derivedKey] = hash.split(':')
      expect(salt).toHaveLength(32) // hex representation of 16 bytes
      expect(derivedKey).toHaveLength(128) // hex representation of 64 bytes

      const isMatch = AuthService.verifyPassword(password, hash)
      expect(isMatch).toBe(true)
    })

    it('should reject incorrect passwords', () => {
      const password = 'PejuangCPNS2026!'
      const wrongPassword = 'WrongPassword!'
      const hash = AuthService.hashPassword(password)

      const isMatch = AuthService.verifyPassword(wrongPassword, hash)
      expect(isMatch).toBe(false)
    })

    it('should handle corrupted or legacy hashes gracefully without crash', () => {
      const isMatch = AuthService.verifyPassword('password', 'invalidhash')
      expect(isMatch).toBe(false)
    })
  })

  describe('User Registration', () => {
    it('should successfully register a new user with default relationships', async () => {
      const registerData = {
        name: 'Pejuang Umbuddy',
        email: 'pejuang@umbuddy.com',
        password: 'securepassword123',
      }

      // Mock that user does not exist yet
      vi.mocked(prisma.user.findFirst).mockResolvedValue(null)
      
      // Mock creation return
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: 'user-uuid-123',
        name: registerData.name,
        email: registerData.email,
      } as unknown as User)

      const user = await AuthService.registerUser(registerData)

      expect(user).toBeDefined()
      expect(user.id).toBe('user-uuid-123')
      expect(prisma.user.create).toHaveBeenCalled()
      expect(prisma.userProfile.create).toHaveBeenCalled()
      expect(prisma.userProgression.create).toHaveBeenCalled()
      expect(prisma.userSettings.create).toHaveBeenCalled()
      expect(prisma.onboardingState.create).toHaveBeenCalled()
    })

    it('should throw INVALID_NAME if name is too short', async () => {
      const registerData = {
        name: 'A',
        email: 'pejuang@umbuddy.com',
        password: 'securepassword123',
      }

      await expect(AuthService.registerUser(registerData)).rejects.toThrow('INVALID_NAME')
    })

    it('should throw Email sudah terdaftar if email is already registered', async () => {
      const registerData = {
        name: 'Pejuang Umbuddy',
        email: 'pejuang@umbuddy.com',
        password: 'securepassword123',
      }

      // Mock user already exists
      vi.mocked(prisma.user.findFirst).mockResolvedValue({
        id: 'existing-id',
        email: registerData.email,
      } as unknown as User)

      await expect(AuthService.registerUser(registerData)).rejects.toThrow('Email sudah terdaftar')
    })
  })

  describe('Account Lockout (Failed Logins)', () => {
    it('should not lock account if failed count is below limit', async () => {
      const userId = 'user-uuid'
      
      vi.mocked(prisma.securityEvent.create).mockResolvedValue({} as unknown as SecurityEvent)
      vi.mocked(prisma.securityEvent.count).mockResolvedValue(3) // 3 failed logins

      const result = await AuthService.recordFailedLogin(userId, { ip: '127.0.0.1' })

      expect(result.locked).toBe(false)
      expect(result.failedCount).toBe(3)
      expect(prisma.user.update).not.toHaveBeenCalled()
    })

    it('should lock account if failed count reaches limit', async () => {
      const userId = 'user-uuid'
      
      vi.mocked(prisma.securityEvent.create).mockResolvedValue({} as unknown as SecurityEvent)
      vi.mocked(prisma.securityEvent.count).mockResolvedValue(5) // 5 failed logins (limit)

      const result = await AuthService.recordFailedLogin(userId, { ip: '127.0.0.1' })

      expect(result.locked).toBe(true)
      expect(result.failedCount).toBe(5)
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { status: 'LOCKED' },
      })
    })
  })

  describe('Single Active Session', () => {
    it('should rotate session version after successful login', async () => {
      vi.mocked(prisma.user.update).mockResolvedValue({
        id: 'user-uuid',
        role: 'USER',
        status: 'ACTIVE',
        session_version: 4,
        onboarding: {
          completed_at: null,
        },
      } as unknown as User)

      const result = await AuthService.rotateUserSession('user-uuid')

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-uuid' },
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
      expect(result).toEqual({
        id: 'user-uuid',
        role: 'USER',
        status: 'ACTIVE',
        sessionVersion: 4,
        onboardingRequired: true,
      })
    })
  })

  describe('Secure Password Reset Flow', () => {
    it('should generate secure token and return email if user is active', async () => {
      const email = 'active@umbuddy.com'

      vi.mocked(prisma.user.findFirst).mockResolvedValue({
        id: 'active-uuid',
        name: 'Active User',
        email: email,
        status: 'ACTIVE',
      } as unknown as User)

      const result = await AuthService.createPasswordResetRequest(email)

      expect(result).not.toBeNull()
      expect(result?.email).toBe(email)
      expect(result?.token).toBeDefined()
      expect(prisma.passwordResetToken.create).toHaveBeenCalled()
    })

    it('should return null for non-existent or suspended users (Anti-User Enumeration)', async () => {
      const email = 'suspended@umbuddy.com'

      // Suspended status
      vi.mocked(prisma.user.findFirst).mockResolvedValue({
        id: 'suspended-uuid',
        name: 'Suspended User',
        email: email,
        status: 'SUSPENDED',
      } as unknown as User)

      const result = await AuthService.createPasswordResetRequest(email)

      expect(result).toBeNull()
      expect(prisma.passwordResetToken.create).not.toHaveBeenCalled()
    })
  })

  describe('Email Verification Flow', () => {
    it('should generate a verification token for pending users', async () => {
      const email = 'pending@umbuddy.com'

      vi.mocked(prisma.user.findFirst).mockResolvedValue({
        id: 'pending-uuid',
        name: 'Pending User',
        email,
        status: 'PENDING_VERIFICATION',
        email_verified: false,
      } as unknown as User)

      const result = await AuthService.createEmailVerificationRequest(email)

      expect(result).not.toBeNull()
      expect(result?.email).toBe(email)
      expect(result?.token).toBeDefined()
      expect(prisma.emailVerificationToken.create).toHaveBeenCalled()
    })

    it('should activate a pending user with a valid verification token', async () => {
      vi.mocked(prisma.emailVerificationToken.findFirst).mockResolvedValue({
        id: 'token-uuid',
        user_id: 'pending-uuid',
        user: {
          id: 'pending-uuid',
          email: 'pending@umbuddy.com',
          status: 'PENDING_VERIFICATION',
          deleted_at: null,
        },
      } as unknown as Awaited<ReturnType<typeof prisma.emailVerificationToken.findFirst>>)

      await AuthService.verifyEmailWithToken('valid-token')

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'pending-uuid' },
        data: {
          email_verified: true,
          status: 'ACTIVE',
        },
      })
      expect(prisma.emailVerificationToken.update).toHaveBeenCalled()
    })
  })
})
