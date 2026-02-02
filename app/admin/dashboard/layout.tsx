'use client'

import { ReactNode, useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logout from './settings/components/logout'
import SettingsMenu from './settings/components/SettingsMenu'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const [isassignmentsopen, setisassignmentsopen] = useState(false)
  const [isdarkmode, setisdarkmode] = useState(false)
  const [issidebarcollapsed, setissidebarcollapsed] = useState(false)
  const [ismobilemenuopen, setismobilemenuopen] = useState(false)
  
  const [isheaderdropdownopen, setisheaderdropdownopen] = useState(false)
  const dropdownref = useRef<HTMLDivElement>(null)

  const toggledarkmode = () => {
    setisdarkmode(!isdarkmode)
  }

  const togglesidebar = () => {
    setissidebarcollapsed(!issidebarcollapsed)
    if (!issidebarcollapsed) setisassignmentsopen(false)
  }

  useEffect(() => {
    function handleclickoutside(event: MouseEvent) {
      if (dropdownref.current && !dropdownref.current.contains(event.target as Node)) {
        setisheaderdropdownopen(false)
      }
    }
    document.addEventListener("mousedown", handleclickoutside)
    return () => document.removeEventListener("mousedown", handleclickoutside)
  }, [])

  const getnavstyle = (path: string) => {
    const isactive = pathname === path
    const collapsedpadding = issidebarcollapsed ? 'lg:justify-center lg:px-0' : 'px-4'
    
    if (isactive) {
      return `bg-[#800000] text-white shadow-md -translate-y-[1px] border-none px-4 ${collapsedpadding}`
    }
    return isdarkmode 
      ? `text-gray-500 hover:text-white hover:bg-white/5 border-none px-4 ${collapsedpadding}` 
      : `text-gray-400 hover:text-[#800000] hover:bg-gray-50 border-none px-4 ${collapsedpadding}`
  }

  const navitems = [
    { 
      name: 'Blogs', 
      path: '/admin/dashboard/blogs', 
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" /><path d="M8 7h6" /><path d="M8 11h8" /></svg> 
    },
    { 
      name: 'Case Studies', 
      path: '/admin/dashboard/CaseStudies', 
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg> 
    },
  ]

  const SidebarContent = ({ iscollapsed }: { iscollapsed: boolean }) => (
    <>
      <div className={`p-8 flex items-center transition-all duration-300 ${iscollapsed ? 'lg:justify-center' : 'justify-between'}`}>
        <Link href="/admin/dashboard" className={`flex items-center gap-3 cursor-pointer group transition-all duration-300 no-underline border-none ${iscollapsed ? 'lg:w-full lg:justify-center' : ''}`}>
          <div className="flex items-center justify-center shrink-0">
            <img 
              src="/images/log0.png" 
              alt="logo" 
              className={`transition-all duration-300 object-contain ${iscollapsed ? 'w-10 h-10' : 'w-14 h-14'}`} 
            />
          </div>
          {!iscollapsed && (
            <span className={`text-lg uppercase tracking-tighter transition-colors ${isdarkmode ? 'text-gray-300' : 'text-gray-700'}`}>
              TELEX
            </span>
          )}
        </Link>
      </div>
      
      <nav className={`flex-1 space-y-3 overflow-y-auto no-scrollbar pt-2 transition-all duration-300 ${iscollapsed ? 'px-2' : 'px-6'}`}>
        <Link 
          href="/admin/dashboard"
          className={`w-full flex items-center py-3.5 rounded-2xl text-[12px] transition-all duration-300 active:scale-95 border-none outline-none no-underline ${iscollapsed ? 'justify-center' : 'gap-4'} ${getnavstyle('/admin/dashboard')}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          {!iscollapsed && <span className="tracking-wide">Dashboard</span>}
        </Link>

        <div className="space-y-2">
          {navitems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className={`w-full flex items-center rounded-2xl text-[12px] transition-all duration-300 active:scale-95 border-none outline-none no-underline ${iscollapsed ? 'justify-center py-3.5' : 'justify-between py-3.5'} ${getnavstyle(item.path)}`}
            >
              <div className={`flex items-center ${iscollapsed ? '' : 'gap-4'}`}>
                <span className="shrink-0">{item.icon}</span>
                {!iscollapsed && <span className="tracking-wide">{item.name}</span>}
              </div>
            </Link>
          ))}
        </div>
      </nav>

      <div className={`pb-6 space-y-3 border-t transition-all duration-300 ${iscollapsed ? 'px-2' : 'px-6'} ${isdarkmode ? 'border-white/5' : 'border-gray-50'}`}>
        <div className={`flex items-center text-[12px] py-4 ${iscollapsed ? 'justify-center' : 'justify-between px-4'}`}>
          <div className={`flex items-center gap-4 transition-colors ${isdarkmode ? 'text-white' : 'text-gray-500'}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
            {!iscollapsed && <span className="tracking-wide">Dark Mode</span>}
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
        
        <div className={`flex items-center p-3 rounded-2xl border-none mt-2 shadow-sm transition-all hover:shadow-md cursor-pointer ${iscollapsed ? 'justify-center' : 'justify-between'} ${isdarkmode ? 'bg-[#202020]' : 'bg-white'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#800000] rounded-xl flex items-center justify-center text-white text-xs uppercase border-none shrink-0">aj</div>
            {!iscollapsed && (
              <div className="flex flex-col text-left">
                <span className={`text-[12px] uppercase transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>alex johnson</span>
                <span className="text-[10px] tracking-tighter text-gray-400">Administrator</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className={`flex h-screen overflow-hidden antialiased transition-colors duration-500 ${isdarkmode ? 'bg-[#0f0f0f] text-gray-400' : 'bg-[#f8f9fa] text-gray-600'}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Poppins', sans-serif; font-weight: 400; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <aside className={`border-r hidden lg:flex flex-col h-full z-20 transition-all duration-300 ease-in-out ${issidebarcollapsed ? 'w-24' : 'w-72'} ${isdarkmode ? 'bg-[#181818] border-white/5' : 'bg-white border-gray-100'}`}>
        <SidebarContent iscollapsed={issidebarcollapsed} />
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
        <header className={`h-24 flex items-center justify-between px-6 lg:px-10 shrink-0 transition-colors duration-500 ${isdarkmode ? 'bg-[#181818]' : 'bg-white border-b border-gray-50'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setismobilemenuopen(true)} className="lg:hidden p-2 rounded-xl text-gray-400 bg-transparent border-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <button onClick={togglesidebar} className={`hidden lg:block p-2.5 rounded-2xl border-none transition-all active:scale-95 cursor-pointer ${isdarkmode ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-400'}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center relative ${isdarkmode ? 'bg-[#202020]' : 'bg-gray-50'}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#800000] text-white text-[9px] flex items-center justify-center rounded-full border border-white">9</span>
            </div>
            
            <div className={`hidden sm:flex items-center gap-4 px-6 py-3 rounded-full lg:w-[450px] ${isdarkmode ? 'bg-[#202020]' : 'bg-gray-50'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <input type="text" placeholder="Search For Courses, Resources Etc.." className={`bg-transparent outline-none text-[12px] w-full border-none ${isdarkmode ? 'text-gray-300' : 'text-gray-500'}`} />
            </div>

            <div className="relative" ref={dropdownref}>
              <button 
                onClick={() => setisheaderdropdownopen(!isheaderdropdownopen)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer transition-all border-none outline-none active:scale-90 ${isdarkmode ? 'bg-[#202020] hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/></svg>
              </button>

              {isheaderdropdownopen && (
                <div className={`absolute right-0 mt-4 w-72 rounded-[35px] shadow-2xl border p-3 z-[100] animate-in fade-in zoom-in-95 duration-200 ${isdarkmode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                  <div onClick={() => setisheaderdropdownopen(false)}>
                    <SettingsMenu isdarkmode={isdarkmode} />
                  </div>
                  <div className={`h-[1px] mx-6 my-2 ${isdarkmode ? 'bg-white/5' : 'bg-gray-50'}`} />
                  <div onClick={() => setisheaderdropdownopen(false)}>
                    <Logout isdarkmode={isdarkmode} />
                  </div>
                </div>
              )}
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