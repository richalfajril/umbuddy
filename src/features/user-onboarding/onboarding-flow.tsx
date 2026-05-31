'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, ListChecks } from 'lucide-react'
import { Button, Card, Input, Label } from '@/components/ui'
import { FormSettingsLayout } from '@/components/templates/form-settings-layout'
import { FocusExamLayout, FocusExamSubmitModal } from '@/components/templates/focus-exam-layout'
import {
  DiagnosticIntroStep,
  DiagnosticResultStep,
  OnboardingLoadingStep,
  OnboardingLogoHeader,
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

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(answers).length

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
    const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0
    const emptyCount = Math.max(questions.length - answeredCount, 0)
    const timerLabel = `${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, '0')}`
    const renderFinishButton = () => (
      <button
        type="button"
        onClick={() => setSubmitModalOpen(true)}
        disabled={isLoading || isAutoSubmitting}
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
              <p className="font-display text-3xl font-black leading-tight">Diagnostic CPNS</p>
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
                {timerLabel}
              </div>
              {renderFinishButton()}
            </div>
          </div>
        }
        desktopTopBar={
          <div className="mx-auto grid max-w-[1680px] grid-cols-[280px_minmax(0,1fr)_340px] items-center gap-6 px-6 py-4">
            <div>
              <p className="font-display text-2xl font-black leading-tight">Diagnostic CPNS</p>
              <p className="mt-1 text-sm font-bold text-white/85">
                Tes mini 15 soal • Peserta: Kamu
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
                {timerLabel}
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
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => goToQuestion(index)}
                    disabled={isLoading}
                    aria-label={`Buka soal ${index + 1}`}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={[
                      'flex min-h-[44px] items-center justify-center rounded-xl border-2 border-b-[5px] text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
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
              flaggedCount={0}
              answeredCount={answeredCount}
              isSubmitting={isLoading}
              onClose={() => setSubmitModalOpen(false)}
              onSubmit={() => {
                setSubmitModalOpen(false)
                void submitDiagnostic()
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
              {Object.entries(currentQuestion.options).map(([key, value]) => {
                const selected = answers[currentQuestion.id] === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectAnswer(currentQuestion.id, key)}
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
            <Button
              type="button"
              variant="secondary"
              className="shrink-0"
              onClick={() => goToQuestion(currentIndex - 1)}
              disabled={currentIndex === 0 || isLoading}
              aria-label="Soal sebelumnya"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
            {currentIndex < questions.length - 1 ? (
              <Button
                type="button"
                className="flex-1"
                onClick={() => goToQuestion(currentIndex + 1)}
                disabled={!currentQuestion || !answers[currentQuestion.id] || isLoading}
                rightIcon={<ArrowRight className="h-5 w-5" aria-hidden="true" />}
              >
                Lanjut
              </Button>
            ) : (
              <Button
                type="button"
                className="flex-1"
                onClick={() => setSubmitModalOpen(true)}
                disabled={isLoading}
                isLoading={isLoading}
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
    <FormSettingsLayout
      staticCard
      maxWidth="md"
      header={<OnboardingLogoHeader />}
    >
      <form onSubmit={submitProfile} className="space-y-5">
        <div className="space-y-2 text-center">
          <p className="text-sm font-black uppercase text-primary">Profil Belajar</p>
          <h1 className="font-display text-3xl font-black text-headline">
            Siapkan <span className="text-primary">target</span> Kamu
          </h1>
          <p className="text-sm leading-6 text-body">
            Umbuddy pakai data ini untuk membuat rekomendasi awal yang lebih relevan.
          </p>
        </div>

        {message && (
          <p role="alert" aria-live="assertive" className="rounded-xl border border-error/30 bg-error-light px-4 py-3 text-sm font-bold text-error-dark">
            {message}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="target_instansi">Target Instansi</Label>
            <Input
              id="target_instansi"
              required
              value={profile.target_instansi}
              onChange={(event) => setProfile((current) => ({ ...current, target_instansi: event.target.value }))}
              placeholder="Contoh: Kementerian Keuangan"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target_score">Target Skor</Label>
            <Input
              id="target_score"
              type="number"
              min={0}
              max={550}
              required
              value={profile.target_score}
              onChange={(event) => setProfile((current) => ({ ...current, target_score: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exam_date">Tanggal Ujian</Label>
            <Input
              id="exam_date"
              type="date"
              required
              value={profile.exam_date}
              onChange={(event) => setProfile((current) => ({ ...current, exam_date: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">Provinsi</Label>
            <Input
              id="province"
              required
              value={profile.province}
              onChange={(event) => setProfile((current) => ({ ...current, province: event.target.value }))}
              placeholder="Contoh: Jawa Barat"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Kota/Kabupaten</Label>
            <Input
              id="city"
              required
              value={profile.city}
              onChange={(event) => setProfile((current) => ({ ...current, city: event.target.value }))}
              placeholder="Contoh: Bandung"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="institution">Institusi</Label>
            <Input
              id="institution"
              value={profile.institution}
              onChange={(event) => setProfile((current) => ({ ...current, institution: event.target.value }))}
              placeholder="Opsional"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="major">Jurusan</Label>
            <Input
              id="major"
              value={profile.major}
              onChange={(event) => setProfile((current) => ({ ...current, major: event.target.value }))}
              placeholder="Opsional"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="phone">Nomor HP</Label>
            <Input
              id="phone"
              inputMode="tel"
              value={profile.phone}
              onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
              placeholder="Opsional"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-14 text-lg"
          isLoading={isLoading}
          loadingLabel="Menyimpan..."
          rightIcon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
        >
          Yuk Mulai!
        </Button>
      </form>
    </FormSettingsLayout>
  )
}
