import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-button font-body font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--gold)] text-[var(--dark-bg)] hover:bg-[var(--gold-champagne)] hover:-translate-y-px active:scale-95',
        secondary:
          'bg-transparent text-[var(--maroon)] border-[1.5px] border-[var(--maroon)] hover:bg-[var(--maroon-light)] dark:text-[var(--gold)] dark:border-[var(--gold)] dark:hover:bg-[var(--gold-light)]',
        ghost:
          'bg-transparent text-[var(--navy)] hover:bg-[var(--blush)] dark:hover:bg-[var(--dark-surface)]',
        danger:
          'bg-transparent text-red-600 border-[1.5px] border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20',
        link: 'text-[var(--gold)] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-9 px-3 text-body-sm',
        md: 'h-11 px-6 text-body',
        lg: 'h-13 px-8 text-body-lg',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
