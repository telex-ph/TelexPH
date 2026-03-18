'use client'
import { useState } from 'react'

const vas = [
  { id: 1, name: 'Maria Santos',   role: 'Social Media Expert',  since: 'Jan 2025', hours: 120, status: 'Active' },
  { id: 2, name: 'Jose Reyes',     role: 'Executive Assistant',  since: 'Feb 2025', hours: 88,  status: 'Active' },
  { id: 3, name: 'Ana Cruz',       role: 'Customer Support VA',  since: 'Mar 2025', hours: 40,  status: 'On Leave' },
]

export default function MyVAs() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div style={{ padding: 24, background: '#fdfcfc', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>My VAs</h1>
        <p style={{ fontSize: 13, color: '#555', margin: '4px 0 0' }}>Manage your active virtual assistants.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {vas.map(va => (
          <div key={va.id} style={{ background: '#fff', border: `1.5px solid ${selected === va.id ? '#800000' : '#e0dcdc'}`, borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'border 0.15s' }} onClick={() => setSelected(va.id === selected ? null : va.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#800000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>
                {va.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 14 }}>{va.name}</div>
                <div style={{ fontSize: 12, color: '#800000', fontWeight: 600 }}>{va.role}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#777', marginBottom: 14 }}>
              <span>Since {va.since}</span>
              <span>{va.hours} hrs logged</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: va.status === 'Active' ? '#f0fdf4' : '#fff7ed', color: va.status === 'Active' ? '#16a34a' : '#ea580c' }}>
                {va.status}
              </span>
              <button style={{ padding: '6px 14px', borderRadius: 8, background: '#fff', border: '1.5px solid #800000', color: '#800000', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}