// Helper kecil untuk parsing error API onboarding dan format value input tanggal.
export async function readApiError(response: Response) {
  const data = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
  return data?.error?.message ?? 'Duh, onboarding belum bisa diproses. Coba lagi ya.'
}

export function toDateInputValue(value?: string | null) {
  if (!value) return ''
  return value.slice(0, 10)
}
