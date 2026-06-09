import { LoginForm } from '@/features/user-auth/_components/login-form'
import { googleOAuthStatus } from '@/server/auth/config'

// Flow login user membungkus form agar route page hanya menjadi wrapper.
export function LoginFlow() {
  return <LoginForm initialGoogleOAuthStatus={googleOAuthStatus} />
}
