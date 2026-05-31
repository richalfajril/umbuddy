import * as React from 'react'
import { Card } from '@/components/ui'

type FullScreenLoaderProps = {
  message?: string
}

// Render layar loading transisional saat user akan masuk ke alur fitur tertentu.
export function FullScreenLoader({ message = 'Menyiapkan...' }: FullScreenLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card padding="lg" className="w-full max-w-md text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 font-bold text-body">{message}</p>
      </Card>
    </div>
  )
}
