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

  // Fetch engagement metrics from backend
  useEffect(() => {
    const fetchEngagementMetrics = async () => {
      try {
        setloading(true)
        
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || ''
        
        console.log('🔍 Fetching engagement metrics...', { resourceFilter })
        
        // Fetch engagement metrics with filter
        const response = await fetch(`http://localhost:3000/api/dashboard/engagement-metrics?resourceType=${resourceFilter}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        console.log('📈 Engagement metrics response status:', response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Engagement metrics error response:', errorText)
          throw new Error(`Failed to fetch engagement metrics: ${response.status}`)
        }

        const data = await response.json()
        console.log('✅ Engagement metrics received:', data)
        
        setengagementdata(data)
        
      } catch (error) {
        console.error('❌ Error fetching engagement metrics:', error)
        // Keep default data if fetch fails
      } finally {
        setloading(false)
      }
    }

    fetchEngagementMetrics()
  }, [resourceFilter]) // Re-fetch when filter changes

  const stats = [
    { label: 'total views', value: casestudystats.totalAllTime.toLocaleString(), subValue: `${casestudystats.totalUnique.toLocaleString()} Unique`, color: isdarkmode ? 'bg-gradient-to-br from-purple-900/40 to-transparent' : 'bg-gradient-to-br from-purple-50 to-white', textColor: isdarkmode ? 'text-purple-300' : 'text-purple-800' },
    { label: 'today', value: casestudystats.daily.toLocaleString(), color: isdarkmode ? 'bg-gradient-to-br from-blue-900/40 to-transparent' : 'bg-gradient-to-br from-blue-50 to-white', textColor: isdarkmode ? 'text-blue-300' : 'text-blue-800' },
    { label: 'this week', value: casestudystats.weekly.toLocaleString(), color: isdarkmode ? 'bg-gradient-to-br from-green-900/40 to-transparent' : 'bg-gradient-to-br from-green-50 to-white', textColor: isdarkmode ? 'text-green-300' : 'text-green-800' },
    { label: 'this month', value: casestudystats.monthly.toLocaleString(), color: isdarkmode ? 'bg-gradient-to-br from-orange-900/40 to-transparent' : 'bg-gradient-to-br from-orange-50 to-white', textColor: isdarkmode ? 'text-orange-300' : 'text-orange-800' },
    { label: 'this year', value: casestudystats.yearly.toLocaleString(), color: isdarkmode ? 'bg-gradient-to-br from-red-900/40 to-transparent' : 'bg-gradient-to-br from-red-50 to-white', textColor: isdarkmode ? 'text-red-300' : 'text-red-800' },
  ]

  const transactions = [
    { customer: 'john smith', date: 'jan 25, 2026', amount: '$1,240', status: 'completed' },
    { customer: 'sarah jones', date: 'jan 24, 2026', amount: '$890', status: 'pending' },
    { customer: 'mike wilson', date: 'jan 23, 2026', amount: '$2,150', status: 'completed' },
    { customer: 'emma davis', date: 'jan 22, 2026', amount: '$675', status: 'completed' },
  ]

  return (
    <div className={`w-full p-6 rounded-[3rem] border-2 shadow-sm transition-colors duration-500 ${isdarkmode ? 'bg-[#181818] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className={`text-2xl bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>Dashboard overview</h2>
          <p className={`text-[11px] mt-1 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Realtime case study analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="date"
              value={selecteddate}
              onChange={(e) => setselecteddate(e.target.value)}
              className={`w-48 px-5 py-2.5 rounded-xl border text-[11px] shadow-sm cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#800000]/20 ${isdarkmode ? 'bg-[#202020] border-white/10 text-gray-300 hover:border-white/20' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'}`}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full mb-6">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-[2rem] shadow-sm border transition-all hover:shadow-md ${stat.color} ${isdarkmode ? 'border-white/5' : 'border-gray-50'}`}>
            <p className={`text-[9px] uppercase tracking-widest mb-3 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
            <p className={`text-3xl bold-text transition-colors ${stat.textColor}`}>{stat.value}</p>
            {stat.subValue && (
              <p className={`text-[10px] mt-2 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-500'}`}>{stat.subValue}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mb-6">
        <div className={`lg:col-span-2 p-8 rounded-[2.5rem] shadow-sm border transition-all ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-white border-gray-50'}`}>
          <h4 className={`mb-8 text-left bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>Performance overview</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-6 rounded-2xl border transition-all ${isdarkmode ? 'bg-[#181818] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
              <p className={`text-[9px] uppercase tracking-widest mb-2 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>revenue</p>
              <p className={`text-2xl bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>$12,482</p>
              <p className="text-[10px] text-green-500 mt-1">+12.5% from Last Month</p>
            </div>
            <div className={`p-6 rounded-2xl border transition-all ${isdarkmode ? 'bg-[#181818] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
              <p className={`text-[9px] uppercase tracking-widest mb-2 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>orders</p>
              <p className={`text-2xl bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>1,248</p>
              <p className="text-[10px] text-green-500 mt-1">+8.2% from Last Month</p>
            </div>
            <div className={`p-6 rounded-2xl border transition-all ${isdarkmode ? 'bg-[#181818] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
              <p className={`text-[9px] uppercase tracking-widest mb-2 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>avg. order</p>
              <p className={`text-2xl bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>$9.80</p>
              <p className="text-[10px] text-red-500 mt-1">-3.1% from Last month</p>
            </div>
            <div className={`p-6 rounded-2xl border transition-all ${isdarkmode ? 'bg-[#181818] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
              <p className={`text-[9px] uppercase tracking-widest mb-2 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>customers</p>
              <p className={`text-2xl bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>892</p>
              <p className="text-[10px] text-green-500 mt-1">+15.3% from Last Month</p>
            </div>
          </div>
        </div>

        <div className={`flex flex-col items-center p-8 rounded-[2.5rem] shadow-sm border transition-all ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-white border-gray-50'}`}>
          <h4 className={`w-full mb-8 text-left bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>Popular Categories</h4>
          <div className="relative w-48 h-48 mb-8">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" stroke={isdarkmode ? '#2a2a2a' : '#f3f4f6'} strokeWidth="4" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#800000" strokeWidth="4" strokeDasharray="75, 100" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#ff8c00" strokeWidth="4" strokeDasharray="15, 100" strokeDashoffset="-75" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>82%</span>
              <span className={`text-[9px] uppercase transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Growth</span>
            </div>
          </div>
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#800000]" />
                <span className={`transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>Appliances</span>
              </div>
              <span className={`bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>75%</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff8c00]" />
                <span className={`transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>Accessories</span>
              </div>
              <span className={`bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>15%</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`w-full p-8 rounded-[2.5rem] shadow-sm border mt-6 transition-all ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-white border-gray-50'}`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className={`bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>Engagement Metrics</h4>
            <p className={`text-[10px] transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
              {resourceFilter === 'all' && 'Views and Likes from Blogs & Case Studies'}
              {resourceFilter === 'blog' && 'Views and Likes from Blogs Only'}
              {resourceFilter === 'casestudy' && 'Views and Likes from Case Studies Only'}
            </p>
          </div>
          <div className="flex items-center gap-6">
            {/* Resource Type Filter */}
            <div className={`flex gap-2 p-1.5 rounded-xl text-[10px] transition-all ${isdarkmode ? 'bg-[#181818]' : 'bg-gray-50'}`}>
              <button
                onClick={() => setResourceFilter('all')}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  resourceFilter === 'all' 
                    ? 'bg-[#800000] text-white shadow-md' 
                    : isdarkmode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setResourceFilter('blog')}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  resourceFilter === 'blog' 
                    ? 'bg-[#800000] text-white shadow-md' 
                    : isdarkmode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Blogs
              </button>
              <button
                onClick={() => setResourceFilter('casestudy')}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  resourceFilter === 'casestudy' 
                    ? 'bg-[#800000] text-white shadow-md' 
                    : isdarkmode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Case Studies
              </button>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#800000]" />
              <span className={`text-[10px] transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#6b7280]" />
              <span className={`text-[10px] transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>likes</span>
            </div>
            {loading && (
              <span className={`text-[10px] italic transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>loading data...</span>
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isdarkmode ? '#2a2a2a' : '#f3f4f6'} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: isdarkmode ? '#6b7280' : '#9ca3af' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: isdarkmode ? '#6b7280' : '#9ca3af' }} 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '15px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', 
                  fontSize: '12px',
                  backgroundColor: isdarkmode ? '#202020' : '#ffffff',
                  color: isdarkmode ? '#e5e7eb' : '#1f2937'
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full pb-10 mt-6">
        <div className={`p-8 rounded-[2.5rem] shadow-sm border transition-all ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-white border-gray-50'}`}>
          <div className="flex justify-between items-center mb-8">
            <h4 className={`bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>Recent transactions</h4>
            <button className="text-[10px] text-[#800000] uppercase tracking-wider hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {transactions.map((t, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${isdarkmode ? 'hover:bg-white/5 border-transparent hover:border-white/10' : 'hover:bg-gray-50 border-transparent hover:border-gray-100'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] text-[#800000] uppercase ${isdarkmode ? 'bg-white/10' : 'bg-gray-100'}`}>
                    {t.customer.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className={`text-xs transition-colors ${isdarkmode ? 'text-gray-300' : 'text-gray-800'}`}>{t.customer}</p>
                    <p className={`text-[10px] transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>{t.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>{t.amount}</p>
                  <p className={`text-[9px] uppercase ${t.status === 'completed' ? 'text-green-500' : 'text-orange-500'}`}>{t.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-8 rounded-[2.5rem] shadow-sm border transition-all ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-white border-gray-50'}`}>
          <h4 className={`mb-8 bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>Regional performance</h4>
          <div className="space-y-6">
            {[
              { country: 'united states', percentage: 85, color: 'bg-[#800000]' },
              { country: 'united kingdom', percentage: 62, color: 'bg-[#800000]' },
              { country: 'canada', percentage: 45, color: 'bg-[#800000]' },
              { country: 'australia', percentage: 30, color: 'bg-[#800000]' },
            ].map((reg, i) => (
              <div key={i} className="space-y-2">
                <div className={`flex justify-between text-[10px] uppercase transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>{reg.country}</span>
                  <span>{reg.percentage}%</span>
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${isdarkmode ? 'bg-white/10' : 'bg-gray-50'}`}>
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