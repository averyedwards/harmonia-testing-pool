'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // In production: log to error tracking (e.g. Sentry)
    console.error('[Harmonia] Unhandled error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream dark:bg-wine-black px-4">
      <div className="text-center max-w-sm animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-maroon/10 border border-maroon/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠</span>
        </div>

        <h1 className="font-heading text-h2 text-navy dark:text-cream mb-2">
          Something went wrong
        </h1>
        <p className="text-body text-slate mb-2">
          An unexpected error occurred. Your data is safe.
        </p>
        {error.digest && (
          <p className="text-caption text-slate/50 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <Button onClick={reset}>
            Try again
          </Button>
          <Button variant="ghost" onClick={() => window.location.href = '/dashboard'} className="text-slate">
            Return to dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
