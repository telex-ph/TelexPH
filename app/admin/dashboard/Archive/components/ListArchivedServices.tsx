'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useDarkMode } from '../../layout'

type ContentType = 'Blogs' | 'CaseStudy' | 'Admin'

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
  | (ArchivedBlog & { _type: 'blog' })
  | (ArchivedCaseStudy & { _type: 'casestudy' })
  | (ArchivedAdmin & { _type: 'admin' })

// ── Admin helpers ──────────────────────────────────────────────
const departments: { [key: number]: string } = {
  1: 'Compliance',
  2: 'Innovation',
  3: 'Marketing',
  4: 'Recruitment',
  5: 'Human Resources',
}
const roles: { [key: number]: string } = {
  1: 'Main Administrator',
  2: 'Administrator',
}
const getDepartmentIcon = (dept: number) => {
  const m: Record<number, string> = { 1: '⚖️', 2: '💡', 3: '📢', 4: '👥', 5: '🤝' }
  return m[dept] || '👤'
}
const getAdminInitials = (a: ArchivedAdmin) =>
  `${a.firstName?.charAt(0) || ''}${a.lastName?.charAt(0) || ''}`.toUpperCase()

const getRoleStyles = (role: number) => {
  switch (role) {
    case 1: return 'bg-[#800000] text-white'
    case 2: return 'bg-[#FF4500] text-white'
    default: return 'bg-gray-400 text-white'
  }
}

export default function ListArchivedServices() {
  const { isdarkmode } = useDarkMode()

  const [activefilter, setactivefilter] = useState<ContentType | 'All'>('All')
  const [searchquery, setsearchquery] = useState('')
  const [archivedblogs, setarchivedblogs] = useState<ArchivedBlog[]>([])
  const [archivedcasestudies, setarchivedcasestudies] = useState<ArchivedCaseStudy[]>([])
  const [archivedadmins, setarchivedadmins] = useState<ArchivedAdmin[]>([])
  const [isloading, setisloading] = useState(true)
  const [error, seterror] = useState<string | null>(null)
  const [restoringid, setrestoringid] = useState<string | null>(null)
  const [successmessage, setsuccessmessage] = useState<string | null>(null)
  const [currentUserRole, setcurrentUserRole] = useState<number | null>(null)

  // Confirm restore modal state — now also supports 'admin'
  const [confirmrestore, setconfirmrestore] = useState<{
    id: string
    title: string
    type: 'blog' | 'casestudy' | 'admin'
  } | null>(null)

  // View mode toggle
  const [viewmode, setviewmode] = useState<'grid' | 'list'>('grid')

  const isMainAdmin = currentUserRole === 1

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  // Fetch current user role
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Failed to fetch current user')
      const data = await response.json()
      setcurrentUserRole(data.role)
    } catch (err) {
      console.error('Error fetching current user:', err)
    }
  }, [API_BASE_URL])

  // Fetch all archived blogs
  const fetchArchivedBlogs = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs?includeArchived=true`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error(`Failed to fetch blogs: ${response.status}`)
      const data = await response.json()
      const archived = data.filter((b: ArchivedBlog) => b.isArchive === true)
      setarchivedblogs(archived)
    } catch (err: any) {
      console.error('Error fetching archived blogs:', err)
      throw err
    }
  }, [API_BASE_URL])

  // Fetch all archived case studies
  const fetchArchivedCaseStudies = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/casestudies?includeArchived=true`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error(`Failed to fetch case studies: ${response.status}`)
      const data = await response.json()
      const archived = data.filter((cs: ArchivedCaseStudy) => cs.isArchived === true)
      setarchivedcasestudies(archived)
    } catch (err: any) {
      console.error('Error fetching archived case studies:', err)
      throw err
    }
  }, [API_BASE_URL])

  // Fetch all archived admins
  const fetchArchivedAdmins = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/archived`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error(`Failed to fetch archived admins: ${response.status}`)
      const data = await response.json()
      setarchivedadmins(data)
    } catch (err: any) {
      console.error('Error fetching archived admins:', err)
      throw err
    }
  }, [API_BASE_URL])

  const loadAllArchived = useCallback(async () => {
    try {
      setisloading(true)
      seterror(null)
      // Fetch current user first so isMainAdmin is available
      await fetchCurrentUser()
      await Promise.all([fetchArchivedBlogs(), fetchArchivedCaseStudies()])
      // Only fetch archived admins if main admin — backend also enforces this
      const userRes = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (userRes.ok) {
        const userData = await userRes.json()
        if (userData.role === 1) {
          await fetchArchivedAdmins()
        }
      }
    } catch (err: any) {
      seterror(err.message || 'Failed to load archived items')
    } finally {
      setisloading(false)
    }
  }, [fetchCurrentUser, fetchArchivedBlogs, fetchArchivedCaseStudies, fetchArchivedAdmins, API_BASE_URL])

  useEffect(() => {
    loadAllArchived()
  }, [loadAllArchived])

  // Auto-dismiss success message
  useEffect(() => {
    if (successmessage) {
      const timer = setTimeout(() => setsuccessmessage(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [successmessage])

  // Restore blog
  const handleRestoreBlog = async (id: string) => {
    try {
      setrestoringid(id)
      const response = await fetch(`${API_BASE_URL}/blogs/${id}/restore`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to restore blog')
      }
      setarchivedblogs(prev => prev.filter(b => b._id !== id))
      setsuccessmessage('Blog restored successfully!')
      setconfirmrestore(null)
    } catch (err: any) {
      seterror(err.message || 'Failed to restore blog')
    } finally {
      setrestoringid(null)
    }
  }

  // Restore case study
  const handleRestoreCaseStudy = async (id: string) => {
    try {
      setrestoringid(id)
      const response = await fetch(`${API_BASE_URL}/casestudies/${id}/restore`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to restore case study')
      }
      setarchivedcasestudies(prev => prev.filter(cs => cs._id !== id))
      setsuccessmessage('Case study restored successfully!')
      setconfirmrestore(null)
    } catch (err: any) {
      seterror(err.message || 'Failed to restore case study')
    } finally {
      setrestoringid(null)
    }
  }

  // Restore admin
  const handleRestoreAdmin = async (id: string) => {
    try {
      setrestoringid(id)
      const response = await fetch(`${API_BASE_URL}/users/${id}/restore`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to restore admin')
      }
      setarchivedadmins(prev => prev.filter(a => a._id !== id))
      setsuccessmessage('Admin account restored successfully!')
      setconfirmrestore(null)
    } catch (err: any) {
      seterror(err.message || 'Failed to restore admin')
    } finally {
      setrestoringid(null)
    }
  }

  const handleConfirmRestore = () => {
    if (!confirmrestore) return
    if (confirmrestore.type === 'blog') {
      handleRestoreBlog(confirmrestore.id)
    } else if (confirmrestore.type === 'casestudy') {
      handleRestoreCaseStudy(confirmrestore.id)
    } else {
      handleRestoreAdmin(confirmrestore.id)
    }
  }

  const formatdate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
      case 'active':
        return isdarkmode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
      case 'draft':
        return isdarkmode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'
      case 'scheduled':
        return isdarkmode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'
      case 'completed':
        return isdarkmode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
      default:
        return isdarkmode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-500'
    }
  }

  // Merge and filter items based on active filter and search
  const getFilteredItems = (): ArchivedItem[] => {
    let blogItems: ArchivedItem[] = archivedblogs.map(b => ({ ...b, _type: 'blog' as const }))
    let caseStudyItems: ArchivedItem[] = archivedcasestudies.map(cs => ({ ...cs, _type: 'casestudy' as const }))
    let adminItems: ArchivedItem[] = archivedadmins.map(a => ({ ...a, _type: 'admin' as const }))

    let items: ArchivedItem[] = []

    if (activefilter === 'All') {
      items = [...blogItems, ...caseStudyItems]
    } else if (activefilter === 'Blogs') {
      items = blogItems
    } else if (activefilter === 'CaseStudy') {
      items = caseStudyItems
    } else {
      items = adminItems
    }

    // Apply search filter
    if (searchquery.trim()) {
      const q = searchquery.toLowerCase()
      items = items.filter(item => {
        if (item._type === 'admin') {
          const admin = item as ArchivedAdmin & { _type: 'admin' }
          return (
            `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(q) ||
            admin.email.toLowerCase().includes(q) ||
            (departments[admin.department] || '').toLowerCase().includes(q)
          )
        }
        const titled = item as (ArchivedBlog | ArchivedCaseStudy) & { _type: string }
        const title = (titled as any).title?.toLowerCase() || ''
        const author = (titled as any).author?.toLowerCase() || ''
        return title.includes(q) || author.includes(q)
      })
    }

    return items
  }

  const filteredItems = getFilteredItems()
  const totalBlogs = archivedblogs.length
  const totalCaseStudies = archivedcasestudies.length
  const totalAdmins = archivedadmins.length

  const filters: { label: string; value: ContentType | 'All'; count: number }[] = [
    { label: 'All', value: 'All', count: totalBlogs + totalCaseStudies },
    { label: 'Blogs', value: 'Blogs', count: totalBlogs },
    { label: 'Case Studies', value: 'CaseStudy', count: totalCaseStudies },
    ...(isMainAdmin ? [{ label: 'Admins', value: 'Admin' as ContentType, count: totalAdmins }] : []),
  ]

  return (
    <div className={`min-h-screen p-8 transition-colors duration-500 ${isdarkmode ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'}`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Toast messages */}
        {successmessage && (
          <div className="fixed top-8 right-8 z-50 bg-emerald-600 text-white px-8 py-5 rounded-[1.5rem] shadow-2xl text-[11px] bold-text animate-slide-in border-2 border-emerald-500/20">
            ✓ {successmessage}
          </div>
        )}
        {error && (
          <div className="fixed top-8 right-8 z-50 bg-red-600 text-white px-8 py-5 rounded-[1.5rem] shadow-2xl text-[11px] bold-text border-2 border-red-500/20">
            {error}
            <button onClick={() => seterror(null)} className="ml-3 underline text-[10px]">Dismiss</button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className={`text-2xl bold-text tracking-tight transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
              Archived Content
            </h1>
            <p className={`text-[11px] mt-1 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
              Manage archived blogs, case studies, and admin accounts. Restore items to make them visible again.
            </p>
          </div>
          <button
            onClick={loadAllArchived}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[1rem] text-[10px] bold-text transition-colors ${
              isdarkmode
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className={`grid gap-4 ${isMainAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <div className={`p-6 rounded-[2rem] shadow-sm border transition-all hover:shadow-md ${
            isdarkmode
              ? 'bg-gradient-to-br from-gray-800/40 to-transparent border-white/5'
              : 'bg-gradient-to-br from-gray-50 to-white border-gray-50'
          }`}>
            <p className={`text-[9px] uppercase tracking-widest mb-3 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Total Archived</p>
            <p className={`text-3xl bold-text transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>{totalBlogs + totalCaseStudies + (isMainAdmin ? totalAdmins : 0)}</p>
          </div>
          <div className={`p-6 rounded-[2rem] shadow-sm border transition-all hover:shadow-md ${
            isdarkmode
              ? 'bg-gradient-to-br from-red-900/40 to-transparent border-white/5'
              : 'bg-gradient-to-br from-red-50 to-white border-gray-50'
          }`}>
            <p className={`text-[9px] uppercase tracking-widest mb-3 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Blogs</p>
            <p className={`text-3xl bold-text transition-colors ${isdarkmode ? 'text-red-300' : 'text-[#800000]'}`}>{totalBlogs}</p>
          </div>
          <div className={`p-6 rounded-[2rem] shadow-sm border transition-all hover:shadow-md ${
            isdarkmode
              ? 'bg-gradient-to-br from-amber-900/40 to-transparent border-white/5'
              : 'bg-gradient-to-br from-amber-50 to-white border-gray-50'
          }`}>
            <p className={`text-[9px] uppercase tracking-widest mb-3 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Case Studies</p>
            <p className={`text-3xl bold-text transition-colors ${isdarkmode ? 'text-amber-300' : 'text-amber-700'}`}>{totalCaseStudies}</p>
          </div>
          {isMainAdmin && (
            <div className={`p-6 rounded-[2rem] shadow-sm border transition-all hover:shadow-md ${
              isdarkmode
                ? 'bg-gradient-to-br from-blue-900/40 to-transparent border-white/5'
                : 'bg-gradient-to-br from-blue-50 to-white border-gray-50'
            }`}>
              <p className={`text-[9px] uppercase tracking-widest mb-3 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Admins</p>
              <p className={`text-3xl bold-text transition-colors ${isdarkmode ? 'text-blue-300' : 'text-blue-800'}`}>{totalAdmins}</p>
            </div>
          )}
        </div>

        {/* Filters + Search */}
        <div className={`rounded-[1.5rem] p-6 border transition-all duration-500 ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="space-y-6">
            {/* Type filter tabs — "Quick Links" */}
            <div>
              <p className={`text-[9px] uppercase tracking-widest mb-3 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                Filter by Type
              </p>
              <div className="flex gap-2 flex-wrap">
                {filters.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setactivefilter(f.value)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] bold-text transition-all ${
                      activefilter === f.value
                        ? 'bg-[#800000] text-white shadow-md'
                        : isdarkmode
                        ? 'text-gray-400 hover:bg-white/5'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {f.label} ({f.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Search + View toggle */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={activefilter === 'Admin' ? 'Search by name or email...' : 'Search by title or author...'}
                  value={searchquery}
                  onChange={e => setsearchquery(e.target.value)}
                  className={`w-full pl-10 pr-5 py-3 rounded-[1rem] border-2 transition-all duration-300 text-[11px] ${
                    isdarkmode
                      ? 'bg-[#202020] border-white/10 text-gray-300 placeholder-gray-500 focus:border-white/30'
                      : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-gray-400'
                  } focus:outline-none`}
                />
              </div>

              {/* View mode toggle */}
              <div className={`flex items-center rounded-[1rem] p-1 gap-0.5 ${isdarkmode ? 'bg-[#202020]' : 'bg-gray-100'}`}>
                <button
                  onClick={() => setviewmode('grid')}
                  title="Grid view"
                  className={`p-2 rounded-[0.75rem] transition-all ${
                    viewmode === 'grid'
                      ? 'bg-[#800000] text-white shadow-sm'
                      : isdarkmode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={2} />
                    <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={2} />
                    <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={2} />
                    <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={2} />
                  </svg>
                </button>
                <button
                  onClick={() => setviewmode('list')}
                  title="List view"
                  className={`p-2 rounded-[0.75rem] transition-all ${
                    viewmode === 'list'
                      ? 'bg-[#800000] text-white shadow-sm'
                      : isdarkmode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <line x1="3" y1="6" x2="21" y2="6" strokeWidth={2} strokeLinecap="round" />
                    <line x1="3" y1="12" x2="21" y2="12" strokeWidth={2} strokeLinecap="round" />
                    <line x1="3" y1="18" x2="21" y2="18" strokeWidth={2} strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {isloading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#800000] border-t-transparent" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className={`rounded-[2rem] p-16 text-center border transition-all duration-500 ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'}`}>
            <div className="text-6xl mb-4">📦</div>
            <h3 className={`bold-text text-lg mb-2 transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>No archived items found</h3>
            <p className={`text-[10px] transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchquery ? 'Try adjusting your search query.' : 'Archived content will appear here.'}
            </p>
          </div>
        ) : viewmode === 'grid' ? (

          /* ── GRID VIEW ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map(item => {
              const isAdmin = item._type === 'admin'
              const isBlog = item._type === 'blog'
              const blog = isBlog ? (item as ArchivedBlog & { _type: 'blog' }) : null
              const cs = item._type === 'casestudy' ? (item as ArchivedCaseStudy & { _type: 'casestudy' }) : null
              const admin = isAdmin ? (item as ArchivedAdmin & { _type: 'admin' }) : null
              const coverImage = isBlog ? blog!.picture : cs?.cover
              const isRestoring = restoringid === item._id

              // ── Admin card ──
              if (isAdmin && admin) {
                return (
                  <div
                    key={item._id}
                    className={`rounded-[2rem] overflow-hidden border transition-all duration-300 hover:shadow-xl flex flex-col ${
                      isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100 shadow-sm'
                    }`}
                  >
                    {/* Top accent strip */}
                    <div className="h-1 w-full bg-gradient-to-r from-[#800000] via-[#a00000] to-[#600000]" />

                    <div className="p-5 flex flex-col flex-grow">
                      {/* Avatar + type badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#800000] flex items-center justify-center text-white font-bold text-sm uppercase overflow-hidden shadow-md">
                          {admin.profilePicture ? (
                            <img src={admin.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            getAdminInitials(admin)
                          )}
                        </div>
                        <span className="text-[9px] font-bold px-3 py-1 rounded-full bg-blue-700 text-white">
                          Admin
                        </span>
                      </div>

                      {/* Name & email */}
                      <h3 className={`bold-text text-sm mb-0.5 leading-snug transition-colors ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {admin.firstName} {admin.lastName}
                      </h3>
                      <p className={`text-[10px] mb-3 transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {admin.email}
                      </p>

                      {/* Role */}
                      <span className={`text-[9px] bold-text px-3 py-1 rounded-full w-fit mb-3 ${getRoleStyles(admin.role)}`}>
                        {roles[admin.role]}
                      </span>

                      {/* Department */}
                      <p className={`text-[10px] mb-1 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {getDepartmentIcon(admin.department)} {departments[admin.department]}
                      </p>

                      <div className="flex-grow" />

                      {/* Archived date + restore */}
                      <div className={`flex items-center justify-between pt-4 border-t ${isdarkmode ? 'border-white/5' : 'border-gray-100'}`}>
                        <div>
                          <p className={`text-[8px] uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-600' : 'text-gray-400'}`}>Archived</p>
                          <p className={`text-[10px] transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatdate(admin.updatedAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => setconfirmrestore({
                            id: admin._id,
                            title: `${admin.firstName} ${admin.lastName}`,
                            type: 'admin',
                          })}
                          disabled={isRestoring}
                          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-[1rem] text-[10px] bold-text transition-all ${
                            isRestoring
                              ? 'opacity-50 cursor-not-allowed bg-emerald-600 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md'
                          }`}
                        >
                          {isRestoring ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Restoring...
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Restore
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }

              // ── Blog / Case Study card ──
              return (
                <div
                  key={item._id}
                  className={`rounded-[2rem] overflow-hidden border transition-all duration-300 hover:shadow-xl flex flex-col ${
                    isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100 shadow-sm'
                  }`}
                >
                  {/* Cover image */}
                  <div className="relative h-44 overflow-hidden flex-shrink-0">
                    <img
                      src={coverImage || '/placeholder.jpg'}
                      alt={(item as any).title}
                      className="w-full h-full object-cover opacity-75"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[9px] font-bold px-3 py-1 rounded-full ${
                        isBlog ? 'bg-[#800000] text-white' : 'bg-blue-700 text-white'
                      }`}>
                        {isBlog ? 'Blog' : 'Case Study'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className={`bold-text text-sm mb-1 line-clamp-2 leading-snug transition-colors ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>
                      {(item as any).title}
                    </h3>

                    {isBlog && blog?.shortDescription && (
                      <p className={`text-[10px] mb-3 line-clamp-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {blog.shortDescription}
                      </p>
                    )}
                    {!isBlog && cs?.subtitle && (
                      <p className={`text-[10px] mb-3 line-clamp-2 ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {cs.subtitle}
                      </p>
                    )}

                    <div className={`text-[10px] flex flex-wrap gap-2 mb-3 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                      <span>By {(item as any).author}</span>
                      <span>•</span>
                      <span>{formatdate((item as any).updatedAt || (item as any).createdAt)}</span>
                    </div>

                    {isBlog && blog?.mainCategory && (
                      <p className={`text-[9px] mb-3 px-3 py-1 rounded-full w-fit ${
                        isdarkmode ? 'bg-[#2a2a2a] text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {blog.mainCategory}
                      </p>
                    )}
                    {!isBlog && cs && cs.tags && cs.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {cs.tags.map(tag => (
                          <span key={tag} className={`text-[9px] px-2 py-0.5 rounded-full ${
                            isdarkmode ? 'bg-[#2a2a2a] text-gray-400' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex-grow" />

                    <div className={`flex items-center justify-between pt-4 border-t ${isdarkmode ? 'border-white/5' : 'border-gray-100'}`}>
                      <span className={`text-[9px] bold-text px-3 py-1 rounded-full ${getStatusStyle((item as any).status)}`}>
                        {(item as any).status?.charAt(0).toUpperCase() + (item as any).status?.slice(1)}
                      </span>
                      <button
                        onClick={() => setconfirmrestore({
                          id: item._id,
                          title: (item as any).title,
                          type: isBlog ? 'blog' : 'casestudy',
                        })}
                        disabled={isRestoring}
                        className={`flex items-center gap-1.5 px-5 py-2.5 rounded-[1rem] text-[10px] bold-text transition-all ${
                          isRestoring
                            ? 'opacity-50 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md'
                        }`}
                      >
                        {isRestoring ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Restoring...
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Restore
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        ) : (

          /* ── LIST VIEW ── */
          <div className={`rounded-[2rem] border overflow-hidden shadow-xl transition-all duration-500 ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'}`}>
            {/* List header */}
            <div className={`grid grid-cols-12 px-8 py-5 text-[9px] bold-text uppercase tracking-widest border-b ${
              isdarkmode ? 'bg-[#202020] border-white/5 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}>
              <div className="col-span-1" />
              <div className="col-span-4">Title / Name</div>
              <div className="col-span-2">Author / Email</div>
              <div className="col-span-2">Category / Dept</div>
              <div className="col-span-1">Status / Role</div>
              <div className="col-span-1">Archived</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* List rows */}
            <div className={`divide-y ${isdarkmode ? 'divide-white/5' : 'divide-gray-100'}`}>
              {filteredItems.map(item => {
                const isAdmin = item._type === 'admin'
                const isBlog = item._type === 'blog'
                const blog = isBlog ? (item as ArchivedBlog & { _type: 'blog' }) : null
                const cs = item._type === 'casestudy' ? (item as ArchivedCaseStudy & { _type: 'casestudy' }) : null
                const admin = isAdmin ? (item as ArchivedAdmin & { _type: 'admin' }) : null
                const coverImage = isBlog ? blog!.picture : cs?.cover
                const isRestoring = restoringid === item._id

                return (
                  <div
                    key={item._id}
                    className={`grid grid-cols-12 items-center px-8 py-5 gap-3 transition-colors ${
                      isdarkmode ? 'hover:bg-[#202020]' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Thumbnail / Avatar */}
                    <div className="col-span-1">
                      {isAdmin && admin ? (
                        <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center text-white text-[10px] font-bold uppercase overflow-hidden">
                          {admin.profilePicture ? (
                            <img src={admin.profilePicture} alt="" className="w-full h-full object-cover" />
                          ) : (
                            getAdminInitials(admin)
                          )}
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                          <img
                            src={coverImage || '/placeholder.jpg'}
                            alt={(item as any).title}
                            className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Title + type badge */}
                    <div className="col-span-4 min-w-0">
                      <div className="mb-1">
                        <span className={`text-[9px] font-bold px-3 py-1 rounded-full ${
                          isAdmin ? 'bg-blue-700 text-white' : isBlog ? 'bg-[#800000] text-white' : 'bg-blue-700 text-white'
                        }`}>
                          {isAdmin ? 'Admin' : isBlog ? 'Blog' : 'Case Study'}
                        </span>
                      </div>
                      <p className={`text-xs bold-text leading-snug line-clamp-1 transition-colors ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {isAdmin && admin
                          ? `${admin.firstName} ${admin.lastName}`
                          : (item as any).title
                        }
                      </p>
                      {!isAdmin && isBlog && blog?.shortDescription && (
                        <p className={`text-[10px] line-clamp-1 mt-0.5 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {blog.shortDescription}
                        </p>
                      )}
                      {!isAdmin && !isBlog && cs?.subtitle && (
                        <p className={`text-[10px] line-clamp-1 mt-0.5 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {cs.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Author / Email */}
                    <div className={`col-span-2 text-[10px] truncate ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {isAdmin && admin ? admin.email : (item as any).author}
                    </div>

                    {/* Category / Department */}
                    <div className="col-span-2">
                      {isAdmin && admin ? (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full block w-fit truncate max-w-full ${
                          isdarkmode ? 'bg-[#2a2a2a] text-gray-400' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {getDepartmentIcon(admin.department)} {departments[admin.department]}
                        </span>
                      ) : isBlog && blog?.mainCategory ? (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full block w-fit truncate max-w-full ${
                          isdarkmode ? 'bg-[#2a2a2a] text-gray-400' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {blog.mainCategory}
                        </span>
                      ) : !isAdmin && !isBlog && cs && cs.tags && cs.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {cs.tags.slice(0, 2).map(tag => (
                            <span key={tag} className={`text-[9px] px-2 py-0.5 rounded-full ${
                              isdarkmode ? 'bg-[#2a2a2a] text-gray-400' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {tag}
                            </span>
                          ))}
                          {cs.tags.length > 2 && (
                            <span className={`text-[9px] ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                              +{cs.tags.length - 2}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>

                    {/* Status / Role */}
                    <div className="col-span-1">
                      {isAdmin && admin ? (
                        <span className={`text-[9px] bold-text px-2.5 py-1 rounded-full whitespace-nowrap ${getRoleStyles(admin.role)}`}>
                          {admin.role === 1 ? 'Main' : 'Admin'}
                        </span>
                      ) : (
                        <span className={`text-[9px] bold-text px-2.5 py-1 rounded-full whitespace-nowrap ${getStatusStyle((item as any).status)}`}>
                          {(item as any).status?.charAt(0).toUpperCase() + (item as any).status?.slice(1)}
                        </span>
                      )}
                    </div>

                    {/* Archived date */}
                    <div className={`col-span-1 text-[10px] transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatdate((item as any).updatedAt || (item as any).createdAt)}
                    </div>

                    {/* Restore button */}
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => setconfirmrestore({
                          id: item._id,
                          title: isAdmin && admin
                            ? `${admin.firstName} ${admin.lastName}`
                            : (item as any).title,
                          type: isAdmin ? 'admin' : isBlog ? 'blog' : 'casestudy',
                        })}
                        disabled={isRestoring}
                        className={`flex items-center gap-1 px-4 py-2 rounded-[1rem] text-[10px] bold-text transition-all flex-shrink-0 ${
                          isRestoring
                            ? 'opacity-50 cursor-not-allowed bg-emerald-600 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md'
                        }`}
                      >
                        {isRestoring ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        )}
                        {isRestoring ? 'Restoring...' : 'Restore'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        )}
      </div>

      {/* Confirm Restore Modal */}
      {confirmrestore && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-8">
          <div className={`relative rounded-[2.5rem] max-w-sm w-full shadow-2xl overflow-hidden transition-all duration-500 ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>

            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />

            {/* Top section with icon + type label */}
            <div className={`px-10 pt-10 pb-6 ${isdarkmode ? 'border-b border-white/5' : 'border-b border-gray-100'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 ${isdarkmode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="text-emerald-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v5h5" />
                  </svg>
                </div>
                <div>
                  <p className={`text-[10px] bold-text uppercase tracking-widest mb-0.5 ${isdarkmode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    Restore {confirmrestore.type === 'blog' ? 'Blog' : confirmrestore.type === 'casestudy' ? 'Case Study' : 'Admin'}
                  </p>
                  <h3 className={`text-base bold-text leading-tight transition-colors ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>
                    Are you sure?
                  </h3>
                </div>
              </div>
            </div>

            {/* Content section */}
            <div className="px-10 py-6">
              <div className={`rounded-[1.5rem] px-5 py-4 mb-4 ${isdarkmode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <p className={`text-[9px] uppercase tracking-widest bold-text mb-1 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {confirmrestore.type === 'blog' ? 'Blog Post' : confirmrestore.type === 'casestudy' ? 'Case Study' : 'Admin Account'}
                </p>
                <p className={`text-xs bold-text line-clamp-2 leading-snug transition-colors ${isdarkmode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {confirmrestore.title}
                </p>
              </div>
              <p className={`text-[11px] leading-relaxed transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
                This item will be <span className={`bold-text ${isdarkmode ? 'text-gray-200' : 'text-gray-700'}`}>restored and made active</span> again. This action can be undone by archiving it again.
              </p>
            </div>

            {/* Actions */}
            <div className="px-10 pb-10 flex gap-3">
              <button
                onClick={() => setconfirmrestore(null)}
                disabled={!!restoringid}
                className={`flex-1 py-3.5 rounded-[1.25rem] bold-text text-[11px] transition-all disabled:opacity-50 ${
                  isdarkmode
                    ? 'bg-white/8 text-gray-300 hover:bg-white/15 border border-white/10'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestore}
                disabled={!!restoringid}
                className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white rounded-[1.25rem] bold-text text-[11px] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
              >
                {restoringid ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v5h5" />
                    </svg>
                    Restore
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}