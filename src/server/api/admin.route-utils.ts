import { AdminAuthService } from '@/server/admin-auth'
import { AdminQuestionError } from '@/server/admin-questions'
import { apiErrorResponse } from './route-utils'

// Membaca session admin dari cookie httpOnly untuk semua endpoint admin.
export async function getRequiredAdmin() {
  return AdminAuthService.getCurrentAdmin()
}

// Error domain admin dipetakan ke response JSON yang ramah backoffice.
export function adminQuestionErrorResponse(error: unknown) {
  if (error instanceof AdminQuestionError) {
    return apiErrorResponse(error.code, error.message, error.status, error.details)
  }

  console.error('Admin question API error:', error)
  return apiErrorResponse('INTERNAL_ERROR', 'Aksi soal belum bisa diproses. Coba lagi sebentar.', 500)
}
