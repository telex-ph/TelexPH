'use client'

import React, { useState, useEffect } from 'react'
import { useDarkMode } from '../../layout'

interface ActivityLog {
  _id: string
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'LOGIN' | 'LOGOUT'
  module: 'CASESTUDY' | 'BLOGS' | 'ACCOUNT_SETTINGS' | 'AUTH'
  admin: string
  firstName: string
  lastName: string
  description: string
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentpage, pagesize, sortby, activetab, filteredmodules])

  // Fetch stats on mount
  useEffect(() => {
    fetchActivityStats()
  }, [])

  // Auto-dismiss error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => seterror(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Format functions
  const formatAction = (action: string) => {
    return action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()
  }

  const formatModuleName = (module: string) => {
    switch (module) {
      case 'CASESTUDY': return 'Case Studies'
      case 'BLOGS': return 'Blogs'
      case 'ACCOUNT_SETTINGS': return 'Account Settings'
      case 'AUTH': return 'Authentication'
      default: return module
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case '1': return 'Super Admin'
      case '2': return 'Admin'
      case '3': return 'Editor'
      default: return 'Unknown'
    }
  }

  const getDepartmentName = (dept: string) => {
    switch (dept) {
      case '1': return 'IT'
      case '2': return 'Marketing'
      case '3': return 'Operations'
      default: return 'Unknown'
    }
  }

  const getActionDescription = (log: ActivityLog) => {
    const action = log.action
    const module = log.module

    if (action === 'LOGIN') return 'User logged into the system'
    if (action === 'LOGOUT') return 'User logged out of the system'
    
    if (module === 'ACCOUNT_SETTINGS') {
      if (action === 'CREATED') return 'New admin account created'
      if (action === 'UPDATED') {
        return log.details?.action === 'Password Changed' 
          ? 'Admin password changed' 
          : 'Admin account details updated'
      }
      if (action === 'DELETED') return 'Admin account deleted'
    }
    
    if (module === 'CASESTUDY') {
      if (action === 'CREATED') return 'New case study created'
      if (action === 'UPDATED') return 'Case study updated'
      if (action === 'DELETED') return 'Case study deleted'
    }
    
    if (module === 'BLOGS') {
      if (action === 'CREATED') return 'New blog post created'
      if (action === 'UPDATED') return 'Blog post updated'
      if (action === 'DELETED') return 'Blog post deleted'
    }
    
    return `${formatAction(action)} action performed`
  }

  const getContentTitle = (log: ActivityLog) => {
    if (log.module === 'CASESTUDY' || log.module === 'BLOGS') {
      return log.details?.title || 'N/A'
    }
    return 'N/A'
  }

  const getAdminName = (log: ActivityLog) => {
    // Use the firstName and lastName from the log (top-level fields)
    if (log.firstName && log.lastName) {
      return `${log.firstName} ${log.lastName}`
    }
    // Fallback to email if name is not available
    return log.admin
  }

  const getTimestamp = (log: ActivityLog) => {
    if (log.action === 'LOGIN' && log.loggedInAt) return log.loggedInAt
    if (log.action === 'LOGOUT' && log.loggedOutAt) return log.loggedOutAt
    if (log.action === 'CREATED' && log.createdAt) return log.createdAt
    if (log.action === 'UPDATED' && log.updatedAt) return log.updatedAt
    if (log.action === 'DELETED' && log.deletedAt) return log.deletedAt
    return log.createdAt || new Date().toISOString()
  }

  const getactionbadgecolor = (action: string) => {
    switch (action) {
      case 'CREATED': return 'bg-[#00A651] text-white'
      case 'UPDATED': return 'bg-[#0066CC] text-white'
      case 'DELETED': return 'bg-[#8B0000] text-white'
      case 'LOGIN': return 'bg-[#4B0082] text-white'
      case 'LOGOUT': return 'bg-[#996633] text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  const getmodulebadgecolor = (module: string) => {
    switch (module) {
      case 'CASESTUDY': return 'bg-[#505050] text-white'
      case 'BLOGS': return 'bg-[#8B0000] text-white'
      case 'ACCOUNT_SETTINGS': return 'bg-[#4B0082] text-white'
      case 'AUTH': return 'bg-[#505050] text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  const togglemodulefilter = (module: string) => {
    setfilteredmodules(prev => 
      prev.includes(module) 
        ? prev.filter(m => m !== module)
        : [module]
    )
  }

  const handlePreviousPage = () => {
    if (currentpage > 1) {
      setcurrentpage(prev => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination && currentpage < pagination.totalPages) {
      setcurrentpage(prev => prev + 1)
    }
  }

  return (
    <div 
      className={`flex flex-col items-start justify-start p-8 space-y-8 min-h-screen transition-colors duration-500 ${
        isdarkmode ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'
      }`}
    >
      {/* Error Message */}
      {error && (
        <div className="fixed top-8 right-8 bg-red-600 text-white px-8 py-5 rounded-[1.5rem] shadow-2xl z-50 text-[11px] bold-text animate-slide-in border-2 border-red-500/20">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="w-full max-w-7xl mx-auto space-y-2">
        <h2 className={`text-2xl bold-text tracking-tight transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
          Activity Logs
        </h2>
        <p className={`text-[11px] mt-1 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
          Monitor and track all system activities, admin actions, and user interactions in real-time.
        </p>
      </div>

      {/* Stats Cards - Dashboard Overview Style */}
      {stats && (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Logs - Purple Theme */}
          <div className={`p-6 rounded-[2rem] shadow-sm border transition-all hover:shadow-md ${
            isdarkmode 
              ? 'bg-gradient-to-br from-purple-900/40 to-transparent border-white/5' 
              : 'bg-gradient-to-br from-purple-50 to-white border-gray-50'
          }`}>
            <p className={`text-[9px] uppercase tracking-widest mb-3 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
              total logs
            </p>
            <p className={`text-3xl bold-text transition-colors ${isdarkmode ? 'text-purple-300' : 'text-purple-800'}`}>
              {stats.totalLogs.toLocaleString()}
            </p>
          </div>

          {/* Unique Admins - Blue Theme */}
          <div className={`p-6 rounded-[2rem] shadow-sm border transition-all hover:shadow-md ${
            isdarkmode 
              ? 'bg-gradient-to-br from-blue-900/40 to-transparent border-white/5' 
              : 'bg-gradient-to-br from-blue-50 to-white border-gray-50'
          }`}>
            <p className={`text-[9px] uppercase tracking-widest mb-3 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
              unique admins
            </p>
            <p className={`text-3xl bold-text transition-colors ${isdarkmode ? 'text-blue-300' : 'text-blue-800'}`}>
              {stats.uniqueAdmins}
            </p>
          </div>

          {/* Created - Green Theme */}
          <div className={`p-6 rounded-[2rem] shadow-sm border transition-all hover:shadow-md ${
            isdarkmode 
              ? 'bg-gradient-to-br from-green-900/40 to-transparent border-white/5' 
              : 'bg-gradient-to-br from-green-50 to-white border-gray-50'
          }`}>
            <p className={`text-[9px] uppercase tracking-widest mb-3 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
              created
            </p>
            <p className={`text-3xl bold-text transition-colors ${isdarkmode ? 'text-green-300' : 'text-green-800'}`}>
              {stats.actionCounts.created}
            </p>
          </div>

          {/* Updated - Orange Theme */}
          <div className={`p-6 rounded-[2rem] shadow-sm border transition-all hover:shadow-md ${
            isdarkmode 
              ? 'bg-gradient-to-br from-orange-900/40 to-transparent border-white/5' 
              : 'bg-gradient-to-br from-orange-50 to-white border-gray-50'
          }`}>
            <p className={`text-[9px] uppercase tracking-widest mb-3 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
              updated
            </p>
            <p className={`text-3xl bold-text transition-colors ${isdarkmode ? 'text-orange-300' : 'text-orange-800'}`}>
              {stats.actionCounts.updated}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="w-full max-w-7xl mx-auto">
        <div className={`rounded-[1.5rem] p-6 border transition-all duration-500 ${
          isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'
        }`}>
          <div className="space-y-6">
            {/* Search and Sort */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[300px]">
                <input
                  type="text"
                  placeholder="Search by admin email..."
                  value={searchquery}
                  onChange={(e) => setsearchquery(e.target.value)}
                  className={`w-full px-5 py-3 rounded-[1rem] border-2 transition-all duration-300 text-[11px] ${
                    isdarkmode
                      ? 'bg-[#202020] border-white/10 text-gray-300 placeholder-gray-500 focus:border-white/30'
                      : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-gray-400'
                  } focus:outline-none`}
                />
              </div>
              <select
                value={sortby}
                onChange={(e) => setsortby(e.target.value)}
                className={`px-5 py-3 rounded-[1rem] border-2 transition-all duration-300 text-[11px] bold-text ${
                  isdarkmode
                    ? 'bg-[#202020] border-white/10 text-gray-300 focus:border-white/30'
                    : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-gray-400'
                } focus:outline-none cursor-pointer`}
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
              </select>
            </div>

            {/* Action Tabs */}
            <div>
              <p className={`text-[9px] uppercase tracking-widest mb-3 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                Filter by Action
              </p>
              <div className="flex flex-wrap gap-2">
                {actionTypes.map((action) => (
                  <button
                    key={action}
                    onClick={() => setactivetab(action)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] transition-all ${
                      activetab === action
                        ? 'bg-[#800000] text-white shadow-md'
                        : isdarkmode
                        ? 'text-gray-400 hover:bg-white/5'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Module Filters */}
            <div>
              <p className={`text-[9px] uppercase tracking-widest mb-3 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                Filter by Module
              </p>
              <div className="flex flex-wrap gap-2">
                {availableModules.map((module) => (
                  <button
                    key={module}
                    onClick={() => togglemodulefilter(module)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] transition-all ${
                      filteredmodules.includes(module)
                        ? 'bg-[#800000] text-white shadow-md'
                        : isdarkmode
                        ? 'text-gray-400 hover:bg-white/5'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {formatModuleName(module)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="w-full max-w-7xl mx-auto">
        <div className={`rounded-[2rem] border overflow-hidden shadow-xl transition-all duration-500 ${
          isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'
        }`}>
          {/* Loading State */}
          {isloading && (
            <div className="p-20 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-900 border-t-transparent"></div>
              <p className={`mt-6 text-[11px] transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading activity logs...
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isloading && logs.length === 0 && (
            <div className="p-20 text-center">
              <svg className={`mx-auto h-20 w-20 mb-6 transition-colors ${isdarkmode ? 'text-gray-700' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className={`text-[11px] bold-text mb-2 transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                No activity logs found
              </p>
              <p className={`text-[10px] transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                Try adjusting your filters or search query
              </p>
            </div>
          )}

          {/* Table */}
          {!isloading && logs.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b transition-all duration-500 ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                    <tr>
                      <th className={`px-8 py-5 text-left text-[9px] uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Action
                      </th>
                      <th className={`px-8 py-5 text-left text-[9px] uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Module
                      </th>
                      <th className={`px-8 py-5 text-left text-[9px] uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Admin
                      </th>
                      <th className={`px-8 py-5 text-left text-[9px] uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Timestamp
                      </th>
                      <th className={`px-8 py-5 text-right text-[9px] uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {logs.map((log) => (
                      <tr 
                        key={log._id}
                        className={`transition-all duration-300 ${
                          isdarkmode ? 'hover:bg-[#202020]' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-8 py-5">
                          <span className={`text-[10px] px-5 py-2 rounded-full bold-text ${getactionbadgecolor(log.action)}`}>
                            {formatAction(log.action)}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`text-[10px] px-5 py-2 rounded-full bold-text ${getmodulebadgecolor(log.module)}`}>
                            {formatModuleName(log.module)}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div>
                            <p className={`text-xs bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
                              {getAdminName(log)}
                            </p>
                            <p className={`text-[10px] mt-0.5 transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {log.admin}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <p className={`text-xs bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
                            {new Date(getTimestamp(log)).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className={`text-[10px] mt-0.5 transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(getTimestamp(log)).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => {
                              setselectedlog(log)
                              setshowdetailsmodal(true)
                            }}
                            className={`px-5 py-2.5 rounded-[1rem] text-[10px] bold-text transition-all hover:shadow-lg ${
                              isdarkmode
                                ? 'bg-white/10 text-white hover:bg-white/20'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && (
                <div className={`px-8 py-6 flex items-center justify-between border-t transition-all duration-500 ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-4">
                    <p className={`text-[10px] transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePreviousPage}
                      disabled={pagination.page === 1}
                      className={`px-5 py-2.5 rounded-[1rem] text-[10px] bold-text transition-all ${
                        pagination.page === 1
                          ? 'opacity-40 cursor-not-allowed'
                          : isdarkmode
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Previous
                    </button>
                    <span className={`text-[10px] bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={pagination.page === pagination.totalPages}
                      className={`px-5 py-2.5 rounded-[1rem] text-[10px] bold-text transition-all ${
                        pagination.page === pagination.totalPages
                          ? 'opacity-40 cursor-not-allowed'
                          : isdarkmode
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Simplified Details Modal */}
      {showdetailsmodal && selectedlog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-8 overflow-y-auto">
          <div className={`rounded-[2.5rem] w-full max-w-3xl shadow-2xl transition-all duration-500 ${
            isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'
          }`}>
            <div className="p-12">
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                  <h3 className={`text-2xl bold-text mb-2 transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>Activity Details</h3>
                  <p className={`text-[11px] mt-1 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Complete information about this activity log</p>
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
                  <span className={`text-[10px] px-5 py-2 rounded-full bold-text ${getactionbadgecolor(selectedlog.action)}`}>
                    {formatAction(selectedlog.action)}
                  </span>
                  <span className={`text-[10px] px-5 py-2 rounded-full bold-text ${getmodulebadgecolor(selectedlog.module)}`}>
                    {formatModuleName(selectedlog.module)}
                  </span>
                </div>

                {/* Main Info Card */}
                <div className={`rounded-[1.5rem] p-8 border shadow-sm transition-all duration-500 ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'}`}>
                  <div className="space-y-5">
                    {/* Performed By - Show First and Last Name */}
                    <div>
                      <label className={`text-[9px] uppercase tracking-widest mb-2 block transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Performed By</label>
                      <p className={`text-xl bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>{getAdminName(selectedlog)}</p>
                    </div>

                    {/* Timestamp */}
                    <div>
                      <label className={`text-[9px] uppercase tracking-widest mb-2 block transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Timestamp</label>
                      <p className={`text-lg bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
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

                    {/* Description - What was changed */}
                    {selectedlog.description && (
                      <div>
                        <label className={`text-[9px] uppercase tracking-widest mb-2 block transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Description</label>
                        <p className={`text-[11px] leading-relaxed transition-colors ${isdarkmode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {selectedlog.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`rounded-2xl p-5 border transition-all duration-500 ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-white border-gray-200'}`}>
                    <label className={`text-[9px] uppercase tracking-widest mb-2 block transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Action Type</label>
                    <p className={`text-xs bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>{getActionDescription(selectedlog)}</p>
                  </div>

                  <div className={`rounded-2xl p-5 border transition-all duration-500 ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-white border-gray-200'}`}>
                    <label className={`text-[9px] uppercase tracking-widest mb-2 block transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Module</label>
                    <p className={`text-xs bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>{formatModuleName(selectedlog.module)}</p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className={`flex justify-end gap-3 mt-8 pt-6 border-t transition-all duration-500 ${isdarkmode ? 'border-white/5' : 'border-gray-200'}`}>
                <button
                  onClick={() => setshowdetailsmodal(false)}
                  className="px-10 py-3.5 bg-[#800000] text-white rounded-[1.25rem] bold-text text-[11px] hover:bg-[#600000] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}