'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { usePhase } from '@/hooks/usePhase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'
import { PHASE_LABELS } from '@/lib/constants'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-caption text-gold uppercase tracking-wide mb-3">{title}</h2>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const { phase, setPhase, devMode, toggleDevMode } = usePhase()
  const { showToast } = useToast()
  const router = useRouter()

  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [location, setLocation] = useState(user?.location ?? '')
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [saving, setSaving] = useState(false)

  const handleSaveProfile = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    updateUser({ displayName, location })
    setSaving(false)
    showToast('Profile updated', 'success')
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-md mx-auto">
        <h1 className="font-heading text-h1 text-navy dark:text-cream mb-8">Settings</h1>

        {/* Profile */}
        <Section title="Profile">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-light dark:border-dark-border">
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-2xl">
                {user?.firstName?.[0] ?? '?'}
              </div>
              <div>
                <p className="font-heading text-h4 text-navy dark:text-cream">{user?.displayName}</p>
                <p className="text-caption text-slate">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-3">
              <Input
                label="Display name"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
              />
              <Input
                label="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="City, Country"
              />
              <Button
                onClick={handleSaveProfile}
                className="w-full"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </Card>
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-navy dark:text-cream">Dark mode</p>
                <p className="text-caption text-slate">Currently: {theme}</p>
              </div>
              <Toggle
                enabled={theme === 'dark'}
                onChange={enabled => setTheme(enabled ? 'dark' : 'light')}
              />
            </div>
          </Card>
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-navy dark:text-cream">Email notifications</p>
                <p className="text-caption text-slate">Phase updates, match confirmations</p>
              </div>
              <Toggle enabled={emailNotifs} onChange={setEmailNotifs} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-navy dark:text-cream">Push notifications</p>
                <p className="text-caption text-slate">In-app alerts</p>
              </div>
              <Toggle enabled={pushNotifs} onChange={setPushNotifs} />
            </div>
          </Card>
        </Section>

        {/* Your data */}
        <Section title="Your data">
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-body-sm text-slate">Current phase</p>
              <Badge variant="phase">{PHASE_LABELS[phase]}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-body-sm text-slate">User ID</p>
              <p className="text-caption text-slate font-mono">{user?.id}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-body-sm text-slate">Member since</p>
              <p className="text-caption text-slate">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '—'}
              </p>
            </div>
          </Card>
        </Section>

        {/* Dev mode (admin/development) */}
        <Section title="Developer">
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm font-medium text-navy dark:text-cream">Dev mode</p>
                <p className="text-caption text-slate">Phase switcher & debug overlays</p>
              </div>
              <Toggle enabled={devMode.enabled} onChange={toggleDevMode} />
            </div>
            {devMode.enabled && (
              <div className="pt-3 border-t border-gray-light dark:border-dark-border space-y-2">
                <p className="text-caption text-gold uppercase tracking-wide">Simulate phase</p>
                {(['phase1', 'between_1_2', 'phase2', 'between_2_3', 'phase3', 'complete'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPhase(p)}
                    className={`w-full text-left px-3 py-1.5 rounded-input text-caption transition-all ${
                      phase === p
                        ? 'bg-gold/20 text-gold font-semibold'
                        : 'text-slate hover:bg-gold/10'
                    }`}
                  >
                    {PHASE_LABELS[p]}
                  </button>
                ))}
              </div>
            )}
          </Card>
        </Section>

        {/* Account */}
        <Section title="Account">
          <Card className="p-5">
            <Button
              variant="danger"
              onClick={handleLogout}
              className="w-full"
            >
              Sign out
            </Button>
          </Card>
        </Section>
      </div>
    </div>
  )
}
