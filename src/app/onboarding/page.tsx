import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authConfig } from '@/lib/auth/config'
import { Card } from '@/components/ui'

export default async function OnboardingPage() {
  const session = await getServerSession(authConfig)
  if (!session || session.user.revoked) {
    redirect('/auth/login')
  }

  if (!session.user.onboardingRequired) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-body">
      <Card padding="lg" className="w-full max-w-xl text-center">
        <p className="text-sm font-black uppercase text-primary">Onboarding</p>
        <h1 className="mt-3 font-display text-3xl font-black text-headline">
          Lengkapi Profil Belajarmu
        </h1>
        <p className="mt-3 text-sm leading-6">
          Akunmu sudah masuk. Langkah onboarding U18 akan mengumpulkan target instansi,
          target skor, dan diagnostic awal sebelum akses penuh ke dashboard.
        </p>
      </Card>
    </main>
  )
}
