'use client'

import { useState, type FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dna } from 'lucide-react'

interface Step7Props {
  onNext: () => void
}

interface AddressForm {
  fullName: string
  addressLine1: string
  addressLine2: string
  city: string
  postcode: string
  phoneNumber: string
}

export function Step7AddressForm({ onNext }: Step7Props) {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState<AddressForm>({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    addressLine1: '',
    addressLine2: '',
    city: 'London',
    postcode: '',
    phoneNumber: user?.phoneNumber || '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function updateField(field: keyof AddressForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const newErrors: typeof errors = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!form.addressLine1.trim()) newErrors.addressLine1 = 'Address is required'
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!form.postcode.trim()) newErrors.postcode = 'Postcode is required'
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setSubmitted(true)
    setLoading(false)
    showToast('Address confirmed.', 'success')
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-8 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-gold-light flex items-center justify-center mb-4">
          <Dna size={28} className="text-gold dark:text-gold-dark" />
        </div>
        <h2 className="font-heading text-h3 text-navy dark:text-cream mb-2 text-center">
          Address confirmed
        </h2>
        <p className="text-body text-slate text-center mb-2">
          Your complimentary DNA kit will arrive in 5-10 business days.
        </p>
        <p className="text-body-sm text-slate text-center mb-6">
          We will email you when it has been dispatched.
        </p>
        <Button className="w-full max-w-[300px]" onClick={onNext}>
          Continue
        </Button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gold-light dark:bg-gold-light border border-gold/30 dark:border-gold-dark/30 rounded-card p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
            <Dna size={20} className="text-gold dark:text-gold-dark" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-body font-semibold text-navy dark:text-cream">
                Free DNA Kit
              </p>
              <Badge variant="success">Complimentary</Badge>
            </div>
            <p className="text-body-sm text-slate">
              Your genetic analysis kit will be sent to this address. A 35 GBP value, free for London beta testers.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          id="kit-full-name"
          label="Full Name (as it appears on your door/mailbox)"
          value={form.fullName}
          onChange={e => updateField('fullName', e.target.value)}
          error={errors.fullName}
          autoComplete="name"
        />

        <Input
          id="kit-address1"
          label="Address Line 1"
          placeholder="123 High Street"
          value={form.addressLine1}
          onChange={e => updateField('addressLine1', e.target.value)}
          error={errors.addressLine1}
          autoComplete="address-line1"
        />

        <Input
          id="kit-address2"
          label="Address Line 2 (optional)"
          placeholder="Flat 4B"
          value={form.addressLine2}
          onChange={e => updateField('addressLine2', e.target.value)}
          autoComplete="address-line2"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="kit-city"
            label="City"
            value={form.city}
            onChange={e => updateField('city', e.target.value)}
            error={errors.city}
            autoComplete="address-level2"
          />
          <Input
            id="kit-postcode"
            label="Postcode"
            placeholder="SW1A 1AA"
            value={form.postcode}
            onChange={e => updateField('postcode', e.target.value)}
            error={errors.postcode}
            autoComplete="postal-code"
          />
        </div>

        <Input
          id="kit-phone"
          label="Phone Number (for delivery updates)"
          value={form.phoneNumber}
          onChange={e => updateField('phoneNumber', e.target.value)}
          error={errors.phoneNumber}
          autoComplete="tel"
        />

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? 'Confirming...' : 'Confirm Address'}
        </Button>
      </form>
    </div>
  )
}
