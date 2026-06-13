import { redirect } from 'next/navigation'
import { AdminQuestionService } from '@/server/admin-questions'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminSubtestsEditView } from './_components/admin-subtests-edit-view'

type AdminSubtestEditFlowProps = {
  packageCode: string
}

// Flow server edit subtes mengambil ringkasan paket sebelum form client dirender.
export async function AdminSubtestEditFlow({ packageCode }: AdminSubtestEditFlowProps) {
  const session = await AdminAuthService.getCachedCurrentAdmin()
  if (!session) redirect('/admin/login')

  const decodedPackageCode = decodeURIComponent(packageCode)
  const initialData = await AdminQuestionService.listQuestions(session.admin, {
    package_code: decodedPackageCode,
    page: 1,
    page_size: 100,
  })

  if (initialData.total === 0) {
    redirect('/admin/subtests')
  }

  const categories = Array.from(new Set(initialData.questions.map((question) => question.category)))
  const category = categories.length === 1 ? categories[0] : 'CAMPURAN'

  return (
    <AdminSubtestsEditView
      initialPackageCode={decodedPackageCode}
      initialCategory={category}
      initialTotalQuestions={initialData.total}
    />
  )
}
