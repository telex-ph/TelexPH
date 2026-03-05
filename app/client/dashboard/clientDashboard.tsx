'use client'
import { useState, useRef, useEffect } from 'react'

// ─── BREAKPOINT ───────────────────────────────────────────────────────────────
function getBreakpoint(w: number): 'mobile' | 'tablet' | 'desktop' {
  return w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'
}

// ─── ICON ─────────────────────────────────────────────────────────────────────
function Ico({ d, size = 16, sw = 1.4 }: { d: string; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const STAT_CARDS = [
  { label: 'Active Services',  value: '4',      trend: '+1 this month',      trendUp: true,  icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',                                              img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80' },
  { label: 'Monthly Spend',    value: '$12,500', trend: '↑ $1,800 vs last',   trendUp: false, icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',                               img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80' },
  { label: 'Pending Renewals', value: '2',       trend: 'Due within 14 days', trendUp: false, icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80' },
  { label: 'Support Tickets',  value: '3',       trend: '↓ 2 resolved',       trendUp: true,  icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',                           img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80' },
]

const ACTIVE_SERVICES = [
  { id: 1, short: 'TSR', name: 'Technical Support Representative',  tier: 'Dedicated Staff', price: '$1,800', billing: 'Monthly',  daysLeft: 14,   status: 'active' as const, color: '#800000', bg: '#fff5f5', progress: 53  },
  { id: 2, short: 'WL',  name: 'White-Label Platform',              tier: 'SaaS & Platform', price: '$7,500', billing: 'Monthly',  daysLeft: 210,  status: 'active' as const, color: '#1d4ed8', bg: '#eff6ff', progress: 84  },
  { id: 3, short: 'SMM', name: 'Social Media Management',           tier: 'Dedicated Staff', price: '$1,800', billing: 'Monthly',  daysLeft: 2,    status: 'ending' as const, color: '#b45309', bg: '#fffbeb', progress: 7   },
  { id: 4, short: 'AI',  name: 'AI Builder (Chatbots / AI Systems)', tier: 'Digital Systems', price: '$5,000', billing: 'One-time', daysLeft: null, status: 'active' as const, color: '#15803d', bg: '#f0fdf4', progress: 100 },
]

const RECENT_ACTIVITY = [
  { id: 1, title: 'Payment Processed',       desc: 'White-Label Platform — $7,500',    time: '2h ago',     icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',                               color: '#15803d', bg: '#f0fdf4' },
  { id: 2, title: 'Renewal Reminder',        desc: 'SMM subscription ends in 2 days',  time: '5h ago',     icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', color: '#d97706', bg: '#fffbeb' },
  { id: 3, title: 'Ticket #SR-2026 Updated', desc: 'System-wide latency — In Progress', time: 'Yesterday', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',                           color: '#1d4ed8', bg: '#eff6ff' },
  { id: 4, title: 'New Service Added',       desc: 'AI Builder setup completed',        time: '3 days ago', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',                                  color: '#800000', bg: '#fff5f5' },
  { id: 5, title: 'Invoice Generated',       desc: 'TSR — $1,800 for June 2025',        time: '4 days ago', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',                              color: '#555',    bg: '#f5f5f5' },
]

const SPEND_BARS = [
  { month: 'Jan', val: 9300  }, { month: 'Feb', val: 9300  }, { month: 'Mar', val: 10700 },
  { month: 'Apr', val: 10700 }, { month: 'May', val: 12500 }, { month: 'Jun', val: 12500 },
]
const MAX_SPEND = Math.max(...SPEND_BARS.map(b => b.val))

const TICKET_TREND = [
  { week: 'W1', open: 8,  resolved: 5  }, { week: 'W2', open: 11, resolved: 7  },
  { week: 'W3', open: 7,  resolved: 9  }, { week: 'W4', open: 14, resolved: 6  },
  { week: 'W5', open: 9,  resolved: 11 }, { week: 'W6', open: 6,  resolved: 13 },
  { week: 'W7', open: 10, resolved: 8  }, { week: 'W8', open: 3,  resolved: 12 },
]

const USAGE_HOURS = [
  { month: 'Jan', TSR: 140, WL: 40, SMM: 90,  AI: 60  }, { month: 'Feb', TSR: 160, WL: 55, SMM: 100, AI: 72  },
  { month: 'Mar', TSR: 155, WL: 60, SMM: 88,  AI: 80  }, { month: 'Apr', TSR: 172, WL: 70, SMM: 95,  AI: 88  },
  { month: 'May', TSR: 168, WL: 82, SMM: 78,  AI: 92  }, { month: 'Jun', TSR: 180, WL: 90, SMM: 60,  AI: 100 },
]
const USAGE_COLORS: Record<string, string> = { TSR: '#800000', WL: '#1d4ed8', SMM: '#b45309', AI: '#15803d' }

const HEATMAP_DATA: number[][] = [
  [0,3,2,5,4,3,1],[2,4,3,6,5,4,0],[1,2,4,3,6,5,2],[0,5,3,4,2,6,1],
  [3,4,2,5,4,3,0],[1,6,4,3,5,2,1],[2,3,5,4,3,6,0],[0,4,3,6,4,5,2],
  [1,2,4,5,3,4,1],[3,5,2,4,6,3,0],
]

const UPTIME_DATA = [
  { label: 'TSR', pct: 99.2, color: '#800000' }, { label: 'WL',  pct: 99.9, color: '#1d4ed8' },
  { label: 'SMM', pct: 97.4, color: '#b45309' }, { label: 'AI',  pct: 98.8, color: '#15803d' },
]

const STATUS_CFG = {
  active: { label: 'Active',      dot: '#16a34a', color: '#15803d', bg: '#dcfce7' },
  ending: { label: 'Ending Soon', dot: '#d97706', color: '#b45309', bg: '#fef3c7' },
  ended:  { label: 'Inactive',    dot: '#9ca3af', color: '#4b5563', bg: '#f3f4f6' },
} as const

const RECOMMENDED = [
  { short: 'CSR', name: 'Customer Service Representative', price: '$1,400', period: '/ month', tag: 'Dedicated Staff', color: '#800000' },
  { short: 'CRM', name: 'CRM System Setup & Management',   price: '$2,500', period: 'setup',   tag: 'Digital Systems', color: '#1d4ed8' },
  { short: 'EM',  name: 'Email Marketing Management',      price: '$1,500', period: '/ month', tag: 'Digital Systems', color: '#15803d' },
]

const SPEND_SLICES = (() => {
  const raw = [
    { label: 'SaaS Platforms',  val: 7500, color: '#1d4ed8' },
    { label: 'Digital Systems', val: 5000, color: '#15803d' },
    { label: 'Dedicated Staff', val: 3600, color: '#800000' },
  ]
  const total = raw.reduce((s, x) => s + x.val, 0)
  const circ  = 2 * Math.PI * 44
  let cumulative = 0
  return {
    total,
    circ,
    slices: raw.map(s => {
      const dash = (s.val / total) * circ
      const rot  = (cumulative / total) * 360 - 90
      cumulative += s.val
      return { ...s, dash, gap: circ - dash, rot }
    }),
  }
})()

// ─── SPARKLINE ────────────────────────────────────────────────────────────────
function Sparkline({ data, color, w = 60, h = 28 }: { data: number[]; color: string; w?: number; h?: number }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const pts = data.map((v, i) => [3 + (i / (data.length - 1)) * (w - 6), 3 + (1 - (v - min) / range) * (h - 6)])
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`sp-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sp-${color.replace('#', '')})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2.5} fill={color} stroke="#fff" strokeWidth={1.2} />
    </svg>
  )
}

// ─── RADIAL GAUGE ─────────────────────────────────────────────────────────────
function RadialGauge({ pct, color, size = 76 }: { pct: number; color: string; size?: number }) {
  const r = size / 2 - 8, circ = 2 * Math.PI * r, filled = (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ede8e8" strokeWidth={7} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={`${filled} ${circ}`} strokeDashoffset={circ / 4} strokeLinecap="round" />
      <text x={size / 2} y={size / 2 - 1} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1a1a2e" fontFamily="Poppins,sans-serif">{pct}%</text>
      <text x={size / 2} y={size / 2 + 9} textAnchor="middle" fontSize="6.5" fill="#888" fontFamily="Poppins,sans-serif">uptime</text>
    </svg>
  )
}

// ─── TICKET CHART ─────────────────────────────────────────────────────────────
function TicketChart({ ticketFocus, setTicketFocus }: {
  ticketFocus: 'open' | 'resolved'
  setTicketFocus: (v: 'open' | 'resolved') => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })

  useEffect(() => {
    if (!containerRef.current) return
    const obs = new ResizeObserver(entries => {
      const e = entries[0]
      if (e) setDims({ w: e.contentRect.width, h: e.contentRect.height })
    })
    obs.observe(containerRef.current)
    const r = containerRef.current.getBoundingClientRect()
    setDims({ w: r.width, h: r.height })
    return () => obs.disconnect()
  }, [])

  const { w: TW, h: TH } = dims
  const padL = 36, padR = 16, padT = 16, padB = 28
  const chartW = TW - padL - padR
  const chartH = TH - padT - padB
  const maxTkt = Math.max(...TICKET_TREND.map(t => Math.max(t.open, t.resolved)))

  const tPts = (key: 'open' | 'resolved') =>
    TICKET_TREND.map((t, i) => [
      padL + (i / (TICKET_TREND.length - 1)) * chartW,
      padT + (1 - t[key] / maxTkt) * chartH,
    ])
  const tLine = (key: 'open' | 'resolved') =>
    tPts(key).map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const tArea = (key: 'open' | 'resolved') => {
    const pts = tPts(key)
    return `${tLine(key)} L${pts[pts.length - 1][0]},${padT + chartH} L${pts[0][0]},${padT + chartH} Z`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Support Ticket Trend</div>
          <div style={{ fontSize: 11, color: '#555', fontWeight: 400, marginTop: 2 }}>Weekly open vs resolved — last 8 weeks</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {(['open', 'resolved'] as const).map(k => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }} onClick={() => setTicketFocus(k)}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: k === 'open' ? '#800000' : '#15803d', opacity: ticketFocus === k ? 1 : 0.35 }} />
              <span style={{ fontSize: 11, color: ticketFocus === k ? '#1a1a2e' : '#888', fontWeight: ticketFocus === k ? 700 : 400, textTransform: 'capitalize' }}>{k}</span>
            </div>
          ))}
        </div>
      </div>

      <div ref={containerRef} style={{ flex: 1, minHeight: 0 }}>
        {TW > 10 && TH > 10 && (
          <svg width="100%" height="100%" viewBox={`0 0 ${TW} ${TH}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="topen2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#800000" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#800000" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="tres2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#15803d" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#15803d" stopOpacity="0.01" />
              </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
              const y = padT + frac * chartH
              const val = Math.round(maxTkt * (1 - frac))
              return (
                <g key={i}>
                  <line x1={padL} y1={y} x2={TW - padR} y2={y} stroke="#ede8e8" strokeWidth={1} />
                  <text x={padL - 6} y={y + 3.5} textAnchor="end" fontSize="9" fill="#888" fontFamily="Poppins,sans-serif">{val}</text>
                </g>
              )
            })}
            <path d={tArea('resolved')} fill="url(#tres2)" opacity={ticketFocus === 'open' ? 0.25 : 1} />
            <path d={tLine('resolved')} fill="none" stroke="#15803d" strokeWidth={ticketFocus === 'resolved' ? 2.5 : 1.5} strokeOpacity={ticketFocus === 'open' ? 0.25 : 1} strokeLinejoin="round" strokeLinecap="round" />
            <path d={tArea('open')} fill="url(#topen2)" opacity={ticketFocus === 'resolved' ? 0.25 : 1} />
            <path d={tLine('open')} fill="none" stroke="#800000" strokeWidth={ticketFocus === 'open' ? 2.5 : 1.5} strokeOpacity={ticketFocus === 'resolved' ? 0.25 : 1} strokeLinejoin="round" strokeLinecap="round" />
            {tPts(ticketFocus).map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i === TICKET_TREND.length - 1 ? 5 : 3.5}
                fill={ticketFocus === 'open' ? '#800000' : '#15803d'} stroke="#fff" strokeWidth={1.8} />
            ))}
            {TICKET_TREND.map((t, i) => {
              const x = padL + (i / (TICKET_TREND.length - 1)) * chartW
              return <text key={i} x={x} y={TH - 6} textAnchor="middle" fontSize="9.5" fill="#888" fontFamily="Poppins,sans-serif">{t.week}</text>
            })}
          </svg>
        )}
      </div>

      {/* Footer stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 12, paddingTop: 12, borderTop: '1px solid #ede8e8', flexShrink: 0 }}>
        {[
          { label: 'Total Open',      value: TICKET_TREND.reduce((a, t) => a + t.open, 0),     color: '#800000' },
          { label: 'Total Resolved',  value: TICKET_TREND.reduce((a, t) => a + t.resolved, 0), color: '#15803d' },
          { label: 'Resolution Rate', value: `${Math.round(TICKET_TREND.reduce((a, t) => a + t.resolved, 0) / TICKET_TREND.reduce((a, t) => a + t.open + t.resolved, 0) * 100)}%`, color: '#1d4ed8' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#555', marginTop: 3, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── SERVICE CARD (mobile/tablet) ─────────────────────────────────────────────
function ServiceCard({ svc }: { svc: typeof ACTIVE_SERVICES[0] }) {
  const st = STATUS_CFG[svc.status]
  return (
    <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: svc.bg, border: `1.5px solid ${svc.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: svc.color, fontWeight: 700, fontSize: 10.5, flexShrink: 0 }}>{svc.short}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{svc.name}</div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 1, fontWeight: 400 }}>{svc.tier}</div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, background: st.bg, color: st.color, flexShrink: 0 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot }} />{st.label}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{svc.price}</div>
          <div style={{ fontSize: 11, color: '#666', fontWeight: 400 }}>{svc.billing}</div>
        </div>
        {svc.daysLeft !== null && (
          <div style={{ fontSize: 11, color: svc.daysLeft <= 3 ? '#dc2626' : '#555', fontWeight: svc.daysLeft <= 3 ? 600 : 400 }}>
            {svc.daysLeft <= 3 ? `⚠ ${svc.daysLeft}d left` : `${svc.daysLeft} days left`}
          </div>
        )}
        {svc.status === 'ending'
          ? <button style={{ fontSize: 11, color: '#800000', background: '#fff5f5', border: '1px solid #f0c8c8', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontWeight: 600, fontFamily: 'Poppins,sans-serif' }}>Renew</button>
          : <button style={{ fontSize: 11, color: '#666', background: '#fff', border: '1px solid #d8d4d4', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontWeight: 500, fontFamily: 'Poppins,sans-serif' }}>Manage</button>
        }
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 11, color: '#555', fontWeight: 500 }}>Cycle</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: svc.progress < 20 ? '#dc2626' : '#1a1a2e' }}>{svc.progress}%</span>
        </div>
        <div style={{ height: 5, background: '#ede8e8', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${svc.progress}%`, borderRadius: 99, background: svc.progress < 20 ? '#dc2626' : svc.color }} />
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ClientDashboard() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [bp, setBp] = useState<'mobile' | 'tablet' | 'desktop' | null>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    setBp(getBreakpoint(el.getBoundingClientRect().width))
    const obs = new ResizeObserver((entries) => {
      setBp(getBreakpoint(entries[0].contentRect.width))
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const isMobile  = bp === 'mobile'
  const isTablet  = bp === 'tablet'
  const isDesktop = bp === 'desktop'

  const [serviceFilter, setServiceFilter] = useState<'all' | 'active' | 'ending'>('all')
  const [spendTab,      setSpendTab]      = useState<'spend' | 'usage'>('spend')
  const [ticketFocus,   setTicketFocus]   = useState<'open' | 'resolved'>('open')

  const visibleServices = serviceFilter === 'all' ? ACTIVE_SERVICES : ACTIVE_SERVICES.filter(s => s.status === serviceFilter)
  const maxUsage = Math.max(...USAGE_HOURS.map(u => u.TSR + u.WL + u.SMM + u.AI))

  const outerPad = isMobile ? '12px' : isTablet ? '16px' : '24px'
  const gap      = isMobile ? 12 : 16

  const { total: donutTotal, slices: donutSlices } = SPEND_SLICES

  return (
    <div ref={rootRef} style={{ fontFamily: "'Poppins',sans-serif", padding: outerPad, background: '#fdfcfc', minHeight: '100vh', visibility: bp === null ? 'hidden' : 'visible' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; font-family: 'Poppins', sans-serif; }

        /* ── Card shell ── */
        .ds { background: #fff; border: 1.5px solid #e0dcdc; border-radius: 16px; padding: 20px 22px; }

        /* ── Service table grid ── */
        .svc-grid { display: grid; grid-template-columns: 40px 1fr 110px 90px 120px 80px; align-items: center; gap: 12px; }
        .svc-row  { padding: 12px 20px; border-bottom: 1px solid #f0eeee; transition: background 0.12s; }
        .svc-row:last-child { border-bottom: none; }
        .svc-row:hover { background: #fdf8f8; }
        .svc-head { padding: 10px 20px; background: #f8f6f6; border-bottom: 1px solid #e8e4e4; border-radius: 12px 12px 0 0; }

        /* ── Filter chips ── */
        .qchip { border: 1px solid #d8d4d4; background: #fff; border-radius: 8px; padding: 5px 12px; font-size: 12px; color: #555; cursor: pointer; transition: all 0.15s; font-weight: 500; font-family: 'Poppins',sans-serif; }
        .qchip.on  { background: #800000; border-color: #800000; color: #fff; font-weight: 600; }
        .qchip:hover:not(.on) { border-color: #c09090; color: #800000; }

        /* ── Mini tabs (Spend / Usage) ── */
        .mtab { border: none; background: transparent; border-radius: 7px; padding: 4px 12px; font-size: 11px; color: #666; cursor: pointer; font-family: 'Poppins', sans-serif; transition: all 0.15s; font-weight: 500; }
        .mtab.on { background: #800000; color: #fff; font-weight: 700; }

        /* ── Status badge ── */
        .sbadge { display: inline-flex; align-items: center; gap: 5px; border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 600; }

        /* ── Action buttons ── */
        .alink   { font-size: 11px; color: #800000; background: #fff5f5; border: 1px solid #f0c8c8; border-radius: 7px; padding: 5px 12px; cursor: pointer; font-weight: 600; transition: all 0.15s; white-space: nowrap; font-family: 'Poppins',sans-serif; }
        .alink:hover { background: #800000; color: #fff; border-color: #800000; }
        .alink.g { background: #fff; color: #666; border-color: #d8d4d4; font-weight: 500; }
        .alink.g:hover { background: #f5f5f5; color: #333; border-color: #bbb; }

        /* ── Activity feed item ── */
        .aitem { display: flex; align-items: flex-start; gap: 13px; padding: 10px 0; border-bottom: 1px solid #f0eeee; }
        .aitem:last-child { border-bottom: none; }

        /* ── Recommended card ── */
        .rcard { border: 1.5px solid #e0dcdc; border-radius: 12px; padding: 13px 16px; display: flex; align-items: center; gap: 10px; transition: all 0.2s; cursor: pointer; background: #fff; }
        .rcard:hover { border-color: #e8b8b8; box-shadow: 0 6px 20px rgba(128,0,0,0.09); transform: translateY(-2px); }

        /* ── Progress bar ── */
        .pbar  { height: 5px; background: #ede8e8; border-radius: 99px; overflow: hidden; }
        .pfill { height: 100%; border-radius: 99px; }

        /* ── Heatmap cell ── */
        .hcell { border-radius: 3px; }
        .hcell:hover { opacity: 0.7; cursor: default; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: isMobile ? 14 : 22, flexWrap: 'wrap', gap: 10 }}>
        <div>
          {/* eyebrow */}
          <p style={{ fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Welcome back,</p>
          {/* page title */}
          <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Client Dashboard</h1>
          {/* subtitle */}
          {!isMobile && <p style={{ fontSize: 13, color: '#555', fontWeight: 400, margin: '3px 0 0' }}>Overview of your active services and account analytics.</p>}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {!isMobile && (
            <div style={{ background: '#fff', border: '1.5px solid #d8d4d4', borderRadius: 9, padding: '7px 14px', fontSize: 12, color: '#555', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
              <Ico d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" size={13} /> Download Report
            </div>
          )}
          <button style={{ background: 'linear-gradient(135deg,#800000,#a82020)', color: '#fff', border: 'none', borderRadius: 9, padding: isMobile ? '7px 14px' : '8px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'Poppins,sans-serif' }}>
            <Ico d="M12 5v14M5 12h14" size={13} sw={2} />{isMobile ? 'Add' : 'Add Service'}
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : isTablet ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? 10 : 14, marginBottom: isMobile ? 14 : 20 }}>
        {STAT_CARDS.map(s => (
          <div key={s.label} style={{ borderRadius: 14, overflow: 'hidden', position: 'relative', minHeight: isMobile ? 80 : 96, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <img src={s.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(90,0,0,0.93) 30%,rgba(70,0,0,0.72) 65%,rgba(30,0,0,0.4) 100%)' }} />
            <div style={{ position: 'relative', zIndex: 2, padding: isMobile ? '12px 14px' : '16px 18px', height: '100%', display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 13 }}>
              {!isMobile && (
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'rgba(255,210,210,0.95)' }}>
                  <Ico d={s.icon} size={16} sw={1.5} />
                </div>
              )}
              <div>
                {/* stat value */}
                <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{s.value}</div>
                {/* stat label */}
                <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: 'rgba(255,255,255,0.92)', marginTop: 2 }}>{s.label}</div>
                {/* stat trend */}
                <div style={{ fontSize: 10, color: s.trendUp ? 'rgba(134,239,172,0.9)' : 'rgba(253,186,116,0.9)', marginTop: 2, fontWeight: 400 }}>{s.trend}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 1: Services + Spend/Usage ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 300px' : '1fr', gap, marginBottom: gap }}>

        {/* ── Services panel ── */}
        <div className="ds" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '12px 14px' : '15px 20px 12px', borderBottom: '1px solid #e8e4e4', flexWrap: 'wrap', gap: 8 }}>
            <div>
              {/* section title */}
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Active Services</div>
              {/* section subtitle */}
              {!isMobile && <div style={{ fontSize: 11, color: '#555', fontWeight: 400, marginTop: 2 }}>Your currently subscribed services</div>}
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              {(['all', 'active', 'ending'] as const).map(f => (
                <button key={f} className={`qchip${serviceFilter === f ? ' on' : ''}`} onClick={() => setServiceFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {!isDesktop ? (
            <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr 1fr' : '1fr', gap: 10, padding: isMobile ? '12px 14px' : '14px 16px' }}>
              {visibleServices.map(svc => <ServiceCard key={svc.id} svc={svc} />)}
              {visibleServices.length === 0 && <div style={{ textAlign: 'center', color: '#666', fontSize: 13, padding: '20px 0', fontWeight: 400 }}>No services match this filter.</div>}
            </div>
          ) : (
            <>
              <div className="svc-grid svc-head">
                {['', 'Service', 'Status', 'Price', 'Cycle Progress', 'Action'].map((h, i) => (
                  <div key={i} style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: i === 5 ? 'right' : 'left' }}>{h}</div>
                ))}
              </div>
              {visibleServices.map(svc => {
                const st = STATUS_CFG[svc.status]
                return (
                  <div key={svc.id} className="svc-grid svc-row">
                    {/* avatar */}
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: svc.bg, border: `1.5px solid ${svc.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: svc.color, fontWeight: 700, fontSize: 10.5, flexShrink: 0 }}>{svc.short}</div>
                    {/* name + tier */}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{svc.name}</div>
                      <div style={{ fontSize: 11, color: '#666', marginTop: 1, fontWeight: 400 }}>{svc.tier}</div>
                    </div>
                    {/* status */}
                    <div>
                      <span className="sbadge" style={{ background: st.bg, color: st.color }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot }} />{st.label}
                      </span>
                      {svc.daysLeft !== null && (
                        <div style={{ fontSize: 11, color: svc.daysLeft <= 3 ? '#dc2626' : '#555', marginTop: 3, fontWeight: svc.daysLeft <= 3 ? 600 : 400 }}>
                          {svc.daysLeft <= 3 ? `⚠ ${svc.daysLeft}d left` : `${svc.daysLeft} days left`}
                        </div>
                      )}
                    </div>
                    {/* price */}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{svc.price}</div>
                      <div style={{ fontSize: 11, color: '#666', marginTop: 1, fontWeight: 400 }}>{svc.billing}</div>
                    </div>
                    {/* progress */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: '#555', fontWeight: 500 }}>Cycle</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: svc.progress < 20 ? '#dc2626' : '#1a1a2e' }}>{svc.progress}%</span>
                      </div>
                      <div className="pbar"><div className="pfill" style={{ width: `${svc.progress}%`, background: svc.progress < 20 ? '#dc2626' : svc.color }} /></div>
                    </div>
                    {/* action */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {svc.status === 'ending' ? <button className="alink">Renew</button> : <button className="alink g">Manage</button>}
                    </div>
                  </div>
                )
              })}
              {visibleServices.length === 0 && <div style={{ padding: '28px', textAlign: 'center', color: '#666', fontSize: 13, fontWeight: 400 }}>No services match this filter.</div>}
            </>
          )}
        </div>

        {/* ── Spend / Usage chart ── */}
        <div className="ds" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{spendTab === 'spend' ? 'Monthly Spend' : 'Usage Hours'}</div>
              <div style={{ fontSize: 11, color: '#555', fontWeight: 400, marginTop: 2 }}>Last 6 months</div>
            </div>
            <div style={{ display: 'flex', gap: 3, background: '#ede8e8', padding: 3, borderRadius: 8 }}>
              <button className={`mtab${spendTab === 'spend' ? ' on' : ''}`} onClick={() => setSpendTab('spend')}>Spend</button>
              <button className={`mtab${spendTab === 'usage' ? ' on' : ''}`} onClick={() => setSpendTab('usage')}>Usage</button>
            </div>
          </div>

          {spendTab === 'spend' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 110, flex: 1, marginBottom: 10 }}>
                {SPEND_BARS.map((b, i) => {
                  const isLast = i === SPEND_BARS.length - 1
                  const barH = (b.val / MAX_SPEND) * 88
                  return (
                    <div key={b.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                      {isLast
                        ? <div style={{ fontSize: 9.5, fontWeight: 700, color: '#800000', background: '#fff0f0', border: '1px solid #f0c8c8', borderRadius: 4, padding: '1px 5px', whiteSpace: 'nowrap' }}>${(b.val / 1000).toFixed(1)}k</div>
                        : <div style={{ height: 18 }} />
                      }
                      <div style={{ width: '100%', borderRadius: 5, height: `${barH}px`, background: isLast ? 'linear-gradient(180deg,#a82020,#800000)' : '#f5d0d0', boxShadow: isLast ? '0 4px 12px rgba(128,0,0,0.28)' : 'none' }} />
                      <span style={{ fontSize: 10, color: isLast ? '#800000' : '#888', fontWeight: isLast ? 700 : 400 }}>{b.month}</span>
                    </div>
                  )
                })}
              </div>
              <div style={{ borderTop: '1px solid #ede8e8', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Current</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#800000', letterSpacing: '-0.02em' }}>$12,500</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>vs Last</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>↑ $1,800</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 110, flex: 1, marginBottom: 10 }}>
                {USAGE_HOURS.map((u, i) => {
                  const total = u.TSR + u.WL + u.SMM + u.AI
                  const barH = (total / maxUsage) * 88
                  const isLast = i === USAGE_HOURS.length - 1
                  const segs = (['TSR', 'WL', 'SMM', 'AI'] as const).map(k => ({ k, h: (u[k] / total) * barH }))
                  return (
                    <div key={u.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      {isLast
                        ? <div style={{ fontSize: 9.5, fontWeight: 700, color: '#800000', background: '#fff0f0', border: '1px solid #f0c8c8', borderRadius: 4, padding: '1px 4px' }}>{total}h</div>
                        : <div style={{ height: 18 }} />
                      }
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column-reverse', borderRadius: 5, overflow: 'hidden', height: `${barH}px` }}>
                        {segs.map(seg => <div key={seg.k} style={{ width: '100%', height: `${seg.h}px`, background: USAGE_COLORS[seg.k], opacity: isLast ? 1 : 0.5 }} />)}
                      </div>
                      <span style={{ fontSize: 10, color: isLast ? '#800000' : '#888', fontWeight: isLast ? 700 : 400 }}>{u.month}</span>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, borderTop: '1px solid #ede8e8', paddingTop: 10 }}>
                {Object.entries(USAGE_COLORS).map(([k, c]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#444', fontWeight: 500 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{k}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Row 2: Ticket Trend + Uptime Gauges ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 280px' : isTablet ? '1fr 220px' : '1fr', gap, marginBottom: gap }}>
        <div className="ds" style={{ display: 'flex', flexDirection: 'column', minHeight: isMobile ? 260 : 320 }}>
          <TicketChart ticketFocus={ticketFocus} setTicketFocus={setTicketFocus} />
        </div>

        {/* Uptime gauges */}
        <div className="ds">
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Service Uptime</div>
          <div style={{ fontSize: 11, color: '#555', fontWeight: 400, marginBottom: 18 }}>Last 30-day average</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(4,1fr)' : '1fr 1fr', gap: isMobile ? 6 : 16 }}>
            {UPTIME_DATA.map(u => (
              <div key={u.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <RadialGauge pct={u.pct} color={u.color} size={isMobile ? 60 : 76} />
                <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 700, color: u.color }}>{u.label}</div>
                {!isMobile && <div style={{ fontSize: 10, color: '#555', fontWeight: 500 }}>{u.pct >= 99 ? 'Excellent' : u.pct >= 98 ? 'Good' : 'Fair'}</div>}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #ede8e8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: '#555', fontWeight: 500 }}>Overall avg</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#15803d' }}>
                {(UPTIME_DATA.reduce((a, u) => a + u.pct, 0) / UPTIME_DATA.length).toFixed(1)}%
              </span>
            </div>
            <div className="pbar" style={{ height: 6 }}>
              <div className="pfill" style={{ width: `${UPTIME_DATA.reduce((a, u) => a + u.pct, 0) / UPTIME_DATA.length}%`, background: 'linear-gradient(90deg,#800000,#15803d)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Heatmap + Spend Donut ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 220px' : isTablet ? '1fr 200px' : '1fr', gap, marginBottom: gap }}>
        {/* Heatmap */}
        <div className="ds">
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Service Activity Heatmap</div>
          <div style={{ fontSize: 11, color: '#555', fontWeight: 400, marginBottom: 14 }}>Daily interactions across all services — last 10 weeks</div>
          <div style={{ display: 'flex', gap: 3 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 18, marginRight: 2 }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                <div key={d} style={{ height: isMobile ? 11 : 14, fontSize: isMobile ? 7 : 9, color: '#888', lineHeight: isMobile ? '11px' : '14px', textAlign: 'right', fontWeight: 500, visibility: i % 2 === 0 ? 'visible' : 'hidden' }}>{d}</div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
                {HEATMAP_DATA.map((_, wi) => (
                  <div key={wi} style={{ flex: 1, fontSize: isMobile ? 7 : 9, color: '#888', textAlign: 'center', fontWeight: 500 }}>W{wi + 1}</div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[0, 1, 2, 3, 4, 5, 6].map(dayIdx => (
                  <div key={dayIdx} style={{ display: 'flex', gap: 3 }}>
                    {HEATMAP_DATA.map((week, wi) => {
                      const val = week[dayIdx] ?? 0
                      const bg = val === 0 ? '#ede8e8' : val === 1 ? '#fddada' : val === 2 ? '#f0a0a0' : val === 3 ? '#c85050' : val === 4 ? '#a02828' : '#800000'
                      return <div key={wi} className="hcell" title={`${val} events`} style={{ flex: 1, aspectRatio: '1/1', minHeight: isMobile ? 10 : 14, maxHeight: isMobile ? 16 : 18, background: bg, borderRadius: 3 }} />
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 12, paddingTop: 10, borderTop: '1px solid #ede8e8', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#555', fontWeight: 500 }}>Less</span>
            {['#ede8e8', '#fddada', '#f0a0a0', '#c85050', '#a02828', '#800000'].map(c => (
              <div key={c} style={{ width: isMobile ? 10 : 12, height: isMobile ? 10 : 12, borderRadius: 2, background: c }} />
            ))}
            <span style={{ fontSize: 11, color: '#555', fontWeight: 500 }}>More</span>
          </div>
        </div>

        {/* Spend Donut */}
        <div className="ds" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Spend Split</div>
          <div style={{ fontSize: 11, color: '#555', fontWeight: 400, marginBottom: 16 }}>By service category</div>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center', gap: isMobile ? 16 : 14, flex: 1, flexWrap: 'wrap' }}>
            <svg width={110} height={110} viewBox="0 0 110 110" style={{ flexShrink: 0 }}>
              {donutSlices.map((s, i) => (
                <circle key={i} cx={55} cy={55} r={44} fill="none" stroke={s.color} strokeWidth={13}
                  strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={0}
                  transform={`rotate(${s.rot} 55 55)`} strokeLinecap="round" />
              ))}
              <text x={55} y={51} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1a1a2e" fontFamily="Poppins,sans-serif">${(donutTotal / 1000).toFixed(1)}k</text>
              <text x={55} y={64} textAnchor="middle" fontSize="8" fill="#666" fontFamily="Poppins,sans-serif" fontWeight="500">per month</text>
            </svg>
            <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {donutSlices.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#444', flex: 1, fontWeight: 400 }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>${(s.val / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: Activity Feed + Recommended ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap }}>

        {/* Activity Feed */}
        <div className="ds">
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Recent Activity</div>
          <div style={{ fontSize: 11, color: '#555', fontWeight: 400, marginBottom: 14 }}>Latest updates across your account</div>
          {RECENT_ACTIVITY.map(item => (
            <div key={item.id} className="aitem">
              <div style={{ width: 34, height: 34, borderRadius: 9, background: item.bg, border: `1px solid ${item.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: item.color }}>
                <Ico d={item.icon} size={14} sw={1.6} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* activity title */}
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{item.title}</div>
                {/* activity desc */}
                <div style={{ fontSize: 11, color: '#555', marginTop: 2, fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.desc}</div>
              </div>
              {/* time */}
              <div style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap', fontWeight: 400, flexShrink: 0, marginLeft: 8 }}>{item.time}</div>
            </div>
          ))}
        </div>

        {/* Recommended */}
        <div className="ds">
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Recommended for You</div>
          <div style={{ fontSize: 11, color: '#555', fontWeight: 400, marginBottom: 14 }}>Services that complement your current plan</div>
          {RECOMMENDED.map((r, idx) => {
            const sparkData = [[3, 5, 4, 6, 5, 8, 7], [2, 4, 3, 5, 6, 5, 8], [1, 3, 2, 4, 3, 6, 5]][idx]
            return (
              <div key={r.short} className="rcard" style={{ marginBottom: idx < RECOMMENDED.length - 1 ? 8 : 0 }}>
                {/* avatar */}
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${r.color}14`, border: `1.5px solid ${r.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: r.color, fontWeight: 700, fontSize: 10.5, flexShrink: 0 }}>
                  {r.short}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* rec name */}
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                  {/* rec tag */}
                  <div style={{ fontSize: 10, color: '#666', marginTop: 1, fontWeight: 500 }}>{r.tag}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                  <Sparkline data={sparkData} color={r.color} w={60} h={26} />
                  <div style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.price}
                    <span style={{ fontSize: 10, color: '#666', fontWeight: 400, marginLeft: 3 }}>{r.period}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}