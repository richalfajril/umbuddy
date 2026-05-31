import * as React from 'react'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

export interface AppNavItem {
  label: string
  href: string
  icon: LucideIcon
  disabled?: boolean
}

interface BottomNavProps {
  items: AppNavItem[]
  activeHref: string
  className?: string
}

/**
 * BottomNav untuk mobile app shell.
 * Link nonaktif dirender sebagai span agar route yang belum dibangun tidak membawa user ke 404.
 */
export function BottomNav({ items, activeHref, className = '' }: BottomNavProps) {
  return (
    <div
      className={[
        'grid grid-cols-5 gap-1 px-2 py-2 text-[11px] font-black text-muted',
        className,
      ].join(' ')}
    >
      {items.map((item) => {
        const Icon = item.icon
        const isActive = item.href === activeHref
        const classes = [
          'flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-center transition-colors',
          isActive
            ? 'bg-primary-light text-primary-dark dark:bg-primary/15 dark:text-primary'
            : 'text-muted',
          item.disabled
            ? 'cursor-not-allowed opacity-45'
            : 'hover:bg-surface hover:text-headline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        ].join(' ')

        const content = (
          <>
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span className="max-w-full truncate">{item.label}</span>
          </>
        )

        if (item.disabled) {
          return (
            <span key={item.label} className={classes} aria-disabled="true">
              {content}
            </span>
          )
        }

        return (
          <Link key={item.label} href={item.href} className={classes} aria-current={isActive ? 'page' : undefined}>
            {content}
          </Link>
        )
      })}
    </div>
  )
}
