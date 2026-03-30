'use client'
import { useState } from 'react'

type App = { id: number; name: string; role: string; exp: string; rate: number; skills: string[]; status: 'New' | 'Reviewed' | 'Shortlisted' | 'Rejected' }

const applications: App[] = [
  { id: 1, name: 'Candidate 1', role: 'Social Media Expert',  exp: '3 yrs', rate: 8,  skills: ['Facebook Ads', 'Canva', 'Copywriting'], status: 'New' },
  { id: 2, name: 'Candidate 2', role: 'Executive Assistant',  exp: '5 yrs', rate: 7,  skills: ['Scheduling', 'Email Mgmt', 'Trello'],   status: 'Reviewed' },
  { id: 3, name: 'Candidate 3', role: 'Customer Support VA',  exp: '2 yrs', rate: 6,  skills: ['Live Chat', 'Zendesk', 'CRM'],          status: 'Shortlisted' },
  { id: 4, name: 'Candidate 4', role: 'Data Entry Specialist', exp: '4 yrs', rate: 5, skills: ['Excel', 'Google Sheets', 'Accuracy'],   status: 'New' },
]

const statusStyle: Record<App['status'], { bg: string; color: string }> = {
  New:        { bg: '#eff6ff', color: '#2563eb' },
  Reviewed:   { bg: '#f5f3ff', color: '#7c3aed' },
  Shortlisted:{ bg: '#f0fdf4', color: '#16a34a' },
  Rejected:   { bg: '#fef2f2', color: '#dc2626' },
}

export default function ViewApplication() {
  const [selected, setSelected] = useState<App | null>(null)

  return (
    <div style={{ padding: 24, background: '#fdfcfc', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>View Applications</h1>
        <p style={{ fontSize: 13, color: '#555', margin: '4px 0 0' }}>Review applications submitted by VA candidates.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 320px' : '1fr', gap: 20, alignItems: 'start' }}>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {applications.map(app => (
            <div key={app.id} onClick={() => setSelected(app.id === selected?.id ? null : app)}
              style={{ background: '#fff', border: `1.5px solid ${selected?.id === app.id ? '#800000' : '#e0dcdc'}`, borderRadius: 14, padding: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#800000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                {app.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 14 }}>{app.name}</div>
                <div style={{ fontSize: 12, color: '#800000', fontWeight: 600 }}>{app.role}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{app.exp} experience · ${app.rate}/hr</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: statusStyle[app.status].bg, color: statusStyle[app.status].color }}>
                {app.status}
              </span>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 16, padding: 22, position: 'sticky', top: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Application Detail</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#800000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 22, margin: '0 auto 14px' }}>
              {selected.name.charAt(0)}
            </div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 15 }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: '#800000', fontWeight: 600 }}>{selected.role}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, color: '#555', marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Experience</span><span>{selected.exp}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#aaa' }}>Rate</span><span>${selected.rate}/hr</span></div>
              <div><span style={{ color: '#aaa' }}>Skills</span><div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selected.skills.map(s => <span key={s} style={{ background: '#f5f2f2', borderRadius: 6, padding: '3px 10px', fontSize: 11 }}>{s}</span>)}
              </div></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button style={{ width: '100%', padding: '9px', borderRadius: 8, background: '#800000', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Shortlist</button>
              <button style={{ width: '100%', padding: '9px', borderRadius: 8, background: '#fff', border: '1.5px solid #800000', color: '#800000', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Schedule Interview</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}