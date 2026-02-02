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

export default function adminpage() {
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

  // Fetch case study summary stats
  useEffect(() => {
    const fetchCaseStudyStats = async () => {
      try {
        setstatsloading(true)
        seterror(null)
        
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || ''
        
        console.log('🔍 Fetching case study stats...')
        console.log('Token available:', token ? 'Yes' : 'No')
        
        const response = await fetch('http://localhost:3000/api/dashboard/stats/casestudies-summary', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        console.log('📊 Response status:', response.status)
        console.log('📊 Response ok:', response.ok)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Error response:', errorText)
          throw new Error(`Failed to fetch case study stats: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        console.log('✅ Case study stats received:', data)
        setcasestudystats(data)
        
      } catch (error) {
        console.error('❌ Error fetching case study stats:', error)
        seterror(error instanceof Error ? error.message : 'Unknown error')
        // Keep default values instead of throwing
      } finally {
        setstatsloading(false)
      }
    }

    fetchCaseStudyStats()
  }, [])

  // Fetch analytics data from backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setloading(true)
        
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || ''
        
        console.log('🔍 Fetching analytics...')
        
        // Fetch all case study analytics
        const response = await fetch('http://localhost:3000/api/dashboard/analytics?resourceType=casestudy&limit=100', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        console.log('📈 Analytics response status:', response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Analytics error response:', errorText)
          throw new Error(`Failed to fetch analytics: ${response.status}`)
        }

        const data = await response.json()
        console.log('✅ Analytics data received:', data)
        
        // Process the data to aggregate by month
        const monthlyData = processAnalyticsData(data.data || [])
        setengagementdata(monthlyData)
        
      } catch (error) {
        console.error('❌ Error fetching analytics:', error)
        // Keep default data if fetch fails
      } finally {
        setloading(false)
      }
    }

    fetchAnalytics()
  }, [])

  // Process analytics data into monthly aggregates
  const processAnalyticsData = (analyticsArray: any[]): EngagementData[] => {
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    const currentYear = new Date().getFullYear()
    
    // Initialize monthly data
    const monthlyViews: { [key: string]: number } = {}
    monthNames.forEach(month => {
      monthlyViews[month] = 0
    })

    // Aggregate views by month
    analyticsArray.forEach((analytics: any) => {
      if (analytics.dailyViews && Array.isArray(analytics.dailyViews)) {
        analytics.dailyViews.forEach((dailyView: DailyView) => {
          const date = new Date(dailyView.date)
          const monthIndex = date.getMonth()
          const year = date.getFullYear()
          
          // Only count views from current year
          if (year === currentYear) {
            const monthName = monthNames[monthIndex]
            monthlyViews[monthName] += dailyView.count || 0
          }
        })
      }
    })

    // Convert to chart format (last 7 months)
    const currentMonth = new Date().getMonth()
    const result: EngagementData[] = []
    
    for (let i = 6; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      const monthName = monthNames[monthIndex]
      result.push({
        name: monthName,
        views: monthlyViews[monthName],
        likes: Math.floor(monthlyViews[monthName] * 0.6) // Simulate likes as 60% of views
      })
    }

    return result
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const stats = [
    { 
      label: 'total case study views', 
      value: statsloading ? '...' : formatNumber(casestudystats.totalAllTime), 
      subValue: statsloading ? '' : `${formatNumber(casestudystats.totalUnique)} unique views`,
      color: 'bg-[#800000]', 
      textColor: 'text-white' 
    },
    { 
      label: 'daily views', 
      value: statsloading ? '...' : casestudystats.daily.toString(), 
      subValue: 'today', 
      color: 'bg-transparent', 
      textColor: 'text-gray-800' 
    },
    { 
      label: 'weekly views', 
      value: statsloading ? '...' : formatNumber(casestudystats.weekly), 
      subValue: 'last 7 days', 
      color: 'bg-transparent', 
      textColor: 'text-gray-800' 
    },
    { 
      label: 'monthly views', 
      value: statsloading ? '...' : formatNumber(casestudystats.monthly), 
      subValue: 'last 30 days', 
      color: 'bg-transparent', 
      textColor: 'text-gray-800' 
    },
    { 
      label: 'yearly views', 
      value: statsloading ? '...' : formatNumber(casestudystats.yearly), 
      subValue: 'last 365 days', 
      color: 'bg-transparent', 
      textColor: 'text-gray-800' 
    },
  ]

  const transactions = [
    { id: '#8801', customer: 'marcus levy', date: 'jan 22, 2026', amount: '$420.00', status: 'completed' },
    { id: '#8802', customer: 'elena rose', date: 'jan 22, 2026', amount: '$150.50', status: 'pending' },
    { id: '#8803', customer: 'julian vance', date: 'jan 21, 2026', amount: '$890.00', status: 'completed' },
  ]

  return (
    <div className="flex flex-col items-start justify-start p-8 space-y-8 min-h-screen bg-transparent" style={{ fontFamily: "'poppins', sans-serif" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=poppins:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'poppins', sans-serif !important;
          text-transform: capitalize;
          font-weight: 400;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .bold-text {
          font-weight: 700 !important;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(0.5);
        }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
        <div className="space-y-2">
          <h2 className="text-xl leading-none tracking-tight text-gray-600">
            welcome back alex!
          </h2>
          <p className="text-[11px] tracking-wide italic text-gray-400">
            your analytics are looking great today — keep pushing for those targets!
          </p>
          {error && (
            <p className="text-[10px] text-red-500 italic">
              ⚠️ Error loading stats: {error}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* clickable date picker */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <label htmlFor="date-picker" className="text-[10px] text-gray-500 bold-text whitespace-nowrap">date range:</label>
            <input 
              id="date-picker"
              type="date" 
              value={selecteddate}
              onChange={(e) => setselecteddate(e.target.value)}
              className="text-[10px] text-gray-800 bg-transparent border-none outline-none uppercase cursor-pointer"
            />
          </div>
          
          {/* export button */}
          <button className="px-4 py-2 text-[10px] bg-[#800000] text-white rounded-2xl shadow-sm hover:bg-[#a00000] transition-all uppercase tracking-wider border-none cursor-pointer">
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2 transition-all hover:shadow-lg ${stat.color}`}
          >
            <p className={`text-[10px] uppercase tracking-wider ${stat.textColor === 'text-white' ? 'text-white/70' : 'text-gray-400'} bold-text`}>
              {stat.label}
            </p>
            <p className={`text-3xl tracking-tight ${stat.textColor} bold-text`}>
              {stat.value}
            </p>
            {stat.subValue && (
              <p className={`text-[10px] ${stat.textColor === 'text-white' ? 'text-white/60' : 'text-gray-400'}`}>
                {stat.subValue}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <div className="lg:col-span-2 bg-transparent p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-gray-800 bold-text">shipment overview</h4>
              <p className="text-[10px] text-gray-400">monthly delivery performance</p>
            </div>
            <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl text-[10px]">
              <span className="px-4 py-1.5 cursor-pointer">week</span>
              <span className="px-4 py-1.5 cursor-pointer">month</span>
              <span className="px-4 py-1.5 bg-[#800000] text-white rounded-lg shadow-md cursor-pointer transition-all">year</span>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-3 px-4">
            {[60, 40, 85, 50, 70, 90, 65, 80, 45, 75, 55, 95].map((height, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-full group">
                <div className="w-full bg-gray-50 rounded-full h-48 relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-[#800000] rounded-full transition-all duration-500 group-hover:bg-[#a00000]" 
                    style={{ height: `${height}%` }} 
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/40 rounded-full" />
                  </div>
                </div>
                <span className="text-[9px] text-gray-400 uppercase">{['j','f','m','a','m','j','j','a','s','o','n','d'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-transparent p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <h4 className="text-gray-800 w-full mb-8 text-left bold-text">popular categories</h4>
          <div className="relative w-48 h-48 mb-8">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f4f6" strokeWidth="4" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#800000" strokeWidth="4" strokeDasharray="75, 100" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#ff8c00" strokeWidth="4" strokeDasharray="15, 100" strokeDashoffset="-75" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl text-gray-800 bold-text">82%</span>
              <span className="text-[9px] text-gray-400 uppercase">growth</span>
            </div>
          </div>
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#800000]" />
                <span className="text-gray-500">appliances</span>
              </div>
              <span className="text-gray-800 bold-text">75%</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff8c00]" />
                <span className="text-gray-500">accessories</span>
              </div>
              <span className="text-gray-800 bold-text">15%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-transparent p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="text-gray-800 bold-text">engagement metrics</h4>
            <p className="text-[10px] text-gray-400">case study views from analytics</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#800000]" />
              <span className="text-[10px] text-gray-500">views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#6b7280]" />
              <span className="text-[10px] text-gray-500">likes</span>
            </div>
            {loading && (
              <span className="text-[10px] text-gray-400 italic">loading data...</span>
            )}
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={engagementdata}>
              <defs>
                <linearGradient id="colorviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#800000" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#800000" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#9ca3af' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#9ca3af' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full pb-10">
        <div className="bg-transparent p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-gray-800 bold-text">recent transactions</h4>
            <button className="text-[10px] text-[#800000] uppercase tracking-wider hover:underline">view all</button>
          </div>
          <div className="space-y-4">
            {transactions.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-[#800000] uppercase">
                    {t.customer.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs text-gray-800">{t.customer}</p>
                    <p className="text-[10px] text-gray-400">{t.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-800 bold-text">{t.amount}</p>
                  <p className={`text-[9px] uppercase ${t.status === 'completed' ? 'text-green-500' : 'text-orange-500'}`}>{t.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-transparent p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h4 className="text-gray-800 mb-8 bold-text">regional performance</h4>
          <div className="space-y-6">
            {[
              { country: 'united states', percentage: 85, color: 'bg-[#800000]' },
              { country: 'united kingdom', percentage: 62, color: 'bg-[#800000]' },
              { country: 'canada', percentage: 45, color: 'bg-[#800000]' },
              { country: 'australia', percentage: 30, color: 'bg-[#800000]' },
            ].map((reg, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase text-gray-500">
                  <span>{reg.country}</span>
                  <span>{reg.percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${reg.color} rounded-full`} 
                    style={{ width: `${reg.percentage}%` }}
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