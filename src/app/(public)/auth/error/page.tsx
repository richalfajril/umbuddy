import { AuthErrorCard } from '@/features/user-auth/_components/auth-error-card'

type SearchParams = Promise<{ error?: string }>

interface AuthErrorPageProps {
  searchParams: SearchParams
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams

  return <AuthErrorCard error={params.error} />
}
