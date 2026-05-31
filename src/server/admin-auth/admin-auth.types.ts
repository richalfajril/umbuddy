// Role admin mengikuti enum AdminRole di Prisma schema tanpa mengimpor enum runtime.
export type AdminRoleValue = 'CONTENT' | 'SUPPORT' | 'SUPER_ADMIN'

// Payload login admin dari route handler sebelum divalidasi di service.
export type AdminLoginInput = {
  email: string
  password: string
  ip: string
  userAgent?: string | null
}

// Admin publik yang aman dikirim ke UI tanpa password_hash dan token internal.
export type PublicAdmin = {
  id: string
  email: string
  role: AdminRoleValue
  last_login_at: Date | null
}

// Hasil login admin berisi token mentah untuk cookie dan data admin aman untuk response.
export type AdminLoginResult = {
  token: string
  expiresAt: Date
  admin: PublicAdmin
}

// Session admin aktif yang dipakai guard server-side.
export type AdminSessionContext = {
  sessionId: string
  admin: PublicAdmin
}
