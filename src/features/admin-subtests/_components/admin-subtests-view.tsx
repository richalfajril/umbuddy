'use client'

import * as React from 'react'
import Link from 'next/link'
import { Plus, MoreHorizontal, FileSpreadsheet, Eye, Pencil, Trash2, AlertCircle, Search, Package } from 'lucide-react'
import { Button } from '@/components/ui'
import { SmartPagination, AdminTable, AdminTableHeader, AdminTableHead, AdminTableBody, AdminTableRow, AdminTableCell } from '@/components/molecules'
import { useToastStore } from '@/stores/useToastStore'

// Interface untuk struktur data paket
interface SubtestPackage {
  id: string
  packageCode: string
  category: string
  totalQuestions: number
  createdAt: string
  updatedAt: string
}

export function AdminSubtestsView() {
  const [subtests, setSubtests] = React.useState<SubtestPackage[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [activeDropdown, setActiveDropdown] = React.useState<{id: string, top: number, right: number} | null>(null)
  
  // State untuk Delete Modal
  const [deleteConfirmation, setDeleteConfirmation] = React.useState<SubtestPackage | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const { addToast } = useToastStore()
  
  // Pagination & Search state
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [keyword, setKeyword] = React.useState('')

  // Client-side filtering & pagination logic
  const filteredSubtests = React.useMemo(() => {
    if (!keyword.trim()) return subtests
    const lower = keyword.toLowerCase()
    return subtests.filter(st => 
      st.packageCode.toLowerCase().includes(lower) || 
      st.category.toLowerCase().includes(lower)
    )
  }, [subtests, keyword])

  const total = filteredSubtests.length
  const totalPages = Math.ceil(total / limit)
  const paginatedSubtests = filteredSubtests.slice((page - 1) * limit, page * limit)

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

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchPackages()
  }, [fetchPackages])
  
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
      fetchPackages() // Refresh data
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Terjadi kesalahan'
      addToast({ type: 'error', title: 'Gagal Hapus', message: msg })
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header & Aksi */}
        <div className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-7 dark:bg-surface">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                Question Packages
              </p>
              <h1 className="mt-2 flex items-center gap-3 font-display text-3xl font-black leading-tight sm:text-4xl text-headline">
                <Package className="h-7 w-7 text-primary" />
                Manajemen <span className="text-primary">Subtes</span>
              </h1>
              <p className="mt-2 text-sm font-medium text-muted">
                Kelola koleksi subtes yang akan digunakan dalam Try Out.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="secondary" className="gap-2 rounded-xl">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                Template Excel
              </Button>
              <Link href="/admin/subtests/create">
                <Button className="w-full gap-2 rounded-xl sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Tambah Subtes
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Table/List Area */}
        <section className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-6 dark:bg-surface">
          {/* Search Bar */}
          <div className="mb-5 flex flex-wrap items-center gap-3 border-b border-border pb-5">
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

          <div className={isLoading ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
            <AdminTable>
              <AdminTableHeader>
                <tr>
                  <AdminTableHead>No</AdminTableHead>
                  <AdminTableHead>Nama Subtes / Paket</AdminTableHead>
                  <AdminTableHead>Kategori</AdminTableHead>
                  <AdminTableHead>Total Soal</AdminTableHead>
                  <AdminTableHead>Tanggal Dibuat</AdminTableHead>
                  <AdminTableHead>Terakhir Diubah</AdminTableHead>
                  <AdminTableHead className="text-right">Aksi</AdminTableHead>
                </tr>
              </AdminTableHeader>
              <AdminTableBody>
                {isLoading ? (
                  <AdminTableRow>
                    <AdminTableCell colSpan={7} className="px-6 py-12 text-center text-muted">
                      Memuat daftar paket soal...
                    </AdminTableCell>
                  </AdminTableRow>
                ) : filteredSubtests.length === 0 ? (
                  <AdminTableRow>
                    <AdminTableCell colSpan={7} className="px-6 py-12 text-center text-muted">
                      Belum ada paket subtes yang ditemukan.
                    </AdminTableCell>
                  </AdminTableRow>
                ) : (
                  paginatedSubtests.map((st, i) => (
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
                      <AdminTableCell className="text-right">
                        <div className="relative flex justify-end">
                          <button 
                            onClick={(e) => {
                              if (activeDropdown?.id === st.id) {
                                setActiveDropdown(null)
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect()
                                setActiveDropdown({
                                  id: st.id,
                                  top: rect.bottom + 8,
                                  right: window.innerWidth - rect.right
                                })
                              }
                            }}
                            className={`rounded-xl p-2 transition ${activeDropdown?.id === st.id ? 'bg-surface text-headline' : 'text-muted hover:bg-surface hover:text-headline'}`}
                            title="Aksi Lainnya"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </div>
                      </AdminTableCell>
                    </AdminTableRow>
                  ))
                )}
                {!isLoading && filteredSubtests.length > 0 && limit > paginatedSubtests.length && (
                  Array.from({ length: limit - paginatedSubtests.length }).map((_, i) => (
                    <AdminTableRow key={`empty-${i}`} className="h-[65px] hover:bg-transparent">
                      <AdminTableCell colSpan={7} className="text-transparent">&nbsp;</AdminTableCell>
                    </AdminTableRow>
                  ))
                )}
              </AdminTableBody>
            </AdminTable>
          </div>

          <SmartPagination 
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              setPage(1)
            }}
            isLoading={isLoading}
          />
        </section>
      </div>

      {/* Global Dropdown Menu */}
      {activeDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setActiveDropdown(null)} 
          />
          <div 
            className="fixed z-50 w-48 rounded-xl border border-border bg-background p-1.5 shadow-lg dark:bg-surface"
            style={{ top: activeDropdown.top, right: activeDropdown.right }}
          >
            <div className="px-3 py-1.5 text-xs font-bold text-muted text-left">Aksi</div>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-headline hover:bg-muted/10">
              <Eye className="h-4 w-4 text-muted" />
              Detail
            </button>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-amber-600 hover:bg-amber-50 dark:text-amber-500 dark:hover:bg-amber-950/30">
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button 
              onClick={() => {
                const st = subtests.find(s => s.id === activeDropdown.id)
                setActiveDropdown(null)
                if (st) setDeleteConfirmation(st)
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </button>
          </div>
        </>
      )}

      {/* Modal Konfirmasi Hapus */}
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
