'use client'

import React, { useState, useRef } from 'react'
import { useDarkMode } from '../../layout'

interface EditAdminProps {
  admin: any
  onClose: () => void
  onSave: () => void
}

export default function EditAdmin({ admin, onClose, onSave }: EditAdminProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal]     = useState(false)
  const [errorMessage, setErrorMessage]         = useState('')
  const [isCompressing, setIsCompressing]       = useState(false)
  const [isSubmitting, setIsSubmitting]         = useState(false)
  const fileRef       = useRef<HTMLInputElement>(null)
  const actualFileRef = useRef<File | null>(null)

  const { isdarkmode } = useDarkMode()

  // ── Theme tokens (identical to ActivityLogs) ─────────────────────────────
  const pageBg      = isdarkmode ? '#0f0f0f'                : '#f8f9fa'
  const cardBg      = isdarkmode ? '#1a1a1a'                : '#ffffff'
  const subtleBg    = isdarkmode ? '#202020'                : '#f9fafb'
  const borderColor = isdarkmode ? 'rgba(255,255,255,0.08)' : '#e5e7eb'
  const textPrimary = isdarkmode ? '#f0f0f0'                : '#1f2937'
  const textMuted   = isdarkmode ? '#6b7280'                : '#6b7280'
  const inputBg     = isdarkmode ? '#202020'                : '#f9fafb'

  // ── Form state ────────────────────────────────────────────────────────────
  const [firstName, setFirstName]         = useState(admin.firstName || '')
  const [lastName, setLastName]           = useState(admin.lastName || '')
  const [email, setEmail]                 = useState(admin.email || '')
  const [contactNumber, setContactNumber] = useState(admin.contactNumber || '')
  const [department, setDepartment]       = useState<number | ''>(admin.department || '')
  const [role, setRole]                   = useState<number | ''>(admin.role || '')
  const [selectedImage, setSelectedImage] = useState<string | null>(admin.profilePicture || null)
  const [removeImage, setRemoveImage]     = useState(false)

  const departments = [
    { id: 1, name: 'Compliance',      icon: '⚖️' },
    { id: 2, name: 'Innovation',      icon: '💡' },
    { id: 3, name: 'Marketing',       icon: '📢' },
    { id: 4, name: 'Recruitment',     icon: '👥' },
    { id: 5, name: 'Human Resources', icon: '🤝' },
  ]
  const roles = [
    { id: 1, name: 'Main Administrator' },
    { id: 2, name: 'Administrator' },
  ]

  // ── Shared inp() — identical to ActivityLogs ──────────────────────────────
  const inp = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${borderColor}`,
    background: inputBg, color: textPrimary, fontSize: 12, fontWeight: 400,
    outline: 'none', fontFamily: "'Poppins', sans-serif", letterSpacing: 0,
    transition: 'border-color .15s', width: '100%', ...extra,
  })

  // ── Pill button style (identical to ActivityLogs filter pills) ────────────
  const pillStyle = (active: boolean): React.CSSProperties => ({
    padding: '5px 14px', borderRadius: 8,
    border: active ? 'none' : `1px solid ${borderColor}`,
    background: active ? '#800000' : subtleBg,
    color: active ? '#fff' : textMuted,
    fontSize: 11, fontWeight: active ? 500 : 400,
    cursor: 'pointer', transition: 'all .15s',
    boxShadow: active ? '0 2px 8px rgba(128,0,0,0.3)' : 'none',
    fontFamily: "'Poppins', sans-serif", letterSpacing: 0,
  })

  // ── File handling ─────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    actualFileRef.current = file
    setRemoveImage(false)
    setIsCompressing(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      const img = new Image()
      img.src = reader.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx    = canvas.getContext('2d')
        const maxW   = 800
        let w = img.width, h = img.height
        if (w > maxW) { h = (maxW / w) * h; w = maxW }
        canvas.width = w; canvas.height = h
        if (ctx) {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, w, h)
          ctx.drawImage(img, 0, 0, w, h)
          setSelectedImage(canvas.toDataURL('image/jpeg', 0.7))
          setIsCompressing(false)
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const triggerBrowse = () => fileRef.current?.click()

  const isFormValid = () =>
    firstName.trim() !== '' && lastName.trim() !== '' &&
    email.trim() !== '' && contactNumber.trim() !== '' &&
    department !== '' && role !== ''

  const handleFinalConfirm = async () => {
    setIsSubmitting(true)
    try {
      const payload: any = {
        firstName: firstName.trim(), lastName: lastName.trim(),
        email: email.trim(), contactNumber: contactNumber.trim(),
        department: Number(department), role: Number(role),
      }
      if (selectedImage && selectedImage !== admin.profilePicture) payload.profilePicture = selectedImage
      else if (removeImage) payload.profilePicture = ''

      const API_BASE_URL = 'https://telexph-admin.onrender.com/api'
      const response = await fetch(`${API_BASE_URL}/users/${admin._id}`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to update admin')
      }
      setShowConfirmModal(false)
      setShowSuccessModal(true)
      setTimeout(() => { setShowSuccessModal(false); onSave() }, 1500)
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update admin. Please try again.')
      setShowConfirmModal(false)
      setShowErrorModal(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* ── Global styles — identical to ActivityLogs ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { font-family: 'Poppins', sans-serif !important; letter-spacing: 0 !important; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        input, textarea, select, option, button { font-family: 'Poppins', sans-serif !important; letter-spacing: 0 !important; }
        input:focus, textarea:focus, select:focus { border-color: #800000 !important; outline: none !important; box-shadow: none !important; }
        .ea-row:hover  { background: ${isdarkmode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'} !important; }
        .ea-pill:hover { opacity: .78; }
        .upload-zone:hover { border-color: #800000 !important; background: rgba(128,0,0,0.03) !important; }
        @keyframes spin { to { transform: rotate(360deg) } }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>

      <div style={{ minHeight: '100vh', background: pageBg, padding: '32px', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── Page header ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                Edit Administrator
              </h2>
              <p style={{ fontSize: 12, color: textMuted, margin: '4px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                Update information for <strong style={{ color: textPrimary, fontWeight: 600 }}>{admin.firstName} {admin.lastName}</strong>
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 16px', borderRadius: 10, border: `1px solid ${borderColor}`, background: subtleBg, color: textMuted, fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", letterSpacing: 0, transition: 'all .15s' }}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Close
            </button>
          </div>

          {/* ── Two-column layout ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, alignItems: 'start' }}>

            {/* ══ LEFT: Profile Picture ══ */}
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: 'hidden', boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>
              {/* Card header */}
              <div style={{ padding: '18px 24px', borderBottom: `1px solid ${borderColor}` }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Profile Picture</p>
                <p style={{ fontSize: 11, color: textMuted, margin: '3px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Optional — JPG, PNG, WEBP</p>
              </div>

              <div style={{ padding: '20px' }}>
                <input ref={fileRef} type="file" accept="image/jpg,image/jpeg,image/png,image/webp" onChange={handleFileChange} style={{ display: 'none' }} />

                {selectedImage && !removeImage ? (
                  <>
                    <img src={selectedImage} alt="Preview" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 14, display: 'block', marginBottom: 12 }} />
                    <button
                      onClick={triggerBrowse}
                      style={{ width: '100%', padding: '9px', borderRadius: 10, border: `1.5px solid ${borderColor}`, background: subtleBg, color: textMuted, fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", letterSpacing: 0, marginBottom: 8, transition: 'all .15s' }}
                    >
                      Change Image
                    </button>
                    <button
                      onClick={() => { setSelectedImage(null); setRemoveImage(true); actualFileRef.current = null; if (fileRef.current) fileRef.current.value = '' }}
                      style={{ width: '100%', padding: '9px', borderRadius: 10, border: `1.5px solid ${isdarkmode ? 'rgba(220,38,38,0.3)' : 'rgba(220,38,38,0.2)'}`, background: isdarkmode ? 'rgba(220,38,38,0.08)' : 'rgba(220,38,38,0.04)', color: '#dc2626', fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", letterSpacing: 0, transition: 'all .15s' }}
                    >
                      Remove Image
                    </button>
                  </>
                ) : (
                  <div
                    className="upload-zone"
                    onClick={triggerBrowse}
                    style={{ border: `2px dashed ${isdarkmode ? 'rgba(255,255,255,0.12)' : '#d1d5db'}`, borderRadius: 14, padding: '40px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s' }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: isdarkmode ? 'rgba(255,255,255,0.06)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <svg width="22" height="22" fill="none" stroke={textMuted} strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: '0 0 4px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Click to upload</p>
                    <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>PNG, JPG or JPEG</p>
                  </div>
                )}

                {isCompressing && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '9px 14px', borderRadius: 10, background: subtleBg }}>
                    <svg width="13" height="13" fill="none" stroke={textMuted} strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: 'spin .8s linear infinite', flexShrink: 0 }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Compressing...</p>
                  </div>
                )}
              </div>
            </div>

            {/* ══ RIGHT: Form cards ══ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* ── CARD 1: Personal Information ── */}
              <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: 'hidden', boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${borderColor}` }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Personal Information</p>
                  <p style={{ fontSize: 11, color: textMuted, margin: '3px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Name, email, and contact details</p>
                </div>

                {/* Col headers: First / Last */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
                  <div style={{ padding: '10px 24px', borderRight: `1px solid ${borderColor}` }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>First Name</span>
                  </div>
                  <div style={{ padding: '10px 24px' }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Last Name</span>
                  </div>
                </div>
                {/* Row: names */}
                <div className="ea-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${borderColor}`, transition: 'background .15s' }}>
                  <div style={{ padding: '14px 24px', borderRight: `1px solid ${borderColor}` }}>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder="Enter first name..." style={inp()} />
                  </div>
                  <div style={{ padding: '14px 24px' }}>
                    <input value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder="Enter last name..." style={inp()} />
                  </div>
                </div>

                {/* Col header: Email */}
                <div style={{ padding: '10px 24px', background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
                  <span style={{ fontSize: 10, fontWeight: 500, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Email Address</span>
                </div>
                <div className="ea-row" style={{ padding: '14px 24px', borderBottom: `1px solid ${borderColor}`, transition: 'background .15s' }}>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter email address..." style={inp()} />
                </div>

                {/* Col header: Contact */}
                <div style={{ padding: '10px 24px', background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
                  <span style={{ fontSize: 10, fontWeight: 500, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Contact Number</span>
                </div>
                <div className="ea-row" style={{ padding: '14px 24px', transition: 'background .15s' }}>
                  <input value={contactNumber} onChange={e => setContactNumber(e.target.value)} type="text" placeholder="Enter contact number..." style={inp()} />
                </div>
              </div>

              {/* ── CARD 2: Role & Department ── */}
              <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: 'hidden', boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${borderColor}` }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Role & Department</p>
                  <p style={{ fontSize: 11, color: textMuted, margin: '3px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Assign access level and team</p>
                </div>

                {/* Department pills — same as ActivityLogs "Filter by Action" */}
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${borderColor}` }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: '0 0 10px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Select Department</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                    {departments.map(dept => (
                      <button key={dept.id} className="ea-pill" onClick={() => setDepartment(dept.id)} style={pillStyle(department === dept.id)}>
                        {dept.icon} {dept.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role pills */}
                <div style={{ padding: '18px 24px' }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: '0 0 10px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Select Role</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                    {roles.map(r => (
                      <button key={r.id} className="ea-pill" onClick={() => setRole(r.id)} style={pillStyle(role === r.id)}>
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Submit footer — same as ActivityLogs pagination footer ── */}
              <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: 'hidden', boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ padding: '14px 24px', background: subtleBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                    Review your changes before saving.
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={onClose}
                      style={{ padding: '7px 16px', borderRadius: 10, border: `1px solid ${borderColor}`, background: 'transparent', color: textMuted, fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", letterSpacing: 0, transition: 'all .15s' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      disabled={!isFormValid() || isSubmitting}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '7px 20px', borderRadius: 10,
                        border: isFormValid() && !isSubmitting ? 'none' : `1px solid ${borderColor}`,
                        background: isFormValid() && !isSubmitting ? '#800000' : (isdarkmode ? 'rgba(255,255,255,0.06)' : '#f9fafb'),
                        color: isFormValid() && !isSubmitting ? '#fff' : textMuted,
                        fontSize: 11, fontWeight: 500,
                        cursor: isFormValid() && !isSubmitting ? 'pointer' : 'not-allowed',
                        boxShadow: isFormValid() && !isSubmitting ? '0 2px 8px rgba(128,0,0,0.3)' : 'none',
                        transition: 'all .15s', fontFamily: "'Poppins', sans-serif", letterSpacing: 0,
                      }}
                    >
                      {isSubmitting
                        ? <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: 'spin .8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Updating...</>
                        : <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Update Administrator</>
                      }
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ══ Confirm Modal ══ */}
      {showConfirmModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 32, width: '100%', maxWidth: 500, boxShadow: '0 32px 80px rgba(0,0,0,0.32)', overflow: 'hidden' }}>
            <div style={{ padding: '32px 36px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Confirm Update</h3>
                  <p style={{ fontSize: 12, color: textMuted, margin: '4px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Review the changes below before confirming.</p>
                </div>
                <button onClick={() => setShowConfirmModal(false)} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: subtleBg, color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Summary table — same row/col pattern as ActivityLogs */}
              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, marginBottom: 24, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', background: isdarkmode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)', borderBottom: `1px solid ${borderColor}` }}>
                  <div style={{ padding: '10px 18px', borderRight: `1px solid ${borderColor}` }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Field</span>
                  </div>
                  <div style={{ padding: '10px 18px' }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Value</span>
                  </div>
                </div>
                {[
                  { label: 'Name',       val: `${firstName} ${lastName}` },
                  { label: 'Email',      val: email },
                  { label: 'Contact',    val: contactNumber },
                  { label: 'Department', val: departments.find(d => d.id === department)?.name || '—' },
                  { label: 'Role',       val: roles.find(r => r.id === role)?.name || '—' },
                ].map(({ label, val }, idx, arr) => (
                  <div key={label} className="ea-row" style={{ display: 'grid', gridTemplateColumns: '110px 1fr', borderBottom: idx < arr.length - 1 ? `1px solid ${borderColor}` : 'none', transition: 'background .15s' }}>
                    <div style={{ padding: '11px 18px', borderRight: `1px solid ${borderColor}` }}>
                      <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{label}</p>
                    </div>
                    <div style={{ padding: '11px 18px' }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{val}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' as const, gap: 10 }}>
                <button onClick={() => setShowConfirmModal(false)} disabled={isSubmitting} style={{ padding: '11px 28px', borderRadius: 14, border: `1px solid ${borderColor}`, background: subtleBg, color: textMuted, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", letterSpacing: 0, transition: 'all .15s' }}>
                  Cancel
                </button>
                <button onClick={handleFinalConfirm} disabled={isSubmitting} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 32px', borderRadius: 14, border: 'none', background: '#800000', color: '#fff', fontSize: 12, fontWeight: 500, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.75 : 1, fontFamily: "'Poppins', sans-serif", letterSpacing: 0, transition: 'all .15s' }}>
                  {isSubmitting
                    ? <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: 'spin .8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Updating...</>
                    : 'Confirm & Update'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ Success Modal ══ */}
      {showSuccessModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 32, width: '100%', maxWidth: 420, boxShadow: '0 32px 80px rgba(0,0,0,0.32)' }}>
            <div style={{ padding: '32px 36px' }}>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Update Successful</h3>
                <p style={{ fontSize: 12, color: textMuted, margin: '4px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Administrator information has been updated.</p>
              </div>
              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: isdarkmode ? 'rgba(5,150,105,0.12)' : 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" fill="none" stroke="#059669" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: '0 0 3px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Changes saved</p>
                  <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Closing automatically...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ Error Modal ══ */}
      {showErrorModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 32, width: '100%', maxWidth: 420, boxShadow: '0 32px 80px rgba(0,0,0,0.32)' }}>
            <div style={{ padding: '32px 36px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Something Went Wrong</h3>
                  <p style={{ fontSize: 12, color: textMuted, margin: '4px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Please review the error and try again.</p>
                </div>
                <button onClick={() => setShowErrorModal(false)} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: subtleBg, color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, padding: '20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: isdarkmode ? 'rgba(220,38,38,0.12)' : 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" fill="none" stroke="#dc2626" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: '0 0 3px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Error</p>
                  <p style={{ fontSize: 11, color: textMuted, margin: 0, lineHeight: 1.6, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{errorMessage || 'Something went wrong. Please try again.'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' as const }}>
                <button onClick={() => setShowErrorModal(false)} style={{ padding: '11px 32px', borderRadius: 14, border: 'none', background: '#800000', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", letterSpacing: 0, transition: 'all .15s' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}