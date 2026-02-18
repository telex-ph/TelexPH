'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDarkMode } from '../../layout'

type ServiceStatus = Record<string, boolean>

interface Service {
  _id: string
  serviceId: string
  name: string
  description: string
  badge: string
  isActive: boolean
  coverPhoto?: string | null
  updatedAt?: string
  createdAt?: string
}

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

// Helper function to convert name to serviceId slug
const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Color mapping based on badge/category
const badgeColors: Record<string, string> = {
  'AI & Tech': 'from-violet-500 to-purple-600',
  'Operations': 'from-blue-500 to-cyan-600',
  'Scheduling': 'from-emerald-500 to-teal-600',
  'Education': 'from-orange-500 to-amber-600',
  'Sales': 'from-rose-500 to-pink-600',
  'Support': 'from-sky-500 to-blue-600',
  'Marketing': 'from-indigo-500 to-violet-600',
  'Branding': 'from-slate-500 to-gray-600',
  'Data': 'from-teal-500 to-emerald-600',
  'Development': 'from-green-500 to-emerald-600',
}

const getServiceColor = (badge: string): string => {
  return badgeColors[badge] || 'from-gray-500 to-slate-600'
}

// Icon mapping for services
const serviceIcons: Record<string, React.ReactNode> = {
  'ai-builder': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  'automation': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  'booking-appointment': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  'courses-products': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  'crm': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  'csr': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  'email-marketing': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  'funnel-builder': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  'gray-label': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  'social-media-management': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  'survey-forms': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  'tech-support': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  'web-development': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
}

const defaultIcon = (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

// ── COVER PHOTO UPLOADER ──────────────────────────────────────────────────────
function CoverPhotoUploader({
  isdarkmode,
  value,
  onChange,
}: {
  isdarkmode: boolean
  value: string | null
  onChange: (base64: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
        Cover Photo{' '}
        <span className={`text-[9px] font-normal normal-case tracking-normal ${isdarkmode ? 'text-gray-600' : 'text-gray-400'}`}>
          (optional)
        </span>
      </label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden" style={{ height: 140 }}>
          <img src={value ?? ''} alt="Cover preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white text-gray-900 text-[10px] font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-[10px] font-bold uppercase tracking-wide hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
          <div className="absolute bottom-2 right-2 pointer-events-none">
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-black/50 text-white">
              Hover to change
            </span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
            isdarkmode
              ? 'border-white/10 hover:border-white/20 bg-[#2a2a2a] hover:bg-[#333333]'
              : 'border-gray-200 hover:border-[#800000]/40 bg-gray-50 hover:bg-white'
          }`}
          style={{ height: 100 }}
        >
          <svg className={`w-7 h-7 ${isdarkmode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${isdarkmode ? 'text-gray-600' : 'text-gray-400'}`}>
            Click or drag to upload
          </p>
          <p className={`text-[9px] ${isdarkmode ? 'text-gray-700' : 'text-gray-300'}`}>PNG, JPG, WEBP up to 5MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

// ── ADD SERVICE MODAL ─────────────────────────────────────────────────────────
function AddServiceModal({ isOpen, onClose, onSuccess, isdarkmode }: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  isdarkmode: boolean
}) {
  const [formData, setFormData] = useState<{
    name: string
    description: string
    badge: string
    coverPhoto: string | null
  }>({
    name: '',
    description: '',
    badge: '',
    coverPhoto: null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Reset form on close
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', description: '', badge: '', coverPhoto: null })
      setError('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const serviceId = toSlug(formData.name)

      const response = await fetch('http://localhost:3000/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          serviceId,
          name: formData.name,
          description: formData.description,
          badge: formData.badge,
          coverPhoto: formData.coverPhoto || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 401) throw new Error('Session expired or not logged in. Please login again.')
        throw new Error(errorData.error || 'Failed to create service')
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className={`px-6 py-5 border-b ${isdarkmode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg bold-text uppercase tracking-tight ${isdarkmode ? 'text-gray-100' : 'text-gray-900'}`}>
              Add New Service
            </h2>
            <button onClick={onClose} className={`p-2 rounded-xl transition-all ${isdarkmode ? 'hover:bg-white/5 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-500">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <CoverPhotoUploader
              isdarkmode={isdarkmode}
              value={formData.coverPhoto}
              onChange={(val) => setFormData(prev => ({ ...prev, coverPhoto: val }))}
            />

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., AI Builder"
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all outline-none ${isdarkmode ? 'bg-[#2a2a2a] text-gray-100 placeholder-gray-500 focus:bg-[#333333] border border-white/5' : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white border border-gray-200 focus:border-[#800000]'}`}
              />
              {formData.name && (
                <p className={`mt-1 text-[10px] ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                  ID will be: <span className="font-mono">{toSlug(formData.name)}</span>
                </p>
              )}
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Category Badge <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.badge}
                onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                placeholder="e.g., AI & Tech, Marketing, Sales"
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all outline-none ${isdarkmode ? 'bg-[#2a2a2a] text-gray-100 placeholder-gray-500 focus:bg-[#333333] border border-white/5' : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white border border-gray-200 focus:border-[#800000]'}`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the service..."
                rows={4}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all outline-none resize-none ${isdarkmode ? 'bg-[#2a2a2a] text-gray-100 placeholder-gray-500 focus:bg-[#333333] border border-white/5' : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white border border-gray-200 focus:border-[#800000]'}`}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} disabled={submitting}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isdarkmode ? 'bg-[#2a2a2a] text-gray-400 hover:bg-[#353535]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-[#800000] text-white hover:bg-[#600000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── EDIT SERVICE MODAL ────────────────────────────────────────────────────────
// KEY DESIGN: This component initialises its state directly from the `service`
// prop passed in. The parent renders it with key={service._id}, which forces
// React to fully unmount + remount every time a different service is edited.
// This means useState runs fresh on every open, so coverPhoto (and all other
// fields) are always correctly pre-populated without needing a useEffect.
function EditServiceModal({ isOpen, onClose, onSuccess, isdarkmode, service }: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  isdarkmode: boolean
  service: Service | null
}) {
  // ✅ FIX: state is seeded directly from service prop at mount time.
  // Because the parent passes key={service._id}, this component remounts
  // fresh every time a different service is selected — no stale data.
  const [formData, setFormData] = useState({
    name: service?.name ?? '',
    description: service?.description ?? '',
    badge: service?.badge ?? '',
    coverPhoto: service?.coverPhoto ?? null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!service) return
    setError('')
    setSubmitting(true)

    try {
      const response = await fetch(`http://localhost:3000/api/services/${service._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          badge: formData.badge,
          // ✅ FIX: always include coverPhoto so the controller can clear it when removed
          coverPhoto: formData.coverPhoto || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 401) throw new Error('Session expired or not logged in. Please login again.')
        throw new Error(errorData.error || 'Failed to update service')
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen || !service) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className={`px-6 py-5 border-b ${isdarkmode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-lg bold-text uppercase tracking-tight ${isdarkmode ? 'text-gray-100' : 'text-gray-900'}`}>
                Edit Service
              </h2>
              <p className={`text-[10px] mt-0.5 font-mono ${isdarkmode ? 'text-gray-600' : 'text-gray-400'}`}>
                {service.serviceId}
              </p>
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl transition-all ${isdarkmode ? 'hover:bg-white/5 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-500">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* ✅ FIX: value is seeded from service.coverPhoto — shows existing photo immediately */}
            <CoverPhotoUploader
              isdarkmode={isdarkmode}
              value={formData.coverPhoto}
              onChange={(val) => setFormData(prev => ({ ...prev, coverPhoto: val }))}
            />

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., AI Builder"
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all outline-none ${isdarkmode ? 'bg-[#2a2a2a] text-gray-100 placeholder-gray-500 focus:bg-[#333333] border border-white/5' : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white border border-gray-200 focus:border-[#800000]'}`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Category Badge <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.badge}
                onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                placeholder="e.g., AI & Tech, Marketing, Sales"
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all outline-none ${isdarkmode ? 'bg-[#2a2a2a] text-gray-100 placeholder-gray-500 focus:bg-[#333333] border border-white/5' : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white border border-gray-200 focus:border-[#800000]'}`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the service..."
                rows={4}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all outline-none resize-none ${isdarkmode ? 'bg-[#2a2a2a] text-gray-100 placeholder-gray-500 focus:bg-[#333333] border border-white/5' : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white border border-gray-200 focus:border-[#800000]'}`}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} disabled={submitting}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isdarkmode ? 'bg-[#2a2a2a] text-gray-400 hover:bg-[#353535]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-[#800000] text-white hover:bg-[#600000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── SORT TYPE ──────────────────────────────────────────────────────────────────
type SortMode = 'alpha-asc' | 'alpha-desc' | 'date-newest' | 'date-oldest'

export default function ListServices() {
  const router = useRouter()
  const { isdarkmode } = useDarkMode()

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchquery, setsearchquery] = useState('')
  const [viewmode, setviewmode] = useState<'grid' | 'list'>('grid')
  const [filtermode, setfiltermode] = useState<'all' | 'active' | 'inactive'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [sortmode, setsortmode] = useState<SortMode>('alpha-asc')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/services', {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to fetch services')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglestatus = async (e: React.MouseEvent, serviceId: string) => {
    e.stopPropagation()

    const service = services.find(s => s.serviceId === serviceId)
    if (!service) return

    try {
      const response = await fetch(`http://localhost:3000/api/services/${service._id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (response.status === 401) {
        alert('Session expired or not logged in. Please login again.')
        router.push('/login')
        return
      }

      if (!response.ok) throw new Error('Failed to toggle service status')

      const updatedService = await response.json()
      setServices(services.map(s => s._id === updatedService._id ? updatedService : s))
    } catch (error) {
      console.error('Error toggling service status:', error)
      alert('Failed to update service status')
    }
  }

  const openEditModal = (e: React.MouseEvent, service: Service) => {
    e.stopPropagation()
    setEditingService(service)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setTimeout(() => setEditingService(null), 200)
  }

  // sort helper applied after filter
  const applysort = (list: Service[]): Service[] => {
    const sorted = [...list]
    switch (sortmode) {
      case 'alpha-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'alpha-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      case 'date-newest':
        return sorted.sort((a, b) =>
          new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() -
          new Date(a.updatedAt ?? a.createdAt ?? 0).getTime()
        )
      case 'date-oldest':
        return sorted.sort((a, b) =>
          new Date(a.updatedAt ?? a.createdAt ?? 0).getTime() -
          new Date(b.updatedAt ?? b.createdAt ?? 0).getTime()
        )
      default:
        return sorted
    }
  }

  const filtered = applysort(
    services.filter(service => {
      const matchessearch =
        service.name.toLowerCase().includes(searchquery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchquery.toLowerCase()) ||
        service.badge.toLowerCase().includes(searchquery.toLowerCase())

      const matchesfilter =
        filtermode === 'all' ||
        (filtermode === 'active' && service.isActive) ||
        (filtermode === 'inactive' && !service.isActive)

      return matchessearch && matchesfilter
    })
  )

  const cardshadow = {
    boxShadow: isdarkmode
      ? '0 2px 8px rgba(0,0,0,0.3)'
      : '0 2px 8px rgba(0,0,0,0.08)',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000] mx-auto mb-4"></div>
          <p className={isdarkmode ? 'text-gray-400' : 'text-gray-600'}>Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;900&display=swap');
        .bold-text { font-weight: 700; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className={`text-2xl bold-text uppercase tracking-tight mb-2 ${isdarkmode ? 'text-gray-100' : 'text-gray-900'}`}>
              Services Management
            </h1>
            <p className={`text-[11px] mt-1 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
              Manage and configure all available services
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-[#800000] text-white hover:bg-[#600000] transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Service
          </button>
        </div>

        {/* Controls */}
        <div className={`rounded-2xl p-5 mb-6 ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`} style={cardshadow}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-grow">
              {/* Search */}
              <div className="relative flex-grow sm:max-w-md">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchquery}
                  onChange={e => setsearchquery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs transition-all outline-none ${
                    isdarkmode
                      ? 'bg-[#2a2a2a] text-gray-100 placeholder-gray-500 focus:bg-[#333333] border border-white/5'
                      : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white border border-gray-200 focus:border-[#800000]'
                  }`}
                />
                <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filter buttons */}
              <div className="flex gap-2">
                <button onClick={() => setfiltermode('all')} className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filtermode === 'all' ? 'bg-[#800000] text-white shadow-md' : isdarkmode ? 'bg-[#2a2a2a] text-gray-400 hover:bg-[#353535]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
                <button onClick={() => setfiltermode('active')} className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filtermode === 'active' ? 'bg-emerald-500 text-white shadow-md' : isdarkmode ? 'bg-[#2a2a2a] text-gray-400 hover:bg-[#353535]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Active</button>
                <button onClick={() => setfiltermode('inactive')} className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filtermode === 'inactive' ? 'bg-gray-500 text-white shadow-md' : isdarkmode ? 'bg-[#2a2a2a] text-gray-400 hover:bg-[#353535]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Inactive</button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortmode}
                  onChange={e => setsortmode(e.target.value as SortMode)}
                  className={`pl-8 pr-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest appearance-none outline-none transition-all ${isdarkmode ? 'bg-[#2a2a2a] text-gray-300 border border-white/5 hover:bg-[#353535]' : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}`}
                >
                  <option value="date-newest">Date Modified ↓</option>
                  <option value="date-oldest">Date Modified ↑</option>
                  <option value="alpha-asc">Name A → Z</option>
                  <option value="alpha-desc">Name Z → A</option>
                </select>
                <svg className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </div>

              {/* View toggle */}
              <button onClick={() => setviewmode('grid')} title="Grid View"
                className={`p-2.5 rounded-xl transition-all ${viewmode === 'grid' ? 'bg-[#800000] text-white shadow-md' : isdarkmode ? 'bg-[#2a2a2a] text-gray-400 hover:bg-[#353535]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button onClick={() => setviewmode('list')} title="List View"
                className={`p-2.5 rounded-xl transition-all ${viewmode === 'list' ? 'bg-[#800000] text-white shadow-md' : isdarkmode ? 'bg-[#2a2a2a] text-gray-400 hover:bg-[#353535]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <p className={`text-[10px] uppercase tracking-widest font-bold mb-4 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
          Showing {filtered.length} of {services.length} services
        </p>

        {filtered.length === 0 && (
          <div className={`${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-2xl p-16 text-center`} style={cardshadow}>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className={`text-sm bold-text mb-2 ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>No services found</h3>
            <p className={`text-[10px] ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search or filter</p>
          </div>
        )}

        {/* Grid View */}
        {filtered.length > 0 && viewmode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(service => {
              const serviceColor = getServiceColor(service.badge)
              return (
                <div
                  key={service._id}
                  className={`group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`}
                  style={cardshadow}
                >
                  <div className={`h-1.5 w-full bg-gradient-to-r ${serviceColor} shrink-0`} />

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${serviceColor} text-white shadow-lg`}>
                        {serviceIcons[service.serviceId] || defaultIcon}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${isdarkmode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                          {service.badge}
                        </span>
                        {/* Edit button — fades in on card hover */}
                        <button
                          onClick={(e) => openEditModal(e, service)}
                          title="Edit service"
                          className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${isdarkmode ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700'}`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <h3 className={`text-[13px] bold-text uppercase tracking-tight mb-2 ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>
                      {service.name}
                    </h3>

                    <p className={`text-[10px] leading-relaxed flex-grow ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {service.description}
                    </p>

                    <div className={`mt-4 pt-4 border-t flex items-center justify-between ${isdarkmode ? 'border-white/5' : 'border-gray-100'}`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full shadow-sm transition-colors ${service.isActive ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-gray-400 shadow-gray-400/30'}`} />
                        <span className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${service.isActive ? (isdarkmode ? 'text-emerald-400' : 'text-emerald-500') : (isdarkmode ? 'text-gray-600' : 'text-gray-400')}`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <button
                        onClick={(e) => togglestatus(e, service.serviceId)}
                        className={`relative w-9 h-5 rounded-full transition-all duration-300 border-none outline-none cursor-pointer active:scale-90 z-10 ${service.isActive ? 'bg-emerald-400' : (isdarkmode ? 'bg-[#3a3a3a]' : 'bg-gray-200')}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${service.isActive ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* List View */}
        {filtered.length > 0 && viewmode === 'list' && (
          <div className="space-y-3">
            {filtered.map(service => {
              const serviceColor = getServiceColor(service.badge)
              return (
                <div
                  key={service._id}
                  className={`group rounded-2xl overflow-hidden transition-all duration-300 flex items-center gap-5 ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`}
                  style={cardshadow}
                >
                  <div className={`w-1 self-stretch rounded-full bg-gradient-to-b ${serviceColor} shrink-0`} />

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${serviceColor} text-white shrink-0 shadow-md`}>
                    {serviceIcons[service.serviceId] || defaultIcon}
                  </div>

                  <div className="flex-grow min-w-0 py-5">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className={`text-[12px] bold-text uppercase tracking-tight ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {service.name}
                      </h3>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isdarkmode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        {service.badge}
                      </span>
                    </div>
                    <p className={`text-[10px] leading-relaxed line-clamp-1 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pr-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full shadow-sm transition-colors ${service.isActive ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-gray-400 shadow-gray-400/30'}`} />
                      <span className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${service.isActive ? (isdarkmode ? 'text-emerald-400' : 'text-emerald-500') : (isdarkmode ? 'text-gray-600' : 'text-gray-400')}`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {/* Edit button — fades in on row hover */}
                    <button
                      onClick={(e) => openEditModal(e, service)}
                      title="Edit service"
                      className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${isdarkmode ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700'}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => togglestatus(e, service.serviceId)}
                      className={`relative w-9 h-5 rounded-full transition-all duration-300 border-none outline-none cursor-pointer active:scale-90 z-10 ${service.isActive ? 'bg-emerald-400' : (isdarkmode ? 'bg-[#3a3a3a]' : 'bg-gray-200')}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${service.isActive ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchServices}
        isdarkmode={isdarkmode}
      />

      {/*
        ✅ KEY FIX: key={editingService?._id} forces React to fully unmount and
        remount EditServiceModal every time a different service is opened.
        This guarantees useState runs fresh with the new service's data,
        so coverPhoto and all other fields are always correctly pre-populated.
      */}
      <EditServiceModal
        key={editingService?._id ?? 'edit-modal'}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSuccess={fetchServices}
        isdarkmode={isdarkmode}
        service={editingService}
      />
    </div>
  )
}