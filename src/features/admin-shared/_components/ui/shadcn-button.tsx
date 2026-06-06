import * as React from 'react'
import { cn } from './shadcn-utils'

type AdminButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type AdminButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AdminButtonVariant
  size?: AdminButtonSize
  asChild?: false
}

const variantClasses: Record<AdminButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover',
  secondary: 'bg-surface text-headline hover:bg-surface-hover',
  outline: 'border border-border bg-background text-headline shadow-sm hover:bg-surface',
  ghost: 'text-headline hover:bg-surface',
  destructive: 'bg-error text-white shadow-sm hover:bg-error-dark',
}

const sizeClasses: Record<AdminButtonSize, string> = {
  sm: 'h-9 rounded-md px-3 text-xs',
  md: 'h-10 rounded-md px-4 text-sm',
  lg: 'h-11 rounded-md px-5 text-sm',
  icon: 'h-10 w-10 rounded-md p-0',
}

// Class builder dipakai juga oleh Link yang ingin tampil seperti button tanpa nested interactive element.
export function adminButtonClassName({
  variant = 'default',
  size = 'md',
  className,
}: {
  variant?: AdminButtonVariant
  size?: AdminButtonSize
  className?: string
}) {
  return cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className
  )
}

// Button shadcn-style untuk backoffice: datar, padat, dan tidak memakai efek chunky user app.
export function AdminButton({
  variant = 'default',
  size = 'md',
  className,
  type = 'button',
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      className={adminButtonClassName({ variant, size, className })}
      {...props}
    />
  )
}
