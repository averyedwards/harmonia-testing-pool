'use client'

import { useState, type FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Step2Props {
  onNext: () => void
}

export function Step2BasicProfile({ onNext }: Step2Props) {
  const { user, updateUser } = useAuth()

  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [age, setAge] = useState(user?.age?.toString() || '')
  const [location, setLocation] = useState(user?.location || '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!firstName.trim()) newErrors.firstName = 'First name is required'
    if (!lastName.trim()) newErrors.lastName = 'Last name is required'
    const ageNum = parseInt(age, 10)
    if (!age.trim() || isNaN(ageNum) || ageNum < 18) newErrors.age = 'Must be 18 or over'
    if (!location.trim()) newErrors.location = 'Location is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    updateUser({
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      age: parseInt(age, 10),
      location,
      isLondon: location.toLowerCase().includes('london'),
    })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in" noValidate>
      <div className="mb-4">
        <h2 className="font-heading text-h3 text-navy dark:text-cream mb-1">
          Confirm your details
        </h2>
        <p className="text-body-sm text-slate">
          Make sure everything looks right. You can edit these later.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="onboard-first-name"
          label="First Name"
          value={firstName}
          onChange={e => { setFirstName(e.target.value); setErrors(prev => ({ ...prev, firstName: '' })) }}
          error={errors.firstName}
        />
        <Input
          id="onboard-last-name"
          label="Last Name"
          value={lastName}
          onChange={e => { setLastName(e.target.value); setErrors(prev => ({ ...prev, lastName: '' })) }}
          error={errors.lastName}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="onboard-age"
          type="number"
          label="Age"
          value={age}
          onChange={e => { setAge(e.target.value); setErrors(prev => ({ ...prev, age: '' })) }}
          error={errors.age}
          min={18}
        />
        <div>
          <label className="block text-body-sm font-medium text-navy dark:text-slate mb-1.5">
            Gender
          </label>
          <div className="harmonia-input bg-gray-light/50 dark:bg-dark-border/50 cursor-not-allowed text-slate">
            {user?.gender === 'male' ? 'Male' : 'Female'}
          </div>
          <p className="text-caption text-slate/60 mt-1">Set at registration</p>
        </div>
      </div>

      <Input
        id="onboard-location"
        label="Location"
        placeholder="London, UK"
        value={location}
        onChange={e => { setLocation(e.target.value); setErrors(prev => ({ ...prev, location: '' })) }}
        error={errors.location}
      />

      <Button type="submit" className="w-full mt-4">
        Continue
      </Button>
    </form>
  )
}
