'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { LinearProgress, CircularProgress, StepProgress } from '@/components/ui/progress'
import { Toggle } from '@/components/ui/toggle'
import { useToast } from '@/components/ui/toast'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="font-heading text-h2 text-navy dark:text-cream mb-6 pb-2 border-b border-gray-light dark:border-dark-border">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="text-caption text-slate mb-3 uppercase tracking-wide">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

export default function ShowcasePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [toggleA, setToggleA] = useState(false)
  const [toggleB, setToggleB] = useState(true)
  const [textValue, setTextValue] = useState('')
  const { showToast } = useToast()

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-10">
        <h1 className="font-heading text-h1 text-navy dark:text-cream mb-2">Component Showcase</h1>
        <p className="text-body text-slate">Visual QA for the Harmonia design system. All components in both light and dark mode.</p>
      </div>

      {/* BUTTONS */}
      <Section title="Buttons">
        <Row label="Variants">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </Row>
        <Row label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="secondary" aria-label="icon">♥</Button>
        </Row>
        <Row label="Disabled">
          <Button disabled>Disabled Primary</Button>
          <Button variant="secondary" disabled>Disabled Secondary</Button>
        </Row>
      </Section>

      {/* INPUTS */}
      <Section title="Inputs">
        <Row label="Default">
          <div className="w-full max-w-sm">
            <Input label="Email address" placeholder="you@example.com" type="email" />
          </div>
        </Row>
        <Row label="With error">
          <div className="w-full max-w-sm">
            <Input label="Email address" placeholder="you@example.com" error="Please enter a valid email address." />
          </div>
        </Row>
        <Row label="Disabled">
          <div className="w-full max-w-sm">
            <Input label="Username" value="alex.morgan" disabled />
          </div>
        </Row>
      </Section>

      {/* TEXTAREA */}
      <Section title="Textarea with word counter">
        <Row label="10 words (below minimum)">
          <div className="w-full max-w-lg">
            <Textarea
              label="Your answer"
              placeholder="Write your response here..."
              value="This is a short response that is below minimum."
              onChange={() => {}}
              minWords={25}
              maxWords={150}
            />
          </div>
        </Row>
        <Row label="At limit">
          <div className="w-full max-w-lg">
            <Textarea
              label="Your answer"
              value={textValue}
              onChange={setTextValue}
              placeholder="Start typing your response..."
              minWords={25}
              maxWords={150}
            />
          </div>
        </Row>
      </Section>

      {/* SELECT */}
      <Section title="Select">
        <Row label="Default">
          <div className="w-full max-w-xs">
            <Select
              label="Gender"
              options={[
                { value: 'female', label: 'Female' },
                { value: 'male', label: 'Male' },
                { value: 'nonbinary', label: 'Non-binary' },
                { value: 'other', label: 'Prefer to self-describe' },
              ]}
              placeholder="Select an option"
            />
          </div>
        </Row>
      </Section>

      {/* CARDS */}
      <Section title="Cards">
        <Row label="Standard card">
          <Card className="max-w-xs p-6">
            <h3 className="font-heading text-h4 text-navy dark:text-cream mb-2">Standard Card</h3>
            <p className="text-body-sm text-slate">This is a standard Harmonia card with cream background and subtle shadow.</p>
          </Card>
        </Row>
        <Row label="Gold accent card">
          <Card goldAccent className="max-w-xs p-6">
            <h3 className="font-heading text-h4 text-navy dark:text-cream mb-2">Gold Accent</h3>
            <p className="text-body-sm text-slate">This card has a gold left border accent — used for highlighted content.</p>
          </Card>
        </Row>
      </Section>

      {/* BADGES */}
      <Section title="Badges">
        <Row label="All variants">
          <Badge>Phase 2</Badge>
          <Badge variant="phase">London</Badge>
          <Badge variant="success">Verified</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="error">Error</Badge>
        </Row>
      </Section>

      {/* MODAL */}
      <Section title="Modal">
        <Row label="Trigger">
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        </Row>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Example Modal"
        >
          <p className="text-body text-slate mb-6">
            This is a Harmonia modal. It uses a backdrop blur, slides up from below, and can be closed via the X button, clicking the backdrop, or pressing Escape.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </Modal>
      </Section>

      {/* PROGRESS */}
      <Section title="Progress Indicators">
        <Row label="Linear progress">
          <div className="w-full max-w-md space-y-4">
            <LinearProgress value={25} showLabel />
            <LinearProgress value={60} showLabel />
            <LinearProgress value={100} showLabel />
          </div>
        </Row>
        <Row label="Linear progress (small)">
          <div className="w-full max-w-md space-y-4">
            <LinearProgress value={40} size="sm" />
            <LinearProgress value={80} size="sm" />
          </div>
        </Row>
        <Row label="Circular progress">
          <CircularProgress value={25} size={80}>
            <span className="text-caption font-semibold text-gold">25%</span>
          </CircularProgress>
          <CircularProgress value={60} size={80}>
            <span className="text-caption font-semibold text-gold">60%</span>
          </CircularProgress>
          <CircularProgress value={100} size={80}>
            <span className="text-caption font-semibold text-gold">100%</span>
          </CircularProgress>
          <CircularProgress value={32} size={120}>
            <div className="text-center">
              <p className="text-body-sm font-semibold text-gold">12/36</p>
              <p className="text-caption text-slate">done</p>
            </div>
          </CircularProgress>
        </Row>
        <Row label="Step progress (onboarding)">
          <div className="w-full max-w-md">
            <StepProgress currentStep={3} totalSteps={7} className="mb-4" />
            <StepProgress currentStep={5} totalSteps={7} className="mb-4" />
            <StepProgress currentStep={7} totalSteps={7} />
          </div>
        </Row>
      </Section>

      {/* TOAST */}
      <Section title="Toast Notifications">
        <Row label="Trigger toasts">
          <Button onClick={() => showToast('Profile saved successfully', 'success')}>
            Success Toast
          </Button>
          <Button variant="secondary" onClick={() => showToast('Something went wrong — please try again.', 'error')}>
            Error Toast
          </Button>
          <Button variant="ghost" onClick={() => showToast('Your comparison has been recorded.', 'info')}>
            Info Toast
          </Button>
        </Row>
      </Section>

      {/* TOGGLE */}
      <Section title="Toggles">
        <Row label="On / Off states">
          <Toggle
            enabled={toggleA}
            onChange={setToggleA}
            label="Email notifications"
          />
          <Toggle
            enabled={toggleB}
            onChange={setToggleB}
            label="Push notifications"
          />
        </Row>
      </Section>

      {/* TYPOGRAPHY */}
      <Section title="Typography">
        <div className="space-y-4">
          <p className="font-heading text-display text-navy dark:text-cream">Display — Cormorant Garamond</p>
          <p className="font-heading text-h1 text-navy dark:text-cream">Heading 1</p>
          <p className="font-heading text-h2 text-navy dark:text-cream">Heading 2</p>
          <p className="font-heading text-h3 text-navy dark:text-cream">Heading 3</p>
          <p className="font-heading text-h4 text-navy dark:text-cream">Heading 4</p>
          <p className="text-body-lg text-navy dark:text-cream">Body large — DM Sans</p>
          <p className="text-body text-slate">Body regular — secondary text colour</p>
          <p className="text-body-sm text-slate">Body small</p>
          <p className="text-caption text-slate uppercase tracking-wide">Caption / label text</p>
        </div>
      </Section>

      {/* COLOURS */}
      <Section title="Colour Palette">
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: 'cream', cls: 'bg-cream border border-gray-light' },
            { name: 'blush', cls: 'bg-blush' },
            { name: 'gold', cls: 'bg-gold' },
            { name: 'gold-champagne', cls: 'bg-gold-champagne' },
            { name: 'maroon', cls: 'bg-maroon' },
            { name: 'maroon-deep', cls: 'bg-maroon-deep' },
            { name: 'wine-black', cls: 'bg-wine-black' },
            { name: 'dark-surface', cls: 'bg-dark-surface' },
            { name: 'navy', cls: 'bg-navy' },
            { name: 'slate', cls: 'bg-slate' },
            { name: 'chemistry-strong', cls: 'bg-chemistry-strong' },
            { name: 'chemistry-good', cls: 'bg-chemistry-good' },
          ].map(({ name, cls }) => (
            <div key={name}>
              <div className={`h-12 rounded-card ${cls}`} />
              <p className="text-caption text-slate mt-1">{name}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* AVATAR PLACEHOLDERS */}
      <Section title="Avatar Placeholders">
        <div className="flex flex-wrap gap-3">
          {['avatar-f-20s-1', 'avatar-f-20s-2', 'avatar-m-20s-1', 'avatar-m-20s-2', 'avatar-f-30s-1', 'avatar-m-30s-1'].map(name => (
            <div key={name} className="text-center">
              <img
                src={`/placeholders/${name}.svg`}
                alt={name}
                className="w-24 h-32 object-cover rounded-card"
              />
              <p className="text-caption text-slate mt-1 text-[10px]">{name}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
