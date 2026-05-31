import { progressionRanks } from "../_constants/dashboard.constants";
import type {
  DashboardScore,
  ResolvedProgression,
} from "../_types/dashboard.types";

// Resolve total XP menjadi jabatan, golongan, badge, dan progres pangkat dashboard.
export function resolveProgression(totalXp: number): ResolvedProgression {
  // Cari rank tertinggi yang sudah dicapai berdasarkan total XP.
  let currentIndex = 0;
  for (let index = progressionRanks.length - 1; index >= 0; index -= 1) {
    if (progressionRanks[index].requiredXp <= totalXp) {
      currentIndex = index;
      break;
    }
  }
  const current = progressionRanks[Math.max(currentIndex, 0)];
  // Rank berikutnya dipakai untuk menghitung XP bar menuju golongan selanjutnya.
  const next =
    progressionRanks[
      Math.min(Math.max(currentIndex, 0) + 1, progressionRanks.length - 1)
    ];
  const rankSpan = Math.max(next.requiredXp - current.requiredXp, 1);
  const currentRankXp = Math.max(totalXp - current.requiredXp, 0);
  // Rank MAX dibuat penuh agar bar tidak membagi dengan threshold yang sama.
  const nextRankXp =
    next.golongan === current.golongan ? current.requiredXp : rankSpan;
  const progressPercentage =
    next.golongan === current.golongan
      ? 100
      : Math.max(
          0,
          Math.min(Math.round((currentRankXp / rankSpan) * 100), 100),
        );

  return {
    currentJabatan: current.jabatan,
    currentGolongan: current.golongan,
    currentBadge: `/badge/${current.badge}`,
    currentRankXp,
    nextRankXp,
    progressPercentage,
  };
}

// Konversi skor mentah ke persentase aman untuk progress bar.
export function getScorePercent(
  score: number | null | undefined,
  maxScore: number,
) {
  if (!score) return 0;
  return Math.max(0, Math.min(Math.round((score / maxScore) * 100), 100));
}

// Format compact menjaga angka leaderboard tetap pendek di mobile.
export function formatCompactXp(xp: number) {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k XP`;
  }

  return `${xp} XP`;
}

// Area terlemah adalah skor kategori paling rendah dari analytics siap-render.
export function getWeakestArea(scores: DashboardScore[]) {
  return [...scores].sort((a, b) => a.percent - b.percent)[0];
}
