import { AdminSubtestEditFlow } from '@/features/admin-subtests/admin-subtest-edit-flow'

export const metadata = {
  title: 'Edit Subtes | Umbuddy Admin',
  description: 'Ubah paket soal dan import ulang dari Excel',
}

export default async function AdminSubtestEditPage({
  params,
}: {
  params: Promise<{ packageCode: string }>
}) {
  // Route edit subtes meneruskan packageCode ke flow server agar page tetap tipis.
  const resolvedParams = await params

  return <AdminSubtestEditFlow packageCode={resolvedParams.packageCode} />
}
