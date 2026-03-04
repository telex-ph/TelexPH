'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '../../layout'

// ✅ Updated to match backend IAppointment model
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
  // ✅ New fields
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

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// ✅ Updated to match real appointmentStatus values from backend
const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
  showed:     'bg-blue-100 text-blue-700',
  noshow:     'bg-yellow-100 text-yellow-700',
  invalid:    'bg-gray-100 text-gray-500',
}

const statusColorsDark: Record<string, string> = {
  confirmed: 'bg-green-900/30 text-green-400',
  cancelled:  'bg-red-900/30 text-red-400',
  showed:     'bg-blue-900/30 text-blue-400',
  noshow:     'bg-yellow-900/30 text-yellow-400',
  invalid:    'bg-gray-800 text-gray-500',
}

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// ✅ Helper to format time from ISO string
function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

interface MiniCalendarProps {
  isdarkmode: boolean
  appointmentDates: Set<string>
  today: Date
  onClick: () => void
}

function MiniCalendar({ isdarkmode, appointmentDates, today, onClick }: MiniCalendarProps) {
  const year = today.getFullYear()
  const month = today.getMonth()
  const cells = buildCalendarDays(year, month)

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-xl active:scale-[0.98] select-none ${isdarkmode ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a]' : 'bg-white hover:bg-gray-50 shadow-sm'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-[10px] bold-text ${isdarkmode ? 'text-white' : 'text-gray-700'}`}>
          {MONTHS[month]} {year}
        </span>
        <div className={`flex items-center gap-1.5 text-[10px] tracking-wider px-2.5 py-1 rounded-full ${isdarkmode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          View Full
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const dateStr = toDateStr(year, month, day)
          const isToday = day === today.getDate()
          const hasAppt = appointmentDates.has(dateStr)

          return (
            <div key={dateStr} className="relative flex items-center justify-center">
              <div className={`w-7 h-7 flex items-center justify-center rounded-full text-[11px] transition-all
                ${isToday ? 'bg-[#800000] text-white shadow-md' : isdarkmode ? 'text-gray-300' : 'text-gray-600'}
              `}>
                {day}
              </div>
              {hasAppt && !isToday && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#800000]" />
              )}
            </div>
          )
        })}
      </div>

      <div className={`mt-4 pt-3 border-t text-[10px] text-center ${isdarkmode ? 'border-white/5 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
        Click to expand calendar
      </div>
    </div>
  )
}

interface BigCalendarModalProps {
  isdarkmode: boolean
  appointmentDates: Set<string>
  appointments: Appointment[]
  today: Date
  onClose: () => void
}

function BigCalendarModal({ isdarkmode, appointmentDates, appointments, today, onClose }: BigCalendarModalProps) {
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const cells = buildCalendarDays(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  // ✅ Filter by startTime instead of date
  const selectedAppointments = selectedDate
    ? appointments.filter(a => a.startTime?.startsWith(selectedDate))
    : []

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={`w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden transition-all ${isdarkmode ? 'bg-[#1a1a1a] text-white' : 'bg-white text-gray-800'}`}
      >
        {/* Modal header */}
        <div className={`flex items-center justify-between px-8 pt-8 pb-4 ${isdarkmode ? 'border-b border-white/5' : 'border-b border-gray-100'}`}>
          <div>
            <h2 className="bold-text">
              Appointments Calendar
            </h2>
            <p className={`text-[10px] mt-0.5 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>Click a date to see appointments</p>
          </div>
          <button
            onClick={onClose}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all active:scale-90 ${isdarkmode ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Calendar body */}
          <div className="flex-1 p-8">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all active:scale-90 ${isdarkmode ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span className="bold-text">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                onClick={nextMonth}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all active:scale-90 ${isdarkmode ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[10px] text-gray-400 py-2">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} />
                const dateStr = toDateStr(viewYear, viewMonth, day)
                const isToday = dateStr === toDateStr(today.getFullYear(), today.getMonth(), today.getDate())
                const hasAppt = appointmentDates.has(dateStr)
                const isSelected = selectedDate === dateStr

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-[13px] border-none cursor-pointer transition-all active:scale-90 outline-none
                      ${isSelected ? 'bg-[#800000] text-white shadow-lg' :
                        isToday ? `ring-2 ring-[#800000] ${isdarkmode ? 'bg-white/5 text-white' : 'bg-red-50 text-[#800000]'}` :
                        isdarkmode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}
                    `}
                  >
                    {day}
                    {hasAppt && (
                      <span className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#800000]'}`} />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-5 text-[10px] text-gray-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#800000] inline-block" />
                Has appointment
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md ring-2 ring-[#800000] inline-block" />
                Today
              </div>
            </div>
          </div>

          {/* Right panel: selected date appointments */}
          <div className={`md:w-64 p-6 md:border-l flex flex-col gap-3 ${isdarkmode ? 'border-white/5' : 'border-gray-100'}`}>
            <div className={`text-[10px] bold-text mb-1 ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
              {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
            </div>

            {!selectedDate && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-40">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 text-gray-400">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
                <p className="text-[10px] text-gray-400">Click a date to view appointments</p>
              </div>
            )}

            {selectedDate && selectedAppointments.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-50">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 text-gray-400">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
                </svg>
                <p className="text-[10px] text-gray-400">No appointments on this date</p>
              </div>
            )}

            {selectedDate && selectedAppointments.map(appt => (
              <div
                key={appt._id}
                className={`p-3.5 rounded-xl ${isdarkmode ? 'bg-white/5' : 'bg-gray-50'}`}
              >
                {/* Title */}
                <p className={`bold-text text-[12px] mb-2 ${isdarkmode ? 'text-white' : 'text-gray-700'}`}>
                  {appt.title || appt.name || 'Appointment'}
                </p>

                {/* Time */}
                <div className="flex items-start gap-2 mb-1.5">
                  <svg className="shrink-0 mt-0.5" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <p className="text-[10px] text-gray-400">
                    {formatTime(appt.startTime)}{appt.endTime ? ` – ${formatTime(appt.endTime)}` : ''}
                  </p>
                </div>

                {/* Name */}
                {appt.name && (
                  <div className="flex items-start gap-2 mb-1.5">
                    <svg className="shrink-0 mt-0.5" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <p className="text-[10px] text-gray-400">{appt.name}</p>
                  </div>
                )}

                {/* Phone */}
                {appt.phone && (
                  <div className="flex items-start gap-2 mb-1.5">
                    <svg className="shrink-0 mt-0.5" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 2.7h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 10.1a16 16 0 0 0 6.91 6.91l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <p className="text-[10px] text-gray-400">{appt.phone}</p>
                  </div>
                )}

                {/* Email */}
                {appt.email && (
                  <div className="flex items-start gap-2 mb-1.5">
                    <svg className="shrink-0 mt-0.5" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <p className="text-[10px] text-gray-400 truncate">{appt.email}</p>
                  </div>
                )}

                {/* Appointment Owner */}
                {appt.assignedUserName && (
                  <div className="flex items-start gap-2 mb-1.5">
                    <svg className="shrink-0 mt-0.5" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <div>
                      <p className={`text-[9px] ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Owner</p>
                      <p className="text-[10px] text-gray-400">{appt.assignedUserName}</p>
                    </div>
                  </div>
                )}

                {/* Location */}
                {(appt.location || appt.address) && (
                  <div className="flex items-start gap-2 mb-1.5">
                    <svg className="shrink-0 mt-0.5" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <p className="text-[10px] text-gray-400">{appt.location || appt.address}</p>
                  </div>
                )}

                {/* Calendar */}
                {appt.calendarName && (
                  <div className="flex items-start gap-2 mb-1.5">
                    <svg className="shrink-0 mt-0.5" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    <p className="text-[10px] text-gray-400">{appt.calendarName}</p>
                  </div>
                )}

                {/* Attendees */}
                {appt.attendees && appt.attendees.length > 0 && (
                  <div className="flex items-start gap-2 mb-1.5">
                    <svg className="shrink-0 mt-0.5" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <p className="text-[10px] text-gray-400">{appt.attendees.join(', ')}</p>
                  </div>
                )}

                {/* Booked By */}
                {appt.bookedBy && (
                  <div className="flex items-start gap-2 mb-1.5">
                    <svg className="shrink-0 mt-0.5" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <div>
                      <p className={`text-[9px] ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Booked By</p>
                      <p className="text-[10px] text-gray-400">{appt.bookedBy}</p>
                    </div>
                  </div>
                )}

                {/* Source */}
                {appt.source && (
                  <div className="flex items-start gap-2 mb-1.5">
                    <svg className="shrink-0 mt-0.5" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                    <p className="text-[10px] text-gray-400">{appt.source}</p>
                  </div>
                )}

                {/* Description */}
                {appt.description && (
                  <div className="flex items-start gap-2 mb-1.5">
                    <svg className="shrink-0 mt-0.5" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>
                    <p className="text-[10px] text-gray-400 line-clamp-2">{appt.description}</p>
                  </div>
                )}

                {/* Status */}
                {appt.appointmentStatus && (
                  <span className={`inline-block mt-1.5 text-[9px] px-2 py-0.5 rounded-full ${isdarkmode ? statusColorsDark[appt.appointmentStatus] : statusColors[appt.appointmentStatus]}`}>
                    {appt.appointmentStatus}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AppointmentsPage() {
  const { isdarkmode } = useDarkMode()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // ✅ Resync state
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  // ✅ Confirm state
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [confirmFeedback, setConfirmFeedback] = useState<Record<string, { type: 'success' | 'error'; text: string }>>({})
  const [credentialsModal, setCredentialsModal] = useState<{ email: string; password: string; name: string } | null>(null)
  // ✅ Sort state — newest to oldest by default
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const today = new Date()

  // ✅ Extracted so it can be called both on mount and after resync
  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        const data = await response.json()
        setAppointments(Array.isArray(data) ? data : data.appointments || [])
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Resync handler — calls POST /appointments/sync then re-fetches
  const handleResync = async () => {
    try {
      setIsSyncing(true)
      setSyncMessage(null)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/sync`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (response.ok) {
        setSyncMessage({ type: 'success', text: data.message || `✅ Synced ${data.count} appointments` })
        await fetchAppointments()
      } else {
        setSyncMessage({ type: 'error', text: data.error || 'Sync failed. Please try again.' })
      }
    } catch (error) {
      setSyncMessage({ type: 'error', text: 'Network error during sync.' })
    } finally {
      setIsSyncing(false)
      setTimeout(() => setSyncMessage(null), 4000)
    }
  }

  // ✅ Confirm handler — POST /appointments/:ghlAppointmentId/confirm
  const handleConfirm = async (appt: Appointment) => {
    if (!appt.email) {
      setConfirmFeedback(prev => ({
        ...prev,
        [appt.ghlAppointmentId]: { type: 'error', text: 'No email address on this appointment.' },
      }))
      setTimeout(() => setConfirmFeedback(prev => { const n = { ...prev }; delete n[appt.ghlAppointmentId]; return n }), 4000)
      return
    }
    try {
      setConfirmingId(appt.ghlAppointmentId)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${appt.ghlAppointmentId}/confirm`,
        { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      )
      const data = await response.json()
      if (response.ok && data.credentials) {
        // ✅ Show credentials in modal
        setCredentialsModal(data.credentials)
      } else {
        setConfirmFeedback(prev => ({
          ...prev,
          [appt.ghlAppointmentId]: { type: 'error', text: data.message || data.error || 'Confirmation failed.' },
        }))
        setTimeout(() => setConfirmFeedback(prev => { const n = { ...prev }; delete n[appt.ghlAppointmentId]; return n }), 5000)
      }
    } catch {
      setConfirmFeedback(prev => ({
        ...prev,
        [appt.ghlAppointmentId]: { type: 'error', text: 'Network error. Please try again.' },
      }))
      setTimeout(() => setConfirmFeedback(prev => { const n = { ...prev }; delete n[appt.ghlAppointmentId]; return n }), 5000)
    } finally {
      setConfirmingId(null)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  // ✅ Use startTime instead of date
  const appointmentDates = new Set(
    appointments.map(a => a.startTime?.split('T')[0]).filter(Boolean)
  )

  // ✅ Sort based on sortOrder — newest or oldest first
  const sortedAppointments = [...appointments].sort((a, b) => {
    const diff = new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    return sortOrder === 'newest' ? -diff : diff
  })

  const upcomingAppointments = sortedAppointments.filter(
    a => new Date(a.startTime) >= new Date(today.toDateString())
  )

  const pastAppointments = sortedAppointments.filter(
    a => new Date(a.startTime) < new Date(today.toDateString())
  )

  // ✅ Updated AppointmentCard — includes Confirm & Send Credentials button
  const AppointmentCard = ({ appt }: { appt: Appointment }) => {
    const apptDate = new Date(appt.startTime)
    const isUpcoming = apptDate >= new Date(today.toDateString())
    const isConfirming = confirmingId === appt.ghlAppointmentId
    const feedback = confirmFeedback[appt.ghlAppointmentId]

    return (
      <div className={`flex items-start gap-4 p-5 rounded-2xl transition-all duration-200 hover:shadow-md ${isdarkmode ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a]' : 'bg-white hover:bg-gray-50 shadow-sm'}`}>
        {/* Date block */}
        <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl shrink-0 ${isUpcoming ? 'bg-[#800000]' : isdarkmode ? 'bg-white/5' : 'bg-gray-100'}`}>
          <span className={`text-[10px] ${isUpcoming ? 'text-red-200' : 'text-gray-400'}`}>
            {apptDate.toLocaleDateString('en-US', { month: 'short' })}
          </span>
          <span className={`text-xl leading-none bold-text ${isUpcoming ? 'text-white' : 'text-gray-400'}`}>
            {apptDate.getDate()}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className={`bold-text text-[13px] truncate ${isdarkmode ? 'text-white' : 'text-gray-700'}`}>
            {appt.title || appt.name || 'Appointment'}
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {/* Time */}
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {formatTime(appt.startTime)}{appt.endTime ? ` – ${formatTime(appt.endTime)}` : ''}
            </span>

            {/* Client name */}
            {appt.name && (
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                {appt.name}
              </span>
            )}

            {/* Phone */}
            {appt.phone && (
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 2.7h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 10.1a16 16 0 0 0 6.91 6.91l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {appt.phone}
              </span>
            )}

            {/* Status badge */}
            {appt.appointmentStatus && (
              <span className={`text-[9px] px-2 py-0.5 rounded-full ${isdarkmode ? statusColorsDark[appt.appointmentStatus] : statusColors[appt.appointmentStatus]}`}>
                {appt.appointmentStatus}
              </span>
            )}
          </div>

          {/* Second row: owner, location, calendar */}
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {appt.assignedUserName && (
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {appt.assignedUserName}
              </span>
            )}
            {(appt.location || appt.address) && (
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {appt.location || appt.address}
              </span>
            )}
            {appt.calendarName && (
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
                {appt.calendarName}
              </span>
            )}
            {appt.source && (
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>
                </svg>
                {appt.source}
              </span>
            )}
          </div>

          {/* Description */}
          {appt.description && (
            <p className="text-[10px] text-gray-400 mt-1.5 line-clamp-2">{appt.description}</p>
          )}

          {/* Email */}
          {appt.email && (
            <p className="text-[10px] text-gray-400 mt-0.5 truncate">{appt.email}</p>
          )}

          {/* ✅ Confirm button + inline feedback */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {appt.email && (
              <button
                onClick={() => handleConfirm(appt)}
                disabled={isConfirming}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] bold-text border-none cursor-pointer transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                  ${isdarkmode
                    ? 'bg-[#800000]/80 text-white hover:bg-[#800000]'
                    : 'bg-[#800000] text-white hover:bg-[#6a0000]'
                  }`}
              >
                {isConfirming ? (
                  <>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Confirming…
                  </>
                ) : (
                  <>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Confirm & Send Credentials
                  </>
                )}
              </button>
            )}

            {feedback && (
              <span className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg
                ${feedback.type === 'success'
                  ? isdarkmode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700'
                  : isdarkmode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-700'
                }`}
              >
                {feedback.type === 'success'
                  ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                }
                {feedback.text}
              </span>
            )}
          </div>
        </div>

        <div className="text-[10px] text-gray-400 shrink-0 pt-0.5">
          {apptDate.toLocaleDateString('en-US', { weekday: 'short' })}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`bold-text mb-2 ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>
            Appointments
          </h1>
          <p className={`text-[10px] ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
            {appointments.length} total · {upcomingAppointments.length} upcoming
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* ✅ Sort toggle button */}
          <button
            onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] bold-text transition-all active:scale-95 border-none cursor-pointer
              ${isdarkmode ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {sortOrder === 'newest'
                ? <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>
                : <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>
              }
            </svg>
            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
          </button>

          {/* ✅ Resync button */}
          <button
            onClick={handleResync}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] bold-text transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed border-none cursor-pointer
              ${isdarkmode ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            className={isSyncing ? 'animate-spin' : ''}
          >
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          {isSyncing ? 'Syncing...' : 'Resync'}
          </button>
        </div>
      </div>

      {/* ✅ Sync status message banner */}
      {syncMessage && (
        <div className={`mb-5 px-4 py-3 rounded-xl text-[11px] flex items-center gap-2 transition-all
          ${syncMessage.type === 'success'
            ? isdarkmode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700'
            : isdarkmode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-700'
          }`}
        >
          {syncMessage.type === 'success'
            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          }
          {syncMessage.text}
        </div>
      )}

      {/* ✅ Updated stat cards to use real appointmentStatus values */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Confirmed', key: 'confirmed', bg: isdarkmode ? 'bg-gradient-to-br from-green-900/40 to-transparent' : 'bg-gradient-to-br from-green-50 to-white', textColor: isdarkmode ? 'text-green-300' : 'text-green-700' },
          { label: 'Showed',    key: 'showed',    bg: isdarkmode ? 'bg-gradient-to-br from-blue-900/40 to-transparent' : 'bg-gradient-to-br from-blue-50 to-white',   textColor: isdarkmode ? 'text-blue-300' : 'text-blue-700' },
          { label: 'No Show',   key: 'noshow',    bg: isdarkmode ? 'bg-gradient-to-br from-yellow-900/40 to-transparent' : 'bg-gradient-to-br from-yellow-50 to-white', textColor: isdarkmode ? 'text-yellow-300' : 'text-yellow-700' },
          { label: 'Cancelled', key: 'cancelled', bg: isdarkmode ? 'bg-gradient-to-br from-red-900/40 to-transparent' : 'bg-gradient-to-br from-red-50 to-white',     textColor: isdarkmode ? 'text-red-300' : 'text-red-700' },
        ].map(({ label, key, bg, textColor }) => {
          const count = appointments.filter(a => a.appointmentStatus === key).length
          return (
            <div key={key} className={`p-6 rounded-[2rem] shadow-sm border transition-all hover:shadow-md ${bg} ${isdarkmode ? 'border-white/5' : 'border-gray-50'}`}>
              <p className={`text-[9px] uppercase tracking-widest mb-3 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>
              <p className={`text-3xl bold-text ${textColor}`}>{count}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: appointment list */}
        <div className="xl:col-span-2 space-y-6">
          {/* Upcoming */}
          <div>
            <div className={`text-[9px] tracking-widest mb-3 px-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
              UPCOMING
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-20 rounded-2xl animate-pulse ${isdarkmode ? 'bg-white/5' : 'bg-gray-100'}`} />
                ))}
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className={`flex flex-col items-center justify-center py-14 rounded-2xl ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white shadow-sm'}`}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
                <p className="text-[10px] text-gray-400">No upcoming appointments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map(appt => <AppointmentCard key={appt._id} appt={appt} />)}
              </div>
            )}
          </div>

          {/* Past */}
          {!isLoading && pastAppointments.length > 0 && (
            <div>
              <div className={`text-[9px] tracking-widest mb-3 px-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                PAST
              </div>
              <div className="space-y-3 opacity-60">
                {pastAppointments.map(appt => <AppointmentCard key={appt._id} appt={appt} />)}
              </div>
            </div>
          )}
        </div>

        {/* Right: mini calendar */}
        <div className="space-y-4">
          <div className={`text-[9px] tracking-widest px-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
            CALENDAR
          </div>
          <MiniCalendar
            isdarkmode={isdarkmode}
            appointmentDates={appointmentDates}
            today={today}
            onClick={() => setIsModalOpen(true)}
          />

        </div>
      </div>

      {/* Big Calendar Modal */}
      {isModalOpen && (
        <BigCalendarModal
          isdarkmode={isdarkmode}
          appointmentDates={appointmentDates}
          appointments={appointments}
          today={today}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* ✅ Credentials Modal */}
      {credentialsModal && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setCredentialsModal(null) }}
        >
          <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            {/* Header */}
            <div className="bg-[#800000] px-8 py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="text-white bold-text text-lg">Client Account Created</h2>
              <p className="text-white/70 text-[11px] mt-1">Generated login credentials for this appointment</p>
            </div>

            {/* Credentials */}
            <div className="p-8">
              <p className={`text-[12px] mb-5 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                Hi <span className="bold-text">{credentialsModal.name}</span>, here are the login credentials:
              </p>

              <div className={`rounded-xl p-5 mb-4 space-y-4 ${isdarkmode ? 'bg-white/5' : 'bg-gray-50'}`}>
                {/* Email */}
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1 font-semibold">Email</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-[13px] bold-text truncate ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
                      {credentialsModal.email}
                    </p>
                    <button
                      onClick={() => navigator.clipboard.writeText(credentialsModal.email)}
                      className={`shrink-0 p-1.5 rounded-lg border-none cursor-pointer transition-all active:scale-90 ${isdarkmode ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                      title="Copy email"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1 font-semibold">Temporary Password</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[18px] bold-text text-[#800000] font-mono tracking-widest">
                      {credentialsModal.password}
                    </p>
                    <button
                      onClick={() => navigator.clipboard.writeText(credentialsModal.password)}
                      className={`shrink-0 p-1.5 rounded-lg border-none cursor-pointer transition-all active:scale-90 ${isdarkmode ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                      title="Copy password"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <p className={`text-[10px] text-center mb-5 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                Make sure to save these credentials. The password cannot be retrieved after closing this window.
              </p>

              <button
                onClick={() => setCredentialsModal(null)}
                className="w-full py-3 rounded-xl bg-[#800000] text-white text-[12px] bold-text border-none cursor-pointer hover:bg-[#6a0000] transition-all active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}