export type Step = 'loading' | 'profile' | 'diagnostic-intro' | 'diagnostic' | 'result'

export type PublicQuestion = {
  id: string
  category: 'TWK' | 'TIU' | 'TKP'
  text: string
  options: Record<string, string>
  source: 'db' | 'fallback'
}

export type DiagnosticResult = {
  diagnostic_attempt_id: string
  score_twk: number
  score_tiu: number
  score_tkp: number
  total_score: number
  weakest_category: 'TWK' | 'TIU' | 'TKP'
  readiness: string
}

export type Recommendation = {
  primary_category: 'TWK' | 'TIU' | 'TKP'
  title: string
  message: string
}

export type RewardResult = {
  xp: number
  already_claimed: boolean
}

export type StatusResponse = {
  current_step: 'profile' | 'diagnostic' | 'completed'
  profile?: Partial<ProfileForm> | null
  result?: DiagnosticResult | null
}

export type ProfileForm = {
  target_instansi: string
  target_score: string
  exam_date: string
  province: string
  city: string
  institution: string
  major: string
  phone: string
}
