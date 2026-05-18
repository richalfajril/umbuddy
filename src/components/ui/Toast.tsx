'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  AlertTriangle,
  X,
  Trophy,
  Flame,
} from 'lucide-react'
import { useToastStore, Toast as ToastType } from '@/store/useToastStore'

/** Minimal class merger — avoids adding a dependency. */
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

// ─────────────────────────────────────────────────────────────
// Variant config
// Each key maps to a full set of visual tokens for that status.
// Only Tailwind classes are used so tree-shaking stays intact.
// ─────────────────────────────────────────────────────────────
const VARIANT_STYLES = {
  success: {
    /** Light: mint-tinted card  /  Dark: deep emerald card */
    container:
      'bg-emerald-50   border-emerald-400   dark:bg-emerald-950/60 dark:border-emerald-600/50' +
      ' shadow-[0_8px_24px_-4px_rgba(52,211,153,0.18)]  dark:shadow-[0_8px_24px_-4px_rgba(52,211,153,0.12)]',
    /** Solid accent strip on the left edge */
    bar: 'bg-emerald-500 dark:bg-emerald-400',
    /** Circular icon badge */
    icon: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-300/60 dark:ring-emerald-600/40',
    /** Heading — very high contrast on tinted bg */
    title: 'text-emerald-900 dark:text-emerald-50',
    /** Body copy — slightly lighter than heading */
    message: 'text-emerald-800 dark:text-emerald-200',
    /** Dismiss button — inherits accent colour family */
    close:
      'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200/60 dark:hover:bg-emerald-800/50',
    /** Timeout progress bar at the bottom */
    progress: 'bg-emerald-500 dark:bg-emerald-400',
  },

  error: {
    container:
      'bg-rose-50   border-rose-400   dark:bg-rose-950/60 dark:border-rose-600/50' +
      ' shadow-[0_8px_24px_-4px_rgba(251,113,133,0.18)]  dark:shadow-[0_8px_24px_-4px_rgba(251,113,133,0.12)]',
    bar: 'bg-rose-500 dark:bg-rose-400',
    icon: 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 ring-1 ring-rose-300/60 dark:ring-rose-600/40',
    title: 'text-rose-900 dark:text-rose-50',
    message: 'text-rose-800 dark:text-rose-200',
    close:
      'text-rose-600 dark:text-rose-400 hover:bg-rose-200/60 dark:hover:bg-rose-800/50',
    progress: 'bg-rose-500 dark:bg-rose-400',
  },

  warning: {
    container:
      'bg-amber-50   border-amber-400   dark:bg-amber-950/60 dark:border-amber-600/50' +
      ' shadow-[0_8px_24px_-4px_rgba(251,191,36,0.18)]   dark:shadow-[0_8px_24px_-4px_rgba(251,191,36,0.12)]',
    bar: 'bg-amber-500 dark:bg-amber-400',
    icon: 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 ring-1 ring-amber-300/60 dark:ring-amber-600/40',
    title: 'text-amber-900 dark:text-amber-50',
    message: 'text-amber-800 dark:text-amber-200',
    close:
      'text-amber-600 dark:text-amber-400 hover:bg-amber-200/60 dark:hover:bg-amber-800/50',
    progress: 'bg-amber-500 dark:bg-amber-400',
  },

  info: {
    container:
      'bg-sky-50   border-sky-400   dark:bg-sky-950/60 dark:border-sky-600/50' +
      ' shadow-[0_8px_24px_-4px_rgba(56,189,248,0.18)]   dark:shadow-[0_8px_24px_-4px_rgba(56,189,248,0.12)]',
    bar: 'bg-sky-500 dark:bg-sky-400',
    icon: 'bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-300 ring-1 ring-sky-300/60 dark:ring-sky-600/40',
    title: 'text-sky-900 dark:text-sky-50',
    message: 'text-sky-800 dark:text-sky-200',
    close:
      'text-sky-600 dark:text-sky-400 hover:bg-sky-200/60 dark:hover:bg-sky-800/50',
    progress: 'bg-sky-500 dark:bg-sky-400',
  },
} as const

/** Maps each toast type to the icon component to render. */
const TYPE_ICON = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Sparkles,
} as const

// ─────────────────────────────────────────────────────────────
// ToastItem — single notification card
// ─────────────────────────────────────────────────────────────
interface ToastItemProps {
  toast: ToastType
  onClose: (id: string) => void
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const v = VARIANT_STYLES[toast.type] ?? VARIANT_STYLES.info
  const IconComponent = toast.xpReward ? Trophy : TYPE_ICON[toast.type]

  return (
    <motion.li
      layout
      role="alert"
      aria-live="assertive"
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0,  scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className={cn(
        // Layout & shape
        'relative flex w-[min(22rem,_calc(100vw-2rem))] items-start gap-3',
        'overflow-hidden rounded-2xl border p-4 pl-5',
        'pointer-events-auto select-none',
        // Visual
        v.container,
      )}
    >
      {/* ── Left accent strip ── */}
      <div
        className={cn('absolute inset-y-0 left-0 w-1 rounded-l-2xl', v.bar)}
        aria-hidden
      />

      {/* ── Icon badge ── */}
      <div
        className={cn(
          'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
          v.icon,
        )}
      >
        <IconComponent
          className={cn('h-5 w-5', !!toast.xpReward && 'animate-pulse')}
          aria-hidden
        />
      </div>

      {/* ── Text content ── */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {toast.title && (
          <p className={cn('text-sm font-extrabold leading-tight tracking-wide', v.title)}>
            {toast.title}
          </p>
        )}
        <p className={cn('text-sm font-medium leading-snug', v.message)}>
          {toast.message}
        </p>

        {/* XP reward badge — only shown when xpReward is set */}
        {toast.xpReward && (
          <span className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-full border border-amber-400/50 bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-700 dark:border-amber-500/40 dark:bg-amber-950/50 dark:text-amber-300">
            <Flame className="h-3 w-3 fill-current" aria-hidden />
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
          'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
          'transition-colors duration-150',
          v.close,
        )}
      >
        <X className="h-4 w-4" aria-hidden />
      </button>

      {/* ── Auto-dismiss progress bar ── */}
      <motion.div
        aria-hidden
        className={cn('absolute bottom-0 left-0 h-[3px]', v.progress)}
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

// ─────────────────────────────────────────────────────────────
// ToastContainer — fixed stack, rendered once in providers.tsx
// ─────────────────────────────────────────────────────────────
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <ol
      aria-label="Notifikasi"
      className={cn(
        'fixed right-4 top-4 z-50 flex flex-col-reverse gap-2.5',
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
