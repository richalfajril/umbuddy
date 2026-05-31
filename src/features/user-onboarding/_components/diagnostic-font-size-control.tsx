'use client'

import * as React from 'react'

// Kontrol ukuran font soal yang berlaku selama sesi diagnostic berjalan.
export function DiagnosticFontSizeControl({
  examFontSize,
  onFontSizeChange,
}: {
  examFontSize: number
  onFontSizeChange: React.Dispatch<React.SetStateAction<number>>
}) {
  return (
    <div className="flex min-h-[36px] items-center rounded-full border border-border bg-surface p-1 text-sm font-black text-headline dark:bg-background">
      {/* Minus dibatasi minimum 14px agar soal tetap terbaca. */}
      <button
        type="button"
        onClick={() => onFontSizeChange((size) => Math.max(14, size - 1))}
        className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-surface"
        aria-label="Perkecil ukuran font soal"
      >
        −
      </button>
      <span className="min-w-8 text-center">{examFontSize}</span>
      {/* Plus dibatasi maksimum 22px agar layout opsi tidak mudah pecah. */}
      <button
        type="button"
        onClick={() => onFontSizeChange((size) => Math.min(22, size + 1))}
        className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-surface"
        aria-label="Perbesar ukuran font soal"
      >
        +
      </button>
    </div>
  )
}
