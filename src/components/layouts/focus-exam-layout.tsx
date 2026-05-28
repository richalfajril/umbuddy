'use client'

import * as React from 'react'

/**
 * FocusExamLayout — Layout zero-distraksi untuk mode ujian/latihan.
 *
 * Digunakan oleh: U2 Practice, U3 CAT Simulation, U8 Friend Battle.
 * Sesuai Layout_Patterns.md: "Focus/Exam Layout"
 *
 * Karakteristik (KRITIS dari UI_UX.md):
 * - ZERO navigasi — tidak ada navbar, sidebar, atau bottom nav
 * - Full screen, tidak ada elemen yang mengalihkan perhatian
 * - ExamTopBar minimalis di atas: progress, timer, tombol keluar
 * - Konten soal di tengah, full width
 * - Area jawaban di bawah konten soal
 * - Background: putih bersih / dark-slate
 *
 * SECURITY NOTE (SECURITY.md):
 * Layout ini tidak boleh expose score atau jawaban benar/salah
 * sebelum user submit. Backend yang menentukan kebenaran jawaban.
 */

interface FocusExamLayoutProps {
  /** ExamTopBar minimalis: progress bar, timer, nomor soal, tombol keluar */
  topBar: React.ReactNode
  /** Top bar khusus desktop untuk layout CAT-style */
  desktopTopBar?: React.ReactNode
  /** Navigator nomor soal khusus desktop */
  questionNavigator?: React.ReactNode
  /** Status panel navigator nomor soal di mobile */
  mobileNavigatorOpen?: boolean
  /** Toggle panel navigator nomor soal di mobile */
  onMobileNavigatorToggle?: () => void
  /** Konten soal utama */
  question: React.ReactNode
  /** Pilihan jawaban */
  answerOptions: React.ReactNode
  /** Footer aksi: tombol Next/Submit/Skip */
  actionFooter?: React.ReactNode
}

/**
 * Layout full-screen zero-distraksi untuk sesi ujian dan latihan.
 * Server Component — state timer dan jawaban di-handle client child.
 */
export function FocusExamLayout({
  topBar,
  desktopTopBar,
  questionNavigator,
  mobileNavigatorOpen = false,
  onMobileNavigatorToggle,
  question,
  answerOptions,
  actionFooter,
}: FocusExamLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface dark:bg-background">
      {/* ExamTopBar — mobile minimalis, desktop CAT-style */}
      <header className="sticky top-0 z-50 w-full">
        <div className="bg-[linear-gradient(110deg,var(--color-primary-dark)_0%,var(--color-primary)_62%,var(--color-xp)_130%)] text-white lg:hidden">
          {topBar}
        </div>
        <div className="hidden bg-[linear-gradient(110deg,var(--color-primary-dark)_0%,var(--color-primary)_58%,var(--color-xp)_125%)] text-white shadow-sm lg:block">
          {desktopTopBar ?? topBar}
        </div>
      </header>

      {questionNavigator && onMobileNavigatorToggle && (
        <div className="mx-auto flex w-full max-w-2xl justify-end px-4 py-4 lg:hidden">
          <button
            type="button"
            onClick={onMobileNavigatorToggle}
            aria-expanded={mobileNavigatorOpen}
            className="flex min-h-[44px] items-center gap-2 rounded-lg border-2 border-primary bg-background px-4 text-base font-black text-primary shadow-sm transition hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="grid gap-1" aria-hidden="true">
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
            </span>
            Navigasi Soal
          </button>
        </div>
      )}

      {/* Konten soal + jawaban — scrollable di mobile */}
      <main className="flex-1 overflow-y-auto lg:p-6">
        {questionNavigator && mobileNavigatorOpen && (
          <div className="mx-auto w-full max-w-2xl px-4 pb-4 lg:hidden">
            <div className="max-h-[58vh] overflow-y-auto rounded-2xl border border-border bg-background p-5 shadow-card">
              {questionNavigator}
            </div>
          </div>
        )}

        <div
          className={[
            'mx-auto w-full',
            questionNavigator
              ? 'grid max-w-[1680px] gap-6 lg:grid-cols-[280px_minmax(0,1fr)]'
              : 'max-w-5xl',
          ].join(' ')}
        >
          {questionNavigator && (
            <aside className="hidden max-h-[calc(100vh-150px)] overflow-y-auto rounded-2xl border border-border bg-background p-5 shadow-card dark:bg-surface lg:block">
              {questionNavigator}
            </aside>
          )}

          <section className="min-w-0">
            {/* Area soal */}
            <div className="mx-auto w-full max-w-2xl px-4 pb-2 pt-6 lg:max-w-none lg:px-0 lg:pt-0">
              {question}
            </div>

            {/* Pilihan jawaban */}
            <div className="mx-auto w-full max-w-2xl space-y-2 px-4 pb-4 lg:max-w-none lg:space-y-4 lg:px-0 lg:pb-0 lg:pt-4">
              {answerOptions}
            </div>

            {actionFooter && (
              <div className="mt-6 hidden border-t border-border pt-5 lg:block">
                {actionFooter}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer aksi — sticky di bawah hanya mobile */}
      {actionFooter && (
        <footer className="safe-area-bottom sticky bottom-0 z-10 w-full border-t border-border bg-background px-4 py-3 lg:hidden">
          <div className="mx-auto max-w-2xl">
            {actionFooter}
          </div>
        </footer>
      )}
    </div>
  )
}
