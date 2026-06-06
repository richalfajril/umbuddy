// Skeleton route admin questions agar navigasi terasa responsif saat data awal sedang dimuat.
export default function AdminQuestionsLoading() {
  return (
    <div className="min-h-screen bg-background text-headline lg:pl-72">
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header skeleton meniru struktur halaman Kelola Soal. */}
          <div className="rounded-2xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
            <div className="h-4 w-36 animate-pulse rounded-full bg-surface-hover" />
            <div className="mt-4 h-8 w-64 animate-pulse rounded-xl bg-surface-hover" />
            <div className="mt-3 h-4 max-w-xl animate-pulse rounded-full bg-surface-hover" />
          </div>

          {/* Grid skeleton list + form memberi feedback layout akhir sejak awal navigasi. */}
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="rounded-2xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
              <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
                <div className="h-11 animate-pulse rounded-xl bg-surface-hover" />
                <div className="h-11 animate-pulse rounded-xl bg-surface-hover" />
                <div className="h-11 animate-pulse rounded-xl bg-surface-hover" />
                <div className="h-11 animate-pulse rounded-xl bg-surface-hover" />
              </div>
              <div className="mt-5 space-y-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-14 animate-pulse rounded-xl bg-surface-hover" />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
              <div className="h-4 w-28 animate-pulse rounded-full bg-surface-hover" />
              <div className="mt-4 h-7 w-48 animate-pulse rounded-xl bg-surface-hover" />
              <div className="mt-5 grid gap-3">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-11 animate-pulse rounded-xl bg-surface-hover" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
