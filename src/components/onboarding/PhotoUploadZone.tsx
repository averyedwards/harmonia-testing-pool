'use client'

import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { cn } from '@/lib/utils'
import { Camera, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type UploadState = 'idle' | 'dragging' | 'processing' | 'approved' | 'error'

interface PhotoUploadZoneProps {
  onPhotoApproved: (previewUrl: string) => void
  className?: string
}

export function PhotoUploadZone({ onPhotoApproved, className }: PhotoUploadZoneProps) {
  const [state, setState] = useState<UploadState>('idle')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setState('error')
      setErrorMessage('Please upload an image file (JPG, PNG, or HEIC)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setState('error')
      setErrorMessage('Photo must be under 10MB')
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setState('processing')

    setTimeout(() => {
      setState('approved')
      onPhotoApproved(url)
    }, 1500)
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setState('idle')
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    setState('dragging')
  }

  function handleDragLeave() {
    setState('idle')
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleRetry() {
    setState('idle')
    setPreviewUrl(null)
    setErrorMessage('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        capture="user"
      />

      {(state === 'idle' || state === 'dragging') && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-card p-8 text-center cursor-pointer transition-all duration-200',
            state === 'dragging'
              ? 'border-gold bg-gold-light dark:border-gold-dark'
              : 'border-gray-light dark:border-dark-border hover:border-gold/50 dark:hover:border-gold-dark/50'
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gold-light dark:bg-gold-light flex items-center justify-center">
              <Camera size={28} className="text-gold dark:text-gold-dark" />
            </div>
            <div>
              <p className="text-body font-medium text-navy dark:text-cream mb-1">
                Upload your photo
              </p>
              <p className="text-body-sm text-slate">
                Tap to take a photo or choose from your gallery
              </p>
            </div>
            <Button variant="secondary" size="sm" type="button">
              <Upload size={16} className="mr-2" />
              Choose Photo
            </Button>
          </div>
        </div>
      )}

      {state === 'processing' && previewUrl && (
        <div className="flex flex-col items-center gap-4 py-4 animate-fade-in">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Your photo"
              className="w-40 h-40 rounded-full object-cover border-4 border-gold-light"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
              <Loader2 size={32} className="text-white animate-spin" />
            </div>
          </div>
          <p className="text-body text-slate">Checking your photo...</p>
        </div>
      )}

      {state === 'approved' && previewUrl && (
        <div className="flex flex-col items-center gap-4 py-4 animate-fade-in">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Your photo"
              className="w-40 h-40 rounded-full object-cover border-4 border-green-400"
            />
            <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <CheckCircle size={24} className="text-white" />
            </div>
          </div>
          <p className="text-body font-medium text-green-700 dark:text-green-400">
            Photo approved
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="text-body-sm text-slate hover:text-gold transition-colors"
          >
            Upload a different photo
          </button>
        </div>
      )}

      {state === 'error' && (
        <div className="flex flex-col items-center gap-4 py-4 animate-fade-in">
          {previewUrl && (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Your photo"
                className="w-40 h-40 rounded-full object-cover border-4 border-red-400 opacity-70"
              />
              <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                <AlertCircle size={24} className="text-white" />
              </div>
            </div>
          )}
          <div className="text-center">
            <p className="text-body font-medium text-red-600 dark:text-red-400 mb-1">
              {errorMessage}
            </p>
            <p className="text-body-sm text-slate">
              Please try again with a different photo.
            </p>
          </div>
          <Button variant="secondary" size="sm" type="button" onClick={handleRetry}>
            Try Again
          </Button>
        </div>
      )}

      {(state === 'idle' || state === 'dragging') && (
        <div className="mt-4 space-y-1.5">
          <p className="text-caption text-slate font-medium">Photo tips:</p>
          <ul className="text-caption text-slate/80 space-y-1 list-none">
            <li>Clear photo of your face with good lighting</li>
            <li>No sunglasses or anything covering your face</li>
            <li>Just you. No group shots.</li>
            <li>Recent photo that looks like you right now</li>
          </ul>
        </div>
      )}
    </div>
  )
}
