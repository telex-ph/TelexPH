'use client'

import React, { useState, useEffect } from 'react'
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

type ResourceFilter = 'all' | 'blog' | 'casestudy'

// ── Stat card image map (swap these URLs for your own hosted images) ──
const STAT_CARD_IMAGES = [
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80&fit=crop', // Total views  — analytics
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80&fit=crop', // Today       — office/morning
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80&fit=crop', // This week   — planning/desk
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80&fit=crop', // This month  — growth chart
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&q=80&fit=crop', // This year   — cityscape
]

// ── Solid accent colors per card ──
const STAT_CARD_COLORS = [
  '#1e6e4a', // Total views  — green
  '#8b0f0f', // Today        — deep red
  '#103f9e', // This week    — blue
  '#2d5a3d', // This month   — dark green
  '#1e3a5a', // This year    — navy
]

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

  // Fetch case study summary stats
  useEffect(() => {
    const fetchCaseStudyStats = async () => {
      try {
        setstatsloading(true)
        seterror(null)
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || ''
        const response = await fetch('http://localhost:3000/api/dashboard/stats/casestudies-summary', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          credentials: 'include',
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
        const response = await fetch(
          `http://localhost:3000/api/dashboard/engagement-metrics?resourceType=${resourceFilter}`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        )
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

  // Auto-dismiss errors
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => seterror(null), 5000)
      return () => clearTimeout(t)
    }
  }, [error])

  // ── Stat card definitions ──
  const stats = [
    {
      label: 'Total views',
      value: casestudystats.totalAllTime.toLocaleString(),
      subValue: `${casestudystats.totalUnique.toLocaleString()} unique visitors`,
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        </svg>
      ),
    },
    {
      label: 'Today',
      value: casestudystats.daily.toLocaleString(),
      subValue: 'Views in the last 24 hours',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      label: 'This week',
      value: casestudystats.weekly.toLocaleString(),
      subValue: 'Views in the last 7 days',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      label: 'This month',
      value: casestudystats.monthly.toLocaleString(),
      subValue: 'Views in the last 30 days',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
    },
    {
      label: 'This year',
      value: casestudystats.yearly.toLocaleString(),
      subValue: 'Views in the last 365 days',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      ),
    },
  ]

  const transactions = [
    { customer: 'john smith',  date: 'jan 25, 2026', amount: '$1,240', status: 'completed' },
    { customer: 'sarah jones', date: 'jan 24, 2026', amount: '$890',   status: 'pending'   },
    { customer: 'mike wilson', date: 'jan 23, 2026', amount: '$2,150', status: 'completed' },
    { customer: 'emma davis',  date: 'jan 22, 2026', amount: '$675',   status: 'completed' },
  ]

  const performanceItems = [
    { label: 'revenue',    value: '$12,482', change: '+12.5% from Last Month', up: true  },
    { label: 'orders',     value: '1,248',   change: '+8.2% from Last Month',  up: true  },
    { label: 'avg. order', value: '$9.80',   change: '-3.1% from Last Month',  up: false },
    { label: 'customers',  value: '892',     change: '+15.3% from Last Month', up: true  },
  ]

  const regions = [
    { country: 'united states',  percentage: 85 },
    { country: 'united kingdom', percentage: 62 },
    { country: 'canada',         percentage: 45 },
    { country: 'australia',      percentage: 30 },
  ]

  const cardMeta = [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
      gradientLight: 'linear-gradient(135deg, #e8f4fd 0%, #dbeafe 60%, #bfdbfe 100%)',
      accentColor: '#60a5fa',
      accentColorLight: '#1d4ed8',
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #1e1b4b 60%, #312e81 100%)',
      gradientLight: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 60%, #ddd6fe 100%)',
      accentColor: '#a78bfa',
      accentColorLight: '#6d28d9',
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #1c1917 60%, #292524 100%)',
      gradientLight: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 60%, #fed7aa 100%)',
      accentColor: '#fb923c',
      accentColorLight: '#c2410c',
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #14532d 60%, #166534 100%)',
      gradientLight: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)',
      accentColor: '#4ade80',
      accentColorLight: '#15803d',
    },
  ]

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }

        /* ─────────────────────────────────────────
           STAT CARD — gradient-over-image
        ───────────────────────────────────────── */
        .stat-img-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          /* height scales with viewport */
          height: 116px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: default;
        }
        @media (min-width: 480px)  { .stat-img-card { height: 126px; } }
        @media (min-width: 640px)  { .stat-img-card { height: 134px; } }
        @media (min-width: 1024px) { .stat-img-card { height: 144px; } }

        .stat-img-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.26);
        }
        .stat-img-card .card-photo {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.4s ease;
        }
        .stat-img-card:hover .card-photo { transform: scale(1.06); }
        .stat-img-card .card-overlay   { position: absolute; inset: 0; }
        .stat-img-card .card-body {
          position: relative;
          z-index: 3;
          padding: 11px 12px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        @media (min-width: 480px)  { .stat-img-card .card-body { padding: 12px 14px; } }
        @media (min-width: 640px)  { .stat-img-card .card-body { padding: 13px 15px; } }
        @media (min-width: 1024px) { .stat-img-card .card-body { padding: 14px 16px; } }

        .stat-img-card .card-label {
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.92);
        }
        @media (min-width: 480px)  { .stat-img-card .card-label { font-size: 8.5px; } }
        @media (min-width: 640px)  { .stat-img-card .card-label { font-size: 9px; } }
        @media (min-width: 1024px) { .stat-img-card .card-label { font-size: 9.5px; } }

        .stat-img-card .card-icon-btn {
          width: 25px; height: 25px;
          border-radius: 6px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        @media (min-width: 640px)  { .stat-img-card .card-icon-btn { width: 28px; height: 28px; border-radius: 7px; } }
        @media (min-width: 1024px) { .stat-img-card .card-icon-btn { width: 30px; height: 30px; } }

        .stat-img-card .card-value {
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 12px rgba(0,0,0,0.3);
        }
        @media (min-width: 480px)  { .stat-img-card .card-value { font-size: 32px; } }
        @media (min-width: 640px)  { .stat-img-card .card-value { font-size: 36px; } }
        @media (min-width: 1024px) { .stat-img-card .card-value { font-size: 42px; letter-spacing: -1.5px; } }

        .stat-img-card .card-hint {
          font-size: 8.5px;
          font-weight: 400;
          color: rgba(255,255,255,0.7);
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        @media (min-width: 480px)  { .stat-img-card .card-hint { font-size: 9px; } }
        @media (min-width: 640px)  { .stat-img-card .card-hint { font-size: 10px; } }

        .stat-img-card .card-hint-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.72);
          flex-shrink: 0;
          display: inline-block;
        }
        @media (min-width: 640px) { .stat-img-card .card-hint-dot { width: 5px; height: 5px; } }

        /* ─────────────────────────────────────────
           PERFORMANCE MINI-CARDS
        ───────────────────────────────────────── */
        .perf-mini-card {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          transition: all 0.3s;
          padding: 14px;
        }
        @media (min-width: 480px)  { .perf-mini-card { padding: 16px; border-radius: 14px; } }
        @media (min-width: 640px)  { .perf-mini-card { padding: 18px; } }
        @media (min-width: 1024px) { .perf-mini-card { padding: 20px; border-radius: 16px; } }
        .perf-mini-card:hover { box-shadow: 0 20px 40px rgba(0,0,0,0.15); transform: translateY(-2px); }

        .perf-mini-value {
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 8px;
          line-height: 1;
        }
        @media (min-width: 480px)  { .perf-mini-value { font-size: 22px; } }
        @media (min-width: 640px)  { .perf-mini-value { font-size: 24px; } }
        @media (min-width: 1024px) { .perf-mini-value { font-size: 26px; } }

        /* ─────────────────────────────────────────
           TABLE PADDING
        ───────────────────────────────────────── */
        .tbl-th { padding: 10px 14px; font-size: 9px; }
        .tbl-td { padding: 10px 14px; }
        @media (min-width: 480px)  { .tbl-th { padding: 11px 18px; font-size: 9.5px; } .tbl-td { padding: 11px 18px; } }
        @media (min-width: 640px)  { .tbl-th { padding: 12px 22px; font-size: 10px; }  .tbl-td { padding: 12px 22px; } }
        @media (min-width: 1024px) { .tbl-th { padding: 14px 32px; }                   .tbl-td { padding: 14px 32px; } }

        /* ─────────────────────────────────────────
           CARD PADDING
        ───────────────────────────────────────── */
        .card-inner { padding: 16px; }
        @media (min-width: 480px)  { .card-inner { padding: 20px; } }
        @media (min-width: 640px)  { .card-inner { padding: 24px; } }
        @media (min-width: 1024px) { .card-inner { padding: 32px; } }

        .card-hdr { padding: 14px 16px; }
        @media (min-width: 480px)  { .card-hdr { padding: 16px 20px; } }
        @media (min-width: 640px)  { .card-hdr { padding: 18px 24px; } }
        @media (min-width: 1024px) { .card-hdr { padding: 20px 32px; } }
      `}</style>

      <div
        className={`flex flex-col items-start justify-start space-y-5 sm:space-y-6 lg:space-y-8 min-h-screen transition-colors duration-500 ${
          isdarkmode ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'
        }`}
      >
        {/* ── Error Toast ── */}
        {error && (
          <div
            className="fixed top-4 right-3 sm:top-8 sm:right-8 bg-red-600 text-white px-5 py-3 sm:px-8 sm:py-5 rounded-lg shadow-2xl z-50 border-2 border-red-500/20"
            style={{ fontSize: 12, fontWeight: 500, maxWidth: 'calc(100vw - 24px)' }}
          >
            {error}
          </div>
        )}

        {/* ── Header ── */}
        <div className="w-full max-w-7xl mx-auto">
          <div
            className={`flex items-center justify-between pb-4 sm:pb-5 lg:pb-6 border-b transition-colors duration-500 ${
              isdarkmode ? 'border-white/5' : 'border-gray-200'
            }`}
          >
            <div>
              <h2
                className={`tracking-tight transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}
                style={{ fontSize: 15, fontWeight: 500, margin: 0 }}
              >
                Dashboard overview
              </h2>
              <p
                className={`mt-1 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}
                style={{ fontSize: 11, fontWeight: 400, margin: '4px 0 0' }}
              >
                Realtime case study analytics
              </p>
            </div>
            {/* Hide date picker on tiny phones to save space */}
            <input
              type="date"
              value={selecteddate}
              onChange={(e) => setselecteddate(e.target.value)}
              className={`hidden sm:block px-3 sm:px-5 py-2 sm:py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                isdarkmode
                  ? 'bg-[#202020] border-white/10 text-gray-300 focus:border-white/30'
                  : 'bg-white border-gray-200 text-gray-700 focus:border-gray-400'
              }`}
              style={{ fontSize: 11, fontWeight: 400 }}
            />
          </div>
        </div>

        {/* ── Stat Tiles ──
              < 480px  → 2 cols  (iPhone SE, Galaxy S8+)
              480–639  → 3 cols  (iPhone XR/12/14, Pixel 7, Galaxy A51/71, Surface Duo)
              640–1023 → 3 cols  (iPad Mini, iPad Air, Surface Pro 7, Nest Hub)
              1024+    → 5 cols  (iPad Pro, Asus Zenbook, Nest Hub Max)
        ── */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-2 min-[480px]:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 lg:gap-3">
          {stats.map((s, i) => {
            const hex = STAT_CARD_COLORS[i]
            const r = parseInt(hex.slice(1, 3), 16)
            const g = parseInt(hex.slice(3, 5), 16)
            const b = parseInt(hex.slice(5, 7), 16)

            return (
              <div key={i} className="stat-img-card">
                {/* Photo layer */}
                <div
                  className="card-photo"
                  style={{ backgroundImage: `url(${STAT_CARD_IMAGES[i]})` }}
                />

                {/* Gradient overlay: left solid → right transparent */}
                <div
                  className="card-overlay"
                  style={{
                    background: `linear-gradient(to right,
                      rgb(${r},${g},${b}) 0%,
                      rgb(${r},${g},${b}) 38%,
                      rgba(${r},${g},${b},0.82) 55%,
                      rgba(${r},${g},${b},0.45) 72%,
                      rgba(${r},${g},${b},0.12) 100%
                    )`,
                  }}
                />

                {/* Bottom vignette for readability */}
                <div
                  className="card-overlay"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 55%)',
                  }}
                />

                {/* Content */}
                <div className="card-body">
                  {/* Top row: label + icon */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <span className="card-label">{s.label}</span>
                    <div className="card-icon-btn">{s.icon}</div>
                  </div>

                  {/* Bottom: value + subtext */}
                  <div>
                    <div className="card-value">{s.value}</div>
                    <div className="card-hint">
                      <span className="card-hint-dot" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.subValue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Performance + Categories ── */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px] gap-3 sm:gap-4">

          {/* Performance Overview */}
          <div
            className={`card-inner rounded-xl border shadow-sm transition-all duration-500 ${
              isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'
            }`}
          >
            <div style={{ marginBottom: 20 }}>
              <p
                className={`transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}
                style={{ fontSize: 13, fontWeight: 600, margin: 0 }}
              >
                Performance overview
              </p>
              <p
                className={`mt-1 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}
                style={{ fontSize: 12, fontWeight: 400, margin: '4px 0 0' }}
              >
                Key business metrics compared to last month
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {performanceItems.map((item, idx) => {
                const meta = cardMeta[idx]
                return (
                  <div
                    key={idx}
                    className="perf-mini-card"
                    style={{
                      background: isdarkmode ? meta.gradient : meta.gradientLight,
                      border: isdarkmode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    {/* Glassy blob background accent */}
                    <div style={{
                      position: 'absolute',
                      top: -20, right: -20,
                      width: 80, height: 80,
                      borderRadius: '50%',
                      background: isdarkmode
                        ? `radial-gradient(circle, ${meta.accentColor}22 0%, transparent 70%)`
                        : `radial-gradient(circle, ${meta.accentColorLight}18 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    }} />

                    {/* Top row: label + icon */}
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <p style={{
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        margin: 0,
                        color: isdarkmode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
                      }}>
                        {item.label}
                      </p>
                      <div style={{
                        width: 28, height: 28,
                        borderRadius: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isdarkmode ? `${meta.accentColor}20` : `${meta.accentColorLight}18`,
                        color: isdarkmode ? meta.accentColor : meta.accentColorLight,
                        flexShrink: 0,
                      }}>
                        {meta.icon}
                      </div>
                    </div>

                    {/* Value */}
                    <p
                      className="perf-mini-value"
                      style={{ color: isdarkmode ? '#ffffff' : '#111827' }}
                    >
                      {item.value}
                    </p>

                    {/* Divider */}
                    <div style={{
                      height: 1,
                      background: isdarkmode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                      marginBottom: 10,
                    }} />

                    {/* Change badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 3,
                        fontSize: 10, fontWeight: 600,
                        padding: '2px 7px', borderRadius: 5,
                        background: item.up ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.15)',
                        color: item.up ? '#34d399' : '#f87171',
                      }}>
                        {item.up ? '↑' : '↓'} {item.change.split(' ')[0]}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 400,
                        color: isdarkmode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)',
                      }}>
                        vs last month
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Popular Categories */}
          <div
            className={`card-inner rounded-xl border shadow-sm transition-all duration-500 flex flex-col items-center ${
              isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'
            }`}
          >
            <div className="w-full" style={{ marginBottom: 20 }}>
              <p
                className={`transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}
                style={{ fontSize: 13, fontWeight: 600, margin: 0 }}
              >
                Popular Categories
              </p>
              <p
                className={`mt-1 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}
                style={{ fontSize: 11, fontWeight: 400, margin: '3px 0 0' }}
              >
                Top content categories by engagement
              </p>
            </div>

            {/* Donut */}
            <div style={{ position: 'relative', width: 'min(160px, 44vw)', height: 'min(160px, 44vw)', marginBottom: 22 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="16" fill="none" stroke={isdarkmode ? '#2a2a2a' : '#f3f4f6'} strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#800000" strokeWidth="4" strokeDasharray="75, 100" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="15, 100" strokeDashoffset="-75" />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span
                  className={`transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}
                  style={{ fontSize: 22, fontWeight: 700 }}
                >
                  82%
                </span>
                <span
                  className={`uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}
                  style={{ fontSize: 9, fontWeight: 500 }}
                >
                  Growth
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-4">
              {[
                { label: 'Appliances',  pct: '75%', color: '#800000' },
                { label: 'Accessories', pct: '15%', color: '#f97316' },
              ].map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                    <span
                      className={`transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}
                      style={{ fontSize: 11, fontWeight: 400 }}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <span
                    className={`transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}
                    style={{ fontSize: 11, fontWeight: 600 }}
                  >
                    {cat.pct}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Engagement Metrics Chart ── */}
        <div className="w-full max-w-7xl mx-auto">
          <div
            className={`card-inner rounded-xl border shadow-sm transition-all duration-500 ${
              isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'
            }`}
          >
            {/* Chart Header — stacks on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
              <div>
                <p
                  className={`transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}
                  style={{ fontSize: 13, fontWeight: 600, margin: 0 }}
                >
                  Engagement Metrics
                </p>
                <p
                  className={`mt-1 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}
                  style={{ fontSize: 10, fontWeight: 400, margin: '3px 0 0' }}
                >
                  {resourceFilter === 'all'       && 'Views and Likes from Blogs & Case Studies'}
                  {resourceFilter === 'blog'      && 'Views and Likes from Blogs Only'}
                  {resourceFilter === 'casestudy' && 'Views and Likes from Case Studies Only'}
                </p>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                {/* Resource filter pills */}
                <div
                  className={`flex gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-md border transition-all duration-500 ${
                    isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {(['all', 'blog', 'casestudy'] as ResourceFilter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setResourceFilter(f)}
                      className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg transition-all ${
                        resourceFilter === f
                          ? 'bg-[#800000] text-white shadow-md'
                          : isdarkmode
                          ? 'text-gray-400 hover:bg-white/5'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      style={{ fontSize: 10, fontWeight: resourceFilter === f ? 500 : 400, whiteSpace: 'nowrap' }}
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
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                    <span
                      className={`transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}
                      style={{ fontSize: 10, fontWeight: 400 }}
                    >
                      {l.label}
                    </span>
                  </div>
                ))}

                {loading && (
                  <span
                    className={`transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}
                    style={{ fontSize: 10, fontStyle: 'italic' }}
                  >
                    loading data...
                  </span>
                )}
              </div>
            </div>

            {/* Chart — height clamps gracefully */}
            <div style={{ height: 'clamp(180px, 35vw, 280px)', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementdata}>
                  <defs>
                    <linearGradient id="colorviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#800000" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#800000" stopOpacity={0}    />
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
                    tick={{ fontSize: 10, fill: isdarkmode ? '#6b7280' : '#9ca3af', fontWeight: 400 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: isdarkmode ? '#6b7280' : '#9ca3af', fontWeight: 400 }}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 14,
                      border: `1px solid ${isdarkmode ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`,
                      boxShadow: '0 4px 16px rgba(0,0,0,.10)',
                      fontSize: 12,
                      backgroundColor: isdarkmode ? '#1a1a1a' : '#ffffff',
                      color: isdarkmode ? '#f0f0f0' : '#1f2937',
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
        </div>

        {/* ── Bottom Row: Transactions + Regional ── */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 pb-6 sm:pb-8">

          {/* Recent Transactions */}
          <div
            className={`rounded-xl border shadow-sm transition-all duration-500 overflow-hidden ${
              isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'
            }`}
          >
            {/* Card Header */}
            <div
              className={`card-hdr flex items-center justify-between border-b transition-all duration-500 ${
                isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div>
                <p
                  className={`transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}
                  style={{ fontSize: 13, fontWeight: 600, margin: 0 }}
                >
                  Recent transactions
                </p>
                <p
                  className={`mt-1 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}
                  style={{ fontSize: 11, fontWeight: 400, margin: '3px 0 0' }}
                >
                  Latest customer orders and payments
                </p>
              </div>
              <button
                className="px-3 sm:px-4 py-1.5 rounded-lg bg-[#800000] text-white hover:bg-[#600000] transition-all shrink-0"
                style={{ fontSize: 10, fontWeight: 500 }}
              >
                View all
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 340 }}>
                <thead>
                  <tr className={`border-b transition-all duration-500 ${isdarkmode ? 'border-white/5' : 'border-gray-100'}`}>
                    {['Customer', 'Date', 'Amount', 'Status'].map((col) => (
                      <th
                        key={col}
                        className={`tbl-th text-left uppercase tracking-widest transition-colors ${
                          isdarkmode ? 'text-gray-500' : 'text-gray-400'
                        }`}
                        style={{ fontWeight: 500 }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y transition-all duration-500 ${isdarkmode ? 'divide-white/5' : 'divide-gray-100'}`}>
                  {transactions.map((t, i) => (
                    <tr
                      key={i}
                      className={`transition-all duration-300 ${
                        isdarkmode ? 'hover:bg-[#202020]' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="tbl-td">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isdarkmode ? 'bg-white/10' : 'bg-gray-100'
                            }`}
                            style={{ fontSize: 9, fontWeight: 600, color: '#800000', textTransform: 'uppercase' }}
                          >
                            {t.customer.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <p
                            className={`transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'} whitespace-nowrap`}
                            style={{ fontSize: 11, fontWeight: 500, margin: 0, textTransform: 'capitalize' }}
                          >
                            {t.customer}
                          </p>
                        </div>
                      </td>
                      <td className="tbl-td">
                        <p
                          className={`transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'} whitespace-nowrap`}
                          style={{ fontSize: 11, fontWeight: 400, margin: 0 }}
                        >
                          {t.date}
                        </p>
                      </td>
                      <td className="tbl-td">
                        <p
                          className={`transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}
                          style={{ fontSize: 12, fontWeight: 600, margin: 0 }}
                        >
                          {t.amount}
                        </p>
                      </td>
                      <td className="tbl-td">
                        <span
                          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
                            t.status === 'completed'
                              ? 'bg-[#00A651] text-white'
                              : 'bg-[#B45309] text-white'
                          }`}
                          style={{ fontSize: 10, fontWeight: 500 }}
                        >
                          {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regional Performance */}
          <div
            className={`rounded-xl border shadow-sm transition-all duration-500 overflow-hidden ${
              isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'
            }`}
          >
            {/* Card Header */}
            <div
              className={`card-hdr flex items-center justify-between border-b transition-all duration-500 ${
                isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div>
                <p
                  className={`transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}
                  style={{ fontSize: 13, fontWeight: 600, margin: 0 }}
                >
                  Regional performance
                </p>
                <p
                  className={`mt-1 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}
                  style={{ fontSize: 11, fontWeight: 400, margin: '3px 0 0' }}
                >
                  Traffic breakdown by country
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 280 }}>
                <thead>
                  <tr className={`border-b transition-all duration-500 ${isdarkmode ? 'border-white/5' : 'border-gray-100'}`}>
                    {['Country', 'Share', 'Progress'].map((col) => (
                      <th
                        key={col}
                        className={`tbl-th text-left uppercase tracking-widest transition-colors ${
                          isdarkmode ? 'text-gray-500' : 'text-gray-400'
                        }`}
                        style={{ fontWeight: 500 }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y transition-all duration-500 ${isdarkmode ? 'divide-white/5' : 'divide-gray-100'}`}>
                  {regions.map((reg, i) => (
                    <tr
                      key={i}
                      className={`transition-all duration-300 ${
                        isdarkmode ? 'hover:bg-[#202020]' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="tbl-td">
                        <p
                          className={`uppercase tracking-wide transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'} whitespace-nowrap`}
                          style={{ fontSize: 11, fontWeight: 500, margin: 0 }}
                        >
                          {reg.country}
                        </p>
                      </td>
                      <td className="tbl-td">
                        <p
                          className={`transition-colors ${isdarkmode ? 'text-gray-300' : 'text-gray-700'}`}
                          style={{ fontSize: 12, fontWeight: 600, margin: 0 }}
                        >
                          {reg.percentage}%
                        </p>
                      </td>
                      <td className="tbl-td" style={{ minWidth: 100 }}>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}