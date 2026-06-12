import type { Metadata } from 'next'
import { AdminSubtestDetailFlow } from '@/features/admin-subtests/admin-subtest-detail-flow'

export const metadata: Metadata = {
  title: 'Detail Subtes | Umbuddy Admin',
  description: 'Lihat daftar soal dalam satu paket subtes.',
}

export default async function AdminSubtestDetailPage({
  params,
}: {
  params: Promise<{ packageCode: string }>
}) {
  const { packageCode } = await params
  return <AdminSubtestDetailFlow packageCode={packageCode} />
}
