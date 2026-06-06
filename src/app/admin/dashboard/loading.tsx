import { AdminRouteLoadingSkeleton } from '@/components/templates'

// Skeleton route admin dashboard menjaga shell backoffice stabil ketika sesi admin dicek.
export default function AdminDashboardLoading() {
  return <AdminRouteLoadingSkeleton variant="dashboard" />
}
