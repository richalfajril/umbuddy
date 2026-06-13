import * as React from 'react'
import { Clock, ListChecks } from 'lucide-react'
import { Card } from '@/components/ui'
import { FocusExamLayout, FocusExamSubmitModal } from '@/components/templates/focus-exam-layout'
import { ExamTopBar, ExamDesktopTopBar, ExamActionFooter } from '@/components/organisms'
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
        <ExamTopBar
          title="Quick Practice CPNS"
          subtitle="Peserta: Kamu"
          badge={
            <>
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatTimer(remainingSeconds)}
            </>
          }
          actionButton={renderFinishButton(true)}
          progressPercent={progressPercent}
          progressLabel={`${answeredCount}/${questions.length}`}
        />
      }
      desktopTopBar={
        <ExamDesktopTopBar
          title="Quick Practice CPNS"
          subtitle={`Kategori ${category} • Peserta: Kamu`}
          badge={
            <>
              <Clock className="h-7 w-7" aria-hidden="true" />
              {formatTimer(remainingSeconds)}
            </>
          }
          actionButton={renderFinishButton()}
          progressPercent={progressPercent}
          progressLabel={`${answeredCount} / ${questions.length}`}
          progressTitle="Progress Jawaban"
        />
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
                    'relative flex min-h-[44px] items-center justify-center rounded-md border-2 border-b-[5px] text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
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
            {currentQuestion.image_urls.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {currentQuestion.image_urls.map((imageUrl) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={imageUrl}
                    src={imageUrl}
                    alt="Gambar pendukung soal"
                    className="max-h-72 w-full rounded-xl border border-border object-contain"
                  />
                ))}
              </div>
            )}
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
                  <span className="grid gap-2">
                    {value.text && <span>{value.text}</span>}
                    {value.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={value.image_url}
                        alt={`Gambar pilihan ${key}`}
                        className="max-h-40 rounded-xl border border-border object-contain"
                      />
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        ) : null
      }
      actionFooter={
        <ExamActionFooter
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          currentAnswer={currentQuestion ? answers[currentQuestion.id] : undefined}
          timeExpired={timeExpired}
          isSubmitting={isSubmitting}
          isAutoSubmitting={isAutoSubmitting}
          isFlagged={!!(currentQuestion && flagged[currentQuestion.id])}
          onGoToQuestion={onGoToQuestion}
          onToggleFlag={() => currentQuestion && onToggleFlag(currentQuestion.id)}
          onSubmitModalOpen={() => onSubmitModalOpenChange(true)}
        />
      }
    />
  )
}
