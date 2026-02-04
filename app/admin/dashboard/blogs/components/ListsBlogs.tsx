'use client'

import React, { useState, useEffect } from 'react'
import EditBlogs from './EditBlogs'

export default function ListBlogs() {
  const [blogs, setblogs] = useState<any[]>([]);
  const [activetab, setactivetab] = useState('All');
  const [viewmode, setviewmode] = useState<'grid' | 'list'>('grid');
  const [blogtodelete, setblogtodelete] = useState<number | null>(null);
  
  const [isediting, setisediting] = useState(false);
  const [selectedblog, setselectedblog] = useState<any>(null);

  const [currentpage, setcurrentpage] = useState(1);
  const cardsperpage = 6;

  const loadblogs = () => {
    const data = JSON.parse(localStorage.getItem('blog_data_v2') || '[]');
    const activeblogs = data.filter((b: any) => b.status && b.status.toLowerCase() !== 'archived');
    setblogs(activeblogs);
  };

  useEffect(() => {
    loadblogs();
    window.addEventListener('storage', loadblogs);
    return () => window.removeEventListener('storage', loadblogs);
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

  const filteredblogs = activetab === 'All' 
    ? blogs 
    : blogs.filter(b => b.status === activetab);

  const totalentries = filteredblogs.length;
  const totalpages = Math.ceil(totalentries / cardsperpage) || 1;
  const indexoflastblog = currentpage * cardsperpage;
  const indexoffirstblog = indexoflastblog - cardsperpage;
  const currentblogs = filteredblogs.slice(indexoffirstblog, indexoflastblog);

  const tabs = ['All', 'Draft', 'Published', 'Scheduled'];

  const handleconfirmdelete = () => {
    if (blogtodelete !== null) {
      const allblogs = JSON.parse(localStorage.getItem('blog_data_v2') || '[]');
      const updated = allblogs.filter((b: any) => b.id !== blogtodelete);
      localStorage.setItem('blog_data_v2', JSON.stringify(updated));
      setblogs(updated.filter((b: any) => b.status && b.status.toLowerCase() !== 'archived'));
      setblogtodelete(null);
    }
  };

  const handleedit = (blog: any) => {
    setselectedblog(blog);
    setisediting(true);
  };

  const handlesaveedit = (updatedblog: any) => {
    const allblogs = JSON.parse(localStorage.getItem('blog_data_v2') || '[]');
    const updated = allblogs.map((b: any) => b.id === updatedblog.id ? updatedblog : b);
    localStorage.setItem('blog_data_v2', JSON.stringify(updated));
    loadblogs();
    setisediting(false);
    setselectedblog(null);
  };

  if (isediting && selectedblog) {
    return (
      <EditBlogs 
        blog={selectedblog} 
        onsave={handlesaveedit} 
        oncancel={() => setisediting(false)} 
      />
    );
  }

  return ( 
    <div className="flex flex-col items-start justify-start p-8 space-y-8 min-h-screen bg-transparent" style={{ fontFamily: "'Poppins', sans-serif" }}> 
      <style jsx global>{` 
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif !important; text-transform: none; font-weight: 400 !important; }
        .capitalize-text { text-transform: capitalize; }
      `}</style>

      {blogtodelete !== null && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 max-w-sm w-full mx-4 text-center shadow-2xl relative z-[10000]">
            <h3 className="text-gray-900 font-bold text-lg mb-2">Delete This Post?</h3>
            <p className="text-[12px] text-gray-400 mb-6">This action cannot be undone. Are you sure?</p>
            <div className="flex gap-3">
              <button onClick={() => setblogtodelete(null)} className="flex-1 py-3 text-[10px] bg-gray-100 text-gray-600 rounded-xl font-bold uppercase tracking-wider">Cancel</button>
              <button onClick={handleconfirmdelete} className="flex-1 py-3 text-[10px] bg-red-600 text-white rounded-xl font-bold uppercase tracking-wider">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 px-2">
        <h2 className="text-xl leading-none font-bold text-[#4a5565]">Editorial Blog Insights</h2>
        <p className="text-[11px] italic text-gray-400">Monitoring your publication metrics and progress.</p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 px-2">
        {[
          { label: 'Total', value: blogs.length, sub: 'Total Entries', accent: '#800000', isprimary: true, type: 'bars' },
          { label: 'Live Posts', value: blogs.filter(b => b.status === 'Published').length, sub: 'Active Live', accent: '#800000', isprimary: false, type: 'dots' },
          { label: 'Drafts', value: blogs.filter(b => b.status === 'Draft').length, sub: 'In Progress', accent: '#800000', isprimary: false, type: 'wave' },
          { label: 'Scheduled', value: blogs.filter(b => b.status === 'Scheduled').length, sub: 'Upcoming', accent: '#800000', isprimary: false, type: 'step' }
        ].map((item, i) => (
          <div key={i} style={cardshadow} className={`p-7 rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-2xl rounded-bl-2xl flex flex-col justify-between group transition-all relative overflow-hidden min-h-[145px] ${item.isprimary ? 'bg-[#800000]' : 'bg-white border border-gray-100'}`}>
            <div className="absolute top-5 right-7 flex items-end justify-end opacity-90">
              {item.type === 'bars' && (
                <div className="flex items-end gap-[6px] scale-110 origin-right">
                  <div className={`w-[5px] h-3 rounded-full ${item.isprimary ? 'bg-white/30' : 'bg-[#800000]/20'}`}></div>
                  <div className={`w-[5px] h-8 rounded-full ${item.isprimary ? 'bg-white' : 'bg-[#800000]'}`}></div>
                  <div className={`w-[5px] h-5 rounded-full ${item.isprimary ? 'bg-white/60' : 'bg-[#800000]/50'}`}></div>
                </div>
              )}
              {item.type === 'dots' && (
                <div className="grid grid-cols-2 gap-[5px] scale-110 origin-right">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.isprimary ? 'bg-white/20' : 'bg-[#800000]/10'}`}></div>
                  <div className={`w-2.5 h-2.5 rounded-full ${item.isprimary ? 'bg-white' : 'bg-[#800000]'}`}></div>
                  <div className={`w-2.5 h-2.5 rounded-full ${item.isprimary ? 'bg-white/60' : 'bg-[#800000]/50'}`}></div>
                  <div className={`w-2.5 h-2.5 rounded-full ${item.isprimary ? 'bg-white/40' : 'bg-[#800000]/30'}`}></div>
                </div>
              )}
              {item.type === 'wave' && (
                <div className="scale-110 origin-right">
                  <svg width="40" height="20" viewBox="0 0 45 24" fill="none">
                    <path d="M2 18C6 18 10 4 15 4C20 4 25 20 30 20C35 20 39 4 43 4" stroke={item.isprimary ? "white" : "#800000"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              {item.type === 'step' && (
                <div className="flex items-end scale-110 origin-right">
                  <div className={`w-3.5 h-2.5 ${item.isprimary ? 'bg-white/30' : 'bg-[#800000]/20'}`}></div>
                  <div className={`w-3.5 h-5 ${item.isprimary ? 'bg-white/60' : 'bg-[#800000]/50'}`}></div>
                  <div className={`w-3.5 h-8 ${item.isprimary ? 'bg-white' : 'bg-[#800000]'}`}></div>
                </div>
              )}
            </div>
            <div className="relative z-10">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${item.isprimary ? 'text-white/70' : 'text-gray-400'}`}>{item.label}</span>
              <h4 className={`text-5xl font-bold mt-1 tracking-tighter ${item.isprimary ? 'text-white' : 'text-gray-800'}`}>{item.value}</h4>
            </div>
            <div className="relative z-10 flex items-center gap-2">
              <div className={`h-[1.5px] w-3 ${item.isprimary ? 'bg-white/40' : 'bg-[#800000]'}`}></div>
              <p className={`text-[9px] font-bold uppercase tracking-tight ${item.isprimary ? 'text-white/60' : 'text-gray-400'}`}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full px-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setactivetab(tab)} className={`px-5 py-2 rounded-xl text-[10px] font-bold transition-all ${activetab === tab ? 'bg-[#800000] text-white shadow-lg' : 'text-gray-400 hover:text-[#800000] bg-white border border-gray-100'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center bg-white border border-gray-100 p-1 rounded-2xl">
            <button onClick={() => setviewmode('grid')} className={`p-2 rounded-xl ${viewmode === 'grid' ? 'bg-gray-100 text-[#800000]' : 'text-gray-400'}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </button>
            <button onClick={() => setviewmode('list')} className={`p-2 rounded-xl ${viewmode === 'list' ? 'bg-gray-100 text-[#800000]' : 'text-gray-400'}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>

      {viewmode === 'grid' ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-2">
          {currentblogs.map((blog) => (
            <div key={blog.id} style={cardshadow} className="bg-white rounded-[2.5rem] p-7 flex flex-col border border-gray-100 transition-all hover:translate-y-[-10px] group">
              <div className="relative aspect-[1.5/1] w-full rounded-[2rem] overflow-hidden bg-gray-50 mb-6">
                {blog.image && <img src={blog.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full ${getstatusstyles(blog.status)}`}><span className="text-[9px] font-bold uppercase">{blog.status}</span></div>
              </div>
              <div className="px-1 flex-grow flex flex-col">
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between items-center"><p className="text-[10px] font-bold text-[#800000]">By {blog.author}</p><span className="text-[8px] text-gray-500 font-bold uppercase">{blog.readingTime} Min Read</span></div>
                  <h3 className="text-[20px] font-bold text-gray-800 leading-tight group-hover:text-[#800000] line-clamp-2">{blog.title}</h3>
                </div>
                <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
                  <span className="text-[10px] text-gray-700 font-bold">{blog.date}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleedit(blog)} className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:text-[#800000] border border-gray-100 transition-all"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                    <button onClick={() => setblogtodelete(blog.id)} className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:text-red-600 border border-gray-100 transition-all"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full px-2">
          <div style={cardshadow} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/30">
                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Post Title</th>
                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Author</th>
                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentblogs.map((blog) => (
                    <tr key={blog.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                            {blog.image && <img src={blog.image} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{blog.title}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">{blog.readingTime} Min Read</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase ${getstatusstyles(blog.status)}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <p className="text-[11px] font-bold text-[#800000]">By {blog.author}</p>
                      </td>
                      <td className="p-6">
                        <p className="text-[11px] font-bold text-gray-500">{blog.date}</p>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleedit(blog)} className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:text-[#800000] border border-gray-100 transition-all">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button onClick={() => setblogtodelete(blog.id)} className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:text-red-600 border border-gray-100 transition-all">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex items-center justify-end gap-4 px-4 pt-10 pb-20">
        <span className="text-[11px] text-gray-500 uppercase">
          {totalentries > 0 ? `${indexoffirstblog + 1} - ${Math.min(indexoflastblog, totalentries)}` : '0 - 0'} Of {totalentries} Entries
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => setcurrentpage(prev => Math.max(prev - 1, 1))} disabled={currentpage === 1} className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-30"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg></button>
          <button className="w-7 h-7 flex items-center justify-center text-[11px] font-bold border border-[#800000] text-[#800000] rounded-md bg-[#800000]/5">{currentpage}</button>
          <button onClick={() => setcurrentpage(prev => Math.min(prev + 1, totalpages))} disabled={currentpage === totalpages || totalentries === 0} className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-30"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg></button>
        </div>
      </div>
    </div>
  )
}