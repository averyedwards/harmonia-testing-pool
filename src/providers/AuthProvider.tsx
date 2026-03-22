'use client'

import React, { createContext, useContext, useState } from 'react'
import type { User, Phase } from '@/types'

// Mock current user for prototype
const MOCK_USER: User = {
  id: 'user-001',
  email: 'alex.morgan@example.com',
  displayName: 'Alex Morgan',
  firstName: 'Alex',
  lastName: 'Morgan',
  age: 27,
  gender: 'female',
  orientation: 'straight',
  location: 'London, UK',
  isLondon: true,
  phoneNumber: '+44 7700 900123',
  photoUrl: null,
  onboardingStep: 7,
  calibrationComplete: true,
  questionnaireComplete: true,
  currentPhase: 'phase2',
  role: 'user',
  createdAt: '2025-11-01T09:00:00Z',
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start logged out so the landing page is visible; swap to MOCK_USER to test authenticated views
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = user !== null
  const isAdmin = user?.role === 'admin'

  function login(email: string) {
    // Mock login: just restore the mock user
    setUser({ ...MOCK_USER, email })
  }

  function logout() {
    setUser(null)
  }

  function updateUser(updates: Partial<User>) {
    setUser((prev) => (prev ? { ...prev, ...updates } : null))
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
