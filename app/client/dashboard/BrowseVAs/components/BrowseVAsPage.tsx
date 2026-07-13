'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { VA_LIST, AVAILABILITY_COLORS, SORT_OPTIONS, type VA } from './data'
import VAProfileModal from './VAProfileModal'

const SHORTLIST_KEY = 'telexph_shortlisted_va_ids'

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={11} height={11} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

function VACard({ va, isShortlisted, onOpen, onToggleShortlist }: { va: VA; isShortlisted: boolean; onOpen: () => void; onToggleShortlist: () => void }) {
  const avail = AVAILABILITY_COLORS[va.availability]

  return (
    <div
      className="va-choose-card"
      style={{
        background: '#fff', borderRadius: 16, border: '1px solid #f0edec', padding: 20,
        display: 'flex', flexDirection: 'column', gap: 14,
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)', transition: 'all 0.2s ease', position: 'relative',
      }}
    >
      <button
        onClick={e => { e.stopPropagation(); onToggleShortlist() }}
        title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
        style={{
          position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: 9,
          background: isShortlisted ? '#fff5f5' : '#fff', border: `1.5px solid ${isShortlisted ? '#800000' : '#e0dcdc'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2,
        }}
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill={isShortlisted ? '#800000' : 'none'} stroke="#800000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#800000,#c05050)', color: '#fff', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {va.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingRight: 30 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1a2e', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{va.name}</div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 5 }}>{va.role}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Stars rating={va.rating} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#1a1a2e' }}>{va.rating}</span>
            <span style={{ fontSize: 10, color: '#aaa' }}>({va.reviews})</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: avail.bg, borderRadius: 20, padding: '3px 9px', width: 'fit-content' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: avail.dot }} />
        <span style={{ fontSize: 10, fontWeight: 600, color: avail.color }}>{va.availability}</span>
      </div>

      <p style={{ fontSize: 11.5, color: '#555', lineHeight: 1.55, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{va.bio}</p>

      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {va.skills.slice(0, 4).map(s => (
          <span key={s} style={{ fontSize: 10, background: '#f5f3f3', color: '#555', borderRadius: 5, padding: '2px 7px', border: '1px solid #ece8e8' }}>{s}</span>
        ))}
        {va.skills.length > 4 && <span style={{ fontSize: 10, color: '#aaa', padding: '2px 4px' }}>+{va.skills.length - 4}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {[{ label: 'Rate', value: `$${va.hourlyRate}/hr` }, { label: 'Jobs Done', value: String(va.completedJobs) }, { label: 'Response', value: va.responseTime }].map(s => (
          <div key={s.label} style={{ background: '#faf9f9', borderRadius: 8, padding: '8px 6px', textAlign: 'center', border: '1px solid #f0edec' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>{s.value}</div>
            <div style={{ fontSize: 9.5, color: '#aaa', marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onOpen}
        disabled={va.availability === 'On Leave'}
        style={{
          width: '100%', padding: '10px 0', background: va.availability === 'On Leave' ? '#f0edec' : '#800000',
          color: va.availability === 'On Leave' ? '#bbb' : '#fff', border: 'none', borderRadius: 9,
          fontSize: 12, fontWeight: 600, cursor: va.availability === 'On Leave' ? 'not-allowed' : 'pointer', letterSpacing: '0.02em',
        }}
      >
        {va.availability === 'On Leave' ? 'Unavailable' : 'View Profile →'}
      </button>
    </div>
  )
}

export default function BrowseVAsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<typeof SORT_OPTIONS[number]>('Top Rated')
  const [onlyAvail, setOnlyAvail] = useState(false)
  const [activeVA, setActiveVA] = useState<VA | null>(null)
  const [shortlisted, setShortlisted] = useState<string[]>([])
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SHORTLIST_KEY)
      if (saved) setShortlisted(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  const toggleShortlist = (vaId: string) => {
    setShortlisted(prev => {
      const next = prev.includes(vaId) ? prev.filter(id => id !== vaId) : [...prev, vaId]
      try { localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      showToast(prev.includes(vaId) ? 'Removed from shortlist' : 'Added to shortlist')
      return next
    })
  }

  let filtered = VA_LIST
  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(v => v.name.toLowerCase().includes(q) || v.role.toLowerCase().includes(q) || v.skills.some(s => s.toLowerCase().includes(q)))
  }
  if (onlyAvail) filtered = filtered.filter(v => v.availability === 'Available')
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'Top Rated') return b.rating - a.rating
    if (sortBy === 'Most Reviews') return b.reviews - a.reviews
    if (sortBy === 'Lowest Rate') return a.hourlyRate - b.hourlyRate
    if (sortBy === 'Most Experienced') return parseInt(b.experience) - parseInt(a.experience)
    return 0
  })

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: '24px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .va-choose-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.1) !important; transform: translateY(-2px); border-color: #e8c0c0 !important; }
        .va-choose-card:hover button:not(:disabled):not([title]) { background: #6a0000 !important; }
        .sort-btn { background: #fff; border: 1.5px solid #e0dcdc; border-radius: 8px; padding: 6px 12px; font-size: 11.5px; font-family: 'Poppins', sans-serif; font-weight: 500; color: #555; cursor: pointer; transition: all 0.15s; }
        .sort-btn:hover, .sort-btn.active { background: #800000; color: #fff; border-color: #800000; }
        @media (max-width: 640px) { .va-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: '#1a1a2e', color: '#fff', borderRadius: 12, padding: '12px 22px', fontSize: 13, fontWeight: 600, zIndex: 2000, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          {toast}
        </div>
      )}

      {/* Header — matches Subscriptions / VA Services pattern */}
      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Virtual Assistant</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Browse VAs</h2>
          <p style={{ fontSize: 13, color: '#555', fontWeight: 400, margin: '3px 0 0' }}>Explore vetted candidates and shortlist your top picks.</p>
        </div>
        <button
          onClick={() => router.push('/client/dashboard/Shortlisted')}
          style={{ background: '#fff', border: '1.5px solid #d5d0d0', borderRadius: 10, padding: '9px 16px', fontSize: 12, fontWeight: 600, color: '#800000', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          Shortlisted {shortlisted.length > 0 && <span style={{ background: '#800000', color: '#fff', borderRadius: 20, padding: '1px 7px', fontSize: 10 }}>{shortlisted.length}</span>}
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 9, padding: '7px 12px', flex: '1 1 200px', maxWidth: 280 }}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, role or skill..."
            style={{ border: 'none', outline: 'none', fontSize: 12, color: '#333', background: 'transparent', flex: 1, width: '100%', fontFamily: "'Poppins', sans-serif" }}
          />
        </div>

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {SORT_OPTIONS.map(s => (
            <button key={s} className={`sort-btn${sortBy === s ? ' active' : ''}`} onClick={() => setSortBy(s)}>{s}</button>
          ))}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 12, color: '#555', userSelect: 'none' }}>
          <div onClick={() => setOnlyAvail(!onlyAvail)} style={{ width: 34, height: 18, borderRadius: 9, background: onlyAvail ? '#800000' : '#ddd', position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 2, left: onlyAvail ? 16 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
          </div>
          Available only
        </label>
      </div>

      <div style={{ fontSize: 11.5, color: '#aaa', marginBottom: 16 }}>
        Showing <strong style={{ color: '#1a1a2e' }}>{filtered.length}</strong> VA{filtered.length !== 1 ? 's' : ''}
      </div>

      {filtered.length > 0 ? (
        <div className="va-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {filtered.map(va => (
            <VACard
              key={va.id}
              va={va}
              isShortlisted={shortlisted.includes(va.id)}
              onOpen={() => setActiveVA(va)}
              onToggleShortlist={() => toggleShortlist(va.id)}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#bbb' }}>
          <div style={{ fontSize: 13 }}>No VAs found. Try adjusting your filters.</div>
        </div>
      )}

      {activeVA && (
        <VAProfileModal
          va={activeVA}
          isShortlisted={shortlisted.includes(activeVA.id)}
          onClose={() => setActiveVA(null)}
          onToggleShortlist={() => toggleShortlist(activeVA.id)}
          onSchedule={() => router.push(`/client/dashboard/InterviewRecording?vaId=${activeVA.id}`)}
          onHire={() => showToast(`Hire request flow for ${activeVA.name} coming soon`)}
        />
      )}
    </div>
  )
}
