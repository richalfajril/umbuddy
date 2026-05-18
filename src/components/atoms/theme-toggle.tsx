'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

/**
 * ThemeToggle Atom — Tombol melayang di kanan bawah untuk beralih mode gelap/terang.
 * Mengikuti Umbuddy Gamified Design System (3D pressing button effect).
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  const currentTheme = resolvedTheme || theme

  return (
    <button
      onClick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-background border-2 border-border shadow-[0_4px_0_0_var(--color-border)] transition-all hover:translate-y-[2px] hover:shadow-[0_2px_0_0_var(--color-border)] active:translate-y-[4px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group"
      aria-label="Toggle Theme"
    >
      {currentTheme === 'light' ? (
        <Moon className="w-6 h-6 text-headline transition-transform duration-300 group-hover:rotate-12" />
      ) : (
        <Sun className="w-6 h-6 text-xp transition-transform duration-300 group-hover:rotate-90" />
      )}
    </button>
  )
}
