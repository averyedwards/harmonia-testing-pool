'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { AppShell } from '@/components/layout/AppShell'

/**
 * App route group layout.
 *
 * - Wraps all app pages in AppShell (Nav + Footer + DevToolbar)
 * - Guards all app routes: unauthenticated users are redirected to /login
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isHydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.replace('/login')
    }
  }, [isLoggedIn, isHydrated, router])

  // Always render — SSR needs valid HTML to stream.
  // Auth redirect fires via useEffect after hydration.
  return <AppShell>{children}</AppShell>
}
