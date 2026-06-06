import { UserRouteLoadingSkeleton } from '@/components/templates'

// Skeleton route dashboard dipakai saat auth guard dan data personal user sedang dimuat.
export default function DashboardLoading() {
  return <UserRouteLoadingSkeleton variant="dashboard" />
}
