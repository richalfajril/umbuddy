import { NextResponse } from 'next/server'
import { validateDto } from '@/server/validation/dto'
import { OnboardingService } from '@/server/services/onboarding.service'
import { apiErrorResponse, getRequiredUserId, readApiJson } from '@/server/api/route-utils'
import { onboardingErrorResponse } from '@/server/api/onboarding.route-utils'
import { OnboardingProfileDto } from '@/server/validation/onboarding/profile.dto'

export async function POST(req: Request) {
  const userId = await getRequiredUserId()
  if (!userId) {
    return apiErrorResponse('UNAUTHORIZED', 'Kamu perlu masuk dulu untuk menyimpan profil.', 401)
  }

  const { payload, error } = await readApiJson(req)
  if (error) return error

  const validation = await validateDto(OnboardingProfileDto, payload)
  if (validation.data === null) {
    return apiErrorResponse(
      'VALIDATION_ERROR',
      'Data profil belum lengkap.',
      400,
      validation.errors
    )
  }

  try {
    const result = await OnboardingService.saveProfile(userId, validation.data)
    return NextResponse.json({
      message: 'Profil belajarmu sudah tersimpan.',
      ...result,
    })
  } catch (caughtError) {
    return onboardingErrorResponse(caughtError)
  }
}
