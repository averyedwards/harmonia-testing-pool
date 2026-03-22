import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-body-sm font-semibold text-[var(--navy)]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            'harmonia-input',
            error && 'border-red-500 focus:border-red-500 focus:shadow-none',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-caption text-red-600" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-caption text-[var(--slate)]">{hint}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
