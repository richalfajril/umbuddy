import { UserDashboardView } from "@/features/user-dashboard/_components";
import { rankingPreview } from "@/features/user-dashboard/_constants/dashboard.constants";
import { resolveProgression } from "@/features/shared/_utils/user-progression.utils";
import {
  formatCompactXp,
  getScorePercent,
  getWeakestArea,
} from "@/features/user-dashboard/_utils/dashboard.utils";
import { getCachedUserSession } from "@/server/auth/session";
import { prisma } from "@/server/db/client";
import { redirect } from "next/navigation";

// Server composition untuk guard session, ambil data dashboard, lalu render view.
export async function UserDashboardFlow() {
  // Session server menjaga dashboard tetap hanya untuk user login yang belum revoked.
  const session = await getCachedUserSession();
  if (!session || session.user.revoked) {
    redirect("/auth/login");
  }

  // User baru yang belum onboarding tidak boleh masuk dashboard.
  if (session.user.onboardingRequired) {
    redirect("/onboarding");
  }

  // Query dashboard dibuat paralel karena tiap data tidak saling bergantung.
  const [profile, progression, latestDiagnostic, practiceAttempts] = await Promise.all([
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
    prisma.practiceAttempt.findMany({
      where: {
        session: {
          user_id: session.user.id,
          status: "SUBMITTED",
          mode: { not: "DIAGNOSTIC" },
        },
      },
      orderBy: { created_at: "desc" },
      take: 100,
      select: {
        score: true,
        question: {
          select: {
            category: true,
          },
        },
      },
    }),
  ]);

  // Progression menentukan badge, jabatan, golongan, dan XP bar top bar.
  const totalXp = progression?.total_xp ?? 0;
  const currentProgression = resolveProgression(totalXp);
  const streakDays = progression?.current_streak ?? 0;

  // Diagnostic terakhir menjadi baseline score sampai practice analytics cukup banyak.
  const diagnosticScore = latestDiagnostic?.total_score
    ? Math.round(latestDiagnostic.total_score)
    : 0;

  // Profile target ditampilkan sebagai ringkasan personalisasi dashboard.
  const targetScoreDisplay =
    profile?.target_score?.toLocaleString("id-ID") ?? "-";
  const targetLocation = [profile?.city, profile?.province]
    .filter(Boolean)
    .join(", ");

  // Practice analytics menghitung rata-rata score per kategori dari attempt terbaru.
  const practiceAnalytics = (["TWK", "TIU", "TKP"] as const).map((category) => {
    const categoryAttempts = practiceAttempts.filter((attempt) => attempt.question.category === category);
    if (categoryAttempts.length === 0) return null;

    const averageScore = categoryAttempts.reduce((total, attempt) => total + (attempt.score ?? 0), 0) / categoryAttempts.length;
    return {
      category,
      percent: Math.max(0, Math.min(Math.round(averageScore), 100)),
    };
  });

  // Analytics fallback ke diagnostic jika user belum punya data practice.
  const analytics = [
    {
      label: "TWK",
      percent: practiceAnalytics[0]?.percent ?? getScorePercent(latestDiagnostic?.score_twk, 150),
      tone: "primary" as const,
    },
    {
      label: "TIU",
      percent: practiceAnalytics[1]?.percent ?? getScorePercent(latestDiagnostic?.score_tiu, 175),
      tone: "xp" as const,
    },
    {
      label: "TKP",
      percent: practiceAnalytics[2]?.percent ?? getScorePercent(latestDiagnostic?.score_tkp, 225),
      tone: "primary" as const,
    },
  ];

  // Leaderboard masih memakai preview plus row YOU dari progression user saat ini.
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

  // Weakest area hanya ditampilkan kalau user sudah punya data performa awal.
  const hasPerformanceData = Boolean(latestDiagnostic) || practiceAttempts.length > 0;
  const weakestArea = hasPerformanceData ? getWeakestArea(analytics) : null;

  // View menerima data siap-render agar komponen UI tidak melakukan query server.
  return (
    <UserDashboardView
      userName={session.user.name}
      userEmail={session.user.email}
      streakDays={streakDays}
      currentProgression={currentProgression}
      diagnosticScore={diagnosticScore}
      targetScoreDisplay={targetScoreDisplay}
      hasLatestDiagnostic={Boolean(latestDiagnostic)}
      leaderboardRows={leaderboardRows}
      analytics={analytics}
      weakestArea={weakestArea}
      targetLocation={targetLocation}
    />
  );
}
