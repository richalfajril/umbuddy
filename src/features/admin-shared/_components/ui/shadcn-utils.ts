// Helper kecil untuk menggabungkan className tanpa menambah dependency baru.
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
