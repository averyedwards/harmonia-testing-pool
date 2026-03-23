'use client'

import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

interface Step1Props {
  onNext: () => void
}

export function Step1EmailVerified({ onNext }: Step1Props) {
  useEffect(() => {
    const timer = setTimeout(onNext, 1500)
    return () => clearTimeout(timer)
  }, [onNext])

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
        <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
      </div>
      <h2 className="font-heading text-h2 text-navy dark:text-cream mb-2 text-center">
        Email verified
      </h2>
      <p className="text-body text-slate text-center">
        Setting up your profile...
      </p>
    </div>
  )
}
