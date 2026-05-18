/**
 * src/lib/auth/config.ts
 * NextAuth v4 configuration — SERVER-ONLY.
 *
 * ⚠️ SERVER-ONLY — secrets tidak boleh exposed ke browser.
 *
 * Scope Phase 0I: Hanya konfigurasi dasar (providers, callbacks stub).
 * Implementasi penuh auth flow ada di U1_Authentication.md (Phase 1).
 *
 * Providers:
 * - Google OAuth (primary)
 * - Credentials (email+password fallback, diimplementasi di Phase 1)
 *
 * SECURITY.md:
 * - Session strategy: JWT (stateless, cocok untuk serverless)
 * - NEXTAUTH_SECRET wajib di production
 */

import 'server-only'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { AuthService } from '@/services/auth.service'
import { getClientIp, rateLimitByKey } from '@/lib/redis/rate-limit'

const ACTIVE_USER_STATUS = 'ACTIVE'
const GOOGLE_OAUTH_CONFIGURED = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
)

export const googleOAuthStatus = GOOGLE_OAUTH_CONFIGURED ? 'PASS' : 'NOT_VERIFIED'

const providers: NextAuthOptions['providers'] = []

if (GOOGLE_OAUTH_CONFIGURED) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  )
}

providers.push(
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      if (!credentials?.email || !credentials?.password) return null
      const ip = getClientIp(req.headers)
      const emailKey = credentials.email.trim().toLowerCase()

      // Fix P1: Rate limit ganda untuk mencegah Distributed Brute-Force
      // 1. Rate limit per kombinasi IP + Email (mencegah brute-force lokal)
      const localLimit = await rateLimitByKey(`auth:login:${emailKey}:${ip}`, 5, 15 * 60)
      if (!localLimit.allowed) {
        throw new Error('RATE_LIMITED')
      }

      // 2. Rate limit global per Email (mencegah distributed brute-force lintas IP)
      const globalEmailLimit = await rateLimitByKey(`auth:login:email:${emailKey}`, 10, 30 * 60)
      if (!globalEmailLimit.allowed) {
        throw new Error('RATE_LIMITED')
      }

      const user = await AuthService.findUserByEmail(emailKey)
      if (!user || !user.password_hash) return null

      // Verifikasi password lebih dulu untuk menurunkan risiko user enumeration.
      const isValid = AuthService.verifyPassword(credentials.password, user.password_hash)
      if (!isValid) {
        const lockState = await AuthService.recordFailedLogin(user.id, {
          email: emailKey,
          ip,
        })

        if (lockState.locked) {
          throw new Error('LOCKED')
        }

        return null
      }

      if (user.status !== ACTIVE_USER_STATUS) {
        throw new Error(user.status)
      }

      await AuthService.recordSuccessfulLogin(user.id, {
        email: emailKey,
        ip,
      })

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        sessionVersion: user.session_version,
        onboardingRequired: user.onboarding?.completed_at === null || !user.onboarding,
      }
    }
  })
)

export const authConfig: NextAuthOptions = {
  providers,

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'google') return true
      if (!user.email) return false

      try {
        const googleProfile = profile as
          | { email_verified?: boolean; picture?: string; name?: string }
          | undefined
        const emailVerified = googleProfile?.email_verified ?? false
        if (!emailVerified) return false

        const canonicalUser = await AuthService.upsertOAuthUser({
          name: user.name ?? googleProfile?.name ?? user.email,
          email: user.email,
          provider: account.provider,
          avatarUrl: user.image ?? googleProfile?.picture,
          emailVerified,
        })

        if (canonicalUser.status !== ACTIVE_USER_STATUS) {
          throw new Error(canonicalUser.status)
        }

        const sessionState = await AuthService.getUserSessionState(canonicalUser.id)
        if (!sessionState) return false

        user.id = canonicalUser.id
        user.name = canonicalUser.name
        user.email = canonicalUser.email
        user.role = sessionState.role
        user.status = sessionState.status
        user.sessionVersion = sessionState.sessionVersion
        user.onboardingRequired = sessionState.onboardingRequired
        return true
      } catch (error) {
        console.error('Google OAuth sign-in error:', error)
        throw new Error('OAUTH_SIGNIN_FAILED')
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.status = user.status
        token.sessionVersion = user.sessionVersion
        token.onboardingRequired = user.onboardingRequired
        token.revoked = false
        return token
      }

      if (token.id) {
        const sessionState = await AuthService.getUserSessionState(token.id)
        if (
          !sessionState ||
          sessionState.status !== ACTIVE_USER_STATUS ||
          sessionState.sessionVersion !== token.sessionVersion
        ) {
          token.revoked = true
          return token
        }

        token.role = sessionState.role
        token.status = sessionState.status
        token.onboardingRequired = sessionState.onboardingRequired
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role
        session.user.status = token.status
        session.user.onboardingRequired = Boolean(token.onboardingRequired)
        session.user.revoked = Boolean(token.revoked)
      }
      return session
    },
  },
}
