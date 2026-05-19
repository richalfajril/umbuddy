import Link from 'next/link'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

type SearchParams = Promise<{ error?: string }>

interface AuthErrorPageProps {
  searchParams: SearchParams
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams
  const error = params.error

  // Copy ramah game-like Indonesia sesuai kriteria UI_UX.md
  let title = 'Masuk Belum Berhasil'
  let description = 'Sesi tidak bisa dibuat. Coba masuk ulang, atau pastikan akunmu sudah aktif dan tidak terkunci.'

  if (error === 'CredentialsSignin') {
    title = 'Kredensial Tidak Cocok 🔑'
    description = 'Kombinasi email atau password yang kamu masukkan salah. Periksa kembali dan coba lagi, ya!'
  } else if (error === 'AccessDenied') {
    title = 'Akun Belum Aktif ✉️'
    description = 'Akses ditolak karena akunmu belum diverifikasi. Silakan periksa kotak masuk atau spam email kamu untuk tautan verifikasi!'
  } else if (error === 'Verification') {
    title = 'Tautan Tidak Valid ⏳'
    description = 'Tautan verifikasi sudah kedaluwarsa atau tidak berlaku lagi. Silakan coba masuk kembali untuk mengirim tautan baru.'
  } else if (error === 'Configuration') {
    title = 'Masalah Konfigurasi ⚙️'
    description = 'Terjadi kesalahan sistem saat mencoba masuk. Tim kami sedang menanganinya. Coba lagi sesaat lagi!'
  } else if (error === 'OAUTH_SIGNIN_FAILED') {
    title = 'Google Login Tertahan'
    description = 'Google login belum bisa menyelesaikan proses akun. Coba lagi setelah koneksi database dan skema auth tersinkron.'
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="form-card-static w-full max-w-md p-7 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 text-error">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-black text-headline">
          <span className="text-primary">Oops,</span> {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-body">
          {description}
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground border-2 border-border shadow-chunky transition hover:bg-primary-hover active:translate-y-[2px] active:shadow-none"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali Masuk
        </Link>
      </div>
    </main>
  )
}
