import {
  AppProgressTopBar,
  type AppProgressTopBarProps,
} from "@/components/organisms";

// Adapter dashboard agar import lama tetap stabil saat top bar dipakai lintas halaman app.
export function DashboardTopBar(props: AppProgressTopBarProps) {
  return <AppProgressTopBar {...props} />;
}
