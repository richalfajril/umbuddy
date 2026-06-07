import { NextResponse } from 'next/server'
import { validateDto } from '@/server/validation/dto'
import { OnboardingService } from '@/server/services/onboarding.service'
import { errorResponse, getRequiredUserId, onboardingErrorResponse, readJson } from '../_utils'
import { OnboardingProfileDto } from './profile.dto'

export async function POST(req: Request) {
  const userId = await getRequiredUserId()
  if (!userId) {
    return errorResponse('UNAUTHORIZED', 'Kamu perlu masuk dulu untuk menyimpan profil.', 401)
  }

  const { payload, error } = await readJson(req)
  if (error) return error

  const validation = await validateDto(OnboardingProfileDto, payload)
  if (validation.data === null) {
    return errorResponse(
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
