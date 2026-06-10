export const QUESTION_CATEGORIES = [
  { value: 'ALL', label: 'Semua Kategori' },
  { value: 'TWK', label: 'TWK (Wawasan Kebangsaan)' },
  { value: 'TIU', label: 'TIU (Intelegensia Umum)' },
  { value: 'TKP', label: 'TKP (Karakteristik Pribadi)' },
] as const

export const QUESTION_STATUS = [
  { value: 'ALL', label: 'Semua Status' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' },
  { value: 'FLAGGED', label: 'Flagged' },
] as const

export const QUESTION_STATUS_COLORS: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  DRAFT: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  ARCHIVED: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
  FLAGGED: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
}
