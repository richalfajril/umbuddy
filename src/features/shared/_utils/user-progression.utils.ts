import { USER_PROGRESSION_RANKS } from '@/features/shared/_constants/user-app.constants'
import type { ResolvedProgression } from '@/features/shared/_types/user-progression.types'

// Resolve total XP menjadi jabatan, golongan, badge, dan progres pangkat user app.
export function resolveProgression(totalXp: number): ResolvedProgression {
  // Cari rank tertinggi yang sudah dicapai berdasarkan total XP.
  let currentIndex = 0
  for (let index = USER_PROGRESSION_RANKS.length - 1; index >= 0; index -= 1) {
    if (USER_PROGRESSION_RANKS[index].requiredXp <= totalXp) {
      currentIndex = index
      break
    }
  }

  const current = USER_PROGRESSION_RANKS[Math.max(currentIndex, 0)]
  // Rank berikutnya dipakai untuk menghitung XP bar menuju golongan selanjutnya.
  const next =
    USER_PROGRESSION_RANKS[
      Math.min(Math.max(currentIndex, 0) + 1, USER_PROGRESSION_RANKS.length - 1)
    ]
  const rankSpan = Math.max(next.requiredXp - current.requiredXp, 1)
  const currentRankXp = Math.max(totalXp - current.requiredXp, 0)
  // Rank MAX dibuat penuh agar bar tidak membagi dengan threshold yang sama.
  const nextRankXp =
    next.golongan === current.golongan ? current.requiredXp : rankSpan
  const progressPercentage =
    next.golongan === current.golongan
      ? 100
      : Math.max(
          0,
          Math.min(Math.round((currentRankXp / rankSpan) * 100), 100),
        )

  return {
    currentJabatan: current.jabatan,
    currentGolongan: current.golongan,
    currentBadge: `/badge/${current.badge}`,
    currentRankXp,
    nextRankXp,
    progressPercentage,
  }
}
