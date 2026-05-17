import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { ArrowRight } from 'lucide-react'

export function LandingBottomCTA() {
  return (
    <section className="bg-gradient-to-b from-primary-light/25 via-background to-background dark:from-primary/8 dark:via-background dark:to-background py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">
        <Image src="/mascot/mascot_encouraging.png" alt="" width={180} height={180} className="h-36 w-36 object-contain" />
        <div>
          <h2 className="font-display text-3xl font-black text-headline md:text-5xl">
            Siap mulai naik level hari ini?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-body">
            Buat akun gratis, pilih mode latihan, dan biarkan Umbuddy bantu kamu menjaga ritme belajar.
          </p>
        </div>
        <Link href="/auth/register">
          <Button size="lg" className="px-10 py-6 text-lg">
            Daftar Gratis Sekarang
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
