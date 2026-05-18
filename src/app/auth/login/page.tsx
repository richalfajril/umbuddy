'use client'

import { FormSettingsLayout } from '@/components/layouts/form-settings-layout'
import { Button, Input, Label } from '@/components/ui'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'

import { useToastStore } from '@/store/useToastStore'

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [googleOAuthStatus, setGoogleOAuthStatus] = React.useState<'PASS' | 'NOT_VERIFIED'>('NOT_VERIFIED')
  const { addToast } = useToastStore()

  React.useEffect(() => {
    let active = true
    fetch('/api/v1/public/auth-status')
      .then((response) => response.json())
      .then((data: { google_oauth?: 'PASS' | 'NOT_VERIFIED' }) => {
        if (active) setGoogleOAuthStatus(data.google_oauth === 'PASS' ? 'PASS' : 'NOT_VERIFIED')
      })
      .catch(() => {
        if (active) setGoogleOAuthStatus('NOT_VERIFIED')
      })

    return () => {
      active = false
    }
  }, [])

  const getLoginErrorMessage = (error?: string | null) => {
    switch (error) {
      case 'PENDING_VERIFICATION':
        return 'Akunmu belum diverifikasi. Silakan cek email verifikasi dulu.'
      case 'SUSPENDED':
        return 'Akunmu sedang ditangguhkan. Hubungi support Umbuddy.'
      case 'LOCKED':
        return 'Akunmu terkunci sementara karena alasan keamanan.'
      case 'RATE_LIMITED':
        return 'Terlalu banyak percobaan masuk. Coba lagi beberapa menit lagi.'
      default:
        return 'Email atau password salah!'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
          message: 'Selamat datang kembali Pejuang! Memuat markas...',
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
    <FormSettingsLayout
      header={
        <Link href="/" className="flex flex-col items-center gap-1 group transition-transform duration-300 hover:scale-105 active:scale-95">
          <Image 
            src="/logo/logo_only.png" 
            alt="Umbuddy Mascot" 
            width={120} 
            height={120} 
            className="h-20 w-auto sm:h-28 animate-bounce-subtle"
            priority
          />
          <Image 
            src="/logo/logo_text.png" 
            alt="Umbuddy" 
            width={224} 
            height={56} 
            className="w-48 sm:w-56 h-auto -mt-1 sm:-mt-2"
            priority
          />
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-headline">
            Selamat Datang Kembali!
          </h1>
          <p className="text-body text-sm">
            Masuk untuk melanjutkan perjuanganmu menaklukkan CPNS.
          </p>
        </div>

        {/* Google OAuth Button */}
        <Button 
          type="button"
          variant="secondary" 
          className="w-full h-14 bg-background border-border hover:bg-surface flex items-center justify-center gap-3"
          onClick={handleGoogleLogin}
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

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full h-14 text-lg"
            isLoading={isLoading}
            loadingLabel="Masuk..."
          >
            Masuk Pejuang
          </Button>
        </form>

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
