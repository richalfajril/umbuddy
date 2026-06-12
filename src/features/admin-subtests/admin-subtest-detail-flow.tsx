import { redirect } from 'next/navigation'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminQuestionService } from '@/server/admin-questions'
import { AdminSubtestDetailView } from './_components/admin-subtest-detail-view'

type AdminSubtestDetailFlowProps = {
  packageCode: string
}

// Flow detail subtes menjaga auth guard dan query soal tetap server-side.
export async function AdminSubtestDetailFlow({ packageCode }: AdminSubtestDetailFlowProps) {
  const session = await AdminAuthService.getCachedCurrentAdmin()

  if (!session) {
    redirect('/admin/login')
  }

  const decodedPackageCode = decodeURIComponent(packageCode)
  const questions = await AdminQuestionService.listQuestions(session.admin, {
    package_code: decodedPackageCode,
    page: 1,
    page_size: 100,
  })

  // Props ke client component harus berupa object polos yang aman diserialisasi.
  const serializedData = JSON.parse(JSON.stringify(questions))

  return (
    <AdminSubtestDetailView
      packageCode={decodedPackageCode}
      initialData={serializedData}
    />
  )
}
