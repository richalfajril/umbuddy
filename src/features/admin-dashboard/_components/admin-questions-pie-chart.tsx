'use client'

import * as React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useTheme } from 'next-themes'

interface AdminQuestionsPieChartProps {
  published: number
  draft: number
}

export function AdminQuestionsPieChart({ published, draft }: AdminQuestionsPieChartProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[300px] w-full animate-pulse rounded-xl bg-muted/20" />
  }

  const data = [
    { name: 'Rilis (Published)', value: published },
    { name: 'Draf (Draft)', value: draft },
  ]

  // Warna cerah untuk light mode, sedikit redup/neon untuk dark mode
  const COLORS = resolvedTheme === 'dark' ? ['#74C332', '#334155'] : ['#579A22', '#cbd5e1']
  const textColor = resolvedTheme === 'dark' ? '#94a3b8' : '#64748b'

  return (
    <div className="rounded-3xl border border-border bg-background p-6 shadow-sm dark:bg-surface h-full flex flex-col">
      <div className="mb-2">
        <h3 className="font-display text-xl font-black text-headline">Distribusi Soal</h3>
        <p className="text-sm font-semibold text-muted">Status kesiapan bank soal.</p>
      </div>

      <div className="flex-1 min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
                borderColor: resolvedTheme === 'dark' ? '#334155' : '#e2e8f0',
                borderRadius: '12px',
                color: resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a',
                fontWeight: 'bold',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: textColor }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
