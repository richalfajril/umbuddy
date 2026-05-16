'use client'

import * as React from 'react'
import { SessionProvider } from 'next-auth/react'

/**
 * Global client providers wrapper.
 * Menyediakan konteks:
 * - SessionProvider (NextAuth)
 * - Future: QueryClientProvider (React Query), ThemeProvider (if needed)
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
