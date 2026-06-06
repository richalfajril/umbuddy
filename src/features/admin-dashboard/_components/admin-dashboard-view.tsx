import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileQuestion, ShieldCheck } from 'lucide-react'
import { ADMIN_DASHBOARD_SUMMARY_CARDS } from '../_constants/admin-dashboard.constants'
import type { AdminDashboardViewProps } from '../_types/admin-dashboard.types'
import { AdminDashboardShell } from './admin-dashboard-shell'

// View dashboard admin menampilkan ringkasan MVP tanpa query tambahan.
export function AdminDashboardView({ admin }: AdminDashboardViewProps) {
  return (
    <AdminDashboardShell adminEmail={admin.email} adminRole={admin.role}>
      <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          {/* Hero backoffice menegaskan area admin dan status guard. */}
          <div className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-7 dark:bg-surface">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                  Umbuddy Backoffice
                </p>
                <h1 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl">
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

          {/* Ringkasan status MVP membantu admin melihat modul yang aktif. */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {ADMIN_DASHBOARD_SUMMARY_CARDS.map((card) => (
              <div
                key={card.label}
                className="rounded-3xl border border-border bg-background p-5 shadow-sm transition hover:border-primary/35 hover:shadow-[0_16px_36px_-28px_rgba(116,195,50,0.55)] dark:bg-surface"
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">
                  {card.label}
                </p>
                <p className="mt-3 font-display text-3xl font-black text-headline">
                  {card.value}
                </p>
                <p className="mt-1 text-sm font-bold text-primary">
                  {card.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Aksi utama diarahkan ke A2 karena modul ini sudah menjadi MVP aktif. */}
          <div className="mt-6 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
            <Link
              href="/admin/questions"
              className="group rounded-3xl border border-primary/35 bg-gradient-to-br from-primary via-[#74C332] to-[#155D27] p-6 text-primary-foreground shadow-2xl shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-primary/30"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] opacity-85">
                    A2 Question Management
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-black">
                    Kelola Bank Soal
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm font-bold leading-6 opacity-90">
                    Buat draft, publish, arsipkan, dan pulihkan soal yang dipakai user practice dan diagnostic.
                  </p>
                </div>
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/20">
                  <FileQuestion className="h-8 w-8" />
                </span>
              </div>
              <span className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-black text-slate-950 shadow-lg shadow-black/15">
                Buka Kelola Soal
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>

            {/* Panel kesiapan memberi feedback bahwa guard admin sudah aktif. */}
            <div className="rounded-3xl border border-border bg-background p-6 shadow-sm dark:bg-surface">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/20 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-xl font-black">Guard Aktif</p>
                  <p className="text-sm font-semibold text-muted">Admin session tervalidasi.</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {['Route admin protected', 'Logout admin tersedia', 'A2 MVP siap dipakai'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold text-headline">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminDashboardShell>
  )
}
