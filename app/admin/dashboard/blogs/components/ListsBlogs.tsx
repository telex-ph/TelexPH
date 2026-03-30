'use client'

import React, { useState, useEffect } from 'react'
import EditBlogs from './EditBlogs'
import { useDarkMode } from '../../layout'

export default function ListBlogs() {
  const [blogs, setblogs] = useState<any[]>([]);
  const [activetab, setactivetab] = useState('All');
  const [viewmode, setviewmode] = useState<'grid' | 'list'>('grid');
  const [blogtoarchive, setblogtoarchive] = useState<string | null>(null);

  const [isediting, setisediting] = useState(false);
  const [selectedblog, setselectedblog] = useState<any>(null);

  const [viewingblog, setviewingblog] = useState<any>(null);

  const [currentpage, setcurrentpage] = useState(1);
  const cardsperpage = 6;

  const [isloading, setisloading] = useState(true);
  const [error, seterror] = useState<string | null>(null);

  const [selectedmaincategory, setselectedmaincategory] = useState<string>('All');
  const [selectedsubcategory, setselectedsubcategory] = useState<string>('All');

  const { isdarkmode } = useDarkMode();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://telexph-admin.onrender.com/api';

  const categories = {
    'Main Service Categories': [
      'Customer Experience (CX)',
      'Back Office Solutions',
      'Virtual Assistance',
      'Sales & Lead Generation'
    ],
    'Industry-Specific Insights': [
      'E-commerce Support',
      'Real Estate Outsourcing',
      'Healthcare BPO',
      'Tech & SaaS Scaling'
    ],
    'Business Growth & Strategy': [
      'Scale Smarter',
      'Outsourcing 101',
      'Cost Optimization'
    ],
    'Company Culture & Updates': [
      'TelexPH Life',
      'News & Press Releases'
    ]
  };

  const mainCategories = Object.keys(categories);

  const statusTabs = [
    { label: 'All', value: 'All' },
    { label: 'Published', value: 'Published' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Scheduled', value: 'Scheduled' },
  ];

  const getAvailableSubcategories = () => {
    if (selectedmaincategory === 'All') {
      return Object.values(categories).flat();
    }
    return categories[selectedmaincategory as keyof typeof categories] || [];
  };

  const loadblogs = async () => {
    try {
      setisloading(true);
      seterror(null);

      const queryParams = new URLSearchParams();

      if (selectedmaincategory !== 'All') {
        queryParams.append('mainCategory', selectedmaincategory);
      }

      if (selectedsubcategory !== 'All') {
        queryParams.append('subcategory', selectedsubcategory);
      }

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/blogs${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized - Please login again');
        throw new Error(`Failed to fetch blogs: ${response.status}`);
      }

      const data = await response.json();
      const activeblogs = data.filter((b: any) => b.isArchive !== true);
      setblogs(activeblogs);
    } catch (err: any) {
      console.error('Error loading blogs:', err);
      seterror(err.message || 'Failed to load blogs. Please try again later.');
      setblogs([]);
    } finally {
      setisloading(false);
    }
  };

  useEffect(() => { loadblogs(); }, [selectedmaincategory, selectedsubcategory]);
  useEffect(() => { setcurrentpage(1); }, [activetab, selectedmaincategory, selectedsubcategory]);
  useEffect(() => {
    if (selectedmaincategory !== 'All') {
      const availableSubcategories = getAvailableSubcategories();
      if (selectedsubcategory !== 'All' && !availableSubcategories.includes(selectedsubcategory)) {
        setselectedsubcategory('All');
      }
    }
  }, [selectedmaincategory]);

  const getstatusstyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'bg-[#800000] text-white';
      case 'scheduled': return 'bg-[#FF4500] text-white';
      case 'draft': return 'bg-[#ca8a04] text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const formatdate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculatereadingtime = (content: any[]) => {
    if (!content || !Array.isArray(content)) return 5;
    const totalwords = content.reduce((acc, section) => {
      return acc + (section.content || '').split(/\s+/).length;
    }, 0);
    return Math.max(1, Math.ceil(totalwords / 200));
  };

  const getCategoryIcon = (mainCategory: string) => {
    const iconMap: Record<string, string> = {
      'Main Service Categories': '🎯',
      'Industry-Specific Insights': '💼',
      'Business Growth & Strategy': '📈',
      'Company Culture & Updates': '🏢',
    };
    return iconMap[mainCategory] || '📝';
  };

  const filteredblogs = activetab === 'All'
    ? blogs
    : blogs.filter(blog => (blog.status || '').toLowerCase() === activetab.toLowerCase());

  const totalPages = Math.ceil(filteredblogs.length / cardsperpage);
  const indexOfLastCard = currentpage * cardsperpage;
  const indexOfFirstCard = indexOfLastCard - cardsperpage;
  const currentblogs = filteredblogs.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (pageNumber: number) => {
    setcurrentpage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleedit = (blog: any) => { setselectedblog(blog); setisediting(true); };
  const closeeditmodal = () => { setisediting(false); setselectedblog(null); };
  const handleview = (blog: any) => { setviewingblog(blog); };
  const closeviewmodal = () => { setviewingblog(null); };

  const handlearchive = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}/archive`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to archive blog');
      await loadblogs();
      setblogtoarchive(null);
    } catch (err: any) {
      console.error('Error archiving blog:', err);
      alert(err.message || 'Failed to archive blog');
    }
  };

  const confirmarchive = (id: string) => { setblogtoarchive(id); };
  const cancelarchive = () => { setblogtoarchive(null); };

  if (isediting && selectedblog) {
    return <EditBlogs blog={selectedblog} onClose={closeeditmodal} onSave={loadblogs} />;
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        *, *::before, *::after {
          font-family: 'Poppins', sans-serif !important;
          -webkit-font-smoothing: antialiased;
        }

        /* Force Poppins on native form elements (browsers often ignore inheritance) */
        input, textarea, button, select, option,
        input::placeholder, textarea::placeholder {
          font-family: 'Poppins', sans-serif !important;
        }

        /* Webkit/Blink specific override for select */
        select::-webkit-input-placeholder { font-family: 'Poppins', sans-serif !important; }

        /* Firefox override */
        @-moz-document url-prefix() {
          select, option { font-family: 'Poppins', sans-serif !important; }
        }
      `}</style>

      <div className={`flex flex-col items-start justify-start p-8 space-y-8 min-h-screen transition-colors duration-500 ${isdarkmode ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'}`}>

        {/* Error Message */}
        {error && (
          <div className="fixed top-8 right-8 bg-red-600 text-white px-8 py-5 rounded-[1.5rem] shadow-2xl z-50 border-2 border-red-500/20" style={{ fontSize: 12, fontWeight: 500 }}>
            {error}
            <button onClick={loadblogs} className="ml-4 underline">Retry</button>
          </div>
        )}

        {/* Header */}
        <div className="w-full max-w-7xl mx-auto space-y-2">
          <h2 className={`tracking-tight transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`} style={{ fontSize: 18, fontWeight: 500 }}>
            Blog Management
          </h2>
          <p className={`mt-1 transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`} style={{ fontSize: 12, fontWeight: 400 }}>
            Manage and organize your blog posts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {/* Total Blogs */}
          <div className={`relative p-6 rounded-2xl border transition-all hover:shadow-md ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'}`} style={{ boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-start justify-between mb-4">
              <p className={`transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontSize: 13, fontWeight: 400 }}>Total blogs</p>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isdarkmode ? 'bg-white/10' : 'bg-gray-100'}`}>
                <svg className={`w-4 h-4 ${isdarkmode ? 'text-gray-300' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className={`mb-1 transition-colors ${isdarkmode ? 'text-white' : 'text-gray-900'}`} style={{ fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{blogs.length}</p>
            <p className={`transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`} style={{ fontSize: 11, fontWeight: 400 }}>{blogs.filter(b => b.status?.toLowerCase() === 'published').length + blogs.filter(b => b.status?.toLowerCase() === 'draft').length} active posts</p>
          </div>

          {/* Published */}
          <div className={`relative p-6 rounded-2xl border transition-all hover:shadow-md ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'}`} style={{ boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-start justify-between mb-4">
              <p className={`transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontSize: 13, fontWeight: 400 }}>Published</p>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isdarkmode ? 'bg-white/10' : 'bg-gray-100'}`}>
                <svg className={`w-4 h-4 ${isdarkmode ? 'text-gray-300' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <p className={`mb-1 transition-colors ${isdarkmode ? 'text-white' : 'text-gray-900'}`} style={{ fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{blogs.filter(b => b.status?.toLowerCase() === 'published').length}</p>
            <p className={`transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`} style={{ fontSize: 11, fontWeight: 400 }}>Live on the website</p>
          </div>

          {/* Draft */}
          <div className={`relative p-6 rounded-2xl border transition-all hover:shadow-md ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'}`} style={{ boxShadow: isdarkmode ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-start justify-between mb-4">
              <p className={`transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontSize: 13, fontWeight: 400 }}>Draft</p>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isdarkmode ? 'bg-white/10' : 'bg-gray-100'}`}>
                <svg className={`w-4 h-4 ${isdarkmode ? 'text-gray-300' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <p className={`mb-1 transition-colors ${isdarkmode ? 'text-white' : 'text-gray-900'}`} style={{ fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{blogs.filter(b => b.status?.toLowerCase() === 'draft').length}</p>
            <p className={`transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`} style={{ fontSize: 11, fontWeight: 400 }}>Unpublished drafts</p>
          </div>

          {/* Scheduled — dark accent card (last) */}
          <div className="relative p-6 rounded-2xl border border-transparent transition-all hover:shadow-xl" style={{ background: isdarkmode ? '#2a3a2a' : '#2d4a35', boxShadow: '0 4px 20px rgba(45,74,53,0.3)' }}>
            <div className="flex items-start justify-between mb-4">
              <p className="text-white/80" style={{ fontSize: 13, fontWeight: 400 }}>Scheduled</p>
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/15">
                {/* wavy line icon like the image */}
                <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3M4 16c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3" />
                </svg>
              </div>
            </div>
            <p className="text-white mb-1" style={{ fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{blogs.filter(b => b.status?.toLowerCase() === 'scheduled').length}</p>
            <p className="text-white/60" style={{ fontSize: 11, fontWeight: 400 }}>Queued for publishing</p>
          </div>
        </div>

        {/* Filters */}
        <div className="w-full max-w-7xl mx-auto">
          <div
            className={`rounded-2xl border transition-all duration-500 overflow-hidden ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'}`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >

            {/* ── Row 1: Status tabs ── */}
            <div className={`flex flex-wrap items-center gap-1 px-6 py-4 border-b ${isdarkmode ? 'border-white/5' : 'border-gray-100'}`}>
              <span style={{ fontSize: 11, fontWeight: 500, fontFamily: "'Poppins', sans-serif", color: isdarkmode ? '#6b7280' : '#9ca3af', marginRight: 12 }}>
                Filter by Status
              </span>
              {statusTabs.map(tab => {
                const count = tab.value === 'All' ? blogs.length : blogs.filter(b => b.status?.toLowerCase() === tab.value.toLowerCase()).length;
                const isActive = activetab === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setactivetab(tab.value)}
                    style={{
                      fontSize: 12,
                      fontWeight: isActive ? 500 : 400,
                      fontFamily: "'Poppins', sans-serif",
                      letterSpacing: 0,
                      padding: '5px 14px',
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: isActive ? '#800000' : 'transparent',
                      color: isActive ? '#ffffff' : isdarkmode ? '#9ca3af' : '#6b7280',
                      boxShadow: isActive ? '0 2px 8px rgba(128,0,0,0.3)' : 'none',
                    }}
                  >
                    {tab.label} ({count})
                  </button>
                );
              })}
            </div>

            {/* ── Row 2: Category dropdowns + View toggle ── */}
            <div className={`flex flex-wrap items-end gap-4 px-6 py-4`}>

              {/* Main Category */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, fontFamily: "'Poppins', sans-serif", letterSpacing: 0, color: isdarkmode ? '#6b7280' : '#9ca3af', marginBottom: 6 }}>
                  Filter by Main Category
                </label>
                <select
                  value={selectedmaincategory}
                  onChange={(e) => setselectedmaincategory(e.target.value)}
                  style={{
                    width: '100%',
                    fontSize: 12,
                    fontWeight: 400,
                    fontFamily: "'Poppins', sans-serif",
                    letterSpacing: 0,
                    padding: '10px 16px',
                    borderRadius: 10,
                    border: isdarkmode ? '1.5px solid rgba(255,255,255,0.1)' : '1.5px solid #e5e7eb',
                    background: isdarkmode ? '#202020' : '#f9fafb',
                    color: isdarkmode ? '#d1d5db' : '#374151',
                    outline: 'none',
                    appearance: 'auto',
                    cursor: 'pointer',
                  }}
                >
                  <option value="All">All Categories</option>
                  {mainCategories.map(cat => (
                    <option key={cat} value={cat} style={{ fontFamily: "'Poppins', sans-serif" }}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, fontFamily: "'Poppins', sans-serif", letterSpacing: 0, color: isdarkmode ? '#6b7280' : '#9ca3af', marginBottom: 6 }}>
                  Filter by Subcategory
                </label>
                <select
                  value={selectedsubcategory}
                  onChange={(e) => setselectedsubcategory(e.target.value)}
                  disabled={selectedmaincategory === 'All'}
                  style={{
                    width: '100%',
                    fontSize: 12,
                    fontWeight: 400,
                    fontFamily: "'Poppins', sans-serif",
                    letterSpacing: 0,
                    padding: '10px 16px',
                    borderRadius: 10,
                    border: isdarkmode ? '1.5px solid rgba(255,255,255,0.1)' : '1.5px solid #e5e7eb',
                    background: isdarkmode ? '#202020' : '#f9fafb',
                    color: isdarkmode ? '#d1d5db' : '#374151',
                    outline: 'none',
                    appearance: 'auto',
                    cursor: selectedmaincategory === 'All' ? 'not-allowed' : 'pointer',
                    opacity: selectedmaincategory === 'All' ? 0.45 : 1,
                  }}
                >
                  <option value="All">All Subcategories</option>
                  {getAvailableSubcategories().map(subcat => (
                    <option key={subcat} value={subcat} style={{ fontFamily: "'Poppins', sans-serif" }}>{subcat}</option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2" style={{ paddingBottom: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 500, fontFamily: "'Poppins', sans-serif", letterSpacing: 0, color: isdarkmode ? '#6b7280' : '#9ca3af', marginRight: 4 }}>
                  View
                </span>
                <button
                  onClick={() => setviewmode('grid')}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: viewmode === 'grid' ? '#800000' : isdarkmode ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                    color: viewmode === 'grid' ? '#fff' : isdarkmode ? '#9ca3af' : '#6b7280',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: viewmode === 'grid' ? '0 2px 8px rgba(128,0,0,0.3)' : 'none',
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setviewmode('list')}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: viewmode === 'list' ? '#800000' : isdarkmode ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                    color: viewmode === 'list' ? '#fff' : isdarkmode ? '#9ca3af' : '#6b7280',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: viewmode === 'list' ? '0 2px 8px rgba(128,0,0,0.3)' : 'none',
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="w-full max-w-7xl mx-auto">
          {isloading ? (
            <div className="p-20 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-900 border-t-transparent"></div>
              <p className={`mt-6 transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontSize: 12, fontWeight: 400 }}>
                Loading blogs...
              </p>
            </div>
          ) : currentblogs.length === 0 ? (
            <div className={`rounded-[2rem] border p-20 text-center transition-all duration-500 ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'}`}>
              <div className="text-6xl mb-4">📝</div>
              <p className={`mb-2 transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontSize: 14, fontWeight: 500 }}>
                No blogs found
              </p>
              <p className={`transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`} style={{ fontSize: 12, fontWeight: 400 }}>
                Try adjusting your filters or create a new blog post
              </p>
            </div>
          ) : viewmode === 'grid' ? (
            /* ── GRID VIEW ── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentblogs.map((blog) => (
                <div
                  key={blog._id}
                  className={`rounded-[2rem] overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'}`}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden group flex-shrink-0">
                    <img
                      src={blog.picture || '/placeholder-blog.jpg'}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1.5 rounded-full ${getstatusstyles(blog.status)}`} style={{ fontSize: 10, fontWeight: 500 }}>
                        {blog.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Categories */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="px-2.5 py-1 bg-[#800000] text-white rounded-lg" style={{ fontSize: 10, fontWeight: 500 }}>
                        {getCategoryIcon(blog.mainCategory)} {blog.mainCategory}
                      </span>
                      {blog.subcategory && (
                        <span className="px-2.5 py-1 bg-[#800000]/70 text-white rounded-lg" style={{ fontSize: 10, fontWeight: 500 }}>
                          {blog.subcategory}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <p className={`mb-2 line-clamp-2 transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`} style={{ fontSize: 13, fontWeight: 600 }}>
                      {blog.title}
                    </p>

                    {/* Description */}
                    <p className={`mb-4 line-clamp-2 flex-grow transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontSize: 11, fontWeight: 400 }}>
                      {blog.shortDescription}
                    </p>

                    {/* Meta */}
                    <div className={`flex items-center gap-4 mb-4 pb-4 border-t pt-4 transition-colors ${isdarkmode ? 'text-gray-500 border-white/10' : 'text-gray-400 border-gray-100'}`} style={{ fontSize: 10 }}>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatdate(blog.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{calculatereadingtime(blog.mainContent)} min read</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleview(blog)}
                        className={`flex-1 px-4 py-2.5 rounded-[1rem] transition-all flex items-center justify-center gap-2 ${isdarkmode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        style={{ fontSize: 11, fontWeight: 500 }}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      <button
                        onClick={() => handleedit(blog)}
                        className="flex-1 px-4 py-2.5 bg-[#800000] text-white rounded-[1rem] hover:bg-[#600000] transition-all flex items-center justify-center gap-2"
                        style={{ fontSize: 11, fontWeight: 500 }}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => confirmarchive(blog._id)}
                        className={`px-4 py-2.5 rounded-[1rem] transition-all flex items-center justify-center ${isdarkmode ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'}`}
                        title="Archive"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ── LIST VIEW (TABLE STYLE like Activity Logs) ── */
            <div className={`rounded-[2rem] border overflow-hidden shadow-xl transition-all duration-500 ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b transition-all duration-500 ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                    <tr>
                      {['Blog', 'Category', 'Status', 'Date', 'Read Time', 'Actions'].map((col, i) => (
                        <th
                          key={col}
                          className={`px-8 py-5 ${i === 5 ? 'text-right' : 'text-left'} uppercase tracking-widest transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}
                          style={{ fontSize: 10, fontWeight: 500 }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isdarkmode ? 'divide-white/5' : 'divide-gray-100'}`}>
                    {currentblogs.map((blog) => (
                      <tr key={blog._id} className={`transition-all duration-300 ${isdarkmode ? 'hover:bg-[#202020]' : 'hover:bg-gray-50'}`}>
                        {/* Blog title + image */}
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                              <img src={blog.picture || '/placeholder-blog.jpg'} alt={blog.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className={`line-clamp-1 transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`} style={{ fontSize: 13, fontWeight: 500, maxWidth: 220 }}>
                                {blog.title}
                              </p>
                              <p className={`mt-0.5 line-clamp-1 transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontSize: 11, fontWeight: 400, maxWidth: 220 }}>
                                {blog.shortDescription}
                              </p>
                            </div>
                          </div>
                        </td>
                        {/* Category */}
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="px-3 py-1 bg-[#800000] text-white rounded-full w-fit" style={{ fontSize: 10, fontWeight: 500 }}>
                              {blog.mainCategory}
                            </span>
                            {blog.subcategory && (
                              <span className="px-3 py-1 bg-[#800000]/60 text-white rounded-full w-fit" style={{ fontSize: 10, fontWeight: 500 }}>
                                {blog.subcategory}
                              </span>
                            )}
                          </div>
                        </td>
                        {/* Status */}
                        <td className="px-8 py-5">
                          <span className={`px-5 py-2 rounded-full ${getstatusstyles(blog.status)}`} style={{ fontSize: 10, fontWeight: 500 }}>
                            {blog.status}
                          </span>
                        </td>
                        {/* Date */}
                        <td className="px-8 py-5">
                          <p className={`transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`} style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>
                            {formatdate(blog.createdAt)}
                          </p>
                        </td>
                        {/* Read time */}
                        <td className="px-8 py-5">
                          <p className={`transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontSize: 12, fontWeight: 400 }}>
                            {calculatereadingtime(blog.mainContent)} min
                          </p>
                        </td>
                        {/* Actions */}
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleview(blog)}
                              className={`px-5 py-2.5 rounded-[1rem] transition-all hover:shadow-lg ${isdarkmode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                              style={{ fontSize: 11, fontWeight: 500 }}
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleedit(blog)}
                              className="px-5 py-2.5 bg-[#800000] text-white rounded-[1rem] hover:bg-[#600000] transition-all hover:shadow-lg"
                              style={{ fontSize: 11, fontWeight: 500 }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => confirmarchive(blog._id)}
                              className={`px-5 py-2.5 rounded-[1rem] transition-all flex items-center gap-1.5 hover:shadow-lg ${isdarkmode ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'}`}
                              style={{ fontSize: 11, fontWeight: 500 }}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                              Archive
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination inside table container for list view */}
              {totalPages > 1 && (
                <div className={`px-8 py-6 flex items-center justify-between border-t transition-all duration-500 ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontSize: 11, fontWeight: 400 }}>
                    Showing <strong style={{ fontWeight: 500 }}>{indexOfFirstCard + 1}</strong> to <strong style={{ fontWeight: 500 }}>{Math.min(indexOfLastCard, filteredblogs.length)}</strong> of <strong style={{ fontWeight: 500 }}>{filteredblogs.length}</strong> results
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePageChange(currentpage - 1)}
                      disabled={currentpage === 1}
                      className={`px-5 py-2.5 rounded-[1rem] transition-all ${currentpage === 1 ? 'opacity-40 cursor-not-allowed' : isdarkmode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      style={{ fontSize: 11, fontWeight: 500 }}
                    >
                      Previous
                    </button>
                    <span className={`transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`} style={{ fontSize: 11, fontWeight: 500 }}>
                      Page {currentpage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentpage + 1)}
                      disabled={currentpage === totalPages}
                      className={`px-5 py-2.5 rounded-[1rem] transition-all ${currentpage === totalPages ? 'opacity-40 cursor-not-allowed' : isdarkmode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      style={{ fontSize: 11, fontWeight: 500 }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Grid pagination */}
          {viewmode === 'grid' && totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => handlePageChange(currentpage - 1)}
                disabled={currentpage === 1}
                className={`px-5 py-2.5 rounded-[1rem] transition-all ${currentpage === 1 ? 'opacity-40 cursor-not-allowed' : isdarkmode ? 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] border border-white/5' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                style={{ fontSize: 11, fontWeight: 500 }}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2.5 rounded-[1rem] transition-all ${currentpage === index + 1 ? 'bg-[#800000] text-white shadow-md' : isdarkmode ? 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] border border-white/5' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                  style={{ fontSize: 11, fontWeight: currentpage === index + 1 ? 500 : 400 }}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentpage + 1)}
                disabled={currentpage === totalPages}
                className={`px-5 py-2.5 rounded-[1rem] transition-all ${currentpage === totalPages ? 'opacity-40 cursor-not-allowed' : isdarkmode ? 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] border border-white/5' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                style={{ fontSize: 11, fontWeight: 500 }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Archive Confirmation Modal ── */}
      {blogtoarchive && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-8">
          <div className={`rounded-[2.5rem] w-full max-w-md shadow-2xl transition-all duration-500 ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className={`mb-2 transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`} style={{ fontSize: 18, fontWeight: 600 }}>
                Confirm Archive
              </h3>
              <p className={`mb-8 transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontSize: 12, fontWeight: 400 }}>
                Are you sure you want to archive this blog? It will be hidden from the public but can be recovered later.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelarchive}
                  className={`flex-1 px-6 py-3.5 rounded-[1.25rem] transition-all ${isdarkmode ? 'bg-white/10 text-gray-200 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  style={{ fontSize: 12, fontWeight: 500 }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlearchive(blogtoarchive)}
                  className="flex-1 px-6 py-3.5 bg-yellow-500 text-white rounded-[1.25rem] hover:bg-yellow-600 transition-all shadow-lg"
                  style={{ fontSize: 12, fontWeight: 500 }}
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Blog View Modal ── */}
      {viewingblog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-8 overflow-y-auto">
          <div className={`rounded-[2.5rem] w-full max-w-3xl shadow-2xl my-8 transition-all duration-500 ${isdarkmode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`sticky top-0 px-10 py-5 rounded-t-[2.5rem] flex items-center justify-between z-10 border-b transition-all duration-500 ${isdarkmode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2.5">
                <span className={`px-3 py-1.5 rounded-full ${getstatusstyles(viewingblog.status)}`} style={{ fontSize: 10, fontWeight: 500 }}>
                  {viewingblog.status}
                </span>
                <span className={`transition-colors ${isdarkmode ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontSize: 11, fontWeight: 400 }}>
                  {viewingblog.mainCategory}
                </span>
                {viewingblog.subcategory && (
                  <span className={`transition-colors ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`} style={{ fontSize: 11, fontWeight: 400 }}>
                    • {viewingblog.subcategory}
                  </span>
                )}
              </div>
              <button
                onClick={closeviewmodal}
                className={`p-2.5 rounded-full transition-colors ${isdarkmode ? 'text-gray-400 hover:text-gray-300 hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-10 py-6 max-h-[calc(100vh-220px)] overflow-y-auto">
              {viewingblog.picture && (
                <div className="mb-5 rounded-[1.5rem] overflow-hidden">
                  <img src={viewingblog.picture} alt={viewingblog.title} className="w-full h-52 object-cover" />
                </div>
              )}

              <h1 className={`mb-3 leading-tight transition-colors ${isdarkmode ? 'text-white' : 'text-gray-900'}`} style={{ fontSize: 20, fontWeight: 600 }}>
                {viewingblog.title}
              </h1>

              <div className={`flex items-center gap-5 mb-5 pb-4 border-b transition-colors ${isdarkmode ? 'text-gray-500 border-white/10' : 'text-gray-400 border-gray-200'}`} style={{ fontSize: 11 }}>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatdate(viewingblog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{calculatereadingtime(viewingblog.mainContent)} min read</span>
                </div>
              </div>

              <div className="mb-5">
                <p className={`leading-relaxed italic border-l-4 border-[#800000] pl-4 py-1 transition-colors ${isdarkmode ? 'text-gray-300' : 'text-gray-600'}`} style={{ fontSize: 12, fontWeight: 500 }}>
                  {viewingblog.shortDescription}
                </p>
              </div>

              <div>
                {viewingblog.mainContent && Array.isArray(viewingblog.mainContent) && viewingblog.mainContent.map((section: any, index: number) => (
                  <div key={index} className="mb-5">
                    {section.title && (
                      <p className={`mb-2 mt-4 transition-colors ${isdarkmode ? 'text-white' : 'text-gray-900'}`} style={{ fontSize: 14, fontWeight: 600 }}>
                        {section.title}
                      </p>
                    )}
                    {section.content && (
                      <div className={`leading-relaxed whitespace-pre-wrap transition-colors ${isdarkmode ? 'text-gray-300' : 'text-gray-600'}`} style={{ fontSize: 12, fontWeight: 400 }}>
                        {section.content.split('\n').map((paragraph: string, pIndex: number) => (
                          paragraph.trim() && (
                            <p key={pIndex} className="mb-3">{paragraph}</p>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`sticky bottom-0 px-10 py-5 rounded-b-[2.5rem] border-t flex justify-end gap-3 transition-all duration-500 ${isdarkmode ? 'bg-[#202020] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
              <button
                onClick={closeviewmodal}
                className={`px-8 py-3 rounded-[1.25rem] border-2 transition-all ${isdarkmode ? 'bg-transparent border-white/10 text-gray-300 hover:bg-white/5' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                style={{ fontSize: 12, fontWeight: 500 }}
              >
                Close
              </button>
              <button
                onClick={() => { closeviewmodal(); handleedit(viewingblog); }}
                className="px-8 py-3 bg-[#800000] text-white rounded-[1.25rem] hover:bg-[#600000] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                style={{ fontSize: 12, fontWeight: 500 }}
              >
                Edit Blog
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}