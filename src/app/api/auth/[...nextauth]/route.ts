import NextAuth from 'next-auth'
import { authConfig } from '@/server/auth/config'

/**
 * Route handler NextAuth v4 untuk App Router.
 * Konfigurasi diambil dari lib/auth/config.ts agar tetap terpisah dan server-only.
 */
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
