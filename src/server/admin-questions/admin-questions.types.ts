import type { AdminSessionContext } from '@/server/admin-auth'

// Role admin yang boleh mengubah konten soal.
export type AdminQuestionEditorRole = 'CONTENT' | 'SUPER_ADMIN'

// Kategori soal mengikuti enum QuestionCategory di Prisma.
export type AdminQuestionCategory = 'TWK' | 'TIU' | 'TKP'

// Status soal mengikuti workflow A2 tanpa hard delete.
export type AdminQuestionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'FLAGGED'

// Filter list soal untuk halaman backoffice.
export type AdminQuestionListInput = {
  status?: AdminQuestionStatus
  category?: AdminQuestionCategory
  package_code?: string
  keyword?: string
  page?: number
  page_size?: number
}

// Format opsi soal yang mendukug teks dan/atau gambar
export type AdminQuestionOption = {
  text?: string
  image_url?: string
}

// Payload create/update soal dari API admin.
export type AdminQuestionMutationInput = {
  category: AdminQuestionCategory
  package_code: string
  number: number
  text?: string | null
  image_urls?: string[]
  options: Record<string, AdminQuestionOption>
  answer_key?: string | null
  tkp_weights?: Record<string, number> | null
  explanation?: string | null
  difficulty?: string | null
  subtest_id?: string | null
  material_id?: string | null
  sub_material_id?: string | null
}

// Bentuk soal publik untuk backoffice tanpa field internal yang tidak dibutuhkan UI.
export type AdminQuestionListItem = {
  id: string
  category: AdminQuestionCategory
  package_code: string
  number: number
  text: string | null
  image_urls: string[]
  options: Record<string, AdminQuestionOption>
  answer_key: string | null
  tkp_weights: Record<string, number> | null
  explanation: string | null
  difficulty: string | null
  subtest_id: string | null
  material_id: string | null
  material_name?: string | null
  sub_material_id: string | null
  sub_material_name?: string | null
  status: AdminQuestionStatus
  created_at: string
  updated_at: string
}

// Context admin aktif yang sudah melewati guard session.
export type AdminQuestionActor = AdminSessionContext['admin']
