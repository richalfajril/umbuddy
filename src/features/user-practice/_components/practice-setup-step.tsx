import * as React from 'react'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import type { PracticeCategory } from '../_types/practice.types'

// Props untuk menerima state kategori dan handler aksi awal latihan.
type PracticeSetupStepProps = {
  category: PracticeCategory
  message: string
  categoryCards: Array<{
    category: PracticeCategory
    title: string
    description: string
  }>
  onCategoryChange: (category: PracticeCategory) => void
  onStartPractice: () => void
}

// Render layar awal pemilihan kategori sebelum user memulai sesi latihan cepat.
export function PracticeSetupStep({
  category,
  message,
  categoryCards,
  onCategoryChange,
  onStartPractice,
}: PracticeSetupStepProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <main className="mx-auto grid max-w-4xl gap-5">
        <Card padding="lg" className="text-center">
          <p className="text-sm font-black uppercase text-primary">Quick Practice</p>
          <h1 className="mt-2 font-display text-4xl font-black text-headline">
            Pilih <span className="text-primary">medan latihan</span> Kamu
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-body">
            Latihan 5 soal cepat selama 5 menit. Pilih kategori, kunci jawaban, lalu lihat review dan XP.
          </p>
          {message && (
            <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-xp-light px-4 py-3 text-sm font-bold text-headline">
              {message}
            </p>
          )}
        </Card>

        {/* Daftar pilihan kategori latihan berupa kartu yang bisa diklik. */}
        <div className="grid gap-4 md:grid-cols-3">
          {categoryCards.map((item) => {
            const selected = category === item.category
            return (
              <button
                key={item.category}
                type="button"
                onClick={() => onCategoryChange(item.category)}
                className={[
                  'min-h-[164px] rounded-2xl border-2 border-b-[5px] p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  selected
                    ? 'border-primary bg-primary-light text-primary-dark'
                    : 'border-border bg-background text-headline hover:border-primary dark:bg-surface',
                ].join(' ')}
              >
                <span className="font-display text-3xl font-black">{item.title}</span>
                <span className="mt-3 block text-sm font-bold leading-6">{item.description}</span>
              </button>
            )
          })}
        </div>

        {/* Aksi utama untuk memulai latihan atau kembali ke dashboard. */}
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Link href="/dashboard" className="btn-secondary min-h-[44px] justify-center">
            <Home className="h-5 w-5" aria-hidden="true" />
            Balik ke Markas
          </Link>
          <Button type="button" size="lg" onClick={onStartPractice}>
            Yuk Mulai!
          </Button>
        </div>
      </main>
    </div>
  )
}
