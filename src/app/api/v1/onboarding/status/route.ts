import { NextResponse } from 'next/server'
import { OnboardingService } from '@/server/services/onboarding.service'
import { apiErrorResponse, getRequiredUserId } from '@/server/api/route-utils'
import { onboardingErrorResponse } from '@/server/api/onboarding.route-utils'

export async function GET() {
  const userId = await getRequiredUserId()
  if (!userId) {
    return apiErrorResponse('UNAUTHORIZED', 'Kamu perlu masuk dulu untuk membuka onboarding.', 401)
  }

  try {
    const status = await OnboardingService.getStatus(userId)
    return NextResponse.json(status)
  } catch (error) {
    return onboardingErrorResponse(error)
  }
}
