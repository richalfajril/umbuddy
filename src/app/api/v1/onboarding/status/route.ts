import { NextResponse } from 'next/server'
import { OnboardingService } from '@/server/services/onboarding.service'
import { errorResponse, getRequiredUserId, onboardingErrorResponse } from '../_utils'

export async function GET() {
  const userId = await getRequiredUserId()
  if (!userId) {
    return errorResponse('UNAUTHORIZED', 'Kamu perlu masuk dulu untuk membuka onboarding.', 401)
  }

  try {
    const status = await OnboardingService.getStatus(userId)
    return NextResponse.json(status)
  } catch (error) {
    return onboardingErrorResponse(error)
  }
}
