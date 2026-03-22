'use client'

import React from 'react'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { PWAInstallPrompt } from './PWAInstallPrompt'

interface AppShellProps {
  children: React.ReactNode
  hideFooter?: boolean
  hideNav?: boolean
}

export function AppShell({ children, hideFooter, hideNav }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--cream)] text-[var(--navy)]">
      {!hideNav && <Nav />}
      <main className={`flex-1 w-full ${!hideNav ? 'pt-16' : ''}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
      <PWAInstallPrompt />
    </div>
  )
}
