import { AppShell } from '@/components/layout/AppShell'

export default function Page() {
  return (
    <AppShell>
      <div className="harmonia-container py-16 min-h-screen">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="font-heading text-h1 text-[var(--navy)] mb-4">Verify your email</h1>
          <p className="text-body text-[var(--slate)]">Built in Step 4: Authentication Screens.</p>
          <p className="text-caption text-[var(--gold)] mt-6 font-semibold">Coming in a later step</p>
        </div>
      </div>
    </AppShell>
  )
}
