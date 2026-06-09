'use client'

import * as React from 'react'

export function AdminQuestionsImportView() {
  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-border bg-background p-5 sm:p-7 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-surface">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Bulk Action
            </p>
            <h1 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl text-headline">
              Import <span className="text-primary">Excel</span>
            </h1>
            <p className="mt-1 text-sm text-body">
              Import soal sekaligus menggunakan file spreadsheet.
            </p>
          </div>
        </header>
        
        <div className="rounded-3xl border border-border bg-background p-8 text-center text-sm font-bold text-muted shadow-sm dark:bg-surface">
          Fitur Import Excel sedang dalam pengembangan.
        </div>
      </div>
    </section>
  )
}
