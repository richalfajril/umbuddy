'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { FormSettingsLayout } from '@/components/layouts/form-settings-layout'
import { Button, Input, Label } from '@/components/ui'

export default function RegisterPage() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mendaftar')
      }

      // Login otomatis setelah pendaftaran sukses
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/dashboard',
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal mendaftar'
      alert(message)
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
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">
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
          className="w-full h-14 bg-white dark:bg-dark-surface border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-dark-surface/80 flex items-center justify-center gap-3"
          onClick={handleGoogleLogin}
        >
          <Image src="/logo/google.png" alt="Google" width={20} height={20} className="w-5 h-5" />
          <span className="text-slate-700 dark:text-slate-200 font-bold">Daftar dengan Google</span>
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background dark:bg-dark-surface px-2 text-muted-foreground font-bold">
              Atau isi form manual
            </span>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
