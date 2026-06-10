'use client'

import * as React from 'react'
import { Users } from 'lucide-react'
import { useToastStore } from '@/stores/useToastStore'
import type {
  AdminUserListItem,
  AdminUserSummaryStats,
  AdminUsersListResponse,
} from '../_types/admin-users.types'
import { AdminUsersFilters } from './admin-users-filters'
import { SmartPagination } from '@/components/molecules'
import { AdminUsersSummaryCards } from './admin-users-summary-cards'
import { AdminUsersTable } from './admin-users-table'
import { AdminUserStatusModal } from './admin-user-status-modal'

interface AdminUsersViewProps {
  initialData: AdminUsersListResponse
  initialSummary: AdminUserSummaryStats
}

export function AdminUsersView({
  initialData,
  initialSummary,
}: AdminUsersViewProps) {
  const [users, setUsers] = React.useState<AdminUserListItem[]>(initialData.users)
  const [total, setTotal] = React.useState(initialData.total)
  const [page, setPage] = React.useState(initialData.page)
  const [limit, setLimit] = React.useState(initialData.limit)
  const [totalPages, setTotalPages] = React.useState(initialData.totalPages)
  
  const [keyword, setKeyword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const isFirstRender = React.useRef(true)

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalUser, setModalUser] = React.useState({ id: '', name: '', status: '' })

  const { addToast } = useToastStore()

  const loadUsers = React.useCallback(async (targetPage = page, currentLimit = limit, currentKeyword = keyword) => {
    setIsLoading(true)
    const params = new URLSearchParams()
    params.set('page', targetPage.toString())
    params.set('limit', currentLimit.toString())
    if (currentKeyword.trim()) params.set('keyword', currentKeyword.trim())

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
  }, [addToast, keyword, limit, page])

  // Smart Search: fetch when keyword changes with debounce
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const timer = setTimeout(() => {
      setPage(1)
      loadUsers(1, limit, keyword)
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword])

  const handleFilter = () => {
    setPage(1)
    loadUsers(1, limit, keyword)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
    loadUsers(1, newLimit, keyword)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      loadUsers(newPage, limit, keyword)
    }
  }

  const openStatusModal = (userId: string, currentStatus: string, name: string) => {
    setModalUser({ id: userId, name, status: currentStatus })
    setIsModalOpen(true)
  }

  return (
    <>
      <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header halaman */}
          <div className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-7 dark:bg-surface">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                  User Management
                </p>
                <h1 className="mt-2 flex items-center gap-3 font-display text-3xl font-black leading-tight sm:text-4xl text-headline">
                  <Users className="h-7 w-7 text-primary" />
                  Direktori <span className="text-primary">Pengguna</span>
                </h1>
                <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-body sm:text-base">
                  Kelola status akun, moderasi indikasi pelanggaran, dan lihat metrik pengguna.
                </p>
              </div>
              <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-black text-primary-dark dark:text-primary">
                Total: {total.toLocaleString('id-ID')} akun
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <AdminUsersSummaryCards initialStats={initialSummary} />

          {/* Tabel dan Filter */}
          <section className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-6 dark:bg-surface">
            <AdminUsersFilters
              keyword={keyword}
              isLoading={isLoading}
              onKeywordChange={setKeyword}
              onFilter={handleFilter}
            />
            
            <div className={isLoading ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
              <AdminUsersTable
                users={users}
                page={page}
                limit={limit}
                onChangeStatusClick={openStatusModal}
              />
            </div>

            {/* Smart Pagination Controls */}
            <SmartPagination
              page={page}
              limit={limit}
              total={total}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              isLoading={isLoading}
            />
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
