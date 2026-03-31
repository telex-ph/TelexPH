'use client'
import React, { useState, useEffect } from 'react'

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const BG       = '#FFFFFF'
const BG_SOFT  = '#F8F9FB'
const BG_HOVER = '#F3F4F6'
const BORDER   = 'rgba(0,0,0,0.09)'
const BORDER_FOCUS = '#800000'
const TXT      = '#111827'
const SUB      = '#9CA3AF'
const MUTED    = '#6B7280'
const PRIMARY  = '#800000'
const PRIMARY_LIGHT = 'rgba(128,0,0,0.07)'
const SHADOW_SM = '0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)'
const SHADOW_MD = '0 4px 16px rgba(0,0,0,0.08)'
const SHADOW_LG = '0 8px 40px rgba(0,0,0,0.12)'

const Ico = ({ d, d2, size = 16, sw = 1.5 }: { d: string; d2?: string; size?: number; sw?: number }) => (
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
  { id: 1, title: 'Weekly Team Sync',        date: 'Mon, Mar 23, 2026', time: '9:00 AM',  duration: '30 min',  host: 'Admin (Client)', agenda: 'Weekly update on tasks, blockers, and priorities for the week.',                   status: 'Live',      link: 'https://zoom.us/j/111' },
  { id: 2, title: 'Task Review & Planning',  date: 'Tue, Mar 24, 2026', time: '10:00 AM', duration: '45 min',  host: 'Admin (Client)', agenda: 'Review completed tasks from last week and assign new ones for this sprint.',       status: 'Upcoming',  link: 'https://zoom.us/j/222' },
  { id: 3, title: 'Social Media Strategy',   date: 'Wed, Mar 25, 2026', time: '2:00 PM',  duration: '1 hr',    host: 'Admin (Client)', agenda: 'Discuss content plan for April. Bring ideas for campaigns.',                      status: 'Upcoming',  link: 'https://zoom.us/j/333' },
  { id: 4, title: 'Q1 Performance Review',   date: 'Thu, Mar 26, 2026', time: '11:00 AM', duration: '1 hr',    host: 'Admin (Client)', agenda: 'Individual performance review for Q1. Please prepare your accomplishment report.', status: 'Upcoming',  link: 'https://zoom.us/j/444' },
  { id: 5, title: 'Onboarding — New VA',     date: 'Fri, Mar 27, 2026', time: '3:00 PM',  duration: '1.5 hrs', host: 'Admin (Client)', agenda: 'Orientation session for the new VA. All team members please attend.',            status: 'Upcoming',  link: 'https://zoom.us/j/555' },
  { id: 6, title: 'CRM System Walkthrough',  date: 'Mon, Mar 17, 2026', time: '9:00 AM',  duration: '45 min',  host: 'Admin (Client)', agenda: 'Walkthrough of the new CRM system. Q&A after demo.',                             status: 'Done',      link: '' },
  { id: 7, title: 'Emergency Strategy Call', date: 'Fri, Mar 21, 2026', time: '4:00 PM',  duration: '15 min',  host: 'Admin (Client)', agenda: 'Urgent discussion regarding client deliverables.',                                status: 'Cancelled', link: '' },
]

const EMPTY: Profile = { firstName: '', lastName: '', phone: '', address: '', skills: '', experience: '', availability: '', bio: '', linkedin: '', portfolio: '', sss: '', pagibig: '', philhealth: '', tin: '', validId: '' }

const FIELDS: { key: keyof Profile; label: string; placeholder: string; required: boolean; textarea?: boolean; section?: string; icon?: string }[] = [
  { key: 'firstName',    label: 'First Name',          placeholder: 'e.g. Maria',                              required: true,  icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { key: 'lastName',     label: 'Last Name',           placeholder: 'e.g. Santos',                             required: true,  icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { key: 'phone',        label: 'Phone Number',        placeholder: 'e.g. +63 912 345 6789',                   required: true,  icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z' },
  { key: 'address',      label: 'Address',             placeholder: 'City, Province, Country',                 required: true,  icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' },
  { key: 'skills',       label: 'Key Skills',          placeholder: 'e.g. Email management, CRM, Canva',       required: true,  icon: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18' },
  { key: 'experience',   label: 'Years of Experience', placeholder: 'e.g. 3 years as Executive VA',            required: true,  icon: 'M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z' },
  { key: 'availability', label: 'Availability',        placeholder: 'e.g. Full-time, Mon–Fri 9AM–6PM',         required: true,  icon: 'M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z' },
  { key: 'bio',          label: 'Short Bio',           placeholder: 'Tell us about yourself...',               required: true,  textarea: true, icon: 'M4 6h16M4 12h16M4 18h7' },
  { key: 'linkedin',     label: 'LinkedIn URL',        placeholder: 'https://linkedin.com/in/...',             required: false, icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z' },
  { key: 'portfolio',    label: 'Portfolio URL',       placeholder: 'https://yourportfolio.com',               required: false, icon: 'M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9' },
  { key: 'sss',          label: 'SSS Number',          placeholder: 'e.g. 34-1234567-8',                       required: true,  section: 'Government IDs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z' },
  { key: 'pagibig',      label: 'Pag-IBIG ID Number',  placeholder: 'e.g. 1234-5678-9012',                     required: true,  icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z' },
  { key: 'philhealth',   label: 'PhilHealth Number',   placeholder: 'e.g. 12-345678901-2',                     required: true,  icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z' },
  { key: 'tin',          label: 'TIN Number',          placeholder: 'e.g. 123-456-789-000',                    required: true,  icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z' },
  { key: 'validId',      label: 'Valid ID Type',        placeholder: "e.g. Passport, Driver's License, UMID",   required: true,  icon: 'M10 6H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-5m-4 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1m-4 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m-6 0h6' },
]

// ─── BADGE ────────────────────────────────────────────────────────────────────
function Badge({ status }: { status: MeetingStatus }) {
  const map = {
    Live:      { bg: '#dcfce7', color: '#15803d' },
    Upcoming:  { bg: '#dbeafe', color: '#1e40af' },
    Done:      { bg: '#f3f4f6', color: '#6b7280' },
    Cancelled: { bg: '#fee2e2', color: '#991b1b' },
  }
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
    <div style={{ background: BG, borderRadius: 16, padding: '16px 20px', boxShadow: SHADOW_SM, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 14, flex: '1 1 150px', minWidth: 0 }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: accent ? PRIMARY : PRIMARY_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: accent ? '#fff' : PRIMARY }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10.5, color: SUB, marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: TXT, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 10, color: SUB, marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  )
}

// ─── FIELD COMPONENT (redesigned) ─────────────────────────────────────────────
function Field({ f, value, error, onChange }: {
  f: typeof FIELDS[number]
  value: string
  error?: string
  onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const hasValue = value.trim().length > 0
  const isActive = focused || hasValue

  const borderColor = error ? '#EF4444' : focused ? PRIMARY : BORDER
  const labelColor  = error ? '#EF4444' : focused ? PRIMARY : SUB

  const baseField: React.CSSProperties = {
    width: '100%',
    background: focused ? BG : BG_SOFT,
    border: `1.5px solid ${borderColor}`,
    borderRadius: 12,
    padding: f.textarea ? '28px 14px 10px 40px' : '18px 14px 6px 40px',
    fontSize: 13,
    color: TXT,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
    boxShadow: focused ? `0 0 0 3px ${PRIMARY}18` : 'none',
    resize: 'none',
    lineHeight: 1.5,
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Icon */}
      <div style={{
        position: 'absolute', left: 13,
        top: f.textarea ? 14 : '50%',
        transform: f.textarea ? 'none' : 'translateY(-50%)',
        color: focused ? PRIMARY : '#CBD5E1',
        transition: 'color 0.2s',
        pointerEvents: 'none', zIndex: 1,
      }}>
        {f.icon && <Ico d={f.icon} size={14} sw={1.5} />}
      </div>

      {/* Floating label */}
      <label style={{
        position: 'absolute',
        left: 40,
        top: f.textarea ? 14 : '50%',
        transform: isActive
          ? (f.textarea ? 'translateY(0) scale(0.82)' : 'translateY(-110%) scale(0.82)')
          : (f.textarea ? 'translateY(0)' : 'translateY(-50%)'),
        transformOrigin: 'left center',
        fontSize: 12.5,
        color: labelColor,
        pointerEvents: 'none',
        transition: 'transform 0.18s ease, color 0.18s ease, font-size 0.18s ease',
        fontWeight: isActive ? 600 : 400,
        letterSpacing: isActive ? '0.01em' : 0,
        zIndex: 1,
        background: isActive && !f.textarea ? BG : 'transparent',
        padding: isActive && !f.textarea ? '0 3px' : '0',
        borderRadius: 4,
        whiteSpace: 'nowrap',
      }}>
        {f.label}{f.required && <span style={{ color: PRIMARY }}> *</span>}
      </label>

      {/* Input or Textarea */}
      {f.textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={3}
          placeholder={isActive ? f.placeholder : ''}
          style={baseField}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={isActive ? f.placeholder : ''}
          style={baseField}
        />
      )}

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 10.5, color: '#EF4444' }}>
          <Ico d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" size={11} sw={1.8} />
          {error}
        </div>
      )}
    </div>
  )
}

// ─── PROFILE MODAL ────────────────────────────────────────────────────────────
function ProfileModal({ initial, onClose, onSave }: { initial: Profile; onClose: () => void; onSave: (d: Profile) => void }) {
  const [form, setForm]     = useState<Profile>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof Profile, string>>>({})
  const [saving, setSaving] = useState(false)

  const set = (k: keyof Profile, v: string) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

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

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        style={{ background: BG, borderRadius: 24, boxShadow: SHADOW_LG, width: '100%', maxWidth: 920, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div style={{ padding: '22px 28px 18px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: TXT, letterSpacing: '-0.02em' }}>Complete Your Profile</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>Fill in your details so the admin can get to know you.</div>
            </div>
            <button
              onClick={onClose}
              style={{ background: BG_SOFT, border: `1px solid ${BORDER}`, borderRadius: 10, width: 34, height: 34, cursor: 'pointer', color: MUTED, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
            >
              <Ico d="M18 6L6 18M6 6l12 12" size={14} />
            </button>
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED, marginBottom: 7 }}>
              <span>{filled} of {total} required fields completed</span>
              <span style={{ fontWeight: 700, color: pct === 100 ? '#15803d' : PRIMARY }}>{pct}%</span>
            </div>
            <div style={{ height: 5, background: BG_SOFT, borderRadius: 99, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
              <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'linear-gradient(90deg,#15803d,#22c55e)' : `linear-gradient(90deg,${PRIMARY},#b91c1c)`, borderRadius: 99, transition: 'width 0.35s ease' }} />
            </div>
          </div>
        </div>

        {/* Scrollable fields area */}
        <div style={{ overflowY: 'auto', padding: '22px 28px', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 14px' }}>
            {FIELDS.map((f) => (
              <React.Fragment key={f.key}>
                {/* Section divider */}
                {f.section && (
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 4px' }}>
                    <div style={{ height: 1, flex: 1, background: BORDER }} />
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: PRIMARY, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Ico d="M10 6H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-5m-4 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1m-4 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m-6 0h6" size={12} />
                      {f.section}
                    </span>
                    <div style={{ height: 1, flex: 1, background: BORDER }} />
                  </div>
                )}

                {/* Field wrapper — bio spans 2 cols */}
                <div style={{ gridColumn: f.textarea ? '1 / span 2' : 'auto' }}>
                  <Field
                    f={f}
                    value={form[f.key]}
                    error={errors[f.key]}
                    onChange={(v) => set(f.key, v)}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px 22px', borderTop: `1px solid ${BORDER}`, flexShrink: 0, display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, background: BG_SOFT, color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '13px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ flex: 3, background: saving ? '#9CA3AF' : PRIMARY, color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: saving ? 'none' : `0 4px 14px rgba(128,0,0,0.3)`, fontFamily: 'inherit', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {saving
              ? <><span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Saving…</>
              : <><Ico d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z" d2="M17 21v-8H7v8M7 3v5h8" size={14} /> Save Profile</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MEETING MODAL ────────────────────────────────────────────────────────────
function MeetingModal({ meeting, onClose }: { meeting: Meeting; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: BG, borderRadius: 24, boxShadow: SHADOW_LG, border: `1px solid ${BORDER}`, width: '100%', maxWidth: 480, padding: 28 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div><Badge status={meeting.status} /><div style={{ fontSize: 16, fontWeight: 700, color: TXT, marginTop: 8, letterSpacing: '-0.02em' }}>{meeting.title}</div></div>
          <button onClick={onClose} style={{ background: BG_SOFT, border: `1px solid ${BORDER}`, borderRadius: 10, width: 34, height: 34, cursor: 'pointer', color: MUTED, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ico d="M18 6L6 18M6 6l12 12" size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            { icon: 'M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z', label: 'Date', value: meeting.date },
            { icon: 'M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', label: 'Time', value: `${meeting.time} · ${meeting.duration}` },
            { icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', label: 'Host', value: meeting.host },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: BG_SOFT, borderRadius: 12, padding: '10px 14px', border: `1px solid ${BORDER}` }}>
              <span style={{ color: PRIMARY, flexShrink: 0 }}><Ico d={item.icon} size={14} sw={1.5} /></span>
              <div><div style={{ fontSize: 10, color: SUB, marginBottom: 1 }}>{item.label}</div><div style={{ fontSize: 12.5, fontWeight: 600, color: TXT }}>{item.value}</div></div>
            </div>
          ))}
          <div style={{ background: BG_SOFT, borderRadius: 12, padding: '12px 14px', border: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 10, color: SUB, marginBottom: 4 }}>Agenda</div>
            <div style={{ fontSize: 12.5, color: TXT, lineHeight: 1.65 }}>{meeting.agenda}</div>
          </div>
        </div>
        {(meeting.status === 'Live' || meeting.status === 'Upcoming') && meeting.link ? (
          <button onClick={() => window.open(meeting.link, '_blank')} style={{ width: '100%', background: PRIMARY, color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: `0 4px 14px rgba(128,0,0,0.3)`, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Ico d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.888L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" size={15} />
            {meeting.status === 'Live' ? 'Join Meeting Now' : 'Join Meeting'}
          </button>
        ) : (
          <div style={{ textAlign: 'center', fontSize: 12, color: SUB, padding: '12px', background: BG_SOFT, borderRadius: 12, border: `1px solid ${BORDER}` }}>
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
        @keyframes spin { to { transform: rotate(360deg); } }
        .meet-row:hover { background: ${BG_SOFT} !important; cursor: pointer; }
        .pill-btn:hover { opacity: 0.85; }
        @media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Profile complete banner */}
      {profileDone && profileSaved && (
        <div style={{ background: '#f0fdf4', borderRadius: 16, padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, border: '1px solid #bbf7d0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
              <Ico d="M22 11.08V12a10 10 0 1 1-5.93-9.14" d2="M22 4L12 14.01l-3-3" size={15} sw={2} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#15803d' }}>Profile Complete!</div>
              <div style={{ fontSize: 11, color: '#166534' }}>Your profile has been submitted to the admin.</div>
            </div>
          </div>
          <button onClick={() => setShowProfile(true)} style={{ background: '#fff', border: '1.5px solid #15803d', borderRadius: 10, padding: '6px 16px', fontSize: 11.5, fontWeight: 600, color: '#15803d', cursor: 'pointer', fontFamily: 'inherit' }}>
            Edit Profile
          </button>
        </div>
      )}

      {/* Greeting */}
      <div style={{ background: BG, borderRadius: 16, padding: '20px 24px', boxShadow: SHADOW_SM, border: `1px solid ${BORDER}`, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: SUB, marginBottom: 4 }}>{greeting} 👋</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: TXT, letterSpacing: '-0.02em' }}>
            Welcome back, <span style={{ color: PRIMARY }}>{profile.firstName || 'VA'}</span>
          </div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>Here are your scheduled meetings from the admin.</div>
        </div>
        {liveCount > 0 && (
          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #bbf7d0' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#15803d', display: 'inline-block', animation: 'livepulse 1.4s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#15803d' }}>A meeting is live right now!</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <StatCard label="Total Meetings" value={MEETINGS.length} sub="Assigned to you" accent icon={<Ico d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.888L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" size={17} />} />
        <StatCard label="Live Now"       value={liveCount}     sub="Join immediately" icon={<Ico d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.888L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" size={17} />} />
        <StatCard label="Upcoming"       value={upcomingCount} sub="This week"        icon={<Ico d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" size={17} />} />
        <StatCard label="Attended"       value={doneCount}     sub="Completed"        icon={<Ico d="M22 11.08V12a10 10 0 1 1-5.93-9.14" d2="M22 4L12 14.01l-3-3" size={17} />} />
      </div>

      {/* Main grid */}
      <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 272px', gap: 16, alignItems: 'start' }}>

        {/* Meetings list */}
        <div style={{ background: BG, borderRadius: 16, boxShadow: SHADOW_SM, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: TXT, flex: 1, letterSpacing: '-0.01em' }}>My Meetings</span>
            {(['All', 'Live', 'Upcoming', 'Done', 'Cancelled'] as const).map(f => (
              <button key={f} className="pill-btn" onClick={() => setFilter(f)}
                style={{ background: filter === f ? PRIMARY : BG_SOFT, color: filter === f ? '#fff' : MUTED, border: `1px solid ${filter === f ? PRIMARY : BORDER}`, borderRadius: 99, padding: '5px 13px', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit' }}>
                {f}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: SUB, fontSize: 12 }}>No meetings found.</div>
          ) : filtered.map((m, i) => (
            <div key={m.id} className="meet-row" onClick={() => setSelected(m)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : 'none', transition: 'background 0.15s' }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: PRIMARY_LIGHT, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid rgba(128,0,0,0.1)` }}>
                <span style={{ fontSize: 9, color: PRIMARY, fontWeight: 700, textTransform: 'uppercase', lineHeight: 1 }}>{m.date.split(' ')[0].replace(',', '')}</span>
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
                  style={{ background: m.status === 'Live' ? PRIMARY : BG_SOFT, color: m.status === 'Live' ? '#fff' : PRIMARY, border: `1px solid ${m.status === 'Live' ? PRIMARY : BORDER}`, borderRadius: 10, padding: '7px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.15s' }}>
                  <Ico d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.888L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" size={12} />
                  {m.status === 'Live' ? 'Join Now' : 'Join'}
                </button>
              ) : (
                <span style={{ fontSize: 11, color: SUB, flexShrink: 0 }}>{m.status === 'Done' ? '✓ Done' : '✕ Cancelled'}</span>
              )}
            </div>
          ))}
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Profile card */}
          <div style={{ background: BG, borderRadius: 16, boxShadow: SHADOW_SM, border: `1px solid ${BORDER}`, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TXT, letterSpacing: '-0.01em' }}>Your Profile</div>
              {profileDone && <span style={{ fontSize: 10, fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: 99 }}>Complete</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: PRIMARY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : '?'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: TXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}`.trim() : 'Your Name'}
                </div>
                <div style={{ fontSize: 11, color: SUB, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{profile.skills || 'No skills added yet'}</div>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED, marginBottom: 6 }}>
                <span>Profile completion</span>
                <span style={{ fontWeight: 700, color: profileDone ? '#15803d' : PRIMARY }}>{profilePct}%</span>
              </div>
              <div style={{ height: 5, background: BG_SOFT, borderRadius: 99, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                <div style={{ height: '100%', width: `${profilePct}%`, background: profileDone ? 'linear-gradient(90deg,#15803d,#22c55e)' : `linear-gradient(90deg,${PRIMARY},#b91c1c)`, borderRadius: 99, transition: 'width 0.35s ease' }} />
              </div>
            </div>
            <button onClick={() => setShowProfile(true)}
              style={{ width: '100%', background: profileDone ? BG_SOFT : PRIMARY, color: profileDone ? TXT : '#fff', border: `1px solid ${profileDone ? BORDER : PRIMARY}`, borderRadius: 10, padding: '10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {profileDone
                ? <><Ico d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={12} /> Edit Profile</>
                : <>Complete Profile <Ico d="M5 12h14M12 5l7 7-7 7" size={12} /></>
              }
            </button>
          </div>

          {/* Next meeting */}
          {nextMeeting && (
            <div style={{ background: BG, borderRadius: 16, boxShadow: SHADOW_SM, border: `1px solid ${BORDER}`, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: nextMeeting.status === 'Live' ? '#15803d' : PRIMARY, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                {nextMeeting.status === 'Live'
                  ? <><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#15803d', display: 'inline-block', animation: 'livepulse 1.4s infinite' }} /> Happening Now</>
                  : <><Ico d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" size={11} sw={2} /> Next Meeting</>
                }
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: TXT, marginBottom: 8, letterSpacing: '-0.01em' }}>{nextMeeting.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 12 }}>
                {[
                  { icon: 'M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z', text: nextMeeting.date },
                  { icon: 'M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', text: `${nextMeeting.time} · ${nextMeeting.duration}` },
                ].map(item => (
                  <div key={item.text} style={{ fontSize: 11.5, color: MUTED, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Ico d={item.icon} size={11} sw={1.5} />{item.text}
                  </div>
                ))}
              </div>
              <div style={{ background: BG_SOFT, borderRadius: 10, padding: '10px 12px', border: `1px solid ${BORDER}`, fontSize: 11.5, color: TXT, lineHeight: 1.65, marginBottom: 12 }}>
                <span style={{ fontSize: 10, color: SUB, display: 'block', marginBottom: 3 }}>Agenda</span>
                {nextMeeting.agenda}
              </div>
              {nextMeeting.link && (
                <button onClick={() => window.open(nextMeeting.link, '_blank')}
                  style={{ width: '100%', background: PRIMARY, color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: `0 4px 12px rgba(128,0,0,0.25)`, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Ico d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.888L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" size={13} />
                  {nextMeeting.status === 'Live' ? 'Join Now' : 'Join Meeting'}
                </button>
              )}
            </div>
          )}

          {/* Reminders */}
          <div style={{ background: BG, borderRadius: 16, boxShadow: SHADOW_SM, border: `1px solid ${BORDER}`, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TXT, marginBottom: 12, letterSpacing: '-0.01em' }}>Reminders</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MEETINGS.filter(m => m.status === 'Upcoming').slice(0, 3).map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: BG_SOFT, borderRadius: 10, border: `1px solid ${BORDER}` }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: PRIMARY, marginTop: 5, flexShrink: 0 }} />
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

      {selected    && <MeetingModal meeting={selected} onClose={() => setSelected(null)} />}
      {showProfile && <ProfileModal initial={profile} onClose={() => setShowProfile(false)} onSave={handleSaveProfile} />}
    </div>
  )
}