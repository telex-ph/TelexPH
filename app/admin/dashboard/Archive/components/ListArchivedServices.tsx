'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useDarkMode } from '../../layout'

type ContentType = 'Blogs' | 'CaseStudy' | 'Admin'
type SortMode = 'date-newest' | 'date-oldest' | 'alpha-asc' | 'alpha-desc'
type ViewMode = 'grid' | 'list'

interface ArchivedBlog {
  _id: string
  title: string
  slug: string
  author: string
  mainCategory: string
  subcategory: string
  shortDescription: string
  picture: string
  status: string
  isArchive: boolean
  createdAt: string
  updatedAt: string
}

interface ArchivedCaseStudy {
  _id: string
  title: string
  subtitle?: string
  slug: string
  cover: string
  status: string
  tags: string[]
  author: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

interface ArchivedAdmin {
  _id: string
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  profilePicture?: string | null
  department: number
  role: number
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

type ArchivedItem =
  | (ArchivedBlog      & { _type: 'blog' })
  | (ArchivedCaseStudy & { _type: 'casestudy' })
  | (ArchivedAdmin     & { _type: 'admin' })

const departments: { [key: number]: string } = {
  1: 'Compliance', 2: 'Innovation', 3: 'Marketing', 4: 'Recruitment', 5: 'Human Resources',
}
const roles: { [key: number]: string } = { 1: 'Main Administrator', 2: 'Administrator' }
const getDeptIcon = (d: number) =>
  ({ 1: '⚖️', 2: '💡', 3: '📢', 4: '👥', 5: '🤝' } as Record<number, string>)[d] || '👤'
const getInitials = (a: ArchivedAdmin) =>
  `${a.firstName?.charAt(0) || ''}${a.lastName?.charAt(0) || ''}`.toUpperCase()

// Use the same font family string as ActivityLogs everywhere
const FONT = "'Poppins', sans-serif"

export default function ListArchivedServices() {
  const { isdarkmode } = useDarkMode()

  const [activefilter,   setactivefilter]   = useState<ContentType | 'All'>('All')
  const [searchquery,    setsearchquery]     = useState('')
  const [sortmode,       setsortmode]        = useState<SortMode>('date-newest')
  const [viewmode,       setviewmode]        = useState<ViewMode>('grid')
  const [archivedblogs,       setarchivedblogs]       = useState<ArchivedBlog[]>([])
  const [archivedcasestudies, setarchivedcasestudies] = useState<ArchivedCaseStudy[]>([])
  const [archivedadmins,      setarchivedadmins]      = useState<ArchivedAdmin[]>([])
  const [isloading,    setisloading]    = useState(true)
  const [error,        seterror]        = useState<string | null>(null)
  const [restoringid,  setrestoringid]  = useState<string | null>(null)
  const [successmsg,   setsuccessmsg]   = useState<string | null>(null)
  const [currentRole,  setcurrentRole]  = useState<number | null>(null)
  const [confirmrestore, setconfirmrestore] = useState<{
    id: string; title: string; type: 'blog' | 'casestudy' | 'admin'
  } | null>(null)

  const isMainAdmin = currentRole === 1
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  // ── Theme tokens — identical to ActivityLogs ──────────────────────────────
  const pageBg      = isdarkmode ? '#0f0f0f'                : '#f8f9fa'
  const cardBg      = isdarkmode ? '#1a1a1a'                : '#ffffff'
  const subtleBg    = isdarkmode ? '#202020'                : '#f9fafb'
  const borderColor = isdarkmode ? 'rgba(255,255,255,0.08)' : '#e5e7eb'
  const textPrimary = isdarkmode ? '#f0f0f0'                : '#1f2937'
  const textMuted   = isdarkmode ? '#6b7280'                : '#6b7280'
  const inputBg     = isdarkmode ? '#202020'                : '#f9fafb'

  // ── Fetchers ──────────────────────────────────────────────────────────────
  const fetchBlogs = useCallback(async () => {
    const r = await fetch(`${API}/blogs?includeArchived=true`, {
      credentials: 'include', headers: { 'Content-Type': 'application/json' },
    })
    if (!r.ok) throw new Error(`Failed to fetch blogs: ${r.status}`)
    setarchivedblogs((await r.json()).filter((b: ArchivedBlog) => b.isArchive === true))
  }, [API])

  const fetchCaseStudies = useCallback(async () => {
    const r = await fetch(`${API}/casestudies?includeArchived=true`, {
      credentials: 'include', headers: { 'Content-Type': 'application/json' },
    })
    if (!r.ok) throw new Error(`Failed to fetch case studies: ${r.status}`)
    setarchivedcasestudies((await r.json()).filter((cs: ArchivedCaseStudy) => cs.isArchived === true))
  }, [API])

  const fetchAdmins = useCallback(async () => {
    const r = await fetch(`${API}/users/archived`, {
      credentials: 'include', headers: { 'Content-Type': 'application/json' },
    })
    if (!r.ok) throw new Error(`Failed to fetch admins: ${r.status}`)
    setarchivedadmins(await r.json())
  }, [API])

  const loadAll = useCallback(async () => {
    try {
      setisloading(true); seterror(null)
      const r = await fetch(`${API}/users/me`, {
        credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      if (!r.ok) throw new Error('Failed to fetch current user')
      const u = await r.json()
      const role: number = u.role
      setcurrentRole(role)
      await Promise.all([fetchBlogs(), fetchCaseStudies()])
      if (role === 1) await fetchAdmins()
    } catch (e: any) {
      seterror(e.message || 'Failed to load archived items')
    } finally {
      setisloading(false)
    }
  }, [API, fetchBlogs, fetchCaseStudies, fetchAdmins])

  useEffect(() => { loadAll() }, [loadAll])
  useEffect(() => {
    if (successmsg) {
      const t = setTimeout(() => setsuccessmsg(null), 3500)
      return () => clearTimeout(t)
    }
  }, [successmsg])

  // ── Restore handlers ──────────────────────────────────────────────────────
  const restoreBlog = async (id: string) => {
    try {
      setrestoringid(id)
      const r = await fetch(`${API}/blogs/${id}/restore`, {
        method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      if (!r.ok) { const d = await r.json(); throw new Error(d.error || 'Failed to restore blog') }
      setarchivedblogs(p => p.filter(b => b._id !== id))
      setsuccessmsg('Blog restored successfully!'); setconfirmrestore(null)
    } catch (e: any) { seterror(e.message || 'Failed to restore blog') } finally { setrestoringid(null) }
  }

  const restoreCS = async (id: string) => {
    try {
      setrestoringid(id)
      const r = await fetch(`${API}/casestudies/${id}/restore`, {
        method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      if (!r.ok) { const d = await r.json(); throw new Error(d.error || 'Failed to restore case study') }
      setarchivedcasestudies(p => p.filter(cs => cs._id !== id))
      setsuccessmsg('Case study restored successfully!'); setconfirmrestore(null)
    } catch (e: any) { seterror(e.message || 'Failed to restore case study') } finally { setrestoringid(null) }
  }

  const restoreAdmin = async (id: string) => {
    try {
      setrestoringid(id)
      const r = await fetch(`${API}/users/${id}/restore`, {
        method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      if (!r.ok) { const d = await r.json(); throw new Error(d.error || 'Failed to restore admin') }
      setarchivedadmins(p => p.filter(a => a._id !== id))
      setsuccessmsg('Admin account restored successfully!'); setconfirmrestore(null)
    } catch (e: any) { seterror(e.message || 'Failed to restore admin') } finally { setrestoringid(null) }
  }

  const doRestore = () => {
    if (!confirmrestore) return
    if (confirmrestore.type === 'blog') restoreBlog(confirmrestore.id)
    else if (confirmrestore.type === 'casestudy') restoreCS(confirmrestore.id)
    else restoreAdmin(confirmrestore.id)
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const getStatusBadge = (s: string): React.CSSProperties => {
    const map: Record<string, { bg: string; color: string }> = {
      published: { bg: '#00A651', color: '#fff' },
      active:    { bg: '#00A651', color: '#fff' },
      draft:     { bg: isdarkmode ? '#3a3a3a' : '#e5e7eb', color: isdarkmode ? '#9ca3af' : '#6b7280' },
      scheduled: { bg: '#8b5cf6', color: '#fff' },
      completed: { bg: '#0066CC', color: '#fff' },
    }
    const key = s?.toLowerCase() || ''
    const style = map[key] || { bg: isdarkmode ? '#3a3a3a' : '#e5e7eb', color: isdarkmode ? '#9ca3af' : '#6b7280' }
    return {
      background: style.bg, color: style.color,
      padding: '3px 12px', borderRadius: 20, fontSize: 10, fontWeight: 500,
      display: 'inline-block', whiteSpace: 'nowrap' as const, fontFamily: FONT,
    }
  }

  const getTypeBadge = (t: 'blog' | 'casestudy' | 'admin'): React.CSSProperties => {
    const map = {
      blog:      { bg: '#8B0000', color: '#fff' },
      casestudy: { bg: '#0066CC', color: '#fff' },
      admin:     { bg: '#4B0082', color: '#fff' },
    }
    const s = map[t]
    return {
      background: s.bg, color: s.color,
      padding: '3px 12px', borderRadius: 20, fontSize: 10, fontWeight: 500,
      display: 'inline-block', whiteSpace: 'nowrap' as const, fontFamily: FONT,
    }
  }

  const getRoleBadge = (role: number): React.CSSProperties => ({
    background: role === 1 ? '#8B0000' : '#B45309', color: '#fff',
    padding: '3px 12px', borderRadius: 20, fontSize: 10, fontWeight: 500,
    display: 'inline-block', whiteSpace: 'nowrap' as const, fontFamily: FONT,
  })

  // ── Sort & Filter ─────────────────────────────────────────────────────────
  const applySort = (list: ArchivedItem[]): ArchivedItem[] => {
    const s = [...list]
    const getName = (x: any) => x.title || `${x.firstName || ''} ${x.lastName || ''}`
    const getDate = (x: any) => new Date(x.updatedAt || x.createdAt).getTime()
    switch (sortmode) {
      case 'alpha-asc':   return s.sort((a, b) => getName(a).localeCompare(getName(b)))
      case 'alpha-desc':  return s.sort((a, b) => getName(b).localeCompare(getName(a)))
      case 'date-newest': return s.sort((a, b) => getDate(b) - getDate(a))
      case 'date-oldest': return s.sort((a, b) => getDate(a) - getDate(b))
      default: return s
    }
  }

  const getItems = (): ArchivedItem[] => {
    const blogs  = archivedblogs.map(b  => ({ ...b, _type: 'blog'      as const }))
    const cases  = archivedcasestudies.map(c => ({ ...c, _type: 'casestudy' as const }))
    const admins = archivedadmins.map(a  => ({ ...a, _type: 'admin'     as const }))

    let items: ArchivedItem[] =
      activefilter === 'All'        ? [...blogs, ...cases] :
      activefilter === 'Blogs'      ? blogs :
      activefilter === 'CaseStudy'  ? cases : admins

    if (searchquery.trim()) {
      const q = searchquery.toLowerCase()
      items = items.filter(it => {
        if (it._type === 'admin')
          return `${(it as any).firstName} ${(it as any).lastName}`.toLowerCase().includes(q)
            || (it as any).email.toLowerCase().includes(q)
            || (departments[(it as any).department] || '').toLowerCase().includes(q)
        return ((it as any).title || '').toLowerCase().includes(q)
          || ((it as any).author || '').toLowerCase().includes(q)
      })
    }
    return applySort(items)
  }

  const items = getItems()
  const totB = archivedblogs.length
  const totC = archivedcasestudies.length
  const totA = archivedadmins.length

  const filterOptions: { label: string; value: ContentType | 'All'; count: number }[] = [
    { label: 'All',          value: 'All',       count: totB + totC },
    { label: 'Blogs',        value: 'Blogs',     count: totB },
    { label: 'Case Studies', value: 'CaseStudy', count: totC },
    ...(isMainAdmin ? [{ label: 'Admins', value: 'Admin' as ContentType, count: totA }] : []),
  ]

  const statCards = [
    {
      label: 'Total Archived',
      value: totB + totC + (isMainAdmin ? totA : 0),
      subtitle: `${filterOptions.length - 1} content type${filterOptions.length - 1 !== 1 ? 's' : ''}`,
      iconColor: '#059669', dark: false,
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
    },
    {
      label: 'Blogs',
      value: totB,
      subtitle: 'Archived blog posts',
      iconColor: '#8B0000', dark: false,
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>,
    },
    {
      label: 'Case Studies',
      value: totC,
      subtitle: 'Archived case studies',
      iconColor: '#0066CC', dark: false,
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    },
    ...(isMainAdmin ? [{
      label: 'Admins', value: totA, subtitle: 'Archived admin accounts',
      iconColor: '#fff', dark: true,
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    }] : []),
  ]

  // ── Shared styles ─────────────────────────────────────────────────────────
  const inp = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${borderColor}`,
    background: inputBg, color: textPrimary, fontSize: 12, fontWeight: 400,
    outline: 'none', fontFamily: FONT, transition: 'border-color .15s', ...extra,
  })

  const Spinner = () => (
    <div style={{ width: 11, height: 11, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'arc-spin 0.8s linear infinite' }} />
  )
  const RestoreIcon = () => (
    <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
  const rBtn = (loading: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px',
    borderRadius: 10, border: 'none', background: '#059669', color: '#fff',
    fontSize: 11, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.65 : 1, transition: 'opacity 0.15s',
    whiteSpace: 'nowrap' as const, fontFamily: FONT,
  })

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isloading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: pageBg, fontFamily: FONT }}>
      <style>{`@keyframes arc-spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, border: '4px solid #800000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'arc-spin 0.8s linear infinite', margin: '0 auto 16px', display: 'inline-block' }} />
        <p style={{ fontSize: 12, color: textMuted, fontWeight: 400, fontFamily: FONT }}>Loading archived content...</p>
      </div>
    </div>
  )

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: pageBg, padding: '32px', fontFamily: FONT }}>
      <style>{`
        @keyframes arc-spin { to { transform: rotate(360deg) } }
        .arc-row:hover { background: ${isdarkmode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'} !important; }
        .arc-card { transition: transform .18s, box-shadow .18s, border-color .18s; }
        .arc-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,${isdarkmode ? '.35' : '.09'}) !important; border-color: ${isdarkmode ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.12)'} !important; }
        .arc-pill:hover { opacity: .78; }
        .arc-rbtn:hover { opacity: .82 !important; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Toasts ──────────────────────────────────────────────────────── */}
        {successmsg && (
          <div style={{ position: 'fixed', top: 28, right: 28, background: '#059669', color: '#fff', padding: '14px 24px', borderRadius: 20, fontSize: 12, fontWeight: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.22)', zIndex: 50, fontFamily: FONT }}>
            ✓ {successmsg}
          </div>
        )}
        {error && (
          <div style={{ position: 'fixed', top: 28, right: 28, background: '#dc2626', color: '#fff', padding: '14px 24px', borderRadius: 20, fontSize: 12, fontWeight: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.22)', zIndex: 50, display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT }}>
            {error}
            <button onClick={() => seterror(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 11, textDecoration: 'underline', fontFamily: FONT }}>Dismiss</button>
          </div>
        )}

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: FONT }}>
              Archived Content
            </h2>
            <p style={{ fontSize: 12, color: textMuted, margin: '4px 0 0', fontWeight: 400, fontFamily: FONT }}>
              Manage archived blogs, case studies{isMainAdmin ? ', and admin accounts' : ''}. Restore items to make them visible again.
            </p>
          </div>
          <button
            onClick={loadAll}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 12, background: cardBg, color: textMuted, fontSize: 12, fontWeight: 500, border: `1.5px solid ${borderColor}`, cursor: 'pointer', fontFamily: FONT, transition: 'opacity .15s' }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseOut={e  => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* ── Stat Cards ──────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMainAdmin ? 4 : 3}, 1fr)`, gap: 14 }}>
          {statCards.map((card, i) => (
            <div key={i} style={{
              padding: '20px 22px', borderRadius: 20,
              border: card.dark ? 'none' : `1px solid ${borderColor}`,
              background: card.dark ? (isdarkmode ? '#2a3a2a' : '#2d4a35') : cardBg,
              boxShadow: card.dark ? 'none' : (isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)'),
              display: 'flex', flexDirection: 'column' as const, gap: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 500, color: card.dark ? 'rgba(255,255,255,0.7)' : textMuted, margin: 0, fontFamily: FONT }}>
                  {card.label}
                </p>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: card.dark ? 'rgba(255,255,255,0.15)' : `${card.iconColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.dark ? '#fff' : card.iconColor, flexShrink: 0 }}>
                  {card.icon}
                </div>
              </div>
              <p style={{ fontSize: 36, fontWeight: 700, color: card.dark ? '#fff' : textPrimary, margin: '0 0 6px', lineHeight: 1, fontFamily: FONT }}>
                {card.value}
              </p>
              <p style={{ fontSize: 11, fontWeight: 400, color: card.dark ? 'rgba(255,255,255,0.6)' : textMuted, margin: 0, fontFamily: FONT }}>
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* ── Filters Card ────────────────────────────────────────────────── */}
        <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, padding: '24px', boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>

            {/* Search + Sort + View toggle */}
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: textMuted, pointerEvents: 'none' as const }} width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={activefilter === 'Admin' ? 'Search by name or email...' : 'Search by title or author...'}
                  value={searchquery}
                  onChange={e => setsearchquery(e.target.value)}
                  style={{ ...inp({ paddingLeft: 36, width: '100%' }) }}
                  onFocus={e  => (e.target.style.borderColor = '#800000')}
                  onBlur={e   => (e.target.style.borderColor = borderColor)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: textMuted, fontWeight: 400, whiteSpace: 'nowrap' as const, fontFamily: FONT }}>Sort by</span>
                <select
                  value={sortmode}
                  onChange={e => setsortmode(e.target.value as SortMode)}
                  style={inp({ padding: '10px 12px', fontSize: 11, cursor: 'pointer' })}
                  onFocus={e  => (e.target.style.borderColor = '#800000')}
                  onBlur={e   => (e.target.style.borderColor = borderColor)}
                >
                  <option value="date-newest">Newest First</option>
                  <option value="date-oldest">Oldest First</option>
                  <option value="alpha-asc">Name A → Z</option>
                  <option value="alpha-desc">Name Z → A</option>
                </select>
              </div>
              {/* View toggle */}
              <div style={{ display: 'flex', border: `1.5px solid ${borderColor}`, borderRadius: 12, overflow: 'hidden', background: inputBg }}>
                {([
                  ['grid', 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'],
                  ['list', 'M4 6h16M4 12h16M4 18h16'],
                ] as const).map(([m, d], i) => (
                  <button key={m} onClick={() => setviewmode(m as ViewMode)}
                    style={{ padding: '9px 12px', borderTop: 'none', borderBottom: 'none', borderRight: 'none', borderLeftWidth: i > 0 ? 1 : 0, borderLeftStyle: 'solid' as const, borderLeftColor: borderColor, background: viewmode === m ? '#800000' : 'transparent', color: viewmode === m ? '#fff' : textMuted, cursor: 'pointer', transition: 'all .15s', display: 'flex', alignItems: 'center' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Type */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: '0 0 10px', fontFamily: FONT }}>
                Filter by Type
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                {filterOptions.map(f => (
                  <button
                    key={f.value}
                    className="arc-pill"
                    onClick={() => setactivefilter(f.value)}
                    style={{
                      padding: '5px 14px', borderRadius: 8,
                      border: activefilter === f.value ? 'none' : `1px solid ${borderColor}`,
                      background: activefilter === f.value ? '#800000' : subtleBg,
                      color: activefilter === f.value ? '#fff' : textMuted,
                      fontSize: 11, fontWeight: activefilter === f.value ? 500 : 400,
                      cursor: 'pointer', transition: 'all .15s',
                      boxShadow: activefilter === f.value ? '0 2px 8px rgba(128,0,0,0.3)' : 'none',
                      fontFamily: FONT,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    {f.label}
                    <span style={{
                      fontSize: 9, padding: '1px 6px', borderRadius: 8, fontWeight: 500,
                      background: activefilter === f.value ? 'rgba(255,255,255,0.22)' : isdarkmode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
                      color: activefilter === f.value ? '#fff' : textMuted, fontFamily: FONT,
                    }}>
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Content Card ─────────────────────────────────────────────────── */}
        <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: 'hidden', boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)' }}>

          {/* Card header */}
          <div style={{ padding: '18px 24px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: FONT }}>Archived records</p>
              <p style={{ fontSize: 11, color: textMuted, margin: '3px 0 0', fontWeight: 400, fontFamily: FONT }}>
                {activefilter === 'All' ? 'All content types' : `Filtered by ${activefilter}`}{searchquery ? ` · matching "${searchquery}"` : ''}
              </p>
            </div>
            <span style={{ fontSize: 11, color: textMuted, fontFamily: FONT }}>
              Showing <strong style={{ color: textPrimary, fontFamily: FONT }}>{items.length}</strong> item{items.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Empty */}
          {items.length === 0 && (
            <div style={{ padding: '72px 20px', textAlign: 'center' }}>
              <svg style={{ margin: '0 auto 16px', display: 'block', color: isdarkmode ? '#374151' : '#d1d5db' }} width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <p style={{ fontSize: 14, fontWeight: 500, color: textMuted, margin: '0 0 4px', fontFamily: FONT }}>No archived items found</p>
              <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0, fontFamily: FONT }}>
                {searchquery ? 'Try adjusting your search query.' : 'Archived content will appear here.'}
              </p>
            </div>
          )}

          {/* ── GRID VIEW ─────────────────────────────────────────────────── */}
          {items.length > 0 && viewmode === 'grid' && (
            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {items.map(item => {
                const isAdmin = item._type === 'admin'
                const isBlog  = item._type === 'blog'
                const blog    = isBlog             ? item as ArchivedBlog      & { _type: 'blog' }      : null
                const cs      = !isBlog && !isAdmin ? item as ArchivedCaseStudy & { _type: 'casestudy' } : null
                const admin   = isAdmin            ? item as ArchivedAdmin     & { _type: 'admin' }     : null
                const loading = restoringid === item._id

                if (isAdmin && admin) return (
                  <div key={item._id} className="arc-card" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column' as const, boxShadow: isdarkmode ? '0 1px 4px rgba(0,0,0,.3)' : '0 2px 10px rgba(0,0,0,.06)' }}>
                    <div style={{ height: 3, background: 'linear-gradient(90deg,#4B0082,#6B21A8)' }} />
                    <div style={{ padding: 20, display: 'flex', flexDirection: 'column' as const, gap: 12, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg,#4B0082,#6B21A8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600, overflow: 'hidden', flexShrink: 0, fontFamily: FONT }}>
                          {admin.profilePicture ? <img src={admin.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(admin)}
                        </div>
                        <span style={getTypeBadge('admin')}>Admin</span>
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 500, color: textPrimary, margin: '0 0 2px', fontFamily: FONT }}>{admin.firstName} {admin.lastName}</p>
                        <p style={{ fontSize: 11, color: textMuted, margin: 0, fontWeight: 400, fontFamily: FONT }}>{admin.email}</p>
                      </div>
                      <span style={getRoleBadge(admin.role)}>{roles[admin.role]}</span>
                      <p style={{ fontSize: 11, color: textMuted, margin: 0, fontWeight: 400, fontFamily: FONT }}>{getDeptIcon(admin.department)} {departments[admin.department]}</p>
                      <div style={{ flex: 1 }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: `1px solid ${borderColor}` }}>
                        <div>
                          <p style={{ fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: textMuted, margin: '0 0 2px', fontWeight: 500, fontFamily: FONT }}>Archived</p>
                          <p style={{ fontSize: 11, color: textMuted, margin: 0, fontWeight: 400, fontFamily: FONT }}>{fmtDate(admin.updatedAt)}</p>
                        </div>
                        <button className="arc-rbtn" onClick={() => setconfirmrestore({ id: admin._id, title: `${admin.firstName} ${admin.lastName}`, type: 'admin' })} disabled={loading} style={rBtn(loading)}>
                          {loading ? <><Spinner />Restoring...</> : <><RestoreIcon />Restore</>}
                        </button>
                      </div>
                    </div>
                  </div>
                )

                const coverImage = isBlog ? blog!.picture : cs?.cover
                const status     = (item as any).status || ''
                const title      = (item as any).title  || ''
                const author     = (item as any).author || ''
                const date       = fmtDate((item as any).updatedAt || (item as any).createdAt)
                const desc       = isBlog ? blog?.shortDescription : cs?.subtitle

                return (
                  <div key={item._id} className="arc-card" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column' as const, boxShadow: isdarkmode ? '0 1px 4px rgba(0,0,0,.3)' : '0 2px 10px rgba(0,0,0,.06)' }}>
                    <div style={{ position: 'relative', height: 160, overflow: 'hidden', flexShrink: 0, background: isdarkmode ? '#111' : '#f3f4f6' }}>
                      {coverImage && <img src={coverImage} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)' }} />
                      <div style={{ position: 'absolute', top: 10, left: 10 }}>
                        <span style={getTypeBadge(isBlog ? 'blog' : 'casestudy')}>{isBlog ? 'Blog' : 'Case Study'}</span>
                      </div>
                    </div>
                    <div style={{ padding: 18, display: 'flex', flexDirection: 'column' as const, gap: 8, flex: 1 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: textPrimary, margin: 0, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: FONT }}>
                        {title}
                      </h3>
                      {desc && <p style={{ fontSize: 11, color: textMuted, margin: 0, fontWeight: 400, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: FONT }}>{desc}</p>}
                      <p style={{ fontSize: 11, color: textMuted, margin: 0, fontWeight: 400, fontFamily: FONT }}>
                        By <span style={{ color: textPrimary, fontWeight: 500, fontFamily: FONT }}>{author}</span> · {date}
                      </p>
                      {isBlog && blog?.mainCategory && (
                        <span style={{ fontSize: 9, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.05em', padding: '3px 8px', borderRadius: 5, background: isdarkmode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: textMuted, width: 'fit-content', fontFamily: FONT }}>
                          {blog.mainCategory}
                        </span>
                      )}
                      {!isBlog && cs?.tags?.length ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {cs.tags.slice(0, 3).map(t => (
                            <span key={t} style={{ fontSize: 9, fontWeight: 500, padding: '2px 7px', borderRadius: 5, background: isdarkmode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: textMuted, fontFamily: FONT }}>{t}</span>
                          ))}
                          {cs.tags.length > 3 && <span style={{ fontSize: 9, color: textMuted, fontFamily: FONT }}>+{cs.tags.length - 3}</span>}
                        </div>
                      ) : null}
                      <div style={{ flex: 1 }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${borderColor}` }}>
                        <span style={getStatusBadge(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                        <button className="arc-rbtn" onClick={() => setconfirmrestore({ id: item._id, title, type: isBlog ? 'blog' : 'casestudy' })} disabled={loading} style={rBtn(loading)}>
                          {loading ? <><Spinner />Restoring...</> : <><RestoreIcon />Restore</>}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── LIST VIEW ─────────────────────────────────────────────────── */}
          {items.length > 0 && viewmode === 'list' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 130px 120px', gap: 16, padding: '11px 24px', background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
                {['Title / Name', 'Author / Email', 'Category / Dept', 'Status / Role', 'Action'].map((col, i) => (
                  <span key={col} style={{ fontSize: 10, fontWeight: 500, color: textMuted, textAlign: i === 4 ? 'right' as const : 'left' as const, fontFamily: FONT }}>{col}</span>
                ))}
              </div>
              {items.map((item, idx) => {
                const isAdmin    = item._type === 'admin'
                const isBlog     = item._type === 'blog'
                const blog       = isBlog             ? item as ArchivedBlog      & { _type: 'blog' }      : null
                const cs         = !isBlog && !isAdmin ? item as ArchivedCaseStudy & { _type: 'casestudy' } : null
                const admin      = isAdmin            ? item as ArchivedAdmin     & { _type: 'admin' }     : null
                const loading    = restoringid === item._id
                const coverImage = isBlog ? blog?.picture : cs?.cover
                return (
                  <div key={item._id} className="arc-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 130px 120px', gap: 16, alignItems: 'center', padding: '14px 24px', borderBottom: idx < items.length - 1 ? `1px solid ${borderColor}` : 'none', transition: 'background .15s' }}>

                    {/* Title / Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      {isAdmin && admin ? (
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#4B0082,#6B21A8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 600, flexShrink: 0, overflow: 'hidden', fontFamily: FONT }}>
                          {admin.profilePicture ? <img src={admin.profilePicture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(admin)}
                        </div>
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, overflow: 'hidden', background: isdarkmode ? '#222' : '#f3f4f6' }}>
                          {coverImage && <img src={coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ marginBottom: 3 }}>
                          <span style={getTypeBadge(isAdmin ? 'admin' : isBlog ? 'blog' : 'casestudy')}>
                            {isAdmin ? 'Admin' : isBlog ? 'Blog' : 'Case Study'}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: FONT }}>
                          {isAdmin && admin ? `${admin.firstName} ${admin.lastName}` : (item as any).title}
                        </p>
                        {!isAdmin && isBlog && blog?.shortDescription && (
                          <p style={{ fontSize: 10, color: textMuted, margin: '1px 0 0', fontWeight: 400, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: FONT }}>{blog.shortDescription}</p>
                        )}
                        {!isAdmin && !isBlog && cs?.subtitle && (
                          <p style={{ fontSize: 10, color: textMuted, margin: '1px 0 0', fontWeight: 400, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: FONT }}>{cs.subtitle}</p>
                        )}
                      </div>
                    </div>

                    {/* Author / Email */}
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: FONT }}>
                        {isAdmin && admin ? `${admin.firstName} ${admin.lastName}` : (item as any).author}
                      </p>
                      {isAdmin && admin && (
                        <p style={{ fontSize: 11, color: textMuted, margin: '2px 0 0', fontWeight: 400, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: FONT }}>{admin.email}</p>
                      )}
                    </div>

                    {/* Category / Dept */}
                    <div>
                      {isAdmin && admin ? (
                        <span style={{ fontSize: 9, fontWeight: 500, padding: '3px 8px', borderRadius: 5, background: isdarkmode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: textMuted, fontFamily: FONT }}>
                          {getDeptIcon(admin.department)} {departments[admin.department]}
                        </span>
                      ) : isBlog && blog?.mainCategory ? (
                        <span style={{ fontSize: 9, fontWeight: 500, padding: '3px 8px', borderRadius: 5, background: isdarkmode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: textMuted, fontFamily: FONT }}>{blog.mainCategory}</span>
                      ) : cs?.tags?.length ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {cs.tags.slice(0, 2).map(t => (
                            <span key={t} style={{ fontSize: 9, fontWeight: 500, padding: '2px 6px', borderRadius: 4, background: isdarkmode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: textMuted, fontFamily: FONT }}>{t}</span>
                          ))}
                          {cs.tags.length > 2 && <span style={{ fontSize: 9, color: textMuted, fontFamily: FONT }}>+{cs.tags.length - 2}</span>}
                        </div>
                      ) : <span style={{ fontSize: 11, color: textMuted, fontFamily: FONT }}>—</span>}
                    </div>

                    {/* Status / Role */}
                    <div>
                      {isAdmin && admin
                        ? <span style={getRoleBadge(admin.role)}>{admin.role === 1 ? 'Main Admin' : 'Admin'}</span>
                        : <span style={getStatusBadge((item as any).status)}>
                            {((item as any).status || '').charAt(0).toUpperCase() + ((item as any).status || '').slice(1)}
                          </span>
                      }
                    </div>

                    {/* Action */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' as const }}>
                      <button className="arc-rbtn"
                        onClick={() => setconfirmrestore({
                          id: item._id,
                          title: isAdmin && admin ? `${admin.firstName} ${admin.lastName}` : (item as any).title,
                          type: isAdmin ? 'admin' : isBlog ? 'blog' : 'casestudy',
                        })}
                        disabled={loading} style={rBtn(loading)}>
                        {loading ? <><Spinner />Restoring...</> : <><RestoreIcon />Restore</>}
                      </button>
                    </div>
                  </div>
                )
              })}
              <div style={{ padding: '12px 24px', background: subtleBg, borderTop: `1px solid ${borderColor}` }}>
                <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0, fontFamily: FONT }}>
                  {items.length} item{items.length !== 1 ? 's' : ''} displayed
                  {activefilter !== 'All' && ` · filtered by "${activefilter}"`}
                  {searchquery && ` · matching "${searchquery}"`}
                </p>
              </div>
            </>
          )}
        </div>

      </div>

      {/* ── Confirm Restore Modal ─────────────────────────────────────────────── */}
      {confirmrestore && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24 }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 32, width: '100%', maxWidth: 440, boxShadow: '0 32px 80px rgba(0,0,0,0.32)', fontFamily: FONT }}>
            <div style={{ padding: '32px 36px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: FONT }}>Restore Item</h3>
                  <p style={{ fontSize: 12, color: textMuted, margin: '4px 0 0', fontWeight: 400, fontFamily: FONT }}>This item will be restored and made active again</p>
                </div>
                <button onClick={() => setconfirmrestore(null)} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: subtleBg, color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div style={{ marginBottom: 20 }}>
                <span style={getTypeBadge(confirmrestore.type)}>
                  {confirmrestore.type === 'blog' ? 'Blog' : confirmrestore.type === 'casestudy' ? 'Case Study' : 'Admin'}
                </span>
              </div>
              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, padding: '20px 22px', marginBottom: 20 }}>
                <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: '0 0 6px', textTransform: 'uppercase' as const, fontFamily: FONT }}>
                  {confirmrestore.type === 'blog' ? 'Blog Post' : confirmrestore.type === 'casestudy' ? 'Case Study' : 'Admin Account'}
                </p>
                <p style={{ fontSize: 15, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: FONT }}>{confirmrestore.title}</p>
              </div>
              <p style={{ fontSize: 12, color: textMuted, lineHeight: 1.6, margin: '0 0 24px', fontWeight: 400, fontFamily: FONT }}>
                This action can be undone by archiving it again at any time.
              </p>
              <div style={{ display: 'flex', gap: 10, paddingTop: 20, borderTop: `1px solid ${borderColor}` }}>
                <button onClick={() => setconfirmrestore(null)} disabled={!!restoringid}
                  style={{ flex: 1, padding: '11px 0', borderRadius: 14, border: `1px solid ${borderColor}`, background: 'transparent', color: textMuted, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: FONT }}>
                  Cancel
                </button>
                <button onClick={doRestore} disabled={!!restoringid}
                  style={{ flex: 2, padding: '11px 0', borderRadius: 14, border: 'none', background: '#059669', color: '#fff', fontSize: 12, fontWeight: 500, cursor: restoringid ? 'not-allowed' : 'pointer', opacity: restoringid ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: FONT }}>
                  {restoringid
                    ? <><Spinner />Restoring...</>
                    : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v5h5" /></svg>Restore</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}