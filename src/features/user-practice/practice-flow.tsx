'use client'

import * as React from 'react'
import { ArrowLeft, ArrowRight, ListChecks } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { FocusExamLayout } from '@/components/templates/focus-exam-layout'

// Tipe data domain latihan.
import type {
  PracticeCategory,
  PracticeStep,
  PublicPracticeQuestion,
  PracticeResult,
} from './_types/practice.types'

// Konfigurasi statis untuk UI pilihan kategori.
import { categoryCards } from './_constants/practice.constants'

// Utilitas Latihan
import { readApiError } from './_utils/practice.utils'

// Komponen UI Latihan
import {
  PracticeLoadingStep,
  PracticeSetupStep,
  PracticeResultStep,
  PracticeExamStep,
} from './_components'



export function PracticeFlow() {
  const [step, setStep] = React.useState<PracticeStep>('setup')
  const [category, setCategory] = React.useState<PracticeCategory>('TWK')
  const [sessionId, setSessionId] = React.useState('')
  const [questions, setQuestions] = React.useState<PublicPracticeQuestion[]>([])
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [durationSeconds, setDurationSeconds] = React.useState(5 * 60)
  const [remainingSeconds, setRemainingSeconds] = React.useState(5 * 60)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [flagged, setFlagged] = React.useState<Record<string, boolean>>({})
  const [timeSpent, setTimeSpent] = React.useState<Record<string, number>>({})
  const [message, setMessage] = React.useState('')
  const [result, setResult] = React.useState<PracticeResult | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isAutoSubmitting, setIsAutoSubmitting] = React.useState(false)
  const [mobileNavigatorOpen, setMobileNavigatorOpen] = React.useState(false)
  const [submitModalOpen, setSubmitModalOpen] = React.useState(false)
  const [examFontSize, setExamFontSize] = React.useState(16)
  const didAutoSubmitRef = React.useRef(false)

  const currentReviewItem = result?.review[currentIndex]
  const timeExpired = step === 'practice' && remainingSeconds === 0

  React.useEffect(() => {
    if (step !== 'practice') return

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [step])

  const buildPayloadAnswers = React.useCallback(() => (
    Object.entries(answers).map(([questionId, selectedOption]) => ({
      question_id: questionId,
      selected_option: selectedOption,
      time_spent: Math.max(1, Math.min(timeSpent[questionId] ?? 1, durationSeconds)),
      flagged: flagged[questionId] === true,
    }))
  ), [answers, durationSeconds, flagged, timeSpent])

  const autosave = React.useCallback(async () => {
    if (!sessionId || Object.keys(answers).length === 0) return

    await fetch(`/api/v1/practice/sessions/${sessionId}/answers`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: buildPayloadAnswers() }),
    }).catch(() => null)
  }, [answers, buildPayloadAnswers, sessionId])

  const submitPractice = React.useCallback(async (options?: { auto?: boolean }) => {
    if (!sessionId || questions.length === 0 || isSubmitting) return

    const isAuto = options?.auto === true
    setIsSubmitting(true)
    if (isAuto) setIsAutoSubmitting(true)
    setMessage('')

    try {
      const response = await fetch(`/api/v1/practice/sessions/${sessionId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: buildPayloadAnswers() }),
      })

      if (!response.ok) throw new Error(await readApiError(response))

      const data = (await response.json()) as PracticeResult
      setResult(data)
      setCurrentIndex(0)
      setStep('result')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Jawaban belum bisa dikunci.')
    } finally {
      setIsSubmitting(false)
      if (isAuto) setIsAutoSubmitting(false)
    }
  }, [buildPayloadAnswers, isSubmitting, questions.length, sessionId])

  React.useEffect(() => {
    if (step !== 'practice' || remainingSeconds > 0 || didAutoSubmitRef.current) return

    didAutoSubmitRef.current = true
    setSubmitModalOpen(false)
    setMessage('Waktu habis. Umbuddy sedang mengunci jawaban Kamu...')
    void submitPractice({ auto: true })
  }, [remainingSeconds, step, submitPractice])

  async function startPractice(nextCategory = category) {
    setStep('loading')
    setMessage('')
    setResult(null)

    try {
      const response = await fetch('/api/v1/practice/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: nextCategory,
          difficulty: 'mixed',
          mode: 'QUICK',
          question_count: 5,
        }),
      })

      if (!response.ok) throw new Error(await readApiError(response))

      const data = (await response.json()) as {
        session_id: string
        duration_seconds: number
        questions: PublicPracticeQuestion[]
        fallback_used?: boolean
      }

      setSessionId(data.session_id)
      setDurationSeconds(data.duration_seconds)
      setRemainingSeconds(data.duration_seconds)
      setQuestions(data.questions)
      setCurrentIndex(0)
      setAnswers({})
      setFlagged({})
      setTimeSpent({})
      setExamFontSize(16)
      setIsAutoSubmitting(false)
      setSubmitModalOpen(false)
      didAutoSubmitRef.current = false
      if (data.fallback_used) {
        setMessage('Bank soal published belum lengkap, jadi Umbuddy pakai soal latihan aman sementara.')
      }
      setStep('practice')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Latihan belum bisa dimulai.')
      setStep('setup')
    }
  }

  function selectAnswer(questionId: string, option: string) {
    if (timeExpired) return

    setAnswers((current) => ({ ...current, [questionId]: option }))
    setTimeSpent((current) => ({
      ...current,
      [questionId]: current[questionId] ?? Math.max(1, durationSeconds - remainingSeconds),
    }))
  }

  function goToQuestion(nextIndex: number) {
    void autosave()
    setCurrentIndex(Math.max(0, Math.min(nextIndex, questions.length - 1)))
    setMobileNavigatorOpen(false)
  }

  if (step === 'loading') {
    return <PracticeLoadingStep />
  }

  if (step === 'practice') {
    return (
      <PracticeExamStep
        category={category}
        questions={questions}
        currentIndex={currentIndex}
        answers={answers}
        flagged={flagged}
        message={message}
        remainingSeconds={remainingSeconds}
        examFontSize={examFontSize}
        isSubmitting={isSubmitting}
        isAutoSubmitting={isAutoSubmitting}
        mobileNavigatorOpen={mobileNavigatorOpen}
        submitModalOpen={submitModalOpen}
        onSelectAnswer={selectAnswer}
        onGoToQuestion={goToQuestion}
        onToggleFlag={(id) => setFlagged((current) => ({ ...current, [id]: !current[id] }))}
        onFontSizeChange={setExamFontSize}
        onMobileNavigatorToggle={() => setMobileNavigatorOpen((current) => !current)}
        onSubmitModalOpenChange={setSubmitModalOpen}
        onSubmitPractice={() => void submitPractice()}
      />
    )
  }

  if (step === 'result' && result) {
    return (
      <PracticeResultStep
        result={result}
        category={category}
        onReview={() => {
          setCurrentIndex(0)
          setMobileNavigatorOpen(false)
          setStep('review')
        }}
        onRetry={(nextCategory) => void startPractice(nextCategory)}
      />
    )
  }

  if (step === 'review' && result && currentReviewItem) {
    const reviewProgressPercent = result.review.length > 0 ? ((currentIndex + 1) / result.review.length) * 100 : 0
    const fontSizeControl = (
      <div className="flex min-h-[36px] items-center rounded-full border border-border bg-surface p-1 text-sm font-black text-headline dark:bg-background">
        <button
          type="button"
          onClick={() => setExamFontSize((size) => Math.max(14, size - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-surface"
          aria-label="Perkecil ukuran font pembahasan"
        >
          −
        </button>
        <span className="min-w-8 text-center">{examFontSize}</span>
        <button
          type="button"
          onClick={() => setExamFontSize((size) => Math.min(22, size + 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-surface"
          aria-label="Perbesar ukuran font pembahasan"
        >
          +
        </button>
      </div>
    )
    const goToReviewQuestion = (nextIndex: number) => {
      setCurrentIndex(Math.max(0, Math.min(nextIndex, result.review.length - 1)))
      setMobileNavigatorOpen(false)
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
        onMobileNavigatorToggle={() => setMobileNavigatorOpen((current) => !current)}
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
              <Button type="button" className="flex-1" onClick={() => setStep('result')}>
                Balik ke Nilai
              </Button>
            )}
          </div>
        }
      />
    )
  }

  // Fallback utama adalah setup screen untuk user memilih kategori.
  return (
    <PracticeSetupStep
      category={category}
      message={message}
      categoryCards={categoryCards}
      onCategoryChange={setCategory}
      onStartPractice={() => void startPractice()}
    />
  )
}
