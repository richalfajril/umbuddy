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
  Flame 
} from 'lucide-react'
import { useToastStore, Toast as ToastType } from '@/store/useToastStore'
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

interface ToastItemProps {
  toast: ToastType
  onClose: (id: string) => void
}

const getToastStyles = (type: ToastType['type']) => {
  switch (type) {
    case 'success':
      return {
        container: 'bg-[#f0fdf4] dark:bg-emerald-950/40 border-emerald-500/40 dark:border-emerald-500/30 shadow-[0_10px_30px_-5px_rgba(16,185,129,0.2)]',
        bar: 'bg-emerald-500',
        icon: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20',
        title: 'text-emerald-950 dark:text-emerald-100',
        message: 'text-emerald-800 dark:text-emerald-300',
        close: 'hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200',
      }
    case 'error':
      return {
        container: 'bg-[#fff5f5] dark:bg-rose-950/40 border-rose-500/40 dark:border-rose-500/30 shadow-[0_10px_30px_-5px_rgba(244,63,94,0.2)]',
        bar: 'bg-rose-500',
        icon: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/20',
        title: 'text-rose-950 dark:text-rose-100',
        message: 'text-rose-800 dark:text-rose-300',
        close: 'hover:bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-200',
      }
    case 'warning':
      return {
        container: 'bg-[#fffbeb] dark:bg-amber-950/40 border-amber-500/40 dark:border-amber-500/30 shadow-[0_10px_30px_-5px_rgba(245,158,11,0.2)]',
        bar: 'bg-amber-500',
        icon: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/20',
        title: 'text-amber-950 dark:text-amber-100',
        message: 'text-amber-800 dark:text-amber-300',
        close: 'hover:bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200',
      }
    case 'info':
    default:
      return {
        container: 'bg-[#f0f9ff] dark:bg-blue-950/40 border-blue-500/40 dark:border-blue-500/30 shadow-[0_10px_30px_-5px_rgba(59,130,246,0.2)]',
        bar: 'bg-blue-500',
        icon: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/20',
        title: 'text-blue-950 dark:text-blue-100',
        message: 'text-blue-800 dark:text-blue-300',
        close: 'hover:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200',
      }
  }
}
const TOAST_ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Sparkles,
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const styles = getToastStyles(toast.type)
  const IconComponent = toast.xpReward ? Trophy : (TOAST_ICONS[toast.type] || Sparkles)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border-2 p-4 pl-6 shadow-xl pointer-events-auto select-none",
        "relative overflow-hidden group max-w-sm sm:max-w-md backdrop-blur-md",
        styles.container
      )}
    >
      {/* Dynamic Left Accent Bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", styles.bar)} />

      {/* Dynamic Background Game Texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      {/* Main Status Icon */}
      <div className={cn("p-2 rounded-xl shrink-0 flex items-center justify-center border-2", styles.icon)}>
        <IconComponent className={cn("w-5 h-5", toast.xpReward ? "animate-pulse" : "")} />
      </div>

      {/* Message and Title */}
      <div className="flex-1 min-w-0 pr-2 space-y-1 relative z-10">
        {toast.title && (
          <h3 className={cn("font-display font-black text-sm tracking-wider leading-none uppercase", styles.title)}>
            {toast.title}
          </h3>
        )}
        <p className={cn("text-xs sm:text-sm font-bold leading-relaxed", styles.message)}>
          {toast.message}
        </p>

        {/* Gamified XP Reward Badge */}
        {toast.xpReward && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-xp/10 dark:bg-xp/20 rounded-xl border-2 border-xp/40 text-xp text-xs font-black shadow-[0_0_15px_rgba(251,191,36,0.15)] animate-pulse mt-2">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>+{toast.xpReward} XP REWARD</span>
          </div>
        )}
      </div>

      {/* Manual Dismiss Button */}
      <button
        onClick={() => onClose(toast.id)}
        className={cn(
          "p-1.5 rounded-lg border-2 border-transparent hover:border-border/30 hover:bg-surface transition-all flex items-center justify-center shrink-0",
          styles.close
        )}
        aria-label="Dismiss Toast"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Automatic Timeout Progress Line */}
      <motion.div 
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: (toast.duration ?? 4000) / 1000, ease: 'linear' }}
        className={cn("absolute bottom-0 left-0 h-1 opacity-40", styles.bar)}
      />
    </motion.div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div 
      className="fixed top-4 right-4 z-50 flex w-full flex-col-reverse items-center gap-3 px-4 pointer-events-none sm:top-6 sm:right-6 sm:w-auto sm:items-end"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
