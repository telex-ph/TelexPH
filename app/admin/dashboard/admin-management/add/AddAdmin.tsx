'use client'

import React, { useState, useRef } from 'react'
import { useDarkMode } from '../../layout'

export default function AddAdmin() {
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
  const [firstName, setFirstName]             = useState('')
  const [lastName, setLastName]               = useState('')
  const [email, setEmail]                     = useState('')
  const [contactNumber, setContactNumber]     = useState('')
  const [department, setDepartment]           = useState<number | ''>('')
  const [role, setRole]                       = useState<number | ''>('')
  const [password, setPassword]               = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedImage, setSelectedImage]     = useState<string | null>(null)

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

  // ── Shared inp() helper — matches ActivityLogs exactly ───────────────────
  const inp = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    padding: '10px 14px',
    borderRadius: 12,
    border: `1.5px solid ${borderColor}`,
    background: inputBg,
    color: textPrimary,
    fontSize: 12,
    fontWeight: 400,
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: 0,
    transition: 'border-color .15s',
    ...extra,
  })

  // ── File handling ─────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.')
      setShowErrorModal(true)
      if (fileRef.current) fileRef.current.value = ''
      return
    }
    actualFileRef.current = file
    setIsCompressing(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      const img = new Image()
      img.src = reader.result as string
      img.onload = () => {
        const canvas  = document.createElement('canvas')
        const ctx     = canvas.getContext('2d')
        const maxWidth = 800
        let width  = img.width
        let height = img.height
        if (width > maxWidth) { height = (maxWidth / width) * height; width = maxWidth }
        canvas.width  = width
        canvas.height = height
        if (ctx) {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          setSelectedImage(canvas.toDataURL('image/jpeg', 0.7))
          setIsCompressing(false)
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const triggerBrowse = () => fileRef.current?.click()

  const isFormValid = () =>
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.trim() !== '' &&
    contactNumber.trim() !== '' &&
    department !== '' &&
    role !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    password === confirmPassword

  const handleFinalConfirm = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match')
      setShowConfirmModal(false)
      setShowErrorModal(true)
      return
    }
    setIsSubmitting(true)
    try {
      const payload: any = {
        firstName:     firstName.trim(),
        lastName:      lastName.trim(),
        email:         email.trim(),
        contactNumber: contactNumber.trim(),
        department:    Number(department),
        role:          Number(role),
        password,
      }
      if (selectedImage) payload.profilePicture = selectedImage

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://telexph-admin.onrender.com/api'
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create admin')
      }
      setShowConfirmModal(false)
      setShowSuccessModal(true)
      setFirstName(''); setLastName(''); setEmail(''); setContactNumber('')
      setDepartment(''); setRole(''); setPassword(''); setConfirmPassword('')
      setSelectedImage(null); actualFileRef.current = null
      if (fileRef.current) fileRef.current.value = ''
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to create admin. Please try again.')
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
        .aa-pill:hover  { opacity: .78; }
        .aa-row:hover   { background: ${isdarkmode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'} !important; }
        .upload-zone:hover { border-color: #800000 !important; background: rgba(128,0,0,0.03) !important; }
        @keyframes spin { to { transform: rotate(360deg) } }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>

      <div style={{ minHeight: '100vh', background: pageBg, padding: '32px', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── Page header — same style as ActivityLogs ── */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
              Add New Administrator
            </h2>
            <p style={{ fontSize: 12, color: textMuted, margin: '4px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
              Create a new administrator account and assign their role and department.
            </p>
          </div>

          {/* ── Two-column layout ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'start' }}>

            {/* ══ LEFT: Profile Picture card ══ */}
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: 'hidden', boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>
              {/* Card header row — same pattern as ActivityLogs table card */}
              <div style={{ padding: '18px 24px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Profile Picture</p>
                  <p style={{ fontSize: 11, color: textMuted, margin: '3px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Optional — JPG, PNG, WEBP</p>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} style={{ display: 'none' }} />

                {selectedImage ? (
                  <div>
                    <img src={selectedImage} alt="Preview" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 14, marginBottom: 14, display: 'block' }} />
                    <button
                      onClick={() => { setSelectedImage(null); actualFileRef.current = null; if (fileRef.current) fileRef.current.value = '' }}
                      style={{ width: '100%', padding: '9px', borderRadius: 10, border: `1.5px solid ${isdarkmode ? 'rgba(220,38,38,0.3)' : 'rgba(220,38,38,0.22)'}`, background: isdarkmode ? 'rgba(220,38,38,0.08)' : 'rgba(220,38,38,0.04)', color: '#dc2626', fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", letterSpacing: 0, transition: 'all .15s' }}
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div
                    className="upload-zone"
                    onClick={triggerBrowse}
                    style={{ border: `2px dashed ${isdarkmode ? 'rgba(255,255,255,0.12)' : '#d1d5db'}`, borderRadius: 14, padding: '44px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s' }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: isdarkmode ? 'rgba(255,255,255,0.06)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                      <svg width="22" height="22" fill="none" stroke={textMuted} strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: '0 0 4px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Click to upload</p>
                    <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>JPG, JPEG, PNG or WEBP</p>
                  </div>
                )}

                {isCompressing && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '9px 14px', borderRadius: 10, background: subtleBg }}>
                    <svg width="13" height="13" fill="none" stroke={textMuted} strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: 'spin .8s linear infinite', flexShrink: 0 }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Compressing image...</p>
                  </div>
                )}
              </div>
            </div>

            {/* ══ RIGHT: Form cards (stacked) ══ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* ── CARD 1: Personal Information ── */}
              <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: 'hidden', boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>
                {/* Card header */}
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Personal Information</p>
                    <p style={{ fontSize: 11, color: textMuted, margin: '3px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Name, email, and contact details</p>
                  </div>
                </div>

                {/* Column headers — same as ActivityLogs table header row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
                  <div style={{ padding: '10px 24px', borderRight: `1px solid ${borderColor}` }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>First Name</span>
                  </div>
                  <div style={{ padding: '10px 24px' }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Last Name</span>
                  </div>
                </div>

                {/* Row: First name + Last name */}
                <div className="aa-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderBottom: `1px solid ${borderColor}`, transition: 'background .15s' }}>
                  <div style={{ padding: '16px 24px', borderRight: `1px solid ${borderColor}` }}>
                    <input
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      type="text"
                      placeholder="Enter first name..."
                      style={inp({ width: '100%' })}
                    />
                  </div>
                  <div style={{ padding: '16px 24px' }}>
                    <input
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      type="text"
                      placeholder="Enter last name..."
                      style={inp({ width: '100%' })}
                    />
                  </div>
                </div>

                {/* Column header: Email */}
                <div style={{ padding: '10px 24px', background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
                  <span style={{ fontSize: 10, fontWeight: 500, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Email Address</span>
                </div>

                {/* Row: Email */}
                <div className="aa-row" style={{ padding: '16px 24px', borderBottom: `1px solid ${borderColor}`, transition: 'background .15s' }}>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter email address..."
                    style={inp({ width: '100%' })}
                  />
                </div>

                {/* Column header: Contact */}
                <div style={{ padding: '10px 24px', background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
                  <span style={{ fontSize: 10, fontWeight: 500, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Contact Number</span>
                </div>

                {/* Row: Contact */}
                <div className="aa-row" style={{ padding: '16px 24px', transition: 'background .15s' }}>
                  <input
                    value={contactNumber}
                    onChange={e => setContactNumber(e.target.value)}
                    type="text"
                    placeholder="Enter contact number..."
                    style={inp({ width: '100%' })}
                  />
                </div>
              </div>

              {/* ── CARD 2: Role & Department ── */}
              <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: 'hidden', boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>
                {/* Card header */}
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Role & Department</p>
                    <p style={{ fontSize: 11, color: textMuted, margin: '3px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Assign access level and team</p>
                  </div>
                </div>

                {/* Department filter row — same style as ActivityLogs "Filter by Action" */}
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${borderColor}` }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: '0 0 10px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                    Select Department
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                    {departments.map(dept => {
                      const sel = department === dept.id
                      return (
                        <button
                          key={dept.id}
                          className="aa-pill"
                          onClick={() => setDepartment(dept.id)}
                          style={{
                            padding: '5px 14px', borderRadius: 8,
                            border: sel ? 'none' : `1px solid ${borderColor}`,
                            background: sel ? '#800000' : subtleBg,
                            color: sel ? '#fff' : textMuted,
                            fontSize: 11, fontWeight: sel ? 500 : 400,
                            cursor: 'pointer', transition: 'all .15s',
                            boxShadow: sel ? '0 2px 8px rgba(128,0,0,0.3)' : 'none',
                            fontFamily: "'Poppins', sans-serif", letterSpacing: 0,
                          }}
                        >
                          {dept.icon} {dept.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Role filter row — same style as ActivityLogs "Filter by Module" */}
                <div style={{ padding: '18px 24px' }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: '0 0 10px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                    Select Role
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                    {roles.map(r => {
                      const sel = role === r.id
                      return (
                        <button
                          key={r.id}
                          className="aa-pill"
                          onClick={() => setRole(r.id)}
                          style={{
                            padding: '5px 14px', borderRadius: 8,
                            border: sel ? 'none' : `1px solid ${borderColor}`,
                            background: sel ? '#800000' : subtleBg,
                            color: sel ? '#fff' : textMuted,
                            fontSize: 11, fontWeight: sel ? 500 : 400,
                            cursor: 'pointer', transition: 'all .15s',
                            boxShadow: sel ? '0 2px 8px rgba(128,0,0,0.3)' : 'none',
                            fontFamily: "'Poppins', sans-serif", letterSpacing: 0,
                          }}
                        >
                          {r.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* ── CARD 3: Security ── */}
              <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: 'hidden', boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>
                {/* Card header */}
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Security</p>
                    <p style={{ fontSize: 11, color: textMuted, margin: '3px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Set login credentials for this account</p>
                  </div>
                </div>

                {/* Column headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
                  <div style={{ padding: '10px 24px', borderRight: `1px solid ${borderColor}` }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Password</span>
                  </div>
                  <div style={{ padding: '10px 24px' }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Confirm Password</span>
                  </div>
                </div>

                {/* Password row */}
                <div className="aa-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderBottom: `1px solid ${borderColor}`, transition: 'background .15s' }}>
                  <div style={{ padding: '16px 24px', borderRight: `1px solid ${borderColor}` }}>
                    <input
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      type="password"
                      placeholder="Enter password..."
                      style={inp({ width: '100%' })}
                    />
                  </div>
                  <div style={{ padding: '16px 24px' }}>
                    <input
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      type="password"
                      placeholder="Confirm password..."
                      style={inp({ width: '100%' })}
                    />
                  </div>
                </div>

                {/* Password feedback row */}
                {password && confirmPassword && (
                  <div style={{ padding: '12px 24px' }}>
                    {password !== confirmPassword ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: 10, background: isdarkmode ? 'rgba(220,38,38,0.08)' : 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.18)' }}>
                        <svg width="12" height="12" fill="none" stroke="#dc2626" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        <p style={{ fontSize: 11, color: '#dc2626', margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Passwords do not match</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: 10, background: isdarkmode ? 'rgba(5,150,105,0.08)' : 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.18)' }}>
                        <svg width="12" height="12" fill="none" stroke="#059669" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        <p style={{ fontSize: 11, color: '#059669', margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Passwords match</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Submit footer — matches ActivityLogs pagination footer style ── */}
              <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: 'hidden', boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ padding: '14px 24px', background: subtleBg, borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                    Review your entry before finalizing.
                  </p>
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
                    {isSubmitting ? (
                      <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: 'spin .8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Creating...</>
                    ) : (
                      <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>Create Administrator</>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ══ Confirm Modal ══ */}
      {showConfirmModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 32, width: '100%', maxWidth: 500, boxShadow: '0 32px 80px rgba(0,0,0,0.32)', fontFamily: "'Poppins', sans-serif", overflow: 'hidden' }}>
            <div style={{ padding: '32px 36px' }}>

              {/* Modal header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Confirm Creation</h3>
                  <p style={{ fontSize: 12, color: textMuted, margin: '4px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Are you ready to create this administrator account?</p>
                </div>
                <button onClick={() => setShowConfirmModal(false)} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: subtleBg, color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Summary — same as ActivityLogs details modal info card */}
              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, marginBottom: 24, overflow: 'hidden' }}>
                {/* Summary table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', background: isdarkmode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)', borderBottom: `1px solid ${borderColor}` }}>
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
                  <div key={label} className="aa-row" style={{ display: 'grid', gridTemplateColumns: '120px 1fr', borderBottom: idx < arr.length - 1 ? `1px solid ${borderColor}` : 'none', transition: 'background .15s' }}>
                    <div style={{ padding: '12px 18px', borderRight: `1px solid ${borderColor}` }}>
                      <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{label}</p>
                    </div>
                    <div style={{ padding: '12px 18px' }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' as const, gap: 10, paddingTop: 0 }}>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  style={{ padding: '11px 28px', borderRadius: 14, border: `1px solid ${borderColor}`, background: subtleBg, color: textMuted, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", letterSpacing: 0, transition: 'all .15s' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalConfirm}
                  disabled={isSubmitting}
                  style={{ padding: '11px 32px', borderRadius: 14, border: 'none', background: '#800000', color: '#fff', fontSize: 12, fontWeight: 500, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.75 : 1, fontFamily: "'Poppins', sans-serif", letterSpacing: 0, transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 7 }}
                >
                  {isSubmitting ? (
                    <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: 'spin .8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Creating...</>
                  ) : 'Confirm & Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ Success Modal ══ */}
      {showSuccessModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 32, width: '100%', maxWidth: 440, boxShadow: '0 32px 80px rgba(0,0,0,0.32)', fontFamily: "'Poppins', sans-serif" }}>
            <div style={{ padding: '32px 36px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Account Created</h3>
                  <p style={{ fontSize: 12, color: textMuted, margin: '4px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Administrator account has been created successfully.</p>
                </div>
                <button onClick={() => setShowSuccessModal(false)} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: subtleBg, color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Green check info card */}
              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, padding: '24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: isdarkmode ? 'rgba(5,150,105,0.12)' : 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" fill="none" stroke="#059669" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: '0 0 3px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Success</p>
                  <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>The new admin can now log in with their credentials.</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' as const }}>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  style={{ padding: '11px 32px', borderRadius: 14, border: 'none', background: '#800000', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", letterSpacing: 0, transition: 'all .15s' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ Error Modal ══ */}
      {showErrorModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 32, width: '100%', maxWidth: 440, boxShadow: '0 32px 80px rgba(0,0,0,0.32)', fontFamily: "'Poppins', sans-serif" }}>
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

              {/* Error info card */}
              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, padding: '24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: isdarkmode ? 'rgba(220,38,38,0.12)' : 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" fill="none" stroke="#dc2626" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: '0 0 3px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Error</p>
                  <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0, lineHeight: 1.6 }}>{errorMessage || 'Something went wrong. Please try again.'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' as const }}>
                <button
                  onClick={() => setShowErrorModal(false)}
                  style={{ padding: '11px 32px', borderRadius: 14, border: 'none', background: '#800000', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", letterSpacing: 0, transition: 'all .15s' }}
                >
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