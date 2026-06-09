import Link from 'next/link'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { getAuthErrorCopy } from '@/features/user-auth/_utils/user-auth.utils'

// Card error auth server-rendered untuk callback/error NextAuth.
export function AuthErrorCard({ error }: { error?: string }) {
  // Copy error dipetakan di util supaya halaman app route tetap routing-only.
  const { title, description } = getAuthErrorCopy(error)

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="form-card-static w-full max-w-md p-7 text-center">
        {/* Ikon error memberi sinyal visual tanpa menampilkan detail internal auth. */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 text-error">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>
        {/* Title dan description tetap user-friendly untuk semua sumber error NextAuth. */}
        <h1 className="mt-5 font-display text-2xl font-black text-headline">
          <span className="text-primary">Oops,</span> {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-body">
          {description}
        </p>
        {/* CTA selalu kembali ke login agar user punya recovery path yang jelas. */}
        <Link
          href="/auth/login"
          prefetch
          className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground border-2 border-border shadow-chunky transition hover:bg-primary-hover active:translate-y-[2px] active:shadow-none"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali Masuk
        </Link>
      </div>
    </main>
  )
}
