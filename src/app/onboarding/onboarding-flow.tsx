'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Flag, ShieldCheck, Target, Trophy } from 'lucide-react'
import { Button, Card, Input, Label } from '@/components/ui'
import { FormSettingsLayout } from '@/components/layouts/form-settings-layout'
import { FocusExamLayout } from '@/components/layouts/focus-exam-layout'

type Step = 'loading' | 'profile' | 'diagnostic-intro' | 'diagnostic' | 'result'

type PublicQuestion = {
  id: string
  category: 'TWK' | 'TIU' | 'TKP'
  text: string
  options: Record<string, string>
  source: 'db' | 'fallback'
}

type DiagnosticResult = {
  diagnostic_attempt_id: string
  score_twk: number
  score_tiu: number
  score_tkp: number
  total_score: number
  weakest_category: 'TWK' | 'TIU' | 'TKP'
  readiness: string
}

type Recommendation = {
  primary_category: 'TWK' | 'TIU' | 'TKP'
  title: string
  message: string
}

type StatusResponse = {
  current_step: 'profile' | 'diagnostic' | 'completed'
  profile?: Partial<ProfileForm> | null
  result?: DiagnosticResult | null
}

type ProfileForm = {
  target_instansi: string
  target_score: string
  exam_date: string
  province: string
  city: string
  institution: string
  major: string
  phone: string
}

const initialProfile: ProfileForm = {
  target_instansi: '',
  target_score: '400',
  exam_date: '',
  province: '',
  city: '',
  institution: '',
  major: '',
  phone: '',
}

const categoryLabel = {
  TWK: 'TWK',
  TIU: 'TIU',
  TKP: 'TKP',
}

async function readApiError(response: Response) {
  const data = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
  return data?.error?.message ?? 'Duh, onboarding belum bisa diproses. Coba lagi ya.'
}

function toDateInputValue(value?: string | null) {
  if (!value) return ''
  return value.slice(0, 10)
}

export function OnboardingFlow() {
  const router = useRouter()
  const { update } = useSession()
  const [step, setStep] = React.useState<Step>('loading')
  const [profile, setProfile] = React.useState<ProfileForm>(initialProfile)
  const [message, setMessage] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [sessionId, setSessionId] = React.useState('')
  const [durationSeconds, setDurationSeconds] = React.useState(20 * 60)
  const [remainingSeconds, setRemainingSeconds] = React.useState(20 * 60)
  const [questions, setQuestions] = React.useState<PublicQuestion[]>([])
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [timeSpent, setTimeSpent] = React.useState<Record<string, number>>({})
  const [result, setResult] = React.useState<DiagnosticResult | null>(null)
  const [recommendation, setRecommendation] = React.useState<Recommendation | null>(null)

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
  const allAnswered = questions.length > 0 && answeredCount === questions.length

  function handleSelectAnswer(questionId: string, option: string) {
    setAnswers((current) => ({ ...current, [questionId]: option }))
    setTimeSpent((current) => ({
      ...current,
      [questionId]: current[questionId] ?? Math.max(1, durationSeconds - remainingSeconds),
    }))
  }

  function goToQuestion(nextIndex: number) {
    setCurrentIndex(Math.max(0, Math.min(nextIndex, questions.length - 1)))
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

  async function submitDiagnostic() {
    if (!sessionId || questions.length === 0 || isLoading) return

    setIsLoading(true)
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
      }
      setResult(data.result)
      setRecommendation(data.recommendations)
      setStep('result')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Jawaban belum bisa dikunci.')
    } finally {
      setIsLoading(false)
    }
  }

  async function enterDashboard() {
    setIsLoading(true)
    await update()
    router.replace('/dashboard')
  }

  if (step === 'loading') {
    return (
      <FormSettingsLayout maxWidth="md">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="font-bold text-body">Menyiapkan onboarding kamu...</p>
        </div>
      </FormSettingsLayout>
    )
  }

  if (step === 'diagnostic') {
    return (
      <FocusExamLayout
        topBar={
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-xs font-black uppercase text-primary">Tes Mini Diagnostic</p>
              <p className="text-sm font-bold text-headline">
                Soal {currentIndex + 1} dari {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-black text-headline">
              <Clock className="h-4 w-4 text-xp" aria-hidden="true" />
              {Math.floor(remainingSeconds / 60)}:{String(remainingSeconds % 60).padStart(2, '0')}
            </div>
          </div>
        }
        question={
          currentQuestion ? (
            <Card padding="lg" className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-primary/30 bg-primary-light px-3 py-1 text-xs font-black text-primary-dark">
                  {categoryLabel[currentQuestion.category]}
                </span>
                <span className="text-xs font-bold text-muted">
                  Terjawab {answeredCount}/{questions.length}
                </span>
              </div>
              <h1 className="font-display text-2xl font-black text-headline">
                {currentQuestion.text}
              </h1>
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
                      'flex min-h-[52px] w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      selected
                        ? 'border-primary bg-primary-light text-primary-dark'
                        : 'border-border bg-background text-headline hover:border-primary hover:bg-primary-light/50',
                    ].join(' ')}
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
                onClick={() => void submitDiagnostic()}
                disabled={!allAnswered}
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
    const resultRecommendation = recommendation ?? {
      title: `Mulai dari ${result.weakest_category}`,
      message: 'Umbuddy sudah membaca titik start kamu. Lanjut ke markas untuk mulai latihan pertama.',
      primary_category: result.weakest_category,
    }

    return (
      <FormSettingsLayout maxWidth="lg">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
            <Trophy className="h-9 w-9" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-black uppercase text-primary">Baseline Kamu Siap</p>
            <h1 className="mt-2 font-display text-3xl font-black text-headline">
              Skor Awal: {result.total_score}/550
            </h1>
            <p className="mt-2 text-sm leading-6 text-body">
              Ini bukan nilai akhir, ini titik start biar latihanmu lebih tepat sasaran.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {(['TWK', 'TIU', 'TKP'] as const).map((category) => (
              <Card key={category} padding="sm" className="text-center">
                <p className="text-xs font-black text-muted">{category}</p>
                <p className="font-display text-2xl font-black text-headline">
                  {category === 'TWK' ? result.score_twk : category === 'TIU' ? result.score_tiu : result.score_tkp}
                </p>
              </Card>
            ))}
          </div>

          <Card padding="md" className="text-left">
            <div className="flex gap-3">
              <Target className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h2 className="font-display text-lg font-black text-headline">
                  {resultRecommendation.title}
                </h2>
                <p className="mt-1 text-sm leading-6 text-body">
                  {resultRecommendation.message}
                </p>
              </div>
            </div>
          </Card>

          <div className="rounded-2xl border border-xp/40 bg-xp-light px-4 py-3 text-sm font-black text-headline">
            +50 XP masuk kantong karena kamu menyelesaikan onboarding.
          </div>

          <Button
            type="button"
            className="w-full h-14 text-lg"
            onClick={() => void enterDashboard()}
            isLoading={isLoading}
            loadingLabel="Membuka markas..."
          >
            Masuk ke Markas
          </Button>
        </div>
      </FormSettingsLayout>
    )
  }

  if (step === 'diagnostic-intro') {
    return (
      <FormSettingsLayout
        maxWidth="md"
        header={
          <Image src="/logo/logo_only.png" alt="Umbuddy" width={88} height={88} className="h-20 w-auto" priority />
        }
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-xp-light text-xp">
            <Flag className="h-8 w-8" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-black uppercase text-primary">Tes Mini 20 Soal</p>
            <h1 className="mt-2 font-display text-3xl font-black text-headline">
              Yuk cari titik start Kamu
            </h1>
            <p className="mt-3 text-sm leading-6 text-body">
              Tes ini campuran TWK, TIU, dan TKP. Jangan takut salah, ini bukan ujian sungguhan.
            </p>
          </div>

          {message && (
            <p role="status" aria-live="polite" className="rounded-xl bg-xp-light px-4 py-3 text-sm font-bold text-headline">
              {message}
            </p>
          )}

          <div className="grid gap-3 text-left">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
              <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-bold text-headline">Durasi 20 menit</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-bold text-headline">Skor dihitung server, aman dari manipulasi</span>
            </div>
          </div>

          <Button
            type="button"
            className="w-full h-14 text-lg"
            onClick={() => void startDiagnostic()}
            isLoading={isLoading}
            loadingLabel="Menyiapkan..."
          >
            Lanjut Tes Mini
          </Button>
        </div>
      </FormSettingsLayout>
    )
  }

  return (
    <FormSettingsLayout
      maxWidth="md"
      header={
        <Image src="/logo/logo_only.png" alt="Umbuddy" width={88} height={88} className="h-20 w-auto" priority />
      }
    >
      <form onSubmit={submitProfile} className="space-y-5">
        <div className="space-y-2 text-center">
          <p className="text-sm font-black uppercase text-primary">Profil Belajar</p>
          <h1 className="font-display text-3xl font-black text-headline">
            Siapkan target Kamu
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
