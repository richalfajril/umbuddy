// Nama cookie session admin dipisah dari session user agar dua area auth tidak bertabrakan.
export const ADMIN_SESSION_COOKIE = 'umbuddy_admin_session'

// Masa hidup session admin mengikuti A1: backoffice harus lebih pendek dari session user.
export const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60

// Rate limit login admin dibuat ketat karena endpoint ini melindungi backoffice.
export const ADMIN_LOGIN_RATE_LIMIT = {
  attempts: 5,
  windowSeconds: 15 * 60,
} as const
