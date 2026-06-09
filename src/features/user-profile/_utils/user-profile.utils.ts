import type { UserProfileAnalyticsItem } from '@/features/user-profile/_types/user-profile.types'

// Formatter tanggal profil memakai locale Indonesia agar copy tetap konsisten.
export function formatProfileDate(date?: Date | null) {
  if (!date) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

// Formatter angka profil menjaga fallback kosong tetap ramah dibaca.
export function formatProfileNumber(value?: number | null) {
  if (typeof value !== 'number') return '-'

  return value.toLocaleString('id-ID')
}

// Menghitung rata-rata score untuk satu subtes dari attempt practice.
export function getProfileCategoryPercent(
  attempts: Array<{ score: number | null; question: { category: string } }>,
  category: UserProfileAnalyticsItem['label'],
) {
  const categoryAttempts = attempts.filter((attempt) => attempt.question.category === category)
  if (categoryAttempts.length === 0) return 0

  const totalScore = categoryAttempts.reduce((total, attempt) => total + (attempt.score ?? 0), 0)
  return Math.max(0, Math.min(Math.round(totalScore / categoryAttempts.length), 100))
}
