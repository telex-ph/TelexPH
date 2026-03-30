'use client'
import React, { useState, useEffect } from 'react'

const BG       = '#E7E7E7'
const NEU_OUT  = '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)'
const NEU_IN   = 'inset 3px 3px 7px #CACAEC, inset -3px -3px 7px #fff'
const TXT      = '#2a2a2a'
const SUB      = '#888'
const PRIMARY  = '#800000'

const Ico = ({ d, d2, size = 16, sw = 1.4 }: { d: string; d2?: string; size?: number; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />{d2 && <path d={d2} />}
  </svg>
)

// ─── TYPES ────────────────────────────────────────────────────────────────────
type MeetingStatus = 'Live' | 'Upcoming' | 'Done' | 'Cancelled'
type Meeting = { id: number; title: string; date: string; time: string; duration: string; host: string; agenda: string; status: MeetingStatus; link: string }
type Profile = { firstName: string; lastName: string; phone: string; address: string; skills: string; experience: string; availability: string; bio: string; linkedin: string; portfolio: string; sss: string; pagibig: string; philhealth: string; tin: string; validId: string }

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MEETINGS: Meeting[] = [
  { id: 1, title: 'Weekly Team Sync',          date: 'Mon, Mar 23, 2026', time: '9:00 AM',  duration: '30 min',  host: 'Admin (Client)', agenda: 'Weekly update on tasks, blockers, and priorities for the week.',                     status: 'Live',      link: 'https://zoom.us/j/111' },
  { id: 2, title: 'Task Review & Planning',    date: 'Tue, Mar 24, 2026', time: '10:00 AM', duration: '45 min',  host: 'Admin (Client)', agenda: 'Review completed tasks from last week and assign new ones for this sprint.',         status: 'Upcoming',  link: 'https://zoom.us/j/222' },
  { id: 3, title: 'Social Media Strategy',     date: 'Wed, Mar 25, 2026', time: '2:00 PM',  duration: '1 hr',    host: 'Admin (Client)', agenda: 'Discuss content plan for April. Bring ideas for campaigns.',                        status: 'Upcoming',  link: 'https://zoom.us/j/333' },
  { id: 4, title: 'Q1 Performance Review',     date: 'Thu, Mar 26, 2026', time: '11:00 AM', duration: '1 hr',    host: 'Admin (Client)', agenda: 'Individual performance review for Q1. Please prepare your accomplishment report.',   status: 'Upcoming',  link: 'https://zoom.us/j/444' },
  { id: 5, title: 'Onboarding — New VA',       date: 'Fri, Mar 27, 2026', time: '3:00 PM',  duration: '1.5 hrs', host: 'Admin (Client)', agenda: 'Orientation session for the new VA. All team members please attend.',              status: 'Upcoming',  link: 'https://zoom.us/j/555' },
  { id: 6, title: 'CRM System Walkthrough',    date: 'Mon, Mar 17, 2026', time: '9:00 AM',  duration: '45 min',  host: 'Admin (Client)', agenda: 'Walkthrough of the new CRM system. Q&A after demo.',                               status: 'Done',      link: '' },
  { id: 7, title: 'Emergency Strategy Call',   date: 'Fri, Mar 21, 2026', time: '4:00 PM',  duration: '15 min',  host: 'Admin (Client)', agenda: 'Urgent discussion regarding client deliverables.',                                  status: 'Cancelled', link: '' },
]

const EMPTY: Profile = { firstName: '', lastName: '', phone: '', address: '', skills: '', experience: '', availability: '', bio: '', linkedin: '', portfolio: '', sss: '', pagibig: '', philhealth: '', tin: '', validId: '' }

const FIELDS: { key: keyof Profile; label: string; placeholder: string; required: boolean; textarea?: boolean; section?: string }[] = [
  { key: 'firstName',    label: 'First Name',          placeholder: 'e.g. Maria',                            required: true  },
  { key: 'lastName',     label: 'Last Name',           placeholder: 'e.g. Santos',                           required: true  },
  { key: 'phone',        label: 'Phone Number',        placeholder: 'e.g. +63 912 345 6789',                 required: true  },
  { key: 'address',      label: 'Address',             placeholder: 'City, Province, Country',               required: true  },
  { key: 'skills',       label: 'Key Skills',          placeholder: 'e.g. Email management, CRM, Canva',     required: true  },
  { key: 'experience',   label: 'Years of Experience', placeholder: 'e.g. 3 years as Executive VA',          required: true  },
  { key: 'availability', label: 'Availability',        placeholder: 'e.g. Full-time, Mon–Fri 9AM–6PM',       required: true  },
  { key: 'bio',          label: 'Short Bio',           placeholder: 'Tell us about yourself...',             required: true,  textarea: true },
  { key: 'linkedin',     label: 'LinkedIn URL',        placeholder: 'https://linkedin.com/in/...',           required: false },
  { key: 'portfolio',    label: 'Portfolio URL',       placeholder: 'https://yourportfolio.com',             required: false },
  { key: 'sss',          label: 'SSS Number',          placeholder: 'e.g. 34-1234567-8',                     required: true,  section: 'Government IDs' },
  { key: 'pagibig',      label: 'Pag-IBIG ID Number',  placeholder: 'e.g. 1234-5678-9012',                   required: true  },
  { key: 'philhealth',   label: 'PhilHealth Number',   placeholder: 'e.g. 12-345678901-2',                   required: true  },
  { key: 'tin',          label: 'TIN Number',          placeholder: 'e.g. 123-456-789-000',                  required: true  },
  { key: 'validId',      label: 'Valid ID Type',        placeholder: 'e.g. Passport, Driver\'s License, UMID', required: true  },
]

// ─── BADGE ────────────────────────────────────────────────────────────────────
function Badge({ status }: { status: MeetingStatus }) {
  const map = { Live: { bg: '#dcfce7', color: '#15803d' }, Upcoming: { bg: '#dbeafe', color: '#1e40af' }, Done: { bg: '#f3f4f6', color: '#6b7280' }, Cancelled: { bg: '#fee2e2', color: '#991b1b' } }
  const s = map[status]
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: s.bg, color: s.color, display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
      {status === 'Live' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#15803d', display: 'inline-block', animation: 'livepulse 1.4s infinite' }} />}
      {status}
    </span>
  )
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent = false }: { label: string; value: string | number; sub?: string; icon: React.ReactNode; accent?: boolean }) {
  return (
    <div style={{ background: BG, borderRadius: 20, padding: '16px 20px', boxShadow: NEU_OUT, display: 'flex', alignItems: 'center', gap: 14, flex: '1 1 150px', minWidth: 0 }}>
      <div style={{ width: 42, height: 42, borderRadius: 13, background: accent ? PRIMARY : BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: accent ? 'none' : NEU_IN, color: accent ? '#fff' : PRIMARY }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10.5, color: SUB, marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: TXT, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 10, color: SUB, marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  )
}

// ─── PROFILE MODAL ────────────────────────────────────────────────────────────
function ProfileModal({ initial, onClose, onSave }: { initial: Profile; onClose: () => void; onSave: (d: Profile) => void }) {
  const [form, setForm]     = useState<Profile>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof Profile, string>>>({})
  const [saving, setSaving] = useState(false)

  const set = (k: keyof Profile, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e: Partial<Record<keyof Profile, string>> = {}
    FIELDS.filter(f => f.required).forEach(f => { if (!form[f.key]?.trim()) e[f.key] = `${f.label} is required` })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => { onSave(form); setSaving(false); onClose() }, 600)
  }

  const filled = FIELDS.filter(f => f.required && form[f.key]?.trim()).length
  const total  = FIELDS.filter(f => f.required).length
  const pct    = Math.round((filled / total) * 100)

  const inp = (k: keyof Profile): React.CSSProperties => ({
    width: '100%', background: BG, border: `1.5px solid ${errors[k] ? '#991b1b' : 'transparent'}`,
    borderRadius: 12, padding: '8px 12px', fontSize: 12, color: TXT,
    outline: 'none', fontFamily: 'inherit', boxShadow: NEU_IN, boxSizing: 'border-box',
  })

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: BG, borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)', width: '100%', maxWidth: 900, padding: '24px 28px' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: TXT }}>Complete Your Profile</div>
            <div style={{ fontSize: 11.5, color: SUB, marginTop: 3 }}>Fill in your details so the admin can get to know you.</div>
          </div>
          <button onClick={onClose} style={{ background: BG, border: 'none', borderRadius: 10, width: 32, height: 32, cursor: 'pointer', color: SUB, boxShadow: NEU_OUT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Ico d="M18 6L6 18M6 6l12 12" size={14} />
          </button>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: SUB, marginBottom: 5 }}>
            <span>{filled} of {total} required fields</span>
            <span style={{ fontWeight: 700, color: pct === 100 ? '#15803d' : PRIMARY }}>{pct}%</span>
          </div>
          <div style={{ height: 6, background: BG, borderRadius: 99, boxShadow: NEU_IN, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'linear-gradient(90deg,#15803d,#22c55e)' : `linear-gradient(90deg,${PRIMARY},#b91c1c)`, borderRadius: 99, transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
          {FIELDS.map((f, idx) => (
            <React.Fragment key={f.key}>
              {f.section && (
                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0 2px' }}>
                  <div style={{ height: 1, flex: 1, background: 'rgba(0,0,0,0.08)' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: SUB, textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>🪪 {f.section}</span>
                  <div style={{ height: 1, flex: 1, background: 'rgba(0,0,0,0.08)' }} />
                </div>
              )}
              <div style={{ gridColumn: f.textarea ? '1 / span 2' : 'auto' }}>
                <label style={{ fontSize: 10.5, fontWeight: 600, color: SUB, display: 'block', marginBottom: 5 }}>
                  {f.label}{f.required && <span style={{ color: PRIMARY }}> *</span>}
                </label>
                {f.textarea ? (
                  <textarea value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} rows={2} style={{ ...inp(f.key), resize: 'none' }} />
                ) : (
                  <input type="text" value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} style={inp(f.key)} />
                )}
                {errors[f.key] && <div style={{ fontSize: 10, color: '#991b1b', marginTop: 3 }}>{errors[f.key]}</div>}
              </div>
            </React.Fragment>
          ))}
        </div>

        <button onClick={handleSave} disabled={saving}
          style={{ width: '100%', background: PRIMARY, color: '#fff', border: 'none', borderRadius: 14, padding: '13px', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '4px 4px 12px rgba(128,0,0,0.3)', fontFamily: 'inherit', opacity: saving ? 0.8 : 1 }}>
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </div>
    </div>
  )
}

// ─── MEETING MODAL ────────────────────────────────────────────────────────────
function MeetingModal({ meeting, onClose }: { meeting: Meeting; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: BG, borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)', width: '100%', maxWidth: 480, padding: 28 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div><Badge status={meeting.status} /><div style={{ fontSize: 16, fontWeight: 700, color: TXT, marginTop: 8 }}>{meeting.title}</div></div>
          <button onClick={onClose} style={{ background: BG, border: 'none', borderRadius: 10, width: 32, height: 32, cursor: 'pointer', color: SUB, boxShadow: NEU_OUT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ico d="M18 6L6 18M6 6l12 12" size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            { icon: 'M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z', label: 'Date', value: meeting.date },
            { icon: 'M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', label: 'Time', value: `${meeting.time} · ${meeting.duration}` },
            { icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', label: 'Host', value: meeting.host },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: BG, borderRadius: 12, padding: '10px 14px', boxShadow: NEU_IN }}>
              <span style={{ color: PRIMARY, flexShrink: 0 }}><Ico d={item.icon} size={14} sw={1.5} /></span>
              <div><div style={{ fontSize: 10, color: SUB, marginBottom: 1 }}>{item.label}</div><div style={{ fontSize: 12, fontWeight: 600, color: TXT }}>{item.value}</div></div>
            </div>
          ))}
          <div style={{ background: BG, borderRadius: 12, padding: '12px 14px', boxShadow: NEU_IN }}>
            <div style={{ fontSize: 10, color: SUB, marginBottom: 4 }}>Agenda</div>
            <div style={{ fontSize: 12, color: TXT, lineHeight: 1.6 }}>{meeting.agenda}</div>
          </div>
        </div>
        {(meeting.status === 'Live' || meeting.status === 'Upcoming') && meeting.link ? (
          <button onClick={() => window.open(meeting.link, '_blank')} style={{ width: '100%', background: PRIMARY, color: '#fff', border: 'none', borderRadius: 14, padding: '13px', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '4px 4px 12px rgba(128,0,0,0.3)', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Ico d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.888L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" size={15} />
            {meeting.status === 'Live' ? 'Join Meeting Now' : 'Join Meeting'}
          </button>
        ) : (
          <div style={{ textAlign: 'center', fontSize: 12, color: SUB, padding: '10px', background: BG, borderRadius: 14, boxShadow: NEU_IN }}>
            {meeting.status === 'Done' ? '✓ This meeting has ended.' : '✕ This meeting was cancelled.'}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [greeting, setGreeting]         = useState('Good morning')
  const [filter, setFilter]             = useState<MeetingStatus | 'All'>('All')
  const [selected, setSelected]         = useState<Meeting | null>(null)
  const [showProfile, setShowProfile]   = useState(false)
  const [profile, setProfile]           = useState<Profile>(EMPTY)
  const [profileSaved, setProfileSaved] = useState(false)

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
  }, [])

  const filledCount = FIELDS.filter(f => f.required && profile[f.key]?.trim()).length
  const totalReq    = FIELDS.filter(f => f.required).length
  const profilePct  = Math.round((filledCount / totalReq) * 100)
  const profileDone = profilePct === 100

  const liveCount     = MEETINGS.filter(m => m.status === 'Live').length
  const upcomingCount = MEETINGS.filter(m => m.status === 'Upcoming').length
  const doneCount     = MEETINGS.filter(m => m.status === 'Done').length
  const filtered      = filter === 'All' ? MEETINGS : MEETINGS.filter(m => m.status === filter)
  const nextMeeting   = MEETINGS.find(m => m.status === 'Live') ?? MEETINGS.find(m => m.status === 'Upcoming')

  const handleSaveProfile = (data: Profile) => { setProfile(data); setProfileSaved(true) }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @keyframes livepulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .meet-row:hover { background: rgba(128,0,0,0.03) !important; cursor: pointer; }
        .pill:hover { opacity: 0.85; }
        input:focus, textarea:focus { border-color: ${PRIMARY} !important; }
        @media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ── Profile Complete Banner ── */}
      {profileDone && profileSaved && (
        <div style={{ background: '#dcfce7', borderRadius: 20, padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#15803d' }}>Profile Complete!</div>
              <div style={{ fontSize: 11, color: '#166534' }}>Your profile has been submitted to the admin.</div>
            </div>
          </div>
          <button onClick={() => setShowProfile(true)} style={{ background: 'none', border: '1.5px solid #15803d', borderRadius: 10, padding: '6px 14px', fontSize: 11, fontWeight: 600, color: '#15803d', cursor: 'pointer', fontFamily: 'inherit' }}>
            Edit Profile
          </button>
        </div>
      )}

      {/* ── Greeting ── */}
      <div style={{ background: BG, borderRadius: 20, padding: '20px 24px', boxShadow: NEU_OUT, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: SUB, marginBottom: 4 }}>{greeting} 👋</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: TXT }}>Welcome back, <span style={{ color: PRIMARY }}>{profile.firstName || 'VA'}</span></div>
          <div style={{ fontSize: 11.5, color: SUB, marginTop: 4 }}>Here are your scheduled meetings from the admin.</div>
        </div>
        {liveCount > 0 && (
          <div style={{ background: '#dcfce7', borderRadius: 14, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#15803d', display: 'inline-block', animation: 'livepulse 1.4s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#15803d' }}>A meeting is live right now!</span>
          </div>
        )}
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 20 }}>
        <StatCard label="Total Meetings" value={MEETINGS.length} sub="Assigned to you" accent icon={<Ico d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.888L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" size={17} />} />
        <StatCard label="Live Now"       value={liveCount}     sub="Join immediately" icon={<Ico d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.888L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" size={17} />} />
        <StatCard label="Upcoming"       value={upcomingCount} sub="This week"        icon={<Ico d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" size={17} />} />
        <StatCard label="Attended"       value={doneCount}     sub="Completed"        icon={<Ico d="M22 11.08V12a10 10 0 1 1-5.93-9.14" d2="M22 4L12 14.01l-3-3" size={17} />} />
      </div>

      {/* ── Main Grid ── */}
      <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 272px', gap: 16, alignItems: 'start' }}>

        {/* LEFT: Meetings */}
        <div style={{ background: BG, borderRadius: 20, boxShadow: NEU_OUT, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: TXT, flex: 1 }}>My Meetings</span>
            {(['All', 'Live', 'Upcoming', 'Done', 'Cancelled'] as const).map(f => (
              <button key={f} className="pill" onClick={() => setFilter(f)}
                style={{ background: filter === f ? PRIMARY : BG, color: filter === f ? '#fff' : SUB, border: 'none', borderRadius: 99, padding: '5px 13px', fontSize: 11, fontWeight: 600, cursor: 'pointer', boxShadow: filter === f ? '3px 3px 8px rgba(128,0,0,0.3)' : NEU_OUT, transition: 'all 0.15s', fontFamily: 'inherit' }}>
                {f}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: SUB, fontSize: 12 }}>No meetings found.</div>
          ) : filtered.map((m, i) => (
            <div key={m.id} className="meet-row" onClick={() => setSelected(m)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none', transition: 'background 0.15s' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: BG, boxShadow: NEU_IN, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 9, color: SUB, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1 }}>{m.date.split(' ')[0].replace(',', '')}</span>
                <span style={{ fontSize: 17, fontWeight: 700, color: PRIMARY, lineHeight: 1.2 }}>{m.date.split(' ')[2].replace(',', '')}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: TXT }}>{m.title}</span>
                  <Badge status={m.status} />
                </div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: SUB, display: 'flex', alignItems: 'center', gap: 4 }}><Ico d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" size={11} sw={1.5} />{m.time} · {m.duration}</span>
                  <span style={{ fontSize: 11, color: SUB, display: 'flex', alignItems: 'center', gap: 4 }}><Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={11} sw={1.5} />{m.host}</span>
                </div>
              </div>
              {(m.status === 'Live' || m.status === 'Upcoming') && m.link ? (
                <button onClick={e => { e.stopPropagation(); window.open(m.link, '_blank') }}
                  style={{ background: m.status === 'Live' ? PRIMARY : BG, color: m.status === 'Live' ? '#fff' : PRIMARY, border: 'none', borderRadius: 10, padding: '7px 16px', fontSize: 11, fontWeight: 600, cursor: 'pointer', boxShadow: m.status === 'Live' ? '3px 3px 8px rgba(128,0,0,0.3)' : NEU_OUT, whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Ico d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.888L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" size={12} />
                  {m.status === 'Live' ? 'Join Now' : 'Join'}
                </button>
              ) : (
                <span style={{ fontSize: 11, color: SUB, flexShrink: 0 }}>{m.status === 'Done' ? '✓ Done' : '✕ Cancelled'}</span>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Profile card */}
          <div style={{ background: BG, borderRadius: 20, boxShadow: NEU_OUT, padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>Your Profile</div>
              {profileDone && <span style={{ fontSize: 10, fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: 99 }}>Complete</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: PRIMARY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : '?'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: TXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}`.trim() : 'Your Name'}
                </div>
                <div style={{ fontSize: 11, color: SUB, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.skills || 'No skills added yet'}</div>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: SUB, marginBottom: 5 }}>
                <span>Profile completion</span>
                <span style={{ fontWeight: 700, color: profileDone ? '#15803d' : PRIMARY }}>{profilePct}%</span>
              </div>
              <div style={{ height: 5, background: BG, borderRadius: 99, boxShadow: NEU_IN, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${profilePct}%`, background: profileDone ? 'linear-gradient(90deg,#15803d,#22c55e)' : `linear-gradient(90deg,${PRIMARY},#b91c1c)`, borderRadius: 99, transition: 'width 0.3s' }} />
              </div>
            </div>
            <button onClick={() => setShowProfile(true)}
              style={{ width: '100%', background: profileDone ? BG : PRIMARY, color: profileDone ? TXT : '#fff', border: 'none', borderRadius: 12, padding: '10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: profileDone ? NEU_OUT : '3px 3px 10px rgba(128,0,0,0.3)', fontFamily: 'inherit' }}>
              {profileDone ? '✎  Edit Profile' : 'Complete Profile →'}
            </button>
          </div>

          {/* Next meeting */}
          {nextMeeting && (
            <div style={{ background: BG, borderRadius: 20, boxShadow: NEU_OUT, padding: '18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: SUB, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                {nextMeeting.status === 'Live' ? '🔴 Happening Now' : '⏰ Next Meeting'}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: TXT, marginBottom: 6 }}>{nextMeeting.title}</div>
              <div style={{ fontSize: 11.5, color: SUB, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Ico d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" size={11} sw={1.5} />{nextMeeting.date}
              </div>
              <div style={{ fontSize: 11.5, color: SUB, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Ico d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" size={11} sw={1.5} />{nextMeeting.time} · {nextMeeting.duration}
              </div>
              <div style={{ background: BG, borderRadius: 12, padding: '10px 12px', boxShadow: NEU_IN, fontSize: 11, color: TXT, lineHeight: 1.6, marginBottom: 12 }}>
                <span style={{ fontSize: 10, color: SUB, display: 'block', marginBottom: 3 }}>Agenda</span>
                {nextMeeting.agenda}
              </div>
              {nextMeeting.link && (
                <button onClick={() => window.open(nextMeeting.link, '_blank')}
                  style={{ width: '100%', background: PRIMARY, color: '#fff', border: 'none', borderRadius: 12, padding: '11px', fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: '4px 4px 12px rgba(128,0,0,0.3)', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Ico d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.888L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" size={14} />
                  {nextMeeting.status === 'Live' ? 'Join Now' : 'Join Meeting'}
                </button>
              )}
            </div>
          )}

          {/* Reminders */}
          <div style={{ background: BG, borderRadius: 20, boxShadow: NEU_OUT, padding: '18px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TXT, marginBottom: 12 }}>Reminders</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MEETINGS.filter(m => m.status === 'Upcoming').slice(0, 3).map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: BG, borderRadius: 12, boxShadow: NEU_IN }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: PRIMARY, marginTop: 4, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: TXT }}>{m.title}</div>
                    <div style={{ fontSize: 10.5, color: SUB, marginTop: 2 }}>{m.date} · {m.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selected    && <MeetingModal meeting={selected} onClose={() => setSelected(null)} />}
      {showProfile && <ProfileModal initial={profile} onClose={() => setShowProfile(false)} onSave={handleSaveProfile} />}
    </div>
  )
}