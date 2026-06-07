import type { DashboardScore } from "../_types/dashboard.types";

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
