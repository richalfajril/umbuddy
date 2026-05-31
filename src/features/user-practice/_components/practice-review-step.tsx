import * as React from 'react'
import { ArrowLeft, ArrowRight, ListChecks } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { FocusExamLayout } from '@/components/templates/focus-exam-layout'
import { FontSizeControl } from '@/components/molecules'
import type { PracticeResult } from '../_types/practice.types'

// Props untuk menerima seluruh state aktif dari hasil review dan callback navigasi.
type PracticeReviewStepProps = {
  result: PracticeResult
  currentIndex: number
  examFontSize: number
  mobileNavigatorOpen: boolean
  onGoToReviewQuestion: (index: number) => void
  onFontSizeChange: (updater: number | ((current: number) => number)) => void
  onMobileNavigatorToggle: () => void
  onBackToResult: () => void
}

// Render UI pembahasan soal setelah latihan selesai.
export function PracticeReviewStep({
  result,
  currentIndex,
  examFontSize,
  mobileNavigatorOpen,
  onGoToReviewQuestion,
  onFontSizeChange,
  onMobileNavigatorToggle,
  onBackToResult,
}: PracticeReviewStepProps) {
  const currentReviewItem = result.review[currentIndex]
  const reviewProgressPercent = result.review.length > 0 ? ((currentIndex + 1) / result.review.length) * 100 : 0
  
  if (!currentReviewItem) return null

  // Komponen kendali ukuran font yang akan disematkan di UI pembahasan.
  const fontSizeControl = (
    <FontSizeControl 
      fontSize={examFontSize} 
      onChange={onFontSizeChange} 
      ariaLabelDecrease="Perkecil ukuran font pembahasan"
      ariaLabelIncrease="Perbesar ukuran font pembahasan"
    />
  )

  // Handler untuk memastikan index pindah pembahasan tidak melampaui batas array.
  const goToReviewQuestion = (nextIndex: number) => {
    onGoToReviewQuestion(Math.max(0, Math.min(nextIndex, result.review.length - 1)))
  }

  return (
    <FocusExamLayout
      topBar={
        <div className="mx-auto max-w-3xl px-4 py-5">
          <div>
            <p className="font-display text-3xl font-black leading-tight">Pembahasan Practice</p>
            <p className="mt-1 text-sm font-bold text-white/85">Review jawaban Kamu</p>
          </div>
          <div className="mt-3 rounded-3xl bg-white/20 px-5 py-3 shadow-inner">
            <div className="mb-2 text-right text-base font-black">
              {currentIndex + 1} / {result.review.length}
            </div>
            <div className="h-2.5 rounded-full bg-white/35">
              <div
                className="h-full rounded-full bg-white transition-[width] duration-300"
                style={{ width: `${reviewProgressPercent}%` }}
              />
            </div>
          </div>
          <div className="mt-1 flex min-h-[72px] items-center justify-center rounded-full bg-white/20 font-display text-3xl font-black shadow-inner">
            Review Mode
          </div>
        </div>
      }
      desktopTopBar={
        <div className="mx-auto grid max-w-[1680px] grid-cols-[280px_minmax(0,1fr)_220px] items-center gap-6 px-6 py-4">
          <div>
            <p className="font-display text-2xl font-black leading-tight">Pembahasan Practice</p>
            <p className="mt-1 text-sm font-bold text-white/85">Review jawaban Kamu</p>
          </div>
          <div className="rounded-2xl bg-white/20 px-5 py-3 shadow-inner">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm font-black">
              <span className="text-white/80">Progress Pembahasan</span>
              <span>{currentIndex + 1} / {result.review.length}</span>
            </div>
            <div className="h-3 rounded-full bg-white/35">
              <div
                className="h-full rounded-full bg-white transition-[width] duration-300"
                style={{ width: `${reviewProgressPercent}%` }}
              />
            </div>
          </div>
          <div className="flex min-h-[64px] items-center justify-center rounded-full bg-white/20 px-6 font-display text-2xl font-black">
            Review Mode
          </div>
        </div>
      }
      questionNavigator={
        <div>
          <p className="mb-2 flex items-center gap-2 text-lg font-black text-headline">
            <ListChecks className="h-5 w-5" aria-hidden="true" />
            Navigasi Soal
          </p>
          <div className="mb-4 flex flex-nowrap items-center gap-2 overflow-hidden text-[10px] font-bold text-muted sm:gap-3 sm:text-xs">
            <span className="flex min-w-0 shrink items-center gap-1.5"><span className="h-2.5 w-2.5 shrink-0 rounded bg-primary" /> Benar</span>
            <span className="flex min-w-0 shrink items-center gap-1.5"><span className="h-2.5 w-2.5 shrink-0 rounded bg-error" /> Salah</span>
            <span className="flex min-w-0 shrink items-center gap-1.5"><span className="h-2.5 w-2.5 shrink-0 rounded border border-border bg-background dark:bg-surface" /> Kosong</span>
          </div>
          {/* Iterasi setiap soal untuk membuat tombol navigasi cepat review (ditandai dengan benar/salah/kosong). */}
          <div className="grid grid-cols-5 gap-2">
            {result.review.map((item, index) => {
              const isCurrent = index === currentIndex
              const isCorrect = item.correct === true
              const isUnanswered = item.selected_option === null
              return (
                <button
                  key={item.question_id}
                  type="button"
                  onClick={() => goToReviewQuestion(index)}
                  aria-label={`Buka pembahasan soal ${index + 1}`}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={[
                    'flex min-h-[44px] items-center justify-center rounded-xl border-2 border-b-[5px] text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    isCorrect
                      ? 'border-primary-dark bg-primary text-white'
                      : isUnanswered
                        ? 'border-border bg-background text-headline dark:bg-surface'
                        : 'border-error-dark bg-error text-white',
                    isCurrent ? 'ring-2 ring-xp ring-offset-2 ring-offset-background' : '',
                  ].join(' ')}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
        </div>
      }
      mobileNavigatorOpen={mobileNavigatorOpen}
      onMobileNavigatorToggle={onMobileNavigatorToggle}
      question={
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="inline-flex rounded-lg border border-primary/30 bg-primary-light px-3 py-1 text-xs font-black text-primary-dark">
                {currentReviewItem.category}
              </span>
              <p className="text-sm font-normal text-body">
                Soal <span className="font-black text-headline">{currentIndex + 1}</span> dari{' '}
                <span className="font-black text-headline">{result.review.length}</span>
              </p>
            </div>
            {fontSizeControl}
          </div>
          <p className="font-sans font-normal leading-7 text-headline" style={{ fontSize: examFontSize }}>
            {currentReviewItem.text}
          </p>
        </Card>
      }
      answerOptions={
        <div className="space-y-3">
          {/* Menampilkan seluruh opsi jawaban beserta indikator kunci dan jawaban user. */}
          {Object.entries(currentReviewItem.options).map(([key, value]) => {
            const isSelected = currentReviewItem.selected_option === key
            const isAnswer = currentReviewItem.answer_key === key
            const label = isSelected && isAnswer
              ? 'Kunci & Jawaban Kamu'
              : isAnswer
                ? 'Kunci Jawaban'
                : isSelected
                  ? 'Jawaban Kamu'
                  : null

            return (
              <div
                key={key}
                className={[
                  'flex min-h-[52px] w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left font-normal leading-7',
                  isAnswer
                    ? 'border-primary bg-primary-light text-primary-dark'
                    : isSelected
                      ? 'border-error bg-error/10 text-headline'
                      : 'border-border bg-background text-headline dark:bg-surface',
                ].join(' ')}
                style={{ fontSize: examFontSize }}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-black">
                  {key}
                </span>
                <span className="grid gap-1">
                  <span>{value}</span>
                  {label && (
                    <span className={['text-xs font-black', isAnswer ? 'text-primary-dark' : 'text-error'].join(' ')}>
                      {label}
                    </span>
                  )}
                </span>
              </div>
            )
          })}

          {/* Kotak penjelasan/pembahasan mendetail mengapa jawaban tersebut benar. */}
          <Card padding="md" className="space-y-2">
            <p className="text-xs font-black uppercase text-primary">Pembahasan</p>
            <p className="font-normal leading-7 text-body" style={{ fontSize: examFontSize }}>
              {currentReviewItem.explanation ?? 'Pembahasan untuk soal ini belum tersedia.'}
            </p>
          </Card>
        </div>
      }
      actionFooter={
        <div className="flex items-center gap-3">
          {/* Tombol kembali ke pembahasan sebelumnya */}
          <Button
            type="button"
            variant="secondary"
            className="shrink-0"
            onClick={() => goToReviewQuestion(currentIndex - 1)}
            disabled={currentIndex === 0}
            aria-label="Pembahasan sebelumnya"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Button>
          {/* Aksi utama: jika bukan pembahasan terakhir lanjut, jika terakhir kembali ke ringkasan nilai. */}
          {currentIndex < result.review.length - 1 ? (
            <Button
              type="button"
              className="flex-1"
              onClick={() => goToReviewQuestion(currentIndex + 1)}
              rightIcon={<ArrowRight className="h-5 w-5" aria-hidden="true" />}
            >
              Lanjut Pembahasan
            </Button>
          ) : (
            <Button type="button" className="flex-1" onClick={onBackToResult}>
              Balik ke Nilai
            </Button>
          )}
        </div>
      }
    />
  )
}
