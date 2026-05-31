// Tipe ringan untuk UI auth user-facing tanpa menyentuh NextAuth/server auth core.
export type GoogleOAuthStatus = 'PASS' | 'NOT_VERIFIED'

// Shape error API auth publik yang aman ditampilkan ke user.
export type ApiErrorResponse = {
  error?: {
    message?: string
  }
}

// Copy error auth yang sudah siap-render untuk halaman /auth/error.
export type AuthErrorCopy = {
  title: string
  description: string
}
