'use client'

import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User, UserRole } from '@/types'

const DEV_ROLE_KEY = 'harmonia_dev_role'

interface AuthContextValue {
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
  isHydrated: boolean // true after client-side sessionStorage restore completes
  login: (role?: UserRole) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  setUserOverrides: (overrides: Partial<User>) => void
}

// Mock user matching our mock-data/users.json first entry
const MOCK_USER: User = {
  id: 'user-001',
  email: 'alex.morgan@gmail.com',
  displayName: 'Alex Morgan',
  firstName: 'Alex',
  lastName: 'Morgan',
  age: 26,
  gender: 'female',
  orientation: 'straight',
  location: 'London, UK',
  isLondon: true,
  phoneNumber: '+44 7700 900123',
  photoUrl: null,
  onboardingStep: 7, // fully onboarded for dev
  calibrationComplete: true,
  questionnaireComplete: true,
  currentPhase: 'phase2',
  role: 'user',
  createdAt: '2026-03-01T10:00:00Z',
}

const MOCK_ADMIN: User = {
  ...MOCK_USER,
  id: 'admin-001',
  email: 'avery@harmoniaengine.com',
  displayName: 'Avery Edwards',
  firstName: 'Avery',
  lastName: 'Edwards',
  role: 'admin',
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoggedIn: false,
  isAdmin: false,
  isHydrated: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  setUserOverrides: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always start with MOCK_USER to match server HTML, then apply persisted role
  const [user, setUser] = useState<User | null>(MOCK_USER)
  const [isHydrated, setIsHydrated] = useState(false)

  // Restore dev role from sessionStorage after hydration (client-only)
  useEffect(() => {
    const saved = sessionStorage.getItem(DEV_ROLE_KEY)
    if (saved === 'admin') setUser(MOCK_ADMIN)
    setIsHydrated(true)
  }, [])

  const login = useCallback((role: UserRole = 'user') => {
    const next = role === 'admin' ? MOCK_ADMIN : MOCK_USER
    sessionStorage.setItem(DEV_ROLE_KEY, role)
    setUser(next)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(DEV_ROLE_KEY)
    setUser(null)
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }, [])

  const setUserOverrides = useCallback((overrides: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...overrides } : null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        isAdmin: user?.role === 'admin',
        isHydrated,
        login,
        logout,
        updateUser,
        setUserOverrides,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
