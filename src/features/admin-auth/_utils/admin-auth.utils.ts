import { ADMIN_AUTH_FALLBACK_ERROR } from '../_constants/admin-auth.constants'
import type { AdminAuthApiError } from '../_types/admin-auth.types'

// Mengambil pesan error aman dari response admin-auth tanpa menampilkan detail internal.
export function readAdminAuthError(data: AdminAuthApiError, fallback = ADMIN_AUTH_FALLBACK_ERROR) {
  return data.error?.message ?? fallback
}
