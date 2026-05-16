/**
 * Halaman placeholder — akan digantikan oleh U0_Landing_Page.md.
 * Hanya untuk memverifikasi bahwa design system dan font berjalan dengan benar.
 *
 * Server Component (default) — tidak perlu "use client".
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 mb-12 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
          <span className="text-white font-display font-black text-2xl">U</span>
        </div>
        <h1 className="font-display text-4xl font-black text-headline text-center leading-tight">
          Umbuddy
        </h1>
        <p className="text-body text-center max-w-sm">
          Design System Phase 0 — sedang dibangun 🚀
        </p>
      </div>

      {/* Design Token Preview */}
      <div className="w-full max-w-2xl space-y-6">

        {/* Buttons */}
        <section className="card space-y-3">
          <h2 className="font-display font-bold text-headline text-lg">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary">Ayo Lanjut! →</button>
            <button className="btn-secondary">Kembali</button>
            <button className="btn-danger">Hapus</button>
            <button className="btn-ghost">Lewati</button>
          </div>
        </section>

        {/* Colors */}
        <section className="card space-y-3">
          <h2 className="font-display font-bold text-headline text-lg">Color Tokens</h2>
          <div className="flex flex-wrap gap-2">
            <div className="w-12 h-12 rounded-lg bg-primary border border-border" title="#74C332" />
            <div className="w-12 h-12 rounded-lg bg-[#155D27]" title="#155D27" />
            <div className="w-12 h-12 rounded-lg bg-[#FFC300] border border-border" title="#FFC300" />
            <div className="w-12 h-12 rounded-lg bg-[#FF6B6B]" title="#FF6B6B" />
            <div className="w-12 h-12 rounded-lg bg-surface border border-border" title="#F3F4F6" />
            <div className="w-12 h-12 rounded-lg bg-[#1F2937]" title="#1F2937" />
            <div className="w-12 h-12 rounded-lg bg-[#0F172A]" title="#0F172A" />
          </div>
        </section>

        {/* Progress Bar */}
        <section className="card space-y-3">
          <h2 className="font-display font-bold text-headline text-lg">XP Progress Bar</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-display font-bold text-body">
              <span>Staf Muda</span>
              <span className="text-primary">1.250 / 2.000 XP</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: '62.5%' }} />
            </div>
          </div>
        </section>

        {/* Chips & Badges */}
        <section className="card space-y-3">
          <h2 className="font-display font-bold text-headline text-lg">Gamification Chips</h2>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="xp-chip">⚡ +25 XP</span>
            <span className="streak-badge">🔥 7 hari</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-light border border-primary text-primary-dark font-display font-bold text-sm">
              🏅 Staf Pratama
            </span>
          </div>
        </section>

        {/* Answer Options */}
        <section className="card space-y-3">
          <h2 className="font-display font-bold text-headline text-lg">Answer Options</h2>
          <div className="space-y-2">
            <button className="answer-option">
              <span className="font-display font-bold text-primary min-w-[1.5rem]">A.</span>
              <span>Pancasila sebagai dasar negara Indonesia</span>
            </button>
            <button className="answer-option selected">
              <span className="font-display font-bold text-primary min-w-[1.5rem]">B.</span>
              <span>Undang-Undang Dasar 1945 (dipilih)</span>
            </button>
            <button className="answer-option correct">
              <span className="font-display font-bold text-primary min-w-[1.5rem]">C.</span>
              <span>✓ Jawaban benar</span>
            </button>
            <button className="answer-option wrong">
              <span className="font-display font-bold text-error-dark min-w-[1.5rem]">D.</span>
              <span>✗ Jawaban salah</span>
            </button>
          </div>
        </section>

        {/* Typography */}
        <section className="card space-y-2">
          <h2 className="font-display font-bold text-headline text-lg">Typography</h2>
          <p className="font-display text-3xl font-black text-headline">Heading — Nunito Black</p>
          <p className="font-sans text-base text-body leading-relaxed">
            Body text menggunakan Inter. Cocok untuk soal panjang TWK tentang Pancasila dan UUD 1945.
            Line-height lega agar tidak membuat pusing saat membaca soal yang banyak.
          </p>
          <p className="font-sans text-sm text-muted">Teks muted — untuk keterangan tambahan</p>
        </section>

        {/* Skeleton */}
        <section className="card space-y-3">
          <h2 className="font-display font-bold text-headline text-lg">Skeleton Loader</h2>
          <div className="space-y-2">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-5 w-1/2" />
            <div className="skeleton h-5 w-5/6" />
          </div>
        </section>
      </div>

      <p className="mt-12 text-sm text-muted text-center">
        Phase 0 selesai ✅ — Siap lanjut ke Landing Page (U0)
      </p>
    </main>
  )
}
