import * as React from 'react'

/**
 * XPBar — Progress bar XP gamifikasi Umbuddy.
 *
 * Menampilkan:
 * - Nama golongan/jabatan saat ini (kiri)
 * - Total XP / threshold berikutnya (kanan)
 * - Progress bar bergradasi hijau
 * - Label "MAX" jika sudah di level tertinggi
 *
 * Sesuai UI_UX.md: XP Bar selalu visible di Dashboard dan Bento layout.
 * Sesuai 00_API_Spec.md: data dari endpoint GET /api/v1/xp/me
 *
 * Server Component — tidak butuh state karena data di-pass sebagai props.
 */

interface XPBarProps {
  /** Nama jabatan/golongan saat ini, misal: "Staf Pratama" */
  currentTitle: string
  /** Total XP user saat ini */
  currentXP: number
  /** XP threshold untuk level berikutnya. null jika sudah MAX */
  nextThresholdXP: number | null
  /** Persentase progress (0–100). 100 jika MAX */
  progressPercentage: number
  /** Nama jabatan berikutnya. undefined jika sudah MAX */
  nextTitle?: string
  className?: string
}

/** XP Progress Bar dengan gradient hijau dan label level Umbuddy. */
export function XPBar({
  currentTitle,
  currentXP,
  nextThresholdXP,
  progressPercentage,
  nextTitle,
  className = '',
}: XPBarProps) {
  const isMax = nextThresholdXP === null

  return (
    <div className={['space-y-1.5', className].join(' ')}>
      {/* Labels atas */}
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-sm text-headline">
          {currentTitle}
        </span>
        <span className="font-display font-bold text-sm text-primary">
          {isMax ? (
            <span className="text-xp">✨ MAX</span>
          ) : (
            `${currentXP.toLocaleString('id-ID')} / ${nextThresholdXP!.toLocaleString('id-ID')} XP`
          )}
        </span>
      </div>

      {/* Progress bar track */}
      <div className="progress-bar-track" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>

      {/* Label bawah — target berikutnya */}
      {!isMax && nextTitle && (
        <p className="text-xs text-muted text-right">
          Menuju <span className="font-bold text-body">{nextTitle}</span>
        </p>
      )}
    </div>
  )
}
