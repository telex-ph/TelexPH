'use client'

import React, { useState, useEffect } from 'react'
import { useDarkMode } from '../../layout'

interface ActivityLog {
  _id: string
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'LOGIN' | 'LOGOUT'
  module: 'CASESTUDY' | 'BLOGS' | 'ACCOUNT_SETTINGS' | 'AUTH'
  admin: string
  details: any
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  loggedInAt?: string
  loggedOutAt?: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface ActivityStats {
  totalLogs: number
  uniqueAdmins: number
  actionCounts: {
    created: number
    updated: number
    deleted: number
    login: number
    logout: number
  }
  moduleCounts: {
    casestudy: number
    blogs: number
    accountSettings: number
    auth: number
  }
}

export default function ActivityLogs() {
  // Use the dark mode context
  const { isdarkmode } = useDarkMode()
  
  const [activetab, setactivetab] = useState('All')
  const [searchquery, setsearchquery] = useState('')
  const [sortby, setsortby] = useState('Newest')
  const [filteredmodules, setfilteredmodules] = useState<string[]>([])
  const [selectedlog, setselectedlog] = useState<ActivityLog | null>(null)
  const [showdetailsmodal, setshowdetailsmodal] = useState(false)
  const [currentpage, setcurrentpage] = useState(1)
  const [pagesize, setpagesize] = useState(20)
  
  // Data states
  const [logs, setlogs] = useState<ActivityLog[]>([])
  const [pagination, setpagination] = useState<PaginationInfo | null>(null)
  const [stats, setstats] = useState<ActivityStats | null>(null)
  const [isloading, setisloading] = useState(false)
  const [error, seterror] = useState<string | null>(null)

  const availableModules = ['CASESTUDY', 'BLOGS', 'ACCOUNT_SETTINGS', 'AUTH']
  const actionTypes = ['All', 'CREATED', 'UPDATED', 'DELETED', 'LOGIN', 'LOGOUT']

  // Fetch activity logs from backend
  const fetchActivityLogs = async () => {
    try {
      setisloading(true)
      seterror(null)

      const params = new URLSearchParams()
      params.append('page', currentpage.toString())
      params.append('limit', pagesize.toString())
      params.append('order', sortby === 'Newest' ? 'desc' : 'asc')

      // Add action filter
      if (activetab !== 'All') {
        params.append('action', activetab)
      }

      // Add module filter - only send one module at a time or modify backend to handle array
      if (filteredmodules.length > 0) {
        params.append('module', filteredmodules[0])
      }

      // Add search filter (admin email)
      if (searchquery) {
        params.append('admin', searchquery)
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      console.log('Fetching from:', `${apiUrl}/activity-logs?${params.toString()}`)

      const response = await fetch(`${apiUrl}/activity-logs?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch activity logs (${response.status})`)
      }

      const data = await response.json()
      console.log('Fetched logs:', data)
      setlogs(data.logs || [])
      setpagination(data.pagination)
    } catch (err: any) {
      console.error('Error fetching activity logs:', err)
      seterror(err.message || 'Failed to fetch activity logs')
    } finally {
      setisloading(false)
    }
  }

  // Fetch activity statistics
  const fetchActivityStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      console.log('Fetching stats from:', `${apiUrl}/activity-logs/stats`)

      const response = await fetch(`${apiUrl}/activity-logs/stats`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('Stats response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch activity stats')
      }

      const data = await response.json()
      console.log('Fetched stats:', data)
      setstats(data)
    } catch (err: any) {
      console.error('Error fetching activity stats:', err)
      // Don't set error for stats as it's not critical
    }
  }

  // Fetch logs on mount and when filters change
  useEffect(() => {
    fetchActivityLogs()
  }, [currentpage, pagesize, sortby, activetab, filteredmodules])

  // Fetch stats on mount
  useEffect(() => {
    fetchActivityStats()
  }, [])

  // Mark all as read when component mounts
  useEffect(() => {
    markAllAsRead()
  }, [])

  const markAllAsRead = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      
      await fetch(`${apiUrl}/activity-logs/mark-as-read`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
    } catch (err) {
      console.error('Error marking logs as read:', err)
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentpage !== 1) {
        setcurrentpage(1)
      } else {
        fetchActivityLogs()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchquery])

  // Get timestamp from log based on action
  const getTimestamp = (log: ActivityLog): string => {
    switch (log.action) {
      case 'CREATED':
        return log.createdAt || ''
      case 'UPDATED':
        return log.updatedAt || ''
      case 'DELETED':
        return log.deletedAt || ''
      case 'LOGIN':
        return log.loggedInAt || ''
      case 'LOGOUT':
        return log.loggedOutAt || ''
      default:
        return log.createdAt || ''
    }
  }

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatAction = (action: string) => {
    return action.charAt(0) + action.slice(1).toLowerCase()
  }

  const formatModuleName = (module: string) => {
    const moduleMap: { [key: string]: string } = {
      'CASESTUDY': 'Case Study',
      'BLOGS': 'Blogs',
      'ACCOUNT_SETTINGS': 'Settings',
      'AUTH': 'Authentication'
    }
    return moduleMap[module] || module
  }

  const getActionDescription = (log: ActivityLog): string => {
    const action = log.action.toLowerCase()
    const module = formatModuleName(log.module).toLowerCase()
    
    switch (log.action) {
      case 'CREATED':
        return `Created a new ${module}`
      case 'UPDATED':
        return `Updated a ${module}`
      case 'DELETED':
        return `Deleted a ${module}`
      case 'LOGIN':
        return 'Logged into the system'
      case 'LOGOUT':
        return 'Logged out of the system'
      default:
        return `Performed ${action} on ${module}`
    }
  }

  const getContentTitle = (log: ActivityLog): string => {
    if (log.module === 'BLOGS' && log.details?.title) {
      return log.details.title
    }
    if (log.module === 'CASESTUDY' && log.details?.title) {
      return log.details.title
    }
    return 'N/A'
  }

  const getAdminName = (log: ActivityLog): string => {
    if (log.details?.adminName) {
      return log.details.adminName
    }
    return log.admin.split('@')[0] // Extract name from email
  }

  const getactionbadgecolor = (action: string) => {
    const colors: { [key: string]: string } = {
      'CREATED': 'bg-emerald-500',
      'UPDATED': 'bg-blue-500',
      'DELETED': 'bg-red-500',
      'LOGIN': 'bg-purple-500',
      'LOGOUT': 'bg-orange-500'
    }
    return colors[action] || 'bg-gray-500'
  }

  const getmodulebadgecolor = (module: string) => {
    const colors: { [key: string]: string } = {
      'CASESTUDY': 'bg-indigo-500',
      'BLOGS': 'bg-pink-500',
      'ACCOUNT_SETTINGS': 'bg-teal-500',
      'AUTH': 'bg-amber-500'
    }
    return colors[module] || 'bg-gray-500'
  }

  const togglemodulefilter = (module: string) => {
    setfilteredmodules(prev => 
      prev.includes(module) 
        ? prev.filter(m => m !== module)
        : [...prev, module]
    )
    setcurrentpage(1) // Reset to first page when filter changes
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isdarkmode ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'}`}>
      <div className={`rounded-[2.5rem] p-10 shadow-sm transition-all duration-500 ${isdarkmode ? 'bg-[#181818]' : 'bg-white'}`}>
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-4xl font-black mb-1 transition-colors ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>Activity Logs</h1>
              <p className={`text-sm font-medium transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                Track and monitor all administrative activities across the platform
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className={`p-6 rounded-2xl border transition-all duration-500 ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 transition-colors ${isdarkmode ? 'text-gray-400' : 'text-blue-600'}`}>Total Logs</p>
                    <p className={`text-3xl font-black transition-colors ${isdarkmode ? 'text-white' : 'text-blue-700'}`}>{stats.totalLogs}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isdarkmode ? 'bg-blue-500/20' : 'bg-blue-500'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isdarkmode ? '#3b82f6' : 'white'} strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border transition-all duration-500 ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 transition-colors ${isdarkmode ? 'text-gray-400' : 'text-purple-600'}`}>Unique Admins</p>
                    <p className={`text-3xl font-black transition-colors ${isdarkmode ? 'text-white' : 'text-purple-700'}`}>{stats.uniqueAdmins}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isdarkmode ? 'bg-purple-500/20' : 'bg-purple-500'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isdarkmode ? '#a855f7' : 'white'} strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border transition-all duration-500 ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 transition-colors ${isdarkmode ? 'text-gray-400' : 'text-emerald-600'}`}>Created Items</p>
                    <p className={`text-3xl font-black transition-colors ${isdarkmode ? 'text-white' : 'text-emerald-700'}`}>{stats.actionCounts.created}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isdarkmode ? 'bg-emerald-500/20' : 'bg-emerald-500'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isdarkmode ? '#10b981' : 'white'} strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border transition-all duration-500 ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 transition-colors ${isdarkmode ? 'text-gray-400' : 'text-rose-600'}`}>Deleted Items</p>
                    <p className={`text-3xl font-black transition-colors ${isdarkmode ? 'text-white' : 'text-rose-700'}`}>{stats.actionCounts.deleted}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isdarkmode ? 'bg-rose-500/20' : 'bg-rose-500'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isdarkmode ? '#f43f5e' : 'white'} strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters Section */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className={`flex-1 flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-500 ${isdarkmode ? 'bg-[#202020]' : 'bg-gray-50'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isdarkmode ? '#6b7280' : '#94a3b8'} strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
              <input
                type="text"
                placeholder="Search by admin email..."
                value={searchquery}
                onChange={(e) => setsearchquery(e.target.value)}
                className={`bg-transparent outline-none text-sm w-full border-none transition-colors ${isdarkmode ? 'text-gray-300 placeholder:text-gray-500' : 'text-gray-700 placeholder:text-gray-400'}`}
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortby}
              onChange={(e) => setsortby(e.target.value)}
              className={`px-5 py-3.5 rounded-2xl text-sm font-bold outline-none cursor-pointer transition-all duration-500 ${isdarkmode ? 'bg-[#202020] text-white border-white/5' : 'bg-gray-50 text-gray-700 border-gray-200'} border`}
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
            </select>

            {/* Page Size Dropdown */}
            <select
              value={pagesize}
              onChange={(e) => {
                setpagesize(Number(e.target.value))
                setcurrentpage(1)
              }}
              className={`px-5 py-3.5 rounded-2xl text-sm font-bold outline-none cursor-pointer transition-all duration-500 ${isdarkmode ? 'bg-[#202020] text-white border-white/5' : 'bg-gray-50 text-gray-700 border-gray-200'} border`}
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>

          {/* Action Type Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {actionTypes.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setactivetab(type)
                  setcurrentpage(1)
                }}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                  activetab === type
                    ? 'bg-[#800000] text-white shadow-lg'
                    : isdarkmode 
                      ? 'bg-[#202020] text-gray-400 hover:bg-white/5'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Module Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
              Filter by Module:
            </span>
            {availableModules.map((module) => (
              <button
                key={module}
                onClick={() => togglemodulefilter(module)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                  filteredmodules.includes(module)
                    ? `${getmodulebadgecolor(module)} text-white shadow-lg`
                    : isdarkmode
                      ? 'bg-[#202020] text-gray-400 hover:bg-white/5'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {formatModuleName(module)}
              </button>
            ))}
            {filteredmodules.length > 0 && (
              <button
                onClick={() => {
                  setfilteredmodules([])
                  setcurrentpage(1)
                }}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${isdarkmode ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isloading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000]"></div>
          </div>
        )}

        {/* Error State */}
        {error && !isloading && (
          <div className={`p-6 rounded-2xl text-center transition-all duration-500 ${isdarkmode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
            <p className={`font-bold transition-colors ${isdarkmode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
            <button
              onClick={fetchActivityLogs}
              className="mt-4 px-6 py-2 bg-[#800000] text-white rounded-xl text-sm font-bold hover:bg-[#600000] transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Activity Logs List */}
        {!isloading && !error && (
          <>
            {logs.length === 0 ? (
              <div className={`text-center py-20 transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                <svg className="mx-auto mb-4" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
                </svg>
                <p className="text-xl font-bold">No activity logs found</p>
                <p className="text-sm mt-2">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log._id}
                    onClick={() => {
                      setselectedlog(log)
                      setshowdetailsmodal(true)
                    }}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-lg ${isdarkmode ? 'bg-[#202020] border-white/5 hover:bg-[#252525] hover:border-white/10' : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-[9px] px-4 py-1.5 rounded-full font-bold text-white ${getactionbadgecolor(log.action)}`}>
                            {formatAction(log.action)}
                          </span>
                          <span className={`text-[9px] px-4 py-1.5 rounded-full font-bold text-white ${getmodulebadgecolor(log.module)}`}>
                            {formatModuleName(log.module)}
                          </span>
                        </div>

                        <h4 className={`text-base font-bold mb-1 transition-colors ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>
                          {getActionDescription(log)}
                          {(log.module === 'BLOGS' || log.module === 'CASESTUDY') && getContentTitle(log) !== 'N/A' && (
                            <span className={`font-normal transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}> - {getContentTitle(log)}</span>
                          )}
                        </h4>
                        
                        <div className={`flex items-center gap-4 text-xs mt-2 transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-400'}`}>
                          <span className={`flex items-center gap-1 font-mono text-[10px] px-2 py-1 rounded transition-all duration-500 ${isdarkmode ? 'bg-white/5' : 'bg-gray-50'}`}>
                            ID: {log._id}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                              <circle cx="12" cy="7" r="4"/>
                            </svg>
                            {log.admin}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            {formatTimestamp(getTimestamp(log))}
                          </span>
                        </div>
                      </div>

                      <button className={`p-2 transition-colors ${isdarkmode ? 'text-gray-400 hover:text-[#800000]' : 'text-gray-400 hover:text-[#800000]'}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className={`flex items-center justify-between mt-8 pt-8 border-t transition-all duration-500 ${isdarkmode ? 'border-white/5' : 'border-gray-100'}`}>
                <p className={`text-sm transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} logs
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setcurrentpage(prev => Math.max(1, prev - 1))}
                    disabled={currentpage === 1}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isdarkmode ? 'bg-[#202020] text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentpage <= 3) {
                        pageNum = i + 1
                      } else if (currentpage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i
                      } else {
                        pageNum = currentpage - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setcurrentpage(pageNum)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            currentpage === pageNum
                              ? 'bg-[#800000] text-white'
                              : isdarkmode
                                ? 'bg-[#202020] text-gray-300 hover:bg-white/10'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    onClick={() => setcurrentpage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={currentpage === pagination.totalPages}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isdarkmode ? 'bg-[#202020] text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal - ENHANCED */}
      {showdetailsmodal && selectedlog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto transition-all duration-500 ${isdarkmode ? 'bg-[#181818]' : 'bg-white'}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <h3 className={`text-3xl font-black mb-1 transition-colors ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>Activity Details</h3>
                <p className={`text-sm font-medium transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>Complete information about this activity log</p>
              </div>
              <button
                onClick={() => setshowdetailsmodal(false)}
                className={`p-2.5 rounded-full transition-colors ${isdarkmode ? 'text-gray-400 hover:text-gray-300 hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Badges */}
              <div className="flex gap-2.5">
                <span className={`text-xs px-5 py-2 rounded-full font-black text-white ${getactionbadgecolor(selectedlog.action)}`}>
                  {formatAction(selectedlog.action)}
                </span>
                <span className={`text-xs px-5 py-2 rounded-full font-black text-white ${getmodulebadgecolor(selectedlog.module)}`}>
                  {formatModuleName(selectedlog.module)}
                </span>
              </div>

              {/* Main Info Card */}
              <div className={`rounded-[1.5rem] p-8 border shadow-sm transition-all duration-500 ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'}`}>
                <div className="space-y-5">
                  {/* Title/Content */}
                  {(selectedlog.module === 'BLOGS' || selectedlog.module === 'CASESTUDY') && getContentTitle(selectedlog) !== 'N/A' && (
                    <div>
                      <label className={`text-[10px] font-black uppercase tracking-widest mb-2 block transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {selectedlog.module === 'BLOGS' ? 'Blog Title' : 'Case Study Title'}
                      </label>
                      <p className={`text-xl font-black leading-tight transition-colors ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>{getContentTitle(selectedlog)}</p>
                    </div>
                  )}

                  {/* Admin Name */}
                  <div>
                    <label className={`text-[10px] font-black uppercase tracking-widest mb-2 block transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>Performed By</label>
                    <p className={`text-xl font-black transition-colors ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>{getAdminName(selectedlog)}</p>
                    <p className={`text-sm font-medium mt-0.5 transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedlog.admin}</p>
                  </div>

                  {/* Timestamp */}
                  <div>
                    <label className={`text-[10px] font-black uppercase tracking-widest mb-2 block transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>Timestamp</label>
                    <p className={`text-lg font-black transition-colors ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(getTimestamp(selectedlog)).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-2xl p-5 border transition-all duration-500 ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-white border-gray-200'}`}>
                  <label className={`text-xs font-bold uppercase tracking-wider mb-2 block transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>Action Type</label>
                  <p className={`text-sm font-bold transition-colors ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>{getActionDescription(selectedlog)}</p>
                </div>

                <div className={`rounded-2xl p-5 border transition-all duration-500 ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-white border-gray-200'}`}>
                  <label className={`text-xs font-bold uppercase tracking-wider mb-2 block transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>Module</label>
                  <p className={`text-sm font-bold transition-colors ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>{formatModuleName(selectedlog.module)}</p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className={`flex justify-end gap-3 mt-8 pt-6 border-t transition-all duration-500 ${isdarkmode ? 'border-white/5' : 'border-gray-200'}`}>
              <button
                onClick={() => setshowdetailsmodal(false)}
                className="px-10 py-3.5 bg-[#800000] text-white rounded-[1.25rem] font-black text-sm hover:bg-[#600000] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}