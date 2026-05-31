import { Button, Card } from '@/components/ui'
import { FormSettingsLayout } from '@/components/templates/form-settings-layout'
import type { DiagnosticResult, Recommendation, RewardResult } from '@/features/user-onboarding/_types/onboarding.types'
import { Target, Trophy } from 'lucide-react'
import type { ReactNode } from 'react'

// Step hasil diagnostic yang menampilkan skor awal, rekomendasi, dan reward onboarding.
export function DiagnosticResultStep({
  header,
  result,
  recommendation,
  reward,
  isLoading,
  onEnterDashboard,
}: {
  header: ReactNode
  result: DiagnosticResult
  recommendation: Recommendation | null
  reward: RewardResult | null
  isLoading: boolean
  onEnterDashboard: () => void | Promise<void>
}) {
  const resultRecommendation = recommendation ?? {
    title: `Mulai dari ${result.weakest_category}`,
    message: 'Umbuddy sudah membaca titik start kamu. Lanjut ke markas untuk mulai latihan pertama.',
    primary_category: result.weakest_category,
  }

  return (
    <FormSettingsLayout maxWidth="lg" header={header}>
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
          <Trophy className="h-9 w-9" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-black uppercase text-primary">Baseline Kamu Siap</p>
          <h1 className="mt-2 font-display text-3xl font-black text-headline">
            Skor <span className="text-primary">Awal:</span> {result.total_score}/550
          </h1>
          <p className="mt-2 text-sm leading-6 text-body">
            Ini bukan nilai akhir, ini titik start biar latihanmu lebih tepat sasaran.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {(['TWK', 'TIU', 'TKP'] as const).map((category) => (
            <Card key={category} padding="sm" className="text-center">
              <p className="text-xs font-black text-muted">{category}</p>
              <p className="font-display text-2xl font-black text-headline">
                {category === 'TWK' ? result.score_twk : category === 'TIU' ? result.score_tiu : result.score_tkp}
              </p>
            </Card>
          ))}
        </div>

        <Card padding="md" className="text-left">
          <div className="flex gap-3">
            <Target className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-display text-lg font-black text-headline">
                {resultRecommendation.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-body">
                {resultRecommendation.message}
              </p>
            </div>
          </div>
        </Card>

        {reward === null || reward.xp > 0 ? (
          <div className="rounded-2xl border border-xp/40 bg-xp-light px-4 py-3 text-sm font-black text-headline">
            +{reward?.xp ?? 50} XP {reward?.already_claimed ? 'sudah pernah diklaim.' : 'masuk kantong karena kamu menyelesaikan onboarding.'}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-black text-body">
            Belum dapat XP karena skor awal masih 0. Kamu tetap bisa masuk markas dan mulai latihan dari nol.
          </div>
        )}

        <Button
          type="button"
          className="w-full h-14 text-lg"
          onClick={() => void onEnterDashboard()}
          isLoading={isLoading}
          loadingLabel="Membuka markas..."
        >
          Masuk ke Markas
        </Button>
      </div>
    </FormSettingsLayout>
  )
}
