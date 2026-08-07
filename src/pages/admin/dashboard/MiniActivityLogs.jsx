
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
const ACTION_COLORS = {
  CREATED: "#00A651",
  UPDATED: "#0066CC",
  DELETED: "#8B0000",
  ARCHIVED: "#B45309",
  RESTORED: "#0891B2",
  LOGIN: "#4B0082",
  LOGOUT: "#996633"
};
const ACTION_ICONS = {
  LOGIN: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>,
  LOGOUT: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>,
  CREATED: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>,
  UPDATED: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>,
  DELETED: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>,
  ARCHIVED: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>,
  RESTORED: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
};
function MiniActivityLogs({
  isdarkmode,
  onUnreadCountChange,
  onClose
}) {
  const [logs, setlogs] = useState([]);
  const [isloading, setisloading] = useState(false);
  const cardBg = "var(--admin-surface)";
  const subtleBg = "var(--admin-bg-soft)";
  const borderColor = "var(--admin-border)";
  const textPrimary = "var(--admin-text)";
  const textMuted = "var(--admin-text-faint)";
  const fetchRecentLogs = useCallback(async () => {
    try {
      setisloading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      const response = await fetch(`${apiUrl}/activity-logs?limit=10&order=desc`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error("Failed to fetch activity logs");
      const data = await response.json();
      setlogs(data.logs || []);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
    } finally {
      setisloading(false);
    }
  }, []);
  const markAllAsRead = useCallback(async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      await fetch(`${apiUrl}/activity-logs/mark-as-read`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      if (onUnreadCountChange) onUnreadCountChange(0);
    } catch (err) {
      console.error("Error marking logs as read:", err);
    }
  }, [onUnreadCountChange]);
  useEffect(() => {
    fetchRecentLogs();
    markAllAsRead();
  }, [fetchRecentLogs, markAllAsRead]);
  const formatAction = (action) => action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
  const formatModuleName = (module) => {
    const map = {
      CASESTUDY: "Case Studies",
      BLOGS: "Blogs",
      ACCOUNT_SETTINGS: "Account Settings",
      AUTH: "Authentication",
      SERVICES: "Services"
    };
    return map[module] || module;
  };
  const getTimestamp = (log) => {
    switch (log.action) {
      case "LOGIN":
        return log.loggedInAt || log.createdAt || "";
      case "LOGOUT":
        return log.loggedOutAt || log.createdAt || "";
      case "CREATED":
        return log.createdAt || "";
      case "UPDATED":
        return log.updatedAt || "";
      case "DELETED":
        return log.deletedAt || "";
      case "ARCHIVED":
        return log.deletedAt || log.updatedAt || log.createdAt || "";
      case "RESTORED":
        return log.restoredAt || log.updatedAt || log.createdAt || "";
      default:
        return log.createdAt || log.updatedAt || "";
    }
  };
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "N/A";
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 6e4);
    const hours = Math.floor(diff / 36e5);
    const days = Math.floor(diff / 864e5);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const getContentTitle = (log) => {
    if (!log.details) return "";
    if (log.module === "BLOGS" || log.module === "CASESTUDY") {
      if (log.action === "UPDATED") {
        return log.details.newData?.title || log.details.oldData?.title || log.details.title || "";
      }
      return log.details.title || log.details.slug || log.details.caseStudyId || "";
    }
    return "";
  };
  const getActionDescription = (log) => {
    if (log.action === "LOGIN") return "Logged in";
    if (log.action === "LOGOUT") return "Logged out";
    return `${formatAction(log.action)} ${formatModuleName(log.module).toLowerCase()}`;
  };
  const getAdminName = (email) => {
    const localPart = email.split("@")[0];
    return localPart.split(".").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };
  const getActionBadgeStyle = (action) => ({
    background: ACTION_COLORS[action] || "#6b7280",
    color: "#fff",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 500,
    display: "inline-block",
    whiteSpace: "nowrap",
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: 0,
    flexShrink: 0
  });
  return <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        *, *::before, *::after {
          font-family: 'Poppins', sans-serif !important;
          letter-spacing: 0 !important;
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
        }
        button, a { font-family: 'Poppins', sans-serif !important; letter-spacing: 0 !important; }
        .mal-row:hover  { background: ${"var(--admin-bg-soft)"} !important; }
        .mal-foot:hover { background: ${"var(--admin-bg-hover)"} !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>

      {
    /* ── Single card — this is the ONLY container ── */
  }
      <div
    style={{
      width: 360,
      background: cardBg,
      border: `1px solid ${borderColor}`,
      borderRadius: 24,
      overflow: "hidden",
      boxShadow: "var(--admin-shadow-lg)",
      fontFamily: "'Poppins', sans-serif"
    }}
  >

        {
    /* ══ Header ══ */
  }
        <div
    style={{
      padding: "18px 24px",
      borderBottom: `1px solid ${borderColor}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}
  >
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0 }}>
              Activity Logs
            </p>
            <p style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontWeight: 400 }}>
              Recent admin activities
            </p>
          </div>

          <button
    onClick={fetchRecentLogs}
    disabled={isloading}
    aria-label="Refresh activity logs"
    style={{
      width: 30,
      height: 30,
      borderRadius: 8,
      border: `1px solid ${borderColor}`,
      background: subtleBg,
      color: textMuted,
      cursor: isloading ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all .15s",
      flexShrink: 0,
      opacity: isloading ? 0.6 : 1
    }}
  >
            <svg
    width="12"
    height="12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
    style={{ animation: isloading ? "spin .8s linear infinite" : "none" }}
  >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {
    /* ══ Column headers ══ */
  }
        <div
    style={{
      display: "grid",
      gridTemplateColumns: "26px 1fr 72px",
      gap: 10,
      padding: "9px 24px",
      background: subtleBg,
      borderBottom: `1px solid ${borderColor}`
    }}
  >
          <span style={{ fontSize: 10, fontWeight: 500, color: textMuted }} />
          <span style={{ fontSize: 10, fontWeight: 500, color: textMuted }}>Admin</span>
          <span style={{ fontSize: 10, fontWeight: 500, color: textMuted, textAlign: "right" }}>Time</span>
        </div>

        {
    /* ══ Loading ══ */
  }
        {isloading && <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <div
    style={{
      width: 36,
      height: 36,
      borderRadius: "50%",
      border: "3px solid var(--admin-accent)",
      borderTopColor: "transparent",
      animation: "spin 0.8s linear infinite",
      margin: "0 auto 12px",
      display: "inline-block"
    }}
  />
            <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0 }}>
              Loading activities...
            </p>
          </div>}

        {
    /* ══ Empty state ══ */
  }
        {!isloading && logs.length === 0 && <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <svg
    style={{ margin: "0 auto 12px", display: "block", color: "var(--admin-border-strong)" }}
    width="40"
    height="40"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p style={{ fontSize: 12, fontWeight: 500, color: textMuted, margin: 0 }}>
              No recent activities
            </p>
          </div>}

        {
    /* ══ Log rows ══ */
  }
        {!isloading && logs.length > 0 && <div style={{ maxHeight: 380, overflowY: "auto" }}>
            {logs.map((log, i) => {
    const actionColor = ACTION_COLORS[log.action] || "#6b7280";
    const ts = getTimestamp(log);
    const title = getContentTitle(log);
    return <div
      key={log._id}
      className="mal-row"
      style={{
        display: "grid",
        gridTemplateColumns: "26px 1fr 72px",
        gap: 10,
        alignItems: "center",
        padding: "12px 24px",
        borderBottom: i < logs.length - 1 ? `1px solid ${borderColor}` : "none",
        transition: "background .15s",
        cursor: "default"
      }}
    >
                  {
      /* Icon */
    }
                  <div
      style={{
        width: 26,
        height: 26,
        borderRadius: 7,
        flexShrink: 0,
        background: `${actionColor}18`,
        border: `1px solid ${actionColor}28`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: actionColor
      }}
    >
                    {ACTION_ICONS[log.action] ?? ACTION_ICONS["CREATED"]}
                  </div>

                  {
      /* Info */
    }
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, overflow: "hidden" }}>
                      <p
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: textPrimary,
        margin: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        flexShrink: 1,
        minWidth: 0
      }}
    >
                        {getActionDescription(log)}
                      </p>
                      <span style={getActionBadgeStyle(log.action)}>
                        {formatAction(log.action)}
                      </span>
                    </div>

                    {title !== "" && <p
      style={{
        fontSize: 10,
        color: textMuted,
        margin: "0 0 2px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontWeight: 400
      }}
    >
                        {title}
                      </p>}

                    <p
      style={{
        fontSize: 11,
        color: textMuted,
        margin: 0,
        fontWeight: 400,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }}
    >
                      {getAdminName(log.admin)}
                    </p>
                  </div>

                  {
      /* Time */
    }
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <p style={{ fontSize: 10, color: textMuted, margin: 0, fontWeight: 400, whiteSpace: "nowrap" }}>
                      {getTimeAgo(ts)}
                    </p>
                  </div>
                </div>;
  })}
          </div>}

        {
    /* ══ Footer ══ */
  }
        <div
    style={{
      padding: "14px 20px",
      background: subtleBg,
      borderTop: `1px solid ${borderColor}`
    }}
  >
          <Link
    href="/admin/dashboard/ActivityLogs"
    onClick={onClose}
    className="mal-foot"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      width: "100%",
      padding: "9px 0",
      borderRadius: 12,
      border: `1px solid ${borderColor}`,
      background: "transparent",
      color: textMuted,
      fontSize: 11,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all .15s",
      textDecoration: "none"
    }}
  >
            View All Activity Logs
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </>;
}
export {
  MiniActivityLogs as default
};
