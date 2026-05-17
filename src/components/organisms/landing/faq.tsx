import { Card } from '@/components/ui'

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
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black font-display text-headline">
            Pertanyaan <span className="text-primary">Populer</span>
          </h2>
          <p className="text-lg text-body">
            Masih bingung? Tenang, Umbuddy sudah siapkan jawabannya.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <Card key={idx} className="p-6 md:p-8 hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-black font-display text-headline mb-3">
                {faq.question}
              </h3>
              <p className="text-body leading-relaxed">
                {faq.answer}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
