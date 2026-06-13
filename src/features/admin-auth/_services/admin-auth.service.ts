import { ADMIN_AUTH_ROUTES } from '../_constants/admin-auth.constants'
import type { AdminAuthApiError, AdminLoginFormState } from '../_types/admin-auth.types'

// Memanggil endpoint login admin tanpa mengekspos detail cookie httpOnly ke client.
export async function loginAdmin(payload: AdminLoginFormState) {
  const response = await fetch(ADMIN_AUTH_ROUTES.loginApi, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as AdminAuthApiError

  return { response, data }
}

// Memanggil endpoint logout admin agar server yang menghapus cookie sesi.
export async function logoutAdmin() {
  return fetch(ADMIN_AUTH_ROUTES.logoutApi, { method: 'POST' })
}
