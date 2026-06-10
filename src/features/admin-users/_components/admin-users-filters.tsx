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
    <div className="mb-5 flex flex-wrap items-center gap-3 border-b border-border pb-5">
      {/* Search bar */}
      <div className="relative w-full sm:max-w-[280px]">
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

      {/* Instansi Filter */}
      <input
        type="text"
        className="block w-full rounded-3xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-headline transition placeholder:text-muted focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 sm:max-w-[240px]"
        placeholder="Filter target instansi..."
        value={instansi || ''}
        onChange={(e) => onInstansiChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* Registration Source */}
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

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex w-full items-center justify-center sm:w-auto sm:ml-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}
    </div>
  )
}
