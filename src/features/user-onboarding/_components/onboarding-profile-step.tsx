'use client'

import * as React from 'react'
import { Button, Input, Label } from '@/components/ui'
import { FormSettingsLayout } from '@/components/templates/form-settings-layout'
import type { ProfileForm } from '@/features/user-onboarding/_types/onboarding.types'
import { CheckCircle2 } from 'lucide-react'

// Form profile awal untuk menyimpan target belajar sebelum diagnostic dimulai.
export function OnboardingProfileStep({
  header,
  profile,
  message,
  isLoading,
  onSubmit,
  onProfileChange,
}: {
  header: React.ReactNode
  profile: ProfileForm
  message: string
  isLoading: boolean
  onSubmit: (event: React.FormEvent) => void
  onProfileChange: React.Dispatch<React.SetStateAction<ProfileForm>>
}) {
  return (
    <FormSettingsLayout
      staticCard
      maxWidth="md"
      header={header}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Header form menjelaskan bahwa data dipakai untuk personalisasi belajar. */}
        <div className="space-y-2 text-center">
          <p className="text-sm font-black uppercase text-primary">Profil Belajar</p>
          <h1 className="font-display text-3xl font-black text-headline">
            Siapkan <span className="text-primary">target</span> Kamu
          </h1>
          <p className="text-sm leading-6 text-body">
            Umbuddy pakai data ini untuk membuat rekomendasi awal yang lebih relevan.
          </p>
        </div>

        {/* Alert global menampilkan error submit profile tanpa field-level noise berlebihan. */}
        {message && (
          <p role="alert" aria-live="assertive" className="rounded-xl border border-error/30 bg-error-light px-4 py-3 text-sm font-bold text-error-dark">
            {message}
          </p>
        )}

        {/* Field profile mengikuti data model onboarding tanpa menambah field baru. */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="target_instansi">Target Instansi</Label>
            <Input
              id="target_instansi"
              required
              value={profile.target_instansi}
              onChange={(event) => onProfileChange((current) => ({ ...current, target_instansi: event.target.value }))}
              placeholder="Contoh: Kementerian Keuangan"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target_score">Target Skor</Label>
            <Input
              id="target_score"
              type="number"
              min={0}
              max={550}
              required
              value={profile.target_score}
              onChange={(event) => onProfileChange((current) => ({ ...current, target_score: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exam_date">Tanggal Ujian</Label>
            <Input
              id="exam_date"
              type="date"
              required
              value={profile.exam_date}
              onChange={(event) => onProfileChange((current) => ({ ...current, exam_date: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">Provinsi</Label>
            <Input
              id="province"
              required
              value={profile.province}
              onChange={(event) => onProfileChange((current) => ({ ...current, province: event.target.value }))}
              placeholder="Contoh: Jawa Barat"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Kota/Kabupaten</Label>
            <Input
              id="city"
              required
              value={profile.city}
              onChange={(event) => onProfileChange((current) => ({ ...current, city: event.target.value }))}
              placeholder="Contoh: Bandung"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="institution">Institusi</Label>
            <Input
              id="institution"
              value={profile.institution}
              onChange={(event) => onProfileChange((current) => ({ ...current, institution: event.target.value }))}
              placeholder="Opsional"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="major">Jurusan</Label>
            <Input
              id="major"
              value={profile.major}
              onChange={(event) => onProfileChange((current) => ({ ...current, major: event.target.value }))}
              placeholder="Opsional"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="phone">Nomor HP</Label>
            <Input
              id="phone"
              inputMode="tel"
              value={profile.phone}
              onChange={(event) => onProfileChange((current) => ({ ...current, phone: event.target.value }))}
              placeholder="Opsional"
            />
          </div>
        </div>

        {/* Submit tetap disabled/loading melalui Button agar double submit tercegah. */}
        <Button
          type="submit"
          className="w-full h-14 text-lg"
          isLoading={isLoading}
          loadingLabel="Menyimpan..."
          rightIcon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
        >
          Yuk Mulai!
        </Button>
      </form>
    </FormSettingsLayout>
  )
}
