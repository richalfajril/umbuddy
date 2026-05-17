import Image from 'next/image'
import Link from 'next/link'
import { Button, Card } from '@/components/ui'
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Medal,
  Shield,
  Swords,
  Target,
  Trophy,
  Users,
} from 'lucide-react'

const leaderboardUsers = [
  { rank: 1, name: 'Rani', xp: '18.420 XP', badge: 'Eselon III' },
  { rank: 2, name: 'Bima', xp: '17.880 XP', badge: 'Umbies Senior' },
  { rank: 3, name: 'Alya', xp: '16.950 XP', badge: 'Umbies Senior' },
]

const testimonials = [
  {
    name: 'Nadia',
    result: '+84 poin simulasi',
    quote: 'Battle bikin latihan jadi nagih, tapi tetap serius buat ngejar passing grade.',
  },
  {
    name: 'Fajar',
    result: 'Streak 21 hari',
    quote: 'Analytics-nya bantu aku tahu bagian TIU mana yang harus diserang duluan.',
  },
  {
    name: 'Dewi',
    result: 'Top 10 mingguan',
    quote: 'Rasanya seperti punya sparring partner tiap hari, bukan cuma bank soal biasa.',
  },
]

export function LandingShowcases() {
  return (
    <>
      <section id="battle" className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary">
              <Swords className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-black uppercase">Battle Showcase</span>
            </div>
            <h2 className="font-display text-3xl font-black text-headline md:text-5xl">
              Duel CAT 1vs1 yang bikin latihan terasa hidup
            </h2>
            <p className="max-w-xl text-lg leading-8 text-body">
              Undang teman, jawab soal bareng, dan biarkan backend menghitung skor secara adil. Cocok buat menguji kecepatan tanpa kehilangan akurasi.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {['Invite teman', 'Realtime state', 'XP fair-play'].map((item) => (
                <div key={item} className="flex items-center gap-2 font-bold text-headline">
                  <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card padding="lg" className="relative overflow-hidden">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase text-primary">Arena TWK</p>
                <h3 className="font-display text-2xl font-black text-headline">
                  Kamu vs Bima
                </h3>
              </div>
              <Image src="/mascot/mascot_battle.png" alt="" width={96} height={96} className="h-20 w-20 object-contain" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-primary bg-primary-light p-4 text-primary-dark">
                <p className="text-sm font-black">Kamu</p>
                <p className="font-display text-4xl font-black">420</p>
                <p className="text-xs font-bold">18 jawaban benar</p>
              </div>
              <div className="rounded-2xl border-2 border-border bg-surface p-4">
                <p className="text-sm font-black text-muted">Bima</p>
                <p className="font-display text-4xl font-black text-headline">395</p>
                <p className="text-xs font-bold text-body">17 jawaban benar</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-border bg-background p-4">
              <div className="mb-2 flex items-center justify-between text-sm font-black">
                <span>Progress ronde</span>
                <span className="text-primary">72%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill w-[72%]" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="analytics" className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Card padding="lg">
            <div className="flex items-center gap-4">
              <Image src="/mascot/mascot_detective.png" alt="" width={110} height={110} className="h-24 w-24 object-contain" />
              <div>
                <p className="text-sm font-black uppercase text-primary">Weak Area Analysis</p>
                <h3 className="font-display text-2xl font-black text-headline">
                  TIU butuh serangan taktis
                </h3>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {[
                { label: 'Deret angka', value: '42%', icon: Target },
                { label: 'Sinonim', value: '68%', icon: BarChart3 },
                { label: 'Nasionalisme', value: '81%', icon: Shield },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="rounded-2xl border border-border bg-background p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2 font-black text-headline">
                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                        {item.label}
                      </span>
                      <span className="font-black text-body">{item.value}</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: item.value }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-xp/30 bg-xp-light px-4 py-2 text-headline">
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-black uppercase">Analytics Showcase</span>
            </div>
            <h2 className="font-display text-3xl font-black text-headline md:text-5xl">
              Rekomendasi belajar yang jelas, bukan cuma angka skor
            </h2>
            <p className="max-w-xl text-lg leading-8 text-body">
              Umbuddy membaca pola jawabanmu dan mengubahnya jadi misi harian, prioritas materi, dan prediksi progress yang mudah ditindaklanjuti.
            </p>
          </div>
        </div>
      </section>

      <section id="leaderboard" className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary">
              <Trophy className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-black uppercase">Leaderboard Showcase</span>
            </div>
            <h2 className="font-display text-3xl font-black text-headline md:text-5xl">
              Naik rank, kumpulkan XP, dan kejar jabatan impian
            </h2>
            <p className="max-w-xl text-lg leading-8 text-body">
              Ranking nasional, teman, dan tryout membuat progress terasa terlihat. Setiap latihan kecil punya efek ke perjalanan musim kamu.
            </p>
          </div>

          <Card padding="lg">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-2xl font-black text-headline">
                Top Umbies Minggu Ini
              </h3>
              <Medal className="h-8 w-8 text-xp" aria-hidden="true" />
            </div>
            <div className="space-y-3">
              {leaderboardUsers.map((user) => (
                <div key={user.rank} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-black text-primary-foreground">
                    {user.rank}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-headline">{user.name}</p>
                    <p className="text-sm font-bold text-muted">{user.badge}</p>
                  </div>
                  <p className="font-display text-lg font-black text-primary">{user.xp}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section id="testimonials" className="bg-background py-24">
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
              <Card key={item.name} padding="lg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
                    <Users className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-black text-headline">{item.name}</p>
                    <p className="text-sm font-bold text-primary">{item.result}</p>
                  </div>
                </div>
                <p className="leading-7 text-body">{item.quote}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">
          <Image src="/mascot/mascot_encouraging.png" alt="" width={180} height={180} className="h-36 w-36 object-contain" />
          <div>
            <h2 className="font-display text-3xl font-black text-headline md:text-5xl">
              Siap mulai naik level hari ini?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-body">
              Buat akun gratis, pilih mode latihan, dan biarkan Umbuddy bantu kamu menjaga ritme belajar.
            </p>
          </div>
          <Link href="/auth/register">
            <Button size="lg" className="px-10 py-6 text-lg">
              Daftar Gratis Sekarang
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
