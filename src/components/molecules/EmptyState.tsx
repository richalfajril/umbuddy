import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { MascotState } from './MascotState'

interface EmptyStateProps {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  icon?: LucideIcon
  mascot?: 'empty' | 'encouraging' | 'detective' | 'sleeping'
  className?: string
}

/**
 * EmptyState memakai bahasa ramah sesuai UI_UX.md, bukan pesan kosong yang kaku.
 */
export function EmptyState({
  title,
  description,
  action,
  icon: Icon,
  mascot = 'empty',
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={[
        'empty-state card-static rounded-2xl border-2 border-dashed border-border bg-surface/70 p-6 dark:bg-surface/70',
        className,
      ].join(' ')}
    >
      {Icon ? (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary-dark dark:bg-primary/10 dark:text-primary">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      ) : null}

      <MascotState
        variant={mascot}
        size="sm"
        title={title}
        description={description}
        action={action}
        className="sm:flex-col sm:text-center"
      />
    </div>
  )
}
