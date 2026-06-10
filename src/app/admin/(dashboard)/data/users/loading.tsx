import { AdminUsersLoadingContent } from '@/components/templates'

// Skeleton route admin users menampilkan struktur halaman saat data awal pengguna dimuat.
export default function AdminUsersLoading() {
  return (
    <section className="min-h-screen bg-background px-4 py-6 text-headline sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminUsersLoadingContent />
      </div>
    </section>
  )
}
