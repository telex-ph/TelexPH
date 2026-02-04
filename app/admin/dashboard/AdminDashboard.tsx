'use client'

import react, { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const engagementdata = [
  { name: 'jan', views: 4000, likes: 2400 },
  { name: 'feb', views: 3000, likes: 1398 },
  { name: 'mar', views: 2000, likes: 6800 },
  { name: 'apr', views: 2780, likes: 3908 },
  { name: 'may', views: 1890, likes: 4800 },
  { name: 'jun', views: 2390, likes: 3800 },
  { name: 'jul', views: 3490, likes: 4300 },
]

export default function adminpage() {
  const [selecteddate, setselecteddate] = useState('2026-01-28')

  const stats = [
    { label: 'total shipments', value: '18,250', color: 'bg-[#800000]', textColor: 'text-white' },
    { label: 'active shipments', value: '880', subValue: '14% of total', color: 'bg-white', textColor: 'text-gray-800' },
    { label: 'completed', value: '16,456', subValue: '81% of total', color: 'bg-white', textColor: 'text-gray-800' },
    { label: 'returned', value: '912', subValue: '5% of total', color: 'bg-white', textColor: 'text-gray-800' },
    { label: 'revenue', value: '$96', subValue: '14% of total', color: 'bg-white', textColor: 'text-gray-800' },
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
        </div>

        <div className="flex items-center gap-3">
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
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#800000] text-white rounded-2xl shadow-lg hover:bg-[#600000] transition-all transform hover:scale-[1.02] active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span className="text-[10px] bold-text uppercase tracking-wider">export analytics</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} p-6 rounded-[2rem] shadow-sm border border-gray-50 flex flex-col justify-between h-32 transition-all hover:shadow-md cursor-default`}>
            <p className={`text-[10px] tracking-wider ${stat.textColor} opacity-70 bold-text`}>{stat.label}</p>
            <div>
              <h3 className={`text-2xl ${stat.textColor} bold-text`}>{stat.value}</h3>
              {stat.subValue && <p className="text-[9px] text-gray-400">{stat.subValue}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
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

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col items-center justify-center">
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

      <div className="w-full bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="text-gray-800 bold-text">engagement metrics</h4>
            <p className="text-[10px] text-gray-400">visualizing blog views vs likes</p>
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
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
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

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
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