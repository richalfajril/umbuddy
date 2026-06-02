import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authConfig } from '@/lib/auth/config'
import { RouteTransition } from '@/components/templates'
import { PracticeFlow } from '@/features/user-practice/practice-flow'

export default async function PracticePage() {
  const session = await getServerSession(authConfig)
  if (!session || session.user.revoked) {
    redirect('/auth/login')
  }

  if (session.user.onboardingRequired) {
    redirect('/onboarding')
  }

  return (
    <RouteTransition>
      <PracticeFlow
        userName={session.user.name}
        userEmail={session.user.email}
      />
    </RouteTransition>
  )
}
