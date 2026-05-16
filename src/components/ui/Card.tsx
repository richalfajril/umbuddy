import * as React from 'react'

/**
 * Card — Komponen kartu Umbuddy.
 *
 * Prinsip UI_UX.md: border-first approach.
 * TIDAK menggunakan shadow blur tebal — hanya border + rounded-2xl.
 *
 * Variant:
 * - default : Background putih / dark surface, border abu
 * - surface : Background surface (abu muda) / dark bg, border abu
 * - game    : Seperti default, dengan border primary green (untuk highlight gamification)
 */

type CardVariant = 'default' | 'surface' | 'game'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const variantClasses: Record<CardVariant, string> = {
  default: 'card',
  surface: 'card-surface',
  game: 'bg-white dark:bg-dark-surface border-2 border-primary rounded-2xl',
}

const paddingClasses = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
}

/** Card container dengan border-first design sesuai Umbuddy Design System. */
export function Card({
  variant = 'default',
  padding,
  children,
  className = '',
  ...props
}: CardProps) {
  // Jika padding di-override, hapus padding default dari CSS class
  const baseClass = variant === 'default' ? 'card' : variant === 'surface' ? 'card-surface' : variantClasses.game
  const paddingOverride = padding ? paddingClasses[padding] : ''

  return (
    <div
      className={[baseClass, paddingOverride, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

/** Sub-komponen untuk header kartu */
export function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['mb-3', className].join(' ')} {...props}>
      {children}
    </div>
  )
}

/** Sub-komponen untuk body kartu */
export function CardBody({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

/** Sub-komponen untuk footer kartu */
export function CardFooter({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['mt-4 pt-4 border-t border-border dark:border-dark-border', className].join(' ')} {...props}>
      {children}
    </div>
  )
}
