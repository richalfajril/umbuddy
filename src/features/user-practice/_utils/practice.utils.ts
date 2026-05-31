// Helper kecil murni untuk modul latihan (parsing error dan format string).

// Membaca pesan error dari response API latihan dengan fallback teks ramah.
export async function readApiError(response: Response) {
  const data = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
  return data?.error?.message ?? 'Duh, latihan belum bisa diproses. Coba lagi ya.'
}

// Menampilkan durasi detik menjadi string MM:SS untuk timer di UI.
export function formatTimer(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
