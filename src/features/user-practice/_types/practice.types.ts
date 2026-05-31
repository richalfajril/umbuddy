// Tipe data utama untuk domain latihan (practice).

// Kategori latihan yang tersedia untuk pengguna.
export type PracticeCategory = 'TWK' | 'TIU' | 'TKP'

// State machine sederhana untuk menentukan tahapan saat ini dalam alur latihan.
export type PracticeStep = 'setup' | 'loading' | 'practice' | 'result' | 'review'

// Soal latihan publik yang diambil dari server (tanpa answer key).
export type PublicPracticeQuestion = {
  id: string
  category: PracticeCategory
  text: string
  options: Record<string, string>
  source: 'db' | 'fallback'
}

// Data detail satu item soal yang digunakan pada mode pembahasan (review).
export type PracticeReviewItem = {
  question_id: string
  category: PracticeCategory
  text: string
  options: Record<string, string>
  selected_option: string | null
  answer_key: string | null
  correct: boolean | null
  score: number
  time_spent: number
  explanation: string | null
}

// Payload hasil akhir yang didapatkan setelah jawaban latihan dikunci.
export type PracticeResult = {
  session_id: string
  score: number
  correct_count: number
  total_questions: number
  average_time: number
  review: PracticeReviewItem[]
  recommendations: Array<{ category: PracticeCategory; message: string }>
  xp_award: { xp: number; already_claimed: boolean }
}
