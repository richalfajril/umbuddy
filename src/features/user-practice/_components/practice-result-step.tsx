import * as React from 'react'
import Link from 'next/link'
import { CheckCircle2, Home, RotateCcw, Trophy } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import type { PracticeCategory, PracticeResult } from '../_types/practice.types'

type PracticeResultStepProps = {
  result: PracticeResult
  category: PracticeCategory
  onReview: () => void
  onRetry: (category: PracticeCategory) => void
}

// Render layar hasil latihan yang menampilkan skor, summary waktu, dan hadiah XP.
export function PracticeResultStep({
  result,
  category,
  onReview,
  onRetry,
}: PracticeResultStepProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <main className="mx-auto grid max-w-4xl gap-5">
        <Card padding="lg" className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
            <Trophy className="h-9 w-9" aria-hidden="true" />
          </div>
          <p className="mt-4 text-sm font-black uppercase text-primary">Latihan Terkunci</p>
          <h1 className="mt-2 font-display text-4xl font-black text-headline">
            Skor Kamu <span className="text-primary">{result.score}</span>
          </h1>
          <p className="mt-2 text-sm leading-6 text-body">
            Benar {result.correct_count}/{result.total_questions} soal. Rata-rata waktu {result.average_time} detik.
          </p>
          {result.xp_award.xp > 0 ? (
            <div className="mt-4 rounded-2xl border border-xp/40 bg-xp-light px-4 py-3 text-sm font-black text-headline">
              +{result.xp_award.xp} XP {result.xp_award.already_claimed ? 'sudah pernah diklaim dari sesi ini.' : 'masuk kantong.'}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-black text-body">
              Belum dapat XP karena skor masih 0. Santai, ulangi latihan dan kejar jawaban benar pertama Kamu.
            </div>
          )}
        </Card>

        {result.recommendations[0] && (
          <Card padding="md">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h2 className="font-display text-xl font-black text-headline">
                  Fokus berikutnya: <span className="text-primary">{result.recommendations[0].category}</span>
                </h2>
                <p className="mt-1 text-sm leading-6 text-body">
                  {result.recommendations[0].message}
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onReview}
          >
            Lihat Pembahasan
          </Button>
          <Button type="button" onClick={() => onRetry(category)} leftIcon={<RotateCcw className="h-5 w-5" aria-hidden="true" />}>
            Latihan Lagi
          </Button>
          <Link href="/dashboard" className="btn-secondary min-h-[44px] justify-center">
            <Home className="h-5 w-5" aria-hidden="true" />
            Balik ke Markas
          </Link>
        </div>
      </main>
    </div>
  )
}
