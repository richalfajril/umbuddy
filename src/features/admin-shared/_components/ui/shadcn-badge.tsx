import * as React from 'react'
import { cn } from './shadcn-utils'

type AdminBadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning'

export interface AdminBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: AdminBadgeVariant
}

const variantClasses: Record<AdminBadgeVariant, string> = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-surface text-headline',
  outline: 'border-border text-headline',
  success: 'border-primary/20 bg-primary-light text-primary-dark dark:text-primary',
  warning: 'border-xp/30 bg-xp-light text-headline',
}

// Badge shadcn-style untuk status admin yang ringkas dan tidak chunky.
export function AdminBadge({
  variant = 'default',
  className,
  ...props
}: AdminBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}
