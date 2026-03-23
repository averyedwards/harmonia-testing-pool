'use client'

import { createContext, useState, useCallback, type ReactNode } from 'react'
import type { User, UserRole } from '@/types'

interface AuthContextValue {
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
  login: (role?: UserRole) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
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
  login: () => {},
  logout: () => {},
  updateUser: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USER) // logged in by default for dev

  const login = useCallback((role: UserRole = 'user') => {
    setUser(role === 'admin' ? MOCK_ADMIN : MOCK_USER)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
