'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'
import { FormSettingsLayout } from '@/components/templates/form-settings-layout'
import { Button, Input, Label } from '@/components/ui'
import { AuthLogoHeader } from '@/features/user-auth/_components/auth-logo-header'

// Form request reset password dengan response generic anti user-enumeration.
export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState('')
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // Request reset selalu menampilkan pesan generic sesuai keamanan auth.
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      await fetch('/api/v1/auth/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setIsSubmitted(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormSettingsLayout staticCard header={<AuthLogoHeader />}>
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
            <Mail className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-black text-headline">
            Reset <span className="text-primary">Password</span>
          </h1>
          <p className="mt-2 text-sm leading-6 text-body">
            Masukkan email akunmu. Link reset berlaku 1 jam dan akan dikirim jika akun aktif.
          </p>
        </div>

        {isSubmitted ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-lg border border-primary/30 bg-primary-light px-4 py-3 text-sm font-bold text-primary-dark"
          >
            Jika email terdaftar, instruksi reset akan dikirim ke inbox kamu.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="h-14 w-full text-lg"
            isLoading={isLoading}
            loadingLabel="Mengirim..."
          >
            Kirim Link Reset
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
