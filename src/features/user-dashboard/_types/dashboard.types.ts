export type DashboardScore = {
  label: string;
  percent: number;
};

export type ResolvedProgression = {
  currentJabatan: string;
  currentGolongan: string;
  currentBadge: string;
  currentRankXp: number;
  nextRankXp: number;
  progressPercentage: number;
};
