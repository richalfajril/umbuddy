'use client'

import * as React from 'react'
import { Button, Card } from '@/components/ui'

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
  /** Overlay status blocking, misalnya saat timer habis dan jawaban diproses */
  statusOverlay?: React.ReactNode
}

interface FocusExamSubmitModalProps {
  isOpen: boolean
  emptyCount: number
  flaggedCount: number
  answeredCount: number
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: () => void
}

function getSubmitHeadline(emptyCount: number, flaggedCount: number) {
  if (emptyCount > 0 && flaggedCount > 0) {
    return 'Masih ada soal kosong dan ragu-ragu, kumpulkan sekarang?'
  }

  if (emptyCount > 0) {
    return 'Masih ada soal kosong, kumpulkan sekarang?'
  }

  if (flaggedCount > 0) {
    return 'Masih ada soal ragu-ragu, kumpulkan sekarang?'
  }

  return 'Semua jawaban sudah siap dikumpulkan?'
}

function getSubmitMicrocopy(emptyCount: number, flaggedCount: number) {
  const baseCopy = 'Pastikan semua soal telah terjawab. Jawaban yang sudah dikumpulkan tidak dapat diubah lagi.'

  if (emptyCount > 0 && flaggedCount > 0) {
    return `Kamu masih punya soal kosong dan ragu-ragu. Cek kembali kalau ingin menuntaskannya dulu. ${baseCopy}`
  }

  if (emptyCount > 0) {
    return `Kamu masih punya soal kosong. Soal kosong akan dihitung salah. ${baseCopy}`
  }

  if (flaggedCount > 0) {
    return `Kamu masih menandai beberapa soal ragu-ragu. ${baseCopy}`
  }

  return baseCopy
}

export function FocusExamSubmitModal({
  isOpen,
  emptyCount,
  flaggedCount,
  answeredCount,
  isSubmitting = false,
  onClose,
  onSubmit,
}: FocusExamSubmitModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/45 px-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="submit-exam-title"
      aria-describedby="submit-exam-description"
    >
      <Card padding="lg" className="w-full max-w-lg space-y-5 text-center shadow-elevated">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Konfirmasi</p>
          <h2 id="submit-exam-title" className="mt-2 font-display text-2xl font-black leading-tight text-headline">
            {getSubmitHeadline(emptyCount, flaggedCount)}
          </h2>
          <p id="submit-exam-description" className="mt-3 text-sm font-bold leading-6 text-body">
            {getSubmitMicrocopy(emptyCount, flaggedCount)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-left">
          <div className="rounded-2xl border-2 border-border bg-background p-3 dark:bg-surface">
            <div className="flex items-center gap-2 text-xs font-black text-muted">
              <span className="h-3 w-3 rounded border border-border bg-background dark:bg-surface" />
              Kosong
            </div>
            <p className="mt-2 font-display text-2xl font-black text-headline">{emptyCount}</p>
          </div>
          <div className="rounded-2xl border-2 border-xp/60 bg-xp-light p-3">
            <div className="flex items-center gap-2 text-xs font-black text-headline">
              <span className="h-3 w-3 rounded bg-xp" />
              Ragu-Ragu
            </div>
            <p className="mt-2 font-display text-2xl font-black text-headline">{flaggedCount}</p>
          </div>
          <div className="rounded-2xl border-2 border-primary/50 bg-primary-light p-3">
            <div className="flex items-center gap-2 text-xs font-black text-primary-dark">
              <span className="h-3 w-3 rounded bg-primary" />
              Terjawab
            </div>
            <p className="mt-2 font-display text-2xl font-black text-primary-dark">{answeredCount}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cek Kembali
          </Button>
          <Button type="button" onClick={onSubmit} isLoading={isSubmitting} loadingLabel="Mengumpulkan...">
            Kumpulkan
          </Button>
        </div>
      </Card>
    </div>
  )
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
  statusOverlay,
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

      {questionNavigator && mobileNavigatorOpen && onMobileNavigatorToggle && (
        <div className="fixed inset-0 z-[70] bg-black/35 p-4 pt-24 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigasi soal">
          <div className="mx-auto max-h-[78vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-5 shadow-elevated dark:bg-surface">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={onMobileNavigatorToggle}
                aria-label="Tutup navigasi soal"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-lg font-black text-headline transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-background"
              >
                ×
              </button>
            </div>
            {questionNavigator}
          </div>
        </div>
      )}

      {/* Konten soal + jawaban — scrollable di mobile */}
      <main className="flex-1 overflow-y-auto lg:p-6">
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

      {statusOverlay}
    </div>
  )
}
