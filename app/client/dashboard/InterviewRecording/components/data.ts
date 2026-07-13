export type TimeSlot = { time: string; available: boolean }
export type Recording = {
  id: string
  vaId: string
  vaName: string
  vaAvatar: string
  title: string
  date: string
  duration: string
  status: 'completed' | 'upcoming' | 'missed'
}

export const TIME_SLOTS: TimeSlot[] = [
  { time: '8:00 AM', available: true },
  { time: '9:00 AM', available: true },
  { time: '10:00 AM', available: false },
  { time: '11:00 AM', available: true },
  { time: '1:00 PM', available: true },
  { time: '2:00 PM', available: false },
  { time: '3:00 PM', available: true },
  { time: '4:00 PM', available: true },
  { time: '5:00 PM', available: false },
]

export const MOCK_RECORDINGS: Recording[] = [
  { id: 'rec-001', vaId: 'va-001', vaName: 'Maria Santos', vaAvatar: 'MS', title: 'Discovery Call', date: 'Mar 10, 2025', duration: '32 min', status: 'completed' },
  { id: 'rec-002', vaId: 'va-002', vaName: 'James Reyes', vaAvatar: 'JR', title: 'Final Interview', date: 'Mar 14, 2025', duration: '48 min', status: 'completed' },
  { id: 'rec-003', vaId: 'va-003', vaName: 'Angela Cruz', vaAvatar: 'AC', title: 'Introductory Call', date: 'Mar 20, 2025', duration: '--', status: 'missed' },
  { id: 'rec-004', vaId: 'va-006', vaName: 'Ryan Dela Cruz', vaAvatar: 'RD', title: 'Technical Discovery', date: 'Jul 22, 2026', duration: '--', status: 'upcoming' },
]

export const REC_STATUS_STYLE: Record<Recording['status'], { bg: string; color: string; label: string }> = {
  completed: { bg: '#f0fdf4', color: '#16a34a', label: 'Completed' },
  upcoming: { bg: '#eff6ff', color: '#2563eb', label: 'Upcoming' },
  missed: { bg: '#fef2f2', color: '#dc2626', label: 'Missed' },
}

export function getCalendarDays() {
  const days = []
  const today = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      date: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      day: d.getDate(),
      isToday: i === 0,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    })
  }
  return days
}
