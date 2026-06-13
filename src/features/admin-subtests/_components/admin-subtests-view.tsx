'use client'

import * as React from 'react'
import Link from 'next/link'
import { Plus, FileSpreadsheet, AlertCircle, Search, Package } from 'lucide-react'
import { Button } from '@/components/ui'
import { AdminPageHeader, AdminTableLayout } from '@/components/organisms'
import { useToastStore } from '@/stores/useToastStore'
import { AdminSubtestsTable } from './admin-subtests-table'
import type { SubtestPackage } from '../_types/admin-subtests.types'

export function AdminSubtestsView() {
  // State data utama halaman subtes.
  const [subtests, setSubtests] = React.useState<SubtestPackage[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // State modal hapus menjaga aksi destruktif tetap eksplisit.
  const [deleteConfirmation, setDeleteConfirmation] = React.useState<SubtestPackage | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const { addToast } = useToastStore()

  // State pagination dan pencarian lokal untuk daftar paket.
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [keyword, setKeyword] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<'ALL' | 'PUBLISHED' | 'ARCHIVED'>('ALL')

  // Filter client-side cukup untuk daftar paket yang ringan.
  const filteredSubtests = React.useMemo(() => {
    const byStatus = statusFilter === 'ALL'
      ? subtests
      : subtests.filter((subtest) => subtest.status === statusFilter)

    if (!keyword.trim()) return byStatus
    const lower = keyword.toLowerCase()
    return byStatus.filter(st =>
      st.packageCode.toLowerCase().includes(lower) ||
      st.category.toLowerCase().includes(lower)
    )
  }, [subtests, keyword, statusFilter])

  // Nilai pagination diturunkan dari hasil filter lokal.
  const total = filteredSubtests.length
  const totalPages = Math.ceil(total / limit)
  const paginatedSubtests = filteredSubtests.slice((page - 1) * limit, page * limit)

  // Memuat paket soal dari endpoint admin tanpa mengubah kontrak API.
  const fetchPackages = React.useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/questions/packages')
      const data = await res.json()
      if (data.success) {
        setSubtests(data.data)
      } else {
        console.error(data.error)
      }
    } catch (err) {
      console.error('Failed to fetch packages', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Request awal dijalankan sekali saat halaman subtes terbuka.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchPackages()
  }, [fetchPackages])

  // Konfirmasi arsip memakai endpoint delete yang kini menjaga riwayat attempt tetap aman.
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/v1/admin/questions/packages/${deleteConfirmation.packageCode}`, {
        method: 'DELETE'
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Gagal menghapus subtes')

      addToast({ type: 'success', title: 'Berhasil', message: data.message || `Subtes ${deleteConfirmation.packageCode} telah diarsipkan` })
      setDeleteConfirmation(null)
      void fetchPackages()
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Terjadi kesalahan'
      addToast({ type: 'error', title: 'Gagal Arsip', message: msg })
    } finally {
      setIsDeleting(false)
    }
  }

  // Publikasi mengaktifkan kembali paket archived tanpa mengganti isi soalnya.
  const handlePublishClick = async (subtest: SubtestPackage) => {
    try {
      const res = await fetch(`/api/v1/admin/questions/packages/${encodeURIComponent(subtest.packageCode)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'PUBLISH' }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Gagal mempublikasikan subtes')

      addToast({ type: 'success', title: 'Berhasil', message: data.message || `Subtes ${subtest.packageCode} telah dipublikasikan` })
      void fetchPackages()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
      addToast({ type: 'error', title: 'Gagal Publikasi', message })
    }
  }

  // Filter pencarian dikirim ke AdminTableLayout agar wrapper tetap konsisten.
  const filtersNode = (
    <div className="flex w-full flex-wrap items-center gap-3">
      <div className="relative w-full sm:max-w-[280px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-muted" aria-hidden="true" />
        </div>
        <input
          type="text"
          className="block w-full rounded-3xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm font-semibold text-headline transition placeholder:text-muted focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
          placeholder="Cari subtes atau kategori..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value)
            setPage(1)
          }}
        />
      </div>
      <select
        value={statusFilter}
        onChange={(event) => {
          setStatusFilter(event.target.value as 'ALL' | 'PUBLISHED' | 'ARCHIVED')
          setPage(1)
        }}
        className="rounded-3xl border border-border bg-surface py-2.5 pl-3 pr-8 text-sm font-semibold text-headline transition focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
      >
        <option value="ALL">Semua Status</option>
        <option value="PUBLISHED">Published</option>
        <option value="ARCHIVED">Archived</option>
      </select>
    </div>
  )

  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header dan aksi utama halaman subtes. */}
        <AdminPageHeader
          icon={<Package className="h-6 w-6 text-primary" />}
          eyebrow="Question Packages"
          title={<>Manajemen <span className="text-primary">Subtes</span></>}
          description="Kelola koleksi subtes yang akan digunakan dalam Try Out."
          actions={
            <>
              <Button variant="secondary" className="gap-2 rounded-xl">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                Template Excel
              </Button>
              <Link href="/admin/subtests/create" prefetch transitionTypes={['app-nav']}>
                <Button className="w-full gap-2 rounded-xl sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Tambah Subtes
                </Button>
              </Link>
            </>
          }
        />

        {/* Tabel paket subtes memakai layout admin bersama. */}
        <AdminTableLayout
          filters={filtersNode}
          pagination={{
            page,
            limit,
            total,
            totalPages,
            onPageChange: setPage,
            onLimitChange: (newLimit) => {
              setLimit(newLimit)
              setPage(1)
            },
            isLoading,
          }}
        >
          <AdminSubtestsTable
            isLoading={isLoading}
            page={page}
            limit={limit}
            filteredCount={filteredSubtests.length}
            subtests={paginatedSubtests}
            onDeleteClick={setDeleteConfirmation}
            onPublishClick={handlePublishClick}
          />
        </AdminTableLayout>
      </div>

      {/* Modal konfirmasi arsip menjaga admin sadar paket akan disembunyikan dari daftar aktif. */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-headline/50 backdrop-blur-sm" onClick={() => !isDeleting && setDeleteConfirmation(null)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-background p-6 shadow-2xl dark:bg-surface sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
            </div>

            <div className="mt-6 text-center">
              <h3 className="text-xl font-black text-headline">Arsipkan Subtes?</h3>
              <p className="mt-2 text-sm font-medium text-muted">
                Anda yakin ingin mengarsipkan paket soal <span className="font-bold text-headline">{deleteConfirmation.packageCode}</span>?
                Total <strong>{deleteConfirmation.totalQuestions} soal</strong> di dalamnya akan disembunyikan dari daftar aktif.
              </p>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                onClick={() => setDeleteConfirmation(null)}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                {isDeleting ? 'Mengarsipkan...' : 'Ya, Arsipkan'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
