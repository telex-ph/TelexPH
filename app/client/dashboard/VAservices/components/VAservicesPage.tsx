'use client'
import { useRouter } from 'next/navigation'
import { Ico, GLOBAL_CSS } from '../../Subscription/components/ui'
import { SERVICE_CATEGORIES } from '../../Subscription/components/constants'

// ─── PIPELINE STEPS ──────────────────────────────────────────────────────────
const PIPELINE = [
  {
    key: 'browse', label: 'Browse VAs', href: '/client/dashboard/BrowseVAs',
    desc: 'Explore vetted candidates by role, skill set, and availability.',
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  },
  {
    key: 'shortlist', label: 'Shortlist', href: '/client/dashboard/Shortlisted',
    desc: 'Save your top picks and compare them side by side.',
    icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  },
  {
    key: 'interview', label: 'Interview', href: '/client/dashboard/InterviewRecording',
    desc: 'Schedule a call and review the recording afterward.',
    icon: 'M23 7l-7 5 7 5V7z M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z',
  },
  {
    key: 'hire', label: 'My VAs', href: '/client/dashboard/MyVAs',
    desc: 'Manage tasks, milestones, and progress with hired staff.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
]

const STAFF_CATEGORY = SERVICE_CATEGORIES.find(c => c.key === 'staff')!

export default function VAServicesPage() {
  const router = useRouter()

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: '24px' }}>
      <style>{GLOBAL_CSS}</style>

      {/* Header — matches Subscriptions page pattern */}
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Services</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>VA Services</h2>
        <p style={{ fontSize: 13, color: '#555', fontWeight: 400, margin: '3px 0 0' }}>Hire dedicated virtual assistants — from first browse to day-to-day management.</p>
      </div>

      {/* Hero banner — same maroon gradient-over-image treatment as Subscription stat cards */}
      <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', minHeight: 150, boxShadow: '0 4px 20px rgba(0,0,0,0.3)', marginBottom: 26 }}>
        <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(90,0,0,0.93) 30%,rgba(70,0,0,0.72) 65%,rgba(30,0,0,0.4) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 520 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,210,210,0.95)' }}>Dedicated Staff</span>
          <h3 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.01em', lineHeight: 1.25 }}>Build your remote team with vetted Filipino talent</h3>
          <p style={{ fontSize: 13, color: 'rgba(255,230,230,0.9)', margin: 0, lineHeight: 1.5 }}>
            Every VA is pre-screened, interview-ready, and backed by Telex account management — from onboarding through renewal.
          </p>
          <button
            onClick={() => router.push('/client/dashboard/BrowseVAs')}
            style={{ marginTop: 6, alignSelf: 'flex-start', background: '#fff', color: '#800000', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins,sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            Browse VAs <Ico d="M5 12h14M12 5l7 7-7 7" size={13} sw={2} />
          </button>
        </div>
      </div>

      {/* Pipeline — how hiring works on this platform */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>How hiring works</h3>
        <div style={{ flex: 1, height: 1, background: '#e0dcdc' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 30 }}>
        {PIPELINE.map((step, i) => (
          <button
            key={step.key}
            onClick={() => router.push(step.href)}
            className="price-card"
            style={{ textAlign: 'left', cursor: 'pointer', border: '1px solid #e0dcdc', background: '#fff', padding: '18px 18px 16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: '#fff0f0', border: '1px solid #f0c8c8', color: '#800000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: '#f8f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#800000', flexShrink: 0 }}>
                <Ico d={step.icon} size={15} sw={1.6} />
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{step.label}</div>
            <div style={{ fontSize: 11.5, color: '#666', lineHeight: 1.5, fontWeight: 400 }}>{step.desc}</div>
          </button>
        ))}
      </div>

      {/* Available roles — reuses the exact Dedicated Staff category from Subscriptions */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Available roles</h3>
          <p style={{ fontSize: 12, color: '#555', margin: '2px 0 0', fontWeight: 400 }}>{STAFF_CATEGORY.services.length} staffing roles available</p>
        </div>
        <div style={{ flex: 1, height: 1, background: '#e0dcdc' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }} className="cards-grid">
        {STAFF_CATEGORY.services.map(svc => (
          <div key={svc.id} className={`price-card ${svc.featured ? 'featured' : ''}`}>
            <div style={{ padding: '20px 20px 16px', position: 'relative', background: svc.featured ? 'linear-gradient(135deg,#800000 0%,#b03030 100%)' : 'linear-gradient(135deg,#f8f5f5 0%,#f0ecec 100%)' }}>
              {svc.featured && <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.22)', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.35)' }}>⭐ Popular</span>}
              <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, background: svc.featured ? 'rgba(255,255,255,0.18)' : '#fff0f0', color: svc.featured ? '#fff' : '#800000', border: svc.featured ? '1px solid rgba(255,255,255,0.25)' : '1px solid #f0c8c8' }}>
                <Ico d={svc.icon} size={18} sw={1.6} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35, whiteSpace: 'pre-line', color: svc.featured ? '#fff' : '#1a1a2e' }}>{svc.name}</div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 14, marginBottom: 4, color: svc.featured ? 'rgba(255,220,220,0.9)' : '#666', fontWeight: 600 }}>{svc.tag}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, color: svc.featured ? '#fff' : '#800000', letterSpacing: '-0.02em' }}>{svc.priceLabel}</span>
                <span style={{ fontSize: 12, color: svc.featured ? 'rgba(255,220,220,0.95)' : '#666', fontWeight: 400 }}>{svc.period}</span>
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
              <button className="gs-btn gs-plain" onClick={() => router.push('/client/dashboard/BrowseVAs')}>
                Browse {svc.short} Candidates →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
