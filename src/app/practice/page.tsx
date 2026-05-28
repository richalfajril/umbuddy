import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authConfig } from '@/lib/auth/config'
import { PracticeFlow } from './practice-flow'

export default async function PracticePage() {
  const session = await getServerSession(authConfig)
  if (!session || session.user.revoked) {
    redirect('/auth/login')
  }

  if (session.user.onboardingRequired) {
    redirect('/onboarding')
  }

  return <PracticeFlow />
}
