import { Suspense } from 'react'
import { ResetPasswordForm } from '@/features/user-auth/_components/reset-password-form'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
