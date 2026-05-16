import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Mengatur tipe Session.user agar menyertakan ID.
   */
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
  }
}

declare module 'next-auth/jwt' {
  /**
   * Mengatur tipe JWT agar menyertakan ID.
   */
  interface JWT {
    id: string
  }
}
