import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminQuestionsImportFlow } from '@/features/admin-questions-import'

export const metadata: Metadata = {
  title: 'Import Excel Soal | Umbuddy Admin',
}

export default async function AdminImportExcelPage() {
  const session = await AdminAuthService.getCachedCurrentAdmin()
  if (!session) redirect('/admin/login')

  return <AdminQuestionsImportFlow />
}
