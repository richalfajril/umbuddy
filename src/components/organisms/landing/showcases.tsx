import Image from 'next/image'
import { Card } from '@/components/ui'
import {
  BarChart3,
  CheckCircle2,
  Medal,
  Shield,
  Swords,
  Target,
  Trophy,
} from 'lucide-react'

const leaderboardUsers = [
  { rank: 1, name: 'Rani', xp: '18.420 XP', badge: 'Esmelon III', badgeImg: '/badge/esmelon_III_d.png', color: 'bg-xp text-headline' },
  { rank: 2, name: 'Bima', xp: '17.880 XP', badge: 'Umbies Senior', badgeImg: '/badge/umbies_senior_III_a.png', color: 'bg-primary text-primary-foreground' },
  { rank: 3, name: 'Alya', xp: '16.950 XP', badge: 'Umbies I', badgeImg: '/badge/umbies_I_a.png', color: 'bg-error text-white' },
]

export function LandingShowcases() {
  return (
    <>
      {/* ── Battle Showcase ── */}
      <section id="battle" className="bg-gradient-to-b from-background to-surface/60 border-b border-border/40 pt-24 pb-12">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary">
              <Swords className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-black uppercase">Battle Showcase</span>
            </div>
            <h2 className="font-display text-3xl font-black text-headline md:text-5xl">
              Duel Mini CAT 1vs1 yang bikin latihan <span className="text-primary">terasa hidup</span>
            </h2>
            <p className="max-w-xl text-lg leading-8 text-body">
              Belajar sendirian emang sering bikin jenuh. Makanya, ajak partner belajarmu buat adu taktik di Arena Mini CAT secara realtime! Saling uji pemahaman materi, jawab cepat sebelum waktu habis, dan bahas pembahasannya bersama sehabis duel selesai. Cara paling seru buat saling dorong sampai lulus ASN bareng-bareng.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {['Invite teman', 'Bahas bersama', 'XP fair-play'].map((item) => (
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

      {/* ── Analytics Showcase ── */}
      <section id="analytics" className="bg-gradient-to-b from-surface/60 to-background border-b border-border/40 py-12">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
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
              Rekomendasi belajar yang <span className="text-primary">jelas</span>, bukan cuma angka skor
            </h2>
            <p className="max-w-xl text-lg leading-8 text-body">
              Umbuddy membaca pola jawabanmu dan mengubahnya jadi misi harian, prioritas materi, dan prediksi progress yang mudah ditindaklanjuti. Kamu nggak perlu bingung lagi harus mulai belajar dari mana setiap hari.
            </p>
            {/* Stat highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-background p-4 text-center shadow-card">
                <p className="font-display text-3xl font-black text-primary">92%</p>
                <p className="text-xs font-bold text-muted mt-1">Akurasi prediksi skor</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4 text-center shadow-card">
                <p className="font-display text-3xl font-black text-xp">30+</p>
                <p className="text-xs font-bold text-muted mt-1">Sub-materi dianalisis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Leaderboard Showcase ── */}
      <section id="leaderboard" className="bg-gradient-to-b from-background to-surface/60 border-b border-border/40 pt-12 pb-24">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary">
              <Trophy className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-black uppercase">Leaderboard Showcase</span>
            </div>
            <h2 className="font-display text-3xl font-black text-headline md:text-5xl">
              Naik rank, kumpulkan XP, dan kejar <span className="text-primary">jabatan impian</span>
            </h2>
            <p className="max-w-xl text-lg leading-8 text-body">
              Ranking nasional, teman, dan tryout membuat progress terasa terlihat. Setiap latihan kecil punya efek ke perjalanan musim kamu. Rasakan sensasi berkompetisi secara sehat dan buktikan kemampuanmu di puncak klasemen!
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
                  {/* 1. Nomor (Rank) */}
                  <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black bg-surface-hover text-headline">
                    {user.rank}
                  </div>

                  {/* 2. Avatar Profil */}
                  <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl font-display text-base font-black ${user.color}`}>
                    {user.name.charAt(0)}
                  </div>

                  {/* 3. Badge dari Asset */}
                  <div className="flex-shrink-0 w-10 h-10 relative">
                    <Image 
                      src={user.badgeImg} 
                      alt={user.badge} 
                      width={40} 
                      height={40} 
                      className="w-full h-full object-contain" 
                    />
                  </div>

                  {/* 4. Name & Badge Text */}
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-headline leading-tight">{user.name}</p>
                    <p className="text-xs font-bold text-muted mt-0.5">{user.badge}</p>
                  </div>

                  {/* 5. XP */}
                  <p className="font-display text-base sm:text-lg font-black text-primary">{user.xp}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </>
  )
}
