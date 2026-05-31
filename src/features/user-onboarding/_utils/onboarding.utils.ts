// Helper kecil untuk format value input tanggal.

// Input date HTML membutuhkan format YYYY-MM-DD dari ISO string database.
export function toDateInputValue(value?: string | null) {
  if (!value) return ''
  return value.slice(0, 10)
}
