'use client'

import * as React from 'react'
import { ClipboardList } from 'lucide-react'
import { AdminPageHeader } from '@/components/organisms'

export function AdminTryoutsView() {
  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header halaman */}
        <AdminPageHeader
          icon={<ClipboardList className="h-6 w-6 text-primary" />}
          eyebrow="Try Out"
          title={<>Manajemen <span className="text-primary">Try Out</span></>}
          description="Kelola paket Try Out dan integrasi subtes."
        />
        
        <div className="rounded-3xl border border-border bg-background p-8 text-center text-sm font-bold text-muted shadow-sm dark:bg-surface">
          Fitur Manajemen Try Out sedang dalam pengembangan.
        </div>
      </div>
    </section>
  )
}
