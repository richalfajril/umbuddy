import * as React from 'react'
import { ArrowLeft, ArrowRight, Clock, Flag, ListChecks } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { FocusExamLayout, FocusExamSubmitModal } from '@/components/templates/focus-exam-layout'
import { FontSizeControl } from '@/components/molecules'
import { formatTimer } from '@/features/shared/_utils/time.utils'
import type { PracticeCategory, PublicPracticeQuestion } from '../_types/practice.types'

// Props untuk menerima seluruh state aktif dari exam (pertanyaan, jawaban, sisa waktu, dll) dan callback fungsi.
type PracticeExamStepProps = {
  category: PracticeCategory
  questions: PublicPracticeQuestion[]
  currentIndex: number
  answers: Record<string, string>
  flagged: Record<string, boolean>
  message: string
  remainingSeconds: number
  examFontSize: number
  isSubmitting: boolean
  isAutoSubmitting: boolean
  mobileNavigatorOpen: boolean
  submitModalOpen: boolean
  onSelectAnswer: (questionId: string, optionKey: string) => void
  onGoToQuestion: (index: number) => void
  onToggleFlag: (questionId: string) => void
  onFontSizeChange: (updater: number | ((current: number) => number)) => void
  onMobileNavigatorToggle: () => void
  onSubmitModalOpenChange: (open: boolean) => void
  onSubmitPractice: () => void
}

// Render UI utama latihan yang sedang berlangsung (exam mode).
export function PracticeExamStep({
  category,
  questions,
  currentIndex,
  answers,
  flagged,
  message,
  remainingSeconds,
  examFontSize,
  isSubmitting,
  isAutoSubmitting,
  mobileNavigatorOpen,
  submitModalOpen,
  onSelectAnswer,
  onGoToQuestion,
  onToggleFlag,
  onFontSizeChange,
  onMobileNavigatorToggle,
  onSubmitModalOpenChange,
  onSubmitPractice,
}: PracticeExamStepProps) {
  const answeredCount = Object.keys(answers).length
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0
  const emptyCount = Math.max(questions.length - answeredCount, 0)
  const flaggedCount = questions.reduce((total, question) => total + (flagged[question.id] ? 1 : 0), 0)
  const timeExpired = remainingSeconds <= 0
  const currentQuestion = questions[currentIndex]

  // Render tombol selesaikan latihan (terdapat di header baik desktop maupun mobile).
  const renderFinishButton = (isMobile = false) => (
    <button
      type="button"
      onClick={() => onSubmitModalOpenChange(true)}
      disabled={isSubmitting || isAutoSubmitting}
      className={[
        'rounded-full border-2 border-white/80 bg-white font-black text-primary-dark shadow-[0_5px_0_rgba(21,93,39,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_7px_0_rgba(21,93,39,0.22)] disabled:cursor-not-allowed disabled:opacity-60',
        isMobile ? 'min-h-[44px] px-4 text-xs' : 'min-h-[56px] px-4 text-sm',
      ].join(' ')}
    >
      Selesai
    </button>
  )

  // Komponen kendali ukuran font yang akan disematkan di UI soal.
  const fontSizeControl = (
    <FontSizeControl 
      fontSize={examFontSize} 
      onChange={onFontSizeChange} 
      ariaLabelDecrease="Perkecil ukuran font soal"
      ariaLabelIncrease="Perbesar ukuran font soal"
    />
  )

  return (
    <FocusExamLayout
      topBar={
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xl font-black leading-tight">Quick Practice CPNS</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 font-display text-sm font-black shadow-inner">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatTimer(remainingSeconds)}
                </div>
                <p className="truncate text-[11px] font-bold text-white/85">Peserta: Kamu</p>
              </div>
            </div>
            {renderFinishButton(true)}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-white/35">
              <div
                className="h-full rounded-full bg-white transition-[width] duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="shrink-0 text-xs font-black">
              {answeredCount}/{questions.length}
            </span>
          </div>
        </div>
      }
      desktopTopBar={
        <div className="mx-auto grid max-w-[1680px] grid-cols-[280px_minmax(0,1fr)_340px] items-center gap-6 px-6 py-4">
          <div>
            <p className="font-display text-2xl font-black leading-tight">Quick Practice CPNS</p>
            <p className="mt-1 text-sm font-bold text-white/85">
              Kategori {category} • Peserta: Kamu
            </p>
          </div>
          <div className="rounded-2xl bg-white/20 px-5 py-3 shadow-inner">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm font-black">
              <span className="text-white/80">Progress Jawaban</span>
              <span>{answeredCount} / {questions.length}</span>
            </div>
            <div className="h-3 rounded-full bg-white/35">
              <div
                className="h-full rounded-full bg-white transition-[width] duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex min-h-[64px] flex-1 items-center justify-center gap-3 rounded-full bg-white/20 px-6 font-display text-3xl font-black">
              <Clock className="h-7 w-7" aria-hidden="true" />
              {formatTimer(remainingSeconds)}
            </div>
            {renderFinishButton()}
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
            <span className="flex min-w-0 shrink items-center gap-1.5"><span className="h-2.5 w-2.5 shrink-0 rounded bg-xp" /> Aktif</span>
            <span className="flex min-w-0 shrink items-center gap-1.5"><span className="h-2.5 w-2.5 shrink-0 rounded bg-primary" /> Terjawab</span>
            <span className="flex min-w-0 shrink items-center gap-1.5"><span className="h-2.5 w-2.5 shrink-0 rounded border border-border bg-background dark:bg-surface" /> Kosong</span>
          </div>
          {/* Iterasi setiap soal untuk membuat tombol navigasi cepat (ditandai dengan warna sesuai statusnya). */}
          <div className="grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
              const isCurrent = index === currentIndex
              const isAnswered = answers[question.id] != null
              const isFlagged = flagged[question.id] === true
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => onGoToQuestion(index)}
                  disabled={isSubmitting}
                  aria-label={`Buka soal ${index + 1}`}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={[
                    'relative flex min-h-[44px] items-center justify-center rounded-xl border-2 border-b-[5px] text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    isCurrent
                      ? 'border-[#c99a05] bg-xp text-headline shadow-sm'
                      : isAnswered
                        ? 'border-primary-dark bg-primary text-white'
                        : 'border-border bg-background text-headline hover:border-primary hover:bg-surface dark:bg-surface',
                  ].join(' ')}
                >
                  {index + 1}
                  {isFlagged && (
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-background bg-xp" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      }
      mobileNavigatorOpen={mobileNavigatorOpen}
      onMobileNavigatorToggle={onMobileNavigatorToggle}
      statusOverlay={
        <>
          {/* Menampilkan overlay khusus ketika waktu habis dan jawaban sedang disubmit otomatis. */}
          {isAutoSubmitting ? (
            <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4" role="alertdialog" aria-modal="true" aria-label="Waktu habis">
              <div className="w-full max-w-sm rounded-3xl border border-border bg-background p-6 text-center shadow-elevated dark:bg-surface">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="mt-5 font-display text-2xl font-black text-headline">Waktu Habis</p>
                <p className="mt-2 text-sm font-bold leading-6 text-body">
                  Jawaban Kamu sedang dikunci dan nilainya sedang dihitung.
                </p>
              </div>
            </div>
          ) : isSubmitting ? (
            <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4" role="alertdialog" aria-modal="true" aria-label="Memproses jawaban">
              <div className="w-full max-w-sm rounded-3xl border border-border bg-background p-6 text-center shadow-elevated dark:bg-surface">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="mt-5 font-display text-2xl font-black text-headline">Memproses Jawaban</p>
                <p className="mt-2 text-sm font-bold leading-6 text-body">
                  Mohon tunggu sebentar, nilai Kamu sedang dihitung.
                </p>
              </div>
            </div>
          ) : null}
          {/* Modal konfirmasi ketika user menekan tombol 'Selesai' / 'Kunci Jawaban'. */}
          <FocusExamSubmitModal
            isOpen={submitModalOpen}
            emptyCount={emptyCount}
            flaggedCount={flaggedCount}
            answeredCount={answeredCount}
            isSubmitting={isSubmitting}
            onClose={() => onSubmitModalOpenChange(false)}
            onSubmit={() => {
              onSubmitModalOpenChange(false)
              onSubmitPractice()
            }}
          />
        </>
      }
      question={
        currentQuestion ? (
          <Card padding="lg" className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="inline-flex rounded-lg border border-primary/30 bg-primary-light px-3 py-1 text-xs font-black text-primary-dark">
                  {currentQuestion.category}
                </span>
                <p className="text-sm font-normal text-body">
                  Soal <span className="font-black text-headline">{currentIndex + 1}</span> dari{' '}
                  <span className="font-black text-headline">{questions.length}</span>
                </p>
              </div>
              {fontSizeControl}
            </div>
            <p className="font-sans font-normal leading-7 text-headline" style={{ fontSize: examFontSize }}>
              {currentQuestion.text}
            </p>
            {(message || timeExpired) && (
              <p role="status" aria-live="polite" className="rounded-xl bg-xp-light px-3 py-2 text-xs font-bold text-headline">
                {message || 'Waktu habis. Umbuddy sedang mengunci jawaban Kamu...'}
              </p>
            )}
          </Card>
        ) : null
      }
      answerOptions={
        currentQuestion ? (
          <div className="space-y-3">
            {/* Iterasi semua pilihan ganda dari pertanyaan yang aktif. */}
            {Object.entries(currentQuestion.options).map(([key, value]) => {
              const selected = answers[currentQuestion.id] === key
              return (
                <button
                  key={key}
                  type="button"
                  disabled={timeExpired}
                  onClick={() => onSelectAnswer(currentQuestion.id, key)}
                  className={[
                    'flex min-h-[52px] w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left font-normal leading-7 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    selected
                      ? 'border-primary bg-primary-light text-primary-dark'
                      : 'border-border bg-background text-headline hover:border-primary hover:bg-primary-light/50 disabled:opacity-70 dark:bg-surface',
                  ].join(' ')}
                  style={{ fontSize: examFontSize }}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-black">
                    {key}
                  </span>
                  <span>{value}</span>
                </button>
              )
            })}
          </div>
        ) : null
      }
      actionFooter={
        <div className="flex items-center gap-3">
          {/* Tombol Kembali (Previous Question) */}
          <Button
            type="button"
            variant="secondary"
            className="shrink-0"
            onClick={() => onGoToQuestion(currentIndex - 1)}
            disabled={currentIndex === 0 || isSubmitting || timeExpired}
            aria-label="Soal sebelumnya"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="shrink-0"
            onClick={() => {
              if (!currentQuestion) return
              onToggleFlag(currentQuestion.id)
            }}
            aria-label="Tandai soal"
          >
            <Flag className={['h-5 w-5', currentQuestion && flagged[currentQuestion.id] ? 'fill-xp text-xp' : ''].join(' ')} aria-hidden="true" />
          </Button>
          {/* Aksi utama: jika bukan pertanyaan terakhir lanjut, jika terakhir tampilkan modal Kunci Jawaban. */}
          {currentIndex < questions.length - 1 && !timeExpired ? (
            <Button
              type="button"
              className="flex-1"
              onClick={() => onGoToQuestion(currentIndex + 1)}
              disabled={!currentQuestion || !answers[currentQuestion.id] || isSubmitting}
              rightIcon={<ArrowRight className="h-5 w-5" aria-hidden="true" />}
            >
              Ayo Lanjut!
            </Button>
          ) : (
            <Button
              type="button"
              className="flex-1"
              onClick={() => onSubmitModalOpenChange(true)}
              disabled={isSubmitting}
              isLoading={isSubmitting}
              loadingLabel="Mengunci..."
            >
              Kunci Jawaban!
            </Button>
          )}
        </div>
      }
    />
  )
}
