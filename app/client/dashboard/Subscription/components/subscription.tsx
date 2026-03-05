'use client'
import { useState, useEffect, useRef } from 'react'

// ─── TYPES ─────────────────────────────────────────────────────────────────────
interface Addon {
  label: string
  price: number
}

interface Service {
  id: string
  name: string
  short: string
  icon: string
  price: number
  priceLabel: string
  period: string
  tag: string
  featured: boolean
  description: string
  inclusions: string[]
  addons: Addon[]
  note: string | null
}

interface ServiceCategory {
  key: string
  label: string
  icon: string
  services: Service[]
}

interface Plan {
  id: number
  name: string
  tier: string
  price: number
  priceLabel: string
  billing: string
  renewDate: string
  daysLeft: number | null
  status: 'active' | 'ending' | 'ended'
  sessions: number
  totalSessions: number
  perks: string[]
  color: string
  bg: string
  isService: boolean
}

interface Preferences {
  startOption: string
  duration: string
  selectedAddons: string[]
  total: number
}

// ─── ICON ──────────────────────────────────────────────────────────────────────
function Ico({ d, size = 16, sw = 1.2 }: { d: string; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

// ─── DATA ──────────────────────────────────────────────────────────────────────
const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    key: 'staff', label: 'Dedicated Staff',
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    services: [
      { id: 's1', name: 'Customer Service\nRepresentative', short: 'CSR', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', price: 1400, priceLabel: '$1,400', period: '/ month', tag: 'Starting at', featured: false,
        description: 'A dedicated full-time Customer Service Representative who handles all client-facing communications — from resolving issues to maintaining your brand voice across every touchpoint.',
        inclusions: ['Dedicated full-time agent (8hrs/day)', 'Email, live chat & phone support', 'CRM documentation & ticketing', 'QA monitoring & call recording review', 'Weekly performance reporting', 'Team lead oversight & escalation path'],
        addons: [{ label: 'Extended hours (+4hrs/day)', price: 400 }, { label: 'Weekend coverage', price: 300 }, { label: 'Multilingual support', price: 250 }],
        note: null },
      { id: 's2', name: 'Technical Support\nRepresentative', short: 'TSR', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z', price: 1800, priceLabel: '$1,800', period: '/ month', tag: 'Starting at', featured: true,
        description: 'A specialized technical support agent trained to handle Tier 1–2 troubleshooting for SaaS platforms, eCommerce backends, and digital tools — keeping your customers unblocked and satisfied.',
        inclusions: ['Tier 1–2 technical troubleshooting', 'SaaS / eCommerce backend support', 'Escalation handling & documentation', 'System & knowledge base documentation', 'KPI tracking & QA monitoring'],
        addons: [{ label: 'Tier 3 escalation handling', price: 500 }, { label: 'API / integration support', price: 400 }, { label: 'Extended coverage hours', price: 350 }],
        note: 'Advanced technical roles: custom pricing' },
      { id: 's3', name: 'Web Development\n(Dedicated Developer)', short: 'DEV', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z', price: 2500, priceLabel: '$2,500', period: '/ month', tag: 'Starting at', featured: false,
        description: 'A dedicated web developer focused on building, maintaining, and optimizing your online presence — from landing pages to full platform builds.',
        inclusions: ['WordPress / Shopify / Webflow development', 'Site maintenance & performance optimization', 'Landing page design & build', 'Third-party tool integrations', 'Ongoing content & feature updates'],
        addons: [{ label: 'Full-stack backend dev', price: 800 }, { label: 'Custom API development', price: 600 }, { label: 'Monthly SEO audit', price: 300 }],
        note: 'Full-stack / custom system builds: custom quote' },
      { id: 's4', name: 'Social Media\nManagement', short: 'SMM', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14', price: 1800, priceLabel: '$1,800', period: '/ month', tag: 'Starting at', featured: false,
        description: 'End-to-end social media management — strategy, content creation, scheduling, and community engagement — all handled by a dedicated social media manager.',
        inclusions: ['Content calendar strategy (monthly)', 'Copywriting for all platforms', 'Scheduling & publishing', 'Community engagement management', 'Monthly analytics & performance report', 'Creative direction coordination'],
        addons: [{ label: 'Paid ads management', price: 600 }, { label: 'Influencer coordination', price: 400 }, { label: 'Story / Reel production', price: 350 }],
        note: 'Ads management available as add-on.' },
      { id: 's5', name: 'Video & Graphics\nDesign', short: 'VGD', icon: 'M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.889L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', price: 2200, priceLabel: '$2,200', period: '/ month', tag: 'Starting at', featured: false,
        description: 'A creative specialist producing scroll-stopping short-form video content, ad creatives, and brand visuals tailored to your audience and platform.',
        inclusions: ['Short-form videos (Reels / TikTok / Shorts)', 'Ad creative design & production', 'Brand asset creation', 'Thumbnails & campaign visuals', 'Creative strategy alignment sessions'],
        addons: [{ label: 'Long-form video editing', price: 500 }, { label: 'Motion graphics / animation', price: 600 }, { label: 'Extra revision rounds (×3)', price: 200 }],
        note: 'High-volume production: custom quote' },
    ],
  },
  {
    key: 'digital', label: 'Digital Systems & Automation',
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    services: [
      { id: 'd1', name: 'Funnel Builder', short: 'FB', icon: 'M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12', price: 3500, priceLabel: '$3,500', period: 'setup', tag: 'From', featured: false, description: 'A complete sales funnel built and configured for your business — from strategy and copy to automation and conversion tracking.', inclusions: ['Strategy & funnel mapping', 'Landing page design & build', 'Email automation sequences', 'CRM integration & pipeline setup', 'Conversion tracking & analytics'], addons: [{ label: 'A/B testing setup', price: 400 }, { label: 'Upsell / downsell pages', price: 500 }, { label: 'Monthly funnel management', price: 800 }], note: 'Maintenance from $800 / month' },
      { id: 'd2', name: 'Website Builder', short: 'WB', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 0-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1m-6 0h16', price: 4500, priceLabel: '$4,500', period: 'setup', tag: 'From', featured: false, description: 'A custom, conversion-focused website built for your brand — mobile-optimized, fast, and ready to attract and convert visitors.', inclusions: ['Custom website design & build', 'Mobile-responsive optimization', 'Conversion-focused page structure', 'Basic on-page SEO setup', 'Contact forms & lead capture'], addons: [{ label: 'E-commerce integration', price: 3000 }, { label: 'Blog setup & migration', price: 600 }, { label: 'Monthly maintenance retainer', price: 500 }], note: 'E-commerce builds: from $7,500' },
      { id: 'd3', name: 'AI Builder\n(Chatbots / AI Systems)', short: 'AI', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2', price: 5000, priceLabel: '$5,000', period: 'setup', tag: 'From', featured: true, description: 'A custom AI chatbot or automation system built to qualify leads, answer queries, and streamline workflows — without adding headcount.', inclusions: ['AI chatbot design & deployment', 'Lead qualification automation logic', 'CRM connection & data routing', 'Workflow automation setup', 'Custom training & knowledge base'], addons: [{ label: 'Voice AI integration', price: 1200 }, { label: 'Multi-channel deployment', price: 800 }, { label: 'Monthly AI maintenance', price: 1200 }], note: 'Enterprise AI systems: custom quote. Maintenance from $1,200 / month' },
      { id: 'd4', name: 'Surveys &\nForms System', short: 'SF', icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4', price: 900, priceLabel: '$900', period: 'setup', tag: 'From', featured: false, description: 'A smart survey and form system to capture leads, gather feedback, and route responses automatically into your CRM.', inclusions: ['Lead capture form system', 'CRM integration & tagging', 'Automated response routing', 'Data reporting dashboard setup'], addons: [{ label: 'Custom logic branching', price: 300 }, { label: 'Payment-linked forms', price: 400 }], note: null },
      { id: 'd5', name: 'Document Signing\nSystem', short: 'DS', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z', price: 800, priceLabel: '$800', period: 'setup', tag: 'From', featured: false, description: 'A seamless digital document signing workflow — automated, tracked, and connected to your CRM.', inclusions: ['Digital contract workflow setup', 'Automated document triggers', 'CRM-connected signing system'], addons: [{ label: 'Template library (×5 docs)', price: 300 }, { label: 'Bulk send automation', price: 400 }], note: null },
      { id: 'd6', name: 'Email Marketing\nManagement', short: 'EM', icon: 'M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z', price: 1500, priceLabel: '$1,500', period: '/ month', tag: 'From', featured: false, description: 'Full-service email marketing management — strategy, automation, list management, and reporting to keep your audience engaged and converting.', inclusions: ['Campaign strategy & planning', 'Automation flow setup & management', 'List segmentation & hygiene', 'A/B testing & optimization', 'Monthly performance reporting'], addons: [{ label: 'SMS marketing add-on', price: 400 }, { label: 'Dedicated IP warm-up', price: 300 }], note: null },
      { id: 'd7', name: 'CRM System Setup\n& Management', short: 'CRM', icon: 'M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z', price: 2500, priceLabel: '$2,500', period: 'setup', tag: 'From', featured: false, description: 'A fully configured CRM system built around your sales process — with pipelines, automations, and dashboards ready from day one.', inclusions: ['Pipeline & stage configuration', 'Automation workflow setup', 'Custom dashboard & reporting', 'Data structuring & migration'], addons: [{ label: 'Monthly CRM management', price: 1500 }, { label: 'Team training session', price: 600 }], note: 'Ongoing management from $1,500 / month' },
      { id: 'd8', name: 'Booking &\nAppointment System', short: 'BK', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z', price: 1200, priceLabel: '$1,200', period: 'setup', tag: 'From', featured: false, description: 'An automated booking system that handles scheduling, reminders, and payments — reducing no-shows and freeing up your team.', inclusions: ['Calendar automation & sync', 'Reminder email/SMS sequences', 'Payment integration setup', 'CRM connection & lead tagging'], addons: [{ label: 'Group booking setup', price: 400 }, { label: 'Intake form integration', price: 300 }], note: null },
      { id: 'd9', name: 'Courses & Digital\nProducts System', short: 'CDP', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', price: 4000, priceLabel: '$4,000', period: 'setup', tag: 'From', featured: false, description: 'A complete digital product delivery system — from course hosting and payment processing to access management and student automation.', inclusions: ['LMS platform configuration', 'Payment gateway setup', 'Automation workflows for enrollment', 'Student access & drip content management'], addons: [{ label: 'Affiliate system setup', price: 600 }, { label: 'Certificate automation', price: 400 }], note: null },
      { id: 'd10', name: 'Automation Builder\n(Advanced Workflows)', short: 'AUTO', icon: 'M13 10V3L4 14h7v7l9-11h-7z', price: 4500, priceLabel: '$4,500', period: 'setup', tag: 'From', featured: false, description: 'Complex, cross-platform automation architecture connecting your tools, eliminating manual work, and scaling your operations.', inclusions: ['Zapier / Make / API integrations', 'Cross-platform automation flows', 'Custom workflow logic & conditionals', 'System optimization & QA'], addons: [{ label: 'Custom API webhook dev', price: 800 }, { label: 'Monthly automation management', price: 1000 }], note: 'Complex automation architecture: custom quote' },
    ],
  },
  {
    key: 'saas', label: 'SaaS & Platform Licensing',
    icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
    services: [
      { id: 'p1', name: 'Gray-Label\nPlatform', short: 'GL', icon: 'M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zm0 8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm12 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2zm0 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v0z', price: 3000, priceLabel: '$3,000', period: '/ month', tag: 'Starting at', featured: false, description: 'Access to our fully-built platform under your brand identity — get up and running fast without building from scratch.', inclusions: ['Powered by Telex infrastructure', 'Multi-user access management', 'Automation capability included', 'Support & maintenance covered'], addons: [{ label: 'Additional user seats (×5)', price: 300 }, { label: 'Custom subdomain', price: 200 }], note: null },
      { id: 'p2', name: 'White-Label\nPlatform', short: 'WL', icon: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18', price: 7500, priceLabel: '$7,500', period: '/ month', tag: 'Starting at', featured: true, description: 'A fully rebranded, enterprise-ready platform under your name — custom domain, full CRM and automation system, and dedicated support.', inclusions: ['Fully rebranded platform UI', 'Custom domain & branding', 'Full CRM + automation system', 'Dedicated support team', 'Scalable user seat model'], addons: [{ label: 'White-label mobile app', price: 2000 }, { label: 'Custom feature development', price: 3000 }, { label: 'Priority SLA support', price: 800 }], note: 'Enterprise licensing: custom pricing' },
    ],
  },
]

const DURATION_OPTIONS = ['1 Month', '3 Months', '6 Months', '12 Months']
const START_OPTIONS = ['As soon as possible', 'Next Monday', 'Start of next month', 'Custom date']

const INITIAL_PLANS: Plan[] = [
  { id: 1, name: 'CSR', tier: 'Customer Service Representative', price: 1400, priceLabel: '$1,400', billing: 'Monthly', renewDate: 'Jun 30, 2025', daysLeft: null, status: 'ended', sessions: 0, totalSessions: 0, perks: ['Dedicated full-time agent (8hrs/day)', 'Email, live chat & phone support', 'CRM documentation & ticketing', 'Weekly performance reporting'], color: '#6b7280', bg: '#f9fafb', isService: true },
  { id: 2, name: 'SMM', tier: 'Social Media Management', price: 1800, priceLabel: '$1,800', billing: 'Monthly', renewDate: 'Jul 3, 2025', daysLeft: 2, status: 'ending', sessions: 0, totalSessions: 0, perks: ['Content calendar strategy (monthly)', 'Copywriting for all platforms', 'Scheduling & publishing', 'Community engagement management'], color: '#b45309', bg: '#fffbeb', isService: true },
  { id: 3, name: 'TSR', tier: 'Technical Support Representative', price: 1800, priceLabel: '$1,800', billing: 'Monthly', renewDate: 'Jul 15, 2025', daysLeft: 14, status: 'active', sessions: 0, totalSessions: 0, perks: ['Tier 1–2 technical troubleshooting', 'SaaS / eCommerce backend support', 'Escalation handling & documentation', 'KPI tracking & QA monitoring'], color: '#800000', bg: '#fff5f5', isService: true },
  { id: 4, name: 'WL', tier: 'White-Label Platform', price: 7500, priceLabel: '$7,500', billing: 'Monthly', renewDate: 'Jan 1, 2026', daysLeft: 210, status: 'active', sessions: 0, totalSessions: 0, perks: ['Fully rebranded platform UI', 'Custom domain & branding', 'Full CRM + automation system', 'Dedicated support team'], color: '#1d4ed8', bg: '#eff6ff', isService: true },
]

const STATUS_CFG = {
  active:  { label: 'Active',       dot: '#16a34a', color: '#15803d', bg: '#dcfce7' },
  ending:  { label: 'Ending Soon',  dot: '#d97706', color: '#b45309', bg: '#fef3c7' },
  ended:   { label: 'Inactive',     dot: '#9ca3af', color: '#4b5563', bg: '#f3f4f6' },
} as const

const GROUPS = [
  { key: 'ended'  as const, label: 'Recently Ended' },
  { key: 'ending' as const, label: 'Ending Soon' },
  { key: 'active' as const, label: 'Active' },
]

const FILTER_CHIPS = [
  { key: 'all',    label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'ending', label: 'Ending' },
  { key: 'ended',  label: 'Ended' },
]

// ─── SHARED STYLES ─────────────────────────────────────────────────────────────
const S = {
  overlay:      { position: 'fixed' as const, inset: 0, background: 'rgba(10,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
  modal:        { background: '#fff', borderRadius: 22, boxShadow: '0 40px 100px rgba(0,0,0,0.28)', width: '100%', maxHeight: '90vh', overflowY: 'auto' as const },
  closeBtn:     { position: 'absolute' as const, top: 14, right: 14, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' },
  backBtn:      { background: '#f0eeee', border: 'none', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#555', flexShrink: 0 },
  primaryBtn:   { width: '100%', background: 'linear-gradient(135deg,#800000,#a02020)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 20px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins,sans-serif', letterSpacing: '0.01em' },
  secondaryBtn: { flex: '0 0 120px', background: '#fff', color: '#555', border: '1.5px solid #d5d0d0', borderRadius: 12, padding: '13px 20px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Poppins,sans-serif' },
  fieldLabel:   { display: 'block', fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 10 },
  optionBtn:    { background: '#fff', border: '1.5px solid #ddd', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: '#444', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', transition: 'all 0.15s', textAlign: 'center' as const },
  optionActive: { background: '#fff5f5', border: '1.5px solid #800000', color: '#800000', fontWeight: 600 },
}

// ─── STEP 1: DETAIL ────────────────────────────────────────────────────────────
function ServiceDetailModal({ svc, onClose, onProceed }: { svc: Service; onClose: () => void; onProceed: () => void }) {
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{ ...S.modal, maxWidth: 560, padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ background: 'linear-gradient(135deg,#800000 0%,#a82020 100%)', padding: '28px 32px 26px', position: 'relative' }}>
          <button onClick={onClose} style={S.closeBtn}><Ico d="M18 6L6 18M6 6l12 12" size={14} sw={2} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Ico d={svc.icon} size={22} sw={1.5} />
              </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,220,220,0.9)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 500 }}>{svc.tag}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.25, whiteSpace: 'pre-line', letterSpacing: '-0.02em' }}>{svc.name}</div>
            </div>
            {svc.featured && <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 20, padding: '3px 12px', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.35)' }}>⭐ Popular</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 34, fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>{svc.priceLabel}</span>
            <span style={{ fontSize: 13, color: 'rgba(255,220,220,0.95)', fontWeight: 400 }}>{svc.period}</span>
          </div>
        </div>
        <div style={{ padding: '26px 32px 28px', background: '#fff' }}>
          <p style={{ fontSize: 13, color: '#444', lineHeight: 1.75, marginBottom: 24, fontWeight: 400 }}>{svc.description}</p>
          <div style={{ marginBottom: 24 }}>
            <div style={S.fieldLabel}>What&apos;s Included</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {svc.inclusions.map(inc => (
                <div key={inc} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#333', lineHeight: 1.5, fontWeight: 400 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff0f0', border: '1px solid #f0c0c0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Ico d="M20 6L9 17l-5-5" size={9} sw={2.5} />
                  </div>
                  {inc}
                </div>
              ))}
            </div>
          </div>
          {svc.note && (
            <div style={{ background: '#fdf8f0', border: '1px solid #f0d8a0', borderRadius: 10, padding: '11px 15px', fontSize: 12, color: '#7a5a20', marginBottom: 22, fontStyle: 'italic', lineHeight: 1.5, fontWeight: 400 }}>
              ℹ️ {svc.note}
            </div>
          )}
          <button onClick={onProceed} style={S.primaryBtn}>Get This Service →</button>
        </div>
      </div>
    </div>
  )
}

// ─── STEP 2: CUSTOMIZATION ─────────────────────────────────────────────────────
function CustomizationModal({ svc, onBack, onProceed }: { svc: Service; onBack: () => void; onProceed: (p: Preferences) => void }) {
  const [startOption, setStartOption] = useState(START_OPTIONS[0])
  const [duration, setDuration] = useState(DURATION_OPTIONS[0])
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  const toggleAddon = (label: string) =>
    setSelectedAddons(prev => prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label])

  const addonTotal = svc.addons.filter(a => selectedAddons.includes(a.label)).reduce((s, a) => s + a.price, 0)
  const total = svc.price + addonTotal

  return (
    <div style={S.overlay} onClick={onBack}>
      <div style={{ ...S.modal, maxWidth: 520, padding: 28 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26 }}>
          <button onClick={onBack} style={S.backBtn}><Ico d="M19 12H5M12 19l-7-7 7-7" size={14} sw={2} /></button>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>Customize Your Service</div>
            <div style={{ fontSize: 12, color: '#666', fontWeight: 400, marginTop: 1 }}>{svc.name.replace('\n', ' ')}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
            {[1, 2, 3].map(n => <div key={n} style={{ width: n === 2 ? 20 : 8, height: 8, borderRadius: 99, background: n === 2 ? '#800000' : '#e0dcdc' }} />)}
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={S.fieldLabel}>When would you like to start?</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {START_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setStartOption(opt)} style={{ ...S.optionBtn, ...(startOption === opt ? S.optionActive : {}) }}>{opt}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={S.fieldLabel}>Duration</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
            {DURATION_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setDuration(opt)} style={{ ...S.optionBtn, ...(duration === opt ? S.optionActive : {}) }}>{opt}</button>
            ))}
          </div>
        </div>

        {svc.addons.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <label style={S.fieldLabel}>Optional Add-ons</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {svc.addons.map(addon => {
                const checked = selectedAddons.includes(addon.label)
                return (
                  <div key={addon.label} onClick={() => toggleAddon(addon.label)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 15px', borderRadius: 11, border: `1.5px solid ${checked ? '#800000' : '#ddd'}`, background: checked ? '#fff5f5' : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${checked ? '#800000' : '#bbb'}`, background: checked ? '#800000' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                        {checked && <Ico d="M20 6L9 17l-5-5" size={9} sw={2.8} />}
                      </div>
                      <span style={{ fontSize: 13, color: '#333', fontWeight: 400 }}>{addon.label}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#800000' }}>+${addon.price.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div style={{ background: 'linear-gradient(135deg,#800000,#a82020)', borderRadius: 14, padding: '18px 22px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,220,220,0.9)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 600 }}>Total Cost</div>
            <div style={{ fontSize: 12, color: 'rgba(255,220,220,0.85)', fontWeight: 400 }}>{svc.priceLabel} base{addonTotal > 0 ? ` + $${addonTotal.toLocaleString()} add-ons` : ''}</div>
          </div>
          <div>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>${total.toLocaleString()}</span>
            <span style={{ fontSize: 12, color: 'rgba(255,220,220,0.9)', marginLeft: 5, fontWeight: 400 }}>{svc.period}</span>
          </div>
        </div>

        <button onClick={() => onProceed({ startOption, duration, selectedAddons, total })} style={S.primaryBtn}>
          Continue to Review →
        </button>
      </div>
    </div>
  )
}

// ─── STEP 3: CONFIRM ───────────────────────────────────────────────────────────
function ConfirmModal({ svc, preferences, onBack, onConfirm }: { svc: Service; preferences: Preferences; onBack: () => void; onConfirm: () => void }) {
  const rows: [string, string][] = [
    ['Service', svc.name.replace('\n', ' ')],
    ['Start Date', preferences.startOption],
    ['Duration', preferences.duration],
    ...(preferences.selectedAddons.length > 0 ? [['Add-ons', preferences.selectedAddons.join(', ')] as [string, string]] : []),
  ]

  return (
    <div style={S.overlay} onClick={onBack}>
      <div style={{ ...S.modal, maxWidth: 460, padding: 32 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {[1, 2, 3].map(n => <div key={n} style={{ width: n === 3 ? 20 : 8, height: 8, borderRadius: 99, background: n === 3 ? '#800000' : '#f0d8d8' }} />)}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff0f0', border: '2px solid #f0c0c0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Ico d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size={26} sw={1.4} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 8, letterSpacing: '-0.02em' }}>Confirm Your Service</div>
          <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6, fontWeight: 400 }}>Review the details below before finalizing your subscription.</div>
        </div>

        <div style={{ background: '#f8f6f6', border: '1px solid #e8e4e4', borderRadius: 14, padding: '20px 22px', marginBottom: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Order Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rows.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <span style={{ fontSize: 12, color: '#777', flexShrink: 0, fontWeight: 400 }}>{k}</span>
                <span style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 500, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: '1.5px solid #e0dcdc', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>Total</span>
              <div>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#800000', letterSpacing: '-0.02em' }}>${preferences.total.toLocaleString()}</span>
                <span style={{ fontSize: 12, color: '#888', marginLeft: 5, fontWeight: 400 }}>{svc.period}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onBack} style={S.secondaryBtn}>Cancel</button>
          <button onClick={onConfirm} style={{ ...S.primaryBtn, flex: 1, margin: 0 }}>✓ Confirm and Add</button>
        </div>
      </div>
    </div>
  )
}

// ─── STEP 4: SUCCESS ───────────────────────────────────────────────────────────
function SuccessModal({ svc, onDone }: { svc: Service; onDone: () => void }) {
  const [count, setCount] = useState(3)

  useEffect(() => {
    const interval = setInterval(() => setCount(c => Math.max(0, c - 1)), 1000)
    const timeout = setTimeout(onDone, 3000)
    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [onDone])

  return (
    <div style={S.overlay}>
      <style>{`
        @keyframes scaleIn{0%{transform:scale(0.3);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
        @keyframes ringOut{0%{transform:scale(1);opacity:0.7}100%{transform:scale(1.8);opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .scheck{animation:scaleIn 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards}
        .sring{position:absolute;inset:0;border-radius:50%;border:2px solid #800000;animation:ringOut 1.4s ease-out infinite}
        .sring2{animation-delay:0.5s}
        .sfade{animation:fadeUp 0.4s ease 0.3s both}
      `}</style>
      <div style={{ ...S.modal, maxWidth: 360, padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 24px' }}>
          <div className="sring" /><div className="sring sring2" />
          <div className="scheck" style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#800000,#c04040)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Ico d="M20 6L9 17l-5-5" size={32} sw={2.5} />
          </div>
        </div>
        <div className="sfade">
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 10, letterSpacing: '-0.02em' }}>Service Added!</div>
          <div style={{ fontSize: 13, color: '#444', lineHeight: 1.7, marginBottom: 24, fontWeight: 400 }}>
            <strong style={{ color: '#800000', fontWeight: 700 }}>{svc.name.replace('\n', ' ')}</strong> has been successfully added to your plan.
          </div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 14, fontWeight: 400 }}>
            Redirecting to My Plans in <strong style={{ color: '#800000', fontSize: 14, fontWeight: 700 }}>{count}</strong>s
          </div>
          <div style={{ height: 5, background: '#eee', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,#800000,#c04040)', borderRadius: 99, width: `${(count / 3) * 100}%`, transition: 'width 1s linear' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PLAN ACTION MODALS ────────────────────────────────────────────────────────
function RenewModal({ plan, onClose, onConfirm }: { plan: Plan; onClose: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 22, boxShadow: '0 40px 100px rgba(0,0,0,0.28)', width: '100%', maxWidth: 420, padding: 32 }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff0f0', border: '2px solid #f0c0c0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 8, letterSpacing: '-0.01em' }}>Renew Subscription</div>
          <div style={{ fontSize: 13, color: '#444', lineHeight: 1.6, fontWeight: 400 }}>You're about to renew <strong style={{ color: '#800000', fontWeight: 700 }}>{plan.tier}</strong>. Your billing cycle will restart.</div>
        </div>
        <div style={{ background: '#f8f6f6', border: '1px solid #e8e4e4', borderRadius: 12, padding: '16px 20px', marginBottom: 22 }}>
          {['Plan', 'Price', 'Billing'].map((k, i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid #eee' : 'none' }}>
              <span style={{ fontSize: 12, color: '#666', fontWeight: 400 }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{[plan.tier, plan.priceLabel, plan.billing][i]}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: '0 0 110px', background: '#fff', color: '#555', border: '1.5px solid #d5d0d0', borderRadius: 12, padding: '12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, background: 'linear-gradient(135deg,#800000,#a02020)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>↻ Confirm Renewal</button>
        </div>
      </div>
    </div>
  )
}

function PayModal({ plan, onClose, onConfirm }: { plan: Plan; onClose: () => void; onConfirm: () => void }) {
  const [method, setMethod] = useState<'card'|'bank'|'wallet'>('card')
  const methods = [{ id: 'card' as const, label: 'Credit / Debit Card', icon: 'M1 4h22v16H1zM1 10h22' }, { id: 'bank' as const, label: 'Bank Transfer', icon: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11' }, { id: 'wallet' as const, label: 'E-Wallet', icon: 'M21 12V7H5a2 2 0 0 1 0-4h14v4M21 12v5H5a2 2 0 0 0 0 4h14v-4' }]
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 22, boxShadow: '0 40px 100px rgba(0,0,0,0.28)', width: '100%', maxWidth: 440, padding: 32 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.01em' }}>Make a Payment</div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 2, fontWeight: 400 }}>{plan.tier}</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#800000', letterSpacing: '-0.02em' }}>{plan.priceLabel}</div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Payment Method</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
          {methods.map(m => (
            <div key={m.id} onClick={() => setMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 15px', borderRadius: 11, border: `1.5px solid ${method === m.id ? '#800000' : '#ddd'}`, background: method === m.id ? '#fff5f5' : '#fff', cursor: 'pointer' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: method === m.id ? '#fff0f0' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={method === m.id ? '#800000' : '#666'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={m.icon}/></svg>
              </div>
              <span style={{ fontSize: 13, color: method === m.id ? '#800000' : '#333', fontWeight: method === m.id ? 600 : 400 }}>{m.label}</span>
              <div style={{ marginLeft: 'auto', width: 16, height: 16, borderRadius: '50%', border: `2px solid ${method === m.id ? '#800000' : '#bbb'}`, background: method === m.id ? '#800000' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {method === m.id && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: '0 0 110px', background: '#fff', color: '#555', border: '1.5px solid #d5d0d0', borderRadius: 12, padding: '12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, background: 'linear-gradient(135deg,#800000,#a02020)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Pay {plan.priceLabel} →</button>
        </div>
      </div>
    </div>
  )
}

function EditModal({ plan, onClose, onSave }: { plan: Plan; onClose: () => void; onSave: (updated: Partial<Plan>) => void }) {
  const [name, setName] = useState(plan.name)
  const [billing, setBilling] = useState(plan.billing)
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 22, boxShadow: '0 40px 100px rgba(0,0,0,0.28)', width: '100%', maxWidth: 420, padding: 32 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 4, letterSpacing: '-0.01em' }}>Edit Subscription</div>
        <div style={{ fontSize: 12, color: '#555', marginBottom: 24, fontWeight: 400 }}>{plan.tier}</div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Display Name</label>
          <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: 10, padding: '11px 14px', fontSize: 13, color: '#1a1a2e', outline: 'none', fontFamily: 'Poppins,sans-serif', fontWeight: 400 }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Billing Cycle</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Monthly', 'Yearly'].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: `1.5px solid ${billing === b ? '#800000' : '#ddd'}`, background: billing === b ? '#fff5f5' : '#fff', color: billing === b ? '#800000' : '#444', fontWeight: billing === b ? 700 : 400, fontSize: 13, cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>{b}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: '0 0 110px', background: '#fff', color: '#555', border: '1.5px solid #d5d0d0', borderRadius: 12, padding: '12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Cancel</button>
          <button onClick={() => onSave({ name, billing })} style={{ flex: 1, background: 'linear-gradient(135deg,#800000,#a02020)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

// ─── DOTS MENU ─────────────────────────────────────────────────────────────────
function DotsMenu({ plan, onClose, onAction, triggerRect }: {
  plan: Plan
  onClose: () => void
  onAction: (action: string) => void
  triggerRect: DOMRect | null
}) {
  const items = [
    { label: 'View Details',         icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6' },
    { label: 'Download Invoice',      icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3' },
    { label: 'Cancel Subscription',  icon: 'M18 6L6 18M6 6l12 12', danger: true },
  ]

  const top  = triggerRect ? triggerRect.bottom + window.scrollY + 6  : 0
  const left = triggerRect ? triggerRect.right  + window.scrollX - 190 : 0

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={onClose}>
      <div style={{ position: 'absolute', top, left, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '1px solid #e8e4e4', padding: 6, minWidth: 190 }} onClick={e => e.stopPropagation()}>
        {items.map(item => (
          <button key={item.label} onClick={() => { onAction(item.label); onClose() }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 9, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, color: item.danger ? '#dc2626' : '#1a1a2e', fontFamily: 'Poppins,sans-serif', textAlign: 'left', fontWeight: 500 }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={item.danger ? '#dc2626' : '#555'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function SubscriptionsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpand] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'plans' | 'services'>('plans')
  const [activeCategory, setActiveCategory] = useState('staff')
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS)

  const [flowStep, setFlowStep] = useState<'detail' | 'customize' | 'confirm' | 'success' | null>(null)
  const [selectedSvc, setSelectedSvc] = useState<Service | null>(null)
  const [preferences, setPreferences] = useState<Preferences | null>(null)

  const [planModal, setPlanModal]   = useState<'renew'|'pay'|'edit'|'dots'|null>(null)
  const [activePlan, setActivePlan] = useState<Plan | null>(null)
  const [dotsTriggerRect, setDotsTriggerRect] = useState<DOMRect | null>(null)

  const openPlanModal = (type: 'renew'|'pay'|'edit'|'dots', plan: Plan, rect?: DOMRect) => {
    setActivePlan(plan); setPlanModal(type)
    if (type === 'dots' && rect) setDotsTriggerRect(rect)
  }
  const closePlanModal = () => { setPlanModal(null); setActivePlan(null); setDotsTriggerRect(null) }

  const openDetail = (svc: Service) => { setSelectedSvc(svc); setFlowStep('detail') }
  const closeFlow  = () => { setFlowStep(null); setSelectedSvc(null); setPreferences(null) }

  const [toast, setToast] = useState<string | null>(null)
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const handleRenewConfirm = () => {
    if (!activePlan) return
    setPlans(prev => prev.map(p => p.id === activePlan.id ? { ...p, status: 'active', daysLeft: p.billing === 'Yearly' ? 365 : 30 } : p))
    closePlanModal(); showToast('Subscription renewed successfully!')
  }
  const handlePayConfirm  = () => { closePlanModal(); showToast('Payment processed successfully!') }
  const handleEditSave    = (updated: Partial<Plan>) => {
    if (!activePlan) return
    setPlans(prev => prev.map(p => p.id === activePlan.id ? { ...p, ...updated } : p))
    closePlanModal(); showToast('Subscription updated!')
  }
  const handleDotsAction  = (action: string, plan: Plan) => {
    if (action === 'Cancel Subscription') {
      setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, status: 'ended', daysLeft: null } : p))
      showToast('Subscription cancelled.')
    } else if (action === 'Download Invoice') {
      showToast('Invoice download started!')
    } else {
      showToast(`Viewing details for ${plan.tier}`)
    }
  }

  const handleSuccess = () => {
    if (!selectedSvc || !preferences) return
    const newPlan: Plan = {
      id: Date.now(), name: selectedSvc.short,
      tier: selectedSvc.name.replace('\n', ' '),
      price: preferences.total, priceLabel: `$${preferences.total.toLocaleString()}`,
      billing: selectedSvc.period.includes('month') ? 'Monthly' : 'One-time',
      renewDate: preferences.startOption, daysLeft: 30, status: 'active',
      sessions: 0, totalSessions: 12,
      perks: selectedSvc.inclusions.slice(0, 4),
      color: '#800000', bg: '#fff5f5', isService: true,
    }
    setPlans(prev => [...prev, newPlan])
    closeFlow(); setActiveTab('plans')
  }

  const activePlans  = plans.filter(p => p.status === 'active')
  const monthlySpend = activePlans.filter(p => p.billing === 'Monthly').reduce((a, p) => a + p.price, 0)
  const yearlySpend  = activePlans.reduce((a, p) => a + (p.billing === 'Yearly' ? p.price : p.price * 12), 0)

  const visible = plans.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = p.name.toLowerCase().includes(q) || p.tier.toLowerCase().includes(q)
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  const currentCat = SERVICE_CATEGORIES.find(c => c.key === activeCategory)
  const canRenew = (plan: Plan) => plan.status === 'ended' || (plan.daysLeft !== null && plan.daysLeft <= 3)
  const canPay   = (plan: Plan) => plan.status === 'ending' || (plan.status === 'active' && plan.daysLeft !== null && plan.daysLeft <= 5)

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: '24px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *,*::before,*::after{font-family:'Poppins',sans-serif;box-sizing:border-box;}

        /* ── Tab buttons ── */
        .tab-btn{border:none;background:transparent;border-radius:8px;padding:7px 20px;font-size:12px;font-weight:500;color:#666;cursor:pointer;transition:all 0.18s;font-family:'Poppins',sans-serif;letter-spacing:0.01em;}
        .tab-btn.active{background:#fff;color:#800000;box-shadow:0 1px 4px rgba(0,0,0,0.1);font-weight:700;}

        /* ── Category tabs ── */
        .cat-tab{border:1px solid #d8d4d4;background:#fff;border-radius:8px;padding:7px 16px;font-size:12px;color:#555;cursor:pointer;transition:all 0.15s;font-family:'Poppins',sans-serif;font-weight:500;display:flex;align-items:center;gap:6px;letter-spacing:0.01em;}
        .cat-tab.active{background:#800000;border-color:#800000;color:#fff;font-weight:600;}
        .cat-tab:hover:not(.active){border-color:#b08080;color:#800000;}

        /* ── Service price cards ── */
        .price-card{border-radius:16px;padding:0;overflow:hidden;border:1px solid #e0dcdc;background:#fff;box-shadow:0 4px 16px rgba(0,0,0,0.07),0 1px 4px rgba(0,0,0,0.04);transition:all 0.25s cubic-bezier(0.25,0.46,0.45,0.94);position:relative;display:flex;flex-direction:column;}
        .price-card:hover{box-shadow:0 16px 48px rgba(128,0,0,0.15),0 4px 16px rgba(128,0,0,0.08);transform:translateY(-5px);border-color:#e8b8b8;}
        .price-card.featured{border-color:#800000;box-shadow:0 8px 32px rgba(128,0,0,0.22),0 2px 8px rgba(128,0,0,0.1);}
        .price-card.featured:hover{box-shadow:0 20px 56px rgba(128,0,0,0.3),0 6px 20px rgba(128,0,0,0.16);transform:translateY(-6px);}

        /* ── Get started button ── */
        .gs-btn{width:100%;border:none;border-radius:10px;padding:11px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.18s;font-family:'Poppins',sans-serif;margin-top:4px;display:flex;align-items:center;justify-content:center;gap:6px;letter-spacing:0.01em;}
        .gs-plain{background:#800000;color:#fff;}.gs-plain:hover{background:#6a0000;box-shadow:0 4px 14px rgba(128,0,0,0.3);}
        .gs-featured{background:#fff;color:#800000;}.gs-featured:hover{background:#fff5f5;}

        /* ── Filter chips ── */
        .chip{border:1px solid #d8d4d4;background:#fff;border-radius:8px;padding:5px 14px;font-size:12px;color:#555;cursor:pointer;transition:all 0.15s;white-space:nowrap;font-weight:500;font-family:'Poppins',sans-serif;}
        .chip.on{background:#800000;border-color:#800000;color:#fff;font-weight:600;}
        .chip:hover:not(.on){border-color:#c09090;color:#800000;}

        /* ── Action buttons ── */
        .act-btn{border:1px solid #d8c8c8;color:#800000;background:#fff;border-radius:7px;padding:5px 14px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s;white-space:nowrap;font-family:'Poppins',sans-serif;}
        .act-btn:hover{background:#800000;color:#fff;border-color:#800000;}
        .act-btn.dim{color:#bbb;border-color:#eee;cursor:not-allowed;background:#fafafa;pointer-events:none;}
        .act-btn.ghost{color:#666;border-color:#d8d4d4;}.act-btn.ghost:hover{background:#f5f5f5;color:#333;border-color:#bbb;}

        /* ── Dots menu button ── */
        .dots{background:#fff;border:1px solid #d8d4d4;border-radius:7px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#888;transition:all 0.15s;flex-shrink:0;}
        .dots:hover{border-color:#c09090;color:#800000;background:#fff8f8;}

        /* ── Subscription table ── */
        .s-table{width:100%;background:#fff;border:1.5px solid #e0dcdc;border-radius:14px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.04);}
        .s-thead{display:grid;grid-template-columns:2.5fr 1.4fr 1fr 1.4fr 180px;padding:0 20px;border-bottom:1px solid #e8e4e4;background:#f8f6f6;}
        .s-thead-cell{font-size:11px;color:#555;padding:12px 0;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;}
        .s-row{display:grid;grid-template-columns:2.5fr 1.4fr 1fr 1.4fr 180px;padding:14px 20px;align-items:center;border-bottom:1px solid #f5f2f2;cursor:pointer;transition:background 0.12s;}
        .s-row:hover{background:#fdfbfb;}
        .s-expand{border-top:1px solid #ede8e8;background:linear-gradient(180deg,#fffcfc 0%,#fff 100%);padding:16px 20px;animation:fadeSlide 0.2s ease;}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}

        /* ── Status badge ── */
        .status-badge{display:inline-flex;align-items:center;gap:5px;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;}

        /* ── Perk tags ── */
        .perk-tag{display:inline-flex;align-items:center;gap:4px;background:#fff5f5;border:1px solid #f0d0d0;color:#800000;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:500;}

        /* ── New service badge ── */
        .new-badge{background:#fff0f0;border:1px solid #f0c8c8;color:#800000;border-radius:5px;padding:2px 7px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-left:6px;}

        @media(max-width:768px){.s-thead{display:none;}.s-row{grid-template-columns:1fr 1fr;gap:6px;}.cards-grid{grid-template-columns:1fr!important;}}
      `}</style>

      {/* ── Service flow modals ── */}
      {flowStep === 'detail'    && selectedSvc && <ServiceDetailModal svc={selectedSvc} onClose={closeFlow} onProceed={() => setFlowStep('customize')} />}
      {flowStep === 'customize' && selectedSvc && <CustomizationModal svc={selectedSvc} onBack={() => setFlowStep('detail')} onProceed={prefs => { setPreferences(prefs); setFlowStep('confirm') }} />}
      {flowStep === 'confirm'   && selectedSvc && preferences && <ConfirmModal svc={selectedSvc} preferences={preferences} onBack={() => setFlowStep('customize')} onConfirm={() => setFlowStep('success')} />}
      {flowStep === 'success'   && selectedSvc && <SuccessModal svc={selectedSvc} onDone={handleSuccess} />}

      {/* ── Plan action modals ── */}
      {planModal === 'renew' && activePlan && <RenewModal plan={activePlan} onClose={closePlanModal} onConfirm={handleRenewConfirm} />}
      {planModal === 'pay'   && activePlan && <PayModal   plan={activePlan} onClose={closePlanModal} onConfirm={handlePayConfirm} />}
      {planModal === 'edit'  && activePlan && <EditModal  plan={activePlan} onClose={closePlanModal} onSave={handleEditSave} />}
      {planModal === 'dots'  && activePlan && <DotsMenu plan={activePlan} onClose={closePlanModal} onAction={action => handleDotsAction(action, activePlan)} triggerRect={dotsTriggerRect} />}

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: '#1a1a2e', color: '#fff', borderRadius: 12, padding: '12px 22px', fontSize: 13, fontWeight: 600, zIndex: 2000, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', letterSpacing: '0.01em' }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Account</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Subscriptions</h2>
        <p style={{ fontSize: 13, color: '#555', fontWeight: 400, margin: '3px 0 0' }}>Manage and track your active subscription plans.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
        {([
          { label: 'Active Plans',  value: `${activePlans.length} plans`, sub: 'Currently running', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80' },
          { label: 'Monthly Spend', value: `$${monthlySpend.toLocaleString()}`, sub: 'Billed this month', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80' },
          { label: 'Yearly Total',  value: `$${yearlySpend.toLocaleString()}`, sub: 'Annual projection', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80' },
        ] as const).map(s => (
          <div key={s.label} style={{ borderRadius: 14, overflow: 'hidden', position: 'relative', minHeight: 96, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <img src={s.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(90,0,0,0.93) 30%,rgba(70,0,0,0.72) 65%,rgba(30,0,0,0.4) 100%)' }} />
            <div style={{ position: 'relative', zIndex: 2, padding: '16px 18px', height: '100%', display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'rgba(255,210,210,0.95)' }}>
                <Ico d={s.icon} size={16} sw={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,200,200,0.75)', marginTop: 2, fontWeight: 400 }}>{s.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 4, background: '#ede8e8', borderRadius: 10, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        <button className={`tab-btn ${activeTab === 'plans' ? 'active' : ''}`} onClick={() => setActiveTab('plans')}>My Plans</button>
        <button className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Browse Services</button>
      </div>

      {/* ══ BROWSE SERVICES ══ */}
      {activeTab === 'services' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {SERVICE_CATEGORIES.map(cat => (
              <button key={cat.key} className={`cat-tab ${activeCategory === cat.key ? 'active' : ''}`} onClick={() => setActiveCategory(cat.key)}>
                <Ico d={cat.icon} size={12} sw={1.8} />{cat.label}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>{currentCat?.label}</h3>
              <p style={{ fontSize: 12, color: '#555', margin: '2px 0 0', fontWeight: 400 }}>{currentCat?.services.length} services available</p>
            </div>
            <div style={{ flex: 1, height: 1, background: '#e0dcdc' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }} className="cards-grid">
            {currentCat?.services.map(svc => {
              const isFeatured = svc.featured
              return (
                <div key={svc.id} className={`price-card ${isFeatured ? 'featured' : ''}`}>
                  <div style={{ padding: '20px 20px 16px', position: 'relative', background: isFeatured ? 'linear-gradient(135deg,#800000 0%,#b03030 100%)' : 'linear-gradient(135deg,#f8f5f5 0%,#f0ecec 100%)' }}>
                    {isFeatured && <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.22)', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.35)' }}>⭐ Popular</span>}
                    <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, background: isFeatured ? 'rgba(255,255,255,0.18)' : '#fff0f0', color: isFeatured ? '#fff' : '#800000', border: isFeatured ? '1px solid rgba(255,255,255,0.25)' : '1px solid #f0c8c8' }}>
                      <Ico d={svc.icon} size={18} sw={1.6} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35, whiteSpace: 'pre-line', color: isFeatured ? '#fff' : '#1a1a2e' }}>{svc.name}</div>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 14, marginBottom: 4, color: isFeatured ? 'rgba(255,220,220,0.9)' : '#666', fontWeight: 600 }}>{svc.tag}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                      <span style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, color: isFeatured ? '#fff' : '#800000', letterSpacing: '-0.02em' }}>{svc.priceLabel}</span>
                      <span style={{ fontSize: 12, color: isFeatured ? 'rgba(255,220,220,0.95)' : '#666', fontWeight: 400 }}>{svc.period}</span>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
                      {svc.inclusions.slice(0, 5).map(inc => (
                        <div key={inc} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#333', lineHeight: 1.45, fontWeight: 400 }}>
                          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff0f0', border: '1px solid #f0c8c8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                            <Ico d="M20 6L9 17l-5-5" size={8} sw={2.5} />
                          </div>
                          {inc}
                        </div>
                      ))}
                    </div>
                    {svc.note && <div style={{ fontSize: 11, color: '#666', fontStyle: 'italic', paddingTop: 8, borderTop: '1px solid #ede8e8', lineHeight: 1.45, fontWeight: 400 }}>{svc.note}</div>}
                    <button className={`gs-btn ${isFeatured ? 'gs-featured' : 'gs-plain'}`} onClick={() => openDetail(svc)}>
                      Get Started →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ══ MY PLANS ══ */}
      {activeTab === 'plans' && (
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none', display: 'flex' }}>
                <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={13} />
              </span>
              <input
                style={{ background: '#fff', border: '1.5px solid #d8d4d4', borderRadius: 8, padding: '8px 12px 8px 34px', fontSize: 13, color: '#1a1a2e', width: 220, outline: 'none', fontFamily: 'Poppins,sans-serif', fontWeight: 400 }}
                placeholder="Search plans..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {FILTER_CHIPS.map(f => (
              <button key={f.key} className={`chip ${filter === f.key ? 'on' : ''}`} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="s-table">
            <div className="s-thead">
              {['Plan', 'Status', 'Price', 'Renews / Due', 'Actions'].map((h, i) => (
                <div key={h} className="s-thead-cell" style={{ textAlign: i === 4 ? 'right' : 'left' }}>{h}</div>
              ))}
            </div>

            {GROUPS.map(g => {
              const rows = visible.filter(p => p.status === g.key)
              if (!rows.length) return null
              return (
                <div key={g.key}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px 6px' }}>
                    <span style={{ fontSize: 11, color: '#555', letterSpacing: '0.05em', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{g.label}</span>
                    <div style={{ flex: 1, height: 1, background: '#e8e4e4' }} />
                    <span style={{ fontSize: 11, color: '#666', background: '#f0edec', border: '1px solid #e0dcdc', borderRadius: 20, padding: '1px 8px', fontWeight: 500 }}>{rows.length}</span>
                  </div>

                  {rows.map(plan => {
                    const st  = STATUS_CFG[plan.status]
                    const exp = expandedId === plan.id
                    const renewEnabled = canRenew(plan)
                    const payEnabled   = canPay(plan)

                    return (
                      <div key={plan.id} style={{ borderBottom: '1px solid #f5f2f2' }}>
                        <div className="s-row" style={{ background: exp ? '#fffafa' : undefined }} onClick={() => setExpand(exp ? null : plan.id)}>

                          {/* Col 1: Plan */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: plan.bg, border: `1.5px solid ${plan.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: plan.color, fontWeight: 700, fontSize: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                              {plan.name[0]}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                                {plan.name}
                                {plan.isService && <span className="new-badge">New</span>}
                              </div>
                              <div style={{ fontSize: 11, color: '#666', marginTop: 1, fontWeight: 400 }}>{plan.tier}</div>
                            </div>
                          </div>

                          {/* Col 2: Status */}
                          <div>
                            <span className="status-badge" style={{ background: st.bg, color: st.color }}>
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
                              {st.label}
                            </span>
                            {plan.status !== 'ended' && plan.daysLeft !== null && (
                              <div style={{ fontSize: 11, marginTop: 3, color: plan.daysLeft <= 3 ? '#dc2626' : '#555', display: 'flex', alignItems: 'center', gap: 3, fontWeight: plan.daysLeft <= 3 ? 600 : 400 }}>
                                {plan.daysLeft <= 3
                                  ? <><Ico d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" size={9} sw={1.8} />{plan.daysLeft} days left</>
                                  : `Ends in ${plan.daysLeft} days`
                                }
                              </div>
                            )}
                          </div>

                          {/* Col 3: Price */}
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{plan.priceLabel}</div>
                            <div style={{ fontSize: 11, color: '#666', marginTop: 1, fontWeight: 400 }}>{plan.billing}</div>
                          </div>

                          {/* Col 4: Renews / Due */}
                          <div>
                            {plan.status === 'ended' ? (
                              <span style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>Not valid</span>
                            ) : (
                              <>
                                <div style={{ fontSize: 13, fontWeight: plan.daysLeft !== null && plan.daysLeft <= 3 ? 700 : 500, color: plan.daysLeft !== null && plan.daysLeft <= 3 ? '#dc2626' : '#1a1a2e' }}>
                                  {plan.renewDate}
                                </div>
                                {plan.daysLeft !== null && (
                                  <div style={{ fontSize: 11, color: '#666', marginTop: 1, fontWeight: 400 }}>
                                    {plan.daysLeft <= 3 ? 'Overdue' : `In ${plan.daysLeft} days`}
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {/* Col 5: Actions */}
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                            <button className={`act-btn ${renewEnabled ? '' : 'dim'}`} title={renewEnabled ? 'Renew plan' : 'Available within 3 days of expiry'} onClick={() => renewEnabled && openPlanModal('renew', plan)}>Renew</button>
                            {plan.status !== 'ended' && (
                              <button className={`act-btn ${payEnabled ? '' : 'dim'}`} onClick={() => payEnabled && openPlanModal('pay', plan)}>Pay</button>
                            )}
                            <button className="act-btn ghost" onClick={() => openPlanModal('edit', plan)}>Edit</button>
                            <button className="dots" onClick={e => { e.stopPropagation(); openPlanModal('dots', plan, (e.currentTarget as HTMLButtonElement).getBoundingClientRect()) }}>
                              <Ico d="M5 12h.01M12 12h.01M19 12h.01" size={13} sw={2.5} />
                            </button>
                          </div>
                        </div>

                        {/* Expanded row */}
                        {exp && (
                          <div className="s-expand">
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Included perks</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {plan.perks.map(perk => (
                                <span key={perk} className="perk-tag"><Ico d="M20 6L9 17l-5-5" size={9} sw={2} />{perk}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}

            {visible.length === 0 && (
              <div style={{ padding: '48px 20px', textAlign: 'center', color: '#666', fontSize: 13, fontWeight: 400 }}>No subscriptions found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}   