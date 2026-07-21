import { Outlet } from "react-router-dom";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LogoutOverlay from "@/components/LogoutOverlay";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
const Ico = ({ d, d2, size = 16, sw = 1.5 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />{d2 && <path d={d2} />}
  </svg>;
const BG = "#FFFFFF";
const BG_SOFT = "#F8F9FB";
const BG_HOVER = "#F3F4F6";
const BORDER = "rgba(0,0,0,0.07)";
const TEXT_MAIN = "#111827";
const TEXT_SUB = "#9CA3AF";
const TEXT_MUTED = "#6B7280";
const PRIMARY = "#800000";
const PRIMARY_BG = "rgba(128,0,0,0.07)";
const SHADOW_SM = "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)";
const SHADOW_MD = "0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)";
const SHADOW_LG = "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)";
const DashIco = ({ a }) => <Ico d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" d2="M9 22V12h6v10" size={15} sw={a ? 2 : 1.5} />;
const AssessIco = ({ a }) => <Ico d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" size={15} sw={a ? 2 : 1.5} />;
const MessagingIco = ({ a }) => <Ico d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" size={15} sw={a ? 2 : 1.5} />;
const SubscriptionsIco = ({ a }) => <Ico d="M4 4h16v4H4V4zm0 6h16v10H4V10zm2 2v6h12v-6H6z" size={15} sw={a ? 2 : 1.5} />;
const SettingsIco = ({ a }) => <Ico d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" d2="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" size={15} sw={a ? 2 : 1.5} />;
const ChevronLeft = () => <Ico d="M15 18l-6-6 6-6" size={14} sw={2} />;
const ChevronRight = () => <Ico d="M9 18l6-6-6-6" size={14} sw={2} />;
const SearchIco = () => <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={14} sw={1.5} />;
const BellIco = () => <Ico d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" size={16} sw={1.5} />;
const LogoutIco = () => <Ico d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" size={14} sw={1.5} />;
const MenuIco = () => <Ico d="M3 12h18M3 6h18M3 18h18" size={18} sw={1.5} />;
const ProfileIco = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={14} sw={1.5} />;
const CheckIco = () => <Ico d="M20 6L9 17l-5-5" size={12} sw={2} />;
const TrashIco = () => <Ico d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" size={12} sw={1.5} />;
const API_BASE = "https://telexph-admin.onrender.com/api";
const NAV_ITEMS = [
  { label: "Dashboard", href: "/VirtualAssistant/dashboard", icon: (a) => <DashIco a={a} /> },
  { label: "Assessment", href: "/VirtualAssistant/dashboard/VAassesment", icon: (a) => <AssessIco a={a} /> },
  { label: "Messaging", href: "/VirtualAssistant/dashboard/VAmessaging", icon: (a) => <MessagingIco a={a} /> },
  { label: "Subscriptions", href: "/VirtualAssistant/dashboard/Subscription", icon: (a) => <SubscriptionsIco a={a} /> }
];
function NotificationBell({ userId }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const bellRef = useRef(null);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const fetchNotifications = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/notifications?userId=${userId}&userType=va`, { credentials: "include" });
      if (res.ok) setNotifications(await res.json());
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);
  useEffect(() => {
    const handleClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const markAsRead = async (id) => {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, { method: "PUT", credentials: "include" });
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };
  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      await fetch(`${API_BASE}/notifications/read-all?userId=${userId}&userType=va`, { method: "PUT", credentials: "include" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };
  const deleteNotification = async (id) => {
    try {
      await fetch(`${API_BASE}/notifications/${id}`, { method: "DELETE", credentials: "include" });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 6e4);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };
  return <div ref={bellRef} style={{ position: "relative" }}>
      <button
    onClick={() => {
      setOpen(!open);
      if (!open) fetchNotifications();
    }}
    style={{
      width: 36,
      height: 36,
      borderRadius: 10,
      background: BG,
      border: `1px solid ${BORDER}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: TEXT_MUTED,
      position: "relative",
      boxShadow: SHADOW_SM,
      transition: "all 0.15s"
    }}
  >
        <BellIco />
        {unreadCount > 0 && <span style={{
    position: "absolute",
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: PRIMARY,
    border: `1.5px solid ${BG}`
  }} />}
      </button>

      {open && <div style={{
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    width: 320,
    background: BG,
    borderRadius: 16,
    border: `1px solid ${BORDER}`,
    boxShadow: SHADOW_LG,
    zIndex: 200,
    overflow: "hidden"
  }}>
          <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN, display: "flex", alignItems: "center", gap: 8 }}>
              Notifications
              {unreadCount > 0 && <span style={{ background: PRIMARY, color: "#fff", borderRadius: 20, fontSize: 10, padding: "1px 7px", fontWeight: 600 }}>{unreadCount}</span>}
            </span>
            {unreadCount > 0 && <button onClick={markAllAsRead} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: PRIMARY, fontWeight: 600 }}>
                Mark all read
              </button>}
          </div>

          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {loading ? <div style={{ padding: "24px 0", textAlign: "center", fontSize: 12, color: TEXT_SUB }}>Loading...</div> : notifications.length === 0 ? <div style={{ padding: "32px 0", textAlign: "center", fontSize: 12, color: TEXT_SUB }}>No notifications yet</div> : notifications.map((n) => <div key={n._id} style={{
    padding: "11px 16px",
    borderBottom: `1px solid ${BORDER}`,
    background: n.isRead ? BG : PRIMARY_BG,
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    transition: "background 0.15s"
  }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: n.isRead ? "transparent" : PRIMARY, marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: n.isRead ? 400 : 600, color: TEXT_MAIN }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2, lineHeight: 1.5 }}>{n.message}</div>
                  <div style={{ fontSize: 10, color: TEXT_SUB, marginTop: 4 }}>{timeAgo(n.createdAt)}</div>
                </div>
                <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                  {!n.isRead && <button
    onClick={() => markAsRead(n._id)}
    title="Mark as read"
    style={{ background: "none", border: "none", cursor: "pointer", color: PRIMARY, padding: 4, borderRadius: 6, display: "flex" }}
  >
                      <CheckIco />
                    </button>}
                  <button
    onClick={() => deleteNotification(n._id)}
    title="Delete"
    style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", padding: 4, borderRadius: 6, display: "flex" }}
  >
                    <TrashIco />
                  </button>
                </div>
              </div>)}
          </div>
        </div>}
    </div>;
}
function Header({ onMenuClick, clientInfo, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const avatarLetter = clientInfo ? clientInfo.firstName.charAt(0).toUpperCase() : "?";
  const displayName = clientInfo ? `${clientInfo.firstName} ${clientInfo.lastName}` : "Loading...";
  const displayEmail = clientInfo?.email ?? "";
  return <header style={{
    height: 60,
    background: BG,
    borderBottom: `1px solid ${BORDER}`,
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    gap: 12,
    position: "sticky",
    top: 0,
    zIndex: 100
  }}>
      {
    /* Mobile menu button */
  }
      <button
    className="mobile-only"
    onClick={onMenuClick}
    style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_MUTED, display: "flex", padding: 4 }}
  >
        <MenuIco />
      </button>

      {
    /* Date */
  }
      <div style={{ flex: 1 }}>
        <div className="desktop-only" style={{ fontSize: 12, color: TEXT_SUB, fontWeight: 500 }}>{today}</div>
      </div>

      {
    /* Search */
  }
      <div className="search-box" style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: BG_SOFT,
    borderRadius: 10,
    padding: "7px 14px",
    fontSize: 12,
    color: TEXT_SUB,
    width: 200,
    border: `1px solid ${BORDER}`,
    cursor: "text"
  }}>
        <SearchIco />
        <span>Search...</span>
      </div>

      <NotificationBell userId={clientInfo?.id} />

      {
    /* Avatar + user menu */
  }
      <div style={{ position: "relative" }} ref={menuRef}>
        <button
    onClick={() => setShowUserMenu(!showUserMenu)}
    style={{
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: PRIMARY,
      color: "#fff",
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      overflow: "hidden",
      boxShadow: SHADOW_SM
    }}
  >
          {clientInfo?.profilePicture ? <img src={clientInfo.profilePicture} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : avatarLetter}
        </button>

        {showUserMenu && <div style={{
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    width: 210,
    background: BG,
    borderRadius: 14,
    border: `1px solid ${BORDER}`,
    boxShadow: SHADOW_LG,
    overflow: "hidden",
    zIndex: 200
  }}>
            <div style={{ padding: "13px 16px 12px", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 13, color: TEXT_MAIN, fontWeight: 600 }}>{displayName}</div>
              <div style={{ fontSize: 11, color: TEXT_SUB, marginTop: 2 }}>{displayEmail}</div>
            </div>
            <div style={{ padding: "6px" }}>
              {[
    { label: "Profile Settings", icon: <ProfileIco />, onClick: () => {
      setShowUserMenu(false);
      router.push("/VirtualAssistant/dashboard/Settings");
    }, color: TEXT_MAIN },
    { label: "Logout", icon: <LogoutIco />, onClick: onLogout, color: "#EF4444" }
  ].map((item) => <button
    key={item.label}
    onClick={item.onClick}
    style={{
      width: "100%",
      padding: "9px 12px",
      fontSize: 12.5,
      borderRadius: 10,
      cursor: "pointer",
      color: item.color,
      display: "flex",
      alignItems: "center",
      gap: 9,
      background: "none",
      border: "none",
      textAlign: "left",
      transition: "background 0.12s"
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = BG_HOVER}
    onMouseLeave={(e) => e.currentTarget.style.background = "none"}
  >
                  {item.icon} {item.label}
                </button>)}
            </div>
          </div>}
      </div>
    </header>;
}
function NavItem({ label, href, icon, collapsed, isActive }) {
  return <Link
    href={href}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: collapsed ? "9px 8px" : "9px 12px",
      borderRadius: 10,
      marginBottom: 2,
      background: isActive ? PRIMARY_BG : "transparent",
      color: isActive ? PRIMARY : TEXT_MUTED,
      fontWeight: isActive ? 600 : 400,
      fontSize: 13,
      textDecoration: "none",
      justifyContent: collapsed ? "center" : "flex-start",
      transition: "all 0.12s",
      borderLeft: isActive ? `3px solid ${PRIMARY}` : "3px solid transparent"
    }}
  >
      {icon(isActive)}
      {!collapsed && <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {label}
        </span>}
    </Link>;
}
function VADashboardLayout() {
  const children = <Outlet />;
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clientInfo, setClientInfo] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [logoutDone, setLogoutDone] = useState(false);
  const isMessaging = pathname === "/VirtualAssistant/dashboard/VAmessaging";
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/va/me`, { method: "GET", credentials: "include" });
        if (res.ok) {
          setClientInfo(await res.json());
        } else if (res.status === 401 || res.status === 403) {
          router.push("/VirtualAssistant/login");
        }
      } catch (err) {
        console.error("Failed to fetch VA profile:", err);
      }
    };
    fetchProfile();
  }, []);
  const handleLogout = async () => {
    if (loggingOut) return;
    setConfirmLogout(false);
    setLoggingOut(true);
    try {
      await fetch(`/api/auth/va/logout`, { method: "POST", credentials: "include" });
    } catch {
    } finally {
      setClientInfo(null);
      setLogoutDone(true);
    }
  };
  const avatarLetter = clientInfo ? clientInfo.firstName.charAt(0).toUpperCase() : "?";
  const sidebarName = clientInfo ? `${clientInfo.firstName} ${clientInfo.lastName}` : "Loading...";
  const sidebarEmail = clientInfo?.email ?? "";
  return <div style={{ display: "flex", height: "100vh", width: "100vw", background: BG_SOFT, overflow: "hidden" }}>
      {confirmLogout && <LogoutConfirmModal
    portalLabel="Virtual Assistant"
    accent="#800000"
    onConfirm={handleLogout}
    onCancel={() => setConfirmLogout(false)}
  />}
      {loggingOut && <LogoutOverlay
    portalLabel="Virtual Assistant"
    accent="#800000"
    ready={logoutDone}
    onDone={() => {
      window.location.href = "/VirtualAssistant/login";
    }}
  />}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', 'Poppins', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        a { text-decoration: none; color: inherit; }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .search-box   { display: none !important; }
          .sidebar {
            position: fixed !important; left: 0 !important; top: 0 !important;
            width: 240px !important; min-width: 240px !important; height: 100vh !important;
            transform: translateX(-100%); transition: transform 0.25s ease !important;
            z-index: 200 !important;
          }
          .sidebar.open { transform: translateX(0) !important; box-shadow: 4px 0 30px rgba(0,0,0,0.12) !important; }
          .overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.25); z-index: 190; }
          .overlay.active { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
          .overlay     { display: none !important; }
        }
      `}</style>

      <div className={`overlay ${mobileOpen ? "active" : ""}`} onClick={() => setMobileOpen(false)} />

      {
    /* â”€â”€ Sidebar â”€â”€ */
  }
      <aside
    className={`sidebar ${mobileOpen ? "open" : ""}`}
    style={{
      width: collapsed ? 64 : 240,
      minWidth: collapsed ? 64 : 240,
      background: BG,
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      borderRight: `1px solid ${BORDER}`,
      transition: "all 0.22s ease",
      zIndex: 150
    }}
  >
        {
    /* Logo bar */
  }
        <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: collapsed ? "center" : "space-between",
    padding: "0 14px",
    height: 60,
    borderBottom: `1px solid ${BORDER}`
  }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {
    /* Logo mark */
  }
            <div style={{
    width: 34,
    height: 34,
    borderRadius: 10,
    background: PRIMARY,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  }}>
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1.5" fill="#fff" />
                <rect x="8" y="1" width="5" height="5" rx="1.5" fill="#fff" />
                <rect x="1" y="8" width="5" height="5" rx="1.5" fill="#fff" />
                <rect x="8" y="8" width="5" height="5" rx="1.5" fill="#fff" />
              </svg>
            </div>
            {!collapsed && <span style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN, letterSpacing: "0.04em" }}>
                VA Portal
              </span>}
          </div>

          {
    /* Collapse toggle */
  }
          <button
    onClick={() => setCollapsed(!collapsed)}
    className="desktop-only"
    style={{
      background: BG_SOFT,
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      cursor: "pointer",
      color: TEXT_SUB,
      width: 26,
      height: 26,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "all 0.12s"
    }}
  >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <button
    onClick={() => setMobileOpen(false)}
    className="mobile-only"
    style={{
      background: BG_SOFT,
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      cursor: "pointer",
      color: TEXT_SUB,
      width: 26,
      height: 26,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }}
  >
            <ChevronLeft />
          </button>
        </div>

        {
    /* Nav items */
  }
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 10px" }}>
          {!collapsed && <div style={{
    fontSize: 10,
    color: TEXT_SUB,
    padding: "0 12px 10px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 700
  }}>
              Menu
            </div>}
          {NAV_ITEMS.map((item) => <NavItem
    key={item.label}
    label={item.label}
    href={item.href}
    icon={item.icon}
    collapsed={collapsed}
    isActive={pathname === item.href}
  />)}
        </div>

        {
    /* Bottom: settings + profile card */
  }
        <div style={{ padding: "10px", borderTop: `1px solid ${BORDER}` }}>
          <NavItem
    label="Settings"
    href="/VirtualAssistant/dashboard/Settings"
    icon={(a) => <SettingsIco a={a} />}
    collapsed={collapsed}
    isActive={pathname === "/VirtualAssistant/dashboard/Settings"}
  />

          {
    /* Profile card */
  }
          <div style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: collapsed ? "10px 8px" : "10px 12px",
    borderRadius: 12,
    background: BG_SOFT,
    border: `1px solid ${BORDER}`,
    justifyContent: collapsed ? "center" : "flex-start",
    marginTop: 8
  }}>
            <div style={{
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: PRIMARY,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
    overflow: "hidden"
  }}>
              {clientInfo?.profilePicture ? <img src={clientInfo.profilePicture} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : avatarLetter}
            </div>
            {!collapsed && <>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 12, color: TEXT_MAIN, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", fontWeight: 600 }}>
                    {sidebarName}
                  </div>
                  <div style={{ fontSize: 10.5, color: TEXT_SUB, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", marginTop: 1 }}>
                    {sidebarEmail}
                  </div>
                </div>
                <button
    onClick={() => setConfirmLogout(true)}
    disabled={loggingOut}
    title="Logout"
    style={{
      background: "none",
      border: "none",
      cursor: loggingOut ? "not-allowed" : "pointer",
      color: loggingOut ? "#D1D5DB" : "#EF4444",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 4,
      borderRadius: 6,
      flexShrink: 0,
      transition: "color 0.12s"
    }}
  >
                  <LogoutIco />
                </button>
              </>}
          </div>
        </div>
      </aside>

      {
    /* â”€â”€ Main content â”€â”€ */
  }
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <Header onMenuClick={() => setMobileOpen(true)} clientInfo={clientInfo} onLogout={() => setConfirmLogout(true)} />
        <main style={{
    flex: 1,
    overflowY: "auto",
    padding: isMessaging ? "0" : "20px",
    background: BG_SOFT
  }}>
          {children}
        </main>
      </div>
    </div>;
}
export {
  VADashboardLayout as default
};
