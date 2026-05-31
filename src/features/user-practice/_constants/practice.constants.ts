import type { PracticeCategory } from '../_types/practice.types'

/**
 * Static content and configuration for the practice module
 */

/** Defines the static cards for practice category selection */
export const categoryCards: Array<{
  category: PracticeCategory
  title: string
  description: string
}> = [
  {
    category: 'TWK',
    title: 'TWK',
    description: 'Pancasila, UUD 1945, nasionalisme, dan bela negara.',
  },
  {
    category: 'TIU',
    title: 'TIU',
    description: 'Logika, numerik, analogi, deret, dan silogisme.',
  },
  {
    category: 'TKP',
    title: 'TKP',
    description: 'Pelayanan publik, integritas, adaptasi, dan kerja sama.',
  },
]
