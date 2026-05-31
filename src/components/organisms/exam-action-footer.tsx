import * as React from 'react'
import { ArrowLeft, ArrowRight, Flag } from 'lucide-react'
import { Button } from '@/components/ui'

interface ExamActionFooterProps {
  /** Index soal yang sedang aktif (0-based) */
  currentIndex: number
  /** Total soal */
  totalQuestions: number
  /** Jawaban yang sudah dipilih (untuk disable tombol Lanjut jika belum dijawab) */
  currentAnswer?: string
  /** Apakah timer sudah habis (menonaktifkan navigasi selain Submit) */
  timeExpired?: boolean
  /** Apakah sedang dalam proses submit */
  isSubmitting?: boolean
  /** Apakah sedang dalam proses auto-submit (misal timer habis) */
  isAutoSubmitting?: boolean
  /** Status ragu-ragu soal saat ini */
  isFlagged?: boolean
  /** Callback navigasi ke soal tertentu */
  onGoToQuestion: (index: number) => void
  /** Callback toggle ragu-ragu. Jika tidak disediakan, tombol Flag tidak ditampilkan. */
  onToggleFlag?: () => void
  /** Callback buka modal submit */
  onSubmitModalOpen: () => void
}

/**
 * ExamActionFooter — Footer navigasi soal yang seragam untuk semua mode ujian.
 *
 * Digunakan oleh: Practice, Diagnostic, dan CAT.
 * Susunan tombol: [Prev] [Flag?] [Skip] [Lanjut | Submit!]
 */
export function ExamActionFooter({
  currentIndex,
  totalQuestions,
  currentAnswer,
  timeExpired = false,
  isSubmitting = false,
  isAutoSubmitting = false,
  isFlagged = false,
  onGoToQuestion,
  onToggleFlag,
  onSubmitModalOpen,
}: ExamActionFooterProps) {
  const isLastQuestion = currentIndex >= totalQuestions - 1
  const isBusy = isSubmitting || isAutoSubmitting

  return (
    <div className="flex items-center gap-3">
      {/* Tombol Kembali */}
      <Button
        type="button"
        variant="secondary"
        className="shrink-0"
        onClick={() => onGoToQuestion(currentIndex - 1)}
        disabled={currentIndex === 0 || isBusy || timeExpired}
        aria-label="Soal sebelumnya"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </Button>

      {/* Tombol Ragu-Ragu (Flag) — hanya tampil jika callback disediakan */}
      {onToggleFlag && (
        <Button
          type="button"
          variant="secondary"
          className="shrink-0"
          onClick={onToggleFlag}
          disabled={isBusy || timeExpired}
          aria-label="Tandai soal ragu-ragu"
        >
          <Flag
            className={['h-5 w-5', isFlagged ? 'fill-xp text-xp' : ''].join(' ')}
            aria-hidden="true"
          />
        </Button>
      )}

      {/* Tombol Skip */}
      <Button
        type="button"
        variant="secondary"
        className="shrink-0 font-bold"
        onClick={() => onGoToQuestion(currentIndex + 1)}
        disabled={isLastQuestion || isBusy || timeExpired}
        aria-label="Lewati soal ini"
      >
        Skip
      </Button>

      {/* Tombol Lanjut (jika bukan soal terakhir) atau Submit! (jika soal terakhir) */}
      {!isLastQuestion && !timeExpired ? (
        <Button
          type="button"
          className="flex-1"
          onClick={() => onGoToQuestion(currentIndex + 1)}
          disabled={!currentAnswer || isBusy}
          rightIcon={<ArrowRight className="h-5 w-5" aria-hidden="true" />}
        >
          Lanjut
        </Button>
      ) : (
        <Button
          type="button"
          className="flex-1"
          onClick={onSubmitModalOpen}
          disabled={isBusy}
          isLoading={isBusy}
          loadingLabel="Menyubmit..."
        >
          Submit!
        </Button>
      )}
    </div>
  )
}
