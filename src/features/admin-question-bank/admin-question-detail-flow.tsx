import { redirect } from 'next/navigation'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminQuestionService } from '@/server/admin-questions'
import { AdminQuestionDetailView } from './_components/admin-question-detail-view'

type AdminQuestionDetailFlowProps = {
  questionId: string
}

// Flow server detail soal menjaga guard admin dan query Prisma tetap di server.
export async function AdminQuestionDetailFlow({ questionId }: AdminQuestionDetailFlowProps) {
  const session = await AdminAuthService.getCurrentAdmin()
  if (!session) redirect('/admin/login')

  let question

  try {
    question = await AdminQuestionService.getQuestion(session.admin, questionId)
  } catch {
    redirect('/admin/question-bank')
  }

  const serializedQuestion = JSON.parse(JSON.stringify(question))

  return <AdminQuestionDetailView question={serializedQuestion} />
}
