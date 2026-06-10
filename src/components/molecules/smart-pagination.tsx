'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface SmartPaginationProps {
  page: number
  limit: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  isLoading?: boolean
}

export function SmartPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  isLoading
}: SmartPaginationProps) {
  // Hitung rentang item yang sedang ditampilkan
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1
  const endItem = Math.min(page * limit, total)

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-border pt-4 sm:flex-row">
      <div className="flex flex-col sm:flex-row items-center gap-3 text-sm font-semibold text-muted">
        <span>
          Menampilkan <span className="font-bold text-headline">{startItem}-{endItem}</span> dari <span className="font-bold text-headline">{total}</span> data
        </span>
        <div className="flex items-center gap-2">
          <span>Tampilkan</span>
          <select
            value={limit}
            onChange={(e) => {
              onLimitChange(Number(e.target.value))
            }}
            disabled={isLoading}
            className="rounded-lg border border-border bg-surface px-2 py-1.5 font-bold text-headline outline-none transition focus:border-primary/50"
          >
            {[10, 15, 30, 50, 60, 100, 120].map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
          <span>per halaman</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-headline transition hover:border-primary/50 hover:text-primary disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-bold text-headline">
          {page} / {totalPages > 0 ? totalPages : 1}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isLoading}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-headline transition hover:border-primary/50 hover:text-primary disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
