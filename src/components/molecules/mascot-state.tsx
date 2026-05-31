import * as React from 'react'
import Image from 'next/image'

type MascotStateVariant =
  | 'greeting'
  | 'empty'
  | 'success'
  | 'teaching'
  | 'encouraging'
  | 'detective'
  | 'sleeping'

type MascotStateSize = 'sm' | 'md' | 'lg'

interface MascotStateProps {
  variant?: MascotStateVariant
  size?: MascotStateSize
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

const mascotByVariant: Record<MascotStateVariant, string> = {
  greeting: '/mascot/mascot_greeting.png',
  empty: '/mascot/mascot_empty.png',
  success: '/mascot/mascot_success.png',
  teaching: '/mascot/mascot_teaching.png',
  encouraging: '/mascot/mascot_encouraging.png',
  detective: '/mascot/mascot_detective.png',
  sleeping: '/mascot/mascot_sleeping.png',
}

const sizeClasses: Record<MascotStateSize, string> = {
  sm: 'h-20 w-20',
  md: 'h-28 w-28',
  lg: 'h-36 w-36',
}

/**
 * MascotState menampilkan state kosong, motivasi, atau feedback dengan aset mascot resmi.
 * Komponen ini sengaja server-renderable agar aman dipakai di dashboard dan empty state.
 */
export function MascotState({
  variant = 'greeting',
  size = 'md',
  title,
  description,
  action,
  className = '',
}: MascotStateProps) {
  return (
    <div
      className={[
        'flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left',
        className,
      ].join(' ')}
    >
      <div className="shrink-0 rounded-full bg-primary-light/60 p-2 dark:bg-primary/10">
        <Image
          src={mascotByVariant[variant]}
          alt=""
          width={144}
          height={144}
          className={['object-contain', sizeClasses[size]].join(' ')}
          aria-hidden="true"
          priority={variant === 'greeting'}
        />
      </div>

      <div className="min-w-0 space-y-2">
        <h2 className="font-display text-2xl font-black leading-tight text-headline">
          {title}
        </h2>
        {description && (
          <p className="text-sm leading-6 text-body">
            {description}
          </p>
        )}
        {action && <div className="pt-2">{action}</div>}
      </div>
    </div>
  )
}
