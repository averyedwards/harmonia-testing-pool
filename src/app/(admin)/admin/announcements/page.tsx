'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import adminStats from '@/mock-data/admin-stats.json'

const AUDIENCE_OPTIONS = [
  { value: 'all', label: 'All users' },
  { value: 'london', label: 'London only' },
  { value: 'phase2', label: 'Phase 2 users' },
  { value: 'phase3', label: 'Phase 3 users' },
]

function audienceCount(audience: string): number {
  if (audience === 'all') return adminStats.totalUsers
  if (audience === 'london') return adminStats.londonUsers
  if (audience === 'phase2') return adminStats.usersByPhase.phase2 || 0
  if (audience === 'phase3') return adminStats.usersByPhase.phase3 || 0
  return 0
}

export default function AdminAnnouncementsPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()

  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [buttonUrl, setButtonUrl] = useState('')
  const [audience, setAudience] = useState('all')
  const [showPreview, setShowPreview] = useState(false)
  const [sending, setSending] = useState(false)

  if (!isAdmin) return null

  const count = audienceCount(audience)
  const canSend = subject.trim() !== '' && body.trim() !== '' && !sending

  async function handleSend() {
    setSending(true)
    await new Promise(r => setTimeout(r, 1000))
    showToast(`Announcement sent to ${count} users.`, 'success')
    setSending(false)
    setSubject('')
    setBody('')
    setButtonText('')
    setButtonUrl('')
    setAudience('all')
    setShowPreview(false)
  }

  return (
    <div className="harmonia-container py-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-1 text-caption text-slate hover:text-gold mb-6 transition-colors"
        >
          ← Admin dashboard
        </button>

        <div className="mb-8">
          <p className="text-caption text-gold uppercase tracking-wide mb-1">Admin Panel</p>
          <h1 className="font-heading text-h1 text-navy dark:text-cream">Announcements</h1>
        </div>

        {/* Form card */}
        <Card className="p-5 mb-3 space-y-4">
          <Input
            id="subject"
            label="Subject"
            placeholder="Community update: Phase 2 launching next week"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />

          <Textarea
            id="body"
            label="Message"
            placeholder="Write your announcement here..."
            className="min-h-[120px]"
            value={body}
            onChange={e => setBody(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              id="buttonText"
              label="Button text (optional)"
              placeholder="Learn more"
              value={buttonText}
              onChange={e => setButtonText(e.target.value)}
            />
            <Input
              id="buttonUrl"
              label="Button URL (optional)"
              placeholder="https://..."
              value={buttonUrl}
              onChange={e => setButtonUrl(e.target.value)}
            />
          </div>

          <div>
            <Select
              id="audience"
              label="Audience"
              options={AUDIENCE_OPTIONS}
              value={audience}
              onChange={e => setAudience(e.target.value)}
            />
            <p className="text-caption text-slate mt-2">
              This will send to <strong className="text-navy dark:text-cream">{count}</strong> users via email and in-app notification.
            </p>
          </div>
        </Card>

        {/* Preview toggle */}
        <button
          onClick={() => setShowPreview(p => !p)}
          className="text-caption text-gold hover:text-gold/70 transition-colors mb-3"
        >
          {showPreview ? 'Hide preview' : 'Show preview'}
        </button>

        {/* Preview card */}
        {showPreview && (
          <Card goldAccent className="p-5 mb-4">
            <p className="text-caption text-gold uppercase tracking-wide mb-3">Email preview:</p>
            <div className="bg-dark-surface/40 dark:bg-dark-surface rounded-input px-4 py-3 border border-dark-border space-y-3">
              <p className="text-body-sm font-semibold text-navy dark:text-cream">
                Subject: {subject.trim() || '(no subject)'}
              </p>
              <div className="border-t border-dark-border" />
              <p className="text-caption text-slate">Hi [FirstName],</p>
              <p className="text-body-sm text-cream/80 whitespace-pre-wrap">
                {body.trim() || '(no message body)'}
              </p>
              {buttonText.trim() && (
                <span className="inline-block px-4 py-2 rounded-full text-caption font-semibold bg-gold text-wine-black">
                  {buttonText}
                </span>
              )}
            </div>
          </Card>
        )}

        {/* Send button */}
        <Button
          className="w-full"
          disabled={!canSend}
          onClick={handleSend}
        >
          {sending ? 'Sending…' : `Send to ${count} users`}
        </Button>
      </div>
    </div>
  )
}
