import { FormSettingsLayout } from '@/components/templates/form-settings-layout'
import type { ReactNode } from 'react'

// Step loading singkat saat onboarding status user sedang dimuat.
export function OnboardingLoadingStep({ header }: { header: ReactNode }) {
  return (
    <FormSettingsLayout maxWidth="md" header={header}>
      <div className="space-y-4 text-center">
        {/* Spinner sederhana dipakai saat status onboarding awal sedang di-fetch. */}
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="font-bold text-body">Menyiapkan onboarding kamu...</p>
      </div>
    </FormSettingsLayout>
  )
}
