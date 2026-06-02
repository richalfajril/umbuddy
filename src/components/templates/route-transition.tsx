import * as React from 'react'
import { ViewTransition } from 'react'

type RouteTransitionProps = {
  children: React.ReactNode
}

// Membungkus konten route app utama agar perpindahan dashboard/practice terasa halus.
export function RouteTransition({ children }: RouteTransitionProps) {
  return (
    <ViewTransition
      enter={{ 'app-nav': 'fade-in', default: 'none' }}
      exit={{ 'app-nav': 'fade-out', default: 'none' }}
      default="none"
    >
      {children}
    </ViewTransition>
  )
}
