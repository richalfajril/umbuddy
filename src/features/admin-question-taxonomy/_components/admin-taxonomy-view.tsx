'use client'

import * as React from 'react'
import { CheckCircle2, ChevronRight, XCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { useToastStore } from '@/stores/useToastStore'
import type { AdminSubtest } from '../_types/admin-taxonomy.types'

// View utama untuk memantau hierarki Subtes, Materi, dan Sub-Materi CPNS.
export function AdminTaxonomyView() {
  const [subtests, setSubtests] = React.useState<AdminSubtest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSeeding, setIsSeeding] = React.useState(false)
  const { addToast } = useToastStore()

  const loadTaxonomy = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/v1/admin/question-taxonomy')
      if (!res.ok) throw new Error('Gagal memuat taksonomi')
      const data = await res.json()
      setSubtests(data.taxonomy || [])
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gagal Memuat',
        message: error instanceof Error ? error.message : 'Kesalahan jaringan.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTaxonomy()
  }, [loadTaxonomy])

  const handleSeed = async () => {
    setIsSeeding(true)
    try {
      const res = await fetch('/api/v1/admin/question-taxonomy/seed', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Seeder gagal dieksekusi')
      await loadTaxonomy()
      
      if (data.warnings && data.warnings.length > 0) {
        addToast({
          type: 'warning',
          title: 'Sinkronisasi Selesai',
          message: `${data.warnings[0]}${data.warnings.length > 1 ? ` (+${data.warnings.length - 1} warning lainnya)` : ''}`,
        })
      } else {
        addToast({
          type: 'success',
          title: 'Sinkronisasi Berhasil',
          message: data.created && data.created.length > 0
            ? `${data.created.length} data baru ditambahkan.`
            : 'Taksonomi sudah up-to-date.',
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Sinkronisasi Gagal',
        message: error instanceof Error ? error.message : 'Coba lagi.',
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-border bg-background p-5 sm:p-7 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-surface">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              CPNS Taxonomy
            </p>
            <h1 className="mt-1 text-2xl font-black text-headline">
              Manajemen <span className="text-primary">Subtes & Materi</span>
            </h1>
            <p className="mt-1 text-sm text-body">
              Kelola struktur kategori dan materi soal yang akan muncul di Try Out dan Practice.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleSeed}
            isLoading={isSeeding}
            loadingLabel="Menyinkronkan..."
          >
            Sinkronkan Default CPNS
          </Button>
        </header>

        <div className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-6 dark:bg-surface">
          {isLoading ? (
            <div className="py-12 text-center text-sm font-bold text-muted animate-pulse">
              Memuat hierarki materi...
            </div>
          ) : subtests.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-bold text-muted">Belum ada data taksonomi.</p>
              <p className="mt-1 text-xs text-body">Silakan klik &quot;Sinkronkan Default CPNS&quot;.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subtests.map((subtest) => (
                <div key={subtest.id} className="rounded-xl border border-border overflow-hidden shadow-sm">
                  <div className="flex items-center gap-3 bg-surface p-4">
                    <span className="grid h-8 w-14 shrink-0 place-items-center rounded-lg bg-primary font-black text-white text-xs">
                      {subtest.code}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate font-black text-headline">{subtest.name}</h3>
                      <p className="text-xs text-muted font-bold">Order: {subtest.order}</p>
                    </div>
                    {subtest.is_active ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <XCircle className="h-5 w-5 text-error" />
                    )}
                  </div>
                  
                  {subtest.materials.length > 0 && (
                    <div className="border-t border-border divide-y divide-border bg-background">
                      {subtest.materials.map((material) => (
                        <div key={material.id} className="px-4 py-3 pl-12">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-sm text-headline">{material.name}</p>
                            </div>
                            {material.is_active ? (
                              <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">Active</span>
                            ) : (
                              <span className="text-[10px] font-black uppercase tracking-wider text-muted bg-surface px-2 py-0.5 rounded border border-border">Inactive</span>
                            )}
                          </div>
                          
                          {material.sub_materials.length > 0 && (
                            <ul className="mt-2 space-y-1.5 pl-4 border-l-2 border-border/50">
                              {material.sub_materials.map((subm) => (
                                <li key={subm.id} className="flex items-center gap-2 text-xs text-body">
                                  <ChevronRight className="h-3.5 w-3.5 text-muted shrink-0" />
                                  <span className="font-bold">{subm.name}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
