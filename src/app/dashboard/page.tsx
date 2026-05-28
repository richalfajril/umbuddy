import { ThemeToggle } from "@/components/atoms/theme-toggle";
import { BentoDashboardLayout } from "@/components/layouts/bento-dashboard-layout";
import {
  Badge,
  BottomNav,
  Card,
  Sidebar,
  StreakIndicator,
  XPBar,
  type AppNavItem,
} from "@/components/ui";
import { authConfig } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";
import {
  Check,
  ChevronRight,
  Heart,
  Home,
  PencilLine,
  Swords,
  Target,
  Trophy,
  UserRound,
} from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const DASHBOARD_NAV_ITEMS: AppNavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Practice", href: "/practice", icon: PencilLine, disabled: true },
  { label: "Battle", href: "/battle", icon: Swords, disabled: true },
  { label: "Rank", href: "/leaderboard", icon: Trophy, disabled: true },
  { label: "Profile", href: "/profile", icon: UserRound, disabled: true },
];

const friendsPreview = [
  { name: "Siska Amelia", initial: "S", online: true },
  { name: "Dimas P.", initial: "D", online: true },
  { name: "Arya Wijaya", initial: "A", online: true },
  { name: "Budi S.", initial: "B", online: false },
];

const rankingPreview = [
  {
    rank: "1",
    initial: "R",
    name: "Rani",
    title: "Esmelon III",
    xp: "18.4k XP",
    tone: "bg-xp",
    rankTone: "from-xp to-[#f59e0b]",
    badge: "/badge/esmelon_III_d.png",
  },
  {
    rank: "2",
    initial: "B",
    name: "Bima",
    title: "Umbies Senior",
    xp: "17.9k XP",
    tone: "bg-primary",
    rankTone: "from-slate-200 to-slate-400",
    badge: "/badge/umbies_senior_III_a.png",
  },
  {
    rank: "3",
    initial: "A",
    name: "Alya",
    title: "Umbies I",
    xp: "17.0k XP",
    tone: "bg-error",
    rankTone: "from-[#f4b183] to-[#c07635]",
    badge: "/badge/umbies_I_a.png",
  },
];

const dashboardCardGlow =
  "hover:shadow-[0_0_0_4px_rgba(116,195,50,0.18),0_18px_36px_-24px_rgba(116,195,50,0.55)]";

const progressionRanks = [
  {
    golongan: "I/a",
    requiredXp: 0,
    jabatan: "Umbies",
    badge: "umbies_I_a.png",
  },
  {
    golongan: "I/b",
    requiredXp: 300,
    jabatan: "Umbies",
    badge: "umbies_I_b.png",
  },
  {
    golongan: "I/c",
    requiredXp: 800,
    jabatan: "Umbies",
    badge: "umbies_I_c.png",
  },
  {
    golongan: "I/d",
    requiredXp: 1500,
    jabatan: "Umbies",
    badge: "umbies_I_d.png",
  },
  {
    golongan: "II/a",
    requiredXp: 2500,
    jabatan: "Umbies Senior",
    badge: "umbies_senior_II_a.png",
  },
  {
    golongan: "II/b",
    requiredXp: 4000,
    jabatan: "Umbies Senior",
    badge: "umbies_senior_II_b.png",
  },
  {
    golongan: "II/c",
    requiredXp: 6000,
    jabatan: "Umbies Senior",
    badge: "umbies_senior_II_c.png",
  },
  {
    golongan: "II/d",
    requiredXp: 8500,
    jabatan: "Umbies Senior",
    badge: "umbies_senior_II_d.png",
  },
  {
    golongan: "III/a",
    requiredXp: 12000,
    jabatan: "Umbies Senior",
    badge: "umbies_senior_III_a.png",
  },
  {
    golongan: "III/b",
    requiredXp: 16000,
    jabatan: "Esmelon IV",
    badge: "esmelon_III_b.png",
  },
  {
    golongan: "III/c",
    requiredXp: 21000,
    jabatan: "Esmelon IV",
    badge: "esmelon_III_c.png",
  },
  {
    golongan: "III/d",
    requiredXp: 27000,
    jabatan: "Esmelon III",
    badge: "esmelon_III_d.png",
  },
  {
    golongan: "IV/a",
    requiredXp: 34000,
    jabatan: "Esmelon III",
    badge: "esmelon_IV_a.png",
  },
  {
    golongan: "IV/b",
    requiredXp: 42000,
    jabatan: "Esmelon II",
    badge: "esmelon_IV_b.png",
  },
  {
    golongan: "IV/c",
    requiredXp: 51000,
    jabatan: "Esmelon II",
    badge: "esmelon_IV_c.png",
  },
  {
    golongan: "IV/d",
    requiredXp: 61000,
    jabatan: "Esmelon I",
    badge: "esmelon_IV_d.png",
  },
  {
    golongan: "IV/e",
    requiredXp: 72000,
    jabatan: "Esmelon I",
    badge: "esmelon_IV_e.png",
  },
  {
    golongan: "MAX",
    requiredXp: 85000,
    jabatan: "Menteri",
    badge: "menteri.png",
  },
] as const;

function resolveProgression(totalXp: number) {
  let currentIndex = 0;
  for (let index = progressionRanks.length - 1; index >= 0; index -= 1) {
    if (progressionRanks[index].requiredXp <= totalXp) {
      currentIndex = index;
      break;
    }
  }
  const current = progressionRanks[Math.max(currentIndex, 0)];
  const next =
    progressionRanks[
      Math.min(Math.max(currentIndex, 0) + 1, progressionRanks.length - 1)
    ];
  const rankSpan = Math.max(next.requiredXp - current.requiredXp, 1);
  const currentRankXp = Math.max(totalXp - current.requiredXp, 0);
  const nextRankXp =
    next.golongan === current.golongan ? current.requiredXp : rankSpan;
  const progressPercentage =
    next.golongan === current.golongan
      ? 100
      : Math.max(
          0,
          Math.min(Math.round((currentRankXp / rankSpan) * 100), 100),
        );

  return {
    currentJabatan: current.jabatan,
    currentGolongan: current.golongan,
    currentBadge: `/badge/${current.badge}`,
    currentRankXp,
    nextRankXp,
    progressPercentage,
  };
}

function getScorePercent(score: number | null | undefined, maxScore: number) {
  if (!score) return 0;
  return Math.max(0, Math.min(Math.round((score / maxScore) * 100), 100));
}

function formatCompactXp(xp: number) {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k XP`;
  }

  return `${xp} XP`;
}

function getWeakestArea(scores: Array<{ label: string; percent: number }>) {
  return [...scores].sort((a, b) => a.percent - b.percent)[0];
}

function DashboardTopBar({
  streakDays,
  currentJabatan,
  currentGolongan,
  currentBadge,
  currentRankXp,
  nextRankXp,
  progressPercentage,
}: {
  streakDays: number;
  currentJabatan: string;
  currentGolongan: string;
  currentBadge: string;
  currentRankXp: number;
  nextRankXp: number;
  progressPercentage: number;
}) {
  return (
    <div className="flex min-h-[68px] items-center justify-between gap-1.5 px-2 sm:min-h-[82px] sm:gap-4 sm:px-4 md:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3 md:gap-4">
        <Image
          src={currentBadge}
          alt=""
          width={58}
          height={58}
          className="h-8 w-8 shrink-0 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14"
          aria-hidden="true"
          priority
        />
        <div className="min-w-0 flex-1">
          <div className="grid gap-0">
            <p className="truncate font-display text-sm font-black leading-none text-headline sm:text-lg md:text-xl">
              {currentJabatan}
            </p>
          </div>
          <XPBar
            currentTitle={`Golongan ${currentGolongan}`}
            currentXP={currentRankXp}
            nextThresholdXP={nextRankXp}
            progressPercentage={progressPercentage}
            currentTitleClassName="font-sans text-[10px] font-semibold leading-tight text-muted sm:text-sm"
            valueClassName="font-display text-[10px] font-black text-primary sm:text-sm"
            className="mt-0 w-[min(42vw,420px)] [&_.progress-bar-track]:h-2 sm:[&_.progress-bar-track]:h-3"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-4">
        <StreakIndicator
          streakDays={streakDays}
          size="sm"
          variant="plain"
          className="min-h-[34px] px-0 text-xs sm:min-h-[44px] sm:text-base"
        />
        <div className="flex min-h-[34px] items-center gap-1 text-[11px] font-bold text-headline sm:min-h-[40px] sm:gap-2 sm:text-xs md:text-sm">
          <span
            className="h-2 w-2 rounded-full bg-primary animate-pulse sm:h-2.5 sm:w-2.5 md:h-3 md:w-3"
            aria-hidden="true"
          />
          <span className="hidden md:inline">4.120 users</span>
          <span className="md:hidden">4.1k</span>
        </div>
      </div>
    </div>
  );
}

function MissionRow({
  title,
  status,
  progress,
  done = false,
}: {
  title: string;
  status: string;
  progress: number;
  done?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex min-h-[44px] items-center gap-3">
        <div
          className={[
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2",
            done
              ? "border-primary bg-primary text-white"
              : "border-border bg-background dark:bg-surface",
          ].join(" ")}
        >
          {done && <Check className="h-4 w-4" aria-hidden="true" />}
        </div>
        <p className="flex-1 text-sm font-black text-headline">{title}</p>
        <p
          className={[
            "text-xs font-bold",
            done ? "text-primary" : "text-muted",
          ].join(" ")}
        >
          {status}
        </p>
      </div>
      <div className="ml-9 h-2 rounded-full bg-border/70 shadow-inner ring-1 ring-border/70 dark:bg-border/60 dark:ring-border/80">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function AnalyticsBar({
  label,
  percent,
  tone = "primary",
}: {
  label: string;
  percent: number;
  tone?: "primary" | "xp" | "error";
}) {
  const toneClass = {
    primary: "bg-primary",
    xp: "bg-xp",
    error: "bg-error",
  }[tone];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-headline">{label}</p>
        <p className="text-sm font-black text-headline">{percent}%</p>
      </div>
      <div className="h-3 rounded-full bg-border/70 shadow-inner ring-1 ring-border/70 dark:bg-border/60 dark:ring-border/80">
        <div
          className={["h-full rounded-full", toneClass].join(" ")}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authConfig);
  if (!session || session.user.revoked) {
    redirect("/auth/login");
  }

  if (session.user.onboardingRequired) {
    redirect("/onboarding");
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
        current_streak: true,
      },
    }),
    prisma.diagnosticAttempt.findFirst({
      where: {
        user_id: session.user.id,
        completed_at: { not: null },
      },
      orderBy: { completed_at: "desc" },
      select: {
        score_twk: true,
        score_tiu: true,
        score_tkp: true,
        total_score: true,
      },
    }),
  ]);

  const totalXp = progression?.total_xp ?? 0;
  const currentProgression = resolveProgression(totalXp);
  const streakDays = progression?.current_streak ?? 0;
  const diagnosticScore = latestDiagnostic?.total_score
    ? Math.round(latestDiagnostic.total_score)
    : 0;
  const targetScoreDisplay =
    profile?.target_score?.toLocaleString("id-ID") ?? "-";
  const targetLocation = [profile?.city, profile?.province]
    .filter(Boolean)
    .join(", ");
  const analytics = [
    {
      label: "TWK",
      percent: getScorePercent(latestDiagnostic?.score_twk, 150),
      tone: "primary" as const,
    },
    {
      label: "TIU",
      percent: getScorePercent(latestDiagnostic?.score_tiu, 175),
      tone: "xp" as const,
    },
    {
      label: "TKP",
      percent: getScorePercent(latestDiagnostic?.score_tkp, 225),
      tone: "primary" as const,
    },
  ];
  const leaderboardRows = [
    ...rankingPreview,
    {
      rank: "142",
      initial: "Y",
      name: "YOU",
      title: currentProgression.currentJabatan,
      xp: formatCompactXp(totalXp),
      tone: "bg-primary",
      rankTone: "from-primary-light to-primary",
      badge: currentProgression.currentBadge,
      highlight: true,
    },
  ];
  const weakestArea = latestDiagnostic ? getWeakestArea(analytics) : null;

  return (
    <>
      <BentoDashboardLayout
        topBar={
          <DashboardTopBar
            streakDays={streakDays}
            currentJabatan={currentProgression.currentJabatan}
            currentGolongan={currentProgression.currentGolongan}
            currentBadge={currentProgression.currentBadge}
            currentRankXp={currentProgression.currentRankXp}
            nextRankXp={currentProgression.nextRankXp}
            progressPercentage={currentProgression.progressPercentage}
          />
        }
        bottomNav={
          <BottomNav items={DASHBOARD_NAV_ITEMS} activeHref="/dashboard" />
        }
        sidebar={
          <Sidebar
            items={DASHBOARD_NAV_ITEMS}
            activeHref="/dashboard"
            userName={session.user.name}
            userEmail={session.user.email}
          />
        }
      >
        <div className="grid w-full gap-4 xl:grid-cols-12">
          <Card
            padding="md"
            className={`overflow-hidden xl:col-span-5 ${dashboardCardGlow}`}
          >
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-5 sm:text-left">
              <div className="relative h-24 w-24 shrink-0 sm:h-24 sm:w-24">
                <div
                  className="absolute inset-3 rounded-full bg-primary-light blur-xl dark:bg-primary/20"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-1 left-1/2 h-3 w-16 -translate-x-1/2 rounded-full bg-border/70 blur-sm"
                  aria-hidden="true"
                />
                <Image
                  src="/mascot/mascot_greeting.png"
                  alt=""
                  width={124}
                  height={124}
                  className="relative h-24 w-24 object-contain animate-bounce-subtle"
                  aria-hidden="true"
                  priority
                />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-3xl font-black leading-tight text-headline">
                  Hai,{" "}
                  <span className="text-primary">
                    {session.user.name || "Pejuang"}
                  </span>
                  !
                </h1>
                <p className="mt-2 text-sm leading-6 text-body">
                  Fokus ke langkah kecil paling berdampak hari ini.
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

          <Card padding="lg" className={`xl:col-span-3 ${dashboardCardGlow}`}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-headline">
                    Progress Score
                  </p>
                  <p className="font-display text-4xl font-black leading-none text-headline">
                    {diagnosticScore || "-"}
                  </p>
                </div>
                <Badge variant="success" size="sm">
                  {latestDiagnostic ? "Aktif" : "Baru"}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 xl:border-l-0 xl:border-t xl:pl-0 xl:pt-4">
                <div>
                  <p className="text-sm font-bold text-headline">
                    Target Score
                  </p>
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

          <Card padding="lg" className={`xl:col-span-4 ${dashboardCardGlow}`}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-headline">Teman Online</h2>
              <div className="flex gap-2 text-muted">
                <ChevronRight
                  className="h-5 w-5 rotate-180"
                  aria-hidden="true"
                />
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
                        "absolute bottom-0 right-1 h-3.5 w-3.5 rounded-full border-2 border-background",
                        friend.online ? "bg-primary" : "bg-muted",
                      ].join(" ")}
                    />
                  </div>
                  <p className="mt-2 truncate text-xs font-bold text-headline">
                    {friend.name}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card
            padding="lg"
            className={`relative min-h-[220px] overflow-hidden xl:col-span-5 ${dashboardCardGlow}`}
          >
            <Swords
              className="absolute -right-8 bottom-4 h-40 w-40 rotate-[-18deg] text-border/60 dark:text-border/30"
              aria-hidden="true"
            />
            <div className="relative z-10 max-w-sm">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                Competitive Mode
              </p>
              <h2 className="mt-3 font-display text-5xl font-black uppercase leading-[0.9] text-headline">
                Battle Arena
              </h2>
              <p className="mt-4 text-sm leading-6 text-body">
                Tantang temanmu dalam simulasi CAT real-time. Pemenang
                mendapatkan bonus XP saat mode battle aktif.
              </p>
              <span className="btn-primary mt-5 inline-flex min-h-[44px] items-center justify-center px-5 py-2.5 text-sm opacity-70">
                Tantang Dia!
              </span>
            </div>
          </Card>

          <Card
            padding="lg"
            className={`relative min-h-[220px] overflow-hidden xl:col-span-4 ${dashboardCardGlow}`}
          >
            <div
              className="absolute bottom-1 right-4 font-display text-8xl font-black uppercase text-border/35 dark:text-border/20"
              aria-hidden="true"
            >
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
                Practice with 110 real exam questions. Siap dipakai setelah core
                practice aktif.
              </p>
              <span className="btn-primary mt-5 inline-flex min-h-[44px] items-center justify-center px-5 py-2.5 text-sm opacity-70">
                Ayo Lanjut!
              </span>
            </div>
          </Card>

          <aside className="grid gap-4 xl:col-span-3 xl:row-span-2">
            <Card padding="sm" className={dashboardCardGlow}>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-primary text-center">
                Leaderboard
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm font-black">
                <button className="btn-primary min-h-[40px] rounded-2xl px-3 py-2 text-sm">
                  Nasional
                </button>
                <button className="btn-secondary min-h-[40px] rounded-2xl px-3 py-2 text-sm">
                  Teman
                </button>
              </div>
              <div className="mt-3 grid gap-2.5">
                {leaderboardRows.map((row) => (
                  <div
                    key={row.rank}
                    className={[
                      "grid min-h-[64px] grid-cols-[28px_34px_36px_minmax(0,1fr)_58px] items-center gap-1.5 rounded-2xl border-2 border-border bg-background px-2 text-sm text-headline dark:bg-surface sm:min-h-[72px] sm:grid-cols-[34px_42px_42px_minmax(0,1fr)_72px] sm:gap-2 sm:px-3 xl:min-h-[62px] xl:grid-cols-[30px_36px_36px_minmax(0,1fr)_60px]",
                      "highlight" in row && row.highlight
                        ? "bg-primary-light/70 dark:bg-primary/15"
                        : "",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-xs font-black text-headline shadow-inner sm:h-8 sm:w-8 sm:text-sm",
                        row.rankTone,
                      ].join(" ")}
                    >
                      {row.rank}
                    </span>
                    <span
                      className={[
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white sm:h-10 sm:w-10 sm:text-base",
                        row.tone,
                      ].join(" ")}
                    >
                      {row.initial}
                    </span>
                    <Image
                      src={row.badge}
                      alt=""
                      width={56}
                      height={56}
                      className="h-9 w-9 object-contain sm:h-10 sm:w-10"
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-display text-sm font-black leading-tight text-headline sm:text-base">
                        {row.name}
                      </span>
                      <span className="block truncate text-[11px] font-black text-muted sm:text-xs">
                        {row.title}
                      </span>
                    </span>
                    <span className="text-right font-display text-xs font-black leading-tight text-primary sm:text-sm">
                      {row.xp}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

          <Card
            padding="none"
            className={`relative min-h-[214px] overflow-visible border-primary/40 bg-[linear-gradient(135deg,#b7ee72_0%,#74c332_52%,#5fb72b_100%)] p-5 text-white shadow-[0_7px_0_0_rgba(21,93,39,0.35)] dark:border-primary/35 dark:bg-[linear-gradient(135deg,#82c95a_0%,#4f9e35_52%,#155d27_100%)] ${dashboardCardGlow}`}
          >
            <div className="absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.34),transparent_28%),radial-gradient(circle_at_12%_92%,rgba(244,202,106,0.34),transparent_36%)]" />
              <div className="absolute -right-7 -top-7 h-32 w-32 rounded-full bg-white/18 blur-xl" />
            </div>
            <Image
              src="/mascot/mascot_support.png"
              alt=""
              width={148}
              height={148}
              className="absolute -right-3 -top-7 z-20 h-28 w-28 object-contain drop-shadow-[0_10px_18px_rgba(21,93,39,0.28)] sm:-top-8 sm:h-32 sm:w-32 xl:-top-7 xl:h-28 xl:w-28"
              aria-hidden="true"
            />
              <div className="relative z-10 pr-16 sm:pr-24 xl:pr-16">
                <h2 className="font-display text-3xl font-black leading-tight text-white drop-shadow-sm xl:text-2xl">
                  Dukung Umbuddy!
                </h2>
                <p className="mt-3 max-w-[270px] text-sm font-extrabold leading-5 text-white/95 drop-shadow-sm xl:max-w-[220px] xl:text-xs">
                  Satu dukungan hangat sangat berarti agar Umbuddy terus online
                  melayani puluhan ribu Cambies.
                </p>
                <Link
                  href="https://saweria.co"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#c47a12] bg-[linear-gradient(180deg,#ffbd45_0%,#f59e0b_100%)] px-4 text-sm font-black text-[#1f1300] shadow-[0_6px_0_0_#b9650b] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_0_#b9650b]"
                >
                  <Heart className="h-5 w-5" aria-hidden="true" />
                  Dukung via Saweria
                </Link>
              </div>
            </Card>
          </aside>

          <Card
            id="daily-missions"
            padding="lg"
            className={`xl:col-span-3 ${dashboardCardGlow}`}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-black uppercase text-headline">
                Daily Missions
              </h2>
              <p className="text-sm font-black text-headline">2/3</p>
            </div>
            <div className="grid gap-4">
              <MissionRow
                title="Complete 20 TWK Questions"
                status="Done"
                progress={100}
                done
              />
              <MissionRow
                title="Win 1 Battle Arena"
                status="0/1"
                progress={0}
              />
              <MissionRow
                title="Login for 3 days streak"
                status={`${Math.min(streakDays, 3)}/3`}
                progress={Math.min((streakDays / 3) * 100, 100)}
              />
            </div>
          </Card>

          <Card padding="lg" className={`xl:col-span-6 ${dashboardCardGlow}`}>
            <h2 className="font-display text-xl font-black uppercase text-headline">
              Tactical Analytics
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <AnalyticsBar label="TWK" percent={analytics[0].percent} />
              <AnalyticsBar
                label="TIU"
                percent={analytics[1].percent}
                tone="xp"
              />
              <AnalyticsBar label="TKP" percent={analytics[2].percent} />
            </div>
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-sm font-black text-headline">
                Coach Narrative
              </p>
              <h3 className="mt-1 font-display text-xl font-black leading-tight text-headline">
                {weakestArea ? (
                  <>
                    Fokus pada{" "}
                    <span className="text-primary">{weakestArea.label}</span>{" "}
                    dulu...
                  </>
                ) : (
                  <>
                    Selesaikan <span className="text-primary">diagnostic</span>{" "}
                    dulu...
                  </>
                )}
              </h3>
              <p className="mt-2 text-sm leading-6 text-body">
                {weakestArea
                  ? `Area ${weakestArea.label} jadi prioritas awal. Setelah practice aktif, Umbuddy akan mengarahkan Kamu ke latihan yang paling relevan.`
                  : "Belum ada data cukup untuk membaca pola Kamu. Diagnostic mini akan jadi titik awal rekomendasi."}
              </p>
              {targetLocation && (
                <p className="mt-2 text-xs font-bold text-muted">
                  Target area: {targetLocation}
                </p>
              )}
            </div>
          </Card>
        </div>
      </BentoDashboardLayout>
      <ThemeToggle />
    </>
  );
}
