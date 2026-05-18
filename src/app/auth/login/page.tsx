'use client'

import { FormSettingsLayout } from '@/components/layouts/form-settings-layout'
import { Button, Input, Label } from '@/components/ui'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { useToastStore } from '@/store/useToastStore'

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const { addToast } = useToastStore()

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
    setErrorMessage('')
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      if (result?.error) {
        const errorMsg = getLoginErrorMessage(result.error)
        setErrorMessage(errorMsg)
        
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
      setErrorMessage(errorMsg)
      
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
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <FormSettingsLayout
      header={
        <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
          <Image 
            src="/logo/logo_vertical.png" 
            alt="Umbuddy Logo" 
            width={180} 
            height={48} 
            className="h-32 w-auto"
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

        {errorMessage && (
          <div className="rounded-xl border-2 border-error/20 bg-error/10 px-4 py-3 text-sm font-bold text-error animate-pulse">
            {errorMessage}
          </div>
        )}

        {/* Google OAuth Button */}
        <Button 
          type="button"
          variant="secondary" 
          className="w-full h-14 bg-background border-border hover:bg-surface flex items-center justify-center gap-3"
          onClick={handleGoogleLogin}
        >
          <Image src="/logo/google.png" alt="Google" width={20} height={20} className="w-5 h-5" />
          <span className="text-headline font-bold">Lanjutkan dengan Google</span>
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
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full h-14 text-lg"
            isLoading={isLoading}
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
