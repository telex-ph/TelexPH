'use client'
import { useState, useRef, useEffect } from 'react'

// ─── BREAKPOINT ───────────────────────────────────────────────────────────────
function getBreakpoint(w: number): 'mobile' | 'tablet' | 'desktop' {
  return w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'
}

// ─── ICON ─────────────────────────────────────────────────────────────────────
function Ico({ d, d2, size = 16, sw = 1.4 }: { d: string; d2?: string; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />{d2 && <path d={d2} />}
    </svg>
  )
}

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// From reference image:
// Background: #E7E7E7
// Card: white raised with double shadow
//   -10px -10px 30px 0 #FFFFFF 100%   ← white highlight (top-left)
//    10px  10px 30px 0 #CACAEC 100%   ← soft purple-grey shadow (bottom-right)
const BG        = '#E7E7E7'
const NEU_CARD  = 'box-shadow: -10px -10px 30px 0px #FFFFFF, 10px 10px 30px 0px #CACAEC;'
const CARD_BG   = '#E7E7E7'
const PRIMARY   = '#800000'
const TEXT_MAIN = '#2a2a2a'
const TEXT_SUB  = '#888'

// ─── DATA ─────────────────────────────────────────────────────────────────────
const STAT_CARDS = [
  { label: 'Active VAs',       value: '5',      trend: '+1 hired this month', trendUp: true,  icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', icon2: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { label: 'Tasks Completed',  value: '248',    trend: '↑ 34 vs last month',  trendUp: true,  icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', icon2: undefined },
  { label: 'Monthly Spend',    value: '$8,400', trend: '↑ $600 vs last',      trendUp: false, icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', icon2: undefined },
  { label: 'Avg. Performance', value: '92%',    trend: '↑ 3% this week',      trendUp: true,  icon: 'M18 20V10M12 20V4M6 20v-6', icon2: undefined },
]

const MY_VAS = [
  { id: 1, name: 'Maria Santos',    role: 'Executive VA',        avatar: 'MS', color: '#800000', status: 'active' as const, hoursUsed: 76, hoursTotal: 80, tasksOpen: 4,  tasksDone: 38, rating: 4.9 },
  { id: 2, name: 'John Reyes',      role: 'Social Media VA',     avatar: 'JR', color: '#1d4ed8', status: 'active' as const, hoursUsed: 64, hoursTotal: 80, tasksOpen: 6,  tasksDone: 52, rating: 4.7 },
  { id: 3, name: 'Lea Cruz',        role: 'Data Entry VA',       avatar: 'LC', color: '#15803d', status: 'active' as const, hoursUsed: 55, hoursTotal: 80, tasksOpen: 2,  tasksDone: 61, rating: 4.8 },
  { id: 4, name: 'Carlo Bautista',  role: 'Customer Support VA', avatar: 'CB', color: '#b45309', status: 'active' as const, hoursUsed: 48, hoursTotal: 80, tasksOpen: 9,  tasksDone: 44, rating: 4.5 },
  { id: 5, name: 'Nina Villanueva', role: 'Research VA',         avatar: 'NV', color: '#7c3aed', status: 'ending' as const, hoursUsed: 20, hoursTotal: 40, tasksOpen: 1,  tasksDone: 18, rating: 4.6 },
]

const RECENT_ACTIVITY = [
  { id: 1, title: 'Task Completed',       desc: 'Maria — "Q2 Report Formatting"',        time: '1h ago',     icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', color: '#15803d' },
  { id: 2, title: 'New Application',      desc: 'VA applicant for Content Writing role', time: '3h ago',     icon: 'M14 2H6a2 2 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',              color: '#1d4ed8' },
  { id: 3, title: 'Invoice Generated',    desc: 'John Reyes — $1,680 for June 2025',     time: 'Yesterday',  icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',              color: '#800000' },
  { id: 4, title: 'Contract Ending Soon', desc: 'Nina Villanueva — 5 days remaining',    time: 'Yesterday',  icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', color: '#d97706' },
  { id: 5, title: 'Performance Review',   desc: 'Lea Cruz — rated 4.8 / 5.0',            time: '2 days ago', icon: 'M18 20V10M12 20V4M6 20v-6',                                                color: '#7c3aed' },
]

const HOURS_TREND = [
  { month: 'Jan', hours: 260 }, { month: 'Feb', hours: 290 }, { month: 'Mar', hours: 310 },
  { month: 'Apr', hours: 300 }, { month: 'May', hours: 340 }, { month: 'Jun', hours: 363 },
]
const MAX_HOURS = Math.max(...HOURS_TREND.map(h => h.hours))

const PERF_DATA = [
  { name: 'Maria S.',  score: 98, color: '#800000' },
  { name: 'Lea C.',    score: 96, color: '#15803d' },
  { name: 'John R.',   score: 94, color: '#1d4ed8' },
  { name: 'Nina V.',   score: 92, color: '#7c3aed' },
  { name: 'Carlo B.',  score: 90, color: '#b45309' },
]

const TASK_TREND = [
  { week: 'W1', completed: 28, pending: 12 }, { week: 'W2', completed: 34, pending: 9  },
  { week: 'W3', completed: 30, pending: 14 }, { week: 'W4', completed: 42, pending: 8  },
  { week: 'W5', completed: 38, pending: 10 }, { week: 'W6', completed: 45, pending: 6  },
  { week: 'W7', completed: 40, pending: 11 }, { week: 'W8', completed: 52, pending: 5  },
]

const HEATMAP_DATA: number[][] = [
  [0,2,3,5,4,2,1],[2,3,4,6,5,3,0],[1,3,4,3,5,4,2],[0,4,3,5,3,5,1],
  [2,3,2,4,4,3,0],[1,5,4,3,4,2,1],[2,3,4,4,3,5,0],[0,4,3,5,4,4,2],
  [1,2,4,4,3,3,1],[2,4,3,5,5,3,0],
]

const SPEND_SLICES = (() => {
  const raw = [
    { label: 'Executive VA',    val: 2400, color: '#800000' },
    { label: 'Social Media VA', val: 1680, color: '#1d4ed8' },
    { label: 'Data Entry VA',   val: 1320, color: '#15803d' },
    { label: 'Customer Supp.',  val: 1800, color: '#b45309' },
    { label: 'Research VA',     val: 1200, color: '#7c3aed' },
  ]
  const total = raw.reduce((s, x) => s + x.val, 0)
  const circ  = 2 * Math.PI * 44
  let cumulative = 0
  return {
    total,
    slices: raw.map(s => {
      const dash = (s.val / total) * circ
      const rot  = (cumulative / total) * 360 - 90
      cumulative += s.val
      return { ...s, dash, gap: circ - dash, rot }
    }),
  }
})()

const UPCOMING_TASKS = [
  { id: 1, title: 'Monthly performance review',    assignee: 'Maria Santos',   due: 'Today',     priority: 'high'   as const },
  { id: 2, title: "Renew Nina's contract",          assignee: 'Admin',          due: 'In 5 days', priority: 'high'   as const },
  { id: 3, title: 'Onboard new Data Entry VA',     assignee: 'HR Team',        due: 'Next week', priority: 'medium' as const },
  { id: 4, title: 'Update SOPs for customer team', assignee: 'Carlo Bautista', due: 'Next week', priority: 'low'    as const },
]

const PRIORITY_CFG = {
  high:   { label: 'High',   color: '#dc2626', bg: 'rgba(220,38,38,0.12)' },
  medium: { label: 'Medium', color: '#d97706', bg: 'rgba(217,119,6,0.12)' },
  low:    { label: 'Low',    color: '#16a34a', bg: 'rgba(22,163,74,0.12)' },
} as const

const STATUS_CFG = {
  active: { label: 'Active',      dot: '#16a34a', color: '#15803d', bg: 'rgba(21,128,61,0.1)' },
  ending: { label: 'Ending Soon', dot: '#d97706', color: '#b45309', bg: 'rgba(180,83,9,0.1)'  },
  ended:  { label: 'Inactive',    dot: '#9ca3af', color: '#4b5563', bg: 'rgba(75,85,99,0.1)'  },
} as const

// ─── SPARKLINE ────────────────────────────────────────────────────────────────
function Sparkline({ data, color, w = 60, h = 28 }: { data: number[]; color: string; w?: number; h?: number }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const pts = data.map((v, i) => [3 + (i / (data.length - 1)) * (w - 6), 3 + (1 - (v - min) / range) * (h - 6)])
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`sp-va-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sp-va-${color.replace('#', '')})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2.5} fill={color} stroke={CARD_BG} strokeWidth={1.2} />
    </svg>
  )
}

// ─── TASK CHART ───────────────────────────────────────────────────────────────
function TaskChart({ taskFocus, setTaskFocus }: {
  taskFocus: 'completed' | 'pending'
  setTaskFocus: (v: 'completed' | 'pending') => void
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
  const maxVal = Math.max(...TASK_TREND.map(t => Math.max(t.completed, t.pending)))

  const tPts = (key: 'completed' | 'pending') =>
    TASK_TREND.map((t, i) => [
      padL + (i / (TASK_TREND.length - 1)) * chartW,
      padT + (1 - t[key] / maxVal) * chartH,
    ])
  const tLine = (key: 'completed' | 'pending') =>
    tPts(key).map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const tArea = (key: 'completed' | 'pending') => {
    const pts = tPts(key)
    return `${tLine(key)} L${pts[pts.length - 1][0]},${padT + chartH} L${pts[0][0]},${padT + chartH} Z`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN }}>Task Completion Trend</div>
          <div style={{ fontSize: 11, color: TEXT_SUB, fontWeight: 400, marginTop: 2 }}>Weekly completed vs pending — last 8 weeks</div>
        </div>
        <div style={{ display: 'flex', gap: 6, background: 'rgba(0,0,0,0.04)', padding: '4px 6px', borderRadius: 10 }}>
          {(['completed', 'pending'] as const).map(k => (
            <button key={k} onClick={() => setTaskFocus(k)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', background: taskFocus === k ? CARD_BG : 'transparent', boxShadow: taskFocus === k ? '-3px -3px 8px #fff, 3px 3px 8px #CACAEC' : 'none', fontFamily: 'Poppins,sans-serif', fontSize: 11, fontWeight: taskFocus === k ? 700 : 400, color: taskFocus === k ? TEXT_MAIN : TEXT_SUB, transition: 'all 0.15s' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: k === 'completed' ? '#15803d' : '#800000', opacity: taskFocus === k ? 1 : 0.4 }} />
              <span style={{ textTransform: 'capitalize' }}>{k}</span>
            </button>
          ))}
        </div>
      </div>

      <div ref={containerRef} style={{ flex: 1, minHeight: 0 }}>
        {TW > 10 && TH > 10 && (
          <svg width="100%" height="100%" viewBox={`0 0 ${TW} ${TH}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="va-tcmp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#15803d" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#15803d" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="va-tpnd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#800000" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#800000" stopOpacity="0.01" />
              </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
              const y = padT + frac * chartH
              const val = Math.round(maxVal * (1 - frac))
              return (
                <g key={i}>
                  <line x1={padL} y1={y} x2={TW - padR} y2={y} stroke="rgba(0,0,0,0.07)" strokeWidth={1} />
                  <text x={padL - 6} y={y + 3.5} textAnchor="end" fontSize="9" fill={TEXT_SUB} fontFamily="Poppins,sans-serif">{val}</text>
                </g>
              )
            })}
            <path d={tArea('completed')} fill="url(#va-tcmp)" opacity={taskFocus === 'pending' ? 0.2 : 1} />
            <path d={tLine('completed')} fill="none" stroke="#15803d" strokeWidth={taskFocus === 'completed' ? 2.5 : 1.5} strokeOpacity={taskFocus === 'pending' ? 0.2 : 1} strokeLinejoin="round" strokeLinecap="round" />
            <path d={tArea('pending')} fill="url(#va-tpnd)" opacity={taskFocus === 'completed' ? 0.2 : 1} />
            <path d={tLine('pending')} fill="none" stroke="#800000" strokeWidth={taskFocus === 'pending' ? 2.5 : 1.5} strokeOpacity={taskFocus === 'completed' ? 0.2 : 1} strokeLinejoin="round" strokeLinecap="round" />
            {tPts(taskFocus).map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i === TASK_TREND.length - 1 ? 5 : 3.5}
                fill={taskFocus === 'completed' ? '#15803d' : '#800000'} stroke={CARD_BG} strokeWidth={1.8} />
            ))}
            {TASK_TREND.map((t, i) => {
              const x = padL + (i / (TASK_TREND.length - 1)) * chartW
              return <text key={i} x={x} y={TH - 6} textAnchor="middle" fontSize="9.5" fill={TEXT_SUB} fontFamily="Poppins,sans-serif">{t.week}</text>
            })}
          </svg>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)', flexShrink: 0 }}>
        {[
          { label: 'Total Completed', value: TASK_TREND.reduce((a, t) => a + t.completed, 0),  color: '#15803d' },
          { label: 'Total Pending',   value: TASK_TREND.reduce((a, t) => a + t.pending, 0),    color: '#800000' },
          { label: 'Completion Rate', value: `${Math.round(TASK_TREND.reduce((a, t) => a + t.completed, 0) / TASK_TREND.reduce((a, t) => a + t.completed + t.pending, 0) * 100)}%`, color: '#1d4ed8' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 10, background: CARD_BG, boxShadow: 'inset 2px 2px 6px #CACAEC, inset -2px -2px 6px #fff' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: 9.5, color: TEXT_SUB, marginTop: 2, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── VA CARD (mobile / tablet) ────────────────────────────────────────────────
function VACard({ va }: { va: typeof MY_VAS[0] }) {
  const st = STATUS_CFG[va.status]
  const hp = Math.round((va.hoursUsed / va.hoursTotal) * 100)
  return (
    <div style={{ background: CARD_BG, borderRadius: 18, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '-10px -10px 30px 0px #FFFFFF, 10px 10px 30px 0px #CACAEC' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: CARD_BG, boxShadow: `-4px -4px 10px #fff, 4px 4px 10px #CACAEC`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: va.color, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{va.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_MAIN, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{va.name}</div>
          <div style={{ fontSize: 11, color: TEXT_SUB, marginTop: 1, fontWeight: 400 }}>{va.role}</div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 600, background: st.bg, color: st.color, flexShrink: 0 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot }} />{st.label}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {[{ label: 'Done', val: va.tasksDone, color: '#15803d' }, { label: 'Open', val: va.tasksOpen, color: '#800000' }, { label: 'Rating', val: `★ ${va.rating}`, color: '#b45309' }].map(m => (
          <div key={m.label} style={{ flex: 1, textAlign: 'center', padding: '8px 4px', borderRadius: 12, background: CARD_BG, boxShadow: 'inset 2px 2px 6px #CACAEC, inset -2px -2px 6px #fff' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: m.color }}>{m.val}</div>
            <div style={{ fontSize: 10, color: TEXT_SUB, marginTop: 1 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: TEXT_SUB, fontWeight: 500 }}>Hours Used</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: hp >= 90 ? '#dc2626' : TEXT_MAIN }}>{va.hoursUsed}/{va.hoursTotal}h</span>
        </div>
        <div style={{ height: 6, background: CARD_BG, borderRadius: 99, overflow: 'hidden', boxShadow: 'inset 2px 2px 5px #CACAEC, inset -2px -2px 5px #fff' }}>
          <div style={{ height: '100%', width: `${hp}%`, borderRadius: 99, background: hp >= 90 ? '#dc2626' : va.color }} />
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function VADashboard() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [bp, setBp] = useState<'mobile' | 'tablet' | 'desktop' | null>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    setBp(getBreakpoint(el.getBoundingClientRect().width))
    const obs = new ResizeObserver(entries => { setBp(getBreakpoint(entries[0].contentRect.width)) })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const isMobile  = bp === 'mobile'
  const isTablet  = bp === 'tablet'
  const isDesktop = bp === 'desktop'

  const [vaFilter,  setVaFilter]  = useState<'all' | 'active' | 'ending'>('all')
  const [hoursTab,  setHoursTab]  = useState<'hours' | 'performance'>('hours')
  const [taskFocus, setTaskFocus] = useState<'completed' | 'pending'>('completed')

  const visibleVAs = vaFilter === 'all' ? MY_VAS : MY_VAS.filter(v => v.status === vaFilter)
  const outerPad   = isMobile ? '12px' : isTablet ? '16px' : '24px'
  const gap        = isMobile ? 12 : 16

  const { total: donutTotal, slices: donutSlices } = SPEND_SLICES

  // Neumorphic card style
  const card: React.CSSProperties = {
    background: CARD_BG,
    borderRadius: 20,
    padding: '20px 22px',
    boxShadow: '-10px -10px 30px 0px #FFFFFF, 10px 10px 30px 0px #CACAEC',
  }

  // Inset (pressed) style for small metric tiles
  const inset: React.CSSProperties = {
    background: CARD_BG,
    borderRadius: 12,
    boxShadow: 'inset 3px 3px 8px #CACAEC, inset -3px -3px 8px #fff',
  }

  return (
    <div ref={rootRef} style={{ fontFamily: "'Poppins',sans-serif", padding: outerPad, background: BG, minHeight: '100vh', visibility: bp === null ? 'hidden' : 'visible' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; font-family: 'Poppins', sans-serif; }

        .va-grid { display: grid; grid-template-columns: 42px 1fr 120px 90px 90px 90px 90px; align-items: center; gap: 12px; }
        .va-row  { padding: 12px 20px; border-bottom: 1px solid rgba(0,0,0,0.05); transition: background 0.12s; }
        .va-row:last-child { border-bottom: none; }
        .va-row:hover { background: rgba(255,255,255,0.5); }
        .va-head { padding: 10px 20px; background: rgba(0,0,0,0.03); border-bottom: 1px solid rgba(0,0,0,0.05); border-radius: 16px 16px 0 0; }

        .qchip { border: none; background: ${CARD_BG}; border-radius: 10px; padding: 6px 14px; font-size: 12px; color: ${TEXT_SUB}; cursor: pointer; transition: all 0.15s; font-weight: 500; font-family: 'Poppins',sans-serif; box-shadow: -4px -4px 10px #fff, 4px 4px 10px #CACAEC; }
        .qchip.on  { box-shadow: inset 3px 3px 8px #CACAEC, inset -3px -3px 8px #fff; color: #800000; font-weight: 700; }
        .qchip:hover:not(.on) { box-shadow: -6px -6px 14px #fff, 6px 6px 14px #CACAEC; }

        .mtab { border: none; background: transparent; border-radius: 8px; padding: 5px 12px; font-size: 11px; color: ${TEXT_SUB}; cursor: pointer; font-family: 'Poppins', sans-serif; transition: all 0.15s; font-weight: 500; }
        .mtab.on { background: ${CARD_BG}; color: #800000; font-weight: 700; box-shadow: -3px -3px 8px #fff, 3px 3px 8px #CACAEC; }

        .aitem { display: flex; align-items: flex-start; gap: 13px; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .aitem:last-child { border-bottom: none; }

        .trow { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .trow:last-child { border-bottom: none; }

        .hcell { border-radius: 4px; transition: opacity 0.1s; }
        .hcell:hover { opacity: 0.7; cursor: default; }

        .neu-btn { background: ${CARD_BG}; border: none; border-radius: 12px; cursor: pointer; font-family: 'Poppins',sans-serif; box-shadow: -5px -5px 12px #fff, 5px 5px 12px #CACAEC; transition: all 0.15s; }
        .neu-btn:active { box-shadow: inset 3px 3px 8px #CACAEC, inset -3px -3px 8px #fff; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: isMobile ? 14 : 24, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <p style={{ fontSize: 11, color: TEXT_SUB, fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Virtual Assistant</p>
          <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: TEXT_MAIN, margin: 0, letterSpacing: '-0.02em' }}>VA Dashboard</h1>
          {!isMobile && <p style={{ fontSize: 13, color: TEXT_SUB, fontWeight: 400, margin: '4px 0 0' }}>Overview of your Virtual Assistant team — performance, tasks, and spend.</p>}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {!isMobile && (
            <button className="neu-btn" style={{ padding: '9px 16px', fontSize: 12, color: TEXT_SUB, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 7 }}>
              <Ico d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" d2="M14 2v6h6" size={13} /> Download Report
            </button>
          )}
          <button className="neu-btn" style={{ padding: isMobile ? '9px 14px' : '9px 20px', fontSize: 12, fontWeight: 700, color: '#800000', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Ico d="M12 5v14M5 12h14" size={13} sw={2} />{isMobile ? 'Hire' : 'Hire a VA'}
          </button>
        </div>
      </div>

      {/* ── Row 1: Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : isTablet ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? 12 : 16, marginBottom: isMobile ? 14 : gap }}>
        {STAT_CARDS.map((s, idx) => {
          const sparkData = [[3,5,4,7,6,8,9],[2,5,6,4,8,7,9],[4,3,5,6,5,7,8],[3,4,5,4,6,7,9]][idx]
          const colors    = ['#800000','#15803d','#1d4ed8','#b45309']
          const col = colors[idx]
          return (
            <div key={s.label} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10.5, color: TEXT_SUB, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                  <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: TEXT_MAIN, letterSpacing: '-0.03em', marginTop: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: s.trendUp ? '#15803d' : '#d97706', fontWeight: 500, marginTop: 3 }}>{s.trend}</div>
                </div>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: CARD_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: col, flexShrink: 0, boxShadow: 'inset 3px 3px 7px #CACAEC, inset -3px -3px 7px #fff' }}>
                  <Ico d={s.icon} d2={s.icon2} size={16} sw={1.5} />
                </div>
              </div>
              <div style={{ marginTop: 4 }}>
                <Sparkline data={sparkData} color={col} w={isMobile ? 110 : 140} h={30} />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Row 2: Hours/Perf + Task Chart ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap, marginBottom: gap }}>

        {/* Hours / Performance */}
        <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN }}>{hoursTab === 'hours' ? 'Total Hours Logged' : 'VA Performance Scores'}</div>
              <div style={{ fontSize: 11, color: TEXT_SUB, fontWeight: 400, marginTop: 2 }}>{hoursTab === 'hours' ? 'All VAs combined — monthly' : 'Current score per VA'}</div>
            </div>
            <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.04)', padding: 4, borderRadius: 10 }}>
              {(['hours', 'performance'] as const).map(t => (
                <button key={t} className={`mtab${hoursTab === t ? ' on' : ''}`} onClick={() => setHoursTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
              ))}
            </div>
          </div>

          {hoursTab === 'hours' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {HOURS_TREND.map(h => (
                <div key={h.month} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, fontSize: 11, color: TEXT_SUB, fontWeight: 500, textAlign: 'right', flexShrink: 0 }}>{h.month}</div>
                  <div style={{ flex: 1, height: 22, borderRadius: 99, background: CARD_BG, boxShadow: 'inset 2px 2px 6px #CACAEC, inset -2px -2px 6px #fff', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(h.hours / MAX_HOURS) * 100}%`, background: 'linear-gradient(90deg,#800000,#c04040)', borderRadius: 99 }} />
                  </div>
                  <div style={{ width: 38, fontSize: 12, fontWeight: 700, color: TEXT_MAIN, textAlign: 'right', flexShrink: 0 }}>{h.hours}h</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PERF_DATA.map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 56, fontSize: 11, color: TEXT_SUB, fontWeight: 500, flexShrink: 0, textAlign: 'right' }}>{p.name}</div>
                  <div style={{ flex: 1, height: 22, borderRadius: 99, background: CARD_BG, boxShadow: 'inset 2px 2px 6px #CACAEC, inset -2px -2px 6px #fff', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.score}%`, background: `linear-gradient(90deg,${p.color},${p.color}bb)`, borderRadius: 99 }} />
                  </div>
                  <div style={{ width: 36, fontSize: 12, fontWeight: 700, color: p.color, textAlign: 'right', flexShrink: 0 }}>{p.score}%</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task Chart */}
        <div style={{ ...card, minHeight: 280 }}>
          <TaskChart taskFocus={taskFocus} setTaskFocus={setTaskFocus} />
        </div>
      </div>

      {/* ── Row 3: VA Table / Cards ── */}
      <div style={{ marginBottom: gap }}>
        <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN }}>My Virtual Assistants</div>
              <div style={{ fontSize: 11, color: TEXT_SUB, fontWeight: 400, marginTop: 2 }}>{MY_VAS.length} VAs on your team</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(['all', 'active', 'ending'] as const).map(f => (
                <button key={f} className={`qchip${vaFilter === f ? ' on' : ''}`} onClick={() => setVaFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
              ))}
            </div>
          </div>

          {isDesktop ? (
            <>
              <div className="va-head">
                <div className="va-grid" style={{ fontSize: 10.5, color: TEXT_SUB, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <div /><div>Virtual Assistant</div><div>Hours Used</div><div>Tasks Done</div><div>Open Tasks</div><div>Rating</div><div>Status</div>
                </div>
              </div>
              {visibleVAs.map(va => {
                const st = STATUS_CFG[va.status]
                const hp = Math.round((va.hoursUsed / va.hoursTotal) * 100)
                return (
                  <div key={va.id} className="va-row">
                    <div className="va-grid">
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: CARD_BG, boxShadow: '-4px -4px 10px #fff, 4px 4px 10px #CACAEC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: va.color, fontWeight: 700, fontSize: 10.5 }}>{va.avatar}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_MAIN }}>{va.name}</div>
                        <div style={{ fontSize: 11, color: TEXT_SUB, fontWeight: 400, marginTop: 1 }}>{va.role}</div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 11, color: TEXT_SUB }}>{va.hoursUsed}/{va.hoursTotal}h</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: hp >= 90 ? '#dc2626' : TEXT_MAIN }}>{hp}%</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 99, background: CARD_BG, boxShadow: 'inset 2px 2px 5px #CACAEC, inset -2px -2px 5px #fff', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${hp}%`, borderRadius: 99, background: hp >= 90 ? '#dc2626' : va.color }} />
                        </div>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#15803d' }}>{va.tasksDone}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: va.tasksOpen >= 8 ? '#dc2626' : TEXT_MAIN }}>{va.tasksOpen}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ color: '#f59e0b' }}>★</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN }}>{va.rating}</span>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 600, background: st.bg, color: st.color }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot }} />{st.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr 1fr' : '1fr', gap: 14, padding: 16 }}>
              {visibleVAs.map(va => <VACard key={va.id} va={va} />)}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 4: Heatmap + Spend Donut ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap, marginBottom: gap }}>

        {/* Heatmap */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN, marginBottom: 4 }}>VA Activity Heatmap</div>
          <div style={{ fontSize: 11, color: TEXT_SUB, fontWeight: 400, marginBottom: 14 }}>Daily task activity across your team — last 10 weeks</div>
          <div style={{ display: 'flex', gap: 3 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 18, marginRight: 2 }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, i) => (
                <div key={d} style={{ height: isMobile ? 11 : 14, fontSize: isMobile ? 7 : 9, color: TEXT_SUB, lineHeight: isMobile ? '11px' : '14px', textAlign: 'right', fontWeight: 500, visibility: i % 2 === 0 ? 'visible' : 'hidden' }}>{d}</div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
                {HEATMAP_DATA.map((_, wi) => (
                  <div key={wi} style={{ flex: 1, fontSize: isMobile ? 7 : 9, color: TEXT_SUB, textAlign: 'center', fontWeight: 500 }}>W{wi + 1}</div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[0,1,2,3,4,5,6].map(dayIdx => (
                  <div key={dayIdx} style={{ display: 'flex', gap: 3 }}>
                    {HEATMAP_DATA.map((week, wi) => {
                      const val = week[dayIdx] ?? 0
                      const bg = val === 0 ? 'rgba(0,0,0,0.06)' : val === 1 ? '#fddada' : val === 2 ? '#f0a0a0' : val === 3 ? '#c85050' : val === 4 ? '#a02828' : '#800000'
                      return <div key={wi} className="hcell" title={`${val} tasks`} style={{ flex: 1, aspectRatio: '1/1', minHeight: isMobile ? 10 : 14, maxHeight: isMobile ? 16 : 18, background: bg, borderRadius: 4, boxShadow: val === 0 ? 'inset 1px 1px 3px #CACAEC, inset -1px -1px 3px #fff' : 'none' }} />
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.06)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: TEXT_SUB, fontWeight: 500 }}>Less</span>
            {['rgba(0,0,0,0.06)','#fddada','#f0a0a0','#c85050','#a02828','#800000'].map(c => (
              <div key={c} style={{ width: isMobile ? 10 : 12, height: isMobile ? 10 : 12, borderRadius: 3, background: c }} />
            ))}
            <span style={{ fontSize: 11, color: TEXT_SUB, fontWeight: 500 }}>More</span>
          </div>
        </div>

        {/* Spend Donut */}
        <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN, marginBottom: 4 }}>Spend by VA</div>
          <div style={{ fontSize: 11, color: TEXT_SUB, fontWeight: 400, marginBottom: 16 }}>Monthly cost per Virtual Assistant</div>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center', gap: isMobile ? 16 : 16, flex: 1, flexWrap: 'wrap' }}>
            {/* Neumorphic donut ring */}
            <div style={{ width: 120, height: 120, borderRadius: '50%', background: CARD_BG, boxShadow: '-8px -8px 20px #fff, 8px 8px 20px #CACAEC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
              <svg width={110} height={110} viewBox="0 0 110 110" style={{ position: 'absolute' }}>
                {donutSlices.map((s, i) => (
                  <circle key={i} cx={55} cy={55} r={44} fill="none" stroke={s.color} strokeWidth={13}
                    strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={0}
                    transform={`rotate(${s.rot} 55 55)`} strokeLinecap="round" />
                ))}
              </svg>
              <div style={{ textAlign: 'center', zIndex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_MAIN }}>${(donutTotal / 1000).toFixed(1)}k</div>
                <div style={{ fontSize: 9, color: TEXT_SUB, fontWeight: 500 }}>per month</div>
              </div>
            </div>
            <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {donutSlices.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11.5, color: TEXT_SUB, flex: 1, fontWeight: 400 }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEXT_MAIN }}>${(s.val / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 5: Activity + Upcoming Tasks ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap }}>

        {/* Activity Feed */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN, marginBottom: 4 }}>Recent Activity</div>
          <div style={{ fontSize: 11, color: TEXT_SUB, fontWeight: 400, marginBottom: 14 }}>Latest updates across your VA team</div>
          {RECENT_ACTIVITY.map(item => (
            <div key={item.id} className="aitem">
              <div style={{ width: 36, height: 36, borderRadius: 12, background: CARD_BG, boxShadow: '-4px -4px 10px #fff, 4px 4px 10px #CACAEC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: item.color }}>
                <Ico d={item.icon} size={14} sw={1.6} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_MAIN }}>{item.title}</div>
                <div style={{ fontSize: 11, color: TEXT_SUB, marginTop: 2, fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.desc}</div>
              </div>
              <div style={{ fontSize: 11, color: TEXT_SUB, whiteSpace: 'nowrap', fontWeight: 400, flexShrink: 0, marginLeft: 8 }}>{item.time}</div>
            </div>
          ))}
        </div>

        {/* Upcoming Tasks */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN, marginBottom: 4 }}>Upcoming Tasks</div>
          <div style={{ fontSize: 11, color: TEXT_SUB, fontWeight: 400, marginBottom: 14 }}>Pending actions for you or your VAs</div>
          {UPCOMING_TASKS.map(task => {
            const p = PRIORITY_CFG[task.priority]
            return (
              <div key={task.id} className="trow">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: TEXT_MAIN, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                  <div style={{ fontSize: 11, color: TEXT_SUB, marginTop: 1 }}>{task.assignee}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: task.due === 'Today' ? '#dc2626' : TEXT_SUB, fontWeight: task.due === 'Today' ? 700 : 400 }}>{task.due}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: p.color, background: p.bg, padding: '2px 8px', borderRadius: 6 }}>{p.label}</span>
                </div>
              </div>
            )
          })}
          <button className="neu-btn" style={{ marginTop: 16, width: '100%', padding: '11px 0', fontSize: 12, color: '#800000', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Ico d="M12 5v14M5 12h14" size={13} sw={2} />
            Add Task
          </button>
        </div>
      </div>
    </div>
  )
}