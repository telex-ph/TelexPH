'use client'
import { useState, useRef, useEffect } from 'react'

// ─── BREAKPOINT (same as dashboard) ──────────────────────────────────────────
function getBreakpoint(w: number): 'mobile' | 'tablet' | 'desktop' {
  return w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'
}

// ─── ICON (same pattern as dashboard) ────────────────────────────────────────
function Ico({ d, d2, size = 16, sw = 1.4 }: { d: string; d2?: string; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />{d2 && <path d={d2} />}
    </svg>
  )
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const CameraIco = () => <Ico d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" d2="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={14} />
const CheckIco  = () => <Ico d="M20 6L9 17l-5-5" size={14} />
const EyeIco    = () => <Ico d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" d2="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" size={14} />
const EyeOffIco = () => <Ico d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" d2="M1 1l22 22" size={14} />

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// ─── FIELD ────────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', half = false }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; half?: boolean
}) {
  const [show, setShow] = useState(false)
  const isPass = type === 'password'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: half ? '1 1 calc(50% - 6px)' : '1 1 100%', minWidth: half ? 130 : 'unset' }}>
      <label style={{ fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={isPass && !show ? 'password' : 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: '100%', padding: '9px 12px', paddingRight: isPass ? 38 : 12, fontSize: 13, border: '1.5px solid #e0dcdc', borderRadius: 9, outline: 'none', background: '#fafafa', color: '#1a1a2e', fontFamily: 'Poppins, sans-serif', fontWeight: 400, boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s' }}
          onFocus={e => { e.target.style.borderColor = '#800000'; e.target.style.background = '#fff' }}
          onBlur={e => { e.target.style.borderColor = '#e0dcdc'; e.target.style.background = '#fafafa' }}
        />
        {isPass && (
          <button onClick={() => setShow(!show)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex', padding: 0 }}>
            {show ? <EyeOffIco /> : <EyeIco />}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e0dcdc', padding: '20px 22px', marginBottom: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: '#555', fontWeight: 400, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  )
}

// ─── SAVE BUTTON ──────────────────────────────────────────────────────────────
function SaveBtn({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: saved ? '#15803d' : 'linear-gradient(135deg,#800000,#a82020)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'background 0.3s', fontFamily: 'Poppins, sans-serif', letterSpacing: '0.02em' }}
    >
      {saved ? <><CheckIco /> Saved!</> : 'Save Changes'}
    </button>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AccountSettings() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [bp, setBp] = useState<'mobile' | 'tablet' | 'desktop' | null>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    setBp(getBreakpoint(el.getBoundingClientRect().width))
    const obs = new ResizeObserver(entries => setBp(getBreakpoint(entries[0].contentRect.width)))
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const isMobile = bp === 'mobile'

  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // profile state — populated from API on mount
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')
  const [avatar,    setAvatar]    = useState<string | null>(null)

  // security state
  const [currentPw, setCurrentPw] = useState('')
  const [newPw,     setNewPw]     = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  // ─── Fetch client profile from backend on mount ─────────────────────────
  // Uses the httpOnly JWT cookie automatically — no localStorage needed.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/client/me`, {
          method: 'GET',
          credentials: 'include', // sends the httpOnly accessToken cookie
        })
        if (res.ok) {
          const data = await res.json()
          if (data.firstName)     setFirstName(data.firstName)
          if (data.lastName)      setLastName(data.lastName)
          if (data.email)         setEmail(data.email)
          if (data.contactNumber) setPhone(data.contactNumber)
          if (data.profilePicture) setAvatar(data.profilePicture)
        }
      } catch (err) {
        console.error('Failed to fetch client profile:', err)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result as string)
    reader.readAsDataURL(file)
  }

  const outerPad = isMobile ? '12px' : '24px'

  // Derived display values for the profile photo card
  const avatarLetter = firstName ? firstName.charAt(0).toUpperCase() : '?'
  const displayName  = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Loading...'
  const displayEmail = email || ''

  return (
    <div ref={rootRef} style={{ fontFamily: "'Poppins',sans-serif", padding: outerPad, background: '#fdfcfc', minHeight: '100vh', visibility: bp === null ? 'hidden' : 'visible' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; font-family: 'Poppins', sans-serif; }
      `}</style>

      {/* ── Page Header — matches dashboard header pattern ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: isMobile ? 14 : 22, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <p style={{ fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Manage your account,</p>
          <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Account Settings</h1>
          {!isMobile && <p style={{ fontSize: 13, color: '#555', fontWeight: 400, margin: '3px 0 0' }}>Update your profile and security preferences.</p>}
        </div>
        <SaveBtn onClick={handleSave} saved={saved} />
      </div>

      {/* ══ PROFILE PHOTO ════════════════════════════════════════════════════ */}
      <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 16, padding: '20px 22px', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Profile Photo</div>
        <div style={{ fontSize: 11, color: '#555', fontWeight: 400, marginBottom: 16 }}>Click the camera icon to change your avatar</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 76, height: 76, borderRadius: '50%', background: '#800000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, overflow: 'hidden', border: '3px solid #f0eeee' }}>
              {avatar ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : avatarLetter}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: '#800000', border: '2.5px solid #fff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            ><CameraIco /></button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>{displayName}</div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 3, fontWeight: 400 }}>{displayEmail}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 7, fontSize: 11, fontWeight: 600, color: '#15803d', background: '#dcfce7', borderRadius: 6, padding: '3px 10px' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#16a34a' }} />Active Account
            </div>
          </div>
        </div>
      </div>

      {/* ══ PERSONAL INFORMATION ═════════════════════════════════════════════ */}
      <Card title="Personal Information" subtitle="Update your name, email and contact details">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Field label="First Name"    value={firstName} onChange={setFirstName} half />
          <Field label="Last Name"     value={lastName}  onChange={setLastName}  half />
          <Field label="Email Address" value={email}     onChange={setEmail} />
          <Field label="Phone Number"  value={phone}     onChange={setPhone} />
        </div>
      </Card>

      {/* ══ CHANGE PASSWORD ══════════════════════════════════════════════════ */}
      <Card title="Change Password" subtitle="Choose a strong password to keep your account safe">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Current Password" value={currentPw} onChange={setCurrentPw} type="password" />
          <Field label="New Password"     value={newPw}     onChange={setNewPw}     type="password" />
          <Field label="Confirm Password" value={confirmPw} onChange={setConfirmPw} type="password" />
        </div>
        {newPw && confirmPw && newPw !== confirmPw && (
          <div style={{ marginTop: 10, fontSize: 11, color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Ico d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" size={12} sw={2} /> Passwords do not match.
          </div>
        )}
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}><SaveBtn onClick={handleSave} saved={saved} /></div>
    </div>
  )
}