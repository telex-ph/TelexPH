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
const BG       = '#E7E7E7'
const NEU_OUT  = '-5px -5px 14px #FFFFFF, 5px 5px 14px #CACAEC'   // raised
const NEU_IN   = 'inset 3px 3px 7px #CACAEC, inset -3px -3px 7px #fff' // pressed/inset
const TEXT_MAIN = '#2a2a2a'
const TEXT_SUB  = '#888'
const PRIMARY   = '#800000'

const NavIcon = ({ children, active }: { children: React.ReactNode; active?: boolean }) => (
  <span style={{ width: 26, height: 26, borderRadius: 7, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: BG, color: active ? PRIMARY : '#666', boxShadow: active ? NEU_IN : NEU_OUT, transition: 'all 0.15s' }}>{children}</span>
)

// ─── NAV ICONS ────────────────────────────────────────────────────────────────
// General
const DashIco      = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" d2="M9 22V12h6v10" size={13} /></NavIcon>
const CalIcon      = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" size={13} /></NavIcon>
const NotifIco     = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" size={13} /></NavIcon>
// My Application
const AppFormIco   = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" d2="M14 2v6h6M16 13H8M16 17H8M10 9H8" size={13} /></NavIcon>
const UploadIco    = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" size={13} /></NavIcon>
const StatusIco    = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" size={13} /></NavIcon>
// Interview
const RecIco       = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" d2="M19 10v1a7 7 0 0 1-14 0v-1M12 19v4M8 23h8" size={13} /></NavIcon>
const VideoIco     = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M23 7l-7 5 7 5V7z" d2="M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" size={13} /></NavIcon>
const SchedIco     = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" size={13} /></NavIcon>
// Active Work
const TaskIco      = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" size={13} /></NavIcon>
const TimeIco      = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" d2="M12 6v6l4 2" size={13} /></NavIcon>
const PayIco       = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" size={13} /></NavIcon>
const PerfIco      = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M18 20V10M12 20V4M6 20v-6" size={13} /></NavIcon>
// Support
const FeedbackIco  = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" size={13} /></NavIcon>
const SupportIco   = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M3 18v-6a9 9 0 0 1 18 0v6" d2="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" size={13} /></NavIcon>
const SettingsIco  = ({ a }: { a?: boolean }) => <NavIcon active={a}><Ico d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" d2="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" size={13} /></NavIcon>

const ChevronDown  = () => <Ico d="M6 9l6 6 6-6" size={13} sw={1.5} />
const ChevronUp    = () => <Ico d="M18 15l-6-6-6 6" size={13} sw={1.5} />
const ChevronLeft  = () => <Ico d="M15 18l-6-6 6-6" size={14} sw={1.5} />
const ChevronRight = () => <Ico d="M9 18l6-6-6-6" size={14} sw={1.5} />
const SearchIco    = () => <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={14} />
const BellIco      = () => <Ico d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" size={16} />
const LogoutIco    = () => <Ico d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" size={13} />
const MenuIco      = () => <Ico d="M3 12h18M3 6h18M3 18h18" size={18} />
const ProfileIco   = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={13} />

type ClientInfo = {
  id: string
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  profilePicture?: string | null
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// ─── NAV DATA ─────────────────────────────────────────────────────────────────
const NAV_GENERAL = [
  { label: 'Dashboard',     href: '/va/dashboard',              icon: (a: boolean) => <DashIco a={a} /> },
  { label: 'Schedule',      href: '/va/dashboard/Schedule',     icon: (a: boolean) => <CalIcon a={a} /> },
  { label: 'Notifications', href: '/va/dashboard/Notifications', icon: (a: boolean) => <NotifIco a={a} />, badge: '3' },
]

// Grouped dropdown sections for the "VA Application" sidebar section
const NAV_MY_APPLICATION = [
  {
    label: 'My Application',
    icon: (a: boolean) => <AppFormIco a={a} />,
    children: [
      { label: 'Application Form',   href: '/va/dashboard/ApplicationForm' },
      { label: 'Upload Requirements', href: '/va/dashboard/UploadRequirements' },
      { label: 'Application Status',  href: '/va/dashboard/ApplicationStatus' },
    ],
  },
  {
    label: 'Interview',
    icon: (a: boolean) => <RecIco a={a} />,
    children: [
      { label: 'Schedule Interview',   href: '/va/dashboard/ScheduleInterview' },
      { label: 'Interview Recording',  href: '/va/dashboard/InterviewRecording', badge: 'REC' },
      { label: 'Interview Results',    href: '/va/dashboard/InterviewResults' },
    ],
  },
]

const NAV_ACTIVE_WORK = [
  { label: 'My Tasks',      href: '/va/dashboard/MyTasks',      icon: (a: boolean) => <TaskIco a={a} /> },
  { label: 'Time Tracker',  href: '/va/dashboard/TimeTracker',  icon: (a: boolean) => <TimeIco a={a} /> },
  { label: 'My Earnings',   href: '/va/dashboard/MyEarnings',   icon: (a: boolean) => <PayIco a={a} /> },
  { label: 'Performance',   href: '/va/dashboard/Performance',  icon: (a: boolean) => <PerfIco a={a} /> },
]

const NAV_SUPPORT = [
  { label: 'Feedback',       href: '/va/dashboard/Feedback',        icon: (a: boolean) => <FeedbackIco a={a} /> },
  { label: 'Help & Support', href: '/va/dashboard/Support',         icon: (a: boolean) => <SupportIco a={a} /> },
  { label: 'Settings',       href: '/va/dashboard/Settings',        icon: (a: boolean) => <SettingsIco a={a} /> },
]

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

      {/* Bell */}
      <div style={{ width: 36, height: 36, borderRadius: 10, background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: TEXT_SUB, position: 'relative', boxShadow: NEU_OUT }}>
        <BellIco />
        <span style={{ position: 'absolute', top: 7, right: 8, width: 7, height: 7, borderRadius: '50%', background: PRIMARY, border: `2px solid ${BG}` }} />
      </div>

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
              <div onClick={() => { setShowUserMenu(false); router.push('/client/dashboard/AccountSettings') }}
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
function NavItem({ label, href, icon, collapsed, isActive, badge }: { label: string; href: string; icon: (a: boolean) => React.ReactNode; collapsed: boolean; isActive: boolean; badge?: string }) {
  return (
    <Link href={href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '8px 6px' : '8px 10px', borderRadius: 12, marginBottom: 3, background: isActive ? BG : 'transparent', boxShadow: isActive ? NEU_IN : 'none', color: isActive ? PRIMARY : TEXT_MAIN, fontWeight: isActive ? 600 : 400, fontSize: 12.5, textDecoration: 'none', justifyContent: collapsed ? 'center' : 'flex-start', transition: 'all 0.15s' }}>
      {icon(isActive)}
      {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
      {!collapsed && badge && <span style={{ background: '#ef4444', color: '#fff', fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 4 }}>{badge}</span>}
    </Link>
  )
}

// ─── GENERIC NAV SECTION ──────────────────────────────────────────────────────
function NavSection({ label, items, collapsed, pathname }: { label: string; items: Array<{ label: string; href: string; icon: (a: boolean) => React.ReactNode; badge?: string }>; collapsed: boolean; pathname: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {!collapsed && label && (
        <div style={{ fontSize: 9.5, color: '#bbb', padding: '8px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>{label}</div>
      )}
      {collapsed && label && <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '6px 4px' }} />}
      {items.map(item => (
        <NavItem key={item.label} label={item.label} href={item.href} icon={item.icon} collapsed={collapsed} isActive={pathname === item.href} badge={item.badge} />
      ))}
    </div>
  )
}

// ─── VA APPLICANT SECTION ────────────────────────────────────────────────────
function VirtualAssistantSection({ collapsed, pathname, openMenus, onToggle, sectionOpen, onSectionToggle }: {
  collapsed: boolean; pathname: string; openMenus: Record<string, boolean>;
  onToggle: (l: string) => void; sectionOpen: boolean; onSectionToggle: () => void
}) {
  if (collapsed) return null

  return (
    <div style={{ marginBottom: 8 }}>
      <div onClick={onSectionToggle} style={{ fontSize: 9.5, color: '#bbb', padding: '8px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
        <span>VA Application</span>
        <span style={{ display: 'flex', opacity: 0.6 }}>{sectionOpen ? <ChevronUp /> : <ChevronDown />}</span>
      </div>

      {sectionOpen && (
        <>
          {/* My Application + Interview dropdowns */}
          {NAV_MY_APPLICATION.map(group => {
            const open     = openMenus[group.label] ?? false
            const anyChild = group.children.some(c => pathname === c.href)
            return (
              <div key={group.label} style={{ marginBottom: 3 }}>
                <div onClick={() => onToggle(group.label)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 12, cursor: 'pointer', background: anyChild ? BG : 'transparent', boxShadow: anyChild ? NEU_IN : 'none', color: anyChild ? PRIMARY : TEXT_MAIN, transition: 'all 0.15s' }}>
                  {group.icon(anyChild)}
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: anyChild ? 600 : 400 }}>{group.label}</span>
                  <span style={{ color: TEXT_SUB, display: 'flex' }}>{open ? <ChevronUp /> : <ChevronDown />}</span>
                </div>
                {open && (
                  <div style={{ position: 'relative', marginLeft: 24, marginTop: 2 }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 15, width: 1, background: 'rgba(0,0,0,0.1)' }} />
                    {group.children.map(child => {
                      const isActive = pathname === child.href
                      return (
                        <div key={child.href} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <div style={{ position: 'absolute', left: 0, top: 15, width: 12, height: 1, background: 'rgba(0,0,0,0.1)' }} />
                          <div style={{ position: 'absolute', left: 12, top: 12, width: 5, height: 5, borderRadius: '50%', background: isActive ? PRIMARY : BG, boxShadow: isActive ? 'none' : 'inset 1px 1px 3px #CACAEC, inset -1px -1px 3px #fff' }} />
                          <Link href={child.href} style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px 7px 24px', borderRadius: 9, fontSize: 11.5, color: isActive ? PRIMARY : TEXT_SUB, background: isActive ? BG : 'transparent', boxShadow: isActive ? NEU_IN : 'none', textDecoration: 'none', fontWeight: isActive ? 600 : 400 }}>
                            <span>{child.label}</span>
                            {child.badge && <span style={{ fontSize: 8, fontWeight: 700, background: '#ef4444', color: '#fff', padding: '2px 5px', borderRadius: 4 }}>{child.badge}</span>}
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}

          {/* Active Work — flat items under a dropdown */}
          {(() => {
            const open     = openMenus['Active Work'] ?? false
            const anyChild = NAV_ACTIVE_WORK.some(c => pathname === c.href)
            return (
              <div style={{ marginBottom: 3 }}>
                <div onClick={() => onToggle('Active Work')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 12, cursor: 'pointer', background: anyChild ? BG : 'transparent', boxShadow: anyChild ? NEU_IN : 'none', color: anyChild ? PRIMARY : TEXT_MAIN, transition: 'all 0.15s' }}>
                  <TaskIco a={anyChild} />
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: anyChild ? 600 : 400 }}>Active Work</span>
                  <span style={{ color: TEXT_SUB, display: 'flex' }}>{open ? <ChevronUp /> : <ChevronDown />}</span>
                </div>
                {open && (
                  <div style={{ position: 'relative', marginLeft: 24, marginTop: 2 }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 15, width: 1, background: 'rgba(0,0,0,0.1)' }} />
                    {NAV_ACTIVE_WORK.map(child => {
                      const isActive = pathname === child.href
                      return (
                        <div key={child.href} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <div style={{ position: 'absolute', left: 0, top: 15, width: 12, height: 1, background: 'rgba(0,0,0,0.1)' }} />
                          <div style={{ position: 'absolute', left: 12, top: 12, width: 5, height: 5, borderRadius: '50%', background: isActive ? PRIMARY : BG, boxShadow: isActive ? 'none' : 'inset 1px 1px 3px #CACAEC, inset -1px -1px 3px #fff' }} />
                          <Link href={child.href} style={{ display: 'flex', flex: 1, alignItems: 'center', padding: '7px 10px 7px 24px', borderRadius: 9, fontSize: 11.5, color: isActive ? PRIMARY : TEXT_SUB, background: isActive ? BG : 'transparent', boxShadow: isActive ? NEU_IN : 'none', textDecoration: 'none', fontWeight: isActive ? 600 : 400 }}>
                            {child.label}
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })()}
        </>
      )}
    </div>
  )
}

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [collapsed,     setCollapsed]     = useState(false)
  const [mobileOpen,    setMobileOpen]    = useState(false)
  const [openMenus,     setOpenMenus]     = useState<Record<string, boolean>>({})
  const [vaSectionOpen, setVaSectionOpen] = useState(true)
  const [clientInfo,    setClientInfo]    = useState<ClientInfo | null>(null)
  const [loggingOut,    setLoggingOut]    = useState(false)

  const toggle = (l: string) => setOpenMenus(p => ({ ...p, [l]: !p[l] }))

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
        console.error('Failed to fetch client profile:', err)
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
            {!collapsed && <span style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN, letterSpacing: '0.06em', textTransform: 'uppercase' }}>VA Applicant</span>}
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

        {/* Scrollable nav */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
          <NavSection label="General" items={NAV_GENERAL} collapsed={collapsed} pathname={pathname} />
          <VirtualAssistantSection
            collapsed={collapsed}
            pathname={pathname}
            openMenus={openMenus}
            onToggle={toggle}
            sectionOpen={vaSectionOpen}
            onSectionToggle={() => setVaSectionOpen(v => !v)}
          />
        </div>

        {/* Bottom: support + profile */}
        <div style={{ padding: '10px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <NavSection label="" items={NAV_SUPPORT} collapsed={collapsed} pathname={pathname} />

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
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>{children}</main>
      </div>
    </div>
  )
}