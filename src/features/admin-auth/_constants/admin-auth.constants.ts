import type { AdminLoginFormState } from '../_types/admin-auth.types'

// Nilai awal form login admin agar state client tidak tersebar di komponen.
export const ADMIN_LOGIN_INITIAL_FORM: AdminLoginFormState = {
  email: '',
  password: '',
}

// Route admin-auth dikumpulkan agar redirect dan fetch tetap konsisten.
export const ADMIN_AUTH_ROUTES = {
  dashboard: '/admin/dashboard',
  login: '/admin/login',
  loginApi: '/api/v1/admin/auth/login',
  logoutApi: '/api/v1/admin/auth/logout',
} as const

// Copy loading admin login menjaga pesan transisi konsisten dengan backoffice.
export const ADMIN_LOGIN_LOADING_TEXT = 'Menyiapkan ruang kendali Umbuddy...'

// Konfigurasi progress splash admin dibuat eksplisit agar durasi terasa stabil.
export const ADMIN_LOGIN_PROGRESS = {
  maxBeforeRedirect: 98,
  step: 2,
  intervalMs: 50,
} as const

// Pesan fallback admin-auth dipakai saat API tidak mengirim error yang aman.
export const ADMIN_AUTH_FALLBACK_ERROR = 'Login admin belum berhasil.'
