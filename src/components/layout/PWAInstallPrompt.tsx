'use client'

import React, { useEffect, useState } from 'react'
import { X, Share, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type Platform = 'ios' | 'android' | null

function detectPlatform(): Platform {
  if (typeof window === 'undefined') return null
  const ua = navigator.userAgent
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  if (/android/i.test(ua)) return 'android'
  return null
}

function isInStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
  )
}

export function PWAInstallPrompt() {
  const [show, setShow] = useState(false)
  const [platform, setPlatform] = useState<Platform>(null)

  useEffect(() => {
    // Don't show if already installed
    if (isInStandaloneMode()) return
    // Don't show if dismissed in this session
    if (sessionStorage.getItem('pwa-dismissed')) return

    const p = detectPlatform()
    if (p) {
      setPlatform(p)
      // Show after a brief delay
      const timer = setTimeout(() => setShow(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  function dismiss() {
    setShow(false)
    sessionStorage.setItem('pwa-dismissed', '1')
  }

  if (!show) return null

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 p-4 safe-bottom animate-slide-up',
      )}
      role="banner"
      aria-label="Install app"
    >
      <div className="harmonia-container">
        <div className="harmonia-card gold-accent-top flex items-start gap-4">
          <div className="flex-1">
            <p className="font-semibold text-[var(--navy)] text-body-sm mb-1">
              Add Harmonia to your home screen
            </p>
            {platform === 'ios' && (
              <p className="text-caption text-[var(--slate)]">
                Tap <Share size={12} className="inline mx-0.5" /> then &ldquo;Add to Home Screen&rdquo;
              </p>
            )}
            {platform === 'android' && (
              <p className="text-caption text-[var(--slate)]">
                Tap <Plus size={12} className="inline mx-0.5" /> &ldquo;Add to Home Screen&rdquo; in your browser menu
              </p>
            )}
          </div>
          <button
            onClick={dismiss}
            className="text-[var(--slate)] hover:text-[var(--navy)] touch-target flex items-center justify-center shrink-0"
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
