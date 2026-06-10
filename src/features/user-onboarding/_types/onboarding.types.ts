// Tipe data client-side untuk flow onboarding dan diagnostic mini.
// Step adalah state machine sederhana untuk layar onboarding.
export type Step = 'loading' | 'profile' | 'diagnostic-intro' | 'diagnostic' | 'result'

// PublicQuestion sengaja tidak memuat answer_key agar client tidak melihat kunci jawaban.
export type PublicQuestion = {
  id: string
  category: 'TWK' | 'TIU' | 'TKP'
  text: string
  options: Record<string, string>
  source: 'db' | 'fallback'
}

// DiagnosticResult adalah hasil skor yang sudah dihitung server.
export type DiagnosticResult = {
  diagnostic_attempt_id: string
  score_twk: number
  score_tiu: number
  score_tkp: number
  total_score: number
  weakest_category: 'TWK' | 'TIU' | 'TKP'
  readiness: string
}

// Recommendation memberi arahan belajar awal dari weakest category.
export type Recommendation = {
  primary_category: 'TWK' | 'TIU' | 'TKP'
  title: string
  message: string
}

// RewardResult menjelaskan XP onboarding dan status idempotency reward.
export type RewardResult = {
  xp: number
  already_claimed: boolean
}

// StatusResponse menentukan step awal saat user membuka /onboarding.
export type StatusResponse = {
  current_step: 'profile' | 'diagnostic' | 'completed'
  profile?: Partial<ProfileForm> | null
  result?: DiagnosticResult | null
}

// ProfileForm menyimpan string form agar input controlled tetap sederhana.
export type ProfileForm = {
  target_instansi: string
  target_score: string
  birth_date: string
  province: string
  city: string
  institution: string
  major: string
  phone: string
}
