'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HIRED_VAS, TASK_STATUS_META, PRIORITY_META, type HiredVA, type Task } from './data'

export default function MyVAsPage() {
  const router = useRouter()
  const [vas, setVAs] = useState<HiredVA[]>(HIRED_VAS)
  const [activeId, setActiveId] = useState<string | null>(HIRED_VAS[0]?.id ?? null)
  const [tab, setTab] = useState<'tasks' | 'milestones' | 'messages'>('tasks')
  const [msgInput, setMsgInput] = useState('')

  const active = vas.find(v => v.id === activeId) ?? null

  const cycleStatus = (taskId: string) => {
    if (!active) return
    const next: Record<Task['status'], Task['status']> = { 'todo': 'in-progress', 'in-progress': 'done', 'done': 'todo' }
    setVAs(prev => prev.map(v => v.id !== active.id ? v : { ...v, tasks: v.tasks.map(t => t.id === taskId ? { ...t, status: next[t.status] } : t) }))
  }

  const sendMessage = () => {
    if (!msgInput.trim() || !active) return
    setVAs(prev => prev.map(v => v.id !== active.id ? v : {
      ...v, messages: [...v.messages, { id: `msg${Date.now()}`, from: 'client', text: msgInput.trim(), time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }],
    }))
    setMsgInput('')
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: '24px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: 11, color: '#666', fontWeight: 500, margin: '0 0 2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Virtual Assistant</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>My VAs</h2>
          <p style={{ fontSize: 13, color: '#555', fontWeight: 400, margin: '3px 0 0' }}>Manage tasks, milestones, and progress with your hired staff.</p>
        </div>
        <button
          onClick={() => router.push('/client/dashboard/BrowseVAs')}
          style={{ background: '#800000', border: 'none', borderRadius: 10, padding: '9px 16px', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer' }}
        >
          + Hire another VA
        </button>
      </div>

      {vas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', border: '1px dashed #e0dcdc', borderRadius: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>No hired VAs yet</div>
          <p style={{ fontSize: 13, color: '#888', margin: '0 0 20px' }}>Once you hire a VA, you'll manage their tasks and progress here.</p>
          <button onClick={() => router.push('/client/dashboard/BrowseVAs')} style={{ background: '#800000', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
            Browse VAs →
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* Roster list */}
          <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {vas.map(v => {
              const doneCount = v.tasks.filter(t => t.status === 'done').length
              const progress = v.tasks.length ? Math.round((doneCount / v.tasks.length) * 100) : 0
              const isActive = v.id === active?.id
              return (
                <button
                  key={v.id}
                  onClick={() => { setActiveId(v.id); setTab('tasks') }}
                  style={{ textAlign: 'left', background: '#fff', border: `1.5px solid ${isActive ? '#800000' : '#e0dcdc'}`, borderRadius: 14, padding: '16px 16px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#800000,#c05050)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {v.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
                      <div style={{ fontSize: 10.5, color: '#888', marginTop: 1 }}>{v.role}</div>
                    </div>
                  </div>
                  <div style={{ height: 5, background: '#f0edec', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', background: '#800000', width: `${progress}%`, borderRadius: 99 }} />
                  </div>
                  <div style={{ fontSize: 10.5, color: '#aaa' }}>{doneCount}/{v.tasks.length} tasks · {progress}% done</div>
                </button>
              )
            })}
          </div>

          {/* Detail panel */}
          {active && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 14, padding: '20px 22px', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#800000,#a82020)', color: '#fff', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {active.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>{active.name}</div>
                      <div style={{ fontSize: 12.5, color: '#666', marginTop: 2 }}>{active.role} · {active.contractType}</div>
                    </div>
                  </div>
                  <span style={{ background: '#dcfce7', color: '#15803d', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />Active
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 18 }}>
                  {[
                    { label: 'Start Date', value: active.startDate },
                    { label: 'Hours This Cycle', value: `${active.hoursThisCycle} hrs` },
                    { label: 'Rate', value: `$${active.rate}/hr` },
                  ].map(s => (
                    <div key={s.label} style={{ background: '#f8f6f6', border: '1px solid #e8e4e4', borderRadius: 10, padding: '10px 12px' }}>
                      <div style={{ fontSize: 9.5, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{s.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #e8e4e4' }}>
                  {(['tasks', 'milestones', 'messages'] as const).map((t, i) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      style={{ flex: 1, padding: 13, background: tab === t ? '#800000' : 'transparent', color: tab === t ? '#fff' : '#555', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif", borderRight: i < 2 ? '1px solid #e8e4e4' : 'none' }}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>

                <div style={{ padding: '20px 22px' }}>
                  {tab === 'tasks' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {active.tasks.map(task => {
                        const meta = TASK_STATUS_META[task.status]
                        return (
                          <div key={task.id} onClick={() => cycleStatus(task.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: '#faf9f9', border: '1px solid #f0edec', cursor: 'pointer' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_META[task.priority].color, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12.5, color: '#1a1a2e', textDecoration: task.status === 'done' ? 'line-through' : 'none', opacity: task.status === 'done' ? 0.6 : 1 }}>{task.title}</div>
                              <div style={{ fontSize: 10.5, color: '#aaa', marginTop: 2 }}>Due {task.dueDate}</div>
                            </div>
                            <span style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`, borderRadius: 6, padding: '3px 9px', fontSize: 10.5, fontWeight: 600, flexShrink: 0 }}>{meta.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {tab === 'milestones' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {active.milestones.map(m => (
                        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: '#faf9f9', border: '1px solid #f0edec' }}>
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: m.completed ? '#800000' : '#fff', border: `1.5px solid ${m.completed ? '#800000' : '#d5d0d0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {m.completed && <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12.5, color: '#1a1a2e', fontWeight: 600 }}>{m.title}</div>
                            <div style={{ fontSize: 10.5, color: '#aaa', marginTop: 2 }}>Due {m.dueDate}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab === 'messages' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto', paddingBottom: 4 }}>
                        {active.messages.map(m => (
                          <div key={m.id} style={{ alignSelf: m.from === 'client' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                            <div style={{ background: m.from === 'client' ? '#800000' : '#f0edec', color: m.from === 'client' ? '#fff' : '#1a1a2e', borderRadius: 12, padding: '9px 13px', fontSize: 12.5, lineHeight: 1.5 }}>{m.text}</div>
                            <div style={{ fontSize: 10, color: '#bbb', marginTop: 3, textAlign: m.from === 'client' ? 'right' : 'left' }}>{m.time}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <input
                          value={msgInput}
                          onChange={e => setMsgInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && sendMessage()}
                          placeholder="Type a message..."
                          style={{ flex: 1, border: '1.5px solid #e0dcdc', borderRadius: 10, padding: '10px 14px', fontSize: 12.5, outline: 'none', fontFamily: "'Poppins', sans-serif" }}
                        />
                        <button onClick={sendMessage} style={{ background: '#800000', border: 'none', borderRadius: 10, padding: '0 18px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>Send</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
