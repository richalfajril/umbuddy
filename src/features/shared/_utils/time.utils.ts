// Fungsi utilitas murni untuk format waktu.

// Menampilkan durasi (dalam detik) menjadi format string standar MM:SS (contoh: 05:00).
export function formatTimer(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
