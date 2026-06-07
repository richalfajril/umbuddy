import type { AdminRoleValue } from './admin-auth.types'

// Memeriksa apakah role admin memiliki izin untuk mengelola soal.
export function canManageQuestions(role: AdminRoleValue): boolean {
  return role === 'CONTENT' || role === 'SUPER_ADMIN'
}
