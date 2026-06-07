// Konstanta tampilan dashboard sementara sampai data real-time/social siap.
// Preview teman memberi bentuk UI social sebelum endpoint friend system tersedia.
export const friendsPreview = [
  { name: "Siska Amelia", initial: "S", online: true },
  { name: "Dimas P.", initial: "D", online: true },
  { name: "Arya Wijaya", initial: "A", online: true },
  { name: "Budi S.", initial: "B", online: false },
];

// Preview ranking memberi contoh visual leaderboard sampai snapshot real siap.
export const rankingPreview = [
  {
    rank: "1",
    initial: "R",
    name: "Rani",
    title: "Esmelon III",
    xp: "18.4k XP",
    tone: "bg-xp",
    rankTone: "from-xp to-[#f59e0b]",
    badge: "/badge/esmelon_III_d.png",
  },
  {
    rank: "2",
    initial: "B",
    name: "Bima",
    title: "Umbies Senior",
    xp: "17.9k XP",
    tone: "bg-primary",
    rankTone: "from-slate-200 to-slate-400",
    badge: "/badge/umbies_senior_III_a.png",
  },
  {
    rank: "3",
    initial: "A",
    name: "Alya",
    title: "Umbies I",
    xp: "17.0k XP",
    tone: "bg-error",
    rankTone: "from-[#f4b183] to-[#c07635]",
    badge: "/badge/umbies_I_a.png",
  },
];
