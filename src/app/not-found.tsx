'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream dark:bg-wine-black px-4">
      <div className="text-center max-w-sm animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
          <span className="font-heading text-h1 text-gold">?</span>
        </div>

        <h1 className="font-heading text-h2 text-navy dark:text-cream mb-2">
          Page not found
        </h1>
        <p className="text-body text-slate mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col gap-3">
          <Button onClick={() => router.push('/dashboard')}>
            Go to dashboard
          </Button>
          <Button variant="ghost" onClick={() => router.back()} className="text-slate">
            ← Go back
          </Button>
        </div>
      </div>
    </div>
  )
}
