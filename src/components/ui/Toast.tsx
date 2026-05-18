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
        container: 'bg-[#ecfdf5] dark:bg-emerald-950/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-emerald-500/5',
        icon: 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20',
        close: 'hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      }
    case 'error':
      return {
        container: 'bg-[#fff5f5] dark:bg-rose-950/20 border-rose-500 text-rose-800 dark:text-rose-300 shadow-rose-500/5',
        icon: 'text-rose-500 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20',
        close: 'hover:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400',
      }
    case 'warning':
      return {
        container: 'bg-[#fffbeb] dark:bg-amber-950/20 border-amber-500 text-amber-800 dark:text-amber-300 shadow-amber-500/5',
        icon: 'text-amber-500 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20',
        close: 'hover:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400',
      }
    case 'info':
    default:
      return {
        container: 'bg-[#eff6ff] dark:bg-blue-950/20 border-blue-500 text-blue-800 dark:text-blue-300 shadow-blue-500/5',
        icon: 'text-blue-500 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20',
        close: 'hover:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400',
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
        "flex w-full items-start gap-3 rounded-2xl border-2 p-4 shadow-lg pointer-events-auto select-none",
        "relative overflow-hidden group max-w-sm sm:max-w-md",
        styles.container
      )}
    >
      {/* Dynamic Background Game Texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      {/* Main Status Icon */}
      <div className={cn("p-2 rounded-xl shrink-0 flex items-center justify-center", styles.icon)}>
        <IconComponent className={cn("w-5 h-5", toast.xpReward ? "animate-pulse" : "")} />
      </div>

      {/* Message and Title */}
      <div className="flex-1 min-w-0 pr-4 space-y-1">
        {toast.title && (
          <h3 className="font-display font-black text-headline text-sm tracking-wide leading-none">
            {toast.title}
          </h3>
        )}
        <p className="text-xs sm:text-sm font-semibold leading-relaxed">
          {toast.message}
        </p>

        {/* Gamified XP Reward Badge */}
        {toast.xpReward && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-xp/10 dark:bg-xp/20 rounded-xl border border-xp/30 text-xp text-xs font-black animate-bounce mt-2">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>+{toast.xpReward} XP</span>
          </div>
        )}
      </div>

      {/* Manual Dismiss Button */}
      <button
        onClick={() => onClose(toast.id)}
        className={cn(
          "p-1.5 rounded-lg border-2 border-transparent hover:border-border transition-all flex items-center justify-center shrink-0",
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
        className="absolute bottom-0 left-0 h-1 bg-current opacity-20"
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
