'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Flag, Home, ListChecks, RotateCcw, Trophy } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { FocusExamLayout, FocusExamSubmitModal } from '@/components/templates/focus-exam-layout'

type PracticeCategory = 'TWK' | 'TIU' | 'TKP'
type PracticeStep = 'setup' | 'loading' | 'practice' | 'result' | 'review'

type PublicPracticeQuestion = {
  id: string
  category: PracticeCategory
  text: string
  options: Record<string, string>
  source: 'db' | 'fallback'
}

type PracticeReviewItem = {
  question_id: string
  category: PracticeCategory
  text: string
  options: Record<string, string>
  selected_option: string | null
  answer_key: string | null
  correct: boolean | null
  score: number
  time_spent: number
  explanation: string | null
}

type PracticeResult = {
  session_id: string
  score: number
  correct_count: number
  total_questions: number
  average_time: number
  review: PracticeReviewItem[]
  recommendations: Array<{ category: PracticeCategory; message: string }>
  xp_award: { xp: number; already_claimed: boolean }
}

const categoryCards: Array<{
  category: PracticeCategory
  title: string
  description: string
}> = [
  {
    category: 'TWK',
    title: 'TWK',
    description: 'Pancasila, UUD 1945, nasionalisme, dan bela negara.',
  },
  {
    category: 'TIU',
    title: 'TIU',
    description: 'Logika, numerik, analogi, deret, dan silogisme.',
  },
  {
    category: 'TKP',
    title: 'TKP',
    description: 'Pelayanan publik, integritas, adaptasi, dan kerja sama.',
  },
]

async function readApiError(response: Response) {
  const data = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
  return data?.error?.message ?? 'Duh, latihan belum bisa diproses. Coba lagi ya.'
}

function formatTimer(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

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

  const currentQuestion = questions[currentIndex]
  const currentReviewItem = result?.review[currentIndex]
  const answeredCount = Object.keys(answers).length
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card padding="lg" className="w-full max-w-md text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 font-bold text-body">Menyiapkan latihan Kamu...</p>
        </Card>
      </div>
    )
  }

  if (step === 'practice') {
    const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0
    const emptyCount = Math.max(questions.length - answeredCount, 0)
    const flaggedCount = questions.reduce((total, question) => total + (flagged[question.id] ? 1 : 0), 0)
    const renderFinishButton = () => (
      <button
        type="button"
        onClick={() => setSubmitModalOpen(true)}
        disabled={isSubmitting || isAutoSubmitting}
        className="min-h-[56px] rounded-full border-2 border-white/80 bg-white px-4 text-sm font-black text-primary-dark shadow-[0_5px_0_rgba(21,93,39,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_7px_0_rgba(21,93,39,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Selesai
      </button>
    )
    const fontSizeControl = (
      <div className="flex min-h-[36px] items-center rounded-full border border-border bg-surface p-1 text-sm font-black text-headline dark:bg-background">
        <button
          type="button"
          onClick={() => setExamFontSize((size) => Math.max(14, size - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-surface"
          aria-label="Perkecil ukuran font soal"
        >
          −
        </button>
        <span className="min-w-8 text-center">{examFontSize}</span>
        <button
          type="button"
          onClick={() => setExamFontSize((size) => Math.min(22, size + 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-surface"
          aria-label="Perbesar ukuran font soal"
        >
          +
        </button>
      </div>
    )

    return (
      <FocusExamLayout
        topBar={
          <div className="mx-auto max-w-3xl px-4 py-5">
            <div>
              <p className="font-display text-3xl font-black leading-tight">Quick Practice CPNS</p>
              <p className="mt-1 text-sm font-bold text-white/85">Peserta: Kamu</p>
            </div>
            <div className="mt-3 rounded-3xl bg-white/20 px-5 py-3 shadow-inner">
              <div className="mb-2 text-right text-base font-black">
                {answeredCount} / {questions.length}
              </div>
              <div className="h-2.5 rounded-full bg-white/35">
                <div
                  className="h-full rounded-full bg-white transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <div className="flex min-h-[72px] items-center justify-center gap-3 rounded-full bg-white/20 font-display text-4xl font-black shadow-inner">
                <Clock className="h-8 w-8" aria-hidden="true" />
                {formatTimer(remainingSeconds)}
              </div>
              {renderFinishButton()}
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
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const isCurrent = index === currentIndex
                const isAnswered = answers[question.id] != null
                const isFlagged = flagged[question.id] === true
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => goToQuestion(index)}
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
        onMobileNavigatorToggle={() => setMobileNavigatorOpen((current) => !current)}
        statusOverlay={
          <>
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
            ) : null}
            <FocusExamSubmitModal
              isOpen={submitModalOpen}
              emptyCount={emptyCount}
              flaggedCount={flaggedCount}
              answeredCount={answeredCount}
              isSubmitting={isSubmitting}
              onClose={() => setSubmitModalOpen(false)}
              onSubmit={() => {
                setSubmitModalOpen(false)
                void submitPractice()
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
              {Object.entries(currentQuestion.options).map(([key, value]) => {
                const selected = answers[currentQuestion.id] === key
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={timeExpired}
                    onClick={() => selectAnswer(currentQuestion.id, key)}
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
            <Button
              type="button"
              variant="secondary"
              className="shrink-0"
              onClick={() => goToQuestion(currentIndex - 1)}
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
                setFlagged((current) => ({ ...current, [currentQuestion.id]: !current[currentQuestion.id] }))
              }}
              aria-label="Tandai soal"
            >
              <Flag className={['h-5 w-5', currentQuestion && flagged[currentQuestion.id] ? 'fill-xp text-xp' : ''].join(' ')} aria-hidden="true" />
            </Button>
            {currentIndex < questions.length - 1 && !timeExpired ? (
              <Button
                type="button"
                className="flex-1"
                onClick={() => goToQuestion(currentIndex + 1)}
                disabled={!currentQuestion || !answers[currentQuestion.id] || isSubmitting}
                rightIcon={<ArrowRight className="h-5 w-5" aria-hidden="true" />}
              >
                Ayo Lanjut!
              </Button>
            ) : (
              <Button
                type="button"
                className="flex-1"
                onClick={() => setSubmitModalOpen(true)}
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

  if (step === 'result' && result) {
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
              onClick={() => {
                setCurrentIndex(0)
                setMobileNavigatorOpen(false)
                setStep('review')
              }}
            >
              Lihat Pembahasan
            </Button>
            <Button type="button" onClick={() => void startPractice(category)} leftIcon={<RotateCcw className="h-5 w-5" aria-hidden="true" />}>
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

        <div className="grid gap-4 md:grid-cols-3">
          {categoryCards.map((item) => {
            const selected = category === item.category
            return (
              <button
                key={item.category}
                type="button"
                onClick={() => setCategory(item.category)}
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

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Link href="/dashboard" className="btn-secondary min-h-[44px] justify-center">
            <Home className="h-5 w-5" aria-hidden="true" />
            Balik ke Markas
          </Link>
          <Button type="button" size="lg" onClick={() => void startPractice()}>
            Yuk Mulai!
          </Button>
        </div>
      </main>
    </div>
  )
}
