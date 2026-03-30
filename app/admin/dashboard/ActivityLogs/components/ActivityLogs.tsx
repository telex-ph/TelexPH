'use client'

import React, { useState, useEffect } from 'react'
import { useDarkMode } from '../../layout'

interface ActivityLog {
  _id: string
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'ARCHIVED' | 'RESTORED' | 'LOGIN' | 'LOGOUT'
  module: 'CASESTUDY' | 'BLOGS' | 'ACCOUNT_SETTINGS' | 'AUTH'
  admin: string
  firstName: string
  lastName: string
  description: string
  details: any
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  archivedAt?: string
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
    archived: number
    restored: number
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
  const { isdarkmode } = useDarkMode()

  const [activetab, setactivetab]           = useState('All')
  const [searchquery, setsearchquery]       = useState('')
  const [sortby, setsortby]                 = useState('Newest')
  const [filteredmodules, setfilteredmodules] = useState<string[]>([])
  const [selectedlog, setselectedlog]       = useState<ActivityLog | null>(null)
  const [showdetailsmodal, setshowdetailsmodal] = useState(false)
  const [currentpage, setcurrentpage]       = useState(1)
  const [pagesize]                          = useState(20)

  const [logs, setlogs]             = useState<ActivityLog[]>([])
  const [pagination, setpagination] = useState<PaginationInfo | null>(null)
  const [stats, setstats]           = useState<ActivityStats | null>(null)
  const [isloading, setisloading]   = useState(false)
  const [error, seterror]           = useState<string | null>(null)

  const availableModules = ['CASESTUDY', 'BLOGS', 'ACCOUNT_SETTINGS', 'AUTH']
  const actionTypes = ['All', 'CREATED', 'UPDATED', 'DELETED', 'ARCHIVED', 'RESTORED', 'LOGIN', 'LOGOUT']

  // ── Theme tokens ────────────────────────────────────────────────────────────
  const pageBg      = isdarkmode ? '#0f0f0f'                : '#f8f9fa'
  const cardBg      = isdarkmode ? '#1a1a1a'                : '#ffffff'
  const subtleBg    = isdarkmode ? '#202020'                : '#f9fafb'
  const borderColor = isdarkmode ? 'rgba(255,255,255,0.08)' : '#e5e7eb'
  const textPrimary = isdarkmode ? '#f0f0f0'                : '#1f2937'
  const textMuted   = isdarkmode ? '#6b7280'                : '#6b7280'
  const inputBg     = isdarkmode ? '#202020'                : '#f9fafb'

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchActivityLogs = async () => {
    try {
      setisloading(true)
      seterror(null)
      const params = new URLSearchParams()
      params.append('page', currentpage.toString())
      params.append('limit', pagesize.toString())
      params.append('order', sortby === 'Newest' ? 'desc' : 'asc')
      if (activetab !== 'All') params.append('action', activetab)
      if (filteredmodules.length > 0) params.append('module', filteredmodules[0])
      if (searchquery) params.append('admin', searchquery)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://telexph-admin.onrender.com'
      const response = await fetch(`${apiUrl}/activity-logs?${params.toString()}`, {
        method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch activity logs (${response.status})`)
      }
      const data = await response.json()
      setlogs(data.logs || [])
      setpagination(data.pagination)
    } catch (err: any) {
      seterror(err.message || 'Failed to fetch activity logs')
    } finally {
      setisloading(false)
    }
  }

  const fetchActivityStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://telexph-admin.onrender.com'
      const response = await fetch(`${apiUrl}/activity-logs/stats`, {
        method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Failed to fetch activity stats')
      const data = await response.json()
      setstats(data)
    } catch (err: any) {
      console.error('Error fetching activity stats:', err)
    }
  }

  useEffect(() => { fetchActivityLogs() }, [currentpage, pagesize, sortby, activetab, filteredmodules])
  useEffect(() => { fetchActivityStats() }, [])
  useEffect(() => {
    if (error) { const t = setTimeout(() => seterror(null), 5000); return () => clearTimeout(t) }
  }, [error])

  // ── Formatters ──────────────────────────────────────────────────────────────
  const formatAction = (action: string) =>
    action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()

  const formatModuleName = (module: string) => {
    switch (module) {
      case 'CASESTUDY':        return 'Case Studies'
      case 'BLOGS':            return 'Blogs'
      case 'ACCOUNT_SETTINGS': return 'Account Settings'
      case 'AUTH':             return 'Authentication'
      default:                 return module
    }
  }

  const getActionDescription = (log: ActivityLog) => {
    const { action, module } = log
    if (action === 'LOGIN')  return 'User logged into the system'
    if (action === 'LOGOUT') return 'User logged out of the system'
    if (module === 'ACCOUNT_SETTINGS') {
      if (action === 'CREATED') return 'New admin account created'
      if (action === 'UPDATED') return log.details?.action === 'Password Changed' ? 'Admin password changed' : 'Admin account details updated'
      if (action === 'DELETED') return 'Admin account deleted'
    }
    if (module === 'CASESTUDY') {
      if (action === 'CREATED')  return 'New case study created'
      if (action === 'UPDATED')  return 'Case study updated'
      if (action === 'DELETED')  return 'Case study deleted'
      if (action === 'ARCHIVED') return 'Case study archived'
      if (action === 'RESTORED') return 'Case study restored from archive'
    }
    if (module === 'BLOGS') {
      if (action === 'CREATED')  return 'New blog post created'
      if (action === 'UPDATED')  return 'Blog post updated'
      if (action === 'DELETED')  return 'Blog post deleted'
      if (action === 'ARCHIVED') return 'Blog post archived'
      if (action === 'RESTORED') return 'Blog post restored from archive'
    }
    return `${formatAction(action)} action performed`
  }

  const getAdminName = (log: ActivityLog) =>
    log.firstName && log.lastName ? `${log.firstName} ${log.lastName}` : log.admin

  const getTimestamp = (log: ActivityLog) => {
    if (log.action === 'LOGIN'    && log.loggedInAt)  return log.loggedInAt
    if (log.action === 'LOGOUT'   && log.loggedOutAt) return log.loggedOutAt
    if (log.action === 'CREATED'  && log.createdAt)   return log.createdAt
    if (log.action === 'UPDATED'  && log.updatedAt)   return log.updatedAt
    if (log.action === 'DELETED'  && log.deletedAt)   return log.deletedAt
    if (log.action === 'ARCHIVED' && log.archivedAt)  return log.archivedAt
    if (log.action === 'RESTORED' && (log as any).restoredAt) return (log as any).restoredAt
    return log.createdAt || new Date().toISOString()
  }

  const getActionBadgeStyle = (action: string): React.CSSProperties => {
    const map: Record<string, { bg: string; color: string }> = {
      CREATED:  { bg: '#00A651', color: '#fff' },
      UPDATED:  { bg: '#0066CC', color: '#fff' },
      DELETED:  { bg: '#8B0000', color: '#fff' },
      ARCHIVED: { bg: '#B45309', color: '#fff' },
      RESTORED: { bg: '#0891B2', color: '#fff' },
      LOGIN:    { bg: '#4B0082', color: '#fff' },
      LOGOUT:   { bg: '#996633', color: '#fff' },
    }
    const s = map[action] || { bg: '#6b7280', color: '#fff' }
    return { background: s.bg, color: s.color, padding: '3px 12px', borderRadius: 20, fontSize: 10, fontWeight: 500, display: 'inline-block', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }
  }

  const getModuleBadgeStyle = (module: string): React.CSSProperties => {
    const map: Record<string, string> = {
      CASESTUDY: '#505050', BLOGS: '#8B0000', ACCOUNT_SETTINGS: '#4B0082', AUTH: '#505050',
    }
    return { background: map[module] || '#6b7280', color: '#fff', padding: '3px 12px', borderRadius: 20, fontSize: 10, fontWeight: 500, display: 'inline-block', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }
  }

  const toggleModuleFilter = (module: string) =>
    setfilteredmodules(prev => prev.includes(module) ? prev.filter(m => m !== module) : [module])

  const handlePreviousPage = () => { if (currentpage > 1) setcurrentpage(p => p - 1) }
  const handleNextPage = () => { if (pagination && currentpage < pagination.totalPages) setcurrentpage(p => p + 1) }

  // ── Stat card definitions ───────────────────────────────────────────────────
  const statCards = stats ? [
    {
      label: 'Total logs',
      value: stats.totalLogs.toLocaleString(),
      subtitle: `${stats.uniqueAdmins} unique admins`,
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      iconColor: '#059669',
      dark: false,
    },
    {
      label: 'Created',
      value: stats.actionCounts.created,
      subtitle: 'New entries added',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      iconColor: '#00A651',
      dark: false,
    },
    {
      label: 'Updated',
      value: stats.actionCounts.updated,
      subtitle: 'Records modified',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      iconColor: '#0066CC',
      dark: false,
    },
    {
      label: 'Archived',
      value: stats.actionCounts.archived ?? 0,
      subtitle: 'Moved to archive',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      iconColor: '#B45309',
      dark: false,
    },
    {
      label: 'Deleted',
      value: stats.actionCounts.deleted,
      subtitle: 'Permanently removed',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      iconColor: '#fff',
      dark: true,
    },
  ] : []

  // ── Shared input style ──────────────────────────────────────────────────────
  const inp = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${borderColor}`,
    background: inputBg, color: textPrimary, fontSize: 12, fontWeight: 400,
    outline: 'none', fontFamily: "'Poppins', sans-serif", letterSpacing: 0,
    transition: 'border-color .15s', ...extra,
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { font-family: 'Poppins', sans-serif !important; letter-spacing: 0 !important; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        input, textarea, select, option, button { font-family: 'Poppins', sans-serif !important; letter-spacing: 0 !important; }
        input:focus, textarea:focus, select:focus { border-color: #800000 !important; outline: none !important; box-shadow: none !important; }
        .al-row:hover { background: ${isdarkmode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'} !important; }
        .al-pill:hover { opacity: .78; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>

      <div style={{ minHeight: '100vh', background: pageBg, padding: '32px', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── Error toast ── */}
          {error && (
            <div style={{ position: 'fixed', top: 28, right: 28, background: '#dc2626', color: '#fff', padding: '14px 24px', borderRadius: 20, fontSize: 12, fontWeight: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.22)', zIndex: 50, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
              {error}
            </div>
          )}

          {/* ── Header ── */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
              Activity Logs
            </h2>
            <p style={{ fontSize: 12, color: textMuted, margin: '4px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
              Monitor and track all system activities, admin actions, and user interactions in real-time.
            </p>
          </div>

          {/* ── Stat Cards (reference image style) ── */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
              {statCards.map((card, i) => (
                <div key={i} style={{
                  padding: '20px 22px',
                  borderRadius: 20,
                  border: card.dark ? 'none' : `1px solid ${borderColor}`,
                  background: card.dark
                    ? (isdarkmode ? '#2a3a2a' : '#2d4a35')
                    : cardBg,
                  boxShadow: card.dark ? 'none' : (isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)'),
                  display: 'flex', flexDirection: 'column', gap: 0,
                }}>
                  {/* Label + Icon row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 500, color: card.dark ? 'rgba(255,255,255,0.7)' : textMuted, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                      {card.label}
                    </p>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: card.dark ? 'rgba(255,255,255,0.15)' : `${card.iconColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.dark ? '#fff' : card.iconColor, flexShrink: 0 }}>
                      {card.icon}
                    </div>
                  </div>
                  {/* Number */}
                  <p style={{ fontSize: 36, fontWeight: 700, color: card.dark ? '#ffffff' : textPrimary, margin: '0 0 6px', lineHeight: 1, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                    {card.value}
                  </p>
                  {/* Subtitle */}
                  <p style={{ fontSize: 11, fontWeight: 400, color: card.dark ? 'rgba(255,255,255,0.6)' : textMuted, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                    {card.subtitle}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ── Filters card ── */}
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, padding: '24px', boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Search + Sort row */}
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: textMuted, pointerEvents: 'none' as const }} width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by admin email..."
                    value={searchquery}
                    onChange={e => setsearchquery(e.target.value)}
                    style={{ ...inp({ paddingLeft: 36, width: '100%' }) }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: textMuted, fontWeight: 400, whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Sort by</span>
                  <select value={sortby} onChange={e => setsortby(e.target.value)} style={inp({ padding: '10px 12px', fontSize: 11, cursor: 'pointer' })}>
                    <option value="Newest">Newest First</option>
                    <option value="Oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Filter by Action */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: '0 0 10px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                  Filter by Action
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                  {actionTypes.map(action => (
                    <button
                      key={action}
                      className="al-pill"
                      onClick={() => setactivetab(action)}
                      style={{
                        padding: '5px 14px', borderRadius: 8, border: activetab === action ? 'none' : `1px solid ${borderColor}`,
                        background: activetab === action ? '#800000' : subtleBg,
                        color: activetab === action ? '#fff' : textMuted,
                        fontSize: 11, fontWeight: activetab === action ? 500 : 400,
                        cursor: 'pointer', transition: 'all .15s',
                        boxShadow: activetab === action ? '0 2px 8px rgba(128,0,0,0.3)' : 'none',
                        fontFamily: "'Poppins', sans-serif", letterSpacing: 0,
                      }}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter by Module */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: '0 0 10px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                  Filter by Module
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                  {availableModules.map(module => {
                    const sel = filteredmodules.includes(module)
                    return (
                      <button
                        key={module}
                        className="al-pill"
                        onClick={() => toggleModuleFilter(module)}
                        style={{
                          padding: '5px 14px', borderRadius: 8,
                          border: sel ? 'none' : `1px solid ${borderColor}`,
                          background: sel ? '#800000' : subtleBg,
                          color: sel ? '#fff' : textMuted,
                          fontSize: 11, fontWeight: sel ? 500 : 400,
                          cursor: 'pointer', transition: 'all .15s',
                          boxShadow: sel ? '0 2px 8px rgba(128,0,0,0.3)' : 'none',
                          fontFamily: "'Poppins', sans-serif", letterSpacing: 0,
                        }}
                      >
                        {formatModuleName(module)}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Table card ── */}
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: 'hidden', boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>

            {/* Card header */}
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Activity log records</p>
                <p style={{ fontSize: 11, color: textMuted, margin: '3px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>All admin actions and system events</p>
              </div>
              {pagination && (
                <span style={{ fontSize: 11, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                  Showing <strong style={{ color: textPrimary, fontFamily: "'Poppins', sans-serif" }}>{((pagination.page - 1) * pagination.limit) + 1}</strong> to <strong style={{ color: textPrimary, fontFamily: "'Poppins', sans-serif" }}>{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> of <strong style={{ color: textPrimary, fontFamily: "'Poppins', sans-serif" }}>{pagination.total}</strong> results
                </span>
              )}
            </div>

            {/* Loading */}
            {isloading && (
              <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', border: '4px solid #800000', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px', display: 'inline-block' }} />
                <p style={{ fontSize: 12, color: textMuted, fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Loading activity logs...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              </div>
            )}

            {/* Empty */}
            {!isloading && logs.length === 0 && (
              <div style={{ padding: '72px 20px', textAlign: 'center' }}>
                <svg style={{ margin: '0 auto 16px', display: 'block', color: isdarkmode ? '#374151' : '#d1d5db' }} width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p style={{ fontSize: 14, fontWeight: 500, color: textMuted, margin: '0 0 4px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>No activity logs found</p>
                <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Try adjusting your filters or search query</p>
              </div>
            )}

            {/* Table */}
            {!isloading && logs.length > 0 && (
              <>
                {/* Table header row */}
                <div style={{ display: 'grid', gridTemplateColumns: '140px 160px 1fr 1fr 140px', gap: 16, padding: '11px 24px', background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
                  {['Action', 'Module', 'Admin', 'Timestamp', 'Details'].map((col, i) => (
                    <span key={col} style={{ fontSize: 10, fontWeight: 500, color: textMuted, textAlign: i === 4 ? 'right' as const : 'left' as const, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                      {col}
                    </span>
                  ))}
                </div>

                {/* Table rows */}
                {logs.map((log, i) => (
                  <div
                    key={log._id}
                    className="al-row"
                    style={{ display: 'grid', gridTemplateColumns: '140px 160px 1fr 1fr 140px', gap: 16, alignItems: 'center', padding: '14px 24px', borderBottom: i < logs.length - 1 ? `1px solid ${borderColor}` : 'none', transition: 'background .15s' }}
                  >
                    {/* Action badge */}
                    <div>
                      <span style={getActionBadgeStyle(log.action)}>{formatAction(log.action)}</span>
                    </div>

                    {/* Module badge */}
                    <div>
                      <span style={getModuleBadgeStyle(log.module)}>{formatModuleName(log.module)}</span>
                    </div>

                    {/* Admin */}
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                        {getAdminName(log)}
                      </p>
                      <p style={{ fontSize: 11, color: textMuted, margin: '2px 0 0', fontWeight: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                        {log.admin}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                        {new Date(getTimestamp(log)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p style={{ fontSize: 11, color: textMuted, margin: '2px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                        {new Date(getTimestamp(log)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* View Details button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' as const }}>
                      <button
                        onClick={() => { setselectedlog(log); setshowdetailsmodal(true) }}
                        style={{ padding: '6px 14px', borderRadius: 10, border: `1px solid ${borderColor}`, background: isdarkmode ? 'rgba(255,255,255,0.06)' : '#f9fafb', color: textMuted, fontSize: 11, fontWeight: 500, cursor: 'pointer', transition: 'all .15s', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pagination footer */}
                <div style={{ padding: '14px 24px', background: subtleBg, borderTop: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                    Page <strong style={{ color: textPrimary, fontFamily: "'Poppins', sans-serif" }}>{pagination?.page}</strong> of <strong style={{ color: textPrimary, fontFamily: "'Poppins', sans-serif" }}>{pagination?.totalPages}</strong>
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentpage === 1}
                      style={{ padding: '7px 16px', borderRadius: 10, border: `1px solid ${borderColor}`, background: currentpage === 1 ? 'transparent' : subtleBg, color: currentpage === 1 ? textMuted : textPrimary, fontSize: 11, fontWeight: 500, cursor: currentpage === 1 ? 'not-allowed' : 'pointer', opacity: currentpage === 1 ? 0.4 : 1, transition: 'all .15s', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}
                    >
                      Previous
                    </button>
                    {pagination && Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, idx) => idx + 1).map(pg => (
                      <button
                        key={pg}
                        onClick={() => setcurrentpage(pg)}
                        style={{ width: 32, height: 32, borderRadius: 8, border: pg === currentpage ? 'none' : `1px solid ${borderColor}`, background: pg === currentpage ? '#800000' : subtleBg, color: pg === currentpage ? '#fff' : textMuted, fontSize: 11, fontWeight: pg === currentpage ? 600 : 400, cursor: 'pointer', transition: 'all .15s', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}
                      >
                        {pg}
                      </button>
                    ))}
                    <button
                      onClick={handleNextPage}
                      disabled={!pagination || currentpage === pagination.totalPages}
                      style={{ padding: '7px 16px', borderRadius: 10, border: `1px solid ${borderColor}`, background: (!pagination || currentpage === pagination.totalPages) ? 'transparent' : subtleBg, color: (!pagination || currentpage === pagination.totalPages) ? textMuted : textPrimary, fontSize: 11, fontWeight: 500, cursor: (!pagination || currentpage === pagination.totalPages) ? 'not-allowed' : 'pointer', opacity: (!pagination || currentpage === pagination.totalPages) ? 0.4 : 1, transition: 'all .15s', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* ── Details Modal ── */}
      {showdetailsmodal && selectedlog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20, overflowY: 'auto' }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 32, width: '100%', maxWidth: 680, boxShadow: '0 32px 80px rgba(0,0,0,0.32)', fontFamily: "'Poppins', sans-serif" }}>
            <div style={{ padding: '32px 36px' }}>

              {/* Modal header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Activity Details</h3>
                  <p style={{ fontSize: 12, color: textMuted, margin: '4px 0 0', fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Complete information about this activity log</p>
                </div>
                <button onClick={() => setshowdetailsmodal(false)} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: subtleBg, color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <span style={getActionBadgeStyle(selectedlog.action)}>{formatAction(selectedlog.action)}</span>
                <span style={getModuleBadgeStyle(selectedlog.module)}>{formatModuleName(selectedlog.module)}</span>
              </div>

              {/* Main info card */}
              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, padding: '24px', marginBottom: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: '0 0 6px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>PERFORMED BY</p>
                    <p style={{ fontSize: 20, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{getAdminName(selectedlog)}</p>
                    <p style={{ fontSize: 12, color: textMuted, margin: '3px 0 0', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{selectedlog.admin}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: '0 0 6px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>TIMESTAMP</p>
                    <p style={{ fontSize: 14, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                      {new Date(getTimestamp(selectedlog)).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  </div>
                  {selectedlog.description && (
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: '0 0 6px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>DESCRIPTION</p>
                      <p style={{ fontSize: 12, fontWeight: 400, color: textPrimary, margin: 0, lineHeight: 1.6, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{selectedlog.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Two-col cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: '16px 18px' }}>
                  <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: '0 0 6px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>ACTION TYPE</p>
                  <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{getActionDescription(selectedlog)}</p>
                </div>
                <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: '16px 18px' }}>
                  <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: '0 0 6px', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>MODULE</p>
                  <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{formatModuleName(selectedlog.module)}</p>
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' as const, paddingTop: 20, borderTop: `1px solid ${borderColor}` }}>
                <button
                  onClick={() => setshowdetailsmodal(false)}
                  style={{ padding: '11px 32px', borderRadius: 14, border: 'none', background: '#800000', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all .15s', fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}