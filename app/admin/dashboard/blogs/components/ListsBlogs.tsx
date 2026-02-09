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

  // Replace with your actual API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const loadblogs = async () => {
    try {
      setisloading(true);
      seterror(null);
      
      const response = await fetch(`${API_BASE_URL}/blogs`, {
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
  }, []);
 
  useEffect(() => {
    setcurrentpage(1);
  }, [activetab]);
 
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
 
  const handledelete = async (blogid: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${blogid}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 401) {
        alert('Unauthorized - Please login again');
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to delete blog: ${response.status}`);
      }
      
      await loadblogs();
      setblogtodelete(null);
      alert('Blog deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting blog:', err);
      alert(`Failed to delete blog: ${err.message || 'Unknown error'}`);
    }
  };

  const confirmdelete = (blogid: string) => {
    setblogtodelete(blogid);
  };

  const canceldelete = () => {
    setblogtodelete(null);
  };
  
  const handlestatuschange = async (blogid: string, newstatus: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${blogid}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newstatus }),
      });

      if (response.status === 401) {
        alert('Unauthorized - Please login again');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to update status: ${response.status}`);
      }

      await loadblogs();
      alert(`Blog status updated to ${newstatus}`);
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert(`Failed to update status: ${err.message || 'Unknown error'}`);
    }
  };
  
  const handleedit = (blog: any) => {
    setselectedblog(blog);
    setisediting(true);
  };

  const closeeditmodal = () => {
    setisediting(false);
    setselectedblog(null);
  };

  const handleupdatesuccess = (updatedblog: any) => {
    loadblogs();
    closeeditmodal();
  };

  // New function to handle view blog
  const handleviewblog = (blog: any) => {
    setviewingblog(blog);
  };

  // New function to close view modal
  const closeviewmodal = () => {
    setviewingblog(null);
  };
 
  if (isediting && selectedblog) {
    return <EditBlogs blog={selectedblog} onsave={handleupdatesuccess} oncancel={closeeditmodal} />;
  }
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Blog Management</h1>
              <p className="text-gray-600">Manage and organize your blog content</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setviewmode('grid')}
                className={`p-3 rounded-lg transition-all ${
                  viewmode === 'grid'
                    ? 'bg-[#800000] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                title="Grid View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setviewmode('list')}
                className={`p-3 rounded-lg transition-all ${
                  viewmode === 'list'
                    ? 'bg-[#800000] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                title="List View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-2 inline-flex gap-2">
            {['All', 'Published', 'Scheduled', 'Draft'].map((tab) => (
              <button
                key={tab}
                onClick={() => handletabchange(tab)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  activetab === tab
                    ? 'bg-gradient-to-r from-[#800000] to-[#600000] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
                <span className="ml-2 text-xs opacity-75">
                  ({tab === 'All' 
                    ? blogs.length 
                    : blogs.filter(b => (b.status || '').toLowerCase() === tab.toLowerCase()).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {isloading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#800000] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Loading blogs...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Blogs</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadblogs}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        ) : filteredblogs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No blogs found</h3>
            <p className="text-gray-500">
              {activetab === 'All' 
                ? 'Start creating your first blog post!' 
                : `No ${activetab.toLowerCase()} blogs available.`}
            </p>
          </div>
        ) : (
          <>
            {viewmode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentblogs.map((blog: any) => (
                  <div
                    key={blog._id}
                    className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col"
                    style={cardshadow}
                  >
                    <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                      {blog.picture ? (
                        <img
                          src={blog.picture}
                          alt={blog.title}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                          {getCategoryIcon(blog.mainCategory)}
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${getstatusstyles(blog.status)}`}>
                          {blog.status || 'Unknown'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-3">
                        <span className="text-sm font-medium text-[#800000] bg-red-50 px-3 py-1 rounded-full">
                          {blog.mainCategory}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-[#800000] transition-colors">
                        {blog.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                        {blog.shortDescription}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4 mt-auto">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {calculatereadingtime(blog.mainContent)} min read
                        </span>
                        <span>{formatdate(blog.createdAt)}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleviewblog(blog)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        <button
                          onClick={() => handleedit(blog)}
                          className="bg-gradient-to-r from-[#800000] to-[#600000] text-white px-3 py-2.5 rounded-lg hover:from-[#600000] hover:to-[#400000] transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => confirmdelete(blog._id)}
                          className="bg-white text-[#800000] border-2 border-[#800000] px-3 py-2.5 rounded-lg hover:bg-[#800000] hover:text-white transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {currentblogs.map((blog: any) => (
                  <div
                    key={blog._id}
                    className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300"
                    style={cardshadow}
                  >
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-gray-200">
                        {blog.picture ? (
                          <img
                            src={blog.picture}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                            📝
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getstatusstyles(blog.status)}`}>
                                {blog.status || 'Unknown'}
                              </span>
                              <span className="text-sm text-gray-500">{blog.mainCategory}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                              {blog.title}
                            </h3>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {blog.shortDescription}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {calculatereadingtime(blog.mainContent)} min
                            </span>
                            <span>{formatdate(blog.createdAt)}</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleviewblog(blog)}
                              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                            <button
                              onClick={() => handleedit(blog)}
                              className="bg-gradient-to-r from-[#800000] to-[#600000] text-white px-5 py-2.5 rounded-lg hover:from-[#600000] hover:to-[#400000] transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => confirmdelete(blog._id)}
                              className="bg-white text-[#800000] border-2 border-[#800000] px-5 py-2.5 rounded-lg hover:bg-[#800000] hover:text-white transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
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

      {/* Blog View Modal */}
      {viewingblog && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl my-8">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getstatusstyles(viewingblog.status)}`}>
                  {viewingblog.status}
                </span>
                <span className="text-sm font-medium text-gray-500">{viewingblog.mainCategory}</span>
              </div>
              <button
                onClick={closeviewmodal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Featured Image */}
              {viewingblog.picture && (
                <div className="mb-8 rounded-xl overflow-hidden">
                  <img
                    src={viewingblog.picture}
                    alt={viewingblog.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {/* Blog Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {viewingblog.title}
              </h1>

              {/* Blog Meta */}
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatdate(viewingblog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{calculatereadingtime(viewingblog.mainContent)} min read</span>
                </div>
              </div>

              {/* Short Description */}
              <div className="mb-8">
                <p className="text-xl text-gray-700 leading-relaxed font-medium italic border-l-4 border-[#800000] pl-6 py-2 text-justify">
                  {viewingblog.shortDescription}
                </p>
              </div>

              {/* Main Content Sections */}
              <div className="prose prose-lg max-w-none">
                {viewingblog.mainContent && Array.isArray(viewingblog.mainContent) && viewingblog.mainContent.map((section: any, index: number) => (
                  <div key={index} className="mb-8">
                    {section.heading && (
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                        {section.heading}
                      </h2>
                    )}
                    {section.content && (
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-justify">
                        {section.content.split('\n').map((paragraph: string, pIndex: number) => (
                          paragraph.trim() && (
                            <p key={pIndex} className="mb-4">
                              {paragraph}
                            </p>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Subcategories */}
              {viewingblog.subcategories && viewingblog.subcategories.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingblog.subcategories.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-4 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={closeviewmodal}
                className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  closeviewmodal();
                  handleedit(viewingblog);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#800000] to-[#600000] text-white rounded-lg hover:from-[#600000] hover:to-[#400000] transition-all duration-200 font-medium shadow-md"
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