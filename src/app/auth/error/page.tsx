import Link from 'next/link'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui'

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card padding="lg" className="w-full max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 text-error">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-black text-headline">
          Login Belum Berhasil
        </h1>
        <p className="mt-3 text-sm leading-6 text-body">
          Sesi tidak bisa dibuat. Coba masuk ulang, atau pastikan akunmu sudah aktif dan tidak terkunci.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground transition hover:bg-primary-hover"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali Masuk
        </Link>
      </Card>
    </main>
  )
}
