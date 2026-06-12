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
  PUBLISHED: 'bg-primary/10 text-primary border-primary/25 dark:bg-primary/15 dark:text-primary dark:border-primary/35',
  DRAFT: 'bg-amber-50 text-amber-800 border-amber-600 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-500',
  ARCHIVED: 'bg-slate-100 text-slate-700 border-slate-500 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-500',
  FLAGGED: 'bg-red-50 text-red-800 border-red-600 dark:bg-red-950/50 dark:text-red-200 dark:border-red-500',
}
