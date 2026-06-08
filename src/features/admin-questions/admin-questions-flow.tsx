import { redirect } from 'next/navigation'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminQuestionService } from '@/server/admin-questions'
import { AdminQuestionsView } from './_components'

// Flow server A2 memastikan hanya admin aktif yang bisa membuka question management.
export async function AdminQuestionsFlow() {
  const session = await AdminAuthService.getCachedCurrentAdmin()

  if (!session) {
    redirect('/admin/login')
  }

  // Initial data dibuat ringan agar navigasi ke Kelola Soal terasa cepat.
  const data = await AdminQuestionService.listQuestions(session.admin, {
    page: 1,
    page_size: 10,
  })

  return (
    <AdminQuestionsView
      initialQuestions={data.questions}
      initialTotal={data.total}
    />
  )
}
