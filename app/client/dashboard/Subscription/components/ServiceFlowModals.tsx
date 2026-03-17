'use client'
import { useState, useEffect } from 'react'
import type { Service, Preferences } from './types'
import { S, Ico } from './ui'
import { START_OPTIONS, DURATION_OPTIONS } from './constants'

// ─── STEP 1: DETAIL ────────────────────────────────────────────────────────────
export function ServiceDetailModal({ svc, onClose, onProceed }: { svc: Service; onClose: () => void; onProceed: () => void }) {
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
export function CustomizationModal({ svc, onBack, onProceed }: { svc: Service; onBack: () => void; onProceed: (p: Preferences) => void }) {
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
export function ConfirmModal({ svc, preferences, onBack, onConfirm }: { svc: Service; preferences: Preferences; onBack: () => void; onConfirm: () => void }) {
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
export function SuccessModal({ svc, onDone }: { svc: Service; onDone: () => void }) {
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
