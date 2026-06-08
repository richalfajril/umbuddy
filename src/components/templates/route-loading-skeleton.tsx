type UserRouteLoadingVariant = 'dashboard' | 'practice'
type AdminRouteLoadingVariant = 'dashboard' | 'questions'

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

// Skeleton dashboard user meniru grid kartu utama agar navigasi terasa langsung merespons.
function UserDashboardLoadingContent() {
  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 xl:grid-cols-12">
      <SkeletonBlock className="h-44 xl:col-span-5" />
      <SkeletonBlock className="h-44 xl:col-span-3" />
      <SkeletonBlock className="h-44 xl:col-span-4" />
      <SkeletonBlock className="h-56 xl:col-span-5" />
      <SkeletonBlock className="h-56 xl:col-span-4" />
      <SkeletonBlock className="h-56 xl:col-span-3" />
      <SkeletonBlock className="h-64 xl:col-span-6" />
      <SkeletonBlock className="h-64 xl:col-span-3" />
      <SkeletonBlock className="h-64 xl:col-span-3" />
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
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border bg-background px-5 py-6 lg:block">
      <SkeletonBlock className="h-12 w-40" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-12 w-full rounded-xl" />
        ))}
      </div>
      <SkeletonBlock className="absolute bottom-6 left-5 right-5 h-16 rounded-2xl" />
    </aside>
  )
}

// Konten skeleton admin dashboard meniru hero dan kartu ringkasan backoffice.
export function AdminDashboardLoadingContent() {
  return (
    <>
      <SkeletonBlock className="h-44 w-full rounded-3xl" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-36 rounded-3xl" />
        ))}
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <SkeletonBlock className="h-64 rounded-3xl" />
        <SkeletonBlock className="h-64 rounded-3xl" />
      </div>
    </>
  )
}

// Konten skeleton admin questions meniru filter, tabel, dan form create draft.
export function AdminQuestionsLoadingContent() {
  return (
    <>
      <SkeletonBlock className="h-40 w-full rounded-3xl" />
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
            <SkeletonBlock className="h-11 rounded-xl" />
            <SkeletonBlock className="h-11 rounded-xl" />
            <SkeletonBlock className="h-11 rounded-xl" />
            <SkeletonBlock className="h-11 rounded-xl" />
          </div>
          <div className="mt-5 space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-14 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
          <SkeletonBlock className="h-4 w-28" />
          <SkeletonBlock className="mt-4 h-7 w-48" />
          <div className="mt-5 grid gap-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-11 rounded-xl" />
            ))}
          </div>
        </div>
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
      <main className="px-4 py-6 sm:px-6 lg:pl-80 lg:pr-8 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          {variant === 'questions' ? <AdminQuestionsLoadingContent /> : <AdminDashboardLoadingContent />}
        </div>
      </main>
    </div>
  )
}
