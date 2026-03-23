'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { AppShell } from '@/components/layout/AppShell'

/**
 * Admin route group layout.
 *
 * - Wraps all admin pages in AppShell (Nav + Footer + DevToolbar)
 * - Double guard: unauthenticated → /login, non-admin → /dashboard
 * - Individual admin pages also perform their own isAdmin check as defence-in-depth
 */
export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isAdmin, isHydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isHydrated) return
    if (!isLoggedIn) {
      router.replace('/login')
    } else if (!isAdmin) {
      router.replace('/dashboard')
    }
  }, [isLoggedIn, isAdmin, isHydrated, router])

  // Wait for hydration so sessionStorage-restored role is applied before gating
  if (!isHydrated || !isLoggedIn || !isAdmin) return null

  return <AppShell>{children}</AppShell>
}
