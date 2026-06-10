'use client'

import * as React from 'react'
import { MoreHorizontal } from 'lucide-react'
import { AdminTable, AdminTableHeader, AdminTableBody } from '@/components/molecules'
import { AdminTableHead, AdminTableRow, AdminTableCell } from '@/components/atoms'

export interface SubtestPackage {
  id: string
  packageCode: string
  category: string
  totalQuestions: number
  createdAt: string
  updatedAt: string
}

interface AdminSubtestsTableProps {
  subtests: SubtestPackage[]
  isLoading: boolean
  page: number
  limit: number
  activeDropdown: { id: string; top: number; right: number } | null
  setActiveDropdown: (val: { id: string; top: number; right: number } | null) => void
}

export function AdminSubtestsTable({
  subtests,
  isLoading,
  page,
  limit,
  activeDropdown,
  setActiveDropdown
}: AdminSubtestsTableProps) {
  return (
    <AdminTable>
      <AdminTableHeader>
        <AdminTableRow>
          <AdminTableHead>No</AdminTableHead>
          <AdminTableHead>Nama Subtes / Paket</AdminTableHead>
          <AdminTableHead>Kategori</AdminTableHead>
          <AdminTableHead>Total Soal</AdminTableHead>
          <AdminTableHead>Tanggal Dibuat</AdminTableHead>
          <AdminTableHead>Terakhir Diubah</AdminTableHead>
          <AdminTableHead className="text-right">Aksi</AdminTableHead>
        </AdminTableRow>
      </AdminTableHeader>
      <AdminTableBody>
        {isLoading ? (
          <AdminTableRow>
            <AdminTableCell colSpan={7} className="px-6 py-12 text-center text-muted">
              Memuat daftar paket soal...
            </AdminTableCell>
          </AdminTableRow>
        ) : subtests.length === 0 ? (
          <AdminTableRow>
            <AdminTableCell colSpan={7} className="px-6 py-12 text-center text-muted">
              Belum ada paket subtes yang ditemukan.
            </AdminTableCell>
          </AdminTableRow>
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
        {!isLoading && subtests.length > 0 && limit > subtests.length && (
          Array.from({ length: limit - subtests.length }).map((_, i) => (
            <AdminTableRow key={`empty-${i}`} className="h-[65px] hover:bg-transparent">
              <AdminTableCell colSpan={7} className="text-transparent border-0">&nbsp;</AdminTableCell>
            </AdminTableRow>
          ))
        )}
      </AdminTableBody>
    </AdminTable>
  )
}
