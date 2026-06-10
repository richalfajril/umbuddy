'use client'

import { Search } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import {
  adminQuestionCategoryFilters,
  adminQuestionStatusFilters,
} from '../_constants/admin-questions.constants'

type AdminQuestionFiltersProps = {
  keyword: string
  status: string
  category: string
  isLoading: boolean
  onKeywordChange: (value: string) => void
  onStatusChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onFilter: () => void
}

// Panel filter list soal dibuat terpisah agar table dan form lebih mudah dirawat.
export function AdminQuestionFilters({
  keyword,
  status,
  category,
  isLoading,
  onKeywordChange,
  onStatusChange,
  onCategoryChange,
  onFilter,
}: AdminQuestionFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
      {/* Input pencarian mencari teks soal atau kode paket. */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <Input
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="Cari teks atau kode paket"
          className="pl-10"
        />
      </div>

      {/* Filter status mengikuti workflow DRAFT/PUBLISHED/ARCHIVED/FLAGGED. */}
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        className="min-h-[44px] rounded-xl border border-border bg-background px-3 text-sm font-bold text-headline"
      >
        {adminQuestionStatusFilters.map((item) => (
          <option key={item.label} value={item.value}>{item.label}</option>
        ))}
      </select>

      {/* Filter kategori membatasi list ke TWK/TIU/TKP. */}
      <select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        className="min-h-[44px] rounded-xl border border-border bg-background px-3 text-sm font-bold text-headline"
      >
        {adminQuestionCategoryFilters.map((item) => (
          <option key={item.label} value={item.value}>{item.label}</option>
        ))}
      </select>

      {/* Tombol filter memicu fetch list tanpa reload halaman. */}
      <Button type="button" variant="secondary" isLoading={isLoading} onClick={onFilter}>
        Filter
      </Button>
    </div>
  )
}
