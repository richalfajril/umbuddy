import { Card } from '@/components/ui'
import { Quote, Heart, Sparkles } from 'lucide-react'

const row1Testimonials = [
  {
    name: 'Nadia',
    alumni: 'Alumni Universitas Padjadjaran',
    targetKL: 'Diterima di Kementerian Keuangan',
    quote: 'Latihan di Umbuddy benar-benar ngelatih kecepatan berpikirku. Waktu CAT aslinya terasa lebih santai karena sudah biasa tertekan pas duel.',
    color: 'bg-primary text-primary-foreground',
  },
  {
    name: 'Fajar',
    alumni: 'Alumni Universitas Gadjah Mada',
    targetKL: 'Diterima di BPK RI',
    quote: 'Fitur Smart Analytics ngebantu banget bedah kelemahanku di TIU. Strategi belajarku jadi presisi dan gak buang-buang waktu.',
    color: 'bg-xp text-headline',
  },
  {
    name: 'Dewi',
    alumni: 'Alumni Universitas Indonesia',
    targetKL: 'Diterima di Kementerian Luar Negeri',
    quote: 'Fitur battle 1vs1 bikin aku selalu tertantang tiap hari. Berasa punya sparring partner nyata untuk evaluasi diri.',
    color: 'bg-error text-white',
  },
  {
    name: 'Rizky',
    alumni: 'Alumni Institut Teknologi Bandung',
    targetKL: 'Target Kementerian Perhubungan',
    quote: 'Sebagai Cambies angkatan baru, sistem peringkat di Umbuddy bikin aku terus terpacu menjaga streak belajar harian tetap menyala.',
    color: 'bg-primary text-primary-foreground',
  },
  {
    name: 'Amalia',
    alumni: 'Alumni Universitas Diponegoro',
    targetKL: 'Target Kejaksaan Agung',
    quote: 'Belajar TWK jadi super seru berkat kuis harian. Hafalan sejarah dan undang-undang jadi gampang masuk karena disajikan kayak game.',
    color: 'bg-xp text-headline',
  },
  {
    name: 'Hendra',
    alumni: 'Alumni Universitas Airlangga',
    targetKL: 'Diterima di Kementerian Hukum & HAM',
    quote: 'Tryout di sini akurat banget pembobotannya dengan passing grade BKN asli. Bikin simulasi mental jadi sangat matang.',
    color: 'bg-error text-white',
  },
]

const row2Testimonials = [
  {
    name: 'Siti',
    alumni: 'Alumni Universitas Brawijaya',
    targetKL: 'Diterima di Kementerian Kesehatan',
    quote: 'Naluri menjawab soal TKP saya meningkat drastis berkat ribuan latihan kasus taktis yang disajikan secara interaktif.',
    color: 'bg-xp text-headline',
  },
  {
    name: 'Budi',
    alumni: 'Alumni Universitas Sebelas Maret',
    targetKL: 'Diterima di Kementerian PUPR',
    quote: 'Maskot pendamping di Umbuddy selalu ngasih petunjuk taktis dan motivasi pas performa belajarku lagi agak turun.',
    color: 'bg-primary text-primary-foreground',
  },
  {
    name: 'Kiki',
    alumni: 'Alumni Universitas Hasanuddin',
    targetKL: 'Target Pemerintah Provinsi DKI',
    quote: 'Setiap pulang kerja langsung nyempetin login buat ngerjain target harian. UI-nya yang bersih dan tanpa iklan bikin betah berjam-jam.',
    color: 'bg-error text-white',
  },
  {
    name: 'Lina',
    alumni: 'Alumni Universitas Sriwijaya',
    targetKL: 'Diterima di OJK',
    quote: 'Latihan bareng teman lewat grup belajar bikin progress kami semua terukur secara transparan. Sangat bersyukur nemu platform ini.',
    color: 'bg-primary text-primary-foreground',
  },
  {
    name: 'Dika',
    alumni: 'Alumni IPB University',
    targetKL: 'Target Kementerian BUMN',
    quote: 'Prediksi kelolosan di Smart Analytics ngebantu saya tahu sub-materi mana yang masih bolong dan butuh serangan taktis tambahan.',
    color: 'bg-xp text-headline',
  },
  {
    name: 'Farhan',
    alumni: 'Alumni Universitas Sumatera Utara',
    targetKL: 'Diterima di Badan Siber & Sandi Negara',
    quote: 'Leaderboard nasionalnya bikin ketagihan bersaing sehat. Dari status Umbies magang sampai akhirnya bisa tembus rank Menteri!',
    color: 'bg-error text-white',
  },
]

export function LandingTestimonials() {
  return (
    <div className="relative">
      {/* 1. Custom Section Divider: Soft Wave & Glow */}
      <div className="w-full h-16 bg-gradient-to-b from-background to-surface/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary-light),_transparent)] opacity-40 dark:opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <section id="testimonials" className="bg-gradient-to-b from-surface/40 via-primary-light/10 to-background py-20 dark:via-primary/5 relative overflow-hidden">
        {/* Floating Decors */}
        <div className="absolute left-[8%] top-1/4 text-error/15 w-14 h-14 motion-safe:animate-float motion-reduce:animate-none pointer-events-none hidden lg:block" style={{ animationDelay: '1.5s' }}>
          <Heart className="w-full h-full fill-error/5" />
        </div>
        <div className="absolute right-[10%] bottom-1/4 text-xp/25 w-16 h-16 motion-safe:animate-bounce-subtle motion-reduce:animate-none pointer-events-none hidden lg:block" style={{ animationDelay: '3.5s' }}>
          <Sparkles className="w-full h-full" />
        </div>
      
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
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-left,
          .animate-marquee-right {
            animation: none;
            transform: none;
          }
        }
      `}</style>

      <div className="w-full">
        {/* Title */}
        <div className="mb-12 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary mx-auto">
            <Heart className="w-4 h-4 text-primary fill-primary motion-safe:animate-pulse motion-reduce:animate-none" />
            <span className="text-xs font-black uppercase tracking-wider">Harapan & Bukti Nyata</span>
          </div>
          <h2 className="font-display text-3xl font-black text-headline md:text-5xl">
            Cerita Umbies & Harapan <span className="text-primary">Para Cambies</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-body leading-relaxed">
            Intip kisah sukses rekan-rekan Umbies yang kini telah mengabdi di berbagai Kementerian, Lembaga, dan Instansi Impian. Baca juga harapan membara para Cambies yang sedang berjuang dan testimoni mereka bersama Umbuddy!
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
                className="w-[320px] sm:w-[380px] flex-shrink-0 relative overflow-hidden group hover:scale-[1.02] transition-colors transition-transform transition-shadow duration-300 mx-3 border border-border"
              >
                {/* Accentuated Gold Quote Mark Icon */}
                <Quote className="absolute top-4 right-4 h-10 w-10 text-xp/20 fill-xp/10 dark:text-xp/30 dark:fill-xp/20 transition-transform group-hover:scale-110" aria-hidden="true" />
                
                <div className="mb-4 flex items-start gap-3 relative z-10">
                  <div className={`flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl font-display text-lg sm:text-xl font-black ${item.color}`}>
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    {/* Vertical Hierarchy: name, alumni, target K/L */}
                    <p className="font-black text-headline text-sm sm:text-base leading-tight">{item.name}</p>
                    <p className="text-xs font-semibold text-body mt-0.5">{item.alumni}</p>
                    <p className="text-xs font-extrabold text-primary mt-1.5">{item.targetKL}</p>
                  </div>
                </div>
                <p className="leading-relaxed text-body text-xs sm:text-sm relative z-10">
                  &ldquo;{item.quote}&rdquo; <span className="text-primary font-bold hover:underline cursor-pointer ml-1">Selengkapnya</span>
                </p>
              </Card>
            ))}
          </div>

          {/* Row 2 (Ke Kanan) */}
          <div className="animate-marquee-right gap-6 py-2">
            {[...row2Testimonials, ...row2Testimonials].map((item, idx) => (
              <Card 
                key={`r2-${item.name}-${idx}`} 
                padding="lg" 
                className="w-[320px] sm:w-[380px] flex-shrink-0 relative overflow-hidden group hover:scale-[1.02] transition-colors transition-transform transition-shadow duration-300 mx-3 border border-border"
              >
                {/* Accentuated Gold Quote Mark Icon */}
                <Quote className="absolute top-4 right-4 h-10 w-10 text-xp/20 fill-xp/10 dark:text-xp/30 dark:fill-xp/20 transition-transform group-hover:scale-110" aria-hidden="true" />
                
                <div className="mb-4 flex items-start gap-3 relative z-10">
                  <div className={`flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl font-display text-lg sm:text-xl font-black ${item.color}`}>
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    {/* Vertical Hierarchy: name, alumni, target K/L */}
                    <p className="font-black text-headline text-sm sm:text-base leading-tight">{item.name}</p>
                    <p className="text-xs font-semibold text-body mt-0.5">{item.alumni}</p>
                    <p className="text-xs font-extrabold text-primary mt-1.5">{item.targetKL}</p>
                  </div>
                </div>
                <p className="leading-relaxed text-body text-xs sm:text-sm relative z-10">
                  &ldquo;{item.quote}&rdquo; <span className="text-primary font-bold hover:underline cursor-pointer ml-1">Selengkapnya</span>
                </p>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </section>
  </div>
  )
}
