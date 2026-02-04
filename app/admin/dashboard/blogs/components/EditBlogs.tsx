'use client'

import react, { useState, useRef } from 'react'

interface editblogsprops {
  blog: any;
  onsave: (updatedblog: any) => void;
  oncancel: () => void;
}

export default function editblogs({ blog, onsave, oncancel }: editblogsprops) {
  const [editingblog, seteditingblog] = useState({ ...blog });
  const fileref = useRef<HTMLInputElement>(null);

  const handlesubmit = (e: react.FormEvent) => {
    e.preventDefault();
    onsave(editingblog);
  };

  const handleimagechange = (e: react.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        seteditingblog({ ...editingblog, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getstatuscolor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'bg-[#800000]';
      case 'archived': return 'bg-orange-400';
      case 'draft': return 'bg-rose-400';
      default: return 'bg-gray-100';
    }
  };

  return ( 
    <div className="flex flex-col items-start justify-start p-8 space-y-8 min-h-screen bg-transparent" style={{ fontFamily: "'poppins', sans-serif" }}> 
      <style jsx global>{` 
        @import url('https://fonts.googleapis.com/css2?family=poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'poppins', sans-serif !important; font-weight: 400; }
        .bold-text { font-weight: 700 !important; }
        .no-capitalize { text-transform: lowercase !important; }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
        <div className="space-y-2">
          <h2 className="text-xl leading-none tracking-tight text-gray-600">
            Edit Blog Details
          </h2>
          <p className="text-[11px] tracking-wide italic text-gray-400">
            Reviewing your research progress — your contributions are shaping meaningful solutions!
          </p>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[380px] flex flex-col">
          <h4 className="text-sm font-bold tracking-tight" style={{ color: '#4a5565' }}>Post Information</h4>
          <p className="text-[10px] text-gray-400 mb-8">Real-time entry insights</p>
          
          <div className="flex-grow flex flex-col space-y-6">
            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div className="flex flex-col items-start text-left space-y-2">
                <div className="flex gap-2 bg-gray-200/50 p-1.5 rounded-xl text-[10px] w-fit">
                  <span className="px-2 text-gray-500 font-medium">Current Status</span>
                </div>
                <div className="mt-1">
                    <span className={`text-[10px] px-3 py-1 rounded-lg text-white bold-text no-capitalize ${getstatuscolor(editingblog.status)}`}>{editingblog.status}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div className="flex flex-col items-start text-left space-y-2">
                <div className="flex gap-2 bg-gray-200/50 p-1.5 rounded-xl text-[10px] w-fit">
                  <span className="px-2 text-gray-500 font-medium">Assigned Author</span>
                </div>
                <span className="text-[11px] bold-text text-gray-700 mt-1 no-capitalize">{editingblog.author}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-4 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
             <span className="text-[9px] text-gray-400 italic">Data synced with database</span>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[380px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-sm font-bold tracking-tight" style={{ color: '#4a5565' }}>Feature Image</h4>
              <p className="text-[10px] text-gray-400">Current post preview</p>
            </div>
            <button 
              type="button"
              onClick={() => fileref.current?.click()}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span className="text-[9px] bold-text text-[#800000] uppercase">Upload New</span>
            </button>
          </div>

          <input type="file" ref={fileref} className="hidden" accept="image/*" onChange={handleimagechange} />

          <div onClick={() => fileref.current?.click()} className="border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center bg-gray-50/50 relative overflow-hidden flex-grow cursor-pointer group hover:bg-gray-50 transition-all">
            {editingblog.image ? (
              <>
                <img src={editingblog.image} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="text-white text-[10px] bold-text uppercase bg-[#800000]/80 px-4 py-2 rounded-full">Change Image</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">Click to upload feature image</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-12 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col">
          <div className="mb-8">
            <h4 className="text-sm font-bold tracking-tight" style={{ color: '#4a5565' }}>General Information</h4>
            <p className="text-[10px] text-gray-400">Detailed analysis and records</p>
          </div>
          
          <form onSubmit={handlesubmit} className="space-y-6 flex-grow">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl text-[10px] mb-2 w-fit border border-gray-200">
                  <span className="px-2 text-gray-600 font-semibold uppercase tracking-wider">Blog Title</span>
                </div>
                <input 
                  value={editingblog.title} 
                  onChange={(e) => seteditingblog({...editingblog, title: e.target.value})} 
                  type="text" 
                  placeholder="enter title here..."
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] text-gray-800 outline-none focus:bg-white focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/10 transition-all no-capitalize shadow-sm" 
                />
              </div>
              
              <div className="col-span-1">
                <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl text-[10px] mb-2 w-fit border border-gray-200">
                  <span className="px-2 text-gray-600 font-semibold uppercase tracking-wider">Author Name</span>
                </div>
                <input 
                  value={editingblog.author} 
                  onChange={(e) => seteditingblog({...editingblog, author: e.target.value})} 
                  type="text" 
                  placeholder="name of author..."
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] text-gray-800 outline-none focus:bg-white focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/10 transition-all no-capitalize shadow-sm" 
                />
              </div>

              <div className="col-span-1">
                <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl text-[10px] mb-2 w-fit border border-gray-200">
                  <span className="px-2 text-gray-600 font-semibold uppercase tracking-wider">Status</span>
                </div>
                <div className="relative">
                  <select 
                    value={editingblog.status} 
                    onChange={(e) => seteditingblog({...editingblog, status: e.target.value})} 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] text-gray-800 outline-none cursor-pointer focus:bg-white focus:border-[#800000] transition-all appearance-none no-capitalize shadow-sm"
                  >
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-8 border-t border-gray-100 mt-8">
              <button 
                type="button" 
                onClick={oncancel} 
                className="px-8 py-3 text-[10px] bg-gray-100 text-gray-500 rounded-2xl bold-text hover:bg-gray-200 transition-all uppercase tracking-wider"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-12 py-3 text-[10px] bg-[#800000] text-white rounded-2xl shadow-lg shadow-[#800000]/20 bold-text hover:bg-[#600000] transition-all uppercase tracking-wider"
              >
                Confirm & Publish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}