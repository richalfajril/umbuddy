import { ThemeToggle } from '@/components/atoms/theme-toggle'
import { AppProgressTopBar, BottomNav, Sidebar } from '@/components/organisms'
import { BentoDashboardLayout } from '@/components/templates/bento-dashboard-layout'
import { Card } from '@/components/ui'
import { LogoutButton } from '@/features/user-auth/_components/logout-button'
import {
  USER_APP_NAV_ITEMS,
  userAppCardGlow,
} from '@/features/shared/_constants/user-app.constants'
import type { UserProfileViewProps } from '@/features/user-profile/_types/user-profile.types'
import { CalendarDays, GraduationCap, Mail, MapPin, Target, Trophy } from 'lucide-react'
import Image from 'next/image'

// View profil user menampilkan identitas, target, progression, dan performa awal.
export function UserProfileView({
  userName,
  userEmail,
  avatarUrl,
  joinedAt,
  streakDays,
  totalXp,
  currentProgression,
  target,
  totalAnswered,
  averageScore,
  bestScore,
  diagnosticScore,
  analytics,
  recentActivity,
}: UserProfileViewProps) {
  const initial = (userName || userEmail || 'U').charAt(0).toUpperCase()

  return (
    <>
      {/* Layout app memastikan profil memakai top bar, sidebar, dan bottom nav yang sama. */}
      <BentoDashboardLayout
        topBar={
          <AppProgressTopBar
            streakDays={streakDays}
            currentJabatan={currentProgression.currentJabatan}
            currentGolongan={currentProgression.currentGolongan}
            currentBadge={currentProgression.currentBadge}
            currentRankXp={currentProgression.currentRankXp}
            nextRankXp={currentProgression.nextRankXp}
            progressPercentage={currentProgression.progressPercentage}
          />
        }
        bottomNav={<BottomNav items={USER_APP_NAV_ITEMS} activeHref="/profile" />}
        sidebar={
          <Sidebar
            items={USER_APP_NAV_ITEMS}
            activeHref="/profile"
            userName={userName}
            userEmail={userEmail}
            logoutButton={<LogoutButton />}
          />
        }
      >
        <div className="grid w-full gap-4 xl:grid-cols-12">
          {/* Header profil menampilkan avatar dan status progression user saat ini. */}
          <Card padding="lg" className={`overflow-hidden xl:col-span-5 ${userAppCardGlow}`}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border border-border bg-primary-light shadow-card dark:bg-primary/15">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="" fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="grid h-full w-full place-items-center font-display text-4xl font-black text-primary">
                    {initial}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                  Profil Cambies
                </p>
                <h1 className="mt-2 font-display text-3xl font-black leading-tight text-headline">
                  {userName || 'Pejuang CPNS'}
                </h1>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-body">
                  <Mail className="h-4 w-4 text-muted" aria-hidden="true" />
                  <span className="truncate">{userEmail || '-'}</span>
                </p>
                <p className="mt-3 text-sm font-black text-primary">
                  {currentProgression.currentJabatan} • Golongan {currentProgression.currentGolongan}
                </p>
                <p className="mt-1 text-xs font-bold text-muted">Bergabung sejak {joinedAt}</p>
              </div>
            </div>
          </Card>

          {/* Kartu statistik utama mengambil data XP dan hasil latihan terbaru. */}
          {[
            { label: 'Total XP', value: totalXp.toLocaleString('id-ID'), icon: Trophy },
            { label: 'Rata-rata Skor', value: `${averageScore}%`, icon: Target },
            { label: 'Soal Dikerjakan', value: totalAnswered.toLocaleString('id-ID'), icon: GraduationCap },
          ].map((item) => (
            <Card key={item.label} padding="lg" className={`xl:col-span-2 ${userAppCardGlow}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">{item.label}</p>
                  <p className="mt-5 font-display text-3xl font-black text-headline">{item.value}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-light text-primary dark:bg-primary/15">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </Card>
          ))}

          {/* Target belajar berasal dari data onboarding yang pernah diisi user. */}
          <Card padding="lg" className={`xl:col-span-5 ${userAppCardGlow}`}>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Target Belajar</p>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-xs font-bold text-muted">Instansi Target</p>
                <p className="mt-1 font-display text-xl font-black text-headline">{target.targetInstansi}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <p className="text-xs font-bold text-muted">Target Score</p>
                  <p className="mt-1 font-display text-2xl font-black text-primary">{target.targetScore}</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <p className="text-xs font-bold text-muted">Tanggal Ujian</p>
                  <p className="mt-1 font-bold text-headline">{target.examDate}</p>
                </div>
              </div>
              <p className="flex items-center gap-2 text-sm font-semibold text-body">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                {target.targetLocation}
              </p>
              <p className="flex items-center gap-2 text-sm font-semibold text-body">
                <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                {target.institution} {target.major !== '-' ? `• ${target.major}` : ''}
              </p>
            </div>
          </Card>

          {/* Analytics profil merangkum diagnostic dan practice dengan bar sederhana. */}
          <Card padding="lg" className={`xl:col-span-7 ${userAppCardGlow}`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Performa Awal</p>
                <h2 className="mt-2 font-display text-2xl font-black text-headline">
                  Diagnostic Score: <span className="text-primary">{diagnosticScore || '-'}</span>
                </h2>
              </div>
              <p className="text-sm font-semibold text-body">Best practice: {bestScore}%</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {analytics.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-headline">{item.label}</p>
                    <p className="font-display text-lg font-black text-primary">{item.percent}%</p>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Aktivitas terbaru memberi gambaran cepat latihan terakhir user. */}
          <Card padding="lg" className={`xl:col-span-12 ${userAppCardGlow}`}>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Aktivitas Terbaru</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {recentActivity.length > 0 ? (
                recentActivity.map((item, index) => (
                  <div key={`${item.createdAt}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4">
                    <div>
                      <p className="font-black text-headline">Latihan {item.category}</p>
                      <p className="mt-1 text-sm text-body">{item.createdAt}</p>
                    </div>
                    <p className="font-display text-2xl font-black text-primary">{item.score}%</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-surface p-5 text-sm font-semibold text-body md:col-span-2">
                  Belum ada aktivitas practice. Mulai latihan pertama agar profil Kamu makin hidup.
                </div>
              )}
            </div>
          </Card>
        </div>
      </BentoDashboardLayout>
      <ThemeToggle />
    </>
  )
}
