import { AuthErrorCard } from '@/features/user-auth/_components/auth-error-card'

type AuthErrorSearchParams = Promise<{ error?: string }>

export type AuthErrorFlowProps = {
  searchParams: AuthErrorSearchParams
}

// Flow error auth membaca query callback lalu menyerahkan copy aman ke card UI.
export async function AuthErrorFlow({ searchParams }: AuthErrorFlowProps) {
  const params = await searchParams

  return <AuthErrorCard error={params.error} />
}
