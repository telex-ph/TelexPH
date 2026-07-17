'use client'

import { useState, useEffect, useRef } from 'react'
import { useDarkMode } from '../../layout'

interface Appointment {
  _id: string
  ghlAppointmentId: string
  calendarId: string
  locationId: string
  contactId?: string
  name?: string
  email?: string
  phone?: string
  title?: string
  startTime: string
  endTime?: string
  appointmentStatus: string
  assignedUserId?: string
  address?: string
  assignedUserName?: string
  calendarName?: string
  location?: string
  attendees?: string[]
  bookedBy?: string
  source?: string
  description?: string
  createdAt: string
  updatedAt: string
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function buildCalendarDays(year: number, month: number) {
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

const getStatusStyle = (status: string, dark: boolean): React.CSSProperties => {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    confirmed: { bg: dark ? 'rgba(5,150,105,0.15)'  : 'rgba(5,150,105,0.09)',  color: '#059669', border: '1px solid rgba(5,150,105,0.25)'  },
    showed:    { bg: dark ? 'rgba(59,130,246,0.15)'  : 'rgba(59,130,246,0.09)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.25)'  },
    noshow:    { bg: dark ? 'rgba(234,179,8,0.15)'   : 'rgba(234,179,8,0.09)',  color: '#ca8a04', border: '1px solid rgba(234,179,8,0.25)'   },
    cancelled: { bg: dark ? 'rgba(220,38,38,0.15)'   : 'rgba(220,38,38,0.09)',  color: '#dc2626', border: '1px solid rgba(220,38,38,0.25)'   },
    invalid:   { bg: dark ? 'rgba(107,114,128,0.15)' : 'rgba(107,114,128,0.09)',color: '#6b7280', border: '1px solid rgba(107,114,128,0.25)' },
  }
  const s = map[status] || map.invalid
  return { background: s.bg, color: s.color, border: s.border, padding: '2px 9px', borderRadius: 4, fontSize: 10, fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif", textTransform: 'uppercase' as const, letterSpacing: '0.04em' }
}

function Sparkline() {
  return (
    <svg width="56" height="24" viewBox="0 0 56 24" fill="none">
      <polyline points="0,20 8,15 18,17 26,8 36,12 46,4 56,2" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function StatIcon({ bg, stroke, children }: { bg: string; stroke: string; children: React.ReactNode }) {
  return (
    <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="18" height="18" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{children}</svg>
    </div>
  )
}

// ── Mini Calendar ──────────────────────────────────────────────────────────────
function MiniCalendar({ appointmentDates, today, cardBg, subtleBg, borderColor, textPrimary, textMuted, dark, onClick }: {
  appointmentDates: Set<string>; today: Date
  cardBg: string; subtleBg: string; borderColor: string; textPrimary: string; textMuted: string; dark: boolean
  onClick: () => void
}) {
  const year    = today.getFullYear()
  const month   = today.getMonth()
  const cells   = buildCalendarDays(year, month)
  const todayDs = toDateStr(year, month, today.getDate())

  return (
    <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 20, overflow: 'hidden', boxShadow: dark ? 'none' : '0 2px 16px rgba(0,0,0,0.06)' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{MONTHS[month]}</p>
            <p style={{ fontSize: 11, color: textMuted, margin: '1px 0 0', fontFamily: "'Poppins', sans-serif" }}>{year}</p>
          </div>
          <div style={{ background: dark ? 'rgba(255,255,255,0.10)' : 'rgba(128,0,0,0.09)', border: dark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(128,0,0,0.18)', borderRadius: 10, padding: '4px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: dark ? '#ffffff' : '#800000', lineHeight: 1, fontFamily: "'Poppins', sans-serif" }}>{appointmentDates.size}</span>
            <span style={{ fontSize: 9, color: dark ? 'rgba(255,255,255,0.70)' : '#800000', opacity: 0.7, fontFamily: "'Poppins', sans-serif", marginTop: 1 }}>appts</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 4 }}>
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: textMuted, padding: '4px 0', fontFamily: "'Poppins', sans-serif", opacity: 0.55 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', rowGap: 0, marginBottom: 16 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} style={{ height: 36 }} />
            const ds      = toDateStr(year, month, day)
            const isToday = ds === todayDs
            const hasAppt = appointmentDates.has(ds)
            return (
              <div key={ds} style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isToday ? '#800000' : 'transparent', color: isToday ? '#fff' : textMuted, fontSize: 12, fontWeight: isToday ? 700 : 400, fontFamily: "'Poppins', sans-serif" }}>{day}</div>
                {hasAppt && !isToday && <span style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#800000' }} />}
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${borderColor}`, padding: '12px 16px' }}>
        <button onClick={onClick} style={{ width: '100%', padding: '10px', borderRadius: 12, border: 'none', background: '#800000', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'opacity .15s' }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Open Full Calendar
        </button>
      </div>
    </div>
  )
}

// ── Full Calendar View (inline page-switch, styled like Image 2) ───────────────
function FullCalendarView({ appointmentDates, appointments, today, onClose, cardBg, subtleBg, borderColor, textPrimary, textMuted, dark }: {
  appointmentDates: Set<string>; appointments: Appointment[]; today: Date; onClose: () => void
  cardBg: string; subtleBg: string; borderColor: string; textPrimary: string; textMuted: string; dark: boolean
}) {
  const isMobileCal = useIsMobile()
  const [viewYear, setViewYear]         = useState(today.getFullYear())
  const [viewMonth, setViewMonth]       = useState(today.getMonth())
  const [calView, setCalView]           = useState<'month' | 'day'>('month')
  const [selectedDate, setSelectedDate] = useState<string>(
    toDateStr(today.getFullYear(), today.getMonth(), today.getDate())
  )

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedApptId, setExpandedApptId] = useState<string | null>(null)
  const [hoveredAppt, setHoveredAppt] = useState<{ appt: Appointment; rect: DOMRect } | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (sidebarOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSidebarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [sidebarOpen])

  const cells   = buildCalendarDays(viewYear, viewMonth)
  const todayDs = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())
  const shiftMonth = (delta: number) => {
    setSidebarOpen(false)
    const newMonth = viewMonth + delta
    const newYear  = newMonth < 0 ? viewYear - 1 : newMonth > 11 ? viewYear + 1 : viewYear
    const clampedMonth = ((newMonth % 12) + 12) % 12
    setViewMonth(clampedMonth)
    setViewYear(newYear)
    // Keep the same day number but move it into the new month (clamp to last day)
    const currentDay = parseInt(selectedDate.split('-')[2], 10)
    const daysInNewMonth = new Date(newYear, clampedMonth + 1, 0).getDate()
    const clampedDay = Math.min(currentDay, daysInNewMonth)
    setSelectedDate(toDateStr(newYear, clampedMonth, clampedDay))
  }
  const prevMonth = () => shiftMonth(-1)
  const nextMonth = () => shiftMonth(1)

  const RED    = '#800000'
  const border = dark ? 'rgba(255,255,255,0.09)' : '#e5e7eb'
  const txt1   = dark ? '#f0f0f0' : '#1f2937'
  const txt2   = dark ? '#6b7280' : '#6b7280'
  const bgPage = dark ? '#0f0f0f' : '#f8f9fa'
  const bgCard = dark ? '#1a1a1a' : '#ffffff'

  // Avatar initials helper
  const initials = (name?: string) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase()
  }

  // Color palette for avatars
  const avatarColors = ['#800000','#059669','#3b82f6','#ca8a04','#7c3aed','#0891b2']
  const avatarColor  = (name?: string) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length]

  // Day view: appointments for selected date
  const dayAppts = appointments.filter(a => a.startTime?.startsWith(selectedDate))

  // Month label for header
  const monthApptCount = appointments.filter(a =>
    a.startTime?.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`)
  ).length


  // ── Day view ──────────────────────────────────────────────────────────────
  const DayView = () => {
    const [expandedDayId, setExpandedDayId] = useState<string | null>(null)
    const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all')

    const getHour = (iso: string) => new Date(iso).getHours()
    const filteredAppts = dayAppts.filter(a => {
      if (timeFilter === 'all') return true
      const h = getHour(a.startTime)
      if (timeFilter === 'morning')   return h >= 0  && h < 12
      if (timeFilter === 'afternoon') return h >= 12 && h < 17
      if (timeFilter === 'evening')   return h >= 17 && h < 24
      return true
    })

    const shiftDay = (delta: number) => {
      const d = new Date(selectedDate + 'T00:00:00')
      d.setDate(d.getDate() + delta)
      const newDs = toDateStr(d.getFullYear(), d.getMonth(), d.getDate())
      setSelectedDate(newDs)
      // Sync calendar month if we cross a month boundary
      if (d.getMonth() !== viewMonth || d.getFullYear() !== viewYear) {
        setViewMonth(d.getMonth())
        setViewYear(d.getFullYear())
      }
      setExpandedDayId(null)
    }

    return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 0, height: '100%', overflowY: 'auto' }}>
      {/* Day header */}
      <div style={{ padding: isMobileCal ? '14px 16px' : '20px 24px', borderBottom: `1px solid ${border}`, background: bgCard }}>
        {/* Top row: date info + cell badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ minWidth: 0, flex: 1, paddingRight: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: txt2, margin: '0 0 2px', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
            <p style={{ fontSize: isMobileCal ? 18 : 28, fontWeight: 800, color: txt1, margin: 0, letterSpacing: '-0.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          {/* Badge cell: number on top, label on bottom */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', background: '#800000', borderRadius: 12, padding: isMobileCal ? '8px 14px' : '10px 18px', flexShrink: 0, minWidth: isMobileCal ? 52 : 64 }}>
            <span style={{ fontSize: isMobileCal ? 20 : 26, fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{dayAppts.length}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.80)', marginTop: 3, letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>appt{dayAppts.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        {/* Pagination row + filter */}
        <div style={{ display: 'flex', flexDirection: isMobileCal ? 'column' as const : 'row' as const, alignItems: isMobileCal ? 'flex-start' : 'center', gap: isMobileCal ? 8 : 0, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => shiftDay(-1)}
              title="Previous day"
              style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${border}`, background: dark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', color: txt2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button
              onClick={() => shiftDay(1)}
              title="Next day"
              style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${border}`, background: dark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', color: txt2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          {/* Time-of-day filter — wraps on mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' as const }}>
            {(['all', 'morning', 'afternoon', 'evening'] as const).map(f => {
              const labels: Record<string, string> = { all: 'All', morning: isMobileCal ? 'AM' : 'Morning', afternoon: isMobileCal ? 'PM' : 'Afternoon', evening: isMobileCal ? 'Eve' : 'Evening' }
              const active = timeFilter === f
              return (
                <button key={f} onClick={() => setTimeFilter(f)} style={{ padding: isMobileCal ? '5px 10px' : '5px 12px', borderRadius: 8, border: `1px solid ${active ? RED : border}`, background: active ? '#800000' : (dark ? 'rgba(255,255,255,0.04)' : '#f9fafb'), color: active ? '#ffffff' : txt2, fontSize: 11, fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap' as const }}>
                  {labels[f]}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      {filteredAppts.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 12, opacity: 0.3 }}>
          <svg width="40" height="40" fill="none" stroke={txt2} strokeWidth="1.3" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <p style={{ fontSize: 12, color: txt2, margin: 0 }}>{timeFilter === 'all' ? 'No appointments this day' : `No ${timeFilter} appointments`}</p>
        </div>
      ) : (
        <div style={{ padding: isMobileCal ? '12px 14px' : '16px 24px', display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
          {filteredAppts.map(appt => {
            const isExpanded = expandedDayId === appt._id

            const DetailRow = ({ iconPath, label, value }: { iconPath: string; label: string; value?: string | null }) =>
              value ? (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: dark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <svg width="12" height="12" fill="none" stroke={dark ? '#9ca3af' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={iconPath}/></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: txt2, margin: '0 0 1px', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{label}</p>
                    <p style={{ fontSize: 12, color: dark ? '#d1d5db' : '#1f2937', margin: 0, wordBreak: 'break-word' as const }}>{value}</p>
                  </div>
                </div>
              ) : null

            return (
            <div key={appt._id} style={{
              background: bgCard,
              border: `1px solid ${isExpanded ? RED : border}`,
              borderRadius: 14,
              overflow: 'hidden',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: isExpanded ? (dark ? '0 4px 24px rgba(128,0,0,0.18)' : '0 4px 24px rgba(128,0,0,0.08)') : 'none',
            }}>
              {/* Clickable header row */}
              <div
                onClick={() => setExpandedDayId(isExpanded ? null : appt._id)}
                style={{ padding: isMobileCal ? '12px 14px' : '14px 16px', display: 'flex', alignItems: 'center', gap: isMobileCal ? 10 : 14, cursor: 'pointer', userSelect: 'none' as const }}
              >
                <div style={{ width: isMobileCal ? 36 : 40, height: isMobileCal ? 36 : 40, borderRadius: '50%', background: avatarColor(appt.name), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: isExpanded ? '2px solid rgba(128,0,0,0.3)' : '2px solid transparent', transition: 'border 0.2s' }}>
                  <span style={{ fontSize: isMobileCal ? 11 : 13, fontWeight: 700, color: '#fff', fontFamily: "'Poppins', sans-serif" }}>{initials(appt.name)}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: isMobileCal ? 12 : 13, fontWeight: 600, color: txt1, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{appt.name || appt.title || 'Appointment'}</p>
                  <p style={{ fontSize: 11, color: txt2, margin: 0 }}>{formatTime(appt.startTime)}{appt.endTime ? ` – ${formatTime(appt.endTime)}` : ''}</p>
                </div>
                {appt.appointmentStatus && !isMobileCal && <span style={getStatusStyle(appt.appointmentStatus, dark)}>{appt.appointmentStatus}</span>}
                <div style={{ width: 28, height: 28, borderRadius: 8, background: isExpanded ? (dark ? 'rgba(128,0,0,0.25)' : 'rgba(128,0,0,0.08)') : (dark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
                  <svg width="12" height="12" fill="none" stroke={isExpanded ? RED : txt2} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>

              {/* ── Expanded full details ── */}
              {isExpanded && (
                <>
                  <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${dark ? 'rgba(128,0,0,0.4)' : 'rgba(128,0,0,0.2)'}, transparent)` }} />
                  <div style={{ padding: isMobileCal ? '12px 14px 14px' : '16px 20px 18px' }}>

                    {/* Contact Information */}
                    <p style={{ fontSize: 10, fontWeight: 700, color: RED, margin: '0 0 10px', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Contact Information</p>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, marginBottom: 16 }}>
                      <DetailRow iconPath="M16 7a4 4 0 11-8 0 4 4 0 018 0M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" label="Full Name" value={appt.name} />
                      <DetailRow iconPath="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" label="Email" value={appt.email} />
                      <DetailRow iconPath="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" label="Phone" value={appt.phone} />
                      <DetailRow iconPath="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" label="Address" value={appt.address || appt.location} />
                    </div>

                    {/* Appointment Details */}
                    <div style={{ height: 1, background: dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0', margin: '0 0 14px' }} />
                    <p style={{ fontSize: 10, fontWeight: 700, color: RED, margin: '0 0 10px', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Appointment Details</p>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, marginBottom: 4 }}>
                      <DetailRow iconPath="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" label="Title" value={appt.title} />
                      <DetailRow iconPath="M12 6v6l4 2M12 2a10 10 0 110 20A10 10 0 0112 2" label="Start Time" value={new Date(appt.startTime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })} />
                      {appt.endTime && <DetailRow iconPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" label="End Time" value={new Date(appt.endTime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })} />}
                      <DetailRow iconPath="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" label="Calendar" value={appt.calendarName} />
                      <DetailRow iconPath="M16 7a4 4 0 11-8 0 4 4 0 018 0M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" label="Assigned To" value={appt.assignedUserName} />
                      <DetailRow iconPath="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" label="Source" value={appt.source} />
                      <DetailRow iconPath="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" label="Booked By" value={appt.bookedBy} />
                    </div>

                    {/* Description */}
                    {appt.description && (
                      <>
                        <div style={{ height: 1, background: dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0', margin: '14px 0' }} />
                        <p style={{ fontSize: 10, fontWeight: 700, color: RED, margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Description</p>
                        <p style={{ fontSize: 12, color: dark ? '#d1d5db' : '#374151', margin: 0, lineHeight: 1.6, background: dark ? 'rgba(255,255,255,0.03)' : '#f9fafb', padding: '10px 12px', borderRadius: 8, border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e5e7eb'}` }}>{appt.description}</p>
                      </>
                    )}

                  </div>
                </>
              )}
            </div>
            )
          })}
        </div>
      )}
    </div>
    )
  }




  // ── Month view ────────────────────────────────────────────────────────────
  const MonthView = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}>
      {/* Weekday header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: `1px solid ${border}`, background: dark ? 'rgba(255,255,255,0.02)' : '#fafafa', flexShrink: 0 }}>
        {(isMobileCal ? ['S','M','T','W','T','F','S'] : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']).map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: isMobileCal ? 10 : 11, fontWeight: 600, color: txt2, padding: isMobileCal ? '8px 0' : '12px 0', borderRight: i < 6 ? `1px solid ${border}` : 'none' }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gridAutoRows: isMobileCal ? 'minmax(70px, 1fr)' : 'minmax(130px, 1fr)' }}>
          {cells.map((day, i) => {
            const col         = i % 7
            const isLastInRow = col === 6
            const rowIndex    = Math.floor(i / 7)
            const totalRows   = Math.ceil(cells.length / 7)
            const isLastRow   = rowIndex === totalRows - 1

            if (!day) return (
              <div key={`e-${i}`} style={{
                borderRight: !isLastInRow ? `1px solid ${border}` : 'none',
                borderBottom: !isLastRow ? `1px solid ${border}` : 'none',
                background: dark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.015)',
              }} />
            )

            const ds         = toDateStr(viewYear, viewMonth, day)
            const isToday    = ds === todayDs
            const isSelected = selectedDate === ds
            const dayApptList = appointments.filter(a => a.startTime?.startsWith(ds))
            const MAX_CHIPS    = 2
            const visible      = dayApptList.slice(0, MAX_CHIPS)
            const overflowList = dayApptList.slice(MAX_CHIPS)
            const overflow     = overflowList.length
            const AVATAR_SHOW  = 3
            const overflowAvatars = overflowList.slice(0, AVATAR_SHOW)

            return (
              <div
                key={ds}
                onClick={() => {
                  if (selectedDate === ds && sidebarOpen) {
                    setSidebarOpen(false)
                  } else {
                    setSelectedDate(ds)
                    setSidebarOpen(true)
                  }
                }}
                style={{
                  borderRight: !isLastInRow ? `1px solid ${border}` : 'none',
                  borderBottom: !isLastRow ? `1px solid ${border}` : 'none',
                  padding: isMobileCal ? '4px 2px 2px' : '8px 6px 6px',
                  cursor: 'pointer',
                  background: isSelected
                    ? (dark ? 'rgba(128,0,0,0.12)' : 'rgba(128,0,0,0.04)')
                    : isToday
                      ? (dark ? 'rgba(128,0,0,0.08)' : 'rgba(128,0,0,0.03)')
                      : 'transparent',
                  position: 'relative',
                  display: 'flex', flexDirection: 'column' as const, gap: 3,
                  transition: 'background 0.1s',
                }}
              >
                {/* Today top bar */}
                {isToday && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: RED }} />}

                {/* Day number */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{
                    fontSize: isMobileCal ? 11 : 13, fontWeight: isToday ? 700 : 400,
                    color: isToday ? RED : (isSelected ? RED : txt1),
                    lineHeight: 1,
                  }}>{day}</span>
                </div>

                {/* Appointment chips — card style on desktop, dots on mobile */}
                {isMobileCal ? (
                  /* Mobile: just show a row of colored dots */
                  dayApptList.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, flexWrap: 'wrap' as const, marginTop: 2 }}>
                      {dayApptList.slice(0, 3).map(appt => (
                        <span key={appt._id} style={{ width: 5, height: 5, borderRadius: '50%', background: avatarColor(appt.name), flexShrink: 0 }} />
                      ))}
                      {dayApptList.length > 3 && <span style={{ fontSize: 8, fontWeight: 700, color: RED, lineHeight: 1 }}>+{dayApptList.length - 3}</span>}
                    </div>
                  )
                ) : (
                  <>
                {visible.map(appt => (
                  <div key={appt._id}
                    onMouseEnter={e => { e.stopPropagation(); setHoveredAppt({ appt, rect: (e.currentTarget as HTMLElement).getBoundingClientRect() }) }}
                    onMouseLeave={() => setHoveredAppt(null)}
                    onClick={e => e.stopPropagation()}
                    style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: dark ? '#2a2a2a' : '#ffffff',
                    border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e8e8e8',
                    borderRadius: 8,
                    padding: '5px 7px',
                    overflow: 'hidden',
                    boxShadow: dark ? 'none' : '0 1px 4px rgba(0,0,0,0.07)',
                    cursor: 'default',
                  }}>
                    {/* Avatar circle */}
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: avatarColor(appt.name),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 9, fontWeight: 700, color: '#fff',
                    }}>
                      {initials(appt.name)}
                    </div>
                    {/* Name + time stacked */}
                    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' as const, gap: 1 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600,
                        color: txt1,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
                        lineHeight: 1.2,
                      }}>
                        {appt.name || appt.title || 'Appointment'}
                      </span>
                      <span style={{
                        fontSize: 9, fontWeight: 500,
                        color: '#5b8dee',
                        whiteSpace: 'nowrap' as const,
                        lineHeight: 1.2,
                      }}>
                        {formatTime(appt.startTime)}{appt.endTime ? ` - ${formatTime(appt.endTime)}` : ''}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Overflow: stacked avatars + +N count badge */}
                {overflow > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 2, marginTop: 1 }}>
                    {/* Stacked avatar circles */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {overflowAvatars.map((oa, i) => (
                        <div
                          key={oa._id}
                          onMouseEnter={e => { e.stopPropagation(); setHoveredAppt({ appt: oa, rect: (e.currentTarget as HTMLElement).getBoundingClientRect() }) }}
                          onMouseLeave={() => setHoveredAppt(null)}
                          onClick={e => e.stopPropagation()}
                          style={{
                            width: 22, height: 22, borderRadius: '50%',
                            background: avatarColor(oa.name),
                            border: `2px solid ${dark ? '#1a1a1a' : '#ffffff'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 8, fontWeight: 700, color: '#fff',
                            marginLeft: i === 0 ? 0 : -7,
                            zIndex: AVATAR_SHOW - i,
                            position: 'relative',
                            cursor: 'default',
                            flexShrink: 0,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                          }}>
                          {initials(oa.name)}
                        </div>
                      ))}
                    </div>
                    {/* +N count badge */}
                    {overflow > AVATAR_SHOW && (
                      <div style={{
                        height: 18, minWidth: 24, borderRadius: 10,
                        background: dark ? 'rgba(128,0,0,0.25)' : 'rgba(128,0,0,0.10)',
                        border: `1px solid ${dark ? 'rgba(128,0,0,0.5)' : 'rgba(128,0,0,0.25)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        paddingLeft: 4, paddingRight: 5,
                        fontSize: 9, fontWeight: 700, color: RED,
                        marginLeft: 3,
                        letterSpacing: '-0.02em',
                      }}>
                        +{overflow - AVATAR_SHOW}
                      </div>
                    )}
                    {overflow <= AVATAR_SHOW && (
                      <span style={{ fontSize: 9, fontWeight: 600, color: RED, marginLeft: 2 }}>+{overflow}</span>
                    )}
                  </div>
                )}
                  </>
                )}{/* end desktop chips */}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes fcSlideIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes sidebarIn { from { opacity:0; transform:translateX(12px) } to { opacity:1; transform:translateX(0) } }
        @keyframes sidebarUp { from { opacity:0; transform:translateY(100%) } to { opacity:1; transform:translateY(0) } }
        @keyframes tooltipPop { from { opacity:0; transform:scale(0.92) } to { opacity:1; transform:scale(1) } }
      `}</style>
      <div style={{ display: 'flex', flexDirection: isMobileCal ? 'column' as const : 'row' as const, gap: 20, alignItems: 'flex-start', fontFamily: "'Poppins', sans-serif", animation: 'fcSlideIn 0.22s cubic-bezier(0.16,1,0.3,1) both' }} ref={containerRef} onMouseDown={e => { if (e.target === e.currentTarget) setSidebarOpen(false) }}>

        {/* ── Calendar box ── */}
        <div style={{
          flex: 1, minWidth: 0,
          background: bgPage, borderRadius: 20, border: `1px solid ${border}`,
          overflow: 'hidden', display: 'flex', flexDirection: 'column' as const,
          minHeight: isMobileCal ? 400 : 600,
        }}>

        {/* ── Top bar ── */}
        <div style={{ background: '#800000', borderBottom: '1px solid rgba(255,255,255,0.12)', padding: isMobileCal ? '10px 14px' : '14px 24px', flexShrink: 0 }}>
          {/* Row 1 (mobile) or single row (desktop) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobileCal ? 8 : 0 }}>
            {/* Left: Back button */}
            <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: isMobileCal ? '5px 10px' : '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)', background: '#ffffff', color: '#800000', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all .15s', flexShrink: 0 }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>

            {/* Center: prev arrow + date label + next arrow */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isMobileCal ? 6 : 10 }}>
              <button onClick={prevMonth} style={{ width: isMobileCal ? 28 : 30, height: isMobileCal ? 28 : 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)', background: '#ffffff', color: '#800000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{ fontSize: isMobileCal ? 14 : 16, fontWeight: 700, color: '#ffffff' }}>{isMobileCal ? MONTHS_SHORT[viewMonth] : MONTHS[viewMonth]},</span>
                <span style={{ fontSize: isMobileCal ? 12 : 14, color: 'rgba(255,255,255,0.75)', fontWeight: 400 }}>{viewYear}</span>
              </div>
              <button onClick={nextMonth} style={{ width: isMobileCal ? 28 : 30, height: isMobileCal ? 28 : 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)', background: '#ffffff', color: '#800000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

            {/* Right: Day/Month toggle (appt count hidden on mobile) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobileCal ? 0 : 14, flexShrink: 0 }}>
              {!isMobileCal && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>{monthApptCount}</span> appt{monthApptCount !== 1 ? 's' : ''} this month
              </span>}
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: 3, gap: 2 }}>
                {(['Day','Month'] as const).map(v => (
                  <button key={v} onClick={() => { setCalView(v.toLowerCase() as 'day' | 'month'); if (v === 'Day') setSidebarOpen(false) }} style={{ padding: isMobileCal ? '4px 10px' : '5px 14px', borderRadius: 6, border: 'none', background: calView === v.toLowerCase() ? '#ffffff' : 'transparent', color: calView === v.toLowerCase() ? '#800000' : 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: calView === v.toLowerCase() ? 600 : 500, cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap' as const }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2 on mobile: appt count centered */}
          {isMobileCal && (
            <div style={{ textAlign: 'center', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>{monthApptCount}</span> appt{monthApptCount !== 1 ? 's' : ''} this month
              </span>
            </div>
          )}
        </div>

        {/* ── Body: calendar only ── */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' as const }}>
          {calView === 'month' ? <MonthView /> : <DayView />}
        </div>

        </div>{/* end calendar box */}

        {/* ── Sidebar: bottom sheet on mobile, adjacent panel on desktop ── */}
        {sidebarOpen && (() => {
          const sd      = selectedDate
          const sdAppts = appointments.filter(a => a.startTime?.startsWith(sd))
          const sdDate  = new Date(sd + 'T00:00:00')
          const weekday = sdDate.toLocaleDateString('en-US', { weekday: 'long' })
          const fullDate = sdDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          const initials = (name?: string) => {
            if (!name) return '?'
            const parts = name.trim().split(' ')
            return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase()
          }
          return (
            <>
              {/* Mobile backdrop */}
              {isMobileCal && (
                <div
                  onClick={() => setSidebarOpen(false)}
                  style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, backdropFilter: 'blur(2px)' }}
                />
              )}
            <div style={{
              ...(isMobileCal ? {
                position: 'fixed' as const,
                bottom: 0, left: 0, right: 0,
                borderRadius: '20px 20px 0 0',
                maxHeight: '70vh',
                zIndex: 201,
              } : {
                width: 300, flexShrink: 0,
                borderRadius: 20,
                alignSelf: 'flex-start' as const,
                minHeight: 600,
              }),
              border: `1px solid ${border}`,
              display: 'flex', flexDirection: 'column' as const,
              overflow: 'hidden',
              background: dark ? '#141414' : '#ffffff',
              boxShadow: dark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.07)',
              animation: isMobileCal ? 'sidebarUp 0.28s cubic-bezier(0.16,1,0.3,1) both' : 'sidebarIn 0.22s cubic-bezier(0.16,1,0.3,1) both',
            }}>

              {/* Mobile drag handle */}
              {isMobileCal && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: dark ? 'rgba(255,255,255,0.18)' : '#d1d5db' }} />
                </div>
              )}

              {/* ── Header ── */}
              <div style={{ flexShrink: 0, position: 'relative' as const, overflow: 'hidden', background: 'linear-gradient(135deg, #800000 0%, #a00000 60%, #6b0000 100%)', borderBottom: `1px solid rgba(255,255,255,0.12)` }}>
                {/* Decorative background circles */}
                <div style={{ position: 'absolute' as const, top: -24, right: -24, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' as const }} />
                <div style={{ position: 'absolute' as const, bottom: -16, left: -16, width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' as const }} />
                <div style={{ position: 'absolute' as const, top: 10, right: 60, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' as const }} />
                <div style={{ position: 'relative' as const, padding: '18px 18px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.85)' }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Daily View</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} style={{ width: 26, height: 26, borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}>
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                  <p style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', margin: '0 0 2px', letterSpacing: '-0.3px' }}>{weekday}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0, fontWeight: 400 }}>{fullDate}</p>
                  {/* Stats row */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 12px' }}>
                      <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1 }}>{sdAppts.length}</p>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', margin: '3px 0 0' }}>Total appts</p>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 12px' }}>
                      <p style={{ fontSize: 20, fontWeight: 700, color: '#6ee7b7', margin: 0, lineHeight: 1 }}>{sdAppts.filter(a => a.appointmentStatus === 'confirmed').length}</p>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', margin: '3px 0 0' }}>Confirmed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Appointment list ── */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                {sdAppts.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', height: 200, gap: 10, opacity: 0.3 }}>
                    <svg width="36" height="36" fill="none" stroke={txt2} strokeWidth="1.3" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <p style={{ fontSize: 12, color: txt2, margin: 0 }}>No appointments</p>
                  </div>
                ) : (
                  sdAppts.map((appt, idx) => {
                    const isExpanded = expandedApptId === appt._id
                    const contactRows = [
                      { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', val: appt.email },
                      { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', val: appt.phone },
                    ].filter(r => r.val)
                    return (
                    <div key={appt._id} style={{
                      background: dark ? 'rgba(255,255,255,0.03)' : '#fafafa',
                      border: `1px solid ${isExpanded ? RED : border}`,
                      borderRadius: 14,
                      overflow: 'hidden',
                      animation: `sidebarIn 0.18s ${idx * 0.05}s ease both`,
                      transition: 'border-color 0.2s',
                    }}>
                      <div onClick={() => setExpandedApptId(isExpanded ? null : appt._id)} style={{ padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' as const }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{initials(appt.name)}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: txt1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{appt.name || appt.title || 'Appointment'}</p>
                          <p style={{ fontSize: 11, color: txt2, margin: '2px 0 0' }}>{formatTime(appt.startTime)}{appt.endTime ? ` – ${formatTime(appt.endTime)}` : ''}</p>
                        </div>
                        {appt.appointmentStatus && <span style={getStatusStyle(appt.appointmentStatus, dark)}>{appt.appointmentStatus}</span>}
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: dark ? 'rgba(255,255,255,0.06)' : '#efefef', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="11" height="11" fill="none" stroke={txt2} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                      </div>
                      {isExpanded && contactRows.length > 0 && (
                        <>
                          <div style={{ height: 1, background: border, margin: '0 14px' }} />
                          <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column' as const, gap: 7 }}>
                            {contactRows.map((row, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 24, height: 24, borderRadius: 6, background: dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <svg width="10" height="10" fill="none" stroke={txt2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={row.icon}/></svg>
                                </div>
                                <p style={{ fontSize: 11, color: txt2, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{row.val}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    )
                  })
                )}
              </div>
            </div>
            </>
          )
        })()}

      </div>{/* end outer flex */}

      {/* ── Appointment Hover Tooltip ── */}
      {hoveredAppt && (() => {
        const { appt, rect } = hoveredAppt
        const TOOLTIP_W = 264
        const TOOLTIP_GAP = 10
        const vpW = window.innerWidth

        // Decide: show to the RIGHT of the chip, or LEFT if not enough space
        const spaceRight = vpW - rect.right
        const showRight  = spaceRight >= TOOLTIP_W + TOOLTIP_GAP + 8

        const left = showRight
          ? rect.right + TOOLTIP_GAP
          : rect.left - TOOLTIP_W - TOOLTIP_GAP

        // Vertically: center tooltip to chip, clamped to viewport
        const chipCenterY  = rect.top + rect.height / 2
        const APPROX_H     = 220
        let top            = chipCenterY - APPROX_H / 2
        top                = Math.max(8, Math.min(top, window.innerHeight - APPROX_H - 8))

        // Arrow side & vertical position relative to tooltip
        const arrowSide  = showRight ? 'left' : 'right'
        const arrowTop   = chipCenterY - top - 6

        const tooltipInitials = (name?: string) => {
          if (!name) return '?'
          const p = name.trim().split(' ')
          return p.length >= 2 ? (p[0][0] + p[p.length-1][0]).toUpperCase() : name.slice(0,2).toUpperCase()
        }
        const detailRows = [
          { icon: 'M12 6v6l4 2M12 2a10 10 0 110 20A10 10 0 0112 2', val: `${formatTime(appt.startTime)}${appt.endTime ? ` – ${formatTime(appt.endTime)}` : ''}` },
          { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', val: appt.email },
          { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', val: appt.phone },
          { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', val: appt.calendarName },
          { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', val: appt.assignedUserName },
          { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', val: appt.location || appt.address },
        ].filter(r => r.val)

        return (
          <div style={{
            position: 'fixed', left, top,
            width: TOOLTIP_W,
            zIndex: 9999,
            background: dark ? '#1e1e1e' : '#ffffff',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : '#e5e7eb'}`,
            borderRadius: 16,
            boxShadow: dark ? '0 20px 60px rgba(0,0,0,0.7)' : '0 16px 48px rgba(0,0,0,0.18)',
            overflow: 'visible',
            pointerEvents: 'none' as const,
            animation: 'tooltipPop 0.14s cubic-bezier(0.16,1,0.3,1) both',
            fontFamily: "'Poppins', sans-serif",
          }}>
            {/* Side arrow bubble tail */}
            <div style={{
              position: 'absolute',
              top: Math.max(12, arrowTop),
              [arrowSide]: -7,
              width: 13, height: 13,
              background: '#800000',
              transform: 'rotate(45deg)',
              borderRadius: 2,
              zIndex: -1,
            }} />

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #800000 0%, #a00000 60%, #6b0000 100%)', borderRadius: '16px 16px 0 0', padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: avatarColor(appt.name), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid rgba(255,255,255,0.3)' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{tooltipInitials(appt.name)}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{appt.name || appt.title || 'Appointment'}</p>
                {appt.appointmentStatus && (
                  <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(255,255,255,0.22)', color: '#fff', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'inline-block', marginTop: 4 }}>
                    {appt.appointmentStatus}
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '11px 15px 13px', display: 'flex', flexDirection: 'column' as const, gap: 8, borderRadius: '0 0 16px 16px', overflow: 'hidden' }}>
              {detailRows.map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: dark ? 'rgba(255,255,255,0.07)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="10" fill="none" stroke={dark ? '#9ca3af' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={row.icon}/></svg>
                  </div>
                  <span style={{ fontSize: 11, color: dark ? '#d1d5db' : '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{row.val}</span>
                </div>
              ))}
              {appt.description && (
                <div style={{ marginTop: 2, padding: '7px 9px', background: dark ? 'rgba(255,255,255,0.04)' : '#f9fafb', borderRadius: 8, border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e5e7eb'}` }}>
                  <p style={{ fontSize: 10, color: dark ? '#9ca3af' : '#6b7280', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{appt.description}</p>
                </div>
              )}
            </div>
          </div>
        )
      })()}
    </>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AppointmentsPage() {
  const { isdarkmode: dark } = useDarkMode()
  const isMobile = useIsMobile()

  const pageBg      = dark ? '#0f0f0f'                : '#f8f9fa'
  const cardBg      = dark ? '#1a1a1a'                : '#ffffff'
  const subtleBg    = dark ? '#202020'                : '#f9fafb'
  const borderColor = dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'
  const textPrimary = dark ? '#f0f0f0'                : '#1f2937'
  const textMuted   = dark ? '#6b7280'                : '#6b7280'

  const [appointments, setAppointments]         = useState<Appointment[]>([])
  const [isLoading, setIsLoading]               = useState(true)
  const [showFullCalendar, setShowFullCalendar] = useState(false)
  const [isSyncing, setIsSyncing]               = useState(false)
  const [syncMessage, setSyncMessage]           = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [confirmingId, setConfirmingId]         = useState<string | null>(null)
  const [confirmFeedback, setConfirmFeedback]   = useState<Record<string, { type: 'success' | 'error'; text: string }>>({})
  const [credentialsModal, setCredentialsModal] = useState<{ email: string; password: string; name: string } | null>(null)
  const [sortOrder, setSortOrder]               = useState<'newest' | 'oldest' | 'name-az' | 'name-za'>('name-az')
  const [viewMode, setViewMode]                 = useState<'cards' | 'list'>('cards')
  const [searchQuery, setSearchQuery]           = useState('')
  const [statusFilter, setStatusFilter]         = useState<'all' | 'upcoming' | 'past'>('all')
  const [displayCount, setDisplayCount]         = useState(5)
  const [confirmedIds, setConfirmedIds]         = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage]           = useState(1)
  const PAGE_SIZE = 5
  const today = new Date()

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`https://telexph-admin.onrender.com/api/appointments`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      if (res.ok) { const data = await res.json(); setAppointments(Array.isArray(data) ? data : data.appointments || []) }
    } catch (e) { console.error(e) } finally { setIsLoading(false) }
  }

  const handleResync = async () => {
    try {
      setIsSyncing(true); setSyncMessage(null)
      const res  = await fetch(`https://telexph-admin.onrender.com/api/appointments/sync`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      const data = await res.json()
      if (res.ok) { setSyncMessage({ type: 'success', text: data.message || `✅ Synced ${data.count} appointments` }); await fetchAppointments() }
      else setSyncMessage({ type: 'error', text: data.error || 'Sync failed. Please try again.' })
    } catch { setSyncMessage({ type: 'error', text: 'Network error during sync.' }) }
    finally { setIsSyncing(false); setTimeout(() => setSyncMessage(null), 4000) }
  }

  const handleConfirm = async (appt: Appointment) => {
    if (!appt.email) {
      setConfirmFeedback(prev => ({ ...prev, [appt.ghlAppointmentId]: { type: 'error', text: 'No email address on this appointment.' } }))
      setTimeout(() => setConfirmFeedback(prev => { const n = { ...prev }; delete n[appt.ghlAppointmentId]; return n }), 4000)
      return
    }
    try {
      setConfirmingId(appt.ghlAppointmentId)
      const res  = await fetch(`https://telexph-admin.onrender.com/api/appointments/${appt.ghlAppointmentId}/confirm`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      const data = await res.json()
      if (res.ok && data.credentials) { setCredentialsModal(data.credentials); setConfirmedIds(prev => new Set([...prev, appt.ghlAppointmentId])); setDisplayCount(prev => prev + 1) }
      else {
        setConfirmFeedback(prev => ({ ...prev, [appt.ghlAppointmentId]: { type: 'error', text: data.message || data.error || 'Confirmation failed.' } }))
        setTimeout(() => setConfirmFeedback(prev => { const n = { ...prev }; delete n[appt.ghlAppointmentId]; return n }), 5000)
      }
    } catch {
      setConfirmFeedback(prev => ({ ...prev, [appt.ghlAppointmentId]: { type: 'error', text: 'Network error. Please try again.' } }))
      setTimeout(() => setConfirmFeedback(prev => { const n = { ...prev }; delete n[appt.ghlAppointmentId]; return n }), 5000)
    } finally { setConfirmingId(null) }
  }

  useEffect(() => { fetchAppointments() }, [])
  useEffect(() => { setDisplayCount(5); setCurrentPage(1) }, [searchQuery, statusFilter, sortOrder])

  const appointmentDates = new Set(appointments.map(a => a.startTime?.split('T')[0]).filter(Boolean))
  const todayDateStr     = new Date().toDateString()

  const filtered = appointments.filter(a => {
    const q           = searchQuery.toLowerCase()
    const matchSearch = !q || (a.title || '').toLowerCase().includes(q) || (a.name || '').toLowerCase().includes(q) || (a.email || '').toLowerCase().includes(q) || (a.phone || '').toLowerCase().includes(q)
    const apptDate    = new Date(a.startTime)
    const isUpcoming  = apptDate >= new Date(todayDateStr)
    const matchFilter = statusFilter === 'all' ? true : statusFilter === 'upcoming' ? isUpcoming : !isUpcoming
    return matchSearch && matchFilter
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'name-az') return (a.title || a.name || '').localeCompare(b.title || b.name || '')
    if (sortOrder === 'name-za') return (b.title || b.name || '').localeCompare(a.title || a.name || '')
    const diff = new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    return sortOrder === 'newest' ? -diff : diff
  })

  const upcoming            = sorted.filter(a => new Date(a.startTime) >= new Date(today.toDateString()))
  const past                = sorted.filter(a => new Date(a.startTime) <  new Date(today.toDateString()))
  const upcomingFilterCount = appointments.filter(a => new Date(a.startTime) >= new Date(new Date().toDateString())).length
  const pastFilterCount     = appointments.filter(a => new Date(a.startTime) <  new Date(new Date().toDateString())).length

  const todayStr   = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())
  const todayCount = appointments.filter(a => a.startTime?.startsWith(todayStr)).length
  const weekStart  = new Date(today); weekStart.setDate(today.getDate() - today.getDay())
  const weekCount  = appointments.filter(a => { const d = new Date(a.startTime); return d >= weekStart && d <= today }).length
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthCount = appointments.filter(a => { const d = new Date(a.startTime); return d >= monthStart && d <= today }).length
  const yearStart  = new Date(today.getFullYear(), 0, 1)
  const yearCount  = appointments.filter(a => { const d = new Date(a.startTime); return d >= yearStart && d <= today }).length

  const statCards = [
    { label: 'Total appointments', value: appointments.length, sub: `${upcoming.length} upcoming`, isDark: false, iconEl: <StatIcon bg={dark ? 'rgba(128,0,0,0.20)' : 'rgba(128,0,0,0.09)'} stroke={dark ? '#f87171' : '#800000'}><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></StatIcon> },
    { label: 'Today', value: todayCount, sub: 'Appointments today', isDark: false, iconEl: <StatIcon bg={dark ? 'rgba(52,211,153,0.15)' : 'rgba(5,150,105,0.10)'} stroke={dark ? '#34d399' : '#059669'}><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></StatIcon> },
    { label: 'This week', value: weekCount, sub: 'Appointments this week', isDark: false, iconEl: <StatIcon bg={dark ? 'rgba(96,165,250,0.15)' : 'rgba(59,130,246,0.10)'} stroke={dark ? '#60a5fa' : '#3b82f6'}><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></StatIcon> },
    { label: 'This month', value: monthCount, sub: 'Appointments this month', isDark: false, iconEl: <StatIcon bg={dark ? 'rgba(251,191,36,0.15)' : 'rgba(202,138,4,0.10)'} stroke={dark ? '#fbbf24' : '#ca8a04'}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></StatIcon> },
    { label: 'This year', value: yearCount, sub: 'Appointments this year', isDark: true, iconEl: null },
  ]

  const AppointmentCard = ({ appt }: { appt: Appointment }) => {
    const apptDate     = new Date(appt.startTime)
    const isUpcoming   = apptDate >= new Date(today.toDateString())
    const isConfirming = confirmingId === appt.ghlAppointmentId
    const feedback     = confirmFeedback[appt.ghlAppointmentId]
    return (
      <div className="appt-card" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 18, padding: isMobile ? '14px 12px' : '18px 20px', display: 'flex', alignItems: 'flex-start', gap: isMobile ? 10 : 16, transition: 'all .2s' }}>
        {/* Ribbon / bookmark shape */}
        <div style={{ position: 'relative', width: 48, flexShrink: 0, alignSelf: 'stretch', minHeight: 72 }}>
          <svg
            viewBox="0 0 48 80"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', top: -18, left: 0, width: 48, height: 'calc(100% + 28px)', display: 'block' }}
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 H48 V68 L24,54 L0,68 Z"
              fill="#5a0000"
            />
          </svg>
          {/* Date text on top of ribbon */}
          <div style={{ position: 'absolute', top: 4, left: 0, width: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
            <span style={{ fontSize: 10, color: '#fff', fontFamily: "'Poppins', sans-serif", lineHeight: 1.2 }}>
              {apptDate.toLocaleDateString('en-US', { month: 'short' })}
            </span>
            <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1, color: '#fff', fontFamily: "'Poppins', sans-serif" }}>
              {apptDate.getDate()}
            </span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' as const }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>{appt.title || appt.name || 'Appointment'}</p>
            <div style={{ fontSize: 10, color: textMuted, flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>{new Date(appt.startTime).toLocaleDateString('en-US', { weekday: 'short' })}</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px 16px', marginBottom: 6 }}>
            {[
              { icon: 'M12 6v6l4 2M12 2a10 10 0 110 20A10 10 0 0112 2', val: `${formatTime(appt.startTime)}${appt.endTime ? ` – ${formatTime(appt.endTime)}` : ''}` },
              { icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 110 8 4 4 0 010-8', val: appt.name },
              { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', val: appt.phone },
              { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', val: appt.location || appt.address },
              { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', val: appt.calendarName },
              { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', val: appt.assignedUserName },
            ].filter(r => r.val).map((row, idx) => (
              <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>
                <svg width="11" height="11" fill="none" stroke={textMuted} strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d={row.icon}/></svg>
                {row.val}
              </span>
            ))}
            {appt.appointmentStatus && <span style={getStatusStyle(appt.appointmentStatus, dark)}>{appt.appointmentStatus}</span>}
          </div>
          {appt.email && <p style={{ fontSize: 11, color: textMuted, margin: '0 0 8px', fontFamily: "'Poppins', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{appt.email}</p>}
          {appt.description && <p style={{ fontSize: 11, color: textMuted, margin: '0 0 8px', fontFamily: "'Poppins', sans-serif", display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{appt.description}</p>}
          {appt.email && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' as const, gap: 8, flexWrap: 'wrap' as const, marginTop: 'auto', paddingTop: 8 }}>
              {feedback && <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 8, background: feedback.type === 'success' ? (dark ? 'rgba(5,150,105,0.15)' : 'rgba(5,150,105,0.09)') : (dark ? 'rgba(220,38,38,0.15)' : 'rgba(220,38,38,0.09)'), color: feedback.type === 'success' ? '#059669' : '#dc2626', fontFamily: "'Poppins', sans-serif" }}>{feedback.text}</span>}
              <button onClick={() => handleConfirm(appt)} disabled={isConfirming} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#800000', color: '#fff', fontSize: 11, fontWeight: 500, cursor: isConfirming ? 'not-allowed' : 'pointer', opacity: isConfirming ? 0.7 : 1, transition: 'all .15s', fontFamily: "'Poppins', sans-serif" }}>
                {isConfirming ? <><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: 'spin .8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Confirming…</> : <><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Confirm &amp; Send Credentials</>}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const AppointmentRow = ({ appt, idx, total }: { appt: Appointment; idx: number; total: number }) => {
    const apptDate     = new Date(appt.startTime)
    const isConfirming = confirmingId === appt.ghlAppointmentId
    const feedback     = confirmFeedback[appt.ghlAppointmentId]
    return (
      <div className="appt-row" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr auto' : '160px 1fr 120px 130px 200px', gap: isMobile ? 8 : 16, alignItems: 'center', padding: isMobile ? '12px 14px' : '14px 24px', borderBottom: idx < total - 1 ? `1px solid ${borderColor}` : 'none', transition: 'background .15s' }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{apptDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          <p style={{ fontSize: 11, color: textMuted, margin: '2px 0 0', fontFamily: "'Poppins', sans-serif" }}>{formatTime(appt.startTime)}</p>
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>{appt.title || appt.name || 'Appointment'}</p>
          <p style={{ fontSize: 11, color: textMuted, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>{appt.email || appt.phone || ''}</p>
        </div>
        <p style={{ fontSize: 11, color: textMuted, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>{appt.calendarName || '—'}</p>
        <div>{appt.appointmentStatus && <span style={getStatusStyle(appt.appointmentStatus, dark)}>{appt.appointmentStatus}</span>}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' as const }}>
          {appt.email && <button onClick={() => handleConfirm(appt)} disabled={isConfirming} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: 'none', background: '#800000', color: '#fff', fontSize: 11, fontWeight: 500, cursor: isConfirming ? 'not-allowed' : 'pointer', opacity: isConfirming ? 0.7 : 1, transition: 'all .15s', fontFamily: "'Poppins', sans-serif", whiteSpace: 'nowrap' as const }}>{isConfirming ? 'Confirming…' : 'Confirm & Send'}</button>}
          {feedback && <span style={{ fontSize: 10, color: feedback.type === 'success' ? '#059669' : '#dc2626', fontFamily: "'Poppins', sans-serif", whiteSpace: 'nowrap' as const }}>{feedback.type === 'success' ? '✓' : '✗'}</span>}
        </div>
      </div>
    )
  }

  const sectionLabel = (label: string) => (
    <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: '0 0 12px', fontFamily: "'Poppins', sans-serif" }}>{label}</p>
  )

  const listTableHeader = isMobile ? null : (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 120px 130px 200px', gap: 16, padding: '11px 24px', background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
      {['Date & Time','Appointment','Calendar','Status','Action'].map((col, i) => (
        <span key={col} style={{ fontSize: 10, fontWeight: 500, color: textMuted, textAlign: i === 4 ? 'right' as const : 'left' as const, fontFamily: "'Poppins', sans-serif" }}>{col}</span>
      ))}
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        *, *::before, *::after { font-family: 'Poppins', sans-serif !important; letter-spacing: 0 !important; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        input, textarea, select, option, button { font-family: 'Poppins', sans-serif !important; }
        .appt-card:hover  { box-shadow: 0 6px 24px rgba(0,0,0,.1) !important; transform: translateY(-1px); }
        .appt-row:hover   { background: ${dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'} !important; }
        .stat-card:hover  { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.10) !important; }
        @keyframes spin   { to { transform: rotate(360deg) } }
        @keyframes pulse  { 0%,100% { opacity:1 } 50% { opacity:.5 } }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
        @media (max-width: 639px) {
          .appt-card { padding: 14px 12px !important; gap: 10px !important; }
          .stat-card { font-size: 13px; }
          .appt-row { grid-template-columns: 1fr !important; gap: 6px !important; padding: 12px !important; }
          .appt-row > *:nth-child(3),
          .appt-row > *:nth-child(4) { display: none; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: pageBg, padding: isMobile ? '16px 12px' : '32px', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {syncMessage && <div style={{ position: 'fixed', top: 28, right: 28, background: syncMessage.type === 'success' ? '#059669' : '#dc2626', color: '#fff', padding: '14px 24px', borderRadius: 20, fontSize: 12, fontWeight: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.22)', zIndex: 50 }}>{syncMessage.text}</div>}

          <div style={{ paddingBottom: 20, borderBottom: `1px solid ${borderColor}` }}>
            <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 12 }}>
              {/* Left: title + subtitle */}
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: textPrimary, margin: 0, letterSpacing: '-0.3px' }}>Appointments</h1>
                <p style={{ fontSize: 12, color: textMuted, margin: '3px 0 0', fontWeight: 400 }}>View and manage all scheduled appointments</p>
              </div>

              {/* Right: resync button only */}
              <button onClick={handleResync} disabled={isSyncing} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: 'none', background: '#800000', color: '#ffffff', fontSize: 12, fontWeight: 500, cursor: isSyncing ? 'not-allowed' : 'pointer', opacity: isSyncing ? 0.6 : 1, transition: 'all .15s' }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: isSyncing ? 'spin .8s linear infinite' : 'none' }}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                {isSyncing ? 'Syncing...' : 'Resync'}
              </button>
            </div>
          </div>

          {!showFullCalendar && <>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: isMobile ? 10 : 14 }}>
            {statCards.map((card, i) => {

              // ── Unique palette per card ──
              const palettes = [
                // 0 — Total: Maroon / Rose
                {
                  flapL: ['#ecdada','#f5e8e8'], flapD: ['#2e1e1e','#3a2424'],
                  bodyL: 'linear-gradient(145deg,#ffffff 0%,#fef6f6 40%,#faeaea 80%,#f6e4e4 100%)',
                  bodyD: 'linear-gradient(145deg,#2a1e1e 0%,#221616 40%,#1a1010 100%)',
                  w1L:'rgba(128,0,0,0.13)',   w2L:'rgba(128,0,0,0.07)',
                  w1D:'rgba(180,60,60,0.22)', w2D:'rgba(140,40,40,0.14)',
                  ovL:'linear-gradient(135deg,rgba(128,0,0,0.06) 0%,transparent 55%)',
                  ovD:'linear-gradient(135deg,rgba(180,50,50,0.10) 0%,transparent 55%)',
                  shL:'rgba(128,0,0,0.20)',  shD:'rgba(200,100,100,0.35)',
                  barL:'linear-gradient(90deg,#800000 0%,rgba(128,0,0,0) 100%)',
                  barD:'linear-gradient(90deg,#b05050 0%,rgba(176,80,80,0) 100%)',
                  valD:'#f5eeee',
                },
                // 1 — Today: Emerald
                {
                  flapL: ['#d4ede3','#e6f5ee'], flapD: ['#163326','#1e4030'],
                  bodyL: 'linear-gradient(145deg,#ffffff 0%,#f2fdf7 40%,#e4f8ee 80%,#d8f2e6 100%)',
                  bodyD: 'linear-gradient(145deg,#162a20 0%,#112018 40%,#0d1912 100%)',
                  w1L:'rgba(5,150,105,0.13)',  w2L:'rgba(5,150,105,0.07)',
                  w1D:'rgba(52,200,140,0.22)', w2D:'rgba(30,160,100,0.14)',
                  ovL:'linear-gradient(135deg,rgba(5,150,105,0.07) 0%,transparent 55%)',
                  ovD:'linear-gradient(135deg,rgba(30,180,110,0.10) 0%,transparent 55%)',
                  shL:'rgba(5,150,105,0.22)', shD:'rgba(52,200,140,0.38)',
                  barL:'linear-gradient(90deg,#059669 0%,rgba(5,150,105,0) 100%)',
                  barD:'linear-gradient(90deg,#34d399 0%,rgba(52,211,153,0) 100%)',
                  valD:'#eefaf4',
                },
                // 2 — This week: Blue
                {
                  flapL: ['#d8e8fb','#e8f0fd'], flapD: ['#16243e','#1e2e50'],
                  bodyL: 'linear-gradient(145deg,#ffffff 0%,#f3f7fe 40%,#e6effd 80%,#dae8fc 100%)',
                  bodyD: 'linear-gradient(145deg,#16202e 0%,#111828 40%,#0d1420 100%)',
                  w1L:'rgba(59,130,246,0.13)',  w2L:'rgba(59,130,246,0.07)',
                  w1D:'rgba(96,165,250,0.22)',  w2D:'rgba(60,130,240,0.14)',
                  ovL:'linear-gradient(135deg,rgba(59,130,246,0.07) 0%,transparent 55%)',
                  ovD:'linear-gradient(135deg,rgba(80,140,250,0.10) 0%,transparent 55%)',
                  shL:'rgba(59,130,246,0.22)', shD:'rgba(96,165,250,0.38)',
                  barL:'linear-gradient(90deg,#3b82f6 0%,rgba(59,130,246,0) 100%)',
                  barD:'linear-gradient(90deg,#60a5fa 0%,rgba(96,165,250,0) 100%)',
                  valD:'#eef3ff',
                },
                // 3 — This month: Amber
                {
                  flapL: ['#fbeacc','#fdf3df'], flapD: ['#2e2410','#3a2e14'],
                  bodyL: 'linear-gradient(145deg,#ffffff 0%,#fefbf0 40%,#fdf4d8 80%,#fbefc6 100%)',
                  bodyD: 'linear-gradient(145deg,#28200e 0%,#201a0a 40%,#181406 100%)',
                  w1L:'rgba(202,138,4,0.13)',   w2L:'rgba(202,138,4,0.07)',
                  w1D:'rgba(251,191,36,0.22)',  w2D:'rgba(220,160,20,0.14)',
                  ovL:'linear-gradient(135deg,rgba(202,138,4,0.07) 0%,transparent 55%)',
                  ovD:'linear-gradient(135deg,rgba(240,170,30,0.10) 0%,transparent 55%)',
                  shL:'rgba(202,138,4,0.24)',  shD:'rgba(251,191,36,0.38)',
                  barL:'linear-gradient(90deg,#ca8a04 0%,rgba(202,138,4,0) 100%)',
                  barD:'linear-gradient(90deg,#fbbf24 0%,rgba(251,191,36,0) 100%)',
                  valD:'#fdf8e8',
                },
                // 4 — This year: Forest green (always dark-ish card)
                {
                  flapL: ['#1e4a30','#2a5c3c'], flapD: ['#1a3828','#243f30'],
                  bodyL: 'linear-gradient(145deg,#243d2c 0%,#1c3024 55%,#152718 100%)',
                  bodyD: 'linear-gradient(145deg,#1a3326 0%,#122018 55%,#0e1a12 100%)',
                  w1L:'rgba(100,220,140,0.22)', w2L:'rgba(70,170,100,0.16)',
                  w1D:'rgba(60,170,95,0.22)',   w2D:'rgba(40,130,70,0.15)',
                  ovL:'linear-gradient(135deg,rgba(60,180,100,0.10) 0%,transparent 55%)',
                  ovD:'linear-gradient(135deg,rgba(50,160,90,0.08) 0%,transparent 55%)',
                  shL:'rgba(120,220,150,0.28)', shD:'rgba(100,200,130,0.32)',
                  barL:'linear-gradient(90deg,#4db876 0%,rgba(77,184,118,0) 100%)',
                  barD:'linear-gradient(90deg,#3daa6a 0%,rgba(61,170,106,0) 100%)',
                  valD:'#e8f5ee',
                },
              ]

              const p         = palettes[i]
              const flapStops = dark ? p.flapD  : p.flapL
              const bodyBg    = dark ? p.bodyD  : p.bodyL
              const wave1     = dark ? p.w1D    : p.w1L
              const wave2     = dark ? p.w2D    : p.w2L
              const overlay   = dark ? p.ovD    : p.ovL
              const shimmer   = dark ? p.shD    : p.shL
              const bar       = dark ? p.barD   : p.barL
              const valueColor = i === 4
                ? (dark ? p.valD : '#e8f5ee')
                : (dark ? (p.valD || '#f5f0f0') : textPrimary)
              const labelColor = i === 4
                ? (dark ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.72)')
                : (dark ? 'rgba(180,172,172,0.72)' : textMuted)
              const subColor = i === 4
                ? (dark ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.55)')
                : (dark ? 'rgba(160,150,150,0.60)' : textMuted)
              const shadowStyle = dark ? '0 6px 24px rgba(0,0,0,0.42)' : '0 6px 28px rgba(0,0,0,0.08)'
              const borderStyle = i === 4 ? 'none' : (dark ? '1px solid rgba(255,255,255,0.07)' : `1px solid ${borderColor}`)

              return (
                <div key={i} className="stat-card" style={{ position: 'relative' as const, transition: 'all .2s', cursor: 'default' }}>

                  {/* ── Folder flap (gradient SVG) ── */}
                  <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none', zIndex: 0 }}
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id={`fg-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={flapStops[0]}/>
                        <stop offset="100%" stopColor={flapStops[1]}/>
                      </linearGradient>
                    </defs>
                    <path d="M0,18 Q0,0 18,0 L80,0 Q95,0 100,14 L200,14 L200,140 L0,140 Z" fill={`url(#fg-${i})`} />
                    <line x1="0" y1="14" x2="200" y2="14" stroke={shimmer} strokeWidth="1" />
                  </svg>

                  {/* ── Folder body ── */}
                  <div style={{
                    marginTop: 14, padding: '18px 20px 20px',
                    borderRadius: '0 6px 14px 14px',
                    border: borderStyle, background: bodyBg, boxShadow: shadowStyle,
                    display: 'flex', flexDirection: 'column' as const,
                    position: 'relative' as const, overflow: 'hidden', minHeight: 126,
                  }}>
                    {/* Swoosh waves */}
                    <svg style={{ position: 'absolute', right: -2, bottom: -2, width: '70%', height: '75%', pointerEvents: 'none' }}
                      viewBox="0 0 140 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M140,100 L140,0 Q110,10 90,38 Q70,65 40,72 Q20,77 0,100 Z" fill={wave1} />
                      <path d="M140,100 L140,30 Q105,42 82,64 Q60,84 20,100 Z" fill={wave2} />
                    </svg>
                    {/* Diagonal colour overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: overlay, pointerEvents: 'none', borderRadius: 'inherit' }} />

                    {/* Label + icon */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, position: 'relative', zIndex: 1 }}>
                      <p style={{ fontSize: 10, fontWeight: 600, color: labelColor, margin: 0, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{card.label}</p>
                      {i === 4 ? <Sparkline /> : card.iconEl}
                    </div>
                    {/* Number */}
                    <p style={{ fontSize: 42, fontWeight: 800, color: valueColor, margin: '0 0 4px', lineHeight: 1, position: 'relative', zIndex: 1, letterSpacing: '-1px' }}>{card.value}</p>
                    {/* Sub */}
                    <p style={{ fontSize: 11, fontWeight: 400, color: subColor, margin: 0, position: 'relative', zIndex: 1 }}>{card.sub}</p>
                    {/* Gradient accent bar */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '45%', height: 3, background: bar, borderRadius: '0 2px 0 14px', opacity: 0.85 }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 280px', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Toolbar */}
              <div style={{ display: 'flex', alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: 8, background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: isMobile ? '12px' : '10px 14px', flexWrap: 'wrap' as const }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: '6px 12px', minWidth: 180 }}>
                  <svg width="13" height="13" fill="none" stroke={textMuted} strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search appointments..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 11, color: textPrimary, width: '100%' }}/>
                  {searchQuery && <button onClick={() => setSearchQuery('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: textMuted, display: 'flex', padding: 0 }}><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button>}
                </div>
                {!isMobile && <div style={{ width: 1, height: 22, background: borderColor, flexShrink: 0 }} />}
                <div style={{ display: 'flex', gap: 4 }}>
                  {([{ key: 'all', label: 'All', count: appointments.length },{ key: 'upcoming', label: 'Upcoming', count: upcomingFilterCount },{ key: 'past', label: 'Past', count: pastFilterCount }] as const).map(tab => (
                    <button key={tab.key} onClick={() => setStatusFilter(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 8, border: 'none', background: statusFilter === tab.key ? '#800000' : 'transparent', color: statusFilter === tab.key ? '#fff' : textMuted, fontSize: 11, fontWeight: 500, cursor: 'pointer', transition: 'all .15s' }}>
                      {tab.label}
                      <span style={{ fontSize: 10, fontWeight: 600, background: statusFilter === tab.key ? 'rgba(255,255,255,0.25)' : (dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'), color: statusFilter === tab.key ? '#fff' : textMuted, borderRadius: 20, padding: '1px 7px', lineHeight: '16px' }}>{tab.count}</span>
                    </button>
                  ))}
                </div>
                {!isMobile && <div style={{ width: 1, height: 22, background: borderColor, flexShrink: 0 }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
                  <span style={{ fontSize: 11, color: textMuted, whiteSpace: 'nowrap' as const }}>Sort by</span>
                  <div style={{ position: 'relative' as const }}>
                    <select value={sortOrder} onChange={e => setSortOrder(e.target.value as any)} style={{ appearance: 'none' as const, WebkitAppearance: 'none' as const, background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: '5px 28px 5px 10px', fontSize: 11, color: textPrimary, cursor: 'pointer', outline: 'none' }}>
                      <option value="name-az">Name A → Z</option><option value="name-za">Name Z → A</option><option value="newest">Newest First</option><option value="oldest">Oldest First</option>
                    </select>
                    <svg width="11" height="11" fill="none" stroke={textMuted} strokeWidth="2" viewBox="0 0 24 24" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 11, color: textMuted, whiteSpace: 'nowrap' as const }}>Showing <strong style={{ color: textPrimary }}>{sorted.length}</strong> of <strong style={{ color: textPrimary }}>{appointments.length}</strong></span>
                {!isMobile && <div style={{ width: 1, height: 22, background: borderColor, flexShrink: 0 }} />}
                <div style={{ display: 'flex', gap: 3 }}>
                  <button onClick={() => setViewMode('cards')} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: viewMode === 'cards' ? '#800000' : 'transparent', color: viewMode === 'cards' ? '#fff' : textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg></button>
                  <button onClick={() => setViewMode('list')} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: viewMode === 'list' ? '#800000' : 'transparent', color: viewMode === 'list' ? '#fff' : textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg></button>
                </div>
              </div>

              {isLoading && <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[1,2,3].map(i => <div key={i} style={{ height: 90, borderRadius: 18, background: subtleBg, border: `1px solid ${borderColor}`, animation: 'pulse 1.5s ease-in-out infinite' }} />)}</div>}

              {!isLoading && (() => {
                const allSorted    = sorted
                const totalPages   = Math.ceil(allSorted.length / PAGE_SIZE)
                const pageItems    = allSorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                const pageUpcoming = pageItems.filter(a => new Date(a.startTime) >= new Date(today.toDateString()))
                const pagePast     = pageItems.filter(a => new Date(a.startTime) <  new Date(today.toDateString()))
                const getPageNumbers = () => {
                  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
                  if (currentPage <= 4) return [1,2,3,4,5,'...',totalPages]
                  if (currentPage >= totalPages - 3) return [1,'...',totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages]
                  return [1,'...',currentPage-1,currentPage,currentPage+1,'...',totalPages]
                }
                return (
                  <>
                    {allSorted.length === 0 && (
                      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 20, padding: '60px 20px', textAlign: 'center' }}>
                        <svg style={{ margin: '0 auto 16px', display: 'block', color: dark ? '#374151' : '#d1d5db' }} width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <p style={{ fontSize: 14, fontWeight: 500, color: textMuted, margin: '0 0 4px' }}>No appointments found</p>
                        <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0 }}>Use Resync to fetch the latest appointments</p>
                      </div>
                    )}
                    {pageUpcoming.length > 0 && <div>{sectionLabel('Upcoming')}{viewMode === 'cards' ? <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{pageUpcoming.map(a => <AppointmentCard key={a._id} appt={a} />)}</div> : <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 20, overflow: 'hidden' }}>{listTableHeader}{pageUpcoming.map((a, idx) => <AppointmentRow key={a._id} appt={a} idx={idx} total={pageUpcoming.length} />)}</div>}</div>}
                    {pagePast.length > 0 && <div style={{ opacity: 0.7 }}>{sectionLabel('Past')}{viewMode === 'cards' ? <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{pagePast.map(a => <AppointmentCard key={a._id} appt={a} />)}</div> : <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 20, overflow: 'hidden' }}>{listTableHeader}{pagePast.map((a, idx) => <AppointmentRow key={a._id} appt={a} idx={idx} total={pagePast.length} />)}</div>}</div>}
                    {allSorted.length > 0 && totalPages > 0 && (
                      <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 8, marginTop: 8, padding: '0 2px' }}>
                        <span style={{ fontSize: 11, color: textMuted }}>Showing <strong style={{ color: textPrimary }}>{(currentPage - 1) * PAGE_SIZE + 1}</strong>{' – '}<strong style={{ color: textPrimary }}>{Math.min(currentPage * PAGE_SIZE, allSorted.length)}</strong>{' out of '}<strong style={{ color: textPrimary }}>{allSorted.length}</strong></span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${borderColor}`, background: cardBg, color: currentPage === 1 ? (dark ? '#3f3f3f' : '#d1d5db') : textMuted, fontSize: 11, fontWeight: 500, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', transition: 'all .15s' }}>Prev</button>
                          {getPageNumbers().map((pg, i) => pg === '...' ? <span key={`el-${i}`} style={{ width: 32, textAlign: 'center', fontSize: 11, color: textMuted }}>…</span> : <button key={pg} onClick={() => setCurrentPage(pg as number)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${currentPage === pg ? '#800000' : borderColor}`, background: currentPage === pg ? '#800000' : cardBg, color: currentPage === pg ? '#fff' : textMuted, fontSize: 11, fontWeight: currentPage === pg ? 600 : 400, cursor: 'pointer', transition: 'all .15s' }}>{pg}</button>)}
                          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${borderColor}`, background: cardBg, color: currentPage === totalPages ? (dark ? '#3f3f3f' : '#d1d5db') : textMuted, fontSize: 11, fontWeight: 500, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', transition: 'all .15s' }}>Next</button>
                        </div>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>

            <div>
              <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: '0 0 12px' }}>Calendar</p>
              <MiniCalendar appointmentDates={appointmentDates} today={today} cardBg={cardBg} subtleBg={subtleBg} borderColor={borderColor} textPrimary={textPrimary} textMuted={textMuted} dark={dark} onClick={() => setShowFullCalendar(true)} />
            </div>
          </div>
          </>}

          {showFullCalendar && (
            <FullCalendarView appointmentDates={appointmentDates} appointments={appointments} today={today} onClose={() => setShowFullCalendar(false)} cardBg={cardBg} subtleBg={subtleBg} borderColor={borderColor} textPrimary={textPrimary} textMuted={textMuted} dark={dark} />
          )}

        </div>
      </div>



      {credentialsModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }} onClick={e => { if (e.target === e.currentTarget) setCredentialsModal(null) }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, width: '100%', maxWidth: 440, boxShadow: '0 32px 80px rgba(0,0,0,0.32)', overflow: 'hidden' }}>
            <div style={{ background: '#800000', padding: '28px 32px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>Client Account Created</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: 0 }}>Generated login credentials for this appointment</p>
            </div>
            <div style={{ padding: '28px 32px' }}>
              <p style={{ fontSize: 12, color: textMuted, margin: '0 0 18px' }}>Hi <strong style={{ color: textPrimary }}>{credentialsModal.name}</strong>, here are the login credentials:</p>
              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: '18px 20px', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: '0 0 6px' }}>EMAIL</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{credentialsModal.email}</p>
                    <button onClick={() => navigator.clipboard.writeText(credentialsModal.email)} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${borderColor}`, background: 'transparent', color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: '0 0 6px' }}>TEMPORARY PASSWORD</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <p style={{ fontSize: 20, fontWeight: 700, color: '#800000', margin: 0, fontFamily: 'monospace, Poppins, sans-serif', letterSpacing: 4 }}>{credentialsModal.password}</p>
                    <button onClick={() => navigator.clipboard.writeText(credentialsModal.password)} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${borderColor}`, background: 'transparent', color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 11, color: textMuted, margin: '0 0 18px', textAlign: 'center' }}>Save these credentials. The password cannot be retrieved after closing this window.</p>
              <button onClick={() => setCredentialsModal(null)} style={{ width: '100%', padding: '12px 0', borderRadius: 12, border: 'none', background: '#800000', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .15s' }}>Done</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}