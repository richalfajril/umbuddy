'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  DiagnosticExamStep,
  DiagnosticIntroStep,
  DiagnosticResultStep,
  OnboardingLoadingStep,
  OnboardingLogoHeader,
  OnboardingProfileStep,
} from '@/features/user-onboarding/_components'
import { initialProfile } from '@/features/user-onboarding/_constants/onboarding.constants'
import type {
  DiagnosticResult,
  ProfileForm,
  PublicQuestion,
  Recommendation,
  RewardResult,
  StatusResponse,
  Step,
} from '@/features/user-onboarding/_types/onboarding.types'
import { readApiError, toDateInputValue } from '@/features/user-onboarding/_utils/onboarding.utils'

// Client orchestration untuk profile setup, diagnostic test, auto-submit, dan redirect onboarding.
export function OnboardingFlow() {
  const router = useRouter()
  const { update } = useSession()
  const [step, setStep] = React.useState<Step>('loading')
  const [profile, setProfile] = React.useState<ProfileForm>(initialProfile)
  const [message, setMessage] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [isAutoSubmitting, setIsAutoSubmitting] = React.useState(false)
  const [sessionId, setSessionId] = React.useState('')
  const [durationSeconds, setDurationSeconds] = React.useState(15 * 60)
  const [remainingSeconds, setRemainingSeconds] = React.useState(15 * 60)
  const [questions, setQuestions] = React.useState<PublicQuestion[]>([])
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [timeSpent, setTimeSpent] = React.useState<Record<string, number>>({})
  const [result, setResult] = React.useState<DiagnosticResult | null>(null)
  const [recommendation, setRecommendation] = React.useState<Recommendation | null>(null)
  const [reward, setReward] = React.useState<RewardResult | null>(null)
  const [mobileNavigatorOpen, setMobileNavigatorOpen] = React.useState(false)
  const [submitModalOpen, setSubmitModalOpen] = React.useState(false)
  const [examFontSize, setExamFontSize] = React.useState(16)
  const didAutoSubmitRef = React.useRef(false)

  React.useEffect(() => {
    let active = true

    fetch('/api/v1/onboarding/status')
      .then(async (response) => {
        if (!response.ok) throw new Error(await readApiError(response))
        return response.json() as Promise<StatusResponse>
      })
      .then((status) => {
        if (!active) return

        setProfile({
          ...initialProfile,
          target_instansi: status.profile?.target_instansi ?? '',
          target_score: status.profile?.target_score ? String(status.profile.target_score) : initialProfile.target_score,
          exam_date: toDateInputValue(status.profile?.exam_date),
          province: status.profile?.province ?? '',
          city: status.profile?.city ?? '',
          institution: status.profile?.institution ?? '',
          major: status.profile?.major ?? '',
        })

        if (status.current_step === 'completed' && status.result) {
          setResult(status.result)
          setStep('result')
        } else if (status.current_step === 'diagnostic') {
          setStep('diagnostic-intro')
        } else {
          setStep('profile')
        }
      })
      .catch((error: unknown) => {
        if (!active) return
        setMessage(error instanceof Error ? error.message : 'Gagal memuat onboarding.')
        setStep('profile')
      })

    return () => {
      active = false
    }
  }, [])

  React.useEffect(() => {
    if (step !== 'diagnostic') return

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [step])

  function handleSelectAnswer(questionId: string, option: string) {
    setAnswers((current) => ({ ...current, [questionId]: option }))
    setTimeSpent((current) => ({
      ...current,
      [questionId]: current[questionId] ?? Math.max(1, durationSeconds - remainingSeconds),
    }))
  }

  function goToQuestion(nextIndex: number) {
    setCurrentIndex(Math.max(0, Math.min(nextIndex, questions.length - 1)))
    setMobileNavigatorOpen(false)
  }

  async function submitProfile(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/v1/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_instansi: profile.target_instansi,
          target_score: Number(profile.target_score),
          exam_date: profile.exam_date,
          province: profile.province,
          city: profile.city,
          institution: profile.institution || undefined,
          major: profile.major || undefined,
          phone: profile.phone || undefined,
        }),
      })

      if (!response.ok) throw new Error(await readApiError(response))
      setStep('diagnostic-intro')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Profil belum bisa disimpan.')
    } finally {
      setIsLoading(false)
    }
  }

  async function startDiagnostic() {
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/v1/onboarding/diagnostic/start', {
        method: 'POST',
      })
      if (!response.ok) throw new Error(await readApiError(response))

      const data = (await response.json()) as {
        diagnostic_session_id: string
        duration_seconds: number
        questions: PublicQuestion[]
        fallback_used?: boolean
      }

      setSessionId(data.diagnostic_session_id)
      setDurationSeconds(data.duration_seconds)
      setRemainingSeconds(data.duration_seconds)
      setQuestions(data.questions)
      setCurrentIndex(0)
      setAnswers({})
      setTimeSpent({})
      setExamFontSize(16)
      setIsAutoSubmitting(false)
      setSubmitModalOpen(false)
      didAutoSubmitRef.current = false
      if (data.fallback_used) {
        setMessage('Bank soal published belum lengkap, jadi Umbuddy pakai soal mini aman sementara.')
      }
      setStep('diagnostic')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Tes mini belum bisa dimulai.')
    } finally {
      setIsLoading(false)
    }
  }

  const submitDiagnostic = React.useCallback(async (options?: { auto?: boolean }) => {
    if (!sessionId || questions.length === 0 || isLoading) return

    const isAuto = options?.auto === true
    setIsLoading(true)
    if (isAuto) setIsAutoSubmitting(true)
    setMessage('')

    try {
      const payloadAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        question_id: questionId,
        selected_option: selectedOption,
        time_spent: Math.max(1, timeSpent[questionId] ?? 1),
      }))

      const response = await fetch(`/api/v1/onboarding/diagnostic/${sessionId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: payloadAnswers }),
      })

      if (!response.ok) throw new Error(await readApiError(response))

      const data = (await response.json()) as {
        result: DiagnosticResult
        recommendations: Recommendation
        reward: RewardResult
      }
      setResult(data.result)
      setRecommendation(data.recommendations)
      setReward(data.reward)
      setStep('result')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Jawaban belum bisa dikunci.')
    } finally {
      setIsLoading(false)
      if (isAuto) setIsAutoSubmitting(false)
    }
  }, [answers, isLoading, questions, sessionId, timeSpent])

  React.useEffect(() => {
    if (step !== 'diagnostic' || remainingSeconds > 0 || didAutoSubmitRef.current) return

    didAutoSubmitRef.current = true
    setSubmitModalOpen(false)
    setMessage('Waktu habis. Umbuddy sedang mengunci jawaban Kamu...')
    void submitDiagnostic({ auto: true })
  }, [remainingSeconds, step, submitDiagnostic])

  async function enterDashboard() {
    setIsLoading(true)
    await update()
    router.replace('/dashboard')
  }

  if (step === 'loading') {
    return (
      <OnboardingLoadingStep header={<OnboardingLogoHeader />} />
    )
  }

  if (step === 'diagnostic') {
    return (
      <DiagnosticExamStep
        questions={questions}
        currentIndex={currentIndex}
        answers={answers}
        message={message}
        remainingSeconds={remainingSeconds}
        examFontSize={examFontSize}
        isLoading={isLoading}
        isAutoSubmitting={isAutoSubmitting}
        mobileNavigatorOpen={mobileNavigatorOpen}
        submitModalOpen={submitModalOpen}
        onGoToQuestion={goToQuestion}
        onSelectAnswer={handleSelectAnswer}
        onFontSizeChange={setExamFontSize}
        onMobileNavigatorToggle={() => setMobileNavigatorOpen((current) => !current)}
        onSubmitModalOpenChange={setSubmitModalOpen}
        onSubmitDiagnostic={submitDiagnostic}
      />
    )
  }

  if (step === 'result' && result) {
    return (
      <DiagnosticResultStep
        header={<OnboardingLogoHeader />}
        result={result}
        recommendation={recommendation}
        reward={reward}
        isLoading={isLoading}
        onEnterDashboard={enterDashboard}
      />
    )
  }

  if (step === 'diagnostic-intro') {
    return (
      <DiagnosticIntroStep
        header={<OnboardingLogoHeader />}
        message={message}
        isLoading={isLoading}
        onStartDiagnostic={startDiagnostic}
      />
    )
  }

  return (
    <OnboardingProfileStep
      header={<OnboardingLogoHeader />}
      profile={profile}
      message={message}
      isLoading={isLoading}
      onSubmit={submitProfile}
      onProfileChange={setProfile}
    />
  )
}
