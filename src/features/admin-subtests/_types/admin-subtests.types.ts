// Struktur paket subtes yang ditampilkan pada tabel admin subtes.
export interface SubtestPackage {
  id: string
  packageCode: string
  category: string
  status: 'PUBLISHED' | 'ARCHIVED'
  totalQuestions: number
  createdAt: string
  updatedAt: string
}
