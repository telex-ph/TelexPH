'use client'
import { useState, useMemo, useRef, useEffect } from 'react'

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

// ─── HIRE REQUEST PAGE ───────────────────────────────────────────────────────
function HireRequestPage({ va, onBack, onDone }: { va: VA; onBack: () => void; onDone: () => void }) {
  const [submitted, setSubmitted] = useState(true)

  const steps = [
    { label: 'Request Submitted', sub: 'Sent to admin for review', icon: '📨', done: true, active: false },
    { label: 'Admin Review', sub: 'Pending approval decision', icon: '🔍', done: false, active: true },
    { label: 'Decision Made', sub: 'Approved or declined', icon: '⚖️', done: false, active: false },
    { label: 'Client Notified', sub: 'Email notification sent', icon: '🔔', done: false, active: false },
    { label: 'Onboarding Begins', sub: 'VA assigned to client', icon: '🎉', done: false, active: false },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f4', fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.75)} }
        @keyframes check-pop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
        .hr-fadein { animation: fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .hr-scalein { animation: scaleIn 0.35s cubic-bezier(0.22,1,0.36,1) both; }
        .pulse-dot { animation: pulse-dot 1.5s ease-in-out infinite; }
        .hr-btn { transition: all 0.14s ease; cursor: pointer; }
        .hr-btn:hover { opacity: 0.87; transform: translateY(-1px); }
        .hr-btn:active { transform: translateY(0); }
      `}</style>

      {/* Top nav */}
      <div style={{ background: '#fff', borderBottom: '1px solid #ece8e8', padding: '13px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onBack} className="hr-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, color: '#555', background: '#f7f5f5', border: '1.5px solid #e0dcdc', padding: '6px 14px', borderRadius: 8, fontWeight: 600 }}>
            ← Back
          </button>
          <div style={{ width: 1, height: 18, background: '#e8e4e4' }} />
          <div>
            <div style={{ fontSize: 9, color: '#aaa', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Hire Request</div>
            <div style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 700 }}>Request Status</div>
          </div>
        </div>
        {/* VA chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#faf8f8', border: '1.5px solid #ece8e8', borderRadius: 11, padding: '7px 16px' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `${va.color}15`, border: `1.5px solid ${va.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: va.color }}>{va.initials}</span>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>{va.name}</div>
            <div style={{ fontSize: 9, color: '#aaa' }}>{va.role} · {va.location}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 20, padding: '5px 14px' }}>
          <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#92400e' }}>Pending Admin Approval</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* Hero success card */}
        <div className="hr-scalein" style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.07)', marginBottom: 20 }}>
          <div style={{ height: 5, background: 'linear-gradient(to right, #800000, #b91c1c, #f87171)' }} />
          <div style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #800000, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, boxShadow: '0 6px 20px rgba(128,0,0,0.25)', animation: 'check-pop 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s both' }}>
              📨
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Successfully Submitted</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em', marginBottom: 4 }}>Hire Request Sent!</div>
              <div style={{ fontSize: 12, color: '#777', lineHeight: 1.65 }}>
                Your request to hire <strong style={{ color: '#800000' }}>{va.name}</strong> has been submitted to the admin team. You will be notified by email once a decision is made.
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4 }}>Request ID</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', background: '#f5f2f2', borderRadius: 8, padding: '4px 12px', letterSpacing: '0.04em' }}>
                #{String(va.id).padStart(3, '0')}-{new Date().getFullYear()}
              </div>
              <div style={{ fontSize: 10, color: '#aaa', marginTop: 6 }}>
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>

          {/* VA Summary */}
          <div className="hr-fadein" style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', animationDelay: '0.05s' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14 }}>VA Details</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 13, background: `${va.color}15`, border: `2px solid ${va.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: va.color }}>{va.initials}</span>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1a2e' }}>{va.name}</div>
                <div style={{ fontSize: 11, color: '#777', marginTop: 1 }}>{va.role}</div>
              </div>
            </div>
            {[
              { label: 'Category', value: va.category },
              { label: 'Type', value: va.type },
              { label: 'Level', value: va.level },
              { label: 'Rate', value: `$${va.rate}/hr` },
              { label: 'Location', value: va.location },
              { label: 'Service', value: va.service.name },
              { label: 'Starting at', value: `$${va.service.price.toLocaleString()}/${va.service.pricingType}` },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < arr.length - 1 ? '1px solid #f5f2f2' : 'none' }}>
                <span style={{ fontSize: 11, color: '#aaa' }}>{row.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#1a1a2e' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* What happens next */}
          <div className="hr-fadein" style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', animationDelay: '0.1s' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14 }}>What Happens Next</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { icon: '📨', title: 'Request Submitted', desc: 'Your hire request is now with admin', done: true },
                { icon: '🔍', title: 'Admin Reviews', desc: 'Admin evaluates the request and VA fit', done: false, active: true },
                { icon: '⚖️', title: 'Decision Made', desc: 'Approved or declined by admin', done: false },
                { icon: '🔔', title: 'You Get Notified', desc: 'Email sent to you with the decision', done: false },
                { icon: '🎉', title: 'Onboarding Begins', desc: 'VA is assigned and kickoff is scheduled', done: false },
              ].map((step, i, arr) => (
                <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i < arr.length - 1 ? 14 : 0 }}>
                  {/* Left: icon + line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: step.done ? 'linear-gradient(135deg,#800000,#b91c1c)' : step.active ? '#fffbeb' : '#f5f2f2', border: step.done ? 'none' : step.active ? '2px solid #fbbf24' : '2px solid #e8e4e4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, boxShadow: step.done ? '0 2px 8px rgba(128,0,0,0.2)' : 'none' }}>
                      {step.done ? <span style={{ fontSize: 12 }}>✓</span> : <span>{step.icon}</span>}
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 14, background: step.done ? '#800000' : '#f0eeee', marginTop: 3 }} />
                    )}
                  </div>
                  {/* Right: text */}
                  <div style={{ paddingTop: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: step.done ? '#800000' : step.active ? '#92400e' : '#bbb' }}>
                      {step.title}
                      {step.active && <span className="pulse-dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', marginLeft: 6, verticalAlign: 'middle' }} />}
                    </div>
                    <div style={{ fontSize: 10, color: step.done ? '#555' : step.active ? '#a16207' : '#ccc', marginTop: 2, lineHeight: 1.5 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notification info banner */}
        <div className="hr-fadein" style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 14, animationDelay: '0.15s' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#dbeafe', border: '1.5px solid #93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🔔</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1e40af', marginBottom: 4 }}>You will be notified when admin decides</div>
            <div style={{ fontSize: 11, color: '#3b82f6', lineHeight: 1.7 }}>
              Once the admin <strong>approves</strong> your hire request, you'll receive an email notification and onboarding with <strong>{va.name}</strong> will begin automatically. If <strong>declined</strong>, you'll also be notified with a reason.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="hr-fadein" style={{ display: 'flex', gap: 12, animationDelay: '0.2s' }}>
          <button onClick={onDone} className="hr-btn"
            style={{ flex: 1, padding: '13px', borderRadius: 12, background: '#f7f5f5', border: '1.5px solid #e0dcdc', color: '#555', fontSize: 12, fontWeight: 700 }}>
            ← Back to Browse VAs
          </button>
          <button onClick={onDone} className="hr-btn"
            style={{ flex: 2, padding: '13px', borderRadius: 12, background: 'linear-gradient(135deg, #7f1d1d, #b91c1c)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, boxShadow: '0 4px 14px rgba(128,0,0,0.2)' }}>
            Done — View All VAs
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── ADD PLAN SCREEN ─────────────────────────────────────────────────────────
type PlanTask = { id: number; text: string; category: string }

function AddPlan({ va, onBack, onNext }: { va: VA; onBack: () => void; onNext: () => void }) {
  const PRESET_TASKS: { category: string; icon: string; color: string; tasks: string[] }[] = [
    { category: 'Communication', icon: '💬', color: '#7c3aed', tasks: ['Daily standup updates', 'Weekly progress reports', 'Email management & filtering', 'Client communication handling'] },
    { category: 'Admin & Operations', icon: '📋', color: '#0891b2', tasks: ['Calendar & scheduling management', 'Data entry & database updates', 'Document preparation & filing', 'Travel & meeting coordination'] },
    { category: 'Marketing & Content', icon: '📣', color: '#db2777', tasks: ['Social media posting & scheduling', 'Blog & content writing', 'Graphic design using Canva', 'Email newsletter creation'] },
    { category: 'Research & Reports', icon: '🔍', color: '#d97706', tasks: ['Market & competitor research', 'Lead generation & prospecting', 'Data analysis & reporting', 'Product/service research'] },
    { category: 'Customer Support', icon: '🎧', color: '#059669', tasks: ['Live chat support', 'Ticket & complaint resolution', 'CRM updates & follow-ups', 'Onboarding assistance'] },
  ]

  const [selectedTasks, setSelectedTasks] = useState<number[]>([])
  const [customText, setCustomText]       = useState('')
  const [customTasks, setCustomTasks]     = useState<PlanTask[]>([])
  const [nextId, setNextId]               = useState(1000)
  const [activeCategory, setActiveCategory] = useState(0)

  // Build flat task list with ids
  const allPresets: PlanTask[] = PRESET_TASKS.flatMap((cat, ci) =>
    cat.tasks.map((t, ti) => ({ id: ci * 100 + ti, text: t, category: cat.category }))
  )

  const toggleTask = (id: number) => {
    setSelectedTasks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const addCustom = () => {
    const trimmed = customText.trim()
    if (!trimmed) return
    setCustomTasks(prev => [...prev, { id: nextId, text: trimmed, category: 'Custom' }])
    setNextId(n => n + 1)
    setCustomText('')
  }

  const removeCustom = (id: number) => setCustomTasks(prev => prev.filter(t => t.id !== id))

  const totalSelected = selectedTasks.length + customTasks.length

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f4', ...F }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .ap-task { transition: all 0.14s ease; cursor: pointer; }
        .ap-task:hover { transform: translateX(2px); }
        .ap-btn { transition: all 0.14s ease; cursor: pointer; }
        .ap-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .ap-btn:active { transform: translateY(0); }
        .ap-cat { transition: all 0.14s ease; cursor: pointer; }
        .ap-cat:hover { background: #f0eeee !important; }
      `}</style>

      {/* Top nav */}
      <div style={{ background: '#fff', borderBottom: '1px solid #ece8e8', padding: '13px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onBack} className="ap-btn"
            style={{ ...F, display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, color: '#555', background: '#f7f5f5', border: '1.5px solid #e0dcdc', padding: '6px 14px', borderRadius: 8, fontWeight: 600 }}>
            ← Back
          </button>
          <div style={{ width: 1, height: 18, background: '#e8e4e4' }} />
          <div>
            <div style={{ ...F, fontSize: 9, color: '#aaa', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Step 1 of 2</div>
            <div style={{ ...F, fontSize: 13, color: '#1a1a2e', fontWeight: 700 }}>Add Plan for VA</div>
          </div>
        </div>

        {/* VA chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#faf8f8', border: '1.5px solid #ece8e8', borderRadius: 11, padding: '7px 16px' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `${va.color}15`, border: `1.5px solid ${va.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ ...F, fontSize: 10, fontWeight: 700, color: va.color }}>{va.initials}</span>
          </div>
          <div>
            <div style={{ ...F, fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>{va.name}</div>
            <div style={{ ...F, fontSize: 9, color: '#aaa' }}>{va.role}</div>
          </div>
        </div>

        {/* Step pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: 20, padding: '5px 14px' }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#800000', color: '#fff', fontSize: 9, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</span>
            <span style={{ ...F, fontSize: 10, fontWeight: 700, color: '#800000' }}>Add Plan</span>
          </div>
          <div style={{ width: 20, height: 1, background: '#e0dcdc' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f5f2f2', border: '1.5px solid #e0dcdc', borderRadius: 20, padding: '5px 14px' }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#e0dcdc', color: '#aaa', fontSize: 9, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</span>
            <span style={{ ...F, fontSize: 10, fontWeight: 600, color: '#aaa' }}>Video Interview</span>
          </div>
        </div>
      </div>

      {/* ── PAGE HEADER ── */}
      <div style={{ padding: '20px 28px 0' }}>
        <p style={{ ...F, fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>VA Application,</p>
        <h1 style={{ ...F, fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Virtual Assistants</h1>
        <p style={{ ...F, fontSize: 13, color: '#555', fontWeight: 400, margin: '4px 0 0' }}>Browse and hire top-tier VAs across all skills and categories.</p>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 28px 32px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18, alignItems: 'start' }}>

        {/* LEFT — task picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Header */}
          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ height: 4, background: va.color }} />
            <div style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${va.color}15`, border: `2px solid ${va.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ ...F, fontSize: 18, fontWeight: 800, color: va.color }}>{va.initials}</span>
              </div>
              <div>
                <div style={{ ...F, fontSize: 9, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Building a plan for</div>
                <div style={{ ...F, fontSize: 17, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}>{va.name}</div>
                <div style={{ ...F, fontSize: 12, color: '#555' }}>{va.role} · {va.location}</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ ...F, fontSize: 11, color: '#aaa', marginBottom: 3 }}>Tasks selected</div>
                <div style={{ ...F, fontSize: 28, fontWeight: 800, color: '#800000', letterSpacing: '-0.03em' }}>{totalSelected}</div>
              </div>
            </div>
          </div>

          {/* Category tabs */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ ...F, fontSize: 9, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10 }}>Task Categories</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {PRESET_TASKS.map((cat, i) => (
                <button key={i} onClick={() => setActiveCategory(i)} className="ap-cat"
                  style={{ ...F, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 13px', borderRadius: 8, fontSize: 11, fontWeight: 600, border: 'none', background: activeCategory === i ? '#800000' : '#f5f2f2', color: activeCategory === i ? '#fff' : '#555' }}>
                  {cat.icon} {cat.category}
                </button>
              ))}
            </div>
          </div>

          {/* Task grid for active category */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '18px 18px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 18 }}>{PRESET_TASKS[activeCategory].icon}</span>
              <div style={{ ...F, fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{PRESET_TASKS[activeCategory].category}</div>
              <div style={{ marginLeft: 'auto', ...F, fontSize: 10, color: '#aaa' }}>
                {PRESET_TASKS[activeCategory].tasks.filter((_, ti) => selectedTasks.includes(activeCategory * 100 + ti)).length} selected
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {PRESET_TASKS[activeCategory].tasks.map((task, ti) => {
                const id      = activeCategory * 100 + ti
                const checked = selectedTasks.includes(id)
                return (
                  <div key={id} className="ap-task" onClick={() => toggleTask(id)}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 11, background: checked ? '#fff5f5' : '#faf8f8', border: checked ? '1.5px solid #fca5a5' : '1.5px solid #f0eeee' }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, background: checked ? '#800000' : '#fff', border: checked ? '2px solid #800000' : '2px solid #d1c9c9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      {checked && <span style={{ color: '#fff', fontSize: 9, fontWeight: 800, lineHeight: 1 }}>✓</span>}
                    </div>
                    <span style={{ ...F, fontSize: 12, color: checked ? '#800000' : '#555', fontWeight: checked ? 600 : 400, lineHeight: 1.5 }}>{task}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Custom task input */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '18px 18px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ ...F, fontSize: 9, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10 }}>Add Custom Task</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom()}
                placeholder="e.g. Manage Shopify product listings…"
                style={{ ...F, flex: 1, border: '1.5px solid #e0dcdc', borderRadius: 9, padding: '9px 13px', fontSize: 12, color: '#333', background: '#faf8f8', outline: 'none' }}
              />
              <button onClick={addCustom} className="ap-btn"
                style={{ ...F, padding: '9px 18px', borderRadius: 9, background: '#800000', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                + Add
              </button>
            </div>
            {customTasks.length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {customTasks.map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: '#fff5f5', border: '1.5px solid #fca5a5' }}>
                    <span style={{ color: '#800000', fontWeight: 700, fontSize: 11 }}>✓</span>
                    <span style={{ ...F, fontSize: 12, color: '#800000', fontWeight: 500, flex: 1 }}>{t.text}</span>
                    <button onClick={() => removeCustom(t.id)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center' }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — plan summary + action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 80 }}>

          {/* Summary card */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            <div style={{ background: '#800000', padding: '16px 20px' }}>
              <div style={{ ...F, fontSize: 9, color: 'rgba(255,255,255,0.55)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Your Plan Summary</div>
              <div style={{ ...F, fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{va.name}'s Tasks</div>
              <div style={{ ...F, fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>{totalSelected} task{totalSelected !== 1 ? 's' : ''} selected</div>
            </div>
            <div style={{ padding: '14px 18px', maxHeight: 320, overflow: 'auto' }}>
              {totalSelected === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                  <div style={{ ...F, fontSize: 12, color: '#aaa', lineHeight: 1.6 }}>No tasks selected yet.<br/>Pick from the categories on the left.</div>
                </div>
              ) : (
                <>
                  {PRESET_TASKS.map((cat, ci) => {
                    const catSelected = cat.tasks.filter((_, ti) => selectedTasks.includes(ci * 100 + ti))
                    if (catSelected.length === 0) return null
                    return (
                      <div key={ci} style={{ marginBottom: 12 }}>
                        <div style={{ ...F, fontSize: 9, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span>{cat.icon}</span> {cat.category}
                        </div>
                        {catSelected.map((task, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 5 }}>
                            <span style={{ color: '#800000', fontWeight: 700, fontSize: 11, marginTop: 1, flexShrink: 0 }}>✓</span>
                            <span style={{ ...F, fontSize: 11, color: '#555', lineHeight: 1.5 }}>{task}</span>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                  {customTasks.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ ...F, fontSize: 9, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>✏️ Custom</div>
                      {customTasks.map(t => (
                        <div key={t.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 5 }}>
                          <span style={{ color: '#800000', fontWeight: 700, fontSize: 11, marginTop: 1, flexShrink: 0 }}>✓</span>
                          <span style={{ ...F, fontSize: 11, color: '#555', lineHeight: 1.5 }}>{t.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* VA details mini */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ ...F, fontSize: 9, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Hiring For</div>
            {[
              { label: 'Role',      value: va.role },
              { label: 'Rate',      value: `$${va.rate}/hr` },
              { label: 'Type',      value: va.type },
              { label: 'Level',     value: va.level },
              { label: 'Service',   value: va.service.name },
              { label: 'Starting',  value: `$${va.service.price.toLocaleString()}/${va.service.pricingType}` },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < arr.length - 1 ? '1px solid #f5f2f2' : 'none' }}>
                <span style={{ ...F, fontSize: 11, color: '#aaa' }}>{row.label}</span>
                <span style={{ ...F, fontSize: 11, fontWeight: 600, color: '#1a1a2e' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Proceed button */}
          <button
            onClick={onNext}
            disabled={totalSelected === 0}
            className="ap-btn"
            style={{ ...F, width: '100%', padding: '14px', borderRadius: 12, background: totalSelected > 0 ? '#800000' : '#d1c9c9', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: totalSelected > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {totalSelected === 0 ? 'Select at least 1 task' : `Continue to Video Interview →`}
          </button>
          {totalSelected > 0 && (
            <p style={{ ...F, fontSize: 10, color: '#aaa', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
              {totalSelected} task{totalSelected !== 1 ? 's' : ''} will be shared with {va.name} during onboarding
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── INTERVIEW PLAYBACK / REVIEW SCREEN ──────────────────────────────────────
function InterviewRecording({ va, onBack, onComplete, onHireRequest }: { va: VA; onBack: () => void; onComplete: () => void; onHireRequest: () => void }) {
  // Simulated recorded interview data — each question has a "recorded duration" in seconds
  const questions = [
    { q: `Tell us about yourself and why you're interested in the ${va.role} position.`, hint: 'Briefly introduce your background and motivation.', duration: 98, label: 'Intro & Motivation' },
    { q: `What experience do you have with ${va.skills.slice(0, 2).join(' and ')}?`, hint: 'Share specific examples and outcomes.', duration: 112, label: 'Skills & Experience' },
    { q: 'How do you manage your time and prioritize tasks when working remotely?', hint: 'Mention tools or strategies you use.', duration: 85, label: 'Remote Work Style' },
    { q: 'Describe a challenging situation you faced with a client and how you resolved it.', hint: 'Use the STAR method: Situation, Task, Action, Result.', duration: 107, label: 'Problem Solving' },
  ]

  const totalDuration = questions.reduce((s, q) => s + q.duration, 0)

  // Chapter start offsets in total timeline
  const chapterOffsets = questions.reduce<number[]>((acc, q, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + questions[i - 1].duration)
    return acc
  }, [])

  const [isPlaying, setIsPlaying]           = useState(false)
  const [currentTime, setCurrentTime]       = useState(0)
  const [activeChapter, setActiveChapter]   = useState(0)
  const [volume, setVolume]                 = useState(80)
  const [isMuted, setIsMuted]               = useState(false)
  const [showDecision, setShowDecision]     = useState(false)
  const [decision, setDecision]             = useState<'pending' | 'pass' | null>(null)
  const [hireRequestSent, setHireRequestSent] = useState(false)
  const [hovered, setHovered]               = useState(false)
  const [scrubbing, setScrubbing]           = useState(false)
  const [scrubPreview, setScrubPreview]     = useState(0)
  const [playbackRate, setPlaybackRate]     = useState(1)
  const [isFullscreen, setIsFullscreen]     = useState(false)
  const playIntervalRef                     = useRef<NodeJS.Timeout | null>(null)
  const scrubberRef                         = useRef<HTMLDivElement>(null)

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.round(s % 60)).padStart(2, '0')}`

  // Derive current chapter from currentTime
  useEffect(() => {
    let chap = 0
    for (let i = 0; i < chapterOffsets.length; i++) {
      if (currentTime >= chapterOffsets[i]) chap = i
    }
    setActiveChapter(chap)
  }, [currentTime])

  // Playback tick
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration - 0.1) {
            setIsPlaying(false)
            return totalDuration
          }
          return prev + 0.1 * playbackRate
        })
      }, 100)
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current)
    }
    return () => { if (playIntervalRef.current) clearInterval(playIntervalRef.current) }
  }, [isPlaying, playbackRate])

  const seekTo = (pct: number) => {
    const t = Math.max(0, Math.min(totalDuration, pct * totalDuration))
    setCurrentTime(t)
  }

  const jumpToChapter = (i: number) => {
    setCurrentTime(chapterOffsets[i])
    setIsPlaying(true)
  }

  const skipSeconds = (s: number) => {
    setCurrentTime(prev => Math.max(0, Math.min(totalDuration, prev + s)))
  }

  const handleScrubberInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubberRef.current) return
    const rect = scrubberRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    seekTo(pct)
  }

  const handleMouseMoveOnScrubber = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubberRef.current) return
    const rect = scrubberRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setScrubPreview(pct * totalDuration)
    if (scrubbing) seekTo(pct)
  }

  const progressPct = (currentTime / totalDuration) * 100
  const chapTimeLocal = currentTime - chapterOffsets[activeChapter]
  const chapDuration  = questions[activeChapter].duration

  // Build waveform bars (decorative, simulated)
  const waveBars = Array.from({ length: 80 }, (_, i) => {
    const base = Math.sin(i * 0.4) * 0.3 + Math.sin(i * 0.13) * 0.5 + Math.random() * 0.2
    return Math.max(0.08, Math.min(1, Math.abs(base)))
  })

  return (
    <div style={{ background: '#f7f6f4', ...F }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0)} 50%{box-shadow:0 0 0 6px rgba(239,68,68,0.15)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .ibtn { transition: all 0.14s ease; cursor: pointer; }
        .ibtn:hover { opacity: 0.82; transform: scale(1.04); }
        .ibtn:active { transform: scale(0.97); }
        .chap-row { transition: background 0.18s, border-color 0.18s; cursor: pointer; }
        .chap-row:hover { background: #f5f2f2 !important; }
        .scrubber-wrap:hover .scrub-thumb { opacity: 1 !important; }
        .scrubber-wrap:hover .scrub-track { height: 6px !important; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:#b91c1c; cursor:pointer; }
        input[type=range]::-webkit-slider-runnable-track { height:4px; border-radius:2px; }
      `}</style>

      {/* ── TOP NAV ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 28px', borderBottom: '1px solid #ece8e8', background: '#fff', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onBack} className="ibtn"
            style={{ ...F, display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, color: '#555', background: '#f7f5f5', border: '1.5px solid #e0dcdc', padding: '6px 14px', borderRadius: 8, fontWeight: 600 }}>
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back
          </button>
          <div style={{ width: 1, height: 18, background: '#e8e4e4' }} />
          <div>
            <div style={{ ...F, fontSize: 9, color: '#aaa', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Interview Review</div>
            <div style={{ ...F, fontSize: 13, color: '#1a1a2e', fontWeight: 700 }}>VA Video Playback</div>
          </div>
        </div>

        {/* VA chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#faf8f8', border: '1.5px solid #ece8e8', borderRadius: 11, padding: '7px 16px' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `${va.color}22`, border: `1.5px solid ${va.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ ...F, fontSize: 10, fontWeight: 700, color: va.color }}>{va.initials}</span>
          </div>
          <div>
            <div style={{ ...F, fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>{va.name}</div>
            <div style={{ ...F, fontSize: 9, color: '#aaa' }}>{va.role} · {va.location}</div>
          </div>
          <div style={{ marginLeft: 10, ...F, fontSize: 14, fontWeight: 700, color: '#800000' }}>${va.rate}<span style={{ fontSize: 9, color: '#aaa', fontWeight: 400 }}>/hr</span></div>
        </div>

        <button
          onClick={() => setShowDecision(true)}
          className="ibtn"
          style={{ ...F, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #7f1d1d, #b91c1c)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700 }}>
          Make Decision →
        </button>
      </div>


      {/* ── PAGE HEADER ── */}
      <div style={{ padding: '20px 28px 0' }}>
        <p style={{ ...F, fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>VA Application,</p>
        <h1 style={{ ...F, fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Virtual Assistants</h1>
        <p style={{ ...F, fontSize: 13, color: '#555', fontWeight: 400, margin: '4px 0 0' }}>Browse and hire top-tier VAs across all skills and categories.</p>
      </div>
      {/* ── MAIN CONTENT ── */}
      <div style={{ padding: '0 28px', display: 'grid', gridTemplateColumns: '1fr 340px' }}>

        {/* LEFT — video + controls */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '22px 20px 22px 28px', gap: 14 }}>

          {/* Video stage */}
          {/* Fullscreen overlay */}
          {isFullscreen && (
            <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

              {/* 
                Responsive fullscreen video:
                Use min(100vw, 100vh * 16/9) for width so it always fits both axes.
              */}
              <div style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                background: `radial-gradient(ellipse at 40% 35%, ${va.color}28 0%, #0a0a0c 65%)`,
                overflow: 'hidden',
              }}>
                {/* VA avatar center */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 'min(140px, 18vw)', height: 'min(140px, 18vw)', borderRadius: 28, background: `${va.color}20`, border: `3px solid ${va.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: `0 0 80px ${va.color}30` }}>
                      <span style={{ ...F, fontSize: 'min(48px, 6vw)', fontWeight: 800, color: va.color }}>{va.initials}</span>
                    </div>
                    <div style={{ ...F, fontSize: 'min(22px, 2.8vw)', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 6 }}>{va.name}</div>
                    <div style={{ ...F, fontSize: 'min(14px, 1.8vw)', color: 'rgba(255,255,255,0.5)' }}>{va.role}</div>
                  </div>
                </div>

                {/* Chapter badge — top left */}
                <div style={{ position: 'absolute', top: 18, left: 18, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)', borderRadius: 8, padding: '6px 14px', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ ...F, fontSize: 10, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Chapter {activeChapter + 1} of {questions.length}</div>
                  <div style={{ ...F, fontSize: 13, color: '#fff', fontWeight: 700 }}>{questions[activeChapter].label}</div>
                </div>

                {/* Name badge — bottom left, raised above controls bar */}
                <div style={{ position: 'absolute', bottom: 68, left: 18, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '8px 14px', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ ...F, fontSize: 13, fontWeight: 700, color: '#fff' }}>{va.name}</div>
                  <div style={{ ...F, fontSize: 9, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>{va.role} · Applicant</div>
                </div>

                {/* ── MINI CONTROLS BAR — bottom of fullscreen ── */}
                <div
                  onClick={e => e.stopPropagation()}
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '8px 16px 10px', display: 'flex', flexDirection: 'column', gap: 6, zIndex: 10 }}>

                  {/* Mini scrubber */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ ...F, fontSize: 10, color: 'rgba(255,255,255,0.55)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{formatTime(currentTime)}</span>
                    <div
                      style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2, position: 'relative', cursor: 'pointer' }}
                      onClick={e => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
                        setCurrentTime(pct * totalDuration)
                      }}>
                      {/* Chapter segments */}
                      {questions.map((q, i) => (
                        <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: `${(chapterOffsets[i] / totalDuration) * 100}%`, width: `${(q.duration / totalDuration) * 100}%`, background: i % 2 === 0 ? 'rgba(185,28,28,0.2)' : 'rgba(185,28,28,0.1)', borderRight: i < questions.length - 1 ? '1px solid rgba(251,146,60,0.5)' : 'none' }} />
                      ))}
                      {/* Fill */}
                      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${(currentTime / totalDuration) * 100}%`, background: 'linear-gradient(to right, #7f1d1d, #dc2626)', borderRadius: 2 }} />
                      {/* Thumb */}
                      <div style={{ position: 'absolute', top: '50%', left: `${(currentTime / totalDuration) * 100}%`, transform: 'translate(-50%, -50%)', width: 10, height: 10, borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 2px rgba(185,28,28,0.6)' }} />
                    </div>
                    <span style={{ ...F, fontSize: 10, color: 'rgba(255,255,255,0.35)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{formatTime(totalDuration)}</span>
                  </div>

                  {/* Playback row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Left: skip + play */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => setCurrentTime(t => Math.max(0, t - 10))} className="ibtn"
                        style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 0, cursor: 'pointer' }}>
                        <span style={{ fontSize: 11 }}>⟨⟨</span>
                        <span style={{ fontSize: 6, color: 'rgba(255,255,255,0.4)', marginTop: -1 }}>10s</span>
                      </button>
                      <button onClick={() => setIsPlaying(p => !p)} className="ibtn"
                        style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #800000, #b91c1c)', border: 'none', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(185,28,28,0.5)' }}>
                        {isPlaying ? '⏸' : '▶'}
                      </button>
                      <button onClick={() => setCurrentTime(t => Math.min(totalDuration, t + 10))} className="ibtn"
                        style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', cursor: 'pointer' }}>
                        <span style={{ fontSize: 11 }}>⟩⟩</span>
                        <span style={{ fontSize: 6, color: 'rgba(255,255,255,0.4)', marginTop: -1 }}>10s</span>
                      </button>
                    </div>

                    {/* Center: chapter label */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ ...F, fontSize: 10, fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{formatTime(chapTimeLocal)} <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>/ {formatTime(chapDuration)}</span></div>
                      <div style={{ ...F, fontSize: 8, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>Ch.{activeChapter + 1}: {questions[activeChapter].label}</div>
                    </div>

                    {/* Right: speed + zoom out */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {[0.75, 1, 1.5, 2].map(r => (
                        <button key={r} onClick={() => setPlaybackRate(r)} className="ibtn"
                          style={{ ...F, padding: '3px 7px', borderRadius: 5, background: playbackRate === r ? '#800000' : 'rgba(255,255,255,0.08)', border: 'none', color: playbackRate === r ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>
                          {r}×
                        </button>
                      ))}
                      <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />
                      {/* Zoom out */}
                      <button onClick={() => setIsFullscreen(false)} className="ibtn"
                        style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setIsPlaying(p => !p)}
            style={{ position: 'relative', background: '#000', borderRadius: 18, aspectRatio: '16/9', overflow: 'hidden', cursor: 'pointer', border: '1.5px solid #e8e4e4', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', flexShrink: 0 }}>

            {/* Simulated video — dark gradient stand-in with VA initials, zoomable */}
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 40% 35%, ${va.color}28 0%, #0a0a0c 65%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Grid texture */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <div style={{ width: 100, height: 100, borderRadius: 24, background: `${va.color}20`, border: `3px solid ${va.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: `0 0 60px ${va.color}20` }}>
                  <span style={{ ...F, fontSize: 34, fontWeight: 800, color: va.color }}>{va.initials}</span>
                </div>
                <div style={{ ...F, fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 4 }}>{va.name}</div>
                <div style={{ ...F, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{va.role}</div>
              </div>
            </div>

            {/* Play/pause overlay on hover */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', opacity: hovered || !isPlaying ? 1 : 0, transition: 'opacity 0.25s', pointerEvents: 'none' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {isPlaying ? '⏸' : '▶'}
              </div>
            </div>

            {/* Chapter badge top-left */}
            <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', borderRadius: 8, padding: '5px 12px', border: '1px solid rgba(255,255,255,0.1)', zIndex: 5 }}>
              <div style={{ ...F, fontSize: 9, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 1 }}>Chapter {activeChapter + 1} of {questions.length}</div>
              <div style={{ ...F, fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>{questions[activeChapter].label}</div>
            </div>

            {/* Time badge top-right */}
            <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', borderRadius: 8, padding: '5px 12px', border: '1px solid rgba(255,255,255,0.1)', zIndex: 5 }}>
              <span style={{ ...F, fontSize: 12, color: '#fff', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatTime(currentTime)}</span>
              <span style={{ ...F, fontSize: 10, color: 'rgba(255,255,255,0.5)' }}> / {formatTime(totalDuration)}</span>
            </div>

            {/* Zoom In / expand button — bottom right, icon only */}
            <button
              onClick={e => { e.stopPropagation(); setIsFullscreen(true) }}
              style={{ position: 'absolute', bottom: 14, right: 14, width: 32, height: 32, borderRadius: 9, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 6, transition: 'all 0.15s' }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>
              </svg>
            </button>

            {/* Name badge bottom-left */}
            <div style={{ position: 'absolute', bottom: 14, left: 14, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '8px 14px', zIndex: 5, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ ...F, fontSize: 12, fontWeight: 700, color: '#fff' }}>{va.name}</div>
              <div style={{ ...F, fontSize: 9, color: 'rgba(255,255,255,0.65)', marginTop: 1 }}>{va.role} · Applicant</div>
            </div>

            {/* Playback rate badge */}
            {playbackRate !== 1 && (
              <div style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(185,28,28,0.8)', backdropFilter: 'blur(8px)', borderRadius: 7, padding: '4px 10px', zIndex: 5 }}>
                <span style={{ ...F, fontSize: 11, fontWeight: 700, color: '#fff' }}>{playbackRate}×</span>
              </div>
            )}
          </div>

          {/* ── CONTROLS PANEL ── */}
          <div style={{ background: '#fff', border: '1px solid #ece8e8', borderRadius: 16, padding: '16px 20px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Waveform + scrubber */}
            <div>
              {/* Waveform visual */}
              <div style={{ height: 36, display: 'flex', alignItems: 'center', gap: 1.5, marginBottom: 4, paddingBottom: 4 }}>
                {waveBars.map((h, i) => {
                  const barTime = (i / waveBars.length) * totalDuration
                  const isPast = barTime <= currentTime
                  // Mark chapter boundaries
                  const isChapterMark = chapterOffsets.some((o, ci) => ci > 0 && Math.abs(i - Math.round((o / totalDuration) * waveBars.length)) <= 1)
                  return (
                    <div key={i} style={{
                      flex: 1,
                      height: `${h * 100}%`,
                      borderRadius: 1,
                      background: isChapterMark
                        ? 'rgba(251,146,60,0.9)'
                        : isPast
                        ? `rgba(185,28,28,0.85)`
                        : '#e0dcdc',
                      transition: 'background 0.06s',
                      minWidth: 2,
                    }} />
                  )
                })}
              </div>

              {/* Scrubber track */}
              <div
                ref={scrubberRef}
                className="scrubber-wrap"
                style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={handleScrubberInteraction}
                onMouseMove={handleMouseMoveOnScrubber}
                onMouseDown={e => { setScrubbing(true); handleScrubberInteraction(e) }}
                onMouseUp={() => setScrubbing(false)}
                onMouseLeave={() => setScrubbing(false)}
              >
                <div className="scrub-track" style={{ width: '100%', height: 4, background: '#e8e4e4', borderRadius: 2, position: 'relative', transition: 'height 0.15s' }}>
                  {/* Chapter segments */}
                  {questions.map((q, i) => (
                    <div key={i} style={{
                      position: 'absolute',
                      top: 0, bottom: 0,
                      left: `${(chapterOffsets[i] / totalDuration) * 100}%`,
                      width: `${(q.duration / totalDuration) * 100}%`,
                      background: i % 2 === 0 ? 'rgba(185,28,28,0.25)' : 'rgba(185,28,28,0.12)',
                      borderRight: i < questions.length - 1 ? '2px solid rgba(251,146,60,0.7)' : 'none',
                    }} />
                  ))}
                  {/* Played fill */}
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${progressPct}%`, background: 'linear-gradient(to right, #7f1d1d, #dc2626)', borderRadius: 2, transition: scrubbing ? 'none' : 'width 0.1s linear' }} />
                  {/* Thumb */}
                  <div className="scrub-thumb" style={{ position: 'absolute', top: '50%', left: `${progressPct}%`, transform: 'translate(-50%, -50%)', width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 3px rgba(185,28,28,0.5)', opacity: hovered || scrubbing ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Chapter time markers */}
              <div style={{ display: 'flex', position: 'relative', height: 16, marginTop: 2 }}>
                {questions.map((q, i) => (
                  <div key={i} style={{ position: 'absolute', left: `${(chapterOffsets[i] / totalDuration) * 100}%`, transform: i > 0 ? 'translateX(-50%)' : 'none' }}>
                    <div style={{ ...F, fontSize: 8, color: '#bbb', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {i === 0 ? '0:00' : formatTime(chapterOffsets[i])}
                    </div>
                  </div>
                ))}
                <div style={{ position: 'absolute', right: 0 }}>
                  <div style={{ ...F, fontSize: 8, color: '#bbb', fontWeight: 600 }}>{formatTime(totalDuration)}</div>
                </div>
              </div>
            </div>

            {/* Playback buttons row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Skip back */}
                <button onClick={e => { e.stopPropagation(); skipSeconds(-10) }} className="ibtn"
                  style={{ ...F, width: 36, height: 36, borderRadius: 10, background: '#f5f2f2', border: '1.5px solid #e0dcdc', color: '#555', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 0 }}>
                  <span style={{ fontSize: 13 }}>⟨⟨</span>
                  <span style={{ fontSize: 7, color: '#aaa', marginTop: -2 }}>10s</span>
                </button>

                {/* Play/pause main */}
                <button onClick={e => { e.stopPropagation(); setIsPlaying(p => !p) }} className="ibtn"
                  style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #800000, #b91c1c)', border: 'none', color: '#fff', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(185,28,28,0.4)' }}>
                  {isPlaying ? '⏸' : '▶'}
                </button>

                {/* Skip forward */}
                <button onClick={e => { e.stopPropagation(); skipSeconds(10) }} className="ibtn"
                  style={{ ...F, width: 36, height: 36, borderRadius: 10, background: '#f5f2f2', border: '1.5px solid #e0dcdc', color: '#555', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <span style={{ fontSize: 13 }}>⟩⟩</span>
                  <span style={{ fontSize: 7, color: '#aaa', marginTop: -2 }}>10s</span>
                </button>
              </div>

              {/* Chapter time / total */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ ...F, fontSize: 13, fontWeight: 700, color: '#1a1a2e', fontVariantNumeric: 'tabular-nums' }}>{formatTime(chapTimeLocal)} <span style={{ color: '#aaa', fontSize: 11 }}>/ {formatTime(chapDuration)}</span></div>
                <div style={{ ...F, fontSize: 9, color: '#aaa', marginTop: 1 }}>Chapter {activeChapter + 1}: {questions[activeChapter].label}</div>
              </div>

              {/* Right controls — speed + volume */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Playback speed */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0.75, 1, 1.5, 2].map(r => (
                    <button key={r} onClick={e => { e.stopPropagation(); setPlaybackRate(r) }} className="ibtn"
                      style={{ ...F, padding: '4px 9px', borderRadius: 7, background: playbackRate === r ? '#800000' : '#f5f2f2', border: playbackRate === r ? '1px solid #800000' : '1.5px solid #e0dcdc', color: playbackRate === r ? '#fff' : '#888', fontSize: 10, fontWeight: 700 }}>
                      {r}×
                    </button>
                  ))}
                </div>

                {/* Volume */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={e => { e.stopPropagation(); setIsMuted(m => !m) }} className="ibtn"
                    style={{ background: 'none', border: 'none', color: '#888', fontSize: 14, display: 'flex', alignItems: 'center' }}>
                    {isMuted || volume === 0 ? '🔇' : volume < 40 ? '🔉' : '🔊'}
                  </button>
                  <input type="range" min={0} max={100} value={isMuted ? 0 : volume}
                    onChange={e => { setVolume(+e.target.value); setIsMuted(false) }}
                    style={{ width: 70, accentColor: '#b91c1c', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Question text for current chapter */}
          <div style={{ background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: 13, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fee2e2', border: '1.5px solid #fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              <span style={{ ...F, fontSize: 11, fontWeight: 800, color: '#800000' }}>Q{activeChapter + 1}</span>
            </div>
            <div>
              <div style={{ ...F, fontSize: 9, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>Current Question</div>
              <div style={{ ...F, fontSize: 12, color: '#1a1a2e', fontWeight: 600, lineHeight: 1.6 }}>{questions[activeChapter].q}</div>
            </div>
          </div>
        </div>

        {/* RIGHT — chapters + review panel */}
        <div style={{ borderLeft: '1px solid #ece8e8', background: '#fff', display: 'flex', flexDirection: 'column' }}>

          {/* Panel header */}
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #ece8e8' }}>
            <div style={{ ...F, fontSize: 9, color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Interview Chapters</div>
            <div style={{ ...F, fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>4 Questions Recorded</div>
            <div style={{ ...F, fontSize: 11, color: '#aaa', marginTop: 3 }}>Total: {formatTime(totalDuration)} · Click chapter to jump</div>
          </div>

          {/* Overall progress bar */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #f0eeee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ ...F, fontSize: 10, color: '#aaa', fontWeight: 600 }}>Playback Progress</span>
              <span style={{ ...F, fontSize: 10, color: '#f87171', fontWeight: 700 }}>{Math.round(progressPct)}%</span>
            </div>
            <div style={{ height: 4, background: '#f0eeee', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(to right, #7f1d1d, #dc2626)', borderRadius: 2, transition: 'width 0.15s linear' }} />
            </div>
          </div>

          {/* Chapter list */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 14px', gap: 8 }}>
            {questions.map((q, i) => {
              const isActive  = activeChapter === i
              const isPast    = currentTime >= chapterOffsets[i] + q.duration
              const chapPct   = isActive ? Math.min(100, ((currentTime - chapterOffsets[i]) / q.duration) * 100) : isPast ? 100 : 0
              return (
                <div key={i} className="chap-row"
                  onClick={() => jumpToChapter(i)}
                  style={{
                    borderRadius: 13,
                    padding: '12px 14px',
                    background: isActive ? '#fff5f5' : '#faf8f8',
                    border: isActive ? '1.5px solid #fca5a5' : '1.5px solid #f0eeee',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                  {/* Fill bar behind */}
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${chapPct}%`, background: isPast ? 'rgba(22,163,74,0.08)' : 'rgba(185,28,28,0.06)', transition: 'width 0.15s linear', pointerEvents: 'none' }} />

                  <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    {/* Status dot */}
                    <div style={{
                      width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 1,
                      background: isPast ? 'rgba(22,163,74,0.15)' : isActive ? 'rgba(185,28,28,0.12)' : '#f0eeee',
                      border: isPast ? '1.5px solid #86efac' : isActive ? '1.5px solid #fca5a5' : '1.5px solid #e0dcdc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 800,
                      color: isPast ? '#16a34a' : isActive ? '#b91c1c' : '#bbb',
                    }}>
                      {isPast ? '✓' : i + 1}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ ...F, fontSize: 9, fontWeight: 700, color: isActive ? '#b91c1c' : isPast ? '#16a34a' : '#bbb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          {isPast ? 'Watched' : isActive ? '▶ Playing' : `Chapter ${i + 1}`}
                        </span>
                        <span style={{ ...F, fontSize: 9, color: '#aaa', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatTime(q.duration)}</span>
                      </div>
                      <div style={{ ...F, fontSize: 11, color: isActive ? '#1a1a2e' : isPast ? '#555' : '#bbb', fontWeight: isActive ? 700 : 500, marginBottom: 4, lineHeight: 1.4 }}>
                        {q.label}
                      </div>
                      <div style={{ ...F, fontSize: 10, color: '#aaa', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {q.q}
                      </div>

                      {/* Mini chapter progress bar */}
                      {isActive && (
                        <div style={{ marginTop: 8, height: 3, background: '#f0eeee', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${chapPct}%`, background: '#dc2626', borderRadius: 2, transition: 'width 0.15s linear' }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── HIRE REQUEST AREA ── */}
          <div style={{ padding: '14px 20px 20px', borderTop: '1px solid #ece8e8' }}>
            <div style={{ ...F, fontSize: 9, color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Hire Request</div>

            {/* Pending state — request sent, awaiting admin */}
            {decision === 'pending' ? (
              <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 12, padding: '14px 16px', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fef3c7', border: '2px solid #fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15 }}>⏳</div>
                  <div>
                    <div style={{ ...F, fontSize: 12, fontWeight: 700, color: '#92400e' }}>Hire Request Sent</div>
                    <div style={{ ...F, fontSize: 10, color: '#a16207', marginTop: 1 }}>Awaiting admin approval</div>
                  </div>
                </div>
                <div style={{ background: '#fef9ec', borderRadius: 8, padding: '8px 10px', border: '1px solid #fde68a' }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 5 }}>
                    <span style={{ fontSize: 10, marginTop: 1 }}>📋</span>
                    <div style={{ ...F, fontSize: 10, color: '#78350f', lineHeight: 1.6 }}>Your request for <strong>{va.name}</strong> has been submitted. Admin will review and approve or decline.</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 10 }}>🔔</span>
                    <div style={{ ...F, fontSize: 10, color: '#78350f', lineHeight: 1.5 }}>You'll be <strong>notified</strong> once admin approves — then onboarding begins.</div>
                  </div>
                </div>
                {/* Status timeline */}
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 0 }}>
                  {[
                    { label: 'Submitted', done: true },
                    { label: 'Admin Review', done: false, active: true },
                    { label: 'Approved', done: false },
                    { label: 'Onboarding', done: false },
                  ].map((step, i, arr) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minWidth: 0 }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: step.done ? '#800000' : step.active ? '#fbbf24' : '#e8e4e4', border: `2px solid ${step.done ? '#800000' : step.active ? '#fbbf24' : '#e0dcdc'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {step.done && <span style={{ fontSize: 7, color: '#fff', fontWeight: 800 }}>✓</span>}
                          {step.active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'block' }} />}
                        </div>
                        <span style={{ ...F, fontSize: 7, fontWeight: 600, color: step.done ? '#800000' : step.active ? '#92400e' : '#bbb', textAlign: 'center', whiteSpace: 'nowrap' }}>{step.label}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <div style={{ flex: 1, height: 2, background: step.done ? '#800000' : '#e8e4e4', marginBottom: 14, transition: 'background 0.3s' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : decision === 'pass' ? (
              <div style={{ background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: 12, padding: '12px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>👋</span>
                <div>
                  <div style={{ ...F, fontSize: 11, fontWeight: 700, color: '#dc2626' }}>Passed on {va.name}</div>
                  <div style={{ ...F, fontSize: 10, color: '#aaa', marginTop: 1 }}>No hire request submitted</div>
                </div>
                <button onClick={() => setDecision(null)} style={{ marginLeft: 'auto', ...F, fontSize: 9, color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Undo</button>
              </div>
            ) : (
              /* Default — action buttons */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                <button onClick={() => setShowDecision(true)} className="ibtn"
                  style={{ ...F, width: '100%', padding: '11px', borderRadius: 10, background: 'linear-gradient(135deg, #7f1d1d, #b91c1c)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 3px 12px rgba(128,0,0,0.25)' }}>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Send Hire Request
                </button>
                <button onClick={() => setDecision('pass')} className="ibtn"
                  style={{ ...F, width: '100%', padding: '9px', borderRadius: 10, background: '#f7f5f5', border: '1.5px solid #e0dcdc', color: '#888', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                  Not a fit — Pass
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── HIRE REQUEST CONFIRM MODAL ── */}
      {showDecision && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(5px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setShowDecision(false)}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', border: '1px solid #ece8e8', borderRadius: 22, padding: '36px 32px', maxWidth: 440, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.18)', animation: 'scaleIn 0.25s ease' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff5f5', border: '2px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 24 }}>📨</div>
              <div style={{ ...F, fontSize: 19, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em', marginBottom: 6 }}>Send Hire Request?</div>
              <p style={{ ...F, fontSize: 12, color: '#777', lineHeight: 1.7, margin: 0 }}>
                You're requesting to hire <strong style={{ color: '#1a1a2e' }}>{va.name}</strong> for the <strong style={{ color: '#800000' }}>{va.role}</strong> role. This will be sent to admin for approval.
              </p>
            </div>

            {/* VA summary strip */}
            <div style={{ background: '#faf8f8', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: `${va.color}15`, border: `2px solid ${va.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ ...F, fontSize: 13, fontWeight: 800, color: va.color }}>{va.initials}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...F, fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{va.name}</div>
                <div style={{ ...F, fontSize: 11, color: '#888' }}>{va.role} · {va.location}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...F, fontSize: 16, fontWeight: 800, color: '#800000' }}>${va.rate}<span style={{ fontSize: 10, color: '#aaa', fontWeight: 400 }}>/hr</span></div>
                <div style={{ ...F, fontSize: 9, color: '#aaa' }}>{va.type}</div>
              </div>
            </div>

            {/* What happens next */}
            <div style={{ background: '#f7f6f4', borderRadius: 11, padding: '12px 14px', marginBottom: 22 }}>
              <div style={{ ...F, fontSize: 9, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 10 }}>What happens next</div>
              {[
                { icon: '📨', step: 'Your hire request is sent to admin', color: '#800000' },
                { icon: '🔍', step: 'Admin reviews and approves or declines', color: '#d97706' },
                { icon: "🔔", step: "You'll be notified of the decision via email", color: "#0891b2" },
                { icon: '🎉', step: 'If approved, onboarding with the VA begins', color: '#16a34a' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < 3 ? '1px solid #ece8e8' : 'none' }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ ...F, fontSize: 11, color: '#555', lineHeight: 1.5 }}>{item.step}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => { setDecision('pending'); setShowDecision(false); onHireRequest(); }}
                className="ibtn"
                style={{ ...F, width: '100%', padding: '13px', borderRadius: 11, background: 'linear-gradient(135deg, #7f1d1d, #b91c1c)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(128,0,0,0.25)' }}>
                ✓ Confirm & Send Hire Request
              </button>
              <button onClick={() => setShowDecision(false)}
                style={{ ...F, width: '100%', padding: '11px', borderRadius: 11, background: 'none', border: '1.5px solid #e0dcdc', color: '#888', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                Cancel — Keep Reviewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

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
  const [interviewFor, setInterviewFor] = useState<VA | null>(null)
  const [addPlanFor,   setAddPlanFor]   = useState<VA | null>(null)
  const [hireRequestFor, setHireRequestFor] = useState<VA | null>(null)

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

  // ── HIRE REQUEST PAGE ──
  if (hireRequestFor) {
    return <HireRequestPage va={hireRequestFor} onBack={() => { setHireRequestFor(null); setInterviewFor(hireRequestFor) }} onDone={() => { setHireRequestFor(null); setInterviewFor(null); setAddPlanFor(null); setApplyFor(null); setHireSuccess(true) }} />
  }

  // ── ADD PLAN VIEW ──
  if (addPlanFor) {
    return <AddPlan va={addPlanFor} onBack={() => setAddPlanFor(null)} onNext={() => { setInterviewFor(addPlanFor); setAddPlanFor(null) }} />
  }

  // ── INTERVIEW PLAYBACK VIEW ──
  if (interviewFor) {
    return (
      <div style={{ ...F, minHeight: '100vh', background: '#f7f6f4' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
          *, *::before, *::after { box-sizing: border-box; font-family: 'Poppins', sans-serif; }
          @keyframes spin { to { transform: rotate(360deg) } }
        `}</style>
        <InterviewRecording
          va={interviewFor}
          onBack={() => { setInterviewFor(null); setAddPlanFor(interviewFor) }}
          onComplete={() => {
            setInterviewFor(null)
            setAddPlanFor(null)
            setApplyFor(null)
            setHireSuccess(true)
          }}
          onHireRequest={() => {
            setHireRequestFor(interviewFor)
            setInterviewFor(null)
          }}
        />
      </div>
    )
  }

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

            {/* Actions */}
            <div style={{ marginTop: 16 }}>
              <button
                onClick={() => { setAddPlanFor(applyFor) }}
                className="btn-red"
                style={{ ...F, width: '100%', padding: '13px', borderRadius: 10, background: '#800000', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                Proceed to VA Application →
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

        {/* ── SIDEBAR ── */}
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

        {/* ── RIGHT CONTENT ── */}
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