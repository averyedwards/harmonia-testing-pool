import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles shared by all variants
  'inline-flex items-center justify-center font-body font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:opacity-50 disabled:pointer-events-none touch-target',
  {
    variants: {
      variant: {
        primary:
          'bg-gold text-wine-black hover:bg-gold-champagne hover:-translate-y-[1px] active:translate-y-0 dark:bg-gold-dark dark:text-wine-black',
        secondary:
          'bg-transparent text-maroon border-[1.5px] border-maroon hover:bg-maroon-light dark:text-gold-dark dark:border-gold-dark dark:hover:bg-gold-light',
        ghost:
          'bg-transparent text-slate hover:bg-blush dark:hover:bg-dark-surface',
        danger:
          'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-9 px-3 text-body-sm rounded-button',
        md: 'h-11 px-6 text-body rounded-button',
        lg: 'h-13 px-8 text-body-lg rounded-button',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
