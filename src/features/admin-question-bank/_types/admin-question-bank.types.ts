export type QuestionCategory = 'TWK' | 'TIU' | 'TKP'
export type QuestionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'FLAGGED'
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'

export interface QuestionOptions {
  A: string
  B: string
  C: string
  D: string
  E?: string
}

export interface TKPWeights {
  A: number
  B: number
  C: number
  D: number
  E: number
}

export interface AdminQuestionBase {
  category: QuestionCategory
  package_code: string
  number: number
  text: string
  options: QuestionOptions
  answer_key?: string
  tkp_weights?: TKPWeights
  explanation?: string
  difficulty?: QuestionDifficulty
  image_urls?: string[]
  material_id?: string | null
  material_name?: string | null
  sub_material_id?: string | null
  sub_material_name?: string | null
}

export interface AdminQuestion extends AdminQuestionBase {
  id: string
  status: QuestionStatus
  created_at: string
  updated_at: string
}

export interface AdminQuestionFilters {
  category: QuestionCategory | 'ALL'
  status: QuestionStatus | 'ALL'
  packageCode: string
  search: string
  page: number
  limit: number
}

export interface AdminQuestionListResponse {
  questions: AdminQuestion[]
  page: number
  page_size: number
  total: number
}
