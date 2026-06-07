'use client'

import { FormSettingsLayout } from '@/components/templates/form-settings-layout'
import { Button, Input, Label } from '@/components/ui'
import { AuthLogoHeader } from '@/features/user-auth/_components/auth-logo-header'
import { GoogleAuthButton } from '@/features/user-auth/_components/google-auth-button'
import type { ApiErrorResponse, GoogleOAuthStatus } from '@/features/user-auth/_types/user-auth.types'
import { useToastStore } from '@/stores/useToastStore'
import { Eye, EyeOff } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import * as React from 'react'

// Form registrasi email/password + Google OAuth tanpa mengubah kontrak API register.
export function RegisterForm() {
  // State form manual dipertahankan lokal agar route page tetap routing-only.
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [successMessage, setSuccessMessage] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [googleOAuthStatus, setGoogleOAuthStatus] = React.useState<GoogleOAuthStatus>('NOT_VERIFIED')
  const { addToast } = useToastStore()

  // Public auth status memastikan tombol Google hanya aktif jika env OAuth verified.
  React.useEffect(() => {
    let active = true
    fetch('/api/v1/public/auth-status')
      .then((response) => response.json())
      .then((data: { google_oauth?: GoogleOAuthStatus }) => {
        if (active) setGoogleOAuthStatus(data.google_oauth === 'PASS' ? 'PASS' : 'NOT_VERIFIED')
      })
      .catch(() => {
        if (active) setGoogleOAuthStatus('NOT_VERIFIED')
      })

    return () => {
      active = false
    }
  }, [])

  React.useEffect(() => {
    if (!isGoogleLoading) return
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        const increment = Math.max(1, Math.floor((100 - prev) / 10))
        return prev + increment
      })
    }, 200)
    return () => clearInterval(interval)
  }, [isGoogleLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProgress(0)
    setIsLoading(true)
    setSuccessMessage('')
    setErrorMessage('')
    
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = (await response.json()) as ApiErrorResponse & { message?: string }

      if (!response.ok) {
        throw new Error(data.error?.message || 'Gagal mendaftar')
      }

      const successMsg = data.message ?? 'Registrasi berhasil. Silakan cek email untuk verifikasi akun sebelum masuk.'
      setSuccessMessage(successMsg)

      setName('')
      setEmail('')
      setPassword('')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal mendaftar'
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Google register/login memakai provider NextAuth yang sama dengan login.
  const handleGoogleLogin = () => {
    if (googleOAuthStatus !== 'PASS') {
      addToast({
        type: 'warning',
        title: 'Google OAuth Belum Aktif',
        message: 'Konfigurasi Google login belum diverifikasi di server.',
      })
      return
    }

    setProgress(0)
    setIsGoogleLoading(true)
    signIn('google', { callbackUrl: '/dashboard' })
  }

  if (isGoogleLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col bg-background overflow-hidden animate-in fade-in duration-500">
        {/* Video Area (Fullscreen appearance adjusting to available height) */}
        <div className="flex-1 relative overflow-hidden bg-black/5 dark:bg-black/20">
          <video 
            src="/mascot/mascot_running_video.webm" 
            autoPlay 
            loop 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        {/* Footer Progress Bar */}
        <div className="bg-background border-t border-border p-6 sm:p-8 flex flex-col justify-center space-y-4 relative z-10">
          <div className="text-center mb-1">
            <span className="text-sm font-bold text-primary animate-pulse">Menyiapkan markas Cambies...</span>
          </div>
          <div className="h-14 w-full max-w-4xl mx-auto bg-muted/30 rounded-2xl overflow-hidden relative border border-border/50 shadow-inner">
            <div 
              className="absolute inset-y-0 left-0 bg-primary transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }} 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-black text-white uppercase tracking-widest drop-shadow-md">
                MEMUAT... {progress}%
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <FormSettingsLayout staticCard header={<AuthLogoHeader />}>
      <div className="space-y-6">
        {/* Header copy menekankan benefit mulai belajar tanpa menjanjikan akses sebelum verifikasi. */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-headline">
            Daftar Akun <span className="text-primary">Baru</span>
          </h1>
          <p className="text-body text-sm">
            Mulai petualanganmu menuju NIP impian hari ini!
          </p>
        </div>

        {/* Google OAuth menjadi jalur utama karena email user sudah diverifikasi oleh Google. */}
        <GoogleAuthButton googleOAuthStatus={googleOAuthStatus} onClick={handleGoogleLogin} isLoading={isGoogleLoading} />

        {/* Divider menjaga pilihan manual tetap jelas tanpa mengalahkan CTA Google. */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted font-bold">
              Atau isi form manual
            </span>
          </div>
        </div>

        {/* Form manual membuat akun pending verification lewat endpoint register v1. */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Success message generic supaya duplicate email tidak mudah dienumerasi. */}
          {successMessage && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-lg border border-primary/30 bg-primary-light px-4 py-3 text-sm font-bold text-primary-dark"
            >
              {successMessage}
            </div>
          )}

          {/* Error message global cukup satu blok agar form tidak terasa ramai. */}
          {errorMessage && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-xl border-2 border-error/20 bg-error/10 px-4 py-3 text-sm font-bold text-error animate-pulse"
            >
              {errorMessage}
            </div>
          )}

          {/* Nama lengkap dipakai sebagai identitas awal sebelum onboarding melengkapi profil. */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input 
              id="name" 
              placeholder="Masukkan nama lengkap" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/* Email memakai validasi native dan akan diverifikasi server-side sebelum aktif. */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="nama@email.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* Password minimum 8 karakter mengikuti aturan validasi register saat ini. */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Minimal 8 karakter" 
                required 
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-muted transition-colors hover:text-headline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {/* Hint password dibuat ringkas agar tidak mengganggu form mobile. */}
            <p className="text-[10px] text-body">
              Gunakan kombinasi huruf, angka, dan simbol agar lebih aman.
            </p>
          </div>

          {/* Loading state mencegah user mengirim request register berkali-kali. */}
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full h-14 text-lg"
            isLoading={isLoading}
            loadingLabel="Mendaftar..."
          >
            Daftar Sekarang
          </Button>
        </form>

        {/* Link balik login menjaga user existing tidak perlu keluar dari flow auth. */}
        <div className="text-center pt-4">
          <p className="text-sm text-body">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="font-bold text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Legal copy tetap kecil karena belum ada consent flow terpisah di auth V1. */}
        <p className="text-[10px] text-center text-body leading-tight">
          Dengan mendaftar, kamu menyetujui <Link href="/terms" className="underline">Syarat & Ketentuan</Link> serta <Link href="/privacy" className="underline">Kebijakan Privasi</Link> Umbuddy.
        </p>
      </div>
    </FormSettingsLayout>
  )
}
