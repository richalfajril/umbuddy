'use client'

import { useEffect, useState, useRef } from 'react'
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
  Sparkles,
  Flame,
  ArrowUpRight,
} from 'lucide-react'

const leaderboardUsers = [
  { rank: 1, name: 'Rani', xp: '18.420 XP', badge: 'Esmelon III', badgeImg: '/badge/esmelon_III_d.png', color: 'bg-xp text-headline' },
  { rank: 2, name: 'Bima', xp: '17.880 XP', badge: 'Umbies Senior', badgeImg: '/badge/umbies_senior_III_a.png', color: 'bg-primary text-primary-foreground' },
  { rank: 3, name: 'Alya', xp: '16.950 XP', badge: 'Umbies I', badgeImg: '/badge/umbies_I_a.png', color: 'bg-error text-white' },
]

export function LandingShowcases() {
  // Intersection Observer Visibility states for all 5 pillars
  const [progressionVisible, setProgressionVisible] = useState(false)
  const [battleVisible, setBattleVisible] = useState(false)
  const [analyticsVisible, setAnalyticsVisible] = useState(false)
  const [gamificationVisible, setGamificationVisible] = useState(false)
  const [leaderboardVisible, setLeaderboardVisible] = useState(false)

  const progressionRef = useRef<HTMLDivElement>(null)
  const battleRef = useRef<HTMLDivElement>(null)
  const analyticsRef = useRef<HTMLDivElement>(null)
  const gamificationRef = useRef<HTMLDivElement>(null)
  const leaderboardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const options = { threshold: 0.1 }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === progressionRef.current) setProgressionVisible(true)
          if (entry.target === battleRef.current) setBattleVisible(true)
          if (entry.target === analyticsRef.current) setAnalyticsVisible(true)
          if (entry.target === gamificationRef.current) setGamificationVisible(true)
          if (entry.target === leaderboardRef.current) setLeaderboardVisible(true)
        }
      })
    }, options)

    if (progressionRef.current) observer.observe(progressionRef.current)
    if (battleRef.current) observer.observe(battleRef.current)
    if (analyticsRef.current) observer.observe(analyticsRef.current)
    if (gamificationRef.current) observer.observe(gamificationRef.current)
    if (leaderboardRef.current) observer.observe(leaderboardRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="why-different" className="bg-gradient-to-b from-background via-surface/60 to-background border-b border-border/40 py-20 overflow-hidden">
      
      {/* ── Section Title & Subtitle (Selling the USP) ── */}
      <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider">Kenapa Umbuddy Berbeda?</span>
        </div>
        <h2 className="font-display text-3xl font-black text-headline md:text-5xl leading-tight">
          Bukan Sekadar Tryout Biasa, <span className="text-primary">Ini Era Baru Belajar CPNS</span>
        </h2>
        <p className="text-base sm:text-lg text-body leading-relaxed max-w-2xl mx-auto">
          Kami mengganti cara belajar membosankan dengan 5 pilar taktikal untuk memastikan persiapanmu tidak hanya efektif, tapi juga adiktif dan penuh percaya diri hingga hari H ujian.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

        {/* ── PILAR 1: Belajar Berbasis Progression ── */}
        <div ref={progressionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <div className={`space-y-6 transition-all duration-700 ${progressionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-xp/30 bg-xp-light px-4 py-2 text-headline dark:text-xp">
              <Flame className="h-4 w-4 text-xp animate-pulse" aria-hidden="true" />
              <span className="text-xs font-black uppercase">Pilar 1: Progression-Based</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-headline md:text-4xl">
              Pecah tumpukan materi jadi <span className="text-primary">langkah kecil terukur</span>
            </h3>
            <p className="text-base sm:text-lg leading-relaxed text-body">
              Belajar CPNS sering bikin kewalahan karena tumpukan materi yang raksasa. Umbuddy memecah semuanya menjadi misi harian taktis. Kamu dipandu step-by-step setiap hari, melacak streak belajar konsisten, dan merasakan kemajuan nyata di setiap sesi latihan kecil.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {['Misi harian', 'Streak harian', 'Kemajuan step-by-step'].map((item) => (
                <div key={item} className="flex items-center gap-2 font-bold text-headline text-sm sm:text-base">
                  <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Card */}
          <div className={`transition-all duration-700 delay-200 ${progressionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <Card padding="lg" className="relative overflow-hidden hover:border-primary/30 hover:shadow-elevated transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-black uppercase text-primary">Mission & Streak</p>
                  <h4 className="font-display text-xl font-black text-headline">Target Taktis Hari Ini</h4>
                </div>
                <div className="streak-badge animate-bounce-subtle">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>7 Hari Beruntun</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-surface border border-border">
                  <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-headline">Selesaikan 10 Soal TIU (Deret Angka)</p>
                    <p className="text-xs text-muted mt-0.5">+100 XP • Berhasil</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-2xl border-2 border-primary/20 bg-primary-light/30 dark:bg-primary/5">
                  <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary text-primary animate-pulse">
                    <span className="w-2.5 h-2.5 bg-primary rounded-full" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-headline">Menangkan 1 Battle Arena Mini CAT</p>
                    <p className="text-xs text-primary font-bold mt-0.5">+150 XP • Sedang Berjalan</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* ── PILAR 2: PvP Battle Realtime (Reusing Battle Showcase) ── */}
        <div ref={battleRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Visual Card (Reversed for alternate rhythm) */}
          <div className={`order-2 lg:order-1 transition-all duration-700 delay-200 ${battleVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <Card padding="lg" className="relative overflow-hidden hover:border-primary/30 hover:shadow-elevated transition-all duration-300">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black uppercase text-primary flex items-center gap-1.5">
                    Arena TWK
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error"></span>
                    </span>
                  </p>
                  <h3 className="font-display text-2xl font-black text-headline">
                    Kamu vs Bima
                  </h3>
                </div>
                <Image src="/mascot/mascot_battle.png" alt="" width={96} height={96} className="h-20 w-20 object-contain animate-float" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-primary bg-primary-light/50 dark:bg-primary/10 p-4 text-primary-dark dark:text-primary animate-pulse-subtle">
                  <p className="text-sm font-black">Kamu</p>
                  <p className="font-display text-4xl font-black">420</p>
                  <p className="text-xs font-bold text-headline">18 jawaban benar</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <p className="text-sm font-black text-muted">Bima</p>
                  <p className="font-display text-4xl font-black text-headline">395</p>
                  <p className="text-xs font-bold text-body">17 jawaban benar</p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-border bg-background p-4">
                <div className="mb-2 flex items-center justify-between text-sm font-black">
                  <span>Progress ronde</span>
                  <span className="text-primary font-display">72%</span>
                </div>
                <div className="progress-bar-track">
                  <div 
                    className="progress-bar-fill transition-all duration-1000 ease-out" 
                    style={{ width: battleVisible ? '72%' : '0%' }} 
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Text */}
          <div className={`order-1 lg:order-2 space-y-6 transition-all duration-700 ${battleVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-xp/30 bg-xp-light px-4 py-2 text-headline dark:text-xp">
              <Swords className="h-4 w-4 text-xp animate-pulse" aria-hidden="true" />
              <span className="text-xs font-black uppercase">Pilar 2: PvP Battle Realtime</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-headline md:text-4xl">
              Duel Mini CAT 1vs1 yang bikin latihan <span className="text-primary">terasa hidup</span>
            </h3>
            <p className="text-base sm:text-lg leading-relaxed text-body">
              Belajar sendirian emang sering bikin jenuh. Makanya, ajak partner belajarmu buat adu taktik di Arena Mini CAT secara realtime! Saling uji pemahaman materi secara seru, hilangkan kejenuhan, jawab cepat sebelum waktu habis, dan dorong satu sama lain sampai lulus ASN bareng-bareng.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {['Invite teman', 'Bahas bersama', 'XP fair-play'].map((item) => (
                <div key={item} className="flex items-center gap-2 font-bold text-headline text-sm sm:text-base">
                  <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PILAR 3: Analytics Adaptif (Reusing Analytics Showcase) ── */}
        <div ref={analyticsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <div className={`space-y-6 transition-all duration-700 ${analyticsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-xp/30 bg-xp-light px-4 py-2 text-headline dark:text-xp">
              <BarChart3 className="h-4 w-4 text-xp animate-pulse" aria-hidden="true" />
              <span className="text-xs font-black uppercase">Pilar 3: Adaptive Analytics</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-headline md:text-4xl">
              Rekomendasi belajar yang <span className="text-primary">jelas</span>, bukan cuma angka skor
            </h3>
            <p className="text-base sm:text-lg leading-relaxed text-body">
              Umbuddy membaca pola jawabanmu secara cerdas dan mendeteksi kelemahanmu secara spesifik di materi TWK, TIU, dan TKP. Kami menerjemahkannya menjadi misi harian baru, prioritas materi, dan prediksi progress nyata. Kamu nggak perlu bingung lagi harus mulai belajar dari mana setiap hari.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-background p-4 text-center shadow-card hover:shadow-elevated hover:border-primary/20 hover:scale-[1.02] transition-all duration-300">
                <p className="font-display text-3xl font-black text-primary">92%</p>
                <p className="text-xs font-bold text-muted mt-1">Akurasi prediksi skor</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4 text-center shadow-card hover:shadow-elevated hover:border-xp/30 hover:scale-[1.02] transition-all duration-300">
                <p className="font-display text-3xl font-black text-xp">30+</p>
                <p className="text-xs font-bold text-muted mt-1">Sub-materi dianalisis</p>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className={`transition-all duration-700 delay-200 ${analyticsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <Card padding="lg" className="hover:border-primary/30 hover:shadow-elevated transition-all duration-300">
              <div className="flex items-center gap-4">
                <Image src="/mascot/mascot_detective.png" alt="" width={110} height={110} className="h-24 w-24 object-contain animate-float" />
                <div>
                  <p className="text-sm font-black uppercase text-primary">Weak Area Analysis</p>
                  <h3 className="font-display text-2xl font-black text-headline">
                    TIU butuh serangan taktis
                  </h3>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { label: 'Deret angka', value: 42, icon: Target },
                  { label: 'Sinonim', value: 68, icon: BarChart3 },
                  { label: 'Nasionalisme', value: 81, icon: Shield },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="rounded-2xl border border-border bg-background p-4 hover:border-primary/20 transition-all duration-200">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-2 font-black text-headline">
                          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                          {item.label}
                        </span>
                        <span className="font-black text-body font-display">{item.value}%</span>
                      </div>
                      <div className="progress-bar-track">
                        <div 
                          className="progress-bar-fill transition-all duration-1000 ease-out" 
                          style={{ width: analyticsVisible ? `${item.value}%` : '0%' }} 
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* ── PILAR 4: Gamification Retention ── */}
        <div ref={gamificationRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Visual Card (Reversed for alternate rhythm) */}
          <div className={`order-2 lg:order-1 transition-all duration-700 delay-200 ${gamificationVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <Card padding="lg" className="relative overflow-hidden hover:border-primary/30 hover:shadow-elevated transition-all duration-300 bg-gradient-to-br from-background to-primary-light/20 dark:to-primary/5">
              <div className="flex items-start gap-4">
                <Image src="/mascot/mascot_success.png" alt="" width={100} height={100} className="h-20 w-20 object-contain animate-float shrink-0" />
                <div className="space-y-3 relative z-10">
                  <div className="p-3 bg-background rounded-2xl border border-border text-xs sm:text-sm font-bold text-headline leading-relaxed shadow-sm relative before:absolute before:-left-3 before:top-6 before:w-0 before:h-0 before:border-y-8 before:border-y-transparent before:border-r-8 before:border-r-background">
                    "Wah, TWK kamu meningkat pesat minggu ini! Kamu selangkah lagi naik pangkat ke <span className="text-primary font-black">Umbies Senior</span>. Yuk selesaikan misi hari ini!"
                  </div>
                  <div className="flex items-center justify-between text-xs font-black text-primary uppercase">
                    <span>Mascot Mentor Feedback</span>
                    <span className="flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5" /> +150 XP</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Text */}
          <div className={`order-1 lg:order-2 space-y-6 transition-all duration-700 ${gamificationVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-xp/30 bg-xp-light px-4 py-2 text-headline dark:text-xp">
              <Sparkles className="h-4 w-4 text-xp animate-pulse" aria-hidden="true" />
              <span className="text-xs font-black uppercase">Pilar 4: Gamified Retention</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-headline md:text-4xl">
              Belajar adiktif dengan <span className="text-primary">sistem reward & maskot</span>
            </h3>
            <p className="text-base sm:text-lg leading-relaxed text-body">
              Belajar sendirian sering bikin patah semangat di tengah jalan. Umbuddy menyuntikkan elemen gamifikasi kelas tinggi: perolehan XP, level up golongan pangkat ASN, dan feedback emosional interaktif dari maskot pendampingmu. Belajar CPNS kini seseru menaikkan level karakter game RPG favoritmu!
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {['XP & Level Up', 'Golongan Pangkat', 'Maskot interaktif'].map((item) => (
                <div key={item} className="flex items-center gap-2 font-bold text-headline text-sm sm:text-base">
                  <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PILAR 5: Community Ranking (Reusing Leaderboard Showcase) ── */}
        <div ref={leaderboardRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <div className={`space-y-6 transition-all duration-700 ${leaderboardVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-xp/30 bg-xp-light px-4 py-2 text-headline dark:text-xp">
              <Trophy className="h-4 w-4 text-xp animate-pulse" aria-hidden="true" />
              <span className="text-xs font-black uppercase">Pilar 5: Community Ranked</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-headline md:text-4xl">
              Pacu ambisi belajarmu di <span className="text-primary">peringkat nasional</span>
            </h3>
            <p className="text-base sm:text-lg leading-relaxed text-body">
              Masuk ke dalam lingkungan pejuang ASN yang kompetitif secara sehat. Papan peringkat nasional dan tryout berkala membuat perkembangan belajarmu terlihat nyata dibanding ribuan peserta lainnya di seluruh Indonesia. Dorong batas kemampuanmu dan duduki posisi puncak klasemen!
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {['Peringkat Nasional', 'Sparring sehat', 'Gelar Golongan'].map((item) => (
                <div key={item} className="flex items-center gap-2 font-bold text-headline text-sm sm:text-base">
                  <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Card */}
          <div className={`transition-all duration-700 delay-200 ${leaderboardVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <Card padding="lg" className="hover:border-primary/20 hover:shadow-elevated transition-all duration-300">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-2xl font-black text-headline">
                  Top Umbies Minggu Ini
                </h3>
                <Medal className="h-8 w-8 text-xp animate-bounce-subtle" aria-hidden="true" />
              </div>
              <div className="space-y-3">
                {leaderboardUsers.map((user, index) => (
                  <div 
                    key={user.rank} 
                    className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 hover:bg-surface-hover hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm transition-all duration-200"
                    style={{
                      transform: leaderboardVisible ? 'translateY(0)' : 'translateY(24px)',
                      opacity: leaderboardVisible ? 1 : 0,
                      transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 150}ms`,
                    }}
                  >
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
        </div>

      </div>
    </section>
  )
}
