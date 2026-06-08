'use client'

import * as React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from 'next-themes'

interface TrendData {
  name: string
  users: number
  fullDate: string
}

interface AdminTrendChartProps {
  data: TrendData[]
}

// Client Component untuk merender chart karena Recharts bergantung pada ResizeObserver browser
export function AdminTrendChart({ data }: AdminTrendChartProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[300px] w-full animate-pulse rounded-xl bg-muted/20" />
  }

  // Tentukan warna berdasarkan tema aktif agar harmonis
  const strokeColor = resolvedTheme === 'dark' ? '#74C332' : '#579A22'
  const gridColor = resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'
  const textColor = resolvedTheme === 'dark' ? '#94a3b8' : '#64748b'

  return (
    <div className="rounded-3xl border border-border bg-background p-6 shadow-sm dark:bg-surface">
      <div className="mb-6">
        <h3 className="font-display text-xl font-black text-headline">Tren Registrasi Mingguan</h3>
        <p className="text-sm font-semibold text-muted">Jumlah pendaftar baru 7 hari terakhir.</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke={textColor} 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10} 
            />
            <YAxis 
              stroke={textColor} 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}`} 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
                borderColor: resolvedTheme === 'dark' ? '#334155' : '#e2e8f0',
                borderRadius: '12px',
                color: resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a',
                fontWeight: 'bold',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
              }}
              labelStyle={{ color: textColor, marginBottom: '4px', fontWeight: 'normal', fontSize: '12px' }}
            />
            <Line
              type="monotone"
              dataKey="users"
              name="Pengguna Baru"
              stroke={strokeColor}
              strokeWidth={4}
              dot={{ r: 4, strokeWidth: 2, fill: resolvedTheme === 'dark' ? '#1e293b' : '#ffffff' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: strokeColor }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
