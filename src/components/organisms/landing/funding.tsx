import Image from 'next/image'
import { Card } from '@/components/ui'
import { Heart, UploadCloud } from 'lucide-react'

export function LandingFunding() {
  return (
    <section id="funding" className="py-24 bg-gradient-to-b from-background via-surface/30 to-background border-b border-border/40 relative overflow-hidden">
      
      {/* Decorative background shapes */}
      <div className="absolute top-1/4 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-xp/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title & Description */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black font-display text-headline">
            Dari Cambies, Oleh Cambies, <span className="text-primary">Untuk Cambies</span>
          </h2>
          <p className="text-lg text-body max-w-2xl mx-auto leading-relaxed">
            Saat ini Umbuddy hadir secara gratis agar belajarmu tetap fokus. Sebagai platform komunitas, setiap kontribusi kecilmu sangat berarti untuk menjaga mimpi para <span className="text-primary font-bold">Cambies (Calon Umbies)</span> terus menyala.
          </p>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Card 1: Dukung Server */}
          <Card 
            padding="lg" 
            className="flex flex-col justify-between items-center text-center p-8 sm:p-10 relative overflow-hidden group hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300 border border-border bg-background"
          >
            <div className="w-full flex flex-col items-center">
              
              {/* Mascot Container */}
              <div className="w-40 h-40 mb-6 relative group-hover:scale-105 transition-transform duration-300">
                <Image 
                  src="/mascot/mascot_support.png" 
                  alt="Dukung Server" 
                  width={180} 
                  height={180} 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title & Info */}
              <div className="space-y-3 mb-8">
                <h3 className="text-2xl font-black font-display text-headline flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6 text-error fill-error animate-pulse" />
                  Dukung Server
                </h3>
                <p className="text-sm sm:text-base text-body leading-relaxed max-w-sm">
                  Satu cangkir kopi hangat darimu sangat berarti untuk menjaga server tetap menyala. Dukung pengembang lewat Saweria agar Umbuddy terus online melayani puluhan ribu Cambies!
                </p>
              </div>
            </div>

            {/* Saweria Custom Button */}
            <a 
              href="https://saweria.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#faae2b] text-headline font-extrabold rounded-2xl border-2 border-[#e0911b] shadow-[0_4px_0_0_#c07b12] active:translate-y-[3px] active:shadow-[0_1px_0_0_#c07b12] hover:bg-[#fa9e1b] transition-all text-base"
            >
              <Heart className="w-5 h-5 text-headline" />
              <span>Dukung via Saweria</span>
            </a>
          </Card>

          {/* Card 2: Crowdsourcing Soal */}
          <Card 
            padding="lg" 
            className="flex flex-col justify-between items-center text-center p-8 sm:p-10 relative overflow-hidden group hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300 border border-border bg-background"
          >
            <div className="w-full flex flex-col items-center">
              
              {/* Mascot Container */}
              <div className="w-40 h-40 mb-6 relative group-hover:scale-105 transition-transform duration-300">
                <Image 
                  src="/mascot/mascot_donation.png" 
                  alt="Sumbang Soal" 
                  width={180} 
                  height={180} 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title & Info */}
              <div className="space-y-3 mb-8">
                <h3 className="text-2xl font-black font-display text-headline flex items-center justify-center gap-2">
                  <UploadCloud className="w-6 h-6 text-primary" />
                  Crowdsourcing Soal
                </h3>
                <p className="text-sm sm:text-base text-body leading-relaxed max-w-sm">
                  Punya bank soal CPNS, Kedinasan, atau BUMN yang bagus? Bagikan kontribusimu agar selalu ada update paket tryout terbaru untuk mempermudah perjuangan sesama Cambies!
                </p>
              </div>
            </div>

            {/* Chunky Secondary Button */}
            <button 
              className="w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center gap-2 px-6 py-4 bg-surface text-headline font-extrabold rounded-2xl border-2 border-border-strong shadow-[0_4px_0_0_var(--color-border-strong)] active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--color-border-strong)] hover:bg-surface-hover transition-all text-base"
            >
              <UploadCloud className="w-5 h-5 text-headline" />
              <span>Sumbang Soal Sekarang</span>
            </button>
          </Card>

        </div>
      </div>
    </section>
  )
}
