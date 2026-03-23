'use client'

import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  const router = useRouter()

  function handleRegisterSuccess(email: string) {
    router.push(`/verify-email?email=${encodeURIComponent(email)}`)
  }

  return (
    <AuthLayout
      title="Join the testing pool"
      subtitle="Create your account to get started."
    >
      <RegisterForm onSuccess={handleRegisterSuccess} />
    </AuthLayout>
  )
}
