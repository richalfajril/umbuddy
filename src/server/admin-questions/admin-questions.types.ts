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
  keyword?: string
  page?: number
  page_size?: number
}

// Payload create/update soal dari API admin.
export type AdminQuestionMutationInput = {
  category: AdminQuestionCategory
  package_code: string
  number: number
  text: string
  options: Record<string, string>
  answer_key?: string | null
  tkp_weights?: Record<string, number> | null
  explanation?: string | null
  difficulty?: string | null
}

// Bentuk soal publik untuk backoffice tanpa field internal yang tidak dibutuhkan UI.
export type AdminQuestionListItem = {
  id: string
  category: AdminQuestionCategory
  package_code: string
  number: number
  text: string
  options: Record<string, string>
  answer_key: string | null
  tkp_weights: Record<string, number> | null
  explanation: string | null
  difficulty: string | null
  status: AdminQuestionStatus
  created_at: string
  updated_at: string
}

// Context admin aktif yang sudah melewati guard session.
export type AdminQuestionActor = AdminSessionContext['admin']

