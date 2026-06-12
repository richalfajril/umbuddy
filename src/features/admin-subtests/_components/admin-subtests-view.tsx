'use client'

import * as React from 'react'
import Link from 'next/link'
import { Plus, MoreHorizontal, FileSpreadsheet, Eye, Pencil, Trash2, AlertCircle, Search, Package } from 'lucide-react'
import { Button } from '@/components/ui'
import { AdminActionMenu, AdminTable, AdminTableHeader, AdminTableHead, AdminTableBody, AdminTableRow, AdminTableCell, AdminTableTextSkeleton } from '@/components/molecules'
import { AdminPageHeader, AdminTableLayout } from '@/components/organisms'
import { useToastStore } from '@/stores/useToastStore'

// Struktur paket subtes yang ditampilkan di tabel admin.
interface SubtestPackage {
  id: string
  packageCode: string
  category: string
  totalQuestions: number
  createdAt: string
  updatedAt: string
}

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

  // Filter client-side cukup untuk daftar paket yang ringan.
  const filteredSubtests = React.useMemo(() => {
    if (!keyword.trim()) return subtests
    const lower = keyword.toLowerCase()
    return subtests.filter(st =>
      st.packageCode.toLowerCase().includes(lower) ||
      st.category.toLowerCase().includes(lower)
    )
  }, [subtests, keyword])

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

  // Konfirmasi hapus tetap memakai endpoint delete yang sudah ada.
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/v1/admin/questions/packages/${deleteConfirmation.packageCode}`, {
        method: 'DELETE'
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Gagal menghapus subtes')

      addToast({ type: 'success', title: 'Berhasil', message: data.message || `Subtes ${deleteConfirmation.packageCode} telah dihapus` })
      setDeleteConfirmation(null)
      void fetchPackages()
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Terjadi kesalahan'
      addToast({ type: 'error', title: 'Gagal Hapus', message: msg })
    } finally {
      setIsDeleting(false)
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
          <SubtestsTable
            isLoading={isLoading}
            page={page}
            limit={limit}
            filteredCount={filteredSubtests.length}
            subtests={paginatedSubtests}
            onDeleteClick={setDeleteConfirmation}
          />
        </AdminTableLayout>
      </div>

      {/* Modal konfirmasi hapus menjaga admin sadar dampak penghapusan paket. */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-headline/50 backdrop-blur-sm" onClick={() => !isDeleting && setDeleteConfirmation(null)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-background p-6 shadow-2xl dark:bg-surface sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
            </div>

            <div className="mt-6 text-center">
              <h3 className="text-xl font-black text-headline">Hapus Subtes?</h3>
              <p className="mt-2 text-sm font-medium text-muted">
                Anda yakin ingin menghapus paket soal <span className="font-bold text-headline">{deleteConfirmation.packageCode}</span> secara permanen?
                Total <strong>{deleteConfirmation.totalQuestions} soal</strong> di dalamnya akan ikut terhapus.
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
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function SubtestsTable({
  isLoading,
  page,
  limit,
  filteredCount,
  subtests,
  onDeleteClick,
}: {
  isLoading: boolean
  page: number
  limit: number
  filteredCount: number
  subtests: SubtestPackage[]
  onDeleteClick: (subtest: SubtestPackage) => void
}) {
  // Loading skeleton hanya mengganti teks/list, bukan card atau tombol utama.
  const loadingRows = Array.from({ length: Math.min(Math.max(subtests.length, 5), 8) })

  if (!isLoading && filteredCount === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/50 p-8 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted/20 text-muted">
          <AlertCircle className="h-8 w-8" />
        </div>
        <p className="mt-4 font-display text-lg font-black text-headline">Belum Ada Subtes</p>
        <p className="mt-1 text-sm font-semibold text-muted">
          Coba sesuaikan pencarian atau tambahkan paket subtes baru.
        </p>
      </div>
    )
  }

  return (
    <AdminTable>
      <AdminTableHeader>
        <tr>
          <AdminTableHead>No</AdminTableHead>
          <AdminTableHead>Nama Subtes / Paket</AdminTableHead>
          <AdminTableHead>Kategori</AdminTableHead>
          <AdminTableHead>Total Soal</AdminTableHead>
          <AdminTableHead>Tanggal Dibuat</AdminTableHead>
          <AdminTableHead>Terakhir Diubah</AdminTableHead>
          <AdminTableHead className="sticky right-0 bg-surface text-right shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">Aksi</AdminTableHead>
        </tr>
      </AdminTableHeader>
      <AdminTableBody>
        {isLoading ? (
          loadingRows.map((_, index) => (
            <AdminTableRow key={`subtest-loading-${index}`}>
              <AdminTableCell><AdminTableTextSkeleton className="w-8" /></AdminTableCell>
              <AdminTableCell><AdminTableTextSkeleton className="w-40" /></AdminTableCell>
              <AdminTableCell><AdminTableTextSkeleton className="w-16" /></AdminTableCell>
              <AdminTableCell><AdminTableTextSkeleton className="w-20" /></AdminTableCell>
              <AdminTableCell><AdminTableTextSkeleton className="w-24" /></AdminTableCell>
              <AdminTableCell><AdminTableTextSkeleton className="w-24" /></AdminTableCell>
              <AdminTableCell className="sticky right-0 border-l border-border bg-background text-right shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">
                <button type="button" disabled className="rounded-xl p-2 text-muted opacity-60" title="Memuat aksi">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </AdminTableCell>
            </AdminTableRow>
          ))
        ) : (
          subtests.map((st, i) => (
            <AdminTableRow key={st.id}>
              <AdminTableCell className="font-medium text-muted">{((page - 1) * limit) + i + 1}</AdminTableCell>
              <AdminTableCell className="font-bold text-headline">{st.packageCode}</AdminTableCell>
              <AdminTableCell>
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                  {st.category}
                </span>
              </AdminTableCell>
              <AdminTableCell className="text-muted">{st.totalQuestions} Soal</AdminTableCell>
              <AdminTableCell className="text-muted">
                {new Date(st.createdAt).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </AdminTableCell>
              <AdminTableCell className="text-muted">
                {new Date(st.updatedAt).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </AdminTableCell>
              <SubtestActionCell subtest={st} onDeleteClick={onDeleteClick} />
            </AdminTableRow>
          ))
        )}
        {!isLoading && filteredCount > 0 && limit > subtests.length && (
          Array.from({ length: limit - subtests.length }).map((_, i) => (
            <AdminTableRow key={`empty-${i}`} className="h-[65px] hover:bg-transparent">
              <AdminTableCell colSpan={7} className="border-0 text-transparent">&nbsp;</AdminTableCell>
            </AdminTableRow>
          ))
        )}
      </AdminTableBody>
    </AdminTable>
  )
}

function SubtestActionCell({
  subtest,
  onDeleteClick,
}: {
  subtest: SubtestPackage
  onDeleteClick: (subtest: SubtestPackage) => void
}) {
  // Item aksi subtes memakai wrapper dropdown standar admin.
  const actionItems = [
    {
      label: 'Detail',
      icon: Eye,
      tone: 'default' as const,
    },
    {
      label: 'Edit',
      icon: Pencil,
      tone: 'warning' as const,
    },
    {
      label: 'Hapus',
      icon: Trash2,
      tone: 'danger' as const,
      onClick: () => onDeleteClick(subtest),
    },
  ]

  return (
    <AdminTableCell
      className="sticky right-0 z-10 border-l border-border bg-background text-right shadow-[-4px_0_12px_rgba(0,0,0,0.05)] transition-colors group-hover:bg-surface/95"
    >
      <AdminActionMenu items={actionItems} />
    </AdminTableCell>
  )
}
