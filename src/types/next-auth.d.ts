import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Mengatur tipe Session.user agar menyertakan ID.
   */
  interface Session {
    user: {
      id: string
      role?: string
      status?: string
      onboardingRequired?: boolean
      revoked?: boolean
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role?: string
    status?: string
    sessionVersion?: number
    onboardingRequired?: boolean
  }
}

declare module 'next-auth/jwt' {
  /**
   * Mengatur tipe JWT agar menyertakan ID.
   */
  interface JWT {
    id: string
    role?: string
    status?: string
    sessionVersion?: number
    onboardingRequired?: boolean
    revoked?: boolean
  }
}
