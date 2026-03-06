'use client'

import React, { useState, useRef } from 'react'
import { useDarkMode } from '../../layout'

// ── Types ──────────────────────────────────────────────────────────────────────
type CaseStudyRecord = {
  _id: string
  title: string
  subtitle: string
  author: string
  status: string
  tags: string[]
  start: string
  cover: string
}

type FormSection = {
  topic: string
  content: string
}

type FormData = {
  title: string
  subtitle: string
  author: string
  status: string
  tags: string[]
  startDate: string
  endDate: string
  challenge: string
  solution: string
  sections: FormSection[]
}

// ── Mock data ──────────────────────────────────────────────────────────────────
const MOCK_RECORDS: CaseStudyRecord[] = [
  { _id: '1', title: 'AI in Healthcare',        subtitle: 'How AI transforms patient care',               author: 'Dr. Smith', status: 'Active',    tags: ['AI', 'Healthcare', 'Technology'], start: '2026-02-10', cover: '' },
  { _id: '2', title: 'Blockchain Supply Chain',  subtitle: 'Decentralized logistics',                     author: 'Jane Doe',  status: 'Completed', tags: ['Blockchain', 'Logistics'],        start: '2026-02-15', cover: '' },
  { _id: '3', title: 'Remote Work Analytics',    subtitle: 'Measuring productivity in distributed teams', author: 'Bob Lee',   status: 'Draft',     tags: ['Analytics', 'Remote'],            start: '',           cover: '' },
  { _id: '4', title: 'Green Energy Systems',     subtitle: 'Renewable integration case',                  author: 'Alice K.',  status: 'Scheduled', tags: ['Energy', 'Sustainability'],       start: '2026-03-01', cover: '' },
]

const STATUS_OPTIONS   = ['Active', 'Draft', 'Completed', 'Scheduled']
const CATEGORY_OPTIONS = ['Technology', 'Healthcare', 'Finance', 'Marketing', 'Operations', 'Research', 'Design', 'Analytics']
const LIB_CATEGORIES   = ['All', 'Technology', 'Logistics', 'Analytics', 'Infrastructure']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const DEFAULT_FORM: FormData = {
  title: '', subtitle: '', author: '', status: 'Draft',
  tags: [], startDate: '', endDate: '', challenge: '', solution: '',
  sections: [{ topic: '', content: '' }],
}

const getStatusStyle = (s: string) => {
  switch (s) {
    case 'Active':    return { bg: 'rgba(128,0,0,0.10)',    color: '#800000', border: '1px solid rgba(128,0,0,0.25)' }
    case 'Completed': return { bg: 'rgba(5,150,105,0.09)',  color: '#059669', border: '1px solid rgba(5,150,105,0.22)' }
    case 'Draft':     return { bg: 'rgba(100,100,100,0.09)',color: '#6b7280', border: '1px solid rgba(100,100,100,0.22)' }
    case 'Scheduled': return { bg: 'rgba(124,58,237,0.09)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.22)' }
    default:          return { bg: '#f3f4f6',               color: '#6b7280', border: '1px solid #e5e7eb' }
  }
}

const getCalendarDays = (month: number): (number | null)[] => {
  const now = new Date()
  const y = now.getFullYear()
  const firstDay = (new Date(y, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(y, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

// ── Sub-components ─────────────────────────────────────────────────────────────

type StatTileProps = {
  label: string; count: number; color: string; iconPath?: string
  subtleBg: string; borderColor: string; textMuted: string
}
const StatTile = ({ label, count, color, iconPath, subtleBg, borderColor, textMuted }: StatTileProps) => (
  <div style={{ padding: '16px 12px', borderRadius: 16, background: subtleBg, border: `1px solid ${borderColor}`, textAlign: 'center', flex: 1, minWidth: 0, fontFamily: "'Poppins', sans-serif" }}>
    <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: '0 0 8px', fontFamily: "'Poppins', sans-serif" }}>{label}</p>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <span style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'Poppins', sans-serif" }}>{count}</span>
      {iconPath && (
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="13" height="13" fill="none" stroke="#fff" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={iconPath} />
          </svg>
        </div>
      )}
    </div>
  </div>
)

type MiniCalendarProps = {
  records: CaseStudyRecord[]
  subtleBg: string; borderColor: string; textSecondary: string; textMuted: string
  onDayClick: (dateStr: string) => void
  onOpenCalendar: () => void
}
const MiniCalendar = ({ records, subtleBg, borderColor, textSecondary, textMuted, onDayClick, onOpenCalendar }: MiniCalendarProps) => {
  const now = new Date()
  const m = now.getMonth(), y = now.getFullYear(), today = now.getDate()
  const cells = getCalendarDays(m)
  const dateStr = (d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  return (
    <div style={{ padding: 14, borderRadius: 16, background: subtleBg, border: `1px solid ${borderColor}`, flex: 1, fontFamily: "'Poppins', sans-serif" }}>
      <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: textSecondary, margin: '0 0 12px', fontFamily: "'Poppins', sans-serif" }}>{MONTHS[m]} {y}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 6 }}>
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 9, fontWeight: 700, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />
          const isToday = d === today
          const ds = dateStr(d)
          const hasEv = records.some(r => r.start === ds)
          return (
            <div
              key={i}
              onClick={() => hasEv ? onDayClick(ds) : onOpenCalendar()}
              style={{
                aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, borderRadius: 8, cursor: 'pointer', fontWeight: isToday ? 700 : 400,
                background: isToday ? '#800000' : hasEv ? 'rgba(59,130,246,0.12)' : 'transparent',
                color: isToday ? '#fff' : hasEv ? '#3b82f6' : textMuted,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {d}
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${borderColor}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: '#800000' }} />
          <span style={{ fontSize: 10, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>Today</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(59,130,246,0.25)' }} />
          <span style={{ fontSize: 10, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>Has events</span>
        </div>
      </div>
    </div>
  )
}

// ── Modals ─────────────────────────────────────────────────────────────────────

const Backdrop = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.48)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20, fontFamily: "'Poppins', sans-serif" }}>
    {children}
  </div>
)

const ConfirmModal = ({ isOpen, isEdit, isLoading, onClose, onConfirm, cardBg, borderColor, textPrimary, textMuted }: {
  isOpen: boolean; isEdit: boolean; isLoading: boolean; onClose: () => void; onConfirm: () => void
  cardBg: string; borderColor: string; textPrimary: string; textMuted: string
}) => {
  if (!isOpen) return null
  return (
    <Backdrop>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, padding: '32px 28px', maxWidth: 420, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.28)', fontFamily: "'Poppins', sans-serif" }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: textPrimary, margin: '0 0 8px', fontFamily: "'Poppins', sans-serif" }}>
          {isEdit ? 'Update case study?' : 'Create case study?'}
        </h3>
        <p style={{ fontSize: 12, color: textMuted, margin: '0 0 28px', fontFamily: "'Poppins', sans-serif" }}>
          {isEdit ? 'Save the changes to this case study?' : 'Are you sure you want to create this case study?'}
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: `1px solid ${borderColor}`, background: 'transparent', color: textMuted, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
          <button onClick={onConfirm} disabled={isLoading} style={{ flex: 2, padding: '11px 0', borderRadius: 12, border: 'none', background: '#800000', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: isLoading ? 0.7 : 1, fontFamily: "'Poppins', sans-serif" }}>
            {isLoading ? 'Saving…' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </Backdrop>
  )
}

const DeleteModal = ({ isOpen, isDeleting, targetTitle, onClose, onConfirm, cardBg, borderColor, textPrimary, textMuted }: {
  isOpen: boolean; isDeleting: boolean; targetTitle?: string; onClose: () => void; onConfirm: () => void
  cardBg: string; borderColor: string; textPrimary: string; textMuted: string
}) => {
  if (!isOpen) return null
  return (
    <Backdrop>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, padding: '32px 28px', maxWidth: 420, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.28)', fontFamily: "'Poppins', sans-serif" }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: textPrimary, margin: '0 0 8px', fontFamily: "'Poppins', sans-serif" }}>Delete case study?</h3>
        <p style={{ fontSize: 12, color: textMuted, margin: '0 0 4px', fontFamily: "'Poppins', sans-serif" }}>You are about to delete:</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#800000', margin: '0 0 6px', fontFamily: "'Poppins', sans-serif" }}>"{targetTitle}"</p>
        <p style={{ fontSize: 11, color: textMuted, margin: '0 0 28px', fontFamily: "'Poppins', sans-serif" }}>This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: `1px solid ${borderColor}`, background: 'transparent', color: textMuted, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} style={{ flex: 2, padding: '11px 0', borderRadius: 12, border: 'none', background: '#dc2626', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: isDeleting ? 0.7 : 1, fontFamily: "'Poppins', sans-serif" }}>
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </Backdrop>
  )
}

const PreviewModal = ({ isOpen, data, onClose, onEdit, cardBg, borderColor, textPrimary, textMuted, textSecondary, subtleBg }: {
  isOpen: boolean; data: CaseStudyRecord | null; onClose: () => void; onEdit: (r: CaseStudyRecord) => void
  cardBg: string; borderColor: string; textPrimary: string; textMuted: string; textSecondary: string; subtleBg: string
}) => {
  if (!isOpen || !data) return null
  const st = getStatusStyle(data.status)
  return (
    <Backdrop>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, maxWidth: 560, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.28)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ height: 160, background: data.cover ? `url(${data.cover}) center/cover` : 'linear-gradient(135deg,rgba(128,0,0,0.18),rgba(128,0,0,0.04))', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.35)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', padding: '4px 10px', borderRadius: 6, background: 'rgba(128,0,0,0.85)', color: '#fff', fontFamily: "'Poppins', sans-serif" }}>Case study</span>
          </div>
        </div>
        <div style={{ padding: '22px 26px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 19, fontWeight: 700, color: textPrimary, margin: '0 0 5px', fontFamily: "'Poppins', sans-serif" }}>{data.title}</h2>
              {data.subtitle && <p style={{ fontSize: 12, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{data.subtitle}</p>}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: st.bg, color: st.color, border: st.border, whiteSpace: 'nowrap' as const, flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>{data.status}</span>
          </div>
          <p style={{ fontSize: 12, color: textMuted, margin: '0 0 16px', fontFamily: "'Poppins', sans-serif" }}>By <strong style={{ color: textSecondary, fontFamily: "'Poppins', sans-serif" }}>{data.author}</strong></p>
          {data.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const, marginBottom: 16 }}>
              {data.tags.map(t => <span key={t} style={{ fontSize: 10, padding: '3px 11px', borderRadius: 20, background: subtleBg, border: `1px solid ${borderColor}`, color: textMuted, fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>{t}</span>)}
            </div>
          )}
          {data.start && <p style={{ fontSize: 11, color: textMuted, margin: '0 0 22px', fontFamily: "'Poppins', sans-serif" }}>📅 Started: <strong style={{ color: textSecondary, fontFamily: "'Poppins', sans-serif" }}>{data.start}</strong></p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: `1px solid ${borderColor}`, background: 'transparent', color: textMuted, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>Close</button>
            <button onClick={() => { onEdit(data); onClose() }} style={{ flex: 2, padding: '11px 0', borderRadius: 12, border: 'none', background: '#800000', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>Edit this study</button>
          </div>
        </div>
      </div>
    </Backdrop>
  )
}

const CalendarModal = ({ isOpen, records, selectedMonthIndex, onClose, onMonthChange, onDateClick, cardBg, borderColor, textPrimary, textMuted, subtleBg }: {
  isOpen: boolean; records: CaseStudyRecord[]; selectedMonthIndex: number
  onClose: () => void; onMonthChange: (i: number) => void; onDateClick: (dateStr: string) => void
  cardBg: string; borderColor: string; textPrimary: string; textMuted: string; subtleBg: string
}) => {
  if (!isOpen) return null
  const now = new Date()
  const y = now.getFullYear()
  const m = selectedMonthIndex
  const today = now.getDate()
  const isCurrentMonth = m === now.getMonth()
  const cells = getCalendarDays(m)
  const dateStr = (d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const monthPrefix = `${y}-${String(m + 1).padStart(2, '0')}`
  const monthEvents = records.filter(r => r.start.startsWith(monthPrefix))

  return (
    <Backdrop>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, maxWidth: 560, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.28)', overflow: 'hidden', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ padding: '18px 24px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => onMonthChange(m === 0 ? 11 : m - 1)} style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${borderColor}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: textPrimary, margin: 0, minWidth: 160, textAlign: 'center', fontFamily: "'Poppins', sans-serif" }}>{MONTHS[m]} {y}</h3>
            <button onClick={() => onMonthChange(m === 11 ? 0 : m + 1)} style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${borderColor}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: subtleBg, color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div style={{ padding: '18px 24px 26px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 8 }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
            {cells.map((d, i) => {
              if (!d) return <div key={i} />
              const isToday = isCurrentMonth && d === today
              const ds = dateStr(d)
              const evs = records.filter(r => r.start === ds)
              return (
                <div key={i} onClick={() => evs.length ? onDateClick(ds) : undefined}
                  style={{ aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 10, cursor: evs.length ? 'pointer' : 'default',
                    background: isToday ? '#800000' : evs.length ? 'rgba(59,130,246,0.10)' : subtleBg,
                    border: isToday ? 'none' : evs.length ? '1px solid rgba(59,130,246,0.2)' : `1px solid transparent` }}>
                  <span style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? '#fff' : evs.length ? '#3b82f6' : textMuted, fontFamily: "'Poppins', sans-serif" }}>{d}</span>
                  {evs.length > 0 && <div style={{ width: 5, height: 5, borderRadius: '50%', background: isToday ? '#fff' : '#3b82f6', marginTop: 2 }} />}
                </div>
              )
            })}
          </div>
          {monthEvents.length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${borderColor}` }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: textMuted, margin: '0 0 10px', fontFamily: "'Poppins', sans-serif" }}>Events this month</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {monthEvents.map(r => {
                  const st = getStatusStyle(r.status)
                  return (
                    <div key={r._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 13px', borderRadius: 12, background: subtleBg, border: `1px solid ${borderColor}` }}>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: '0 0 2px', fontFamily: "'Poppins', sans-serif" }}>{r.title}</p>
                        <p style={{ fontSize: 10, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{r.start} · {r.author}</p>
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: st.bg, color: st.color, border: st.border, whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>{r.status}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Backdrop>
  )
}

const DateModal = ({ isOpen, dateStr, studies, onClose, onSelectStudy, cardBg, borderColor, textPrimary, textMuted, subtleBg }: {
  isOpen: boolean; dateStr: string; studies: CaseStudyRecord[]
  onClose: () => void; onSelectStudy: (r: CaseStudyRecord) => void
  cardBg: string; borderColor: string; textPrimary: string; textMuted: string; subtleBg: string
}) => {
  if (!isOpen) return null
  return (
    <Backdrop>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, maxWidth: 460, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.28)', overflow: 'hidden', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Events on {dateStr}</h3>
            <p style={{ fontSize: 11, color: textMuted, margin: '3px 0 0', fontFamily: "'Poppins', sans-serif" }}>{studies.length} case {studies.length === 1 ? 'study' : 'studies'} scheduled</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: subtleBg, color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div style={{ padding: '16px 22px 22px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {studies.map(r => {
            const st = getStatusStyle(r.status)
            return (
              <div key={r._id} style={{ padding: '12px 14px', borderRadius: 14, border: `1px solid ${borderColor}`, background: subtleBg, cursor: 'pointer' }}
                onClick={() => { onSelectStudy(r); onClose() }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>{r.title}</p>
                    {r.subtitle && <p style={{ fontSize: 11, color: textMuted, margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>{r.subtitle}</p>}
                    <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>By <strong style={{ color: textMuted, fontFamily: "'Poppins', sans-serif" }}>{r.author}</strong></p>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: st.bg, color: st.color, border: st.border, whiteSpace: 'nowrap' as const, flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>{r.status}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Backdrop>
  )
}

const Toast = ({ message, type }: { message: string; type: 'success' | 'error' }) => (
  <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 2000, padding: '14px 22px', borderRadius: 16, background: type === 'success' ? '#059669' : '#dc2626', color: '#fff', fontSize: 13, fontWeight: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', fontFamily: "'Poppins', sans-serif" }}>
    {message}
  </div>
)

// ── Main component ─────────────────────────────────────────────────────────────
export default function CaseStudies() {
  const formRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Dark mode from context (same as ListArchivedServices) ──────────────────
  const { isdarkmode: dark } = useDarkMode()

  // ── Theme tokens (mirrors ListArchivedServices exactly) ────────────────────
  const bg            = dark ? '#0f0f0f'                      : '#f8fafc'
  const cardBg        = dark ? '#1a1a1a'                      : '#ffffff'
  const subtleBg      = dark ? 'rgba(255,255,255,0.03)'       : '#f9fafb'
  const borderColor   = dark ? 'rgba(255,255,255,0.08)'       : '#e5e7eb'
  const textPrimary   = dark ? '#f0f0f0'                      : '#1f2937'
  const textSecondary = dark ? '#9ca3af'                      : '#374151'
  const textMuted     = dark ? '#6b7280'                      : '#6b7280'
  const inputBg       = dark ? '#161616'                      : '#ffffff'
  const hoverBg       = dark ? 'rgba(255,255,255,0.04)'       : 'rgba(0,0,0,0.02)'

  // ── Records ────────────────────────────────────────────────────────────────
  const [records, setRecords] = useState<CaseStudyRecord[]>(MOCK_RECORDS)

  // ── Form ───────────────────────────────────────────────────────────────────
  const [form, setForm] = useState<FormData>({ ...DEFAULT_FORM })
  const [coverPreview, setCoverPreview] = useState<string>('')
  const [dragOver, setDragOver] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // ── Modal states ───────────────────────────────────────────────────────────
  const [showConfirm, setShowConfirm]     = useState(false)
  const [showDelete, setShowDelete]       = useState(false)
  const [showPreview, setShowPreview]     = useState(false)
  const [showCalendar, setShowCalendar]   = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)

  // ── Loading ────────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading]   = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // ── Preview / Delete / Date ────────────────────────────────────────────────
  const [previewData, setPreviewData]                 = useState<CaseStudyRecord | null>(null)
  const [deleteTarget, setDeleteTarget]               = useState<CaseStudyRecord | null>(null)
  const [selectedDate, setSelectedDate]               = useState('')
  const [selectedDateStudies, setSelectedDateStudies] = useState<CaseStudyRecord[]>([])
  const [selectedMonthIndex, setSelectedMonthIndex]   = useState(new Date().getMonth())

  // ── Library ────────────────────────────────────────────────────────────────
  const [search, setSearch]                 = useState('')
  const [sortBy, setSortBy]                 = useState('date-newest')
  const [viewMode, setViewMode]             = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab]           = useState<'All' | 'Active' | 'Draft' | 'Completed' | 'Scheduled'>('All')
  const [activeTagFilter, setActiveTagFilter] = useState('All')

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  const updateForm = (key: keyof FormData, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const toggleTag = (tag: string) =>
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
    }))

  const addSection = () => {
    if (form.sections.length < 5)
      setForm(prev => ({ ...prev, sections: [...prev.sections, { topic: '', content: '' }] }))
  }

  const removeSection = (i: number) =>
    setForm(prev => ({ ...prev, sections: prev.sections.filter((_, idx) => idx !== i) }))

  const updateSection = (i: number, key: 'topic' | 'content', val: string) =>
    setForm(prev => {
      const s = [...prev.sections]; s[i] = { ...s[i], [key]: val }; return { ...prev, sections: s }
    })

  const resetForm = () => {
    setForm({ ...DEFAULT_FORM })
    setCoverPreview('')
    setIsEditMode(false)
    setEditingId(null)
  }

  const handleFile = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => setCoverPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const inp = (overrides: React.CSSProperties = {}): React.CSSProperties => ({
    width: '100%', padding: '8px 11px', borderRadius: 8,
    border: `1px solid ${borderColor}`, background: inputBg, color: textPrimary,
    fontSize: 12, outline: 'none', fontWeight: 400, boxSizing: 'border-box' as const,
    transition: 'border-color .15s', fontFamily: "'Poppins', sans-serif", ...overrides,
  })

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!form.title.trim() || !form.author.trim()) {
      showToast('Title and Author are required.', 'error')
      setShowConfirm(false)
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      const record: CaseStudyRecord = {
        _id: editingId || String(Date.now()),
        title: form.title, subtitle: form.subtitle, author: form.author,
        status: form.status, tags: form.tags, start: form.startDate, cover: coverPreview,
      }
      if (isEditMode && editingId) {
        setRecords(prev => prev.map(r => r._id === editingId ? record : r))
        showToast('Case study updated!', 'success')
      } else {
        setRecords(prev => [record, ...prev])
        showToast('Case study created!', 'success')
      }
      setIsLoading(false)
      setShowConfirm(false)
      resetForm()
    }, 800)
  }

  // ── Edit ───────────────────────────────────────────────────────────────────
  const handleEdit = (r: CaseStudyRecord) => {
    setForm({
      title: r.title, subtitle: r.subtitle, author: r.author,
      status: r.status, tags: r.tags, startDate: r.start, endDate: '',
      challenge: '', solution: '', sections: [{ topic: '', content: '' }],
    })
    setCoverPreview(r.cover)
    setIsEditMode(true)
    setEditingId(r._id)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    setTimeout(() => {
      setRecords(prev => prev.filter(r => r._id !== deleteTarget._id))
      showToast('Case study deleted.', 'success')
      setIsDeleting(false)
      setShowDelete(false)
      setDeleteTarget(null)
    }, 600)
  }

  // ── Day click ──────────────────────────────────────────────────────────────
  const handleDayClick = (ds: string) => {
    const studies = records.filter(r => r.start === ds)
    if (studies.length) {
      setSelectedDate(ds)
      setSelectedDateStudies(studies)
      setShowCalendar(false)
      setShowDateModal(true)
    }
  }

  // ── Counts & filtered ──────────────────────────────────────────────────────
  const counts = {
    All:       records.length,
    Active:    records.filter(r => r.status === 'Active').length,
    Draft:     records.filter(r => r.status === 'Draft').length,
    Completed: records.filter(r => r.status === 'Completed').length,
    Scheduled: records.filter(r => r.status === 'Scheduled').length,
  }

  const filtered = records
    .filter(r => {
      if (activeTab !== 'All' && r.status !== activeTab) return false
      if (activeTagFilter !== 'All' && !r.tags.includes(activeTagFilter)) return false
      const q = search.toLowerCase()
      if (search && !r.title.toLowerCase().includes(q) && !r.author.toLowerCase().includes(q)) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'alpha-asc')   return a.title.localeCompare(b.title)
      if (sortBy === 'alpha-desc')  return b.title.localeCompare(a.title)
      if (sortBy === 'date-oldest') return (a.start || '').localeCompare(b.start || '')
      return (b.start || '').localeCompare(a.start || '')
    })

  const card: React.CSSProperties = {
    background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16,
    boxShadow: dark ? '0 1px 6px rgba(0,0,0,.4)' : '0 1px 6px rgba(0,0,0,.06)',
  }
  const lbl: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: textMuted, display: 'block', marginBottom: 5,
    fontFamily: "'Poppins', sans-serif",
  }
  const tileProps = { subtleBg, borderColor, textMuted }

  // shared modal theme props
  const modalTheme = { cardBg, borderColor, textPrimary, textMuted, textSecondary, subtleBg }

  return (
    <div style={{ minHeight: '100vh', padding: '28px 24px', fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @keyframes slideIn { from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }
        *, *::before, *::after { font-family: 'Poppins', sans-serif !important; box-sizing: border-box; }
        input:focus, textarea:focus, select:focus { border-color: #800000 !important; outline: none !important; box-shadow: none !important; }
        .cs-card { transition: transform .18s, box-shadow .18s, border-color .18s; }
        .cs-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.10) !important; border-color: rgba(0,0,0,.13) !important; }
        .arc-row:hover { background: ${hoverBg} !important; }
        .pill-btn:hover { opacity: .78; }
        .icon-btn:hover { opacity: .7; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      {toast && <Toast message={toast.msg} type={toast.type} />}

      <ConfirmModal   isOpen={showConfirm}   isEdit={isEditMode} isLoading={isLoading}  onClose={() => setShowConfirm(false)}   onConfirm={handleSubmit}       {...modalTheme} />
      <DeleteModal    isOpen={showDelete}    isDeleting={isDeleting} targetTitle={deleteTarget?.title} onClose={() => setShowDelete(false)} onConfirm={handleDeleteConfirm} {...modalTheme} />
      <PreviewModal   isOpen={showPreview}   data={previewData}  onClose={() => setShowPreview(false)}  onEdit={handleEdit}                {...modalTheme} />
      <CalendarModal  isOpen={showCalendar}  records={records}   selectedMonthIndex={selectedMonthIndex} onClose={() => setShowCalendar(false)} onMonthChange={setSelectedMonthIndex} onDateClick={handleDayClick} {...modalTheme} />
      <DateModal      isOpen={showDateModal} dateStr={selectedDate} studies={selectedDateStudies} onClose={() => setShowDateModal(false)} onSelectStudy={(r) => { setPreviewData(r); setShowPreview(true) }} {...modalTheme} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }} ref={formRef}>

        {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: `1px solid ${borderColor}` }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 500, color: textPrimary, margin: 0, lineHeight: 1.3, fontFamily: "'Poppins', sans-serif" }}>
              Case study
            </h1>
            <p style={{ fontSize: 12, color: textMuted, margin: '4px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>
              Manage your case studies / Create, edit, and organize your research projects with ease
            </p>
          </div>
        </div>

        {/* TOP ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, marginBottom: 16, alignItems: 'stretch' }}>

          {/* Quick Stats */}
          <div style={{ ...card, padding: '22px 22px' }}>
            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Quick stats</p>
              <p style={{ fontSize: 11, color: textMuted, margin: '3px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>Current system overview and counts</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <StatTile {...tileProps} label="Active"   count={counts.Active}    color="#800000" iconPath="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 5v5l4 2" />
              <StatTile {...tileProps} label="Done"     count={counts.Completed} color="#059669" iconPath="M20 6L9 17l-5-5" />
              <StatTile {...tileProps} label="Draft"    count={counts.Draft}     color="#6b7280" iconPath="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              <StatTile {...tileProps} label="Schedule" count={counts.Scheduled} color="#7c3aed" iconPath="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
            </div>
            <div style={{ textAlign: 'center', paddingTop: 14, borderTop: `1px solid ${borderColor}` }}>
              <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: '0 0 4px', fontFamily: "'Poppins', sans-serif" }}>Total</p>
              <span style={{ fontSize: 40, fontWeight: 700, color: textPrimary, lineHeight: 1, fontFamily: "'Poppins', sans-serif" }}>{records.length}</span>
            </div>
          </div>

          {/* Timeline & Events */}
          <div style={{ ...card, padding: '22px 22px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Timeline & events</p>
                <p style={{ fontSize: 11, color: textMuted, margin: '3px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>Scheduled activities and research milestones</p>
              </div>
              <button onClick={() => setShowCalendar(true)} className="icon-btn" style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${borderColor}`, background: subtleBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted, flexShrink: 0 }}>
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                </svg>
              </button>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <MiniCalendar
                records={records} subtleBg={subtleBg} borderColor={borderColor}
                textSecondary={textSecondary} textMuted={textMuted}
                onDayClick={handleDayClick}
                onOpenCalendar={() => setShowCalendar(true)}
              />
            </div>
          </div>
        </div>

        {/* ── FORM ──────────────────────────────────────────────────────────── */}
        <div style={{ ...card, padding: '22px 22px', marginBottom: 16 }}>
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
              {isEditMode ? 'Edit case study' : 'Create new case study'}
            </p>
            <p style={{ fontSize: 11, color: textMuted, margin: '3px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>
              {isEditMode ? 'Update the fields below and save your changes' : 'Fill in the details below to add a new case study'}
            </p>
          </div>

          {/* Cover + right */}
          <div style={{ display: 'grid', gridTemplateColumns: '175px 1fr', gap: 14, marginBottom: 13 }}>
            <div>
              <span style={lbl}>Cover image <span style={{ color: '#800000' }}>*</span></span>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                style={{ border: `1.5px dashed ${dragOver ? '#800000' : borderColor}`, borderRadius: 10, cursor: 'pointer', transition: 'all .15s', overflow: 'hidden', height: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: dragOver ? 'rgba(128,0,0,0.04)' : subtleBg, position: 'relative' }}
              >
                {coverPreview ? (
                  <img src={coverPreview} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                ) : (
                  <>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(128,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 7 }}>
                      <svg width="14" height="14" fill="none" stroke="#800000" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p style={{ fontSize: 10, color: textSecondary, margin: 0, fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>Click to upload</p>
                    <p style={{ fontSize: 9, color: textMuted, margin: '3px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>PNG, JPG, WebP · 10MB</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files?.[0])} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <span style={lbl}>Title <span style={{ color: '#800000' }}>*</span></span>
                  <input style={inp()} placeholder="Enter title..." value={form.title} onChange={e => updateForm('title', e.target.value)} />
                </div>
                <div>
                  <span style={lbl}>Subtitle</span>
                  <input style={inp()} placeholder="Enter subtitle..." value={form.subtitle} onChange={e => updateForm('subtitle', e.target.value)} />
                </div>
              </div>
              <div>
                <span style={lbl}>Author <span style={{ color: '#800000' }}>*</span></span>
                <input style={inp()} placeholder="Author name..." value={form.author} onChange={e => updateForm('author', e.target.value)} />
              </div>
              <div>
                <span style={lbl}>Status <span style={{ color: '#800000' }}>*</span></span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                  {STATUS_OPTIONS.map(s => {
                    const st = getStatusStyle(s); const sel = form.status === s
                    return (
                      <button key={s} className="pill-btn" onClick={() => updateForm('status', s)}
                        style={{ padding: '5px 12px', borderRadius: 20, border: sel ? st.border : `1px solid ${borderColor}`, background: sel ? st.bg : 'transparent', color: sel ? st.color : textMuted, fontSize: 10, fontWeight: 500, cursor: 'pointer', transition: 'all .15s', fontFamily: "'Poppins', sans-serif" }}>
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div style={{ marginBottom: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={lbl}>Categories <span style={{ color: '#800000' }}>*</span></span>
              {form.tags.length > 0 && <button onClick={() => updateForm('tags', [])} style={{ fontSize: 10, color: '#800000', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>Clear</button>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
              {CATEGORY_OPTIONS.map(t => {
                const sel = form.tags.includes(t)
                return (
                  <button key={t} className="pill-btn" onClick={() => toggleTag(t)}
                    style={{ padding: '4px 12px', borderRadius: 20, border: sel ? '1px solid rgba(128,0,0,0.3)' : `1px solid ${borderColor}`, background: sel ? 'rgba(128,0,0,0.09)' : subtleBg, color: sel ? '#800000' : textMuted, fontSize: 10, fontWeight: 500, cursor: 'pointer', transition: 'all .15s', fontFamily: "'Poppins', sans-serif" }}>
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 13 }}>
            <div>
              <span style={lbl}>Start date <span style={{ color: '#800000' }}>*</span></span>
              <input type="date" style={inp()} value={form.startDate} onChange={e => updateForm('startDate', e.target.value)} />
            </div>
            <div>
              <span style={lbl}>End date</span>
              <input type="date" style={inp()} value={form.endDate} onChange={e => updateForm('endDate', e.target.value)} />
            </div>
          </div>

          {/* Challenge + Solution */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 13 }}>
            <div>
              <span style={lbl}>Challenge <span style={{ color: '#800000' }}>*</span></span>
              <textarea style={inp({ minHeight: 72, resize: 'vertical' as const })} placeholder="Describe the challenge..." value={form.challenge} onChange={e => updateForm('challenge', e.target.value)} />
            </div>
            <div>
              <span style={lbl}>Solution <span style={{ color: '#800000' }}>*</span></span>
              <textarea style={inp({ minHeight: 72, resize: 'vertical' as const })} placeholder="Describe the solution..." value={form.solution} onChange={e => updateForm('solution', e.target.value)} />
            </div>
          </div>

          {/* Content Sections */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={lbl}>Content sections</span>
              {form.sections.length < 5 && (
                <button onClick={addSection} style={{ fontSize: 10, color: '#800000', background: 'rgba(128,0,0,0.07)', border: '1px solid rgba(128,0,0,0.2)', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>
                  + Add section
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {form.sections.map((s, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: 8, padding: '10px 12px', borderRadius: 10, background: subtleBg, border: `1px solid ${borderColor}`, alignItems: 'start' }}>
                  <div>
                    <span style={{ ...lbl, marginBottom: 4 }}>Topic {i + 1}</span>
                    <input style={inp({ fontSize: 11 })} placeholder={`Topic ${i + 1}`} value={s.topic} onChange={e => updateSection(i, 'topic', e.target.value)} />
                  </div>
                  <div>
                    <span style={{ ...lbl, marginBottom: 4 }}>Content {i + 1}</span>
                    <textarea style={inp({ fontSize: 11, minHeight: 50, resize: 'none' as const })} placeholder={`Content ${i + 1}`} value={s.content} onChange={e => updateSection(i, 'content', e.target.value)} />
                  </div>
                  {form.sections.length > 1 && (
                    <button onClick={() => removeSection(i)} className="icon-btn"
                      style={{ marginTop: 21, width: 26, height: 26, borderRadius: 6, border: `1px solid ${borderColor}`, background: 'transparent', color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={resetForm} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1px solid ${borderColor}`, background: 'transparent', color: textMuted, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>
              {isEditMode ? 'Cancel edit' : 'Reset form'}
            </button>
            <button onClick={() => setShowConfirm(true)} style={{ flex: 2, padding: '10px 0', borderRadius: 10, border: 'none', background: '#800000', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>
              {isEditMode ? 'Update case study' : 'Create case study'}
            </button>
          </div>
        </div>

        {/* ── LIBRARY ───────────────────────────────────────────────────────── */}
        <div style={{ ...card, overflow: 'hidden' }}>

          {/* Toolbar */}
          <div style={{ padding: '13px 18px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Case study library</p>
              <p style={{ fontSize: 10, color: textMuted, margin: '2px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>All registered analysis and records</p>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: textMuted, pointerEvents: 'none' as const }} width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search by title or author..." value={search} onChange={e => setSearch(e.target.value)} style={inp({ width: 210, paddingLeft: 30, fontSize: 11 })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, color: textMuted, fontWeight: 400, whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>Sort by</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={inp({ width: 'auto', padding: '7px 10px', fontSize: 11 })}>
                <option value="date-newest">Newest first</option>
                <option value="date-oldest">Oldest first</option>
                <option value="alpha-asc">Name A → Z</option>
                <option value="alpha-desc">Name Z → A</option>
              </select>
            </div>
            <div style={{ width: 1, height: 20, background: borderColor }} />
            <div style={{ display: 'flex', border: `1px solid ${borderColor}`, borderRadius: 8, overflow: 'hidden' }}>
              <button onClick={() => setViewMode('grid')} style={{ padding: '6px 9px', border: 'none', borderRight: `1px solid ${borderColor}`, background: viewMode === 'grid' ? '#800000' : 'transparent', color: viewMode === 'grid' ? '#fff' : textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all .15s' }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button onClick={() => setViewMode('list')} style={{ padding: '6px 9px', border: 'none', background: viewMode === 'list' ? '#800000' : 'transparent', color: viewMode === 'list' ? '#fff' : textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all .15s' }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>

          {/* Status tabs */}
          <div style={{ display: 'flex', padding: '0 18px', borderBottom: `1px solid ${borderColor}`, background: subtleBg }}>
            {(['All', 'Active', 'Draft', 'Completed', 'Scheduled'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: '9px 12px', border: 'none', borderBottom: activeTab === tab ? '2px solid #800000' : '2px solid transparent', background: 'transparent', color: activeTab === tab ? '#800000' : textMuted, fontSize: 11, fontWeight: activeTab === tab ? 600 : 400, cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>
                {tab}
                <span style={{ marginLeft: 5, fontSize: 9, padding: '1px 5px', borderRadius: 10, background: activeTab === tab ? 'rgba(128,0,0,0.10)' : dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: activeTab === tab ? '#800000' : textMuted, fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>
                  {counts[tab as keyof typeof counts]}
                </span>
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <span style={{ alignSelf: 'center', fontSize: 10, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>
              Showing <strong style={{ color: textSecondary, fontFamily: "'Poppins', sans-serif" }}>{filtered.length}</strong> of <strong style={{ color: textSecondary, fontFamily: "'Poppins', sans-serif" }}>{records.length}</strong>
            </span>
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderBottom: `1px solid ${borderColor}`, flexWrap: 'wrap' as const, background: cardBg }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: textMuted, marginRight: 2, whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>Category:</span>
            {LIB_CATEGORIES.map(tag => {
              const sel = activeTagFilter === tag
              return (
                <button key={tag} className="pill-btn" onClick={() => setActiveTagFilter(tag)}
                  style={{ padding: '3px 11px', borderRadius: 20, fontSize: 10, fontWeight: 500, cursor: 'pointer', transition: 'all .15s', border: sel ? '1px solid rgba(128,0,0,0.3)' : `1px solid ${borderColor}`, background: sel ? 'rgba(128,0,0,0.09)' : subtleBg, color: sel ? '#800000' : textMuted, fontFamily: "'Poppins', sans-serif" }}>
                  {tag}
                </button>
              )
            })}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: textMuted, fontWeight: 500, margin: '0 0 4px', fontFamily: "'Poppins', sans-serif" }}>No case studies found</p>
              <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                {search ? 'Try adjusting your search.' : 'Create your first case study above.'}
              </p>
            </div>
          )}

          {/* Grid view */}
          {filtered.length > 0 && viewMode === 'grid' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, padding: 16 }}>
              {filtered.map(r => {
                const st = getStatusStyle(r.status)
                const isBeingEdited = editingId === r._id
                return (
                  <div key={r._id} className="cs-card" style={{ border: `1px solid ${isBeingEdited ? '#800000' : borderColor}`, borderRadius: 14, overflow: 'hidden', background: cardBg, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 110, background: r.cover ? `url(${r.cover}) center/cover` : 'linear-gradient(135deg,rgba(128,0,0,0.12),rgba(128,0,0,0.03))', position: 'relative', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
                        <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 5, background: 'rgba(128,0,0,0.88)', color: '#fff', fontFamily: "'Poppins', sans-serif" }}>Case study</span>
                      </div>
                      {isBeingEdited && <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 8, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: '#800000', color: '#fff', fontFamily: "'Poppins', sans-serif" }}>Editing</div>}
                    </div>
                    <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: textPrimary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>{r.title}</p>
                      {r.subtitle && <p style={{ fontSize: 10, color: textMuted, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>{r.subtitle}</p>}
                      <p style={{ fontSize: 10, color: textMuted, margin: 0, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>By <span style={{ color: textSecondary, fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>{r.author}</span></p>
                      {r.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
                          {r.tags.slice(0, 3).map(t => <span key={t} style={{ fontSize: 8, fontWeight: 500, padding: '2px 7px', borderRadius: 4, background: subtleBg, border: `1px solid ${borderColor}`, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>{t}</span>)}
                          {r.tags.length > 3 && <span style={{ fontSize: 9, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>+{r.tags.length - 3}</span>}
                        </div>
                      )}
                      <div style={{ flex: 1 }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 9, borderTop: `1px solid ${borderColor}`, marginTop: 4 }}>
                        <span style={{ fontSize: 9, fontWeight: 500, padding: '3px 9px', borderRadius: 20, background: st.bg, color: st.color, border: st.border, fontFamily: "'Poppins', sans-serif" }}>{r.status}</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => { setPreviewData(r); setShowPreview(true) }} style={{ padding: '4px 9px', borderRadius: 7, border: `1px solid ${borderColor}`, background: 'transparent', color: textMuted, fontSize: 10, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>View</button>
                          <button onClick={() => handleEdit(r)} style={{ padding: '4px 9px', borderRadius: 7, border: `1px solid ${borderColor}`, background: 'transparent', color: textMuted, fontSize: 10, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>Edit</button>
                          <button onClick={() => { setDeleteTarget(r); setShowDelete(true) }} style={{ padding: '4px 8px', borderRadius: 7, border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.07)', color: '#dc2626', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* List view */}
          {filtered.length > 0 && viewMode === 'list' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 110px 130px', gap: 14, padding: '9px 18px', background: subtleBg, fontSize: 9, fontWeight: 600, color: textMuted, textTransform: 'uppercase' as const, letterSpacing: '0.07em', borderBottom: `1px solid ${borderColor}`, fontFamily: "'Poppins', sans-serif" }}>
                <span>Title</span><span>Author</span><span>Tags</span><span>Status</span><span style={{ textAlign: 'right' as const }}>Actions</span>
              </div>
              {filtered.map((r, i) => {
                const st = getStatusStyle(r.status)
                return (
                  <div key={r._id} className="arc-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 110px 130px', gap: 14, alignItems: 'center', padding: '11px 18px', borderBottom: i < filtered.length - 1 ? `1px solid ${borderColor}` : 'none', transition: 'background .15s' }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>{r.title}</p>
                      {r.subtitle && <p style={{ fontSize: 10, color: textMuted, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>{r.subtitle}</p>}
                    </div>
                    <p style={{ fontSize: 11, color: textMuted, margin: 0, fontWeight: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>{r.author}</p>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const, minWidth: 0 }}>
                      {r.tags.slice(0, 2).map(t => <span key={t} style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, background: subtleBg, border: `1px solid ${borderColor}`, color: textMuted, fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>{t}</span>)}
                      {r.tags.length > 2 && <span style={{ fontSize: 9, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>+{r.tags.length - 2}</span>}
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 500, padding: '3px 9px', borderRadius: 20, background: st.bg, color: st.color, border: st.border, display: 'inline-block', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif" }}>{r.status}</span>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' as const }}>
                      <button onClick={() => { setPreviewData(r); setShowPreview(true) }} style={{ padding: '4px 9px', borderRadius: 7, border: `1px solid ${borderColor}`, background: 'transparent', color: textMuted, fontSize: 10, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>View</button>
                      <button onClick={() => handleEdit(r)} style={{ padding: '4px 9px', borderRadius: 7, border: 'none', background: '#800000', color: '#fff', fontSize: 10, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>Edit</button>
                      <button onClick={() => { setDeleteTarget(r); setShowDelete(true) }} style={{ padding: '4px 8px', borderRadius: 7, border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.07)', color: '#dc2626', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                )
              })}
              <div style={{ padding: '9px 18px', background: subtleBg, borderTop: `1px solid ${borderColor}`, fontSize: 10, color: textMuted, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>
                {filtered.length} item{filtered.length !== 1 ? 's' : ''} displayed
                {activeTab !== 'All' ? ` · filtered by "${activeTab}"` : ''}
                {activeTagFilter !== 'All' ? ` · category "${activeTagFilter}"` : ''}
                {search ? ` · matching "${search}"` : ''}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}