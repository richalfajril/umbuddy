// Tipe data siap-render untuk user dashboard feature.
// DashboardScore adalah bentuk minimal semua metrik berbasis persentase.
export type DashboardScore = {
  label: string;
  percent: number;
};

// DashboardAnalyticsItem menambahkan tone visual untuk chart kecil.
export type DashboardAnalyticsItem = DashboardScore & {
  tone: "primary" | "xp" | "error";
};

// DashboardLeaderboardRow adalah row leaderboard yang sudah siap ditampilkan.
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

// ResolvedProgression adalah hasil mapping XP ke visual top bar.
export type ResolvedProgression = {
  currentJabatan: string;
  currentGolongan: string;
  currentBadge: string;
  currentRankXp: number;
  nextRankXp: number;
  progressPercentage: number;
};
