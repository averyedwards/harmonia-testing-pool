import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-badge font-semibold text-caption uppercase tracking-wider',
  {
    variants: {
      variant: {
        gold: 'bg-[var(--gold-light)] text-[var(--gold)] px-3 py-1',
        maroon: 'bg-[var(--maroon-light)] text-[var(--maroon)] px-3 py-1',
        slate: 'bg-[var(--blush)] text-[var(--slate)] px-3 py-1',
        success: 'bg-green-100 text-green-700 px-3 py-1 dark:bg-green-900/30 dark:text-green-400',
        warning: 'bg-orange-100 text-orange-700 px-3 py-1 dark:bg-orange-900/30 dark:text-orange-400',
        error: 'bg-red-100 text-red-700 px-3 py-1 dark:bg-red-900/30 dark:text-red-400',
      },
    },
    defaultVariants: {
      variant: 'gold',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
