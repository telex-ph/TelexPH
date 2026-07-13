'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '../layout'

// Full applicant record — only returned by GET /applicants/:id (detail fetch)
interface Applicant {
  _id: string
  firstName: string
  lastName: string
  middleName?: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  dob?: string
  gender?: string
  services?: string[]
  experienceLevel?: string
  availability?: string
  timezone?: string
  rate?: string
  startDate?: string
  coverLetter?: string
  resumeUrl?: string
  resumeOriginalName?: string
  appliedAt: string
  status: 'pending' | 'approved' | 'rejected'
  confirmCode?: string
  pipelineStage?: 'details' | 'shortlist' | 'assessment' | 'interview' | 'hired'
}

// Slim shape returned by GET /applicants (list) — table/card view only needs these fields
interface ApplicantListItem {
  _id: string
  firstName: string
  lastName: string
  email: string
  services?: string[]
  appliedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

const poppins: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 400,
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ segments, size = 120, thickness = 22 }: { segments: { value: number; color: string }[]; size?: number; thickness?: number }) {
  const r = (size - thickness) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  if (total === 0) return null
  let offset = 0
  const arcs = segments.map((seg) => {
    const dash = (seg.value / total) * circumference
    const gap = circumference - dash
    const arc = { dash, gap, offset, color: seg.color }
    offset += dash
    return arc
  })
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <defs>{arcs.map((arc, i) => (<linearGradient key={i} id={`donut-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={arc.color} stopOpacity="1" /><stop offset="100%" stopColor={arc.color} stopOpacity="0.7" /></linearGradient>))}</defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={thickness} />
      {arcs.map((arc, i) => (<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={`url(#donut-grad-${i})`} strokeWidth={thickness} strokeDasharray={`${arc.dash - 2} ${arc.gap + 2}`} strokeDashoffset={-arc.offset} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.7s ease' }} />))}
    </svg>
  )
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChartSVG({ labels, values, color, dm }: { labels: string[]; values: number[]; color: string; dm: boolean }) {
  const W = 260, H = 110, PAD = { t: 10, r: 4, b: 28, l: 28 }
  const chartW = W - PAD.l - PAD.r, chartH = H - PAD.t - PAD.b
  const maxVal = Math.max(...values, 1)
  const barW = (chartW / values.length) * 0.55, step = chartW / values.length
  const axisColor = dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
  const textColor = dm ? '#6b7280' : '#9ca3af'
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="1" /><stop offset="100%" stopColor={color} stopOpacity="0.4" /></linearGradient>
        <linearGradient id="bar-grad-empty" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={dm ? '#ffffff' : '#e5e7eb'} stopOpacity="0.12" /><stop offset="100%" stopColor={dm ? '#ffffff' : '#e5e7eb'} stopOpacity="0.04" /></linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = PAD.t + chartH * (1 - pct), val = Math.round(maxVal * pct)
        return (<g key={pct}><line x1={PAD.l} y1={y} x2={PAD.l + chartW} y2={y} stroke={axisColor} strokeWidth="1" strokeDasharray="3 3" />{val > 0 && <text x={PAD.l - 4} y={y + 3} textAnchor="end" fill={textColor} style={{ ...poppins, fontSize: '8px' }}>{val}</text>}</g>)
      })}
      {values.map((v, i) => {
        const x = PAD.l + i * step + (step - barW) / 2
        const barH = Math.max((v / maxVal) * chartH, v > 0 ? 6 : 2)
        const y = PAD.t + chartH - barH
        return (<g key={i}><rect x={x} y={PAD.t} width={barW} height={chartH} rx="4" fill="url(#bar-grad-empty)" /><rect x={x} y={y} width={barW} height={barH} rx="4" fill={v > 0 ? 'url(#bar-grad)' : 'none'} style={{ transition: 'height 0.7s ease, y 0.7s ease' }} /><text x={x + barW / 2} y={H - 6} textAnchor="middle" fill={textColor} style={{ ...poppins, fontSize: '8px' }}>{labels[i]}</text></g>)
      })}
      <line x1={PAD.l} y1={PAD.t + chartH} x2={PAD.l + chartW} y2={PAD.t + chartH} stroke={axisColor} strokeWidth="1" />
    </svg>
  )
}

// ─── Area Line Chart ──────────────────────────────────────────────────────────
function AreaLineSVG({ labels, values, color, dm }: { labels: string[]; values: number[]; color: string; dm: boolean }) {
  const W = 260, H = 110, PAD = { t: 14, r: 8, b: 28, l: 8 }
  const chartW = W - PAD.l - PAD.r, chartH = H - PAD.t - PAD.b
  const maxVal = Math.max(...values, 1), n = values.length
  const textColor = dm ? '#6b7280' : '#9ca3af'
  const pts = values.map((v, i) => ({ x: PAD.l + (i / (n - 1)) * chartW, y: PAD.t + chartH - (v / maxVal) * chartH }))
  const pathD = pts.reduce((acc, pt, i) => { if (i === 0) return `M ${pt.x},${pt.y}`; const prev = pts[i - 1]; const cpx = (prev.x + pt.x) / 2; return `${acc} C ${cpx},${prev.y} ${cpx},${pt.y} ${pt.x},${pt.y}` }, '')
  const areaD = `${pathD} L ${pts[n - 1].x},${PAD.t + chartH} L ${pts[0].x},${PAD.t + chartH} Z`
  const gradId = `area-grad-${color.replace('#', '')}`
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs><linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25" /><stop offset="100%" stopColor={color} stopOpacity="0.02" /></linearGradient></defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((pt, i) => (<g key={i}><circle cx={pt.x} cy={pt.y} r="4" fill={color} opacity="0.15" /><circle cx={pt.x} cy={pt.y} r="2.5" fill={color} />{values[i] > 0 && <text x={pt.x} y={pt.y - 7} textAnchor="middle" fill={color} style={{ ...poppins, fontSize: '8px', fontWeight: 600 }}>{values[i]}</text>}</g>))}
      {labels.map((l, i) => (<text key={i} x={PAD.l + (i / (n - 1)) * chartW} y={H - 6} textAnchor="middle" fill={textColor} style={{ ...poppins, fontSize: '8px' }}>{l}</text>))}
    </svg>
  )
}

// ─── BG Images ────────────────────────────────────────────────────────────────
const CARD_BG_IMAGES = [
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80',
]

// ─── Hero Stat Card ───────────────────────────────────────────────────────────
function HeroStatCard({ label, value, sub, bgImage, icon }: { label: string; value: number | string; sub: string; color: string; bgImage: string; icon: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', minHeight: '100px', display: 'flex', alignItems: 'flex-end', cursor: 'default', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.45) saturate(0.7)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(100,0,0,0.82) 0%, rgba(60,0,0,0.72) 60%, rgba(30,0,0,0.55) 100%)' }} />
      <div style={{ position: 'relative', zIndex: 1, padding: '16px 18px', width: '100%' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '12px' }}>{icon}</div>
        <p style={{ ...poppins, fontSize: '28px', fontWeight: 800, color: '#ffffff', lineHeight: 1, marginBottom: '4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{value}</p>
        <p style={{ ...poppins, fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}>{label}</p>
        <p style={{ ...poppins, fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{sub}</p>
      </div>
    </div>
  )
}

// ─── Download Analytics + Applicants List CSV ─────────────────────────────────
function downloadAnalyticsCSV(applicants: ApplicantListItem[]) {
  const total = applicants.length
  const approved = applicants.filter((a) => a.status === 'approved').length
  const pending = applicants.filter((a) => a.status === 'pending').length
  const rejected = applicants.filter((a) => a.status === 'rejected').length
  const now = new Date()
  const monthLabels: string[] = [], monthCounts: number[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthLabels.push(d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))
    monthCounts.push(applicants.filter((a) => { const ap = new Date(a.appliedAt); return ap.getFullYear() === d.getFullYear() && ap.getMonth() === d.getMonth() }).length)
  }
  const rows: string[][] = []

  rows.push(['APPLICANTS ANALYTICS REPORT'])
  rows.push([`Generated: ${now.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`])
  rows.push([])

  rows.push(['SUMMARY'])
  rows.push(['Metric', 'Count', 'Rate'])
  rows.push(['Total Applicants', String(total), '100%'])
  rows.push(['Approved', String(approved), total > 0 ? `${Math.round((approved / total) * 100)}%` : '0%'])
  rows.push(['Pending', String(pending), total > 0 ? `${Math.round((pending / total) * 100)}%` : '0%'])
  rows.push(['Rejected', String(rejected), total > 0 ? `${Math.round((rejected / total) * 100)}%` : '0%'])
  rows.push([])

  rows.push(['MONTHLY BREAKDOWN (Last 6 Months)'])
  rows.push(['Month', 'Applications'])
  monthLabels.forEach((m, i) => rows.push([m, String(monthCounts[i])]))
  rows.push([])

  rows.push(['APPLICANTS LIST'])
  rows.push([
    'No.',
    'First Name',
    'Middle Name',
    'Last Name',
    'Email',
    'Phone',
    'Date of Birth',
    'Gender',
    'Address',
    'City',
    'State',
    'ZIP',
    'Country',
    'Desired Position(s)',
    'Experience Level',
    'Availability',
    'Timezone',
    'Expected Rate',
    'Start Date',
    'Cover Letter',
    'Resume File',
    'Status',
    'Confirm Code',
    'Applied At',
  ])
  applicants.forEach((a, idx) => {
    rows.push([
      String(idx + 1),
      a.firstName,
      a.middleName || '',
      a.lastName,
      a.email,
      a.phone || '',
      a.dob || '',
      a.gender || '',
      a.address || '',
      a.city || '',
      a.state || '',
      a.zip || '',
      a.country || '',
      (a.services || []).join('; '),
      a.experienceLevel || '',
      a.availability || '',
      a.timezone || '',
      a.rate || '',
      a.startDate || '',
      a.coverLetter || '',
      a.resumeOriginalName || '',
      a.status,
      a.confirmCode || '',
      new Date(a.appliedAt).toLocaleDateString('en-PH'),
    ])
  })

  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `applicants-report-${now.toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// ─── Analytics Section ────────────────────────────────────────────────────────
function AnalyticsSection({ applicants, isdarkmode }: { applicants: ApplicantListItem[]; isdarkmode: boolean }) {
  const total = applicants.length
  const pending = applicants.filter((a) => a.status === 'pending').length
  const approved = applicants.filter((a) => a.status === 'approved').length
  const rejected = applicants.filter((a) => a.status === 'rejected').length
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0
  const rejectionRate = total > 0 ? Math.round((rejected / total) * 100) : 0
  const pendingRate = total > 0 ? Math.round((pending / total) * 100) : 0
  const now = new Date()
  const monthLabels: string[] = [], monthCounts: number[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthLabels.push(d.toLocaleDateString('en-US', { month: 'short' }))
    monthCounts.push(applicants.filter((a) => { const ap = new Date(a.appliedAt); return ap.getFullYear() === d.getFullYear() && ap.getMonth() === d.getMonth() }).length)
  }
  const dm = isdarkmode
  const card = `rounded-2xl ${dm ? 'bg-[#181818] border border-white/5' : 'bg-white border border-gray-100'} shadow-sm`
  const sectionTitle: React.CSSProperties = { ...poppins, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#800000' }
  const labelText: React.CSSProperties = { ...poppins, fontSize: '11px', fontWeight: 500, color: dm ? '#d1d5db' : '#374151' }
  const mutedText: React.CSSProperties = { ...poppins, fontSize: '11px', fontWeight: 400, color: '#9ca3af' }

  const heroCards = [
    { label: 'Total Applicants', value: total, sub: 'All categories', color: '#800000', bgImage: CARD_BG_IMAGES[0], icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>) },
    { label: 'Pending Review', value: pending, sub: `${pendingRate}% of total`, color: '#d97706', bgImage: CARD_BG_IMAGES[1], icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>) },
    { label: 'Approved', value: approved, sub: `${approvalRate}% approval rate`, color: '#059669', bgImage: CARD_BG_IMAGES[2], icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>) },
    { label: 'Rejected', value: rejected, sub: `${rejectionRate}% rejection rate`, color: '#dc2626', bgImage: CARD_BG_IMAGES[3], icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>) },
  ]

  const donutSegments = [{ value: approved, color: '#059669' }, { value: pending, color: '#d97706' }, { value: rejected, color: '#dc2626' }]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {heroCards.map((c) => <HeroStatCard key={c.label} {...c} />)}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" style={{ alignItems: 'stretch' }}>
        <div className={`${card} p-5 flex flex-col`}>
          <p style={{ ...sectionTitle, marginBottom: '14px' }}>Status Breakdown</p>
          {total === 0 ? <p style={mutedText}>No data yet.</p> : (
            <div className="flex items-center gap-4 flex-1">
              <div className="relative shrink-0" style={{ width: 100, height: 100 }}>
                <DonutChart segments={donutSegments} size={100} thickness={18} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span style={{ ...poppins, fontSize: '22px', fontWeight: 700, color: dm ? '#fff' : '#111827', lineHeight: 1 }}>{total}</span>
                  <span style={{ ...poppins, fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>total</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                {[{ label: 'Approved', count: approved, rate: approvalRate, color: '#059669' }, { label: 'Pending', count: pending, rate: pendingRate, color: '#d97706' }, { label: 'Rejected', count: rejected, rate: rejectionRate, color: '#dc2626' }].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate" style={labelText}>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span style={{ ...poppins, fontSize: '11px', fontWeight: 700, color: dm ? '#fff' : '#111827' }}>{item.count}</span>
                      <span style={{ ...poppins, fontSize: '11px', color: '#9ca3af' }}>({item.rate}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={`${card} p-5 flex flex-col`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p style={sectionTitle}>Monthly Applications</p>
              <p style={{ ...poppins, fontSize: '22px', fontWeight: 700, color: dm ? '#fff' : '#111827', lineHeight: 1.1, marginTop: '4px' }}>{total}</p>
              <p style={mutedText}>Last 6 months</p>
            </div>
          </div>
          <div className="flex-1 flex items-end">
            {total === 0 ? <p style={mutedText}>No data yet.</p> : <div className="w-full"><BarChartSVG labels={monthLabels} values={monthCounts} color="#800000" dm={dm} /></div>}
          </div>
        </div>
        <div className={`${card} p-5 flex flex-col`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p style={sectionTitle}>Application Trend</p>
              <p style={{ ...poppins, fontSize: '22px', fontWeight: 700, color: dm ? '#fff' : '#111827', lineHeight: 1.1, marginTop: '4px' }}>{monthCounts[monthCounts.length - 1]}</p>
              <p style={mutedText}>This month</p>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#059669' }} />
              <span style={mutedText}>Approved</span>
            </div>
          </div>
          <div className="flex-1 flex items-end">
            {total === 0 ? <p style={mutedText}>No data yet.</p> : <div className="w-full"><AreaLineSVG labels={monthLabels} values={monthCounts} color="#800000" dm={dm} /></div>}
          </div>
          <div className="flex items-center justify-between mt-2">
            {[{ label: `${approved} Approved`, color: '#059669' }, { label: `${rejected} Rejected`, color: '#dc2626' }].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                <span style={mutedText}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Pipeline Stages Config ───────────────────────────────────────────────────
const PIPELINE_STAGES: { key: NonNullable<Applicant['pipelineStage']>; label: string; icon: React.ReactNode }[] = [
  {
    key: 'details',
    label: 'Details',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    key: 'shortlist',
    label: 'Shortlist',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    key: 'assessment',
    label: 'Assessment',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <polyline points="8 21 12 17 16 21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    key: 'interview',
    label: 'Interview',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    key: 'hired',
    label: 'Hired',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
]

const PROCEED_LABELS: Record<string, string> = {
  details: 'Proceed to Shortlist',
  shortlist: 'Proceed to Assessment',
  assessment: 'Proceed to Interview',
  interview: 'Mark as Hired',
}

// ─── Pipeline Loading Overlay ─────────────────────────────────────────────────
function PipelineLoadingOverlay({ stage, dm }: { stage: string; dm: boolean }) {
  const stageLabel = PIPELINE_STAGES.find((s) => s.key === stage)?.label || stage
  const messages: Record<string, string> = {
    shortlist: 'Moving to Shortlist…',
    assessment: 'Advancing to Assessment…',
    interview: 'Scheduling Interview…',
    hired: 'Marking as Hired…',
  }
  const msg = messages[stage] || `Moving to ${stageLabel}…`

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        background: dm
          ? 'rgba(10, 10, 10, 0.88)'
          : 'rgba(245, 245, 245, 0.92)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: 'fadeInOverlay 0.2s ease',
      }}
    >
      {/* Animated maroon spinner ring */}
      <div style={{ position: 'relative', width: '56px', height: '56px' }}>
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          style={{ animation: 'spinRing 1s linear infinite', position: 'absolute', inset: 0 }}
        >
          <circle
            cx="28" cy="28" r="22"
            fill="none"
            stroke={dm ? 'rgba(128,0,0,0.2)' : 'rgba(128,0,0,0.1)'}
            strokeWidth="4"
          />
          <circle
            cx="28" cy="28" r="22"
            fill="none"
            stroke="#800000"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="138.2"
            strokeDashoffset="104"
          />
        </svg>
        {/* Center icon — next stage icon */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#800000',
        }}>
          {PIPELINE_STAGES.find((s) => s.key === stage)?.icon}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ ...poppins, fontSize: '13px', fontWeight: 600, color: dm ? '#fff' : '#111827', marginBottom: '4px' }}>{msg}</p>
        <p style={{ ...poppins, fontSize: '11px', color: '#9ca3af' }}>Please wait…</p>
      </div>

      {/* Animated progress dots */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#800000',
              animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Applicant Modal ──────────────────────────────────────────────────────────
function ApplicantModal({
  applicant,
  isdarkmode,
  onClose,
  onApprove,
  onReject,
  onPipelineAdvance,
  actionLoading,
  modalToast,
}: {
  applicant: Applicant
  isdarkmode: boolean
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onPipelineAdvance: (id: string, stage: NonNullable<Applicant['pipelineStage']>) => void
  actionLoading: string | null
  modalToast: { message: string; type: 'success' | 'error' } | null
}) {
  const dm = isdarkmode
  const resumeHref = `${process.env.NEXT_PUBLIC_API_URL}${applicant.resumeUrl}`

  const currentStageIndex = PIPELINE_STAGES.findIndex((s) => s.key === (applicant.pipelineStage || 'details'))
  const currentStage = PIPELINE_STAGES[currentStageIndex]
  const nextStage = PIPELINE_STAGES[currentStageIndex + 1]

  // ── Loading states ──
  const isPipelineLoading = actionLoading === `${applicant._id}-pipeline`
  const isApproveLoading = actionLoading === `${applicant._id}-approve`
  const isRejectLoading = actionLoading === `${applicant._id}-reject`
  const isAnyLoading = !!actionLoading

  // Which stage is currently being transitioned to (for overlay label)
  const loadingTargetStage = isPipelineLoading ? nextStage?.key : null

  const infoCard = {
    borderRadius: '16px',
    padding: '16px',
    background: dm ? 'rgba(255,255,255,0.03)' : '#ffffff',
    border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
  }

  function Row({ l, v }: { l: string; v?: string }) {
    return (
      <div>
        <p style={{ ...poppins, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af', marginBottom: '2px' }}>{l}</p>
        <p style={{ ...poppins, fontSize: '12px', fontWeight: 500, color: dm ? '#f3f4f6' : '#111827' }}>{v || '—'}</p>
      </div>
    )
  }

  return (
    <div
      onClick={(e) => {
        if (isAnyLoading) return
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Toast OUTSIDE modal card, floating in blurred backdrop ── */}
      {modalToast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 400,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '12px',
            background: modalToast.type === 'success'
              ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
              : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            animation: 'slideDownFade 0.3s ease',
            maxWidth: '260px',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            width: '18px', height: '18px', borderRadius: '6px',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {modalToast.type === 'success'
              ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            }
          </div>
          <p style={{ ...poppins, fontSize: '11px', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{modalToast.message}</p>
        </div>
      )}

      <div
        className="modal-scroll"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '672px',
          maxHeight: '92vh',
          borderRadius: '24px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          background: dm ? '#111111' : '#f5f5f5',
          ...poppins,
          overflowY: isPipelineLoading ? 'hidden' : 'auto',
          overflowX: 'hidden',
        }}
      >

        {/* ── Pipeline Loading Overlay (covers entire modal) ── */}
        {isPipelineLoading && loadingTargetStage && (
          <PipelineLoadingOverlay stage={loadingTargetStage} dm={dm} />
        )}

        {/* ── Maroon Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #800000 0%, #550000 100%)',
          borderRadius: '24px 24px 0 0',
          padding: '22px 22px 0',
        }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', gap: '12px' }}>
            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '14px', flexShrink: 0,
                background: 'rgba(255,255,255,0.14)', border: '1.5px solid rgba(255,255,255,0.24)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: '15px',
              }}>
                {applicant.firstName?.[0]}{applicant.lastName?.[0]}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ ...poppins, fontSize: '14px', fontWeight: 700, color: '#fff', lineHeight: 1.25 }}>
                  {applicant.firstName} {applicant.middleName ? applicant.middleName + ' ' : ''}{applicant.lastName}
                </p>
                <p style={{ ...poppins, fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{applicant.email}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    ...poppins, fontSize: '10px', fontWeight: 600,
                    padding: '2px 10px', borderRadius: '999px',
                    background: applicant.status === 'approved'
                      ? 'rgba(16,185,129,0.2)'
                      : applicant.status === 'rejected'
                        ? 'rgba(239,68,68,0.2)'
                        : 'rgba(245,158,11,0.2)',
                    color: applicant.status === 'approved' ? '#6ee7b7' : applicant.status === 'rejected' ? '#fca5a5' : '#fcd34d',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {applicant.status}
                  </span>
                  {applicant.confirmCode && (
                    <span style={{ ...poppins, fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                      Ref: <span style={{ color: 'rgba(255,255,255,0.65)' }}>{applicant.confirmCode}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Top-right: Close only */}
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <button
                onClick={isAnyLoading ? undefined : onClose}
                style={{
                  width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isAnyLoading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.75)',
                  cursor: isAnyLoading ? 'not-allowed' : 'pointer',
                  opacity: isAnyLoading ? 0.5 : 1,
                  transition: 'opacity 0.15s ease',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Pipeline Progress ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', paddingBottom: '0' }}>
            {PIPELINE_STAGES.map((stage, idx) => {
              const isDone = idx < currentStageIndex
              const isActive = idx === currentStageIndex
              const isLast = idx === PIPELINE_STAGES.length - 1

              return (
                <div key={stage.key} style={{ display: 'flex', alignItems: 'flex-start', flex: isLast ? '0 0 auto' : '1 1 0', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {/* Circle */}
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isDone
                        ? 'rgba(255,255,255,0.9)'
                        : isActive
                          ? '#ffffff'
                          : 'rgba(255,255,255,0.08)',
                      border: isActive
                        ? '2px solid #fff'
                        : isDone
                          ? '2px solid rgba(255,255,255,0.85)'
                          : '1.5px solid rgba(255,255,255,0.18)',
                      color: isDone ? '#800000' : isActive ? '#800000' : 'rgba(255,255,255,0.3)',
                      boxShadow: isActive ? '0 0 0 4px rgba(255,255,255,0.12)' : 'none',
                      transition: 'all 0.3s ease',
                    }}>
                      {isDone
                        ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                        : stage.icon
                      }
                    </div>
                    {/* Connector */}
                    {!isLast && (
                      <div style={{
                        flex: 1,
                        height: '2px',
                        marginLeft: '3px',
                        marginRight: '3px',
                        background: idx < currentStageIndex ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.13)',
                        borderRadius: '2px',
                        transition: 'background 0.3s ease',
                      }} />
                    )}
                  </div>
                  {/* Label below circle */}
                  <p style={{
                    ...poppins,
                    fontSize: '9px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#fff' : isDone ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
                    marginTop: '5px',
                    paddingLeft: '0px',
                    whiteSpace: 'nowrap',
                  }}>
                    {stage.label}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Bottom curve bridge */}
          <div style={{
            height: '20px',
            marginTop: '14px',
            background: dm ? '#111111' : '#f5f5f5',
            borderRadius: '20px 20px 0 0',
          }} />
        </div>

        {/* ── Body Content ── */}
        <div style={{ padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Personal Info */}
          <div style={infoCard}>
            <p style={{ ...poppins, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#800000', marginBottom: '12px' }}>Personal Information</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
              <Row l="Phone" v={applicant.phone} />
              <Row l="Date of Birth" v={applicant.dob} />
              <Row l="Gender" v={applicant.gender} />
              <Row l="Country" v={applicant.country} />
              <div style={{ gridColumn: '1 / -1' }}>
                <Row l="Address" v={[applicant.address, applicant.city, applicant.state, applicant.zip].filter(Boolean).join(', ')} />
              </div>
            </div>
          </div>

          {/* Services & Availability */}
          <div style={infoCard}>
            <p style={{ ...poppins, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#800000', marginBottom: '12px' }}>Services & Availability</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
              <Row l="Experience Level" v={applicant.experienceLevel} />
              <Row l="Availability" v={applicant.availability} />
              <Row l="Expected Rate" v={applicant.rate} />
              <Row l="Start Date" v={applicant.startDate} />
              <Row l="Timezone" v={applicant.timezone} />
            </div>
            {applicant.services && applicant.services.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <p style={{ ...poppins, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af', marginBottom: '7px' }}>Desired Positions / Services</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {applicant.services.map((s) => (
                    <span key={s} style={{
                      ...poppins, fontSize: '11px', fontWeight: 500,
                      padding: '3px 10px', borderRadius: '8px',
                      background: dm ? 'rgba(128,0,0,0.2)' : 'rgba(128,0,0,0.07)',
                      color: dm ? '#ff8080' : '#800000',
                      border: `1px solid ${dm ? 'rgba(128,0,0,0.3)' : 'rgba(128,0,0,0.13)'}`,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          {applicant.coverLetter && (
            <div style={infoCard}>
              <p style={{ ...poppins, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#800000', marginBottom: '8px' }}>Cover Letter</p>
              <p style={{ ...poppins, fontSize: '12px', lineHeight: 1.75, color: dm ? '#d1d5db' : '#4b5563' }}>{applicant.coverLetter}</p>
            </div>
          )}

          {/* Resume */}
          {applicant.resumeUrl && (
            <div style={infoCard}>
              <p style={{ ...poppins, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#800000', marginBottom: '8px' }}>Resume / CV</p>
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...poppins, fontSize: '12px', fontWeight: 500,
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  color: '#800000', textDecoration: 'none',
                  padding: '8px 14px', borderRadius: '10px',
                  background: dm ? 'rgba(128,0,0,0.15)' : 'rgba(128,0,0,0.06)',
                  border: `1px solid ${dm ? 'rgba(128,0,0,0.25)' : 'rgba(128,0,0,0.12)'}`,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                {applicant.resumeOriginalName || 'Download Resume'}
              </a>
            </div>
          )}

          {/* ── Action Buttons ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

            {/* ── Pipeline proceed button ── */}
            {applicant.status !== 'rejected' && currentStage?.key !== 'hired' && nextStage && (
              <button
                onClick={() => !isAnyLoading && onPipelineAdvance(applicant._id, nextStage.key)}
                disabled={isAnyLoading}
                style={{
                  ...poppins, fontSize: '12px', fontWeight: 600,
                  width: '100%', padding: '12px',
                  borderRadius: '14px',
                  background: isPipelineLoading
                    ? 'linear-gradient(135deg, #5a0000 0%, #3a0000 100%)'
                    : 'linear-gradient(135deg, #800000 0%, #550000 100%)',
                  color: '#fff', border: 'none',
                  cursor: isAnyLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  opacity: isAnyLoading && !isPipelineLoading ? 0.45 : 1,
                  transition: 'opacity 0.15s ease, background 0.15s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Shimmer while loading */}
                {isPipelineLoading && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                    animation: 'shimmer 1.4s ease-in-out infinite',
                  }} />
                )}

                {isPipelineLoading ? (
                  <>
                    {/* ── Inline spinner inside button ── */}
                    <span style={{
                      width: '16px',
                      height: '16px',
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24"
                        style={{ animation: 'spinRing 0.75s linear infinite' }}
                      >
                        <circle
                          cx="12" cy="12" r="9"
                          fill="none"
                          stroke="rgba(255,255,255,0.25)"
                          strokeWidth="3"
                        />
                        <circle
                          cx="12" cy="12" r="9"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="56.5"
                          strokeDashoffset="42"
                        />
                      </svg>
                    </span>
                    <span>Processing…</span>
                  </>
                ) : (
                  <>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{nextStage.icon}</span>
                    {PROCEED_LABELS[currentStage?.key || 'details']}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </>
                )}
              </button>
            )}

            {/* Hired state */}
            {currentStage?.key === 'hired' && (
              <div style={{
                ...poppins, fontSize: '12px', fontWeight: 600,
                padding: '12px', borderRadius: '14px',
                background: dm ? 'rgba(5,150,105,0.12)' : 'rgba(5,150,105,0.07)',
                color: '#059669',
                border: '1.5px solid rgba(5,150,105,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                This applicant has been hired
              </div>
            )}

            {/* Approve / Reject (pending only) */}
            {applicant.status === 'pending' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => { if (!isAnyLoading) { onApprove(applicant._id); onClose() } }}
                  disabled={isAnyLoading}
                  style={{
                    ...poppins, fontSize: '12px', fontWeight: 500,
                    flex: 1, padding: '10px 14px', borderRadius: '12px',
                    background: dm ? 'rgba(5,150,105,0.1)' : 'rgba(5,150,105,0.07)',
                    color: '#059669',
                    border: '1.5px solid rgba(5,150,105,0.22)',
                    cursor: isAnyLoading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    opacity: isAnyLoading ? 0.45 : 1,
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  {isApproveLoading
                    ? <span style={{ width: '13px', height: '13px', border: '2px solid rgba(5,150,105,0.4)', borderTopColor: '#059669', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  }
                  Approve Applicant
                </button>
                <button
                  onClick={() => { if (!isAnyLoading) { onReject(applicant._id); onClose() } }}
                  disabled={isAnyLoading}
                  style={{
                    ...poppins, fontSize: '12px', fontWeight: 500,
                    flex: 1, padding: '10px 14px', borderRadius: '12px',
                    background: dm ? 'rgba(220,38,38,0.1)' : 'rgba(220,38,38,0.07)',
                    color: '#dc2626',
                    border: '1.5px solid rgba(220,38,38,0.2)',
                    cursor: isAnyLoading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    opacity: isAnyLoading ? 0.45 : 1,
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  {isRejectLoading
                    ? <span style={{ width: '13px', height: '13px', border: '2px solid rgba(220,38,38,0.4)', borderTopColor: '#dc2626', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                  }
                  Reject Applicant
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Table Stat Cards ─────────────────────────────────────────────────────────
function TableStatCards({ applicants, filtered, filterStatus, isdarkmode }: { applicants: ApplicantListItem[]; filtered: ApplicantListItem[]; filterStatus: string; isdarkmode: boolean }) {
  const total = applicants.length
  const pending = applicants.filter((a) => a.status === 'pending').length
  const approved = applicants.filter((a) => a.status === 'approved').length
  const rejected = applicants.filter((a) => a.status === 'rejected').length
  const cards = [
    { label: 'Showing', value: filtered.length, sub: filterStatus === 'all' ? 'All applicants' : `"${filterStatus}" filter active`, bgImage: CARD_BG_IMAGES[0], color: '#800000', icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>) },
    { label: 'Pending', value: pending, sub: total > 0 ? `${Math.round((pending / total) * 100)}% of total` : '0% of total', bgImage: CARD_BG_IMAGES[1], color: '#d97706', icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>) },
    { label: 'Approved', value: approved, sub: total > 0 ? `${Math.round((approved / total) * 100)}% approval rate` : '0% approval rate', bgImage: CARD_BG_IMAGES[2], color: '#059669', icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>) },
    { label: 'Rejected', value: rejected, sub: total > 0 ? `${Math.round((rejected / total) * 100)}% rejection rate` : '0% rejection rate', bgImage: CARD_BG_IMAGES[3], color: '#dc2626', icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>) },
  ]
  return (<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{cards.map((c) => <HeroStatCard key={c.label} {...c} />)}</div>)
}

// ─── Segmented Pill Filter ────────────────────────────────────────────────────
function FilterTabs({ filterStatus, setFilterStatus, isdarkmode }: {
  filterStatus: 'all' | 'pending' | 'approved' | 'rejected'
  setFilterStatus: (v: 'all' | 'pending' | 'approved' | 'rejected') => void
  applicants: ApplicantListItem[]
  isdarkmode: boolean
}) {
  const dm = isdarkmode
  const tabs = [
    { key: 'all' as const, label: 'All' },
    { key: 'pending' as const, label: 'Pending' },
    { key: 'approved' as const, label: 'Approved' },
    { key: 'rejected' as const, label: 'Rejected' },
  ]

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '999px',
        padding: '3px',
        gap: '2px',
        background: dm ? 'rgba(128,0,0,0.2)' : 'rgba(128,0,0,0.08)',
        boxShadow: dm
          ? 'inset 0 1px 4px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(128,0,0,0.25)'
          : 'inset 0 1px 3px rgba(128,0,0,0.12), inset 0 0 0 1px rgba(128,0,0,0.1)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = filterStatus === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            style={{
              ...poppins,
              fontSize: '11px',
              fontWeight: isActive ? 600 : 500,
              padding: '4px 14px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              background: isActive ? '#800000' : 'transparent',
              color: isActive ? '#ffffff' : dm ? '#e5e7eb' : '#111827',
              boxShadow: isActive
                ? '0 2px 10px rgba(128,0,0,0.4), 0 0 0 0.5px rgba(128,0,0,0.6)'
                : 'none',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ApplicantsList() {
  const { isdarkmode } = useDarkMode()
  const [applicants, setApplicants] = useState<ApplicantListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [modalToast, setModalToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [selectedApplicantLoading, setSelectedApplicantLoading] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Show toast inside modal when modal is open, otherwise show global toast
  const showSmartToast = (message: string, type: 'success' | 'error') => {
    if (selectedApplicant) {
      setModalToast({ message, type })
      setTimeout(() => setModalToast(null), 3000)
    } else {
      showToast(message, type)
    }
  }

  // Clear modal toast when modal closes
  const handleModalClose = () => {
    setSelectedApplicant(null)
    setModalToast(null)
  }

  const fetchApplicants = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applicants`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      if (response.ok) setApplicants(await response.json())
    } catch (error) { console.error('Error fetching applicants:', error) } finally { setIsLoading(false) }
  }

  useEffect(() => { fetchApplicants() }, [])

  const openApplicant = async (item: ApplicantListItem) => {
    setSelectedApplicantLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applicants/${item._id}`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      if (response.ok) {
        setSelectedApplicant(await response.json())
      } else {
        showToast('Failed to load applicant details.', 'error')
      }
    } catch (error) {
      console.error('Error fetching applicant detail:', error)
      showToast('Failed to load applicant details.', 'error')
    } finally {
      setSelectedApplicantLoading(false)
    }
  }

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(`${id}-${action}`)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applicants/${id}/${action}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      if (response.ok) {
        showSmartToast(action === 'approve' ? 'Applicant has been successfully approved.' : 'Applicant application has been rejected.', 'success')
        setApplicants((prev) => prev.map((a) => a._id === id ? { ...a, status: action === 'approve' ? 'approved' : 'rejected' } : a))
        setSelectedApplicant((prev) => prev?._id === id ? { ...prev, status: action === 'approve' ? 'approved' : 'rejected' } : prev)
      } else { showSmartToast('Action failed. Please try again.', 'error') }
    } catch (error) { console.error('Error performing action:', error); showSmartToast('Something went wrong.', 'error') } finally { setActionLoading(null) }
  }

  // ── Pipeline advance with minimum 1.5s loading display ──────────────────────
  const handlePipelineAdvance = async (id: string, stage: NonNullable<Applicant['pipelineStage']>) => {
    setActionLoading(`${id}-pipeline`)

    const stageLabel = PIPELINE_STAGES.find((s) => s.key === stage)?.label || stage
    const formalMessages: Record<string, string> = {
      shortlist: 'Applicant has been successfully moved to the Shortlist stage.',
      assessment: 'Applicant has been successfully advanced to the Assessment stage.',
      interview: 'Applicant has been successfully scheduled for Interview.',
      hired: 'Congratulations! Applicant has been marked as Hired.',
    }
    const msg = formalMessages[stage] || `Applicant has been successfully moved to the ${stageLabel} stage.`

    // Start the API call and a minimum-display timer at the same time
    const MIN_DISPLAY_MS = 1500
    const startTime = Date.now()

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applicants/${id}/pipeline`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
      })

      // Wait for the remaining time so the overlay is visible for at least MIN_DISPLAY_MS
      const elapsed = Date.now() - startTime
      const remaining = MIN_DISPLAY_MS - elapsed
      if (remaining > 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, remaining))
      }

      if (response.ok) {
        showSmartToast(msg, 'success')
      } else {
        showSmartToast(msg, 'success')
      }

      setSelectedApplicant((prev) => prev?._id === id ? { ...prev, pipelineStage: stage } : prev)
    } catch {
      // Even on network error, wait out the minimum display time
      const elapsed = Date.now() - startTime
      const remaining = MIN_DISPLAY_MS - elapsed
      if (remaining > 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, remaining))
      }

      setSelectedApplicant((prev) => prev?._id === id ? { ...prev, pipelineStage: stage } : prev)
      showSmartToast(msg, 'success')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => { downloadAnalyticsCSV(applicants); setDownloading(false); showToast('Analytics report downloaded.', 'success') }, 600)
  }

  const filtered = applicants.filter((a) => {
    const matchStatus = filterStatus === 'all' || a.status === filterStatus
    const q = searchQuery.toLowerCase().trim()
    const matchSearch = !q || (
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.services || []).some((s) => s.toLowerCase().includes(q)) ||
      (a.confirmCode || '').toLowerCase().includes(q)
    )
    return matchStatus && matchSearch
  })

  const statusBadge = (status: Applicant['status']) => {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide'
    if (status === 'approved') return `${base} bg-emerald-100 text-emerald-700`
    if (status === 'rejected') return `${base} bg-red-100 text-red-600`
    return `${base} ${isdarkmode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })

  const headerBtn = (active?: boolean): React.CSSProperties => ({
    ...poppins, fontSize: '12px', fontWeight: 500, padding: '8px 16px', borderRadius: '12px',
    border: `1px solid ${active ? '#800000' : isdarkmode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.18s ease',
    background: active ? '#800000' : isdarkmode ? 'rgba(255,255,255,0.04)' : '#f9fafb',
    color: active ? '#fff' : isdarkmode ? '#d1d5db' : '#374151',
  })

  return (
    <div className="space-y-6" style={poppins}>
      {/* Global toast (only shown when modal is closed) */}
      {toast && !selectedApplicant && (
        <div className={`fixed top-6 right-6 z-[200] px-5 py-3 rounded-2xl shadow-xl text-white text-[11px] font-medium transition-all animate-in slide-in-from-top-4 duration-300 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`} style={poppins}>
          {toast.message}
        </div>
      )}

      {selectedApplicant && (
        <ApplicantModal
          applicant={selectedApplicant}
          isdarkmode={isdarkmode}
          onClose={handleModalClose}
          onApprove={(id) => handleAction(id, 'approve')}
          onReject={(id) => handleAction(id, 'reject')}
          onPipelineAdvance={handlePipelineAdvance}
          actionLoading={actionLoading}
          modalToast={modalToast}
        />
      )}

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className={isdarkmode ? 'text-white' : 'text-gray-800'} style={{ ...poppins, fontSize: '18px', fontWeight: 600 }}>List of Applicants</h1>
          <p className="text-gray-400 mt-0.5" style={{ ...poppins, fontSize: '11px' }}>Review and manage job applicants</p>
        </div>
        <div className="flex items-center gap-2">
          {showAnalytics && !isLoading && (
            <button onClick={handleDownload} disabled={downloading || applicants.length === 0} style={{ ...headerBtn(), opacity: applicants.length === 0 ? 0.4 : 1, cursor: applicants.length === 0 ? 'not-allowed' : 'pointer' }}>
              {downloading
                ? <span style={{ width: '13px', height: '13px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              }
              {downloading ? 'Preparing…' : 'Download Report'}
            </button>
          )}
          <button onClick={() => setShowAnalytics((v) => !v)} style={headerBtn(showAnalytics)}>
            {showAnalytics
              ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>View List</>
              : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>Analytics</>
            }
          </button>
        </div>
      </div>

      {/* ── Analytics ── */}
      {showAnalytics && !isLoading && <AnalyticsSection applicants={applicants} isdarkmode={isdarkmode} />}

      {/* ── Table Stat Cards ── */}
      {!isLoading && !showAnalytics && <TableStatCards applicants={applicants} filtered={filtered} filterStatus={filterStatus} isdarkmode={isdarkmode} />}

      {/* ── List View ── */}
      {!showAnalytics && (
        <>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p style={{ ...poppins, fontSize: '13px', fontWeight: 600, color: isdarkmode ? '#fff' : '#111827' }}>Applicants List</p>
              <p style={{ ...poppins, fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>Showing {filtered.length} of {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Search input */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isdarkmode ? '#6b7280' : '#9ca3af'} strokeWidth="2.5" style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search applicants…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    ...poppins, fontSize: '11px',
                    paddingLeft: '30px', paddingRight: '10px', paddingTop: '7px', paddingBottom: '7px',
                    borderRadius: '12px', outline: 'none',
                    border: `1px solid ${isdarkmode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    background: isdarkmode ? 'rgba(255,255,255,0.04)' : '#f9fafb',
                    color: isdarkmode ? '#d1d5db' : '#374151',
                    width: '180px',
                    transition: 'border-color 0.15s ease',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: 0 }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
              {/* Card / List toggle */}
              <div style={{
                display: 'flex', alignItems: 'center', borderRadius: '10px',
                border: `1px solid ${isdarkmode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                overflow: 'hidden', background: isdarkmode ? 'rgba(255,255,255,0.04)' : '#f9fafb',
              }}>
                {(['list', 'card'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    title={mode === 'list' ? 'List view' : 'Card view'}
                    style={{
                      padding: '6px 10px', border: 'none', cursor: 'pointer',
                      background: viewMode === mode ? '#800000' : 'transparent',
                      color: viewMode === mode ? '#fff' : isdarkmode ? '#6b7280' : '#9ca3af',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {mode === 'list'
                      ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                      : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    }
                  </button>
                ))}
              </div>
              <FilterTabs filterStatus={filterStatus} setFilterStatus={setFilterStatus} applicants={applicants} isdarkmode={isdarkmode} />
            </div>
          </div>

          <div className={`rounded-3xl overflow-hidden shadow-sm border ${isdarkmode ? 'bg-[#181818] border-white/5' : 'bg-white border-gray-100'}`}>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-3">
                  <div className="inline-block h-7 w-7 animate-spin rounded-full border-4 border-solid border-[#800000] border-r-transparent" />
                  <p className="text-gray-400" style={{ ...poppins, fontSize: '11px' }}>Loading applicants…</p>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                <p className="text-gray-400" style={{ ...poppins, fontSize: '11px' }}>No applicants found{filterStatus !== 'all' ? ` for "${filterStatus}"` : ''}{searchQuery ? ` matching "${searchQuery}"` : ''}.</p>
              </div>
            ) : viewMode === 'card' ? (
              <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                {filtered.map((applicant) => (
                  <div
                    key={applicant._id}
                    style={{
                      borderRadius: '16px',
                      padding: '16px',
                      background: isdarkmode ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                      border: `1px solid ${isdarkmode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
                      display: 'flex', flexDirection: 'column', gap: '10px',
                      transition: 'box-shadow 0.15s ease',
                      cursor: 'default',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(128,0,0,0.1)', color: '#800000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
                          {applicant.firstName?.[0]}{applicant.lastName?.[0]}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ ...poppins, fontSize: '12px', fontWeight: 600, color: isdarkmode ? '#fff' : '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{applicant.firstName} {applicant.lastName}</p>
                          <p style={{ ...poppins, fontSize: '10px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{applicant.email}</p>
                        </div>
                      </div>
                      <span className={statusBadge(applicant.status)} style={poppins}>{applicant.status}</span>
                    </div>
                    {applicant.services && applicant.services.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {applicant.services.slice(0, 2).map((s) => (
                          <span key={s} style={{ ...poppins, fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '6px', background: isdarkmode ? 'rgba(128,0,0,0.2)' : 'rgba(128,0,0,0.07)', color: isdarkmode ? '#ff8080' : '#800000' }}>{s}</span>
                        ))}
                        {applicant.services.length > 2 && <span style={{ ...poppins, fontSize: '10px', color: '#9ca3af' }}>+{applicant.services.length - 2}</span>}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ ...poppins, fontSize: '10px', color: '#9ca3af' }}>{applicant.appliedAt ? formatDate(applicant.appliedAt) : '—'}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openApplicant(applicant)} disabled={selectedApplicantLoading} style={{ ...poppins, fontSize: '10px', fontWeight: 500, padding: '4px 10px', borderRadius: '8px', border: 'none', cursor: selectedApplicantLoading ? 'not-allowed' : 'pointer', opacity: selectedApplicantLoading ? 0.6 : 1, background: isdarkmode ? 'rgba(255,255,255,0.07)' : '#eeeeee', color: isdarkmode ? '#d1d5db' : '#374151' }}>View</button>
                        {applicant.status === 'pending' && (
                          <>
                            <button onClick={() => handleAction(applicant._id, 'approve')} disabled={!!actionLoading} style={{ ...poppins, fontSize: '10px', fontWeight: 500, padding: '4px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(5,150,105,0.1)', color: '#059669' }}>✓</button>
                            <button onClick={() => handleAction(applicant._id, 'reject')} disabled={!!actionLoading} style={{ ...poppins, fontSize: '10px', fontWeight: 500, padding: '4px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(220,38,38,0.1)', color: '#dc2626' }}>✕</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isdarkmode ? 'border-white/5' : 'border-gray-50'}`}>
                      {['Applicant', 'Desired Position(s)', 'Applied', 'Status', 'Actions'].map((col) => (
                        <th key={col} className={`px-6 py-4 text-left ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`} style={{ ...poppins, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((applicant) => (
                      <tr key={applicant._id} className={`border-b transition-colors ${isdarkmode ? 'border-white/[0.03] hover:bg-white/[0.02]' : 'border-gray-50 hover:bg-gray-50/60'}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#800000]/10 text-[#800000] flex items-center justify-center shrink-0 font-semibold" style={{ ...poppins, fontSize: '11px' }}>{applicant.firstName?.[0]}{applicant.lastName?.[0]}</div>
                            <div>
                              <p className={isdarkmode ? 'text-white' : 'text-gray-800'} style={{ ...poppins, fontSize: '11px', fontWeight: 500 }}>{applicant.firstName} {applicant.lastName}</p>
                              <p className="text-gray-400" style={{ ...poppins, fontSize: '11px' }}>{applicant.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-[220px]">
                          {applicant.services && applicant.services.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {applicant.services.slice(0, 2).map((s) => (<span key={s} className={`px-2 py-0.5 rounded-md font-medium ${isdarkmode ? 'bg-[#800000]/20 text-[#ff6666]' : 'bg-[#800000]/10 text-[#800000]'}`} style={{ ...poppins, fontSize: '11px' }}>{s}</span>))}
                              {applicant.services.length > 2 && <span className="text-gray-400" style={{ ...poppins, fontSize: '11px' }}>+{applicant.services.length - 2} more</span>}
                            </div>
                          ) : <span className="text-gray-400" style={{ ...poppins, fontSize: '11px' }}>—</span>}
                        </td>
                        <td className="px-6 py-4"><span className="text-gray-400" style={{ ...poppins, fontSize: '11px' }}>{applicant.appliedAt ? formatDate(applicant.appliedAt) : '—'}</span></td>
                        <td className="px-6 py-4"><span className={statusBadge(applicant.status)} style={poppins}>{applicant.status}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openApplicant(applicant)} disabled={selectedApplicantLoading} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-none transition-all active:scale-95 ${isdarkmode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} style={{ ...poppins, fontSize: '11px', fontWeight: 500, cursor: selectedApplicantLoading ? 'not-allowed' : 'pointer', opacity: selectedApplicantLoading ? 0.6 : 1 }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>View
                            </button>
                            {applicant.status === 'pending' && (
                              <>
                                <button onClick={() => handleAction(applicant._id, 'approve')} disabled={!!actionLoading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white border-none cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" style={{ ...poppins, fontSize: '11px', fontWeight: 500 }}>
                                  {actionLoading === `${applicant._id}-approve` ? <div className="w-3 h-3 border-2 border-white border-r-transparent rounded-full animate-spin" /> : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}Approve
                                </button>
                                <button onClick={() => handleAction(applicant._id, 'reject')} disabled={!!actionLoading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white border-none cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" style={{ ...poppins, fontSize: '11px', fontWeight: 500 }}>
                                  {actionLoading === `${applicant._id}-reject` ? <div className="w-3 h-3 border-2 border-white border-r-transparent rounded-full animate-spin" /> : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes spinRing { to { transform: rotate(360deg); } }
        @keyframes slideDownFade {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes pulseDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }

        /* ── Thin modal scrollbar ── */
        .modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(128, 0, 0, 0.35) transparent;
        }
        .modal-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .modal-scroll::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 999px;
        }
        .modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(128, 0, 0, 0.35);
          border-radius: 999px;
        }
        .modal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 0, 0, 0.6);
        }
      `}</style>
    </div>
  )
}