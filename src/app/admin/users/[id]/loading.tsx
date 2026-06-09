import { AdminUserDetailLoadingContent } from '@/components/templates'

// Skeleton route detail user admin menjaga sub-page tetap responsif saat profil dimuat.
export default function AdminUserDetailLoading() {
  return (
    <section className="min-h-screen bg-background px-4 py-6 text-headline sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <AdminUserDetailLoadingContent />
      </div>
    </section>
  )
}
