import { UserRouteLoadingSkeleton } from '@/components/templates'

// Skeleton route dashboard menjaga navigasi user cepat saat data markas sedang disiapkan.
export default function DashboardLoading() {
  return <UserRouteLoadingSkeleton variant="dashboard" />
}
