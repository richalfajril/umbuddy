'use client'

import * as React from 'react'

export function AdminTryoutsView() {
  return (
    <section className="min-h-screen bg-background px-4 py-6 text-headline sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-surface">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Try Out
            </p>
            <h1 className="mt-1 text-2xl font-black text-headline">
              Manajemen <span className="text-primary">Try Out</span>
            </h1>
            <p className="mt-1 text-sm text-body">
              Kelola paket Try Out dan integrasi subtes.
            </p>
          </div>
        </header>
        
        <div className="rounded-2xl border border-border bg-background p-8 text-center text-sm font-bold text-muted shadow-sm dark:bg-surface">
          Fitur Manajemen Try Out sedang dalam pengembangan.
        </div>
      </div>
    </section>
  )
}
