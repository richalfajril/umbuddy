/**
 * Core practice domain types
 */

/** Defines the categories available for practice */
export type PracticeCategory = 'TWK' | 'TIU' | 'TKP'

/** Defines the current stage of the practice flow */
export type PracticeStep = 'setup' | 'loading' | 'practice' | 'result' | 'review'

/** Defines the structure of a practice question fetched from the server */
export type PublicPracticeQuestion = {
  id: string
  category: PracticeCategory
  text: string
  options: Record<string, string>
  source: 'db' | 'fallback'
}

/** Defines the structure of a single item in the practice review */
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

/** Defines the complete result payload returned after practice submission */
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
