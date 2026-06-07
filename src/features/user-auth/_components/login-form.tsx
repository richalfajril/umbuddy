'use client'

import { FormSettingsLayout } from '@/components/templates/form-settings-layout'
import { Button, Input, Label } from '@/components/ui'
import { AuthLogoHeader } from '@/features/user-auth/_components/auth-logo-header'
import { GoogleAuthButton } from '@/features/user-auth/_components/google-auth-button'
import type { GoogleOAuthStatus } from '@/features/user-auth/_types/user-auth.types'
import { getLoginErrorMessage } from '@/features/user-auth/_utils/user-auth.utils'
import { useToastStore } from '@/stores/useToastStore'
import { Eye, EyeOff } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import * as React from 'react'

// Form login credentials + Google OAuth tanpa memindahkan core NextAuth config.
export function LoginForm() {
  // State form credentials dijaga lokal agar halaman app route tetap thin.
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [isProcessingSuccess, setIsProcessingSuccess] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [googleOAuthStatus, setGoogleOAuthStatus] = React.useState<GoogleOAuthStatus>('NOT_VERIFIED')
  const { addToast } = useToastStore()

  // Status Google OAuth dibaca dari public endpoint agar tombol bisa disabled jika env belum siap.
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
    if (!isLoading && !isProcessingSuccess) return
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          if (isProcessingSuccess) {
            clearInterval(interval)
            window.location.href = '/dashboard'
          }
          return prev
        }
        const increment = Math.max(1, Math.floor((100 - prev) / 10))
        return prev + increment
      })
    }, isProcessingSuccess ? 20 : 200)
    return () => clearInterval(interval)
  }, [isLoading, isProcessingSuccess])

  // Cek jika user baru kembali dari Google login success
  React.useEffect(() => {
    let timeout: NodeJS.Timeout
    const isGoogleSuccess = new URLSearchParams(window.location.search).get('google_success') === 'true'
    if (isGoogleSuccess) {
      timeout = setTimeout(() => setIsProcessingSuccess(true), 0)
    }
    return () => clearTimeout(timeout)
  }, [])

  // Verify token dari query param diproses di login agar user langsung melihat status email.
  React.useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('verify_token')
    if (!token) return

    let active = true
    fetch('/api/v1/auth/email/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (response) => {
        const data = (await response.json()) as {
          message?: string
          error?: { message?: string }
        }
        if (!response.ok) throw new Error(data.error?.message ?? 'Verifikasi email gagal.')
        return data
      })
      .then((data) => {
        if (!active) return
        addToast({
          type: 'success',
          title: 'Email Terverifikasi',
          message: data.message ?? 'Email berhasil diverifikasi. Kamu sudah bisa masuk.',
        })
        window.history.replaceState(null, '', '/auth/login')
      })
      .catch((error: unknown) => {
        if (!active) return
        addToast({
          type: 'error',
          title: 'Verifikasi Gagal',
          message: error instanceof Error ? error.message : 'Link verifikasi tidak valid.',
        })
        window.history.replaceState(null, '', '/auth/login')
      })

    return () => {
      active = false
    }
  }, [addToast])

  // Credentials login memakai redirect false agar toast error bisa dikontrol.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProgress(0)
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      if (result?.error) {
        const errorMsg = getLoginErrorMessage(result.error)
        
        addToast({
          type: 'error',
          title: 'Masuk Gagal ⚠️',
          message: errorMsg,
        })
      } else {
        addToast({
          type: 'success',
          title: 'Berhasil Masuk! 🚀',
          message: 'Selamat datang kembali Cambies! Memuat markas...',
        })
        window.location.href = '/dashboard'
      }
    } catch {
      const errorMsg = 'Terjadi kesalahan saat masuk'
      
      addToast({
        type: 'error',
        title: 'Masuk Gagal ⚠️',
        message: errorMsg,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Google login tetap lewat NextAuth, hanya diblok jika server melaporkan NOT_VERIFIED.
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
    signIn('google', { callbackUrl: '/auth/login?google_success=true' })
  }

  if (isLoading || isProcessingSuccess) {
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
        {/* Header copy menjaga tone auth tetap ringan dan tidak birokratis. */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-headline">
            Selamat Datang <span className="text-primary">Kembali!</span>
          </h1>
          <p className="text-body text-sm">
            Masuk lagi dan lanjutkan latihanmu menuju CPNS impian.
          </p>
        </div>

        {/* Jalur Google dibuat paling cepat, tetapi tetap mengikuti status konfigurasi server. */}
        <GoogleAuthButton googleOAuthStatus={googleOAuthStatus} onClick={handleGoogleLogin} isLoading={isGoogleLoading} />

        {/* Divider memisahkan OAuth dan credentials tanpa menambah layout route. */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted font-bold">
              Atau masuk dengan email
            </span>
          </div>
        </div>

        {/* Form credentials tetap client-side karena NextAuth signIn butuh interaksi browser. */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input email memakai validasi native browser sebagai lapisan UX awal. */}
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
          {/* Input password menyediakan toggle visibility dengan aria-label yang eksplisit. */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link 
                href="/auth/forgot-password" 
                className="text-xs font-bold text-primary hover:underline"
              >
                Lupa password?
              </Link>
            </div>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                required 
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
          </div>

          {/* Submit button mengunci double-submit lewat isLoading dari komponen Button. */}
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full h-14 text-lg"
            isLoading={isLoading}
            loadingLabel="Masuk..."
          >
            Masuk Cambies
          </Button>
        </form>

        {/* Link register menjaga user baru tetap berada dalam alur auth publik. */}
        <div className="text-center pt-4">
          <p className="text-sm text-body">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="font-bold text-primary hover:underline">
              Daftar sekarang gratis
            </Link>
          </p>
        </div>
      </div>
    </FormSettingsLayout>
  )
}
