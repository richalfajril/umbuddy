'use client'

import * as React from 'react'
import { Card } from '@/components/ui'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Apa itu Umbuddy?',
    answer: 'Umbuddy adalah platform persiapan CPNS revolusioner yang menggunakan gamifikasi untuk membuat belajarmu jadi seru dan kompetitif. Kami menggabungkan bank soal berkualitas dengan sistem Battle dan Analytics cerdas.'
  },
  {
    question: 'Apakah Umbuddy benar-benar gratis?',
    answer: 'Ya, 100% GRATIS! Kami tidak memungut biaya langganan atau menampilkan iklan yang mengganggu. Kami hidup dari donasi komunitas dan semangat para Umbies untuk saling membantu.'
  },
  {
    question: 'Bagaimana cara kerja Battle Arena?',
    answer: 'Kamu bisa menantang teman atau user lain untuk duel 1vs1 mengerjakan paket soal CAT. Siapa yang mendapatkan skor tertinggi dengan waktu tercepat akan memenangkan Battle dan mendapatkan XP ekstra!'
  },
  {
    question: 'Apa itu Rule-Based Analytics?',
    answer: 'Sistem cerdas kami membedah setiap jawabanmu. Kami tidak hanya memberi skor, tapi juga memberitahu "kenapa" kamu salah dan sub-materi apa yang harus kamu pelajari lebih dalam (TWK, TIU, atau TKP).'
  },
  {
    question: 'Apakah bisa dibuka di HP?',
    answer: 'Tentu! Umbuddy didesain mobile-first. Kamu bisa belajar dan battle di mana saja, kapan saja, langsung dari browser smartphone-mu.'
  },
  {
    question: 'Bagaimana cara menyumbang soal?',
    answer: 'Kamu bisa klik fitur "Sumbang Soal" di dashboard. Soal yang kamu kirim akan direview oleh admin dan jika lolos akan diterbitkan atas namamu sebagai kontributor!'
  }
]

export function LandingFAQ() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  const toggleIndex = (idx: number) => {
    setActiveIndex(activeIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-background via-surface/30 to-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black font-display text-headline">
            Pertanyaan <span className="text-primary">Populer</span>
          </h2>
          <p className="text-lg text-body">
            Masih bingung? Tenang, Umbuddy sudah siapkan jawabannya.
          </p>
        </div>

        <div className="space-y-6">
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
                <span className="text-lg md:text-xl font-bold font-display text-headline pr-4">
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
                    <p className="text-body leading-relaxed text-base pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
