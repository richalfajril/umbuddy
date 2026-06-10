import { AdminDashboardLoadingContent } from '@/components/templates/route-loading-skeleton'

// Skeleton route admin dashboard menjaga konten stabil saat data awal dimuat.
export default function AdminDashboardLoading() {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        <AdminDashboardLoadingContent />
      </div>
    </section>
  )
}
