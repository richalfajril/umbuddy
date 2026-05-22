import Image from 'next/image'
import Link from 'next/link'
import {
  Check,
  ChevronRight,
  Flame,
  Home,
  PencilLine,
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
  Sidebar,
  type AppNavItem,
} from '@/components/ui'

const DASHBOARD_NAV_ITEMS: AppNavItem[] = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Practice', href: '/practice', icon: PencilLine, disabled: true },
  { label: 'Battle', href: '/battle', icon: Swords, disabled: true },
  { label: 'Rank', href: '/leaderboard', icon: Trophy, disabled: true },
  { label: 'Profile', href: '/profile', icon: UserRound, disabled: true },
]

const friendsPreview = [
  { name: 'Siska Amelia', initial: 'S', online: true },
  { name: 'Dimas P.', initial: 'D', online: true },
  { name: 'Arya Wijaya', initial: 'A', online: true },
  { name: 'Budi S.', initial: 'B', online: false },
]

const rankingPreview = [
  { rank: '01', name: 'Aris M.', score: '24.5k', tone: 'bg-xp' },
  { rank: '02', name: 'Budi S.', score: '22.1k', tone: 'bg-muted' },
  { rank: '142', name: 'YOU', score: '12.4k', tone: 'bg-primary', highlight: true },
  { rank: '143', name: 'Citra W.', score: '12.3k', tone: 'bg-slate-500' },
]

function getScorePercent(score: number | null | undefined, maxScore: number) {
  if (!score) return 0
  return Math.max(0, Math.min(Math.round((score / maxScore) * 100), 100))
}

function getWeakestArea(scores: Array<{ label: string; percent: number }>) {
  return [...scores].sort((a, b) => a.percent - b.percent)[0]
}

function DashboardTopBar({
  streakDays,
}: {
  streakDays: number
}) {
  const initialXp = 50
  const nextRankXp = 300
  const progressPercentage = Math.round((initialXp / nextRankXp) * 100)

  return (
    <div className="flex min-h-[96px] items-center justify-between gap-4 px-4 md:px-8">
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-3 rounded-[1.75rem] border-2 border-border bg-background/90 p-2.5 pr-4 shadow-[0_5px_0_0_var(--color-border)] dark:bg-surface/90 md:gap-4 md:pr-5">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-xp-light ring-2 ring-xp/35 dark:bg-xp-light">
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary shadow-[0_0_0_4px_var(--color-background)] dark:shadow-[0_0_0_4px_var(--color-surface)]" aria-hidden="true" />
            <Image
              src="/badge/umbies_I_a.png"
              alt=""
              width={64}
              height={64}
              className="h-14 w-14 object-contain drop-shadow-sm"
              aria-hidden="true"
              priority
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="truncate font-display text-2xl font-black leading-tight text-headline md:text-3xl">
                Umbies
              </p>
              <p className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-black text-muted dark:bg-background">
                Golongan I/a
              </p>
            </div>

            <div className="mt-2 w-[210px] max-w-[52vw] md:w-[320px]">
              <div className="flex items-center justify-between gap-3 text-xs font-black text-muted">
                <span className="text-headline">{initialXp} / {nextRankXp} xp</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="mt-1.5 h-3 rounded-full border border-border bg-surface p-0.5 dark:bg-background">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-xp"
                  style={{ width: `${progressPercentage}%` }}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-1 text-[11px] font-bold text-muted">
                Progress awal menuju kenaikan golongan berikutnya.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="flex min-h-[44px] items-center gap-1.5 font-display text-xl font-black text-headline">
          <Flame className="h-7 w-7 fill-error text-error" aria-hidden="true" />
          <span>{streakDays}</span>
        </div>
        <div className="hidden min-h-[44px] items-center gap-2 text-sm font-bold text-headline sm:flex">
          <span className="h-3 w-3 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          <span>4.120 users</span>
        </div>
      </div>
    </div>
  )
}

function MissionRow({
  title,
  status,
  progress,
  done = false,
}: {
  title: string
  status: string
  progress: number
  done?: boolean
}) {
  return (
    <div className="space-y-2">
      <div className="flex min-h-[44px] items-center gap-3">
        <div
          className={[
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2',
            done
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-background dark:bg-surface',
          ].join(' ')}
        >
          {done && <Check className="h-4 w-4" aria-hidden="true" />}
        </div>
        <p className="flex-1 text-sm font-black text-headline">{title}</p>
        <p className={['text-xs font-bold', done ? 'text-primary' : 'text-muted'].join(' ')}>
          {status}
        </p>
      </div>
      <div className="ml-9 h-2 rounded-full bg-surface dark:bg-background">
        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

function AnalyticsBar({
  label,
  percent,
  tone = 'primary',
}: {
  label: string
  percent: number
  tone?: 'primary' | 'xp' | 'error'
}) {
  const toneClass = {
    primary: 'bg-primary',
    xp: 'bg-xp',
    error: 'bg-error',
  }[tone]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-headline">{label}</p>
        <p className="text-sm font-black text-headline">{percent}%</p>
      </div>
      <div className="h-3 rounded-full bg-surface dark:bg-background">
        <div className={['h-full rounded-full', toneClass].join(' ')} style={{ width: `${percent}%` }} />
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
      },
    }),
  ])

  const totalXp = progression?.total_xp ?? 0
  const streakDays = progression?.current_streak ?? 0
  const diagnosticScore = latestDiagnostic?.total_score ? Math.round(latestDiagnostic.total_score) : 0
  const targetScoreDisplay = profile?.target_score?.toLocaleString('id-ID') ?? '-'
  const targetLocation = [profile?.city, profile?.province].filter(Boolean).join(', ')
  const analytics = [
    { label: 'TWK', percent: getScorePercent(latestDiagnostic?.score_twk, 150), tone: 'primary' as const },
    { label: 'TIU', percent: getScorePercent(latestDiagnostic?.score_tiu, 175), tone: 'xp' as const },
    { label: 'TKP', percent: getScorePercent(latestDiagnostic?.score_tkp, 225), tone: 'primary' as const },
  ]
  const weakestArea = latestDiagnostic ? getWeakestArea(analytics) : null

  return (
    <>
      <BentoDashboardLayout
      topBar={
        <DashboardTopBar
          streakDays={streakDays}
        />
      }
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
      <div className="mx-auto grid w-full max-w-[1180px] gap-4 xl:grid-cols-12">
        <Card padding="lg" className="card-static overflow-hidden xl:col-span-5">
          <div className="flex items-center gap-5">
            <Image
              src="/mascot/mascot_greeting.png"
              alt=""
              width={124}
              height={124}
              className="hidden h-24 w-24 shrink-0 object-contain sm:block"
              aria-hidden="true"
              priority
            />
            <div className="min-w-0">
              <h1 className="font-display text-3xl font-black leading-tight text-headline">
                Hai, <span className="text-primary">{session.user.name || 'Pejuang'}</span>!
              </h1>
              <p className="mt-3 text-sm leading-6 text-body">
                Markas belajarmu sudah siap. Fokus hari ini ke langkah kecil yang paling berdampak buat target CPNS Kamu.
              </p>
              <Link
                href="#daily-missions"
                className="btn-primary mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 px-5 py-2.5 text-sm"
              >
                Mulai Daily Practice
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Card>

        <Card padding="lg" className="card-static xl:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-headline">Progress Score</p>
                <p className="font-display text-4xl font-black leading-none text-headline">
                  {diagnosticScore || '-'}
                </p>
              </div>
              <Badge variant="success" size="sm">{latestDiagnostic ? 'Aktif' : 'Baru'}</Badge>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 xl:border-l-0 xl:border-t xl:pl-0 xl:pt-4">
              <div>
                <p className="text-sm font-bold text-headline">Target Score</p>
                <p className="font-display text-4xl font-black leading-none text-headline">
                  {targetScoreDisplay}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-beige text-headline dark:bg-beige/80">
                <Target className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
          </div>
        </Card>

        <Card padding="lg" className="card-static xl:col-span-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-headline">Teman Online</h2>
            <div className="flex gap-2 text-muted">
              <ChevronRight className="h-5 w-5 rotate-180" aria-hidden="true" />
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-4 gap-3">
            {friendsPreview.map((friend) => (
              <div key={friend.name} className="min-w-0 text-center">
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface text-lg font-black text-headline">
                  {friend.initial}
                  <span
                    className={[
                      'absolute bottom-0 right-1 h-3.5 w-3.5 rounded-full border-2 border-background',
                      friend.online ? 'bg-primary' : 'bg-muted',
                    ].join(' ')}
                  />
                </div>
                <p className="mt-2 truncate text-xs font-bold text-headline">
                  {friend.name}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg" className="card-static relative min-h-[220px] overflow-hidden xl:col-span-5">
          <Swords className="absolute -right-8 bottom-4 h-40 w-40 rotate-[-18deg] text-border/60 dark:text-border/30" aria-hidden="true" />
          <div className="relative z-10 max-w-sm">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Competitive Mode
            </p>
            <h2 className="mt-3 font-display text-5xl font-black uppercase italic leading-[0.9] text-headline">
              Battle Arena
            </h2>
            <p className="mt-4 text-sm leading-6 text-body">
              Tantang temanmu dalam simulasi CAT real-time. Pemenang mendapatkan bonus XP saat mode battle aktif.
            </p>
            <span className="btn-primary mt-5 inline-flex min-h-[44px] items-center justify-center px-5 py-2.5 text-sm opacity-70">
              Tantang Dia!
            </span>
          </div>
        </Card>

        <Card padding="lg" className="card-static relative min-h-[220px] overflow-hidden xl:col-span-4">
          <div className="absolute bottom-1 right-4 font-display text-8xl font-black uppercase text-border/35 dark:text-border/20" aria-hidden="true">
            CAT
          </div>
          <div className="relative z-10 max-w-sm">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-muted">
              Main Simulation
            </p>
            <h2 className="mt-3 font-display text-5xl font-black uppercase leading-[0.9] text-headline">
              Simulasi CAT
            </h2>
            <p className="mt-4 text-sm leading-6 text-body">
              Practice with 110 real exam questions. Siap dipakai setelah core practice aktif.
            </p>
            <span className="btn-primary mt-5 inline-flex min-h-[44px] items-center justify-center px-5 py-2.5 text-sm opacity-70">
              Ayo Lanjut!
            </span>
          </div>
        </Card>

        <Card padding="md" className="card-static row-span-2 xl:col-span-3">
          <div className="grid grid-cols-2 rounded-2xl bg-surface p-1 text-sm font-black text-body dark:bg-background">
            <button className="min-h-[44px] rounded-xl bg-background text-headline shadow-sm dark:bg-surface">
              Rankings National
            </button>
            <button className="min-h-[44px] rounded-xl text-muted">
              Friend Rankings
            </button>
          </div>
          <div className="mt-4 grid gap-3">
            {rankingPreview.map((row) => (
              <div
                key={row.rank}
                className={[
                  'grid min-h-[56px] grid-cols-[32px_40px_1fr_auto] items-center gap-3 rounded-xl px-2 text-sm',
                  row.highlight ? 'bg-primary-light text-primary-dark dark:bg-primary/15 dark:text-primary' : 'text-headline',
                ].join(' ')}
              >
                <span className="font-black text-muted">{row.rank}</span>
                <span className={['h-9 w-9 rounded-full', row.tone].join(' ')} />
                <span className="min-w-0 truncate font-black">{row.name}</span>
                <span className="font-bold">{row.highlight ? totalXp.toLocaleString('id-ID') : row.score}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card id="daily-missions" padding="lg" className="card-static xl:col-span-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-black uppercase text-headline">
              Daily Missions
            </h2>
            <p className="text-sm font-black text-headline">2/3</p>
          </div>
          <div className="grid gap-4">
            <MissionRow title="Complete 20 TWK Questions" status="Done" progress={100} done />
            <MissionRow title="Win 1 Battle Arena" status="0/1" progress={0} />
            <MissionRow title="Login for 3 days streak" status={`${Math.min(streakDays, 3)}/3`} progress={Math.min(streakDays / 3 * 100, 100)} />
          </div>
        </Card>

        <Card padding="lg" className="card-static xl:col-span-5">
          <h2 className="font-display text-xl font-black uppercase text-headline">
            Tactical Analytics
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <AnalyticsBar label="TWK" percent={analytics[0].percent} />
            <AnalyticsBar label="TIU" percent={analytics[1].percent} tone="xp" />
            <AnalyticsBar label="TKP" percent={analytics[2].percent} />
          </div>
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-sm font-black text-headline">Coach Narrative</p>
            <h3 className="mt-1 font-display text-xl font-black leading-tight text-headline">
              {weakestArea ? (
                <>
                  Fokus pada <span className="text-primary">{weakestArea.label}</span> dulu...
                </>
              ) : (
                <>
                  Selesaikan <span className="text-primary">diagnostic</span> dulu...
                </>
              )}
            </h3>
            <p className="mt-2 text-sm leading-6 text-body">
              {weakestArea
                ? `Area ${weakestArea.label} jadi prioritas awal. Setelah practice aktif, Umbuddy akan mengarahkan Kamu ke latihan yang paling relevan.`
                : 'Belum ada data cukup untuk membaca pola Kamu. Diagnostic mini akan jadi titik awal rekomendasi.'}
            </p>
            {targetLocation && (
              <p className="mt-2 text-xs font-bold text-muted">
                Target area: {targetLocation}
              </p>
            )}
          </div>
        </Card>

        <Card padding="lg" className="card-static relative overflow-hidden bg-primary text-white dark:bg-primary-dark xl:col-span-3">
          <Image
            src="/mascot/mascot_donation.png"
            alt=""
            width={120}
            height={120}
            className="absolute -right-3 -top-3 h-24 w-24 object-contain opacity-90"
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-[220px]">
            <h2 className="font-display text-3xl font-black leading-none">
              Donasi
            </h2>
            <p className="mt-1 text-lg font-black">Dukung Umbuddy!</p>
            <p className="mt-3 text-xs leading-5 text-white/85">
              Bantu server tetap ringan dan Umbuddy tetap gratis untuk pejuang CPNS lain.
            </p>
            <Link
              href="https://saweria.co"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-xp px-4 text-sm font-black text-headline shadow-[0_4px_0_0_#b38b08]"
            >
              Dukung via Saweria
            </Link>
          </div>
        </Card>
      </div>
    </BentoDashboardLayout>
    <ThemeToggle />
    </>
  )
}
