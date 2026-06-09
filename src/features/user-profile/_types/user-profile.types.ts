import type { ResolvedProgression } from '@/features/shared/_types/user-progression.types'

// Ringkasan target belajar dari onboarding yang ditampilkan di profil.
export type UserProfileTarget = {
  targetInstansi: string
  targetScore: string
  targetLocation: string
  examDate: string
  institution: string
  major: string
}

// Item performa per subtes untuk ringkasan analytics profil.
export type UserProfileAnalyticsItem = {
  label: 'TWK' | 'TIU' | 'TKP'
  percent: number
}

// Item aktivitas terbaru dari practice attempt user.
export type UserProfileActivityItem = {
  category: string
  score: number
  createdAt: string
}

// Props view profil menerima semua data siap-render dari server flow.
export type UserProfileViewProps = {
  userName?: string | null
  userEmail?: string | null
  avatarUrl?: string | null
  joinedAt: string
  streakDays: number
  totalXp: number
  currentProgression: ResolvedProgression
  target: UserProfileTarget
  totalAnswered: number
  averageScore: number
  bestScore: number
  diagnosticScore: number
  analytics: UserProfileAnalyticsItem[]
  recentActivity: UserProfileActivityItem[]
}
