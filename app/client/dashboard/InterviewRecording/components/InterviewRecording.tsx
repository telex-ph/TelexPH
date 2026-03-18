'use client'
import { useState } from 'react'

const recordings = [
  { id: 1, name: 'Candidate 1', role: 'Social Media Expert',    date: 'Mar 10, 2025', duration: '32:14', status: 'Reviewed' },
  { id: 2, name: 'Candidate 2', role: 'Executive Assistant',    date: 'Mar 12, 2025', duration: '28:05', status: 'Pending' },
  { id: 3, name: 'Candidate 3', role: 'Customer Support VA',    date: 'Mar 15, 2025', duration: '41:52', status: 'Pending' },
]

export default function InterviewRecording() {
  const [playing, setPlaying] = useState<number | null>(null)

  return (
    <div style={{ padding: 24, background: '#fdfcfc', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Interview Recordings</h1>
        <p style={{ fontSize: 13, color: '#555', margin: '4px 0 0' }}>Review recorded interviews from your VA candidates.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {recordings.map(rec => (
          <div key={rec.id} style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 14, padding: 20, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#800000', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>
              {rec.name.charAt(0)}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 14 }}>{rec.name}</div>
              <div style={{ fontSize: 12, color: '#800000', fontWeight: 600 }}>{rec.role}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{rec.date} · {rec.duration}</div>
            </div>

            {/* Status badge */}
            <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: rec.status === 'Reviewed' ? '#f0fdf4' : '#fff7ed', color: rec.status === 'Reviewed' ? '#16a34a' : '#ea580c' }}>
              {rec.status}
            </span>

            {/* REC badge + Play */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 9, fontWeight: 700, background: '#ef4444', color: '#fff', padding: '3px 7px', borderRadius: 4 }}>REC</span>
              <button
                onClick={() => setPlaying(playing === rec.id ? null : rec.id)}
                style={{ padding: '8px 18px', borderRadius: 8, background: playing === rec.id ? '#800000' : '#fff', border: '1.5px solid #800000', color: playing === rec.id ? '#fff' : '#800000', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                {playing === rec.id ? '⏸ Pause' : '▶ Play'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}