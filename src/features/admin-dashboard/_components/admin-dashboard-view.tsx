import { AnalyticsService } from '@/server/analytics/analytics.service'
import * as React from 'react'
import type { AdminDashboardViewProps } from '../_types/admin-dashboard.types'
import { AdminKpiCards } from './admin-kpi-cards'
import { AdminQuestionsPieChart } from './admin-questions-pie-chart'
import { AdminTrendChart } from './admin-trend-chart'

// Fallback KPI hanya shimmer pada angka ringkasan, bukan seluruh komponen dashboard.
function AdminKpiDataFallback() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {['Total Pengguna', 'Bank Soal', 'Sesi Latihan & Battle'].map((label) => (
        <section key={label} className="rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-muted">{label}</p>
          <div className="mt-8 h-9 w-20 animate-pulse rounded-xl bg-surface-hover" />
          <div className="mt-3 h-4 w-28 animate-pulse rounded-xl bg-surface-hover" />
        </section>
      ))}
    </div>
  )
}

// View dashboard admin menampilkan ringkasan analitik dan jalan pintas manajemen.
export async function AdminDashboardView({ admin }: AdminDashboardViewProps) {
  // Mengambil data untuk chart di level ini agar bisa di-pass ke Client Component
  const [trendData, questionsKpi] = await Promise.all([
    AnalyticsService.getRegistrationTrend7Days(),
    AnalyticsService.getQuestionsKpi(),
  ])
  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero backoffice menegaskan area admin*/}
        <div className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-7 dark:bg-surface">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                Umbuddy Backoffice
              </p>
              <h1 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl text-headline">
                Markas admin sudah <span className="text-primary">siap</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-body sm:text-base">
                Kelola konten, pantau modul operasional, dan jaga kualitas soal CPNS dari satu dashboard.
              </p>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-black text-primary">
              Role aktif: {admin.role}
            </div>
          </div>
        </div>

        {/* Ringkasan status KPI */}
        <div>
          <React.Suspense fallback={<AdminKpiDataFallback />}>
            <AdminKpiCards />
          </React.Suspense>
        </div>

        {/* Area Visualisasi Grafik */}
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <AdminTrendChart data={trendData} />
          <AdminQuestionsPieChart published={questionsKpi.publishedQuestions} draft={questionsKpi.draftQuestions} />
        </div>
      </div>
    </section>
  )
}
