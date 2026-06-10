'use client'

import * as React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { SessionConflictGuard } from '@/features/user-auth/_components/session-conflict-guard'
import { ToastContainer } from '@/components/ui'

// Menekan peringatan script React 19 untuk next-themes di environment development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const origError = console.error
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
      return
    }
    origError.apply(console, args)
  }
}

/**
 * Global client providers wrapper.
 * Menyediakan konteks:
 * - SessionProvider (NextAuth)
 * - ThemeProvider (next-themes)
 * - ToastContainer (Global Toast Notification Stack)
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={30} refetchOnWindowFocus>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <SessionConflictGuard />
        <ToastContainer />
      </ThemeProvider>
    </SessionProvider>
  )
}
