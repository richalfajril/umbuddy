import { getCachedUserSession } from '@/server/auth/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/server/db/client'
import { resolveProgression } from '@/features/shared/_utils/user-progression.utils'
import { PracticeFlow } from '@/features/user-practice/user-practice-flow'

// Flow server practice menjaga auth guard dan mengambil data header sebelum latihan client dimulai.
export async function PracticePageFlow() {
  const session = await getCachedUserSession()

  if (!session || session.user.revoked) {
    redirect('/auth/login')
  }

  if (session.user.onboardingRequired) {
    redirect('/onboarding')
  }

  // Progression dibaca server-side agar header Practice konsisten dengan Dashboard.
  const progression = await prisma.userProgression.findUnique({
    where: { user_id: session.user.id },
    select: {
      total_xp: true,
      current_streak: true,
    },
  })

  // Mapping XP ke badge, jabatan, golongan, dan progress bar top bar.
  const currentProgression = resolveProgression(progression?.total_xp ?? 0)

  return (
    <PracticeFlow
      userName={session.user.name}
      userEmail={session.user.email}
      streakDays={progression?.current_streak ?? 0}
      currentProgression={currentProgression}
    />
  )
}
