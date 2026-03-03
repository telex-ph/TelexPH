'use client'
import { useState } from 'react'

function StatCard({ label, value, sub, trend, color }: {
  label: string; value: string; sub: string; trend: string; color: string
}) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '20px 22px',
      border: '1.5px solid #ede8e8', flex: 1, minWidth: '220px',
      boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
    }}>
      <div style={{ fontSize: 11, color: '#aaa', letterSpacing: '0.05em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.1, marginBottom: 4 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
        <span style={{
          fontSize: 10, fontWeight: 600, color: color,
          background: color === '#cc0000' ? '#fff0f0' : '#f0fdf4',
          padding: '2px 7px', borderRadius: 20,
        }}>{trend}</span>
        <span style={{ fontSize: 11, color: '#bbb' }}>{sub}</span>
      </div>
    </div>
  )
}

const PRIORITY: Record<string, { bg: string; color: string }> = {
  High:   { bg: '#fff0f0', color: '#cc0000' },
  Medium: { bg: '#fff8ed', color: '#b06000' },
  Low:    { bg: '#f0fdf4', color: '#15803d' },
}
const STATUS: Record<string, { bg: string; color: string }> = {
  Open:           { bg: '#fff0f0', color: '#cc0000' },
  'In Progress': { bg: '#eff6ff', color: '#1d4ed8' },
  Resolved:      { bg: '#f0fdf4', color: '#15803d' },
  Pending:       { bg: '#fefce8', color: '#854d0e' },
}

const TICKETS = [
  { id: '#SR-2026', subject: 'System-wide latency in production', client: 'CloudTech Solutions', priority: 'High', status: 'In Progress', updated: '5m ago' },
  { id: '#SR-2025', subject: 'New user onboarding workflow fix', client: 'Global Industries', priority: 'Medium', status: 'Open', updated: '42m ago' },
  { id: '#SR-2024', subject: 'API integration documentation update', client: 'Fintech Corp', priority: 'Low', status: 'Resolved', updated: '2h ago' },
  { id: '#SR-2023', subject: 'Payment gateway timeout issues', client: 'E-Shop Global', priority: 'High', status: 'Pending', updated: '5h ago' },
  { id: '#SR-2022', subject: 'Mobile app crashing on Android 14', client: 'AppVenture Inc', priority: 'High', status: 'Open', updated: 'Yesterday' },
  { id: '#SR-2021', subject: 'Request for custom report export', client: 'NexGen Systems', priority: 'Low', status: 'Resolved', updated: '2 days ago' },
]

function DonutChart({ slices }: { slices: { val: number; color: string; label: string }[] }) {
  const total = slices.reduce((s, x) => s + x.val, 0)
  let offset = 0
  const r = 40, cx = 50, cy = 50, stroke = 12
  const circ = 2 * Math.PI * r

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <svg width={100} height={100} viewBox="0 0 100 100">
        {slices.map((s, i) => {
          const dash = (s.val / total) * circ
          const gap = circ - dash
          const rotation = (offset / total) * 360 - 90
          offset += s.val
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={0}
              transform={`rotate(${rotation} ${cx} ${cy})`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          )
        })}
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1a1a2e">{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7" fill="#aaa">tasks</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
            <span style={{ fontSize: 11, color: '#555' }}>{s.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#1a1a2e', marginLeft: 'auto' }}>{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'resolved'>('all')

  const filtered = activeTab === 'all' ? TICKETS
    : activeTab === 'open' ? TICKETS.filter(t => t.status !== 'Resolved')
    : TICKETS.filter(t => t.status === 'Resolved')

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: 'white', fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .tab-btn {
          padding: 6px 14px; border-radius: 8px; border: none;
          font-size: 12px; cursor: pointer;
          transition: background 0.15s, color 0.15s;
          font-family: 'Poppins', sans-serif;
        }
        .tab-btn.active { background: #800000; color: white; font-weight: 600; }
        .tab-btn:not(.active) { background: transparent; color: #999; }
        .tab-btn:not(.active):hover { background: #f5eeee; color: #800000; }

        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .charts-container { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .chart-box { background: #fff; border-radius: 14px; padding: 20px 22px; border: 1.5px solid #ede8e8; flex: 1; minWidth: 300px; }
        
        .table-wrapper { background: #fff; border-radius: 14px; border: 1.5px solid #ede8e8; overflow-x: auto; }
        .table-content { min-width: 800px; }

        .ticket-row { border-bottom: 1px solid #f5f0f0; transition: background 0.12s; display: grid; grid-template-columns: 120px 1fr 160px 100px 120px 80px; padding: 14px 22px; align-items: center; }
        .ticket-row:hover { background: #fdf8f8; }
        .ticket-header { display: grid; grid-template-columns: 120px 1fr 160px 100px 120px 80px; padding: 12px 22px; border-bottom: 1px solid #f5f0f0; background: #fafafa; }
        
        .badge { display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; }

        @media (max-width: 768px) {
          .header-flex { flex-direction: column; gap: 16px; align-items: flex-start !important; }
        }
      `}</style>

      <div className="header-flex" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 300, color: '#1a1a2e', marginBottom: 2 }}>Service Metrics</h1>
          <p style={{ fontSize: 12, color: '#aaa', fontWeight: 300 }}>Monitoring system performance and support requests.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#fff', border: '1px solid #ede8e8', borderRadius: 9, padding: '7px 14px', fontSize: 12, color: '#555', cursor: 'pointer' }}>Export Report</div>
          <button style={{ background: '#800000', color: 'white', border: 'none', borderRadius: 9, padding: '8px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Generate Ticket</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <StatCard label="ACTIVE USERS" value="12.4k" sub="active today" trend="↑ 5.2%" color="#15803d" />
        <StatCard label="PENDING ISSUES" value="18" sub="requires action" trend="↓ 2.1%" color="#15803d" />
        <StatCard label="UPTIME RATE" value="99.9%" sub="last 7 days" trend="— 0%" color="#15803d" />
        <StatCard label="MTTR" value="1.8h" sub="mean response" trend="↑ 14%" color="#cc0000" />
      </div>

      <div className="charts-container">
        <div className="chart-box" style={{ flex: 1.4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>System Activity</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
            {[45, 62, 55, 80, 72, 95, 88].map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', borderRadius: 4, height: `${(v / 100) * 60}px`, background: i === 5 ? '#800000' : '#f5d0d0' }} />
                <span style={{ fontSize: 9, color: '#ccc' }}>{['08:00','10:00','12:00','14:00','16:00','18:00','20:00'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-box">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>Request Status</div>
          <DonutChart slices={[{ val: 12, color: '#800000', label: 'Urgent' }, { val: 24, color: '#f59e0b', label: 'Processing' }, { val: 54, color: '#15803d', label: 'Completed' }]} />
        </div>

        <div className="chart-box">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>Service Health</div>
          {[{ label: 'Network Stability', val: 98, color: '#15803d' }, { label: 'Storage Capacity', val: 64, color: '#f59e0b' }].map(item => (
            <div key={item.label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#555' }}>{item.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: item.color }}>{item.val}%</span>
              </div>
              <div style={{ height: 5, background: '#f5f0f0', borderRadius: 10 }}>
                <div style={{ height: '100%', width: `${item.val}%`, background: item.color, borderRadius: 10 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: '1px solid #f5f0f0', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>Recent Service Logs</div>
          <div style={{ display: 'flex', gap: 4, background: '#f8f5f5', padding: 4, borderRadius: 10 }}>
            {(['all', 'open', 'resolved'] as const).map(t => (
              <button key={t} className={`tab-btn${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="table-content">
          <div className="ticket-header">
            {['Reference ID', 'Event Name', 'Organization', 'Priority', 'Status', 'Time'].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 600, color: '#bbb', letterSpacing: '0.04em' }}>{h.toUpperCase()}</div>
            ))}
          </div>
          {filtered.map(t => (
            <div key={t.id} className="ticket-row">
              <div style={{ fontSize: 12, fontWeight: 600, color: '#800000' }}>{t.id}</div>
              <div style={{ fontSize: 12, color: '#1a1a2e', paddingRight: 16 }}>{t.subject}</div>
              <div style={{ fontSize: 12, color: '#555' }}>{t.client}</div>
              <div><span className="badge" style={{ background: PRIORITY[t.priority].bg, color: PRIORITY[t.priority].color }}>{t.priority}</span></div>
              <div><span className="badge" style={{ background: STATUS[t.status].bg, color: STATUS[t.status].color }}>{t.status}</span></div>
              <div style={{ fontSize: 11, color: '#bbb' }}>{t.updated}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}