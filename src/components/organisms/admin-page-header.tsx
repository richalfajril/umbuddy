import * as React from 'react'

export interface AdminPageHeaderProps {
  icon?: React.ReactNode
  eyebrow: string
  title: React.ReactNode
  description: string
  actions?: React.ReactNode
}

/**
 * A standardized reusable header card for all Admin Pages.
 * Ensures consistent 3-layer typography (Eyebrow, Title, Subtitle) and styling.
 */
export function AdminPageHeader({
  icon,
  eyebrow,
  title,
  description,
  actions
}: AdminPageHeaderProps) {
  return (
    <div className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-7 dark:bg-surface">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4 sm:items-center">
          {icon && (
            <div className="mt-1 grid min-h-12 min-w-12 shrink-0 place-items-center rounded-2xl border border-border bg-background text-muted sm:mt-0">
              {icon}
            </div>
          )}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              {eyebrow}
            </p>
            <h1 className="mt-2 flex items-center gap-3 font-display text-3xl font-black leading-tight sm:text-4xl text-headline">
              {title}
            </h1>
            <p className="mt-2 text-sm font-medium text-muted">
              {description}
            </p>
          </div>
        </div>
        
        {actions && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
