import { RouteTransition } from "@/components/templates";
import { UserDashboardFlow } from "@/features/user-dashboard/user-dashboard-flow";

export default function DashboardPage() {
  return (
    <RouteTransition>
      <UserDashboardFlow />
    </RouteTransition>
  );
}
