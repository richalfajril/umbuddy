import type { AppNavItem } from '@/components/organisms'
import { Home, PencilLine, Swords, Trophy, UserRound } from 'lucide-react'

// Navigasi utama user app dipakai lintas dashboard, practice, dan fitur user berikutnya.
export const USER_APP_NAV_ITEMS: AppNavItem[] = [
  { label: 'Home', href: '/dashboard', icon: Home, prefetch: true },
  { label: 'Practice', href: '/practice', icon: PencilLine, prefetch: true },
  { label: 'Battle', href: '/battle', icon: Swords, disabled: true },
  { label: 'Rank', href: '/leaderboard', icon: Trophy, disabled: true },
  { label: 'Profile', href: '/profile', icon: UserRound, disabled: true },
]

// Glow card user app dibuat shared agar dashboard dan practice terasa satu sistem visual.
export const userAppCardGlow =
  'hover:shadow-[0_0_0_4px_rgba(116,195,50,0.18),0_18px_36px_-24px_rgba(116,195,50,0.55)]'

// Rank progression mengikuti badge asset dan ambang XP U14 versi MVP.
export const USER_PROGRESSION_RANKS = [
  {
    golongan: 'I/a',
    requiredXp: 0,
    jabatan: 'Umbies',
    badge: 'umbies_I_a.png',
  },
  {
    golongan: 'I/b',
    requiredXp: 300,
    jabatan: 'Umbies',
    badge: 'umbies_I_b.png',
  },
  {
    golongan: 'I/c',
    requiredXp: 800,
    jabatan: 'Umbies',
    badge: 'umbies_I_c.png',
  },
  {
    golongan: 'I/d',
    requiredXp: 1500,
    jabatan: 'Umbies',
    badge: 'umbies_I_d.png',
  },
  {
    golongan: 'II/a',
    requiredXp: 2500,
    jabatan: 'Umbies Senior',
    badge: 'umbies_senior_II_a.png',
  },
  {
    golongan: 'II/b',
    requiredXp: 4000,
    jabatan: 'Umbies Senior',
    badge: 'umbies_senior_II_b.png',
  },
  {
    golongan: 'II/c',
    requiredXp: 6000,
    jabatan: 'Umbies Senior',
    badge: 'umbies_senior_II_c.png',
  },
  {
    golongan: 'II/d',
    requiredXp: 8500,
    jabatan: 'Umbies Senior',
    badge: 'umbies_senior_II_d.png',
  },
  {
    golongan: 'III/a',
    requiredXp: 12000,
    jabatan: 'Umbies Senior',
    badge: 'umbies_senior_III_a.png',
  },
  {
    golongan: 'III/b',
    requiredXp: 16000,
    jabatan: 'Esmelon IV',
    badge: 'esmelon_III_b.png',
  },
  {
    golongan: 'III/c',
    requiredXp: 21000,
    jabatan: 'Esmelon IV',
    badge: 'esmelon_III_c.png',
  },
  {
    golongan: 'III/d',
    requiredXp: 27000,
    jabatan: 'Esmelon III',
    badge: 'esmelon_III_d.png',
  },
  {
    golongan: 'IV/a',
    requiredXp: 34000,
    jabatan: 'Esmelon III',
    badge: 'esmelon_IV_a.png',
  },
  {
    golongan: 'IV/b',
    requiredXp: 42000,
    jabatan: 'Esmelon II',
    badge: 'esmelon_IV_b.png',
  },
  {
    golongan: 'IV/c',
    requiredXp: 51000,
    jabatan: 'Esmelon II',
    badge: 'esmelon_IV_c.png',
  },
  {
    golongan: 'IV/d',
    requiredXp: 61000,
    jabatan: 'Esmelon I',
    badge: 'esmelon_IV_d.png',
  },
  {
    golongan: 'IV/e',
    requiredXp: 72000,
    jabatan: 'Esmelon I',
    badge: 'esmelon_IV_e.png',
  },
  {
    golongan: 'MAX',
    requiredXp: 85000,
    jabatan: 'Menteri',
    badge: 'menteri.png',
  },
] as const
