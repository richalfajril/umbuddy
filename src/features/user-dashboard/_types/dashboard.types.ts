export type DashboardScore = {
  label: string;
  percent: number;
};

export type DashboardAnalyticsItem = DashboardScore & {
  tone: "primary" | "xp" | "error";
};

export type DashboardLeaderboardRow = {
  rank: string;
  initial: string;
  name: string;
  title: string;
  xp: string;
  tone: string;
  rankTone: string;
  badge: string;
  highlight?: boolean;
};

export type ResolvedProgression = {
  currentJabatan: string;
  currentGolongan: string;
  currentBadge: string;
  currentRankXp: number;
  nextRankXp: number;
  progressPercentage: number;
};
