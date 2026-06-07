import { OnboardingError } from '@/server/services/onboarding.service'
import { apiErrorResponse } from './route-utils'

// Mapping error khusus onboarding service ke API response.
export function onboardingErrorResponse(error: unknown) {
  if (error instanceof OnboardingError) {
    return apiErrorResponse(error.code, error.message, error.status)
  }

  console.error('Onboarding API error:', error)
  return apiErrorResponse('INTERNAL_ERROR', 'Duh, sistem onboarding lagi tersandung. Coba lagi sebentar ya.', 500)
}
