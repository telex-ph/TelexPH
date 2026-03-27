'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Task = { id: string; title: string; status: 'todo' | 'in-progress' | 'done'; priority: 'high' | 'medium' | 'low'; dueDate: string }
type Milestone = { id: string; title: string; dueDate: string; completed: boolean }
type Message = { id: string; from: 'client' | 'va'; text: string; time: string }

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Complete onboarding questionnaire', status: 'done',        priority: 'high',   dueDate: 'Mar 12' },
  { id: 't2', title: 'Share brand kit & tone guidelines',  status: 'done',        priority: 'high',   dueDate: 'Mar 13' },
  { id: 't3', title: 'Set up communication channels',      status: 'in-progress', priority: 'medium', dueDate: 'Mar 15' },
  { id: 't4', title: 'Review and approve content calendar', status: 'in-progress', priority: 'high',   dueDate: 'Mar 18' },
  { id: 't5', title: 'First weekly performance report',    status: 'todo',        priority: 'medium', dueDate: 'Mar 22' },
  { id: 't6', title: 'Monthly strategy alignment call',    status: 'todo',        priority: 'low',    dueDate: 'Mar 31' },
]

const MILESTONES: Milestone[] = [
  { id: 'm1', title: 'Onboarding Complete',      dueDate: 'Mar 15', completed: true },
  { id: 'm2', title: 'First Deliverable Submitted', dueDate: 'Mar 20', completed: false },
  { id: 'm3', title: '30-Day Review',             dueDate: 'Apr 10', completed: false },
  { id: 'm4', title: 'Contract Renewal Check',    dueDate: 'Apr 30', completed: false },
]

const MOCK_MESSAGES: Message[] = [
  { id: 'msg1', from: 'va', text: 'Great, looking forward to it! Let me know if you need anything from our end.', time: '9:48 AM' },
  { id: 'msg2', from: 'client', text: 'Great, looking forward to it! Let me know if you need anything from our end.', time: '9:48 AM' },
  { id: 'msg3', from: 'va', text: 'Will do! Also shared the brand tone document on Google Drive — please review when you can.', time: '10:02 AM' },
]

const STATUS_META = {
  'todo':        { label: 'To Do',       bg: '#f5f5f8', color: '#555',    border: '#e0dde8' },
  'in-progress': { label: 'In Progress', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'done':        { label: 'Done',        bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
}

const PRIORITY_META = {
  high:   { label: 'High',   color: '#ef4444' },
  medium: { label: 'Medium', color: '#f59e0b' },
  low:    { label: 'Low',    color: '#22c55e' },
}

// ─── BRIEF FORM ───────────────────────────────────────────────────────────────
function ProjectBrief({ onSubmit, serviceName }: { onSubmit: () => void; serviceName: string }) {
  const [form, setForm] = useState({ goals: '', tools: '', hours: '20', timezone: 'PST', kpis: '', notes: '' })

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '10px 13px', border: '1.5px solid #e8e4e4', borderRadius: 9,
    fontSize: 12.5, fontFamily: "'Poppins', sans-serif", color: '#333', background: '#faf9f9',
    outline: 'none', resize: 'none' as const, transition: 'border-color 0.15s',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' as const,
    letterSpacing: '0.06em', marginBottom: 5, display: 'block', fontFamily: "'Poppins', sans-serif",
  }

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0edec', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif", marginBottom: 4 }}>Project Brief</div>
        <div style={{ fontSize: 12, color: '#888', fontFamily: "'Poppins', sans-serif" }}>Help your VA understand your goals for <strong style={{ color: '#800000' }}>{serviceName}</strong>.</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Project Goals *</label>
          <textarea rows={3} style={fieldStyle} value={form.goals} onChange={e => update('goals', e.target.value)} placeholder="What do you want to achieve? (e.g. Grow Instagram by 20%, reduce support tickets by 30%)" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={labelStyle}>Tools / Platforms Used</label>
            <input style={{ ...fieldStyle }} value={form.tools} onChange={e => update('tools', e.target.value)} placeholder="e.g. HubSpot, Canva, Notion" />
          </div>
          <div>
            <label style={labelStyle}>Hours / Week</label>
            <select style={{ ...fieldStyle, cursor: 'pointer' }} value={form.hours} onChange={e => update('hours', e.target.value)}>
              {['10', '20', '30', '40'].map(h => <option key={h} value={h}>{h} hrs / week</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={labelStyle}>Preferred Timezone</label>
            <select style={{ ...fieldStyle, cursor: 'pointer' }} value={form.timezone} onChange={e => update('timezone', e.target.value)}>
              {['PST', 'EST', 'CST', 'MST', 'GMT', 'UTC+8'].map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Key Performance Indicators</label>
            <input style={{ ...fieldStyle }} value={form.kpis} onChange={e => update('kpis', e.target.value)} placeholder="e.g. CSAT ≥ 95%, 10 posts/mo" />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Additional Notes</label>
          <textarea rows={2} style={fieldStyle} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any specific instructions, brand guidelines, or preferences for your VA." />
        </div>

        <button
          onClick={onSubmit}
          disabled={!form.goals.trim()}
          style={{
            width: '100%', padding: '13px 0',
            background: form.goals.trim() ? '#800000' : '#f0edec',
            color: form.goals.trim() ? '#fff' : '#ccc',
            border: 'none', borderRadius: 10,
            fontSize: 13, fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            cursor: form.goals.trim() ? 'pointer' : 'not-allowed',
            letterSpacing: '0.02em',
          }}
        >
          Submit Brief & Start Project →
        </button>
        <div style={{ textAlign: 'center', fontSize: 10, color: '#bbb', fontFamily: "'Poppins', sans-serif", marginTop: -8 }}>Your VA will be notified and begin onboarding within 24 hours.</div>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function VAProject() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const vaId        = searchParams.get('vaId') ?? 'va-001'
  const serviceName = searchParams.get('name') ?? 'VA Service'

  const [briefSubmitted, setBriefSubmitted] = useState(false)
  const [tasks,  setTasks]  = useState<Task[]>(INITIAL_TASKS)
  const [activeTab, setActiveTab] = useState<'tasks' | 'milestones' | 'messages'>('tasks')
  const [msgInput, setMsgInput] = useState('')
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)

  const doneCount  = tasks.filter(t => t.status === 'done').length
  const totalTasks = tasks.length
  const progress   = Math.round((doneCount / totalTasks) * 100)

  const cycleStatus = (task: Task) => {
    const next: Record<Task['status'], Task['status']> = { 'todo': 'in-progress', 'in-progress': 'done', 'done': 'todo' }
    setTasks(ts => ts.map(t => t.id === task.id ? { ...t, status: next[t.status] } : t))
  }

  const sendMessage = () => {
    if (!msgInput.trim()) return
    setMessages(m => [...m, { id: `msg${Date.now()}`, from: 'client', text: msgInput.trim(), time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }])
    setMsgInput('')
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", padding: 24, background: '#fdfcfc', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .proj-tab { border: none; border-radius: 8px; padding: 8px 16px; font-size: 12px; font-family: 'Poppins', sans-serif; font-weight: 500; cursor: pointer; transition: all 0.15s; }
        .proj-tab.active { background: #800000; color: #fff; }
        .proj-tab:not(.active) { background: transparent; color: #888; }
        .proj-tab:not(.active):hover { background: #f5f3f3; color: #333; }
        .task-row { display: flex; align-items: center; gap: 12; padding: 11px 14px; border-radius: 10px; border: 1px solid #f0edec; background: #fff; transition: all 0.15s; cursor: pointer; }
        .task-row:hover { box-shadow: 0 3px 12px rgba(0,0,0,0.07); border-color: #e8c0c0; transform: translateX(2px); }
        .msg-bubble-va { background: #f5f3f3; border-radius: 12px 12px 12px 3px; padding: 10px 14px; max-width: 75%; align-self: flex-start; }
        .msg-bubble-client { background: #800000; border-radius: 12px 12px 3px 12px; padding: 10px 14px; max-width: 75%; align-self: flex-end; }
        textarea:focus, input:focus, select:focus { border-color: #c9a0a0 !important; background: #fff !important; }
      `}</style>

      {/* Back */}
      <button
        onClick={() => router.back()}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 12, fontFamily: "'Poppins', sans-serif", marginBottom: 18, padding: 0 }}
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        Back to Interview
      </button>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {['Choose VA', 'View Profile', 'Interview', 'Project'].map((step, i) => (
          <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 3, borderRadius: 10, background: '#800000' }} />
            <span style={{ fontSize: 9.5, color: '#800000', fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>{step}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, color: '#800000', fontWeight: 600, margin: '0 0 2px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Step 4 of 4 — Final</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0, letterSpacing: '-0.02em' }}>Your Project</h2>
        <p style={{ fontSize: 13, color: '#555', margin: '3px 0 0' }}>
          {briefSubmitted ? 'Manage tasks, track milestones and communicate with your VA.' : 'Complete your project brief to kick off the engagement.'}
        </p>
      </div>

      {!briefSubmitted ? (
        <div style={{ maxWidth: 640 }}>
          <ProjectBrief onSubmit={() => setBriefSubmitted(true)} serviceName={decodeURIComponent(serviceName)} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>

          {/* ── LEFT ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Progress card */}
            <div style={{ background: 'linear-gradient(135deg,#800000 0%,#b03030 100%)', borderRadius: 16, padding: '22px 26px', color: '#fff', boxShadow: '0 8px 24px rgba(128,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,220,220,0.8)', fontFamily: "'Poppins', sans-serif", fontWeight: 500, marginBottom: 3 }}>Active Project</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.01em' }}>{decodeURIComponent(serviceName)}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600, fontFamily: "'Poppins', sans-serif", border: '1px solid rgba(255,255,255,0.25)' }}>
                  🟢 Active
                </div>
              </div>
              <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,220,220,0.8)', fontFamily: "'Poppins', sans-serif" }}>Overall Progress</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: "'Poppins', sans-serif" }}>{progress}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 10 }}>
                <div style={{ height: '100%', width: `${progress}%`, background: '#fff', borderRadius: 10, transition: 'width 0.5s ease' }} />
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 20 }}>
                {[{ label: 'Tasks Done', value: `${doneCount}/${totalTasks}` }, { label: 'Milestones', value: `${MILESTONES.filter(m => m.completed).length}/${MILESTONES.length}` }].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: "'Poppins', sans-serif", lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,210,210,0.7)', fontFamily: "'Poppins', sans-serif", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0edec', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', gap: 4, padding: '12px 16px', borderBottom: '1px solid #f5f2f2', background: '#fdfcfc' }}>
                {(['tasks', 'milestones', 'messages'] as const).map(t => (
                  <button key={t} className={`proj-tab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
                    {t === 'tasks' ? `Tasks (${totalTasks})` : t === 'milestones' ? 'Milestones' : 'Messages'}
                  </button>
                ))}
              </div>

              <div style={{ padding: '18px 20px' }}>

                {/* Tasks */}
                {activeTab === 'tasks' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {tasks.map(task => {
                      const st = STATUS_META[task.status]
                      const pr = PRIORITY_META[task.priority]
                      return (
                        <div key={task.id} className="task-row" onClick={() => cycleStatus(task)}
                          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, border: '1px solid #f0edec', background: '#fff', cursor: 'pointer', transition: 'all 0.15s' }}
                        >
                          {/* Checkbox-like indicator */}
                          <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${task.status === 'done' ? '#16a34a' : '#d0ccc8'}`, background: task.status === 'done' ? '#16a34a' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                            {task.status === 'done' && <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 500, color: task.status === 'done' ? '#aaa' : '#1a1a2e', fontFamily: "'Poppins', sans-serif", textDecoration: task.status === 'done' ? 'line-through' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                            <div style={{ fontSize: 10.5, color: '#bbb', fontFamily: "'Poppins', sans-serif", marginTop: 2 }}>Due {task.dueDate}</div>
                          </div>

                          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: pr.color, display: 'block' }} title={pr.label} />
                            <span style={{ fontSize: 10, fontWeight: 600, background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 5, padding: '2px 7px', fontFamily: "'Poppins', sans-serif" }}>{st.label}</span>
                          </div>
                        </div>
                      )
                    })}
                    <div style={{ fontSize: 10.5, color: '#bbb', textAlign: 'center', marginTop: 6, fontFamily: "'Poppins', sans-serif" }}>Click any task to cycle its status</div>
                  </div>
                )}

                {/* Milestones */}
                {activeTab === 'milestones' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {MILESTONES.map((m, i) => (
                      <div key={m.id} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 14px', borderRadius: 10, border: `1px solid ${m.completed ? '#bbf7d0' : '#f0edec'}`, background: m.completed ? '#f0fdf4' : '#fff' }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: m.completed ? '#16a34a' : '#f0edec', border: `2px solid ${m.completed ? '#16a34a' : '#e0dcdc'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {m.completed
                            ? <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                            : <span style={{ fontSize: 9, fontWeight: 700, color: '#aaa', fontFamily: "'Poppins', sans-serif" }}>{i + 1}</span>
                          }
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: m.completed ? '#16a34a' : '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>{m.title}</div>
                          <div style={{ fontSize: 11, color: '#aaa', fontFamily: "'Poppins', sans-serif", marginTop: 2 }}>Due {m.dueDate}</div>
                        </div>
                        {m.completed && <span style={{ fontSize: 10, fontWeight: 600, color: '#16a34a', fontFamily: "'Poppins', sans-serif" }}>✓ Done</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Messages */}
                {activeTab === 'messages' && (
                  <div style={{ display: 'flex', flexDirection: 'column', height: 340 }}>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 10 }}>
                      {messages.map(msg => (
                        <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'client' ? 'flex-end' : 'flex-start', gap: 3 }}>
                          <div className={msg.from === 'va' ? 'msg-bubble-va' : 'msg-bubble-client'}
                            style={{ borderRadius: msg.from === 'va' ? '12px 12px 12px 3px' : '12px 12px 3px 12px', padding: '10px 14px', background: msg.from === 'va' ? '#f5f3f3' : '#800000', maxWidth: '75%' }}
                          >
                            <p style={{ margin: 0, fontSize: 12.5, color: msg.from === 'va' ? '#333' : '#fff', fontFamily: "'Poppins', sans-serif", lineHeight: 1.5 }}>{msg.text}</p>
                          </div>
                          <span style={{ fontSize: 10, color: '#bbb', fontFamily: "'Poppins', sans-serif" }}>{msg.time}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid #f5f2f2' }}>
                      <input
                        value={msgInput}
                        onChange={e => setMsgInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder="Message your VA..."
                        style={{ flex: 1, padding: '9px 13px', border: '1.5px solid #e8e4e4', borderRadius: 9, fontSize: 12, fontFamily: "'Poppins', sans-serif", outline: 'none', background: '#faf9f9', color: '#333' }}
                      />
                      <button onClick={sendMessage} style={{ background: '#800000', border: 'none', borderRadius: 9, padding: '9px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT sidebar ── */}
          <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* VA summary */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0edec', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, fontFamily: "'Poppins', sans-serif" }}>Your VA</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#800000,#c05050)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>MS</div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}>Maria Santos</div>
                  <div style={{ fontSize: 11, color: '#888', fontFamily: "'Poppins', sans-serif" }}>CSR Specialist</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>Online</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[{ label: 'Started', value: 'Mar 12, 2025' }, { label: 'Hours/Week', value: '20 hrs' }, { label: 'Next Check-in', value: 'Mar 22' }].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: "'Poppins', sans-serif" }}>
                    <span style={{ color: '#aaa' }}>{s.label}</span>
                    <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0edec', padding: '16px 18px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontFamily: "'Poppins', sans-serif" }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Add Task' },
                  { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Schedule Check-in' },
                  { icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Download Report' },
                  { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', label: 'Renew Contract' },
                ].map(a => (
                  <button key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#faf9f9', border: '1px solid #f0edec', borderRadius: 8, padding: '9px 12px', cursor: 'pointer', fontSize: 12, fontFamily: "'Poppins', sans-serif", color: '#444', transition: 'all 0.15s', textAlign: 'left' }}>
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={a.icon}/></svg>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}