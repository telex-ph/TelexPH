'use client'

import { ReactNode, useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const [activeitem, setactiveitem] = useState('Dashboard')
  const [isassignmentsopen, setisassignmentsopen] = useState(false)
  const [isdarkmode, setisdarkmode] = useState(false)
  const [issidebarcollapsed, setissidebarcollapsed] = useState(false)
  const [ismobilemenuopen, setismobilemenuopen] = useState(false)

  const handleclick = (itemname: string) => {
    setactiveitem(itemname)
    if (itemname === 'Careers') {
      setisassignmentsopen(!isassignmentsopen)
    }
    setismobilemenuopen(false)
  }

  const toggledarkmode = () => {
    setisdarkmode(!isdarkmode)
  }

  const togglesidebar = () => {
    setissidebarcollapsed(!issidebarcollapsed)
    if (!issidebarcollapsed) setisassignmentsopen(false)
  }

  const getnavstyle = (name: string) => {
    const isactive = activeitem === name
    const collapsedpadding = issidebarcollapsed ? 'lg:justify-center lg:px-0' : 'px-4'
    
    if (isactive) {
      return `bg-[#800000] text-white shadow-md -translate-y-[1px] border-none px-4 ${collapsedpadding}`
    }
    return isdarkmode 
      ? `text-gray-500 hover:text-white hover:bg-white/5 border-none px-4 ${collapsedpadding}` 
      : `text-gray-400 hover:text-[#800000] hover:bg-gray-50 border-none px-4 ${collapsedpadding}`
  }

  const navitems = [
    { name: 'Blogs', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" /><path d="M8 7h6" /><path d="M8 11h8" /></svg> },
  ]

  const otheritems = [
    { name: 'Case studies', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg> },
    { name: 'Discussion', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-1.9A8.5 8.5 0 1 0 10.5 3.5 8.5 8.5 0 0 0 3 21z" /></svg> },
  ]

  const SidebarContent = ({ iscollapsed }: { iscollapsed: boolean }) => (
    <>
      <div className={`p-8 flex items-center transition-all duration-300 ${iscollapsed ? 'lg:justify-center' : 'justify-between'}`}>
        <div className={`flex items-center gap-3 cursor-pointer group transition-all duration-300 ${iscollapsed ? 'lg:w-full lg:justify-center' : ''}`} onClick={() => handleclick('Dashboard')}>
          <div className="flex items-center justify-center shrink-0">
            <img 
              src="/images/log0.png" 
              alt="logo" 
              className={`transition-all duration-300 object-contain ${iscollapsed ? 'w-10 h-10' : 'w-14 h-14'}`} 
            />
          </div>
          {!iscollapsed && (
            <span className={`text-lg font-bold uppercase tracking-tighter transition-colors ${isdarkmode ? 'text-gray-300' : 'text-gray-700'}`}>
              TELEX
            </span>
          )}
        </div>
        {!iscollapsed && (
          <button 
            onClick={() => ismobilemenuopen ? setismobilemenuopen(false) : togglesidebar()}
            className={`transition-all active:scale-90 border-none outline-none ${isdarkmode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-[#800000]'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg>
          </button>
        )}
      </div>
      
      <nav className={`flex-1 space-y-3 overflow-y-auto no-scrollbar pt-2 transition-all duration-300 ${iscollapsed ? 'px-2' : 'px-6'}`}>
        <button 
          onClick={() => handleclick('Dashboard')}
          className={`w-full flex items-center py-3.5 rounded-2xl text-[12px] font-semibold transition-all duration-300 active:scale-95 border-none outline-none ${iscollapsed ? 'justify-center' : 'gap-4'} ${getnavstyle('Dashboard')}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          {!iscollapsed && <span className="uppercase tracking-wide">dashboard</span>}
        </button>

        <div className="space-y-2">
          {navitems.map((item) => (
            <button 
              key={item.name} 
              onClick={() => handleclick(item.name)}
              className={`w-full flex items-center rounded-2xl text-[12px] font-semibold transition-all duration-300 active:scale-95 border-none outline-none ${iscollapsed ? 'justify-center py-3.5' : 'justify-between py-3.5'} ${getnavstyle(item.name)}`}
            >
              <div className={`flex items-center ${iscollapsed ? '' : 'gap-4'}`}>
                <span className="shrink-0">{item.icon}</span>
                {!iscollapsed && <span className="uppercase tracking-wide">{item.name}</span>}
              </div>
              {!iscollapsed && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="m6 9 6 6 6-6"/></svg>
              )}
            </button>
          ))}
          
          <div className="py-1">
            <button 
              onClick={() => handleclick('Careers')}
              className={`w-full flex items-center rounded-2xl text-[12px] font-semibold transition-all duration-300 active:scale-95 border-none outline-none ${iscollapsed ? 'justify-center py-3.5' : 'justify-between py-3.5'} ${getnavstyle('Careers')}`}
            >
              <div className={`flex items-center ${iscollapsed ? '' : 'gap-4'}`}>
                <span className="shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /></svg>
                </span>
                {!iscollapsed && <span className="uppercase tracking-wide">careers</span>}
              </div>
              {!iscollapsed && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isassignmentsopen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
              )}
            </button>
            {!iscollapsed && isassignmentsopen && (
              <div className={`ml-8 mt-2 border-l-2 space-y-1 ${isdarkmode ? 'border-white/10' : 'border-gray-100'}`}>
                {['Pending', 'Submitted', 'Feedback'].map((sub) => (
                  <button 
                    key={sub} 
                    onClick={() => handleclick(sub)}
                    className={`w-full flex items-center py-2.5 pl-5 relative group text-left transition-all active:scale-95 rounded-r-xl border-none outline-none ${activeitem === sub ? 'bg-[#800000] text-white' : ''}`}
                  >
                    <p className={`text-[11px] font-bold transition-all uppercase tracking-wider ${
                      activeitem === sub ? 'text-white' : (isdarkmode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-[#800000]')
                    }`}>{sub}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {otheritems.map((item) => (
            <button 
              key={item.name} 
              onClick={() => handleclick(item.name)}
              className={`w-full flex items-center py-3.5 rounded-2xl text-[12px] font-semibold transition-all duration-300 active:scale-95 border-none outline-none ${iscollapsed ? 'justify-center' : 'gap-4'} ${getnavstyle(item.name)}`}
            >
              <span className="shrink-0">{item.icon}</span>
              {!iscollapsed && <span className="uppercase tracking-wide">{item.name}</span>}
            </button>
          ))}
        </div>
      </nav>

      <div className={`pb-6 space-y-3 border-t transition-all duration-300 ${iscollapsed ? 'px-2' : 'px-6'} ${isdarkmode ? 'border-white/5' : 'border-gray-50'}`}>
        <div className={`flex items-center text-[12px] font-bold py-4 ${iscollapsed ? 'justify-center' : 'justify-between px-4'}`}>
          <div className={`flex items-center gap-4 transition-colors ${isdarkmode ? 'text-white' : 'text-gray-500'}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
            {!iscollapsed && <span className="uppercase tracking-wide">dark mode</span>}
          </div>
          {!iscollapsed && (
            <div 
              onClick={toggledarkmode}
              className={`w-8 h-4 rounded-full relative cursor-pointer transition-all duration-500 active:scale-75 border-none ${isdarkmode ? 'bg-[#800000]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-2 h-2 rounded-full shadow-sm transition-all duration-300 ${isdarkmode ? 'right-1 bg-white' : 'right-5 bg-white'}`} />
            </div>
          )}
        </div>
        
        <button 
          onClick={() => handleclick('Settings')} 
          className={`w-full flex items-center py-3.5 rounded-2xl text-[12px] font-semibold transition-all duration-300 active:scale-95 border-none outline-none ${iscollapsed ? 'justify-center' : 'gap-4'} ${getnavstyle('Settings')}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          {!iscollapsed && <span className="uppercase tracking-wide">settings</span>}
        </button>

        <div className={`flex items-center p-3 rounded-2xl border-none mt-2 shadow-sm transition-all hover:shadow-md cursor-pointer ${iscollapsed ? 'justify-center' : 'justify-between'} ${isdarkmode ? 'bg-[#202020]' : 'bg-white'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#800000] rounded-xl flex items-center justify-center text-white text-xs font-black uppercase border-none shrink-0">aj</div>
            {!iscollapsed && (
              <div className="flex flex-col text-left">
                <span className={`text-[12px] font-bold uppercase transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>alex johnson</span>
                <span className="text-[10px] tracking-tighter font-semibold text-gray-400">administrator</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className={`flex h-screen overflow-hidden antialiased transition-colors duration-500 ${isdarkmode ? 'bg-[#0f0f0f] text-gray-400 font-medium' : 'bg-[#f8f9fa] text-gray-600 font-medium'}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Poppins', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <aside className={`border-r hidden lg:flex flex-col h-full z-20 transition-all duration-300 ease-in-out ${issidebarcollapsed ? 'w-24' : 'w-72'} ${isdarkmode ? 'bg-[#181818] border-white/5' : 'bg-white border-gray-100'}`}>
        <SidebarContent iscollapsed={issidebarcollapsed} />
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
        <header className={`h-24 flex items-center justify-between px-6 lg:px-10 shrink-0 transition-colors duration-500 ${isdarkmode ? 'bg-[#181818]' : 'bg-white border-b border-gray-50'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setismobilemenuopen(true)} className="lg:hidden p-2 rounded-xl text-gray-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            {issidebarcollapsed && (
              <button onClick={togglesidebar} className={`hidden lg:block p-2.5 rounded-2xl ${isdarkmode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center relative ${isdarkmode ? 'bg-[#202020]' : 'bg-gray-50'}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#800000] text-white text-[9px] flex items-center justify-center rounded-full border border-white font-black">9</span>
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${isdarkmode ? 'bg-[#202020]' : 'bg-gray-50'}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            </div>
            <div className={`hidden sm:flex items-center gap-4 px-6 py-3 rounded-full lg:w-[450px] ${isdarkmode ? 'bg-[#202020]' : 'bg-gray-50'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <input type="text" placeholder="Search For Courses, Resources Etc.." className={`bg-transparent outline-none text-[12px] font-bold w-full ${isdarkmode ? 'text-gray-300' : 'text-gray-500'}`} />
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${isdarkmode ? 'bg-[#202020]' : 'bg-gray-50'}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
            </div>
          </div>
        </header>

        <section className="px-6 lg:px-10 py-8 flex-1 overflow-y-auto no-scrollbar">
          {children}
        </section>
      </main>
    </div>
  )
}