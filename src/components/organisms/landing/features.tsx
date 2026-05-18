import Image from 'next/image'
import { Card } from '@/components/ui'
import { 
  BookOpen, 
  Swords, 
  BarChart3, 
  Zap, 
  Trophy, 
  TrendingUp, 
  Brain,
  Sparkles,
  Coins,
  Flame
} from 'lucide-react'

const features = [
  {
    title: 'Daily Question Practice',
    description: 'Latih kemampuanmu setiap hari dengan bank soal berkualitas tinggi yang selalu di-update secara berkala.',
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    mascot: '/mascot/mascot_workout.png',
    className: 'lg:col-span-1 border border-border bg-background',
  },
  {
    title: 'Realtime Mini CAT Battle',
    description: 'Tantang sesama Umbies secara realtime. Adu cepat dan tepat dalam menjawab paket soal mini 1vs1 yang seru!',
    icon: <Swords className="w-8 h-8 text-primary" />,
    mascot: '/mascot/mascot_battle.png',
    className: 'lg:col-span-2 border-2 border-primary/30 shadow-card bg-background',
  },
  {
    title: 'Smart Analytics',
    description: 'Sistem analisis cerdas yang membedah kelemahan materi TWK, TIU, dan TKP milikmu secara mendalam.',
    icon: <BarChart3 className="w-8 h-8 text-xp" />,
    mascot: '/mascot/mascot_detective.png',
    className: 'lg:col-span-1 border border-border bg-background',
  },
  {
    title: 'Simulasi CAT Akurat',
    description: 'Pengalaman simulasi ujian dengan standar resmi BKN. Lengkap dengan batasan waktu, passing grade, dan pembobotan nilai nyata.',
    icon: <Zap className="w-8 h-8 text-xp" />,
    mascot: '/mascot/mascot_teaching.png',
    className: 'lg:col-span-1 border border-border bg-background',
  },
  {
    title: 'Ranked System',
    description: 'Naikkan kasta golongan kepangkatanmu lewat perolehan XP, mulai dari Umbies, Umbies Senior, Esmelon, hingga mencapai tingkat Menteri!',
    icon: <Trophy className="w-8 h-8 text-xp" />,
    mascot: '/mascot/mascot_crown.png',
    className: 'lg:col-span-1 border-2 border-xp/40 shadow-card bg-background',
  },
  {
    title: 'Predictive Rank & Passing Probability',
    description: 'Ketahui probabilitas kelolosan seleksi CPNS milikmu secara realtime berdasarkan tren performa belajarmu dibanding pesaing lain.',
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    mascot: '/mascot/mascot_success.png',
    className: 'lg:col-span-2 border-2 border-primary/20 shadow-card bg-background',
  },
  {
    title: 'Weakness Narrative',
    description: 'Dapatkan penjelasan strategi belajar yang ramah dan interaktif dari maskot pendamping mengenai materi yang wajib kamu serang selanjutnya.',
    icon: <Brain className="w-8 h-8 text-primary" />,
    mascot: '/mascot/mascot_support.png',
    className: 'lg:col-span-1 border border-border bg-background',
  },
]

export function LandingFeatures() {
  return (
    <div className="relative">
      {/* 1. Custom Section Divider: Soft Wave & Glow */}
      <div className="w-full h-16 bg-gradient-to-b from-background to-surface/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary-light),_transparent)] opacity-40 dark:opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <section 
        id="features" 
        className="py-20 bg-gradient-to-b from-surface/40 to-background relative overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(116, 195, 50, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(116, 195, 50, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      >
        {/* Decorative glowing blobs */}
        <div className="glow-blob-primary absolute top-1/4 left-1/4 opacity-40 dark:opacity-20 pointer-events-none -z-10 animate-pulse" />
        <div className="glow-blob-secondary absolute bottom-1/4 right-1/4 opacity-40 dark:opacity-20 pointer-events-none -z-10 animate-pulse" />
        
        {/* Floating Decors */}
        <div className="absolute right-[8%] top-[15%] text-xp/25 w-16 h-16 animate-float pointer-events-none hidden lg:block" style={{ animationDelay: '2s' }}>
          <Coins className="w-full h-full" />
        </div>
        <div className="absolute left-[6%] bottom-[20%] text-primary/15 w-14 h-14 animate-bounce-subtle pointer-events-none hidden lg:block">
          <Flame className="w-full h-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary mx-auto">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider">Fitur Unggulan</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-display text-headline">
            Fitur Tactical Untuk <span className="text-primary">Kemenanganmu</span>
          </h2>
          <p className="text-lg text-body max-w-2xl mx-auto leading-relaxed">
            Belajar sedikit demi sedikit setiap hari tanpa kehilangan motivasi. Ucapkan selamat tinggal pada rasa bingung dan burnout saat menghadapi ribuan materi SKD.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Card 
              key={idx} 
              className={`relative overflow-hidden group hover:scale-[1.01] hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated transition-all duration-300 p-8 flex flex-col justify-between min-h-[280px] sm:min-h-[260px] ${feature.className}`}
            >
              <div className="space-y-6 relative z-10 max-w-[80%] sm:max-w-[75%] lg:max-w-[70%]">
                <div className="p-3 bg-background rounded-2xl w-fit shadow-sm border border-border">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black font-display text-headline">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-body leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Mascot Preview */}
              <div className="absolute -right-4 -bottom-4 w-36 h-36 sm:w-40 sm:h-40 opacity-20 group-hover:opacity-30 lg:opacity-100 lg:group-hover:opacity-100 group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300 grayscale-[0.3] group-hover:grayscale-0">
                <Image 
                  src={feature.mascot} 
                  alt={feature.title} 
                  width={200} 
                  height={200} 
                  className="w-full h-full object-contain"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  </div>
  )
}
