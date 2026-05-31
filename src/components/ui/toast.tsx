'use client'

/**
 * Toast.tsx — Umbuddy Gamified Notification System
 *
 * Design principles:
 * - "Chunky" 3D card feel consistent with Umbuddy button style
 * - Every variant has its own full colour system (bg / border / icon / text)
 * - Works correctly in both light mode and dark mode
 * - Semantic HTML + ARIA so screen readers announce alerts
 * - Zero external dependencies beyond framer-motion and lucide-react
 *
 * Variants:
 *   Semantic  → success | error | warning | info
 *   Gamified  → xp | achievement | levelup | streak
 */

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Zap,
  Trophy,
  TrendingUp,
  Flame,
  Star,
  X,
} from 'lucide-react'
import { useToastStore, Toast as ToastType } from '@/stores/useToastStore'

// ─────────────────────────────────────────────────────────────────────────────
// cn — tiny class merger, no dependency needed
// ─────────────────────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT MAP
// Each variant defines:
//   wrapper   → outer card shell (bg, border, box-shadow, bottom-bar colour)
//   iconWrap  → icon badge background + ring
//   iconColor → icon SVG colour
//   title     → heading text colour
//   body      → message text colour
//   dismiss   → dismiss button hover state
//   progress  → timeout bar colour
//   glow      → decorative glow layer behind the card
// ─────────────────────────────────────────────────────────────────────────────
const V = {
  // ── Semantic ──────────────────────────────────────────────────────────────

  /** ✅ Success — Umbuddy Primary Green */
  success: {
    wrapper: [
      'border-[#65AC2A] dark:border-[#74C332]/60',
      'bg-[#E8F5D6]      dark:bg-[#0f1f08]/80',
      'shadow-[0_6px_0_0_#155D27]  dark:shadow-[0_6px_0_0_#1a3d0a]',
    ].join(' '),
    glow: 'bg-[#74C332]/10',
    iconWrap: 'bg-[#74C332]/20 ring-2 ring-[#74C332]/30 dark:bg-[#74C332]/15 dark:ring-[#74C332]/20',
    iconColor: 'text-[#155D27] dark:text-[#74C332]',
    title: 'text-[#155D27] dark:text-[#a8e05a]',
    body: 'text-[#1e4d10] dark:text-[#7ec940]',
    dismiss: 'text-[#74C332] hover:bg-[#74C332]/15 dark:text-[#74C332] dark:hover:bg-[#74C332]/10',
    progress: 'bg-[#74C332]',
    Icon: CheckCircle2,
  },

  /** ❌ Error — Soft Coral Red */
  error: {
    wrapper: [
      'border-[#CC5555] dark:border-[#FF6B6B]/50',
      'bg-[#FFEDED]      dark:bg-[#1f0808]/80',
      'shadow-[0_6px_0_0_#9B3B3B]  dark:shadow-[0_6px_0_0_#3d1010]',
    ].join(' '),
    glow: 'bg-[#FF6B6B]/10',
    iconWrap: 'bg-[#FF6B6B]/20 ring-2 ring-[#FF6B6B]/30 dark:bg-[#FF6B6B]/15 dark:ring-[#FF6B6B]/20',
    iconColor: 'text-[#CC5555] dark:text-[#FF6B6B]',
    title: 'text-[#8B2020] dark:text-[#ff9999]',
    body: 'text-[#7a2020] dark:text-[#ff8080]',
    dismiss: 'text-[#FF6B6B] hover:bg-[#FF6B6B]/15 dark:text-[#FF6B6B] dark:hover:bg-[#FF6B6B]/10',
    progress: 'bg-[#FF6B6B]',
    Icon: XCircle,
  },

  /** ⚠️ Warning — Warm Amber */
  warning: {
    wrapper: [
      'border-amber-500 dark:border-amber-400/60',
      'bg-amber-50       dark:bg-amber-950/70',
      'shadow-[0_6px_0_0_theme(colors.amber.700)] dark:shadow-[0_6px_0_0_theme(colors.amber.900)]',
    ].join(' '),
    glow: 'bg-amber-400/10',
    iconWrap: 'bg-amber-200 ring-2 ring-amber-400/40 dark:bg-amber-900/50 dark:ring-amber-500/30',
    iconColor: 'text-amber-700 dark:text-amber-300',
    title: 'text-amber-900 dark:text-amber-100',
    body: 'text-amber-800 dark:text-amber-200',
    dismiss: 'text-amber-600 hover:bg-amber-200/60 dark:text-amber-400 dark:hover:bg-amber-800/40',
    progress: 'bg-amber-500',
    Icon: AlertTriangle,
  },

  /** ℹ️ Info — Calm Sky Blue */
  info: {
    wrapper: [
      'border-sky-400 dark:border-sky-500/60',
      'bg-sky-50       dark:bg-sky-950/70',
      'shadow-[0_6px_0_0_theme(colors.sky.600)] dark:shadow-[0_6px_0_0_theme(colors.sky.900)]',
    ].join(' '),
    glow: 'bg-sky-400/10',
    iconWrap: 'bg-sky-100 ring-2 ring-sky-300/50 dark:bg-sky-900/50 dark:ring-sky-500/30',
    iconColor: 'text-sky-600 dark:text-sky-300',
    title: 'text-sky-900 dark:text-sky-100',
    body: 'text-sky-800 dark:text-sky-200',
    dismiss: 'text-sky-500 hover:bg-sky-200/60 dark:text-sky-400 dark:hover:bg-sky-800/40',
    progress: 'bg-sky-500',
    Icon: Info,
  },

  // ── Gamified ──────────────────────────────────────────────────────────────

  /** ⚡ XP — Electric Yellow-Green (XP gained) */
  xp: {
    wrapper: [
      'border-[#FFC300] dark:border-[#E6B000]/70',
      'bg-[#FFF3CC]      dark:bg-[#1c1500]/80',
      'shadow-[0_6px_0_0_#B38900]  dark:shadow-[0_6px_0_0_#3a2c00]',
    ].join(' '),
    glow: 'bg-[#FFC300]/15',
    iconWrap: 'bg-[#FFC300]/25 ring-2 ring-[#FFC300]/50 dark:bg-[#FFC300]/15 dark:ring-[#E6B000]/30',
    iconColor: 'text-[#B38900] dark:text-[#FFC300]',
    title: 'text-[#6B4F00] dark:text-[#FFD54F]',
    body: 'text-[#5a4200] dark:text-[#FFD000]',
    dismiss: 'text-[#FFC300] hover:bg-[#FFC300]/15 dark:text-[#FFC300] dark:hover:bg-[#FFC300]/10',
    progress: 'bg-[#FFC300]',
    Icon: Zap,
  },

  /** 🏆 Achievement — Gold Trophy */
  achievement: {
    wrapper: [
      'border-yellow-500 dark:border-yellow-400/70',
      'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/70 dark:to-amber-950/60',
      'shadow-[0_6px_0_0_theme(colors.yellow.600)] dark:shadow-[0_6px_0_0_theme(colors.yellow.900)]',
    ].join(' '),
    glow: 'bg-yellow-300/15',
    iconWrap: 'bg-yellow-200 ring-2 ring-yellow-400/50 dark:bg-yellow-900/50 dark:ring-yellow-500/40',
    iconColor: 'text-yellow-600 dark:text-yellow-300',
    title: 'text-yellow-900 dark:text-yellow-100',
    body: 'text-yellow-800 dark:text-yellow-200',
    dismiss: 'text-yellow-600 hover:bg-yellow-200/60 dark:text-yellow-400 dark:hover:bg-yellow-800/40',
    progress: 'bg-gradient-to-r from-yellow-400 to-amber-400',
    Icon: Trophy,
  },

  /** 🚀 Level Up — Vibrant Purple Gradient */
  levelup: {
    wrapper: [
      'border-violet-500 dark:border-violet-400/70',
      'bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/70 dark:to-purple-950/60',
      'shadow-[0_6px_0_0_theme(colors.violet.700)] dark:shadow-[0_6px_0_0_theme(colors.violet.900)]',
    ].join(' '),
    glow: 'bg-violet-400/15',
    iconWrap: 'bg-violet-100 ring-2 ring-violet-400/50 dark:bg-violet-900/50 dark:ring-violet-500/40',
    iconColor: 'text-violet-600 dark:text-violet-300',
    title: 'text-violet-900 dark:text-violet-100',
    body: 'text-violet-800 dark:text-violet-200',
    dismiss: 'text-violet-500 hover:bg-violet-200/60 dark:text-violet-400 dark:hover:bg-violet-800/40',
    progress: 'bg-gradient-to-r from-violet-500 to-purple-500',
    Icon: TrendingUp,
  },

  /** 🔥 Streak — Hot Coral-Orange */
  streak: {
    wrapper: [
      'border-orange-500 dark:border-orange-400/70',
      'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/70 dark:to-red-950/60',
      'shadow-[0_6px_0_0_theme(colors.orange.700)] dark:shadow-[0_6px_0_0_theme(colors.orange.900)]',
    ].join(' '),
    glow: 'bg-orange-400/15',
    iconWrap: 'bg-orange-100 ring-2 ring-orange-400/50 dark:bg-orange-900/50 dark:ring-orange-500/40',
    iconColor: 'text-orange-600 dark:text-orange-300',
    title: 'text-orange-900 dark:text-orange-100',
    body: 'text-orange-800 dark:text-orange-200',
    dismiss: 'text-orange-500 hover:bg-orange-200/60 dark:text-orange-400 dark:hover:bg-orange-800/40',
    progress: 'bg-gradient-to-r from-orange-500 to-red-500',
    Icon: Flame,
  },
} as const

type VariantKey = keyof typeof V

// ─────────────────────────────────────────────────────────────────────────────
// ToastItem — single notification card
// ─────────────────────────────────────────────────────────────────────────────
interface ToastItemProps {
  toast: ToastType
  onClose: (id: string) => void
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const v = V[(toast.type as VariantKey)] ?? V.info
  const { Icon } = v

  // Achievement-class toasts use a slightly longer auto-pulse on the icon
  const isGamified = ['xp', 'achievement', 'levelup', 'streak'].includes(toast.type)

  return (
    <motion.li
      layout
      role="alert"
      aria-live="assertive"
      initial={{ opacity: 0, x: 56, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 56, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        // Shape & layout
        'relative flex w-[min(20rem,_calc(100vw-2rem))] items-start gap-3',
        'overflow-hidden rounded-2xl border-2 p-4',
        'pointer-events-auto select-none',
        // 3D chunky feel
        'active:translate-y-[3px] active:shadow-none',
        'transition-[box-shadow,transform] duration-100',
        v.wrapper,
      )}
    >
      {/* ── Decorative glow layer (gamified variants feel more vibrant) ── */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 opacity-60',
          v.glow,
        )}
      />

      {/* ── Icon badge ── */}
      <div
        aria-hidden
        className={cn(
          'relative z-10 mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          v.iconWrap,
        )}
      >
        <Icon
          className={cn(
            'h-5 w-5',
            v.iconColor,
            isGamified && 'drop-shadow-[0_0_6px_currentColor]',
          )}
          aria-hidden
        />
        {/* Subtle ping for gamified toasts */}
        {isGamified && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-xl animate-ping opacity-20 bg-current"
          />
        )}
      </div>

      {/* ── Text content ── */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-1">
        {toast.title && (
          <p
            className={cn(
              'text-sm font-extrabold leading-tight tracking-wide',
              v.title,
            )}
          >
            {toast.title}
          </p>
        )}
        <p className={cn('text-xs font-semibold leading-snug', v.body)}>
          {toast.message}
        </p>

        {/* XP reward pill */}
        {toast.xpReward && (
          <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full border border-[#FFC300]/50 bg-[#FFF3CC] px-2.5 py-0.5 text-xs font-black text-[#7a5a00] dark:border-[#E6B000]/40 dark:bg-[#1c1500]/70 dark:text-[#FFD54F]">
            <Star className="h-3 w-3 fill-current" aria-hidden />
            +{toast.xpReward} XP
          </span>
        )}
      </div>

      {/* ── Dismiss button ── */}
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        aria-label="Tutup notifikasi"
        className={cn(
          'relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
          'transition-colors duration-150',
          v.dismiss,
        )}
      >
        <X className="h-4 w-4" aria-hidden />
      </button>

      {/* ── Auto-dismiss progress bar ── */}
      <motion.div
        aria-hidden
        className={cn('absolute bottom-0 left-0 h-[3px] rounded-full', v.progress)}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{
          duration: (toast.duration ?? 4000) / 1000,
          ease: 'linear',
        }}
      />
    </motion.li>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ToastContainer — fixed stack, mounted once in providers.tsx
// ─────────────────────────────────────────────────────────────────────────────
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <ol
      aria-label="Notifikasi"
      className={cn(
        'fixed right-4 top-4 z-50',
        'flex flex-col-reverse gap-3',
        'w-auto items-end',
        'pointer-events-none',
        'sm:right-6 sm:top-6',
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </ol>
  )
}
