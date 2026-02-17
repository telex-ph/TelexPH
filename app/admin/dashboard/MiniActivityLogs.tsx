'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface ActivityLog {
  _id: string
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'LOGIN' | 'LOGOUT'
  module: 'CASESTUDY' | 'BLOGS' | 'ACCOUNT_SETTINGS' | 'AUTH'
  admin: string
  details: any
  readBy: string[]
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  loggedInAt?: string
  loggedOutAt?: string
}

interface MiniActivityLogsProps {
  isdarkmode: boolean
  onUnreadCountChange?: (count: number) => void
  onClose?: () => void
}

export default function MiniActivityLogs({ isdarkmode, onUnreadCountChange, onClose }: MiniActivityLogsProps) {
  const [logs, setlogs] = useState<ActivityLog[]>([])
  const [isloading, setisloading] = useState(false)

  useEffect(() => {
    fetchRecentLogs()
    markAllAsRead()
  }, [])

  const fetchRecentLogs = async () => {
    try {
      setisloading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      
      const response = await fetch(`${apiUrl}/activity-logs?limit=10&order=desc`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch activity logs')
      }

      const data = await response.json()
      setlogs(data.logs || [])
    } catch (err) {
      console.error('Error fetching activity logs:', err)
    } finally {
      setisloading(false)
    }
  }

  const markAllAsRead = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      
      await fetch(`${apiUrl}/activity-logs/mark-as-read`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Empty body marks all as read
      })

      // Notify parent component to update unread count
      if (onUnreadCountChange) {
        onUnreadCountChange(0)
      }
    } catch (err) {
      console.error('Error marking logs as read:', err)
    }
  }

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
        return log.createdAt || log.updatedAt || ''
    }
  }

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'N/A'
    
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatAction = (action: string) => {
    return action.charAt(0) + action.slice(1).toLowerCase()
  }

  const formatModuleName = (module: string) => {
    const moduleMap: { [key: string]: string } = {
      'CASESTUDY': 'Casestudy',
      'BLOGS': 'Blogs',
      'ACCOUNT_SETTINGS': 'Settings',
      'AUTH': 'Auth'
    }
    return moduleMap[module] || module
  }

  const getactionbadgecolor = (action: string) => {
    const colors: { [key: string]: string } = {
      'CREATED': 'bg-[#00A651]',
      'UPDATED': 'bg-[#0066CC]',
      'DELETED': 'bg-[#8B0000]',
      'LOGIN': 'bg-[#4B0082]',
      'LOGOUT': 'bg-[#996633]'
    }
    return colors[action] || 'bg-gray-500'
  }

  const getContentTitle = (log: ActivityLog): string => {
    if (!log.details) return ''
    
    if (log.module === 'BLOGS' || log.module === 'CASESTUDY') {
      if (log.action === 'UPDATED') {
        const title = log.details.newData?.title || log.details.oldData?.title || log.details.title
        return title || ''
      }
      
      if (log.action === 'CREATED' || log.action === 'DELETED') {
        return log.details.title || log.details.slug || log.details.caseStudyId || ''
      }
      
      return log.details.title || log.details.slug || ''
    }
    
    return ''
  }

  const getActionDescription = (log: ActivityLog) => {
    const action = formatAction(log.action)
    const module = formatModuleName(log.module).toLowerCase()
    const title = getContentTitle(log)
    
    if (log.action === 'LOGIN') {
      return 'Logged in'
    }
    if (log.action === 'LOGOUT') {
      return 'Logged out'
    }
    
    if (title && (log.module === 'BLOGS' || log.module === 'CASESTUDY')) {
      return `${action} ${module}`
    }
    
    return `${action} ${module}`
  }

  const getAdminName = (email: string): string => {
    const emailName = email.split('@')[0]
    return emailName.split('.').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className={`text-sm font-black uppercase tracking-wider ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>
          Activity Logs
        </h3>
        <p className="text-[10px] text-gray-400 mt-0.5">Recent admin activities</p>
      </div>

      {/* Logs List */}
      <div className="max-h-[400px] overflow-y-auto">
        {isloading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#800000]"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-xs text-gray-400 font-medium">No recent activities</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {logs.map((log) => (
              <div
                key={log._id}
                className={`px-6 py-4 transition-colors ${isdarkmode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getactionbadgecolor(log.action)}`}>
                    {log.action === 'CREATED' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    )}
                    {log.action === 'UPDATED' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    )}
                    {log.action === 'DELETED' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    )}
                    {log.action === 'LOGIN' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                        <polyline points="10 17 15 12 10 7"/>
                        <line x1="15" y1="12" x2="3" y2="12"/>
                      </svg>
                    )}
                    {log.action === 'LOGOUT' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>
                        {getActionDescription(log)}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold text-white ${getactionbadgecolor(log.action)}`}>
                        {formatAction(log.action)}
                      </span>
                    </div>
                    
                    {getContentTitle(log) && (
                      <p className="text-[11px] text-gray-500 font-medium mb-1 truncate">
                        {getContentTitle(log)}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <span>{getAdminName(log.admin)}</span>
                      <span>•</span>
                      <span>{formatTimestamp(getTimestamp(log))}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`px-6 py-4 border-t ${isdarkmode ? 'border-white/5' : 'border-gray-100'}`}>
        <Link 
          href="/admin/dashboard/ActivityLogs"
          onClick={onClose}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all no-underline ${
            isdarkmode 
              ? 'bg-white/5 text-gray-300 hover:bg-white/10' 
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          View All Activity Logs
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}