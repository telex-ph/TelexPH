'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type TimeSlot = { time: string; available: boolean }
type Recording = { id: string; title: string; date: string; duration: string; thumbnail: string; status: 'completed' | 'upcoming' | 'missed' }

const TIME_SLOTS: TimeSlot[] = [
  { time: '8:00 AM',  available: true  },
  { time: '9:00 AM',  available: true  },
  { time: '10:00 AM', available: false },
  { time: '11:00 AM', available: true  },
  { time: '1:00 PM',  available: true  },
  { time: '2:00 PM',  available: false },
  { time: '3:00 PM',  available: true  },
  { time: '4:00 PM',  available: true  },
  { time: '5:00 PM',  available: false },
]

// Generate next 14 days
function getCalendarDays() {
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

const MOCK_RECORDINGS: Recording[] = [
  { id: 'rec-001', title: 'Discovery Call with Maria Santos', date: 'Mar 10, 2025', duration: '32 min', thumbnail: 'MS', status: 'completed' },
  { id: 'rec-002', title: 'Final Interview — James Reyes', date: 'Mar 14, 2025', duration: '48 min', thumbnail: 'JR', status: 'completed' },
  { id: 'rec-003', title: 'Introductory Call — Angela Cruz', date: 'Mar 20, 2025', duration: '--', thumbnail: 'AC', status: 'missed' },
]

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  completed: { bg: '#f0fdf4', color: '#16a34a', label: 'Completed' },
  upcoming:  { bg: '#eff6ff', color: '#2563eb', label: 'Upcoming' },
  missed:    { bg: '#fef2f2', color: '#dc2626', label: 'Missed' },
}

export default function VAInterviewRecording() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const vaId        = searchParams.get('vaId') ?? 'va-001'
  const serviceId   = searchParams.get('service') ?? ''
  const serviceName = searchParams.get('name') ?? ''
  const categoryId  = searchParams.get('category') ?? ''

  const calDays = getCalendarDays()

  const [activeView, setActiveView]   = useState<'schedule' | 'recordings'>('schedule')
  const [selectedDay,  setSelectedDay]  = useState(calDays[1].date)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [submitted,    setSubmitted]    = useState(false)
  const [playingId,    setPlayingId]    = useState<string | null>(null)

  const handleConfirm = () => {
    if (!selectedTime) return
    setSubmitted(true)
  }

  const handleProceed = () => {
    router.push(`/client/dashboard/VAProject?vaId=${vaId}&service=${serviceId}&name=${encodeURIComponent(serviceName)}&category=${categoryId}`)
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: 24, background: '#fdfcfc', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .day-btn { border: 1.5px solid #e8e4e4; border-radius: 10px; padding: 8px 6px; text-align: center; cursor: pointer; background: #fff; transition: all 0.15s; min-width: 52px; }
        .day-btn:hover:not(:disabled) { border-color: #c9a0a0; background: #fff5f5; }
        .day-btn.selected { background: #800000 !important; border-color: #800000 !important; color: #fff !important; }
        .day-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .time-btn { border: 1.5px solid #e8e4e4; border-radius: 8px; padding: 9px 0; font-size: 12px; font-family: 'Poppins', sans-serif; font-weight: 500; background: #fff; cursor: pointer; transition: all 0.15s; color: #444; }
        .time-btn:hover:not(:disabled) { border-color: #c9a0a0; background: #fff5f5; color: #800000; }
        .time-btn.selected { background: #800000 !important; border-color: #800000 !important; color: #fff !important; }
        .time-btn:disabled { background: #f5f3f3; color: #ccc; cursor: not-allowed; border-color: #f0edec; }
        .view-toggle-btn { border: none; border-radius: 8px; padding: 8px 16px; font-size: 12px; font-family: 'Poppins', sans-serif; font-weight: 500; cursor: pointer; transition: all 0.15s; }
        .view-toggle-btn.active { background: #800000; color: #fff; }
        .view-toggle-btn:not(.active) { background: transparent; color: #888; }
        .view-toggle-btn:not(.active):hover { background: #f5f3f3; color: #333; }
        .confirm-btn:hover { background: #6a0000 !important; }
        .rec-card { background: #fff; border: 1px solid #f0edec; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 6px rgba(0,0,0,0.04); transition: all 0.15s; }
        .rec-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-1px); }
      `}</style>

      {/* Back */}
      <button
        onClick={() => router.back()}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 12, fontFamily: "'Poppins', sans-serif", marginBottom: 18, padding: 0 }}
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        Back to VA Profile
      </button>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {['Choose VA', 'View Profile', 'Interview', 'Project'].map((step, i) => (
          <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 3, borderRadius: 10, background: i <= 2 ? '#800000' : '#ece8e8' }} />
            <span style={{ fontSize: 9.5, color: i <= 2 ? '#800000' : '#bbb', fontFamily: "'Poppins', sans-serif", fontWeight: i <= 2 ? 600 : 400 }}>{step}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, color: '#800000', fontWeight: 600, margin: '0 0 2px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Step 3 of 4</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Interview & Recordings</h2>
        <p style={{ fontSize: 13, color: '#555', margin: '3px 0 0' }}>Schedule your discovery call or review past interview recordings.</p>
      </div>

      {/* Toggle: Schedule / Recordings */}
      <div style={{ display: 'inline-flex', background: '#f5f3f3', borderRadius: 10, padding: 4, gap: 2, marginBottom: 24, border: '1px solid #ece8e8' }}>
        <button className={`view-toggle-btn${activeView === 'schedule' ? ' active' : ''}`} onClick={() => setActiveView('schedule')}>
          📅 Schedule Interview
        </button>
        <button className={`view-toggle-btn${activeView === 'recordings' ? ' active' : ''}`} onClick={() => setActiveView('recordings')}>
          🎥 Recordings ({MOCK_RECORDINGS.length})
        </button>
      </div>

      {/* ── SCHEDULE VIEW ── */}
      {activeView === 'schedule' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Confirmation success */}
            {submitted ? (
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0edec', padding: '40px 32px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px', fontFamily: "'Poppins', sans-serif" }}>Interview Scheduled!</h3>
                <p style={{ fontSize: 13, color: '#666', margin: '0 0 6px', fontFamily: "'Poppins', sans-serif" }}>
                  Your discovery call has been booked for
                </p>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#800000', fontFamily: "'Poppins', sans-serif", marginBottom: 24 }}>
                  {new Date(selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button
                    onClick={() => { setSubmitted(false); setSelectedTime(null) }}
                    style={{ padding: '10px 20px', background: '#f5f3f3', color: '#444', border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif", cursor: 'pointer' }}
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={handleProceed}
                    style={{ padding: '10px 20px', background: '#800000', color: '#fff', border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif", cursor: 'pointer' }}
                  >
                    Proceed to Project →
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Date picker */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0edec', padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 14, fontFamily: "'Poppins', sans-serif" }}>Select a Date</div>
                  <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                    {calDays.map(d => (
                      <button
                        key={d.date}
                        className={`day-btn${selectedDay === d.date ? ' selected' : ''}`}
                        disabled={d.isWeekend}
                        onClick={() => { setSelectedDay(d.date); setSelectedTime(null) }}
                      >
                        <div style={{ fontSize: 9, fontWeight: 600, fontFamily: "'Poppins', sans-serif", color: selectedDay === d.date ? 'rgba(255,255,255,0.8)' : '#aaa', textTransform: 'uppercase', marginBottom: 3 }}>{d.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: selectedDay === d.date ? '#fff' : d.isToday ? '#800000' : '#1a1a2e' }}>{d.day}</div>
                        {d.isToday && selectedDay !== d.date && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#800000', margin: '3px auto 0' }} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time picker */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0edec', padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 14, fontFamily: "'Poppins', sans-serif" }}>
                    Available Times
                    <span style={{ fontSize: 11, fontWeight: 400, color: '#aaa', marginLeft: 6 }}>
                      {new Date(selectedDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot.time}
                        className={`time-btn${selectedTime === slot.time ? ' selected' : ''}`}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar summary */}
          {!submitted && (
            <div style={{ position: 'sticky', top: 80 }}>
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0edec', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14, fontFamily: "'Poppins', sans-serif" }}>Summary</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                  {[
                    { label: 'Type', value: 'Discovery Call' },
                    { label: 'Duration', value: '30 minutes' },
                    { label: 'Format', value: 'Google Meet / Zoom' },
                    { label: 'Date', value: selectedDay ? new Date(selectedDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—' },
                    { label: 'Time', value: selectedTime ?? '—' },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: "'Poppins', sans-serif' " }}>
                      <span style={{ color: '#aaa' }}>{s.label}</span>
                      <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{s.value}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="confirm-btn"
                  disabled={!selectedTime}
                  onClick={handleConfirm}
                  style={{
                    width: '100%', padding: '11px 0',
                    background: selectedTime ? '#800000' : '#f0edec',
                    color: selectedTime ? '#fff' : '#ccc',
                    border: 'none', borderRadius: 10,
                    fontSize: 12.5, fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                    cursor: selectedTime ? 'pointer' : 'not-allowed',
                    transition: 'background 0.15s',
                  }}
                >
                  Confirm Interview
                </button>
                <div style={{ textAlign: 'center', fontSize: 10, color: '#bbb', marginTop: 8, fontFamily: "'Poppins', sans-serif" }}>A calendar invite will be sent to your email.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── RECORDINGS VIEW ── */}
      {activeView === 'recordings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MOCK_RECORDINGS.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#bbb' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🎥</div>
              <div style={{ fontSize: 13, fontFamily: "'Poppins', sans-serif" }}>No recordings yet. Schedule your first interview above.</div>
            </div>
          ) : (
            MOCK_RECORDINGS.map(rec => {
              const st = STATUS_STYLE[rec.status]
              const isPlaying = playingId === rec.id
              return (
                <div key={rec.id} className="rec-card">
                  {/* Thumbnail / play button */}
                  <div
                    style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg,#800000,#c05050)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: rec.status === 'completed' ? 'pointer' : 'default', position: 'relative', overflow: 'hidden' }}
                    onClick={() => rec.status === 'completed' && setPlayingId(isPlaying ? null : rec.id)}
                  >
                    <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>{rec.thumbnail}</span>
                    {rec.status === 'completed' && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isPlaying
                          ? <svg width={18} height={18} viewBox="0 0 24 24" fill="#fff" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                          : <svg width={18} height={18} viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M8 5v14l11-7z"/></svg>
                        }
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif", marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rec.title}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#aaa', fontFamily: "'Poppins', sans-serif" }}>
                      <span>{rec.date}</span>
                      <span>·</span>
                      <span>{rec.duration}</span>
                    </div>
                    {isPlaying && (
                      <div style={{ marginTop: 8, fontSize: 11, color: '#800000', fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>▶ Playing recording…</div>
                    )}
                  </div>

                  {/* Status + actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, background: st.bg, color: st.color, borderRadius: 20, padding: '3px 10px', fontFamily: "'Poppins', sans-serif" }}>{st.label}</span>
                    {rec.status === 'completed' && (
                      <button style={{ background: 'none', border: '1px solid #e0dcdc', borderRadius: 7, padding: '5px 10px', fontSize: 11, color: '#555', fontFamily: "'Poppins', sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        Download
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}

          {/* Skip to project */}
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleProceed}
              style={{ padding: '11px 24px', background: '#800000', color: '#fff', border: 'none', borderRadius: 10, fontSize: 12.5, fontWeight: 600, fontFamily: "'Poppins', sans-serif", cursor: 'pointer', letterSpacing: '0.02em' }}
            >
              Proceed to Project →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}