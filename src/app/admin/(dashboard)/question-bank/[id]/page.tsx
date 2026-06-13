import { AdminQuestionDetailFlow } from '@/features/admin-question-bank/admin-question-detail-flow'

export const metadata = {
  title: 'Detail Soal | Backoffice Umbuddy',
  description: 'Preview tampilan soal seperti yang muncul di sisi pengguna.',
}

export default async function AdminQuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Route detail soal meneruskan ID ke flow server agar page tetap tipis.
  const resolvedParams = await params

  return <AdminQuestionDetailFlow questionId={resolvedParams.id} />
}
