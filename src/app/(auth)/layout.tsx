/**
 * Auth Route Group Layout
 *
 * Auth pages (login, register, verify-email, forgot-password) use AuthLayout
 * directly instead of AppShell. This layout passes children through without
 * wrapping in Nav/Footer.
 */
export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
