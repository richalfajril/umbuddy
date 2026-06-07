import { PracticeError } from '@/server/services/practice.service'
import { apiErrorResponse } from './route-utils'

// Mapping error khusus practice service ke API response.
export function practiceErrorResponse(error: unknown) {
  if (error instanceof PracticeError) {
    return apiErrorResponse(error.code, error.message, error.status)
  }

  console.error('Practice API error:', error)
  return apiErrorResponse('INTERNAL_ERROR', 'Duh, latihan belum bisa diproses. Coba lagi sebentar ya.', 500)
}
