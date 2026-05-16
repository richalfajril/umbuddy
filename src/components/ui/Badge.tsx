import * as React from 'react'

/**
 * Badge — Label gamifikasi Umbuddy.
 *
 * Digunakan untuk:
 * - Golongan/jabatan user (Staf Pratama, Kepala Seksi, dll)
 * - Kategori soal (TWK, TIU, TKP)
 * - Status (PUBLISHED, DRAFT, dll)
 * - Difficulty soal (Mudah, Sedang, Sulit)
 *
 * Sesuai UI_UX.md: border-radius pill (rounded-full), font Nunito bold.
 */

type BadgeVariant = 'primary' | 'xp' | 'success' | 'warning' | 'error' | 'neutral' | 'outline'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  icon?: React.ReactNode
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-light border border-primary text-primary-dark',
  xp: 'xp-chip',
  success: 'bg-primary-light border border-primary text-primary-dark',
  warning: 'bg-xp-light border border-xp text-amber-800 dark:text-dark-xp',
  error: 'bg-error-light border border-error text-error-dark',
  neutral: 'bg-surface border border-border text-body dark:bg-dark-surface dark:border-dark-border dark:text-dark-body',
  outline: 'bg-transparent border border-border text-body dark:border-dark-border dark:text-dark-body',
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
}

/** Badge/label gamifikasi dengan pill shape dan warna sesuai design system. */
export function Badge({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}: BadgeProps) {
  // Variant 'xp' sudah punya class lengkap dari globals.css
  if (variant === 'xp') {
    return (
      <span className={['xp-chip', className].join(' ')} {...props}>
        {icon && <span>{icon}</span>}
        {children}
      </span>
    )
  }

  return (
    <span
      className={[
        'inline-flex items-center gap-1 font-display font-bold rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  )
}
