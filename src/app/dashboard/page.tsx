import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  ClipboardList,
  Home,
  ShieldCheck,
  Swords,
  Target,
  Trophy,
  UserRound,
} from 'lucide-react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authConfig } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma/client'
import { ThemeToggle } from '@/components/atoms/theme-toggle'
import { BentoDashboardLayout } from '@/components/layouts/bento-dashboard-layout'
import {
  Badge,
  BottomNav,
  Card,
  EmptyState,
  MascotState,
  Sidebar,
  StreakIndicator,
  XPBar,
  type AppNavItem,
} from '@/components/ui'

const DASHBOARD_NAV_ITEMS: AppNavItem[] = [
  { label: 'Markas', href: '/dashboard', icon: Home },
  { label: 'Latihan', href: '/practice', icon: BookOpenCheck, disabled: true },
  { label: 'Battle', href: '/battle', icon: Swords, disabled: true },
  { label: 'Rank', href: '/leaderboard', icon: Trophy, disabled: true },
  { label: 'Profil', href: '/profile', icon: UserRound, disabled: true },
]

function calculateLevelProgress(totalXp: number, level: number) {
  const safeLevel = Math.max(level, 1)
  const levelBase = (safeLevel - 1) * 1000
  const nextThreshold = safeLevel * 1000
  const progress = ((totalXp - levelBase) / (nextThreshold - levelBase)) * 100

  return {
    nextThreshold,
    progressPercentage: Math.max(0, Math.min(progress, 100)),
  }
}

function getWeakestArea(attempt: {
  score_twk: number | null
  score_tiu: number | null
  score_tkp: number | null
}) {
  const areas = [
    { label: 'TWK', score: attempt.score_twk ?? 0, max: 150 },
    { label: 'TIU', score: attempt.score_tiu ?? 0, max: 175 },
    { label: 'TKP', score: attempt.score_tkp ?? 0, max: 225 },
  ]

  return areas.sort((a, b) => a.score / a.max - b.score / b.max)[0]
}

function DashboardTopBar({
  totalXp,
  streakDays,
}: {
  totalXp: number
  streakDays: number
}) {
  return (
    <div className="flex min-h-[72px] items-center justify-between gap-3 px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <Image
          src="/logo/logo_only.png"
          alt="Umbuddy"
          width={44}
          height={44}
          className="h-11 w-11 rounded-xl"
          priority
        />
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-primary">
            Dashboard
          </p>
          <p className="truncate font-display text-lg font-black text-headline">
            Markas Umbuddy
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="hidden rounded-full border-2 border-border bg-surface px-3 py-2 text-sm font-black text-headline sm:block">
          {totalXp.toLocaleString('id-ID')} XP
        </div>
        <StreakIndicator streakDays={streakDays} size="sm" />
        <ThemeToggle variant="inline" />
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const session = await getServerSession(authConfig)
  if (!session || session.user.revoked) {
    redirect('/auth/login')
  }

  if (session.user.onboardingRequired) {
    redirect('/onboarding')
  }

  const [profile, progression, latestDiagnostic] = await Promise.all([
    prisma.userProfile.findUnique({
      where: { user_id: session.user.id },
      select: {
        target_instansi: true,
        target_score: true,
        exam_date: true,
        province: true,
        city: true,
      },
    }),
    prisma.userProgression.findUnique({
      where: { user_id: session.user.id },
      select: {
        total_xp: true,
        level: true,
        golongan: true,
        jabatan: true,
        current_streak: true,
        best_streak: true,
      },
    }),
    prisma.diagnosticAttempt.findFirst({
      where: {
        user_id: session.user.id,
        completed_at: { not: null },
      },
      orderBy: { completed_at: 'desc' },
      select: {
        score_twk: true,
        score_tiu: true,
        score_tkp: true,
        total_score: true,
        completed_at: true,
      },
    }),
  ])

  const totalXp = progression?.total_xp ?? 0
  const level = progression?.level ?? 1
  const streakDays = progression?.current_streak ?? 0
  const levelProgress = calculateLevelProgress(totalXp, level)
  const currentTitle = progression?.jabatan || progression?.golongan || `Level ${level}`
  const weakestArea = latestDiagnostic ? getWeakestArea(latestDiagnostic) : null
  const targetLocation = [profile?.city, profile?.province].filter(Boolean).join(', ')

  return (
    <BentoDashboardLayout
      topBar={<DashboardTopBar totalXp={totalXp} streakDays={streakDays} />}
      bottomNav={<BottomNav items={DASHBOARD_NAV_ITEMS} activeHref="/dashboard" />}
      sidebar={
        <Sidebar
          items={DASHBOARD_NAV_ITEMS}
          activeHref="/dashboard"
          userName={session.user.name}
          userEmail={session.user.email}
        />
      }
    >
      <div className="mx-auto grid w-full max-w-7xl gap-4 lg:grid-cols-12">
        <Card padding="lg" className="card-static lg:col-span-8">
          <MascotState
            variant="greeting"
            size="lg"
            title={
              <>
                Hai, <span className="text-primary">{session.user.name || 'Pejuang'}</span>!
              </>
            }
            description="Markas belajarmu sudah siap. Hari ini kita fokus ke langkah kecil yang paling berdampak buat target CPNS Kamu."
            action={
              <Link
                href="#next-action"
                className="btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 px-5 py-2.5 text-sm"
              >
                Lihat Rekomendasi
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
        </Card>

        <Card padding="lg" className="lg:col-span-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-primary">Progress XP</p>
              <h2 className="mt-1 font-display text-2xl font-black text-headline">
                Level {level}
              </h2>
            </div>
            <Badge variant="xp">+{totalXp.toLocaleString('id-ID')} XP</Badge>
          </div>
          <XPBar
            currentTitle={currentTitle}
            currentXP={totalXp}
            nextThresholdXP={levelProgress.nextThreshold}
            progressPercentage={levelProgress.progressPercentage}
            nextTitle={`Level ${level + 1}`}
            className="mt-5"
          />
        </Card>

        <section className="grid gap-4 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-4" aria-label="Ringkasan utama">
          <Card padding="md">
            <Trophy className="h-7 w-7 text-primary" aria-hidden="true" />
            <p className="mt-4 text-sm font-bold text-muted">Total XP</p>
            <p className="font-display text-3xl font-black text-headline">
              {totalXp.toLocaleString('id-ID')}
            </p>
          </Card>

          <Card padding="md">
            <ShieldCheck className="h-7 w-7 text-primary" aria-hidden="true" />
            <p className="mt-4 text-sm font-bold text-muted">Streak Saat Ini</p>
            <p className="font-display text-3xl font-black text-headline">
              {streakDays} hari
            </p>
          </Card>

          <Card padding="md">
            <BarChart3 className="h-7 w-7 text-primary" aria-hidden="true" />
            <p className="mt-4 text-sm font-bold text-muted">Skor Diagnostic</p>
            <p className="font-display text-3xl font-black text-headline">
              {latestDiagnostic?.total_score ? Math.round(latestDiagnostic.total_score) : 0}
            </p>
          </Card>

          <Card padding="md">
            <Target className="h-7 w-7 text-primary" aria-hidden="true" />
            <p className="mt-4 text-sm font-bold text-muted">Target Skor</p>
            <p className="font-display text-3xl font-black text-headline">
              {profile?.target_score ?? '-'}
            </p>
          </Card>
        </section>

        <Card id="next-action" padding="lg" className="lg:col-span-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary-dark dark:bg-primary/10 dark:text-primary">
              <ClipboardList className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black uppercase text-primary">Rekomendasi Awal</p>
              <h2 className="mt-1 font-display text-2xl font-black text-headline">
                {weakestArea ? (
                  <>
                    Perkuat <span className="text-primary">{weakestArea.label}</span> dulu
                  </>
                ) : (
                  <>
                    Mulai dari <span className="text-primary">tes mini</span>
                  </>
                )}
              </h2>
              <p className="mt-3 text-sm leading-6 text-body">
                {weakestArea
                  ? `Area ${weakestArea.label} terlihat paling butuh perhatian dari hasil diagnostic. Begitu modul latihan aktif, Kamu bisa langsung mulai dari sana.`
                  : 'Selesaikan onboarding diagnostic untuk membuka rekomendasi belajar yang lebih personal.'}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg" className="lg:col-span-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-beige text-headline dark:bg-beige/80">
              <CalendarDays className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black uppercase text-primary">Target Kamu</p>
              <h2 className="mt-1 font-display text-2xl font-black text-headline">
                {profile?.target_instansi || 'Belum diatur'}
              </h2>
              <p className="mt-3 text-sm leading-6 text-body">
                {targetLocation || 'Lengkapi profil target supaya dashboard bisa memberi arah belajar yang lebih pas.'}
              </p>
            </div>
          </div>
        </Card>

        <EmptyState
          className="lg:col-span-6"
          mascot="encouraging"
          title={
            <>
              Aktivitas <span className="text-primary">belum ramai</span>
            </>
          }
          description="Riwayat latihan, battle, dan misi harian akan muncul di sini setelah fitur berikutnya aktif."
          icon={BookOpenCheck}
        />

        <EmptyState
          className="lg:col-span-6"
          mascot="detective"
          title={
            <>
              Insight <span className="text-primary">sedang disiapkan</span>
            </>
          }
          description="Grafik tren mingguan dan peluang kelulusan akan memakai data latihan Kamu, bukan angka tebak-tebakan."
          icon={BarChart3}
        />
      </div>
    </BentoDashboardLayout>
  )
}
