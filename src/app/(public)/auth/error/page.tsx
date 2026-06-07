import { AuthErrorFlow } from '@/features/user-auth/auth-error-flow'
import type { AuthErrorFlowProps } from '@/features/user-auth/auth-error-flow'

export default async function AuthErrorPage({ searchParams }: AuthErrorFlowProps) {
  return <AuthErrorFlow searchParams={searchParams} />
}
