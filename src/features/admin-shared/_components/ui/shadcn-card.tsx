import * as React from 'react'
import { cn } from './shadcn-utils'

// Card shadcn-style untuk panel backoffice yang clean dan mudah dipindai.
export function AdminCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-xl border border-border bg-background text-headline shadow-sm', className)}
      {...props}
    />
  )
}

// Header card admin menjaga jarak title/action tetap konsisten.
export function AdminCardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
}

// Title card admin memakai Inter agar terasa seperti tool operasional.
export function AdminCardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
}

// Deskripsi card admin untuk konteks singkat tanpa visual gamified.
export function AdminCardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted', className)} {...props} />
}

// Body card admin memusatkan padding konten utama panel.
export function AdminCardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

// Footer card admin untuk action bar yang terpisah rapi.
export function AdminCardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
}
