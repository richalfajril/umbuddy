'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  BarChart3, 
  FileEdit, 
  Upload, 
  CheckCircle, 
  Archive, 
  AlertTriangle, 
  HelpCircle,
  FileText,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react'

// Tipe metrik sesuai yang direturn dari service
export type AdminDashboardMetrics = {
  total: number
  draft: number
  published: number
  archived: number
  invalid: number
  distributionCategory: { category: string; count: number }[]
  distributionMaterial: { name: string; count: number }[]
  noExplanation: number
  withImages: number
  tkpIncompleteWeights: number
  recentQuestions: Array<{
    id: string
    category: string
    package_code: string
    number: number
    status: string
    created_at: Date
  }>
}

export function AdminDashboardSoalView({ metrics }: { metrics: AdminDashboardMetrics }) {
  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-border bg-background p-5 sm:p-7 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-surface">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Overview
            </p>
            <h1 className="mt-1 text-2xl font-black text-headline">
              Dashboard <span className="text-primary">Soal</span>
            </h1>
            <p className="mt-1 text-sm text-body">
              Ringkasan performa dan metrik bank soal Anda.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/questions/import"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-bold text-headline transition-colors hover:bg-surface hover:text-primary dark:bg-surface dark:hover:bg-background"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Excel
            </Link>
            <Link
              href="/admin/questions/bank"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <FileEdit className="mr-2 h-4 w-4" />
              Kelola Soal
            </Link>
          </div>
        </header>
        
        {/* Top Metrics Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex flex-col gap-1 rounded-2xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
            <div className="flex items-center gap-2 text-sm font-bold text-muted">
              <BarChart3 className="h-4 w-4 text-primary" />
              Total Soal
            </div>
            <p className="text-3xl font-black text-headline">{metrics.total}</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
            <div className="flex items-center gap-2 text-sm font-bold text-muted">
              <FileEdit className="h-4 w-4 text-amber-500" />
              Draft
            </div>
            <p className="text-3xl font-black text-headline">{metrics.draft}</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
            <div className="flex items-center gap-2 text-sm font-bold text-muted">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Published
            </div>
            <p className="text-3xl font-black text-headline">{metrics.published}</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
            <div className="flex items-center gap-2 text-sm font-bold text-muted">
              <Archive className="h-4 w-4 text-slate-500" />
              Archived
            </div>
            <p className="text-3xl font-black text-headline">{metrics.archived}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Distribusi Kategori */}
          <div className="rounded-2xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
            <h2 className="mb-4 text-sm font-bold text-headline">Distribusi Kategori</h2>
            <div className="space-y-3">
              {metrics.distributionCategory.length === 0 ? (
                <p className="text-sm text-muted">Belum ada soal.</p>
              ) : (
                metrics.distributionCategory.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-body">{cat.category}</span>
                    <span className="rounded-full bg-surface px-2 py-1 text-xs font-bold text-headline dark:bg-background">
                      {cat.count} soal
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Distribusi Materi Top 5 */}
          <div className="rounded-2xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
            <h2 className="mb-4 text-sm font-bold text-headline">Distribusi Materi Terbanyak</h2>
            <div className="space-y-3">
              {metrics.distributionMaterial.length === 0 ? (
                <p className="text-sm text-muted">Belum ada materi terdistribusi.</p>
              ) : (
                metrics.distributionMaterial.slice(0, 5).map((mat) => (
                  <div key={mat.name} className="flex items-center justify-between">
                    <span className="truncate pr-4 text-sm font-medium text-body">{mat.name}</span>
                    <span className="shrink-0 rounded-full bg-surface px-2 py-1 text-xs font-bold text-headline dark:bg-background">
                      {mat.count} soal
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Quality Metrics */}
          <div className="rounded-2xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
            <h2 className="mb-4 text-sm font-bold text-headline">Indikator Kualitas</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-headline">Laporan Invalid / Bermasalah</span>
                </div>
                <span className="font-black text-red-500">{metrics.invalid}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-medium text-headline">Soal Tanpa Pembahasan</span>
                </div>
                <span className="font-black text-amber-500">{metrics.noExplanation}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-headline">Soal TKP Bobot Tidak Lengkap</span>
                </div>
                <span className="font-black text-muted">
                  {metrics.tkpIncompleteWeights < 0 ? 'Belum Tersedia' : metrics.tkpIncompleteWeights}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-headline">Soal Mengandung Gambar</span>
                </div>
                <span className="font-black text-muted">
                  {metrics.withImages < 0 ? 'Belum Tersedia' : metrics.withImages}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Created */}
          <div className="rounded-2xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
            <h2 className="mb-4 text-sm font-bold text-headline">Soal Baru Ditambahkan</h2>
            <div className="space-y-3">
              {metrics.recentQuestions.length === 0 ? (
                <p className="text-sm text-muted">Belum ada soal terbaru.</p>
              ) : (
                metrics.recentQuestions.map((q) => (
                  <div key={q.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-headline">{q.package_code} - #{q.number}</span>
                        <span className="text-xs font-medium text-muted">{q.category}</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-surface px-2 py-1 text-xs font-bold uppercase text-headline dark:bg-background">
                      {q.status}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Link 
                href="/admin/questions/bank"
                className="text-sm font-bold text-primary hover:underline"
              >
                Lihat Semua &rarr;
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
