'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface HeartDisplayProps {
  count: number // 0-3
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
  className?: string
}

const sizeMap = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
}

export function HeartDisplay({ count, size = 'md', animate = false, className }: HeartDisplayProps) {
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (animate && count > 0) {
      setAnimating(true)
      const t = setTimeout(() => setAnimating(false), 600)
      return () => clearTimeout(t)
    }
  }, [count, animate])

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[1, 2, 3].map(i => {
        const filled = i <= count
        return (
          <span
            key={i}
            className={cn(
              sizeMap[size],
              'transition-all duration-300',
              filled
                ? cn('text-gold', animating && i === count && 'animate-heart-fill')
                : 'text-gold/30',
            )}
            aria-label={filled ? 'filled heart' : 'empty heart'}
          >
            ♥
          </span>
        )
      })}
    </div>
  )
}

// ---- standalone fill animation ----

interface HeartFillAnimationProps {
  onComplete?: () => void
}

export function HeartFillAnimation({ onComplete }: HeartFillAnimationProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const steps = [1, 2, 3]
    let i = 0
    const interval = setInterval(() => {
      i++
      setCount(steps[i - 1] ?? 3)
      if (i >= steps.length) {
        clearInterval(interval)
        setTimeout(() => onComplete?.(), 400)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3].map(i => (
        <span
          key={i}
          className={cn(
            'text-4xl transition-all duration-300',
            i <= count
              ? 'text-gold animate-heart-fill scale-110'
              : 'text-gold/30',
          )}
        >
          ♥
        </span>
      ))}
    </div>
  )
}
