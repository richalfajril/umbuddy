import { Card } from '@/components/ui'
import { Quote } from 'lucide-react'

const testimonials = [
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
]

export function LandingTestimonials() {
  return (
    <section id="testimonials" className="bg-gradient-to-b from-surface/60 via-primary-light/10 to-background border-b border-border/40 py-24 dark:via-primary/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-black text-headline md:text-5xl">
            Latihan Jadi Punya Cerita
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-body">
            Simulasi, battle, dan streak membuat belajar terasa seperti perjalanan naik level.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} padding="lg" className="relative overflow-hidden">
              {/* Dekoratif tanda kutip */}
              <Quote className="absolute top-4 right-4 h-10 w-10 text-border opacity-60" aria-hidden="true" />
              <div className="mb-4 flex items-center gap-3 relative z-10">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-display text-xl font-black ${item.color}`}>
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-headline">{item.name}</p>
                  <p className="text-sm font-bold text-primary">{item.result}</p>
                </div>
              </div>
              <p className="leading-7 text-body relative z-10">&ldquo;{item.quote}&rdquo;</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
