import { NextResponse } from 'next/server'
import { OnboardingService } from '@/server/services/onboarding.service'
import { apiErrorResponse, getRequiredUserId } from '@/server/api/route-utils'
import { onboardingErrorResponse } from '@/server/api/onboarding.route-utils'

export async function POST() {
  const userId = await getRequiredUserId()
  if (!userId) {
    return apiErrorResponse('UNAUTHORIZED', 'Kamu perlu masuk dulu untuk memulai tes mini.', 401)
  }

  try {
    const diagnostic = await OnboardingService.startDiagnostic(userId)
    return NextResponse.json(diagnostic)
  } catch (error) {
    return onboardingErrorResponse(error)
  }
}
