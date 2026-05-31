import type { PracticeCategory } from '../_types/practice.types'

// Konten statis dan konfigurasi UI untuk modul latihan.

// Kartu pilihan kategori latihan yang ditampilkan pada layar awal (setup).
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
