import { getUserSession } from '@/server/auth/session'
import { redirect } from 'next/navigation'
import { OnboardingFlow } from '@/features/user-onboarding/user-onboarding-flow'

// Flow server onboarding menjaga guard session sebelum client onboarding berjalan.
export async function OnboardingPageFlow() {
  const session = await getUserSession()

  if (!session || session.user.revoked) {
    redirect('/auth/login')
  }

  if (!session.user.onboardingRequired) {
    redirect('/dashboard')
  }

  return <OnboardingFlow />
}
