'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDarkMode } from './layout'
import type {
  EngagementData,
  CaseStudyStats,
  QuickStats,
  ResourceFilter,
  TimeFilter,
  DateRange,
  IService,
} from './dashboard/dashboard.types'

import DashboardHeader        from './dashboard/DashboardHeader'
import StatTiles              from './dashboard/StatTiles'
import ActiveServicesCard     from './dashboard/ActiveServicesCard'
import PopularCategoriesCard  from './dashboard/PopularCategoriesCard'
import EngagementMetricsChart from './dashboard/EngagementMetricsChart'
import RecentTransactions     from './dashboard/RecentTransactions'
import RegionalPerformance    from './dashboard/RegionalPerformance'

const DEFAULT_ENGAGEMENT: EngagementData[] = [
  { name: 'jan', views: 0, likes: 0 },
  { name: 'feb', views: 0, likes: 0 },
  { name: 'mar', views: 0, likes: 0 },
  { name: 'apr', views: 0, likes: 0 },
  { name: 'may', views: 0, likes: 0 },
  { name: 'jun', views: 0, likes: 0 },
  { name: 'jul', views: 0, likes: 0 },
]

const DEFAULT_QUICK_STATS: QuickStats = {
  totalViews: 0,
  totalUniqueViews: 0,
  totalBlogs: 0,
  totalCaseStudies: 0,
  totalClients: 0,
  totalAppointments: 0,
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function toYMD(d: Date): string {
  return d.toISOString().split('T')[0]!
}

/** Returns the Monday of the week containing d. */
function getMondayOf(d: Date): Date {
  const copy = new Date(d)
  const dow  = copy.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  copy.setDate(copy.getDate() + diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

/**
 * Resolves the API startDate / endDate for the current filter combination.
 * Returns null when the fetch should be held (custom without both dates).
 */
function resolveDateRange(
  filter:            TimeFilter,
  dailyPickedDate:   string,
  weeklyPickedDate:  string,
  customDateRange:   DateRange,
): { startDate: string; endDate: string } | null {
  const now = new Date()

  switch (filter) {
    case 'daily': {
      const day = dailyPickedDate || toYMD(now)
      return { startDate: `${day}T00:00:00.000Z`, endDate: `${day}T23:59:59.999Z` }
    }

    case 'weekly': {
      const anchor  = weeklyPickedDate ? new Date(weeklyPickedDate + 'T00:00:00') : now
      const monday  = getMondayOf(anchor)
      const sunday  = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      sunday.setHours(23, 59, 59, 999)
      return {
        startDate: monday.toISOString(),
        endDate:   sunday.toISOString(),
      }
    }

    case 'monthly': {
      const start = new Date(now)
      start.setDate(now.getDate() - 30)
      start.setHours(0, 0, 0, 0)
      return { startDate: start.toISOString(), endDate: now.toISOString() }
    }

    case '6months': {
      const start = new Date(now)
      start.setMonth(now.getMonth() - 6)
      start.setHours(0, 0, 0, 0)
      return { startDate: start.toISOString(), endDate: now.toISOString() }
    }

    case 'custom': {
      if (!customDateRange.startDate || !customDateRange.endDate) return null
      return {
        startDate: `${customDateRange.startDate}T00:00:00.000Z`,
        endDate:   `${customDateRange.endDate}T23:59:59.999Z`,
      }
    }
  }
}

// ── Main component ────────────────────────────────────────────────────────────
export default function adminpage() {
  const { isdarkmode } = useDarkMode()

  // ── State ──────────────────────────────────────────────────────────────────
  const today = toYMD(new Date())

  const [selecteddate,      setselecteddate]      = useState('2026-01-28')
  const [resourceFilter,    setResourceFilter]    = useState<ResourceFilter>('all')
  const [timeFilter,        setTimeFilter]        = useState<TimeFilter>('monthly')
  const [dailyPickedDate,   setDailyPickedDate]   = useState<string>(today)
  const [weeklyPickedDate,  setWeeklyPickedDate]  = useState<string>(toYMD(getMondayOf(new Date())))
  const [customDateRange,   setCustomDateRange]   = useState<DateRange>({ startDate: '', endDate: '' })
  const [engagementdata,    setengagementdata]    = useState<EngagementData[]>(DEFAULT_ENGAGEMENT)
  const [engagementLoading, setEngagementLoading] = useState(false)
  const [casestudystats,    setcasestudystats]    = useState<CaseStudyStats>({
    totalAllTime: 0, totalUnique: 0, daily: 0, weekly: 0, monthly: 0, yearly: 0,
  })
  const [quickStats,        setQuickStats]        = useState<QuickStats>(DEFAULT_QUICK_STATS)
  const [quickStatsLoading, setQuickStatsLoading] = useState(true)
  const [activeServices,    setActiveServices]    = useState<IService[]>([])
  const [servicesLoading,   setServicesLoading]   = useState(true)
  const [statsloading,      setstatsloading]      = useState(true)
  const [error,             seterror]             = useState<string | null>(null)

  // ── Fetch: active services ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchActiveServices = async () => {
      try {
        setServicesLoading(true)
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || ''
        const res = await fetch('http://localhost:3000/api/services?isActive=true', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          credentials: 'include',
        })
        if (!res.ok) throw new Error(`Failed to fetch services: ${res.status}`)
        setActiveServices(await res.json())
      } catch (err) {
        console.error('Failed to fetch active services:', err)
      } finally {
        setServicesLoading(false)
      }
    }
    fetchActiveServices()
  }, [])

  // ── Fetch: case study summary stats ───────────────────────────────────────
  useEffect(() => {
    const fetchCaseStudyStats = async () => {
      try {
        setstatsloading(true)
        seterror(null)
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || ''
        const res = await fetch('http://localhost:3000/api/dashboard/stats/casestudies-summary', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          credentials: 'include',
        })
        if (!res.ok) {
          throw new Error(`Failed to fetch case study stats: ${res.status} - ${await res.text()}`)
        }
        setcasestudystats(await res.json())
      } catch (err) {
        seterror(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setstatsloading(false)
      }
    }
    fetchCaseStudyStats()
  }, [])

  // ── Fetch: quick stats (views, clients, appointments, content counts) ──────
  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        setQuickStatsLoading(true)
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || ''
        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        const opts = { headers, credentials: 'include' as RequestCredentials }

        const [dashRes, clientsRes, appointmentsRes] = await Promise.allSettled([
          fetch('http://localhost:3000/api/dashboard/stats', opts),
          fetch('http://localhost:3000/api/clients', opts),
          fetch('http://localhost:3000/api/appointments', opts),
        ])

        let totalViews       = 0
        let totalUniqueViews = 0
        let totalBlogs       = 0
        let totalCaseStudies = 0
        let totalClients     = 0
        let totalAppointments = 0

        if (dashRes.status === 'fulfilled' && dashRes.value.ok) {
          const data = await dashRes.value.json()
          totalViews       = data?.overview?.combined?.totalViews       ?? 0
          totalUniqueViews = data?.overview?.combined?.totalUniqueViews ?? 0
          totalBlogs       = data?.overview?.blogs?.total               ?? 0
          totalCaseStudies = data?.overview?.caseStudies?.total         ?? 0
        }

        if (clientsRes.status === 'fulfilled' && clientsRes.value.ok) {
          const data = await clientsRes.value.json()
          totalClients = Array.isArray(data) ? data.length : (data?.total ?? 0)
        }

        if (appointmentsRes.status === 'fulfilled' && appointmentsRes.value.ok) {
          const data = await appointmentsRes.value.json()
          totalAppointments = Array.isArray(data) ? data.length : (data?.total ?? 0)
        }

        setQuickStats({ totalViews, totalUniqueViews, totalBlogs, totalCaseStudies, totalClients, totalAppointments })
      } catch (err) {
        console.error('Failed to fetch quick stats:', err)
      } finally {
        setQuickStatsLoading(false)
      }
    }
    fetchQuickStats()
  }, [])

  // ── Fetch: engagement metrics ──────────────────────────────────────────────
  const fetchEngagementMetrics = useCallback(async () => {
    const range = resolveDateRange(timeFilter, dailyPickedDate, weeklyPickedDate, customDateRange)
    if (!range) return

    try {
      setEngagementLoading(true)
      const token = localStorage.getItem('authToken') || localStorage.getItem('token') || ''

      const params = new URLSearchParams({ resourceType: resourceFilter })
      params.set('startDate', range.startDate)
      params.set('endDate',   range.endDate)

      const res = await fetch(
        `http://localhost:3000/api/dashboard/engagement-metrics?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      )
      if (!res.ok) throw new Error(`Failed to fetch engagement metrics: ${res.status}`)
      setengagementdata(await res.json())
    } catch {
      // Keep current data if fetch fails
    } finally {
      setEngagementLoading(false)
    }
  }, [resourceFilter, timeFilter, dailyPickedDate, weeklyPickedDate, customDateRange])

  useEffect(() => {
    fetchEngagementMetrics()
  }, [fetchEngagementMetrics])

  // ── Theme ──────────────────────────────────────────────────────────────────
  const borderColor = isdarkmode ? 'rgba(255,255,255,0.05)' : '#f3f4f6'

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width:      '100%',
        padding:    24,
        borderRadius: 48,
        border:     `2px solid ${borderColor}`,
        boxShadow:  '0 1px 4px rgba(0,0,0,.04)',
        background: isdarkmode ? '#181818' : '#f9fafb',
        transition: 'background .5s, border-color .5s',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* ── Global styles ─────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { font-family: 'Poppins', sans-serif !important; box-sizing: border-box; }
        input[type="date"]:focus { border-color: #800000 !important; outline: none !important; box-shadow: none !important; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
        .pill-btn-filter:hover { opacity: .78; }
        .filter-btn-all:hover  { opacity: .78; }
      `}</style>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <DashboardHeader selecteddate={selecteddate} onDateChange={setselecteddate} />

      {/* ── Stat tiles ────────────────────────────────────────────────────── */}
      <StatTiles
        quickStats={quickStats}
        activeServicesCount={activeServices.length}
        quickStatsLoading={quickStatsLoading}
      />

      {/* ── Middle row: Active Services + Popular Categories ──────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, marginBottom: 20 }}>
        <ActiveServicesCard activeServices={activeServices} servicesLoading={servicesLoading} />
        <PopularCategoriesCard />
      </div>

      {/* ── Engagement Metrics chart ───────────────────────────────────────── */}
      <EngagementMetricsChart
        engagementdata={engagementdata}
        resourceFilter={resourceFilter}
        onResourceFilterChange={setResourceFilter}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        dailyPickedDate={dailyPickedDate}
        onDailyPickedDateChange={setDailyPickedDate}
        weeklyPickedDate={weeklyPickedDate}
        onWeeklyPickedDateChange={setWeeklyPickedDate}
        customDateRange={customDateRange}
        onCustomDateRangeChange={setCustomDateRange}
        isLoading={engagementLoading}
      />

      {/* ── Bottom row: Transactions + Regional ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingBottom: 8 }}>
        <RecentTransactions />
        <RegionalPerformance />
      </div>
    </div>
  )
}