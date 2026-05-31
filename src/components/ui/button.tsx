import * as React from 'react'

/**
 * Button — Chunky 3D gamified button Umbuddy.
 *
 * Variant:
 * - primary   : Hijau CTA, bayangan dark-green, efek "turun" saat klik
 * - secondary : Putih dengan border abu, bayangan ringan
 * - danger    : Merah coral untuk aksi destruktif
 * - ghost     : Transparan, teks hijau, hover background light-green
 *
 * Sesuai UI_UX.md: touch target ≥ 44px wajib di semua variant.
 */

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  loadingLabel?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-2 min-h-[44px]',
  md: 'text-base px-6 py-2.5 min-h-[44px]',
  lg: 'text-lg px-8 py-3 min-h-[52px]',
}

/**
 * Button component dengan chunky 3D style sesuai Umbuddy Design System.
 * Server-renderable karena tidak ada state/event handler bawaan.
 * Tambahkan "use client" di parent jika butuh onClick handler.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingLabel = 'Memproses...',
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}
