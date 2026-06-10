'use client'

import * as React from 'react'
import { ClipboardList } from 'lucide-react'

export function AdminTryoutsView() {
  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header halaman */}
        <div className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-7 dark:bg-surface">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="mt-2 flex items-center gap-3 font-display text-3xl font-black leading-tight sm:text-4xl text-headline">
                <ClipboardList className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                Manajemen <span className="text-primary">Try Out</span>
              </h1>
              <p className="mt-2 text-base font-medium text-muted">
                Kelola paket Try Out dan integrasi subtes.
              </p>
            </div>
          </div>
        </div>
        
        <div className="rounded-3xl border border-border bg-background p-8 text-center text-sm font-bold text-muted shadow-sm dark:bg-surface">
          Fitur Manajemen Try Out sedang dalam pengembangan.
        </div>
      </div>
    </section>
  )
}
