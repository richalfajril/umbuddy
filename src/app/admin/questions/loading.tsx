import { AdminQuestionsLoadingContent } from '@/components/templates/route-loading-skeleton'

// Skeleton route admin questions menjaga konten stabil saat data awal dimuat.
export default function AdminQuestionsLoading() {
  return (
    <section className="min-h-screen bg-background px-4 py-6 text-headline sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminQuestionsLoadingContent />
      </div>
    </section>
  )
}
