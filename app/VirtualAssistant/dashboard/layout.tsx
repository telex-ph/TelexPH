'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const Ico = ({ d, d2, size = 16, sw = 1.2 }: { d: string; d2?: string; size?: number; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />{d2 && <path d={d2} />}
  </svg>
)

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const BG        = '#E7E7E7'
const NEU_OUT   = '-5px -5px 14px #FFFFFF, 5px 5px 14px #CACAEC'
const NEU_IN    = 'inset 3px 3px 7px #CACAEC, inset -3px -3px 7px #fff'
const TEXT_MAIN = '#2a2a2a'
const TEXT_SUB  = '#888'
const PRIMARY   = '#800000'

const NavIcon = ({ children, active }: { children: React.ReactNode; active?: boolean }) => (
  <span style={{ width: 26, height: 26, borderRadius: 7, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: BG, color: active ? PRIMARY : '#666', boxShadow: active ? NEU_IN : NEU_OUT, transition: 'all 0.15s' }}>{children}</span>
)

// ─── NAV ICONS ────────────────────────────────────────────────────────────────
const DashIco      = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" d2="M9 22V12h6v10" size={13} /></NavIcon>
const AssessIco    = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" size={13} /></NavIcon>
const MessagingIco = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" size={13} /></NavIcon>
const SettingsIco  = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" d2="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" size={13} /></NavIcon>

const ChevronLeft  = () => <Ico d="M15 18l-6-6 6-6" size={14} sw={1.5} />
const ChevronRight = () => <Ico d="M9 18l6-6-6-6" size={14} sw={1.5} />
const SearchIco    = () => <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={14} />
const BellIco      = () => <Ico d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" size={16} />
const LogoutIco    = () => <Ico d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" size={13} />
const MenuIco      = () => <Ico d="M3 12h18M3 6h18M3 18h18" size={18} />
const ProfileIco   = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={13} />
const CheckIco     = () => <Ico d="M20 6L9 17l-5-5" size={12} />
const TrashIco     = () => <Ico d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" size={12} />

type ClientInfo = {
  id: string
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  profilePicture?: string | null
}

type Notification = {
  _id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// ─── NAV DATA ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Dashboard',  href: '/VirtualAssistant/dashboard',                icon: (a: boolean) => <DashIco a={a} /> },
  { label: 'Assessment', href: '/VirtualAssistant/dashboard/VAassesment',    icon: (a: boolean) => <AssessIco a={a} /> },
  { label: 'Messaging',  href: '/VirtualAssistant/dashboard/VAmessaging',    icon: (a: boolean) => <MessagingIco a={a} /> },
]

// ─── NOTIFICATION BELL ────────────────────────────────────────────────────────
function NotificationBell({ userId }: { userId: string | undefined }) {
  const [open, setOpen]                   = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading]             = useState(false)
  const bellRef                           = useRef<HTMLDivElement>(null)
  const unreadCount                       = notifications.filter(n => !n.isRead).length

  const fetchNotifications = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/notifications?userId=${userId}&userType=va`, { credentials: 'include' })
      if (res.ok) setNotifications(await res.json())
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) fetchNotifications()
  }, [userId])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/notifications/${id}/read`, { method: 'PUT', credentials: 'include' })
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  const markAllAsRead = async () => {
    if (!userId) return
    try {
      await fetch(`${API_BASE}/api/notifications/read-all?userId=${userId}&userType=va`, { method: 'PUT', credentials: 'include' })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/notifications/${id}`, { method: 'DELETE', credentials: 'include' })
      setNotifications(prev => prev.filter(n => n._id !== id))
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div ref={bellRef} style={{ position: 'relative' }}>
      <div
        onClick={() => { setOpen(!open); if (!open) fetchNotifications() }}
        style={{ width: 36, height: 36, borderRadius: 10, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: TEXT_SUB, position: 'relative', boxShadow: NEU_OUT }}
      >
        <BellIco />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: 6, right: 7, minWidth: 8, height: 8, borderRadius: '50%', background: PRIMARY, border: `2px solid ${BG}`, fontSize: 7, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: unreadCount > 9 ? '0 2px' : 0 }}>
            {unreadCount > 9 ? '9+' : ''}
          </span>
        )}
      </div>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 320, background: BG, borderRadius: 16, boxShadow: '-10px -10px 30px #fff, 10px 10px 30px #CACAEC', zIndex: 200, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN }}>Notifications {unreadCount > 0 && <span style={{ background: PRIMARY, color: '#fff', borderRadius: 20, fontSize: 10, padding: '1px 6px', marginLeft: 4 }}>{unreadCount}</span>}</span>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: PRIMARY, fontWeight: 600 }}>Mark all read</button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 340, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 12, color: TEXT_SUB }}>Loading...</div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 12, color: TEXT_SUB }}>No notifications yet</div>
            ) : notifications.map(n => (
              <div key={n._id} style={{ padding: '10px 16px', borderBottom: '1px solid rgba(0,0,0,0.04)', background: n.isRead ? 'transparent' : 'rgba(128,0,0,0.04)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                {/* Unread dot */}
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: n.isRead ? 'transparent' : PRIMARY, marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: n.isRead ? 400 : 600, color: TEXT_MAIN }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: TEXT_SUB, marginTop: 2, lineHeight: 1.4 }}>{n.message}</div>
                  <div style={{ fontSize: 10, color: '#bbb', marginTop: 4 }}>{timeAgo(n.createdAt)}</div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {!n.isRead && (
                    <button onClick={() => markAsRead(n._id)} title="Mark as read" style={{ background: 'none', border: 'none', cursor: 'pointer', color: PRIMARY, padding: 3, borderRadius: 6 }}><CheckIco /></button>
                  )}
                  <button onClick={() => deleteNotification(n._id)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 3, borderRadius: 6 }}><TrashIco /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({ onMenuClick, clientInfo, onLogout }: { onMenuClick: () => void; clientInfo: ClientInfo | null; onLogout: () => void }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowUserMenu(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const avatarLetter = clientInfo ? clientInfo.firstName.charAt(0).toUpperCase() : '?'
  const displayName  = clientInfo ? `${clientInfo.firstName} ${clientInfo.lastName}` : 'Loading...'
  const displayEmail = clientInfo?.email ?? ''

  return (
    <header style={{ height: 60, background: BG, borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14, position: 'sticky', top: 0, zIndex: 100 }}>
      <button className="mobile-only" onClick={onMenuClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_SUB }}><MenuIco /></button>
      <div style={{ flex: 1 }}>
        <div className="desktop-only" style={{ fontSize: 12, color: TEXT_SUB }}>{today}</div>
      </div>

      {/* Search box */}
      <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG, borderRadius: 12, padding: '7px 14px', fontSize: 12, color: TEXT_SUB, width: 190, boxShadow: NEU_IN }}>
        <SearchIco /><span>Search...</span>
      </div>

      {/* Notification Bell */}
      <NotificationBell userId={clientInfo?.id} />

      {/* Avatar */}
      <div style={{ position: 'relative' }} ref={menuRef}>
        <div onClick={() => setShowUserMenu(!showUserMenu)}
          style={{ width: 36, height: 36, borderRadius: '50%', background: PRIMARY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, cursor: 'pointer', overflow: 'hidden', boxShadow: NEU_OUT }}>
          {clientInfo?.profilePicture
            ? <img src={clientInfo.profilePicture} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : avatarLetter}
        </div>
        {showUserMenu && (
          <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 200, background: BG, borderRadius: 16, boxShadow: '-10px -10px 30px #fff, 10px 10px 30px #CACAEC', overflow: 'hidden', zIndex: 200 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 12, color: TEXT_MAIN, fontWeight: 600 }}>{displayName}</div>
              <div style={{ fontSize: 10, color: TEXT_SUB, marginTop: 2 }}>{displayEmail}</div>
            </div>
            <div style={{ padding: '6px' }}>
              <div onClick={() => { setShowUserMenu(false); router.push('/VirtualAssistant/dashboard/Settings') }}
                style={{ padding: '8px 12px', fontSize: 12, borderRadius: 10, cursor: 'pointer', color: TEXT_MAIN, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ProfileIco /> Profile Settings
              </div>
              <div onClick={onLogout}
                style={{ padding: '8px 12px', fontSize: 12, borderRadius: 10, cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8 }}>
                <LogoutIco /> Logout
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

// ─── NAV ITEM ─────────────────────────────────────────────────────────────────
function NavItem({ label, href, icon, collapsed, isActive }: { label: string; href: string; icon: (a: boolean) => React.ReactNode; collapsed: boolean; isActive: boolean }) {
  return (
    <Link href={href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '8px 6px' : '8px 10px', borderRadius: 12, marginBottom: 3, background: isActive ? BG : 'transparent', boxShadow: isActive ? NEU_IN : 'none', color: isActive ? PRIMARY : TEXT_MAIN, fontWeight: isActive ? 600 : 400, fontSize: 12.5, textDecoration: 'none', justifyContent: collapsed ? 'center' : 'flex-start', transition: 'all 0.15s' }}>
      {icon(isActive)}
      {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
    </Link>
  )
}

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
export default function VADashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)

  const isMessaging = pathname === '/VirtualAssistant/dashboard/VAmessaging'

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/va/me`, { method: 'GET', credentials: 'include' })
        if (res.ok) {
          setClientInfo(await res.json())
        } else if (res.status === 401 || res.status === 403) {
          router.push('/VirtualAssistant/login')
        }
      } catch (err) {
        console.error('Failed to fetch VA profile:', err)
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await fetch(`${API_BASE}/auth/va/logout`, { method: 'POST', credentials: 'include' })
    } catch { /* proceed */ } finally {
      setClientInfo(null)
      setLoggingOut(false)
      router.push('/VirtualAssistant/login')
    }
  }

  const avatarLetter = clientInfo ? clientInfo.firstName.charAt(0).toUpperCase() : '?'
  const sidebarName  = clientInfo ? `${clientInfo.firstName} ${clientInfo.lastName}` : 'Loading...'
  const sidebarEmail = clientInfo?.email ?? ''

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: BG, overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Poppins', sans-serif; font-weight: 400; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        a { text-decoration: none; color: inherit; }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .search-box   { display: none !important; }
          .sidebar { position: fixed !important; left: 0 !important; top: 0 !important; width: 240px !important; min-width: 240px !important; height: 100vh !important; transform: translateX(-100%); transition: transform 0.25s ease !important; z-index: 200 !important; }
          .sidebar.open { transform: translateX(0) !important; box-shadow: 4px 0 30px rgba(0,0,0,0.15) !important; }
          .overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 190; }
          .overlay.active { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
          .overlay     { display: none !important; }
        }
      `}</style>

      <div className={`overlay ${mobileOpen ? 'active' : ''}`} onClick={() => setMobileOpen(false)} />

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}
        style={{ width: collapsed ? 68 : 248, minWidth: collapsed ? 68 : 248, background: BG, height: '100vh', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.06)', transition: 'all 0.22s ease', zIndex: 150 }}>

        {/* Logo bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: '0 16px', height: 60, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: BG, boxShadow: `-6px -6px 14px #fff, 6px 6px 14px #CACAEC`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1.5" fill="#800000" />
                <rect x="8" y="1" width="5" height="5" rx="1.5" fill="#800000" />
                <rect x="1" y="8" width="5" height="5" rx="1.5" fill="#800000" />
                <rect x="8" y="8" width="5" height="5" rx="1.5" fill="#800000" />
              </svg>
            </div>
            {!collapsed && <span style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN, letterSpacing: '0.06em', textTransform: 'uppercase' }}>VA Portal</span>}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="desktop-only"
            style={{ background: BG, border: 'none', borderRadius: 8, cursor: 'pointer', color: TEXT_SUB, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: NEU_OUT }}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <button onClick={() => setMobileOpen(false)} className="mobile-only"
            style={{ background: BG, border: 'none', borderRadius: 8, cursor: 'pointer', color: TEXT_SUB, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: NEU_OUT }}>
            <ChevronLeft />
          </button>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 10px' }}>
          {!collapsed && (
            <div style={{ fontSize: 9.5, color: '#bbb', padding: '0 10px 8px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>Menu</div>
          )}
          {collapsed && <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '0 4px 10px' }} />}
          {NAV_ITEMS.map(item => (
            <NavItem
              key={item.label}
              label={item.label}
              href={item.href}
              icon={item.icon}
              collapsed={collapsed}
              isActive={pathname === item.href}
            />
          ))}
        </div>

        {/* Bottom: settings + profile */}
        <div style={{ padding: '10px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <NavItem
            label="Settings"
            href="/VirtualAssistant/dashboard/Settings"
            icon={(a) => <SettingsIco a={a} />}
            collapsed={collapsed}
            isActive={pathname === '/VirtualAssistant/dashboard/Settings'}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '8px 6px' : '10px 12px', borderRadius: 14, background: BG, boxShadow: NEU_OUT, justifyContent: collapsed ? 'center' : 'flex-start', marginTop: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: PRIMARY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, overflow: 'hidden', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.2)' }}>
              {clientInfo?.profilePicture
                ? <img src={clientInfo.profilePicture} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : avatarLetter}
            </div>
            {!collapsed && (
              <>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 11.5, color: TEXT_MAIN, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: 600 }}>{sidebarName}</div>
                  <div style={{ fontSize: 10, color: TEXT_SUB, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', marginTop: 1 }}>{sidebarEmail}</div>
                </div>
                <button onClick={handleLogout} disabled={loggingOut} title="Logout"
                  style={{ background: 'none', border: 'none', cursor: loggingOut ? 'not-allowed' : 'pointer', color: loggingOut ? '#ccc' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, borderRadius: 6, flexShrink: 0 }}>
                  <LogoutIco />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Header onMenuClick={() => setMobileOpen(true)} clientInfo={clientInfo} onLogout={handleLogout} />
        <main style={{ flex: 1, overflowY: 'auto', padding: isMessaging ? '0' : '20px' }}>{children}</main>
      </div>
    </div>
  )
}