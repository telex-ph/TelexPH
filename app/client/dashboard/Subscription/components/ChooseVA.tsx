'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// ─── TYPES ────────────────────────────────────────────────────────────────────
type VA = {
  id: string
  name: string
  role: string
  avatar: string
  rating: number
  reviews: number
  experience: string
  skills: string[]
  availability: 'Available' | 'Busy' | 'On Leave'
  hourlyRate: number
  completedJobs: number
  responseTime: string
  bio: string
  categoryIds: string[]
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const VA_LIST: VA[] = [
  {
    id: 'va-001', name: 'Maria Santos', role: 'Customer Service Specialist',
    avatar: 'MS', rating: 4.9, reviews: 124, experience: '5 yrs',
    skills: ['Live Chat', 'Email Support', 'CRM', 'Zendesk', 'HubSpot'],
    availability: 'Available', hourlyRate: 12, completedJobs: 87,
    responseTime: '< 1 hr',
    bio: 'Dedicated CSR with 5 years in SaaS and eCommerce support. Expert in de-escalation and CRM documentation.',
    categoryIds: ['csr'],
  },
  {
    id: 'va-002', name: 'James Reyes', role: 'Technical Support Engineer',
    avatar: 'JR', rating: 4.8, reviews: 98, experience: '6 yrs',
    skills: ['Tier 1–2 Support', 'API Troubleshooting', 'Shopify', 'SaaS Backends'],
    availability: 'Available', hourlyRate: 15, completedJobs: 63,
    responseTime: '< 2 hrs',
    bio: 'Technical support pro with deep eCommerce and SaaS platform knowledge. Handles complex escalations with ease.',
    categoryIds: ['csr', 'tech'],
  },
  {
    id: 'va-003', name: 'Angela Cruz', role: 'Web Developer',
    avatar: 'AC', rating: 5.0, reviews: 57, experience: '4 yrs',
    skills: ['WordPress', 'Webflow', 'Shopify', 'Landing Pages', 'SEO Basics'],
    availability: 'Available', hourlyRate: 18, completedJobs: 45,
    responseTime: '< 3 hrs',
    bio: 'Full-stack web developer specializing in conversion-optimized builds on WordPress and Webflow.',
    categoryIds: ['tech', 'digital'],
  },
  {
    id: 'va-004', name: 'Carlo Mendoza', role: 'Social Media Manager',
    avatar: 'CM', rating: 4.7, reviews: 83, experience: '3 yrs',
    skills: ['Content Strategy', 'Copywriting', 'Canva', 'Meta Ads', 'Scheduling'],
    availability: 'Busy', hourlyRate: 11, completedJobs: 72,
    responseTime: '< 4 hrs',
    bio: 'Creative SMM who builds engaging content calendars and drives organic reach for lifestyle and service brands.',
    categoryIds: ['creative'],
  },
  {
    id: 'va-005', name: 'Sofia Lim', role: 'Video & Graphic Designer',
    avatar: 'SL', rating: 4.9, reviews: 66, experience: '5 yrs',
    skills: ['Premiere Pro', 'After Effects', 'Canva', 'Brand Assets', 'Reels'],
    availability: 'Available', hourlyRate: 14, completedJobs: 51,
    responseTime: '< 2 hrs',
    bio: 'Visual storyteller producing short-form video and brand creatives for social-first campaigns.',
    categoryIds: ['creative'],
  },
  {
    id: 'va-006', name: 'Ryan Dela Cruz', role: 'CRM & Automation Specialist',
    avatar: 'RD', rating: 4.8, reviews: 44, experience: '4 yrs',
    skills: ['GoHighLevel', 'HubSpot', 'Zapier', 'Email Automation', 'Funnels'],
    availability: 'Available', hourlyRate: 16, completedJobs: 38,
    responseTime: '< 2 hrs',
    bio: 'Systems builder focused on CRM setups, automation workflows, and funnel builds that convert.',
    categoryIds: ['digital'],
  },
  {
    id: 'va-007', name: 'Patricia Gomez', role: 'SaaS Platform Manager',
    avatar: 'PG', rating: 4.6, reviews: 29, experience: '3 yrs',
    skills: ['White-Label Setup', 'Platform Onboarding', 'Client Management', 'SaaS Tools'],
    availability: 'On Leave', hourlyRate: 13, completedJobs: 22,
    responseTime: '< 6 hrs',
    bio: 'SaaS specialist experienced in white-label platform configuration and client onboarding workflows.',
    categoryIds: ['saas'],
  },
  {
    id: 'va-008', name: 'Mark Villanueva', role: 'AI & Automation Builder',
    avatar: 'MV', rating: 4.9, reviews: 38, experience: '3 yrs',
    skills: ['AI Chatbots', 'Make.com', 'Zapier', 'API Integrations', 'n8n'],
    availability: 'Available', hourlyRate: 20, completedJobs: 31,
    responseTime: '< 1 hr',
    bio: 'AI-first automation architect building intelligent workflows, chatbots, and CRM integrations at scale.',
    categoryIds: ['digital'],
  },
]

const AVAILABILITY_COLORS: Record<string, { bg: string; color: string; dot: string }> = {
  'Available': { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  'Busy':      { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b' },
  'On Leave':  { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444' },
}

const SORT_OPTIONS = ['Top Rated', 'Most Reviews', 'Lowest Rate', 'Most Experienced']

// ─── STAR RATING ──────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={11} height={11} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  )
}

// ─── VA CARD ──────────────────────────────────────────────────────────────────
function VACard({ va, onSelect }: { va: VA; onSelect: (va: VA) => void }) {
  const avail = AVAILABILITY_COLORS[va.availability]

  return (
    <div
      className="va-choose-card"
      style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #f0edec',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
    >
      {/* Top: avatar + info + availability */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'linear-gradient(135deg,#800000,#c05050)',
          color: '#fff', fontSize: 14, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontFamily: "'Poppins', sans-serif",
        }}>
          {va.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif", marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {va.name}
          </div>
          <div style={{ fontSize: 11, color: '#888', fontFamily: "'Poppins', sans-serif", marginBottom: 5 }}>{va.role}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Stars rating={va.rating} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{va.rating}</span>
            <span style={{ fontSize: 10, color: '#aaa', fontFamily: "'Poppins', sans-serif" }}>({va.reviews})</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: avail.bg, borderRadius: 20, padding: '3px 9px', flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: avail.dot }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: avail.color, fontFamily: "'Poppins', sans-serif" }}>{va.availability}</span>
        </div>
      </div>

      {/* Bio */}
      <p style={{ fontSize: 11.5, color: '#555', fontFamily: "'Poppins', sans-serif", lineHeight: 1.55, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {va.bio}
      </p>

      {/* Skills */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {va.skills.slice(0, 4).map(s => (
          <span key={s} style={{ fontSize: 10, background: '#f5f3f3', color: '#555', borderRadius: 5, padding: '2px 7px', fontFamily: "'Poppins', sans-serif", border: '1px solid #ece8e8' }}>
            {s}
          </span>
        ))}
        {va.skills.length > 4 && (
          <span style={{ fontSize: 10, color: '#aaa', fontFamily: "'Poppins', sans-serif", padding: '2px 4px' }}>+{va.skills.length - 4}</span>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {[
          { label: 'Rate', value: `$${va.hourlyRate}/hr` },
          { label: 'Jobs Done', value: String(va.completedJobs) },
          { label: 'Response', value: va.responseTime },
        ].map(s => (
          <div key={s.label} style={{ background: '#faf9f9', borderRadius: 8, padding: '8px 6px', textAlign: 'center', border: '1px solid #f0edec' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 9.5, color: '#aaa', fontFamily: "'Poppins', sans-serif", marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => onSelect(va)}
        disabled={va.availability === 'On Leave'}
        style={{
          width: '100%', padding: '10px 0',
          background: va.availability === 'On Leave' ? '#f0edec' : '#800000',
          color: va.availability === 'On Leave' ? '#bbb' : '#fff',
          border: 'none', borderRadius: 9,
          fontSize: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif",
          cursor: va.availability === 'On Leave' ? 'not-allowed' : 'pointer',
          letterSpacing: '0.02em',
          transition: 'background 0.15s',
        }}
      >
        {va.availability === 'On Leave' ? 'Unavailable' : 'View Profile →'}
      </button>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ChooseAVA() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId   = searchParams.get('service') ?? ''
  const serviceName = searchParams.get('name') ?? 'this service'
  const categoryId  = searchParams.get('category') ?? ''

  const [search,   setSearch]   = useState('')
  const [sortBy,   setSortBy]   = useState('Top Rated')
  const [onlyAvail, setOnlyAvail] = useState(false)

  // Filter by category if passed
  let filtered = categoryId
    ? VA_LIST.filter(v => v.categoryIds.includes(categoryId))
    : VA_LIST

  // Search
  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.role.toLowerCase().includes(q) ||
      v.skills.some(s => s.toLowerCase().includes(q))
    )
  }

  // Availability filter
  if (onlyAvail) filtered = filtered.filter(v => v.availability === 'Available')

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'Top Rated')       return b.rating - a.rating
    if (sortBy === 'Most Reviews')    return b.reviews - a.reviews
    if (sortBy === 'Lowest Rate')     return a.hourlyRate - b.hourlyRate
    if (sortBy === 'Most Experienced') return parseInt(b.experience) - parseInt(a.experience)
    return 0
  })

  const handleSelect = (va: VA) => {
    router.push(`/client/dashboard/VAProfile?vaId=${va.id}&service=${serviceId}&name=${encodeURIComponent(serviceName)}&category=${categoryId}`)
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: 24, background: '#fdfcfc', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .va-choose-card:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.1) !important;
          transform: translateY(-2px);
          border-color: #e8c0c0 !important;
        }
        .va-choose-card:hover button:not(:disabled) { background: #6a0000 !important; }
        .sort-btn { background: #fff; border: 1.5px solid #e0dcdc; border-radius: 8px; padding: 6px 12px; font-size: 11.5px; font-family: 'Poppins', sans-serif; font-weight: 500; color: #555; cursor: pointer; transition: all 0.15s; }
        .sort-btn:hover, .sort-btn.active { background: #800000; color: #fff; border-color: #800000; }
        @media (max-width: 640px) {
          .va-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Back breadcrumb */}
      <button
        onClick={() => router.back()}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 12, fontFamily: "'Poppins', sans-serif", marginBottom: 18, padding: 0 }}
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        Back to VA Services
      </button>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, color: '#800000', fontWeight: 600, margin: '0 0 2px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Step 1 of 4</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Choose Your VA</h2>
        <p style={{ fontSize: 13, color: '#555', margin: '3px 0 0', fontWeight: 400 }}>
          Select a virtual assistant for <strong style={{ color: '#800000' }}>{decodeURIComponent(serviceName)}</strong>
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {['Choose VA', 'View Profile', 'Interview', 'Project'].map((step, i) => (
          <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 3, borderRadius: 10, background: i === 0 ? '#800000' : '#ece8e8' }} />
            <span style={{ fontSize: 9.5, color: i === 0 ? '#800000' : '#bbb', fontFamily: "'Poppins', sans-serif", fontWeight: i === 0 ? 600 : 400 }}>{step}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 9, padding: '7px 12px', flex: '1 1 200px', maxWidth: 280 }}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/></svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, role or skill..."
            style={{ border: 'none', outline: 'none', fontSize: 12, fontFamily: "'Poppins', sans-serif", color: '#333', background: 'transparent', flex: 1, width: '100%' }}
          />
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {SORT_OPTIONS.map(s => (
            <button key={s} className={`sort-btn${sortBy === s ? ' active' : ''}`} onClick={() => setSortBy(s)}>{s}</button>
          ))}
        </div>

        {/* Available toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 12, fontFamily: "'Poppins', sans-serif", color: '#555', userSelect: 'none' }}>
          <div
            onClick={() => setOnlyAvail(!onlyAvail)}
            style={{
              width: 34, height: 18, borderRadius: 9,
              background: onlyAvail ? '#800000' : '#ddd',
              position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute', top: 2, left: onlyAvail ? 16 : 2,
              width: 14, height: 14, borderRadius: '50%', background: '#fff',
              transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }} />
          </div>
          Available only
        </label>
      </div>

      {/* Count */}
      <div style={{ fontSize: 11.5, color: '#aaa', fontFamily: "'Poppins', sans-serif", marginBottom: 16 }}>
        Showing <strong style={{ color: '#1a1a2e' }}>{filtered.length}</strong> VA{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="va-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {filtered.map(va => <VACard key={va.id} va={va} onSelect={handleSelect} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#bbb' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
          <div style={{ fontSize: 13, fontFamily: "'Poppins', sans-serif" }}>No VAs found. Try adjusting your filters.</div>
        </div>
      )}
    </div>
  )
}