import { useState, useEffect, useMemo, useCallback } from "react";
import { Spinner } from "@/components/DashboardLoader";
import api from "@/lib/api/axios";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
const F = "'DM Sans', 'Outfit', 'system-ui', sans-serif";
const F_MONO = "'JetBrains Mono', 'Fira Code', monospace";
const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#818CF8",
  primaryMuted: "#EEF2FF",
  success: "#059669",
  successBg: "#ECFDF5",
  warning: "#D97706",
  warningBg: "#FFFBEB",
  danger: "#DC2626",
  dangerBg: "#FEF2F2",
  teal: "#0D9488",
  violet: "#7C3AED",
  amber: "#F59E0B",
  chart1: "#4F46E5",
  chart2: "#0D9488",
  chart3: "#7C3AED",
  chart4: "#F59E0B",
  chart5: "#EC4899"
};
const TT = {
  background: "#0F172A",
  border: "none",
  borderRadius: 10,
  fontSize: 12,
  color: "#F8FAFC",
  padding: "10px 14px",
  fontFamily: F,
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
};
const PAGE_SECTIONS = ["All Pages", "Package Deals", "Booking", "Flights", "Services", "Tours"];
const stageStyles = {
  Awareness: { bg: "#F5F3FF", text: "#6D28D9", border: "#DDD6FE" },
  Consideration: { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  Decision: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  Converted: { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" }
};
const IconRefresh = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
    <path d="M23 4v6h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1 20v-6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const IconUsers = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>;
const IconTarget = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>;
const IconClock = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>;
const IconActivity = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
function MetricCard({ label, value, change, sub, icon }) {
  const up = change >= 0;
  return <div
    style={{
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 16,
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
      transition: "box-shadow 0.2s ease, transform 0.2s ease"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = "0 8px 25px rgba(79,70,229,0.08)";
      e.currentTarget.style.transform = "translateY(-1px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: "radial-gradient(circle at 80% 20%, rgba(79,70,229,0.05) 0%, transparent 70%)", borderRadius: 16 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: F }}>{label}</span>
        {icon && <div style={{ width: 32, height: 32, borderRadius: 10, background: COLORS.primaryMuted, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.primary, flexShrink: 0 }}>
            {icon}
          </div>}
      </div>
      <div>
        <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, fontFamily: F, letterSpacing: "-1px", color: "#0F172A" }}>{value}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{
    fontSize: 11,
    fontWeight: 600,
    color: up ? COLORS.success : COLORS.danger,
    background: up ? COLORS.successBg : COLORS.dangerBg,
    padding: "3px 8px",
    borderRadius: 99,
    fontFamily: F,
    display: "flex",
    alignItems: "center",
    gap: 3
  }}>
          {up ? "\u2191" : "\u2193"} {Math.abs(change)}%
        </span>
        {sub && <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: F }}>{sub}</span>}
      </div>
    </div>;
}
function Card({ children, style }) {
  return <div style={{
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: 16,
    padding: "22px 24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    ...style
  }}>
      {children}
    </div>;
}
const MOCK_VISITORS = [
  { id: "V-F0CE1E", lastSeen: "1h ago", visits: 37, pages: 4, stage: null, initials: "1E", color: "#6366F1", device: "Desktop", source: "Organic Search", duration: "12m 45s" },
  { id: "V-E7A61E", lastSeen: "2h ago", visits: 2, pages: 2, stage: null, initials: "1E", color: "#6366F1", device: "Mobile", source: "Direct", duration: "3m 20s" },
  { id: "V-78CD42", lastSeen: "2h ago", visits: 2, pages: 2, stage: "Consideration", initials: "42", color: "#F59E0B", device: "Desktop", source: "Social Media", duration: "5m 12s" },
  { id: "V-E6AA5B", lastSeen: "2h ago", visits: 2, pages: 2, stage: "Consideration", initials: "5B", color: "#F59E0B", device: "Tablet", source: "Referral", duration: "8m 55s" },
  { id: "V-24CDBB", lastSeen: "3h ago", visits: 2, pages: 2, stage: "Consideration", initials: "BB", color: "#F59E0B", device: "Mobile", source: "Organic Search", duration: "2m 10s" },
  { id: "V-A91F3C", lastSeen: "4h ago", visits: 5, pages: 7, stage: "Decision", initials: "3C", color: "#10B981", device: "Desktop", source: "Direct", duration: "15m 30s" },
  { id: "V-B3DE22", lastSeen: "5h ago", visits: 12, pages: 15, stage: "Converted", initials: "22", color: "#3B82F6", device: "Desktop", source: "Organic Search", duration: "24m 18s" },
  { id: "V-CC0012", lastSeen: "6h ago", visits: 1, pages: 1, stage: "Awareness", initials: "12", color: "#8B5CF6", device: "Mobile", source: "Social Media", duration: "1m 45s" }
];
function VisitorJourneyTracker({ range }) {
  const [search, setSearch] = useState("");
  const [pageFilter, setPageFilter] = useState("All Pages");
  const [showDropdown, setShowDropdown] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [visitors, setVisitors] = useState(MOCK_VISITORS);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(/* @__PURE__ */ new Date());
  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/dashboard/page-views/visitors", { params: { range } });
      setVisitors(res.data.visitors.length > 0 ? res.data.visitors : MOCK_VISITORS);
      setLastUpdated(/* @__PURE__ */ new Date());
    } catch {
    } finally {
      setLoading(false);
    }
  }, [range]);
  useEffect(() => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const data = Array.from({ length: days }, (_, i) => {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        activeVisitors: Math.floor(Math.random() * 50 + 20)
        // mock active visitors
      };
    });
    setChartData(data);
  }, [range]);
  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);
  const filtered = useMemo(() => {
    let list = visitors;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((v) => v.id.toLowerCase().includes(q) || (v.email ?? "").toLowerCase().includes(q));
    }
    return list;
  }, [search, visitors]);
  const displayed = showAll ? filtered : filtered.slice(0, 5);
  const hidden = filtered.length - 5;
  const timeStr = lastUpdated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const deviceData = useMemo(() => {
    const counts = visitors.reduce((acc, v) => {
      const d = v.device || "Desktop";
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [visitors]);
  return <Card>
      {
    /* Header */
  }
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #4F46E5, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, margin: 0, fontFamily: F, color: "#0F172A", letterSpacing: "-0.3px" }}>Visitor Journey Tracker</p>
            <p style={{ fontSize: 12, color: "#94A3B8", margin: "3px 0 0", fontFamily: F }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block", boxShadow: "0 0 0 2px rgba(16,185,129,0.2)" }} />
                {filtered.length} unique visitors tracked
              </span>
              <span style={{ color: "#CBD5E1", margin: "0 6px" }}>·</span>
              Updated {timeStr}
            </p>
          </div>
        </div>
        <button
    onClick={() => fetchVisitors()}
    disabled={loading}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "8px 14px",
      fontSize: 12,
      fontWeight: 500,
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 10,
      color: loading ? "#94A3B8" : "#475569",
      cursor: loading ? "not-allowed" : "pointer",
      fontFamily: F,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      transition: "all 0.15s",
      opacity: loading ? 0.6 : 1
    }}
    onMouseEnter={(e) => {
      if (!loading) {
        e.currentTarget.style.borderColor = "#4F46E5";
        e.currentTarget.style.color = "#4F46E5";
      }
    }}
    onMouseLeave={(e) => {
      if (!loading) {
        e.currentTarget.style.borderColor = "#E2E8F0";
        e.currentTarget.style.color = "#475569";
      }
    }}
  >
          {loading ? <Spinner size={14} /> : <IconRefresh />}
          {loading ? "Refreshing\u2026" : "Refresh"}
        </button>
      </div>

      {
    /* Analytics Charts */
  }
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", margin: 0, fontFamily: F }}>Active Visitors</h3>
              <p style={{ fontSize: 12, color: "#64748B", margin: "4px 0 0", fontFamily: F }}>Daily unique visitors tracked across your funnels and pages</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: F }} axisLine={false} tickLine={false} dy={5} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: F }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} labelStyle={{ fontWeight: 600, marginBottom: 4, color: "#F8FAFC" }} formatter={(val) => [val, "Visitors"]} />
              <Area type="monotone" dataKey="activeVisitors" stroke={COLORS.primary} strokeWidth={2} fillOpacity={1} fill="url(#vGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 12, fontFamily: F }}>Device Breakdown</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <PieChart width={120} height={120}>
              <Pie data={deviceData} cx={56} cy={56} innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={2} stroke="#FFFFFF">
                <Cell fill={COLORS.chart1} />
                <Cell fill={COLORS.chart3} />
                <Cell fill={COLORS.chart2} />
              </Pie>
            </PieChart>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {deviceData.map((d, i) => <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: [COLORS.chart1, COLORS.chart3, COLORS.chart2][i % 3] }} />
                  <span style={{ fontSize: 11, color: "#64748B", fontFamily: F }}>{d.name}</span>
                </div>)}
            </div>
          </div>
        </div>
      </div>

      {
    /* Search + Filter */
  }
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search by email or visitor ID..."
    style={{
      width: "100%",
      paddingLeft: 36,
      paddingRight: 14,
      paddingTop: 10,
      paddingBottom: 10,
      fontSize: 13,
      fontFamily: F,
      border: "1px solid #E2E8F0",
      borderRadius: 10,
      background: "#F8FAFC",
      color: "#0F172A",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.15s"
    }}
    onFocus={(e) => {
      e.target.style.borderColor = "#4F46E5";
      e.target.style.background = "#FFFFFF";
    }}
    onBlur={(e) => {
      e.target.style.borderColor = "#E2E8F0";
      e.target.style.background = "#F8FAFC";
    }}
  />
        </div>

        {
    /* Dropdown */
  }
        <div style={{ position: "relative" }}>
          <button
    onClick={() => setShowDropdown((p) => !p)}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 14px",
      fontSize: 13,
      fontWeight: 500,
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 10,
      color: "#0F172A",
      cursor: "pointer",
      fontFamily: F,
      minWidth: 140,
      justifyContent: "space-between",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      borderColor: showDropdown ? "#4F46E5" : "#E2E8F0",
      transition: "border-color 0.15s"
    }}
  >
            <span>{pageFilter}</span>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" style={{ color: "#94A3B8", transform: showDropdown ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {showDropdown && <div style={{
    position: "absolute",
    top: "calc(100% + 6px)",
    right: 0,
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: 12,
    boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
    zIndex: 100,
    overflow: "hidden",
    minWidth: 160,
    padding: 6
  }}>
              {PAGE_SECTIONS.map((sec) => <button
    key={sec}
    onClick={() => {
      setPageFilter(sec);
      setShowDropdown(false);
    }}
    style={{
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: "9px 14px",
      fontSize: 13,
      fontFamily: F,
      background: pageFilter === sec ? COLORS.primaryMuted : "transparent",
      color: pageFilter === sec ? COLORS.primary : "#374151",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: pageFilter === sec ? 600 : 400,
      transition: "background 0.1s"
    }}
    onMouseEnter={(e) => {
      if (pageFilter !== sec) e.currentTarget.style.background = "#F8FAFC";
    }}
    onMouseLeave={(e) => {
      if (pageFilter !== sec) e.currentTarget.style.background = "transparent";
    }}
  >
                  {sec}
                </button>)}
            </div>}
        </div>
      </div>

      {
    /* Visitor List */
  }
      <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
        {displayed.map((visitor, i) => {
    const isExpanded = expanded === visitor.id;
    const stageStyle = visitor.stage ? stageStyles[visitor.stage] : null;
    return <div key={visitor.id}>
              <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        background: isExpanded ? "#FAFBFF" : "#FFFFFF",
        borderBottom: i < displayed.length - 1 ? "1px solid #F1F5F9" : "none",
        cursor: "pointer",
        transition: "background 0.1s"
      }}
      onClick={() => setExpanded(isExpanded ? null : visitor.id)}
      onMouseEnter={(e) => {
        if (!isExpanded) e.currentTarget.style.background = "#F8FAFC";
      }}
      onMouseLeave={(e) => {
        if (!isExpanded) e.currentTarget.style.background = "#FFFFFF";
      }}
    >
                {
      /* Avatar */
    }
                <div style={{
      width: 40,
      height: 40,
      borderRadius: 12,
      background: `linear-gradient(135deg, ${visitor.color}20, ${visitor.color}40)`,
      border: `1.5px solid ${visitor.color}40`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: 700,
      color: visitor.color,
      fontFamily: F,
      flexShrink: 0
    }}>
                  {visitor.initials}
                </div>

                {
      /* Info */
    }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", fontFamily: F }}>{visitor.id}</div>
                    {visitor.device && <span style={{ fontSize: 10, color: "#94A3B8", background: "#F1F5F9", padding: "1px 6px", borderRadius: 4, fontFamily: F_MONO }}>
                        {visitor.device}
                      </span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748B", fontFamily: F, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {visitor.email || "Unknown email"}
                    {visitor.source && <span style={{ color: "#CBD5E1", margin: "0 6px" }}>·</span>}
                    {visitor.source && <span style={{ color: "#4F46E5", fontWeight: 500 }}>{visitor.source}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#94A3B8", fontFamily: F, marginTop: 2 }}>
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Last seen {visitor.lastSeen}
                    <span style={{ margin: "0 6px", color: "#E2E8F0" }}>·</span>
                    {visitor.visits} visits
                    <span style={{ margin: "0 6px", color: "#E2E8F0" }}>·</span>
                    {visitor.pages} pages
                  </div>
                </div>

                {
      /* Stage */
    }
                {stageStyle && <span style={{
      fontSize: 11,
      fontWeight: 600,
      padding: "4px 11px",
      borderRadius: 99,
      background: stageStyle.bg,
      color: stageStyle.text,
      border: `1px solid ${stageStyle.border}`,
      fontFamily: F,
      whiteSpace: "nowrap"
    }}>
                    {visitor.stage}
                  </span>}

                {
      /* Progress bar indicator */
    }
                <div style={{ width: 60, height: 3, background: "#F1F5F9", borderRadius: 2, flexShrink: 0, overflow: "hidden" }}>
                  <div style={{
      height: "100%",
      width: visitor.stage === "Converted" ? "100%" : visitor.stage === "Decision" ? "75%" : visitor.stage === "Consideration" ? "50%" : visitor.stage === "Awareness" ? "25%" : `${Math.min(visitor.visits / 40 * 100, 90)}%`,
      background: visitor.stage ? stageStyles[visitor.stage].text : "#4F46E5",
      borderRadius: 2
    }} />
                </div>

                {
      /* Chevron */
    }
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" style={{ color: "#CBD5E1", transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {
      /* Expanded Detail */
    }
              {isExpanded && <div style={{
      background: "#FAFBFF",
      borderTop: "1px solid #EEF2FF",
      padding: "14px 16px 16px 70px",
      borderBottom: i < displayed.length - 1 ? "1px solid #F1F5F9" : "none"
    }}>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {(visitor.pageList ?? ["Homepage", "Pricing", "Features", "Contact"].slice(0, visitor.pages)).map((page, pi) => <div key={pi} style={{
      display: "flex",
      alignItems: "center",
      gap: 7,
      padding: "6px 12px",
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 8,
      fontSize: 12,
      color: "#374151",
      fontFamily: F,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
    }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: COLORS.primary, opacity: 0.5 }} />
                        {page}
                        {pi < visitor.pages - 1 && <svg width="10" height="10" fill="none" viewBox="0 0 24 24" style={{ color: "#CBD5E1" }}>
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>}
                      </div>)}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 11, color: "#94A3B8", fontFamily: F_MONO }}>
                    Visitor ID: {visitor.id} · Session duration: {visitor.duration || "4m 12s"}
                  </div>
                </div>}
            </div>;
  })}
      </div>

      {
    /* Show More */
  }
      {!showAll && hidden > 0 && <button
    onClick={() => setShowAll(true)}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      width: "100%",
      marginTop: 12,
      padding: "12px 0",
      fontSize: 13,
      fontWeight: 500,
      background: "#F8FAFC",
      border: "1px dashed #CBD5E1",
      borderRadius: 10,
      color: "#475569",
      cursor: "pointer",
      fontFamily: F,
      transition: "all 0.15s"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = COLORS.primaryMuted;
      e.currentTarget.style.color = COLORS.primary;
      e.currentTarget.style.borderColor = COLORS.primaryLight;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#F8FAFC";
      e.currentTarget.style.color = "#475569";
      e.currentTarget.style.borderColor = "#CBD5E1";
    }}
  >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Show {hidden} more visitors
        </button>}
    </Card>;
}
export {
  COLORS,
  F,
  F_MONO,
  MOCK_VISITORS,
  TT,
  VisitorJourneyTracker
};
