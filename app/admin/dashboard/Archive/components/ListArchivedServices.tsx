'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useDarkMode } from '../../layout'

type ContentType = 'Blogs' | 'CaseStudy' | 'Admin'
type SortMode = 'date-newest' | 'date-oldest' | 'alpha-asc' | 'alpha-desc'

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

// ── Admin helpers ─────────────────────────────────────────────
const departments: { [key: number]: string } = {
  1: 'Compliance', 2: 'Innovation', 3: 'Marketing', 4: 'Recruitment', 5: 'Human Resources',
}
const roles: { [key: number]: string } = { 1: 'Main Administrator', 2: 'Administrator' }
const getDeptIcon = (d: number) =>
  ({ 1: '⚖️', 2: '💡', 3: '📢', 4: '👥', 5: '🤝' } as Record<number, string>)[d] || '👤'
const getInitials = (a: ArchivedAdmin) =>
  `${a.firstName?.charAt(0) || ''}${a.lastName?.charAt(0) || ''}`.toUpperCase()

export default function ListArchivedServices() {
  const { isdarkmode } = useDarkMode()

  const [activefilter,   setactivefilter]   = useState<ContentType | 'All'>('All')
  const [searchquery,    setsearchquery]     = useState('')
  const [sortmode,       setsortmode]        = useState<SortMode>('date-newest')
  const [viewmode,       setviewmode]        = useState<'grid' | 'list'>('grid')
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

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const cardBg   = isdarkmode ? '#1a1a1a' : '#ffffff'
  const border   = isdarkmode ? 'rgba(255,255,255,0.08)' : '#e5e7eb'
  const txtPri   = isdarkmode ? '#f0f0f0' : '#1f2937'
  const txtSec   = isdarkmode ? '#9ca3af' : '#6b7280'
  const txtMut   = isdarkmode ? '#6b7280' : '#9ca3af'
  const hoverBg  = isdarkmode ? 'rgba(255,255,255,0.04)' : '#f9fafb'
  const subtleBg = isdarkmode ? 'rgba(255,255,255,0.03)' : '#f9fafb'
  const inputBg  = isdarkmode ? '#161616' : '#ffffff'

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

  const getStatusStyle = (s: string): React.CSSProperties => {
    switch (s?.toLowerCase()) {
      case 'published': case 'active':
        return { background: 'rgba(0,188,125,0.08)', color: '#00bc7d', border: '1px solid rgba(0,188,125,0.2)' }
      case 'draft':
        return { background: isdarkmode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', color: txtMut, border: `1px solid ${border}` }
      case 'scheduled':
        return { background: 'rgba(139,92,246,0.08)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }
      case 'completed':
        return { background: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }
      default:
        return { background: isdarkmode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: txtMut, border: `1px solid ${border}` }
    }
  }

  const getRoleStyle = (role: number): React.CSSProperties =>
    role === 1
      ? { background: 'rgba(128,0,0,0.1)', color: '#800000', border: '1px solid rgba(128,0,0,0.2)' }
      : { background: 'rgba(241,161,13,0.08)', color: '#f1a10d', border: '1px solid rgba(241,161,13,0.2)' }

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
    const blogs  = archivedblogs.map(b  => ({ ...b,  _type: 'blog'      as const }))
    const cases  = archivedcasestudies.map(c => ({ ...c,  _type: 'casestudy' as const }))
    const admins = archivedadmins.map(a  => ({ ...a,  _type: 'admin'     as const }))

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
  const totB  = archivedblogs.length
  const totC  = archivedcasestudies.length
  const totA  = archivedadmins.length

  const filters: { label: string; value: ContentType | 'All'; count: number }[] = [
    { label: 'All',          value: 'All',       count: totB + totC },
    { label: 'Blogs',        value: 'Blogs',      count: totB },
    { label: 'Case Studies', value: 'CaseStudy',  count: totC },
    ...(isMainAdmin ? [{ label: 'Admins', value: 'Admin' as ContentType, count: totA }] : []),
  ]

  // ── Shared style helpers ──────────────────────────────────────────────────
  const card: React.CSSProperties = { background: cardBg, border: `1px solid ${border}`, borderRadius: 16 }

  const typePill = (t: 'blog' | 'casestudy' | 'admin'): React.CSSProperties => {
    const cfg = {
      blog:      { bg: 'rgba(128,0,0,0.85)',      c: '#fff', b: 'transparent' },
      casestudy: { bg: 'rgba(37,99,235,0.85)',    c: '#fff', b: 'transparent' },
      admin:     { bg: 'rgba(37,99,235,0.85)',    c: '#fff', b: 'transparent' },
    }
    const x = cfg[t]
    return {
      fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
      padding: '3px 9px', borderRadius: 5, background: x.bg, color: x.c,
      border: `1px solid ${x.b}`, whiteSpace: 'nowrap' as const,
      backdropFilter: 'blur(4px)',
    }
  }

  const sBadge = (s: string): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', fontSize: 10, fontWeight: 500,
    padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' as const,
    ...getStatusStyle(s),
  })
  const rBadge = (r: number): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', fontSize: 10, fontWeight: 500,
    padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' as const,
    ...getRoleStyle(r),
  })
  const rBtn = (loading: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px',
    borderRadius: 8, border: 'none', background: '#059669', color: '#fff',
    fontSize: 11, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.65 : 1, transition: 'opacity 0.15s',
    whiteSpace: 'nowrap' as const, fontFamily: "'Poppins', sans-serif",
  })
  const fBtn = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
    fontSize: 11, fontWeight: 500, border: 'none', cursor: 'pointer',
    transition: 'all 0.15s', background: active ? '#800000' : 'transparent',
    color: active ? '#fff' : txtMut, fontFamily: "'Poppins', sans-serif",
  })

  const Spinner = () => (
    <div style={{ width: 11, height: 11, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
  )
  const RestoreIcon = () => (
    <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isloading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '2px solid', borderColor: `${border} ${border} ${border} #800000`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ fontSize: 13, color: txtMut, fontWeight: 400 }}>Loading archived content...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        *{font-family:'Poppins',sans-serif!important;box-sizing:border-box}
        .arc-row:hover{background:${hoverBg}!important}
        .arc-card{transition:transform .18s,box-shadow .18s,border-color .18s}
        .arc-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,${isdarkmode ? '.35' : '.09'})!important;border-color:${isdarkmode ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.12)'}!important}
        .r-btn:hover{opacity:.82!important}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── TOASTS ─────────────────────────────────────────────────────── */}
        {successmsg && (
          <div style={{ position: 'fixed', top: 32, right: 32, zIndex: 50, background: '#059669', color: '#fff', padding: '13px 22px', borderRadius: 10, fontSize: 12, fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', fontFamily: "'Poppins', sans-serif" }}>
            ✓ {successmsg}
          </div>
        )}
        {error && (
          <div style={{ position: 'fixed', top: 32, right: 32, zIndex: 50, background: '#dc2626', color: '#fff', padding: '13px 22px', borderRadius: 10, fontSize: 12, fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Poppins', sans-serif" }}>
            {error}
            <button onClick={() => seterror(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 11, textDecoration: 'underline' }}>Dismiss</button>
          </div>
        )}

        {/* ── PAGE HEADER ────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: `1px solid ${border}` }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 500, color: txtPri, margin: 0, lineHeight: 1.3 }}>Archived Content</h1>
            <p style={{ fontSize: 12, color: txtMut, margin: '4px 0 0', fontWeight: 400 }}>
              Manage archived blogs, case studies{isMainAdmin ? ', and admin accounts' : ''}. Restore items to make them visible again.
            </p>
          </div>
          <button onClick={loadAll}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, background: cardBg, color: txtSec, fontSize: 12, fontWeight: 500, border: `1px solid ${border}`, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseOut={e  => (e.currentTarget.style.opacity = '1')}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* ── STATS ──────────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMainAdmin ? 4 : 3}, 1fr)`, gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Archived', value: totB + totC + (isMainAdmin ? totA : 0), color: txtPri },
            { label: 'Blogs',          value: totB, color: '#800000' },
            { label: 'Case Studies',   value: totC, color: '#f1a10d' },
            ...(isMainAdmin ? [{ label: 'Admins', value: totA, color: '#3b82f6' }] : []),
          ].map(st => (
            <div key={st.label} style={{ ...card, padding: '20px 24px', boxShadow: isdarkmode ? '0 1px 4px rgba(0,0,0,.3)' : '0 1px 4px rgba(0,0,0,.06)' }}>
              <p style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: txtMut, margin: '0 0 10px' }}>{st.label}</p>
              <p style={{ fontSize: 28, fontWeight: 600, color: st.color, margin: 0 }}>{st.value}</p>
            </div>
          ))}
        </div>

        {/* ── CONTROLS ───────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 24 }}>

          {/* Search */}
          <div style={{ position: 'relative', width: 240 }}>
            <input type="text"
              placeholder={activefilter === 'Admin' ? 'Search by name or email...' : 'Search by title or author...'}
              value={searchquery}
              onChange={e => setsearchquery(e.target.value)}
              style={{ width: '100%', paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: txtPri, fontSize: 12, outline: 'none', fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}
              onFocus={e => (e.target.style.borderColor = '#800000')}
              onBlur={e  => (e.target.style.borderColor = border)} />
            <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: txtMut, pointerEvents: 'none' }} width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', border: `1px solid ${border}`, borderRadius: 8, overflow: 'hidden', background: cardBg }}>
            {filters.map((f, i) => (
              <button key={f.value} onClick={() => setactivefilter(f.value)}
                style={{ ...fBtn(activefilter === f.value), borderLeftWidth: i > 0 ? 1 : 0, borderLeftStyle: 'solid', borderLeftColor: border }}>
                {f.label}
                <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 10, fontWeight: 500, background: activefilter === f.value ? 'rgba(255,255,255,0.22)' : isdarkmode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', color: activefilter === f.value ? '#fff' : txtMut }}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          <span style={{ width: 1, height: 24, background: border }} />

          {/* Sort by */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: txtMut, fontWeight: 400 }}>Sort by</span>
            <select value={sortmode} onChange={e => setsortmode(e.target.value as SortMode)}
              style={{ fontSize: 11, padding: '7px 10px', borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: txtPri, outline: 'none', cursor: 'pointer', fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>
              <option value="date-newest">Newest First</option>
              <option value="date-oldest">Oldest First</option>
              <option value="alpha-asc">Name A → Z</option>
              <option value="alpha-desc">Name Z → A</option>
            </select>
          </div>

          <div style={{ flex: 1 }} />

          <span style={{ fontSize: 11, color: txtMut, fontWeight: 400 }}>
            Showing <strong style={{ color: txtSec, fontWeight: 500 }}>{items.length}</strong> item{items.length !== 1 ? 's' : ''}
          </span>

          <span style={{ width: 1, height: 24, background: border }} />

          {/* View toggle */}
          <div style={{ display: 'flex', border: `1px solid ${border}`, borderRadius: 8, overflow: 'hidden', background: cardBg }}>
            {([
              ['grid', 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'],
              ['list', 'M4 6h16M4 12h16M4 18h16'],
            ] as const).map(([m, d], i) => (
              <button key={m} onClick={() => setviewmode(m)}
                style={{ padding: '7px 10px', borderTop: 'none', borderBottom: 'none', borderRight: 'none', borderLeftWidth: i > 0 ? 1 : 0, borderLeftStyle: 'solid', borderLeftColor: border, background: viewmode === m ? '#800000' : 'transparent', color: viewmode === m ? '#fff' : txtMut, cursor: 'pointer', transition: 'all .15s', display: 'flex', alignItems: 'center' }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* ── EMPTY STATE ────────────────────────────────────────────────── */}
        {items.length === 0 && (
          <div style={{ ...card, padding: '64px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>📦</div>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: txtPri, margin: '0 0 6px' }}>No archived items found</h3>
            <p style={{ fontSize: 12, color: txtMut, margin: 0, fontWeight: 400 }}>
              {searchquery ? 'Try adjusting your search query.' : 'Archived content will appear here.'}
            </p>
          </div>
        )}

        {/* ── GRID VIEW ──────────────────────────────────────────────────── */}
        {items.length > 0 && viewmode === 'grid' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {items.map(item => {
              const isAdmin = item._type === 'admin'
              const isBlog  = item._type === 'blog'
              const blog    = isBlog       ? item as ArchivedBlog      & { _type: 'blog' }      : null
              const cs      = !isBlog && !isAdmin ? item as ArchivedCaseStudy & { _type: 'casestudy' } : null
              const admin   = isAdmin      ? item as ArchivedAdmin     & { _type: 'admin' }     : null
              const loading = restoringid === item._id

              // ── Admin card ────────────────────────────────────────────────
              if (isAdmin && admin) return (
                <div key={item._id} className="arc-card" style={{ ...card, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: isdarkmode ? '0 1px 4px rgba(0,0,0,.3)' : '0 1px 4px rgba(0,0,0,.06)' }}>
                  <div style={{ height: 3, background: 'linear-gradient(90deg,#800000,#a00000)' }} />
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg,#800000,#a00000)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600, overflow: 'hidden', flexShrink: 0 }}>
                        {admin.profilePicture
                          ? <img src={admin.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : getInitials(admin)}
                      </div>
                      <span style={{ ...typePill('admin'), background: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>Admin</span>
                    </div>

                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: txtPri, margin: '0 0 2px' }}>{admin.firstName} {admin.lastName}</p>
                      <p style={{ fontSize: 11, color: txtMut, margin: 0, fontWeight: 400 }}>{admin.email}</p>
                    </div>

                    <span style={rBadge(admin.role)}>{roles[admin.role]}</span>
                    <p style={{ fontSize: 11, color: txtMut, margin: 0, fontWeight: 400 }}>
                      {getDeptIcon(admin.department)} {departments[admin.department]}
                    </p>

                    <div style={{ flex: 1 }} />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: `1px solid ${border}` }}>
                      <div>
                        <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: txtMut, margin: '0 0 2px', fontWeight: 500 }}>Archived</p>
                        <p style={{ fontSize: 11, color: txtSec, margin: 0, fontWeight: 400 }}>{fmtDate(admin.updatedAt)}</p>
                      </div>
                      <button className="r-btn"
                        onClick={() => setconfirmrestore({ id: admin._id, title: `${admin.firstName} ${admin.lastName}`, type: 'admin' })}
                        disabled={loading} style={rBtn(loading)}>
                        {loading ? <><Spinner />Restoring...</> : <><RestoreIcon />Restore</>}
                      </button>
                    </div>
                  </div>
                </div>
              )

              // ── Blog / Case Study card ────────────────────────────────────
              const coverImage = isBlog ? blog!.picture : cs?.cover
              const status     = (item as any).status || ''
              const title      = (item as any).title  || ''
              const author     = (item as any).author || ''
              const date       = fmtDate((item as any).updatedAt || (item as any).createdAt)
              const desc       = isBlog ? blog?.shortDescription : cs?.subtitle

              return (
                <div key={item._id} className="arc-card" style={{ ...card, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: isdarkmode ? '0 1px 4px rgba(0,0,0,.3)' : '0 1px 4px rgba(0,0,0,.06)' }}>

                  {/* Cover image with type badge overlay */}
                  <div style={{ position: 'relative', height: 160, overflow: 'hidden', flexShrink: 0, background: isdarkmode ? '#111' : '#f3f4f6' }}>
                    {coverImage && (
                      <img src={coverImage} alt={title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    )}
                    {/* Gradient overlay for readability */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)' }} />
                    {/* Type badge — top left */}
                    <div style={{ position: 'absolute', top: 10, left: 10 }}>
                      <span style={typePill(isBlog ? 'blog' : 'casestudy')}>
                        {isBlog ? 'Blog' : 'Case Study'}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>

                    {/* Title */}
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: txtPri, margin: 0, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {title}
                    </h3>

                    {/* Description */}
                    {desc && (
                      <p style={{ fontSize: 11, color: txtMut, margin: 0, fontWeight: 400, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {desc}
                      </p>
                    )}

                    {/* Author · Date */}
                    <p style={{ fontSize: 11, color: txtMut, margin: 0, fontWeight: 400 }}>
                      By <span style={{ color: txtSec, fontWeight: 500 }}>{author}</span> · {date}
                    </p>

                    {/* Category / Tags */}
                    {isBlog && blog?.mainCategory && (
                      <span style={{ fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '3px 8px', borderRadius: 5, background: isdarkmode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: txtMut, width: 'fit-content' }}>
                        {blog.mainCategory}
                      </span>
                    )}
                    {!isBlog && cs?.tags?.length ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {cs.tags.slice(0, 3).map(t => (
                          <span key={t} style={{ fontSize: 9, fontWeight: 500, padding: '2px 7px', borderRadius: 5, background: isdarkmode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: txtMut }}>
                            {t}
                          </span>
                        ))}
                        {cs.tags.length > 3 && <span style={{ fontSize: 9, color: txtMut }}>+{cs.tags.length - 3}</span>}
                      </div>
                    ) : null}

                    <div style={{ flex: 1 }} />

                    {/* Footer: status left, restore right */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${border}` }}>
                      <span style={sBadge(status)}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      <button className="r-btn"
                        onClick={() => setconfirmrestore({ id: item._id, title, type: isBlog ? 'blog' : 'casestudy' })}
                        disabled={loading} style={rBtn(loading)}>
                        {loading ? <><Spinner />Restoring...</> : <><RestoreIcon />Restore</>}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── LIST VIEW ──────────────────────────────────────────────────── */}
        {items.length > 0 && viewmode === 'list' && (
          <div style={{ ...card, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 3fr 130px 100px', gap: 16, padding: '10px 20px', borderBottom: `1px solid ${border}`, background: subtleBg, fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: txtMut }}>
              <span>Title / Name</span>
              <span>Author / Email</span>
              <span>Category / Dept</span>
              <span>Status / Role</span>
              <span style={{ textAlign: 'right' }}>Action</span>
            </div>

            {/* Rows */}
            <div>
              {items.map((item, idx) => {
                const isAdmin = item._type === 'admin'
                const isBlog  = item._type === 'blog'
                const blog    = isBlog       ? item as ArchivedBlog      & { _type: 'blog' }      : null
                const cs      = !isBlog && !isAdmin ? item as ArchivedCaseStudy & { _type: 'casestudy' } : null
                const admin   = isAdmin      ? item as ArchivedAdmin     & { _type: 'admin' }     : null
                const loading = restoringid === item._id
                const coverImage = isBlog ? blog?.picture : cs?.cover

                return (
                  <div key={item._id} className="arc-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 3fr 130px 100px', gap: 16, alignItems: 'center', padding: '13px 20px', borderBottom: idx < items.length - 1 ? `1px solid ${border}` : 'none', transition: 'background .15s' }}>

                    {/* Thumbnail + title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      {/* Thumbnail */}
                      {isAdmin && admin ? (
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#800000,#a00000)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 600, flexShrink: 0, overflow: 'hidden' }}>
                          {admin.profilePicture
                            ? <img src={admin.profilePicture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : getInitials(admin)}
                        </div>
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, overflow: 'hidden', background: isdarkmode ? '#222' : '#f3f4f6', position: 'relative' }}>
                          {coverImage && (
                            <img src={coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                          )}
                        </div>
                      )}
                      {/* Text */}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ marginBottom: 3 }}>
                          <span style={typePill(isAdmin ? 'admin' : isBlog ? 'blog' : 'casestudy')}>
                            {isAdmin ? 'Admin' : isBlog ? 'Blog' : 'Case Study'}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: txtPri, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {isAdmin && admin ? `${admin.firstName} ${admin.lastName}` : (item as any).title}
                        </p>
                        {!isAdmin && isBlog && blog?.shortDescription && (
                          <p style={{ fontSize: 10, color: txtMut, margin: '1px 0 0', fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {blog.shortDescription}
                          </p>
                        )}
                        {!isAdmin && !isBlog && cs?.subtitle && (
                          <p style={{ fontSize: 10, color: txtMut, margin: '1px 0 0', fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {cs.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Author / Email */}
                    <p style={{ fontSize: 11, color: txtMut, margin: 0, fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {isAdmin && admin ? admin.email : (item as any).author}
                    </p>

                    {/* Category / Department */}
                    <div>
                      {isAdmin && admin ? (
                        <span style={{ fontSize: 9, fontWeight: 500, padding: '3px 8px', borderRadius: 5, background: isdarkmode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: txtMut }}>
                          {getDeptIcon(admin.department)} {departments[admin.department]}
                        </span>
                      ) : isBlog && blog?.mainCategory ? (
                        <span style={{ fontSize: 9, fontWeight: 500, padding: '3px 8px', borderRadius: 5, background: isdarkmode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: txtMut }}>
                          {blog.mainCategory}
                        </span>
                      ) : cs?.tags?.length ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {cs.tags.slice(0, 2).map(t => (
                            <span key={t} style={{ fontSize: 9, fontWeight: 500, padding: '2px 6px', borderRadius: 4, background: isdarkmode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: txtMut }}>
                              {t}
                            </span>
                          ))}
                          {cs.tags.length > 2 && <span style={{ fontSize: 9, color: txtMut }}>+{cs.tags.length - 2}</span>}
                        </div>
                      ) : <span style={{ fontSize: 11, color: txtMut }}>—</span>}
                    </div>

                    {/* Status / Role */}
                    <div>
                      {isAdmin && admin
                        ? <span style={rBadge(admin.role)}>{admin.role === 1 ? 'Main Admin' : 'Admin'}</span>
                        : <span style={sBadge((item as any).status)}>
                            {((item as any).status || '').charAt(0).toUpperCase() + ((item as any).status || '').slice(1)}
                          </span>
                      }
                    </div>

                    {/* Action */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button className="r-btn"
                        onClick={() => setconfirmrestore({
                          id: item._id,
                          title: isAdmin && admin ? `${admin.firstName} ${admin.lastName}` : (item as any).title,
                          type: isAdmin ? 'admin' : isBlog ? 'blog' : 'casestudy',
                        })}
                        disabled={loading} style={{ ...rBtn(loading), padding: '6px 13px' }}>
                        {loading ? <><Spinner />Restoring...</> : <><RestoreIcon />Restore</>}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div style={{ padding: '10px 20px', borderTop: `1px solid ${border}`, background: subtleBg, fontSize: 10, color: txtMut, fontWeight: 400 }}>
              {items.length} item{items.length !== 1 ? 's' : ''} displayed
              {activefilter !== 'All' && ` · filtered by "${activefilter}"`}
              {searchquery && ` · matching "${searchquery}"`}
            </div>
          </div>
        )}
      </div>

      {/* ── CONFIRM RESTORE MODAL ──────────────────────────────────────────── */}
      {confirmrestore && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24, fontFamily: "'Poppins', sans-serif" }}>
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 20, maxWidth: 400, width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.28)', overflow: 'hidden' }}>
            <div style={{ height: 3, background: 'linear-gradient(90deg,#059669,#10b981)' }} />

            <div style={{ padding: '26px 26px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: isdarkmode ? 'rgba(5,150,105,0.12)' : 'rgba(5,150,105,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v5h5" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#059669', margin: '0 0 2px' }}>
                    Restore {confirmrestore.type === 'blog' ? 'Blog' : confirmrestore.type === 'casestudy' ? 'Case Study' : 'Admin'}
                  </p>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: txtPri, margin: 0 }}>Are you sure?</h3>
                </div>
              </div>

              <div style={{ padding: '11px 14px', borderRadius: 10, background: isdarkmode ? 'rgba(255,255,255,0.04)' : '#f9fafb', border: `1px solid ${border}`, marginBottom: 14 }}>
                <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: txtMut, margin: '0 0 3px', fontWeight: 500 }}>
                  {confirmrestore.type === 'blog' ? 'Blog Post' : confirmrestore.type === 'casestudy' ? 'Case Study' : 'Admin Account'}
                </p>
                <p style={{ fontSize: 13, fontWeight: 500, color: txtPri, margin: 0 }}>{confirmrestore.title}</p>
              </div>

              <p style={{ fontSize: 12, color: txtMut, lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
                This item will be <strong style={{ color: txtSec, fontWeight: 500 }}>restored and made active</strong> again. This action can be undone by archiving it again.
              </p>
            </div>

            <div style={{ padding: '0 26px 26px', display: 'flex', gap: 10 }}>
              <button onClick={() => setconfirmrestore(null)} disabled={!!restoringid}
                style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1px solid ${border}`, background: 'transparent', color: txtMut, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>
                Cancel
              </button>
              <button onClick={doRestore} disabled={!!restoringid}
                style={{ flex: 2, padding: '10px 0', borderRadius: 10, border: 'none', background: '#059669', color: '#fff', fontSize: 12, fontWeight: 500, cursor: restoringid ? 'not-allowed' : 'pointer', opacity: restoringid ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Poppins', sans-serif" }}>
                {restoringid
                  ? <><Spinner />Restoring...</>
                  : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v5h5" /></svg>Restore</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}