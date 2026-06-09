'use client'

import { Button } from '@/components/ui'
import { ArrowRight, Flame } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

export function LandingStickyCTA() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling down 400px (past the hero section)
      if (window.scrollY > 400) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border px-4 py-3.5 flex items-center justify-between shadow-2xl transition-opacity transition-transform duration-500 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className="relative h-10 w-10 shrink-0 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
          <Image
            src="/logo/logo_only.png"
            alt="Umbuddy Logo"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-headline leading-tight">Belajar CPNS Seru</span>
          <span className="text-[10px] text-primary font-black uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3 h-3 text-xp fill-xp motion-safe:animate-pulse motion-reduce:animate-none" />
            Akses Gratis
          </span>
        </div>
      </div>

      <Link href="/auth/register" prefetch>
        <Button size="sm" className="px-5 py-4 rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-colors transition-transform transition-shadow text-xs flex items-center gap-1">
          Mulai Sekarang
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </Link>
    </div>
  )
}
