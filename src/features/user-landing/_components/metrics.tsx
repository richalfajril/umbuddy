'use client'

import { useEffect, useState, useRef } from 'react'
import { Users, CheckCircle2, TrendingUp, Swords } from 'lucide-react'

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const elementRef = useRef<HTMLSpanElement>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const duration = 1500 // Animation duration in ms

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const currentCount = Math.floor(progress * value)
      setCount(currentCount)
      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        setCount(value)
      }
    }
    window.requestAnimationFrame(step)
  }, [hasStarted, value])

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  return (
    <span ref={elementRef} className="tabular-nums">
      {formatNumber(count)}{suffix}
    </span>
  )
}

const metricsData = [
  {
    value: 1200,
    suffix: '+',
    label: 'Cambies Aktif Berjuang',
    description: 'Calon Umbies yang aktif berlatih setiap hari.',
    icon: <Users className="w-6 h-6 text-primary" />,
  },
  {
    value: 18000,
    suffix: '+',
    label: 'Soal Latihan Terjawab',
    description: 'Akurasi pembahasan teruji untuk TWK, TIU, & TKP.',
    icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
  },
  {
    value: 80,
    suffix: '%',
    label: 'Lebih Konsisten Belajar',
    description: 'Terbukti meningkatkan ritme belajar harian.',
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
  },
  {
    value: 2400,
    suffix: '+',
    label: 'Duel Arena Diselesaikan',
    description: 'Pertarungan mini CAT 1vs1 secara realtime.',
    icon: <Swords className="w-6 h-6 text-primary" />,
  },
]

export function LandingMetrics() {
  return (
    <section className="relative z-30 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/40">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {metricsData.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-4 transition-colors transition-transform transition-shadow duration-200 group"
          >
            {/* Round Icon themed in green without card wrapper */}
            <div className="flex-shrink-0 p-3 rounded-2xl border border-primary/20 bg-primary-light/40 dark:bg-primary/5 transition-transform group-hover:scale-105 duration-200">
              {item.icon}
            </div>

            {/* Content highlighted in green */}
            <div className="space-y-1">
              <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-primary leading-none">
                <AnimatedCounter value={item.value} suffix={item.suffix} />
              </p>
              <p className="font-bold text-sm text-headline leading-tight">
                {item.label}
              </p>
              <p className="text-xs text-body leading-normal">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
