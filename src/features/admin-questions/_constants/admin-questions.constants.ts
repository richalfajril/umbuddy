import type { AdminQuestionFormState } from '../_types/admin-questions.types'

// Nilai awal form create question dibuat eksplisit agar reset form aman.
export const initialAdminQuestionForm: AdminQuestionFormState = {
  category: 'TWK',
  package_code: '',
  number: '1',
  text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  option_e: '',
  answer_key: 'A',
  tkp_a: '1',
  tkp_b: '2',
  tkp_c: '3',
  tkp_d: '4',
  tkp_e: '5',
  explanation: '',
  difficulty: 'medium',
}

// Filter status yang tersedia pada list backoffice A2.
export const adminQuestionStatusFilters = [
  { value: '', label: 'Semua Status' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
  { value: 'FLAGGED', label: 'Flagged' },
]

// Filter kategori yang tersedia pada list backoffice A2.
export const adminQuestionCategoryFilters = [
  { value: '', label: 'Semua Kategori' },
  { value: 'TWK', label: 'TWK' },
  { value: 'TIU', label: 'TIU' },
  { value: 'TKP', label: 'TKP' },
]

