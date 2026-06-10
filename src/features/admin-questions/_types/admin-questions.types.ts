// Tipe kategori soal yang dipakai form backoffice.
export type AdminQuestionCategory = 'TWK' | 'TIU' | 'TKP'

// Tipe status soal untuk badge dan aksi workflow.
export type AdminQuestionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'FLAGGED'

export type AdminQuestionOption = {
  text?: string
  image_url?: string
}

// Item soal dari API admin questions.
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
  sub_material_id: string | null
  status: AdminQuestionStatus
  created_at: string
  updated_at: string
}

// State form create draft soal.
export type AdminQuestionFormState = {
  category: AdminQuestionCategory
  package_code: string
  number: string
  text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e: string
  answer_key: string
  tkp_a: string
  tkp_b: string
  tkp_c: string
  tkp_d: string
  tkp_e: string
  explanation: string
  difficulty: string
}

// Response list API admin questions.
export type AdminQuestionsResponse = {
  questions: AdminQuestionListItem[]
  page: number
  page_size: number
  total: number
}

