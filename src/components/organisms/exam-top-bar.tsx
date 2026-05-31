import * as React from 'react'

interface ExamTopBarProps {
  title: string
  subtitle: string
  badge: React.ReactNode
  actionButton: React.ReactNode
  progressPercent: number
  progressLabel: string
}

export function ExamTopBar({
  title,
  subtitle,
  badge,
  actionButton,
  progressPercent,
  progressLabel,
}: ExamTopBarProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl font-black leading-tight">{title}</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 font-display text-sm font-black shadow-inner">
              {badge}
            </div>
            <p className="truncate text-[11px] font-bold text-white/85">{subtitle}</p>
          </div>
        </div>
        {actionButton}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-white/35">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-black">
          {progressLabel}
        </span>
      </div>
    </div>
  )
}

interface ExamDesktopTopBarProps {
  title: string
  subtitle: string
  badge: React.ReactNode
  actionButton: React.ReactNode
  progressPercent: number
  progressLabel: string
  progressTitle?: string
}

export function ExamDesktopTopBar({
  title,
  subtitle,
  badge,
  actionButton,
  progressPercent,
  progressLabel,
  progressTitle = "Progress Ujian",
}: ExamDesktopTopBarProps) {
  return (
    <div className="mx-auto grid max-w-[1680px] grid-cols-[280px_minmax(0,1fr)_auto] items-center gap-6 px-6 py-4">
      <div>
        <p className="font-display text-2xl font-black leading-tight">{title}</p>
        <p className="mt-1 text-sm font-bold text-white/85">{subtitle}</p>
      </div>
      <div className="rounded-2xl bg-white/20 px-5 py-3 shadow-inner">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm font-black">
          <span className="text-white/80">{progressTitle}</span>
          <span>{progressLabel}</span>
        </div>
        <div className="h-3 rounded-full bg-white/35">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-[auto_auto] items-center gap-3">
        <div className="flex min-h-[56px] items-center justify-center gap-2.5 rounded-full bg-white/20 px-5 font-display text-xl font-black shadow-inner">
          {badge}
        </div>
        {actionButton}
      </div>
    </div>
  )
}
