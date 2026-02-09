'use client'
 
import React, { useState, useEffect } from 'react'
import EditBlogs from './EditBlogs'
 
export default function ListBlogs() {
  const [blogs, setblogs] = useState<any[]>([]);
  const [activetab, setactivetab] = useState('All');
  const [viewmode, setviewmode] = useState<'grid' | 'list'>('grid');
  const [blogtodelete, setblogtodelete] = useState<string | null>(null);
 
  const [isediting, setisediting] = useState(false);
  const [selectedblog, setselectedblog] = useState<any>(null);

  // New state for view modal
  const [viewingblog, setviewingblog] = useState<any>(null);
 
  const [currentpage, setcurrentpage] = useState(1);
  const cardsperpage = 6;

  // Add loading and error states
  const [isloading, setisloading] = useState(true);
  const [error, seterror] = useState<string | null>(null);

  // NEW: Filter states for category and subcategory
  const [selectedmaincategory, setselectedmaincategory] = useState<string>('All');
  const [selectedsubcategory, setselectedsubcategory] = useState<string>('All');

  // Replace with your actual API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Category and subcategory data
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

  // Status tabs data
  const statusTabs = [
    { label: 'All', value: 'All', count: blogs.length },
    { label: 'Published', value: 'Published', count: blogs.filter(b => b.status?.toLowerCase() === 'published').length },
    { label: 'Draft', value: 'Draft', count: blogs.filter(b => b.status?.toLowerCase() === 'draft').length },
    { label: 'Scheduled', value: 'Scheduled', count: blogs.filter(b => b.status?.toLowerCase() === 'scheduled').length },
  ];

  // Get available subcategories based on selected main category
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
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error(`Failed to fetch blogs: ${response.status}`);
      }
      
      const data = await response.json();
      const activeblogs = data.filter((b: any) => 
        b.status && b.status.toLowerCase() !== 'archived'
      );
      
      setblogs(activeblogs);
    } catch (err: any) {
      console.error('Error loading blogs:', err);
      seterror(err.message || 'Failed to load blogs. Please try again later.');
      setblogs([]);
    } finally {
      setisloading(false);
    }
  };
 
  useEffect(() => {
    loadblogs();
  }, [selectedmaincategory, selectedsubcategory]);
 
  useEffect(() => {
    setcurrentpage(1);
  }, [activetab, selectedmaincategory, selectedsubcategory]);

  useEffect(() => {
    if (selectedmaincategory !== 'All') {
      const availableSubcategories = getAvailableSubcategories();
      if (selectedsubcategory !== 'All' && !availableSubcategories.includes(selectedsubcategory)) {
        setselectedsubcategory('All');
      }
    }
  }, [selectedmaincategory]);
 
  const cardshadow = { boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 10px 20px -5px rgba(0, 0, 0, 0.03)' };
 
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
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const calculatereadingtime = (content: any[]) => {
    if (!content || !Array.isArray(content)) return 5;
    
    const totalwords = content.reduce((acc, section) => {
      const sectionwords = (section.content || '').split(/\s+/).length;
      return acc + sectionwords;
    }, 0);
    
    const minutes = Math.ceil(totalwords / 200);
    return Math.max(1, minutes);
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
 
  const handletabchange = (tab: string) => {
    setactivetab(tab);
  };

  const handlemaincategorychange = (category: string) => {
    setselectedmaincategory(category);
  };

  const handlesubcategorychange = (subcategory: string) => {
    setselectedsubcategory(subcategory);
  };
 
  const filteredblogs = activetab === 'All'
    ? blogs
    : blogs.filter(blog => {
      const status = (blog.status || '').toLowerCase();
      return status === activetab.toLowerCase();
    });
 
  const totalPages = Math.ceil(filteredblogs.length / cardsperpage);
  const indexOfLastCard = currentpage * cardsperpage;
  const indexOfFirstCard = indexOfLastCard - cardsperpage;
  const currentblogs = filteredblogs.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (pageNumber: number) => {
    setcurrentpage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
 
  const handleedit = (blog: any) => {
    setselectedblog(blog);
    setisediting(true);
  };
 
  const closeeditmodal = () => {
    setisediting(false);
    setselectedblog(null);
  };
 
  const handledelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }
      
      await loadblogs();
      setblogtodelete(null);
    } catch (err: any) {
      console.error('Error deleting blog:', err);
      alert(err.message || 'Failed to delete blog');
    }
  };
 
  const confirmdelete = (id: string) => {
    setblogtodelete(id);
  };
 
  const canceldelete = () => {
    setblogtodelete(null);
  };

  const handleview = (blog: any) => {
    setviewingblog(blog);
  };

  const closeviewmodal = () => {
    setviewingblog(null);
  };

  // If editing, show full-page edit view
  if (isediting && selectedblog) {
    return (
      <EditBlogs
        blog={selectedblog}
        onClose={closeeditmodal}
        onSave={loadblogs}
      />
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Blog Management</h1>
          <p className="text-gray-600">Manage and organize your blog posts</p>
        </div>

        {/* Filters and Tabs */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {statusTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => handletabchange(tab.value)}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                  activetab === tab.value
                    ? 'bg-[#800000] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-500 mb-2 block font-semibold tracking-wider">FILTER BY MAIN CATEGORY</label>
              <select
                value={selectedmaincategory}
                onChange={(e) => handlemaincategorychange(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all"
              >
                <option value="All">All Categories</option>
                {mainCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-2 block font-semibold tracking-wider">FILTER BY SUBCATEGORY</label>
              <select
                value={selectedsubcategory}
                onChange={(e) => handlesubcategorychange(e.target.value)}
                disabled={selectedmaincategory === 'All'}
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="All">All Subcategories</option>
                {getAvailableSubcategories().map(subcat => (
                  <option key={subcat} value={subcat}>{subcat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setviewmode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewmode === 'grid' ? 'bg-[#800000] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setviewmode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewmode === 'list' ? 'bg-[#800000] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Blog Cards */}
        {isloading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={loadblogs}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : currentblogs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No blogs found</h3>
            <p className="text-gray-600">Try adjusting your filters or create a new blog post</p>
          </div>
        ) : (
          <>
            {viewmode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentblogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                    style={cardshadow}
                  >
                    {/* Blog Image */}
                    <div className="relative h-48 overflow-hidden group flex-shrink-0">
                      <img
                        src={blog.picture || '/placeholder-blog.jpg'}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getstatusstyles(blog.status)}`}>
                          {blog.status}
                        </span>
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Category Badge - FIXED */}
                      <div className="flex items-center gap-2 mb-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200">
                        <span className="text-xl flex-shrink-0">{getCategoryIcon(blog.mainCategory)}</span>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-[#800000] truncate uppercase tracking-wide">
                            {blog.mainCategory || 'Uncategorized'}
                          </span>
                          <span className="text-[10px] text-gray-600 truncate">
                            {blog.subcategory || 'No subcategory'}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3rem]">
                        {blog.title}
                      </h3>

                      {/* Meta Info */}
                      <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatdate(blog.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{calculatereadingtime(blog.mainContent)} min</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
                        {blog.shortDescription}
                      </p>

                      {/* Action Buttons - FIXED: Always at bottom */}
                      <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleview(blog)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-[#800000] to-[#600000] text-white rounded-lg hover:from-[#600000] hover:to-[#400000] transition-all duration-200 text-xs font-medium shadow-md"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleedit(blog)}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmdelete(blog._id)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {currentblogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
                    style={cardshadow}
                  >
                    <div className="flex gap-6">
                      {/* Blog Image */}
                      <div className="w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden">
                        <img
                          src={blog.picture || '/placeholder-blog.jpg'}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Blog Content */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getstatusstyles(blog.status)}`}>
                                {blog.status}
                              </span>
                              {/* FIXED CATEGORY DISPLAY */}
                              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1 border border-gray-200">
                                <span className="text-base">{getCategoryIcon(blog.mainCategory)}</span>
                                <span className="text-xs font-bold text-[#800000]">
                                  {blog.mainCategory || 'Uncategorized'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  • {blog.subcategory || 'No subcategory'}
                                </span>
                              </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              {blog.title}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatdate(blog.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{calculatereadingtime(blog.mainContent)} min read</span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                          {blog.shortDescription}
                        </p>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleview(blog)}
                            className="px-6 py-2 bg-gradient-to-r from-[#800000] to-[#600000] text-white rounded-lg hover:from-[#600000] hover:to-[#400000] transition-all duration-200 text-sm font-medium shadow-md"
                          >
                            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                          <button
                            onClick={() => handleedit(blog)}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => confirmdelete(blog._id)}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentpage - 1)}
                  disabled={currentpage === 1}
                  className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentpage === index + 1
                        ? 'bg-[#800000] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentpage + 1)}
                  disabled={currentpage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {blogtodelete && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Confirm Deletion</h3>
              <p className="text-gray-600">
                Are you sure you want to delete this blog? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={canceldelete}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handledelete(blogtodelete)}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog View Modal - COMPACT VERSION */}
      {viewingblog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl my-8">
            {/* Modal Header - Compact */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${getstatusstyles(viewingblog.status)}`}>
                  {viewingblog.status}
                </span>
                <span className="text-xs font-medium text-gray-500">{viewingblog.mainCategory}</span>
                <span className="text-xs text-gray-400">• {viewingblog.subcategory}</span>
              </div>
              <button
                onClick={closeviewmodal}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - Compact */}
            <div className="px-6 py-4 max-h-[calc(100vh-180px)] overflow-y-auto">
              {/* Featured Image - Smaller */}
              {viewingblog.picture && (
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img
                    src={viewingblog.picture}
                    alt={viewingblog.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* Blog Title - Smaller */}
              <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {viewingblog.title}
              </h1>

              {/* Blog Meta - Compact */}
              <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 pb-3 border-b border-gray-200">
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

              {/* Short Description - Compact */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 leading-relaxed font-medium italic border-l-3 border-[#800000] pl-4 py-2">
                  {viewingblog.shortDescription}
                </p>
              </div>

              {/* Main Content Sections - Compact */}
              <div className="prose prose-sm max-w-none">
                {viewingblog.mainContent && Array.isArray(viewingblog.mainContent) && viewingblog.mainContent.map((section: any, index: number) => (
                  <div key={index} className="mb-4">
                    {section.title && (
                      <h2 className="text-lg font-bold text-gray-900 mb-2 mt-4">
                        {section.title}
                      </h2>
                    )}
                    {section.content && (
                      <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {section.content.split('\n').map((paragraph: string, pIndex: number) => (
                          paragraph.trim() && (
                            <p key={pIndex} className="mb-3">
                              {paragraph}
                            </p>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer - Compact */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-3 rounded-b-2xl flex justify-end gap-2">
              <button
                onClick={closeviewmodal}
                className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  closeviewmodal();
                  handleedit(viewingblog);
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#800000] to-[#600000] text-white rounded-lg hover:from-[#600000] hover:to-[#400000] transition-all duration-200 text-sm font-medium shadow-md"
              >
                Edit Blog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}