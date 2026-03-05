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

// ─── TAB ICONS ────────────────────────────────────────────────────────────────
const UserIco   = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" d2="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={14} />
const LockIco   = () => <Ico d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z" d2="M7 11V7a5 5 0 0 1 10 0v4" size={14} />
const BellIco   = () => <Ico d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" size={14} />
const ShieldIco = () => <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={14} />
const CameraIco = () => <Ico d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" d2="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={14} />
const CheckIco  = () => <Ico d="M20 6L9 17l-5-5" size={14} />
const EyeIco    = () => <Ico d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" d2="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" size={14} />
const EyeOffIco = () => <Ico d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" d2="M1 1l22 22" size={14} />

type Tab = 'profile' | 'security' | 'notifications' | 'privacy'

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

// ─── TOGGLE ROW ───────────────────────────────────────────────────────────────
function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #f0eeee' }}>
      <div>
        <div style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#555', marginTop: 2, fontWeight: 400 }}>{desc}</div>
      </div>
      <div
        onClick={() => onChange(!checked)}
        style={{ width: 38, height: 22, borderRadius: 11, background: checked ? '#800000' : '#e0dede', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0, marginLeft: 16 }}
      >
        <div style={{ position: 'absolute', top: 3, left: checked ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', transition: 'left 0.2s' }} />
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

  const [tab,   setTab]   = useState<Tab>('profile')
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // profile state
  const [firstName, setFirstName] = useState('Achmad')
  const [lastName,  setLastName]  = useState('Hakim')
  const [email,     setEmail]     = useState('achmadhakim@gmail.com')
  const [phone,     setPhone]     = useState('+62 812 3456 7890')
  const [bio,       setBio]       = useState('')
  const [avatar,    setAvatar]    = useState<string | null>(null)

  // security state
  const [currentPw, setCurrentPw] = useState('')
  const [newPw,     setNewPw]     = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  // notifications state
  const [notifs, setNotifs] = useState({ email: true, sms: false, push: true, reminders: true, marketing: false })

  // privacy state
  const [privacy, setPrivacy] = useState({ profileVisible: true, activityVisible: false, dataSharing: false })

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result as string)
    reader.readAsDataURL(file)
  }

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile',       label: 'Profile',       icon: <UserIco /> },
    { key: 'security',      label: 'Security',      icon: <LockIco /> },
    { key: 'notifications', label: 'Notifications', icon: <BellIco /> },
    { key: 'privacy',       label: 'Privacy',       icon: <ShieldIco /> },
  ]

  const outerPad = isMobile ? '12px' : '24px'

  return (
    <div ref={rootRef} style={{ fontFamily: "'Poppins',sans-serif", padding: outerPad, background: '#fdfcfc', minHeight: '100vh', visibility: bp === null ? 'hidden' : 'visible' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        .as-tab-lbl { display: inline; }
        @media (max-width: 420px) { .as-tab-lbl { display: none; } }
      `}</style>

      {/* ── Page Header — matches dashboard header pattern ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: isMobile ? 14 : 22, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <p style={{ fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Manage your account,</p>
          <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Account Settings</h1>
          {!isMobile && <p style={{ fontSize: 13, color: '#555', fontWeight: 400, margin: '3px 0 0' }}>Update your profile, security, notifications and privacy preferences.</p>}
        </div>
        <SaveBtn onClick={handleSave} saved={saved} />
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ display: 'flex', gap: 4, background: '#f0eeee', borderRadius: 11, padding: 4, marginBottom: isMobile ? 14 : 20 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: isMobile ? '7px 6px' : '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'Poppins, sans-serif', fontWeight: tab === t.key ? 700 : 500, background: tab === t.key ? '#fff' : 'transparent', color: tab === t.key ? '#800000' : '#666', boxShadow: tab === t.key ? '0 1px 6px rgba(0,0,0,0.09)' : 'none', transition: 'all 0.15s' }}
          >
            {t.icon}
            <span className="as-tab-lbl">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ══ PROFILE ══════════════════════════════════════════════════════════ */}
      {tab === 'profile' && (
        <>
          {/* Photo card */}
          <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 16, padding: '20px 22px', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Profile Photo</div>
            <div style={{ fontSize: 11, color: '#555', fontWeight: 400, marginBottom: 16 }}>Click the camera icon to change your avatar</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 76, height: 76, borderRadius: '50%', background: '#800000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, overflow: 'hidden', border: '3px solid #f0eeee' }}>
                  {avatar ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'N'}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: '#800000', border: '2.5px solid #fff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                ><CameraIco /></button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>Achmad Hakim</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 3, fontWeight: 400 }}>achmadhakim@gmail.com</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 7, fontSize: 11, fontWeight: 600, color: '#15803d', background: '#dcfce7', borderRadius: 6, padding: '3px 10px' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#16a34a' }} />Active Account
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <Card title="Personal Information" subtitle="Update your name, email and contact details">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Field label="First Name"    value={firstName} onChange={setFirstName} half />
              <Field label="Last Name"     value={lastName}  onChange={setLastName}  half />
              <Field label="Email Address" value={email}     onChange={setEmail} />
              <Field label="Phone Number"  value={phone}     onChange={setPhone} />
            </div>
          </Card>

          {/* Bio */}
          <Card title="About" subtitle="A short bio visible on your profile">
            <label style={{ fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              placeholder="Write a short bio..."
              style={{ width: '100%', marginTop: 6, padding: '9px 12px', fontSize: 13, border: '1.5px solid #e0dcdc', borderRadius: 9, outline: 'none', resize: 'vertical', background: '#fafafa', fontFamily: 'Poppins, sans-serif', fontWeight: 400, color: '#1a1a2e', boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s' }}
              onFocus={e => { e.target.style.borderColor = '#800000'; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = '#e0dcdc'; e.target.style.background = '#fafafa' }}
            />
          </Card>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><SaveBtn onClick={handleSave} saved={saved} /></div>
        </>
      )}

      {/* ══ SECURITY ═════════════════════════════════════════════════════════ */}
      {tab === 'security' && (
        <>
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

          <Card title="Two-Factor Authentication" subtitle="Add an extra layer of security to your account">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 600 }}>Authenticator App / SMS</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 2, fontWeight: 400 }}>Currently disabled — recommended for all accounts</div>
              </div>
              <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontWeight: 600 }}>Disabled</span>
            </div>
            <button
              style={{ marginTop: 14, padding: '8px 18px', fontSize: 12, border: '1.5px solid #800000', borderRadius: 9, background: 'transparent', color: '#800000', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = '#800000'; (e.target as HTMLButtonElement).style.color = '#fff' }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = 'transparent'; (e.target as HTMLButtonElement).style.color = '#800000' }}
            >Set up 2FA</button>
          </Card>

          <Card title="Active Sessions" subtitle="Devices currently signed into your account">
            {[
              { device: 'Chrome · Windows 11', location: 'Quezon City, PH', time: 'Active now', current: true },
              { device: 'Safari · iPhone 15',  location: 'Manila, PH',      time: '2 hours ago', current: false },
            ].map((s, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < arr.length - 1 ? '1px solid #f0eeee' : 'none', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 7 }}>
                    {s.device}
                    {s.current && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', fontWeight: 600 }}>Current</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#555', marginTop: 2, fontWeight: 400 }}>{s.location} · {s.time}</div>
                </div>
                {!s.current && (
                  <button style={{ fontSize: 11, color: '#dc2626', border: '1px solid #fecaca', borderRadius: 7, padding: '5px 12px', background: '#fff', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>Revoke</button>
                )}
              </div>
            ))}
          </Card>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><SaveBtn onClick={handleSave} saved={saved} /></div>
        </>
      )}

      {/* ══ NOTIFICATIONS ════════════════════════════════════════════════════ */}
      {tab === 'notifications' && (
        <>
          <Card title="Notification Channels" subtitle="Choose how you want to receive alerts">
            <ToggleRow label="Email Notifications"  desc="Receive updates and alerts via email"        checked={notifs.email}     onChange={v => setNotifs({ ...notifs, email: v })} />
            <ToggleRow label="SMS Notifications"    desc="Receive text messages for urgent alerts"     checked={notifs.sms}       onChange={v => setNotifs({ ...notifs, sms: v })} />
            <ToggleRow label="Push Notifications"   desc="Browser and mobile app push notifications"  checked={notifs.push}      onChange={v => setNotifs({ ...notifs, push: v })} />
          </Card>
          <Card title="Notification Types" subtitle="Select which events you want to be notified about">
            <ToggleRow label="Appointment Reminders" desc="Get reminded before upcoming sessions and bookings" checked={notifs.reminders} onChange={v => setNotifs({ ...notifs, reminders: v })} />
            <ToggleRow label="Marketing & Promotions" desc="Offers, product updates, and promotional content" checked={notifs.marketing} onChange={v => setNotifs({ ...notifs, marketing: v })} />
          </Card>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><SaveBtn onClick={handleSave} saved={saved} /></div>
        </>
      )}

      {/* ══ PRIVACY ══════════════════════════════════════════════════════════ */}
      {tab === 'privacy' && (
        <>
          <Card title="Visibility Settings" subtitle="Control what others can see about your account">
            <ToggleRow label="Public Profile"  desc="Allow other users to view your profile page"          checked={privacy.profileVisible}  onChange={v => setPrivacy({ ...privacy, profileVisible: v })} />
            <ToggleRow label="Activity Status" desc="Show when you were last active to other users"        checked={privacy.activityVisible} onChange={v => setPrivacy({ ...privacy, activityVisible: v })} />
            <ToggleRow label="Data Sharing"    desc="Share anonymized usage data to help improve service"  checked={privacy.dataSharing}     onChange={v => setPrivacy({ ...privacy, dataSharing: v })} />
          </Card>

          {/* Danger Zone */}
          <div style={{ background: '#fff', border: '1.5px solid #fecaca', borderRadius: 16, padding: '20px 22px', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Danger Zone</div>
            <div style={{ fontSize: 11, color: '#555', fontWeight: 400, marginBottom: 16 }}>Irreversible actions — proceed with caution</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, padding: '14px 16px', background: '#fff5f5', borderRadius: 10, border: '1px solid #fecaca' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#dc2626' }}>Delete Account</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 2, fontWeight: 400 }}>Permanently delete your account and all associated data</div>
              </div>
              <button style={{ fontSize: 12, padding: '8px 18px', borderRadius: 9, border: '1.5px solid #dc2626', background: 'transparent', color: '#dc2626', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                Delete Account
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><SaveBtn onClick={handleSave} saved={saved} /></div>
        </>
      )}
    </div>
  )
}