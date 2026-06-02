'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Clock, PencilLine, Zap } from 'lucide-react'
import { BentoDashboardLayout } from '@/components/templates/bento-dashboard-layout'
import { BottomNav, Sidebar } from '@/components/organisms'
import { Button, Card } from '@/components/ui'
import { LogoutButton } from '@/features/user-auth/_components/logout-button'
import {
  DASHBOARD_NAV_ITEMS,
  dashboardCardGlow,
} from '@/features/user-dashboard/_constants/dashboard.constants'
import type { PracticeCategory } from '../_types/practice.types'

// Kartu kategori dengan ikon dan deskripsi untuk halaman landing Practice.
const categoryCards: Array<{
  category: PracticeCategory
  title: string
  description: string
  emoji: string
  color: string
}> = [
  {
    category: 'TWK',
    title: 'TWK',
    description: 'Tes Wawasan Kebangsaan — UUD, Pancasila, NKRI, dan Bhineka Tunggal Ika.',
    emoji: '🏛️',
    color: 'border-primary bg-primary-light text-primary-dark',
  },
  {
    category: 'TIU',
    title: 'TIU',
    description: 'Tes Intelegensia Umum — Verbal, Numerik, dan Logika.',
    emoji: '🧠',
    color: 'border-xp bg-xp-light text-headline',
  },
  {
    category: 'TKP',
    title: 'TKP',
    description: 'Tes Karakteristik Pribadi — Pelayanan publik, sosial budaya, dan etika.',
    emoji: '🤝',
    color: 'border-primary bg-primary-light text-primary-dark',
  },
]

interface PracticePageViewProps {
  userName?: string | null
  userEmail?: string | null
  category: PracticeCategory
  message: string
  isStarting: boolean
  onCategoryChange: (category: PracticeCategory) => void
  onStartPractice: () => void
}

/**
 * PracticePageView — Halaman landing pilih kategori latihan.
 * Menggunakan BentoDashboardLayout agar konsisten dengan halaman app lainnya.
 */
export function PracticePageView({
  userName,
  userEmail,
  category,
  message,
  isStarting,
  onCategoryChange,
  onStartPractice,
}: PracticePageViewProps) {
  return (
    <BentoDashboardLayout
      topBar={
        <div className="flex min-h-[68px] items-center justify-between gap-4 px-4 sm:min-h-[82px] md:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              prefetch
              transitionTypes={['app-nav']}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-[0_3px_0_var(--color-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Ke dashboard"
            >
              <Image
                src="/logo/logo_only.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-contain"
                aria-hidden="true"
                priority
              />
            </Link>
            <div>
              <p className="font-display text-lg font-black leading-none text-headline">Quick Practice</p>
              <p className="text-xs font-bold text-muted">5 soal · 5 menit</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LogoutButton />
          </div>
        </div>
      }
      bottomNav={
        <BottomNav items={DASHBOARD_NAV_ITEMS} activeHref="/practice" />
      }
      sidebar={
        <Sidebar
          items={DASHBOARD_NAV_ITEMS}
          activeHref="/practice"
          userName={userName}
          userEmail={userEmail}
          logoutButton={<LogoutButton />}
        />
      }
    >
      <div className="mx-auto grid max-w-4xl gap-6">
        {/* Hero card */}
        <Card padding="lg" className={`relative overflow-hidden ${dashboardCardGlow}`}>
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-6 sm:text-left">
            <div className="relative h-24 w-24 shrink-0">
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
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-widest text-primary">Quick Practice</p>
              <h1 className="mt-1 font-display text-3xl font-black leading-tight text-headline">
                Pilih <span className="text-primary">medan latihan</span> Kamu
              </h1>
              <p className="mt-2 text-sm leading-6 text-body">
                5 soal acak, 5 menit. Jawab, kunci, lihat pembahasan, dan kumpulkan XP!
              </p>
            </div>
          </div>

          {/* Info chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { icon: BookOpen, label: '5 soal acak' },
              { icon: Clock, label: '5 menit' },
              { icon: Zap, label: 'XP reward' },
              { icon: PencilLine, label: 'Ada pembahasan' },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold text-body"
              >
                <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        </Card>

        {/* Pilih kategori */}
        <div>
          <p className="mb-3 text-sm font-black uppercase tracking-widest text-muted">Pilih Kategori</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {categoryCards.map((item) => {
              const selected = category === item.category
              return (
                <button
                  key={item.category}
                  type="button"
                  onClick={() => onCategoryChange(item.category)}
                  className={[
                    'group relative min-h-[160px] rounded-2xl border-2 border-b-[5px] p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    selected
                      ? 'border-primary bg-primary-light text-primary-dark shadow-lg'
                      : 'border-border bg-background text-headline hover:border-primary/60 hover:bg-primary-light/30 dark:bg-surface',
                  ].join(' ')}
                  aria-pressed={selected}
                >
                  <span className="text-4xl">{item.emoji}</span>
                  <span className="mt-3 block font-display text-2xl font-black">{item.title}</span>
                  <span className="mt-2 block text-sm font-bold leading-6 text-body">{item.description}</span>
                  {selected && (
                    <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-black">
                      ✓
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Pesan error */}
        {message && (
          <p
            role="alert"
            aria-live="polite"
            className="rounded-xl bg-xp-light px-4 py-3 text-sm font-bold text-headline"
          >
            {message}
          </p>
        )}

        {/* CTA */}
        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={onStartPractice}
          isLoading={isStarting}
          loadingLabel="Menyiapkan soal..."
        >
          Mulai Latihan {category}!
        </Button>
      </div>
    </BentoDashboardLayout>
  )
}
