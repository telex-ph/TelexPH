'use client'
import { useState, useRef, useEffect } from 'react'

// ─── BREAKPOINT ───────────────────────────────────────────────────────────────
function getBreakpoint(w: number): 'mobile' | 'tablet' | 'desktop' {
  return w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'
}

// ─── ICON ─────────────────────────────────────────────────────────────────────
function Ico({ d, d2, size = 16, sw = 1.4 }: { d: string; d2?: string; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />{d2 && <path d={d2} />}
    </svg>
  )
}

// ─── GLOBAL CSS (same pattern as subscriptions) ───────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; font-family: 'Poppins', sans-serif; }

  .tab-btn {
    padding: 7px 16px; border-radius: 7px; border: none; font-size: 13px;
    font-weight: 600; cursor: pointer; background: transparent; color: #555;
    transition: all 0.18s; font-family: 'Poppins', sans-serif;
  }
  .tab-btn.active { background: #fff; color: #800000; box-shadow: 0 1px 4px rgba(0,0,0,0.13); }
  .tab-btn:hover:not(.active) { color: #800000; }

  .settings-card {
    background: #fff;
    border-radius: 14px;
    border: 1.5px solid #e0dcdc;
    margin-bottom: 16px;
    overflow: hidden;
  }
  .settings-card-header {
    padding: 16px 22px 12px;
    border-bottom: 1px solid #f0ecec;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .settings-card-body { padding: 20px 22px; }

  .field-row { display: flex; flex-wrap: wrap; gap: 12px; }

  .field-wrap { display: flex; flex-direction: column; gap: 5px; }
  .field-wrap label {
    font-size: 11px; color: #555; font-weight: 600;
    letter-spacing: 0.05em; text-transform: uppercase;
  }
  .field-input {
    width: 100%; padding: 9px 12px; font-size: 13px;
    border: 1.5px solid #e0dcdc; border-radius: 9px; outline: none;
    background: #fafafa; color: #1a1a2e; font-family: 'Poppins', sans-serif;
    font-weight: 400; transition: border-color 0.15s, background 0.15s;
  }
  .field-input:focus { border-color: #800000; background: #fff; }

  .save-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 20px; border: none; border-radius: 9px;
    font-size: 12px; font-weight: 700; cursor: pointer;
    font-family: 'Poppins', sans-serif; letter-spacing: 0.02em;
    transition: opacity 0.2s, background 0.3s;
  }
  .save-btn:hover { opacity: 0.88; }

  .pw-toggle {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: #aaa;
    display: flex; padding: 0;
  }

  .avatar-upload-btn {
    position: absolute; bottom: 0; right: 0; width: 28px; height: 28px;
    border-radius: 50%; background: #800000; border: 2.5px solid #fff;
    color: #fff; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.2s;
  }
  .avatar-upload-btn:hover { background: #a02020; }

  .section-divider {
    display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
  }
  .section-divider span {
    font-size: 11px; color: #555; letter-spacing: 0.05em;
    font-weight: 700; text-transform: uppercase; white-space: nowrap;
  }
  .section-divider-line { flex: 1; height: 1px; background: #e8e4e4; }

  .danger-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 9px; border: 1.5px solid #dc2626;
    background: #fff5f5; color: #dc2626; font-size: 12px; font-weight: 700;
    cursor: pointer; font-family: 'Poppins', sans-serif; transition: background 0.2s;
  }
  .danger-btn:hover { background: #fee2e2; }

  .notif-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0; border-bottom: 1px solid #f5f2f2;
  }
  .notif-row:last-child { border-bottom: none; }

  .toggle-track {
    width: 38px; height: 21px; border-radius: 99px; cursor: pointer;
    display: flex; align-items: center; padding: 3px;
    transition: background 0.2s; flex-shrink: 0;
  }
  .toggle-thumb {
    width: 15px; height: 15px; border-radius: 50%; background: #fff;
    transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
`

// ─── FIELD ────────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', flex }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; flex?: string
}) {
  const [show, setShow] = useState(false)
  const isPass = type === 'password'
  return (
    <div className="field-wrap" style={{ flex: flex || '1 1 100%', minWidth: flex ? 130 : 'unset' }}>
      <label>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          className="field-input"
          type={isPass && !show ? 'password' : 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ paddingRight: isPass ? 38 : 12 }}
        />
        {isPass && (
          <button className="pw-toggle" onClick={() => setShow(!show)}>
            {show
              ? <Ico d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" d2="M1 1l22 22" size={14} />
              : <Ico d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" d2="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" size={14} />
            }
          </button>
        )}
      </div>
    </div>
  )
}

// ─── TOGGLE ───────────────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      className="toggle-track"
      style={{ background: on ? '#800000' : '#d1cece' }}
      onClick={() => onChange(!on)}
    >
      <div className="toggle-thumb" style={{ transform: on ? 'translateX(17px)' : 'translateX(0)' }} />
    </div>
  )
}

// ─── SAVE BUTTON ──────────────────────────────────────────────────────────────
function SaveBtn({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button
      className="save-btn"
      onClick={onClick}
      style={{ background: saved ? '#15803d' : 'linear-gradient(135deg,#800000,#a82020)', color: '#fff' }}
    >
      {saved
        ? <><Ico d="M20 6L9 17l-5-5" size={14} /> Saved!</>
        : <><Ico d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z" d2="M17 21v-8H7v8M7 3v5h8" size={14} /> Save Changes</>
      }
    </button>
  )
}

const API_BASE = 'https://telexph-admin.onrender.com/api'

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

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile')
  const [saved, setSaved]         = useState(false)
  const [toast, setToast]         = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // profile
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')
  const [avatar,    setAvatar]    = useState<string | null>(null)

  // security
  const [currentPw, setCurrentPw] = useState('')
  const [newPw,     setNewPw]     = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  // notifications
  const [notifs, setNotifs] = useState({
    emailUpdates:    true,
    smsAlerts:       false,
    renewalReminders: true,
    promotions:      false,
    securityAlerts:  true,
  })

  // fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/client/me`, { method: 'GET', credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          if (data.firstName)     setFirstName(data.firstName)
          if (data.lastName)      setLastName(data.lastName)
          if (data.email)         setEmail(data.email)
          if (data.contactNumber) setPhone(data.contactNumber)
          if (data.profilePicture) setAvatar(data.profilePicture)
        }
      } catch (err) { console.error('Failed to fetch profile:', err) }
    }
    fetchProfile()
  }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const handleSave = () => {
    setSaved(true)
    showToast('Your changes have been saved successfully!')
    setTimeout(() => setSaved(false), 2500)
  }

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result as string)
    reader.readAsDataURL(file)
  }

  const avatarLetter = firstName ? firstName.charAt(0).toUpperCase() : '?'
  const displayName  = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Loading...'



  const notifList = [
    { key: 'emailUpdates',     label: 'Email Updates',      sub: 'Receive account updates via email' },
    { key: 'smsAlerts',        label: 'SMS Alerts',          sub: 'Get text notifications on your phone' },
    { key: 'renewalReminders', label: 'Renewal Reminders',   sub: 'Be reminded before subscriptions expire' },
    { key: 'promotions',       label: 'Promotions & Offers', sub: 'Receive special deals and discounts' },
    { key: 'securityAlerts',   label: 'Security Alerts',     sub: 'Get notified of suspicious activity' },
  ] as const

  return (
    <div ref={rootRef} style={{ fontFamily: "'Poppins',sans-serif", padding: isMobile ? 12 : 24, background: '#fdfcfc', minHeight: '100vh', visibility: bp === null ? 'hidden' : 'visible' }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: '#1a1a2e', color: '#fff', borderRadius: 12, padding: '12px 22px', fontSize: 13, fontWeight: 600, zIndex: 2000, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', letterSpacing: '0.01em' }}>
          <Ico d="M20 6L9 17l-5-5" size={16} />
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ marginBottom: isMobile ? 14 : 22 }}>
        <p style={{ fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Manage your account,</p>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Account Settings</h1>
        {!isMobile && <p style={{ fontSize: 13, color: '#555', fontWeight: 400, margin: '3px 0 0' }}>Update your profile and security preferences.</p>}
      </div>



      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 4, background: '#ede8e8', borderRadius: 10, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {(['profile', 'security', 'notifications'] as const).map(tab => (
          <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ══ PROFILE TAB ══ */}
      {activeTab === 'profile' && (
        <div>
          {/* Profile Photo Card */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fff0f0', border: '1px solid #f0c8c8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#800000' }}>
                <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" d2="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" size={14} sw={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Profile Photo</div>
                <div style={{ fontSize: 11, color: '#555', fontWeight: 400 }}>Click the camera icon to change your avatar</div>
              </div>
            </div>
            <div className="settings-card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 76, height: 76, borderRadius: '50%', background: '#800000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, overflow: 'hidden', border: '3px solid #f0eeee', boxShadow: '0 4px 16px rgba(128,0,0,0.25)' }}>
                    {avatar ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : avatarLetter}
                  </div>
                  <button className="avatar-upload-btn" onClick={() => fileRef.current?.click()}>
                    <Ico d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" d2="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={12} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>{displayName}</div>
                  <div style={{ fontSize: 12, color: '#555', marginTop: 3, fontWeight: 400 }}>{email || '—'}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: 11, fontWeight: 600, color: '#15803d', background: '#dcfce7', borderRadius: 6, padding: '3px 10px' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#16a34a' }} />Active Account
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fff0f0', border: '1px solid #f0c8c8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#800000' }}>
                <Ico d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" d2="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={14} sw={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Personal Information</div>
                <div style={{ fontSize: 11, color: '#555', fontWeight: 400 }}>Update your name, email and contact details</div>
              </div>
            </div>
            <div className="settings-card-body">
              <div className="field-row">
                <Field label="First Name"    value={firstName} onChange={setFirstName} flex="1 1 calc(50% - 6px)" />
                <Field label="Last Name"     value={lastName}  onChange={setLastName}  flex="1 1 calc(50% - 6px)" />
                <Field label="Email Address" value={email}     onChange={setEmail} />
                <Field label="Phone Number"  value={phone}     onChange={setPhone} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><SaveBtn onClick={handleSave} saved={saved} /></div>
        </div>
      )}

      {/* ══ SECURITY TAB ══ */}
      {activeTab === 'security' && (
        <div>
          {/* Change Password */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fff0f0', border: '1px solid #f0c8c8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#800000' }}>
                <Ico d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" size={14} sw={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Change Password</div>
                <div style={{ fontSize: 11, color: '#555', fontWeight: 400 }}>Choose a strong password to keep your account safe</div>
              </div>
            </div>
            <div className="settings-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Field label="Current Password" value={currentPw} onChange={setCurrentPw} type="password" />
                <Field label="New Password"     value={newPw}     onChange={setNewPw}     type="password" />
                <Field label="Confirm Password" value={confirmPw} onChange={setConfirmPw} type="password" />
              </div>
              {newPw && confirmPw && newPw !== confirmPw && (
                <div style={{ marginTop: 12, fontSize: 11, color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: 8, padding: '8px 12px' }}>
                  <Ico d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" size={12} sw={2} /> Passwords do not match.
                </div>
              )}
              {newPw && confirmPw && newPw === confirmPw && (
                <div style={{ marginTop: 12, fontSize: 11, color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 8, padding: '8px 12px' }}>
                  <Ico d="M20 6L9 17l-5-5" size={12} sw={2} /> Passwords match!
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fff5f5', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                <Ico d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" size={14} sw={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>Danger Zone</div>
                <div style={{ fontSize: 11, color: '#555', fontWeight: 400 }}>Irreversible actions for your account</div>
              </div>
            </div>
            <div className="settings-card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <button className="danger-btn">
                <Ico d="M18.36 6.64a9 9 0 1 1-12.73 0" d2="M12 2v10" size={13} sw={2} />
                Deactivate Account
              </button>
              <button className="danger-btn">
                <Ico d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" size={13} sw={2} />
                Delete Account
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><SaveBtn onClick={handleSave} saved={saved} /></div>
        </div>
      )}

      {/* ══ NOTIFICATIONS TAB ══ */}
      {activeTab === 'notifications' && (
        <div>
          <div className="settings-card">
            <div className="settings-card-header">
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fff0f0', border: '1px solid #f0c8c8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#800000' }}>
                <Ico d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" d2="M13.73 21a2 2 0 0 1-3.46 0" size={14} sw={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Notification Preferences</div>
                <div style={{ fontSize: 11, color: '#555', fontWeight: 400 }}>Choose what you want to be notified about</div>
              </div>
            </div>
            <div className="settings-card-body" style={{ padding: '0 22px' }}>
              {notifList.map(n => (
                <div key={n.key} className="notif-row">
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{n.label}</div>
                    <div style={{ fontSize: 11, color: '#666', fontWeight: 400, marginTop: 2 }}>{n.sub}</div>
                  </div>
                  <Toggle on={notifs[n.key]} onChange={v => setNotifs(prev => ({ ...prev, [n.key]: v }))} />
                </div>
              ))}
            </div>
            <div style={{ height: 12 }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><SaveBtn onClick={handleSave} saved={saved} /></div>
        </div>
      )}
    </div>
  )
}