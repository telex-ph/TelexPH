'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Ico = ({ d, d2, size = 16, sw = 1.2 }: { d: string; d2?: string; size?: number; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />{d2 && <path d={d2} />}
  </svg>
)

const NavIcon = ({ children }: { children: React.ReactNode }) => (
  <span style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #e0dede', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#fff', color: '#333' }}>{children}</span>
)

const CalIcon = () => <NavIcon><Ico d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" size={13} /></NavIcon>
const BookingIcon = () => <NavIcon><Ico d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" size={13} /></NavIcon>
const ClientIcon = () => <NavIcon><Ico d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" d2="M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={13} /></NavIcon>
const StaffIcon = () => <NavIcon><Ico d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" d2="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={13} /></NavIcon>
const ServicesIcon = () => <NavIcon><Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" size={13} /></NavIcon>
const AnalyticsIcon = () => <NavIcon><Ico d="M18 20V10M12 20V4M6 20v-6" size={13} /></NavIcon>
const InvoiceIcon = () => <NavIcon><Ico d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" d2="M14 2v6h6M16 13H8M16 17H8M10 9H8" size={13} /></NavIcon>
const TrelloIcon = () => <NavIcon><Ico d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" size={13} /></NavIcon>
const ZoomIcon = () => <NavIcon><Ico d="M15 10l4.553-2.069A1 1 0 0 1 21 8.81v6.38a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" size={13} /></NavIcon>
const FormsIcon = () => <NavIcon><Ico d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" d2="M14 2v6h6M12 18v-6M9 15h6" size={13} /></NavIcon>
const FeedbackIco = () => <NavIcon><Ico d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" size={13} /></NavIcon>
const SupportIco = () => <NavIcon><Ico d="M3 18v-6a9 9 0 0 1 18 0v6" d2="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" size={13} /></NavIcon>
const SettingsIco = () => <NavIcon><Ico d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" d2="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" size={13} /></NavIcon>

const ChevronDown = () => <Ico d="M6 9l6 6 6-6" size={13} sw={1.5} />
const ChevronUp = () => <Ico d="M18 15l-6-6-6 6" size={13} sw={1.5} />
const ChevronLeft = () => <Ico d="M15 18l-6-6 6-6" size={14} sw={1.5} />
const ChevronRight = () => <Ico d="M9 18l6-6-6-6" size={14} sw={1.5} />
const SearchIco = () => <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={14} />
const BellIco = () => <Ico d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" size={16} />
const LogoutIco = () => <Ico d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" size={13} />
const MenuIco = () => <Ico d="M3 12h18M3 6h18M3 18h18" size={18} />

const Badge = ({ dot, dotColor, label }: { dot?: boolean; dotColor?: string; label?: string }) => {
  if (dot && label) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f0eeee', borderRadius: 20, padding: '2px 8px', fontSize: 10.5, color: '#666' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
      {label}
    </span>
  )
  return null
}

const NAV_GENERAL = [
  { label: 'Dashboard', href: '/client/dashboard', icon: <CalIcon /> },
  { label: 'Appointments', icon: <BookingIcon />, children: [{ label: 'Upcoming', href: '/client/dashboard/appointments/upcoming' }, { label: 'Completed', href: '/client/dashboard/appointments/completed' }, { label: 'Cancelled', href: '/client/dashboard/appointments/cancelled' }] },
  { label: 'Analytics', href: '/client/dashboard/analytics', icon: <AnalyticsIcon /> },
]
const NAV_MANAGEMENT = [
  { label: 'Clients', href: '/client/dashboard/clients', icon: <ClientIcon /> },
  { label: 'Staff', href: '/client/dashboard/staff', icon: <StaffIcon /> },
  { label: 'Services', href: '/client/dashboard/services', icon: <ServicesIcon /> },
  { label: 'Invoices', href: '/client/dashboard/invoices', icon: <InvoiceIcon /> },
]
const NAV_APPS = [
  { label: 'Reminders', href: '/client/dashboard/reminders', icon: <TrelloIcon />, dot: true, dotColor: '#ef4444', dotLabel: 'Not synced' },
  { label: 'Zoom', href: '/client/dashboard/zoom', icon: <ZoomIcon /> },
  { label: 'Forms', href: '/client/dashboard/forms', icon: <FormsIcon />, dot: true, dotColor: '#22c55e', dotLabel: 'In sync' },
]
const NAV_SUPPORT = [
  { label: 'Feedback', href: '/client/dashboard/feedback', icon: <FeedbackIco /> },
  { label: 'Help & Support', href: '/client/dashboard/support', icon: <SupportIco /> },
  { label: 'Settings', href: '/client/dashboard/settings', icon: <SettingsIco /> },
]

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowUserMenu(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header style={{ height: 56, background: '#fff', borderBottom: '1px solid #f0eeee', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14, position: 'sticky', top: 0, zIndex: 100 }}>
      <button className="mobile-only" onClick={onMenuClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333' }}><MenuIco /></button>
      <div style={{ flex: 1 }}><div className="desktop-only" style={{ fontSize: 12, color: '#aaa' }}>{today}</div></div>
      <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f7f5f5', border: '1px solid #ece8e8', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#aaa', width: 180 }}><SearchIco /><span>Search..</span></div>
      <div style={{ position: 'relative', cursor: 'pointer', color: '#888', display: 'flex' }}><BellIco /><span style={{ position: 'absolute', top: -2, right: -2, width: 7, height: 7, borderRadius: '50%', background: '#800000', border: '1px solid #fff' }} /></div>
      <div style={{ position: 'relative' }} ref={menuRef}>
        <div onClick={() => setShowUserMenu(!showUserMenu)} style={{ width: 30, height: 30, borderRadius: '50%', background: '#800000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, cursor: 'pointer' }}>N</div>
        {showUserMenu && (
          <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 190, background: '#fff', borderRadius: 10, boxShadow: '0 8px 20px rgba(0,0,0,0.08)', border: '1px solid #f0eeee', overflow: 'hidden', zIndex: 110 }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #f5f2f2' }}>
              <div style={{ fontSize: 12, color: '#1a1a2e' }}>Achmad Hakim</div>
              <div style={{ fontSize: 10, color: '#aaa' }}>achmadhakim@gmail.com</div>
            </div>
            <div style={{ padding: '5px' }}>
              <div style={{ padding: '6px 10px', fontSize: 12, borderRadius: 6, cursor: 'pointer', color: '#444' }}>Profile Settings</div>
              <div style={{ padding: '6px 10px', fontSize: 12, borderRadius: 6, cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 10 }}><LogoutIco /> Logout</div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function NavSection({ label, items, collapsed, pathname, openMenus, onToggle }: any) {
  const isActive = (href?: string) => !!href && pathname === href
  return (
    <div style={{ marginBottom: 6 }}>
      {!collapsed && label && <div style={{ fontSize: 10, color: '#aaa', padding: '10px 8px 4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>}
      {items.map((item: any) => {
        const open = openMenus[item.label] ?? false
        const anyChild = item.children?.some((c: any) => pathname === c.href)
        if (item.children) {
          return (
            <div key={item.label} style={{ position: 'relative' }}>
              <div onClick={() => onToggle(item.label)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', background: anyChild ? '#f5f3f3' : 'transparent', color: '#333' }}>
                {item.icon}
                {!collapsed && <><span style={{ flex: 1, fontSize: 12 }}>{item.label}</span><span style={{ color: '#aaa', display: 'flex' }}>{open ? <ChevronUp /> : <ChevronDown />}</span></>}
              </div>
              {open && !collapsed && (
                <div style={{ position: 'relative', marginLeft: 23, marginTop: 2 }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 15, width: '1px', background: '#e0dede' }} />
                  {item.children.map((child: any) => (
                    <div key={child.href} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <div style={{ position: 'absolute', left: 0, top: 15, width: 12, height: '1px', background: '#e0dede' }} />
                      <div style={{ position: 'absolute', left: 12, top: 12, width: 4, height: 4, borderRadius: '50%', border: '1px solid #e0dede', background: '#fff' }} />
                      <Link href={child.href} style={{ display: 'block', flex: 1, padding: '6px 12px 6px 22px', borderRadius: 6, fontSize: 11.5, color: isActive(child.href) ? '#800000' : '#777', background: isActive(child.href) ? '#fff5f5' : 'transparent' }}>{child.label}</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        }
        return (
          <Link key={item.label} href={item.href!} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 8, color: isActive(item.href) ? '#800000' : '#333', background: isActive(item.href) ? '#fff5f5' : 'transparent' }}>
            {item.icon}{!collapsed && <><span style={{ flex: 1, fontSize: 12 }}>{item.label}</span>{item.dot && <Badge dot dotColor={item.dotColor} label={item.dotLabel} />}</>}
          </Link>
        )
      })}
    </div>
  )
}

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  const toggle = (l: string) => setOpenMenus(p => ({ ...p, [l]: !p[l] }))

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#ffffff', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Poppins', sans-serif; font-weight: 400; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
        a { text-decoration: none; color: inherit; }
        
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .search-box { display: none !important; }
          .sidebar { position: fixed !important; left: -240px; z-index: 200 !important; }
          .sidebar.open { left: 0 !important; }
          .overlay { display: block !important; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 190; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
          .overlay { display: none !important; }
        }
      `}</style>

      {mobileOpen && <div className="overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`} style={{ width: collapsed ? 64 : 240, minWidth: collapsed ? 64 : 240, background: '#ffffff', height: '100vh', display: 'flex', flexDirection: 'column', borderRight: '1px solid #eeebeb', transition: 'all 0.2s ease', zIndex: 150 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: '16px 14px', borderBottom: '1px solid #f5f2f2' }}>
          {!collapsed && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 28, height: 28, borderRadius: 7, background: '#800000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /></svg></div><span style={{ fontSize: 14, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Portal</span></div>}
          <button onClick={() => setCollapsed(!collapsed)} className="desktop-only" style={{ background: '#f5f3f3', border: '1px solid #ece8e8', borderRadius: 7, cursor: 'pointer', color: '#888', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{collapsed ? <ChevronRight /> : <ChevronLeft />}</button>
          <button onClick={() => setMobileOpen(false)} className="mobile-only" style={{ background: 'none', border: 'none', color: '#888' }}><ChevronLeft /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          <NavSection label="General" items={NAV_GENERAL} collapsed={collapsed} pathname={pathname} openMenus={openMenus} onToggle={toggle} />
          <NavSection label="Management" items={NAV_MANAGEMENT} collapsed={collapsed} pathname={pathname} openMenus={openMenus} onToggle={toggle} />
          <NavSection label="Apps" items={NAV_APPS} collapsed={collapsed} pathname={pathname} openMenus={openMenus} onToggle={toggle} />
        </div>
        <div style={{ padding: '10px', borderTop: '1px solid #f5f2f2' }}>
          <NavSection label="" items={NAV_SUPPORT} collapsed={collapsed} pathname={pathname} openMenus={openMenus} onToggle={toggle} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '8px 0' : '10px 12px', borderRadius: 10, background: '#fff', border: collapsed ? 'none' : '1px solid #ece8e8', justifyContent: collapsed ? 'center' : 'flex-start', marginTop: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#800000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>N</div>
            {!collapsed && <div style={{ flex: 1, overflow: 'hidden' }}><div style={{ fontSize: 11.5, color: '#1a1a2e', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Achmad Hakim</div></div>}
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f8f9fa' }}>{children}</main>
      </div>
    </div>
  )
}