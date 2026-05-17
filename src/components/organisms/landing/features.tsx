import Image from 'next/image'
import { Card } from '@/components/ui'
import { 
  BookOpen, 
  Swords, 
  BarChart3, 
  Zap, 
  Trophy, 
  TrendingUp, 
  Brain 
} from 'lucide-react'

const features = [
  {
    title: 'Daily Question Practice',
    description: 'Latih kemampuanmu setiap hari dengan bank soal berkualitas tinggi yang selalu di-update secara berkala.',
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    mascot: '/mascot/mascot_workout.png',
    className: 'lg:col-span-1',
  },
  {
    title: 'Realtime Mini CAT Battle',
    description: 'Tantang sesama Umbies secara realtime. Adu cepat dan tepat dalam menjawab paket soal mini 1vs1 yang seru!',
    icon: <Swords className="w-8 h-8 text-primary" />,
    mascot: '/mascot/mascot_battle.png',
    className: 'lg:col-span-2 bg-primary-light/40 dark:bg-primary/5',
  },
  {
    title: 'Smart Analytics',
    description: 'Sistem analisis cerdas yang membedah kelemahan materi TWK, TIU, dan TKP milikmu secara mendalam.',
    icon: <BarChart3 className="w-8 h-8 text-xp" />,
    mascot: '/mascot/mascot_detective.png',
    className: 'lg:col-span-1',
  },
  {
    title: 'Simulasi CAT Akurat',
    description: 'Pengalaman simulasi ujian dengan standar resmi BKN. Lengkap dengan batasan waktu, passing grade, dan pembobotan nilai nyata.',
    icon: <Zap className="w-8 h-8 text-xp" />,
    mascot: '/mascot/mascot_teaching.png',
    className: 'lg:col-span-1',
  },
  {
    title: 'Ranked System',
    description: 'Naikkan kasta golongan kepangkatanmu dari Umbies Magang hingga mencapai Eselon tertinggi lewat perolehan XP.',
    icon: <Trophy className="w-8 h-8 text-xp" />,
    mascot: '/mascot/mascot_crown.png',
    className: 'lg:col-span-1 bg-xp-light/20 dark:bg-xp/5',
  },
  {
    title: 'Predictive Rank & Passing Probability',
    description: 'Ketahui probabilitas kelolosan seleksi CPNS milikmu secara realtime berdasarkan tren performa belajarmu dibanding pesaing lain.',
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    mascot: '/mascot/mascot_success.png',
    className: 'lg:col-span-2 bg-primary-light/20 dark:bg-primary/5',
  },
  {
    title: 'Weakness Narrative',
    description: 'Dapatkan penjelasan strategi belajar yang ramah dan interaktif dari maskot pendamping mengenai materi yang wajib kamu serang selanjutnya.',
    icon: <Brain className="w-8 h-8 text-primary" />,
    mascot: '/mascot/mascot_support.png',
    className: 'lg:col-span-1',
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-surface/50 to-background border-t border-border/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black font-display text-headline">
            Fitur Tactical Untuk <span className="text-primary">Kemenanganmu</span>
          </h2>
          <p className="text-lg text-body max-w-2xl mx-auto">
            Semua yang kamu butuhkan untuk menaklukkan CPNS, dikemas dalam pengalaman bermain yang adiktif.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Card 
              key={idx} 
              className={`relative overflow-hidden group hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col justify-between min-h-[280px] sm:min-h-[260px] ${feature.className}`}
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
  )
}
