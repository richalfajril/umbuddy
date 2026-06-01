import type { AdminQuestionCategory, AdminQuestionStatus } from './admin-questions.types'

// Opsi jawaban resmi untuk soal CPNS V1.
export const ADMIN_QUESTION_OPTIONS = ['A', 'B', 'C', 'D', 'E'] as const

// Kategori soal yang boleh dikelola admin content.
export const ADMIN_QUESTION_CATEGORIES: AdminQuestionCategory[] = ['TWK', 'TIU', 'TKP']

// Status workflow soal yang ditampilkan di backoffice.
export const ADMIN_QUESTION_STATUSES: AdminQuestionStatus[] = ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'FLAGGED']

// Difficulty manual yang disepakati untuk bank soal V1.
export const ADMIN_QUESTION_DIFFICULTIES = ['easy', 'medium', 'hard'] as const

// Batas paginasi list soal agar query backoffice tetap ringan.
export const ADMIN_QUESTION_MAX_PAGE_SIZE = 50

