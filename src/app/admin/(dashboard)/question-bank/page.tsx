import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminQuestionService } from '@/server/admin-questions'
import { AdminQuestionBankFlow } from '@/features/admin-question-bank'

export const metadata: Metadata = {
  title: 'Bank Soal | Backoffice Umbuddy',
  description: 'Manajemen seluruh bank soal, publikasi, dan pengaturan kesulitan.',
}

export default async function AdminQuestionBankPage() {
  const session = await AdminAuthService.getCurrentAdmin()
  if (!session) return redirect('/admin/login')

  const initialData = await AdminQuestionService.listQuestions(session.admin, {
    page: 1,
    page_size: 20,
  })

  // We parse the result into simple objects because Server Components to Client Component props
  // must be plain JSON-serializable objects.
  const serializedData = JSON.parse(JSON.stringify(initialData))

  return <AdminQuestionBankFlow initialData={serializedData} />
}
