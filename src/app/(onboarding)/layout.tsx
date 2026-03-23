/**
 * Onboarding Route Group Layout
 *
 * Onboarding pages use OnboardingShell directly instead of AppShell.
 * OnboardingShell has its own logo, step progress, and back button.
 * No main Nav/Footer during onboarding — it's a focused flow.
 *
 * ThemeProvider, AuthProvider, PhaseProvider from root layout still apply.
 */
export default function OnboardingGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
