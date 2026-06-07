import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authConfig } from '@/lib/auth/config'
import { OnboardingFlow } from '@/features/user-onboarding/onboarding-flow'

// Flow server onboarding menjaga guard session sebelum client onboarding berjalan.
export async function OnboardingPageFlow() {
  const session = await getServerSession(authConfig)

  if (!session || session.user.revoked) {
    redirect('/auth/login')
  }

  if (!session.user.onboardingRequired) {
    redirect('/dashboard')
  }

  return <OnboardingFlow />
}
