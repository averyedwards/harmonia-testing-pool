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
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login')
    }
  }, [isLoggedIn, router])

  // Render nothing while redirect is in flight (avoids auth flash)
  if (!isLoggedIn) return null

  return <AppShell>{children}</AppShell>
}
