import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { ArrowRight, Clock, Target, Trophy, Zap } from 'lucide-react'

/**
 * HeroSection Landing Page.
 * Menampilkan mascot_greeting.png dan logo_text.png.
 */
export function LandingHero() {
  return (
    <section className="relative w-full pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 animate-bounce-subtle">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">#1 Game-Based CPNS Platform</span>
            </div>

            <div className="space-y-4">
              <div className="relative inline-block">
                <Image 
                  src="/logo/logo_text.png" 
                  alt="Umbuddy" 
                  width={300} 
                  height={80} 
                  className="h-16 md:h-24 w-auto dark:brightness-110"
                />
              </div>
              <h1 className="text-4xl md:text-6xl font-black font-display text-headline leading-tight">
                Belajar CPNS Serasa <br />
                <span className="text-primary italic">Main Game!</span>
              </h1>
              <p className="text-lg md:text-xl text-body max-w-xl mx-auto lg:mx-0">
                Lupakan cara belajar membosankan. Hadapi simulasi CAT, tantang teman dalam Battle, dan raih rank tertinggi untuk jadi ASN impian!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg group">
                  Mulai Latihan Sekarang
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 py-6 text-lg">
                  Lihat Fitur
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-xp" />
                <span className="font-bold">100% GRATIS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-surface" />
                  ))}
                </div>
                <span className="text-sm font-medium">10,000+ Umbies Bersaing</span>
              </div>
            </div>
          </div>

          {/* Mascot Image */}
          <div className="flex-1 relative max-w-md lg:max-w-xl animate-float">
            <div className="relative z-10 scale-110 md:scale-125">
              <Image 
                src="/mascot/mascot_greeting.png" 
                alt="Umbuddy Mascot Greeting" 
                width={500} 
                height={500} 
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </div>
            <div className="absolute -left-6 top-8 z-20 rounded-2xl border-2 border-border bg-background p-4 shadow-card">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-xs font-black text-muted">Target SKD</p>
                  <p className="font-display text-lg font-black text-headline">472+</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 bottom-8 z-20 rounded-2xl border-2 border-border bg-background p-4 shadow-card">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-xp" aria-hidden="true" />
                <div>
                  <p className="text-xs font-black text-muted">CAT Mode</p>
                  <p className="font-display text-lg font-black text-headline">100 menit</p>
                </div>
              </div>
            </div>
            {/* Green Glow Blob behind Mascot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-primary rounded-full blur-[80px] opacity-35 dark:opacity-25 -z-10 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
