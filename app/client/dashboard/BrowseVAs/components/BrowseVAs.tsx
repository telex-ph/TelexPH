'use client'
import { useState, useMemo } from 'react'

type Availability = 'Available' | 'Busy' | 'On Leave'
type ExperienceLevel = 'Junior' | 'Mid-level' | 'Senior'
type PricingType = 'month' | 'setup'

type ServiceInfo = {
  name: string
  price: number
  pricingType: PricingType
  features: string[]
  note?: string
}

type VA = {
  id: number
  name: string
  role: string
  skills: string[]
  experience: number
  level: ExperienceLevel
  availability: Availability
  rating: number
  reviews: number
  rate: number
  category: string
  languages: string[]
  portfolio: { label: string; url: string }[]
  bio: string
  initials: string
  color: string
  location: string
  type: 'Full-time' | 'Part-time'
  service: ServiceInfo
}

const VAS: VA[] = [
  {
    id: 1, name: 'Maria Santos', role: 'Social Media Manager', skills: ['Facebook Ads', 'Canva', 'Copywriting', 'Instagram'], experience: 3, level: 'Mid-level', availability: 'Available', rating: 4.8, reviews: 34, rate: 8, category: 'Marketing', languages: ['English', 'Filipino'], portfolio: [{ label: 'Campaign Portfolio', url: '#' }, { label: 'Content Samples', url: '#' }], bio: 'Experienced in managing social media for e-commerce brands, driving engagement through creative campaigns.', initials: 'MS', color: '#7c3aed', location: 'Manila, PH', type: 'Full-time',
    service: { name: 'Social Media Management', price: 1800, pricingType: 'month', features: ['Content calendar strategy (monthly)', 'Copywriting for all platforms', 'Scheduling & publishing', 'Community engagement management', 'Monthly analytics & performance report'], note: 'Ads management available as add-on.' },
  },
  {
    id: 2, name: 'Jose Reyes', role: 'Executive Assistant', skills: ['Scheduling', 'Email Mgmt', 'Trello', 'Slack'], experience: 5, level: 'Senior', availability: 'Available', rating: 4.6, reviews: 52, rate: 7, category: 'Admin', languages: ['English', 'Filipino', 'Spanish'], portfolio: [{ label: 'Work Samples', url: '#' }], bio: 'Seasoned EA with 5+ years supporting C-suite executives. Expert in calendar and cross-team coordination.', initials: 'JR', color: '#0891b2', location: 'Cebu, PH', type: 'Full-time',
    service: { name: 'Customer Service Representative', price: 1400, pricingType: 'month', features: ['Dedicated full-time agent (8hrs/day)', 'Email, live chat & phone support', 'CRM documentation & ticketing', 'QA monitoring & call recording review', 'Weekly performance reporting'] },
  },
  {
    id: 3, name: 'Ana Cruz', role: 'Customer Support VA', skills: ['Live Chat', 'Zendesk', 'CRM', 'Email Support'], experience: 2, level: 'Junior', availability: 'Busy', rating: 4.9, reviews: 18, rate: 6, category: 'Support', languages: ['English', 'Filipino'], portfolio: [{ label: 'Support Metrics', url: '#' }], bio: 'Dedicated support specialist with 98% satisfaction rate. Fast, friendly, and detail-oriented.', initials: 'AC', color: '#059669', location: 'Davao, PH', type: 'Part-time',
    service: { name: 'Technical Support Representative', price: 1800, pricingType: 'month', features: ['Tier 1–2 technical troubleshooting', 'SaaS / eCommerce backend support', 'Escalation handling & documentation', 'KPI tracking & QA monitoring'], note: 'Advanced technical roles: custom pricing' },
  },
  {
    id: 4, name: 'Carlo Mendoza', role: 'Data Entry Specialist', skills: ['Excel', 'Google Sheets', 'Data Cleaning', 'SQL'], experience: 4, level: 'Mid-level', availability: 'Available', rating: 4.5, reviews: 27, rate: 5, category: 'Admin', languages: ['English', 'Filipino'], portfolio: [{ label: 'Data Projects', url: '#' }], bio: 'Accurate and efficient data specialist delivering clean, structured outputs on time.', initials: 'CM', color: '#d97706', location: 'Manila, PH', type: 'Full-time',
    service: { name: 'Customer Service Representative', price: 1400, pricingType: 'month', features: ['Dedicated full-time agent (8hrs/day)', 'CRM documentation & ticketing', 'QA monitoring & call recording review', 'Weekly performance reporting'] },
  },
  {
    id: 5, name: 'Liza Bautista', role: 'Content Writer', skills: ['SEO Writing', 'WordPress', 'Editing', 'Blogging'], experience: 3, level: 'Mid-level', availability: 'Available', rating: 4.7, reviews: 41, rate: 7, category: 'Content', languages: ['English', 'Filipino'], portfolio: [{ label: 'Writing Portfolio', url: '#' }, { label: 'Articles', url: '#' }], bio: 'SEO-focused writer crafting blog posts and web copy that rank and convert. 200+ published articles.', initials: 'LB', color: '#db2777', location: 'Quezon, PH', type: 'Part-time',
    service: { name: 'Social Media Management', price: 1800, pricingType: 'month', features: ['Content calendar strategy (monthly)', 'Copywriting for all platforms', 'Scheduling & publishing', 'Monthly analytics & performance report'], note: 'Ads management available as add-on.' },
  },
  {
    id: 6, name: 'Mark Villanueva', role: 'Graphic Designer', skills: ['Photoshop', 'Illustrator', 'Figma', 'Branding'], experience: 6, level: 'Senior', availability: 'On Leave', rating: 4.9, reviews: 63, rate: 10, category: 'Design', languages: ['English', 'Filipino'], portfolio: [{ label: 'Design Portfolio', url: '#' }, { label: 'Behance', url: '#' }], bio: 'Senior designer with 6 years creating brand identities and UI assets for global clients.', initials: 'MV', color: '#800000', location: 'Makati, PH', type: 'Full-time',
    service: { name: 'Video & Graphics Design', price: 2200, pricingType: 'month', features: ['Short-form videos (Reels / TikTok / Shorts)', 'Ad creative design & production', 'Brand asset creation', 'Thumbnails & campaign visuals', 'Creative strategy alignment sessions'], note: 'High-volume production: custom quote' },
  },
  {
    id: 7, name: 'Jenny Ramos', role: 'Bookkeeping VA', skills: ['QuickBooks', 'Xero', 'Invoicing', 'Payroll'], experience: 4, level: 'Mid-level', availability: 'Available', rating: 4.6, reviews: 29, rate: 8, category: 'Finance', languages: ['English', 'Filipino'], portfolio: [{ label: 'Client Testimonials', url: '#' }], bio: 'Certified bookkeeper managing accounts for 10+ small businesses. Accurate and reliable.', initials: 'JR', color: '#0f766e', location: 'Cebu, PH', type: 'Full-time',
    service: { name: 'Customer Service Representative', price: 1400, pricingType: 'month', features: ['Dedicated full-time agent (8hrs/day)', 'CRM documentation & ticketing', 'QA monitoring & call recording review', 'Weekly performance reporting'] },
  },
  {
    id: 8, name: 'Rico Dela Cruz', role: 'Video Editor', skills: ['Premiere Pro', 'After Effects', 'DaVinci', 'YouTube'], experience: 2, level: 'Junior', availability: 'Available', rating: 4.4, reviews: 14, rate: 6, category: 'Design', languages: ['English', 'Filipino'], portfolio: [{ label: 'YouTube Reel', url: '#' }, { label: 'Sample Edits', url: '#' }], bio: 'Creative video editor specializing in YouTube content, reels, and promotional videos.', initials: 'RD', color: '#6d28d9', location: 'Manila, PH', type: 'Part-time',
    service: { name: 'Video & Graphics Design', price: 2200, pricingType: 'month', features: ['Short-form videos (Reels / TikTok / Shorts)', 'Ad creative design & production', 'Brand asset creation', 'Thumbnails & campaign visuals'], note: 'High-volume production: custom quote' },
  },
  {
    id: 9, name: 'Sophia Gonzales', role: 'Lead Generation VA', skills: ['LinkedIn', 'Apollo.io', 'CRM', 'Cold Email'], experience: 3, level: 'Mid-level', availability: 'Available', rating: 4.7, reviews: 22, rate: 7, category: 'Marketing', languages: ['English', 'Filipino'], portfolio: [{ label: 'Campaign Results', url: '#' }], bio: 'Results-driven lead gen specialist. Built pipelines generating 200+ qualified leads/month.', initials: 'SG', color: '#c026d3', location: 'Pasig, PH', type: 'Full-time',
    service: { name: 'Social Media Management', price: 1800, pricingType: 'month', features: ['Content calendar strategy (monthly)', 'Copywriting for all platforms', 'Community engagement management', 'Monthly analytics & performance report'] },
  },
  {
    id: 10, name: 'Daniel Torres', role: 'IT Support VA', skills: ['Helpdesk', 'Network', 'Ticketing', 'Remote'], experience: 5, level: 'Senior', availability: 'Busy', rating: 4.8, reviews: 37, rate: 9, category: 'IT', languages: ['English', 'Filipino'], portfolio: [{ label: 'Certifications', url: '#' }], bio: 'Senior IT support with expertise in remote troubleshooting, network setup, and helpdesk ops.', initials: 'DT', color: '#ea580c', location: 'BGC, PH', type: 'Full-time',
    service: { name: 'Technical Support Representative', price: 1800, pricingType: 'month', features: ['Tier 1–2 technical troubleshooting', 'SaaS / eCommerce backend support', 'Escalation handling & documentation', 'KPI tracking & QA monitoring'], note: 'Advanced technical roles: custom pricing' },
  },
]

const CATEGORIES: string[]                     = ['All', 'Marketing', 'Admin', 'Support', 'Content', 'Design', 'Finance', 'IT']
const LEVELS: (ExperienceLevel | 'All')[]      = ['All', 'Junior', 'Mid-level', 'Senior']
const AVAILABILITIES: (Availability | 'All')[] = ['All', 'Available', 'Busy', 'On Leave']
const TYPES: string[]                          = ['All', 'Full-time', 'Part-time']
const RATE_RANGES: string[]                    = ['All', 'Under $6/hr', '$6–$8/hr', 'Above $8/hr']
const SUGGESTIONS: string[]                    = ['Social Media Manager', 'Executive Assistant', 'Customer Support', 'Video Editor', 'Lead Generation', 'IT Support']

const AVAIL_STYLE: Record<Availability, { bg: string; color: string; dot: string }> = {
  'Available': { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  'Busy':      { bg: '#fff7ed', color: '#ea580c', dot: '#fb923c' },
  'On Leave':  { bg: '#f5f3ff', color: '#7c3aed', dot: '#a78bfa' },
}

const LEVEL_STYLE: Record<ExperienceLevel, { bg: string; color: string }> = {
  'Junior':    { bg: '#eff6ff', color: '#2563eb' },
  'Mid-level': { bg: '#fefce8', color: '#ca8a04' },
  'Senior':    { bg: '#fdf4ff', color: '#9333ea' },
}

const F: React.CSSProperties = { fontFamily: "'Poppins', sans-serif" }

function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={11} height={11} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span style={{ ...F, fontSize: 11, color: '#374151', fontWeight: 700, marginLeft: 3 }}>{rating}</span>
      <span style={{ ...F, fontSize: 10, color: '#aaa', marginLeft: 2 }}>({reviews})</span>
    </div>
  )
}

// ─── FILTER PILL — clean solid pill, maroon when active ──────────────────────
function FilterPill({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        ...F,
        padding: '4px 11px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: checked ? 600 : 400,
        cursor: 'pointer',
        border: 'none',
        background: checked ? '#800000' : '#f5f2f2',
        color: checked ? '#fff' : '#666',
        transition: 'all 0.13s',
        whiteSpace: 'nowrap' as const,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {label}
    </button>
  )
}

export default function BrowseVAs() {
  const [search,       setSearch]       = useState('')
  const [category,     setCategory]     = useState('All')
  const [level,        setLevel]        = useState<ExperienceLevel | 'All'>('All')
  const [availability, setAvailability] = useState<Availability | 'All'>('All')
  const [type,         setType]         = useState('All')
  const [rateRange,    setRateRange]    = useState('All')
  const [sort,         setSort]         = useState<'relevant' | 'experienced' | 'rate_low' | 'rate_high'>('relevant')
  const [shortlisted,  setShortlisted]  = useState<number[]>([])
  const [selected,     setSelected]     = useState<VA | null>(null)
  const [confirmSL,    setConfirmSL]    = useState<VA | null>(null)
  const [hireSuccess,  setHireSuccess]  = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)
  const [applyFor,     setApplyFor]     = useState<VA | null>(null)

  const openProfile  = (va: VA) => setSelected(va)
  const closeProfile = ()       => setSelected(null)

  const toggleShortlist = (va: VA, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (shortlisted.includes(va.id)) setShortlisted(s => s.filter(x => x !== va.id))
    else setConfirmSL(va)
  }
  const confirmShortlist = () => { if (confirmSL) setShortlisted(s => [...s, confirmSL.id]); setConfirmSL(null) }

  const matchRate = (va: VA) => {
    if (rateRange === 'All') return true
    if (rateRange === 'Under $6/hr') return va.rate < 6
    if (rateRange === '$6–$8/hr')    return va.rate >= 6 && va.rate <= 8
    if (rateRange === 'Above $8/hr') return va.rate > 8
    return true
  }

  const filtered = useMemo(() => {
    let r = VAS.filter(va => {
      const q = search.toLowerCase()
      return (
        (!q || va.name.toLowerCase().includes(q) || va.role.toLowerCase().includes(q) || va.skills.some(s => s.toLowerCase().includes(q))) &&
        (category     === 'All' || va.category     === category) &&
        (level        === 'All' || va.level        === level) &&
        (availability === 'All' || va.availability === availability) &&
        (type         === 'All' || va.type         === type) &&
        matchRate(va)
      )
    })
    if (sort === 'experienced') r = [...r].sort((a, b) => b.experience - a.experience)
    if (sort === 'rate_low')    r = [...r].sort((a, b) => a.rate - b.rate)
    if (sort === 'rate_high')   r = [...r].sort((a, b) => b.rate - a.rate)
    return r
  }, [search, category, level, availability, type, rateRange, sort])

  const hasFilters   = category !== 'All' || level !== 'All' || availability !== 'All' || type !== 'All' || rateRange !== 'All'
  const resetFilters = () => { setCategory('All'); setLevel('All'); setAvailability('All'); setType('All'); setRateRange('All'); setVisibleCount(6) }
  const showSidebar  = !selected

  return (
    <div style={{ ...F, minHeight: '100vh', background: '#fdfcfc' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        .va-card { transition: box-shadow 0.18s, border-color 0.18s; }
        .va-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08) !important; }
        .btn-red:hover { background: #6b0000 !important; }
        .btn-out:hover { border-color: #800000 !important; color: #800000 !important; }
        .fp:hover { opacity: 0.85; }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      {/* ── VA RESUME VIEW ── */}
      {applyFor && (
        <div style={{ padding: '24px 28px 28px' }}>

          {/* Page Header */}
          <div style={{ marginBottom: 22 }}>
            <p style={{ ...F, fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>VA Application,</p>
            <h1 style={{ ...F, fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Virtual Assistants</h1>
            <p style={{ ...F, fontSize: 13, color: '#555', fontWeight: 400, margin: '4px 0 0' }}>Browse and hire top-tier VAs across all skills and categories.</p>
          </div>

          {/* Stat Cards */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 22 }}>
            {[
              { label: 'Total VAs',        value: `${VAS.length}+`, sub: 'All categories',    photoIdx: 0, emoji: '👥' },
              { label: 'Available Now',    value: VAS.filter(v => v.availability === 'Available').length, sub: 'Ready to start', photoIdx: 1, emoji: '✅' },
              { label: 'Avg. Rating',      value: (VAS.reduce((s,v) => s + v.rating, 0) / VAS.length).toFixed(1), sub: 'Across all VAs', photoIdx: 2, emoji: '⭐' },
              { label: 'Skill Categories', value: 8, sub: 'Specialized roles', photoIdx: 3, emoji: '🗂' },
            ].map((card, idx) => {
              const photos = [
                'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=60',
                'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=60',
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=60',
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=60',
              ]
              return (
                <div key={idx} style={{ flex: '1 1 0', minWidth: 0, borderRadius: 14, overflow: 'hidden', position: 'relative', minHeight: 96, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${photos[card.photoIdx]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(90,0,0,0.97) 30%, rgba(110,0,0,0.72) 65%, rgba(80,0,0,0.35) 100%)' }} />
                  <div style={{ position: 'relative', zIndex: 1, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 13 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,210,210,0.95)', flexShrink: 0, fontSize: 18 }}>
                      {card.emoji}
                    </div>
                    <div>
                      <div style={{ ...F, fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{card.value}</div>
                      <div style={{ ...F, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.92)', marginTop: 2 }}>{card.label}</div>
                      <div style={{ ...F, fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{card.sub}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Back */}
          <button onClick={() => setApplyFor(null)}
            style={{ ...F, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555', background: '#fff', border: '1.5px solid #e0dcdc', padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontWeight: 600, marginBottom: 20 }}>
            ← Back to list
          </button>

          {/* VA content */}
          <div>

            {/* Hero strip */}
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', marginBottom: 16 }}>
              <div style={{ height: 4, background: applyFor.color }} />
              <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 72, height: 72, borderRadius: 18, background: `${applyFor.color}18`, border: `2.5px solid ${applyFor.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ ...F, fontSize: 24, fontWeight: 700, color: applyFor.color }}>{applyFor.initials}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...F, fontSize: 10, color: '#aaa', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{applyFor.category} · {applyFor.type}</div>
                  <div style={{ ...F, fontSize: 20, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.02em' }}>{applyFor.name}</div>
                  <div style={{ ...F, fontSize: 13, color: '#555', marginTop: 2 }}>{applyFor.role}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                    <span style={{ ...F, fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: AVAIL_STYLE[applyFor.availability].bg, color: AVAIL_STYLE[applyFor.availability].color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: AVAIL_STYLE[applyFor.availability].dot }} />{applyFor.availability}
                    </span>
                    <span style={{ ...F, fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: LEVEL_STYLE[applyFor.level].bg, color: LEVEL_STYLE[applyFor.level].color }}>{applyFor.level}</span>
                    <span style={{ ...F, fontSize: 10, color: '#aaa', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {applyFor.location}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ ...F, fontSize: 28, fontWeight: 700, color: '#800000', letterSpacing: '-0.02em' }}>${applyFor.rate}<span style={{ fontSize: 12, fontWeight: 400, color: '#aaa' }}>/hr</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end', marginTop: 4 }}>
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} width={12} height={12} viewBox="0 0 24 24" fill={i <= Math.round(applyFor.rating) ? '#f59e0b' : '#e5e7eb'} stroke="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                    <span style={{ ...F, fontSize: 11, fontWeight: 700, color: '#374151', marginLeft: 4 }}>{applyFor.rating}</span>
                    <span style={{ ...F, fontSize: 10, color: '#aaa', marginLeft: 2 }}>({applyFor.reviews})</span>
                  </div>
                  <div style={{ ...F, fontSize: 11, color: '#aaa', marginTop: 4 }}>{applyFor.experience} yrs experience</div>
                </div>
              </div>
            </div>

            {/* Two column grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

              {/* Left column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* About */}
                <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ ...F, fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>About</div>
                  <p style={{ ...F, fontSize: 12, color: '#555', lineHeight: 1.75, margin: 0, fontWeight: 400 }}>{applyFor.bio}</p>
                </div>

                {/* Skills */}
                <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ ...F, fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {applyFor.skills.map(s => (
                      <span key={s} style={{ ...F, background: '#f5f2f2', borderRadius: 6, padding: '4px 11px', fontSize: 11, color: '#555', fontWeight: 500 }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ ...F, fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Details</div>
                  {[
                    { label: 'Category',   value: applyFor.category },
                    { label: 'Job Type',   value: applyFor.type },
                    { label: 'Level',      value: applyFor.level },
                    { label: 'Experience', value: `${applyFor.experience} years` },
                    { label: 'Location',   value: applyFor.location },
                    { label: 'Languages',  value: applyFor.languages.join(', ') },
                  ].map((row, i, arr) => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid #f5f2f2' : 'none' }}>
                      <span style={{ ...F, fontSize: 11, color: '#aaa' }}>{row.label}</span>
                      <span style={{ ...F, fontSize: 11, fontWeight: 600, color: '#1a1a2e' }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Portfolio */}
                <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ ...F, fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Portfolio</div>
                  {applyFor.portfolio.map(p => (
                    <a key={p.label} href={p.url}
                      style={{ ...F, display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#800000', fontWeight: 600, background: '#fff5f5', padding: '9px 13px', borderRadius: 8, textDecoration: 'none', marginBottom: 7 }}>
                      <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      {p.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Right column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Service */}
                <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ ...F, fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Service Offered</div>
                  <div style={{ ...F, fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>{applyFor.service.name}</div>
                  {applyFor.service.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                      <span style={{ color: '#800000', fontWeight: 700, fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ ...F, fontSize: 12, color: '#555' }}>{feat}</span>
                    </div>
                  ))}
                  {applyFor.service.note && (
                    <div style={{ ...F, fontSize: 11, color: '#aaa', fontStyle: 'italic', marginTop: 10 }}>{applyFor.service.note}</div>
                  )}
                </div>

                {/* Pricing */}
                <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ ...F, fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Pricing</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ ...F, fontSize: 12, color: '#555' }}>Starting at</span>
                    <span style={{ ...F, fontSize: 22, fontWeight: 700, color: '#800000', letterSpacing: '-0.02em' }}>
                      ${applyFor.service.price.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400, color: '#aaa' }}>/{applyFor.service.pricingType}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions — pinaka baba */}
            <div style={{ marginTop: 16 }}>
              <button
                onClick={() => { setApplyFor(null); setHireSuccess(true) }}
                className="btn-red"
                style={{ ...F, width: '100%', padding: '13px', borderRadius: 10, background: '#800000', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                Send Hire Request →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BROWSE VIEW (hidden when applyFor is set) ── */}
      {!applyFor && (<>

      {/* ── PAGE HEADER ── */}
      <div style={{ padding: '24px 28px 0', marginBottom: 22 }}>
        <p style={{ ...F, fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Browse talent,</p>
        <h1 style={{ ...F, fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Virtual Assistants</h1>
        <p style={{ ...F, fontSize: 13, color: '#555', fontWeight: 400, margin: '4px 0 0' }}>Browse and hire top-tier VAs across all skills and categories.</p>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ padding: '0 28px', marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'Total VAs',        value: `${VAS.length}+`, sub: 'All categories',    photoIdx: 0 },
          { label: 'Available Now',    value: VAS.filter(v => v.availability === 'Available').length, sub: 'Ready to start', photoIdx: 1 },
          { label: 'Avg. Rating',      value: (VAS.reduce((s,v) => s + v.rating, 0) / VAS.length).toFixed(1), sub: 'Across all VAs', photoIdx: 2 },
          { label: 'Skill Categories', value: 8, sub: 'Specialized roles', photoIdx: 3 },
        ].map((card, idx) => {
          const photos = [
            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=60',
            'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=60',
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=60',
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=60',
          ]
          return (
            <div key={idx} style={{ flex: '1 1 0', minWidth: 0, borderRadius: 14, overflow: 'hidden', position: 'relative', minHeight: 96, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${photos[card.photoIdx]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(90,0,0,0.97) 30%, rgba(110,0,0,0.72) 65%, rgba(80,0,0,0.35) 100%)' }} />
              <div style={{ position: 'relative', zIndex: 1, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,210,210,0.95)', flexShrink: 0, fontSize: 18 }}>
                  {idx === 0 ? '👥' : idx === 1 ? '✅' : idx === 2 ? '⭐' : '🗂'}
                </div>
                <div>
                  <div style={{ ...F, fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{card.value}</div>
                  <div style={{ ...F, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.92)', marginTop: 2 }}>{card.label}</div>
                  <div style={{ ...F, fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{card.sub}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── SEARCH BAR ── */}
      <div style={{ padding: '0 28px 14px' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '9px 14px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, background: '#f7f5f5', border: '1px solid #ece8e8', borderRadius: 9, padding: '7px 12px' }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              id="va-search"
              placeholder="Search by title, skill, or VA name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...F, border: 'none', outline: 'none', fontSize: 12, flex: 1, background: 'transparent', color: '#333' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 13, display: 'flex', alignItems: 'center', ...F }}>✕</button>
            )}
          </div>
          <div style={{ width: 1, height: 22, background: '#e0dcdc' }} />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as typeof sort)}
            style={{ ...F, padding: '7px 11px', borderRadius: 8, border: '1.5px solid #e0dcdc', fontSize: 12, color: '#555', background: '#faf8f8', outline: 'none', cursor: 'pointer' }}
          >
            <option value="relevant">Most Relevant</option>
            <option value="experienced">Most Experienced</option>
            <option value="rate_low">Rate: Low → High</option>
            <option value="rate_high">Rate: High → Low</option>
          </select>
          <button className="btn-red" style={{ ...F, padding: '8px 22px', borderRadius: 9, background: '#800000', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Find
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 9, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ ...F, fontSize: 10, color: '#aaa', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Suggestions:</span>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => setSearch(search === s ? '' : s)}
              style={{ ...F, padding: '3px 11px', borderRadius: 20, border: `1.5px solid ${search === s ? '#800000' : '#e0dcdc'}`, background: search === s ? '#800000' : '#fff', color: search === s ? '#fff' : '#555', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ display: 'flex', padding: '0 28px 28px', gap: 16, alignItems: 'flex-start' }}>

        {/* ── SIDEBAR — only this section changed ── */}
        {showSidebar && (
          <div style={{ width: 220, flexShrink: 0, background: '#fff', borderRadius: 14, padding: '16px 14px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ ...F, fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>Filters</span>
              {hasFilters && (
                <button onClick={resetFilters} style={{ ...F, fontSize: 10, color: '#800000', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Reset all
                </button>
              )}
            </div>

            {/* Category */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ ...F, fontSize: 9, fontWeight: 700, color: '#bbb', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {CATEGORIES.map(c => <FilterPill key={c} label={c === 'All' ? 'Any' : c} checked={category === c} onToggle={() => setCategory(c)} />)}
              </div>
            </div>

            <div style={{ height: 1, background: '#f5f2f2', marginBottom: 12 }} />

            {/* Job Type */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ ...F, fontSize: 9, fontWeight: 700, color: '#bbb', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Job Type</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {TYPES.map(t => <FilterPill key={t} label={t === 'All' ? 'Any' : t} checked={type === t} onToggle={() => setType(t)} />)}
              </div>
            </div>

            <div style={{ height: 1, background: '#f5f2f2', marginBottom: 12 }} />

            {/* Experience Level */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ ...F, fontSize: 9, fontWeight: 700, color: '#bbb', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Experience Level</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {LEVELS.map(l => <FilterPill key={l} label={l === 'All' ? 'Any' : l} checked={level === l} onToggle={() => setLevel(l)} />)}
              </div>
            </div>

            <div style={{ height: 1, background: '#f5f2f2', marginBottom: 12 }} />

            {/* Rate Range */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ ...F, fontSize: 9, fontWeight: 700, color: '#bbb', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rate Range</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {RATE_RANGES.map(r => <FilterPill key={r} label={r === 'All' ? 'Any' : r} checked={rateRange === r} onToggle={() => setRateRange(r)} />)}
              </div>
            </div>

            <div style={{ height: 1, background: '#f5f2f2', marginBottom: 12 }} />

            {/* Availability */}
            <div>
              <div style={{ ...F, fontSize: 9, fontWeight: 700, color: '#bbb', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Availability</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {AVAILABILITIES.map(a => <FilterPill key={a} label={a === 'All' ? 'Any' : a} checked={availability === a} onToggle={() => setAvailability(a)} />)}
              </div>
            </div>

          </div>
        )}

        {/* ── RIGHT CONTENT — unchanged ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            {selected && (
              <button onClick={closeProfile} className="btn-out"
                style={{ ...F, fontSize: 11, color: '#555', background: '#fff', border: '1.5px solid #e0dcdc', padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontWeight: 600 }}>
                ← Back to list
              </button>
            )}
            {shortlisted.length > 0 && (
              <span style={{ ...F, fontSize: 11, background: '#fff5f5', color: '#800000', padding: '4px 12px', borderRadius: 20, fontWeight: 600, border: '1px solid #fecaca' }}>
                ♥ {shortlisted.length} shortlisted
              </span>
            )}
          </div>

          {hireSuccess && (
            <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 12, padding: '10px 16px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ ...F, fontSize: 12, color: '#16a34a', fontWeight: 600 }}>✓ Application submitted successfully!</span>
              <button onClick={() => setHireSuccess(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', fontSize: 15 }}>✕</button>
            </div>
          )}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: 60, color: '#aaa' }}>
              <div style={{ fontSize: 38, marginBottom: 10 }}>🔍</div>
              <div style={{ ...F, fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 12 }}>No VAs match your filters.</div>
              <button onClick={resetFilters} className="btn-red"
                style={{ ...F, padding: '8px 20px', borderRadius: 9, background: '#800000', border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                Reset Filters
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: selected ? '380px 1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, alignItems: 'start' }}>

            <div style={{ display: selected ? 'flex' : 'contents', flexDirection: 'column', gap: 12 }}>
              {filtered.slice(0, visibleCount).map(va => {
                const isSel = selected?.id === va.id
                const isSL  = shortlisted.includes(va.id)
                return (
                  <div key={va.id} className="va-card"
                    style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
                    <div style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ ...F, fontSize: 10, color: '#aaa', marginBottom: 2, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{va.category} · {va.type}</div>
                          <div style={{ ...F, fontSize: 13, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.2, marginBottom: 2 }}>{va.role}</div>
                          <div style={{ ...F, fontSize: 11, color: '#555' }}>{va.name}</div>
                        </div>
                        <div style={{ width: 44, height: 44, borderRadius: 11, background: `${va.color}18`, border: `2px solid ${va.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 10 }}>
                          <span style={{ ...F, fontSize: 13, fontWeight: 700, color: va.color }}>{va.initials}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
                        <span style={{ ...F, fontSize: 16, fontWeight: 700, color: '#800000', letterSpacing: '-0.01em' }}>
                          ${va.rate}<span style={{ fontSize: 10, fontWeight: 400, color: '#aaa' }}>/hr</span>
                        </span>
                        <Stars rating={va.rating} reviews={va.reviews} />
                      </div>
                      <p style={{ ...F, fontSize: 11, color: '#555', lineHeight: 1.65, margin: '0 0 10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 400 }}>
                        {va.bio}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                        {va.skills.slice(0, 3).map(s => (
                          <span key={s} style={{ ...F, background: '#f5f2f2', borderRadius: 5, padding: '2px 8px', fontSize: 10, color: '#555', fontWeight: 500 }}>{s}</span>
                        ))}
                        {va.skills.length > 3 && <span style={{ ...F, background: '#f5f2f2', borderRadius: 5, padding: '2px 8px', fontSize: 10, color: '#aaa' }}>+{va.skills.length - 3}</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13 }}>
                        <span style={{ ...F, fontSize: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, color: AVAIL_STYLE[va.availability].color, background: AVAIL_STYLE[va.availability].bg, padding: '3px 9px', borderRadius: 20 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: AVAIL_STYLE[va.availability].dot, flexShrink: 0 }} />
                          {va.availability}
                        </span>
                        <span style={{ ...F, fontSize: 10, color: '#aaa', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {va.location}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 7 }}>
                        <button onClick={() => isSel ? closeProfile() : openProfile(va)} className={isSel ? 'btn-red' : 'btn-out'}
                          style={{ ...F, flex: 1, padding: '8px 0', borderRadius: 8, background: isSel ? '#800000' : '#fff', border: `1.5px solid ${isSel ? '#800000' : '#e0dcdc'}`, color: isSel ? '#fff' : '#555', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                          {isSel ? '✕ Close' : 'View Profile'}
                        </button>
                        <button onClick={e => toggleShortlist(va, e)} className="btn-out"
                          style={{ ...F, flex: 1, padding: '8px 0', borderRadius: 8, background: isSL ? '#fff5f5' : '#fff', border: `1.5px solid ${isSL ? '#fca5a5' : '#e0dcdc'}`, color: isSL ? '#800000' : '#555', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                          {isSL ? '♥ Shortlist' : '♡ Shortlist'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {selected && (
              <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.09)', order: 1 }}>
                <div style={{ height: 3, background: selected.color }} />
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ ...F, fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>VA Profile</span>
                    <button onClick={closeProfile} style={{ width: 26, height: 26, borderRadius: 7, background: '#faf8f8', border: '1px solid #e0dcdc', cursor: 'pointer', color: '#aaa', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 13, background: `${selected.color}18`, border: `2px solid ${selected.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ ...F, fontSize: 17, fontWeight: 700, color: selected.color }}>{selected.initials}</span>
                    </div>
                    <div>
                      <div style={{ ...F, fontWeight: 700, color: '#1a1a2e', fontSize: 14 }}>{selected.name}</div>
                      <div style={{ ...F, fontSize: 11, color: '#555' }}>{selected.role}</div>
                      <div style={{ ...F, fontSize: 17, fontWeight: 700, color: '#800000', marginTop: 3, lineHeight: 1, letterSpacing: '-0.01em' }}>
                        ${selected.rate}<span style={{ fontSize: 10, fontWeight: 400, color: '#aaa' }}>/hr</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}><Stars rating={selected.rating} reviews={selected.reviews} /></div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                    <span style={{ ...F, fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: AVAIL_STYLE[selected.availability].bg, color: AVAIL_STYLE[selected.availability].color }}>{selected.availability}</span>
                    <span style={{ ...F, fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: LEVEL_STYLE[selected.level].bg, color: LEVEL_STYLE[selected.level].color }}>{selected.level}</span>
                    <span style={{ ...F, fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: '#f5f2f2', color: '#555' }}>{selected.type}</span>
                    <span style={{ ...F, fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: '#f5f2f2', color: '#555' }}>{selected.experience} yrs exp</span>
                  </div>
                  <p style={{ ...F, fontSize: 11, color: '#555', lineHeight: 1.7, background: '#faf8f8', borderRadius: 9, padding: '10px 13px', margin: '0 0 14px', fontWeight: 400 }}>{selected.bio}</p>
                  <div style={{ background: '#fff5f5', borderRadius: 9, padding: '11px 13px', marginBottom: 14 }}>
                    <div style={{ ...F, fontSize: 10, fontWeight: 700, color: '#800000', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>What's Included</div>
                    {selected.service.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 11, color: '#555', marginBottom: 5, ...F }}>
                        <span style={{ color: '#800000', fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                      </div>
                    ))}
                    {selected.service.note && <div style={{ ...F, fontSize: 10, color: '#aaa', fontStyle: 'italic', marginTop: 7 }}>{selected.service.note}</div>}
                  </div>
                  <div style={{ borderRadius: 9, overflow: 'hidden', marginBottom: 14, background: '#faf8f8' }}>
                    {[
                      { label: 'Category',  value: selected.category },
                      { label: 'Location',  value: selected.location },
                      { label: 'Languages', value: (selected.languages ?? []).join(', ') },
                    ].map((row, i) => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 13px', background: i % 2 ? '#faf8f8' : '#fff', borderBottom: i < 2 ? '1px solid #f0eeee' : 'none' }}>
                        <span style={{ ...F, fontSize: 11, color: '#aaa' }}>{row.label}</span>
                        <span style={{ ...F, fontSize: 11, fontWeight: 600, color: '#1a1a2e' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ ...F, fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>Skills</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {selected.skills.map(s => <span key={s} style={{ ...F, background: '#f5f2f2', borderRadius: 5, padding: '3px 9px', fontSize: 10, color: '#555', fontWeight: 500 }}>{s}</span>)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#faf8f8', borderRadius: 9, padding: '10px 13px', marginBottom: 14 }}>
                    <div style={{ ...F, fontSize: 11, color: '#aaa' }}>Starting at</div>
                    <div style={{ ...F, fontSize: 16, fontWeight: 700, color: '#800000', letterSpacing: '-0.01em' }}>
                      ${selected.service.price.toLocaleString()}<span style={{ fontSize: 10, fontWeight: 400, color: '#aaa' }}>/{selected.service.pricingType}</span>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ ...F, fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>Portfolio</div>
                    {selected.portfolio.map(p => (
                      <a key={p.label} href={p.url}
                        style={{ ...F, display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: '#800000', fontWeight: 600, background: '#fff5f5', padding: '7px 11px', borderRadius: 7, textDecoration: 'none', marginBottom: 6 }}>
                        <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        {p.label}
                      </a>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button onClick={() => toggleShortlist(selected)} className="btn-out"
                      style={{ ...F, width: '100%', padding: '9px', borderRadius: 9, background: shortlisted.includes(selected.id) ? '#fff5f5' : '#fff', border: `1.5px solid ${shortlisted.includes(selected.id) ? '#fca5a5' : '#e0dcdc'}`, color: shortlisted.includes(selected.id) ? '#800000' : '#555', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      {shortlisted.includes(selected.id) ? '♥ Remove from Shortlist' : '♡ Add to Shortlist'}
                    </button>
                    <button onClick={() => setApplyFor(selected)} className="btn-red"
                      style={{ ...F, width: '100%', padding: '9px', borderRadius: 9, background: '#800000', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      Proceed to VA Application →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer: Showing X of Y + Prev/Next ── */}
          {filtered.length > 0 && (
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <span style={{ ...F, fontSize: 11, color: '#aaa' }}>
                Showing <span style={{ fontWeight: 600, color: '#555' }}>{Math.min(visibleCount, filtered.length)}</span> of <span style={{ fontWeight: 600, color: '#555' }}>{filtered.length}</span> VAs based on your preferences
              </span>
              {filtered.length > 6 && (
                <div style={{ display: 'flex', gap: 6 }}>
                  {visibleCount > 6 && (
                    <button onClick={() => setVisibleCount(v => v - 6)} className="btn-out"
                      style={{ ...F, height: 32, padding: '0 14px', borderRadius: 8, border: '1.5px solid #e0dcdc', background: '#fff', color: '#555', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                      Prev
                    </button>
                  )}
                  {visibleCount < filtered.length && (
                    <button onClick={() => setVisibleCount(v => v + 6)} className="btn-out"
                      style={{ ...F, height: 32, padding: '0 14px', borderRadius: 8, border: '1.5px solid #e0dcdc', background: '#fff', color: '#555', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                      Next
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── SHORTLIST CONFIRM MODAL ── */}
      {confirmSL && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setConfirmSL(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 22, color: '#800000' }}>♥</div>
            <div style={{ ...F, fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 7 }}>Add to Shortlist?</div>
            <p style={{ ...F, fontSize: 12, color: '#555', marginBottom: 20, lineHeight: 1.65 }}>
              Shortlist <strong style={{ color: '#1a1a2e' }}>{confirmSL.name}</strong> for <span style={{ color: '#800000', fontWeight: 600 }}>{confirmSL.role}</span>?
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmSL(null)} style={{ ...F, flex: 1, padding: '10px', borderRadius: 9, background: '#fff', border: '1.5px solid #e0dcdc', color: '#555', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmShortlist} className="btn-red" style={{ ...F, flex: 1, padding: '10px', borderRadius: 9, background: '#800000', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Yes, Shortlist</button>
            </div>
          </div>
        </div>
      )}
      </>)}

    </div>
  )
}