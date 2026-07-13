'use client'
import { useState, useEffect } from 'react'
import React from 'react'
import type { Plan, Service, Preferences } from './types'
import { Ico, S, GLOBAL_CSS } from './ui'
import { INITIAL_PLANS, SERVICE_CATEGORIES, STATUS_CFG, GROUPS, FILTER_CHIPS, START_OPTIONS, DURATION_OPTIONS } from './constants'
import { ServiceDetailModal, CustomizationModal, ConfirmModal, SuccessModal } from './ServiceFlowModals'
import { RenewModal, PayModal, EditModal, DotsMenu } from './PlanModals'

// ═══════════════════════════════════════════════════════════════════════════════
// ─── VA / HIRE FLOW TYPES ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
interface VA {
  id: string
  initials: string
  name: string
  role: string
  rating: number
  reviews: number
  available: boolean
  bio: string
  rate: number
  experience: number
  jobsCompleted: number
  avgResponse: string
  languages: string
  location: string
  timezone: string
  skills: string[]
  education: string
  portfolioItems: { title: string; desc: string; tag: string }[]
  workHistory: { client: string; role: string; duration: string; rating: number; review: string }[]
}

interface ProjectBrief {
  goals: string
  tools: string
  hoursPerWeek: string
  startDate: string
  budgetRange: string
  notes: string
}

interface HireDetails {
  message: string
  startDate: string
  contractType: string
}

type TimeSlot  = { time: string; available: boolean }
type Recording = { id: string; title: string; date: string; duration: string; thumbnail: string; status: 'completed' | 'upcoming' | 'missed' }
type Task      = { id: string; title: string; status: 'todo' | 'in-progress' | 'done'; priority: 'high' | 'medium' | 'low'; dueDate: string }
type Milestone = { id: string; title: string; dueDate: string; completed: boolean }
type HireMessage = { id: string; from: 'client' | 'va'; text: string; time: string }

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const MOCK_VAS: VA[] = [
  {
    id: 'ms', initials: 'MS', name: 'Maria Santos', role: 'Customer Service Specialist',
    rating: 4.9, reviews: 124, available: true,
    bio: 'Dedicated CSR with 5 years in SaaS and eCommerce support. Expert in de-escalation, CRM systems, and building customer loyalty through every interaction.',
    rate: 12, experience: 5, jobsCompleted: 89, avgResponse: '< 1 hr', languages: 'English, Filipino',
    location: 'Cebu, PH', timezone: 'PST (UTC+8)',
    skills: ['Zendesk', 'Freshdesk', 'HubSpot', 'Live Chat', 'Email Support', 'CRM', 'CSAT Reporting', 'Intercom'],
    education: 'BS Business Administration – University of San Carlos',
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
  {
    id: 'jr', initials: 'JR', name: 'James Reyes', role: 'Technical Support Engineer',
    rating: 4.8, reviews: 98, available: true,
    bio: 'Technical support pro with deep eCommerce and SaaS platform knowledge. Handles complex escalations with ease.',
    rate: 15, experience: 6, jobsCompleted: 63, avgResponse: '< 2 hrs', languages: 'English, Filipino',
    location: 'Manila, PH', timezone: 'PST (UTC+8)',
    skills: ['Tier 1–2 Support', 'API Troubleshooting', 'Shopify', 'SaaS Backends', 'Postman', 'SQL Basics', 'Jira', 'Confluence'],
    education: 'BS Computer Science – De La Salle University',
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
]

const HOURS_OPTIONS  = ['10 hrs / week', '20 hrs / week', '30 hrs / week', '40 hrs / week (Full-time)']
const BUDGET_OPTIONS = ['$500–$1,000 / mo', '$1,000–$2,000 / mo', '$2,000–$3,500 / mo', '$3,500+ / mo']
const CONTRACT_TYPES = ['Full-Time (40 hrs/wk)', 'Part-Time (20 hrs/wk)', 'Project-Based']
const HIRE_FLOW_STEPS = ['Services', 'Project Brief', 'Choose VA', 'VA Profile', 'Interview', 'Hire Request']

const TIME_SLOTS: TimeSlot[] = [
  { time: '8:00 AM',  available: true  },
  { time: '9:00 AM',  available: true  },
  { time: '10:00 AM', available: false },
  { time: '11:00 AM', available: true  },
  { time: '1:00 PM',  available: true  },
  { time: '2:00 PM',  available: false },
  { time: '3:00 PM',  available: true  },
  { time: '4:00 PM',  available: true  },
  { time: '5:00 PM',  available: false },
]

const MOCK_RECORDINGS: Recording[] = [
  { id: 'rec-001', title: 'Discovery Call',     date: 'Mar 10, 2025', duration: '32 min', thumbnail: 'MS', status: 'completed' },
  { id: 'rec-002', title: 'Final Interview',    date: 'Mar 14, 2025', duration: '48 min', thumbnail: 'JR', status: 'completed' },
  { id: 'rec-003', title: 'Introductory Call',  date: 'Mar 20, 2025', duration: '--',     thumbnail: 'AC', status: 'missed'    },
]

const REC_STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  completed: { bg: '#f0fdf4', color: '#16a34a', label: 'Completed' },
  upcoming:  { bg: '#eff6ff', color: '#2563eb', label: 'Upcoming'  },
  missed:    { bg: '#fef2f2', color: '#dc2626', label: 'Missed'    },
}

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Complete onboarding questionnaire',   status: 'done',        priority: 'high',   dueDate: 'Mar 12' },
  { id: 't2', title: 'Share brand kit & tone guidelines',   status: 'done',        priority: 'high',   dueDate: 'Mar 13' },
  { id: 't3', title: 'Set up communication channels',       status: 'in-progress', priority: 'medium', dueDate: 'Mar 15' },
  { id: 't4', title: 'Review and approve content calendar', status: 'in-progress', priority: 'high',   dueDate: 'Mar 18' },
  { id: 't5', title: 'First weekly performance report',     status: 'todo',        priority: 'medium', dueDate: 'Mar 22' },
  { id: 't6', title: 'Monthly strategy alignment call',     status: 'todo',        priority: 'low',    dueDate: 'Mar 31' },
]

const MILESTONES: Milestone[] = [
  { id: 'm1', title: 'Onboarding Complete',        dueDate: 'Mar 15', completed: true  },
  { id: 'm2', title: 'First Deliverable Submitted', dueDate: 'Mar 20', completed: false },
  { id: 'm3', title: '30-Day Review',               dueDate: 'Apr 10', completed: false },
  { id: 'm4', title: 'Contract Renewal Check',      dueDate: 'Apr 30', completed: false },
]

const MOCK_MESSAGES: HireMessage[] = [
  { id: 'msg1', from: 'va',     text: 'Hey! I reviewed your brief — looking forward to working with you.', time: '9:48 AM' },
  { id: 'msg2', from: 'client', text: 'Great, looking forward to it! Let me know if you need anything from our end.', time: '9:52 AM' },
  { id: 'msg3', from: 'va',     text: 'Will do! Also shared the brand tone document on Google Drive — please review when you can.', time: '10:02 AM' },
]

const TASK_STATUS_META = {
  'todo':        { label: 'To Do',       bg: '#f5f5f8', color: '#555',    border: '#e0dde8' },
  'in-progress': { label: 'In Progress', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'done':        { label: 'Done',        bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
}

const PRIORITY_META = {
  high:   { color: '#ef4444' },
  medium: { color: '#f59e0b' },
  low:    { color: '#22c55e' },
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── SHARED SUBCOMPONENTS ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function getCalendarDays() {
  const days = []
  const today = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      date: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      day: d.getDate(),
      isToday: i === 0,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    })
  }
  return days
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

const hireInputStyle: React.CSSProperties = {
  width: '100%', border: '1.5px solid #e0dcdc', borderRadius: 10,
  padding: '11px 14px', fontSize: 13, color: '#1a1a2e',
  outline: 'none', fontFamily: 'Poppins, sans-serif', fontWeight: 400,
  background: '#fff', boxSizing: 'border-box',
}
const hireSelectStyle: React.CSSProperties = {
  ...hireInputStyle, cursor: 'pointer',
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: 36,
}

function HireField({ label, children, half }: { label: string; children: React.ReactNode; half?: boolean }) {
  return (
    <div style={{ flex: half ? '1 1 calc(50% - 8px)' : '1 1 100%', minWidth: 0 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

function SideCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e0dcdc', borderRadius: 14, padding: '18px 20px', marginBottom: 14 }}>
      {children}
    </div>
  )
}

function PageLayout({ children, sidebar }: { children: React.ReactNode; sidebar?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      {sidebar && <div style={{ width: 284, flexShrink: 0 }}>{sidebar}</div>}
    </div>
  )
}

const hirePrimaryBtn: React.CSSProperties = {
  width: '100%', padding: '13px 0', background: 'linear-gradient(135deg,#800000,#a82020)',
  color: '#fff', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700,
  cursor: 'pointer', fontFamily: 'Poppins, sans-serif', letterSpacing: '0.01em',
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── HIRE FLOW PAGE COMPONENT ──────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function HireFlowPage({
  svc,
  onBack,
  onComplete,
}: {
  svc: Service
  onBack: () => void
  onComplete: () => void
}) {
  const [step, setStep]               = useState(1)
  const [brief, setBrief]             = useState<ProjectBrief>({ goals: '', tools: '', hoursPerWeek: HOURS_OPTIONS[1], startDate: '', budgetRange: '', notes: '' })
  const [selectedVA, setSelectedVA]   = useState<VA | null>(null)
  const [profileTab, setProfileTab]   = useState<'overview' | 'portfolio' | 'history'>('overview')
  const [hireDetails, setHireDetails] = useState<HireDetails>({ message: '', startDate: '', contractType: CONTRACT_TYPES[0] })
  const [vaSearch, setVaSearch]       = useState('')
  const [vaSort, setVaSort]           = useState<'top' | 'reviews' | 'rate'>('top')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [successCount, setSuccessCount]   = useState(3)

  const calDays = getCalendarDays()
  const [interviewView, setInterviewView]     = useState<'schedule' | 'recordings'>('schedule')
  const [selectedDay,   setSelectedDay]       = useState(calDays[1].date)
  const [selectedTime,  setSelectedTime]      = useState<string | null>(null)
  const [interviewBooked, setInterviewBooked] = useState(false)
  const [playingRecId,  setPlayingRecId]      = useState<string | null>(null)

  const [briefSubmitted, setBriefSubmitted] = useState(false)
  const [tasks, setTasks]                   = useState<Task[]>(INITIAL_TASKS)
  const [projectTab, setProjectTab]         = useState<'tasks' | 'milestones' | 'messages'>('tasks')
  const [msgInput, setMsgInput]             = useState('')
  const [messages, setMessages]             = useState<HireMessage[]>(MOCK_MESSAGES)

  const va = selectedVA

  useEffect(() => {
    if (step !== 6) return
    setSuccessCount(3)
    const iv = setInterval(() => setSuccessCount(c => Math.max(0, c - 1)), 1000)
    const to = setTimeout(onComplete, 3200)
    return () => { clearInterval(iv); clearTimeout(to) }
  }, [step, onComplete])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const filteredVAs = MOCK_VAS
    .filter(v => !availableOnly || v.available)
    .filter(v => !vaSearch || v.name.toLowerCase().includes(vaSearch.toLowerCase()) || v.role.toLowerCase().includes(vaSearch.toLowerCase()))
    .sort((a, b) => vaSort === 'top' ? b.rating - a.rating : vaSort === 'reviews' ? b.reviews - a.reviews : a.rate - b.rate)

  const doneCount  = tasks.filter(t => t.status === 'done').length
  const totalTasks = tasks.length
  const progress   = Math.round((doneCount / totalTasks) * 100)

  const cycleStatus = (task: Task) => {
    const next: Record<Task['status'], Task['status']> = { 'todo': 'in-progress', 'in-progress': 'done', 'done': 'todo' }
    setTasks(ts => ts.map(t => t.id === task.id ? { ...t, status: next[t.status] } : t))
  }

  const sendMessage = () => {
    if (!msgInput.trim()) return
    setMessages(m => [...m, { id: `msg${Date.now()}`, from: 'client', text: msgInput.trim(), time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }])
    setMsgInput('')
  }

  // ── Page header ────────────────────────────────────────────────────────────
  const stepTitles = ['', 'Project Brief', 'Choose a VA', 'VA Profile', 'Interview', 'Hire Request', 'Done']
  const stepDescs  = ['', 'Tell us about your project so we can find the best match.', 'Browse and select from our qualified virtual assistants.', 'Review the complete profile before scheduling.', 'Schedule or review interview recordings.', 'Send your official hire request.', '']

  const renderPageHeader = () => (
    <div style={{ marginBottom: 28 }}>
      {step < 6 && (
        <button
          onClick={step === 1 ? onBack : () => setStep(s => s - 1)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 12, fontWeight: 500, marginBottom: 14, padding: 0, fontFamily: 'Poppins, sans-serif' }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          {step === 1 ? 'Back to Services' : `Back to ${HIRE_FLOW_STEPS[step - 2]}`}
        </button>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#800000', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Hire Flow · Step {Math.min(step, 6)} of 6
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em', fontFamily: 'Poppins, sans-serif' }}>
            {stepTitles[step]}
          </h2>
          {stepDescs[step] && (
            <p style={{ fontSize: 13, color: '#777', margin: '4px 0 0', lineHeight: 1.6, fontFamily: 'Poppins, sans-serif' }}>
              {stepDescs[step]}{step <= 2 && <> <span style={{ color: '#800000', fontWeight: 600 }}>{svc.name.replace('\n', ' ')}</span></>}
            </p>
          )}
        </div>
        <div style={{ background: '#fff', border: '1px solid #e8e4e4', borderRadius: 10, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#800000', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>{svc.name.replace('\n', ' ')}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#800000', marginLeft: 4 }}>{svc.priceLabel}</span>
        </div>
      </div>
      {/* Step progress bar */}
      <div style={{ display: 'flex', gap: 0 }}>
        {HIRE_FLOW_STEPS.map((label, i) => (
          <div key={label} style={{ flex: 1, cursor: i < step - 1 ? 'pointer' : 'default' }} onClick={() => i < step - 1 && setStep(i + 1)}>
            <div style={{ height: 3, borderRadius: 2, background: i <= step - 1 ? '#800000' : '#e0dcdc', marginBottom: 6, transition: 'background 0.3s' }} />
            <div style={{ fontSize: 10, fontWeight: i <= step - 1 ? 700 : 400, color: i <= step - 1 ? '#800000' : '#aaa', whiteSpace: 'nowrap', letterSpacing: '0.01em' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )

  // ── STEP 1: Project Brief ──────────────────────────────────────────────────
  const renderBrief = () => (
    <PageLayout sidebar={
      <>
        <SideCard>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#800000', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Selected Service</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{svc.name.replace('\n', ' ')}</div>
          <div style={{ fontSize: 13, color: '#666' }}>{svc.priceLabel} {svc.period}</div>
        </SideCard>
        <SideCard>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#800000', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Why This Matters</div>
          {['We use your brief to match you with the most qualified VA', 'Your VA reviews this before the interview', 'Helps set clear expectations from day 1'].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: 12, color: '#444', lineHeight: 1.5 }}>
              <span style={{ color: '#800000', marginTop: 1 }}>•</span>{t}
            </div>
          ))}
        </SideCard>
        <button onClick={() => { if (brief.goals) setStep(2) }} style={{ ...hirePrimaryBtn, opacity: brief.goals ? 1 : 0.4, cursor: brief.goals ? 'pointer' : 'not-allowed' }}>
          Find My VA →
        </button>
      </>
    }>
      <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 14, padding: '26px 28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          <HireField label="Project Goals *">
            <textarea value={brief.goals} onChange={e => setBrief({ ...brief, goals: e.target.value })} placeholder="What do you want to achieve? (e.g. Grow Instagram by 20%, reduce support tickets by 30%)" style={{ ...hireInputStyle, resize: 'vertical', minHeight: 100 } as React.CSSProperties} />
          </HireField>
          <HireField label="Tools / Platforms Used" half>
            <input value={brief.tools} onChange={e => setBrief({ ...brief, tools: e.target.value })} placeholder="e.g. HubSpot, Canva, Notion" style={hireInputStyle} />
          </HireField>
          <HireField label="Hours / Week" half>
            <select value={brief.hoursPerWeek} onChange={e => setBrief({ ...brief, hoursPerWeek: e.target.value })} style={hireSelectStyle}>
              {HOURS_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </HireField>
          <HireField label="Preferred Start Date" half>
            <input type="date" value={brief.startDate} onChange={e => setBrief({ ...brief, startDate: e.target.value })} style={hireInputStyle} />
          </HireField>
          <HireField label="Monthly Budget Range" half>
            <select value={brief.budgetRange} onChange={e => setBrief({ ...brief, budgetRange: e.target.value })} style={hireSelectStyle}>
              <option value="">Select range</option>
              {BUDGET_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </HireField>
          <HireField label="Additional Notes">
            <textarea value={brief.notes} onChange={e => setBrief({ ...brief, notes: e.target.value })} placeholder="Any specific instructions, brand guidelines, or expectations for your VA." style={{ ...hireInputStyle, resize: 'vertical', minHeight: 80 } as React.CSSProperties} />
          </HireField>
        </div>
      </div>
    </PageLayout>
  )

  // ── STEP 2: Choose VA ──────────────────────────────────────────────────────
  const renderChooseVA = () => (
    <PageLayout>
      <div style={{ background: '#fffbf0', border: '1px solid #f0d8a0', borderRadius: 12, padding: '12px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#555', minWidth: 0 }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <strong>Your Brief:</strong> {brief.goals.slice(0, 80)}{brief.goals.length > 80 ? '…' : ''}
          </span>
        </div>
        <span style={{ background: '#fef3c7', color: '#b45309', borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{brief.hoursPerWeek.replace(' / week', '/wk')}</span>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none', display: 'flex' }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </div>
          <input value={vaSearch} onChange={e => setVaSearch(e.target.value)} placeholder="Search by name or role..." style={{ ...hireInputStyle, paddingLeft: 34 }} />
        </div>
        {(['top', 'reviews', 'rate'] as const).map((s, i) => (
          <button key={s} onClick={() => setVaSort(s)} style={{ background: vaSort === s ? '#800000' : '#fff', color: vaSort === s ? '#fff' : '#444', border: `1.5px solid ${vaSort === s ? '#800000' : '#d8d4d4'}`, borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap' }}>
            {['Top Rated', 'Most Reviews', 'Lowest Rate'][i]}
          </button>
        ))}
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#444', cursor: 'pointer', fontWeight: 400, whiteSpace: 'nowrap' }}>
          <div onClick={() => setAvailableOnly(!availableOnly)} style={{ width: 36, height: 20, borderRadius: 10, background: availableOnly ? '#800000' : '#ddd', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 2, left: availableOnly ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
          </div>
          Available only
        </label>
      </div>

      <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>Showing <strong>{filteredVAs.length}</strong> VAs</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filteredVAs.map(v => (
          <div key={v.id} onClick={() => { setSelectedVA(v); setProfileTab('overview'); setStep(3) }}
            style={{ background: '#fff', border: `1.5px solid ${selectedVA?.id === v.id ? '#800000' : '#e0dcdc'}`, borderRadius: 14, padding: '20px 22px', cursor: 'pointer', transition: 'all 0.18s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = '#c08080'; el.style.boxShadow = '0 6px 20px rgba(128,0,0,0.1)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = selectedVA?.id === v.id ? '#800000' : '#e0dcdc'; el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: 'linear-gradient(135deg,#800000,#a82020)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15, fontWeight: 700 }}>{v.initials}</div>
                {v.available && <div style={{ position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, borderRadius: '50%', background: '#22c55e', border: '2px solid #fff' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{v.name}</div>
                  {v.available && <span style={{ background: '#dcfce7', color: '#15803d', borderRadius: 5, padding: '1px 7px', fontSize: 10, fontWeight: 600 }}>Available</span>}
                </div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{v.role}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
                  <Stars rating={v.rating} size={11} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>{v.rating}</span>
                  <span style={{ fontSize: 11, color: '#888' }}>({v.reviews})</span>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#555', lineHeight: 1.6, marginBottom: 10 }}>{v.bio.slice(0, 90)}…</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
              {v.skills.slice(0, 4).map(s => (
                <span key={s} style={{ background: '#f8f6f6', border: '1px solid #e0dcdc', borderRadius: 6, padding: '3px 9px', fontSize: 10, color: '#444' }}>{s}</span>
              ))}
              {v.skills.length > 4 && <span style={{ fontSize: 10, color: '#aaa', padding: '3px 6px' }}>+{v.skills.length - 4} more</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #f0eeee' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#800000' }}>${v.rate}/hr</span>
              <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#888' }}>
                <span>{v.experience} yrs exp</span><span>·</span><span>{v.jobsCompleted} jobs</span>
              </div>
            </div>
          </div>
        ))}
        {filteredVAs.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: '#888', fontSize: 13 }}>No VAs match your filters.</div>
        )}
      </div>
    </PageLayout>
  )

  // ── STEP 3: VA Profile ────────────────────────────────────────────────────
  const renderVAProfile = () => {
    if (!va) return null
    const hoursNum   = parseInt(brief.hoursPerWeek) || 20
    const monthlyEst = va.rate * hoursNum * 4

    return (
      <PageLayout sidebar={
        <>
          <SideCard>
            <div style={{ fontSize: 10, color: '#888', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Hourly Rate</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: '#800000', letterSpacing: '-0.02em' }}>${va.rate}</span>
              <span style={{ fontSize: 12, color: '#888' }}>/hr</span>
            </div>
            {[['Experience', `${va.experience} yrs`], ['Jobs Completed', String(va.jobsCompleted)], ['Avg. Response', va.avgResponse], ['Languages', va.languages], ['Est. Monthly', `$${monthlyEst.toLocaleString()}`]].map(([k, val]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderTop: '1px solid #f5f2f2', fontSize: 12 }}>
                <span style={{ color: '#666' }}>{k}</span>
                <span style={{ fontWeight: 600, color: k === 'Est. Monthly' ? '#800000' : '#1a1a2e', textAlign: 'right', maxWidth: 140, wordBreak: 'break-word' }}>{val}</span>
              </div>
            ))}
          </SideCard>
          <button onClick={() => setStep(4)} style={{ ...hirePrimaryBtn, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.889L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Schedule Interview
          </button>
          <div style={{ fontSize: 11, color: '#888', textAlign: 'center', lineHeight: 1.5, marginBottom: 14 }}>Schedule or view pre-recorded interview</div>
          <SideCard>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#800000', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Selected Service</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{svc.name.replace('\n', ' ')}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{svc.priceLabel} {svc.period}</div>
          </SideCard>
        </>
      }>
        <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 14, padding: '24px 26px', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg,#800000,#a82020)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>{va.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', marginBottom: 2 }}>{va.name}</div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{va.role}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <Stars rating={va.rating} size={13} />
                <span style={{ fontSize: 13, fontWeight: 700 }}>{va.rating}</span>
                <span style={{ fontSize: 12, color: '#888' }}>({va.reviews} reviews)</span>
                {va.available && <span style={{ background: '#dcfce7', color: '#15803d', borderRadius: 6, padding: '2px 10px', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />Available</span>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {[['LOCATION', va.location], ['TIMEZONE', va.timezone], ['LANGUAGES', va.languages], ['EXPERIENCE', `${va.experience} yrs`]].map(([k, val]) => (
              <div key={k} style={{ background: '#f8f6f6', border: '1px solid #e8e4e4', borderRadius: 8, padding: '6px 12px' }}>
                <div style={{ fontSize: 9, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e' }}>{val}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: '#444', lineHeight: 1.7, margin: 0 }}>{va.bio}</p>
        </div>
        <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e8e4e4' }}>
            {(['overview', 'portfolio', 'history'] as const).map((tab, i) => (
              <button key={tab} onClick={() => setProfileTab(tab)} style={{ flex: 1, padding: '13px', background: profileTab === tab ? '#800000' : 'transparent', color: profileTab === tab ? '#fff' : '#555', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'Poppins, sans-serif', borderRight: i < 2 ? '1px solid #e8e4e4' : 'none', transition: 'all 0.15s' }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ padding: '22px 24px' }}>
            {profileTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Skills &amp; Expertise</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {va.skills.map(s => <span key={s} style={{ background: '#f8f6f6', border: '1px solid #e0dcdc', borderRadius: 7, padding: '5px 12px', fontSize: 12, color: '#333' }}>{s}</span>)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Education</div>
                  <div style={{ fontSize: 13, color: '#444' }}>{va.education}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[{ label: 'Jobs Completed', value: String(va.jobsCompleted), icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }, { label: 'Avg. Response', value: va.avgResponse, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }, { label: 'Hourly Rate', value: `$${va.rate}/hr`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }].map(stat => (
                    <div key={stat.label} style={{ background: '#f8f6f6', border: '1px solid #e8e4e4', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px', display: 'block' }}><path d={stat.icon}/></svg>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 3 }}>{stat.value}</div>
                      <div style={{ fontSize: 10, color: '#888', fontWeight: 500 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {profileTab === 'portfolio' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {va.portfolioItems.map((item, i) => (
                  <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: '#faf9f9', border: '1px solid #f0edec', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: '#fff0f0', border: '1px solid #f0c0c0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{item.title}</span>
                        <span style={{ fontSize: 9, background: '#800000', color: '#fff', borderRadius: 4, padding: '2px 7px', fontWeight: 700, letterSpacing: '0.05em' }}>{item.tag}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#666', margin: 0, lineHeight: 1.55 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {profileTab === 'history' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {va.workHistory.map((h, i) => (
                  <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: '#faf9f9', border: '1px solid #f0edec' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{h.client}</span>
                        <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>· {h.role} · {h.duration}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Stars rating={h.rating} size={11} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#1a1a2e' }}>{h.rating}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: '#666', fontStyle: 'italic', margin: 0, lineHeight: 1.55 }}>"{h.review}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageLayout>
    )
  }

  // ── STEP 4: Interview ──────────────────────────────────────────────────────
  const renderInterview = () => {
    if (!va) return null
    return (
      <PageLayout sidebar={
        !interviewBooked ? (
          <SideCard>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Summary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              {[{ label: 'VA', value: va.name }, { label: 'Type', value: 'Discovery Call' }, { label: 'Duration', value: '30 minutes' }, { label: 'Format', value: 'Google Meet / Zoom' }, { label: 'Date', value: selectedDay ? new Date(selectedDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—' }, { label: 'Time', value: selectedTime ?? '—' }].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#aaa' }}>{s.label}</span>
                  <span style={{ color: '#1a1a2e', fontWeight: 600, textAlign: 'right', maxWidth: 130 }}>{s.value}</span>
                </div>
              ))}
            </div>
            <button disabled={!selectedTime} onClick={() => { if (selectedTime) setInterviewBooked(true) }}
              style={{ width: '100%', padding: '11px 0', background: selectedTime ? '#800000' : '#f0edec', color: selectedTime ? '#fff' : '#ccc', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: 'Poppins, sans-serif', cursor: selectedTime ? 'pointer' : 'not-allowed', transition: 'background 0.15s' }}>
              Confirm Interview
            </button>
            <div style={{ textAlign: 'center', fontSize: 10, color: '#bbb', marginTop: 8 }}>A calendar invite will be sent to your email.</div>
          </SideCard>
        ) : (
          <SideCard>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#800000', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Interview Chapters</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[{ n: 1, title: 'Intro & Motivation', start: '0:00', active: true }, { n: 2, title: 'Experience', start: '1:38', active: false }, { n: 3, title: 'Skills Deep Dive', start: '3:30', active: false }, { n: 4, title: 'Availability & Rate', start: '4:55', active: false }].map(ch => (
                <div key={ch.n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: ch.active ? '#fff5f5' : 'transparent', border: `1.5px solid ${ch.active ? '#800000' : '#e8e4e4'}`, cursor: 'pointer' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: ch.active ? '#800000' : '#f0eeee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {ch.active ? <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M10 9v6m4-6v6"/></svg> : <span style={{ fontSize: 11, fontWeight: 700, color: '#888' }}>{ch.n}</span>}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: ch.active ? '#800000' : '#333' }}>{ch.title}</div>
                    <div style={{ fontSize: 10, color: '#888' }}>Starts at {ch.start}</div>
                  </div>
                </div>
              ))}
            </div>
          </SideCard>
        )
      }>
        <div style={{ display: 'inline-flex', background: '#f5f3f3', borderRadius: 10, padding: 4, gap: 2, marginBottom: 24, border: '1px solid #ece8e8' }}>
          {(['schedule', 'recordings'] as const).map((view, idx) => (
            <button key={view} onClick={() => setInterviewView(view)} style={{ border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 12, fontFamily: 'Poppins, sans-serif', fontWeight: 500, cursor: 'pointer', background: interviewView === view ? '#800000' : 'transparent', color: interviewView === view ? '#fff' : '#888', transition: 'all 0.15s' }}>
              {idx === 0 ? '📅 Schedule Interview' : `🎥 Recordings (${MOCK_RECORDINGS.length})`}
            </button>
          ))}
        </div>

        {interviewView === 'schedule' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {interviewBooked ? (
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0edec', padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px', fontFamily: 'Poppins, sans-serif' }}>Interview Scheduled!</h3>
                <p style={{ fontSize: 13, color: '#666', margin: '0 0 6px', fontFamily: 'Poppins, sans-serif' }}>Your discovery call has been booked for</p>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#800000', fontFamily: 'Poppins, sans-serif', marginBottom: 28 }}>
                  {new Date(selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button onClick={() => { setInterviewBooked(false); setSelectedTime(null) }} style={{ padding: '10px 20px', background: '#f5f3f3', color: '#444', border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 600, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>Reschedule</button>
                  <button onClick={() => setStep(5)} style={{ padding: '10px 24px', background: '#800000', color: '#fff', border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 600, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>Proceed to Hire →</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0edec', padding: '22px 24px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 14 }}>Select a Date</div>
                  <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                    {calDays.map(d => (
                      <button key={d.date} disabled={d.isWeekend} onClick={() => { setSelectedDay(d.date); setSelectedTime(null) }}
                        style={{ border: `1.5px solid ${selectedDay === d.date ? '#800000' : '#e8e4e4'}`, borderRadius: 10, padding: '8px 6px', textAlign: 'center', cursor: d.isWeekend ? 'not-allowed' : 'pointer', background: selectedDay === d.date ? '#800000' : '#fff', minWidth: 52, transition: 'all 0.15s', opacity: d.isWeekend ? 0.4 : 1 }}>
                        <div style={{ fontSize: 9, fontWeight: 600, color: selectedDay === d.date ? 'rgba(255,255,255,0.8)' : '#aaa', textTransform: 'uppercase', marginBottom: 3 }}>{d.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: selectedDay === d.date ? '#fff' : d.isToday ? '#800000' : '#1a1a2e' }}>{d.day}</div>
                        {d.isToday && selectedDay !== d.date && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#800000', margin: '3px auto 0' }} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0edec', padding: '22px 24px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 14 }}>
                    Available Times <span style={{ fontSize: 11, fontWeight: 400, color: '#aaa', marginLeft: 6 }}>{new Date(selectedDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {TIME_SLOTS.map(slot => (
                      <button key={slot.time} disabled={!slot.available} onClick={() => setSelectedTime(slot.time)}
                        style={{ border: `1.5px solid ${selectedTime === slot.time ? '#800000' : slot.available ? '#e8e4e4' : '#f0edec'}`, borderRadius: 8, padding: '10px 0', fontSize: 12, fontFamily: 'Poppins, sans-serif', fontWeight: 500, background: selectedTime === slot.time ? '#800000' : slot.available ? '#fff' : '#f5f3f3', color: selectedTime === slot.time ? '#fff' : slot.available ? '#444' : '#ccc', cursor: slot.available ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}>
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {interviewView === 'recordings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 14, padding: '22px 24px', marginBottom: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Pre-Recorded Interview — Now Playing</div>
              <div style={{ background: 'linear-gradient(135deg,#2d0000,#1a0000)', borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M5 3l14 9-14 9V3z"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Discovery Call — {va.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,200,200,0.7)', marginTop: 3 }}>Mar 10, 2025 · 8:42</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 40, marginBottom: 10 }}>
                  {Array.from({ length: 58 }).map((_, i) => (
                    <div key={i} style={{ flex: 1, background: i < 15 ? '#c04040' : 'rgba(255,255,255,0.2)', borderRadius: 2, height: `${22 + Math.sin(i * 0.6) * 14 + (i % 3) * 4}%`, minHeight: 4 }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,200,200,0.6)' }}>
                  <span>0:00</span><span>8:42</span>
                </div>
              </div>
            </div>
            {MOCK_RECORDINGS.map(rec => {
              const st = REC_STATUS_STYLE[rec.status]
              const isPlaying = playingRecId === rec.id
              return (
                <div key={rec.id} style={{ background: '#fff', border: '1px solid #f0edec', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg,#800000,#c05050)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: rec.status === 'completed' ? 'pointer' : 'default', position: 'relative', overflow: 'hidden' }}
                    onClick={() => rec.status === 'completed' && setPlayingRecId(isPlaying ? null : rec.id)}>
                    <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{rec.thumbnail}</span>
                    {rec.status === 'completed' && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isPlaying ? <svg width={18} height={18} viewBox="0 0 24 24" fill="#fff" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg> : <svg width={18} height={18} viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M8 5v14l11-7z"/></svg>}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rec.title} — {va.name}</div>
                    <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#aaa' }}><span>{rec.date}</span><span>·</span><span>{rec.duration}</span></div>
                    {isPlaying && <div style={{ marginTop: 6, fontSize: 11, color: '#800000', fontWeight: 500 }}>▶ Playing recording…</div>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, background: st.bg, color: st.color, borderRadius: 20, padding: '3px 10px' }}>{st.label}</span>
                    {rec.status === 'completed' && (
                      <button style={{ background: 'none', border: '1px solid #e0dcdc', borderRadius: 7, padding: '5px 10px', fontSize: 11, color: '#555', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        Download
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={() => setStep(5)} style={{ padding: '12px 28px', background: '#800000', color: '#fff', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>
                Proceed to Hire Request →
              </button>
            </div>
          </div>
        )}
      </PageLayout>
    )
  }

  // ── STEP 5: Hire Request ──────────────────────────────────────────────────
  const renderHireRequest = () => {
    if (!va) return null
    const hoursNum   = parseInt(brief.hoursPerWeek) || 20
    const weeklyRate = va.rate * hoursNum
    const monthlyEst = weeklyRate * 4
    const canSubmit  = hireDetails.message.trim() && hireDetails.startDate

    return (
      <PageLayout sidebar={
        <>
          <SideCard>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Cost Estimate</div>
            {[['VA Rate', `$${va.rate}/hr`], [`${hoursNum} hrs/week`, `$${weeklyRate}/wk`], ['Est. Monthly', `$${monthlyEst.toLocaleString()}/mo`]].map(([k, val]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12 }}>
                <span style={{ color: '#666' }}>{k}</span>
                <span style={{ fontWeight: 500, color: '#1a1a2e' }}>{val}</span>
              </div>
            ))}
            <div style={{ borderTop: '1.5px solid #e0dcdc', paddingTop: 10, marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#800000' }}>Total / Month</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: '#800000' }}>${monthlyEst.toLocaleString()}</span>
            </div>
            <div style={{ background: '#fffbf0', border: '1px solid #f0d8a0', borderRadius: 10, padding: '10px 12px', marginTop: 12, fontSize: 11, color: '#7a5a20', lineHeight: 1.6 }}>
              💡 Payment only processed after VA accepts. No charge until both parties agree.
            </div>
          </SideCard>
          <button onClick={() => { if (canSubmit) setStep(6) }} style={{ ...hirePrimaryBtn, opacity: canSubmit ? 1 : 0.45, cursor: canSubmit ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            🚀 Send Hire Request
          </button>
          <div style={{ fontSize: 11, color: '#888', textAlign: 'center', marginTop: 8, lineHeight: 1.5 }}>
            {va.name.split(' ')[0]} will be notified immediately and has 48 hrs to respond.
          </div>
        </>
      }>
        {/* VA summary */}
        <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 14, padding: '20px 24px', marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#800000', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>You're Hiring</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#800000,#a82020)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>{va.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>{va.name}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{va.role}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <Stars rating={va.rating} size={12} />
                <span style={{ fontSize: 12, fontWeight: 700 }}>{va.rating}</span>
                {va.available && <span style={{ background: '#dcfce7', color: '#15803d', borderRadius: 5, padding: '1px 7px', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />Available</span>}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#800000' }}>${va.rate}</div>
              <div style={{ fontSize: 11, color: '#888' }}>per hour</div>
            </div>
          </div>
        </div>

        {/* Project brief */}
        {!briefSubmitted ? (
          <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 14, padding: '22px 24px', marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Project Brief</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 18 }}>Help <strong style={{ color: '#800000' }}>{va.name.split(' ')[0]}</strong> understand your goals for <strong style={{ color: '#800000' }}>{svc.name.replace('\n', ' ')}</strong>.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <HireField label="Project Goals *">
                <textarea rows={3} value={brief.goals} onChange={e => setBrief({ ...brief, goals: e.target.value })} placeholder="What do you want to achieve?" style={{ ...hireInputStyle, resize: 'none' } as React.CSSProperties} />
              </HireField>
              <div style={{ display: 'flex', gap: 14 }}>
                <HireField label="Tools / Platforms" half>
                  <input value={brief.tools} onChange={e => setBrief({ ...brief, tools: e.target.value })} placeholder="e.g. HubSpot, Canva" style={hireInputStyle} />
                </HireField>
                <HireField label="Hours / Week" half>
                  <select value={brief.hoursPerWeek} onChange={e => setBrief({ ...brief, hoursPerWeek: e.target.value })} style={hireSelectStyle}>
                    {HOURS_OPTIONS.map(h => <option key={h}>{h}</option>)}
                  </select>
                </HireField>
              </div>
              <HireField label="Additional Notes">
                <textarea rows={2} value={brief.notes} onChange={e => setBrief({ ...brief, notes: e.target.value })} placeholder="Any specific instructions or preferences." style={{ ...hireInputStyle, resize: 'none' } as React.CSSProperties} />
              </HireField>
            </div>
            <button onClick={() => { if (brief.goals.trim()) setBriefSubmitted(true) }} disabled={!brief.goals.trim()} style={{ marginTop: 16, width: '100%', padding: '11px 0', background: brief.goals.trim() ? '#1a1a2e' : '#f0edec', color: brief.goals.trim() ? '#fff' : '#ccc', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: 'Poppins, sans-serif', cursor: brief.goals.trim() ? 'pointer' : 'not-allowed' }}>
              Save Project Brief ✓
            </button>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 14, padding: '20px 24px', marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Project Kickoff Preview</div>
              <button onClick={() => setBriefSubmitted(false)} style={{ background: 'none', border: '1px solid #e0dcdc', borderRadius: 7, padding: '4px 10px', fontSize: 11, color: '#666', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>Edit Brief</button>
            </div>
            <div style={{ background: 'linear-gradient(135deg,#800000,#b03030)', borderRadius: 12, padding: '16px 20px', marginBottom: 14, color: '#fff' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,220,220,0.8)', marginBottom: 8 }}>Overall Progress</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{progress}% Complete</span>
                <span style={{ fontSize: 11, color: 'rgba(255,210,210,0.8)' }}>{doneCount}/{totalTasks} tasks done</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.2)', borderRadius: 10 }}>
                <div style={{ height: '100%', width: `${progress}%`, background: '#fff', borderRadius: 10 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 14, background: '#f5f3f3', borderRadius: 9, padding: 3 }}>
              {(['tasks', 'milestones', 'messages'] as const).map(t => (
                <button key={t} onClick={() => setProjectTab(t)} style={{ flex: 1, border: 'none', borderRadius: 7, padding: '7px', fontSize: 11, fontFamily: 'Poppins, sans-serif', fontWeight: 600, cursor: 'pointer', background: projectTab === t ? '#800000' : 'transparent', color: projectTab === t ? '#fff' : '#888', transition: 'all 0.15s' }}>
                  {t === 'tasks' ? `Tasks (${totalTasks})` : t === 'milestones' ? 'Milestones' : 'Messages'}
                </button>
              ))}
            </div>
            {projectTab === 'tasks' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {tasks.slice(0, 4).map(task => {
                  const st = TASK_STATUS_META[task.status]
                  const pr = PRIORITY_META[task.priority]
                  return (
                    <div key={task.id} onClick={() => cycleStatus(task)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 9, border: '1px solid #f0edec', background: '#fff', cursor: 'pointer' }}>
                      <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${task.status === 'done' ? '#16a34a' : '#d0ccc8'}`, background: task.status === 'done' ? '#16a34a' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {task.status === 'done' && <svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
                      </div>
                      <span style={{ flex: 1, fontSize: 12, color: task.status === 'done' ? '#aaa' : '#1a1a2e', textDecoration: task.status === 'done' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: pr.color, display: 'block' }} />
                        <span style={{ fontSize: 10, fontWeight: 600, background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 5, padding: '1px 6px' }}>{st.label}</span>
                      </div>
                    </div>
                  )
                })}
                {tasks.length > 4 && <div style={{ fontSize: 11, color: '#aaa', textAlign: 'center', padding: '4px 0' }}>+{tasks.length - 4} more tasks after onboarding</div>}
                <div style={{ fontSize: 10, color: '#bbb', textAlign: 'center' }}>Click any task to cycle its status</div>
              </div>
            )}
            {projectTab === 'milestones' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MILESTONES.map((m, i) => (
                  <div key={m.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', borderRadius: 9, border: `1px solid ${m.completed ? '#bbf7d0' : '#f0edec'}`, background: m.completed ? '#f0fdf4' : '#fff' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: m.completed ? '#16a34a' : '#f0edec', border: `2px solid ${m.completed ? '#16a34a' : '#e0dcdc'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {m.completed ? <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> : <span style={{ fontSize: 8, fontWeight: 700, color: '#aaa' }}>{i + 1}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: m.completed ? '#16a34a' : '#1a1a2e' }}>{m.title}</div>
                      <div style={{ fontSize: 10, color: '#aaa', marginTop: 1 }}>Due {m.dueDate}</div>
                    </div>
                    {m.completed && <span style={{ fontSize: 10, fontWeight: 600, color: '#16a34a' }}>✓ Done</span>}
                  </div>
                ))}
              </div>
            )}
            {projectTab === 'messages' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: 260 }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 8 }}>
                  {messages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'client' ? 'flex-end' : 'flex-start', gap: 3 }}>
                      <div style={{ borderRadius: msg.from === 'va' ? '12px 12px 12px 3px' : '12px 12px 3px 12px', padding: '8px 12px', background: msg.from === 'va' ? '#f5f3f3' : '#800000', maxWidth: '75%' }}>
                        <p style={{ margin: 0, fontSize: 12, color: msg.from === 'va' ? '#333' : '#fff', lineHeight: 1.5 }}>{msg.text}</p>
                      </div>
                      <span style={{ fontSize: 10, color: '#bbb' }}>{msg.time}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 7, paddingTop: 8, borderTop: '1px solid #f5f2f2' }}>
                  <input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Message your VA..." style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #e8e4e4', borderRadius: 8, fontSize: 12, fontFamily: 'Poppins, sans-serif', outline: 'none', background: '#faf9f9', color: '#333' }} />
                  <button onClick={sendMessage} style={{ background: '#800000', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Engagement details */}
        <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 14, padding: '22px 24px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 20 }}>Engagement Details</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <HireField label={`Message to ${va.name.split(' ')[0]} *`}>
              <textarea value={hireDetails.message} onChange={e => setHireDetails({ ...hireDetails, message: e.target.value })} placeholder={`Hi ${va.name.split(' ')[0]}, I'd like to hire you for ${svc.name.replace('\n', ' ')}...`} style={{ ...hireInputStyle, resize: 'vertical', minHeight: 100 } as React.CSSProperties} />
            </HireField>
            <HireField label="Proposed Start Date *" half>
              <input type="date" value={hireDetails.startDate} onChange={e => setHireDetails({ ...hireDetails, startDate: e.target.value })} style={hireInputStyle} />
            </HireField>
            <HireField label="Contract Type" half>
              <select value={hireDetails.contractType} onChange={e => setHireDetails({ ...hireDetails, contractType: e.target.value })} style={hireSelectStyle}>
                {CONTRACT_TYPES.map(o => <option key={o}>{o}</option>)}
              </select>
            </HireField>
          </div>
        </div>
      </PageLayout>
    )
  }

  // ── STEP 6: Success ────────────────────────────────────────────────────────
  const renderSuccess = () => (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <style>{`
        @keyframes hrScaleIn{0%{transform:scale(0.3);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
        @keyframes hrRingOut{0%{transform:scale(1);opacity:0.7}100%{transform:scale(1.8);opacity:0}}
        @keyframes hrFadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .hr-check{animation:hrScaleIn 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards}
        .hr-ring{position:absolute;inset:0;border-radius:50%;border:2px solid #800000;animation:hrRingOut 1.4s ease-out infinite}
        .hr-ring2{animation-delay:0.5s}
        .hr-fade{animation:hrFadeUp 0.4s ease 0.3s both}
      `}</style>
      <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 24px' }}>
        <div className="hr-ring" /><div className="hr-ring hr-ring2" />
        <div className="hr-check" style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#800000,#c04040)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
      </div>
      <div className="hr-fade">
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 10, letterSpacing: '-0.02em', fontFamily: 'Poppins, sans-serif' }}>Hire Request Sent!</div>
        <div style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 8, fontFamily: 'Poppins, sans-serif' }}>
          Your request has been sent to <strong style={{ color: '#800000' }}>{va?.name}</strong>.
        </div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 28, fontFamily: 'Poppins, sans-serif' }}>They have 48 hours to respond. You'll be notified by email.</div>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 12, fontFamily: 'Poppins, sans-serif' }}>
          Redirecting in <strong style={{ color: '#800000', fontSize: 15 }}>{successCount}</strong>s
        </div>
        <div style={{ height: 5, background: '#eee', borderRadius: 99, overflow: 'hidden', maxWidth: 240, margin: '0 auto' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg,#800000,#c04040)', borderRadius: 99, width: `${(successCount / 3) * 100}%`, transition: 'width 1s linear' }} />
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <style>{`textarea:focus,input:focus,select:focus{border-color:#c9a0a0!important;background:#fff!important}button:active{opacity:0.85}`}</style>
      {renderPageHeader()}
      {step === 1 && renderBrief()}
      {step === 2 && renderChooseVA()}
      {step === 3 && renderVAProfile()}
      {step === 4 && renderInterview()}
      {step === 5 && renderHireRequest()}
      {step === 6 && renderSuccess()}
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
export default function SubscriptionsPage() {
  const [search, setSearch]           = useState('')
  const [filter, setFilter]           = useState('all')
  const [expandedId, setExpand]       = useState<number | null>(null)
  const [activeTab, setActiveTab]     = useState<'plans' | 'services'>('plans')
  const [activeCategory, setActiveCategory] = useState('staff')
  const [plans, setPlans]             = useState<Plan[]>(INITIAL_PLANS)

  // ── Service flow (non-hire): modals ──
  const [flowStep, setFlowStep]       = useState<'detail' | 'customize' | 'confirm' | 'success' | null>(null)
  const [selectedSvc, setSelectedSvc] = useState<Service | null>(null)
  const [preferences, setPreferences] = useState<Preferences | null>(null)

  // ── Hire flow: full page ──
  const [hireFlowSvc, setHireFlowSvc] = useState<Service | null>(null)

  // ── Plan action modals ──
  const [planModal, setPlanModal]             = useState<'renew'|'pay'|'edit'|'dots'|null>(null)
  const [activePlan, setActivePlan]           = useState<Plan | null>(null)
  const [dotsTriggerRect, setDotsTriggerRect] = useState<DOMRect | null>(null)

  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const openPlanModal = (type: 'renew'|'pay'|'edit'|'dots', plan: Plan, rect?: DOMRect) => {
    setActivePlan(plan); setPlanModal(type)
    if (type === 'dots' && rect) setDotsTriggerRect(rect)
  }
  const closePlanModal = () => { setPlanModal(null); setActivePlan(null); setDotsTriggerRect(null) }

  // Determine if a service should use the hire flow (Dedicated Staff category)
  const isHireService = (svc: Service) => {
    const staffCat = SERVICE_CATEGORIES.find(c => c.key === 'staff')
    return staffCat?.services.some(s => s.id === svc.id) ?? false
  }

  const openDetail = (svc: Service) => {
    if (isHireService(svc)) {
      setHireFlowSvc(svc)
    } else {
      setSelectedSvc(svc); setFlowStep('detail')
    }
  }
  const closeFlow  = () => { setFlowStep(null); setSelectedSvc(null); setPreferences(null) }

  const canRenew = (plan: Plan) => plan.status === 'ended' || (plan.daysLeft !== null && plan.daysLeft <= 3)
  const canPay   = (plan: Plan) => plan.status === 'ending' || (plan.status === 'active' && plan.daysLeft !== null && plan.daysLeft <= 5)

  const handleRenewConfirm = () => {
    if (!activePlan) return
    setPlans(prev => prev.map(p => p.id === activePlan.id ? { ...p, status: 'active', daysLeft: p.billing === 'Yearly' ? 365 : 30 } : p))
    closePlanModal(); showToast('Subscription renewed successfully!')
  }
  const handlePayConfirm = () => { closePlanModal(); showToast('Payment processed successfully!') }
  const handleEditSave = (updated: Partial<Plan>) => {
    if (!activePlan) return
    setPlans(prev => prev.map(p => p.id === activePlan.id ? { ...p, ...updated } : p))
    closePlanModal(); showToast('Subscription updated!')
  }
  const handleDotsAction = (action: string, plan: Plan) => {
    if (action === 'Cancel Subscription') {
      setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, status: 'ended', daysLeft: null } : p))
      showToast('Subscription cancelled.')
    } else if (action === 'Download Invoice') {
      showToast('Invoice download started!')
    } else {
      showToast(`Viewing details for ${plan.tier}`)
    }
  }

  const handleServiceSuccess = () => {
    if (!selectedSvc || !preferences) return
    const newPlan: Plan = {
      id: Date.now(),
      name: selectedSvc.short,
      tier: selectedSvc.name.replace('\n', ' '),
      price: preferences.total,
      priceLabel: `$${preferences.total.toLocaleString()}`,
      billing: selectedSvc.period.includes('month') ? 'Monthly' : 'One-time',
      renewDate: preferences.startOption,
      daysLeft: 30,
      status: 'active',
      sessions: 0,
      totalSessions: 12,
      perks: selectedSvc.inclusions.slice(0, 4),
      color: '#800000',
      bg: '#fff5f5',
      isService: true,
    }
    setPlans(prev => [...prev, newPlan])
    closeFlow(); setActiveTab('plans')
  }

  const handleHireComplete = () => {
    if (!hireFlowSvc) return
    const newPlan: Plan = {
      id: Date.now(),
      name: hireFlowSvc.short,
      tier: hireFlowSvc.name.replace('\n', ' '),
      price: hireFlowSvc.price,
      priceLabel: hireFlowSvc.priceLabel,
      billing: 'Monthly',
      renewDate: 'Pending acceptance',
      daysLeft: null,
      status: 'ending',
      sessions: 0,
      totalSessions: 0,
      perks: hireFlowSvc.inclusions.slice(0, 4),
      color: '#800000',
      bg: '#fff5f5',
      isService: true,
    }
    setPlans(prev => [...prev, newPlan])
    setHireFlowSvc(null)
    setActiveTab('plans')
    showToast('Hire request sent! Pending VA acceptance.')
  }

  const activePlans  = plans.filter(p => p.status === 'active')
  const monthlySpend = activePlans.filter(p => p.billing === 'Monthly').reduce((a, p) => a + p.price, 0)
  const yearlySpend  = activePlans.reduce((a, p) => a + (p.billing === 'Yearly' ? p.price : p.price * 12), 0)
  const currentCat   = SERVICE_CATEGORIES.find(c => c.key === activeCategory)

  const visible = plans.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = p.name.toLowerCase().includes(q) || p.tier.toLowerCase().includes(q)
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  // ── If hire flow is active, render it as the full page ──────────────────────
  if (hireFlowSvc) {
    return (
      <div style={{ fontFamily: "'Poppins', sans-serif", padding: '24px' }}>
        <style>{GLOBAL_CSS}</style>
        {toast && (
          <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: '#1a1a2e', color: '#fff', borderRadius: 12, padding: '12px 22px', fontSize: 13, fontWeight: 600, zIndex: 2000, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', letterSpacing: '0.01em' }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            {toast}
          </div>
        )}
        {/* Minimal page header stays visible */}
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Account</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Subscriptions</h2>
          <p style={{ fontSize: 13, color: '#555', fontWeight: 400, margin: '3px 0 0' }}>Manage and track your active subscription plans.</p>
        </div>
        <div style={{ height: 1, background: '#e8e4e4', marginBottom: 24 }} />
        <HireFlowPage
          svc={hireFlowSvc}
          onBack={() => { setHireFlowSvc(null); setActiveTab('services') }}
          onComplete={handleHireComplete}
        />
      </div>
    )
  }

  // ── Normal subscriptions page ────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: '24px' }}>
      <style>{GLOBAL_CSS}</style>

      {/* Service flow modals (non-hire) */}
      {flowStep === 'detail'    && selectedSvc && <ServiceDetailModal svc={selectedSvc} onClose={closeFlow} onProceed={() => setFlowStep('customize')} />}
      {flowStep === 'customize' && selectedSvc && <CustomizationModal svc={selectedSvc} onBack={() => setFlowStep('detail')} onProceed={prefs => { setPreferences(prefs); setFlowStep('confirm') }} />}
      {flowStep === 'confirm'   && selectedSvc && preferences && <ConfirmModal svc={selectedSvc} preferences={preferences} onBack={() => setFlowStep('customize')} onConfirm={() => setFlowStep('success')} />}
      {flowStep === 'success'   && selectedSvc && <SuccessModal svc={selectedSvc} onDone={handleServiceSuccess} />}

      {/* Plan action modals */}
      {planModal === 'renew' && activePlan && <RenewModal plan={activePlan} onClose={closePlanModal} onConfirm={handleRenewConfirm} />}
      {planModal === 'pay'   && activePlan && <PayModal   plan={activePlan} onClose={closePlanModal} onConfirm={handlePayConfirm} />}
      {planModal === 'edit'  && activePlan && <EditModal  plan={activePlan} onClose={closePlanModal} onSave={handleEditSave} />}
      {planModal === 'dots'  && activePlan && <DotsMenu plan={activePlan} onClose={closePlanModal} onAction={action => handleDotsAction(action, activePlan)} triggerRect={dotsTriggerRect} />}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: '#1a1a2e', color: '#fff', borderRadius: 12, padding: '12px 22px', fontSize: 13, fontWeight: 600, zIndex: 2000, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', letterSpacing: '0.01em' }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Account</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Subscriptions</h2>
        <p style={{ fontSize: 13, color: '#555', fontWeight: 400, margin: '3px 0 0' }}>Manage and track your active subscription plans.</p>
      </div>

      {/* Stat Cards */}
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#ede8e8', borderRadius: 10, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        <button className={`tab-btn ${activeTab === 'plans' ? 'active' : ''}`} onClick={() => setActiveTab('plans')}>My Plans</button>
        <button className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Browse Services</button>
      </div>

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
              const isFeatured  = svc.featured
              const isHire      = isHireService(svc)
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
                      {isHire ? 'Hire Now →' : 'Get Started →'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

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

                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{plan.priceLabel}</div>
                            <div style={{ fontSize: 11, color: '#666', marginTop: 1, fontWeight: 400 }}>{plan.billing}</div>
                          </div>

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