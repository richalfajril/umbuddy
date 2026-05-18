'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { FormSettingsLayout } from '@/components/layouts/form-settings-layout'
import { Button, Input, Label } from '@/components/ui'

import { useToastStore } from '@/store/useToastStore'

type ApiErrorResponse = {
  error?: {
    message?: string
  }
}

export default function RegisterPage() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [successMessage, setSuccessMessage] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const { addToast } = useToastStore()

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
      
      addToast({
        type: 'success',
        title: 'Registrasi Berhasil! 🎉',
        message: 'Selamat datang Pejuang! Silakan cek email kamu untuk verifikasi.',
        xpReward: 50,
      })

      setName('')
      setEmail('')
      setPassword('')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal mendaftar'
      setErrorMessage(message)
      
      addToast({
        type: 'error',
        title: 'Registrasi Gagal ⚠️',
        message: message,
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
            src="/logo/logo_text.png" 
            alt="Umbuddy Logo" 
            width={180} 
            height={48} 
            className="h-12 w-auto dark:invert"
          />
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-headline">
            Daftar Akun Baru
          </h1>
          <p className="text-body text-sm">
            Mulai petualanganmu menuju NIP impian hari ini!
          </p>
        </div>

        {/* Google OAuth Button */}
        <Button 
          type="button"
          variant="secondary" 
          className="w-full h-14 bg-background border-border hover:bg-surface flex items-center justify-center gap-3"
          onClick={handleGoogleLogin}
        >
          <Image src="/logo/google.png" alt="Google" width={20} height={20} className="w-5 h-5" />
          <span className="text-headline font-bold">Daftar dengan Google</span>
        </Button>

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

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div className="rounded-lg border border-primary/30 bg-primary-light px-4 py-3 text-sm font-bold text-primary-dark">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="rounded-xl border-2 border-error/20 bg-error/10 px-4 py-3 text-sm font-bold text-error animate-pulse">
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
            <Input 
              id="password" 
              type="password" 
              placeholder="Minimal 8 karakter" 
              required 
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-[10px] text-body">
              Gunakan kombinasi huruf, angka, dan simbol agar lebih aman.
            </p>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full h-14 text-lg"
            isLoading={isLoading}
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
