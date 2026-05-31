import { AdminDashboardFlow } from '@/features/admin-dashboard/admin-dashboard-flow'

// Route dashboard admin tetap tipis dan mendelegasikan guard ke feature flow.
export default function AdminDashboardPage() {
  return <AdminDashboardFlow />
}
