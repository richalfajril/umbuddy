import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { prisma } from '@/server/db'
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TTL_SECONDS } from './admin-auth.constants'
import type { AdminLoginInput, AdminLoginResult, AdminSessionContext, PublicAdmin } from './admin-auth.types'
import {
  createAdminSessionToken,
  hashAdminToken,
  isStrongAdminPassword,
  normalizeAdminEmail,
  verifyAdminPassword,
} from './admin-auth.utils'

// Service server-only untuk login, session, dan guard admin tanpa menyentuh user-auth.
export class AdminAuthService {
  // Login admin memvalidasi credential dan membuat session DB + cookie token.
  static async login({
    email,
    password,
    ip,
    userAgent,
  }: AdminLoginInput): Promise<AdminLoginResult> {
    const normalizedEmail = normalizeAdminEmail(email)
    const admin = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    })

    if (!admin || !admin.is_active) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const validPassword = verifyAdminPassword(password, admin.password_hash)
    if (!validPassword) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const token = createAdminSessionToken()
    const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000)
    const publicAdmin = this.toPublicAdmin({
      ...admin,
      last_login_at: new Date(),
    })

    await prisma.$transaction(async (tx) => {
      const updatedAdmin = await tx.admin.update({
        where: { id: admin.id },
        data: { last_login_at: publicAdmin.last_login_at },
      })

      await tx.adminSession.create({
        data: {
          admin_id: updatedAdmin.id,
          token_hash: hashAdminToken(token),
          ip_address: ip,
          device_info: {
            user_agent: userAgent ?? 'unknown',
          },
          expires_at: expiresAt,
        },
      })

      await tx.adminLog.create({
        data: {
          admin_id: updatedAdmin.id,
          action: 'ADMIN_LOGIN',
          resource_type: 'admin_session',
          changes: {
            email: normalizedEmail,
          },
          ip_address: ip,
        },
      })
    })

    return {
      token,
      expiresAt,
      admin: publicAdmin,
    }
  }

  // Logout menandai session aktif revoked tanpa menghapus riwayat audit.
  static async logout(token: string | undefined) {
    if (!token) return

    const tokenHash = hashAdminToken(token)
    const session = await prisma.adminSession.findFirst({
      where: {
        token_hash: tokenHash,
        revoked_at: null,
      },
      select: {
        id: true,
        admin_id: true,
      },
    })

    if (!session) return

    await prisma.$transaction(async (tx) => {
      await tx.adminSession.update({
        where: { id: session.id },
        data: { revoked_at: new Date() },
      })

      await tx.adminLog.create({
        data: {
          admin_id: session.admin_id,
          action: 'ADMIN_LOGOUT',
          resource_type: 'admin_session',
          resource_id: session.id,
        },
      })
    })
  }

  // Guard membaca cookie admin dan mengembalikan context jika session masih valid.
  static async getSessionContext(token: string | undefined): Promise<AdminSessionContext | null> {
    if (!token) return null

    const session = await prisma.adminSession.findFirst({
      where: {
        token_hash: hashAdminToken(token),
        revoked_at: null,
        expires_at: {
          gt: new Date(),
        },
      },
      include: {
        admin: true,
      },
    })

    if (!session || !session.admin.is_active) return null

    return {
      sessionId: session.id,
      admin: this.toPublicAdmin(session.admin),
    }
  }

  // Helper guard untuk Server Component yang butuh admin aktif dari cookie.
  static async getCurrentAdmin(): Promise<AdminSessionContext | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
    return this.getSessionContext(token)
  }

  // Cached version untuk menghindari double DB query antara layout dan page flow.
  static getCachedCurrentAdmin = cache(async () => {
    return AdminAuthService.getCurrentAdmin()
  })

  // Validasi seed password dipakai ulang oleh script agar aturan admin konsisten.
  static validateSeedPassword(password: string): boolean {
    return isStrongAdminPassword(password)
  }

  // Shape public admin sengaja kecil agar response tidak membawa password/session internals.
  private static toPublicAdmin(admin: {
    id: string
    email: string
    role: PublicAdmin['role']
    last_login_at: Date | null
  }): PublicAdmin {
    return {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      last_login_at: admin.last_login_at,
    }
  }
}
