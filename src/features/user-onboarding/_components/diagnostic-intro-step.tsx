import { Button } from '@/components/ui'
import { FormSettingsLayout } from '@/components/templates/form-settings-layout'
import { Clock, Flag, ShieldCheck, Target } from 'lucide-react'
import type { ReactNode } from 'react'

// Step pengantar sebelum user memulai diagnostic mini onboarding.
export function DiagnosticIntroStep({
  header,
  message,
  isLoading,
  onStartDiagnostic,
}: {
  header: ReactNode
  message: string
  isLoading: boolean
  onStartDiagnostic: () => void | Promise<void>
}) {
  return (
    <FormSettingsLayout
      maxWidth="md"
      header={header}
    >
      <div className="space-y-6 text-center">
        {/* Icon flag memberi sinyal bahwa user akan mulai tes mini. */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-xp-light text-xp">
          <Flag className="h-8 w-8" aria-hidden="true" />
        </div>
        {/* Copy intro menjelaskan komposisi dan menurunkan tekanan user sebelum mulai. */}
        <div>
          <p className="text-sm font-black uppercase text-primary">Tes Mini 15 Soal</p>
          <h1 className="mt-2 font-display text-3xl font-black text-headline">
            Yuk cari <span className="text-primary">titik start</span> Kamu
          </h1>
          <p className="mt-3 text-sm leading-6 text-body">
            Tes ini berisi 5 TWK, 5 TIU, dan 5 TKP. Jangan takut salah, ini bukan ujian sungguhan.
          </p>
        </div>

        {/* Message dipakai untuk info fallback soal atau error ringan dari API. */}
        {message && (
          <p role="status" aria-live="polite" className="rounded-xl bg-xp-light px-4 py-3 text-sm font-bold text-headline">
            {message}
          </p>
        )}

        {/* Ringkasan aturan memastikan durasi, keamanan skor, dan komposisi soal terbaca jelas. */}
        <div className="grid gap-3 text-left">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
            <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-sm font-bold text-headline">Durasi 15 menit</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-sm font-bold text-headline">Skor dihitung server, aman dari manipulasi</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
            <Target className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-sm font-bold text-headline">Komposisi 5 TWK, 5 TIU, 5 TKP</span>
          </div>
        </div>

        {/* CTA memanggil startDiagnostic dari parent flow agar logic tetap terpusat. */}
        <Button
          type="button"
          className="w-full h-14 text-lg"
          onClick={() => void onStartDiagnostic()}
          isLoading={isLoading}
          loadingLabel="Menyiapkan..."
        >
          Lanjut Tes Mini
        </Button>
      </div>
    </FormSettingsLayout>
  )
}
