'use client'

import * as React from 'react'
import { Search, Loader2 } from 'lucide-react'

interface AdminUsersFiltersProps {
  keyword: string
  isLoading: boolean
  onKeywordChange: (val: string) => void
  onFilter: () => void
}

export function AdminUsersFilters({
  keyword,
  isLoading,
  onKeywordChange,
  onFilter
}: AdminUsersFiltersProps) {
  // Trigger filter when enter key is pressed in search bar
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onFilter()
    }
  }

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleInputChange = (val: string) => {
    onKeywordChange(val)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      onFilter()
    }, 500)
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
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex w-full items-center justify-center sm:w-auto sm:ml-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}
    </div>
  )
}
