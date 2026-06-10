import { resolveProgression } from '@/features/shared/_utils/user-progression.utils'
import { UserProfileView } from '@/features/user-profile/_components/user-profile-view'
import {
  formatProfileDate,
  formatProfileNumber,
  getProfileCategoryPercent,
} from '@/features/user-profile/_utils/user-profile.utils'
import { getCachedUserSession } from '@/server/auth/session'
import { prisma } from '@/server/db/client'
import { redirect } from 'next/navigation'

// Server flow profil menjaga route tetap tipis dan semua query tetap di server.
export async function UserProfileFlow() {
  // Guard session mengikuti pola dashboard agar user tanpa sesi kembali ke login.
  const session = await getCachedUserSession()
  if (!session || session.user.revoked) {
    redirect('/auth/login')
  }

  // User yang belum onboarding tetap diarahkan ke onboarding sebelum melihat profil.
  if (session.user.onboardingRequired) {
    redirect('/onboarding')
  }

  // Query profil dibuat paralel karena tidak saling bergantung.
  const [user, profile, progression, latestDiagnostic, practiceAttempts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        created_at: true,
      },
    }),
    prisma.userProfile.findUnique({
      where: { user_id: session.user.id },
      select: {
        avatar_url: true,
        target_instansi: true,
        target_score: true,
        birth_date: true,
        province: true,
        city: true,
        institution: true,
        major: true,
      },
    }),
    prisma.userProgression.findUnique({
      where: { user_id: session.user.id },
      select: {
        total_xp: true,
        current_streak: true,
      },
    }),
    prisma.diagnosticAttempt.findFirst({
      where: {
        user_id: session.user.id,
        completed_at: { not: null },
      },
      orderBy: { completed_at: 'desc' },
      select: {
        total_score: true,
      },
    }),
    prisma.practiceAttempt.findMany({
      where: {
        session: {
          user_id: session.user.id,
          status: 'SUBMITTED',
          mode: { not: 'DIAGNOSTIC' },
        },
      },
      orderBy: { created_at: 'desc' },
      take: 100,
      select: {
        score: true,
        created_at: true,
        question: {
          select: {
            category: true,
          },
        },
      },
    }),
  ])

  // Progression mengisi top bar dan kartu statistik profil.
  const totalXp = progression?.total_xp ?? 0
  const currentProgression = resolveProgression(totalXp)
  const practiceScores = practiceAttempts.map((attempt) => attempt.score ?? 0)
  const averageScore =
    practiceScores.length > 0
      ? Math.round(practiceScores.reduce((total, score) => total + score, 0) / practiceScores.length)
      : 0
  const bestScore = practiceScores.length > 0 ? Math.round(Math.max(...practiceScores)) : 0

  // Target belajar memakai fallback agar profil tetap rapi walau onboarding belum lengkap.
  const targetLocation = [profile?.city, profile?.province].filter(Boolean).join(', ') || '-'
  const target = {
    targetInstansi: profile?.target_instansi || '-',
    targetScore: formatProfileNumber(profile?.target_score),
    targetLocation,
    birthDate: formatProfileDate(profile?.birth_date),
    institution: profile?.institution || '-',
    major: profile?.major || '-',
  }

  // Analytics subtes dihitung dari practice attempt terbaru.
  const analytics = (['TWK', 'TIU', 'TKP'] as const).map((category) => ({
    label: category,
    percent: getProfileCategoryPercent(practiceAttempts, category),
  }))

  // Recent activity diringkas agar profil tidak melakukan query tambahan di client.
  const recentActivity = practiceAttempts.slice(0, 6).map((attempt) => ({
    category: attempt.question.category,
    score: Math.round(attempt.score ?? 0),
    createdAt: formatProfileDate(attempt.created_at),
  }))

  return (
    <UserProfileView
      userName={user?.name ?? session.user.name}
      userEmail={user?.email ?? session.user.email}
      avatarUrl={profile?.avatar_url}
      joinedAt={formatProfileDate(user?.created_at)}
      streakDays={progression?.current_streak ?? 0}
      totalXp={totalXp}
      currentProgression={currentProgression}
      target={target}
      totalAnswered={practiceAttempts.length}
      averageScore={averageScore}
      bestScore={bestScore}
      diagnosticScore={latestDiagnostic?.total_score ? Math.round(latestDiagnostic.total_score) : 0}
      analytics={analytics}
      recentActivity={recentActivity}
    />
  )
}
