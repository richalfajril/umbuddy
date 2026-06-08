import { Users, FileQuestion, Target } from 'lucide-react'
import { AnalyticsService } from '@/server/analytics/analytics.service'

export async function AdminKpiCards() {
  const [usersKpi, questionsKpi, engagementKpi] = await Promise.all([
    AnalyticsService.getUsersKpi(),
    AnalyticsService.getQuestionsKpi(),
    AnalyticsService.getEngagementKpi(),
  ])

  const kpis = [
    {
      label: 'Total Pengguna',
      value: usersKpi.totalUsers.toLocaleString('id-ID'),
      detail: `${usersKpi.activeLast24Hours} aktif (24j)`,
      icon: <Users className="h-6 w-6" />,
      colorClass: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Bank Soal',
      value: questionsKpi.totalQuestions.toLocaleString('id-ID'),
      detail: `${questionsKpi.publishedQuestions} Rilis • ${questionsKpi.draftQuestions} Draft`,
      icon: <FileQuestion className="h-6 w-6" />,
      colorClass: 'text-primary bg-primary/10'
    },
    {
      label: 'Sesi Latihan & Battle',
      value: (engagementKpi.totalPracticeSessions + engagementKpi.totalBattles).toLocaleString('id-ID'),
      detail: `${engagementKpi.totalBattles} Battle • ${engagementKpi.totalPracticeSessions} Mandiri`,
      icon: <Target className="h-6 w-6" />,
      colorClass: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {kpis.map((card) => (
        <div
          key={card.label}
          className="rounded-3xl border border-border bg-background p-5 shadow-sm transition hover:border-primary/35 hover:shadow-[0_16px_36px_-28px_rgba(116,195,50,0.55)] dark:bg-surface"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">
              {card.label}
            </p>
            <div className={`rounded-xl p-2 ${card.colorClass}`}>
              {card.icon}
            </div>
          </div>
          <p className="mt-4 font-display text-3xl font-black text-headline">
            {card.value}
          </p>
          <p className="mt-1 text-sm font-bold text-muted">
            {card.detail}
          </p>
        </div>
      ))}
    </div>
  )
}
