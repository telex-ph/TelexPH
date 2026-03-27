'use client'
import { useState } from 'react'

// ─── TYPES ─────────────────────────────────────────────────────────────────────
type Plan = {
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
  isService?: boolean
}

// ─── DATA ──────────────────────────────────────────────────────────────────────
const INITIAL_PLANS: Plan[] = [
  {
    id: 1, name: 'CSR', tier: 'Customer Service Representative',
    price: 1400, priceLabel: '$1,400', billing: 'Monthly',
    renewDate: 'Not valid', daysLeft: null, status: 'ended',
    sessions: 0, totalSessions: 12,
    perks: ['Dedicated full-time agent (8hrs/day)', 'Email, live chat & phone support', 'CRM documentation & ticketing', 'QA monitoring & call recording review', 'Weekly performance reporting'],
    color: '#800000', bg: '#fff5f5',
  },
  {
    id: 2, name: 'SMM', tier: 'Social Media Management',
    price: 1800, priceLabel: '$1,800', billing: 'Monthly',
    renewDate: 'Jul 3, 2025', daysLeft: 2, status: 'ending',
    sessions: 4, totalSessions: 12,
    perks: ['Content calendar strategy (monthly)', 'Copywriting for all platforms', 'Scheduling & publishing', 'Community engagement management', 'Monthly analytics & performance report'],
    color: '#800000', bg: '#fff5f5',
  },
  {
    id: 3, name: 'TSR', tier: 'Technical Support Representative',
    price: 1800, priceLabel: '$1,800', billing: 'Monthly',
    renewDate: 'Jul 15, 2025', daysLeft: 15, status: 'active',
    sessions: 8, totalSessions: 12,
    perks: ['Tier 1–2 technical troubleshooting', 'SaaS / eCommerce backend support', 'Escalation handling & documentation', 'System & knowledge base documentation', 'KPI tracking & QA monitoring'],
    color: '#800000', bg: '#fff5f5',
  },
  {
    id: 4, name: 'WD', tier: 'Web Development (Dedicated Developer)',
    price: 2500, priceLabel: '$2,500', billing: 'Monthly',
    renewDate: 'Jul 20, 2025', daysLeft: 20, status: 'active',
    sessions: 6, totalSessions: 12,
    perks: ['WordPress / Shopify / Webflow development', 'Site maintenance & performance optimization', 'Landing page design & build', 'Third-party tool integrations', 'Ongoing content & feature updates'],
    color: '#800000', bg: '#fff5f5',
  },
]

const STATUS_CFG = {
  active:  { label: 'Active',       bg: '#f0fdf4', color: '#16a34a', dot: '#16a34a' },
  ending:  { label: 'Ending Soon',  bg: '#fefce8', color: '#ca8a04', dot: '#eab308' },
  ended:   { label: 'Inactive',     bg: '#f5f5f5', color: '#888',    dot: '#bbb'    },
}

const GROUPS = [
  { key: 'ended'  as const, label: 'Recently Ended' },
  { key: 'ending' as const, label: 'Ending Soon'    },
  { key: 'active' as const, label: 'Active'         },
]

const FILTER_CHIPS = [
  { key: 'all',    label: 'All'    },
  { key: 'active', label: 'Active' },
  { key: 'ending', label: 'Ending' },
  { key: 'ended',  label: 'Ended'  },
]

// ─── ICON ──────────────────────────────────────────────────────────────────────
function Ico({ d, size = 16, sw = 1.8, color = 'currentColor' }: { d: string; size?: number; sw?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

// ─── RENEW MODAL ───────────────────────────────────────────────────────────────
function RenewModal({ plan, onClose, onConfirm }: { plan: Plan; onClose: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 22, boxShadow: '0 40px 100px rgba(0,0,0,0.28)', width: '100%', maxWidth: 420, padding: 32 }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff0f0', border: '2px solid #f0c0c0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 8, letterSpacing: '-0.01em', fontFamily: "'Poppins', sans-serif" }}>Renew Subscription</div>
          <div style={{ fontSize: 13, color: '#444', lineHeight: 1.6, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>
            You're about to renew <strong style={{ color: '#800000', fontWeight: 700 }}>{plan.tier}</strong>. Your billing cycle will restart.
          </div>
        </div>
        <div style={{ background: '#f8f6f6', border: '1px solid #e8e4e4', borderRadius: 12, padding: '16px 20px', marginBottom: 22 }}>
          {(['Plan', 'Price', 'Billing'] as const).map((k, i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid #eee' : 'none' }}>
              <span style={{ fontSize: 12, color: '#666', fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{[plan.tier, plan.priceLabel, plan.billing][i]}</span>
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

// ─── PAY MODAL ─────────────────────────────────────────────────────────────────
function PayModal({ plan, onClose, onConfirm }: { plan: Plan; onClose: () => void; onConfirm: () => void }) {
  const [method, setMethod] = useState<'card' | 'bank' | 'wallet'>('card')
  const methods = [
    { id: 'card'   as const, label: 'Credit / Debit Card', icon: 'M1 4h22v16H1zM1 10h22' },
    { id: 'bank'   as const, label: 'Bank Transfer',       icon: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11' },
    { id: 'wallet' as const, label: 'E-Wallet',            icon: 'M21 12V7H5a2 2 0 0 1 0-4h14v4M21 12v5H5a2 2 0 0 0 0 4h14v-4' },
  ]
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 22, boxShadow: '0 40px 100px rgba(0,0,0,0.28)', width: '100%', maxWidth: 440, padding: 32 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.01em', fontFamily: "'Poppins', sans-serif" }}>Make a Payment</div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 2, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>{plan.tier}</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#800000', letterSpacing: '-0.02em', fontFamily: "'Poppins', sans-serif" }}>{plan.priceLabel}</div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 10, fontFamily: "'Poppins', sans-serif" }}>Payment Method</div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, marginBottom: 22 }}>
          {methods.map(m => (
            <div key={m.id} onClick={() => setMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 15px', borderRadius: 11, border: `1.5px solid ${method === m.id ? '#800000' : '#ddd'}`, background: method === m.id ? '#fff5f5' : '#fff', cursor: 'pointer' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: method === m.id ? '#fff0f0' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={method === m.id ? '#800000' : '#666'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={m.icon} /></svg>
              </div>
              <span style={{ fontSize: 13, color: method === m.id ? '#800000' : '#333', fontWeight: method === m.id ? 600 : 400, fontFamily: "'Poppins', sans-serif" }}>{m.label}</span>
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

// ─── EDIT MODAL ────────────────────────────────────────────────────────────────
function EditModal({ plan, onClose, onSave }: { plan: Plan; onClose: () => void; onSave: (updated: Partial<Plan>) => void }) {
  const [name, setName]       = useState(plan.name)
  const [billing, setBilling] = useState(plan.billing)
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 22, boxShadow: '0 40px 100px rgba(0,0,0,0.28)', width: '100%', maxWidth: 420, padding: 32 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 4, letterSpacing: '-0.01em', fontFamily: "'Poppins', sans-serif" }}>Edit Subscription</div>
        <div style={{ fontSize: 12, color: '#555', marginBottom: 24, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>{plan.tier}</div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 8, fontFamily: "'Poppins', sans-serif" }}>Display Name</label>
          <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: 10, padding: '11px 14px', fontSize: 13, color: '#1a1a2e', outline: 'none', fontFamily: 'Poppins,sans-serif', fontWeight: 400, boxSizing: 'border-box' as const }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 8, fontFamily: "'Poppins', sans-serif" }}>Billing Cycle</label>
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
function DotsMenu({ plan, onClose, onAction, triggerRect }: { plan: Plan; onClose: () => void; onAction: (action: string) => void; triggerRect: DOMRect | null }) {
  const items = [
    { label: 'View Details',        icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6' },
    { label: 'Download Invoice',    icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3' },
    { label: 'Cancel Subscription', icon: 'M18 6L6 18M6 6l12 12', danger: true },
  ]
  const top  = triggerRect ? triggerRect.bottom + window.scrollY + 6   : 0
  const left = triggerRect ? triggerRect.right  + window.scrollX - 190 : 0
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={onClose}>
      <div style={{ position: 'absolute', top, left, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '1px solid #e8e4e4', padding: 6, minWidth: 190 }} onClick={e => e.stopPropagation()}>
        {items.map(item => (
          <button key={item.label} onClick={() => { onAction(item.label); onClose() }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 9, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, color: item.danger ? '#dc2626' : '#1a1a2e', fontFamily: 'Poppins,sans-serif', textAlign: 'left' as const, fontWeight: 500 }}>
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

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function VAbilling() {
  const [search, setSearch]               = useState('')
  const [filter, setFilter]               = useState('all')
  const [expandedId, setExpand]           = useState<number | null>(null)
  const [plans, setPlans]                 = useState<Plan[]>(INITIAL_PLANS)
  const [planModal, setPlanModal]         = useState<'renew' | 'pay' | 'edit' | 'dots' | null>(null)
  const [activePlan, setActivePlan]       = useState<Plan | null>(null)
  const [dotsTriggerRect, setDotsTriggerRect] = useState<DOMRect | null>(null)
  const [toast, setToast]                 = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const openPlanModal = (type: 'renew' | 'pay' | 'edit' | 'dots', plan: Plan, rect?: DOMRect) => {
    setActivePlan(plan); setPlanModal(type)
    if (type === 'dots' && rect) setDotsTriggerRect(rect)
  }
  const closePlanModal = () => { setPlanModal(null); setActivePlan(null); setDotsTriggerRect(null) }

  const canRenew = (plan: Plan) => plan.status === 'ended' || (plan.daysLeft !== null && plan.daysLeft <= 3)
  const canPay   = (plan: Plan) => plan.status === 'ending' || (plan.status === 'active' && plan.daysLeft !== null && plan.daysLeft <= 5)

  const handleRenewConfirm = () => {
    if (!activePlan) return
    setPlans(prev => prev.map(p => p.id === activePlan.id
      ? { ...p, status: 'active' as const, daysLeft: p.billing === 'Yearly' ? 365 : 30 }
      : p
    ))
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
      setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, status: 'ended' as const, daysLeft: null } : p))
      showToast('Subscription cancelled.')
    } else if (action === 'Download Invoice') {
      showToast('Invoice download started!')
    } else {
      showToast(`Viewing details for ${plan.tier}`)
    }
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

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: 24, background: '#fdfcfc', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .chip { padding: 7px 18px; border-radius: 20px; border: 1.5px solid #d8d4d4; background: #fff; color: #555; font-size: 12px; font-family: Poppins,sans-serif; font-weight: 600; cursor: pointer; transition: all 0.15s; }
        .chip:hover { border-color: #c9a0a0; color: #800000; }
        .chip.on { background: #800000; color: #fff; border-color: #800000; }
        .s-table { background: #fff; border: 1.5px solid #e0dcdc; border-radius: 14px; overflow: hidden; }
        .s-thead { display: grid; grid-template-columns: 2.2fr 1.4fr 1fr 1.2fr 1.6fr; padding: 12px 20px; background: #faf8f8; border-bottom: 1.5px solid #f0eeee; gap: 12px; }
        .s-thead-cell { font-size: 11px; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.04em; font-family: Poppins,sans-serif; }
        .s-row { display: grid; grid-template-columns: 2.2fr 1.4fr 1fr 1.2fr 1.6fr; padding: 14px 20px; gap: 12px; align-items: center; cursor: pointer; transition: background 0.12s; }
        .s-row:hover { background: #fffafa; }
        .s-expand { padding: 14px 20px 18px 69px; background: #fdf9f9; border-top: 1px dashed #f0e8e8; }
        .status-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; font-family: Poppins,sans-serif; }
        .new-badge { background: #fff0f0; color: #800000; border: 1px solid #f0c8c8; border-radius: 5px; padding: 1px 7px; font-size: 9px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
        .perk-tag { display: inline-flex; align-items: center; gap: 5px; background: #fff5f5; border: 1px solid #f0d0d0; border-radius: 20px; padding: 4px 11px; font-size: 11px; color: #800000; font-weight: 500; font-family: Poppins,sans-serif; }
        .act-btn { padding: 6px 14px; border-radius: 8px; border: 1.5px solid #d8d4d4; background: #fff; color: #333; font-size: 11px; font-weight: 600; cursor: pointer; font-family: Poppins,sans-serif; transition: all 0.15s; white-space: nowrap; }
        .act-btn:hover:not(.dim) { border-color: #800000; color: #800000; }
        .act-btn.dim { opacity: 0.38; cursor: not-allowed; }
        .act-btn.ghost { background: #f5f2f2; border-color: transparent; }
        .dots { width: 30px; height: 30px; border-radius: 8px; border: 1.5px solid #e0dcdc; background: #fff; color: #555; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; flex-shrink: 0; }
        .dots:hover { border-color: #800000; color: #800000; }
      `}</style>

      {/* Modals */}
      {planModal === 'renew' && activePlan && <RenewModal plan={activePlan} onClose={closePlanModal} onConfirm={handleRenewConfirm} />}
      {planModal === 'pay'   && activePlan && <PayModal   plan={activePlan} onClose={closePlanModal} onConfirm={handlePayConfirm} />}
      {planModal === 'edit'  && activePlan && <EditModal  plan={activePlan} onClose={closePlanModal} onSave={handleEditSave} />}
      {planModal === 'dots'  && activePlan && <DotsMenu   plan={activePlan} onClose={closePlanModal} onAction={action => handleDotsAction(action, activePlan)} triggerRect={dotsTriggerRect} />}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: '#1a1a2e', color: '#fff', borderRadius: 12, padding: '12px 22px', fontSize: 13, fontWeight: 600, zIndex: 2000, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          {toast}
        </div>
      )}

      {/* ── Page Header (BrowseVAs style) ── */}
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Account</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Subscriptions</h2>
        <p style={{ fontSize: 13, color: '#555', fontWeight: 400, margin: '3px 0 0' }}>Manage and track your active subscription plans.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
        {[
          {
            label: 'Active Plans', value: `${activePlans.length} plans`, sub: '+1 this month',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            photo: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80',
          },
          {
            label: 'Monthly Spend', value: `$${monthlySpend.toLocaleString()}`, sub: 'Billed this month',
            icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
            photo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
          },
          {
            label: 'Yearly Total', value: `$${yearlySpend.toLocaleString()}`, sub: 'Annual projection',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            photo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
          },
        ].map((s, idx) => (
          <div key={s.label} style={{ borderRadius: 14, overflow: 'hidden', position: 'relative', minHeight: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${s.photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(80,0,0,0.97) 25%, rgba(100,0,0,0.80) 60%, rgba(60,0,0,0.55) 100%)' }} />
            <div style={{ position: 'relative', zIndex: 2, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon} />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em', fontFamily: "'Poppins', sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginTop: 2, fontFamily: "'Poppins', sans-serif" }}>{s.label}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,200,200,0.7)', marginTop: 2, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>{s.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
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
                <span style={{ fontSize: 11, color: '#555', letterSpacing: '0.05em', fontWeight: 700, textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>{g.label}</span>
                <div style={{ flex: 1, height: 1, background: '#e8e4e4' }} />
                <span style={{ fontSize: 11, color: '#666', background: '#f0edec', border: '1px solid #e0dcdc', borderRadius: 20, padding: '1px 8px', fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>{rows.length}</span>
              </div>

              {rows.map(plan => {
                const st         = STATUS_CFG[plan.status]
                const exp        = expandedId === plan.id
                const renewEnabled = canRenew(plan)
                const payEnabled   = canPay(plan)

                return (
                  <div key={plan.id} style={{ borderBottom: '1px solid #f5f2f2' }}>
                    <div className="s-row" style={{ background: exp ? '#fffafa' : undefined }} onClick={() => setExpand(exp ? null : plan.id)}>

                      {/* Col 1 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: plan.bg, border: `1.5px solid ${plan.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: plan.color, fontWeight: 700, fontSize: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.07)', fontFamily: "'Poppins', sans-serif" }}>
                          {plan.name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.3, display: 'flex', alignItems: 'center', flexWrap: 'wrap' as const, gap: 4, fontFamily: "'Poppins', sans-serif" }}>
                            {plan.name}
                            <span className="new-badge">NEW</span>
                          </div>
                          <div style={{ fontSize: 11, color: '#666', marginTop: 1, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>{plan.tier}</div>
                        </div>
                      </div>

                      {/* Col 2 */}
                      <div>
                        <span className="status-badge" style={{ background: st.bg, color: st.color }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
                          {st.label}
                        </span>
                        {plan.status !== 'ended' && plan.daysLeft !== null && (
                          <div style={{ fontSize: 11, marginTop: 3, color: plan.daysLeft <= 3 ? '#dc2626' : '#555', display: 'flex', alignItems: 'center', gap: 3, fontWeight: plan.daysLeft <= 3 ? 600 : 400, fontFamily: "'Poppins', sans-serif" }}>
                            {plan.daysLeft <= 3
                              ? <><Ico d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" size={9} sw={1.8} />{plan.daysLeft} days left</>
                              : `Ends in ${plan.daysLeft} days`}
                          </div>
                        )}
                      </div>

                      {/* Col 3 */}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{plan.priceLabel}</div>
                        <div style={{ fontSize: 11, color: '#666', marginTop: 1, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>{plan.billing}</div>
                      </div>

                      {/* Col 4 */}
                      <div>
                        {plan.status === 'ended' ? (
                          <span style={{ fontSize: 12, color: '#888', fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>Not valid</span>
                        ) : (
                          <>
                            <div style={{ fontSize: 13, fontWeight: plan.daysLeft !== null && plan.daysLeft <= 3 ? 700 : 500, color: plan.daysLeft !== null && plan.daysLeft <= 3 ? '#dc2626' : '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>
                              {plan.renewDate}
                            </div>
                            {plan.daysLeft !== null && (
                              <div style={{ fontSize: 11, color: '#666', marginTop: 1, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>
                                {plan.daysLeft <= 3 ? 'Overdue' : `In ${plan.daysLeft} days`}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Col 5 */}
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
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#444', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 10, fontFamily: "'Poppins', sans-serif" }}>Included Perks</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                          {plan.perks.map(perk => (
                            <span key={perk} className="perk-tag">
                              <Ico d="M20 6L9 17l-5-5" size={9} sw={2} />
                              {perk}
                            </span>
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
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#666', fontSize: 13, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>No subscriptions found.</div>
        )}
      </div>
    </div>
  )
}