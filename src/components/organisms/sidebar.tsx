import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Settings } from 'lucide-react'

import type { AppNavItem } from '@/components/organisms'

interface SidebarProps {
  items: AppNavItem[]
  activeHref: string
  userName?: string | null
  userEmail?: string | null
  footer?: React.ReactNode
  logoutButton?: React.ReactNode
  className?: string
}

/**
 * Sidebar desktop untuk app shell Umbuddy.
 * Dibuat stateless agar bisa dipakai ulang oleh Dashboard, Analytics, dan halaman app lain.
 */
export function Sidebar({
  items,
  activeHref,
  footer,
  logoutButton,
  className = '',
}: SidebarProps) {
  return (
    <div className={['flex h-full flex-col items-center gap-5 px-3 py-5', className].join(' ')}>
      <Link
        href="/dashboard"
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_4px_0_0_var(--color-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Ke dashboard Umbuddy"
      >
        <Image
          src="/logo/logo_only.png"
          alt="Umbuddy"
          width={42}
          height={42}
          className="h-10 w-10 rounded-xl object-contain"
          priority
        />
      </Link>

      <nav className="mt-5 grid w-full gap-3" aria-label="Navigasi utama">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = item.href === activeHref
          const classes = [
            'flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[12px] font-bold transition-colors',
            isActive
              ? 'bg-primary-light text-primary-dark dark:bg-primary/15 dark:text-primary'
              : 'text-body',
            item.disabled
              ? 'cursor-not-allowed opacity-45'
              : 'hover:bg-surface hover:text-headline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          ].join(' ')

          const content = (
            <>
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
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
      </nav>

      <div className="mt-auto grid w-full gap-3">
        {footer}

        <span
          className="flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-2xl bg-surface text-[11px] font-bold text-body opacity-60"
          aria-disabled="true"
        >
          <Settings className="h-5 w-5" aria-hidden="true" />
          Set
        </span>
        {logoutButton}
      </div>
    </div>
  )
}
