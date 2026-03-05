'use client'
import { useState } from 'react'
import type { Plan, Service, Preferences } from './types'
import { Ico, GLOBAL_CSS } from './ui'
import { INITIAL_PLANS, SERVICE_CATEGORIES, STATUS_CFG, GROUPS, FILTER_CHIPS } from './constants'
import { ServiceDetailModal, CustomizationModal, ConfirmModal, SuccessModal } from './ServiceFlowModals'
import { RenewModal, PayModal, EditModal, DotsMenu } from './PlanModals'

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function SubscriptionsPage() {
  const [search, setSearch]           = useState('')
  const [filter, setFilter]           = useState('all')
  const [expandedId, setExpand]       = useState<number | null>(null)
  const [activeTab, setActiveTab]     = useState<'plans' | 'services'>('plans')
  const [activeCategory, setActiveCategory] = useState('staff')
  const [plans, setPlans]             = useState<Plan[]>(INITIAL_PLANS)

  const [flowStep, setFlowStep]       = useState<'detail' | 'customize' | 'confirm' | 'success' | null>(null)
  const [selectedSvc, setSelectedSvc] = useState<Service | null>(null)
  const [preferences, setPreferences] = useState<Preferences | null>(null)

  const [planModal, setPlanModal]         = useState<'renew'|'pay'|'edit'|'dots'|null>(null)
  const [activePlan, setActivePlan]       = useState<Plan | null>(null)
  const [dotsTriggerRect, setDotsTriggerRect] = useState<DOMRect | null>(null)

  const [toast, setToast] = useState<string | null>(null)

  // ── Helpers ──
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const openPlanModal = (type: 'renew'|'pay'|'edit'|'dots', plan: Plan, rect?: DOMRect) => {
    setActivePlan(plan)
    setPlanModal(type)
    if (type === 'dots' && rect) setDotsTriggerRect(rect)
  }
  const closePlanModal = () => { setPlanModal(null); setActivePlan(null); setDotsTriggerRect(null) }

  const openDetail = (svc: Service) => { setSelectedSvc(svc); setFlowStep('detail') }
  const closeFlow  = () => { setFlowStep(null); setSelectedSvc(null); setPreferences(null) }

  const canRenew = (plan: Plan) => plan.status === 'ended' || (plan.daysLeft !== null && plan.daysLeft <= 3)
  const canPay   = (plan: Plan) => plan.status === 'ending' || (plan.status === 'active' && plan.daysLeft !== null && plan.daysLeft <= 5)

  // ── Handlers ──
  const handleRenewConfirm = () => {
    if (!activePlan) return
    setPlans(prev => prev.map(p => p.id === activePlan.id
      ? { ...p, status: 'active', daysLeft: p.billing === 'Yearly' ? 365 : 30 }
      : p
    ))
    closePlanModal()
    showToast('Subscription renewed successfully!')
  }

  const handlePayConfirm = () => { closePlanModal(); showToast('Payment processed successfully!') }

  const handleEditSave = (updated: Partial<Plan>) => {
    if (!activePlan) return
    setPlans(prev => prev.map(p => p.id === activePlan.id ? { ...p, ...updated } : p))
    closePlanModal()
    showToast('Subscription updated!')
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

  const handleSuccess = () => {
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
    closeFlow()
    setActiveTab('plans')
  }

  // ── Derived state ──
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

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: '24px' }}>
      <style>{GLOBAL_CSS}</style>

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