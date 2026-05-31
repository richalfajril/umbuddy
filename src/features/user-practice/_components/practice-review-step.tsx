import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ListChecks } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { FocusExamLayout } from '@/components/templates/focus-exam-layout'
import { ExamTopBar, ExamDesktopTopBar } from '@/components/organisms'
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

  // Tombol untuk kembali ke Dashboard (Markas)
  const renderDashboardButton = (isMobile = false) => (
    <Link
      href="/dashboard"
      className={[
        'inline-flex items-center justify-center rounded-full border-2 border-white/80 bg-white font-black text-primary-dark shadow-[0_5px_0_rgba(21,93,39,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_7px_0_rgba(21,93,39,0.22)]',
        isMobile ? 'min-h-[44px] px-4 text-xs' : 'min-h-[56px] px-4 text-sm',
      ].join(' ')}
    >
      Markas
    </Link>
  )

  return (
    <FocusExamLayout
      topBar={
        <ExamTopBar
          title="Pembahasan Practice"
          subtitle="Review jawaban Kamu"
          badge="Review Mode"
          actionButton={renderDashboardButton(true)}
          progressPercent={reviewProgressPercent}
          progressLabel={`${currentIndex + 1}/${result.review.length}`}
        />
      }
      desktopTopBar={
        <ExamDesktopTopBar
          title="Pembahasan Practice"
          subtitle="Review jawaban Kamu"
          badge="Review Mode"
          actionButton={renderDashboardButton()}
          progressPercent={reviewProgressPercent}
          progressLabel={`${currentIndex + 1} / ${result.review.length}`}
          progressTitle="Progress Pembahasan"
        />
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
                    'flex min-h-[44px] items-center justify-center rounded-md border-2 border-b-[5px] text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
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
