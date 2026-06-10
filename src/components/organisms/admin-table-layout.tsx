import * as React from 'react'
import { SmartPagination } from '@/components/molecules/smart-pagination'

export interface AdminTableLayoutProps {
  filters?: React.ReactNode
  children: React.ReactNode
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
    isLoading?: boolean
  }
}

/**
 * A standardized wrapper for Admin Tables that unifies the Filters, the Table, and the Pagination
 * into a single gamified/clean interface card.
 */
export function AdminTableLayout({ filters, children, pagination }: AdminTableLayoutProps) {
  return (
    <section className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-6 dark:bg-surface">
      {filters && (
        <div className="mb-5 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          {filters}
        </div>
      )}
      
      <div className={pagination?.isLoading ? 'pointer-events-none opacity-50 transition-opacity' : 'transition-opacity'}>
        {children}
      </div>

      {pagination && (
        <SmartPagination
          page={pagination.page}
          limit={pagination.limit}
          total={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
          onLimitChange={pagination.onLimitChange}
          isLoading={pagination.isLoading}
        />
      )}
    </section>
  )
}
