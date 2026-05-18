import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  title?: string
  duration?: number
  xpReward?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const duration = toast.duration ?? 4000

    const newToast: Toast = { ...toast, id, duration }
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }))

    // Automatically remove toast after specified duration
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
