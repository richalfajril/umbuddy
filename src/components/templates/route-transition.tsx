import * as React from 'react'
import { ViewTransition } from 'react'

type RouteTransitionProps = {
  children: React.ReactNode
}

// Membungkus konten route agar semua perpindahan halaman memakai fade standar yang ringan.
export function RouteTransition({ children }: RouteTransitionProps) {
  return (
    <ViewTransition
      enter={{ 'app-nav': 'fade-in', default: 'fade-in' }}
      exit={{ 'app-nav': 'fade-out', default: 'fade-out' }}
      default="none"
    >
      {children}
    </ViewTransition>
  )
}
