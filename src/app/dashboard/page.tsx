import Link from 'next/link'
import { BarChart3, BookOpenCheck, Flame, ShieldCheck, Trophy, Users } from 'lucide-react'
import { Card } from '@/components/ui'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authConfig } from '@/lib/auth/config'

const quickStats = [
  { label: 'XP Musim Ini', value: '0', icon: Trophy },
  { label: 'Streak', value: '0 hari', icon: Flame },
  { label: 'Latihan Selesai', value: '0', icon: BookOpenCheck },
]

const nextActions = [
  { label: 'Mulai Latihan', href: '#practice', icon: BookOpenCheck },
  { label: 'Lihat Progress', href: '#analytics', icon: BarChart3 },
  { label: 'Cari Teman', href: '#friends', icon: Users },
]

export default async function DashboardPage() {
  const session = await getServerSession(authConfig)
  if (!session || session.user.revoked) {
    redirect('/auth/login')
  }

  if (session.user.onboardingRequired) {
    redirect('/onboarding')
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-body sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-primary">Dashboard</p>
            <h1 className="font-display text-3xl font-black text-headline">
              Markas Belajar Umbuddy
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6">
              Ringkasan awal akunmu sudah siap. Modul latihan, analytics, dan battle akan mengisi area ini saat fitur V1 berikutnya aktif.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-border px-5 text-sm font-black text-headline transition hover:bg-surface"
          >
            Kelola Sesi
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {quickStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} padding="md" className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted">{stat.label}</p>
                  <p className="mt-1 font-display text-3xl font-black text-headline">
                    {stat.value}
                  </p>
                </div>
                <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
              </Card>
            )
          })}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card padding="lg">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-primary-light p-3 text-primary-dark">
                <ShieldCheck className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display text-xl font-black text-headline">
                  Akun Aman, Progress Tersimpan
                </h2>
                <p className="mt-2 text-sm leading-6">
                  Area ini menjadi landing setelah login berhasil. Untuk akun email/password baru, akses penuh tetap menunggu verifikasi email sesuai flow keamanan U1.
                </p>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="font-display text-xl font-black text-headline">
              Aksi Cepat
            </h2>
            <div className="mt-4 grid gap-3">
              {nextActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex min-h-[44px] items-center gap-3 rounded-xl border-2 border-border px-4 text-sm font-black text-headline transition hover:border-primary hover:bg-primary-light"
                  >
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    {action.label}
                  </Link>
                )
              })}
            </div>
          </Card>
        </section>
      </div>
    </main>
  )
}
