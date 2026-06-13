'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { AuthLogoHeader } from '@/components/molecules/auth-logo-header'
import { FormSettingsLayout } from '@/components/templates/form-settings-layout'
import { Button, Input, Label } from '@/components/ui'
import { AuthSplashScreen } from '@/components/organisms/auth-splash-screen'
import { useToastStore } from '@/stores/useToastStore'
import {
  ADMIN_AUTH_ROUTES,
  ADMIN_LOGIN_INITIAL_FORM,
  ADMIN_LOGIN_LOADING_TEXT,
  ADMIN_LOGIN_PROGRESS,
} from '../_constants/admin-auth.constants'
import { loginAdmin } from '../_services/admin-auth.service'
import type { AdminLoginFormState } from '../_types/admin-auth.types'
import { readAdminAuthError } from '../_utils/admin-auth.utils'

// Form login admin memakai visual auth user, tetapi tetap memakai endpoint dan cookie admin.
export function AdminLoginForm() {
  const [form, setForm] = React.useState<AdminLoginFormState>(ADMIN_LOGIN_INITIAL_FORM)
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
        if (prev >= ADMIN_LOGIN_PROGRESS.maxBeforeRedirect) {
          clearInterval(interval)
          return prev
        }
        return prev + ADMIN_LOGIN_PROGRESS.step
      })
    }, ADMIN_LOGIN_PROGRESS.intervalMs)
    return () => clearInterval(interval)
  }, [isProcessingSuccess])

  // Watcher terpisah untuk menangani redirect agar fungsi state updater tetap murni (pure)
  React.useEffect(() => {
    if (isProcessingSuccess && progress >= ADMIN_LOGIN_PROGRESS.maxBeforeRedirect) {
      // Navigasi dokumen penuh memastikan layout admin membaca ulang cookie session baru.
      window.location.assign(ADMIN_AUTH_ROUTES.dashboard)
    }
  }, [isProcessingSuccess, progress])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setProgress(0)
    setIsLoading(true)

    try {
      // Request login admin dibungkus service agar endpoint tidak tersebar di komponen.
      const { response, data } = await loginAdmin(form)

      if (!response.ok) {
        throw new Error(readAdminAuthError(data))
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
        message: error instanceof Error ? error.message : readAdminAuthError({}),
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
        loadingText={ADMIN_LOGIN_LOADING_TEXT}
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
