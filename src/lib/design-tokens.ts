/**
 * Umbuddy Design Tokens — TypeScript Constants
 *
 * Mengapa file ini ada?
 * CSS variables di globals.css sudah menangani styling statis.
 * File ini dibutuhkan untuk:
 * 1. Framer Motion animations (butuh nilai JS, bukan CSS class)
 * 2. Dynamic styling berdasarkan state (misal: warna answer option)
 * 3. Type safety saat memanggil token di komponen
 *
 * Sumber: UI_UX.md — "Clean White & Gamified Green" palette
 */

/* ─── Color Tokens ─── */
export const colors = {
  // Base & Surface
  background: '#FFFFFF',
  surface: '#F3F4F6',
  surfaceHover: '#E9EAEC',
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',

  // Primary Green — hanya untuk CTA & aksi utama
  primary: '#74C332',
  primaryHover: '#65AC2A',
  primaryDark: '#155D27',
  primaryLight: '#E8F5D6',
  primaryForeground: '#FFFFFF',

  // Gamification Accent
  xp: '#FFC300',
  xpLight: '#FFF3CC',
  beige: '#F4CA6A',
  error: '#FF6B6B',
  errorLight: '#FFEDED',
  errorDark: '#CC5555',
  success: '#74C332',
  warning: '#FFC300',

  // Typography
  headline: '#1F2937',
  body: '#4B5563',
  muted: '#9CA3AF',
  placeholder: '#D1D5DB',

  // Dark Mode
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceHover: '#293548',
    border: '#334155',
    headline: '#F8FAFC',
    body: '#CBD5E1',
    muted: '#64748B',
    primary: '#5DA828',
    xp: '#E6B000',
    error: '#E85555',
  },
} as const

/* ─── Answer Option State Colors ─── */
export const answerColors = {
  default: {
    bg: colors.background,
    border: colors.border,
    text: colors.headline,
  },
  selected: {
    bg: colors.primaryLight,
    border: colors.primary,
    text: colors.headline,
  },
  correct: {
    bg: colors.primaryLight,
    border: colors.primary,
    text: colors.primaryDark,
  },
  wrong: {
    bg: colors.errorLight,
    border: colors.error,
    text: colors.errorDark,
  },
} as const

export type AnswerState = keyof typeof answerColors

/* ─── Border Radius ─── */
export const radius = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  full: '9999px',
} as const

/* ─── Animation Durations (ms) ─── */
export const duration = {
  fast: 100,
  normal: 200,
  slow: 350,
  xpFloat: 1000,
  shake: 400,
} as const

/* ─── Framer Motion Variants ─── */
export const motionVariants = {
  /** Fade in dari bawah — untuk card dan halaman baru */
  fadeInUp: {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  },

  /** Slide up — untuk modal dan bottom sheet */
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  },

  /** Shake — untuk jawaban salah */
  shake: {
    animate: {
      x: [0, -6, 6, -4, 4, 0],
      transition: { duration: 0.4, ease: 'easeInOut' },
    },
  },

  /** XP float — +XP text yang terbang ke atas */
  xpFloat: {
    initial: { opacity: 1, y: 0, scale: 1 },
    animate: {
      opacity: [1, 1, 0],
      y: [0, -40, -60],
      scale: [1, 1.1, 0.9],
      transition: { duration: 1, ease: 'easeOut' },
    },
  },

  /** Staggered children — untuk list item yang muncul berurutan */
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.05 },
    },
  },

  staggerItem: {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  },
} as const

/* ─── Mascot Image Mapping ───
 * Sesuai UI_UX.md — 18 pose mascot kentang.
 * Digunakan oleh komponen <MascotState state="greeting" />
 */
export type MascotState =
  | 'greeting'
  | 'encouraging'
  | 'teaching'
  | 'support'
  | 'sorry'
  | 'surprised'
  | 'tired'
  | 'congrats'
  | 'success'
  | 'thankyou'
  | 'crown'
  | 'medal'
  | 'battle'
  | 'workout'
  | 'detective'
  | 'donation'
  | 'empty'
  | 'sleeping'

export const mascotImages: Record<MascotState, string> = {
  greeting:    '/mascot/mascot_greeting.png',
  encouraging: '/mascot/mascot_encouraging.png',
  teaching:    '/mascot/mascot_teaching.png',
  support:     '/mascot/mascot_support.png',
  sorry:       '/mascot/mascot_sorry.png',
  surprised:   '/mascot/mascot_surprised.png',
  tired:       '/mascot/mascot_tired.png',
  congrats:    '/mascot/mascot_congrats.png',
  success:     '/mascot/mascot_success.png',
  thankyou:    '/mascot/mascot_thankyou.png',
  crown:       '/mascot/mascot_crown.png',
  medal:       '/mascot/mascot_medal.png',
  battle:      '/mascot/mascot_battle.png',
  workout:     '/mascot/mascot_workout.png',
  detective:   '/mascot/mascot_detective.png',
  donation:    '/mascot/mascot_donation.png',
  empty:       '/mascot/mascot_empty.png',
  sleeping:    '/mascot/mascot_sleeping.png',
}

/* ─── Logo Image Mapping ───
 * Sesuai UI_UX.md — 4 varian logo.
 */
export const logoImages = {
  /** Hanya ikon kotak hijau — untuk mobile top bar & favicon */
  only:       '/logo/logo_only.png',
  /** Ikon + teks menyamping — untuk desktop sidebar & navbar */
  horizontal: '/logo/logo_horizontal.png',
  /** Ikon di atas teks — untuk splash screen & halaman auth */
  vertical:   '/logo/logo_vertikal.png',
  /** Hanya tulisan "Umbuddy" — untuk hero section & dekorasi */
  text:       '/logo/logo_text.png',
} as const

/* ─── Navigation Items (Bottom Nav & Sidebar) ─── */
export const navItems = [
  { key: 'home',        label: 'Beranda',    href: '/dashboard',    icon: 'House' },
  { key: 'practice',   label: 'Latihan',    href: '/practice',     icon: 'BookOpen' },
  { key: 'battle',     label: 'Battle',     href: '/battle',       icon: 'Swords' },
  { key: 'leaderboard',label: 'Peringkat',  href: '/leaderboard',  icon: 'Trophy' },
  { key: 'profile',    label: 'Profil',     href: '/profile',      icon: 'User' },
] as const

export type NavKey = typeof navItems[number]['key']
