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
        const response = await fetch('https://telexph-admin.onrender.com/api/dashboard/stats/casestudies-summary', {
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
          `https://telexph-admin.onrender.com/api/dashboard/engagement-metrics?resourceType=${resourceFilter}`,
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

  const stats = [
    {
      label: 'Total views',
      value: casestudystats.totalAllTime.toLocaleString(),
      subValue: `${casestudystats.totalUnique.toLocaleString()} unique visitors`,
      iconType: 'bars',
      iconBg: 'transparent',
      dark: false,
    },
    {
      label: 'Today',
      value: casestudystats.daily.toLocaleString(),
      subValue: 'Views in the last 24 hours',
      iconType: 'users',
      iconBg: '#dde8e4',
      dark: false,
    },
    {
      label: 'This week',
      value: casestudystats.weekly.toLocaleString(),
      subValue: 'Views in the last 7 days',
      iconType: 'users',
      iconBg: '#dde8e4',
      dark: false,
    },
    {
      label: 'This month',
      value: casestudystats.monthly.toLocaleString(),
      subValue: 'Views in the last 30 days',
      iconType: 'bag',
      iconBg: '#f0e8d8',
      dark: false,
    },
    {
      label: 'This year',
      value: casestudystats.yearly.toLocaleString(),
      subValue: 'Views in the last 365 days',
      iconType: 'wave',
      iconBg: 'transparent',
      dark: true,
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

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <div
        className={`flex flex-col items-start justify-start p-8 space-y-8 min-h-screen transition-colors duration-500 ${
          isdarkmode ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'
        }`}
      >
        {/* Error Toast */}
        {error && (
          <div
            className="fixed top-8 right-8 bg-red-600 text-white px-8 py-5 rounded-lg shadow-2xl z-50 border-2 border-red-500/20"
            style={{ fontSize: 12, fontWeight: 500 }}
          >
            {error}
          </div>
        )}

        {/* ── Header ── */}
        <div className="w-full max-w-7xl mx-auto">
          <div
            className={`flex items-center justify-between pb-6 border-b transition-colors duration-500 ${
              isdarkmode ? 'border-white/5' : 'border-gray-200'
            }`}
          >
            <div>
              <h2
                className={`tracking-tight transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}
                style={{ fontSize: 18, fontWeight: 500, margin: 0 }}
              >
                Dashboard overview
              </h2>
              <p
                className={`mt-1 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}
                style={{ fontSize: 12, fontWeight: 400, margin: '4px 0 0' }}
              >
                Realtime case study analytics
              </p>
            </div>
            <input
              type="date"
              value={selecteddate}
              onChange={(e) => setselecteddate(e.target.value)}
              className={`px-5 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                isdarkmode
                  ? 'bg-[#202020] border-white/10 text-gray-300 focus:border-white/30'
                  : 'bg-white border-gray-200 text-gray-700 focus:border-gray-400'
              }`}
              style={{ fontSize: 12, fontWeight: 400 }}
            />
          </div>
        </div>

        {/* ── Stat Tiles ── */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`relative flex flex-col rounded-2xl transition-all duration-300 overflow-hidden ${
                s.dark
                  ? 'bg-[#3d5a47]'
                  : isdarkmode
                  ? 'bg-[#1a1a1a] border border-white/5'
                  : 'bg-white border border-gray-100'
              }`}
              style={{
                padding: '20px 20px 18px',
                minHeight: 130,
                boxShadow: s.dark ? 'none' : isdarkmode ? 'none' : '0 1px 8px rgba(0,0,0,0.07)',
              }}
            >
              {/* ROW 1: label left + icon right — same row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 400, margin: 0, color: s.dark ? 'rgba(255,255,255,0.65)' : isdarkmode ? '#9ca3af' : '#6b7280' }}>
                  {s.label}
                </p>

                {/* Icon top-right */}
                {s.iconType === 'bars' && (
                  <svg width="44" height="28" viewBox="0 0 44 28" fill="none">
                    <rect x="2"  y="14" width="6" height="12" rx="1.5" fill={isdarkmode ? '#4d7a5e' : '#5a8a6e'} opacity="0.5"/>
                    <rect x="11" y="8"  width="6" height="18" rx="1.5" fill={isdarkmode ? '#4d7a5e' : '#5a8a6e'} opacity="0.7"/>
                    <rect x="20" y="4"  width="6" height="22" rx="1.5" fill={isdarkmode ? '#3d5a47' : '#3d5a47'}/>
                    <rect x="29" y="10" width="6" height="16" rx="1.5" fill={isdarkmode ? '#4d7a5e' : '#5a8a6e'} opacity="0.7"/>
                    <rect x="38" y="16" width="6" height="10" rx="1.5" fill={isdarkmode ? '#4d7a5e' : '#5a8a6e'} opacity="0.45"/>
                  </svg>
                )}

                {s.iconType === 'users' && (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: isdarkmode ? 'rgba(180,210,195,0.18)' : '#dde8e4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isdarkmode ? '#8fbbaa' : '#5a8a6e'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                )}

                {s.iconType === 'bag' && (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: isdarkmode ? 'rgba(210,190,155,0.18)' : '#f0e8d8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isdarkmode ? '#c8a97a' : '#a07840'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                  </div>
                )}

                {s.iconType === 'wave' && (
                  <svg width="54" height="26" viewBox="0 0 54 26" fill="none">
                    <path
                      d="M2,16 C7,16 9,8 15,10 C21,12 24,6 30,8 C36,10 39,5 45,7 C48,8 50,10 52,10"
                      fill="none"
                      stroke="rgba(255,255,255,0.55)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              {/* ROW 2: big value */}
              <p style={{ fontSize: 34, fontWeight: 700, margin: '0 0 6px', lineHeight: 1, color: s.dark ? '#ffffff' : isdarkmode ? '#f9fafb' : '#111827' }}>
                {s.value}
              </p>

              {/* ROW 3: subtext */}
              {s.subValue && (
                <p style={{ fontSize: 11, fontWeight: 400, margin: 0, color: s.dark ? 'rgba(255,255,255,0.45)' : isdarkmode ? '#6b7280' : '#9ca3af' }}>
                  {s.subValue}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ── Performance + Categories ── */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          {/* Performance Overview */}
          <div
            className={`rounded-xl border shadow-sm transition-all duration-500 p-8 ${
              isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'
            }`}
          >
            <div style={{ marginBottom: 24 }}>
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
            {(() => {
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
                <div className="grid grid-cols-2 gap-3">
                  {performanceItems.map((item, idx) => {
                    const meta = cardMeta[idx]
                    return (
                      <div
                        key={idx}
                        className="relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                        style={{
                          background: isdarkmode ? meta.gradient : meta.gradientLight,
                          padding: '20px',
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
                        <div className="flex items-start justify-between mb-4">
                          <p
                            style={{
                              fontSize: 9,
                              fontWeight: 600,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              margin: 0,
                              color: isdarkmode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
                            }}
                          >
                            {item.label}
                          </p>
                          <div style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isdarkmode
                              ? `${meta.accentColor}20`
                              : `${meta.accentColorLight}18`,
                            color: isdarkmode ? meta.accentColor : meta.accentColorLight,
                            flexShrink: 0,
                          }}>
                            {meta.icon}
                          </div>
                        </div>

                        {/* Value */}
                        <p style={{
                          fontSize: 26,
                          fontWeight: 700,
                          margin: '0 0 8px',
                          lineHeight: 1,
                          color: isdarkmode ? '#ffffff' : '#111827',
                        }}>
                          {item.value}
                        </p>

                        {/* Divider */}
                        <div style={{
                          height: 1,
                          background: isdarkmode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                          marginBottom: 10,
                        }} />

                        {/* Change badge row */}
                        <div className="flex items-center gap-2">
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '2px 7px',
                            borderRadius: 5,
                            background: item.up ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.15)',
                            color: item.up ? '#34d399' : '#f87171',
                          }}>
                            {item.up ? '↑' : '↓'} {item.change.split(' ')[0]}
                          </span>
                          <span style={{
                            fontSize: 10,
                            fontWeight: 400,
                            color: isdarkmode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)',
                          }}>
                            vs last month
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>

          {/* Popular Categories */}
          <div
            className={`rounded-xl border shadow-sm transition-all duration-500 p-8 flex flex-col items-center ${
              isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'
            }`}
          >
            <div className="w-full" style={{ marginBottom: 24 }}>
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
            <div style={{ position: 'relative', width: 160, height: 160, marginBottom: 24 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  stroke={isdarkmode ? '#2a2a2a' : '#f3f4f6'}
                  strokeWidth="4"
                />
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  stroke="#800000" strokeWidth="4"
                  strokeDasharray="75, 100"
                />
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  stroke="#f97316" strokeWidth="4"
                  strokeDasharray="15, 100"
                  strokeDashoffset="-75"
                />
              </svg>
              <div
                style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
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
            className={`rounded-xl border shadow-sm transition-all duration-500 p-8 ${
              isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'
            }`}
          >
            {/* Chart Header */}
            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
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

              <div className="flex items-center gap-4 flex-wrap">
                {/* Resource filter pills */}
                <div
                  className={`flex gap-1.5 p-1.5 rounded-md border transition-all duration-500 ${
                    isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {(['all', 'blog', 'casestudy'] as ResourceFilter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setResourceFilter(f)}
                      className={`px-4 py-1.5 rounded-lg transition-all ${
                        resourceFilter === f
                          ? 'bg-[#800000] text-white shadow-md'
                          : isdarkmode
                          ? 'text-gray-400 hover:bg-white/5'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      style={{ fontSize: 11, fontWeight: resourceFilter === f ? 500 : 400 }}
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

            <div style={{ height: 280, width: '100%' }}>
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
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 pb-8">
          {/* Recent Transactions */}
          <div
            className={`rounded-xl border shadow-sm transition-all duration-500 overflow-hidden ${
              isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'
            }`}
          >
            {/* Card Header */}
            <div
              className={`flex items-center justify-between px-8 py-5 border-b transition-all duration-500 ${
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
                className="px-4 py-1.5 rounded-lg bg-[#800000] text-white hover:bg-[#600000] transition-all"
                style={{ fontSize: 10, fontWeight: 500 }}
              >
                View all
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b transition-all duration-500 ${isdarkmode ? 'border-white/5' : 'border-gray-100'}`}>
                    {['Customer', 'Date', 'Amount', 'Status'].map((col) => (
                      <th
                        key={col}
                        className={`px-8 py-4 text-left uppercase tracking-widest transition-colors ${
                          isdarkmode ? 'text-gray-500' : 'text-gray-400'
                        }`}
                        style={{ fontSize: 10, fontWeight: 500 }}
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
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isdarkmode ? 'bg-white/10' : 'bg-gray-100'
                            }`}
                            style={{ fontSize: 9, fontWeight: 600, color: '#800000', textTransform: 'uppercase' }}
                          >
                            {t.customer.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <p
                            className={`transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}
                            style={{ fontSize: 12, fontWeight: 500, margin: 0, textTransform: 'capitalize' }}
                          >
                            {t.customer}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <p
                          className={`transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}
                          style={{ fontSize: 11, fontWeight: 400, margin: 0 }}
                        >
                          {t.date}
                        </p>
                      </td>
                      <td className="px-8 py-4">
                        <p
                          className={`transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}
                          style={{ fontSize: 12, fontWeight: 600, margin: 0 }}
                        >
                          {t.amount}
                        </p>
                      </td>
                      <td className="px-8 py-4">
                        <span
                          className={`px-4 py-1.5 rounded-md ${
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
              className={`flex items-center justify-between px-8 py-5 border-b transition-all duration-500 ${
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
              <table className="w-full">
                <thead>
                  <tr className={`border-b transition-all duration-500 ${isdarkmode ? 'border-white/5' : 'border-gray-100'}`}>
                    {['Country', 'Share', 'Progress'].map((col) => (
                      <th
                        key={col}
                        className={`px-8 py-4 text-left uppercase tracking-widest transition-colors ${
                          isdarkmode ? 'text-gray-500' : 'text-gray-400'
                        }`}
                        style={{ fontSize: 10, fontWeight: 500 }}
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
                      <td className="px-8 py-5">
                        <p
                          className={`uppercase tracking-wide transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}
                          style={{ fontSize: 11, fontWeight: 500, margin: 0 }}
                        >
                          {reg.country}
                        </p>
                      </td>
                      <td className="px-8 py-5">
                        <p
                          className={`transition-colors ${isdarkmode ? 'text-gray-300' : 'text-gray-700'}`}
                          style={{ fontSize: 12, fontWeight: 600, margin: 0 }}
                        >
                          {reg.percentage}%
                        </p>
                      </td>
                      <td className="px-8 py-5" style={{ minWidth: 140 }}>
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