'use client'

import * as React from 'react'
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
  PracticeReviewStep,
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
    return (
      <PracticeReviewStep
        result={result}
        currentIndex={currentIndex}
        examFontSize={examFontSize}
        mobileNavigatorOpen={mobileNavigatorOpen}
        onGoToReviewQuestion={(index) => {
          setCurrentIndex(index)
          setMobileNavigatorOpen(false)
        }}
        onFontSizeChange={setExamFontSize}
        onMobileNavigatorToggle={() => setMobileNavigatorOpen((current) => !current)}
        onBackToResult={() => setStep('result')}
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
