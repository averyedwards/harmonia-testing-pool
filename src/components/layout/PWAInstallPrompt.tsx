'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'

/**
 * PWA Install Prompt
 *
 * From email doc v1.7 Section 2.4.2:
 * - Chromium (Chrome, Edge, Samsung Internet): use beforeinstallprompt event
 * - iOS Safari: manual instruction overlay
 * - iOS 26 Compact mode: "Tap ... → Share → Add to Home Screen"
 * - iOS 25 and earlier: "Tap Share button → Add to Home Screen"
 * - Dismissable. Reappears next session. Never a hard gate.
 * - Shown on first login from mobile browser
 */
export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [promptType, setPromptType] = useState<'chromium' | 'ios' | null>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Don't show if already installed or dismissed this session
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (sessionStorage.getItem('harmonia-pwa-dismissed')) return

    // Check if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) return

    // Chromium browsers: beforeinstallprompt fires
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setPromptType('chromium')
      setShowPrompt(true)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // iOS Safari: no beforeinstallprompt, show manual instructions
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)
    const isStandalone = (window.navigator as any).standalone === true
    if (isIOS && !isStandalone) {
      // Delay to avoid showing immediately on page load
      const timer = setTimeout(() => {
        setPromptType('ios')
        setShowPrompt(true)
      }, 3000)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      await deferredPrompt.userChoice
      setDeferredPrompt(null)
    }
    dismiss()
  }

  const dismiss = () => {
    setShowPrompt(false)
    sessionStorage.setItem('harmonia-pwa-dismissed', 'true')
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 safe-bottom animate-slide-up">
      <div className="max-w-md mx-auto bg-cream dark:bg-dark-surface border border-gray-light dark:border-dark-border rounded-card shadow-xl p-4">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-slate hover:text-navy touch-target"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-3">
          <img
            src="/icons/icon-192.png"
            alt="Harmonia"
            className="w-12 h-12 rounded-xl"
          />
          <div className="flex-1">
            <p className="text-body font-semibold text-navy dark:text-cream mb-1">
              Add Harmonia to your home screen
            </p>
            <p className="text-body-sm text-slate mb-3">
              Get the best experience with quick access and notifications.
            </p>

            {promptType === 'chromium' && (
              <Button size="sm" onClick={handleInstall}>
                Add to Home Screen
              </Button>
            )}

            {promptType === 'ios' && (
              <p className="text-body-sm text-slate">
                Tap the <strong>Share button</strong> (or tap <strong>...</strong> first if you
                don't see it), then select <strong>Add to Home Screen</strong>.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
