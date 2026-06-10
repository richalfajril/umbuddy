'use client'

import * as React from 'react'
import Link from 'next/link'
import { Plus, MoreHorizontal, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui'
import { SmartPagination } from '@/components/molecules'

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
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null)
  
  // Pagination state
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)

  // Client-side pagination logic
  const total = subtests.length
  const totalPages = Math.ceil(total / limit)
  const paginatedSubtests = subtests.slice((page - 1) * limit, page * limit)

  React.useEffect(() => {
    async function fetchPackages() {
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
    }
    fetchPackages()
  }, [])
  
  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header & Aksi */}
        <header className="flex flex-col gap-4 rounded-3xl border border-border bg-background p-5 sm:p-7 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-surface">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Question Packages
            </p>
            <h1 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl text-headline">
              Manajemen <span className="text-primary">Subtes</span>
            </h1>
            <p className="mt-1 text-sm text-body">
              Kelola wadah paket soal (subtes) dan unggah soal melalui format Excel.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button variant="secondary" className="gap-2 rounded-xl">
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              Template Excel
            </Button>
            <Link href="/admin/questions/subtests/create">
              <Button className="w-full gap-2 rounded-xl sm:w-auto">
                <Plus className="h-4 w-4" />
                Tambah Subtes
              </Button>
            </Link>
          </div>
        </header>

        {/* Table/List Area */}
        <div className="rounded-3xl border border-border bg-background p-1 shadow-sm dark:bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-body">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold">No</th>
                  <th scope="col" className="px-6 py-4 font-bold">Nama Subtes / Paket</th>
                  <th scope="col" className="px-6 py-4 font-bold">Kategori</th>
                  <th scope="col" className="px-6 py-4 font-bold">Total Soal</th>
                  <th scope="col" className="px-6 py-4 font-bold">Tanggal Dibuat</th>
                  <th scope="col" className="px-6 py-4 font-bold">Terakhir Diubah</th>
                  <th scope="col" className="px-6 py-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted">
                      Memuat daftar paket soal...
                    </td>
                  </tr>
                ) : subtests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted">
                      Belum ada paket subtes yang dibuat.
                    </td>
                  </tr>
                ) : (
                  paginatedSubtests.map((st, i) => (
                    <tr key={st.id} className="transition-colors hover:bg-muted/5">
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-headline">{((page - 1) * limit) + i + 1}</td>
                      <td className="px-6 py-4 font-bold text-headline">{st.packageCode}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                          {st.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">{st.totalQuestions} Soal</td>
                      <td className="px-6 py-4">
                        {new Date(st.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(st.updatedAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-center relative">
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === st.id ? null : st.id)}
                          className="rounded-lg p-2 text-muted hover:bg-border/50 hover:text-headline transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        
                        {/* Menu Dropdown */}
                        {activeDropdown === st.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setActiveDropdown(null)} 
                            />
                            <div className="absolute right-6 top-12 z-20 w-36 rounded-xl border border-border bg-background p-1.5 shadow-lg dark:bg-surface">
                              <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-headline hover:bg-muted/10">
                                Detail
                              </button>
                              <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-headline hover:bg-muted/10">
                                Edit
                              </button>
                              <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                                Hapus
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-5 sm:p-6 border-t border-border">
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
          </div>
        </div>
      </div>
    </section>
  )
}
