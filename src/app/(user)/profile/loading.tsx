import { UserRouteLoadingSkeleton } from '@/components/templates'

// Loading profil hanya memberi shimmer pada data user yang masih menunggu server.
export default function ProfileLoading() {
  return <UserRouteLoadingSkeleton variant="profile" />
}
