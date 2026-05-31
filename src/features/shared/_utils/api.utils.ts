// Helper murni untuk membaca dan mem-parsing pesan error dari Fetch API.
// Berguna untuk mengamankan proses baca response JSON dari server agar tidak throw saat payload invalid.
export async function readApiError(response: Response, fallbackMessage = 'Duh, proses belum bisa dilanjutkan. Coba lagi ya.') {
  const data = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
  return data?.error?.message ?? fallbackMessage
}
