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

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null
        const ip = getClientIp(req.headers)
        const emailKey = credentials.email.toLowerCase()
        const rateLimit = await rateLimitByKey(`auth:login:${emailKey}:${ip}`, 5, 15 * 60)

        if (!rateLimit.allowed) {
          throw new Error('RATE_LIMITED')
        }

        const user = await AuthService.findUserByEmail(credentials.email)
        if (!user || !user.password_hash) return null
        const isValid = AuthService.verifyPassword(credentials.password, user.password_hash)
        if (!isValid) return null
        if (user.status !== ACTIVE_USER_STATUS) {
          throw new Error(user.status)
        }
        return { id: user.id, name: user.name, email: user.email }
      }
    })
  ],

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

      const googleProfile = profile as
        | { email_verified?: boolean; picture?: string; name?: string }
        | undefined
      const canonicalUser = await AuthService.upsertOAuthUser({
        name: user.name ?? googleProfile?.name ?? user.email,
        email: user.email,
        provider: account.provider,
        avatarUrl: user.image ?? googleProfile?.picture,
        emailVerified: googleProfile?.email_verified ?? false,
      })

      if (canonicalUser.status !== ACTIVE_USER_STATUS) {
        throw new Error(canonicalUser.status)
      }

      user.id = canonicalUser.id
      user.name = canonicalUser.name
      user.email = canonicalUser.email
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
