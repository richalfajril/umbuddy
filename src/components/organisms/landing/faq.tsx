'use client'

import * as React from 'react'
import { Card } from '@/components/ui'
import { ChevronDown, Sparkles } from 'lucide-react'

const faqs = [
  {
    question: 'Apakah Umbuddy cocok untuk pemula yang baru pertama kali ikut CPNS?',
    answer: 'Sangat cocok! Umbuddy didesain agar tidak mengintimidasi pemula. Kami memecah tumpukan materi SKD yang raksasa menjadi misi harian kecil yang mudah diselesaikan. Kamu tidak akan merasa kewalahan (burnout) karena maskot pendampingmu akan membimbing dari dasar step-by-step.'
  },
  {
    question: 'Apa bedanya Umbuddy dengan platform tryout biasa?',
    answer: 'Platform biasa hanya memberi skor akhir dan kunci jawaban kaku. Di Umbuddy, kami fokus pada pembentukan konsistensi belajar melalui gamifikasi (Streak & Battle 1vs1) serta Smart Analytics yang membedah narasi kelemahanmu secara mendalam. Belajar di sini terasa seperti bermain game RPG yang seru!'
  },
  {
    question: 'Kenapa Umbuddy saat ini gratis untuk diakses?',
    answer: 'Kami percaya persiapan masa depan yang cerah tidak harus dibatasi oleh biaya tinggi. Umbuddy lahir dari komunitas untuk sesama pejuang ASN. Kami berkomitmen menyediakan akses utama bebas biaya tanpa iklan yang mengganggu, didukung oleh sumbangan sukarela dan kontribusi soal dari para Umbies.'
  },
  {
    question: 'Bagaimana sistem Smart Analytics membantu mendongkrak skorku?',
    answer: 'Setiap kali kamu menjawab soal, algoritma kami membaca pola pemahamanmu secara realtime. Analytics tidak hanya merekam statistik, tetapi menerjemahkannya menjadi tindakan nyata: prioritas materi yang wajib kamu serang, narasi rekomendasi belajar pribadi, hingga kalkulasi probabilitas kelolosan seleksimu.'
  },
  {
    question: 'Apakah sistem Ranked & Leaderboard mempengaruhi proses belajarku?',
    answer: 'Ya, secara psikologis sangat membantu menjaga konsistensi! Sistem kasta golongan (mulai dari Umbies Magang hingga puncak Menteri) dirancang untuk memicu jiwa kompetitif yang sehat. Progress kecil belajarmu setiap hari dikonversi menjadi XP, membuat perjuangan belajarmu terasa selalu dihargai dan terukur dibanding pesaing nasional.'
  },
  {
    question: 'Apakah platform ini bisa diakses lancar lewat HP?',
    answer: 'Tentu saja! Umbuddy didesain dari awal dengan pendekatan mobile-first. Seluruh simulasi CAT, duel Battle Arena 1vs1, dan fitur analitik dapat berjalan sangat responsif dan mulus langsung dari browser smartphone kamu tanpa perlu menginstal aplikasi tambahan.'
  }
]

export function LandingFAQ() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  const toggleIndex = (idx: number) => {
    setActiveIndex(activeIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-background via-surface/30 to-background relative overflow-hidden border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetrical Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Title & Description (Sticky) */}
          <div className="lg:sticky lg:top-24 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider">FAQ & Bantuan</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-display text-headline leading-tight">
              Pertanyaan <span className="text-primary">Populer</span>
            </h2>
            <p className="text-base sm:text-lg text-body max-w-md mx-auto lg:mx-0 leading-relaxed">
              Masih bingung mengenai cara kerja game, battle, atau persiapan CPNS di Umbuddy? Tenang, kami sudah siapkan jawabannya di sini.
            </p>
          </div>

          {/* Right Column: Accordions */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card 
                key={idx} 
                padding="none"
                className={`hover:border-primary/50 transition-all duration-300 ${
                  activeIndex === idx ? 'border-primary/50' : 'border-border'
                }`}
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full flex justify-between items-center text-left p-6 md:p-8 focus:outline-none select-none touch-target"
                  aria-expanded={activeIndex === idx}
                >
                  <span className="text-base sm:text-lg font-bold font-display text-headline pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted transition-transform duration-300 shrink-0 ${
                      activeIndex === idx ? 'rotate-180 text-primary' : ''
                    }`} 
                  />
                </button>

                {/* Pure CSS slide-down height transition */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    activeIndex === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-6 md:pb-8 px-6 md:px-8 border-t border-border/50">
                      <p className="text-body leading-relaxed text-sm sm:text-base pt-4 max-w-xl">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
