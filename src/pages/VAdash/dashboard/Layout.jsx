import { Outlet } from "react-router-dom";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
const Ico = ({ d, d2, size = 16, sw = 1.2 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />{d2 && <path d={d2} />}
  </svg>;
const BG = "#FFFFFF";
const SOFT = "#f5f5f5";
const BORDER = "rgba(0,0,0,0.08)";
const NEU_OUT = "0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)";
const NEU_IN = "inset 2px 2px 5px #e0e0e0, inset -2px -2px 5px #ffffff";
const TEXT_MAIN = "#2a2a2a";
const TEXT_SUB = "#888";
const PRIMARY = "#800000";
const NavIcon = ({ children, active }) => <span style={{ width: 26, height: 26, borderRadius: 7, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: active ? "#fff0f0" : SOFT, color: active ? PRIMARY : "#666", border: `1.5px solid ${active ? `${PRIMARY}40` : "#e5e5e5"}`, transition: "all 0.15s" }}>{children}</span>;
const DashIco = ({ a }) => <NavIcon active={a}><Ico d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" d2="M9 22V12h6v10" size={13} /></NavIcon>;
const AssessIco = ({ a }) => <NavIcon active={a}><Ico d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" size={13} /></NavIcon>;
const SettingsIco = ({ a }) => <NavIcon active={a}><Ico d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" d2="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" size={13} /></NavIcon>;
const ChevronLeft = () => <Ico d="M15 18l-6-6 6-6" size={14} sw={1.5} />;
const ChevronRight = () => <Ico d="M9 18l6-6-6-6" size={14} sw={1.5} />;
const SearchIco = () => <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={14} />;
const BellIco = () => <Ico d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" size={16} />;
const LogoutIco = () => <Ico d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" size={13} />;
const MenuIco = () => <Ico d="M3 12h18M3 6h18M3 18h18" size={18} />;
const ProfileIco = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={13} />;
const API_BASE =
  import.meta.env.VITE_API_URL || "/api";
const NAV_ITEMS = [
  { label: "Dashboard", href: "/VirtualAssistant/dashboard", icon: (a) => <DashIco a={a} /> },
  { label: "Assessment", href: "/VirtualAssistant/dashboard/VAassesment", icon: (a) => <AssessIco a={a} /> }
];
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
  return <header style={{ height: 60, background: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 14, position: "sticky", top: 0, zIndex: 100 }}>
      <button className="mobile-only" onClick={onMenuClick} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_SUB }}><MenuIco /></button>
      <div style={{ flex: 1 }}>
        <div className="desktop-only" style={{ fontSize: 12, color: TEXT_SUB }}>{today}</div>
      </div>

      {
    /* Search box */
  }
      <div className="search-box" style={{ display: "flex", alignItems: "center", gap: 8, background: SOFT, borderRadius: 12, padding: "7px 14px", fontSize: 12, color: TEXT_SUB, width: 190, border: "1px solid #e5e5e5" }}>
        <SearchIco /><span>Search...</span>
      </div>

      {
    /* Bell */
  }
      <div style={{ width: 36, height: 36, borderRadius: 10, background: SOFT, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: TEXT_SUB, position: "relative", border: "1px solid #e5e5e5" }}>
        <BellIco />
        <span style={{ position: "absolute", top: 7, right: 8, width: 7, height: 7, borderRadius: "50%", background: PRIMARY, border: `2px solid ${BG}` }} />
      </div>

      {
    /* Avatar */
  }
      <div style={{ position: "relative" }} ref={menuRef}>
        <div
    onClick={() => setShowUserMenu(!showUserMenu)}
    style={{ width: 36, height: 36, borderRadius: "50%", background: PRIMARY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, cursor: "pointer", overflow: "hidden", boxShadow: NEU_OUT }}
  >
          {clientInfo?.profilePicture ? <img src={clientInfo.profilePicture} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : avatarLetter}
        </div>
        {showUserMenu && <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 200, background: BG, borderRadius: 16, boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: `1px solid ${BORDER}`, overflow: "hidden", zIndex: 200 }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 12, color: TEXT_MAIN, fontWeight: 600 }}>{displayName}</div>
              <div style={{ fontSize: 10, color: TEXT_SUB, marginTop: 2 }}>{displayEmail}</div>
            </div>
            <div style={{ padding: "6px" }}>
              <div
    onClick={() => {
      setShowUserMenu(false);
      router.push("/VirtualAssistant/dashboard/Settings");
    }}
    style={{ padding: "8px 12px", fontSize: 12, borderRadius: 10, cursor: "pointer", color: TEXT_MAIN, display: "flex", alignItems: "center", gap: 8 }}
  >
                <ProfileIco /> Profile Settings
              </div>
              <div
    onClick={onLogout}
    style={{ padding: "8px 12px", fontSize: 12, borderRadius: 10, cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center", gap: 8 }}
  >
                <LogoutIco /> Logout
              </div>
            </div>
          </div>}
      </div>
    </header>;
}
function NavItem({ label, href, icon, collapsed, isActive }) {
  return <Link href={href} style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "8px 6px" : "8px 10px", borderRadius: 12, marginBottom: 3, background: isActive ? "#fff0f0" : "transparent", border: `1.5px solid ${isActive ? `${PRIMARY}30` : "transparent"}`, color: isActive ? PRIMARY : TEXT_MAIN, fontWeight: isActive ? 600 : 400, fontSize: 12.5, textDecoration: "none", justifyContent: collapsed ? "center" : "flex-start", transition: "all 0.15s" }}>
      {icon(isActive)}
      {!collapsed && <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>}
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
      setLoggingOut(false);
      window.location.href = "/VirtualAssistant/login";
    }
  };
  const avatarLetter = clientInfo ? clientInfo.firstName.charAt(0).toUpperCase() : "?";
  const sidebarName = clientInfo ? `${clientInfo.firstName} ${clientInfo.lastName}` : "Loading...";
  const sidebarEmail = clientInfo?.email ?? "";
  return <div style={{ display: "flex", height: "100vh", width: "100vw", background: BG, overflow: "hidden" }}>
      {confirmLogout && <LogoutConfirmModal
    portalLabel="Virtual Assistant"
    accent="#800000"
    onConfirm={handleLogout}
    onCancel={() => setConfirmLogout(false)}
  />}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        html, body, #__next, #root { background-color: #ffffff !important; }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Poppins', sans-serif; font-weight: 400; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        a { text-decoration: none; color: inherit; }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .search-box   { display: none !important; }
          .sidebar { position: fixed !important; left: 0 !important; top: 0 !important; width: 240px !important; min-width: 240px !important; height: 100vh !important; transform: translateX(-100%); transition: transform 0.25s ease !important; z-index: 200 !important; }
          .sidebar.open { transform: translateX(0) !important; box-shadow: 4px 0 30px rgba(0,0,0,0.10) !important; }
          .overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 190; }
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
    style={{ width: collapsed ? 68 : 248, minWidth: collapsed ? 68 : 248, background: BG, height: "100vh", display: "flex", flexDirection: "column", borderRight: `1px solid ${BORDER}`, transition: "all 0.22s ease", zIndex: 150 }}
  >

        {
    /* Logo bar */
  }
        <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", padding: "0 16px", height: 60, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: SOFT, border: "1px solid #e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1.5" fill="#800000" />
                <rect x="8" y="1" width="5" height="5" rx="1.5" fill="#800000" />
                <rect x="1" y="8" width="5" height="5" rx="1.5" fill="#800000" />
                <rect x="8" y="8" width="5" height="5" rx="1.5" fill="#800000" />
              </svg>
            </div>
            {!collapsed && <span style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN, letterSpacing: "0.06em", textTransform: "uppercase" }}>VA Portal</span>}
          </div>
          <button
    onClick={() => setCollapsed(!collapsed)}
    className="desktop-only"
    style={{ background: SOFT, border: "1px solid #e5e5e5", borderRadius: 8, cursor: "pointer", color: TEXT_SUB, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
  >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <button
    onClick={() => setMobileOpen(false)}
    className="mobile-only"
    style={{ background: SOFT, border: "1px solid #e5e5e5", borderRadius: 8, cursor: "pointer", color: TEXT_SUB, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
  >
            <ChevronLeft />
          </button>
        </div>

        {
    /* Nav items */
  }
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 10px" }}>
          {!collapsed && <div style={{ fontSize: 9.5, color: "#bbb", padding: "0 10px 8px", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>Menu</div>}
          {collapsed && <div style={{ height: 1, background: BORDER, margin: "0 4px 10px" }} />}
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
    /* Bottom: settings + profile */
  }
        <div style={{ padding: "10px", borderTop: `1px solid ${BORDER}` }}>
          <NavItem
    label="Settings"
    href="/VirtualAssistant/dashboard/Settings"
    icon={(a) => <SettingsIco a={a} />}
    collapsed={collapsed}
    isActive={pathname === "/VirtualAssistant/dashboard/Settings"}
  />
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "8px 6px" : "10px 12px", borderRadius: 14, background: SOFT, border: "1px solid #e5e5e5", justifyContent: collapsed ? "center" : "flex-start", marginTop: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: PRIMARY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, overflow: "hidden", boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.2)" }}>
              {clientInfo?.profilePicture ? <img src={clientInfo.profilePicture} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : avatarLetter}
            </div>
            {!collapsed && <>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 11.5, color: TEXT_MAIN, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", fontWeight: 600 }}>{sidebarName}</div>
                  <div style={{ fontSize: 10, color: TEXT_SUB, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", marginTop: 1 }}>{sidebarEmail}</div>
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

      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <Header onMenuClick={() => setMobileOpen(true)} clientInfo={clientInfo} onLogout={() => setConfirmLogout(true)} />
        <main style={{ flex: 1, overflowY: "auto", padding: "20px", background: BG }}>{children}</main>
      </div>
    </div>;
}
export {
  VADashboardLayout as default
};
