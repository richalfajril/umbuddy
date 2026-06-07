import { Suspense } from 'react'
import { ResetPasswordForm } from '@/features/user-auth/_components/reset-password-form'

// Flow reset password mempertahankan Suspense boundary di feature layer.
export function ResetPasswordFlow() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
