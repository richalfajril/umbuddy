import { create } from 'zustand'

/**
 * ToastType — semua variant notifikasi Umbuddy V1.
 *
 * Variant semantic standar:
 * - success     → Aksi berhasil (submit soal, simpan profil)
 * - error       → Terjadi kesalahan (gagal login, server error)
 * - warning     → Peringatan non-fatal (waktu hampir habis)
 * - info        → Notifikasi umum / sistem
 *
 * Variant gamifikasi:
 * - xp          → Perolehan XP (jawaban benar, streak)
 * - achievement → Pencapaian baru dibuka (badge, milestone)
 * - levelup     → Naik golongan / rank
 * - streak      → Streak belajar (Daily login, 7-day streak)
 */
export type ToastType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'xp'
  | 'achievement'
  | 'levelup'
  | 'streak'

export interface Toast {
  id: string
  message: string
  type: ToastType
  /** Optional heading shown above the message */
  title?: string
  /** Auto-dismiss duration in ms. Default: 4000ms */
  duration?: number
  /** XP amount — renders a glowing XP badge when set */
  xpReward?: number
}

interface ToastStore {
  toasts: Toast[]
  /** Add a toast and return its generated id */
  addToast: (toast: Omit<Toast, 'id'>) => string
  /** Manually remove a toast by id */
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const duration = toast.duration ?? 4000

    set((state) => ({
      toasts: [...state.toasts, { ...toast, id, duration }],
    }))

    // Auto-dismiss after duration
    setTimeout(() => {
      get().removeToast(id)
    }, duration)

    return id
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
}))
