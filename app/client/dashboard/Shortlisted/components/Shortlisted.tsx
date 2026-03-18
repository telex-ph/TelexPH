'use client'
import { useState } from 'react'

type Candidate = {
  id: number
  name: string
  role: string
  rating: number
  experience: string
  rate: number
  skills: string[]
  availability: string
}

const INITIAL: Candidate[] = [
  { id: 1, name: 'Maria Santos',   role: 'Social Media Expert',   rating: 4.8, experience: '3 yrs', rate: 8,  skills: ['Facebook Ads', 'Canva', 'Copywriting'],    availability: 'Full-time' },
  { id: 2, name: 'Jose Reyes',     role: 'Executive Assistant',   rating: 4.6, experience: '5 yrs', rate: 7,  skills: ['Scheduling', 'Email Mgmt', 'Trello'],       availability: 'Part-time' },
  { id: 3, name: 'Ana Cruz',       role: 'Customer Support VA',   rating: 4.9, experience: '2 yrs', rate: 6,  skills: ['Live Chat', 'Zendesk', 'CRM'],              availability: 'Full-time' },
  { id: 4, name: 'Carlo Mendoza',  role: 'Data Entry Specialist', rating: 4.5, experience: '4 yrs', rate: 5,  skills: ['Excel', 'Google Sheets', 'Data Cleaning'],  availability: 'Full-time' },
]

export default function Shortlisted() {
  const [list, setList]       = useState<Candidate[]>(INITIAL)
  const [selected, setSelected] = useState<Candidate | null>(null)
  const [sent, setSent]       = useState<number[]>([])

  const remove = (id: number) => {
    setList(l => l.filter(c => c.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const sendRequest = (id: number) => setSent(s => [...s, id])

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: 24, background: '#fdfcfc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Shortlisted</h1>
        <p style={{ fontSize: 13, color: '#777', margin: '4px 0 0' }}>
          VAs you've saved for further review. &nbsp;
          <span style={{ fontWeight: 600, color: '#800000' }}>{list.length} saved</span>
        </p>
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 80, color: '#bbb' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>♡</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>No shortlisted VAs yet.</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Browse VAs and save candidates here.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 300px' : 'repeat(auto-fill, minmax(270px, 1fr))', gap: 20, alignItems: 'start' }}>

          {/* Cards */}
          <div style={{ display: selected ? 'flex' : 'contents', flexDirection: 'column', gap: 16 }}>
            {list.map(c => (
              <div
                key={c.id}
                onClick={() => setSelected(c.id === selected?.id ? null : c)}
                style={{ background: '#fff', border: `1.5px solid ${selected?.id === c.id ? '#800000' : '#e0dcdc'}`, borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'border 0.15s', display: selected ? 'flex' : 'block', alignItems: 'center', gap: 16 }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: selected ? 0 : 14, flex: selected ? 1 : undefined }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Avatar */}
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#800000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 17, flexShrink: 0 }}>
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 14 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: '#800000', fontWeight: 600 }}>{c.role}</div>
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{c.experience} exp · ${c.rate}/hr · {c.availability}</div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={e => { e.stopPropagation(); remove(c.id) }}
                    title="Remove from shortlist"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#800000', fontSize: 17, lineHeight: 1, flexShrink: 0 }}
                  >♥</button>
                </div>

                {/* Skills + action — only show in grid (non-selected) mode */}
                {!selected && (
                  <>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                      <span style={{ fontSize: 11, color: '#555', marginRight: 4 }}>⭐ {c.rating}</span>
                      {c.skills.map(s => (
                        <span key={s} style={{ background: '#f5f2f2', borderRadius: 6, padding: '2px 8px', fontSize: 10, color: '#666' }}>{s}</span>
                      ))}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); sendRequest(c.id) }}
                      disabled={sent.includes(c.id)}
                      style={{ width: '100%', padding: '8px', borderRadius: 8, background: sent.includes(c.id) ? '#f5f2f2' : '#800000', border: 'none', color: sent.includes(c.id) ? '#aaa' : '#fff', fontSize: 12, fontWeight: 700, cursor: sent.includes(c.id) ? 'default' : 'pointer' }}
                    >
                      {sent.includes(c.id) ? '✓ Request Sent' : 'Send Hire Request'}
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 16, padding: 22, position: 'sticky', top: 16 }}>
              {/* Close */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>VA Profile</span>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 16 }}>✕</button>
              </div>

              {/* Avatar */}
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#800000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 22, margin: '0 auto 12px' }}>
                {selected.name.charAt(0)}
              </div>
              <div style={{ textAlign: 'center', marginBottom: 18 }}>
                <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 15 }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: '#800000', fontWeight: 600 }}>{selected.role}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>⭐ {selected.rating} rating</div>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, color: '#555', marginBottom: 18 }}>
                {[
                  { label: 'Experience',    value: selected.experience },
                  { label: 'Rate',          value: `$${selected.rate}/hr` },
                  { label: 'Availability',  value: selected.availability },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f5f2f2', paddingBottom: 8 }}>
                    <span style={{ color: '#aaa' }}>{row.label}</span>
                    <span style={{ fontWeight: 500, color: '#1a1a2e' }}>{row.value}</span>
                  </div>
                ))}
                <div>
                  <div style={{ color: '#aaa', marginBottom: 6 }}>Skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selected.skills.map(s => (
                      <span key={s} style={{ background: '#f5f2f2', borderRadius: 6, padding: '3px 10px', fontSize: 11 }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={() => sendRequest(selected.id)}
                  disabled={sent.includes(selected.id)}
                  style={{ width: '100%', padding: '9px', borderRadius: 8, background: sent.includes(selected.id) ? '#f5f2f2' : '#800000', border: 'none', color: sent.includes(selected.id) ? '#aaa' : '#fff', fontSize: 12, fontWeight: 700, cursor: sent.includes(selected.id) ? 'default' : 'pointer' }}
                >
                  {sent.includes(selected.id) ? '✓ Request Sent' : 'Send Hire Request'}
                </button>
                <button
                  onClick={() => remove(selected.id)}
                  style={{ width: '100%', padding: '9px', borderRadius: 8, background: '#fff', border: '1.5px solid #e0dcdc', color: '#800000', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  Remove from Shortlist
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}