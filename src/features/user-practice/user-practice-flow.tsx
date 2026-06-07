'use client'

import * as React from 'react'
// Tipe data domain latihan.
import type {
  PracticeCategory,
  PracticeStep,
  PublicPracticeQuestion,
  PracticeResult,
} from './_types/practice.types'
import type { ResolvedProgression } from '@/features/user-dashboard/_types/dashboard.types'


// Utilitas Latihan
import { readApiError } from '@/features/shared/_utils/api.utils'

// Komponen UI Shared
import { FullScreenLoader } from '@/components/molecules'

// Komponen UI Latihan
import {
  PracticePageView,
  PracticeResultStep,
  PracticeExamStep,
  PracticeReviewStep,
} from './_components'



// Props dari server untuk identitas user (dipakai di sidebar).
type PracticeFlowProps = {
  userName?: string | null
  userEmail?: string | null
  streakDays: number
  currentProgression: ResolvedProgression
}

// Komponen utama orchestrator untuk alur latihan pengguna.
export function PracticeFlow({
  userName,
  userEmail,
  streakDays,
  currentProgression,
}: PracticeFlowProps) {
  // State dasar alur dan pengaturan latihan.
  const [step, setStep] = React.useState<PracticeStep>('setup')
  const [category, setCategory] = React.useState<PracticeCategory>('TWK')
  const [sessionId, setSessionId] = React.useState('')
  
  // State data ujian dan navigasi.
  const [questions, setQuestions] = React.useState<PublicPracticeQuestion[]>([])
  const [currentIndex, setCurrentIndex] = React.useState(0)
  
  // State pengaturan waktu.
  const [durationSeconds, setDurationSeconds] = React.useState(5 * 60)
  const [remainingSeconds, setRemainingSeconds] = React.useState(5 * 60)
  
  // State pencatatan jawaban dan metrik ujian pengguna.
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [flagged, setFlagged] = React.useState<Record<string, boolean>>({})
  const [timeSpent, setTimeSpent] = React.useState<Record<string, number>>({})
  
  // State manajemen UI, status, dan respon server.
  const [message, setMessage] = React.useState('')
  const [result, setResult] = React.useState<PracticeResult | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isAutoSubmitting, setIsAutoSubmitting] = React.useState(false)
  const [mobileNavigatorOpen, setMobileNavigatorOpen] = React.useState(false)
  const [submitModalOpen, setSubmitModalOpen] = React.useState(false)
  const [examFontSize, setExamFontSize] = React.useState(16)
  // State khusus untuk loading awal ketika user klik 'Mulai Latihan' di halaman setup.
  const [isStarting, setIsStarting] = React.useState(false)
  
  // Ref untuk menghindari pengiriman (submit) otomatis yang duplikat.
  const didAutoSubmitRef = React.useRef(false)

  // Mengambil item pembahasan saat ini untuk langkah review.
  const currentReviewItem = result?.review[currentIndex]
  
  // Mengecek apakah waktu ujian telah habis (berlaku di langkah practice).
  const timeExpired = step === 'practice' && remainingSeconds === 0

  // Membungkus pergantian step dengan animasi ringan tanpa mengubah state/timer.
  const renderStep = (content: React.ReactNode) => (
    <div key={step} className="step-transition-enter">
      {content}
    </div>
  )

  // Efek samping untuk menjalankan timer penghitung mundur saat ujian berlangsung.
  React.useEffect(() => {
    if (step !== 'practice') return

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [step])

  // Helper untuk membentuk struktur payload jawaban yang dikirim ke server.
  const buildPayloadAnswers = React.useCallback(() => (
    Object.entries(answers).map(([questionId, selectedOption]) => ({
      question_id: questionId,
      selected_option: selectedOption,
      time_spent: Math.max(1, Math.min(timeSpent[questionId] ?? 1, durationSeconds)),
      flagged: flagged[questionId] === true,
    }))
  ), [answers, durationSeconds, flagged, timeSpent])

  // Fungsi penyimpan otomatis (autosave) jawaban ke server secara berkala/saat pindah soal.
  const autosave = React.useCallback(async () => {
    if (!sessionId || Object.keys(answers).length === 0) return

    await fetch(`/api/v1/practice/sessions/${sessionId}/answers`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: buildPayloadAnswers() }),
    }).catch(() => null)
  }, [answers, buildPayloadAnswers, sessionId])

  // Fungsi pengunci (submit) semua jawaban latihan untuk mendapatkan nilai akhir.
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

  // Efek samping pengunci jawaban otomatis jika waktu habis.
  React.useEffect(() => {
    if (step !== 'practice' || remainingSeconds > 0 || didAutoSubmitRef.current) return

    didAutoSubmitRef.current = true
    setSubmitModalOpen(false)
    setMessage('Waktu habis. Umbuddy sedang mengunci jawaban Kamu...')
    void submitPractice({ auto: true })
  }, [remainingSeconds, step, submitPractice])

  // Memulai sesi latihan baru dengan mengirim request ke server.
  async function startPractice(nextCategory = category) {
    setIsStarting(true)
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
      setStep('practice')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Latihan belum bisa dimulai.')
      setStep('setup')
    } finally {
      setIsStarting(false)
    }
  }

  // Handler untuk mencatat jawaban user dan lama pengerjaan soal saat itu.
  function selectAnswer(questionId: string, option: string) {
    if (timeExpired) return

    setAnswers((current) => ({ ...current, [questionId]: option }))
    setTimeSpent((current) => ({
      ...current,
      [questionId]: current[questionId] ?? Math.max(1, durationSeconds - remainingSeconds),
    }))
  }

  // Handler pindah soal dan melakukan penyimpanan otomatis (autosave) sebelumnya.
  function goToQuestion(nextIndex: number) {
    void autosave()
    setCurrentIndex(Math.max(0, Math.min(nextIndex, questions.length - 1)))
    setMobileNavigatorOpen(false)
  }

  // Render tampilan jika dalam kondisi sedang loading request API.
  if (step === 'loading') {
    return renderStep(<FullScreenLoader message="Menyiapkan latihan Kamu..." />)
  }

  // Render tampilan utama latihan ujian (exam screen).
  if (step === 'practice') {
    return renderStep(
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

  // Render tampilan hasil ujian yang sudah dikunci nilainya.
  if (step === 'result' && result) {
    return renderStep(
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

  // Render tampilan pembahasan tiap soal setelah melihat hasil nilai (review mode).
  if (step === 'review' && result && currentReviewItem) {
    return renderStep(
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

  // Fallback utama adalah halaman landing Practice dengan shell navigasi.
  return renderStep(
    <PracticePageView
      userName={userName}
      userEmail={userEmail}
      streakDays={streakDays}
      currentProgression={currentProgression}
      category={category}
      message={message}
      isStarting={isStarting}
      onCategoryChange={setCategory}
      onStartPractice={() => void startPractice()}
    />
  )
}
