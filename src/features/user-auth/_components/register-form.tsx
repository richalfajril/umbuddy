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

  // Submit register tetap generic dan mengikuti response API saat ini.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <FormSettingsLayout staticCard header={<AuthLogoHeader />}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-headline">
            Daftar Akun <span className="text-primary">Baru</span>
          </h1>
          <p className="text-body text-sm">
            Mulai petualanganmu menuju NIP impian hari ini!
          </p>
        </div>

        <GoogleAuthButton googleOAuthStatus={googleOAuthStatus} onClick={handleGoogleLogin} />

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

        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-lg border border-primary/30 bg-primary-light px-4 py-3 text-sm font-bold text-primary-dark"
            >
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-xl border-2 border-error/20 bg-error/10 px-4 py-3 text-sm font-bold text-error animate-pulse"
            >
              {errorMessage}
            </div>
          )}

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
            <p className="text-[10px] text-body">
              Gunakan kombinasi huruf, angka, dan simbol agar lebih aman.
            </p>
          </div>

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

        <div className="text-center pt-4">
          <p className="text-sm text-body">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="font-bold text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>

        <p className="text-[10px] text-center text-body leading-tight">
          Dengan mendaftar, kamu menyetujui <Link href="/terms" className="underline">Syarat & Ketentuan</Link> serta <Link href="/privacy" className="underline">Kebijakan Privasi</Link> Umbuddy.
        </p>
      </div>
    </FormSettingsLayout>
  )
}
