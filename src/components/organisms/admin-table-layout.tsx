import * as React from 'react'
import { SmartPagination } from '@/components/molecules/smart-pagination'

// Kontrak layout tabel admin menyatukan filter, isi tabel, dan pagination.
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

// Wrapper standar agar tabel admin punya padding, filter, dan pagination yang konsisten.
export function AdminTableLayout({ filters, children, pagination }: AdminTableLayoutProps) {
  return (
    <section className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-6 dark:bg-surface">
      {/* Area filter dibuat satu pola supaya tiap tabel admin tidak punya wrapper ganda. */}
      {filters && (
        <div className="mb-5 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          {filters}
        </div>
      )}
      
      {/* Isi tabel tetap stabil; loading divisualkan di teks/list, bukan seluruh komponen. */}
      <div className="transition-opacity">
        {children}
      </div>

      {/* Pagination tetap interaktif sesuai state loading dari fitur pemilik data. */}
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
