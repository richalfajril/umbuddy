import Image from 'next/image'
import { Card } from '@/components/ui'
import { Swords, Zap, BarChart3, Gift, Coffee } from 'lucide-react'

const features = [
  {
    title: 'Realtime CAT Battle',
    description: 'Tantang temanmu dalam simulasi CAT 1vs1 secara realtime. Siapa yang lebih cepat dan tepat?',
    icon: <Swords className="w-10 h-10 text-primary" />,
    mascot: '/mascot/mascot_battle.png',
    className: 'lg:col-span-2 bg-primary-light/50',
  },
  {
    title: 'Smart Analytics',
    description: 'Bedah kelemahanmu dengan Rule-Based Analytics. Tahu persis bagian mana yang harus diperbaiki.',
    icon: <BarChart3 className="w-8 h-8 text-xp" />,
    mascot: '/mascot/mascot_detective.png',
    className: 'lg:col-span-1',
  },
  {
    title: 'Simulasi CAT Akurat',
    description: 'Pengalaman ujian yang mirip aslinya. 110 soal, 100 menit, sistem penilaian resmi.',
    icon: <Zap className="w-8 h-8 text-xp" />,
    mascot: '/mascot/mascot_teaching.png',
    className: 'lg:col-span-1',
  },
  {
    title: 'Sumbang Soal',
    description: 'Bantu sesama Umbies dengan menyumbangkan soal berkualitas. Crowdsourcing untuk kita semua!',
    icon: <Gift className="w-8 h-8 text-error" />,
    mascot: '/mascot/mascot_donation.png',
    className: 'lg:col-span-2 bg-xp-light/40',
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-surface/50 to-background border-t border-border/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
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
              className={`relative overflow-hidden group hover:scale-[1.02] transition-all p-8 flex flex-col justify-between h-full ${feature.className}`}
            >
              <div className="space-y-6 relative z-10">
                <div className="p-3 bg-background rounded-2xl w-fit shadow-sm border border-border">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black font-display text-headline">
                    {feature.title}
                  </h3>
                  <p className="text-body leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Mascot Preview */}
              <div className="absolute -right-4 -bottom-4 w-40 h-40 opacity-20 lg:opacity-100 group-hover:scale-110 group-hover:-rotate-6 transition-all grayscale-[0.5] group-hover:grayscale-0">
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

        {/* Community & Donation Teaser */}
        <div className="mt-20 p-8 rounded-3xl border-4 border-dashed border-primary/20 bg-background flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Coffee className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-headline">Dukung Server Umbuddy</h4>
              <p className="text-body">Aplikasi ini 100% gratis tanpa iklan. Dukung kami agar server tetap menyala!</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-3 bg-xp hover:bg-warning text-headline font-bold rounded-xl shadow-[0_4px_0_0_var(--color-beige)] active:translate-y-[2px] active:shadow-[0_2px_0_0_var(--color-beige)] transition-all flex items-center justify-center gap-2">
              <Coffee className="h-5 w-5" aria-hidden="true" />
              <span>Donasi via Saweria</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
