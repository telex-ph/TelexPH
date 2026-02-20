'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDarkMode } from '../../layout'

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

const toSlug = (text: string): string =>
  text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

// ── ICONS ─────────────────────────────────────────────────────────────────────
const serviceIcons: Record<string, React.ReactNode> = {
  'ai-builder': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  'automation': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  'booking-appointment': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  'courses-products': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  'crm': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  'csr': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  'email-marketing': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  'funnel-builder': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  'gray-label': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  'social-media-management': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  'survey-forms': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  'tech-support': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  'web-development': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
}

const defaultIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  return (
    <div>
      <label
        className={`block text-[11px] font-medium mb-1.5 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Cover Photo{' '}
        <span className={`font-normal ${isdarkmode ? 'text-gray-600' : 'text-gray-400'}`}>(optional)</span>
      </label>

      {value ? (
        <div className={`relative rounded-lg overflow-hidden border ${isdarkmode ? 'border-white/8' : 'border-gray-200'}`} style={{ height: 130 }}>
          <img src={value} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 rounded text-[11px] font-medium bg-white text-gray-800 hover:bg-gray-100 transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}>Change</button>
            <button type="button" onClick={() => onChange(null)}
              className="px-3 py-1.5 rounded text-[11px] font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}>Remove</button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f) }}
          onDragOver={(e) => e.preventDefault()}
          className={`w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
            isdarkmode
              ? 'border-white/10 hover:border-[#800000]/50 bg-white/[0.02]'
              : 'border-gray-200 hover:border-[#800000]/40 bg-gray-50 hover:bg-white'
          }`}
          style={{ height: 88 }}
        >
          <svg className={`w-6 h-6 ${isdarkmode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className={`text-[11px] font-normal ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
            Click or drag to upload
          </p>
          <p className={`text-[10px] ${isdarkmode ? 'text-gray-600' : 'text-gray-400'}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
            PNG, JPG, WEBP · Max 5MB
          </p>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
    </div>
  )
}

// ── SHARED FIELD CLASSES (SMALLER TEXT) ──────────────────────────────────────
const getInputCls = (isdarkmode: boolean) =>
  `w-full px-3 py-2 rounded-lg text-[11px] font-normal border outline-none transition-all duration-200 ${
    isdarkmode
      ? 'bg-[#161616] text-[#f0f0f0] placeholder-[#6b7280] border-white/10 focus:border-[#800000]'
      : 'bg-white text-[#1f2937] placeholder-[#9ca3af] border-[#e5e7eb] focus:border-[#800000]'
  }`

const getLabelCls = (isdarkmode: boolean) =>
  `block text-[10px] font-medium mb-1 uppercase tracking-wider ${isdarkmode ? 'text-[#9ca3af]' : 'text-[#6b7280]'}`

// ── ADD SERVICE MODAL ─────────────────────────────────────────────────────────
function AddServiceModal({
  isOpen,
  onClose,
  onSuccess,
  isdarkmode,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  isdarkmode: boolean
}) {
  const [formData, setFormData] = useState({ name: '', description: '', badge: '', coverPhoto: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', description: '', badge: '', coverPhoto: '' })
      setError('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const response = await fetch('http://localhost:3000/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          serviceId: toSlug(formData.name),
          name: formData.name,
          description: formData.description,
          badge: formData.badge,
          coverPhoto: formData.coverPhoto || null,
        }),
      })

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'failed to create service');
        onSuccess()
        onClose()
      } else {
        throw new Error(`server error: received non-json response (${response.status})`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'an error occurred')
      console.error("submit error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="absolute inset-0 bg-[#000]/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden border ${isdarkmode ? 'bg-[#111] border-white/5' : 'bg-white border-gray-100'}`}>
        <div className="relative px-8 pt-8 pb-4">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#800000]" />
          <h2 className="text-[18px] font-semibold tracking-tight" style={{ color: isdarkmode ? '#fff' : '#111', margin: 0 }}>new system service</h2>
          <p className="text-[11px] text-gray-400 mt-1 font-normal">registry update protocol</p>
        </div>
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          {error && <p className="text-[10px] text-red-500 bg-red-500/10 p-2 rounded">{error}</p>}
          <div className="space-y-2">
            <label className={getLabelCls(isdarkmode)}>cover photo (optional)</label>
            <div className={`rounded-xl border-2 border-dashed flex items-center justify-center p-2 min-h-[160px] ${isdarkmode ? 'bg-[#1a1a1a] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
              <CoverPhotoUploader
                isdarkmode={isdarkmode}
                value={formData.coverPhoto}
                onChange={(val) => setFormData(p => ({ ...p, coverPhoto: val ?? '' }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={getLabelCls(isdarkmode)}>service name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className={getInputCls(isdarkmode)} />
            </div>
            <div>
              <label className={getLabelCls(isdarkmode)}>category badge</label>
              <input type="text" required value={formData.badge} onChange={e => setFormData(p => ({ ...p, badge: e.target.value }))} className={getInputCls(isdarkmode)} />
            </div>
          </div>
          <div>
            <label className={getLabelCls(isdarkmode)}>service description</label>
            <textarea required value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} className={`${getInputCls(isdarkmode)} resize-none`} />
          </div>
          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className={`flex-1 py-2.5 text-[11px] font-medium border rounded-lg transition-all ${isdarkmode ? 'border-white/10 text-gray-400 hover:text-white' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>cancel</button>
            <button type="submit" disabled={submitting} className="flex-[2] py-2.5 text-[11px] font-medium text-white rounded-lg transition-all shadow-lg" style={{ background: '#800000' }}>{submitting ? 'authenticating...' : 'register service'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── EDIT SERVICE MODAL ────────────────────────────────────────────────────────
function EditServiceModal({
  isOpen,
  onClose,
  onSuccess,
  isdarkmode,
  service,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  isdarkmode: boolean
  service: Service | null
}) {
  const [formData, setFormData] = useState({ name: '', description: '', badge: '', coverPhoto: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name ?? '',
        description: service.description ?? '',
        badge: service.badge ?? '',
        coverPhoto: service.coverPhoto ?? '',
      })
    }
  }, [service])

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
          coverPhoto: formData.coverPhoto || null,
        }),
      })

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'failed to update service');
        onSuccess()
        onClose()
      } else {
        throw new Error(`server error: received html instead of json (${response.status}). check your backend route.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'an error occurred')
      console.error("update error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen || !service) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="absolute inset-0 bg-[#000]/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden border ${isdarkmode ? 'bg-[#111] border-white/5' : 'bg-white border-gray-100'}`}>
        <div className="relative px-8 pt-8 pb-4">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#800000]" />
          <h2 className="text-[18px] font-semibold tracking-tight" style={{ color: isdarkmode ? '#fff' : '#111', margin: 0 }}>modify configuration</h2>
          <p className="text-[9px] font-mono mt-1 text-[#800000] font-bold uppercase tracking-tighter">ref: {service.serviceId}</p>
        </div>
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          {error && <p className="text-[10px] text-red-500 bg-red-500/10 p-2 rounded">{error}</p>}
          <div className="space-y-2">
            <label className={getLabelCls(isdarkmode)}>cover photo (optional)</label>
            <div className={`rounded-xl border-2 border-dashed flex items-center justify-center p-2 min-h-[160px] ${isdarkmode ? 'bg-[#1a1a1a] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
              <CoverPhotoUploader
                isdarkmode={isdarkmode}
                value={formData.coverPhoto}
                onChange={(val) => setFormData(p => ({ ...p, coverPhoto: val ?? '' }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={getLabelCls(isdarkmode)}>display name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className={getInputCls(isdarkmode)} />
            </div>
            <div>
              <label className={getLabelCls(isdarkmode)}>category badge</label>
              <input type="text" required value={formData.badge} onChange={e => setFormData(p => ({ ...p, badge: e.target.value }))} className={getInputCls(isdarkmode)} />
            </div>
          </div>
          <div>
            <label className={getLabelCls(isdarkmode)}>service description</label>
            <textarea required value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={4} className={`${getInputCls(isdarkmode)} resize-none`} />
          </div>
          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className={`flex-1 py-2.5 text-[11px] font-medium border rounded-lg transition-all ${isdarkmode ? 'border-white/10 text-gray-400 hover:text-white' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>discard</button>
            <button type="submit" disabled={submitting} className="flex-[2] py-2.5 text-[11px] font-medium text-white rounded-lg transition-all shadow-lg" style={{ background: '#800000' }}>{submitting ? 'updating...' : 'commit changes'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── SORT TYPE ─────────────────────────────────────────────────────────────────
type SortMode = 'alpha-asc' | 'alpha-desc' | 'date-newest' | 'date-oldest'

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ListServices() {
  const router = useRouter()
  const { isdarkmode } = useDarkMode()

  const [services, setServices]             = useState<Service[]>([])
  const [loading, setLoading]               = useState(true)
  const [searchquery, setsearchquery]       = useState('')
  const [viewmode, setviewmode]             = useState<'grid' | 'list'>('grid')
  const [filtermode, setfiltermode]         = useState<'all' | 'active' | 'inactive'>('all')
  const [sortmode, setsortmode]             = useState<SortMode>('alpha-asc')
  const [isModalOpen, setIsModalOpen]       = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  useEffect(() => { fetchServices() }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/services', { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch')
      setServices(await response.json())
    } catch (err) {
      console.error(err)
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
      if (response.status === 401) { alert('Session expired.'); router.push('/login'); return }
      if (!response.ok) throw new Error('Failed to toggle')
      const updated = await response.json()
      setServices(prev => prev.map(s => s._id === updated._id ? updated : s))
    } catch (err) {
      console.error(err)
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

  const applysort = (list: Service[]): Service[] => {
    const s = [...list]
    switch (sortmode) {
      case 'alpha-asc':   return s.sort((a, b) => a.name.localeCompare(b.name))
      case 'alpha-desc':  return s.sort((a, b) => b.name.localeCompare(a.name))
      case 'date-newest': return s.sort((a, b) => new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() - new Date(a.updatedAt ?? a.createdAt ?? 0).getTime())
      case 'date-oldest': return s.sort((a, b) => new Date(a.updatedAt ?? a.createdAt ?? 0).getTime() - new Date(b.updatedAt ?? b.createdAt ?? 0).getTime())
      default: return s
    }
  }

  const filtered = applysort(
    services.filter(service => {
      const q = searchquery.toLowerCase()
      const matchSearch =
        service.name.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        service.badge.toLowerCase().includes(q)
      const matchFilter =
        filtermode === 'all' ||
        (filtermode === 'active' && service.isActive) ||
        (filtermode === 'inactive' && !service.isActive)
      return matchSearch && matchFilter
    })
  )

  const activeCount   = services.filter(s => s.isActive).length
  const inactiveCount = services.filter(s => !s.isActive).length

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const pageBg        = isdarkmode ? '#0d0d0d' : '#f5f5f5'
  const cardBg        = isdarkmode ? '#1a1a1a' : '#ffffff'
  const borderColor   = isdarkmode ? 'rgba(255,255,255,0.08)' : '#e5e7eb'
  const textPrimary   = isdarkmode ? '#f0f0f0'  : '#1f2937'
  const textSecondary = isdarkmode ? '#9ca3af'  : '#6b7280'
  const textMuted     = isdarkmode ? '#6b7280'  : '#9ca3af'
  const hoverBg       = isdarkmode ? 'rgba(255,255,255,0.04)' : '#f9fafb'
  const subtleBg      = isdarkmode ? 'rgba(255,255,255,0.03)' : '#f9fafb'
  const inputBg       = isdarkmode ? '#161616' : '#ffffff'

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: pageBg, fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 36, height: 36, border: '2px solid', borderColor: `${borderColor} ${borderColor} ${borderColor} #800000`,
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
          }} />
          <p style={{ fontSize: 13, color: textMuted, fontWeight: 400 }}>Loading services...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  // ── Reusable inline styles ────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: cardBg,
    border: `1px solid ${borderColor}`,
    borderRadius: 16,
  }

  const statusBadgeStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11,
    fontWeight: 500,
    padding: '4px 12px',
    borderRadius: 20,
    border: `1px solid ${isActive ? 'rgba(0,188,125,0.2)' : 'rgba(241,161,13,0.2)'}`,
    background: isActive ? 'rgba(0,188,125,0.08)' : 'rgba(241,161,13,0.08)',
    color: isActive ? '#00bc7d' : '#f1a10d',
    whiteSpace: 'nowrap' as const,
  })

  const toggleStyle = (isActive: boolean): React.CSSProperties => ({
    position: 'relative',
    width: 38,
    height: 22,
    borderRadius: 11,
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    transition: 'background 0.3s',
    background: isActive ? '#800000' : isdarkmode ? 'rgba(255,255,255,0.12)' : '#d1d5db',
    flexShrink: 0,
  })

  const thumbStyle = (isActive: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: 2,
    left: isActive ? 18 : 2,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
    transition: 'left 0.3s',
  })

  const iconBoxStyle = (isActive: boolean): React.CSSProperties => ({
    width: 48,
    height: 48,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isActive
      ? 'linear-gradient(135deg, #800000, #a00000)'
      : isdarkmode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    color: isActive ? '#ffffff' : isdarkmode ? '#9ca3af' : '#9ca3af',
    flexShrink: 0,
  })

  return (
    <div style={{ minHeight: '100vh', background: pageBg, fontFamily: "'Poppins', sans-serif" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        * { font-family: 'Poppins', sans-serif !important; box-sizing: border-box; }
        .svc-row:hover { background: ${hoverBg} !important; }
        .edit-btn { opacity: 0; transition: opacity 0.15s; }
        .svc-card:hover .edit-btn { opacity: 1; }
        .svc-row:hover .edit-btn { opacity: 1; }
        .svc-card { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .svc-card:hover { 
            transform: translateY(-3px); 
            box-shadow: 0 10px 25px rgba(0,0,0,${isdarkmode ? '0.4' : '0.10'}) !important;
            border-color: ${isdarkmode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.10)'};
        } 
        .toggle-btn:active { transform: scale(0.92); }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: `1px solid ${borderColor}` }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 500, color: textPrimary, margin: 0, lineHeight: 1.3 }}>Services Management</h1>
            <p style={{ fontSize: 12, color: textMuted, margin: '4px 0 0', fontWeight: 400 }}>Configure and manage all available services</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Stats pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 8, border: `1px solid ${borderColor}`, background: cardBg, fontSize: 11 }}>
              <span style={{ color: textMuted, fontWeight: 400 }}>Total</span>
              <strong style={{ color: textPrimary, fontWeight: 500 }}>{services.length}</strong>
              <span style={{ width: 1, height: 12, background: borderColor }} />
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00bc7d' }} />
              <span style={{ color: textSecondary, fontWeight: 500 }}>{activeCount}</span>
              <span style={{ width: 1, height: 12, background: borderColor }} />
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f1a10d' }} />
              <span style={{ color: textSecondary, fontWeight: 500 }}>{inactiveCount}</span>
            </div>

            {/* Add service button */}
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 18px', borderRadius: 8,
                background: 'linear-gradient(135deg, #800000, #a00000)',
                color: '#fff', fontSize: 12, fontWeight: 500,
                border: 'none', cursor: 'pointer', transition: 'opacity 0.15s',
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Service
            </button>
          </div>
        </div>

        {/* ── CONTROLS BAR ────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 24 }}>

          {/* Search */}
          <div style={{ position: 'relative', width: 220 }}>
            <input
              type="text"
              placeholder="Search services..."
              value={searchquery}
              onChange={e => setsearchquery(e.target.value)}
              style={{
                width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                borderRadius: 8, border: `1px solid ${borderColor}`,
                background: inputBg, color: textPrimary, fontSize: 12, outline: 'none',
                transition: 'border-color 0.15s', fontWeight: 400,
              }}
              onFocus={e => (e.target.style.borderColor = '#800000')}
              onBlur={e => (e.target.style.borderColor = borderColor)}
            />
            <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: textMuted, pointerEvents: 'none' }}
              width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter tabs — FIX: replaced conflicting border+borderLeft with individual border properties */}
          <div style={{ display: 'flex', border: `1px solid ${borderColor}`, borderRadius: 8, overflow: 'hidden', background: cardBg }}>
            {([
              ['all',      'All',      services.length],
              ['active',   'Active',   activeCount],
              ['inactive', 'Inactive', inactiveCount],
            ] as const).map(([val, label, count], i) => (
              <button key={val} onClick={() => setfiltermode(val)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', fontSize: 11, fontWeight: 500,
                  // FIX: use borderLeftWidth/Style/Color instead of mixing border + borderLeft
                  borderTop: 'none',
                  borderBottom: 'none',
                  borderRight: 'none',
                  borderLeftWidth: i > 0 ? 1 : 0,
                  borderLeftStyle: 'solid',
                  borderLeftColor: borderColor,
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: filtermode === val ? '#800000' : 'transparent',
                  color: filtermode === val ? '#ffffff' : textMuted,
                }}
              >
                {label}
                <span style={{
                  fontSize: 9, padding: '1px 6px', borderRadius: 10, fontWeight: 500,
                  background: filtermode === val ? 'rgba(255,255,255,0.22)' : isdarkmode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                  color: filtermode === val ? '#fff' : textMuted,
                }}>{count}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <span style={{ width: 1, height: 24, background: borderColor }} />

          {/* Sort label + dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: textMuted, fontWeight: 400 }}>Sort by</span>
            <select
              value={sortmode}
              onChange={e => setsortmode(e.target.value as SortMode)}
              style={{
                fontSize: 11, padding: '7px 10px', borderRadius: 8,
                border: `1px solid ${borderColor}`, background: inputBg,
                color: textPrimary, outline: 'none', cursor: 'pointer', fontWeight: 400,
              }}
            >
              <option value="alpha-asc">Name A → Z</option>
              <option value="alpha-desc">Name Z → A</option>
              <option value="date-newest">Newest First</option>
              <option value="date-oldest">Oldest First</option>
            </select>
          </div>

          {/* Push right */}
          <div style={{ flex: 1 }} />

          {/* Count */}
          <span style={{ fontSize: 11, color: textMuted, fontWeight: 400 }}>
            Showing <strong style={{ color: textSecondary, fontWeight: 500 }}>{filtered.length}</strong> of <strong style={{ color: textSecondary, fontWeight: 500 }}>{services.length}</strong>
          </span>

          {/* Divider */}
          <span style={{ width: 1, height: 24, background: borderColor }} />

          {/* View toggle — FIX: same borderLeft conflict resolved */}
          <div style={{ display: 'flex', border: `1px solid ${borderColor}`, borderRadius: 8, overflow: 'hidden', background: cardBg }}>
            {([
              ['grid', 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'],
              ['list', 'M4 6h16M4 12h16M4 18h16'],
            ] as const).map(([mode, d], i) => (
              <button key={mode} onClick={() => setviewmode(mode)}
                title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
                style={{
                  padding: '7px 10px',
                  // FIX: use borderLeftWidth/Style/Color instead of mixing border + borderLeft
                  borderTop: 'none',
                  borderBottom: 'none',
                  borderRight: 'none',
                  borderLeftWidth: i > 0 ? 1 : 0,
                  borderLeftStyle: 'solid',
                  borderLeftColor: borderColor,
                  background: viewmode === mode ? '#800000' : 'transparent',
                  color: viewmode === mode ? '#fff' : textMuted,
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* ── EMPTY STATE ─────────────────────────────────────────────────── */}
        {filtered.length === 0 && (
          <div style={{ ...cardStyle, padding: '64px 32px', textAlign: 'center' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: isdarkmode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', color: textMuted,
            }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: textPrimary, margin: '0 0 6px' }}>No services found</h3>
            <p style={{ fontSize: 12, color: textMuted, margin: 0, fontWeight: 400 }}>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* ── GRID VIEW ───────────────────────────────────────────────────── */}
        {filtered.length > 0 && viewmode === 'grid' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {filtered.map(service => (
              <div
                key={service._id}
                className="svc-card"
                style={{
                  background: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 16,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: isdarkmode ? '0 1px 4px rgba(0,0,0,0.35)' : '0 1px 4px rgba(0,0,0,0.06)',
                  position: 'relative',
                }}
              >
                {/* Card Content Container */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                  
                  {/* Top Section: Icon + Badge + Edit */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={iconBoxStyle(service.isActive)}>
                      {serviceIcons[service.serviceId] || defaultIcon}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                       {/* Badge */}
                       <span style={{
                        fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em',
                        padding: '3px 8px', borderRadius: 6,
                        background: isdarkmode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                        color: textMuted,
                      }}>
                        {service.badge}
                      </span>
                      
                      {/* Edit Button */}
                      <button
                        className="edit-btn"
                        onClick={(e) => openEditModal(e, service)}
                        style={{
                          padding: '6px', borderRadius: 8, border: 'none',
                          background: isdarkmode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                          color: textMuted, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', transition: 'background 0.2s',
                        }}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Middle Section: Title + Desc */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 500, color: textPrimary, margin: '0 0 8px', lineHeight: 1.35 }}>
                      {service.name}
                    </h3>
                    <p style={{
                      fontSize: 12, color: textMuted, lineHeight: 1.6, margin: 0, fontWeight: 400,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {service.description}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div style={{ marginTop: 4 }}>
                    <span style={statusBadgeStyle(service.isActive)}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: service.isActive ? '#00bc7d' : '#f1a10d', flexShrink: 0 }} />
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Card footer */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 20px',
                  borderTop: `1px solid ${borderColor}`,
                  background: subtleBg,
                }}>
                  <span style={{ fontSize: 10, color: textMuted, fontFamily: 'monospace', fontWeight: 400 }}>
                    {service.serviceId}
                  </span>
                  <button
                    className="toggle-btn"
                    onClick={(e) => togglestatus(e, service.serviceId)}
                    style={toggleStyle(service.isActive)}
                  >
                    <span style={thumbStyle(service.isActive)} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LIST VIEW ───────────────────────────────────────────────────── */}
        {filtered.length > 0 && viewmode === 'list' && (
          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 3fr 130px 90px',
              gap: 16, padding: '10px 20px',
              borderBottom: `1px solid ${borderColor}`,
              background: subtleBg,
              fontSize: 10, fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: textMuted,
            }}>
              <span>Service</span>
              <span>Category</span>
              <span>Description</span>
              <span>Status</span>
              <span style={{ textAlign: 'right' }}>Actions</span>
            </div>

            {/* Rows */}
            {filtered.map((service, idx) => (
              <div
                key={service._id}
                className="svc-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 3fr 130px 90px',
                  gap: 16,
                  alignItems: 'center',
                  padding: '14px 20px',
                  borderBottom: idx !== filtered.length - 1 ? `1px solid ${borderColor}` : 'none',
                  transition: 'background 0.15s',
                  position: 'relative',
                }}
              >
                {/* Service name + icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div style={{...iconBoxStyle(service.isActive), width: 36, height: 36, borderRadius: 10}}>
                    {serviceIcons[service.serviceId] || defaultIcon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {service.name}
                    </p>
                    <p style={{ fontSize: 10, color: textMuted, margin: '2px 0 0', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 400 }}>
                      {service.serviceId}
                    </p>
                  </div>
                </div>

                {/* Badge */}
                <span style={{
                  fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em',
                  padding: '3px 8px', borderRadius: 4,
                  background: isdarkmode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                  color: textMuted, alignSelf: 'center', width: 'fit-content',
                }}>
                  {service.badge}
                </span>

                {/* Description */}
                <p style={{ fontSize: 12, color: textMuted, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 400 }}>
                  {service.description}
                </p>

                {/* Status badge */}
                <span style={statusBadgeStyle(service.isActive)}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: service.isActive ? '#00bc7d' : '#f1a10d', flexShrink: 0 }} />
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                  <button
                    className="edit-btn"
                    onClick={e => openEditModal(e, service)}
                    style={{
                      padding: '5px 7px', borderRadius: 6, border: 'none',
                      background: isdarkmode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                      color: textMuted, cursor: 'pointer',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    className="toggle-btn"
                    onClick={e => togglestatus(e, service.serviceId)}
                    style={toggleStyle(service.isActive)}
                  >
                    <span style={thumbStyle(service.isActive)} />
                  </button>
                </div>
              </div>
            ))}

            {/* Table footer */}
            <div style={{
              padding: '10px 20px',
              borderTop: `1px solid ${borderColor}`,
              background: subtleBg,
              fontSize: 10, color: textMuted, fontWeight: 400,
            }}>
              {filtered.length} service{filtered.length !== 1 ? 's' : ''} displayed
              {filtermode !== 'all' && ` · filtered by "${filtermode}"`}
              {searchquery && ` · matching "${searchquery}"`}
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchServices}
        isdarkmode={isdarkmode}
      />
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