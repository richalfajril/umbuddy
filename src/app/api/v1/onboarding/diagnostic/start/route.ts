import { NextResponse } from 'next/server'
import { OnboardingService } from '@/server/services/onboarding.service'
import { errorResponse, getRequiredUserId, onboardingErrorResponse } from '../../_utils'

export async function POST() {
  const userId = await getRequiredUserId()
  if (!userId) {
    return errorResponse('UNAUTHORIZED', 'Kamu perlu masuk dulu untuk memulai tes mini.', 401)
  }

  try {
    const diagnostic = await OnboardingService.startDiagnostic(userId)
    return NextResponse.json(diagnostic)
  } catch (error) {
    return onboardingErrorResponse(error)
  }
}
