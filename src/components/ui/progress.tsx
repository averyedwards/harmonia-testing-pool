import { cn } from '@/lib/utils'

interface LinearProgressProps {
  value: number // 0-100
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md'
}

export function LinearProgress({ value, className, showLabel, size = 'md' }: LinearProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-caption text-slate">{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-gray-light dark:bg-dark-border rounded-full overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        )}
      >
        <div
          className="h-full bg-gradient-to-r from-gold to-gold-champagne rounded-full transition-all duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}

interface CircularProgressProps {
  value: number // 0-100
  size?: number // px
  strokeWidth?: number
  className?: string
  children?: React.ReactNode // content inside the ring
}

export function CircularProgress({
  value,
  size = 80,
  strokeWidth = 6,
  className,
  children,
}: CircularProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-light dark:text-dark-border"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor="var(--gold-champagne)" />
          </linearGradient>
        </defs>
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

interface StepProgressProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
  className?: string
}

export function StepProgress({ currentStep, totalSteps, labels, className }: StepProgressProps) {
  return (
    <div className={cn('flex items-center w-full', className)}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1
        const isComplete = stepNum < currentStep
        const isCurrent = stepNum === currentStep
        const isFuture = stepNum > currentStep

        return (
          <div key={stepNum} className="flex items-center flex-1 last:flex-none">
            {/* Step circle */}
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-caption font-semibold transition-all duration-300',
                isComplete && 'bg-gold text-wine-black',
                isCurrent && 'bg-gold text-wine-black ring-4 ring-gold-light',
                isFuture && 'bg-gray-light dark:bg-dark-border text-slate'
              )}
            >
              {isComplete ? '✓' : stepNum}
            </div>
            {/* Connector line */}
            {stepNum < totalSteps && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 transition-colors duration-300',
                  isComplete ? 'bg-gold' : 'bg-gray-light dark:bg-dark-border'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
