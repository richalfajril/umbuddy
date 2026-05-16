'use client'

/**
 * StreakIndicator — Indikator streak harian Umbuddy.
 *
 * Menampilkan icon api 🔥 dan jumlah hari streak aktif.
 * Jika streak = 0, tampilkan state "tidak aktif" dengan opacity rendah.
 *
 * Client Component karena menggunakan animasi pulse yang membutuhkan
 * CSS class dinamis berdasarkan state streak aktif/tidak.
 *
 * Sesuai UI_UX.md: Streak Flame badge dengan warna golden XP (#FFC300).
 * Data dari endpoint GET /api/v1/xp/me → field current_streak.
 */

interface StreakIndicatorProps {
  /** Jumlah hari streak aktif. 0 = streak terputus. */
  streakDays: number
  /** Tampilkan label teks di sebelah angka */
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: { icon: 'text-base', text: 'text-sm', container: 'gap-1 px-2 py-0.5' },
  md: { icon: 'text-xl', text: 'text-base', container: 'gap-1.5 px-3 py-1' },
  lg: { icon: 'text-2xl', text: 'text-lg', container: 'gap-2 px-4 py-1.5' },
}

/** Streak indicator dengan animasi pulse saat streak aktif. */
export function StreakIndicator({
  streakDays,
  showLabel = false,
  size = 'md',
  className = '',
}: StreakIndicatorProps) {
  const isActive = streakDays > 0
  const sizes = sizeClasses[size]

  return (
    <div
      className={[
        'streak-badge inline-flex items-center font-display font-black',
        sizes.container,
        isActive ? 'opacity-100' : 'opacity-40 grayscale',
        className,
      ].join(' ')}
      title={isActive ? `Streak ${streakDays} hari berturut-turut!` : 'Streak belum aktif hari ini'}
      aria-label={`Streak ${streakDays} hari`}
    >
      {/* Icon api — pulse saat aktif */}
      <span
        className={[sizes.icon, isActive ? 'animate-pulse' : ''].join(' ')}
        aria-hidden="true"
      >
        🔥
      </span>

      {/* Angka streak */}
      <span className={sizes.text}>
        {streakDays}
      </span>

      {/* Label opsional */}
      {showLabel && (
        <span className={[sizes.text, 'font-normal opacity-80'].join(' ')}>
          {streakDays === 1 ? 'hari' : 'hari'}
        </span>
      )}
    </div>
  )
}
