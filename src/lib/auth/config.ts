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

/**
 * NextAuth configuration object.
 * Di-export untuk digunakan di app/api/auth/[...nextauth]/route.ts (Phase 1).
 */
export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // CredentialsProvider akan ditambahkan saat implementasi U1 (Phase 1)
  ],

  session: {
    strategy: 'jwt',
    // Session expire 7 hari
    maxAge: 7 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    // Custom halaman auth — diimplementasi di Phase 1 (U1)
    signIn: '/auth/login',
    error: '/auth/error',
  },

  callbacks: {
    /**
     * JWT callback — inject user id ke token.
     * Akan diperluas di Phase 1 untuk menyimpan role dan golongan.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    /**
     * Session callback — expose user id ke session object.
     * Client dapat akses via useSession().data.user.id
     */
    async session({ session, token }) {
      if (token?.id && session.user) {
        (session.user as { id?: string }).id = token.id as string
      }
      return session
    },
  },
}
