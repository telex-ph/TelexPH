'use client'

import react, { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useDarkMode } from './layout'

// Type definitions for analytics data
interface DailyView {
  date: string
  count: number
}

interface CaseStudyAnalytics {
  resourceId: string
  dailyViews: DailyView[]
  viewCount: number
}

interface EngagementData {
  name: string
  views: number
  likes: number
}

interface CaseStudyStats {
  totalAllTime: number
  totalUnique: number
  daily: number
  weekly: number
  monthly: number
  yearly: number
}

type ResourceFilter = 'all' | 'blog' | 'casestudy';

export default function adminpage() {
  const { isdarkmode } = useDarkMode()
  const [selecteddate, setselecteddate] = useState('2026-01-28')
  const [engagementdata, setengagementdata] = useState<EngagementData[]>([
    { name: 'jan', views: 0, likes: 0 },
    { name: 'feb', views: 0, likes: 0 },
    { name: 'mar', views: 0, likes: 0 },
    { name: 'apr', views: 0, likes: 0 },
    { name: 'may', views: 0, likes: 0 },
    { name: 'jun', views: 0, likes: 0 },
    { name: 'jul', views: 0, likes: 0 },
  ])
  const [casestudystats, setcasestudystats] = useState<CaseStudyStats>({
    totalAllTime: 0,
    totalUnique: 0,
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  })
  const [loading, setloading] = useState(true)
  const [statsloading, setstatsloading] = useState(true)
  const [error, seterror] = useState<string | null>(null)
  const [resourceFilter, setResourceFilter] = useState<ResourceFilter>('all')

  // Theme tokens — mirrors the case studies palette
  const cardBg      = isdarkmode ? '#1a1a1a' : '#ffffff'
  const borderColor = isdarkmode ? 'rgba(255,255,255,0.08)' : '#e5e7eb'
  const textPrimary = isdarkmode ? '#f0f0f0' : '#1f2937'
  const textMuted   = isdarkmode ? '#6b7280' : '#9ca3af'
  const subtleBg    = isdarkmode ? 'rgba(255,255,255,0.03)' : '#f9fafb'
  const pageBg      = isdarkmode ? '#0d0d0d' : '#f5f5f5'
  const inputBg     = isdarkmode ? '#161616' : '#ffffff'

  const card: React.CSSProperties = {
    background: cardBg,
    border: `1px solid ${borderColor}`,
    borderRadius: 24,
    boxShadow: isdarkmode ? '0 1px 6px rgba(0,0,0,.4)' : '0 1px 6px rgba(0,0,0,.06)',
  }

  // Fetch case study summary stats
  useEffect(() => {
    const fetchCaseStudyStats = async () => {
      try {
        setstatsloading(true)
        seterror(null)
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || ''
        const response = await fetch('http://localhost:3000/api/dashboard/stats/casestudies-summary', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          credentials: 'include'
        })
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to fetch case study stats: ${response.status} - ${errorText}`)
        }
        const data = await response.json()
        setcasestudystats(data)
      } catch (error) {
        seterror(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setstatsloading(false)
      }
    }
    fetchCaseStudyStats()
  }, [])

  // Fetch engagement metrics from backend
  useEffect(() => {
    const fetchEngagementMetrics = async () => {
      try {
        setloading(true)
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || ''
        const response = await fetch(`http://localhost:3000/api/dashboard/engagement-metrics?resourceType=${resourceFilter}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          credentials: 'include'
        })
        if (!response.ok) throw new Error(`Failed to fetch engagement metrics: ${response.status}`)
        const data = await response.json()
        setengagementdata(data)
      } catch (error) {
        // Keep default data if fetch fails
      } finally {
        setloading(false)
      }
    }
    fetchEngagementMetrics()
  }, [resourceFilter])

  const stats = [
    {
      label: 'total views',
      value: casestudystats.totalAllTime.toLocaleString(),
      subValue: `${casestudystats.totalUnique.toLocaleString()} Unique`,
      accentColor: '#800000',
      accentBg: isdarkmode ? 'rgba(128,0,0,0.12)' : 'rgba(128,0,0,0.05)',
      accentBorder: isdarkmode ? 'rgba(128,0,0,0.3)' : 'rgba(128,0,0,0.15)',
    },
    {
      label: 'today',
      value: casestudystats.daily.toLocaleString(),
      accentColor: '#3b82f6',
      accentBg: isdarkmode ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.05)',
      accentBorder: isdarkmode ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.15)',
    },
    {
      label: 'this week',
      value: casestudystats.weekly.toLocaleString(),
      accentColor: '#059669',
      accentBg: isdarkmode ? 'rgba(5,150,105,0.12)' : 'rgba(5,150,105,0.05)',
      accentBorder: isdarkmode ? 'rgba(5,150,105,0.3)' : 'rgba(5,150,105,0.15)',
    },
    {
      label: 'this month',
      value: casestudystats.monthly.toLocaleString(),
      accentColor: '#f97316',
      accentBg: isdarkmode ? 'rgba(249,115,22,0.12)' : 'rgba(249,115,22,0.05)',
      accentBorder: isdarkmode ? 'rgba(249,115,22,0.3)' : 'rgba(249,115,22,0.15)',
    },
    {
      label: 'this year',
      value: casestudystats.yearly.toLocaleString(),
      accentColor: '#dc2626',
      accentBg: isdarkmode ? 'rgba(220,38,38,0.12)' : 'rgba(220,38,38,0.05)',
      accentBorder: isdarkmode ? 'rgba(220,38,38,0.3)' : 'rgba(220,38,38,0.15)',
    },
  ]

  const transactions = [
    { customer: 'john smith',  date: 'jan 25, 2026', amount: '$1,240', status: 'completed' },
    { customer: 'sarah jones', date: 'jan 24, 2026', amount: '$890',   status: 'pending'   },
    { customer: 'mike wilson', date: 'jan 23, 2026', amount: '$2,150', status: 'completed' },
    { customer: 'emma davis',  date: 'jan 22, 2026', amount: '$675',   status: 'completed' },
  ]

  return (
    <div
      style={{
        width: '100%',
        padding: 24,
        borderRadius: 48,
        border: `2px solid ${isdarkmode ? 'rgba(255,255,255,0.05)' : '#f3f4f6'}`,
        boxShadow: '0 1px 4px rgba(0,0,0,.04)',
        background: isdarkmode ? '#181818' : '#f9fafb',
        transition: 'background .5s, border-color .5s',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* ── Global font injection ────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { font-family: 'Poppins', sans-serif !important; box-sizing: border-box; }
        input[type="date"]:focus { border-color: #800000 !important; outline: none !important; box-shadow: none !important; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
        .pill-btn-filter:hover { opacity: .78; }
        .filter-btn-all:hover  { opacity: .78; }
      `}</style>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 28,
          paddingBottom: 22,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: textPrimary,
              margin: 0,
              lineHeight: 1.3,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Dashboard overview
          </h2>
          <p
            style={{
              fontSize: 12,
              color: textMuted,
              margin: '4px 0 0',
              fontWeight: 400,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Realtime case study analytics
          </p>
        </div>
        <div>
          <input
            type="date"
            value={selecteddate}
            onChange={(e) => setselecteddate(e.target.value)}
            style={{
              width: 192,
              padding: '8px 16px',
              borderRadius: 10,
              border: `1px solid ${borderColor}`,
              background: inputBg,
              color: isdarkmode ? '#d1d5db' : '#6b7280',
              fontSize: 11,
              fontWeight: 400,
              cursor: 'pointer',
              outline: 'none',
              fontFamily: "'Poppins', sans-serif",
            }}
          />
        </div>
      </div>

      {/* ── Stat tiles ──────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 12,
          marginBottom: 20,
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              padding: '18px 16px',
              borderRadius: 20,
              background: s.accentBg,
              border: `1px solid ${s.accentBorder}`,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <p
              style={{
                fontSize: 9,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: textMuted,
                margin: '0 0 10px',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: s.accentColor,
                margin: 0,
                lineHeight: 1,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {s.value}
            </p>
            {s.subValue && (
              <p
                style={{
                  fontSize: 10,
                  color: textMuted,
                  margin: '6px 0 0',
                  fontWeight: 400,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {s.subValue}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ── Middle row: Performance + Categories ────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Performance overview */}
        <div style={{ ...card, padding: '22px 22px' }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: textPrimary,
              margin: '0 0 18px',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Performance overview
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}
          >
            {[
              { label: 'revenue',    value: '$12,482', change: '+12.5% from Last Month', up: true  },
              { label: 'orders',     value: '1,248',   change: '+8.2% from Last Month',  up: true  },
              { label: 'avg. order', value: '$9.80',   change: '-3.1% from Last Month',  up: false },
              { label: 'customers',  value: '892',     change: '+15.3% from Last Month', up: true  },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px 14px',
                  borderRadius: 14,
                  background: subtleBg,
                  border: `1px solid ${borderColor}`,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: textMuted,
                    margin: '0 0 6px',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: textPrimary,
                    margin: '0 0 4px',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {item.value}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 400,
                    color: item.up ? '#059669' : '#dc2626',
                    margin: 0,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {item.change}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Categories */}
        <div
          style={{
            ...card,
            padding: '22px 22px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              width: '100%',
              fontSize: 13,
              fontWeight: 600,
              color: textPrimary,
              margin: '0 0 18px',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Popular Categories
          </p>
          <div style={{ position: 'relative', width: 160, height: 160, marginBottom: 20 }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="16" fill="none" stroke={isdarkmode ? '#2a2a2a' : '#f3f4f6'} strokeWidth="4" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#800000" strokeWidth="4" strokeDasharray="75, 100" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="15, 100" strokeDashoffset="-75" />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: textPrimary,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                82%
              </span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: textMuted,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Growth
              </span>
            </div>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Appliances',  pct: '75%', color: '#800000' },
              { label: 'Accessories', pct: '15%', color: '#f97316' },
            ].map((cat, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: cat.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: isdarkmode ? '#9ca3af' : '#6b7280',
                      fontWeight: 400,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {cat.label}
                  </span>
                </div>
                <span
                  style={{
                    fontWeight: 600,
                    color: textPrimary,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {cat.pct}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Engagement Metrics chart ─────────────────────────────────────── */}
      <div style={{ ...card, padding: '22px 22px', marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 22,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: textPrimary,
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Engagement Metrics
            </p>
            <p
              style={{
                fontSize: 10,
                color: textMuted,
                margin: '3px 0 0',
                fontWeight: 400,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {resourceFilter === 'all'       && 'Views and Likes from Blogs & Case Studies'}
              {resourceFilter === 'blog'      && 'Views and Likes from Blogs Only'}
              {resourceFilter === 'casestudy' && 'Views and Likes from Case Studies Only'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            {/* Resource type filter — pill buttons */}
            <div
              style={{
                display: 'flex',
                gap: 6,
                padding: 6,
                borderRadius: 12,
                background: subtleBg,
                border: `1px solid ${borderColor}`,
              }}
            >
              {(['all', 'blog', 'casestudy'] as ResourceFilter[]).map((f) => (
                <button
                  key={f}
                  className="pill-btn-filter"
                  onClick={() => setResourceFilter(f)}
                  style={{
                    padding: '4px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: resourceFilter === f ? '#800000' : 'transparent',
                    color: resourceFilter === f ? '#fff' : textMuted,
                    fontSize: 10,
                    fontWeight: resourceFilter === f ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all .15s',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {f === 'all' ? 'All' : f === 'blog' ? 'Blogs' : 'Case Studies'}
                </button>
              ))}
            </div>

            {/* Legend */}
            {[
              { color: '#800000', label: 'views' },
              { color: '#6b7280', label: 'likes' },
            ].map((l) => (
              <div
                key={l.label}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: l.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    color: textMuted,
                    fontWeight: 400,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {l.label}
                </span>
              </div>
            ))}

            {loading && (
              <span
                style={{
                  fontSize: 10,
                  fontStyle: 'italic',
                  color: textMuted,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                loading data...
              </span>
            )}
          </div>
        </div>

        <div style={{ height: 280, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={engagementdata}>
              <defs>
                <linearGradient id="colorviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#800000" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#800000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isdarkmode ? '#2a2a2a' : '#f3f4f6'}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: textMuted,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400,
                }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: textMuted,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400,
                }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 14,
                  border: `1px solid ${borderColor}`,
                  boxShadow: '0 4px 16px rgba(0,0,0,.10)',
                  fontSize: 12,
                  fontFamily: "'Poppins', sans-serif",
                  backgroundColor: cardBg,
                  color: textPrimary,
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#800000"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorviews)"
              />
              <Area
                type="monotone"
                dataKey="likes"
                stroke="#6b7280"
                strokeWidth={2}
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom row: Transactions + Regional ─────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          paddingBottom: 8,
        }}
      >
        {/* Recent transactions */}
        <div style={{ ...card, padding: '22px 22px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 18,
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: textPrimary,
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Recent transactions
            </p>
            <button
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: '#800000',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              View all
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {transactions.map((t, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: `1px solid transparent`,
                  transition: 'background .15s, border-color .15s',
                  cursor: 'default',
                  fontFamily: "'Poppins', sans-serif",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.background = subtleBg
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = borderColor
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: isdarkmode ? 'rgba(255,255,255,0.08)' : '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#800000',
                      textTransform: 'uppercase',
                      flexShrink: 0,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {t.customer.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: isdarkmode ? '#d1d5db' : '#1f2937',
                        margin: 0,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {t.customer}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: textMuted,
                        margin: '2px 0 0',
                        fontWeight: 400,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {t.date}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: textPrimary,
                      margin: 0,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {t.amount}
                  </p>
                  <p
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: t.status === 'completed' ? '#059669' : '#f97316',
                      margin: '2px 0 0',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {t.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional performance */}
        <div style={{ ...card, padding: '22px 22px' }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: textPrimary,
              margin: '0 0 18px',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Regional performance
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { country: 'united states',  percentage: 85 },
              { country: 'united kingdom', percentage: 62 },
              { country: 'canada',         percentage: 45 },
              { country: 'australia',      percentage: 30 },
            ].map((reg, i) => (
              <div key={i} style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: isdarkmode ? '#9ca3af' : '#6b7280',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {reg.country}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: textPrimary,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {reg.percentage}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    width: '100%',
                    borderRadius: 99,
                    background: isdarkmode ? 'rgba(255,255,255,0.08)' : '#f3f4f6',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${reg.percentage}%`,
                      background: '#800000',
                      borderRadius: 99,
                      transition: 'width .4s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}