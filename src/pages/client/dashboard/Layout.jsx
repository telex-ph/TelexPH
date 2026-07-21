import { Outlet } from "react-router-dom";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LogoutOverlay from "@/components/LogoutOverlay";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
const Ico = ({ d, d2, size = 16, sw = 1.2 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />{d2 && <path d={d2} />}
  </svg>;
const NavIcon = ({ children }) => <span style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #e0dede", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "#fff", color: "#333" }}>
    {children}
  </span>;
const CalIcon = () => <NavIcon><Ico d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" size={13} /></NavIcon>;
const BookingIcon = () => <NavIcon><Ico d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" size={13} /></NavIcon>;
const VAIco = () => <NavIcon><Ico d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" d2="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={13} /></NavIcon>;
const FeedbackIco = () => <NavIcon><Ico d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" size={13} /></NavIcon>;
const SupportIco = () => <NavIcon><Ico d="M3 18v-6a9 9 0 0 1 18 0v6" d2="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" size={13} /></NavIcon>;
const SettingsIco = () => <NavIcon><Ico d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" d2="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" size={13} /></NavIcon>;
const BillingIco = () => <NavIcon><Ico d="M3 10h18M7 15h.01M11 15h2M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" size={13} /></NavIcon>;
const ServicesIco = () => <NavIcon><Ico d="M4 6h16M4 10h16M4 14h16M4 18h16" size={13} /></NavIcon>;
const MessagingIco = () => <NavIcon><Ico d="M8 9h8M8 13h6M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" size={13} /></NavIcon>;
const ChevronLeft = () => <Ico d="M15 18l-6-6 6-6" size={14} sw={1.5} />;
const ChevronRight = () => <Ico d="M9 18l6-6-6-6" size={14} sw={1.5} />;
const SearchIco = () => <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={14} />;
const BellIco = () => <Ico d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" size={16} />;
const LogoutIco = () => <Ico d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" size={13} />;
const MenuIco = () => <Ico d="M3 12h18M3 6h18M3 18h18" size={18} />;
const ProfileIco = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={13} />;
const CheckIco = () => <Ico d="M20 6L9 17l-5-5" size={12} />;
const TrashIco = () => <Ico d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" size={12} />;
const API_BASE = "https://telexph-admin.onrender.com/api";
const NAV_GENERAL = [
  { label: "Dashboard", href: "/client/dashboard", icon: <CalIcon /> },
  { label: "Appointments", href: "/client/dashboard/Appointments", icon: <BookingIcon /> },
  { label: "Messaging", href: "/client/dashboard/ClientMessaging", icon: <MessagingIco /> }
];
const NAV_SERVICES_DROPDOWN = {
  label: "Services",
  icon: <ServicesIco />,
  children: [
    { label: "Subscriptions", href: "/client/dashboard/Subscription", badge: void 0 },
    { label: "VA Services", href: "/client/dashboard/VAservices", badge: void 0 }
  ]
};
const NAV_VA_DROPDOWN = {
  label: "Virtual Assistant",
  icon: <VAIco />,
  children: [
    { label: "Browse VAs", href: "/client/dashboard/BrowseVAs", badge: void 0 },
    { label: "Shortlisted", href: "/client/dashboard/Shortlisted", badge: void 0 },
    { label: "Interview Recording", href: "/client/dashboard/InterviewRecording", badge: "REC" },
    { label: "My VAs", href: "/client/dashboard/MyVAs", badge: void 0 }
  ]
};
const NAV_BILLING_DROPDOWN = {
  label: "Billing",
  icon: <BillingIco />,
  children: [
    { label: "VA Billing", href: "/client/dashboard/VAbilling", badge: void 0 }
  ]
};
const NAV_SUPPORT = [
  { label: "Settings", href: "/client/dashboard/AccountSettings", icon: <SettingsIco /> }
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
      const res = await fetch(`${API_BASE}/notifications?userId=${userId}&userType=client`, { credentials: "include" });
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
      console.error("Failed to mark as read:", err);
    }
  };
  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      await fetch(`${API_BASE}/notifications/read-all?userId=${userId}&userType=client`, { method: "PUT", credentials: "include" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };
  const deleteNotification = async (id) => {
    try {
      await fetch(`${API_BASE}/notifications/${id}`, { method: "DELETE", credentials: "include" });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
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
  return <div ref={bellRef} style={{ position: "relative", cursor: "pointer", color: "#888", display: "flex" }}>
      <div onClick={() => {
    setOpen(!open);
    if (!open) fetchNotifications();
  }} style={{ position: "relative", display: "flex" }}>
        <BellIco />
        {unreadCount > 0 && <span style={{ position: "absolute", top: -2, right: -2, minWidth: 7, height: 7, borderRadius: "50%", background: "#800000", border: "1px solid #fff", fontSize: 7, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: unreadCount > 9 ? "0 2px" : 0 }}>
            {unreadCount > 9 ? "9+" : ""}
          </span>}
      </div>

      {open && <div style={{ position: "absolute", top: "calc(100% + 12px)", right: 0, width: 320, background: "#fff", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", border: "1px solid #f0eeee", zIndex: 200, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f5f2f2", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>
              Notifications
              {unreadCount > 0 && <span style={{ background: "#800000", color: "#fff", borderRadius: 20, fontSize: 10, padding: "1px 6px", marginLeft: 6 }}>{unreadCount}</span>}
            </span>
            {unreadCount > 0 && <button onClick={markAllAsRead} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#800000", fontWeight: 600 }}>Mark all read</button>}
          </div>

          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {loading ? <div style={{ padding: "24px 0", textAlign: "center", fontSize: 12, color: "#aaa" }}>Loading...</div> : notifications.length === 0 ? <div style={{ padding: "24px 0", textAlign: "center", fontSize: 12, color: "#aaa" }}>No notifications yet</div> : notifications.map((n) => <div key={n._id} style={{ padding: "10px 16px", borderBottom: "1px solid #faf8f8", background: n.isRead ? "transparent" : "#fff9f9", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: n.isRead ? "transparent" : "#800000", marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: n.isRead ? 400 : 600, color: "#1a1a2e" }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2, lineHeight: 1.4 }}>{n.message}</div>
                  <div style={{ fontSize: 10, color: "#ccc", marginTop: 4 }}>{timeAgo(n.createdAt)}</div>
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {!n.isRead && <button onClick={() => markAsRead(n._id)} title="Mark as read" style={{ background: "none", border: "none", cursor: "pointer", color: "#800000", padding: 3, borderRadius: 6 }}><CheckIco /></button>}
                  <button onClick={() => deleteNotification(n._id)} title="Delete" style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 3, borderRadius: 6 }}><TrashIco /></button>
                </div>
              </div>)}
          </div>
        </div>}
    </div>;
}
function Header({
  onMenuClick,
  clientInfo,
  onLogout
}) {
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
  return <header style={{ height: 56, background: "#fff", borderBottom: "1px solid #f0eeee", display: "flex", alignItems: "center", padding: "0 16px", gap: 14, position: "sticky", top: 0, zIndex: 100 }}>
      <button className="mobile-only" onClick={onMenuClick} style={{ background: "none", border: "none", cursor: "pointer", color: "#333" }}>
        <MenuIco />
      </button>

      <div style={{ flex: 1 }}>
        <div className="desktop-only" style={{ fontSize: 12, color: "#aaa" }}>{today}</div>
      </div>

      <div className="search-box" style={{ display: "flex", alignItems: "center", gap: 8, background: "#f7f5f5", border: "1px solid #ece8e8", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#aaa", width: 180 }}>
        <SearchIco /><span>Search..</span>
      </div>

      <NotificationBell userId={clientInfo?.id} />

      <div style={{ position: "relative" }} ref={menuRef}>
        <div
    onClick={() => setShowUserMenu(!showUserMenu)}
    style={{ width: 30, height: 30, borderRadius: "50%", background: "#800000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, cursor: "pointer", overflow: "hidden" }}
  >
          {clientInfo?.profilePicture ? <img src={clientInfo.profilePicture} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : avatarLetter}
        </div>

        {showUserMenu && <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, width: 190, background: "#fff", borderRadius: 10, boxShadow: "0 8px 20px rgba(0,0,0,0.08)", border: "1px solid #f0eeee", overflow: "hidden", zIndex: 110 }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f5f2f2" }}>
              <div style={{ fontSize: 12, color: "#1a1a2e" }}>{displayName}</div>
              <div style={{ fontSize: 10, color: "#aaa" }}>{displayEmail}</div>
            </div>
            <div style={{ padding: "5px" }}>
              <div
    onClick={() => {
      setShowUserMenu(false);
      router.push("/client/dashboard/AccountSettings");
    }}
    style={{ padding: "6px 10px", fontSize: 12, borderRadius: 6, cursor: "pointer", color: "#444", display: "flex", alignItems: "center", gap: 8 }}
  >
                <ProfileIco /> Profile Settings
              </div>
              <div
    onClick={onLogout}
    style={{ padding: "6px 10px", fontSize: 12, borderRadius: 6, cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center", gap: 10 }}
  >
                <LogoutIco /> Logout
              </div>
            </div>
          </div>}
      </div>
    </header>;
}
function NavDropdown({
  sectionLabel,
  triggerLabel,
  triggerIcon,
  items,
  collapsed,
  pathname,
  open,
  onToggle
}) {
  const isActive = (href) => pathname === href;
  return <div style={{ marginBottom: 6 }}>
      {!collapsed && sectionLabel && <div style={{ fontSize: 10, color: "#aaa", padding: "10px 8px 4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {sectionLabel}
        </div>}
      <button
    onClick={onToggle}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      width: "100%",
      padding: "7px 10px",
      borderRadius: 8,
      border: "none",
      background: "transparent",
      color: "#333",
      cursor: "pointer",
      textAlign: "left"
    }}
  >
        {triggerIcon}
        {!collapsed && <span style={{ flex: 1, fontSize: 12 }}>{triggerLabel}</span>}
        {!collapsed && (open ? <ChevronLeft /> : <ChevronRight />)}
      </button>
      {open && <div style={{ marginLeft: collapsed ? 0 : 20 }}>
          {items.map((item) => <Link
    key={item.label}
    href={item.href}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "7px 10px",
      borderRadius: 8,
      color: isActive(item.href) ? "#800000" : "#333",
      background: isActive(item.href) ? "#fff5f5" : "transparent"
    }}
  >
              {!collapsed && <span style={{ flex: 1, fontSize: 12 }}>{item.label}</span>}
              {item.badge && <span style={{ fontSize: 9, fontWeight: 700, color: "#800000", background: "#fff5f5", border: "1px solid #f3d9d9", borderRadius: 4, padding: "1px 5px" }}>
                  {item.badge}
                </span>}
            </Link>)}
        </div>}
    </div>;
}
function NavSection({
  label,
  items,
  collapsed,
  pathname
}) {
  const isActive = (href) => pathname === href;
  return <div style={{ marginBottom: 6 }}>
      {!collapsed && label && <div style={{ fontSize: 10, color: "#aaa", padding: "10px 8px 4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {label}
        </div>}
      {items.map((item) => <Link
    key={item.label}
    href={item.href}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "7px 10px",
      borderRadius: 8,
      color: isActive(item.href) ? "#800000" : "#333",
      background: isActive(item.href) ? "#fff5f5" : "transparent"
    }}
  >
          {item.icon}
          {!collapsed && <span style={{ flex: 1, fontSize: 12 }}>{item.label}</span>}
        </Link>)}
    </div>;
}
function ClientDashboardLayout() {
  const children = <Outlet />;
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [vaOpen, setVaOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const [clientInfo, setClientInfo] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [logoutDone, setLogoutDone] = useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/client/me`, { method: "GET", credentials: "include" });
        if (res.ok) {
          setClientInfo(await res.json());
        } else if (res.status === 401 || res.status === 403) {
          router.push("/client/login");
        }
      } catch (err) {
        console.error("Failed to fetch client profile:", err);
      }
    };
    fetchProfile();
  }, []);
  const handleLogout = async () => {
    if (loggingOut) return;
    setConfirmLogout(false);
    setLoggingOut(true);
    try {
      await fetch(`/api/auth/logout`, { method: "POST", credentials: "include" });
    } catch {
    } finally {
      setClientInfo(null);
      setLogoutDone(true);
    }
  };
  const avatarLetter = clientInfo ? clientInfo.firstName.charAt(0).toUpperCase() : "?";
  const sidebarName = clientInfo ? `${clientInfo.firstName} ${clientInfo.lastName}` : "Loading...";
  const sidebarEmail = clientInfo?.email ?? "";
  return <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#ffffff", overflow: "hidden" }}>
      {confirmLogout && <LogoutConfirmModal
    portalLabel="Client"
    accent="#8b0000"
    onConfirm={handleLogout}
    onCancel={() => setConfirmLogout(false)}
  />}
      {loggingOut && <LogoutOverlay
    portalLabel="Client"
    accent="#8b0000"
    ready={logoutDone}
    onDone={() => {
      window.location.href = "/client/login";
    }}
  />}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Poppins', sans-serif; font-weight: 400; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
        a { text-decoration: none; color: inherit; }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .search-box   { display: none !important; }
          .sidebar {
            position: fixed !important; left: 0 !important; top: 0 !important;
            width: 240px !important; min-width: 240px !important; height: 100vh !important;
            transform: translateX(-100%);
            transition: transform 0.25s ease !important;
            z-index: 200 !important;
          }
          .sidebar.open { transform: translateX(0) !important; box-shadow: 4px 0 24px rgba(0,0,0,0.13) !important; }
          .overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 190; }
          .overlay.active { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
          .overlay     { display: none !important; }
        }
      `}</style>

      <div className={`overlay ${mobileOpen ? "active" : ""}`} onClick={() => setMobileOpen(false)} />

      <aside
    className={`sidebar ${mobileOpen ? "open" : ""}`}
    style={{
      width: collapsed ? 64 : 240,
      minWidth: collapsed ? 64 : 240,
      background: "#ffffff",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid #eeebeb",
      transition: "all 0.2s ease",
      zIndex: 150
    }}
  >
        {
    /* Logo bar */
  }
        <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", padding: "0 14px", height: 56, borderBottom: "1px solid #eeebeb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#800000", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
                <rect x="8" y="1" width="5" height="5" rx="1" fill="white" />
                <rect x="1" y="8" width="5" height="5" rx="1" fill="white" />
                <rect x="8" y="8" width="5" height="5" rx="1" fill="white" />
              </svg>
            </div>
            {!collapsed && <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Client Portal
              </span>}
          </div>
          <button
    onClick={() => setCollapsed(!collapsed)}
    className="desktop-only"
    style={{ background: "none", border: "1px solid #e0dede", borderRadius: 6, cursor: "pointer", color: "#aaa", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
  >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <button
    onClick={() => setMobileOpen(false)}
    className="mobile-only"
    style={{ background: "none", border: "1px solid #e0dede", borderRadius: 6, cursor: "pointer", color: "#aaa", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
  >
            <ChevronLeft />
          </button>
        </div>

        {
    /* Scrollable nav area */
  }
        <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
          <NavSection label="General" items={NAV_GENERAL} collapsed={collapsed} pathname={pathname} />

          <NavDropdown
    sectionLabel="Services"
    triggerLabel={NAV_SERVICES_DROPDOWN.label}
    triggerIcon={NAV_SERVICES_DROPDOWN.icon}
    items={NAV_SERVICES_DROPDOWN.children}
    collapsed={collapsed}
    pathname={pathname}
    open={servicesOpen}
    onToggle={() => setServicesOpen((v) => !v)}
  />
          <NavDropdown
    sectionLabel="Virtual Assistant"
    triggerLabel={NAV_VA_DROPDOWN.label}
    triggerIcon={NAV_VA_DROPDOWN.icon}
    items={NAV_VA_DROPDOWN.children}
    collapsed={collapsed}
    pathname={pathname}
    open={vaOpen}
    onToggle={() => setVaOpen((v) => !v)}
  />
        </div>

        {
    /* Bottom: Support links + profile card */
  }
        <div style={{ padding: "10px", borderTop: "1px solid #f5f2f2" }}>
          <NavSection label="" items={NAV_SUPPORT} collapsed={collapsed} pathname={pathname} />
          <div style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: collapsed ? "8px 0" : "10px 12px",
    borderRadius: 10,
    background: "#fff",
    border: collapsed ? "none" : "1px solid #ece8e8",
    justifyContent: collapsed ? "center" : "flex-start",
    marginTop: 6
  }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#800000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, overflow: "hidden" }}>
              {clientInfo?.profilePicture ? <img src={clientInfo.profilePicture} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : avatarLetter}
            </div>
            {!collapsed && <>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 11.5, color: "#1a1a2e", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", fontWeight: 500 }}>{sidebarName}</div>
                  <div style={{ fontSize: 10, color: "#aaa", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", marginTop: 1 }}>{sidebarEmail}</div>
                </div>
                <button
    onClick={() => setConfirmLogout(true)}
    disabled={loggingOut}
    title="Logout"
    style={{ background: "none", border: "none", cursor: loggingOut ? "not-allowed" : "pointer", color: loggingOut ? "#ccc" : "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", padding: 4, borderRadius: 6, flexShrink: 0 }}
  >
                  <LogoutIco />
                </button>
              </>}
          </div>
        </div>
      </aside>

      {
    /* â”€â”€ MAIN CONTENT â”€â”€ */
  }
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <Header onMenuClick={() => setMobileOpen(true)} clientInfo={clientInfo} onLogout={() => setConfirmLogout(true)} />
        <main style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {children}
        </main>
      </div>
    </div>;
}
export {
  ClientDashboardLayout as default
};
