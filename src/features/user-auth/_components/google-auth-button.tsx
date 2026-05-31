import { Button } from '@/components/ui'
import type { GoogleOAuthStatus } from '@/features/user-auth/_types/user-auth.types'

// Tombol Google auth reusable untuk login/register dengan status server-side config.
export function GoogleAuthButton({
  googleOAuthStatus,
  onClick,
}: {
  googleOAuthStatus: GoogleOAuthStatus
  onClick: () => void
}) {
  return (
    <Button 
      type="button"
      variant="secondary" 
      className="w-full h-14 bg-background border-border hover:bg-surface flex items-center justify-center gap-3"
      onClick={onClick}
      disabled={googleOAuthStatus !== 'PASS'}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 5.04c1.67 0 3.2.58 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.24 1 3.2 3.65 1.13 7.54l3.85 2.99c.9-2.69 3.42-4.49 7.02-4.49z"
        />
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.48c-.29 1.48-1.14 2.73-2.42 3.58v2.99h3.89c2.28-2.1 3.54-5.18 3.54-8.73z"
        />
        <path
          fill="#FBBC05"
          d="M5.02 10.53c-.23-.69-.37-1.43-.37-2.19 0-.76.14-1.5.37-2.19L1.17 3.16C.42 4.67 0 6.37 0 8.16c0 1.79.42 3.49 1.17 5L5.02 10.53z"
        />
        <path
          fill="#34A853"
          d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.89-2.99c-1.08.72-2.47 1.17-4.07 1.17-3.6 0-6.12-1.8-7.02-4.49L1.13 16.7C3.2 20.59 7.24 23 12 23z"
        />
      </svg>
      <span className="text-headline font-bold">
        {googleOAuthStatus === 'PASS' ? 'Lanjut dengan Google' : 'Google Login Belum Aktif'}
      </span>
    </Button>
  )
}
