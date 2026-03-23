'use client'

import { type ReactNode } from 'react'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { PWAInstallPrompt } from './PWAInstallPrompt'

interface AppShellProps {
  children: ReactNode
  hideNav?: boolean // for auth pages (login, register)
  hideFooter?: boolean // for immersive pages (tournament)
}

export function AppShell({ children, hideNav, hideFooter }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-wine-black transition-colors duration-400">
      {!hideNav && <Nav />}
      <main className="flex-1 harmonia-container py-6">
        {children}
      </main>
      {!hideFooter && <Footer />}
      <PWAInstallPrompt />
    </div>
  )
}
