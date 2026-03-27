'use client'
import { useState, useEffect } from 'react'
import React from 'react'

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Step = 'services' | 'project-brief' | 'choose-va' | 'va-profile' | 'interview' | 'hire-request' | 'success'

type SelectedService = { id: string; name: string; categoryId: string; price: string; billingCycle: string }
type ProjectBriefData = { goals: string; tools: string; hours: string; timezone: string; kpis: string; notes: string; startDate: string; budget: string }
type SelectedVA = { id: string; name: string; avatar: string; role: string; rating: number; reviews: number; hourlyRate: number; availability: 'Available' | 'Busy' | 'On Leave' }
type HireRequest = { message: string; startDate: string; contractType: string; hoursPerWeek: string; agreedToTerms: boolean }

// ─── SERVICE DATA ─────────────────────────────────────────────────────────────
type ServiceCategory = { id: string; label: string; description: string }
type ServicePackage = { id: string; name: string; categoryId: string; price: number | string; billingCycle: string; setupFee?: number | string; monthlyFee?: number | string; features: string[]; popular?: boolean; note?: string; badge: string }

const CATEGORIES: ServiceCategory[] = [
  { id: 'all',      label: 'All Services',      description: 'Browse all available VA services' },
  { id: 'csr',      label: 'Customer Service',  description: 'Dedicated CSR & TSR agents' },
  { id: 'tech',     label: 'Tech & Dev',        description: 'Tech support & web development' },
  { id: 'creative', label: 'Creative & Social', description: 'Social media, video & design' },
  { id: 'digital',  label: 'Digital Systems',   description: 'Funnels, automation & builds' },
  { id: 'saas',     label: 'SaaS & Licensing',  description: 'White-label & gray-label platforms' },
]

const PACKAGES: ServicePackage[] = [
  { id: 'csr-rep',         name: 'Customer Service Representative', categoryId: 'csr',     price: 1400, billingCycle: 'monthly',       features: ['Dedicated full-time agent','Email, chat & phone support','CRM documentation','QA monitoring','Performance reporting'], popular: true,  badge: 'CSR' },
  { id: 'tsr-rep',         name: 'Technical Support Representative', categoryId: 'csr',    price: 1800, billingCycle: 'monthly',       features: ['Tier 1–2 technical troubleshooting','SaaS / eCommerce backend support','Escalation handling','KPI & QA monitoring'], badge: 'TSR' },
  { id: 'web-dev',         name: 'Web Development',                  categoryId: 'tech',   price: 2500, billingCycle: 'monthly',       features: ['WordPress / Shopify / Webflow','Maintenance + optimization','Landing page builds','Technical integrations'], popular: true, badge: 'DEV' },
  { id: 'social-mgmt',     name: 'Social Media Management',          categoryId: 'creative', price: 1800, billingCycle: 'monthly',     features: ['Content calendar strategy','Copywriting','Scheduling & publishing','Engagement management','Monthly performance report'], popular: true, badge: 'SMM' },
  { id: 'video-design',    name: 'Video & Graphics Design',          categoryId: 'creative', price: 2200, billingCycle: 'monthly',     features: ['Short-form videos (Reels / TikTok)','Ad creatives','Brand assets','Thumbnails & campaign visuals'], badge: 'VGD' },
  { id: 'funnel-builder',  name: 'Funnel Builder',                   categoryId: 'digital', price: '3,500', billingCycle: 'setup+monthly', setupFee: '3,500', monthlyFee: '800', features: ['Strategy mapping','Landing pages','Email automation','CRM integration','Conversion tracking'], badge: 'FUNNEL' },
  { id: 'ai-builder',      name: 'AI Builder',                       categoryId: 'digital', price: '5,000', billingCycle: 'setup+monthly', setupFee: '5,000', monthlyFee: '1,200', features: ['AI chatbot deployment','Lead qualification automation','CRM connection','Workflow automation'], popular: true, badge: 'AI' },
  { id: 'crm-setup',       name: 'CRM System Setup & Management',    categoryId: 'digital', price: '2,500', billingCycle: 'setup+monthly', setupFee: '2,500', monthlyFee: '1,500', features: ['Pipeline configuration','Automation workflows','Dashboard reporting','Data structuring'], popular: true, badge: 'CRM' },
  { id: 'email-marketing', name: 'Email Marketing Management',       categoryId: 'digital', price: '1,500', billingCycle: 'monthly',     features: ['Campaign strategy','Automation flows','List segmentation','A/B testing','Reporting'], badge: 'EMAIL' },
  { id: 'white-label',     name: 'White-Label Platform',             categoryId: 'saas',   price: 7500, billingCycle: 'monthly',       features: ['Fully rebranded platform','Custom domain','CRM + automation system','Dedicated support','Scalable seat model'], popular: true, badge: 'WHITE' },
  { id: 'gray-label',      name: 'Gray-Label Platform',              categoryId: 'saas',   price: 3000, billingCycle: 'monthly',       features: ['Powered by Telex infrastructure','Multi-user access','Automation capability','Support & maintenance included'], badge: 'GRAY' },
]

const CATEGORY_ICON_PATHS: Record<string, string> = {
  all:      'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  csr:      'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  tech:     'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  creative: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  digital:  'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  saas:     'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
}

function getPriceDisplay(pkg: ServicePackage) {
  if (pkg.billingCycle === 'setup+monthly') return { main: `$${pkg.setupFee}`, sub: 'setup', extra: `+ $${pkg.monthlyFee}/mo` }
  if (pkg.billingCycle === 'setup') return { main: `$${pkg.setupFee ?? pkg.price}`, sub: 'setup', extra: null }
  return { main: `$${typeof pkg.price === 'number' ? pkg.price.toLocaleString() : pkg.price}`, sub: `/ ${pkg.billingCycle}`, extra: null }
}

// ─── VA DATA ──────────────────────────────────────────────────────────────────
type VA = {
  id: string; name: string; role: string; avatar: string; rating: number; reviews: number;
  experience: string; skills: string[]; availability: 'Available' | 'Busy' | 'On Leave';
  hourlyRate: number; completedJobs: number; responseTime: string; bio: string; categoryIds: string[];
  location: string; timezone: string; languages: string[]; education: string;
  portfolioItems: { title: string; desc: string; tag: string }[];
  workHistory: { client: string; role: string; duration: string; rating: number; review: string }[];
}

// Fallback mock data (used while API loads or on failure)
const VA_LIST: VA[] = [
  { id: 'va-001', name: 'Maria Santos', role: 'Customer Service Specialist', avatar: 'MS', rating: 4.9, reviews: 124, experience: '5 yrs', availability: 'Available', hourlyRate: 12, completedJobs: 87, responseTime: '< 1 hr', skills: ['Live Chat', 'Email Support', 'CRM', 'Zendesk', 'HubSpot', 'Freshdesk', 'Intercom', 'CSAT Reporting'], bio: 'Dedicated CSR with 5 years in SaaS and eCommerce support. Expert in de-escalation and CRM documentation.', categoryIds: ['csr'], location: 'Cebu City, PH', timezone: 'PST (UTC+8)', languages: ['English', 'Filipino'], education: 'BS Business Administration — University of San Carlos', portfolioItems: [{ title: 'SaaS Helpdesk Overhaul', desc: 'Restructured ticket triage system reducing avg resolution time from 48hrs to 6hrs.', tag: 'Process' }, { title: 'eCommerce Live Chat', desc: 'Managed 200+ daily chats with 98% CSAT score for a US-based retail brand.', tag: 'Live Chat' }, { title: 'CRM Migration', desc: 'Led migration of 8,000 customer records from Freshdesk to HubSpot with zero data loss.', tag: 'CRM' }], workHistory: [{ client: 'TechFlow Inc.', role: 'Senior CSR', duration: '2 yrs', rating: 5.0, review: 'Maria is phenomenal. She reduced our support backlog by 60% in the first month.' }, { client: 'ShopNow PH', role: 'CSR Team Lead', duration: '1.5 yrs', rating: 4.9, review: 'Reliable, professional, and truly cares about the customer experience.' }, { client: 'CloudBase SaaS', role: 'CSR Specialist', duration: '8 mos', rating: 4.8, review: 'Handled high-volume queues with ease. Would rehire without hesitation.' }] },
  { id: 'va-002', name: 'James Reyes', role: 'Technical Support Engineer', avatar: 'JR', rating: 4.8, reviews: 98, experience: '6 yrs', availability: 'Available', hourlyRate: 15, completedJobs: 63, responseTime: '< 2 hrs', skills: ['Tier 1–2 Support', 'API Troubleshooting', 'Shopify', 'SaaS Backends', 'Postman', 'SQL Basics', 'Jira', 'Confluence'], bio: 'Technical support pro with deep eCommerce and SaaS platform knowledge. Handles complex escalations with ease.', categoryIds: ['csr', 'tech'], location: 'Manila, PH', timezone: 'PST (UTC+8)', languages: ['English', 'Filipino'], education: 'BS Information Technology — De La Salle University', portfolioItems: [{ title: 'API Integration Support', desc: 'Supported 50+ merchant API integrations for a payments SaaS platform.', tag: 'Technical' }, { title: 'Shopify Backend Ops', desc: 'Managed order discrepancy resolution and fulfillment troubleshooting for D2C brand.', tag: 'eCommerce' }], workHistory: [{ client: 'PayFlow Ltd.', role: 'Tech Support Lead', duration: '2.5 yrs', rating: 4.9, review: 'James knows SaaS support inside out. Exceptional communicator with deep technical chops.' }, { client: 'Storefront Co.', role: 'eCommerce TSR', duration: '2 yrs', rating: 4.7, review: 'Handled escalations calmly and documented everything perfectly.' }] },
  { id: 'va-003', name: 'Angela Cruz', role: 'Web Developer', avatar: 'AC', rating: 5.0, reviews: 57, experience: '4 yrs', availability: 'Available', hourlyRate: 18, completedJobs: 45, responseTime: '< 3 hrs', skills: ['WordPress', 'Webflow', 'Shopify', 'Landing Pages', 'SEO Basics'], bio: 'Full-stack web developer specializing in conversion-optimized builds on WordPress and Webflow.', categoryIds: ['tech', 'digital'], location: 'Davao City, PH', timezone: 'PST (UTC+8)', languages: ['English', 'Filipino'], education: 'BS Computer Science — Ateneo de Davao University', portfolioItems: [{ title: 'eCommerce Shopify Build', desc: 'Built a fully custom Shopify store with 3rd-party integrations and custom checkout.', tag: 'eCommerce' }, { title: 'Webflow Landing Pages', desc: 'Delivered 12 CRO-optimized landing pages across 3 SaaS clients.', tag: 'Webflow' }], workHistory: [{ client: 'GrowthLab Agency', role: 'Lead Developer', duration: '2 yrs', rating: 5.0, review: 'Angela delivers pixel-perfect work on time, every time.' }] },
  { id: 'va-004', name: 'Carlo Mendoza', role: 'Social Media Manager', avatar: 'CM', rating: 4.7, reviews: 83, experience: '3 yrs', availability: 'Busy', hourlyRate: 11, completedJobs: 72, responseTime: '< 4 hrs', skills: ['Content Strategy', 'Copywriting', 'Canva', 'Meta Ads', 'Scheduling'], bio: 'Creative SMM who builds engaging content calendars and drives organic reach for lifestyle and service brands.', categoryIds: ['creative'], location: 'Quezon City, PH', timezone: 'PST (UTC+8)', languages: ['English', 'Filipino'], education: 'BS Communications — University of Santo Tomas', portfolioItems: [{ title: 'Instagram Growth Campaign', desc: 'Grew a lifestyle brand from 2K to 18K followers in 6 months organically.', tag: 'Growth' }], workHistory: [{ client: 'LifeStyle PH', role: 'SMM Specialist', duration: '1.5 yrs', rating: 4.8, review: 'Carlo has a great eye for content. Our engagement doubled under his management.' }] },
  { id: 'va-005', name: 'Sofia Lim', role: 'Video & Graphic Designer', avatar: 'SL', rating: 4.9, reviews: 66, experience: '5 yrs', availability: 'Available', hourlyRate: 14, completedJobs: 51, responseTime: '< 2 hrs', skills: ['Premiere Pro', 'After Effects', 'Canva', 'Brand Assets', 'Reels'], bio: 'Visual storyteller producing short-form video and brand creatives for social-first campaigns.', categoryIds: ['creative'], location: 'Makati, PH', timezone: 'PST (UTC+8)', languages: ['English', 'Filipino'], education: 'BFA Visual Communication — De La Salle-College of Saint Benilde', portfolioItems: [{ title: 'Reel Series for Skincare Brand', desc: 'Produced 24 short-form Reels with 2M+ combined views.', tag: 'Video' }], workHistory: [{ client: 'GlowCo Beauty', role: 'Lead Designer', duration: '2 yrs', rating: 5.0, review: 'Sofia transformed our brand visuals completely. Absolutely phenomenal work.' }] },
  { id: 'va-006', name: 'Ryan Dela Cruz', role: 'CRM & Automation Specialist', avatar: 'RD', rating: 4.8, reviews: 44, experience: '4 yrs', availability: 'Available', hourlyRate: 16, completedJobs: 38, responseTime: '< 2 hrs', skills: ['GoHighLevel', 'HubSpot', 'Zapier', 'Email Automation', 'Funnels'], bio: 'Systems builder focused on CRM setups, automation workflows, and funnel builds that convert.', categoryIds: ['digital'], location: 'Pasig, PH', timezone: 'PST (UTC+8)', languages: ['English', 'Filipino'], education: 'BS Information Systems — Mapúa University', portfolioItems: [{ title: 'GoHighLevel CRM Build', desc: 'Full pipeline, automation, and reporting setup for a real estate firm.', tag: 'CRM' }], workHistory: [{ client: 'RealtyCo Group', role: 'CRM Specialist', duration: '2 yrs', rating: 4.9, review: 'Ryan built a system that basically runs our pipeline on autopilot.' }] },
  { id: 'va-007', name: 'Patricia Gomez', role: 'SaaS Platform Manager', avatar: 'PG', rating: 4.6, reviews: 29, experience: '3 yrs', availability: 'On Leave', hourlyRate: 13, completedJobs: 22, responseTime: '< 6 hrs', skills: ['White-Label Setup', 'Platform Onboarding', 'Client Management', 'SaaS Tools'], bio: 'SaaS specialist experienced in white-label platform configuration and client onboarding workflows.', categoryIds: ['saas'], location: 'Taguig, PH', timezone: 'PST (UTC+8)', languages: ['English', 'Filipino'], education: 'BS Business Management — Ateneo de Manila University', portfolioItems: [{ title: 'White-Label Platform Launch', desc: 'Configured and launched a white-label SaaS platform for 3 enterprise clients.', tag: 'White-Label' }], workHistory: [{ client: 'CloudStack PH', role: 'Platform Manager', duration: '2 yrs', rating: 4.7, review: 'Patricia handled all our client onboarding seamlessly.' }] },
  { id: 'va-008', name: 'Mark Villanueva', role: 'AI & Automation Builder', avatar: 'MV', rating: 4.9, reviews: 38, experience: '3 yrs', availability: 'Available', hourlyRate: 20, completedJobs: 31, responseTime: '< 1 hr', skills: ['AI Chatbots', 'Make.com', 'Zapier', 'API Integrations', 'n8n'], bio: 'AI-first automation architect building intelligent workflows, chatbots, and CRM integrations at scale.', categoryIds: ['digital'], location: 'Mandaluyong, PH', timezone: 'PST (UTC+8)', languages: ['English', 'Filipino'], education: 'BS Computer Engineering — University of the Philippines', portfolioItems: [{ title: 'AI Lead Qualification Bot', desc: 'Built a GPT-powered chatbot that qualifies leads and books calls autonomously.', tag: 'AI' }], workHistory: [{ client: 'ScaleOps Inc.', role: 'AI Builder', duration: '1.5 yrs', rating: 5.0, review: 'Mark built automation systems that saved our team 30+ hours a week.' }] },
]

// ─── INTERVIEW DATA ────────────────────────────────────────────────────────────
type TimeSlot = { time: string; available: boolean }
type Recording = { id: string; title: string; date: string; duration: string; thumbnail: string; status: 'completed' | 'upcoming' | 'missed'; chapters: { label: string; start: string }[] }

const TIME_SLOTS: TimeSlot[] = [
  { time: '8:00 AM', available: true }, { time: '9:00 AM', available: true },
  { time: '10:00 AM', available: false }, { time: '11:00 AM', available: true },
  { time: '1:00 PM', available: true }, { time: '2:00 PM', available: false },
  { time: '3:00 PM', available: true }, { time: '4:00 PM', available: true },
  { time: '5:00 PM', available: false },
]

const MOCK_RECORDINGS: Recording[] = [
  { id: 'rec-001', title: 'Discovery Call — Maria Santos', date: 'Mar 10, 2025', duration: '8:42', thumbnail: 'MS', status: 'completed', chapters: [{ label: 'Chapter 1: Intro & Motivation', start: '0:00' }, { label: 'Chapter 2: Experience', start: '1:38' }, { label: 'Chapter 3: Skills Deep Dive', start: '3:30' }, { label: 'Chapter 4: Availability & Rate', start: '4:55' }] },
  { id: 'rec-002', title: 'Final Interview — James Reyes', date: 'Mar 14, 2025', duration: '48:20', thumbnail: 'JR', status: 'completed', chapters: [{ label: 'Chapter 1: Introduction', start: '0:00' }, { label: 'Chapter 2: Technical Depth', start: '12:00' }] },
  { id: 'rec-003', title: 'Introductory Call — Angela Cruz', date: 'Mar 20, 2025', duration: '--', thumbnail: 'AC', status: 'missed', chapters: [] },
]

function getCalendarDays() {
  const days = []
  const today = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({ date: d.toISOString().split('T')[0], label: d.toLocaleDateString('en-US', { weekday: 'short' }), day: d.getDate(), isToday: i === 0, isWeekend: d.getDay() === 0 || d.getDay() === 6 })
  }
  return days
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const AVAIL_COLORS: Record<string, { bg: string; color: string; dot: string }> = {
  'Available': { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  'Busy':      { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b' },
  'On Leave':  { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444' },
}

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

const STEP_LABELS = ['Services', 'Project Brief', 'Choose VA', 'VA Profile', 'Interview', 'Hire Request']

function ProgressBar({ activeIndex }: { activeIndex: number }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
      {STEP_LABELS.map((label, i) => (
        <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ height: 3, borderRadius: 10, background: i <= activeIndex ? '#800000' : '#ece8e8', transition: 'background 0.3s' }} />
          <span style={{ fontSize: 9, color: i <= activeIndex ? '#800000' : '#bbb', fontFamily: "'Poppins', sans-serif", fontWeight: i <= activeIndex ? 700 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

function BackBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 12, fontFamily: "'Poppins', sans-serif", marginBottom: 18, padding: 0 }}>
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      {label}
    </button>
  )
}

const cardStyle: React.CSSProperties = { background: '#fff', borderRadius: 16, border: '1px solid #f0edec', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — SELECT SERVICES
// ═══════════════════════════════════════════════════════════════════════════════
function StepServices({ onSelect }: { onSelect: (pkg: ServicePackage) => void }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const filtered = activeCategory === 'all' ? PACKAGES : PACKAGES.filter(p => p.categoryId === activeCategory)
  const grouped = activeCategory === 'all'
    ? CATEGORIES.filter(c => c.id !== 'all').map(cat => ({ cat, pkgs: PACKAGES.filter(p => p.categoryId === cat.id) })).filter(g => g.pkgs.length > 0)
    : [{ cat: CATEGORIES.find(c => c.id === activeCategory)!, pkgs: filtered }]

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, color: '#800000', fontWeight: 700, margin: '0 0 2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Step 1 of 6</p>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Select a Service</h2>
        <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>Choose the VA service package that fits your business needs.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Service Categories', value: '5', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
          { label: 'Available Packages', value: String(PACKAGES.length), icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
          { label: 'Active VAs', value: '8', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
          { label: 'Avg. Response', value: '< 2hr', icon: 'M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-14v4l3 3' },
        ].map((s) => (
          <div key={s.label} style={{ ...cardStyle, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={s.icon}/></svg>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', lineHeight: 1, letterSpacing: '-0.02em', fontFamily: "'Poppins', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2, fontFamily: "'Poppins', sans-serif" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id
          return (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 10, border: `1.5px solid ${isActive ? '#800000' : '#e8e4e4'}`, background: isActive ? '#800000' : '#fff', color: isActive ? '#fff' : '#666', fontSize: 12.5, fontFamily: "'Poppins', sans-serif", fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', boxShadow: isActive ? '0 4px 12px rgba(128,0,0,0.2)' : 'none' }}>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={isActive ? '#fff' : '#888'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                {cat.id === 'all' ? <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></> : <path d={CATEGORY_ICON_PATHS[cat.id]}/>}
              </svg>
              {cat.label}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {grouped.map(({ cat, pkgs }) => (
          <div key={cat.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: '#800000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={CATEGORY_ICON_PATHS[cat.id]}/></svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{cat.label}</span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, #e8e4e4, transparent)' }} />
              <span style={{ fontSize: 10, color: '#888', fontFamily: "'Poppins', sans-serif", background: '#f5f3f3', border: '1px solid #e8e4e4', borderRadius: 20, padding: '1px 8px' }}>{pkgs.length} packages</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {pkgs.map(pkg => {
                const priceDisplay = getPriceDisplay(pkg)
                return (
                  <div key={pkg.id} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', borderColor: pkg.popular ? '#f0c0c0' : '#f0edec', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)' }}
                  >
                    {pkg.popular && <div style={{ position: 'absolute', top: 0, right: 0, background: '#800000', color: '#fff', fontSize: 9, fontWeight: 700, padding: '4px 10px', borderBottomLeftRadius: 8, letterSpacing: '0.06em', fontFamily: "'Poppins', sans-serif" }}>POPULAR</div>}
                    <div style={{ padding: '20px 20px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: pkg.popular ? '#fff0f0' : '#f5f5f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={pkg.popular ? '#800000' : '#555'} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d={CATEGORY_ICON_PATHS[pkg.categoryId]}/></svg>
                        </div>
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Poppins', sans-serif" }}>{pkg.badge}</span>
                      </div>
                      <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px', lineHeight: 1.3, fontFamily: "'Poppins', sans-serif" }}>{pkg.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
                        <span style={{ fontSize: 22, fontWeight: 800, color: pkg.popular ? '#800000' : '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{priceDisplay.main}</span>
                        <span style={{ fontSize: 11, color: '#aaa', fontFamily: "'Poppins', sans-serif" }}>{priceDisplay.sub}</span>
                        {priceDisplay.extra && <span style={{ fontSize: 10, color: '#800000', fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>{priceDisplay.extra}</span>}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
                        {pkg.features.map((f, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={pkg.popular ? '#800000' : '#10b981'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1.5, flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                            <span style={{ fontSize: 11.5, color: '#555', lineHeight: 1.4, fontFamily: "'Poppins', sans-serif" }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: '0 20px 20px', marginTop: 'auto' }}>
                      <button onClick={() => onSelect(pkg)} style={{ width: '100%', padding: '11px', borderRadius: 10, border: 'none', background: pkg.popular ? '#800000' : '#1a1a2e', color: '#fff', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", letterSpacing: '0.02em', transition: 'background 0.15s' }}>
                        Get Started →
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — PROJECT BRIEF
// ═══════════════════════════════════════════════════════════════════════════════
function StepProjectBrief({ service, onBack, onNext }: { service: SelectedService; onBack: () => void; onNext: (brief: ProjectBriefData) => void }) {
  const [form, setForm] = useState<ProjectBriefData>({ goals: '', tools: '', hours: '20', timezone: 'PST', kpis: '', notes: '', startDate: '', budget: '' })
  const update = (k: keyof ProjectBriefData, v: string) => setForm(f => ({ ...f, [k]: v }))
  const fieldStyle: React.CSSProperties = { width: '100%', padding: '10px 13px', border: '1.5px solid #e8e4e4', borderRadius: 9, fontSize: 12.5, fontFamily: "'Poppins', sans-serif", color: '#333', background: '#faf9f9', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle: React.CSSProperties = { fontSize: 10.5, fontWeight: 700, color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 5, display: 'block', fontFamily: "'Poppins', sans-serif" }

  return (
    <div>
      <BackBtn label="Back to Services" onClick={onBack} />
      <ProgressBar activeIndex={1} />
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, color: '#800000', fontWeight: 700, margin: '0 0 2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Step 2 of 6</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Tell Us About Your Project</h2>
        <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>Help us match you with the right VA for <strong style={{ color: '#800000' }}>{service.name}</strong>.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        <div style={{ ...cardStyle, padding: '28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={labelStyle}>Project Goals <span style={{ color: '#800000' }}>*</span></label>
              <textarea rows={3} style={{ ...fieldStyle, resize: 'none' }} value={form.goals} onChange={e => update('goals', e.target.value)} placeholder="What do you want to achieve? (e.g. Grow Instagram by 20%, reduce support tickets by 30%)" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Tools / Platforms Used</label>
                <input style={fieldStyle} value={form.tools} onChange={e => update('tools', e.target.value)} placeholder="e.g. HubSpot, Canva, Notion" />
              </div>
              <div>
                <label style={labelStyle}>Hours / Week</label>
                <select style={{ ...fieldStyle, cursor: 'pointer' }} value={form.hours} onChange={e => update('hours', e.target.value)}>
                  {['10', '20', '30', '40'].map(h => <option key={h} value={h}>{h} hrs / week</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Preferred Timezone</label>
                <select style={{ ...fieldStyle, cursor: 'pointer' }} value={form.timezone} onChange={e => update('timezone', e.target.value)}>
                  {['PST', 'EST', 'CST', 'MST', 'GMT', 'UTC+8'].map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Key KPIs</label>
                <input style={fieldStyle} value={form.kpis} onChange={e => update('kpis', e.target.value)} placeholder="e.g. CSAT ≥ 95%, 10 posts/mo" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Preferred Start Date</label>
                <input type="date" style={fieldStyle} value={form.startDate} onChange={e => update('startDate', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Monthly Budget Range</label>
                <select style={{ ...fieldStyle, cursor: 'pointer' }} value={form.budget} onChange={e => update('budget', e.target.value)}>
                  <option value="">Select range</option>
                  {['Under $1,000', '$1,000 – $2,000', '$2,000 – $5,000', '$5,000+', 'Custom / Negotiate'].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Additional Notes</label>
              <textarea rows={2} style={{ ...fieldStyle, resize: 'none' }} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any specific instructions, brand guidelines, or expectations for your VA." />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ ...cardStyle, padding: '18px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#800000', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12, fontFamily: "'Poppins', sans-serif" }}>Selected Service</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif", marginBottom: 4 }}>{service.name}</div>
            <div style={{ fontSize: 12, color: '#888', fontFamily: "'Poppins', sans-serif" }}>${service.price} / {service.billingCycle}</div>
          </div>
          <div style={{ ...cardStyle, padding: '18px', background: '#fff8f8', borderColor: '#fde8e8' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#800000', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10, fontFamily: "'Poppins', sans-serif" }}>Why This Matters</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['We use your brief to match you with the most qualified VA', 'Your VA reviews this before the interview', 'Helps set clear expectations from day 1'].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11.5, color: '#555', fontFamily: "'Poppins', sans-serif", lineHeight: 1.5 }}>
                  <span style={{ color: '#800000', flexShrink: 0, fontSize: 13 }}>•</span>{tip}
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => form.goals.trim() && onNext(form)} style={{ width: '100%', padding: '13px 0', background: form.goals.trim() ? '#800000' : '#f0edec', color: form.goals.trim() ? '#fff' : '#ccc', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: "'Poppins', sans-serif", cursor: form.goals.trim() ? 'pointer' : 'not-allowed', letterSpacing: '0.02em' }}>
            Find My VA →
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — CHOOSE VA (with real API fetch)
// ═══════════════════════════════════════════════════════════════════════════════
function StepChooseVA({ service, brief, onBack, onSelect }: { service: SelectedService; brief: ProjectBriefData; onBack: () => void; onSelect: (va: VA) => void }) {
  const [search, setSearch]       = useState('')
  const [sortBy, setSortBy]       = useState('Top Rated')
  const [onlyAvail, setOnlyAvail] = useState(false)
  const [vaList, setVaList]       = useState<VA[]>(VA_LIST)
  const [loading, setLoading]     = useState(true)
  const [apiError, setApiError]   = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const token = localStorage.getItem('token')
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/va-users`, {
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
      .then(r => r.json())
      .then(json => {
        if (cancelled) return
        const docs = json.data ?? json
        if (Array.isArray(docs) && docs.length > 0) {
          const mapped: VA[] = docs.map((d: any) => ({
            id: d._id, name: d.name, role: d.role, avatar: d.avatar,
            rating: d.rating ?? 0, reviews: d.reviews ?? 0,
            experience: d.experience ?? '', skills: d.skills ?? [],
            availability: d.availability ?? 'Available', hourlyRate: d.hourlyRate ?? 0,
            completedJobs: d.completedJobs ?? 0, responseTime: d.responseTime ?? '',
            bio: d.bio ?? '', categoryIds: d.categoryIds ?? [],
            location: d.location ?? '', timezone: d.timezone ?? '',
            languages: d.languages ?? [], education: d.education ?? '',
            portfolioItems: d.portfolioItems ?? [], workHistory: d.workHistory ?? [],
          }))
          setVaList(mapped)
        }
      })
      .catch(() => { if (!cancelled) setApiError('Using cached data — could not reach server.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  let filtered = vaList.filter(v => v.categoryIds.includes(service.categoryId) || service.categoryId === 'all')
  if (search.trim()) { const q = search.toLowerCase(); filtered = filtered.filter(v => v.name.toLowerCase().includes(q) || v.role.toLowerCase().includes(q) || v.skills.some(s => s.toLowerCase().includes(q))) }
  if (onlyAvail) filtered = filtered.filter(v => v.availability === 'Available')
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'Top Rated') return b.rating - a.rating
    if (sortBy === 'Most Reviews') return b.reviews - a.reviews
    if (sortBy === 'Lowest Rate') return a.hourlyRate - b.hourlyRate
    return 0
  })

  return (
    <div>
      <BackBtn label="Back to Project Brief" onClick={onBack} />
      <ProgressBar activeIndex={2} />
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, color: '#800000', fontWeight: 700, margin: '0 0 2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Step 3 of 6</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Choose Your VA</h2>
        <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>Select a virtual assistant for <strong style={{ color: '#800000' }}>{service.name}</strong></p>
      </div>

      {loading && <div style={{ padding: '10px 14px', background: '#fff8e1', borderRadius: 8, fontSize: 12, color: '#b45309', marginBottom: 14, fontFamily: "'Poppins', sans-serif" }}>⏳ Loading available VAs…</div>}
      {apiError && <div style={{ padding: '10px 14px', background: '#fef2f2', borderRadius: 8, fontSize: 12, color: '#dc2626', marginBottom: 14, fontFamily: "'Poppins', sans-serif" }}>⚠️ {apiError}</div>}

      <div style={{ ...cardStyle, padding: '12px 18px', marginBottom: 20, background: '#fffbf5', borderColor: '#f0d9b5', display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        <div style={{ fontSize: 12, color: '#555', fontFamily: "'Poppins', sans-serif", flex: 1 }}>
          <strong style={{ color: '#1a1a2e' }}>Your Brief:</strong> {brief.goals.slice(0, 100)}{brief.goals.length > 100 ? '…' : ''}
        </div>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: '#d97706', background: '#fef3c7', borderRadius: 5, padding: '2px 8px', flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>{brief.hours} hrs/wk</span>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 9, padding: '7px 12px', flex: '1 1 200px', maxWidth: 280 }}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, role or skill..." style={{ border: 'none', outline: 'none', fontSize: 12, fontFamily: "'Poppins', sans-serif", color: '#333', background: 'transparent', flex: 1 }} />
        </div>
        {['Top Rated', 'Most Reviews', 'Lowest Rate'].map(s => (
          <button key={s} onClick={() => setSortBy(s)} style={{ background: sortBy === s ? '#800000' : '#fff', color: sortBy === s ? '#fff' : '#555', border: `1.5px solid ${sortBy === s ? '#800000' : '#e0dcdc'}`, borderRadius: 8, padding: '6px 12px', fontSize: 11.5, fontFamily: "'Poppins', sans-serif", fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}>{s}</button>
        ))}
        <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 12, fontFamily: "'Poppins', sans-serif", color: '#555', userSelect: 'none' }}>
          <div onClick={() => setOnlyAvail(!onlyAvail)} style={{ width: 34, height: 18, borderRadius: 9, background: onlyAvail ? '#800000' : '#ddd', position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 2, left: onlyAvail ? 16 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
          </div>
          Available only
        </label>
      </div>

      <div style={{ fontSize: 11, color: '#aaa', fontFamily: "'Poppins', sans-serif", marginBottom: 16 }}>
        Showing <strong style={{ color: '#1a1a2e' }}>{filtered.length}</strong> VA{filtered.length !== 1 ? 's' : ''}
      </div>

      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {filtered.map(va => {
            const avail = AVAIL_COLORS[va.availability]
            return (
              <div key={va.id} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 14, padding: '20px', transition: 'all 0.2s', borderColor: '#f0edec' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#e8c0c0' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.borderColor = '#f0edec' }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#800000,#c05050)', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>{va.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif", marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{va.name}</div>
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
                <p style={{ fontSize: 11.5, color: '#555', fontFamily: "'Poppins', sans-serif", lineHeight: 1.55, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as any}>{va.bio}</p>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {va.skills.slice(0, 4).map(s => <span key={s} style={{ fontSize: 10, background: '#f5f3f3', color: '#555', borderRadius: 5, padding: '2px 7px', fontFamily: "'Poppins', sans-serif", border: '1px solid #ece8e8' }}>{s}</span>)}
                  {va.skills.length > 4 && <span style={{ fontSize: 10, color: '#aaa', fontFamily: "'Poppins', sans-serif", padding: '2px 4px' }}>+{va.skills.length - 4}</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {[{ label: 'Rate', value: `$${va.hourlyRate}/hr` }, { label: 'Jobs Done', value: String(va.completedJobs) }, { label: 'Response', value: va.responseTime }].map(s => (
                    <div key={s.label} style={{ background: '#faf9f9', borderRadius: 8, padding: '8px 6px', textAlign: 'center', border: '1px solid #f0edec' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{s.value}</div>
                      <div style={{ fontSize: 9.5, color: '#aaa', fontFamily: "'Poppins', sans-serif", marginTop: 1 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => onSelect(va)} disabled={va.availability === 'On Leave'} style={{ width: '100%', padding: '10px 0', background: va.availability === 'On Leave' ? '#f0edec' : '#800000', color: va.availability === 'On Leave' ? '#bbb' : '#fff', border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif", cursor: va.availability === 'On Leave' ? 'not-allowed' : 'pointer', letterSpacing: '0.02em', transition: 'background 0.15s' }}>
                  {va.availability === 'On Leave' ? 'Unavailable' : 'View Profile →'}
                </button>
              </div>
            )
          })}
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

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 4 — VA PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
function StepVAProfile({ va, service, onBack, onNext }: { va: VA; service: SelectedService; onBack: () => void; onNext: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'history'>('overview')
  return (
    <div>
      <BackBtn label="Back to Choose VA" onClick={onBack} />
      <ProgressBar activeIndex={3} />
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, color: '#800000', fontWeight: 700, margin: '0 0 2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Step 4 of 6</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>VA Profile</h2>
        <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>Review {va.name}'s full profile, skills, and work history.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            <div style={{ height: 80, background: 'linear-gradient(135deg,#800000 0%,#b03030 100%)', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: -26, left: 24, width: 52, height: 52, borderRadius: 13, background: 'linear-gradient(135deg,#800000,#c05050)', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>{va.avatar}</div>
            </div>
            <div style={{ padding: '34px 24px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 2px', fontFamily: "'Poppins', sans-serif" }}>{va.name}</h3>
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
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
                {[va.location, va.timezone, va.languages.join(' · ')].map((m, i) => (
                  <div key={i} style={{ fontSize: 11, color: '#666', fontFamily: "'Poppins', sans-serif", background: '#faf9f9', borderRadius: 6, padding: '4px 8px', border: '1px solid #f0edec' }}>{m}</div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 4, padding: '12px 16px', borderBottom: '1px solid #f5f2f2' }}>
              {(['overview', 'portfolio', 'history'] as const).map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{ background: activeTab === t ? '#800000' : 'none', color: activeTab === t ? '#fff' : '#888', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12.5, fontFamily: "'Poppins', sans-serif", fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ padding: '20px 24px' }}>
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontFamily: "'Poppins', sans-serif" }}>Skills & Expertise</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {va.skills.map(s => <span key={s} style={{ background: '#f5f3f3', border: '1px solid #ece8e8', color: '#444', fontSize: 11, fontFamily: "'Poppins', sans-serif", borderRadius: 6, padding: '4px 10px' }}>{s}</span>)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontFamily: "'Poppins', sans-serif" }}>Education</div>
                    <div style={{ fontSize: 12.5, color: '#444', fontFamily: "'Poppins', sans-serif" }}>{va.education}</div>
                  </div>
                </div>
              )}
              {activeTab === 'portfolio' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {va.portfolioItems.map((item, i) => (
                    <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: '#faf9f9', border: '1px solid #f0edec', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: '#fff0f0', border: '1px solid #f0c0c0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{item.title}</span>
                          <span style={{ fontSize: 9, background: '#800000', color: '#fff', borderRadius: 4, padding: '2px 7px', fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>{item.tag}</span>
                        </div>
                        <p style={{ fontSize: 12, color: '#666', margin: 0, lineHeight: 1.55, fontFamily: "'Poppins', sans-serif" }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
        <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ ...cardStyle, padding: '20px' }}>
            <div style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#aaa', fontWeight: 600, marginBottom: 4, fontFamily: "'Poppins', sans-serif" }}>Hourly Rate</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#800000', letterSpacing: '-0.02em', fontFamily: "'Poppins', sans-serif", lineHeight: 1, marginBottom: 14 }}>${va.hourlyRate}<span style={{ fontSize: 13, fontWeight: 500, color: '#aaa' }}>/hr</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {[{ label: 'Experience', value: va.experience }, { label: 'Jobs Completed', value: String(va.completedJobs) }, { label: 'Avg. Response', value: va.responseTime }, { label: 'Languages', value: va.languages.join(', ') }].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: "'Poppins', sans-serif" }}>
                  <span style={{ color: '#aaa' }}>{s.label}</span>
                  <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{s.value}</span>
                </div>
              ))}
            </div>
            <button onClick={onNext} style={{ width: '100%', padding: '12px 0', background: '#800000', color: '#fff', border: 'none', borderRadius: 10, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.02em', fontFamily: "'Poppins', sans-serif", transition: 'background 0.15s' }}>
              Book Interview →
            </button>
            <div style={{ textAlign: 'center', fontSize: 10, color: '#bbb', marginTop: 8, fontFamily: "'Poppins', sans-serif" }}>Free 30-min discovery call</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 5 — INTERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
function StepInterview({ va, service, onBack, onNext }: { va: VA; service: SelectedService; onBack: () => void; onNext: () => void }) {
  const calDays = getCalendarDays()
  const [activeView, setActiveView]   = useState<'schedule' | 'recordings'>('recordings')
  const [selectedDay, setSelectedDay]   = useState(calDays[1].date)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [scheduled, setScheduled]     = useState(false)
  const [playingId, setPlayingId]     = useState<string | null>(null)
  const [playProgress, setPlayProgress] = useState(0)
  const [activeChapter, setActiveChapter] = useState(0)

  const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
    completed: { bg: '#f0fdf4', color: '#16a34a', label: 'Completed' },
    upcoming:  { bg: '#eff6ff', color: '#2563eb', label: 'Upcoming' },
    missed:    { bg: '#fef2f2', color: '#dc2626', label: 'Missed' },
  }
  const rec = MOCK_RECORDINGS[0]

  return (
    <div>
      <BackBtn label="Back to VA Profile" onClick={onBack} />
      <ProgressBar activeIndex={4} />
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, color: '#800000', fontWeight: 700, margin: '0 0 2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Step 5 of 6</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Interview Recording</h2>
        <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>Review {va.name}'s interview recording or schedule a live call.</p>
      </div>
      <div style={{ display: 'inline-flex', background: '#f5f3f3', borderRadius: 10, padding: 4, gap: 2, marginBottom: 24, border: '1px solid #ece8e8' }}>
        {(['recordings', 'schedule'] as const).map(v => (
          <button key={v} onClick={() => setActiveView(v)} style={{ background: activeView === v ? '#800000' : 'transparent', color: activeView === v ? '#fff' : '#888', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontFamily: "'Poppins', sans-serif", fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}>
            {v === 'recordings' ? `🎥 Recordings (${MOCK_RECORDINGS.filter(r => r.status === 'completed').length})` : '📅 Schedule Interview'}
          </button>
        ))}
      </div>

      {activeView === 'recordings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ ...cardStyle, overflow: 'hidden' }}>
              <div style={{ background: '#0d0d18', aspectRatio: '16/9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 260 }}>
                <div style={{ width: 90, height: 90, borderRadius: 20, background: 'linear-gradient(135deg,rgba(128,0,128,0.4),rgba(80,0,128,0.6))', border: '2px solid rgba(150,80,200,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: 'rgba(100,0,150,0.2)' }} />
                  <span style={{ color: 'rgba(180,100,220,0.9)', fontSize: 22, fontWeight: 700, fontFamily: "'Poppins', sans-serif", zIndex: 1 }}>{va.avatar}</span>
                  {playingId !== rec.id && (
                    <button onClick={() => { setPlayingId(rec.id); setPlayProgress(0) }} style={{ position: 'absolute', inset: 0, borderRadius: 20, background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(255,255,255,0.4)' }}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </button>
                  )}
                </div>
                <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>{va.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: "'Poppins', sans-serif", marginTop: 2 }}>{va.role}</div>
                <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(20,20,36,0.9)', borderRadius: 8, padding: '7px 12px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: "'Poppins', sans-serif" }}>{va.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: "'Poppins', sans-serif" }}>{va.role} · Applicant</div>
                </div>
              </div>
              <div style={{ padding: '16px 20px 20px', background: '#fff' }}>
                <div style={{ marginBottom: 8, position: 'relative', cursor: 'pointer' }} onClick={e => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                  setPlayProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100))
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 48 }}>
                    {Array.from({ length: 80 }, (_, i) => {
                      const h = [20, 35, 55, 40, 65, 80, 45, 30, 55, 70, 50, 40, 75, 60, 35, 50, 65, 45, 30, 60, 80, 55, 40, 70, 50, 35, 60, 45, 80, 55, 40, 65, 30, 50, 70, 45, 60, 80, 35, 55, 40, 65, 50, 30, 70, 45, 60, 80, 35, 55, 40, 30, 65, 50, 70, 80, 45, 60, 35, 55, 40, 65, 30, 80, 50, 70, 45, 60, 55, 35, 40, 65, 50, 30, 70, 80, 45, 60, 55, 35][i % 80]
                      const pct = (i / 80) * 100
                      const isPlayed = pct <= playProgress
                      const isHigh = h > 60
                      return <div key={i} style={{ flex: 1, borderRadius: 2, height: `${h}%`, background: isPlayed ? (isHigh ? '#ef4444' : '#d97706') : (isHigh ? '#f5a0a0' : '#e5e7eb'), transition: 'background 0.1s' }} />
                    })}
                  </div>
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${playProgress}%`, width: 2, background: '#ef4444', borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: '#aaa', fontFamily: "'Poppins', sans-serif", marginBottom: 12 }}>
                  {['0:00', '1:38', '3:30', '4:55', '8:42'].map(t => <span key={t}>{t}</span>)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button style={{ width: 36, height: 36, borderRadius: '50%', background: '#f5f3f3', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
                  </button>
                  <button onClick={() => setPlayingId(playingId === rec.id ? null : rec.id)} style={{ width: 44, height: 44, borderRadius: '50%', background: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>
                    {playingId === rec.id
                      ? <svg width={16} height={16} viewBox="0 0 24 24" fill="#fff" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                      : <svg width={16} height={16} viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M8 5v14l11-7z"/></svg>}
                  </button>
                  <button style={{ width: 36, height: 36, borderRadius: '50%', background: '#f5f3f3', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
                  </button>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>
                      {String(Math.floor((playProgress / 100) * 8)).padStart(2,'0')}:{String(Math.floor(((playProgress / 100) * 8 % 1) * 60)).padStart(2,'0')} <span style={{ fontSize: 12, color: '#aaa', fontWeight: 400 }}>/ 8:42</span>
                    </div>
                    <div style={{ fontSize: 10, color: '#aaa', fontFamily: "'Poppins', sans-serif" }}>{rec.chapters[activeChapter]?.label || 'Chapter 1: Intro & Motivation'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['0.75x', '1x', '1.5x', '2x'].map(spd => (
                      <button key={spd} style={{ padding: '4px 8px', borderRadius: 6, border: '1.5px solid #e0dcdc', background: spd === '1x' ? '#ef4444' : '#fff', color: spd === '1x' ? '#fff' : '#555', fontSize: 10.5, fontFamily: "'Poppins', sans-serif", fontWeight: 600, cursor: 'pointer' }}>{spd}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ margin: '0 20px 20px', background: '#fef3f2', border: '1px solid #fde8e8', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>Q1</span>
                </div>
                <div>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: "'Poppins', sans-serif", marginBottom: 3 }}>Current Question</div>
                  <div style={{ fontSize: 12.5, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif", fontWeight: 500, lineHeight: 1.5 }}>Tell us about yourself and why you're interested in the {va.role} position.</div>
                </div>
              </div>
            </div>
            <div style={{ ...cardStyle, padding: '18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14, fontFamily: "'Poppins', sans-serif" }}>All Recordings</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MOCK_RECORDINGS.map(r => {
                  const st = STATUS_STYLE[r.status]
                  return (
                    <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: '1px solid #f0edec', background: '#faf9f9' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,#800000,#c05050)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                        <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>{r.thumbnail}</span>
                        {r.status === 'completed' && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width={14} height={14} viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M8 5v14l11-7z"/></svg>
                        </div>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif", marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
                        <div style={{ fontSize: 11, color: '#aaa', fontFamily: "'Poppins', sans-serif" }}>{r.date} · {r.duration}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 600, background: st.bg, color: st.color, borderRadius: 20, padding: '3px 10px', fontFamily: "'Poppins', sans-serif", flexShrink: 0 }}>{st.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ ...cardStyle, padding: '18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14, fontFamily: "'Poppins', sans-serif" }}>Interview Chapters</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rec.chapters.map((ch, i) => (
                  <button key={i} onClick={() => { setActiveChapter(i); setPlayingId(rec.id); setPlayProgress([0, 20, 42, 60][i]) }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, border: `1.5px solid ${activeChapter === i ? '#800000' : '#f0edec'}`, background: activeChapter === i ? '#fff5f5' : '#faf9f9', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: activeChapter === i ? '#800000' : '#e8e4e4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {activeChapter === i
                        ? <svg width={10} height={10} viewBox="0 0 24 24" fill="#fff" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                        : <span style={{ fontSize: 9, fontWeight: 700, color: '#888', fontFamily: "'Poppins', sans-serif" }}>{i+1}</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: activeChapter === i ? '#800000' : '#1a1a2e', fontFamily: "'Poppins', sans-serif", lineHeight: 1.3 }}>{ch.label}</div>
                      <div style={{ fontSize: 10, color: '#aaa', fontFamily: "'Poppins', sans-serif", marginTop: 2 }}>Starts at {ch.start}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ ...cardStyle, padding: '18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, fontFamily: "'Poppins', sans-serif" }}>Evaluator Notes</div>
              <textarea rows={4} placeholder="Add your observations about this candidate..." style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e8e4e4', borderRadius: 9, fontSize: 12, fontFamily: "'Poppins', sans-serif", color: '#333', background: '#faf9f9', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
            </div>
            <button onClick={onNext} style={{ width: '100%', padding: '13px 0', background: '#800000', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", letterSpacing: '0.02em', boxShadow: '0 4px 12px rgba(128,0,0,0.25)' }}>
              Send Hire Request →
            </button>
          </div>
        </div>
      )}

      {activeView === 'schedule' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {scheduled ? (
              <div style={{ ...cardStyle, padding: '40px 32px', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px', fontFamily: "'Poppins', sans-serif" }}>Interview Scheduled!</h3>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#800000', fontFamily: "'Poppins', sans-serif", marginBottom: 24 }}>
                  {new Date(selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button onClick={() => { setScheduled(false); setSelectedTime(null) }} style={{ padding: '10px 20px', background: '#f5f3f3', color: '#444', border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif", cursor: 'pointer' }}>Reschedule</button>
                  <button onClick={onNext} style={{ padding: '10px 20px', background: '#800000', color: '#fff', border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif", cursor: 'pointer' }}>Proceed to Hire →</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ ...cardStyle, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 14, fontFamily: "'Poppins', sans-serif" }}>Select a Date</div>
                  <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                    {calDays.map(d => (
                      <button key={d.date} disabled={d.isWeekend} onClick={() => { setSelectedDay(d.date); setSelectedTime(null) }}
                        style={{ minWidth: 52, padding: '8px 6px', textAlign: 'center', cursor: d.isWeekend ? 'not-allowed' : 'pointer', background: selectedDay === d.date ? '#800000' : '#fff', border: `1.5px solid ${selectedDay === d.date ? '#800000' : '#e8e4e4'}`, borderRadius: 10, opacity: d.isWeekend ? 0.4 : 1, transition: 'all 0.15s' }}>
                        <div style={{ fontSize: 9, fontWeight: 600, color: selectedDay === d.date ? 'rgba(255,255,255,0.8)' : '#aaa', textTransform: 'uppercase', marginBottom: 3, fontFamily: "'Poppins', sans-serif" }}>{d.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: selectedDay === d.date ? '#fff' : d.isToday ? '#800000' : '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{d.day}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ ...cardStyle, padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 14, fontFamily: "'Poppins', sans-serif" }}>Available Times</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {TIME_SLOTS.map(slot => (
                      <button key={slot.time} disabled={!slot.available} onClick={() => setSelectedTime(slot.time)}
                        style={{ padding: '9px 0', borderRadius: 8, border: `1.5px solid ${selectedTime === slot.time ? '#800000' : '#e8e4e4'}`, background: selectedTime === slot.time ? '#800000' : (slot.available ? '#fff' : '#f5f3f3'), color: selectedTime === slot.time ? '#fff' : (slot.available ? '#444' : '#ccc'), fontSize: 12, fontFamily: "'Poppins', sans-serif", fontWeight: 500, cursor: slot.available ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}>
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          {!scheduled && (
            <div style={{ position: 'sticky', top: 80 }}>
              <div style={{ ...cardStyle, padding: '20px' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14, fontFamily: "'Poppins', sans-serif" }}>Booking Summary</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                  {[{ label: 'Type', value: 'Discovery Call' }, { label: 'Duration', value: '30 minutes' }, { label: 'Format', value: 'Google Meet / Zoom' }, { label: 'Date', value: selectedDay ? new Date(selectedDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—' }, { label: 'Time', value: selectedTime ?? '—' }].map(s => (
                    <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: "'Poppins', sans-serif" }}>
                      <span style={{ color: '#aaa' }}>{s.label}</span>
                      <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{s.value}</span>
                    </div>
                  ))}
                </div>
                <button disabled={!selectedTime} onClick={() => setScheduled(true)} style={{ width: '100%', padding: '11px 0', background: selectedTime ? '#800000' : '#f0edec', color: selectedTime ? '#fff' : '#ccc', border: 'none', borderRadius: 10, fontSize: 12.5, fontWeight: 600, fontFamily: "'Poppins', sans-serif", cursor: selectedTime ? 'pointer' : 'not-allowed', transition: 'background 0.15s' }}>
                  Confirm Interview
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 6 — HIRE REQUEST (real API call)
// ═══════════════════════════════════════════════════════════════════════════════
function StepHireRequest({ va, service, brief, onBack, onSubmit }: { va: VA; service: SelectedService; brief: ProjectBriefData; onBack: () => void; onSubmit: () => void }) {
  const [form, setForm]   = useState<HireRequest>({ message: '', startDate: brief.startDate || '', contractType: 'full-time', hoursPerWeek: brief.hours, agreedToTerms: false })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const update = (k: keyof HireRequest, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))
  const canSubmit = form.message.trim() && form.startDate && form.agreedToTerms && !loading

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hire-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          vaId: va.id, serviceId: service.id, serviceName: service.name,
          projectBrief: brief, message: form.message,
          contractType: form.contractType, hoursPerWeek: form.hoursPerWeek,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Failed to send hire request')
      onSubmit()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle: React.CSSProperties = { width: '100%', padding: '10px 13px', border: '1.5px solid #e8e4e4', borderRadius: 9, fontSize: 12.5, fontFamily: "'Poppins', sans-serif", color: '#333', background: '#faf9f9', outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 0.15s' }
  const labelStyle: React.CSSProperties = { fontSize: 10.5, fontWeight: 700, color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 6, display: 'block', fontFamily: "'Poppins', sans-serif" }

  return (
    <div>
      <BackBtn label="Back to Interview" onClick={onBack} />
      <ProgressBar activeIndex={5} />
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, color: '#800000', fontWeight: 700, margin: '0 0 2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Step 6 of 6 — Final</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Send Hire Request</h2>
        <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>Confirm your offer to <strong style={{ color: '#800000' }}>{va.name}</strong> for <strong style={{ color: '#800000' }}>{service.name}</strong>.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ ...cardStyle, padding: '20px', background: 'linear-gradient(135deg, #fff8f8, #fff)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#800000', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14, fontFamily: "'Poppins', sans-serif" }}>You're Hiring</div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg,#800000,#c05050)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700, fontFamily: "'Poppins', sans-serif", flexShrink: 0 }}>{va.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{va.name}</div>
                <div style={{ fontSize: 12, color: '#888', fontFamily: "'Poppins', sans-serif", marginBottom: 6 }}>{va.role}</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Stars rating={va.rating} size={11} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{va.rating}</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>● {va.availability}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#800000', fontFamily: "'Poppins', sans-serif", lineHeight: 1 }}>${va.hourlyRate}</div>
                <div style={{ fontSize: 11, color: '#aaa', fontFamily: "'Poppins', sans-serif" }}>per hour</div>
              </div>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: '24px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif", marginBottom: 20 }}>Engagement Details</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>Message to {va.name.split(' ')[0]} <span style={{ color: '#800000' }}>*</span></label>
                <textarea rows={4} style={{ ...fieldStyle, resize: 'none' }} value={form.message} onChange={e => update('message', e.target.value)} placeholder={`Hi ${va.name.split(' ')[0]}, I'd like to hire you for ${service.name}...`} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Proposed Start Date <span style={{ color: '#800000' }}>*</span></label>
                  <input type="date" style={fieldStyle} value={form.startDate} onChange={e => update('startDate', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Contract Type</label>
                  <select style={{ ...fieldStyle, cursor: 'pointer' }} value={form.contractType} onChange={e => update('contractType', e.target.value)}>
                    <option value="full-time">Full-Time (40 hrs/wk)</option>
                    <option value="part-time">Part-Time (20 hrs/wk)</option>
                    <option value="project">Project-Based</option>
                    <option value="retainer">Monthly Retainer</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Hours Per Week</label>
                  <select style={{ ...fieldStyle, cursor: 'pointer' }} value={form.hoursPerWeek} onChange={e => update('hoursPerWeek', e.target.value)}>
                    {['10', '20', '30', '40'].map(h => <option key={h} value={h}>{h} hrs / week</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Estimated Duration</label>
                  <select style={{ ...fieldStyle, cursor: 'pointer' }}>
                    <option>Ongoing / Month-to-Month</option>
                    <option>1 Month</option><option>3 Months</option><option>6 Months</option><option>1 Year+</option>
                  </select>
                </div>
              </div>
              <div style={{ background: '#faf9f9', border: '1px solid #f0edec', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10, fontFamily: "'Poppins', sans-serif" }}>Attached Project Brief</div>
                {[{ label: 'Goals', value: brief.goals.slice(0, 80) + (brief.goals.length > 80 ? '…' : '') }, { label: 'Tools', value: brief.tools || '—' }, { label: 'KPIs', value: brief.kpis || '—' }].map(row => (
                  <div key={row.label} style={{ display: 'flex', gap: 8, fontSize: 12, fontFamily: "'Poppins', sans-serif", marginBottom: 4 }}>
                    <span style={{ color: '#aaa', minWidth: 44 }}>{row.label}:</span>
                    <span style={{ color: '#444', fontWeight: 500 }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', userSelect: 'none' }}>
                <div onClick={() => update('agreedToTerms', !form.agreedToTerms)} style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${form.agreedToTerms ? '#800000' : '#d0ccc8'}`, background: form.agreedToTerms ? '#800000' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'all 0.15s', marginTop: 1 }}>
                  {form.agreedToTerms && <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
                <span style={{ fontSize: 12, color: '#555', fontFamily: "'Poppins', sans-serif", lineHeight: 1.6 }}>
                  I agree to the <span style={{ color: '#800000', fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: '#800000', fontWeight: 600 }}>Engagement Policy</span>.
                </span>
              </label>
            </div>
          </div>
        </div>

        <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ ...cardStyle, padding: '20px' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14, fontFamily: "'Poppins', sans-serif" }}>Cost Estimate</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'VA Rate', value: `$${va.hourlyRate}/hr` },
                { label: `${form.hoursPerWeek} hrs/week`, value: `$${va.hourlyRate * Number(form.hoursPerWeek)}/wk` },
                { label: 'Est. Monthly', value: `$${va.hourlyRate * Number(form.hoursPerWeek) * 4}/mo` },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: "'Poppins', sans-serif" }}>
                  <span style={{ color: '#aaa' }}>{s.label}</span>
                  <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{s.value}</span>
                </div>
              ))}
              <div style={{ height: 1, background: '#f0edec' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                <span style={{ color: '#800000' }}>Total / Month</span>
                <span style={{ color: '#800000' }}>${va.hourlyRate * Number(form.hoursPerWeek) * 4}</span>
              </div>
            </div>
            <div style={{ background: '#faf9f9', border: '1px solid #f0edec', borderRadius: 8, padding: '10px 12px', fontSize: 11, color: '#888', fontFamily: "'Poppins', sans-serif", lineHeight: 1.5 }}>
              💡 Payment only processed after VA accepts. No charge until both parties agree.
            </div>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: '#991b1b', fontFamily: "'Poppins', sans-serif" }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={!canSubmit}
            style={{ width: '100%', padding: '15px 0', background: canSubmit ? '#800000' : '#f0edec', color: canSubmit ? '#fff' : '#ccc', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: canSubmit ? 'pointer' : 'not-allowed', fontFamily: "'Poppins', sans-serif", letterSpacing: '0.02em', boxShadow: canSubmit ? '0 6px 20px rgba(128,0,0,0.25)' : 'none', transition: 'all 0.2s' }}>
            {loading ? '⏳ Sending...' : '🚀 Send Hire Request'}
          </button>
          <div style={{ textAlign: 'center', fontSize: 10.5, color: '#bbb', fontFamily: "'Poppins', sans-serif" }}>
            {va.name.split(' ')[0]} will be notified immediately and has 48 hrs to respond.
          </div>

          <div style={{ ...cardStyle, padding: '14px 16px', background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', fontFamily: "'Poppins', sans-serif", marginBottom: 3 }}>What happens next?</div>
                <div style={{ fontSize: 11, color: '#555', fontFamily: "'Poppins', sans-serif", lineHeight: 1.6 }}>
                  1. {va.name.split(' ')[0]} reviews your request<br/>
                  2. VA accepts or negotiates terms<br/>
                  3. Onboarding begins on your start date
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUCCESS
// ═══════════════════════════════════════════════════════════════════════════════
function StepSuccess({ va, service }: { va: VA; service: SelectedService }) {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 500 }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg,#800000,#c03030)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 16px 40px rgba(128,0,0,0.25)' }}>
          <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e', margin: '0 0 10px', letterSpacing: '-0.02em', fontFamily: "'Poppins', sans-serif" }}>Hire Request Sent! 🎉</h2>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, margin: '0 0 32px', fontFamily: "'Poppins', sans-serif" }}>
          Your request has been sent to <strong style={{ color: '#800000' }}>{va.name}</strong>.<br/>
          They'll review your brief and respond within <strong>48 hours</strong>.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'VA', value: va.name, icon: '👤' },
            { label: 'Service', value: service.name, icon: '📋' },
            { label: 'Expected Response', value: 'Within 48 hrs', icon: '⏱️' },
            { label: 'Status', value: 'Pending Review', icon: '🔄' },
          ].map(s => (
            <div key={s.label} style={{ background: '#faf9f9', border: '1px solid #f0edec', borderRadius: 12, padding: '14px 16px', textAlign: 'left' }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'Poppins', sans-serif", marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button style={{ padding: '12px 24px', background: '#f5f3f3', color: '#444', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: "'Poppins', sans-serif", cursor: 'pointer' }}>View Dashboard</button>
          <button style={{ padding: '12px 24px', background: '#800000', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: "'Poppins', sans-serif", cursor: 'pointer', boxShadow: '0 4px 12px rgba(128,0,0,0.25)' }}>Browse More VAs</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════
export default function VAHiringFlow() {
  const [step, setStep]                   = useState<Step>('services')
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null)
  const [projectBrief, setProjectBrief]   = useState<ProjectBriefData | null>(null)
  const [selectedVA, setSelectedVA]       = useState<VA | null>(null)
  const goTo = (s: Step) => setStep(s)

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: '#fdfcfc', minHeight: '100vh', padding: 24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        button { font-family: 'Poppins', sans-serif; }
        input, select, textarea { font-family: 'Poppins', sans-serif; }
        textarea:focus, input:focus, select:focus { border-color: #c9a0a0 !important; background: #fff !important; }
        button:active { opacity: 0.85; }
      `}</style>

      {step === 'services' && (
        <StepServices onSelect={pkg => {
          setSelectedService({ id: pkg.id, name: pkg.name, categoryId: pkg.categoryId, price: String(pkg.price), billingCycle: pkg.billingCycle })
          goTo('project-brief')
        }} />
      )}
      {step === 'project-brief' && selectedService && (
        <StepProjectBrief service={selectedService} onBack={() => goTo('services')} onNext={brief => { setProjectBrief(brief); goTo('choose-va') }} />
      )}
      {step === 'choose-va' && selectedService && projectBrief && (
        <StepChooseVA service={selectedService} brief={projectBrief} onBack={() => goTo('project-brief')} onSelect={va => { setSelectedVA(va); goTo('va-profile') }} />
      )}
      {step === 'va-profile' && selectedService && selectedVA && (
        <StepVAProfile va={selectedVA} service={selectedService} onBack={() => goTo('choose-va')} onNext={() => goTo('interview')} />
      )}
      {step === 'interview' && selectedService && selectedVA && (
        <StepInterview va={selectedVA} service={selectedService} onBack={() => goTo('va-profile')} onNext={() => goTo('hire-request')} />
      )}
      {step === 'hire-request' && selectedService && selectedVA && projectBrief && (
        <StepHireRequest va={selectedVA} service={selectedService} brief={projectBrief} onBack={() => goTo('interview')} onSubmit={() => goTo('success')} />
      )}
      {step === 'success' && selectedService && selectedVA && (
        <StepSuccess va={selectedVA} service={selectedService} />
      )}
    </div>
  )
}