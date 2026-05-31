import * as React from 'react'

type PracticeFontSizeControlProps = {
  fontSize: number
  onChange: (updater: number | ((current: number) => number)) => void
  ariaLabelDecrease?: string
  ariaLabelIncrease?: string
}

// Render UI pengatur ukuran font untuk mempermudah user membaca teks.
export function PracticeFontSizeControl({
  fontSize,
  onChange,
  ariaLabelDecrease = 'Perkecil ukuran font',
  ariaLabelIncrease = 'Perbesar ukuran font',
}: PracticeFontSizeControlProps) {
  return (
    <div className="flex min-h-[36px] items-center rounded-full border border-border bg-surface p-1 text-sm font-black text-headline dark:bg-background">
      <button
        type="button"
        onClick={() => onChange((size: number) => Math.max(14, size - 1))}
        className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-surface"
        aria-label={ariaLabelDecrease}
      >
        −
      </button>
      <span className="min-w-8 text-center">{fontSize}</span>
      <button
        type="button"
        onClick={() => onChange((size: number) => Math.min(22, size + 1))}
        className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-surface"
        aria-label={ariaLabelIncrease}
      >
        +
      </button>
    </div>
  )
}
