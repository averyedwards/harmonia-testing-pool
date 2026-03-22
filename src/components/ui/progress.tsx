import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number // 0-100
  className?: string
  label?: string
  showValue?: boolean
}

export function Progress({ value, className, label, showValue }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-caption text-[var(--slate)]">{label}</span>}
          {showValue && <span className="text-caption font-semibold text-[var(--gold)]">{clamped}%</span>}
        </div>
      )}
      <div
        className="w-full h-2 bg-[var(--blush)] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-[var(--gold)] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
