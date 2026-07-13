'use client'
import type { VA } from './data'
import { AVAILABILITY_COLORS } from './data'

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

export default function VAProfileModal({
  va,
  isShortlisted,
  onClose,
  onToggleShortlist,
  onSchedule,
  onHire,
}: {
  va: VA
  isShortlisted: boolean
  onClose: () => void
  onToggleShortlist: () => void
  onSchedule: () => void
  onHire: () => void
}) {
  const avail = AVAILABILITY_COLORS[va.availability]

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 22, boxShadow: '0 40px 100px rgba(0,0,0,0.28)', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Header band */}
        <div style={{ position: 'relative', background: 'linear-gradient(135deg,#800000 0%,#b03030 100%)', padding: '28px 26px 22px' }}>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
              {va.avatar}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 19, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{va.name}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,230,230,0.9)', marginBottom: 8 }}>{va.role}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <Stars rating={va.rating} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{va.rating}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,230,230,0.75)' }}>({va.reviews} reviews)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 20, padding: '2px 10px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: avail.dot }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{va.availability}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '22px 26px' }}>
          {/* Quick facts */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            {[['LOCATION', va.location], ['LANGUAGES', va.languages], ['EXPERIENCE', va.experience], ['RESPONSE', va.responseTime]].map(([k, val]) => (
              <div key={k} style={{ background: '#f8f6f6', border: '1px solid #e8e4e4', borderRadius: 8, padding: '6px 12px' }}>
                <div style={{ fontSize: 9, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e' }}>{val}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: '#444', lineHeight: 1.7, margin: '0 0 20px' }}>{va.bio}</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Hourly Rate', value: `$${va.hourlyRate}/hr` },
              { label: 'Jobs Completed', value: String(va.completedJobs) },
              { label: 'Avg. Response', value: va.responseTime },
            ].map(s => (
              <div key={s.label} style={{ background: '#f8f6f6', border: '1px solid #e8e4e4', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#800000', marginBottom: 3 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Skills &amp; Expertise</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {va.skills.map(s => <span key={s} style={{ background: '#f8f6f6', border: '1px solid #e0dcdc', borderRadius: 7, padding: '5px 12px', fontSize: 12, color: '#333' }}>{s}</span>)}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onToggleShortlist}
              style={{
                flex: '0 0 auto', width: 46, background: isShortlisted ? '#fff5f5' : '#fff', color: '#800000',
                border: `1.5px solid ${isShortlisted ? '#800000' : '#d5d0d0'}`, borderRadius: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
            >
              <svg width={17} height={17} viewBox="0 0 24 24" fill={isShortlisted ? '#800000' : 'none'} stroke="#800000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button
              onClick={onSchedule}
              disabled={va.availability === 'On Leave'}
              style={{
                flex: 1, background: '#fff', color: va.availability === 'On Leave' ? '#ccc' : '#800000',
                border: `1.5px solid ${va.availability === 'On Leave' ? '#eee' : '#d5d0d0'}`, borderRadius: 12,
                padding: '12px 16px', fontSize: 12, fontWeight: 600, cursor: va.availability === 'On Leave' ? 'not-allowed' : 'pointer',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Schedule Interview
            </button>
            <button
              onClick={onHire}
              disabled={va.availability === 'On Leave'}
              style={{
                flex: 1, background: va.availability === 'On Leave' ? '#f0edec' : 'linear-gradient(135deg,#800000,#a02020)',
                color: va.availability === 'On Leave' ? '#bbb' : '#fff', border: 'none', borderRadius: 12,
                padding: '12px 16px', fontSize: 12, fontWeight: 700, cursor: va.availability === 'On Leave' ? 'not-allowed' : 'pointer',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {va.availability === 'On Leave' ? 'Unavailable' : 'Hire Now →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
