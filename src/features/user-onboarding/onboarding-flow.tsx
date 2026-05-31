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
import { toDateInputValue } from '@/features/user-onboarding/_utils/onboarding.utils'
import { readApiError } from '@/features/shared/_utils/api.utils'

// Client orchestration untuk profile setup, diagnostic test, auto-submit, dan redirect onboarding.
export function OnboardingFlow() {
  // Router dan session update dipakai untuk refresh JWT setelah onboarding selesai.
  const router = useRouter()
  const { update } = useSession()

  // State utama menentukan step onboarding yang sedang tampil.
  const [step, setStep] = React.useState<Step>('loading')
  const [profile, setProfile] = React.useState<ProfileForm>(initialProfile)
  const [message, setMessage] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [isAutoSubmitting, setIsAutoSubmitting] = React.useState(false)

  // State diagnostic menyimpan sesi, timer, soal, jawaban, dan waktu jawab user.
  const [sessionId, setSessionId] = React.useState('')
  const [durationSeconds, setDurationSeconds] = React.useState(15 * 60)
  const [remainingSeconds, setRemainingSeconds] = React.useState(15 * 60)
  const [questions, setQuestions] = React.useState<PublicQuestion[]>([])
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [timeSpent, setTimeSpent] = React.useState<Record<string, number>>({})

  // State hasil dipakai setelah server selesai menghitung skor diagnostic.
  const [result, setResult] = React.useState<DiagnosticResult | null>(null)
  const [recommendation, setRecommendation] = React.useState<Recommendation | null>(null)
  const [reward, setReward] = React.useState<RewardResult | null>(null)

  // State UI lokal untuk navigator mobile, modal submit, dan ukuran font soal.
  const [mobileNavigatorOpen, setMobileNavigatorOpen] = React.useState(false)
  const [submitModalOpen, setSubmitModalOpen] = React.useState(false)
  const [examFontSize, setExamFontSize] = React.useState(16)

  // Ref ini mencegah auto-submit berjalan lebih dari satu kali saat timer menyentuh nol.
  const didAutoSubmitRef = React.useRef(false)

  // Saat halaman dibuka, ambil status onboarding untuk menentukan step awal.
  React.useEffect(() => {
    let active = true

    // Endpoint status mengembalikan profile summary, current step, dan result jika sudah selesai.
    fetch('/api/v1/onboarding/status')
      .then(async (response) => {
        if (!response.ok) throw new Error(await readApiError(response))
        return response.json() as Promise<StatusResponse>
      })
      .then((status) => {
        if (!active) return

        // Pre-fill form dari profile yang sudah pernah tersimpan.
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

        // Server tetap menjadi sumber kebenaran untuk menentukan step onboarding.
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
        // Jika status gagal dimuat, user tetap bisa mengisi profile dari awal.
        setMessage(error instanceof Error ? error.message : 'Gagal memuat onboarding.')
        setStep('profile')
      })

    return () => {
      active = false
    }
  }, [])

  // Timer hanya aktif selama step diagnostic agar tidak berjalan di intro/result.
  React.useEffect(() => {
    if (step !== 'diagnostic') return

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [step])

  // Simpan pilihan user dan catat time_spent pertama kali jawaban dipilih.
  function handleSelectAnswer(questionId: string, option: string) {
    setAnswers((current) => ({ ...current, [questionId]: option }))
    setTimeSpent((current) => ({
      ...current,
      [questionId]: current[questionId] ?? Math.max(1, durationSeconds - remainingSeconds),
    }))
  }

  // Navigasi soal dibatasi agar index tidak keluar dari rentang soal.
  function goToQuestion(nextIndex: number) {
    setCurrentIndex(Math.max(0, Math.min(nextIndex, questions.length - 1)))
    setMobileNavigatorOpen(false)
  }

  // Submit profile menyimpan target belajar user sebelum diagnostic dibuka.
  async function submitProfile(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      // API profile melakukan validasi server-side dan hanya menulis data milik session user.
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
      // Loading harus selalu dilepas agar tombol form tidak terkunci setelah error.
      setIsLoading(false)
    }
  }

  // Start diagnostic membuat/resume sesi server lalu mengisi soal publik tanpa answer key.
  async function startDiagnostic() {
    setIsLoading(true)
    setMessage('')

    try {
      // Server memilih soal dan menentukan durasi, client tidak membuat sesi sendiri.
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

      // Reset state diagnostic setiap sesi baru agar tidak membawa jawaban lama.
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
      setStep('diagnostic')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Tes mini belum bisa dimulai.')
    } finally {
      // Loading start diagnostic selesai baik sukses maupun gagal.
      setIsLoading(false)
    }
  }

  // Submit diagnostic mengirim jawaban mentah; server menghitung skor dan reward.
  const submitDiagnostic = React.useCallback(async (options?: { auto?: boolean }) => {
    if (!sessionId || questions.length === 0 || isLoading) return

    // Auto submit memakai overlay khusus agar user tahu waktu sudah habis.
    const isAuto = options?.auto === true
    setIsLoading(true)
    if (isAuto) setIsAutoSubmitting(true)
    setMessage('')

    try {
      // Payload sengaja tidak berisi score agar client tidak bisa memalsukan nilai.
      const payloadAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        question_id: questionId,
        selected_option: selectedOption,
        time_spent: Math.max(1, timeSpent[questionId] ?? 1),
      }))

      // Submit diarahkan ke session id milik user yang dibuat server.
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
      // Hasil server langsung menggeser flow ke result step.
      setResult(data.result)
      setRecommendation(data.recommendations)
      setReward(data.reward)
      setStep('result')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Jawaban belum bisa dikunci.')
    } finally {
      // Reset status submit agar UI bisa dipakai lagi jika submit gagal.
      setIsLoading(false)
      if (isAuto) setIsAutoSubmitting(false)
    }
  }, [answers, isLoading, questions, sessionId, timeSpent])

  // Saat timer habis, jawaban langsung dikunci otomatis tanpa menunggu klik user.
  React.useEffect(() => {
    if (step !== 'diagnostic' || remainingSeconds > 0 || didAutoSubmitRef.current) return

    didAutoSubmitRef.current = true
    setSubmitModalOpen(false)
    setMessage('Waktu habis. Umbuddy sedang mengunci jawaban Kamu...')
    void submitDiagnostic({ auto: true })
  }, [remainingSeconds, step, submitDiagnostic])

  // Masuk dashboard perlu update session agar onboardingRequired di JWT ikut segar.
  async function enterDashboard() {
    setIsLoading(true)
    await update()
    router.replace('/dashboard')
  }

  // Render skeleton/loading selama status onboarding awal belum diketahui.
  if (step === 'loading') {
    return (
      <OnboardingLoadingStep header={<OnboardingLogoHeader />} />
    )
  }

  // Render mode ujian diagnostic dengan state tetap dikontrol oleh OnboardingFlow.
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

  // Render hasil jika server sudah mengembalikan diagnostic result.
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

  // Render intro diagnostic setelah profile berhasil disimpan.
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

  // Fallback utama adalah profile setup untuk user baru atau status yang belum lengkap.
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
