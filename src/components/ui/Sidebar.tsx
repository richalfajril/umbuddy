import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { AppNavItem } from './BottomNav'

interface SidebarProps {
  items: AppNavItem[]
  activeHref: string
  userName?: string | null
  userEmail?: string | null
  footer?: React.ReactNode
  className?: string
}

function getInitial(name?: string | null, email?: string | null) {
  const source = name || email || 'U'
  return source.trim().charAt(0).toUpperCase()
}

/**
 * Sidebar desktop untuk app shell Umbuddy.
 * Dibuat stateless agar bisa dipakai ulang oleh Dashboard, Analytics, dan halaman app lain.
 */
export function Sidebar({
  items,
  activeHref,
  userName,
  userEmail,
  footer,
  className = '',
}: SidebarProps) {
  const initial = getInitial(userName, userEmail)

  return (
    <div className={['flex h-full flex-col gap-6 p-4', className].join(' ')}>
      <Link
        href="/dashboard"
        className="flex min-h-[52px] items-center rounded-2xl px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Ke dashboard Umbuddy"
      >
        <Image
          src="/logo/logo_horizontal.png"
          alt="Umbuddy"
          width={170}
          height={52}
          className="h-10 object-contain"
          style={{ width: 'auto' }}
          priority
        />
      </Link>

      <nav className="grid gap-2" aria-label="Navigasi utama">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = item.href === activeHref
          const classes = [
            'flex min-h-[48px] items-center gap-3 rounded-2xl px-3 text-sm font-black transition-colors',
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
              <span className="truncate">{item.label}</span>
              {item.disabled && (
                <span className="ml-auto rounded-full bg-surface px-2 py-0.5 text-[10px] font-black uppercase text-muted">
                  Segera
                </span>
              )}
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

      <div className="mt-auto space-y-4">
        {footer}

        <div className="card-static rounded-2xl border-2 border-border bg-surface p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-base font-black text-white">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-headline">
                {userName || 'Umbies'}
              </p>
              {userEmail && (
                <p className="truncate text-xs font-bold text-muted">
                  {userEmail}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
