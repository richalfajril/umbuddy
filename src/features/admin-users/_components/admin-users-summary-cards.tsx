'use client'

import * as React from 'react'
import { Users, Activity, UserPlus, ShieldAlert } from 'lucide-react'
import type { AdminUserSummaryStats } from '../_types/admin-users.types'

interface AdminUsersSummaryCardsProps {
  initialStats?: AdminUserSummaryStats
}

// Kartu ringkasan pengguna menerima data SSR agar navigasi admin tidak menunggu fetch kedua.
export function AdminUsersSummaryCards({ initialStats }: AdminUsersSummaryCardsProps) {
  const [stats, setStats] = React.useState<AdminUserSummaryStats | null>(initialStats ?? null)
  const [isLoading, setIsLoading] = React.useState(!initialStats)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    // Hindari waterfall client-fetch ketika server sudah mengirim statistik awal.
    if (initialStats) return

    async function fetchStats() {
      try {
        const res = await fetch('/api/v1/admin/users/summary')
        if (!res.ok) throw new Error('Gagal memuat ringkasan')
        const json = await res.json()
        setStats(json.data)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [initialStats])

  if (error) {
    return (
      <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
        Gagal memuat ringkasan statistik pengguna. Silakan muat ulang halaman.
      </div>
    )
  }

  const isDataLoading = isLoading || !stats
  const renderValue = (value: number | undefined) => {
    if (isDataLoading || typeof value !== 'number') {
      return <span className="block h-8 w-20 animate-pulse rounded-lg bg-border" aria-label="Memuat data" />
    }

    return value.toLocaleString('id-ID')
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <p className="text-sm font-semibold text-muted">Total Pengguna</p>
          <div className="rounded-lg bg-primary/10 p-2">
            <Users className="h-4 w-4 text-primary" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-headline">{renderValue(stats?.totalUsers)}</h3>
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="mb-1 flex items-start justify-between">
          <p className="text-sm font-semibold text-muted">Aktif 7 Hari</p>
          <div className="rounded-lg bg-green-500/10 p-2">
            <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h3 className="mb-1 text-2xl font-black text-headline">{renderValue(stats?.activeLast7Days)}</h3>
        <p className="text-xs font-semibold text-muted/70">Berdasarkan sesi login terbaru</p>
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <p className="text-sm font-semibold text-muted">Pengguna Baru (30h)</p>
          <div className="rounded-lg bg-blue-500/10 p-2">
            <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-headline">{renderValue(stats?.newLast30Days)}</h3>
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <p className="text-sm font-semibold text-muted">Ditangguhkan</p>
          <div className="rounded-lg bg-red-500/10 p-2">
            <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-headline">{renderValue(stats?.suspendedUsers)}</h3>
      </div>
    </div>
  )
}
