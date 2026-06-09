import { RegisterForm } from '@/features/user-auth/_components/register-form'
import { googleOAuthStatus } from '@/server/auth/config'

// Flow register user membungkus form agar route page tidak menyimpan UI langsung.
export function RegisterFlow() {
  return <RegisterForm initialGoogleOAuthStatus={googleOAuthStatus} />
}
