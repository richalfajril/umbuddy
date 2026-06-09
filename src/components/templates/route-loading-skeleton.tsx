type UserRouteLoadingVariant = 'dashboard' | 'practice'
type AdminRouteLoadingVariant = 'dashboard' | 'questions' | 'users'

type SkeletonBlockProps = {
  className: string
}

// Blok skeleton kecil dipakai ulang agar shimmer/loading visual konsisten.
function SkeletonBlock({ className }: SkeletonBlockProps) {
  return <div className={`animate-pulse rounded-2xl bg-surface-hover ${className}`} />
}

// Sidebar skeleton user meniru struktur navigasi aplikasi utama tanpa interaksi.
function UserSidebarSkeleton() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-20 border-r border-border bg-background px-3 py-5 lg:block">
      <SkeletonBlock className="mx-auto h-12 w-12 rounded-2xl" />
      <div className="mt-10 space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonBlock key={index} className="mx-auto h-11 w-11 rounded-2xl" />
        ))}
      </div>
      <SkeletonBlock className="absolute bottom-5 left-1/2 h-11 w-11 -translate-x-1/2 rounded-2xl" />
    </aside>
  )
}

// Top bar skeleton user menjaga area progress tetap stabil saat route dinamis dimuat.
function UserTopBarSkeleton() {
  return (
    <header className="rounded-none border-b border-border bg-background px-4 py-4 shadow-sm lg:rounded-b-3xl lg:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <SkeletonBlock className="h-14 w-14 shrink-0 rounded-2xl" />
          <div className="min-w-0 space-y-2">
            <SkeletonBlock className="h-5 w-28" />
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-2 w-44 max-w-[42vw]" />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <SkeletonBlock className="hidden h-8 w-16 sm:block" />
          <SkeletonBlock className="h-8 w-20" />
        </div>
      </div>
    </header>
  )
}

// Skeleton dashboard user menampilkan struktur asli dengan shimmer hanya pada data dari server.
function UserDashboardLoadingContent() {
  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 xl:grid-cols-12">
      <section className="rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface xl:col-span-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Markas Harian</p>
        <SkeletonBlock className="mt-4 h-8 w-48" />
        <SkeletonBlock className="mt-3 h-4 w-64 max-w-full" />
        <SkeletonBlock className="mt-5 h-11 w-44" />
      </section>
      <section className="rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface xl:col-span-3">
        <p className="text-sm font-bold text-headline">Progress Score</p>
        <SkeletonBlock className="mt-3 h-10 w-24" />
        <p className="mt-5 text-sm font-bold text-headline">Target Score</p>
        <SkeletonBlock className="mt-3 h-10 w-24" />
      </section>
      <section className="rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface xl:col-span-4">
        <p className="text-lg font-black text-headline">Teman Online</p>
        <div className="mt-5 grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="grid justify-items-center gap-2">
              <SkeletonBlock className="h-14 w-14 rounded-full" />
              <SkeletonBlock className="h-3 w-12" />
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface xl:col-span-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Tactical Analytics</p>
        <SkeletonBlock className="mt-4 h-7 w-64 max-w-full" />
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-16" />
          ))}
        </div>
      </section>
      <section className="rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface xl:col-span-3">
        <p className="font-display text-xl font-black uppercase text-headline">Daily Missions</p>
        <div className="mt-5 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-10" />
          ))}
        </div>
      </section>
      <section className="rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface xl:col-span-3">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Leaderboard</p>
        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-12" />
          ))}
        </div>
      </section>
    </div>
  )
}

// Skeleton practice meniru layout ujian: header timer, navigator soal, dan kartu soal.
function UserPracticeLoadingContent() {
  return (
    <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface xl:block">
        <SkeletonBlock className="h-5 w-36" />
        <div className="mt-5 grid grid-cols-5 gap-2">
          {Array.from({ length: 25 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-10 rounded-xl" />
          ))}
        </div>
      </aside>
      <section className="rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-8 w-14" />
            <SkeletonBlock className="h-5 w-32" />
          </div>
          <SkeletonBlock className="h-9 w-28" />
        </div>
        <SkeletonBlock className="mt-8 h-28 w-full" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-16 w-full" />
          ))}
        </div>
        <div className="mt-8 flex justify-between gap-3">
          <SkeletonBlock className="h-11 w-44" />
          <SkeletonBlock className="h-11 w-32" />
        </div>
      </section>
    </div>
  )
}

// Skeleton route user dipakai untuk halaman yang melakukan auth guard dan query data.
export function UserRouteLoadingSkeleton({ variant }: { variant: UserRouteLoadingVariant }) {
  return (
    <div className="min-h-screen bg-background text-headline">
      <UserSidebarSkeleton />
      <main className="pb-24 lg:pl-20">
        <UserTopBarSkeleton />
        {variant === 'practice' ? <UserPracticeLoadingContent /> : <UserDashboardLoadingContent />}
      </main>
    </div>
  )
}

// Skeleton onboarding menjaga pengguna melihat struktur form sebelum status onboarding selesai dicek.
export function OnboardingRouteLoadingSkeleton() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10 text-headline">
      <div className="w-full max-w-xl">
        <div className="mx-auto flex w-fit flex-col items-center gap-3">
          <SkeletonBlock className="h-24 w-24 rounded-3xl" />
          <SkeletonBlock className="h-10 w-48" />
        </div>
        <section className="mt-8 rounded-3xl border border-border bg-background p-6 shadow-sm dark:bg-surface sm:p-8">
          <SkeletonBlock className="mx-auto h-7 w-64" />
          <SkeletonBlock className="mx-auto mt-3 h-4 w-80 max-w-full" />
          <div className="mt-8 grid gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-12 w-full" />
            ))}
          </div>
          <SkeletonBlock className="mt-6 h-12 w-full" />
        </section>
      </div>
    </main>
  )
}

// Sidebar skeleton admin memberi shell stabil saat halaman backoffice dinamis dimuat.
function AdminSidebarSkeleton() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border bg-background px-4 py-4 lg:block">
      <SkeletonBlock className="h-10 w-36" />
      <div className="mt-6 space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-11 w-full rounded-xl" />
        ))}
      </div>
      <SkeletonBlock className="absolute bottom-4 left-4 right-4 h-12 rounded-2xl" />
    </aside>
  )
}

// Konten skeleton admin dashboard meniru hero dan kartu ringkasan backoffice.
export function AdminDashboardLoadingContent() {
  return (
    <>
      <section className="rounded-3xl border border-border bg-background p-6 shadow-sm dark:bg-surface">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Umbuddy Backoffice</p>
        <h1 className="mt-3 font-display text-3xl font-black text-headline">
          Markas admin sedang <span className="text-primary">disiapkan</span>
        </h1>
        <SkeletonBlock className="mt-4 h-5 w-80 max-w-full" />
      </section>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {['Total Pengguna', 'Bank Soal', 'Sesi Latihan & Battle'].map((label) => (
          <section key={label} className="rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-muted">{label}</p>
            <SkeletonBlock className="mt-8 h-9 w-20" />
            <SkeletonBlock className="mt-3 h-4 w-28" />
          </section>
        ))}
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-3xl border border-border bg-background p-6 shadow-sm dark:bg-surface">
          <p className="font-display text-xl font-black text-headline">Tren Registrasi Mingguan</p>
          <SkeletonBlock className="mt-8 h-48 rounded-xl" />
        </section>
        <section className="rounded-3xl border border-border bg-background p-6 shadow-sm dark:bg-surface">
          <p className="font-display text-xl font-black text-headline">Distribusi Soal</p>
          <SkeletonBlock className="mx-auto mt-8 h-40 w-40 rounded-full" />
        </section>
      </div>
    </>
  )
}

// Konten skeleton admin questions memakai shimmer hanya untuk total dan row soal dari API.
export function AdminQuestionsLoadingContent() {
  return (
    <>
      <header className="rounded-2xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Question Management</p>
        <h1 className="mt-1 text-2xl font-black text-headline">
          Kurasi <span className="text-primary">Bank Soal</span>
        </h1>
        <SkeletonBlock className="mt-4 h-5 w-32" />
      </header>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
          <p className="text-sm font-black text-headline">Filter Soal</p>
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
            {['Keyword', 'Status', 'Kategori', 'Aksi'].map((label) => (
              <div key={label} className="mt-3 rounded-xl border border-border px-3 py-2 text-sm font-bold text-muted">
                {label}
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-14 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Create Draft</p>
          <h2 className="mt-3 font-display text-xl font-black text-headline">Form draft siap setelah data route selesai.</h2>
          <p className="mt-3 text-sm leading-6 text-body">
            Panel ini tidak memakai skeleton karena form bukan data dari API.
          </p>
        </div>
      </div>
    </>
  )
}

// Konten skeleton admin users memakai label nyata dan shimmer hanya untuk angka/baris data API.
export function AdminUsersLoadingContent() {
  return (
    <>
      <header className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-surface">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">User Management</p>
          <h1 className="mt-1 text-2xl font-black text-headline">
            Direktori <span className="text-primary">Pengguna</span>
          </h1>
          <p className="mt-1 text-sm text-body">Kelola status akun dan metrik pengguna.</p>
        </div>
        <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
          <SkeletonBlock className="h-5 w-24" />
        </div>
      </header>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {['Total Pengguna', 'Aktif 7 Hari', 'Pengguna Baru (30h)', 'Ditangguhkan'].map((label) => (
          <section key={label} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-sm font-semibold text-muted">{label}</p>
            <SkeletonBlock className="mt-4 h-8 w-20" />
          </section>
        ))}
      </div>
      <section className="mt-6 rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5 dark:bg-surface">
        <div className="grid gap-3 md:grid-cols-[1fr_160px_160px_160px_120px_auto]">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-11 rounded-xl" />
          ))}
        </div>
        <div className="mt-5 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.7fr_0.6fr] bg-surface px-6 py-4 text-xs font-black uppercase tracking-wider text-muted">
            <span>User</span>
            <span>Role / Instansi</span>
            <span>Bergabung</span>
            <span>Status</span>
            <span className="text-right">Aksi</span>
          </div>
          <div className="divide-y divide-border bg-background">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="grid grid-cols-[1.4fr_1fr_0.8fr_0.7fr_0.6fr] gap-4 px-6 py-4">
                <SkeletonBlock className="h-10" />
                <SkeletonBlock className="h-8" />
                <SkeletonBlock className="h-8" />
                <SkeletonBlock className="h-8" />
                <SkeletonBlock className="ml-auto h-8 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

// Konten skeleton detail user hanya menandai nilai profil/log yang datang dari API/server.
export function AdminUserDetailLoadingContent() {
  return (
    <>
      <header className="rounded-2xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">User Detail</p>
        <h1 className="mt-1 text-2xl font-black text-headline">
          Detail <span className="text-primary">Profil Pengguna</span>
        </h1>
      </header>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <section className="space-y-4 rounded-2xl border border-border bg-background p-6 shadow-sm dark:bg-surface">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Profil</p>
          <SkeletonBlock className="h-8 w-48" />
          <SkeletonBlock className="h-5 w-64 max-w-full" />
          <SkeletonBlock className="h-5 w-40" />
        </section>
        <section className="rounded-2xl border border-border bg-background p-6 shadow-sm dark:bg-surface md:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Catatan & Aktivitas</p>
          <div className="mt-5 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-16" />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

// Skeleton route admin dipakai untuk halaman backoffice yang butuh guard dan data server.
export function AdminRouteLoadingSkeleton({ variant }: { variant: AdminRouteLoadingVariant }) {
  return (
    <div className="min-h-screen bg-background text-headline">
      <AdminSidebarSkeleton />
      <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur lg:hidden">
        <SkeletonBlock className="h-11 w-11 rounded-xl" />
        <SkeletonBlock className="h-9 w-32 rounded-xl" />
      </header>
      <main className="px-4 py-6 sm:px-6 lg:pl-60 lg:pr-8 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          {variant === 'questions' ? (
            <AdminQuestionsLoadingContent />
          ) : variant === 'users' ? (
            <AdminUsersLoadingContent />
          ) : (
            <AdminDashboardLoadingContent />
          )}
        </div>
      </main>
    </div>
  )
}
