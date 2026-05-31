/**
 * Pure utility functions for the practice module
 */

/** Parses the error message from an API response */
export async function readApiError(response: Response) {
  const data = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
  return data?.error?.message ?? 'Duh, latihan belum bisa diproses. Coba lagi ya.'
}

/** Formats duration in seconds to MM:SS string */
export function formatTimer(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
