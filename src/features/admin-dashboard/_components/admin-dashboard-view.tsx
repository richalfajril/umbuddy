import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileQuestion, ShieldCheck } from 'lucide-react'
import {
  AdminBadge,
  AdminCard,
  AdminCardContent,
  AdminCardDescription,
  AdminCardHeader,
  AdminCardTitle,
  adminButtonClassName,
} from '@/features/admin-shared/_components/ui'
import { ADMIN_DASHBOARD_SUMMARY_CARDS } from '../_constants/admin-dashboard.constants'
import type { AdminDashboardViewProps } from '../_types/admin-dashboard.types'
import { AdminDashboardShell } from './admin-dashboard-shell'

// View dashboard admin menampilkan ringkasan MVP tanpa query tambahan.
export function AdminDashboardView({ admin }: AdminDashboardViewProps) {
  return (
    <AdminDashboardShell adminEmail={admin.email} adminRole={admin.role}>
      <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Hero backoffice menegaskan area admin dan status guard. */}
          <AdminCard>
            <AdminCardHeader className="pb-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                    Umbuddy Backoffice
                  </p>
                  <AdminCardTitle className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
                    Markas admin sudah siap
                  </AdminCardTitle>
                  <AdminCardDescription className="mt-3 max-w-2xl leading-6 sm:text-base">
                    Kelola konten, pantau modul operasional, dan jaga kualitas soal CPNS dari satu dashboard.
                  </AdminCardDescription>
                </div>
                <AdminBadge variant="success" className="w-fit px-3 py-1.5 text-sm">
                  Role aktif: {admin.role}
                </AdminBadge>
              </div>
            </AdminCardHeader>
          </AdminCard>

          {/* Ringkasan status MVP membantu admin melihat modul yang aktif. */}
          <div className="grid gap-4 md:grid-cols-3">
            {ADMIN_DASHBOARD_SUMMARY_CARDS.map((card) => (
              <AdminCard key={card.label}>
                <AdminCardHeader>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {card.label}
                  </p>
                  <p className="text-3xl font-semibold text-headline">
                    {card.value}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {card.detail}
                  </p>
                </AdminCardHeader>
              </AdminCard>
            ))}
          </div>

          {/* Aksi utama diarahkan ke A2 karena modul ini sudah menjadi MVP aktif. */}
          <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
            <AdminCard className="overflow-hidden">
              <AdminCardHeader className="pb-4">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                      A2 Question Management
                    </p>
                    <AdminCardTitle className="mt-2 text-2xl font-semibold sm:text-3xl">
                      Kelola Bank Soal
                    </AdminCardTitle>
                    <AdminCardDescription className="mt-2 max-w-2xl leading-6">
                      Buat draft, publish, arsipkan, dan pulihkan soal yang dipakai user practice dan diagnostic.
                    </AdminCardDescription>
                  </div>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-border bg-surface text-primary">
                    <FileQuestion className="h-6 w-6" />
                  </span>
                </div>
              </AdminCardHeader>
              <AdminCardContent>
                <Link
                  href="/admin/questions"
                  className={adminButtonClassName({ className: 'group' })}
                >
                  Buka Kelola Soal
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </AdminCardContent>
            </AdminCard>

            {/* Panel kesiapan memberi feedback bahwa guard admin sudah aktif. */}
            <AdminCard>
              <AdminCardHeader>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-light text-primary-dark dark:text-primary">
                    <ShieldCheck className="h-6 w-6" />
                  </span>
                  <div>
                    <AdminCardTitle className="text-xl">Guard Aktif</AdminCardTitle>
                    <AdminCardDescription>Admin session tervalidasi.</AdminCardDescription>
                  </div>
                </div>
              </AdminCardHeader>
              <AdminCardContent className="space-y-3">
                {['Route admin protected', 'Logout admin tersedia', 'A2 MVP siap dipakai'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-headline">{item}</span>
                  </div>
                ))}
              </AdminCardContent>
            </AdminCard>
          </div>
        </div>
      </section>
    </AdminDashboardShell>
  )
}
