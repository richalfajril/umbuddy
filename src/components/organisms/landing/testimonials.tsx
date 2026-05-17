import { Card } from '@/components/ui'
import { Quote } from 'lucide-react'

const row1Testimonials = [
  {
    name: 'Nadia',
    result: '+84 poin simulasi',
    quote: 'Battle bikin latihan jadi nagih, tapi tetap serius buat ngejar passing grade.',
    color: 'bg-primary text-primary-foreground',
  },
  {
    name: 'Fajar',
    result: 'Streak 21 hari',
    quote: 'Analytics-nya bantu aku tahu bagian TIU mana yang harus diserang duluan.',
    color: 'bg-xp text-headline',
  },
  {
    name: 'Dewi',
    result: 'Top 10 mingguan',
    quote: 'Rasanya seperti punya sparring partner tiap hari, bukan cuma bank soal biasa.',
    color: 'bg-error text-white',
  },
  {
    name: 'Rizky',
    result: 'Menteri Division',
    quote: 'Naik dari Esmelon IV ke Menteri butuh konsistensi, tapi grafiknya seru banget buat diikuti.',
    color: 'bg-primary text-primary-foreground',
  },
  {
    name: 'Amalia',
    result: 'TIU Master',
    quote: 'Deret angka yang tadinya jadi momok, sekarang jadi lumbung poin simulasiku.',
    color: 'bg-xp text-headline',
  },
  {
    name: 'Hendra',
    result: 'Esmelon IV',
    quote: 'Fitur review area lemah benar-benar hemat waktu belajarku dibanding tryout biasa.',
    color: 'bg-error text-white',
  },
]

const row2Testimonials = [
  {
    name: 'Siti',
    result: 'Lolos PG TKP',
    quote: 'TKP dengan model narasi dan waktu mepet jadi lebih gampang dihadapi berkat simulasi.',
    color: 'bg-xp text-headline',
  },
  {
    name: 'Budi',
    result: 'Streak 30 hari',
    quote: 'Mascot pendampingnya suka ngasih kalimat penyemangat pas aku lagi capek belajarnya.',
    color: 'bg-primary text-primary-foreground',
  },
  {
    name: 'Kiki',
    result: 'Esmelon III',
    quote: 'Grup belajar kami sekarang isinya link battle 1vs1. Belajar jadi ga membosankan lagi!',
    color: 'bg-error text-white',
  },
  {
    name: 'Lina',
    result: '+120 poin TWK',
    quote: 'Analisis sejarah dan nasionalisme di Umbuddy sangat membantu mendongkrak skor TWK-ku.',
    color: 'bg-primary text-primary-foreground',
  },
  {
    name: 'Dika',
    result: 'TWK Specialist',
    quote: 'Sistem reward XP bikin adiktif, rasanya kurang kalau sehari belum ngerjain misi.',
    color: 'bg-xp text-headline',
  },
  {
    name: 'Farhan',
    result: 'Umbies Senior',
    quote: 'Dulu pasrah sama passing grade, sekarang malah ketagihan ngejar leaderboard nasional.',
    color: 'bg-error text-white',
  },
]

export function LandingTestimonials() {
  return (
    <section id="testimonials" className="bg-gradient-to-b from-surface/60 via-primary-light/10 to-background border-b border-border/40 py-24 dark:via-primary/5 relative overflow-hidden">
      {/* CSS Auto Marquee styles */}
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marqueeLeft 40s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marqueeRight 40s linear infinite;
        }
        .marquee-container {
          overflow: hidden;
          width: 100%;
          position: relative;
        }
        .marquee-container:hover .animate-marquee-left,
        .marquee-container:hover .animate-marquee-right {
          animation-play-state: paused;
        }
        .marquee-container::before,
        .marquee-container::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px;
          z-index: 10;
          pointer-events: none;
        }
        @media (min-width: 640px) {
          .marquee-container::before,
          .marquee-container::after {
            width: 180px;
          }
        }
        .marquee-container::before {
          left: 0;
          background: linear-gradient(to right, var(--background) 0%, transparent 100%);
        }
        .marquee-container::after {
          right: 0;
          background: linear-gradient(to left, var(--background) 0%, transparent 100%);
        }
      `}</style>

      <div className="w-full">
        {/* Title */}
        <div className="mb-16 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="font-display text-3xl font-black text-headline md:text-5xl">
            Latihan Jadi Punya <span className="text-primary">Cerita</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-body">
            Simulasi, battle, dan streak membuat belajar terasa seperti perjalanan naik level.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="marquee-container space-y-8">
          
          {/* Row 1 (Ke Kiri) */}
          <div className="animate-marquee-left gap-6 py-2">
            {[...row1Testimonials, ...row1Testimonials].map((item, idx) => (
              <Card 
                key={`r1-${item.name}-${idx}`} 
                padding="lg" 
                className="w-[280px] sm:w-[340px] flex-shrink-0 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 mx-3 border border-border"
              >
                <Quote className="absolute top-4 right-4 h-10 w-10 text-border opacity-30" aria-hidden="true" />
                <div className="mb-4 flex items-center gap-3 relative z-10">
                  <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl font-display text-lg sm:text-xl font-black ${item.color}`}>
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-headline text-sm sm:text-base">{item.name}</p>
                    <p className="text-xs sm:text-sm font-bold text-primary">{item.result}</p>
                  </div>
                </div>
                <p className="leading-relaxed text-body text-xs sm:text-sm relative z-10">&ldquo;{item.quote}&rdquo;</p>
              </Card>
            ))}
          </div>

          {/* Row 2 (Ke Kanan) */}
          <div className="animate-marquee-right gap-6 py-2">
            {[...row2Testimonials, ...row2Testimonials].map((item, idx) => (
              <Card 
                key={`r2-${item.name}-${idx}`} 
                padding="lg" 
                className="w-[280px] sm:w-[340px] flex-shrink-0 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 mx-3 border border-border"
              >
                <Quote className="absolute top-4 right-4 h-10 w-10 text-border opacity-30" aria-hidden="true" />
                <div className="mb-4 flex items-center gap-3 relative z-10">
                  <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl font-display text-lg sm:text-xl font-black ${item.color}`}>
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-headline text-sm sm:text-base">{item.name}</p>
                    <p className="text-xs sm:text-sm font-bold text-primary">{item.result}</p>
                  </div>
                </div>
                <p className="leading-relaxed text-body text-xs sm:text-sm relative z-10">&ldquo;{item.quote}&rdquo;</p>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
