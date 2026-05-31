import type { AppNavItem } from "@/components/ui";
import { Home, PencilLine, Swords, Trophy, UserRound } from "lucide-react";

// Konstanta tampilan dashboard sementara sampai data real-time/social siap.
export const DASHBOARD_NAV_ITEMS: AppNavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Practice", href: "/practice", icon: PencilLine, disabled: true },
  { label: "Battle", href: "/battle", icon: Swords, disabled: true },
  { label: "Rank", href: "/leaderboard", icon: Trophy, disabled: true },
  { label: "Profile", href: "/profile", icon: UserRound, disabled: true },
];

export const friendsPreview = [
  { name: "Siska Amelia", initial: "S", online: true },
  { name: "Dimas P.", initial: "D", online: true },
  { name: "Arya Wijaya", initial: "A", online: true },
  { name: "Budi S.", initial: "B", online: false },
];

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

export const dashboardCardGlow =
  "hover:shadow-[0_0_0_4px_rgba(116,195,50,0.18),0_18px_36px_-24px_rgba(116,195,50,0.55)]";

export const progressionRanks = [
  {
    golongan: "I/a",
    requiredXp: 0,
    jabatan: "Umbies",
    badge: "umbies_I_a.png",
  },
  {
    golongan: "I/b",
    requiredXp: 300,
    jabatan: "Umbies",
    badge: "umbies_I_b.png",
  },
  {
    golongan: "I/c",
    requiredXp: 800,
    jabatan: "Umbies",
    badge: "umbies_I_c.png",
  },
  {
    golongan: "I/d",
    requiredXp: 1500,
    jabatan: "Umbies",
    badge: "umbies_I_d.png",
  },
  {
    golongan: "II/a",
    requiredXp: 2500,
    jabatan: "Umbies Senior",
    badge: "umbies_senior_II_a.png",
  },
  {
    golongan: "II/b",
    requiredXp: 4000,
    jabatan: "Umbies Senior",
    badge: "umbies_senior_II_b.png",
  },
  {
    golongan: "II/c",
    requiredXp: 6000,
    jabatan: "Umbies Senior",
    badge: "umbies_senior_II_c.png",
  },
  {
    golongan: "II/d",
    requiredXp: 8500,
    jabatan: "Umbies Senior",
    badge: "umbies_senior_II_d.png",
  },
  {
    golongan: "III/a",
    requiredXp: 12000,
    jabatan: "Umbies Senior",
    badge: "umbies_senior_III_a.png",
  },
  {
    golongan: "III/b",
    requiredXp: 16000,
    jabatan: "Esmelon IV",
    badge: "esmelon_III_b.png",
  },
  {
    golongan: "III/c",
    requiredXp: 21000,
    jabatan: "Esmelon IV",
    badge: "esmelon_III_c.png",
  },
  {
    golongan: "III/d",
    requiredXp: 27000,
    jabatan: "Esmelon III",
    badge: "esmelon_III_d.png",
  },
  {
    golongan: "IV/a",
    requiredXp: 34000,
    jabatan: "Esmelon III",
    badge: "esmelon_IV_a.png",
  },
  {
    golongan: "IV/b",
    requiredXp: 42000,
    jabatan: "Esmelon II",
    badge: "esmelon_IV_b.png",
  },
  {
    golongan: "IV/c",
    requiredXp: 51000,
    jabatan: "Esmelon II",
    badge: "esmelon_IV_c.png",
  },
  {
    golongan: "IV/d",
    requiredXp: 61000,
    jabatan: "Esmelon I",
    badge: "esmelon_IV_d.png",
  },
  {
    golongan: "IV/e",
    requiredXp: 72000,
    jabatan: "Esmelon I",
    badge: "esmelon_IV_e.png",
  },
  {
    golongan: "MAX",
    requiredXp: 85000,
    jabatan: "Menteri",
    badge: "menteri.png",
  },
] as const;
