'use client'

import { useState, useEffect, useRef } from 'react'
import { useDashboardTheme } from './useDashboardTheme'

// ── Types ─────────────────────────────────────────────────────────────────────
interface MiniCalendarDropdownProps {
  /** Currently selected date — YYYY-MM-DD.
   *  In 'week' mode this should be the Monday of the selected week. */
  value: string
  onChange: (date: string) => void
  /** 'day'  — single day picker (for Daily filter & Custom range)
   *  'week' — full-week picker (for Weekly filter) */
  mode?: 'day' | 'week'
  placeholder?: string
  /** YYYY-MM-DD upper/lower bounds */
  maxDate?: string
  minDate?: string
  /** Label shown above the trigger (e.g. "From", "To") */
  label?: string
}

// ── Pure date helpers ─────────────────────────────────────────────────────────

function toYMD(d: Date): string {
  return d.toISOString().split('T')[0]!
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate()
}

/** Returns the Monday (Mon=start) of the week containing `d`. */
function getMondayOf(d: Date): Date {
  const copy = new Date(d)
  const dow  = copy.getDay()                    // 0=Sun … 6=Sat
  const diff = dow === 0 ? -6 : 1 - dow         // steps back to Monday
  copy.setDate(copy.getDate() + diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

/** Returns the Sunday (end) of the week containing `d`. */
function getSundayOf(d: Date): Date {
  const mon = getMondayOf(d)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  return sun
}

/** Builds the calendar grid for the given month.
 *  Always starts on Monday and ends on Sunday, padding with prev/next month days. */
function buildCalendarDays(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1)
  const lastOfMonth  = new Date(year, month + 1, 0)

  const startDow   = firstOfMonth.getDay()
  const startOffset = startDow === 0 ? 6 : startDow - 1
  const start = new Date(firstOfMonth)
  start.setDate(start.getDate() - startOffset)

  const endDow    = lastOfMonth.getDay()
  const endOffset = endDow === 0 ? 0 : 7 - endDow
  const end = new Date(lastOfMonth)
  end.setDate(end.getDate() + endOffset)

  const days: Date[] = []
  const cursor = new Date(start)
  while (cursor <= end) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

function formatDayDisplay(ymd: string): string {
  if (!ymd) return ''
  const d = new Date(ymd + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatWeekDisplay(mondayYmd: string): string {
  if (!mondayYmd) return ''
  const mon = new Date(mondayYmd + 'T00:00:00')
  const sun = getSundayOf(mon)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  if (mon.getFullYear() !== sun.getFullYear()) {
    return `${mon.toLocaleDateString('en-US', { ...opts, year: 'numeric' })} – ${sun.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`
  }
  return `${mon.toLocaleDateString('en-US', opts)} – ${sun.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MiniCalendarDropdown({
  value,
  onChange,
  mode = 'day',
  placeholder = 'Select date',
  maxDate,
  minDate,
  label,
}: MiniCalendarDropdownProps) {
  const { cardBg, borderColor, textPrimary, textMuted, subtleBg, isdarkmode } = useDashboardTheme()

  const today     = new Date()
  const initDate  = value ? new Date(value + 'T00:00:00') : today
  const [isOpen,      setIsOpen]      = useState(false)
  const [viewYear,    setViewYear]    = useState(initDate.getFullYear())
  const [viewMonth,   setViewMonth]   = useState(initDate.getMonth())
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null)  // week-row index

  const wrapRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  // When value changes externally, sync the view month
  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00')
      setViewYear(d.getFullYear())
      setViewMonth(d.getMonth())
    }
  }, [value])

  const calendarDays = buildCalendarDays(viewYear, viewMonth)
  // Group into weeks (rows of 7)
  const weeks: Date[][] = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }

  const selectedDate = value ? new Date(value + 'T00:00:00') : null
  const selectedMonday = selectedDate && mode === 'week' ? getMondayOf(selectedDate) : null
  const selectedSunday = selectedMonday ? getSundayOf(selectedMonday) : null

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function handleDayClick(day: Date) {
    const ymd = toYMD(day)
    if (minDate && ymd < minDate) return
    if (maxDate && ymd > maxDate) return
    if (mode === 'week') {
      onChange(toYMD(getMondayOf(day)))
    } else {
      onChange(ymd)
    }
    setIsOpen(false)
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  const ACCENT = '#800000'

  const triggerStyle: React.CSSProperties = {
    display:        'flex',
    alignItems:     'center',
    gap:            6,
    padding:        '5px 12px',
    borderRadius:   8,
    border:         `1px solid ${borderColor}`,
    background:     subtleBg,
    color:          value ? textPrimary : textMuted,
    fontSize:       10,
    fontWeight:     value ? 500 : 400,
    cursor:         'pointer',
    whiteSpace:     'nowrap',
    fontFamily:     "'Poppins', sans-serif",
    transition:     'border-color .15s',
    userSelect:     'none',
  }

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const DAY_HEADERS = ['Mo','Tu','We','Th','Fr','Sa','Su']

  const displayText = !value
    ? placeholder
    : mode === 'week'
    ? formatWeekDisplay(value)
    : formatDayDisplay(value)

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', gap: 4 }}>
      {/* Optional label */}
      {label && (
        <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: textMuted, fontFamily: "'Poppins', sans-serif" }}>
          {label}
        </span>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          ...triggerStyle,
          borderColor: isOpen ? ACCENT : borderColor,
          outline: 'none',
        }}
      >
        {/* Calendar icon */}
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="3" width="14" height="12" rx="2" stroke={value ? ACCENT : textMuted} strokeWidth="1.5"/>
          <path d="M1 7h14" stroke={value ? ACCENT : textMuted} strokeWidth="1.5"/>
          <path d="M5 1v4M11 1v4" stroke={value ? ACCENT : textMuted} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {displayText}
        {/* Chevron */}
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 2, transition: 'transform .15s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke={textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown calendar */}
      {isOpen && (
        <div
          style={{
            position:     'absolute',
            top:          label ? 'calc(100% + 6px)' : 'calc(100% + 6px)',
            left:         0,
            zIndex:       999,
            background:   cardBg,
            border:       `1px solid ${borderColor}`,
            borderRadius: 16,
            padding:      '14px 12px',
            boxShadow:    isdarkmode ? '0 8px 32px rgba(0,0,0,.6)' : '0 8px 32px rgba(0,0,0,.12)',
            minWidth:     220,
            fontFamily:   "'Poppins', sans-serif",
          }}
        >
          {/* Month navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <button onClick={prevMonth} style={navBtnStyle(textMuted)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6L7.5 3" stroke={textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span style={{ fontSize: 11, fontWeight: 600, color: textPrimary, fontFamily: "'Poppins', sans-serif" }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} style={navBtnStyle(textMuted)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3L7.5 6L4.5 9" stroke={textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          {/* Day-of-week headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {DAY_HEADERS.map(h => (
              <div key={h} style={{ textAlign: 'center', fontSize: 8, fontWeight: 600, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '2px 0', fontFamily: "'Poppins', sans-serif" }}>
                {h}
              </div>
            ))}
          </div>

          {/* Calendar grid — row by row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {weeks.map((week, wi) => {
              const weekHovered = hoveredWeek === wi
              const weekMonday  = getMondayOf(week[0]!)
              const isSelectedWeek = selectedMonday && isSameDay(weekMonday, selectedMonday)

              return (
                <div
                  key={wi}
                  onMouseEnter={() => mode === 'week' && setHoveredWeek(wi)}
                  onMouseLeave={() => mode === 'week' && setHoveredWeek(null)}
                  style={{
                    display:      'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap:          2,
                    borderRadius: mode === 'week' ? 8 : 0,
                    background:   mode === 'week' && (weekHovered || isSelectedWeek)
                      ? isSelectedWeek ? `${ACCENT}18` : isdarkmode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
                      : 'transparent',
                    cursor:       mode === 'week' ? 'pointer' : 'default',
                    padding:      mode === 'week' ? '1px 2px' : 0,
                    outline:      mode === 'week' && isSelectedWeek ? `1.5px solid ${ACCENT}44` : 'none',
                  }}
                  onClick={() => mode === 'week' && handleDayClick(week[0]!)}
                >
                  {week.map((day, di) => {
                    const ymd         = toYMD(day)
                    const isThisMonth = day.getMonth() === viewMonth
                    const isToday     = isSameDay(day, today)
                    const isSelected  = mode === 'day' && selectedDate && isSameDay(day, selectedDate)
                    const isInWeek    = mode === 'week' && selectedDate &&
                                        selectedMonday && selectedSunday &&
                                        day >= selectedMonday && day <= selectedSunday!
                    const isDisabled  = (minDate && ymd < minDate) || (maxDate && ymd > maxDate)

                    const bg = isSelected || (mode === 'week' && isInWeek) ? ACCENT : 'transparent'
                    const fg = isSelected || (mode === 'week' && isInWeek)
                      ? '#fff'
                      : !isThisMonth
                      ? isdarkmode ? '#3a3a3a' : '#d1d5db'
                      : isDisabled
                      ? textMuted
                      : isToday
                      ? ACCENT
                      : textPrimary

                    return (
                      <div
                        key={di}
                        onClick={(e) => { if (mode === 'day') { e.stopPropagation(); handleDayClick(day) } }}
                        style={{
                          textAlign:    'center',
                          fontSize:     10,
                          fontWeight:   isToday ? 700 : 400,
                          color:        fg,
                          background:   bg,
                          borderRadius: 6,
                          padding:      '4px 0',
                          cursor:       mode === 'day' && !isDisabled ? 'pointer' : 'inherit',
                          opacity:      isDisabled ? 0.35 : 1,
                          transition:   'background .1s, color .1s',
                          fontFamily:   "'Poppins', sans-serif",
                        }}
                        onMouseEnter={e => {
                          if (mode === 'day' && !isDisabled && !isSelected) {
                            ;(e.currentTarget as HTMLDivElement).style.background = isdarkmode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'
                          }
                        }}
                        onMouseLeave={e => {
                          if (mode === 'day' && !isSelected) {
                            ;(e.currentTarget as HTMLDivElement).style.background = 'transparent'
                          }
                        }}
                      >
                        {day.getDate()}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* Today shortcut */}
          <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                const ymd = toYMD(today)
                onChange(mode === 'week' ? toYMD(getMondayOf(today)) : ymd)
                setIsOpen(false)
                setViewYear(today.getFullYear())
                setViewMonth(today.getMonth())
              }}
              style={{
                fontSize:   9,
                fontWeight: 600,
                color:      ACCENT,
                background: 'none',
                border:     'none',
                cursor:     'pointer',
                fontFamily: "'Poppins', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function navBtnStyle(textMuted: string): React.CSSProperties {
  return {
    width:      24,
    height:     24,
    borderRadius: 6,
    border:     'none',
    background: 'transparent',
    cursor:     'pointer',
    display:    'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding:    0,
    color:      textMuted,
  }
}
