import * as React from 'react'
import { cn } from '@/lib/utils'
import { wordCount } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  showWordCount?: boolean
  minWords?: number
  maxWords?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, showWordCount, minWords, maxWords, id, value, onChange, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const currentWords = typeof value === 'string' ? wordCount(value) : 0
    const isUnderMin = minWords !== undefined && currentWords < minWords
    const isOverMax = maxWords !== undefined && currentWords > maxWords

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-body-sm font-semibold text-[var(--navy)]">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'harmonia-input resize-none min-h-[120px]',
            (error || isOverMax) && 'border-red-500 focus:border-red-500',
            className
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        />
        <div className="flex justify-between items-center">
          <div>
            {error && (
              <p className="text-caption text-red-600" role="alert">{error}</p>
            )}
            {hint && !error && (
              <p className="text-caption text-[var(--slate)]">{hint}</p>
            )}
          </div>
          {showWordCount && (
            <p className={cn(
              'text-caption ml-auto',
              isOverMax ? 'text-red-600' :
              isUnderMin ? 'text-[var(--slate)]' :
              'text-[var(--gold)]'
            )}>
              {currentWords}{maxWords ? `/${maxWords}` : ''} words
              {minWords && currentWords < minWords && ` (min ${minWords})`}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
