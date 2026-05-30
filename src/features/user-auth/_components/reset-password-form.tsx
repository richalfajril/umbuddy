'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, KeyRound } from 'lucide-react'
import { Button, Input, Label } from '@/components/ui'
import { FormSettingsLayout } from '@/components/templates/form-settings-layout'

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [password, setPassword] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/v1/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      })
      const data = (await response.json()) as { message?: string; error?: { message?: string } }

      if (!response.ok) {
        throw new Error(data.error?.message ?? 'Reset password gagal')
      }

      setMessage(data.message ?? 'Password berhasil direset. Silakan masuk ulang.')
      setPassword('')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Reset password gagal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormSettingsLayout
      staticCard
      header={
        <Link href="/" className="flex flex-col items-center gap-0 transition-transform hover:scale-105 active:scale-95">
          <Image
            src="/logo/logo_only.png"
            alt="Umbuddy Mascot"
            width={120}
            height={120}
            className="h-20 w-auto sm:h-28 animate-bounce-subtle"
            style={{ width: 'auto' }}
            priority
          />
          <Image
            src="/logo/logo_text.png"
            alt="Umbuddy"
            width={224}
            height={56}
            className="w-48 h-auto -mt-3 sm:w-56 sm:-mt-4"
            style={{ height: 'auto' }}
            priority
          />
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
            <KeyRound className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-black text-headline">
            Buat Password <span className="text-primary">Baru</span>
          </h1>
          <p className="mt-2 text-sm leading-6 text-body">
            Gunakan password baru minimal 8 karakter. Setelah berhasil, semua sesi lama dicabut.
          </p>
        </div>

        {message && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-lg border border-primary/30 bg-primary-light px-4 py-3 text-sm font-bold text-primary-dark"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-xl border-2 border-error/20 bg-error/10 px-4 py-3 text-sm font-bold text-error"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password Baru</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimal 8 karakter"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={!token || Boolean(message)}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="h-14 w-full text-lg"
            isLoading={isLoading}
            loadingLabel="Mereset..."
            disabled={!token || Boolean(message)}
          >
            Reset Password
          </Button>
        </form>

        <Link
          href="/auth/login"
          className="flex min-h-[44px] items-center justify-center gap-2 text-sm font-black text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke Login
        </Link>
      </div>
    </FormSettingsLayout>
  )
}
