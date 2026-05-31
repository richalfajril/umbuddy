'use client'

import * as React from 'react'
import { ShieldCheck } from 'lucide-react'
import { Button, Input, Label } from '@/components/ui'
import type { AdminAuthApiError, AdminLoginFormState } from '../_types/admin-auth.types'

// Form login admin dipisah dari user-auth agar backoffice tidak memakai NextAuth user session.
export function AdminLoginForm() {
  // State credential admin sengaja lokal karena endpoint login mengatur cookie httpOnly.
  const [form, setForm] = React.useState<AdminLoginFormState>({ email: '', password: '' })
  const [message, setMessage] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  // Helper update field menjaga controlled input tetap ringkas.
  const updateField = (field: keyof AdminLoginFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  // Submit login admin membuat session lewat API khusus admin dan redirect ke backoffice.
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')
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

      window.location.href = '/admin'
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login admin belum berhasil.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur">
        {/* Header backoffice dibuat lebih profesional dan berbeda dari user auth. */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_4px_0_var(--color-primary-dark)]">
            <ShieldCheck className="h-8 w-8" aria-hidden="true" />
          </div>
          <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-primary">
            Umbuddy Backoffice
          </p>
          <h1 className="mt-2 font-display text-3xl font-black">
            Akses <span className="text-primary">Admin</span>
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Masuk dengan email dan password admin untuk mengelola operasional Umbuddy.
          </p>
        </div>

        {/* Pesan error global menjaga detail credential tetap tidak bocor. */}
        {message && (
          <div
            role="alert"
            aria-live="assertive"
            className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100"
          >
            {message}
          </div>
        )}

        {/* Form credential admin memakai field minimal sesuai A1. */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-white">
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
              className="border-white/15 bg-white/10 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-white">
              Password
            </Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              placeholder="Password admin"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              required
              className="border-white/15 bg-white/10 text-white placeholder:text-slate-400"
            />
          </div>

          {/* Loading state mencegah percobaan login ganda saat request berjalan. */}
          <Button
            type="submit"
            className="h-14 w-full"
            isLoading={isLoading}
            loadingLabel="Memverifikasi..."
          >
            Verifikasi Keamanan
          </Button>
        </form>
      </div>
    </main>
  )
}
