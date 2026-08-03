
import { useState, useEffect } from "react";
import { useDarkMode } from "@/pages/admin/dashboard/Layout";
function ActivityLogs() {
  const { isdarkmode } = useDarkMode();
  const [activetab, setactivetab] = useState("All");
  const [searchquery, setsearchquery] = useState("");
  const [sortby, setsortby] = useState("Newest");
  const [filteredmodules, setfilteredmodules] = useState([]);
  const [selectedlog, setselectedlog] = useState(null);
  const [showdetailsmodal, setshowdetailsmodal] = useState(false);
  const [currentpage, setcurrentpage] = useState(1);
  const [pagesize] = useState(20);
  const [logs, setlogs] = useState([]);
  const [pagination, setpagination] = useState(null);
  const [stats, setstats] = useState(null);
  const [isloading, setisloading] = useState(false);
  const [error, seterror] = useState(null);
  const availableModules = ["CASESTUDY", "BLOGS", "ACCOUNT_SETTINGS", "AUTH"];
  const actionTypes = ["All", "CREATED", "UPDATED", "DELETED", "ARCHIVED", "RESTORED", "LOGIN", "LOGOUT"];
  const pageBg = isdarkmode ? "#0f0f0f" : "#f8f9fa";
  const cardBg = isdarkmode ? "#1a1a1a" : "#ffffff";
  const subtleBg = isdarkmode ? "#202020" : "#f9fafb";
  const borderColor = isdarkmode ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const textPrimary = isdarkmode ? "#f0f0f0" : "#1f2937";
  const textMuted = isdarkmode ? "#6b7280" : "#6b7280";
  const inputBg = isdarkmode ? "#202020" : "#f9fafb";
  const fetchActivityLogs = async () => {
    try {
      setisloading(true);
      seterror(null);
      const params = new URLSearchParams();
      params.append("page", currentpage.toString());
      params.append("limit", pagesize.toString());
      params.append("order", sortby === "Newest" ? "desc" : "asc");
      if (activetab !== "All") params.append("action", activetab);
      if (filteredmodules.length > 0) params.append("module", filteredmodules[0]);
      if (searchquery) params.append("admin", searchquery);
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      const response = await fetch(`${apiUrl}/activity-logs?${params.toString()}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch activity logs (${response.status})`);
      }
      const data = await response.json();
      setlogs(data.logs || []);
      setpagination(data.pagination);
    } catch (err) {
      seterror(err.message || "Failed to fetch activity logs");
    } finally {
      setisloading(false);
    }
  };
  const fetchActivityStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      const response = await fetch(`${apiUrl}/activity-logs/stats`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error("Failed to fetch activity stats");
      const data = await response.json();
      setstats(data);
    } catch (err) {
      console.error("Error fetching activity stats:", err);
    }
  };
  useEffect(() => {
    fetchActivityLogs();
  }, [currentpage, pagesize, sortby, activetab, filteredmodules]);
  useEffect(() => {
    fetchActivityStats();
  }, []);
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => seterror(null), 5e3);
      return () => clearTimeout(t);
    }
  }, [error]);
  const formatAction = (action) => action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
  const formatModuleName = (module) => {
    switch (module) {
      case "CASESTUDY":
        return "Case Studies";
      case "BLOGS":
        return "Blogs";
      case "ACCOUNT_SETTINGS":
        return "Account Settings";
      case "AUTH":
        return "Authentication";
      default:
        return module;
    }
  };
  const getActionDescription = (log) => {
    const { action, module } = log;
    if (action === "LOGIN") return "User logged into the system";
    if (action === "LOGOUT") return "User logged out of the system";
    if (module === "ACCOUNT_SETTINGS") {
      if (action === "CREATED") return "New admin account created";
      if (action === "UPDATED") return log.details?.action === "Password Changed" ? "Admin password changed" : "Admin account details updated";
      if (action === "DELETED") return "Admin account deleted";
    }
    if (module === "CASESTUDY") {
      if (action === "CREATED") return "New case study created";
      if (action === "UPDATED") return "Case study updated";
      if (action === "DELETED") return "Case study deleted";
      if (action === "ARCHIVED") return "Case study archived";
      if (action === "RESTORED") return "Case study restored from archive";
    }
    if (module === "BLOGS") {
      if (action === "CREATED") return "New blog post created";
      if (action === "UPDATED") return "Blog post updated";
      if (action === "DELETED") return "Blog post deleted";
      if (action === "ARCHIVED") return "Blog post archived";
      if (action === "RESTORED") return "Blog post restored from archive";
    }
    return `${formatAction(action)} action performed`;
  };
  const getAdminName = (log) => log.firstName && log.lastName ? `${log.firstName} ${log.lastName}` : log.admin;
  const getTimestamp = (log) => {
    if (log.action === "LOGIN" && log.loggedInAt) return log.loggedInAt;
    if (log.action === "LOGOUT" && log.loggedOutAt) return log.loggedOutAt;
    if (log.action === "CREATED" && log.createdAt) return log.createdAt;
    if (log.action === "UPDATED" && log.updatedAt) return log.updatedAt;
    if (log.action === "DELETED" && log.deletedAt) return log.deletedAt;
    if (log.action === "ARCHIVED" && log.archivedAt) return log.archivedAt;
    if (log.action === "RESTORED" && log.restoredAt) return log.restoredAt;
    return log.createdAt || (/* @__PURE__ */ new Date()).toISOString();
  };
  const getActionBadgeStyle = (action) => {
    const map = {
      CREATED: { bg: "#00A651", color: "#fff" },
      UPDATED: { bg: "#0066CC", color: "#fff" },
      DELETED: { bg: "#8B0000", color: "#fff" },
      ARCHIVED: { bg: "#B45309", color: "#fff" },
      RESTORED: { bg: "#0891B2", color: "#fff" },
      LOGIN: { bg: "#4B0082", color: "#fff" },
      LOGOUT: { bg: "#996633", color: "#fff" }
    };
    const s = map[action] || { bg: "#6b7280", color: "#fff" };
    return { background: s.bg, color: s.color, padding: "3px 12px", borderRadius: 20, fontSize: 10, fontWeight: 500, display: "inline-block", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 };
  };
  const getModuleBadgeStyle = (module) => {
    const map = {
      CASESTUDY: "#505050",
      BLOGS: "#8B0000",
      ACCOUNT_SETTINGS: "#4B0082",
      AUTH: "#505050"
    };
    return { background: map[module] || "#6b7280", color: "#fff", padding: "3px 12px", borderRadius: 20, fontSize: 10, fontWeight: 500, display: "inline-block", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 };
  };
  const toggleModuleFilter = (module) => setfilteredmodules((prev) => prev.includes(module) ? prev.filter((m) => m !== module) : [module]);
  const handlePreviousPage = () => {
    if (currentpage > 1) setcurrentpage((p) => p - 1);
  };
  const handleNextPage = () => {
    if (pagination && currentpage < pagination.totalPages) setcurrentpage((p) => p + 1);
  };
  const statCards = stats ? [
    {
      label: "Total logs",
      value: stats.totalLogs.toLocaleString(),
      subtitle: `${stats.uniqueAdmins} unique admins`,
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>,
      iconColor: "#059669",
      dark: false
    },
    {
      label: "Created",
      value: stats.actionCounts.created,
      subtitle: "New entries added",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>,
      iconColor: "#00A651",
      dark: false
    },
    {
      label: "Updated",
      value: stats.actionCounts.updated,
      subtitle: "Records modified",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>,
      iconColor: "#0066CC",
      dark: false
    },
    {
      label: "Archived",
      value: stats.actionCounts.archived ?? 0,
      subtitle: "Moved to archive",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>,
      iconColor: "#B45309",
      dark: false
    },
    {
      label: "Deleted",
      value: stats.actionCounts.deleted,
      subtitle: "Permanently removed",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>,
      iconColor: "#fff",
      dark: true
    }
  ] : [];
  const inp = (extra = {}) => ({
    padding: "10px 14px",
    borderRadius: 12,
    border: `1.5px solid ${borderColor}`,
    background: inputBg,
    color: textPrimary,
    fontSize: 12,
    fontWeight: 400,
    outline: "none",
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: 0,
    transition: "border-color .15s",
    ...extra
  });
  return <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { font-family: 'Poppins', sans-serif !important; letter-spacing: 0 !important; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        input, textarea, select, option, button { font-family: 'Poppins', sans-serif !important; letter-spacing: 0 !important; }
        input:focus, textarea:focus, select:focus { border-color: #800000 !important; outline: none !important; box-shadow: none !important; }
        .al-row:hover { background: ${isdarkmode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"} !important; }
        .al-pill:hover { opacity: .78; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }

        /* \u2500\u2500 Layout grids \u2500\u2500 */
        .al-stat-grid       { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
        .al-search-row      { display: flex; gap: 10px; align-items: center; flex-wrap: nowrap; }
        .al-filter-controls { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .al-table-wrap      { display: block; }
        .al-mobile-row      { display: none; }
        .al-filter-label    { display: inline; }

        /* \u2500\u2500 Card header \u2500\u2500 */
        .al-card-header       { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; }
        .al-card-header-sub   { display: block; }
        .al-card-header-count { white-space: nowrap; flex-shrink: 0; }

        /* \u2500\u2500 Pagination \u2500\u2500 */
        .al-pagination       { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .al-pagination-btns  { display: flex; align-items: center; gap: 8px; }

        /* \u2500\u2500 Modal \u2500\u2500 */
        .al-modal-pad       { padding: 32px 36px; }
        .al-modal-2col      { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }

        /* \u2500\u2500 1024px breakpoint \u2500\u2500 */
        @media (max-width: 1024px) {
          .al-stat-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* \u2500\u2500 768px breakpoint \u2500\u2500 */
        @media (max-width: 768px) {
          .al-stat-grid       { grid-template-columns: repeat(2, 1fr); }
          .al-search-row      { flex-wrap: wrap; }
          .al-search-input    { flex: 1 1 100% !important; min-width: 0 !important; }
          .al-filter-controls { flex: 1 1 100%; flex-wrap: wrap; gap: 6px; }
          .al-filter-controls > div { flex: 1 1 auto; min-width: 0; }
          .al-filter-controls select { width: 100% !important; }
          .al-filter-label    { display: none; }
          .al-table-wrap      { display: none; }
          .al-mobile-row      { display: flex !important; }
          .al-card-header     { flex-direction: column; align-items: flex-start; gap: 4px; padding: 14px 16px; }
          .al-card-header-sub   { display: none; }
          .al-card-header-count { font-size: 10px !important; }
          .al-pagination      { flex-direction: column; align-items: flex-start; gap: 10px; padding: 12px 16px !important; }
          .al-pagination-btns { flex-wrap: wrap; }
          .al-modal-pad       { padding: 20px 18px; }
          .al-modal-2col      { grid-template-columns: 1fr; }
        }

        /* \u2500\u2500 480px breakpoint \u2500\u2500 */
        @media (max-width: 480px) {
          .al-stat-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: pageBg, padding: "clamp(16px, 4vw, 32px)", fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

          {
    /* â”€â”€ Error toast â”€â”€ */
  }
          {error && <div style={{ position: "fixed", top: 28, right: 28, background: "#dc2626", color: "#fff", padding: "14px 24px", borderRadius: 20, fontSize: 12, fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.22)", zIndex: 50, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
              {error}
            </div>}

          {
    /* â”€â”€ Header â”€â”€ */
  }
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
              Activity Logs
            </h2>
            <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
              Monitor and track all system activities, admin actions, and user interactions in real-time.
            </p>
          </div>

          {
    /* â”€â”€ Stat Cards â”€â”€ */
  }
          {stats && <div className="al-stat-grid">
              {statCards.map((card, i) => {
    const darkGradients = [
      `radial-gradient(circle at 85% 15%, rgba(5,150,105,0.45) 0%, transparent 55%), radial-gradient(circle at 10% 90%, rgba(5,150,105,0.2) 0%, transparent 45%)`,
      `radial-gradient(circle at 80% 20%, rgba(0,166,81,0.5) 0%, transparent 55%), radial-gradient(circle at 15% 85%, rgba(0,166,81,0.2) 0%, transparent 45%)`,
      `radial-gradient(circle at 90% 10%, rgba(0,102,204,0.5) 0%, transparent 50%), radial-gradient(circle at 5% 80%, rgba(0,102,204,0.22) 0%, transparent 40%)`,
      `radial-gradient(circle at 85% 20%, rgba(180,83,9,0.5) 0%, transparent 55%), radial-gradient(circle at 10% 85%, rgba(180,83,9,0.2) 0%, transparent 45%)`,
      `radial-gradient(circle at 80% 15%, rgba(139,0,0,0.6) 0%, transparent 55%), radial-gradient(circle at 10% 90%, rgba(139,0,0,0.3) 0%, transparent 45%)`
    ];
    const lightGradients = [
      `radial-gradient(circle at 85% 15%, rgba(5,150,105,0.18) 0%, transparent 55%), radial-gradient(circle at 10% 90%, rgba(5,150,105,0.09) 0%, transparent 45%)`,
      `radial-gradient(circle at 80% 20%, rgba(0,166,81,0.18) 0%, transparent 55%), radial-gradient(circle at 15% 85%, rgba(0,166,81,0.09) 0%, transparent 45%)`,
      `radial-gradient(circle at 90% 10%, rgba(0,102,204,0.18) 0%, transparent 50%), radial-gradient(circle at 5% 80%, rgba(0,102,204,0.09) 0%, transparent 40%)`,
      `radial-gradient(circle at 85% 20%, rgba(180,83,9,0.18) 0%, transparent 55%), radial-gradient(circle at 10% 85%, rgba(180,83,9,0.09) 0%, transparent 45%)`,
      `radial-gradient(circle at 80% 15%, rgba(139,0,0,0.18) 0%, transparent 55%), radial-gradient(circle at 10% 90%, rgba(139,0,0,0.09) 0%, transparent 45%)`
    ];
    const gradient = isdarkmode ? darkGradients[i] : lightGradients[i];
    const baseBg = card.dark ? isdarkmode ? "#2d1f1f" : "#2d1f1f" : cardBg;
    return <div key={i} style={{
      padding: "20px 22px",
      borderRadius: 20,
      border: `1px solid ${card.dark ? "rgba(139,0,0,0.3)" : borderColor}`,
      background: `${gradient}, ${baseBg}`,
      boxShadow: isdarkmode ? "none" : "0 2px 12px rgba(0,0,0,0.05)",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      gap: 0
    }}>
                  {
      /* Decorative rings */
    }
                  <div style={{ position: "absolute", top: -18, right: -18, width: 80, height: 80, borderRadius: "50%", border: `1.5px solid ${card.iconColor}`, opacity: 0.15, pointerEvents: "none" }} />
                  <div style={{ position: "absolute", top: -30, right: -30, width: 110, height: 110, borderRadius: "50%", border: `1px solid ${card.iconColor}`, opacity: 0.08, pointerEvents: "none" }} />
                  {
      /* Label + Icon row */
    }
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, position: "relative" }}>
                    <p style={{ fontSize: 11, fontWeight: 500, color: card.dark ? "rgba(255,255,255,0.7)" : textMuted, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                      {card.label}
                    </p>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: card.dark ? "rgba(255,255,255,0.15)" : `${card.iconColor}18`, display: "flex", alignItems: "center", justifyContent: "center", color: card.dark ? "#fff" : card.iconColor, flexShrink: 0 }}>
                      {card.icon}
                    </div>
                  </div>
                  {
      /* Number */
    }
                  <p style={{ fontSize: 36, fontWeight: 700, color: card.dark ? "#ffffff" : textPrimary, margin: "0 0 6px", lineHeight: 1, fontFamily: "'Poppins', sans-serif", letterSpacing: 0, position: "relative" }}>
                    {card.value}
                  </p>
                  {
      /* Subtitle */
    }
                  <p style={{ fontSize: 11, fontWeight: 400, color: card.dark ? "rgba(255,255,255,0.6)" : textMuted, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0, position: "relative" }}>
                    {card.subtitle}
                  </p>
                </div>;
  })}
            </div>}

          {
    /* â”€â”€ Filters â”€â”€ */
  }
          <div style={{ background: "transparent", border: "none", borderRadius: 24, padding: "0", boxShadow: "none" }}>
            <div className="al-search-row">

              {
    /* Search */
  }
              <div className="al-search-input" style={{ flex: 1, minWidth: 200, position: "relative" }}>
                <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: textMuted, pointerEvents: "none" }} width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
    type="text"
    placeholder="Search by admin email..."
    value={searchquery}
    onChange={(e) => setsearchquery(e.target.value)}
    style={{ ...inp({ paddingLeft: 36, width: "100%" }) }}
  />
              </div>

              {
    /* Filter controls */
  }
              <div className="al-filter-controls" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

                {
    /* Filter by Action dropdown */
  }
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="al-filter-label" style={{ fontSize: 11, color: textMuted, whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Action</span>
                  <select
    value={activetab}
    onChange={(e) => setactivetab(e.target.value)}
    style={inp({ width: "auto", padding: "10px 12px", fontSize: 11, cursor: "pointer" })}
  >
                    {actionTypes.map((a) => <option key={a} value={a}>{a === "All" ? "All Actions" : a}</option>)}
                  </select>
                </div>

                {
    /* Filter by Module dropdown */
  }
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="al-filter-label" style={{ fontSize: 11, color: textMuted, whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Module</span>
                  <select
    value={filteredmodules[0] || ""}
    onChange={(e) => {
      const val = e.target.value;
      setfilteredmodules(val ? [val] : []);
    }}
    style={inp({ width: "auto", padding: "10px 12px", fontSize: 11, cursor: "pointer" })}
  >
                    <option value="">All Modules</option>
                    {availableModules.map((m) => <option key={m} value={m}>{formatModuleName(m)}</option>)}
                  </select>
                </div>

                {
    /* Sort by dropdown */
  }
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="al-filter-label" style={{ fontSize: 11, color: textMuted, whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Sort by</span>
                  <select value={sortby} onChange={(e) => setsortby(e.target.value)} style={inp({ width: "auto", padding: "10px 12px", fontSize: 11, cursor: "pointer" })}>
                    <option value="Newest">Newest First</option>
                    <option value="Oldest">Oldest First</option>
                  </select>
                </div>

              </div>
            </div>
          </div>

          {
    /* â”€â”€ Table card â”€â”€ */
  }
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: "hidden", boxShadow: isdarkmode ? "none" : "0 2px 12px rgba(0,0,0,0.05)" }}>

            {
    /* Card header */
  }
            <div className="al-card-header" style={{ borderBottom: `1px solid ${borderColor}` }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Activity log records</p>
                <p className="al-card-header-sub" style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>All admin actions and system events</p>
              </div>
              {pagination && <span className="al-card-header-count" style={{ fontSize: 11, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                  Showing <strong style={{ color: textPrimary, fontFamily: "'Poppins', sans-serif" }}>{(pagination.page - 1) * pagination.limit + 1}</strong> to <strong style={{ color: textPrimary, fontFamily: "'Poppins', sans-serif" }}>{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> of <strong style={{ color: textPrimary, fontFamily: "'Poppins', sans-serif" }}>{pagination.total}</strong> results
                </span>}
            </div>

            {
    /* Loading */
  }
            {isloading && <div style={{ padding: "80px 20px", textAlign: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", border: "4px solid #800000", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 16px", display: "inline-block" }} />
                <p style={{ fontSize: 12, color: textMuted, fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Loading activity logs...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              </div>}

            {
    /* Empty */
  }
            {!isloading && logs.length === 0 && <div style={{ padding: "72px 20px", textAlign: "center" }}>
                <svg style={{ margin: "0 auto 16px", display: "block", color: isdarkmode ? "#374151" : "#d1d5db" }} width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p style={{ fontSize: 14, fontWeight: 500, color: textMuted, margin: "0 0 4px", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>No activity logs found</p>
                <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Try adjusting your filters or search query</p>
              </div>}

            {
    /* Table */
  }
            {!isloading && logs.length > 0 && <>
                {
    /* Desktop table */
  }
                <div className="al-table-wrap">
                  {
    /* Table header row */
  }
                  <div style={{ display: "grid", gridTemplateColumns: "140px 160px 1fr 1fr 140px", gap: 16, padding: "11px 24px", background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
                    {["Action", "Module", "Admin", "Timestamp", "Details"].map((col, i) => <span key={col} style={{ fontSize: 10, fontWeight: 500, color: textMuted, textAlign: i === 4 ? "right" : "left", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                        {col}
                      </span>)}
                  </div>

                  {
    /* Table rows */
  }
                  {logs.map((log, i) => <div
    key={log._id}
    className="al-row"
    style={{ display: "grid", gridTemplateColumns: "140px 160px 1fr 1fr 140px", gap: 16, alignItems: "center", padding: "14px 24px", borderBottom: i < logs.length - 1 ? `1px solid ${borderColor}` : "none", transition: "background .15s" }}
  >
                      <div><span style={getActionBadgeStyle(log.action)}>{formatAction(log.action)}</span></div>
                      <div><span style={getModuleBadgeStyle(log.module)}>{formatModuleName(log.module)}</span></div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{getAdminName(log)}</p>
                        <p style={{ fontSize: 11, color: textMuted, margin: "2px 0 0", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{log.admin}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{new Date(getTimestamp(log)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                        <p style={{ fontSize: 11, color: textMuted, margin: "2px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{new Date(getTimestamp(log)).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={() => {
    setselectedlog(log);
    setshowdetailsmodal(true);
  }} style={{ padding: "6px 14px", borderRadius: 10, border: `1px solid ${borderColor}`, background: isdarkmode ? "rgba(255,255,255,0.06)" : "#f9fafb", color: textMuted, fontSize: 11, fontWeight: 500, cursor: "pointer", transition: "all .15s", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>View Details</button>
                      </div>
                    </div>)}
                </div>

                {
    /* Mobile card rows */
  }
                {logs.map((log, i) => <div
    key={`mob-${log._id}`}
    className="al-mobile-row"
    style={{ flexDirection: "column", padding: "14px 16px", borderBottom: i < logs.length - 1 ? `1px solid ${borderColor}` : "none", gap: 10 }}
  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <span style={getActionBadgeStyle(log.action)}>{formatAction(log.action)}</span>
                        <span style={getModuleBadgeStyle(log.module)}>{formatModuleName(log.module)}</span>
                      </div>
                      <p style={{ fontSize: 10, color: textMuted, margin: 0, whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{new Date(getTimestamp(log)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{getAdminName(log)}</p>
                        <p style={{ fontSize: 11, color: textMuted, margin: "2px 0 0", fontFamily: "'Poppins', sans-serif" }}>{log.admin}</p>
                      </div>
                      <button onClick={() => {
    setselectedlog(log);
    setshowdetailsmodal(true);
  }} style={{ padding: "6px 12px", borderRadius: 10, border: `1px solid ${borderColor}`, background: isdarkmode ? "rgba(255,255,255,0.06)" : "#f9fafb", color: textMuted, fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif", whiteSpace: "nowrap" }}>View</button>
                    </div>
                  </div>)}

                {
    /* Pagination footer */
  }
                <div className="al-pagination" style={{ padding: "14px 24px", background: subtleBg, borderTop: `1px solid ${borderColor}` }}>
                  <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                    Page <strong style={{ color: textPrimary, fontFamily: "'Poppins', sans-serif" }}>{pagination?.page}</strong> of <strong style={{ color: textPrimary, fontFamily: "'Poppins', sans-serif" }}>{pagination?.totalPages}</strong>
                  </p>
                  <div className="al-pagination-btns">
                    <button
    onClick={handlePreviousPage}
    disabled={currentpage === 1}
    style={{ padding: "7px 16px", borderRadius: 10, border: `1px solid ${borderColor}`, background: currentpage === 1 ? "transparent" : subtleBg, color: currentpage === 1 ? textMuted : textPrimary, fontSize: 11, fontWeight: 500, cursor: currentpage === 1 ? "not-allowed" : "pointer", opacity: currentpage === 1 ? 0.4 : 1, transition: "all .15s", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}
  >
                      Previous
                    </button>
                    {pagination && Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, idx) => idx + 1).map((pg) => <button
    key={pg}
    onClick={() => setcurrentpage(pg)}
    style={{ width: 32, height: 32, borderRadius: 8, border: pg === currentpage ? "none" : `1px solid ${borderColor}`, background: pg === currentpage ? "#800000" : subtleBg, color: pg === currentpage ? "#fff" : textMuted, fontSize: 11, fontWeight: pg === currentpage ? 600 : 400, cursor: "pointer", transition: "all .15s", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}
  >
                        {pg}
                      </button>)}
                    <button
    onClick={handleNextPage}
    disabled={!pagination || currentpage === pagination.totalPages}
    style={{ padding: "7px 16px", borderRadius: 10, border: `1px solid ${borderColor}`, background: !pagination || currentpage === pagination.totalPages ? "transparent" : subtleBg, color: !pagination || currentpage === pagination.totalPages ? textMuted : textPrimary, fontSize: 11, fontWeight: 500, cursor: !pagination || currentpage === pagination.totalPages ? "not-allowed" : "pointer", opacity: !pagination || currentpage === pagination.totalPages ? 0.4 : 1, transition: "all .15s", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}
  >
                      Next
                    </button>
                  </div>
                </div>
              </>}
          </div>

        </div>
      </div>

      {
    /* â”€â”€ Details Modal â”€â”€ */
  }
      {showdetailsmodal && selectedlog && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16, overflowY: "auto" }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 32, width: "100%", maxWidth: 680, boxShadow: "0 32px 80px rgba(0,0,0,0.32)", fontFamily: "'Poppins', sans-serif", margin: "auto" }}>
            <div className="al-modal-pad">

              {
    /* Modal header */
  }
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Activity Details</h3>
                  <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Complete information about this activity log</p>
                </div>
                <button onClick={() => setshowdetailsmodal(false)} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: subtleBg, color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {
    /* Badges */
  }
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                <span style={getActionBadgeStyle(selectedlog.action)}>{formatAction(selectedlog.action)}</span>
                <span style={getModuleBadgeStyle(selectedlog.module)}>{formatModuleName(selectedlog.module)}</span>
              </div>

              {
    /* Main info card */
  }
              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, padding: "20px", marginBottom: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 6px", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>PERFORMED BY</p>
                    <p style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0, wordBreak: "break-word" }}>{getAdminName(selectedlog)}</p>
                    <p style={{ fontSize: 12, color: textMuted, margin: "3px 0 0", fontFamily: "'Poppins', sans-serif", letterSpacing: 0, wordBreak: "break-all" }}>{selectedlog.admin}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 6px", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>TIMESTAMP</p>
                    <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0, lineHeight: 1.5 }}>
                      {new Date(getTimestamp(selectedlog)).toLocaleString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </p>
                  </div>
                  {selectedlog.description && <div>
                      <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 6px", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>DESCRIPTION</p>
                      <p style={{ fontSize: 12, fontWeight: 400, color: textPrimary, margin: 0, lineHeight: 1.6, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{selectedlog.description}</p>
                    </div>}
                </div>
              </div>

              {
    /* Two-col cards */
  }
              <div className="al-modal-2col">
                <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: "16px 18px" }}>
                  <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 6px", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>ACTION TYPE</p>
                  <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{getActionDescription(selectedlog)}</p>
                </div>
                <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: "16px 18px" }}>
                  <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 6px", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>MODULE</p>
                  <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{formatModuleName(selectedlog.module)}</p>
                </div>
              </div>

              {
    /* Footer */
  }
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 20, borderTop: `1px solid ${borderColor}` }}>
                <button
    onClick={() => setshowdetailsmodal(false)}
    style={{ padding: "11px 32px", borderRadius: 14, border: "none", background: "#800000", color: "#fff", fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all .15s", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}
  >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>}
    </>;
}
export {
  ActivityLogs as default
};
