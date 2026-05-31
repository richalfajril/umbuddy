import { FormSettingsLayout } from '@/components/templates/form-settings-layout'
import type { ReactNode } from 'react'

export function OnboardingLoadingStep({ header }: { header: ReactNode }) {
  return (
    <FormSettingsLayout maxWidth="md" header={header}>
      <div className="space-y-4 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="font-bold text-body">Menyiapkan onboarding kamu...</p>
      </div>
    </FormSettingsLayout>
  )
}
