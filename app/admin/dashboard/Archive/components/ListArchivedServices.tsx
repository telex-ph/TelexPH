'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useDarkMode } from '../../layout'

type ContentType = 'Blogs' | 'CaseStudy'

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

type ArchivedItem = (ArchivedBlog & { _type: 'blog' }) | (ArchivedCaseStudy & { _type: 'casestudy' })

export default function ListArchivedServices() {
  const { isdarkmode } = useDarkMode()

  const [activefilter, setactivefilter] = useState<ContentType | 'All'>('All')
  const [searchquery, setsearchquery] = useState('')
  const [archivedblogs, setarchivedblogs] = useState<ArchivedBlog[]>([])
  const [archivedcasestudies, setarchivedcasestudies] = useState<ArchivedCaseStudy[]>([])
  const [isloading, setisloading] = useState(true)
  const [error, seterror] = useState<string | null>(null)
  const [restoringid, setrestoringid] = useState<string | null>(null)
  const [successmessage, setsuccessmessage] = useState<string | null>(null)

  // Confirm restore modal state
  const [confirmrestore, setconfirmrestore] = useState<{ id: string; title: string; type: 'blog' | 'casestudy' } | null>(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  // Fetch all archived blogs
  const fetchArchivedBlogs = useCallback(async () => {
    try {
      // Fetch all blogs including archived ones — backend must support ?includeArchived=true
      // or we fetch all and filter on client side
      const response = await fetch(`${API_BASE_URL}/blogs?includeArchived=true`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) throw new Error(`Failed to fetch blogs: ${response.status}`)

      const data = await response.json()
      // Filter only archived
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
      // Filter only archived
      const archived = data.filter((cs: ArchivedCaseStudy) => cs.isArchived === true)
      setarchivedcasestudies(archived)
    } catch (err: any) {
      console.error('Error fetching archived case studies:', err)
      throw err
    }
  }, [API_BASE_URL])

  const loadAllArchived = useCallback(async () => {
    try {
      setisloading(true)
      seterror(null)
      await Promise.all([fetchArchivedBlogs(), fetchArchivedCaseStudies()])
    } catch (err: any) {
      seterror(err.message || 'Failed to load archived items')
    } finally {
      setisloading(false)
    }
  }, [fetchArchivedBlogs, fetchArchivedCaseStudies])

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

  const handleConfirmRestore = () => {
    if (!confirmrestore) return
    if (confirmrestore.type === 'blog') {
      handleRestoreBlog(confirmrestore.id)
    } else {
      handleRestoreCaseStudy(confirmrestore.id)
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

    let items: ArchivedItem[] = []

    if (activefilter === 'All') {
      items = [...blogItems, ...caseStudyItems]
    } else if (activefilter === 'Blogs') {
      items = blogItems
    } else {
      items = caseStudyItems
    }

    // Apply search filter
    if (searchquery.trim()) {
      const q = searchquery.toLowerCase()
      items = items.filter(item => {
        const title = item.title.toLowerCase()
        const author = item.author?.toLowerCase() || ''
        return title.includes(q) || author.includes(q)
      })
    }

    return items
  }

  const filteredItems = getFilteredItems()
  const totalBlogs = archivedblogs.length
  const totalCaseStudies = archivedcasestudies.length
  const total = totalBlogs + totalCaseStudies

  const filters: { label: string; value: ContentType | 'All'; count: number }[] = [
    { label: 'All', value: 'All', count: total },
    { label: 'Blogs', value: 'Blogs', count: totalBlogs },
    { label: 'Case Studies', value: 'CaseStudy', count: totalCaseStudies },
  ]

  return (
    <div className={`min-h-screen p-6 transition-colors duration-500 ${isdarkmode ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Toast messages */}
        {successmessage && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xl text-[11px] font-semibold animate-slide-in">
            ✓ {successmessage}
          </div>
        )}
        {error && (
          <div className="fixed top-6 right-6 z-50 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-xl text-[11px] font-semibold">
            {error}
            <button onClick={() => seterror(null)} className="ml-3 underline text-[10px]">Dismiss</button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className={`text-2xl font-bold mb-1 ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>
              Archived Content
            </h1>
            <p className={`text-[10px] ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage archived blogs and case studies. Restore items to make them visible again.
            </p>
          </div>
          <button
            onClick={loadAllArchived}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] transition-colors ${
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
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-5 rounded-2xl border transition-all ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'}`}>
            <p className={`text-[9px] uppercase tracking-widest mb-2 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Total Archived</p>
            <p className={`text-3xl font-bold ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>{total}</p>
          </div>
          <div className={`p-5 rounded-2xl border transition-all ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'}`}>
            <p className={`text-[9px] uppercase tracking-widest mb-2 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Blogs</p>
            <p className={`text-3xl font-bold ${isdarkmode ? 'text-[#800000]' : 'text-[#800000]'}`}>{totalBlogs}</p>
          </div>
          <div className={`p-5 rounded-2xl border transition-all ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'}`}>
            <p className={`text-[9px] uppercase tracking-widest mb-2 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>Case Studies</p>
            <p className={`text-3xl font-bold ${isdarkmode ? 'text-amber-400' : 'text-amber-600'}`}>{totalCaseStudies}</p>
          </div>
        </div>

        {/* Filters + Search */}
        <div className={`rounded-2xl p-5 border transition-all ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'}`}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Type filter tabs */}
            <div className="flex gap-2 flex-wrap">
              {filters.map(f => (
                <button
                  key={f.value}
                  onClick={() => setactivefilter(f.value)}
                  className={`px-5 py-2 rounded-xl text-[10px] font-semibold transition-all ${
                    activefilter === f.value
                      ? 'bg-[#800000] text-white shadow-md'
                      : isdarkmode
                      ? 'bg-[#2a2a2a] text-gray-300 hover:bg-[#353535]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchquery}
                onChange={e => setsearchquery(e.target.value)}
                className={`pl-9 pr-4 py-2 rounded-xl border text-[10px] outline-none transition-all w-64 ${
                  isdarkmode
                    ? 'bg-[#252525] border-white/10 text-gray-200 placeholder-gray-500 focus:border-white/30'
                    : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#800000]'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {isloading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000]" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className={`rounded-2xl p-16 text-center border transition-all ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'}`}>
            <div className="text-6xl mb-4">📦</div>
            <h3 className={`font-bold text-lg mb-2 ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>No archived items found</h3>
            <p className={`text-[10px] ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchquery ? 'Try adjusting your search query.' : 'Archived content will appear here when you archive blogs or case studies.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map(item => {
              const isBlog = item._type === 'blog'
              const blog = isBlog ? (item as ArchivedBlog & { _type: 'blog' }) : null
              const cs = !isBlog ? (item as ArchivedCaseStudy & { _type: 'casestudy' }) : null
              const coverImage = isBlog ? blog!.picture : cs!.cover
              const isRestoring = restoringid === item._id

              return (
                <div
                  key={item._id}
                  className={`rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl flex flex-col ${
                    isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100 shadow-sm'
                  }`}
                >
                  {/* Cover image */}
                  <div className="relative h-44 overflow-hidden flex-shrink-0">
                    <img
                      src={coverImage || '/placeholder.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-75"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                    {/* Archived overlay */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="bg-amber-600/90 text-white text-[10px] font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        Archived
                      </span>
                    </div>
                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[9px] font-bold px-3 py-1 rounded-full ${
                        isBlog
                          ? 'bg-[#800000] text-white'
                          : 'bg-blue-700 text-white'
                      }`}>
                        {isBlog ? 'Blog' : 'Case Study'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className={`font-semibold text-sm mb-1 line-clamp-2 leading-snug ${isdarkmode ? 'text-gray-100' : 'text-gray-800'}`}>
                      {item.title}
                    </h3>

                    {/* Subtitle (case study) or description (blog) */}
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

                    {/* Meta info */}
                    <div className={`text-[10px] flex flex-wrap gap-2 mb-3 ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
                      <span>By {item.author}</span>
                      <span>•</span>
                      <span>{formatdate(item.updatedAt || item.createdAt)}</span>
                    </div>

                    {/* Category / tags */}
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

                    {/* Status + Restore button */}
                    <div className={`flex items-center justify-between pt-4 border-t ${isdarkmode ? 'border-white/5' : 'border-gray-100'}`}>
                      <span className={`text-[9px] font-semibold px-3 py-1 rounded-full ${getStatusStyle(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                      <button
                        onClick={() => setconfirmrestore({
                          id: item._id,
                          title: item.title,
                          type: isBlog ? 'blog' : 'casestudy',
                        })}
                        disabled={isRestoring}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-semibold transition-all ${
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
        )}
      </div>

      {/* Confirm Restore Modal */}
      {confirmrestore && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl ${isdarkmode ? 'bg-[#1f1f1f]' : 'bg-white'}`}>
            {/* Icon */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${isdarkmode ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isdarkmode ? 'text-emerald-400' : 'text-emerald-600'}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>

            <h3 className={`text-xl font-bold mb-2 ${isdarkmode ? 'text-white' : 'text-gray-900'}`}>
              Restore {confirmrestore.type === 'blog' ? 'Blog' : 'Case Study'}
            </h3>
            <p className={`mb-1 text-sm font-semibold ${isdarkmode ? 'text-gray-300' : 'text-gray-700'}`}>
              "{confirmrestore.title}"
            </p>
            <p className={`mb-8 text-[11px] ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`}>
              This {confirmrestore.type === 'blog' ? 'blog post' : 'case study'} will be restored and made visible again in the library.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setconfirmrestore(null)}
                disabled={!!restoringid}
                className={`flex-1 px-5 py-3 rounded-2xl font-semibold text-[11px] transition-colors ${
                  isdarkmode
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestore}
                disabled={!!restoringid}
                className="flex-1 px-5 py-3 bg-emerald-600 text-white rounded-2xl font-semibold text-[11px] hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {restoringid ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Restoring...
                  </>
                ) : (
                  'Restore'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}