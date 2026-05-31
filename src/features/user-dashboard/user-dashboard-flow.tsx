import { UserDashboardView } from "@/features/user-dashboard/_components";
import { rankingPreview } from "@/features/user-dashboard/_constants/dashboard.constants";
import {
  formatCompactXp,
  getScorePercent,
  getWeakestArea,
  resolveProgression,
} from "@/features/user-dashboard/_utils/dashboard.utils";
import { authConfig } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function UserDashboardFlow() {
  const session = await getServerSession(authConfig);
  if (!session || session.user.revoked) {
    redirect("/auth/login");
  }

  if (session.user.onboardingRequired) {
    redirect("/onboarding");
  }

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
  const practiceAnalytics = (["TWK", "TIU", "TKP"] as const).map((category) => {
    const categoryAttempts = practiceAttempts.filter((attempt) => attempt.question.category === category);
    if (categoryAttempts.length === 0) return null;

    const averageScore = categoryAttempts.reduce((total, attempt) => total + (attempt.score ?? 0), 0) / categoryAttempts.length;
    return {
      category,
      percent: Math.max(0, Math.min(Math.round(averageScore), 100)),
    };
  });
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
  const hasPerformanceData = Boolean(latestDiagnostic) || practiceAttempts.length > 0;
  const weakestArea = hasPerformanceData ? getWeakestArea(analytics) : null;

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
