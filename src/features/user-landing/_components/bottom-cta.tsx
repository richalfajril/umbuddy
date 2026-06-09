import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { ArrowRight } from 'lucide-react'

export function LandingBottomCTA() {
  return (
    <section className="bg-gradient-to-b from-primary-light/25 via-background to-background dark:from-primary/8 dark:via-background dark:to-background py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetrical Spilt CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center text-center lg:text-left">
          
          {/* Left: Headline & Button */}
          <div className="space-y-8 max-w-2xl mx-auto lg:mx-0">
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-black text-headline md:text-5xl leading-tight">
                Belajar CPNS gak harus bikin <span className="text-primary">kamu stres</span>
              </h2>
              <p className="text-base sm:text-lg text-body leading-relaxed">
                Bergabunglah bersama ribuan Cambies lainnya yang belajar santai tapi terarah setiap hari. Pantau progresmu secara nyata dan pastikan kamu siap tempur dengan percaya diri di ujian asli!
              </p>
            </div>
            
            <div>
              <Link href="/auth/register" prefetch>
                <Button size="lg" className="w-full sm:w-auto px-10 py-6 text-lg group">
                  Daftar Gratis Sekarang
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Floating Mascot with Glow Blob */}
          <div className="relative flex justify-center lg:justify-end motion-safe:animate-float motion-reduce:animate-none">
            <div className="relative z-10">
              <Image 
                src="/mascot/mascot_encouraging.png" 
                alt="Umbuddy Mascot Encouraging" 
                width={220} 
                height={220} 
                className="h-44 w-44 sm:h-52 sm:w-52 object-contain drop-shadow-2xl" 
              />
            </div>
            {/* Soft Green Glow blob behind mascot */}
            <div className="absolute top-1/2 left-1/2 lg:left-3/4 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary rounded-full blur-[60px] opacity-25 -z-10" />
          </div>

        </div>

      </div>
    </section>
  )
}
