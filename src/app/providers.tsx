'use client'

import * as React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

// Suppress the React 19 script warning for next-themes in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const origError = console.error
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
      return
    }
    origError.apply(console, args)
  }
}

import { ToastContainer } from '@/components/ui'

/**
 * Global client providers wrapper.
 * Menyediakan konteks:
 * - SessionProvider (NextAuth)
 * - ThemeProvider (next-themes)
 * - ToastContainer (Global Toast Notification Stack)
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <ToastContainer />
      </ThemeProvider>
    </SessionProvider>
  )
}

