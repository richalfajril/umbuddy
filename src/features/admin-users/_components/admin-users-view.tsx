'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { useToastStore } from '@/stores/useToastStore'
import type { AdminUserListItem, AdminUsersListResponse } from '../_types/admin-users.types'
import { AdminUsersFilters } from './admin-users-filters'
import { AdminUsersSummaryCards } from './admin-users-summary-cards'
import { AdminUsersTable } from './admin-users-table'
import { AdminUserStatusModal } from './admin-user-status-modal'

interface AdminUsersViewProps {
  initialData: AdminUsersListResponse
}

export function AdminUsersView({
  initialData,
}: AdminUsersViewProps) {
  const [users, setUsers] = React.useState<AdminUserListItem[]>(initialData.users)
  const [total, setTotal] = React.useState(initialData.total)
  const [page, setPage] = React.useState(initialData.page)
  const [limit, setLimit] = React.useState(initialData.limit)
  const [totalPages, setTotalPages] = React.useState(initialData.totalPages)
  
  const [status, setStatus] = React.useState('')
  const [keyword, setKeyword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalUser, setModalUser] = React.useState({ id: '', name: '', status: '' })

  const { addToast } = useToastStore()

  // Fetch list users dengan paginasi & filter
  const loadUsers = React.useCallback(async (targetPage = page, currentLimit = limit) => {
    setIsLoading(true)
    const params = new URLSearchParams()
    params.set('page', targetPage.toString())
    params.set('limit', currentLimit.toString())
    if (status) params.set('status', status)
    if (keyword.trim()) params.set('keyword', keyword.trim())

    try {
      const response = await fetch(`/api/v1/admin/users?${params.toString()}`)
      if (!response.ok) throw new Error('Gagal memuat data pengguna')
      const data = (await response.json()) as AdminUsersListResponse
      setUsers(data.users)
      setTotal(data.total)
      setPage(data.page)
      setLimit(data.limit)
      setTotalPages(data.totalPages)
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gagal Dimuat',
        message: error instanceof Error ? error.message : 'Silakan coba lagi.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [addToast, keyword, limit, page, status])

  const handleFilter = () => {
    setPage(1)
    loadUsers(1)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
    loadUsers(1, newLimit)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      loadUsers(newPage)
    }
  }

  const openStatusModal = (userId: string, currentStatus: string, name: string) => {
    setModalUser({ id: userId, name, status: currentStatus })
    setIsModalOpen(true)
  }

  return (
    <>
      <section className="min-h-screen bg-background px-4 py-6 text-headline sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header halaman */}
          <header className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-surface">
            <div>
              <Link href="/admin/dashboard" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-black text-primary hover:underline">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Kembali ke Dashboard
              </Link>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.22em] text-primary">
                User Management
              </p>
              <h1 className="mt-1 flex items-center gap-3 text-2xl font-black text-headline">
                <Users className="h-7 w-7 text-primary" />
                Direktori <span className="text-primary">Pengguna</span>
              </h1>
              <p className="mt-1 text-sm text-body">
                Kelola status akun, moderasi indikasi pelanggaran, dan lihat metrik pengguna.
              </p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-black text-primary-dark dark:text-primary">
              Total: {total.toLocaleString('id-ID')} akun
            </div>
          </header>

          {/* Summary Cards */}
          <AdminUsersSummaryCards />

          {/* Tabel dan Filter */}
          <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5 dark:bg-surface">
            <AdminUsersFilters
              keyword={keyword}
              status={status}
              limit={limit}
              isLoading={isLoading}
              onKeywordChange={setKeyword}
              onStatusChange={setStatus}
              onLimitChange={handleLimitChange}
              onFilter={handleFilter}
            />
            
            <div className={isLoading ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
              <AdminUsersTable
                users={users}
                onChangeStatusClick={openStatusModal}
              />
            </div>

            {/* Smart Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-4">
                <p className="text-sm font-semibold text-muted">
                  Menampilkan halaman <span className="font-bold text-headline">{page}</span> dari <span className="font-bold text-headline">{totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || isLoading}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-headline transition hover:border-primary/50 hover:text-primary disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages || isLoading}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-headline transition hover:border-primary/50 hover:text-primary disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>

      {/* Modal Moderasi */}
      <AdminUserStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={modalUser.id}
        userName={modalUser.name}
        currentStatus={modalUser.status}
        onStatusUpdated={() => void loadUsers()}
      />
    </>
  )
}
