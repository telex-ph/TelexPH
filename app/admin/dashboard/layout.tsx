'use client'

import { ReactNode, useState, useRef, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Logout from './settings/components/logout'
import SettingsMenu from './settings/components/SettingsMenu'
import MiniActivityLogs from './MiniActivityLogs'

// Create Dark Mode Context
const DarkModeContext = createContext<{
  isdarkmode: boolean
  toggledarkmode: () => void
}>({
  isdarkmode: false,
  toggledarkmode: () => {}
})

// Export hook to use dark mode in other components
export const useDarkMode = () => useContext(DarkModeContext)

// Helper function to get department name
const getDepartmentName = (dept: number): string => {
  const departments: { [key: number]: string } = {
    1: 'Compliance',
    2: 'Innovation',
    3: 'Marketing',
    4: 'Recruitment',
    5: 'Human Resources'
  }
  return departments[dept] || 'Unknown'
}

// Helper function to get role name
const getRoleName = (role: number): string => {
  const roles: { [key: number]: string } = {
    1: 'Main Administrator',
    2: 'Administrator'
  }
  return roles[role] || 'Unknown'
}

interface UserData {
  _id: string
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  profilePicture?: string
  department: number
  role: number
  darkMode?: boolean // Added optional type for incoming DB data
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isdarkmode, setisdarkmode] = useState(false)
  const [issidebarcollapsed, setissidebarcollapsed] = useState(false)
  const [ismobilemenuopen, setismobilemenuopen] = useState(false)
  
  // FIXED: Changed to object to track multiple dropdowns
  const [opendropdowns, setopendropdowns] = useState<{ [key: string]: boolean }>({})
  
  const [isactivitylogsopen, setisactivitylogsopen] = useState(false)
  const [unreadcount, setunreadcount] = useState(0)
  
  const [isheaderdropdownopen, setisheaderdropdownopen] = useState(false)
  const dropdownref = useRef<HTMLDivElement>(null)
  const activitylogsref = useRef<HTMLDivElement>(null)

  // User data state
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [authError, setAuthError] = useState(false)

  // 1. ADDED: Check Local Storage on Mount (Prevents flashing)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setisdarkmode(true);
    }
  }, []);

  // 2. MODIFIED: Toggle function with API call and LocalStorage save
  const toggledarkmode = async () => {
    const newMode = !isdarkmode;
    
    // Immediate UI Update (Optimistic)
    setisdarkmode(newMode);
    
    // Save to Local Storage
    localStorage.setItem('theme', newMode ? 'dark' : 'light');

    // Save to Database
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/theme`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ darkMode: newMode }),
      });
    } catch (error) {
      console.error('Failed to sync theme with database:', error);
      // We don't revert state here to keep UI responsive, as local storage is safe enough
    }
  }

  const togglesidebar = () => {
    setissidebarcollapsed(!issidebarcollapsed)
    if (!issidebarcollapsed) setopendropdowns({}) // Close all dropdowns when sidebar collapses
  }

  // FIXED: Function to toggle specific dropdown
  const toggledropdown = (itemname: string) => {
    setopendropdowns(prev => ({
      ...prev,
      [itemname]: !prev[itemname]
    }))
  }

  // Fetch user data and check authentication
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingUser(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.status === 401) {
          // Unauthorized - redirect to login
          setAuthError(true)
          router.push('/admin/login')
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const data = await response.json()
        setUserData(data)
        
        // 3. ADDED: Sync state with Database preference if available
        if (data.darkMode !== undefined) {
           setisdarkmode(data.darkMode);
           // Also update local storage to match DB
           localStorage.setItem('theme', data.darkMode ? 'dark' : 'light');
        }

        setAuthError(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setAuthError(true)
        router.push('/admin/login')
      } finally {
        setIsLoadingUser(false)
      }
    }

    fetchUserData()
  }, [router])

  // Fetch unread count on mount and poll every 30 seconds
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activity-logs/unread-count`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          setunreadcount(data.unreadCount || 0)
        }
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }

    fetchUnreadCount()
    
    // Poll every 30 seconds for new activity logs
    const interval = setInterval(fetchUnreadCount, 30000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleclickoutside(event: MouseEvent) {
      if (dropdownref.current && !dropdownref.current.contains(event.target as Node)) {
        setisheaderdropdownopen(false)
      }
      if (activitylogsref.current && !activitylogsref.current.contains(event.target as Node)) {
        setisactivitylogsopen(false)
      }
    }
    document.addEventListener("mousedown", handleclickoutside)
    return () => document.removeEventListener("mousedown", handleclickoutside)
  }, [])

  useEffect(() => {
    setismobilemenuopen(false)
  }, [pathname])

  const getnavstyle = (path: string, hasdropdown: boolean = false) => {
    const isactive = pathname === path || (hasdropdown && pathname.startsWith(path))
    const collapsedpadding = issidebarcollapsed ? 'lg:justify-center lg:px-0' : 'px-4'
    
    if (isactive) {
      return `bg-[#800000] text-white shadow-md border-none ${collapsedpadding}`
    }
    
    return isdarkmode 
      ? `bg-transparent text-gray-400 hover:bg-white/5 border-none ${collapsedpadding}` 
      : `bg-transparent text-gray-500 hover:bg-gray-50 border-none ${collapsedpadding}`
  }

  const getsubnavstyle = (path: string) => {
    const isactive = pathname === path
    
    if (isactive) {
      return isdarkmode 
        ? 'text-[#800000] rounded-xl bg-white/5' 
        : 'text-[#800000] rounded-xl bg-gray-50'
    }
    
    return isdarkmode 
      ? 'text-gray-400 hover:text-white rounded-xl hover:bg-white/5' 
      : 'text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-50'
  }

  // Loading state
  if (isLoadingUser) {
    return (
      // MODIFIED: Adjusted loading background to match theme preference if known
      <div className={`flex h-screen items-center justify-center ${isdarkmode ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'}`}>
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#800000] border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (authError || !userData) {
    return null
  }

  // Helper functions to safely access user data
  const getUserInitials = () => {
    if (!userData) return '?'
    return `${userData.firstName?.[0] || ''}${userData.lastName?.[0] || ''}`.toUpperCase()
  }

  const getUserFullName = () => {
    if (!userData) return 'Unknown User'
    return `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
  }

  // MODIFIED: Base navigation items - all items that are always visible
  const baseNavigationItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
    },
    {
      name: 'Blogs',
      path: '/admin/dashboard/blogs',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>,
      hasDropdown: true,
      subItems: [
        { name: 'Add Blog', path: '/admin/dashboard/blogs' },
        { name: 'Blog List', path: '/admin/dashboard/blogs/list' }
      ]
    },
    {
      name: 'Services',
      path: '/admin/dashboard/Services',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
    },
    {
      name: 'Case Studies',
      path: '/admin/dashboard/CaseStudies',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
    },
    {
      name: 'Activity Logs',
      path: '/admin/dashboard/ActivityLogs',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
    }
  ]

  // MODIFIED: Admins item - only for Main Administrator (role 1)
  const adminsMenuItem = {
    name: 'Admins',
    path: '/admin/dashboard/admin-management',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    hasDropdown: true,
    subItems: [
      { name: 'Add Admin', path: '/admin/dashboard/admin-management/add' },
      { name: 'Admin List', path: '/admin/dashboard/admin-management' }
    ]
  }

  // MODIFIED: Conditionally build navigation items based on user role
  const navigationitems = userData.role === 1 
    ? [...baseNavigationItems, adminsMenuItem] // Main Administrator - show all items including Admins
    : baseNavigationItems // Regular Administrator - show only base items

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
          {(!iscollapsed || ismobilemenuopen) && (
            <span className={`text-lg uppercase font-bold tracking-tighter transition-colors ${isdarkmode ? 'text-gray-300' : 'text-gray-700'}`}>
              TELEX
            </span>
          )}
        </Link>
        {ismobilemenuopen && (
            <button onClick={() => setismobilemenuopen(false)} className="lg:hidden p-2 text-gray-400 bg-transparent border-none">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
        )}
      </div>

      <nav className={`flex-1 overflow-y-auto py-8 space-y-2 transition-all duration-300 ${iscollapsed ? 'px-2' : 'px-6'}`}>
        <div className={`text-[10px] font-black uppercase tracking-widest mb-4 transition-colors ${iscollapsed ? 'text-center' : 'px-4'} ${isdarkmode ? 'text-gray-500' : 'text-gray-400'}`}>
          {!iscollapsed && 'Main Menu'}
        </div>
        
        <div className="space-y-1">
          {navigationitems.map((item) => (
            <div key={item.name}>
              {item.hasDropdown ? (
                <>
                  {/* FIXED: Use item.name as unique key for toggledropdown */}
                  <button
                    onClick={() => toggledropdown(item.name)}
                    className={`w-full flex items-center rounded-2xl text-[12px] transition-all duration-300 active:scale-95 border-none outline-none ${iscollapsed ? 'justify-center py-3.5' : 'justify-between py-3.5'} ${getnavstyle(item.path, true)}`}
                  >
                    <div className={`flex items-center ${iscollapsed ? '' : 'gap-4'}`}>
                      <span className="shrink-0">{item.icon}</span>
                      {(!iscollapsed || ismobilemenuopen) && <span className="tracking-wide uppercase font-medium">{item.name}</span>}
                    </div>
                    {(!iscollapsed || ismobilemenuopen) && (
                      <svg className={`w-4 h-4 transition-transform ${opendropdowns[item.name] ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                    )}
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${opendropdowns[item.name] && (!iscollapsed || ismobilemenuopen) ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                    <div className="py-2 space-y-1">
                      {item.subItems?.map((sub) => (
                        <Link 
                          key={sub.name}
                          href={sub.path}
                          className={`group relative flex items-center py-2.5 pl-6 pr-4 no-underline transition-all active:scale-95 my-1 mx-2 ${getsubnavstyle(sub.path)}`}
                        >
                          <div className={`absolute left-[-8px] w-4 h-px top-1/2 ${isdarkmode ? 'bg-white/10' : 'bg-gray-200'} rounded-tr-lg`} />
                          <span className={`text-[10px] uppercase tracking-wider font-bold transition-colors`}>
                            {sub.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link 
                  href={item.path}
                  className={`w-full flex items-center rounded-2xl text-[12px] transition-all duration-300 active:scale-95 border-none outline-none no-underline ${iscollapsed ? 'justify-center py-3.5' : 'justify-between py-3.5'} ${getnavstyle(item.path)}`}
                >
                  <div className={`flex items-center ${iscollapsed ? '' : 'gap-4'}`}>
                    <span className="shrink-0">{item.icon}</span>
                    {(!iscollapsed || ismobilemenuopen) && <span className="tracking-wide uppercase font-medium">{item.name}</span>}
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      <div className={`pb-6 space-y-3 border-t transition-all duration-300 ${iscollapsed ? 'px-2' : 'px-6'} ${isdarkmode ? 'border-white/5' : 'border-gray-50'}`}>
        <div className={`flex items-center text-[12px] py-4 ${iscollapsed ? 'justify-center' : 'justify-between px-4'}`}>
          <div className={`flex items-center gap-4 transition-colors ${isdarkmode ? 'text-white' : 'text-gray-500'}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
            {(!iscollapsed || ismobilemenuopen) && <span className="tracking-wide uppercase font-bold">Dark Mode</span>}
          </div>
          {(!iscollapsed || ismobilemenuopen) && (
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
            <div className="w-10 h-10 bg-[#800000] rounded-xl flex items-center justify-center text-white text-xs font-bold uppercase border-none shrink-0 shadow-lg shadow-maroon-900/20 overflow-hidden">
              {userData.profilePicture ? (
                <img src={userData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                getUserInitials()
              )}
            </div>
            {(!iscollapsed || ismobilemenuopen) && (
              <div className="flex flex-col text-left">
                <span className={`text-[12px] font-bold uppercase transition-colors ${isdarkmode ? 'text-white' : 'text-gray-800'}`}>
                  {getUserFullName()}
                </span>
                <span className="text-[10px] font-medium tracking-tighter text-gray-400">
                  {getDepartmentName(userData.department)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )

  return (
    <DarkModeContext.Provider value={{ isdarkmode, toggledarkmode }}>
      <div className={`flex h-screen overflow-hidden antialiased transition-colors duration-500 ${isdarkmode ? 'bg-[#0f0f0f] text-gray-400' : 'bg-[#f8f9fa] text-gray-600'}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;900&display=swap');
          body { font-family: 'Poppins', sans-serif; font-weight: 400; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>

        <aside className={`border-r hidden lg:flex flex-col h-full z-20 transition-all duration-300 ease-in-out ${issidebarcollapsed ? 'w-24' : 'w-72'} ${isdarkmode ? 'bg-[#181818] border-white/5' : 'bg-white border-gray-100'}`}>
          <SidebarContent iscollapsed={issidebarcollapsed} />
        </aside>

        <div 
          className={`lg:hidden fixed inset-0 bg-black/50 z-[40] transition-opacity duration-300 ${ismobilemenuopen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
          onClick={() => setismobilemenuopen(false)}
        />

        <aside className={`lg:hidden fixed left-0 top-0 bottom-0 w-72 z-[50] transition-transform duration-300 ease-in-out transform flex flex-col ${ismobilemenuopen ? 'translate-x-0' : '-translate-x-full'} ${isdarkmode ? 'bg-[#181818]' : 'bg-white'}`}>
          <SidebarContent iscollapsed={false} />
        </aside>

        <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
          <header className={`h-24 flex items-center justify-between px-6 lg:px-10 shrink-0 transition-colors duration-500 ${isdarkmode ? 'bg-[#181818]' : 'bg-white border-b border-gray-50'}`}>
            <div className="flex items-center gap-4">
              <button onClick={() => setismobilemenuopen(true)} className="lg:hidden p-2.5 rounded-2xl text-gray-400 bg-gray-50 border-none transition-all active:scale-90">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </button>
              <button onClick={togglesidebar} className={`hidden lg:block p-2.5 rounded-2xl border-none transition-all active:scale-95 cursor-pointer ${isdarkmode ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-400'}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg>
              </button>
            </div>

            <div className="relative flex items-center gap-2 lg:gap-3">
              <div className="" ref={activitylogsref}>
                <button 
                  onClick={() => setisactivitylogsopen(!isactivitylogsopen)}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center relative cursor-pointer transition-all border-none outline-none active:scale-90 ${isdarkmode ? 'bg-[#202020] hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  {unreadcount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#800000] text-white text-[9px] flex items-center justify-center rounded-full border border-white font-bold">
                      {unreadcount > 9 ? '9+' : unreadcount}
                    </span>
                  )}
                </button>

                {isactivitylogsopen && (
                  <div className={`absolute right-22 mt-6 w-[450px] rounded-[2rem] shadow-2xl border z-[100] animate-in fade-in zoom-in-95 duration-200 ${isdarkmode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'}`}>
                    <MiniActivityLogs 
                      isdarkmode={isdarkmode} 
                      onUnreadCountChange={(count) => setunreadcount(count)}
                      onClose={() => setisactivitylogsopen(false)}
                    />
                  </div>
                )}
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
    </DarkModeContext.Provider>
  )
}