'use client'

import { useState, useEffect } from 'react'
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
          <div style={{ background: 'rgba(128,0,0,0.09)', border: '1px solid rgba(128,0,0,0.18)', borderRadius: 10, padding: '4px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#800000', lineHeight: 1, fontFamily: "'Poppins', sans-serif" }}>{appointmentDates.size}</span>
            <span style={{ fontSize: 9, color: '#800000', opacity: 0.7, fontFamily: "'Poppins', sans-serif", marginTop: 1 }}>appts</span>
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

// ── Big Calendar Modal — SHARP REDESIGN ───────────────────────────────────────
function BigCalendarModal({ appointmentDates, appointments, today, onClose, cardBg, subtleBg, borderColor, textPrimary, textMuted, dark }: {
  appointmentDates: Set<string>; appointments: Appointment[]; today: Date; onClose: () => void
  cardBg: string; subtleBg: string; borderColor: string; textPrimary: string; textMuted: string; dark: boolean
}) {
  const [viewYear, setViewYear]         = useState(today.getFullYear())
  const [viewMonth, setViewMonth]       = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const cells     = buildCalendarDays(viewYear, viewMonth)
  const todayDs   = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())
  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }

  const selectedAppts  = selectedDate ? appointments.filter(a => a.startTime?.startsWith(selectedDate)) : []
  const monthApptCount = appointments.filter(a => a.startTime?.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`)).length

  const modalBg   = dark ? '#141414' : '#f5f4f0'
  const surfaceBg = dark ? '#1c1c1c' : '#ffffff'
  const panelBg   = dark ? '#111111' : '#faf9f6'
  const RED       = '#800000'
  const border    = dark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.10)'
  const txt1      = dark ? '#f0ede8' : '#1a1a1a'
  const txt2      = dark ? '#6b6b6b' : '#888880'
  const hoverBg   = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'

  return (
    <>
      <style>{`
        @keyframes calOpen {
          from { opacity:0; transform: translateY(10px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes panelIn {
          from { opacity:0; transform: translateX(6px); }
          to   { opacity:1; transform: translateX(0); }
        }
        .cal-md-btn:hover  { background: ${hoverBg} !important; }
        .cal-nav:hover     { background: ${hoverBg} !important; }
        .cal-close:hover   { background: ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} !important; }
        .cal-appt-row:hover { background: ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'} !important; }
      `}</style>

      {/* Overlay */}
      <div
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
        style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      >
        {/* Shell — sharp corners */}
        <div style={{
          background: modalBg,
          borderRadius: 8,
          width: '100%', maxWidth: 960, maxHeight: '90vh',
          border: `1px solid ${border}`,
          boxShadow: dark
            ? '0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px rgba(0,0,0,0.8)'
            : '0 0 0 1px rgba(0,0,0,0.08), 0 40px 100px rgba(0,0,0,0.22)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column' as const,
          fontFamily: "'Poppins', sans-serif",
          animation: 'calOpen 0.22s cubic-bezier(0.16,1,0.3,1) both',
        }}>

          {/* ── Header ── */}
          <div style={{
            display: 'flex', alignItems: 'stretch',
            borderBottom: `1px solid ${border}`,
            flexShrink: 0,
            background: surfaceBg,
          }}>
            {/* Red left accent stripe */}
            <div style={{ width: 4, background: RED, flexShrink: 0 }} />
            <div style={{ padding: '16px 20px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: txt1, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                  Appointments Calendar
                </p>
                <p style={{ fontSize: 11, color: txt2, margin: '3px 0 0' }}>
                  {MONTHS[viewMonth]} {viewYear}
                  <span style={{ margin: '0 8px', opacity: 0.35 }}>·</span>
                  <span style={{ color: RED, fontWeight: 600 }}>{monthApptCount}</span> appointment{monthApptCount !== 1 ? 's' : ''}
                </p>
              </div>
              <button className="cal-close" onClick={onClose} style={{
                width: 32, height: 32, borderRadius: 4,
                border: `1px solid ${border}`, background: 'transparent',
                color: txt2, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.12s',
              }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

            {/* ── LEFT: Calendar ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}>

              {/* Month nav */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 24px',
                borderBottom: `1px solid ${border}`,
                background: surfaceBg,
                flexShrink: 0,
              }}>
                <button className="cal-nav" onClick={prevMonth} style={{
                  width: 30, height: 30, borderRadius: 4, border: `1px solid ${border}`,
                  background: 'transparent', cursor: 'pointer', color: txt2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.12s',
                }}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
                </button>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: txt1, letterSpacing: '-0.3px' }}>{MONTHS[viewMonth].toUpperCase()}</span>
                  <span style={{ fontSize: 13, color: txt2, fontWeight: 400 }}>{viewYear}</span>
                </div>

                <button className="cal-nav" onClick={nextMonth} style={{
                  width: 30, height: 30, borderRadius: 4, border: `1px solid ${border}`,
                  background: 'transparent', cursor: 'pointer', color: txt2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.12s',
                }}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>

              {/* Grid */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {/* Weekday header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(7,1fr)',
                  borderBottom: `1px solid ${border}`,
                  background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.025)',
                }}>
                  {['SUN','MON','TUE','WED','THU','FRI','SAT'].map((d, i) => (
                    <div key={d} style={{
                      textAlign: 'center', fontSize: 9, fontWeight: 700,
                      color: txt2, padding: '10px 0', letterSpacing: '0.08em',
                      borderRight: i < 6 ? `1px solid ${border}` : 'none',
                    }}>{d}</div>
                  ))}
                </div>

                {/* Day cells */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
                  {cells.map((day, i) => {
                    const col        = i % 7
                    const isLastInRow = col === 6
                    const rowIndex   = Math.floor(i / 7)
                    const totalRows  = Math.ceil(cells.length / 7)
                    const isLastRow  = rowIndex === totalRows - 1

                    if (!day) return (
                      <div key={`e-${i}`} style={{
                        aspectRatio: '1',
                        borderRight: !isLastInRow ? `1px solid ${border}` : 'none',
                        borderBottom: !isLastRow ? `1px solid ${border}` : 'none',
                        background: dark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.015)',
                      }} />
                    )

                    const ds         = toDateStr(viewYear, viewMonth, day)
                    const isToday    = ds === todayDs
                    const hasAppt    = appointmentDates.has(ds)
                    const isSelected = selectedDate === ds
                    const apptCount  = appointments.filter(a => a.startTime?.startsWith(ds)).length

                    return (
                      <button
                        key={ds}
                        className="cal-md-btn"
                        onClick={() => setSelectedDate(isSelected ? null : ds)}
                        style={{
                          aspectRatio: '1', border: 'none',
                          borderRight: !isLastInRow ? `1px solid ${border}` : 'none',
                          borderBottom: !isLastRow ? `1px solid ${border}` : 'none',
                          cursor: 'pointer',
                          display: 'flex', flexDirection: 'column' as const,
                          alignItems: 'flex-start', justifyContent: 'flex-start',
                          padding: '8px 10px',
                          position: 'relative',
                          background: isSelected
                            ? RED
                            : isToday
                              ? (dark ? 'rgba(128,0,0,0.12)' : 'rgba(128,0,0,0.06)')
                              : 'transparent',
                          transition: 'background 0.1s',
                          fontFamily: "'Poppins', sans-serif",
                          overflow: 'hidden',
                        }}
                      >
                        {/* Today — top bar */}
                        {isToday && !isSelected && (
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: RED }} />
                        )}

                        <span style={{
                          fontSize: 12, fontWeight: isToday || isSelected ? 700 : 400, lineHeight: 1,
                          color: isSelected ? '#fff' : isToday ? RED : txt1,
                        }}>{day}</span>

                        {/* Appointment dots */}
                        {hasAppt && (
                          <div style={{ position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 2 }}>
                            {Array.from({ length: Math.min(apptCount, 3) }).map((_, idx) => (
                              <span key={idx} style={{
                                width: 4, height: 4, borderRadius: 1,
                                background: isSelected ? 'rgba(255,255,255,0.7)' : RED,
                              }} />
                            ))}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Legend */}
              <div style={{
                padding: '10px 20px', borderTop: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', gap: 20,
                background: surfaceBg, flexShrink: 0,
              }}>
                {[
                  { ind: <span style={{ width: 4, height: 4, borderRadius: 1, background: RED, display: 'block' }} />, label: 'Appointment' },
                  { ind: <span style={{ width: 12, height: 12, outline: `2px solid ${RED}`, outlineOffset: '-2px', display: 'block' }} />, label: 'Today' },
                  { ind: <span style={{ width: 12, height: 12, background: RED, display: 'block' }} />, label: 'Selected' },
                ].map(({ ind, label }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    {ind}
                    <span style={{ fontSize: 10, color: txt2, letterSpacing: '0.03em' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Detail panel ── */}
            <div style={{
              width: 300, flexShrink: 0,
              borderLeft: `1px solid ${border}`,
              display: 'flex', flexDirection: 'column' as const,
              overflow: 'hidden',
              background: panelBg,
            }}>

              {/* Panel header */}
              <div style={{ borderBottom: `1px solid ${border}`, flexShrink: 0, overflow: 'hidden' }}>
                {selectedDate ? (
                  <div style={{ animation: 'panelIn 0.18s ease both' }}>
                    <div style={{
                      background: RED, padding: '18px 20px 16px',
                      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                    }}>
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.6)', margin: '0 0 4px', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>
                          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
                        </p>
                        <p style={{ fontSize: 38, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1, letterSpacing: '-1px' }}>
                          {new Date(selectedDate + 'T00:00:00').getDate()}
                        </p>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '4px 0 0', fontWeight: 500 }}>
                          {MONTHS_SHORT[viewMonth]} {viewYear}
                        </p>
                      </div>
                      <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 4, padding: '6px 10px', textAlign: 'center',
                      }}>
                        <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1 }}>{selectedAppts.length}</p>
                        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', margin: '2px 0 0', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>appts</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '18px 20px' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: txt1, margin: 0 }}>No date selected</p>
                    <p style={{ fontSize: 11, color: txt2, margin: '4px 0 0' }}>Click any day on the calendar</p>
                  </div>
                )}
              </div>

              {/* Scrollable appointment list */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {!selectedDate && (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 12, opacity: 0.2, padding: '40px 20px' }}>
                    <svg width="40" height="40" fill="none" stroke={txt2} strokeWidth="1.3" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="1"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <p style={{ fontSize: 11, color: txt2, margin: 0, textAlign: 'center', lineHeight: 1.6 }}>Select a date to<br/>view appointments</p>
                  </div>
                )}

                {selectedDate && selectedAppts.length === 0 && (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 12, opacity: 0.25, padding: '40px 20px' }}>
                    <svg width="36" height="36" fill="none" stroke={txt2} strokeWidth="1.3" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                    <p style={{ fontSize: 11, color: txt2, margin: 0, textAlign: 'center' }}>No appointments<br/>this day</p>
                  </div>
                )}

                {selectedDate && selectedAppts.map((appt, index) => (
                  <div
                    key={appt._id}
                    className="cal-appt-row"
                    style={{
                      borderBottom: `1px solid ${border}`,
                      padding: '14px 18px',
                      transition: 'background 0.1s',
                      animation: `panelIn 0.18s ${index * 0.04}s ease both`,
                      display: 'flex', flexDirection: 'column' as const, gap: 8,
                    }}
                  >
                    {/* Time + status row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        background: dark ? 'rgba(128,0,0,0.15)' : 'rgba(128,0,0,0.07)',
                        border: `1px solid rgba(128,0,0,0.2)`,
                        borderRadius: 3, padding: '3px 8px',
                      }}>
                        <svg width="9" height="9" fill="none" stroke={RED} strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
                        <span style={{ fontSize: 10, color: RED, fontWeight: 700, letterSpacing: '0.02em' }}>
                          {formatTime(appt.startTime)}{appt.endTime ? ` – ${formatTime(appt.endTime)}` : ''}
                        </span>
                      </div>
                      {appt.appointmentStatus && <span style={getStatusStyle(appt.appointmentStatus, dark)}>{appt.appointmentStatus}</span>}
                    </div>

                    {/* Title */}
                    <p style={{ fontSize: 12, fontWeight: 700, color: txt1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, letterSpacing: '0.01em' }}>
                      {appt.title || appt.name || 'Appointment'}
                    </p>

                    {/* Details */}
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 5 }}>
                      {[
                        { path: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 110 8 4 4 0 010-8', val: appt.name },
                        { path: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', val: appt.email },
                        { path: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', val: appt.phone },
                      ].filter(r => r.val).map((row, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <svg width="10" height="10" fill="none" stroke={txt2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.6 }}><path d={row.path}/></svg>
                          <p style={{ fontSize: 11, color: txt2, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{row.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AppointmentsPage() {
  const { isdarkmode: dark } = useDarkMode()

  const pageBg      = dark ? '#0f0f0f'                : '#f8f9fa'
  const cardBg      = dark ? '#1a1a1a'                : '#ffffff'
  const subtleBg    = dark ? '#202020'                : '#f9fafb'
  const borderColor = dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'
  const textPrimary = dark ? '#f0f0f0'                : '#1f2937'
  const textMuted   = dark ? '#6b7280'                : '#6b7280'

  const [appointments, setAppointments]         = useState<Appointment[]>([])
  const [isLoading, setIsLoading]               = useState(true)
  const [isModalOpen, setIsModalOpen]           = useState(false)
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
      if (res.ok) { const data = await res.json(); setAppointments(Array.isArray(data) ? data : data.appointments || []) }
    } catch (e) { console.error(e) } finally { setIsLoading(false) }
  }

  const handleResync = async () => {
    try {
      setIsSyncing(true); setSyncMessage(null)
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/sync`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
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
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${appt.ghlAppointmentId}/confirm`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
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
      <div className="appt-card" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 16, transition: 'all .2s' }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: isUpcoming ? '#800000' : subtleBg, border: isUpcoming ? 'none' : `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: isUpcoming ? 'rgba(255,220,220,0.9)' : textMuted, fontFamily: "'Poppins', sans-serif" }}>{apptDate.toLocaleDateString('en-US', { month: 'short' })}</span>
          <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1, color: isUpcoming ? '#fff' : textMuted, fontFamily: "'Poppins', sans-serif" }}>{apptDate.getDate()}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>{appt.title || appt.name || 'Appointment'}</p>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const, marginTop: 4 }}>
              <button onClick={() => handleConfirm(appt)} disabled={isConfirming} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#800000', color: '#fff', fontSize: 11, fontWeight: 500, cursor: isConfirming ? 'not-allowed' : 'pointer', opacity: isConfirming ? 0.7 : 1, transition: 'all .15s', fontFamily: "'Poppins', sans-serif" }}>
                {isConfirming ? <><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: 'spin .8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Confirming…</> : <><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Confirm &amp; Send Credentials</>}
              </button>
              {feedback && <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 8, background: feedback.type === 'success' ? (dark ? 'rgba(5,150,105,0.15)' : 'rgba(5,150,105,0.09)') : (dark ? 'rgba(220,38,38,0.15)' : 'rgba(220,38,38,0.09)'), color: feedback.type === 'success' ? '#059669' : '#dc2626', fontFamily: "'Poppins', sans-serif" }}>{feedback.text}</span>}
            </div>
          )}
        </div>
        <div style={{ fontSize: 10, color: textMuted, flexShrink: 0, paddingTop: 2, fontFamily: "'Poppins', sans-serif" }}>{new Date(appt.startTime).toLocaleDateString('en-US', { weekday: 'short' })}</div>
      </div>
    )
  }

  const AppointmentRow = ({ appt, idx, total }: { appt: Appointment; idx: number; total: number }) => {
    const apptDate     = new Date(appt.startTime)
    const isConfirming = confirmingId === appt.ghlAppointmentId
    const feedback     = confirmFeedback[appt.ghlAppointmentId]
    return (
      <div className="appt-row" style={{ display: 'grid', gridTemplateColumns: '160px 1fr 120px 130px 200px', gap: 16, alignItems: 'center', padding: '14px 24px', borderBottom: idx < total - 1 ? `1px solid ${borderColor}` : 'none', transition: 'background .15s' }}>
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

  const listTableHeader = (
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
      `}</style>

      <div style={{ minHeight: '100vh', background: pageBg, padding: '32px', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {syncMessage && <div style={{ position: 'fixed', top: 28, right: 28, background: syncMessage.type === 'success' ? '#059669' : '#dc2626', color: '#fff', padding: '14px 24px', borderRadius: 20, fontSize: 12, fontWeight: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.22)', zIndex: 50 }}>{syncMessage.text}</div>}

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 500, color: textPrimary, margin: 0 }}>Appointments</h1>
              <p style={{ fontSize: 12, color: textMuted, margin: '4px 0 0', fontWeight: 400 }}>{appointments.length} total · {upcoming.length} upcoming</p>
            </div>
            <button onClick={handleResync} disabled={isSyncing} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: `1px solid ${borderColor}`, background: subtleBg, color: textMuted, fontSize: 11, fontWeight: 500, cursor: isSyncing ? 'not-allowed' : 'pointer', opacity: isSyncing ? 0.6 : 1, transition: 'all .15s' }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: isSyncing ? 'spin .8s linear infinite' : 'none' }}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              {isSyncing ? 'Syncing...' : 'Resync'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
            {statCards.map((card, i) => (
              <div key={i} className="stat-card" style={{ padding: '20px 22px', borderRadius: 20, border: card.isDark ? 'none' : `1px solid ${borderColor}`, background: card.isDark ? (dark ? '#1e3a2a' : '#2d4a35') : cardBg, boxShadow: card.isDark ? 'none' : (dark ? 'none' : '0 2px 12px rgba(0,0,0,0.05)'), display: 'flex', flexDirection: 'column' as const, gap: 0, transition: 'all .2s', cursor: 'default', position: 'relative' as const, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: card.isDark ? 'rgba(255,255,255,0.75)' : textMuted, margin: 0 }}>{card.label}</p>
                  {card.isDark ? <Sparkline /> : card.iconEl}
                </div>
                <p style={{ fontSize: 40, fontWeight: 700, color: card.isDark ? '#ffffff' : textPrimary, margin: '0 0 6px', lineHeight: 1 }}>{card.value}</p>
                <p style={{ fontSize: 11, fontWeight: 400, color: card.isDark ? 'rgba(255,255,255,0.55)' : textMuted, margin: 0 }}>{card.sub}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: '10px 14px', flexWrap: 'wrap' as const }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: '6px 12px', minWidth: 180 }}>
                  <svg width="13" height="13" fill="none" stroke={textMuted} strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search appointments..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 11, color: textPrimary, width: '100%' }}/>
                  {searchQuery && <button onClick={() => setSearchQuery('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: textMuted, display: 'flex', padding: 0 }}><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button>}
                </div>
                <div style={{ width: 1, height: 22, background: borderColor, flexShrink: 0 }} />
                <div style={{ display: 'flex', gap: 4 }}>
                  {([{ key: 'all', label: 'All', count: appointments.length },{ key: 'upcoming', label: 'Upcoming', count: upcomingFilterCount },{ key: 'past', label: 'Past', count: pastFilterCount }] as const).map(tab => (
                    <button key={tab.key} onClick={() => setStatusFilter(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 8, border: 'none', background: statusFilter === tab.key ? '#800000' : 'transparent', color: statusFilter === tab.key ? '#fff' : textMuted, fontSize: 11, fontWeight: 500, cursor: 'pointer', transition: 'all .15s' }}>
                      {tab.label}
                      <span style={{ fontSize: 10, fontWeight: 600, background: statusFilter === tab.key ? 'rgba(255,255,255,0.25)' : (dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'), color: statusFilter === tab.key ? '#fff' : textMuted, borderRadius: 20, padding: '1px 7px', lineHeight: '16px' }}>{tab.count}</span>
                    </button>
                  ))}
                </div>
                <div style={{ width: 1, height: 22, background: borderColor, flexShrink: 0 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
                <div style={{ width: 1, height: 22, background: borderColor, flexShrink: 0 }} />
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
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, padding: '0 2px' }}>
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
              <MiniCalendar appointmentDates={appointmentDates} today={today} cardBg={cardBg} subtleBg={subtleBg} borderColor={borderColor} textPrimary={textPrimary} textMuted={textMuted} dark={dark} onClick={() => setIsModalOpen(true)} />
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <BigCalendarModal appointmentDates={appointmentDates} appointments={appointments} today={today} onClose={() => setIsModalOpen(false)} cardBg={cardBg} subtleBg={subtleBg} borderColor={borderColor} textPrimary={textPrimary} textMuted={textMuted} dark={dark} />}

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