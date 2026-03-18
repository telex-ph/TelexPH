'use client'
import { useState } from 'react'

const invoices = [
  { id: 'INV-001', va: 'Maria Santos',  role: 'Social Media Expert', period: 'Feb 2025', hours: 80,  rate: 8,  total: 640,  status: 'Paid' },
  { id: 'INV-002', va: 'Jose Reyes',    role: 'Executive Assistant',  period: 'Feb 2025', hours: 60,  rate: 7,  total: 420,  status: 'Paid' },
  { id: 'INV-003', va: 'Maria Santos',  role: 'Social Media Expert', period: 'Mar 2025', hours: 80,  rate: 8,  total: 640,  status: 'Unpaid' },
  { id: 'INV-004', va: 'Jose Reyes',    role: 'Executive Assistant',  period: 'Mar 2025', hours: 28,  rate: 7,  total: 196,  status: 'Unpaid' },
]

const statusStyle = { Paid: { bg: '#f0fdf4', color: '#16a34a' }, Unpaid: { bg: '#fef2f2', color: '#dc2626' } }

export default function VAbilling() {
  const [tab, setTab] = useState<'All' | 'Paid' | 'Unpaid'>('All')
  const filtered = tab === 'All' ? invoices : invoices.filter(i => i.status === tab)
  const totalUnpaid = invoices.filter(i => i.status === 'Unpaid').reduce((s, i) => s + i.total, 0)

  return (
    <div style={{ padding: 24, background: '#fdfcfc', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>VA Billing</h1>
        <p style={{ fontSize: 13, color: '#555', margin: '4px 0 0' }}>Track invoices and payments for your virtual assistants.</p>
      </div>

      {/* Summary card */}
      <div style={{ background: '#800000', borderRadius: 14, padding: '18px 24px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600, textTransform: 'uppercase' }}>Outstanding Balance</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>${totalUnpaid.toLocaleString()}</div>
        </div>
        <button style={{ padding: '10px 22px', borderRadius: 9, background: '#fff', border: 'none', color: '#800000', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          Pay All
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {(['All', 'Paid', 'Unpaid'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 18px', borderRadius: 20, border: '1.5px solid', borderColor: tab === t ? '#800000' : '#e0dcdc', background: tab === t ? '#800000' : '#fff', color: tab === t ? '#fff' : '#555', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1.5px solid #e0dcdc', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#faf8f8', borderBottom: '1px solid #f0eeee' }}>
              {['Invoice', 'VA', 'Period', 'Hours', 'Rate', 'Total', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#aaa', fontWeight: 600, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv, i) => (
              <tr key={inv.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f5f2f2' : 'none' }}>
                <td style={{ padding: '12px 14px', color: '#800000', fontWeight: 600 }}>{inv.id}</td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{inv.va}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>{inv.role}</div>
                </td>
                <td style={{ padding: '12px 14px', color: '#555' }}>{inv.period}</td>
                <td style={{ padding: '12px 14px', color: '#555' }}>{inv.hours}h</td>
                <td style={{ padding: '12px 14px', color: '#555' }}>${inv.rate}/h</td>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1a1a2e' }}>${inv.total}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: statusStyle[inv.status as keyof typeof statusStyle].bg, color: statusStyle[inv.status as keyof typeof statusStyle].color }}>
                    {inv.status}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  {inv.status === 'Unpaid' && (
                    <button style={{ padding: '5px 12px', borderRadius: 7, background: '#800000', border: 'none', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Pay</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}