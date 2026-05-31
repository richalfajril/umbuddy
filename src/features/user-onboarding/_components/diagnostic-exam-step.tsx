'use client'

import * as React from 'react'
import { ArrowLeft, ArrowRight, Clock, ListChecks } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { FocusExamLayout, FocusExamSubmitModal } from '@/components/templates/focus-exam-layout'
import { ExamTopBar, ExamDesktopTopBar } from '@/components/organisms'
import type { PublicQuestion } from '@/features/user-onboarding/_types/onboarding.types'
import { DiagnosticFontSizeControl } from './diagnostic-font-size-control'

// Tampilan ujian diagnostic yang menerima state/callback dari onboarding flow.
export function DiagnosticExamStep({
  questions,
  currentIndex,
  answers,
  message,
  remainingSeconds,
  examFontSize,
  isLoading,
  isAutoSubmitting,
  mobileNavigatorOpen,
  submitModalOpen,
  onGoToQuestion,
  onSelectAnswer,
  onFontSizeChange,
  onMobileNavigatorToggle,
  onSubmitModalOpenChange,
  onSubmitDiagnostic,
}: {
  questions: PublicQuestion[]
  currentIndex: number
  answers: Record<string, string>
  message: string
  remainingSeconds: number
  examFontSize: number
  isLoading: boolean
  isAutoSubmitting: boolean
  mobileNavigatorOpen: boolean
  submitModalOpen: boolean
  onGoToQuestion: (nextIndex: number) => void
  onSelectAnswer: (questionId: string, option: string) => void
  onFontSizeChange: React.Dispatch<React.SetStateAction<number>>
  onMobileNavigatorToggle: () => void
  onSubmitModalOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  onSubmitDiagnostic: () => void | Promise<void>
}) {
  // Soal aktif diturunkan dari index agar parent hanya menyimpan posisi saat ini.
  const currentQuestion = questions[currentIndex]

  // Ringkasan progres dipakai oleh top bar dan modal konfirmasi submit.
  const answeredCount = Object.keys(answers).length
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0
  const emptyCount = Math.max(questions.length - answeredCount, 0)
  const timerLabel = `${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, '0')}`

  // Tombol selesai dipakai ulang di top bar mobile dan desktop.
  const renderFinishButton = (isMobile = false) => (
    <button
      type="button"
      onClick={() => onSubmitModalOpenChange(true)}
      disabled={isLoading || isAutoSubmitting}
      className={[
        'rounded-full border-2 border-white/80 bg-white font-black text-primary-dark shadow-[0_5px_0_rgba(21,93,39,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_7px_0_rgba(21,93,39,0.22)] disabled:cursor-not-allowed disabled:opacity-60',
        isMobile ? 'min-h-[44px] px-4 text-xs' : 'min-h-[56px] px-4 text-sm',
      ].join(' ')}
    >
      Selesai
    </button>
  )

  // Kontrol font dipisah agar header soal tetap ringkas.
  const fontSizeControl = (
    <DiagnosticFontSizeControl
      examFontSize={examFontSize}
      onFontSizeChange={onFontSizeChange}
    />
  )

  // FocusExamLayout menerima slot UI untuk top bar, navigator, soal, opsi, dan footer aksi.
  return (
    <FocusExamLayout
      topBar={
        <ExamTopBar
          title="Diagnostic CPNS"
          subtitle="Peserta: Kamu"
          badge={
            <>
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {timerLabel}
            </>
          }
          actionButton={renderFinishButton(true)}
          progressPercent={progressPercent}
          progressLabel={`${answeredCount} / ${questions.length}`}
        />
      }
      desktopTopBar={
        <ExamDesktopTopBar
          title="Diagnostic CPNS"
          subtitle="Tes mini 15 soal • Peserta: Kamu"
          badge={
            <>
              <Clock className="h-7 w-7" aria-hidden="true" />
              {timerLabel}
            </>
          }
          actionButton={renderFinishButton()}
          progressPercent={progressPercent}
          progressLabel={`${answeredCount} / ${questions.length}`}
          progressTitle="Progress Tes"
        />
      }
      questionNavigator={
        <div>
          {/* Navigator soal memberi status aktif/terjawab/kosong tanpa membuka jawaban benar. */}
          <p className="mb-2 flex items-center gap-2 text-lg font-black text-headline">
            <ListChecks className="h-5 w-5" aria-hidden="true" />
            Navigasi Soal
          </p>
          <div className="mb-4 flex flex-nowrap items-center gap-2 overflow-hidden text-[10px] font-bold text-muted sm:gap-3 sm:text-xs">
            <span className="flex min-w-0 shrink items-center gap-1.5"><span className="h-2.5 w-2.5 shrink-0 rounded bg-xp" /> Aktif</span>
            <span className="flex min-w-0 shrink items-center gap-1.5"><span className="h-2.5 w-2.5 shrink-0 rounded bg-primary" /> Terjawab</span>
            <span className="flex min-w-0 shrink items-center gap-1.5"><span className="h-2.5 w-2.5 shrink-0 rounded border border-border bg-background dark:bg-surface" /> Kosong</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
              const isCurrent = index === currentIndex
              const isAnswered = answers[question.id] != null
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => onGoToQuestion(index)}
                  disabled={isLoading}
                  aria-label={`Buka soal ${index + 1}`}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={[
                    'flex min-h-[44px] items-center justify-center rounded-md border-2 border-b-[5px] text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    isCurrent
                      ? 'border-[#c99a05] bg-xp text-headline shadow-sm'
                      : isAnswered
                        ? 'border-primary-dark bg-primary text-white'
                        : 'border-border bg-background text-headline hover:border-primary hover:bg-surface dark:bg-surface',
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
      statusOverlay={
        <>
          {/* Overlay auto-submit muncul saat timer habis dan jawaban sedang diproses. */}
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
          ) : isLoading ? (
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
          {/* Modal submit manual merangkum kosong/ragu-ragu/terjawab sebelum dikumpulkan. */}
          <FocusExamSubmitModal
            isOpen={submitModalOpen}
            emptyCount={emptyCount}
            flaggedCount={0}
            answeredCount={answeredCount}
            isSubmitting={isLoading}
            onClose={() => onSubmitModalOpenChange(false)}
            onSubmit={() => {
              onSubmitModalOpenChange(false)
              void onSubmitDiagnostic()
            }}
          />
        </>
      }
      question={
        currentQuestion ? (
          <Card padding="lg" className="space-y-4">
            {/* Header soal menampilkan kategori, nomor, dan kontrol ukuran font. */}
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
            {/* Pesan status dipakai untuk fallback soal atau auto-submit notice. */}
            {message && (
              <p role="status" aria-live="polite" className="rounded-xl bg-xp-light px-3 py-2 text-xs font-bold text-headline">
                {message}
              </p>
            )}
          </Card>
        ) : null
      }
      answerOptions={
        currentQuestion ? (
          <div className="space-y-3">
            {/* Opsi jawaban hanya mengubah selected option di parent flow. */}
            {Object.entries(currentQuestion.options).map(([key, value]) => {
              const selected = answers[currentQuestion.id] === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectAnswer(currentQuestion.id, key)}
                  className={[
                    'flex min-h-[52px] w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left font-normal leading-7 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    selected
                      ? 'border-primary bg-primary-light text-primary-dark'
                      : 'border-border bg-background text-headline hover:border-primary hover:bg-primary-light/50',
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
          {/* Footer menjaga tombol previous/next/kunci tetap konsisten di semua soal. */}
          <Button
            type="button"
            variant="secondary"
            className="shrink-0"
            onClick={() => onGoToQuestion(currentIndex - 1)}
            disabled={currentIndex === 0 || isLoading}
            aria-label="Soal sebelumnya"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Button>
          {currentIndex < questions.length - 1 ? (
            <Button
              type="button"
              className="flex-1"
              onClick={() => onGoToQuestion(currentIndex + 1)}
              disabled={!currentQuestion || !answers[currentQuestion.id] || isLoading}
              rightIcon={<ArrowRight className="h-5 w-5" aria-hidden="true" />}
            >
              Lanjut
            </Button>
          ) : (
            <Button
              type="button"
              className="flex-1"
              onClick={() => onSubmitModalOpenChange(true)}
              disabled={isLoading}
              isLoading={isLoading}
              loadingLabel="Menyubmit..."
            >
              Submit!
            </Button>
          )}
        </div>
      }
    />
  )
}
