'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '../../layout'

interface Appointment {
  _id: string
  title: string
  description?: string
  date: string
  time?: string
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  clientName?: string
  clientEmail?: string
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
}

const statusColorsDark: Record<string, string> = {
  pending: 'bg-yellow-900/30 text-yellow-400',
  confirmed: 'bg-green-900/30 text-green-400',
  cancelled: 'bg-red-900/30 text-red-400',
  completed: 'bg-blue-900/30 text-blue-400',
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
      className={`rounded-3xl p-5 cursor-pointer transition-all duration-200 hover:shadow-xl active:scale-[0.98] select-none ${isdarkmode ? 'bg-[#202020] hover:bg-[#252525]' : 'bg-white hover:bg-gray-50 shadow-sm'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm uppercase tracking-widest ${isdarkmode ? 'text-white' : 'text-gray-700'}`} style={{ fontWeight: 400 }}>
          {MONTHS[month]} {year}
        </span>
        <div className={`flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${isdarkmode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          View Full
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] text-gray-400 py-1" style={{ fontWeight: 400 }}>{d}</div>
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
              `} style={{ fontWeight: 400 }}>
                {day}
              </div>
              {hasAppt && !isToday && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#800000]" />
              )}
            </div>
          )
        })}
      </div>

      <div className={`mt-4 pt-3 border-t text-[10px] uppercase tracking-wider text-center ${isdarkmode ? 'border-white/5 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
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

  const selectedAppointments = selectedDate
    ? appointments.filter(a => a.date?.startsWith(selectedDate))
    : []

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={`w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden transition-all ${isdarkmode ? 'bg-[#181818] text-white' : 'bg-white text-gray-800'}`}
        style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
      >
        {/* Modal header */}
        <div className={`flex items-center justify-between px-8 pt-8 pb-4 ${isdarkmode ? 'border-b border-white/5' : 'border-b border-gray-100'}`}>
          <div>
            <h2 className="text-lg uppercase tracking-widest" style={{ fontWeight: 400 }}>
              Appointments Calendar
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5 tracking-wide">Click a date to see appointments</p>
          </div>
          <button
            onClick={onClose}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center border-none cursor-pointer transition-all active:scale-90 ${isdarkmode ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
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
              <span className="text-base uppercase tracking-widest" style={{ fontWeight: 400 }}>
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
                <div key={d} className="text-center text-[10px] uppercase tracking-widest text-gray-400 py-2" style={{ fontWeight: 400 }}>{d}</div>
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
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center text-[13px] border-none cursor-pointer transition-all active:scale-90 outline-none
                      ${isSelected ? 'bg-[#800000] text-white shadow-lg' :
                        isToday ? `ring-2 ring-[#800000] ${isdarkmode ? 'bg-white/5 text-white' : 'bg-red-50 text-[#800000]'}` :
                        isdarkmode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}
                    `}
                    style={{ fontWeight: 400 }}
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
            <div className="flex items-center gap-5 mt-5 text-[10px] text-gray-400 uppercase tracking-wider">
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
            <div className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">
              {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
            </div>

            {!selectedDate && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-40">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 text-gray-400">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
                <p className="text-[11px] text-gray-400">Click a date to view appointments</p>
              </div>
            )}

            {selectedDate && selectedAppointments.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-50">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 text-gray-400">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
                </svg>
                <p className="text-[11px] text-gray-400">No appointments on this date</p>
              </div>
            )}

            {selectedDate && selectedAppointments.map(appt => (
              <div
                key={appt._id}
                className={`p-3.5 rounded-2xl ${isdarkmode ? 'bg-white/5' : 'bg-gray-50'}`}
              >
                <p className={`text-[12px] uppercase tracking-wide mb-1 ${isdarkmode ? 'text-white' : 'text-gray-700'}`} style={{ fontWeight: 400 }}>
                  {appt.title}
                </p>
                {appt.time && (
                  <p className="text-[10px] text-gray-400 mb-1">{appt.time}</p>
                )}
                {appt.clientName && (
                  <p className="text-[10px] text-gray-400">{appt.clientName}</p>
                )}
                {appt.status && (
                  <span className={`inline-block mt-1.5 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full ${isdarkmode ? statusColorsDark[appt.status] : statusColors[appt.status]}`}>
                    {appt.status}
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
  const today = new Date()

  useEffect(() => {
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
    fetchAppointments()
  }, [])

  const appointmentDates = new Set(
    appointments.map(a => a.date?.split('T')[0]).filter(Boolean)
  )

  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const upcomingAppointments = sortedAppointments.filter(
    a => new Date(a.date) >= new Date(today.toDateString())
  )

  const pastAppointments = sortedAppointments.filter(
    a => new Date(a.date) < new Date(today.toDateString())
  )

  const AppointmentCard = ({ appt }: { appt: Appointment }) => {
    const apptDate = new Date(appt.date)
    const isUpcoming = apptDate >= new Date(today.toDateString())

    return (
      <div className={`flex items-start gap-4 p-5 rounded-3xl transition-all duration-200 hover:shadow-md ${isdarkmode ? 'bg-[#202020] hover:bg-[#252525]' : 'bg-white hover:bg-gray-50 shadow-sm'}`}>
        {/* Date block */}
        <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl shrink-0 ${isUpcoming ? 'bg-[#800000]' : isdarkmode ? 'bg-white/5' : 'bg-gray-100'}`}>
          <span className={`text-[10px] uppercase tracking-widest ${isUpcoming ? 'text-red-200' : 'text-gray-400'}`} style={{ fontWeight: 400 }}>
            {apptDate.toLocaleDateString('en-US', { month: 'short' })}
          </span>
          <span className={`text-xl leading-none ${isUpcoming ? 'text-white' : 'text-gray-400'}`} style={{ fontWeight: 400 }}>
            {apptDate.getDate()}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] uppercase tracking-wide truncate ${isdarkmode ? 'text-white' : 'text-gray-700'}`} style={{ fontWeight: 400 }}>
            {appt.title}
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {appt.time && (
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {appt.time}
              </span>
            )}
            {appt.clientName && (
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                {appt.clientName}
              </span>
            )}
            {appt.status && (
              <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full ${isdarkmode ? statusColorsDark[appt.status] : statusColors[appt.status]}`}>
                {appt.status}
              </span>
            )}
          </div>
          {appt.description && (
            <p className="text-[11px] text-gray-400 mt-1.5 line-clamp-2">{appt.description}</p>
          )}
        </div>

        <div className="text-[11px] text-gray-400 shrink-0 pt-0.5">
          {apptDate.toLocaleDateString('en-US', { weekday: 'short' })}
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-2xl uppercase tracking-widest ${isdarkmode ? 'text-white' : 'text-gray-700'}`} style={{ fontWeight: 400 }}>
            Appointments
          </h1>
          <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-widest">
            {appointments.length} total · {upcomingAppointments.length} upcoming
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: appointment list */}
        <div className="xl:col-span-2 space-y-6">
          {/* Upcoming */}
          <div>
            <div className={`text-[10px] uppercase tracking-widest mb-3 px-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
              Upcoming
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-20 rounded-3xl animate-pulse ${isdarkmode ? 'bg-white/5' : 'bg-gray-100'}`} />
                ))}
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className={`flex flex-col items-center justify-center py-14 rounded-3xl ${isdarkmode ? 'bg-[#202020]' : 'bg-white shadow-sm'}`}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
                <p className="text-[12px] text-gray-400 uppercase tracking-wider">No upcoming appointments</p>
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
              <div className={`text-[10px] uppercase tracking-widest mb-3 px-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                Past
              </div>
              <div className="space-y-3 opacity-60">
                {pastAppointments.map(appt => <AppointmentCard key={appt._id} appt={appt} />)}
              </div>
            </div>
          )}
        </div>

        {/* Right: mini calendar */}
        <div className="space-y-4">
          <div className={`text-[10px] uppercase tracking-widest px-1 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
            Calendar
          </div>
          <MiniCalendar
            isdarkmode={isdarkmode}
            appointmentDates={appointmentDates}
            today={today}
            onClick={() => setIsModalOpen(true)}
          />

          {/* Quick stats */}
          <div className={`rounded-3xl p-5 space-y-3 ${isdarkmode ? 'bg-[#202020]' : 'bg-white shadow-sm'}`}>
            <p className={`text-[10px] uppercase tracking-widest ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Overview</p>
            {[
              { label: 'Confirmed', key: 'confirmed', color: 'bg-green-500' },
              { label: 'Pending', key: 'pending', color: 'bg-yellow-500' },
              { label: 'Cancelled', key: 'cancelled', color: 'bg-red-500' },
              { label: 'Completed', key: 'completed', color: 'bg-blue-500' },
            ].map(({ label, key, color }) => {
              const count = appointments.filter(a => a.status === key).length
              const pct = appointments.length > 0 ? (count / appointments.length) * 100 : 0
              return (
                <div key={key}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className={isdarkmode ? 'text-gray-400' : 'text-gray-500'}>{label}</span>
                    <span className={isdarkmode ? 'text-gray-300' : 'text-gray-600'}>{count}</span>
                  </div>
                  <div className={`h-1.5 rounded-full ${isdarkmode ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
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
    </div>
  )
}