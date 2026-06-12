'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { MoreHorizontal, type LucideIcon } from 'lucide-react'

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

type AdminActionTone = 'default' | 'primary' | 'warning' | 'danger'

export type AdminActionMenuItem = {
  label: string
  icon: LucideIcon
  tone?: AdminActionTone
  href?: string
  onClick?: () => void
}

type AdminActionMenuProps = {
  items: AdminActionMenuItem[]
  align?: 'left' | 'right'
}

type MenuPosition = {
  top: number
  left: number
}

const menuWidth = 208
const menuGap = 10

const toneClasses: Record<AdminActionTone, string> = {
  default: 'text-headline hover:bg-surface',
  primary: 'text-primary hover:bg-primary/10',
  warning: 'text-amber-600 hover:bg-amber-50 dark:text-amber-500 dark:hover:bg-amber-950/30',
  danger: 'text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-950/30',
}

// Dropdown aksi admin menyatukan posisi, warna, ukuran, dan perilaku close antar tabel.
export function AdminActionMenu({ items, align = 'right' }: AdminActionMenuProps) {
  // State lokal cukup untuk membuka menu pada satu baris tabel.
  const [isOpen, setIsOpen] = React.useState(false)
  const [menuPosition, setMenuPosition] = React.useState<MenuPosition | null>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Menghitung posisi fixed agar dropdown tidak terpotong overflow tabel.
  const updateMenuPosition = React.useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return

    const preferredLeft = align === 'right' ? rect.right - menuWidth : rect.left
    const safeLeft = Math.min(
      Math.max(preferredLeft, 12),
      window.innerWidth - menuWidth - 12
    )

    setMenuPosition({
      top: rect.bottom + menuGap,
      left: safeLeft,
    })
  }, [align])

  // Klik di luar menu otomatis menutup dropdown agar tidak bertumpuk.
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Saat dropdown terbuka, posisinya disinkronkan terhadap tombol dan viewport.
  React.useEffect(() => {
    if (!isOpen) return

    updateMenuPosition()
    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)

    return () => {
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
    }
  }, [isOpen, updateMenuPosition])

  return (
    <div className="relative flex justify-end">
      {/* Tombol titik tiga menjadi trigger standar semua tabel admin. */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'grid min-h-10 min-w-10 place-items-center rounded-xl transition-colors',
          isOpen ? 'bg-surface text-headline' : 'text-muted hover:bg-surface hover:text-headline'
        )}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        title="Aksi Lainnya"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {isOpen && menuPosition && createPortal(
        <div
          ref={menuRef}
          role="menu"
          className="fixed z-[90] w-[208px] rounded-3xl border border-border bg-background p-3 shadow-[0_22px_55px_-28px_rgba(31,41,55,0.45)] dark:bg-surface"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <div className="px-3 pb-2 text-left text-sm font-black text-muted">Aksi</div>

          {/* Item aksi menerima href atau callback, tetapi tampilannya tetap satu pola. */}
          <div className="space-y-1">
            {items.map((item) => (
              <AdminActionMenuItemButton
                key={item.label}
                item={item}
                onClose={() => setIsOpen(false)}
              />
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

function AdminActionMenuItemButton({
  item,
  onClose,
}: {
  item: AdminActionMenuItem
  onClose: () => void
}) {
  const Icon = item.icon
  const tone = item.tone ?? 'default'
  const className = cn(
    'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-black transition-colors',
    toneClasses[tone]
  )

  if (item.href) {
    return (
      <Link
        href={item.href}
        prefetch
        transitionTypes={['app-nav']}
        role="menuitem"
        onClick={onClose}
        className={className}
      >
        <Icon className="h-4 w-4" />
        {item.label}
      </Link>
    )
  }

  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        onClose()
        item.onClick?.()
      }}
      className={className}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </button>
  )
}
