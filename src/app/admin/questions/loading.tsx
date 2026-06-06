import { AdminRouteLoadingSkeleton } from '@/components/templates'

// Skeleton route admin questions memberi feedback instan saat guard dan query awal berjalan.
export default function AdminQuestionsLoading() {
  return <AdminRouteLoadingSkeleton variant="questions" />
}
