'use client'
import { useState, useEffect, useRef } from 'react'

// ─── BREAKPOINT ───────────────────────────────────────────────────────────────
function getBreakpoint(w: number): 'mobile' | 'tablet' | 'desktop' {
  return w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
function Ico({ d, d2, size = 16, sw = 1.4 }: { d: string; d2?: string; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />{d2 && <path d={d2} />}
    </svg>
  )
}
const CalIco     = () => <Ico d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" size={20} sw={1.3} />
const ClockIco   = () => <Ico d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" d2="M12 6v6l4 2" size={20} sw={1.3} />
const CheckIco   = () => <Ico d="M22 11.08V12a10 10 0 1 1-5.93-9.14" d2="M22 4L12 14.01l-3-3" size={20} sw={1.3} />
const XCircleIco = () => <Ico d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" d2="M15 9l-6 6M9 9l6 6" size={20} sw={1.3} />
const RefreshIco = () => <Ico d="M23 4v6h-6M1 20v-6h6" d2="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" size={13} sw={1.6} />
const UserIco    = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" d2="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={13} />
const MapPinIco  = () => <Ico d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" d2="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" size={12} />
const SearchIco  = () => <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={13} sw={1.5} />
const EmptyIco   = () => <Ico d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" size={38} sw={1} />

// ─── TYPES ────────────────────────────────────────────────────────────────────
type AppointmentStatus = 'confirmed' | 'cancelled' | 'showed' | 'noshow' | 'invalid'

interface Appointment {
  _id: string
  ghlAppointmentId: string
  title?: string
  name?: string
  email?: string
  phone?: string
  startTime: string
  endTime?: string
  appointmentStatus: AppointmentStatus
  calendarName?: string
  assignedUserName?: string
  address?: string
  location?: string
  source?: string
  createdAt: string
}

type TabKey = 'all' | 'confirmed' | 'showed' | 'cancelled' | 'noshow'

const API_BASE = 'https://telexph-admin.onrender.com/api'

// ─── STATUS CONFIG — maroon-only palette ─────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  confirmed: { label: 'Confirmed', bg: '#fff5f5', color: '#800000', dot: '#800000' },
  showed:    { label: 'Completed', bg: '#f5f2f2', color: '#4a0000', dot: '#4a0000' },
  cancelled: { label: 'Cancelled', bg: '#f5f2f2', color: '#888',    dot: '#aaa'    },
  noshow:    { label: 'No Show',   bg: '#fdf2f2', color: '#9b3333', dot: '#b34444' },
  invalid:   { label: 'Invalid',   bg: '#f5f2f2', color: '#aaa',    dot: '#ccc'    },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.invalid
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: cfg.bg, color: cfg.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', border: `1px solid ${cfg.dot}22` }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  )
}

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}
function fmtDateTime(iso: string) {
  return `${fmtDate(iso)} · ${fmtTime(iso)}`
}

// ─── STAT CARD — maroon card with background photo, matching screenshot design ─
const CARD_PHOTOS = [
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=60', // calendar/work
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=60', // clock/schedule
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=60', // meeting/completed
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=60', // person/cancelled
]

function StatCard({ label, value, sub, subColor, icon, photoIdx = 0 }: {
  label: string
  value: number
  sub: string
  subColor?: string
  icon: React.ReactNode
  photoIdx?: number
}) {
  return (
    <div style={{
      flex: '1 1 0',
      minWidth: 0,
      borderRadius: 14,
      overflow: 'hidden',
      position: 'relative',
      minHeight: 96,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    }}>
      {/* Background photo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${CARD_PHOTOS[photoIdx % CARD_PHOTOS.length]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      {/* Dark maroon overlay — solid left where text is, photo visible on right */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(90,0,0,0.97) 30%, rgba(110,0,0,0.72) 65%, rgba(80,0,0,0.35) 100%)',
      }} />
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 13 }}>
        {/* Icon box */}
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,210,210,0.95)', flexShrink: 0,
        }}>
          {icon}
        </div>
        {/* Text */}
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {value}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.92)', marginTop: 2 }}>
            {label}
          </div>
          <div style={{ fontSize: 10, fontWeight: 400, color: subColor ?? 'rgba(255,255,255,0.5)', marginTop: 2 }}>
            {sub}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',       label: 'All'       },
  { key: 'confirmed', label: 'Upcoming'  },
  { key: 'showed',    label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'noshow',    label: 'No Show'   },
]

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ClientAppointments() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [bp, setBp]                     = useState<'mobile' | 'tablet' | 'desktop' | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [activeTab, setActiveTab]       = useState<TabKey>('all')
  const [search, setSearch]             = useState('')
  const [refreshing, setRefreshing]     = useState(false)

  // Responsive observer
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    setBp(getBreakpoint(el.getBoundingClientRect().width))
    const obs = new ResizeObserver(e => setBp(getBreakpoint(e[0].contentRect.width)))
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // ─── Fetch from GET /appointments/my ────────────────────────────────────
  const fetchAppointments = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/appointments/my`, {
        method: 'GET',
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || `Request failed with status ${res.status}`)
      }
      const data: Appointment[] = await res.json()
      setAppointments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchAppointments() }, [])

  const isMobile = bp === 'mobile'

  // ─── Derived stats ───────────────────────────────────────────────────────
  const total     = appointments.length
  const upcoming  = appointments.filter(a => a.appointmentStatus === 'confirmed').length
  const completed = appointments.filter(a => a.appointmentStatus === 'showed').length
  const cancelled = appointments.filter(a => a.appointmentStatus === 'cancelled').length

  // ─── Filter: tab + search ────────────────────────────────────────────────
  const filtered = appointments.filter(a => {
    const matchTab    = activeTab === 'all' || a.appointmentStatus === activeTab
    const q           = search.toLowerCase()
    const matchSearch = !q
      || (a.title || '').toLowerCase().includes(q)
      || (a.calendarName || '').toLowerCase().includes(q)
      || (a.assignedUserName || '').toLowerCase().includes(q)
      || (a.location || a.address || '').toLowerCase().includes(q)
    return matchTab && matchSearch
  })

  return (
    <div ref={rootRef} style={{ fontFamily: "'Poppins', sans-serif", padding: isMobile ? '12px' : '24px', background: '#fdfcfc', minHeight: '100vh', visibility: bp === null ? 'hidden' : 'visible' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        .appt-row:hover { background: #faf8f8 !important; }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: isMobile ? 16 : 22 }}>
        <p style={{ fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Your schedule,</p>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Appointments</h1>
        {!isMobile && <p style={{ fontSize: 13, color: '#555', fontWeight: 400, margin: '4px 0 0' }}>View and track all your booked appointments.</p>}
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
        <StatCard label="Total Appointments" value={total}     sub="All time"           subColor="rgba(255,255,255,0.5)"  icon={<CalIco />}     photoIdx={0} />
        <StatCard label="Upcoming"           value={upcoming}  sub="Confirmed sessions" subColor="#4ade80"                 icon={<ClockIco />}   photoIdx={1} />
        <StatCard label="Completed"          value={completed} sub="Sessions attended"  subColor="#4ade80"                 icon={<CheckIco />}   photoIdx={2} />
        <StatCard label="Cancelled"          value={cancelled} sub="Could not attend"   subColor="rgba(255,180,180,0.75)" icon={<XCircleIco />} photoIdx={3} />
      </div>

      {/* ── Main Table Card ── */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e0dcdc', overflow: 'hidden' }}>

        {/* ── Controls Row ── */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0eeee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>

          {/* Left: search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f7f5f5', border: '1px solid #ece8e8', borderRadius: 9, padding: '7px 12px', width: isMobile ? '100%' : 220 }}>
            <span style={{ color: '#aaa', display: 'flex' }}><SearchIco /></span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search appointments…"
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12, color: '#333', fontFamily: 'Poppins, sans-serif', width: '100%' }}
            />
          </div>

          {/* Right: tab filters + refresh */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* Filter buttons — matches subscription page style */}
            <div style={{ display: 'flex', gap: 6 }}>
              {TABS.map(t => {
                const isActive = activeTab === t.key
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: isActive ? 700 : 500,
                      fontFamily: 'Poppins, sans-serif',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap',
                      background: isActive ? '#800000' : 'transparent',
                      color: isActive ? '#fff' : '#555',
                      border: isActive ? '1.5px solid #800000' : '1.5px solid #e0dcdc',
                    }}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>

            {/* Refresh */}
            <button
              onClick={() => fetchAppointments(true)}
              disabled={refreshing}
              title="Refresh"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, border: '1.5px solid #e0dcdc', borderRadius: 8, background: '#fff', cursor: refreshing ? 'not-allowed' : 'pointer', color: refreshing ? '#ccc' : '#555', flexShrink: 0 }}
            >
              <span style={{ display: 'flex', animation: refreshing ? 'spin 0.9s linear infinite' : 'none' }}><RefreshIco /></span>
            </button>
          </div>
        </div>

        {/* ── Table label row ── */}
        {!loading && !error && (
          <div style={{ padding: '10px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#aaa' }}>{filtered.length} record{filtered.length !== 1 ? 's' : ''} found</span>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div style={{ padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', border: '3px solid #f0eeee', borderTopColor: '#800000', animation: 'spin 0.8s linear infinite' }} />
            <div style={{ fontSize: 13, color: '#aaa' }}>Loading appointments…</div>
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 13, color: '#800000', fontWeight: 600 }}>Failed to load appointments</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>{error}</div>
            <button onClick={() => fetchAppointments()} style={{ marginTop: 6, padding: '7px 16px', background: '#800000', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>Try Again</button>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: '#aaa' }}>
            <EmptyIco />
            <div style={{ fontSize: 14, fontWeight: 600, color: '#555', marginTop: 4 }}>No appointments found</div>
            <div style={{ fontSize: 12 }}>
              {activeTab === 'all' && !search
                ? 'You have no appointments on record yet.'
                : search
                  ? `No results for "${search}".`
                  : `You have no ${TABS.find(t => t.key === activeTab)?.label.toLowerCase()} appointments.`}
            </div>
          </div>
        )}

        {/* ── Table — Desktop / Tablet ── */}
        {!loading && !error && filtered.length > 0 && !isMobile && (
          <div style={{ overflowX: 'auto', marginTop: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f0eeee' }}>
                  {['Date & Time', 'Title / Service', 'Calendar', 'Assigned To', 'Status', 'Location'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', background: '#faf8f8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((appt, i) => (
                  <tr
                    key={appt._id}
                    className="appt-row"
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f5f2f2' : 'none', background: '#fff', transition: 'background 0.12s', cursor: 'default' }}
                  >
                    {/* Date & Time */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e' }}>{fmtDate(appt.startTime)}</div>
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{fmtTime(appt.startTime)}{appt.endTime ? ` — ${fmtTime(appt.endTime)}` : ''}</div>
                    </td>

                    {/* Title */}
                    <td style={{ padding: '14px 16px', maxWidth: 200 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {appt.title || 'Appointment'}
                      </div>
                      {appt.source && <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>{appt.source}</div>}
                    </td>

                    {/* Calendar */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: 12, color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
                        {appt.calendarName || <span style={{ color: '#ccc' }}>—</span>}
                      </div>
                    </td>

                    {/* Assigned To */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      {appt.assignedUserName
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555' }}><UserIco />{appt.assignedUserName}</span>
                        : <span style={{ color: '#ccc', fontSize: 12 }}>—</span>}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <StatusBadge status={appt.appointmentStatus} />
                    </td>

                    {/* Location */}
                    <td style={{ padding: '14px 16px', maxWidth: 160 }}>
                      {appt.location || appt.address
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}><MapPinIco />{appt.location || appt.address}</span>
                        : <span style={{ color: '#ccc', fontSize: 12 }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Cards — Mobile ── */}
        {!loading && !error && filtered.length > 0 && isMobile && (
          <div style={{ padding: '12px 12px 4px' }}>
            {filtered.map((appt, i) => (
              <div
                key={appt._id}
                style={{ background: '#faf8f8', borderRadius: 12, border: '1px solid #ece8e8', padding: '14px 16px', marginBottom: i < filtered.length - 1 ? 10 : 0 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{appt.title || 'Appointment'}</div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{fmtDateTime(appt.startTime)}</div>
                  </div>
                  <StatusBadge status={appt.appointmentStatus} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
                  {appt.calendarName && (
                    <div style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Ico d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" size={12} /> {appt.calendarName}
                    </div>
                  )}
                  {appt.assignedUserName && (
                    <div style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" d2="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={12} /> {appt.assignedUserName}
                    </div>
                  )}
                  {(appt.location || appt.address) && (
                    <div style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Ico d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" d2="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" size={12} /> {appt.location || appt.address}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        {!loading && !error && filtered.length > 0 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f5f2f2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <span style={{ fontSize: 11, color: '#aaa' }}>Showing {filtered.length} of {total} total appointment{total !== 1 ? 's' : ''}</span>
            <span style={{ fontSize: 11, color: '#aaa' }}>Last updated: {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
          </div>
        )}
      </div>
    </div>
  )
}