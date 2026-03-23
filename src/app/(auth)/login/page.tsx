'use client'

import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  const router = useRouter()

  function handleLoginSuccess() {
    router.push('/dashboard')
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to the testing pool."
    >
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthLayout>
  )
}
