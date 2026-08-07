import { Outlet } from "react-router-dom";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logout, { performAdminLogout, goToAdminLogin } from "./settings/logout";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import LogoutOverlay from "@/components/LogoutOverlay";
import SettingsMenu from "./settings/SettingsMenu";
import MiniActivityLogs from "./MiniActivityLogs";
import api from "@/lib/api/axios";
import { AdminThemeProvider, useAdminTheme } from "@/lib/admin-theme";
import "@/styles/admin-theme.css";
// Backed by the multi-theme provider rather than its own boolean state, so the
// 34 dashboard files that read `isdarkmode` keep working unchanged while the
// actual palette comes from whichever of the 20 themes is active.
const useDarkMode = () => {
  const { theme, setTheme, isdarkmode } = useAdminTheme();
  return { isdarkmode, theme, setTheme };
};
const getDepartmentName = (dept) => {
  const departments = {
    1: "Compliance",
    2: "Innovation",
    3: "Marketing",
    4: "Recruitment",
    5: "Human Resources"
  };
  return departments[dept] || "Unknown";
};
const getRoleName = (role) => {
  const roles = {
    1: "Main administrator",
    2: "Administrator"
  };
  return roles[role] || "Unknown";
};
function DashboardLayout() {
  return <AdminThemeProvider><DashboardLayoutInner /></AdminThemeProvider>;
}
function DashboardLayoutInner() {
  const children = <Outlet />;
  const pathname = usePathname();
  const router = useRouter();
  const { isdarkmode, theme, setTheme } = useDarkMode();
  const [issidebarcollapsed, setissidebarcollapsed] = useState(false);
  const [ismobilemenuopen, setismobilemenuopen] = useState(false);
  const [opendropdowns, setopendropdowns] = useState({});
  const [isactivitylogsopen, setisactivitylogsopen] = useState(false);
  const [unreadcount, setunreadcount] = useState(0);
  const [isheaderdropdownopen, setisheaderdropdownopen] = useState(false);
  const dropdownref = useRef(null);
  const activitylogsref = useRef(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutDone, setLogoutDone] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [authError, setAuthError] = useState(false);
  // Theme restore/persist is handled by AdminThemeProvider (localStorage) and
  // by the effect below (server), so no local dark-mode bootstrap is needed.
  const handleConfirmLogout = async () => {
    if (loggingOut) return;
    setConfirmLogout(false);
    setLoggingOut(true);
    await performAdminLogout();
    setLogoutDone(true);
  };
  // Mirrors the active theme to the server. Skips the very first run so
  // merely loading the page doesn't PATCH back the value we just read.
  const didSyncInitialTheme = useRef(false);
  useEffect(() => {
    if (!didSyncInitialTheme.current) {
      didSyncInitialTheme.current = true;
      return;
    }
    const syncTheme = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "/api";
        await fetch(`${apiUrl}/users/theme`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          // darkMode is kept for backward compatibility with the existing
          // column; theme carries the actual selection.
          body: JSON.stringify({ darkMode: isdarkmode, theme })
        });
      } catch (error) {
        console.error("Failed to sync theme with database:", error);
      }
    };
    syncTheme();
  }, [theme, isdarkmode]);
  const togglesidebar = () => {
    setissidebarcollapsed(!issidebarcollapsed);
    if (!issidebarcollapsed) setopendropdowns({});
  };
  const toggledropdown = (itemname) => {
    setopendropdowns((prev) => ({ ...prev, [itemname]: !prev[itemname] }));
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingUser(true);
        const response = await Promise.race([
          api.get("/users/me"),
          new Promise(
            (_, reject) => setTimeout(() => reject(new Error("Request timeout")), 8e3)
          )
        ]);
        const data = response.data;
        setUserData(data);
        // Prefer the stored theme key; fall back to the legacy darkMode
        // boolean for accounts saved before multi-theme support.
        if (data.theme) {
          setTheme(data.theme);
        } else if (data.darkMode !== void 0) {
          setTheme(data.darkMode ? "dark-obsidian" : "light");
        }
        setAuthError(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error?.response?.status === 401) {
          setAuthError(true);
        }
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUserData();
  }, []);
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get("/activity-logs/unread-count");
        setunreadcount(response.data.unreadCount || 0);
      } catch (error) {
        console.error("Error fetching unread count:", error);
        setunreadcount(0);
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 3e4);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    function handleclickoutside(event) {
      if (dropdownref.current && !dropdownref.current.contains(event.target))
        setisheaderdropdownopen(false);
      if (activitylogsref.current && !activitylogsref.current.contains(event.target))
        setisactivitylogsopen(false);
    }
    document.addEventListener("mousedown", handleclickoutside);
    return () => document.removeEventListener("mousedown", handleclickoutside);
  }, []);
  useEffect(() => {
    setismobilemenuopen(false);
  }, [pathname]);
  useEffect(() => {
    if (ismobilemenuopen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [ismobilemenuopen]);
  const getnavstyle = (path, hasdropdown = false) => {
    const isactive = pathname === path || hasdropdown && pathname.startsWith(path);
    const collapsedpadding = issidebarcollapsed ? "lg:justify-center lg:px-0" : "px-3 sm:px-4";
    if (isactive) return `bg-[var(--admin-accent)] text-[var(--admin-text-on-accent)] shadow-md border-none ${collapsedpadding}`;
    return `bg-transparent text-[var(--admin-text-faint)] hover:bg-[var(--admin-bg-hover)] border-none ${collapsedpadding}`;
  };
  const getsubnavstyle = (path) => {
    const isactive = pathname === path;
    if (isactive) return "text-[var(--admin-accent-text)] rounded-xl bg-[var(--admin-bg-soft)]";
    return "text-[var(--admin-text-faint)] hover:text-[var(--admin-text)] rounded-xl hover:bg-[var(--admin-bg-hover)]";
  };
  if (isLoadingUser) {
    return <div className="flex h-[100dvh] items-center justify-center bg-[var(--admin-bg)]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--admin-accent)] border-r-transparent" />
          <p className="mt-4 text-[var(--admin-text-sub)]" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: "11px" }}>Authenticating...</p>
          <p className="mt-2 text-[var(--admin-text-faint)]" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: "10px" }}>Please wait</p>
        </div>
      </div>;
  }
  if (authError || !userData) return null;
  const getUserInitials = () => {
    if (!userData) return "?";
    return `${userData.firstName?.[0] || ""}${userData.lastName?.[0] || ""}`.toUpperCase();
  };
  const getUserFullName = () => {
    if (!userData) return "Unknown user";
    return `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
  };
  const baseNavigationItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
    },
    {
      name: "Page Views",
      path: "/admin/dashboard/page-views",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
    },
    {
      name: "Blogs",
      path: "/admin/dashboard/blogs",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>,
      hasDropdown: true,
      subItems: [
        { name: "Add blog", path: "/admin/dashboard/blogs" },
        { name: "Blog list", path: "/admin/dashboard/blogs/list" }
      ]
    },
    {
      name: "Services",
      path: "/admin/dashboard/Services",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
    },
    {
      name: "Archive",
      path: "/admin/dashboard/Archive",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 8v13H3V8" /><path d="M1 3h22v5H1z" /><path d="M10 12h4" /></svg>
    },
    {
      name: "Case studies",
      path: "/admin/dashboard/CaseStudies",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
    },
    {
      name: "Activity logs",
      path: "/admin/dashboard/ActivityLogs",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
    },
    {
      name: "Appointments",
      path: "/admin/dashboard/Appointment",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
    },
    {
      name: "Applicants",
      path: "/admin/dashboard/Applicants",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M12 17l2 2 4-4" /></svg>
    }
  ];
  const adminsMenuItem = {
    name: "Admins",
    path: "/admin/dashboard/admin-management",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    hasDropdown: true,
    subItems: [
      { name: "Add admin", path: "/admin/dashboard/admin-management/add" },
      { name: "Admin list", path: "/admin/dashboard/admin-management" }
    ]
  };
  const navigationitems = userData.role === 1 ? [...baseNavigationItems, adminsMenuItem] : baseNavigationItems;
  const poppins = { fontFamily: "'Poppins', sans-serif", fontWeight: 400 };
  const SidebarContent = ({ iscollapsed }) => <>

      {
    /* Logo section */
  }
      <div className="pt-6 sm:pt-8 px-4 sm:px-6 pb-3 transition-all duration-300">

        {
    /* EXPANDED: logo + toggle on same row */
  }
        {(!iscollapsed || ismobilemenuopen) && <div className="flex items-center justify-between">
            <Link
    href="/admin/dashboard"
    className="flex items-center gap-2 sm:gap-3 cursor-pointer group transition-all duration-300 no-underline border-none min-w-0"
  >
              <div className="flex items-center justify-center shrink-0">
                <img
    src="/images/log0.png"
    alt="logo"
    className="transition-all duration-300 object-contain w-10 h-10 sm:w-12 sm:h-12"
  />
              </div>
              <div className="flex flex-col min-w-0">
                <span
    className={`transition-colors truncate text-[var(--admin-text)]`}
    style={{ ...poppins, fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em" }}
  >
                  TELEXPH
                </span>
                <span
    className={`transition-colors truncate text-[var(--admin-text-faint)]`}
    style={{ ...poppins, fontSize: "9px", letterSpacing: "0.02em" }}
  >
                  Administration Side
                </span>
              </div>
            </Link>

            {
    /* Close button — mobile only */
  }
            <button
    onClick={() => setismobilemenuopen(false)}
    className="lg:hidden p-2 text-[var(--admin-text-faint)] bg-transparent border-none shrink-0 touch-manipulation"
  >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {
    /* Toggle button — desktop only */
  }
            <button
    onClick={togglesidebar}
    className={`hidden lg:flex items-center justify-center w-9 h-9 rounded-xl border-none transition-all active:scale-90 cursor-pointer shrink-0 bg-[var(--admin-bg-soft)] text-[var(--admin-text-sub)] hover:bg-[var(--admin-bg-hover)]`}
  >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 3v18" />
              </svg>
            </button>
          </div>}

        {
    /* COLLAPSED: toggle button only — desktop only */
  }
        {iscollapsed && !ismobilemenuopen && <div className="hidden lg:flex flex-col items-center">
            <button
    onClick={togglesidebar}
    className={`flex items-center justify-center w-10 h-10 rounded-2xl border-none transition-all active:scale-90 cursor-pointer bg-[var(--admin-bg-soft)] text-[var(--admin-text-sub)] hover:bg-[var(--admin-bg-hover)]`}
  >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 3v18" />
              </svg>
            </button>
          </div>}
      </div>

      {
    /* Navigation */
  }
      <nav className={`flex-1 overflow-y-auto no-scrollbar pt-2 pb-6 space-y-1 transition-all duration-300 ${iscollapsed ? "px-2" : "px-3 sm:px-5"}`}>
        {!iscollapsed && <div
    className={`mb-3 px-3 sm:px-4 transition-colors text-[var(--admin-text-faint)]`}
    style={{ ...poppins, fontSize: "9px" }}
  >
            Main menu
          </div>}

        {(() => {
    const renderItem = (item) => <div key={item.name}>
              {item.hasDropdown ? <>
                  <button
      onClick={() => toggledropdown(item.name)}
      className={`w-full flex items-center rounded-2xl transition-all duration-300 active:scale-95 border-none outline-none touch-manipulation ${iscollapsed ? "justify-center py-3" : "justify-between py-2.5 sm:py-3"} ${getnavstyle(item.path, true)}`}
      style={{ ...poppins, fontSize: "11px" }}
    >
                    <div className={`flex items-center ${iscollapsed ? "" : "gap-2 sm:gap-3"}`}>
                      <span className="shrink-0">{item.icon}</span>
                      {(!iscollapsed || ismobilemenuopen) && <span style={poppins}>{item.name}</span>}
                    </div>
                    {(!iscollapsed || ismobilemenuopen) && <svg
      className={`w-3.5 h-3.5 transition-transform shrink-0 ${opendropdowns[item.name] ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${opendropdowns[item.name] && (!iscollapsed || ismobilemenuopen) ? "max-h-48 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                    <div className="py-1 space-y-1">
                      {item.subItems?.map((sub) => <Link
      key={sub.name}
      href={sub.path}
      className={`group relative flex items-center py-2 pl-5 sm:pl-6 pr-3 sm:pr-4 no-underline transition-all active:scale-95 my-1 mx-2 touch-manipulation ${getsubnavstyle(sub.path)}`}
    >
                          <div className={`absolute left-[-8px] w-4 h-px top-1/2 bg-[var(--admin-border-strong)] rounded-tr-lg`} />
                          <span className="transition-colors" style={{ ...poppins, fontSize: "10px" }}>{sub.name}</span>
                        </Link>)}
                    </div>
                  </div>
                </> : <Link
      href={item.path}
      className={`w-full flex items-center rounded-2xl transition-all duration-300 active:scale-95 border-none outline-none no-underline touch-manipulation ${iscollapsed ? "justify-center py-3" : "justify-between py-2.5 sm:py-3"} ${getnavstyle(item.path)}`}
      style={{ ...poppins, fontSize: "11px" }}
    >
                  <div className={`flex items-center ${iscollapsed ? "" : "gap-2 sm:gap-3"}`}>
                    <span className="shrink-0">{item.icon}</span>
                    {(!iscollapsed || ismobilemenuopen) && <span style={poppins}>{item.name}</span>}
                  </div>
                </Link>}
            </div>;
    return <>
              <div className="space-y-1">{navigationitems.map(renderItem)}</div>
            </>;
  })()}
      </nav>

      {
    /* Bottom: profile */
  }
      <div className={`pt-3 sm:pt-4 pb-4 sm:pb-6 space-y-2 sm:space-y-3 border-t transition-all duration-300 ${iscollapsed ? "px-2" : "px-3 sm:px-5"} border-[var(--admin-border)]`}>
        {
    /* Profile card */
  }
        <Link
    href="/admin/dashboard/settings"
    className={`flex items-center p-2.5 sm:p-3 rounded-2xl border-none shadow-sm transition-all hover:shadow-md cursor-pointer no-underline active:scale-95 touch-manipulation ${iscollapsed ? "justify-center" : "justify-between"} bg-[var(--admin-surface-raised)]`}
  >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
    className="w-8 h-8 sm:w-9 sm:h-9 bg-[var(--admin-accent)] rounded-xl flex items-center justify-center text-[var(--admin-text-on-accent)] border-none shrink-0 shadow-lg overflow-hidden"
    style={{ ...poppins, fontSize: "10px" }}
  >
              {userData.profilePicture ? <img src={userData.profilePicture} alt="Profile" className="w-full h-full object-cover" /> : getUserInitials()}
            </div>
            {(!iscollapsed || ismobilemenuopen) && <div className="flex flex-col text-left min-w-0">
                <span
    className={`tracking-tight transition-colors truncate text-[var(--admin-text)]`}
    style={{ ...poppins, fontSize: "11px" }}
  >
                  {getUserFullName()}
                </span>
                <span className="text-[var(--admin-text-faint)] truncate" style={{ ...poppins, fontSize: "9px" }}>
                  {getDepartmentName(userData.department)}
                </span>
              </div>}
          </div>
        </Link>
      </div>
    </>;
  return <>
      {confirmLogout && <LogoutConfirmModal
    portalLabel="Admin"
    accent="var(--admin-accent)"
    onConfirm={handleConfirmLogout}
    onCancel={() => setConfirmLogout(false)}
  />}
      {loggingOut && <LogoutOverlay
    portalLabel="Admin"
    accent="var(--admin-accent)"
    ready={logoutDone}
    onDone={goToAdminLogin}
  />}
      <div
    className={`flex h-[100dvh] overflow-hidden antialiased transition-colors duration-500 bg-[var(--admin-bg)] text-[var(--admin-text-sub)]`}
    style={poppins}
  >
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;900&display=swap');
          * { font-family: 'Poppins', sans-serif !important; }
          body { font-family: 'Poppins', sans-serif; font-weight: 400; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        ` }} />

        {
    /* Desktop sidebar — slightly narrower on smaller desktops */
  }
        <aside
    className={`border-r hidden lg:flex flex-col h-full z-20 transition-all duration-300 ease-in-out shrink-0
            ${issidebarcollapsed ? "w-20" : "w-56 xl:w-64"}
            bg-[var(--admin-surface)] border-[var(--admin-border)]`}
    style={poppins}
  >
          <SidebarContent iscollapsed={issidebarcollapsed} />
        </aside>

        {
    /* Mobile & Tablet overlay */
  }
        <div
    className={`lg:hidden fixed inset-0 bg-black/50 z-[40] transition-opacity duration-300 ${ismobilemenuopen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    onClick={() => setismobilemenuopen(false)}
  />

        {
    /* Mobile & Tablet sidebar drawer */
  }
        <aside
    className={`lg:hidden fixed left-0 top-0 bottom-0 z-[50] transition-transform duration-300 ease-in-out transform flex flex-col
            w-[75vw] max-w-[300px] sm:w-72 md:w-80
            ${ismobilemenuopen ? "translate-x-0" : "-translate-x-full"}
            bg-[var(--admin-surface)]`}
    style={poppins}
  >
          <SidebarContent iscollapsed={false} />
        </aside>

        {
    /* Main content area */
  }
        <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden w-0 min-w-0">

          {
    /* Header — shorter on mobile */
  }
          <header
    className={`flex items-center justify-between shrink-0 transition-colors duration-500
            h-14 sm:h-16 lg:h-20
            px-4 sm:px-6 lg:px-8 xl:px-10
            bg-[var(--admin-surface)] border-b border-[var(--admin-border)]`}
  >
            <div className="flex items-center gap-2 sm:gap-4">
              {
    /* Mobile/Tablet hamburger */
  }
              <button
    onClick={() => setismobilemenuopen(true)}
    className={`lg:hidden p-2 sm:p-2.5 rounded-xl border-none transition-all active:scale-90 touch-manipulation bg-[var(--admin-bg-soft)] text-[var(--admin-text-sub)]`}
  >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>

            <div className="relative flex items-center gap-2 sm:gap-3">
              {
    /* Activity logs */
  }
              <div className="relative" ref={activitylogsref}>
                <button
    onClick={() => setisactivitylogsopen(!isactivitylogsopen)}
    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center relative cursor-pointer transition-all border-none outline-none active:scale-90 touch-manipulation bg-[var(--admin-bg-soft)] hover:bg-[var(--admin-bg-hover)]`}
  >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {unreadcount > 0 && <span
    className="absolute top-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[var(--admin-accent)] text-[var(--admin-text-on-accent)] flex items-center justify-center rounded-full border border-[var(--admin-surface)]"
    style={{ ...poppins, fontSize: "8px", fontWeight: 600 }}
  >
                      {unreadcount > 9 ? "9+" : unreadcount}
                    </span>}
                </button>

                {isactivitylogsopen && <div className="absolute right-0 mt-2 sm:mt-3 z-[100] animate-in fade-in zoom-in-95 duration-200">
                    <MiniActivityLogs
    isdarkmode={isdarkmode}
    onUnreadCountChange={(count) => setunreadcount(count)}
    onClose={() => setisactivitylogsopen(false)}
  />
                  </div>}
              </div>

              {
    /* Header dropdown */
  }
              <div className="relative" ref={dropdownref}>
                <button
    onClick={() => setisheaderdropdownopen(!isheaderdropdownopen)}
    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center cursor-pointer transition-all border-none outline-none active:scale-90 touch-manipulation bg-[var(--admin-bg-soft)] hover:bg-[var(--admin-bg-hover)]`}
  >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                    <circle cx="19" cy="12" r="1" fill="currentColor" />
                    <circle cx="5" cy="12" r="1" fill="currentColor" />
                  </svg>
                </button>

                {isheaderdropdownopen && <div className={`absolute right-0 mt-2 sm:mt-4 w-60 sm:w-72 rounded-[20px] sm:rounded-[35px] shadow-2xl border p-2 sm:p-3 z-[100] animate-in fade-in zoom-in-95 duration-200 bg-[var(--admin-surface-raised)] border-[var(--admin-border)]`}>
                    <div onClick={() => setisheaderdropdownopen(false)}>
                      <SettingsMenu isdarkmode={isdarkmode} />
                    </div>
                    <div className={`h-[1px] mx-4 sm:mx-6 my-2 bg-[var(--admin-border)]`} />
                    <div onClick={() => setisheaderdropdownopen(false)}>
                      <Logout isdarkmode={isdarkmode} onRequestConfirm={() => setConfirmLogout(true)} />
                    </div>
                  </div>}
              </div>
            </div>
          </header>

          {
    /* Page content */
  }
          <section className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 lg:py-8">
            {children}
          </section>
        </main>
      </div>
    </>;
}
export {
  DashboardLayout as default,
  useDarkMode
};
