import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { wordCount } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  showWordCount?: boolean
  minWords?: number
  maxWords?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, showWordCount, minWords = 0, maxWords = Infinity, value, id, ...props }, ref) => {
    const currentWords = typeof value === 'string' ? wordCount(value) : 0
    const tooShort = minWords > 0 && currentWords < minWords && currentWords > 0
    const tooLong = maxWords < Infinity && currentWords > maxWords

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-body-sm font-medium text-navy dark:text-slate mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          value={value}
          className={cn(
            'harmonia-input min-h-[120px] resize-y',
            error && 'border-red-500 focus:ring-red-200',
            tooLong && 'border-red-500',
            className
          )}
          {...props}
        />
        <div className="flex justify-between mt-1">
          {error && (
            <p className="text-caption text-red-600 dark:text-red-400">{error}</p>
          )}
          {showWordCount && (
            <p
              className={cn(
                'text-caption ml-auto',
                tooShort && 'text-amber-600 dark:text-amber-400',
                tooLong && 'text-red-600 dark:text-red-400',
                !tooShort && !tooLong && 'text-slate'
              )}
            >
              {currentWords}{maxWords < Infinity ? `/${maxWords}` : ''} words
              {tooShort && ` (min ${minWords})`}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
