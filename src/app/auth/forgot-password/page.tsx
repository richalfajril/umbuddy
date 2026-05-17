'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail } from 'lucide-react'
import { FormSettingsLayout } from '@/components/layouts/form-settings-layout'
import { Button, Input, Label } from '@/components/ui'

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('')
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitted(true)
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
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
            <Mail className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-black text-headline">
            Reset Password
          </h1>
          <p className="mt-2 text-sm leading-6 text-body">
            Masukkan email akunmu. Link reset akan dikirim saat endpoint reset password aktif.
          </p>
        </div>

        {isSubmitted ? (
          <div className="rounded-lg border border-primary/30 bg-primary-light px-4 py-3 text-sm font-bold text-primary-dark">
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

          <Button type="submit" variant="primary" className="h-14 w-full text-lg">
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
