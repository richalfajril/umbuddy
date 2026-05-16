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
  question,
  answerOptions,
  actionFooter,
}: FocusExamLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-dark-background">
      {/* ExamTopBar — sticky, minimalis */}
      <header className="sticky top-0 z-50 w-full bg-background dark:bg-dark-surface border-b border-border dark:border-dark-border">
        {topBar}
      </header>

      {/* Konten soal + jawaban — scrollable di mobile */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Area soal */}
        <div className="w-full max-w-2xl mx-auto px-4 pt-6 pb-2">
          {question}
        </div>

        {/* Pilihan jawaban */}
        <div className="w-full max-w-2xl mx-auto px-4 pb-4 space-y-2">
          {answerOptions}
        </div>
      </main>

      {/* Footer aksi — sticky di bawah */}
      {actionFooter && (
        <footer className="sticky bottom-0 z-10 w-full bg-background dark:bg-dark-surface border-t border-border dark:border-dark-border px-4 py-3 safe-area-bottom">
          <div className="max-w-2xl mx-auto">
            {actionFooter}
          </div>
        </footer>
      )}
    </div>
  )
}
