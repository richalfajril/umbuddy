'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

/**
 * ThemeToggle Atom — Tombol melayang di kanan bawah untuk beralih mode gelap/terang.
 * Mengikuti Umbuddy Gamified Design System (3D pressing button effect).
 */
interface ThemeToggleProps {
  variant?: 'floating' | 'inline'
}

export function ThemeToggle({ variant = 'floating' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const transitionTimeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)

    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  if (!mounted) return null

  const currentTheme = resolvedTheme || theme
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light'

  const handleThemeChange = () => {
    const root = document.documentElement
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!prefersReducedMotion) {
      root.classList.remove('theme-to-dark', 'theme-to-light')
      root.classList.add(nextTheme === 'dark' ? 'theme-to-dark' : 'theme-to-light')

      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current)
      }

      transitionTimeoutRef.current = window.setTimeout(() => {
        root.classList.remove('theme-to-dark', 'theme-to-light')
        transitionTimeoutRef.current = null
      }, 680)
    }

    root.classList.remove('light', 'dark')
    root.classList.add(nextTheme)
    root.style.colorScheme = nextTheme
    setTheme(nextTheme)
  }

  return (
    <button
      onClick={handleThemeChange}
      className={[
        variant === 'floating' ? 'fixed bottom-6 right-6 z-50 h-14 w-14' : 'h-11 w-11',
        'flex items-center justify-center rounded-full bg-background border-2 border-border shadow-[0_4px_0_0_var(--color-border)] transition-all hover:translate-y-[2px] hover:shadow-[0_2px_0_0_var(--color-border)] active:translate-y-[4px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group',
      ].join(' ')}
      aria-label={`Ubah ke mode ${nextTheme === 'dark' ? 'gelap' : 'terang'}`}
    >
      {currentTheme === 'light' ? (
        <Moon className="w-6 h-6 text-headline transition-transform duration-300 group-hover:rotate-12" />
      ) : (
        <Sun className="w-6 h-6 text-xp transition-transform duration-300 group-hover:rotate-90" />
      )}
    </button>
  )
}
