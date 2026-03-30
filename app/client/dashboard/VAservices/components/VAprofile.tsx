'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// ─── MOCK VA DATA (same source as ChooseAVA, in real app fetch by vaId) ───────
const VA_DATA: Record<string, {
  id: string; name: string; role: string; avatar: string; rating: number;
  reviews: number; experience: string; skills: string[]; availability: string;
  hourlyRate: number; completedJobs: number; responseTime: string; bio: string;
  location: string; timezone: string; languages: string[]; education: string;
  portfolioItems: { title: string; desc: string; tag: string }[];
  workHistory: { client: string; role: string; duration: string; rating: number; review: string }[];
}> = {
  'va-001': {
    id: 'va-001', name: 'Maria Santos', role: 'Customer Service Specialist',
    avatar: 'MS', rating: 4.9, reviews: 124, experience: '5 yrs',
    skills: ['Live Chat', 'Email Support', 'CRM', 'Zendesk', 'HubSpot', 'Freshdesk', 'Intercom', 'CSAT Reporting'],
    availability: 'Available', hourlyRate: 12, completedJobs: 87, responseTime: '< 1 hr',
    bio: 'Dedicated Customer Service Representative with 5 years of experience in SaaS and eCommerce support. I specialize in de-escalation, CRM documentation, and building customer-first workflows that reduce ticket volumes by up to 40%.',
    location: 'Cebu City, PH', timezone: 'PST (UTC+8)', languages: ['English', 'Filipino'],
    education: 'BS Business Administration — University of San Carlos',
    portfolioItems: [
      { title: 'SaaS Helpdesk Overhaul', desc: 'Restructured ticket triage system reducing avg resolution time from 48hrs to 6hrs.', tag: 'Process' },
      { title: 'eCommerce Live Chat', desc: 'Managed 200+ daily chats with 98% CSAT score for a US-based retail brand.', tag: 'Live Chat' },
      { title: 'CRM Migration', desc: 'Led migration of 8,000 customer records from Freshdesk to HubSpot with zero data loss.', tag: 'CRM' },
    ],
    workHistory: [
      { client: 'TechFlow Inc.', role: 'Senior CSR', duration: '2 yrs', rating: 5.0, review: 'Maria is phenomenal. She reduced our support backlog by 60% in the first month.' },
      { client: 'ShopNow PH', role: 'CSR Team Lead', duration: '1.5 yrs', rating: 4.9, review: 'Reliable, professional, and truly cares about the customer experience.' },
      { client: 'CloudBase SaaS', role: 'CSR Specialist', duration: '8 mos', rating: 4.8, review: 'Handled high-volume queues with ease. Would rehire without hesitation.' },
    ],
  },
  'va-002': {
    id: 'va-002', name: 'James Reyes', role: 'Technical Support Engineer',
    avatar: 'JR', rating: 4.8, reviews: 98, experience: '6 yrs',
    skills: ['Tier 1–2 Support', 'API Troubleshooting', 'Shopify', 'SaaS Backends', 'Postman', 'SQL Basics', 'Jira', 'Confluence'],
    availability: 'Available', hourlyRate: 15, completedJobs: 63, responseTime: '< 2 hrs',
    bio: 'Technical Support Engineer with 6 years resolving complex SaaS and eCommerce platform issues. I bridge the gap between end-users and dev teams, handling everything from API troubleshooting to backend data discrepancies.',
    location: 'Manila, PH', timezone: 'PST (UTC+8)', languages: ['English', 'Filipino'],
    education: 'BS Information Technology — De La Salle University',
    portfolioItems: [
      { title: 'API Integration Support', desc: 'Supported 50+ merchant API integrations for a payments SaaS platform.', tag: 'Technical' },
      { title: 'Shopify Backend Ops', desc: 'Managed order discrepancy resolution and fulfillment troubleshooting for D2C brand.', tag: 'eCommerce' },
      { title: 'Escalation Playbook', desc: 'Built a Tier 1→2 escalation playbook reducing engineer interruptions by 35%.', tag: 'Process' },
    ],
    workHistory: [
      { client: 'PayFlow Ltd.', role: 'Tech Support Lead', duration: '2.5 yrs', rating: 4.9, review: 'James knows SaaS support inside out. Exceptional communicator with deep technical chops.' },
      { client: 'Storefront Co.', role: 'eCommerce TSR', duration: '2 yrs', rating: 4.7, review: 'Handled escalations calmly and documented everything perfectly.' },
      { client: 'DataVault SaaS', role: 'TSR Specialist', duration: '1 yr', rating: 4.8, review: 'Technically strong and reliable. Clients loved working with him.' },
    ],
  },
}

// Fallback for unlisted VA IDs
const DEFAULT_VA = VA_DATA['va-001']

function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function VAProfile() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const vaId        = searchParams.get('vaId') ?? 'va-001'
  const serviceId   = searchParams.get('service') ?? ''
  const serviceName = searchParams.get('name') ?? ''
  const categoryId  = searchParams.get('category') ?? ''

  const va = VA_DATA[vaId] ?? DEFAULT_VA
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'history'>('overview')

  const handleBookInterview = () => {
    router.push(`/client/dashboard/InterviewRecording?vaId=${va.id}&service=${serviceId}&name=${encodeURIComponent(serviceName)}&category=${categoryId}`)
  }

  const TABS = ['overview', 'portfolio', 'history'] as const

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: 24, background: '#fdfcfc', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .va-tab-btn { background: none; border: none; cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 12.5px; font-weight: 500; padding: 9px 16px; border-radius: 8px; color: #888; transition: all 0.15s; }
        .va-tab-btn:hover { background: #f5f3f3; color: #1a1a2e; }
        .va-tab-btn.active { background: #800000; color: #fff; }
        .book-btn:hover { background: #6a0000 !important; }
        .skill-chip { background: #f5f3f3; border: 1px solid #ece8e8; color: #444; font-size: 10.5px; font-family: 'Poppins', sans-serif; border-radius: 6px; padding: '3px 9px'; }
      `}</style>

      {/* Back */}
      <button
        onClick={() => router.back()}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 12, fontFamily: "'Poppins', sans-serif", marginBottom: 18, padding: 0 }}
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        Back to Choose VA
      </button>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {['Choose VA', 'View Profile', 'Interview', 'Project'].map((step, i) => (
          <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 3, borderRadius: 10, background: i <= 1 ? '#800000' : '#ece8e8' }} />
            <span style={{ fontSize: 9.5, color: i <= 1 ? '#800000' : '#bbb', fontFamily: "'Poppins', sans-serif", fontWeight: i <= 1 ? 600 : 400 }}>{step}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

        {/* ── LEFT: Main content ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Profile card */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0edec', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            {/* Hero gradient */}
            <div style={{ height: 80, background: 'linear-gradient(135deg,#800000 0%,#b03030 100%)', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: -28, left: 24, width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg,#800000,#c05050)', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                {va.avatar}
              </div>
            </div>
            <div style={{ padding: '36px 24px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 2px', letterSpacing: '-0.01em', fontFamily: "'Poppins', sans-serif" }}>{va.name}</h3>
                  <div style={{ fontSize: 12, color: '#888', fontFamily: "'Poppins', sans-serif" }}>{va.role}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                    <Stars rating={va.rating} size={13} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{va.rating}</span>
                    <span style={{ fontSize: 11, color: '#aaa', fontFamily: "'Poppins', sans-serif" }}>({va.reviews} reviews)</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f0fdf4', borderRadius: 20, padding: '4px 10px' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', fontFamily: "'Poppins', sans-serif" }}>{va.availability}</span>
                </div>
              </div>

              <p style={{ fontSize: 12.5, color: '#555', lineHeight: 1.7, margin: '14px 0 0', fontFamily: "'Poppins', sans-serif" }}>{va.bio}</p>

              {/* Meta chips */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
                {[
                  { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', text: va.location },
                  { icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064', text: va.timezone },
                  { icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129', text: va.languages.join(' · ') },
                ].map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#666', fontFamily: "'Poppins', sans-serif", background: '#faf9f9', borderRadius: 6, padding: '4px 8px', border: '1px solid #f0edec' }}>
                    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={m.icon}/></svg>
                    {m.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0edec', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', gap: 4, padding: '12px 16px', borderBottom: '1px solid #f5f2f2' }}>
              {TABS.map(t => (
                <button key={t} className={`va-tab-btn${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ padding: '20px 24px' }}>
              {/* Overview */}
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontFamily: "'Poppins', sans-serif" }}>Skills & Expertise</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {va.skills.map(s => (
                        <span key={s} style={{ background: '#f5f3f3', border: '1px solid #ece8e8', color: '#444', fontSize: 11, fontFamily: "'Poppins', sans-serif", borderRadius: 6, padding: '4px 10px' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontFamily: "'Poppins', sans-serif" }}>Education</div>
                    <div style={{ fontSize: 12.5, color: '#444', fontFamily: "'Poppins', sans-serif" }}>{va.education}</div>
                  </div>
                </div>
              )}

              {/* Portfolio */}
              {activeTab === 'portfolio' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {va.portfolioItems.map((item, i) => (
                    <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: '#faf9f9', border: '1px solid #f0edec', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: '#fff0f0', border: '1px solid #f0c0c0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{item.title}</span>
                          <span style={{ fontSize: 9, background: '#800000', color: '#fff', borderRadius: 4, padding: '2px 7px', fontWeight: 700, fontFamily: "'Poppins', sans-serif", letterSpacing: '0.05em' }}>{item.tag}</span>
                        </div>
                        <p style={{ fontSize: 12, color: '#666', margin: 0, lineHeight: 1.55, fontFamily: "'Poppins', sans-serif" }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Work History */}
              {activeTab === 'history' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {va.workHistory.map((h, i) => (
                    <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: '#faf9f9', border: '1px solid #f0edec' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{h.client}</span>
                          <span style={{ fontSize: 11, color: '#888', fontFamily: "'Poppins', sans-serif", marginLeft: 8 }}>· {h.role} · {h.duration}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Stars rating={h.rating} size={11} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{h.rating}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: 12, color: '#666', fontStyle: 'italic', margin: 0, lineHeight: 1.55, fontFamily: "'Poppins', sans-serif" }}>"{h.review}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Sticky sidebar ── */}
        <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Rate card */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0edec', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#aaa', fontWeight: 600, marginBottom: 4, fontFamily: "'Poppins', sans-serif" }}>Hourly Rate</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#800000', letterSpacing: '-0.02em', fontFamily: "'Poppins', sans-serif", lineHeight: 1, marginBottom: 14 }}>${va.hourlyRate}<span style={{ fontSize: 13, fontWeight: 500, color: '#aaa' }}>/hr</span></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {[
                { label: 'Experience', value: va.experience },
                { label: 'Jobs Completed', value: String(va.completedJobs) },
                { label: 'Avg. Response', value: va.responseTime },
                { label: 'Languages', value: va.languages.join(', ') },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: "'Poppins', sans-serif" }}>
                  <span style={{ color: '#aaa' }}>{s.label}</span>
                  <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{s.value}</span>
                </div>
              ))}
            </div>

            <button
              className="book-btn"
              onClick={handleBookInterview}
              style={{ width: '100%', padding: '12px 0', background: '#800000', color: '#fff', border: 'none', borderRadius: 10, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.02em', fontFamily: "'Poppins', sans-serif", transition: 'background 0.15s' }}
            >
              Book an Interview →
            </button>
            <div style={{ textAlign: 'center', fontSize: 10, color: '#bbb', marginTop: 8, fontFamily: "'Poppins', sans-serif" }}>Free 30-min discovery call</div>
          </div>

          {/* Service context */}
          {serviceName && (
            <div style={{ background: '#fff6f6', borderRadius: 12, border: '1px solid #f0c0c0', padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#800000', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>Selected Service</div>
              <div style={{ fontSize: 12, color: '#333', fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>{decodeURIComponent(serviceName)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}