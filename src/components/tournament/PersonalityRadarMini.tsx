'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'
import { SIN_METADATA } from '@/types'
import type { SinScore } from '@/types'
import { cn } from '@/lib/utils'

interface PersonalityRadarMiniProps {
  userSins: SinScore[]       // current user
  candidateSins: SinScore[]  // candidate
  size?: number
  className?: string
}

function buildChartData(userSins: SinScore[], candidateSins: SinScore[]) {
  return SIN_METADATA.map(meta => {
    const u = userSins.find(s => s.sin === meta.name)
    const c = candidateSins.find(s => s.sin === meta.name)
    // Convert -5..+5 to 0..10 for radar (positive-only axis)
    const toChart = (v?: number) => v !== undefined ? v + 5 : 5
    return {
      sin: meta.label,
      you: toChart(u?.score),
      them: toChart(c?.score),
    }
  })
}

export function PersonalityRadarMini({
  userSins,
  candidateSins,
  size = 200,
  className,
}: PersonalityRadarMiniProps) {
  const data = buildChartData(userSins, candidateSins)

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius={size / 2 - 24}>
          <PolarGrid stroke="rgba(212,168,83,0.2)" />
          <PolarAngleAxis
            dataKey="sin"
            tick={{ fill: '#475569', fontSize: 9, fontFamily: 'DM Sans, sans-serif' }}
          />
          <Radar
            name="You"
            dataKey="you"
            stroke="rgba(212,168,83,0.8)"
            fill="rgba(212,168,83,0.15)"
            strokeWidth={1.5}
          />
          <Radar
            name="Them"
            dataKey="them"
            stroke="rgba(232,74,138,0.8)"
            fill="rgba(232,74,138,0.1)"
            strokeWidth={1.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ---- Legend ----

export function RadarLegend({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <span className="flex items-center gap-1.5 text-caption text-slate">
        <span className="w-3 h-0.5 bg-gold inline-block rounded" />
        You
      </span>
      <span className="flex items-center gap-1.5 text-caption text-slate">
        <span className="w-3 h-0.5 bg-[#E84A8A] inline-block rounded" />
        Them
      </span>
    </div>
  )
}
