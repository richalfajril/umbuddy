'use client'

import * as React from 'react'
import { Search, Loader2 } from 'lucide-react'

interface AdminUsersFiltersProps {
  keyword: string
  status: string
  instansi?: string
  registrationSource?: string
  isLoading: boolean
  onKeywordChange: (val: string) => void
  onStatusChange: (val: string) => void
  onInstansiChange: (val: string) => void
  onRegistrationSourceChange: (val: string) => void
  onFilter: () => void
}

export function AdminUsersFilters({
  keyword,
  status,
  instansi,
  registrationSource,
  isLoading,
  onKeywordChange,
  onStatusChange,
  onInstansiChange,
  onRegistrationSourceChange,
  onFilter
}: AdminUsersFiltersProps) {
  // Trigger filter when enter key is pressed in search bar
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onFilter()
    }
  }

  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-border pb-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search bar */}
          <div className="relative w-full max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-muted" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-3xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm font-semibold text-headline transition placeholder:text-muted focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
              placeholder="Cari nama, email, hp, ID..."
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Status Filter */}
          <select
            className="w-full rounded-3xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-headline transition focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 sm:w-auto"
            value={status}
            onChange={(e) => {
              onStatusChange(e.target.value)
              // Timeout to allow state update before firing filter
              setTimeout(onFilter, 50)
            }}
          >
            <option value="">Semua Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING_VERIFICATION">Pending Verifikasi</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BANNED">Banned</option>
          </select>
          
        </div>

        <button
          type="button"
          onClick={onFilter}
          disabled={isLoading}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-black text-primary transition hover:bg-primary/20 disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Terapkan Filter'}
        </button>
      </div>

      {/* Advanced Filters Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center mt-1">
        <input
          type="text"
          className="block w-full max-w-sm rounded-3xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-headline transition placeholder:text-muted focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
          placeholder="Filter target instansi (opsional)..."
          value={instansi || ''}
          onChange={(e) => onInstansiChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <select
          className="w-full rounded-3xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-headline transition focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 sm:w-auto"
          value={registrationSource || ''}
          onChange={(e) => {
            onRegistrationSourceChange(e.target.value)
            setTimeout(onFilter, 50)
          }}
        >
          <option value="">Semua Sumber Registrasi</option>
          <option value="credentials">Email & Sandi</option>
          <option value="google">Google OAuth</option>
        </select>
      </div>
    </div>
  )
}
