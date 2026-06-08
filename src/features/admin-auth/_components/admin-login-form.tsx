'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { AuthLogoHeader } from '@/components/molecules/auth-logo-header'
import { FormSettingsLayout } from '@/components/templates/form-settings-layout'
import { Button, Input, Label } from '@/components/ui'
import { AuthSplashScreen } from '@/components/organisms/auth-splash-screen'
import { useToastStore } from '@/stores/useToastStore'
import type { AdminAuthApiError, AdminLoginFormState } from '../_types/admin-auth.types'

// Form login admin memakai visual auth user, tetapi tetap memakai endpoint dan cookie admin.
export function AdminLoginForm() {
  const [form, setForm] = React.useState<AdminLoginFormState>({ email: '', password: '' })
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isProcessingSuccess, setIsProcessingSuccess] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const { addToast } = useToastStore()

  // Helper update field menjaga controlled input tetap ringkas.
  const updateField = (field: keyof AdminLoginFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  React.useEffect(() => {
    if (!isProcessingSuccess) return
    
    // Saat sukses, jalankan bar perlahan agar memakan waktu ~2.5 detik (50 ticks * 50ms)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval)
          return prev
        }
        return prev + 2
      })
    }, 50)
    return () => clearInterval(interval)
  }, [isProcessingSuccess])

  // Watcher terpisah untuk menangani redirect agar fungsi state updater tetap murni (pure)
  React.useEffect(() => {
    if (isProcessingSuccess && progress >= 98) {
      window.location.href = '/admin/dashboard'
    }
  }, [isProcessingSuccess, progress])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setProgress(0)
    setIsLoading(true)

    try {
      const response = await fetch('/api/v1/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await response.json()) as AdminAuthApiError

      if (!response.ok) {
        throw new Error(data.error?.message ?? 'Login admin belum berhasil.')
      }

      addToast({
        type: 'success',
        title: 'Admin Terverifikasi',
        message: 'Akses backoffice sedang disiapkan.',
      })
      setIsProcessingSuccess(true)
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Login Admin Gagal',
        message: error instanceof Error ? error.message : 'Login admin belum berhasil.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AuthSplashScreen 
        isProcessingSuccess={isProcessingSuccess} 
        progress={progress}
        loadingText="Menyiapkan ruang kendali Umbuddy..."
      />

      <FormSettingsLayout staticCard header={<AuthLogoHeader />}>
      <div className="space-y-6">
        {/* Header copy admin dibuat seirama dengan login user, dengan highlight akses admin. */}
        <div className="space-y-2 text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
            Umbuddy Backoffice
          </p>
          <h1 className="text-2xl font-black text-headline">
            Masuk sebagai <span className="text-primary">Admin</span>
          </h1>
          <p className="text-sm text-body">
            Gunakan akun admin yang sudah diberi role untuk mengelola operasional Umbuddy.
          </p>
        </div>

        {/* Form credential admin memakai field minimal sesuai A1. */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">
              Email Admin
            </Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              placeholder="admin@umbuddy.id"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">
              Password
            </Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Password admin"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                required
                className="pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
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

          {/* Loading state mencegah percobaan login ganda saat request berjalan. */}
          <Button
            type="submit"
            className="h-14 w-full"
            isLoading={isLoading}
            loadingLabel="Memverifikasi..."
          >
            Masuk Admin
          </Button>
        </form>
      </div>
    </FormSettingsLayout>
    </>
  )
}
