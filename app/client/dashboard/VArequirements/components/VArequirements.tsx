'use client'
import { useState } from 'react'

type Status = 'Pending' | 'Matched' | 'Rejected'

type Requirement = {
  id: number
  role: string
  skills: string
  hours: number
  type: 'Full-time' | 'Part-time'
  budget: number
  notes: string
  status: Status
  date: string
}

const INITIAL: Requirement[] = [
  { id: 1, role: 'Social Media Manager',  skills: 'Canva, Meta Ads, Copywriting', hours: 40, type: 'Full-time', budget: 8, notes: 'Must be available Mon–Fri, 9AM–5PM PHT.',       status: 'Matched',  date: 'Mar 1, 2025'  },
  { id: 2, role: 'Executive Assistant',   skills: 'Scheduling, Email, Trello',    hours: 20, type: 'Part-time', budget: 7, notes: 'Needs strong English communication skills.',    status: 'Pending',  date: 'Mar 8, 2025'  },
  { id: 3, role: 'Customer Support VA',   skills: 'Live Chat, Zendesk, CRM',      hours: 40, type: 'Full-time', budget: 6, notes: 'Experience with e-commerce support preferred.', status: 'Pending',  date: 'Mar 12, 2025' },
  { id: 4, role: 'Data Entry Specialist', skills: 'Excel, Google Sheets',          hours: 20, type: 'Part-time', budget: 5, notes: 'High accuracy required. WPM 60+.',              status: 'Rejected', date: 'Feb 20, 2025' },
]

const STATUS_STYLE: Record<Status, { bg: string; color: string; dot: string }> = {
  Pending:  { bg: '#fff7ed', color: '#ea580c', dot: '#fb923c' },
  Matched:  { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  Rejected: { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444' },
}

const EMPTY_FORM = { role: '', skills: '', hours: '', type: 'Full-time' as 'Full-time' | 'Part-time', budget: '', notes: '' }

export default function VArequirements() {
  const [list, setList]         = useState<Requirement[]>(INITIAL)
  const [selected, setSelected] = useState<Requirement | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter]     = useState<Status | 'All'>('All')
  const [form, setForm]         = useState(EMPTY_FORM)
  const [errors, setErrors]     = useState<Partial<typeof EMPTY_FORM>>({})

  const filtered = filter === 'All' ? list : list.filter(r => r.status === filter)

  const validate = () => {
    const e: Partial<typeof EMPTY_FORM> = {}
    if (!form.role.trim())   e.role   = 'Role is required'
    if (!form.skills.trim()) e.skills = 'Skills are required'
    if (!form.hours)         e.hours  = 'Hours is required'
    if (!form.budget)        e.budget = 'Budget is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = () => {
    if (!validate()) return
    const newReq: Requirement = {
      id: Date.now(),
      role: form.role,
      skills: form.skills,
      hours: Number(form.hours),
      type: form.type,
      budget: Number(form.budget),
      notes: form.notes,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }
    setList(l => [newReq, ...l])
    setForm(EMPTY_FORM)
    setErrors({})
    setShowForm(false)
  }

  const deleteReq = (id: number) => {
    setList(l => l.filter(r => r.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const field = (key: keyof typeof EMPTY_FORM, placeholder: string, type = 'text') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })) }}
        style={{ padding: '9px 12px', borderRadius: 8, border: `1px solid ${errors[key] ? '#ef4444' : '#e0dcdc'}`, fontSize: 12, outline: 'none', fontFamily: "'Poppins', sans-serif" }}
      />
      {errors[key] && <span style={{ fontSize: 10, color: '#ef4444' }}>{errors[key]}</span>}
    </div>
  )

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: 24, background: '#fdfcfc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>VA Requirements</h1>
          <p style={{ fontSize: 13, color: '#777', margin: '4px 0 0' }}>Submit and track your virtual assistant hiring requests.</p>
        </div>
        <button
          onClick={() => { setShowForm(s => !s); setErrors({}) }}
          style={{ padding: '9px 20px', borderRadius: 9, background: '#800000', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
        >
          {showForm ? '✕ Cancel' : '+ New Requirement'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 14, padding: 22, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>New VA Requirement</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
            {field('role',   'Role (e.g. Social Media VA)')}
            {field('skills', 'Required skills (comma-separated)')}
            {field('hours',  'Hours per week', 'number')}
            {field('budget', 'Budget ($/hr)', 'number')}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {(['Full-time', 'Part-time'] as const).map(t => (
              <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                style={{ padding: '7px 16px', borderRadius: 20, border: '1.5px solid', borderColor: form.type === t ? '#800000' : '#e0dcdc', background: form.type === t ? '#800000' : '#fff', color: form.type === t ? '#fff' : '#555', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                {t}
              </button>
            ))}
          </div>
          <textarea
            placeholder="Additional notes (optional)"
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            rows={2}
            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e0dcdc', fontSize: 12, resize: 'none', outline: 'none', marginBottom: 14, fontFamily: "'Poppins', sans-serif" }}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={submit} style={{ flex: 1, padding: '9px', borderRadius: 8, background: '#800000', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              Submit Requirement
            </button>
            <button onClick={() => { setShowForm(false); setErrors({}) }} style={{ padding: '9px 20px', borderRadius: 8, background: '#fff', border: '1.5px solid #e0dcdc', color: '#555', fontSize: 12, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {(['All', 'Pending', 'Matched', 'Rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '6px 16px', borderRadius: 20, border: '1.5px solid', borderColor: filter === f ? '#800000' : '#e0dcdc', background: filter === f ? '#800000' : '#fff', color: filter === f ? '#fff' : '#555', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            {f}
            <span style={{ marginLeft: 5, fontSize: 10, opacity: 0.7 }}>
              {f === 'All' ? list.length : list.filter(r => r.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: 60, color: '#bbb' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>No requirements found.</div>
        </div>
      )}

      {/* List + Detail panel */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 300px' : '1fr', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(req => (
            <div
              key={req.id}
              onClick={() => setSelected(req.id === selected?.id ? null : req)}
              style={{ background: '#fff', border: `1.5px solid ${selected?.id === req.id ? '#800000' : '#e0dcdc'}`, borderRadius: 14, padding: 18, cursor: 'pointer', transition: 'border 0.15s' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 14 }}>{req.role}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: STATUS_STYLE[req.status].bg, color: STATUS_STYLE[req.status].color, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: STATUS_STYLE[req.status].dot, flexShrink: 0 }} />
                      {req.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#777', marginBottom: 6 }}>{req.skills}</div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 11, color: '#aaa', flexWrap: 'wrap' }}>
                    <span>{req.hours} hrs/week</span>
                    <span>{req.type}</span>
                    <span>${req.budget}/hr</span>
                    <span>Submitted {req.date}</span>
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); deleteReq(req.id) }}
                  title="Delete"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ddd', fontSize: 16, lineHeight: 1, flexShrink: 0, padding: 2 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#ddd')}
                >✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 16, padding: 22, position: 'sticky', top: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Requirement Details</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '5px 14px', borderRadius: 20, background: STATUS_STYLE[selected.status].bg, color: STATUS_STYLE[selected.status].color }}>
                {selected.status}
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 14 }}>{selected.role}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, marginBottom: 18 }}>
              {[
                { label: 'Skills',     value: selected.skills },
                { label: 'Hours/week', value: `${selected.hours} hrs` },
                { label: 'Type',       value: selected.type },
                { label: 'Budget',     value: `$${selected.budget}/hr` },
                { label: 'Submitted',  value: selected.date },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f5f2f2', paddingBottom: 8 }}>
                  <span style={{ color: '#aaa' }}>{row.label}</span>
                  <span style={{ fontWeight: 500, color: '#1a1a2e', textAlign: 'right', maxWidth: '55%' }}>{row.value}</span>
                </div>
              ))}
              {selected.notes && (
                <div>
                  <div style={{ color: '#aaa', marginBottom: 4 }}>Notes</div>
                  <div style={{ fontSize: 11.5, color: '#555', lineHeight: 1.5 }}>{selected.notes}</div>
                </div>
              )}
            </div>
            <button
              onClick={() => deleteReq(selected.id)}
              style={{ width: '100%', padding: '9px', borderRadius: 8, background: '#fff', border: '1.5px solid #ef4444', color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              Delete Requirement
            </button>
          </div>
        )}
      </div>
    </div>
  )
}