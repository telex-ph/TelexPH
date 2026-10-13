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
  primaryMuted: "color-mix(in srgb, #4F46E5 14%, transparent)",
  success: "#059669",
  successBg: "color-mix(in srgb, #059669 14%, transparent)",
  warning: "#D97706",
  warningBg: "color-mix(in srgb, #D97706 14%, transparent)",
  danger: "#DC2626",
  dangerBg: "color-mix(in srgb, #DC2626 14%, transparent)",
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
      background: "var(--admin-surface)",
      border: "1px solid var(--admin-border)",
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
      e.currentTarget.style.boxShadow = "0 8px 25px var(--admin-accent-soft)";
      e.currentTarget.style.transform = "translateY(-1px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: "radial-gradient(circle at 80% 20%, var(--admin-accent-soft) 0%, transparent 70%)", borderRadius: 16 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, color: "var(--admin-text-faint)", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: F }}>{label}</span>
        {icon && <div style={{ width: 32, height: 32, borderRadius: 10, background: COLORS.primaryMuted, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.primary, flexShrink: 0 }}>
            {icon}
          </div>}
      </div>
      <div>
        <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, fontFamily: F, letterSpacing: "-1px", color: "var(--admin-text)" }}>{value}</span>
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
        {sub && <span style={{ fontSize: 11, color: "var(--admin-text-faint)", fontFamily: F }}>{sub}</span>}
      </div>
    </div>;
}
function Card({ children, style }) {
  return <div style={{
    background: "var(--admin-surface)",
    border: "1px solid var(--admin-border)",
    borderRadius: 16,
    padding: "22px 24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    ...style
  }}>
      {children}
    </div>;
}
const clock = { hour: "numeric", minute: "2-digit" };
function when(iso) {
  const d = new Date(iso);
  const days = Math.round((new Date((/* @__PURE__ */ new Date()).toDateString()) - new Date(d.toDateString())) / 864e5);
  const date = days === 0 ? "Today" : days === 1 ? "Yesterday" : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${date}, ${d.toLocaleTimeString("en-US", clock)}`;
}
function fmtSpan(sec) {
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ${sec % 60}s`;
  return `${Math.floor(sec / 3600)}h ${Math.floor(sec % 3600 / 60)}m`;
}
/** Steps (oldest first) -> visits (oldest first). Same page several times in a row becomes one line with a count. */
function groupVisits(steps) {
  const visits = [];
  for (const s of steps) {
    let v = visits[visits.length - 1];
    if (!v || v.n !== s.visit) visits.push(v = { n: s.visit, pages: [], views: 0 });
    const last = v.pages[v.pages.length - 1];
    if (s.kind !== "conversion") v.views += 1;
    if (last && last.label === s.label && last.kind === s.kind) {
      last.count += 1;
      last.endAt = s.at;
    } else v.pages.push({ label: s.label, kind: s.kind, path: s.path, at: s.at, endAt: s.at, count: 1 });
  }
  for (const v of visits) {
    v.start = v.pages[0].at;
    v.secs = Math.round((new Date(v.pages[v.pages.length - 1].endAt) - new Date(v.start)) / 1e3);
  }
  return visits;
}
function pathPreview(visit) {
  const names = visit.pages.map((p) => p.label);
  return names.length <= 4 ? names.join(" → ") : `${names.slice(0, 3).join(" → ")} → … → ${names[names.length - 1]}`;
}
function Fact({ label, children }) {
  return <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 11, color: "var(--admin-text-faint)", fontFamily: F }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)", fontFamily: F, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{children}</div>
    </div>;
}
/** Expanded row: a few facts about the visitor, then each visit with the pages they viewed, in order. */
function JourneyDetail({ visitor }) {
  const { steps, ips } = visitor;
  const visits = useMemo(() => groupVisits(steps ?? []).reverse(), [steps]);
  const [open, setOpen] = useState(() => new Set(visits.slice(0, 1).map((v) => v.n)));
  const [showAllVisits, setShowAllVisits] = useState(false);
  const shown = showAllVisits ? visits : visits.slice(0, 3);
  const toggle = (n) => setOpen((prev) => {
    const next = new Set(prev);
    if (!next.delete(n)) next.add(n);
    return next;
  });
  // An older API deploy has no journey data; say so instead of crashing the page.
  if (!steps || !ips) return <p style={{ padding: "14px 20px", margin: 0, fontSize: 12, color: "var(--admin-text-faint)", fontFamily: F, background: "var(--admin-bg-soft)" }}>
      Journey details are unavailable: the API needs to be updated to the latest version.
    </p>;
  return <div style={{ background: "var(--admin-bg-soft)", borderTop: "1px solid var(--admin-border)", padding: "16px 20px 18px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 18 }}>
        <Fact label="IP address"><span title={ips.join(", ")} style={{ fontFamily: F_MONO }}>{ips[0] ?? "Unknown"}{ips.length > 1 && ` +${ips.length - 1}`}</span></Fact>
        <Fact label="Device">{visitor.device}</Fact>
        <Fact label="Came from">{visitor.source}</Fact>
        <Fact label="Total time on site">{visitor.sessionDuration}</Fact>
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-text)", fontFamily: F, marginBottom: 8 }}>
        Pages viewed <span style={{ fontWeight: 400, color: "var(--admin-text-faint)" }}>· newest visit first</span>
      </div>
      {visitor.visitsEstimated && <div style={{ fontSize: 11, color: "var(--admin-text-faint)", fontFamily: F, margin: "-4px 0 8px" }}>
          Some visits are estimated: activity from before the site recorded visits is split wherever there was a 30-minute pause.
        </div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {shown.map((v, vi) => {
    const isOpen = open.has(v.n);
    return <div key={v.n} style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 10, overflow: "hidden" }}>
              <button type="button" onClick={() => toggle(v.n)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%", padding: "10px 14px", background: "transparent", border: "none", cursor: "pointer", fontFamily: F, textAlign: "left" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)", display: "flex", alignItems: "center", gap: 8 }}>
                  Visit {v.n}
                  {vi === 0 && <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.success, background: COLORS.successBg, padding: "1px 7px", borderRadius: 99 }}>Latest</span>}
                </span>
                <span style={{ fontSize: 12, color: "var(--admin-text-faint)", display: "flex", alignItems: "center", gap: 8 }}>
                  {when(v.start)} · {v.views} page{v.views === 1 ? "" : "s"}{v.secs > 0 && ` · ${fmtSpan(v.secs)}`}
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              {isOpen && <ol style={{ listStyle: "none", margin: 0, padding: 0, borderTop: "1px solid var(--admin-border)" }}>
                  {v.pages.map((p, i) => <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 14px", borderTop: i ? "1px solid var(--admin-bg-soft)" : "none" }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: p.kind === "funnel" ? COLORS.amber : p.kind === "conversion" ? COLORS.success : COLORS.primary, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>{i + 1}</span>
                      <span title={p.path} style={{ flex: 1, minWidth: 0, fontSize: 13, color: "var(--admin-text)", fontFamily: F, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.label}
                        {p.count > 1 && <span title={`Viewed ${p.count} times in a row`} style={{ color: "var(--admin-text-faint)" }}> ×{p.count}</span>}
                        {p.kind === "funnel" && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, color: COLORS.warning, background: COLORS.warningBg, padding: "1px 7px", borderRadius: 99 }}>Funnel click</span>}
                        {p.kind === "conversion" && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, color: COLORS.success, background: COLORS.successBg, padding: "1px 7px", borderRadius: 99 }}>Form submitted</span>}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--admin-text-faint)", fontFamily: F, flexShrink: 0 }}>{new Date(p.at).toLocaleTimeString("en-US", clock)}</span>
                    </li>)}
                </ol>}
            </div>;
  })}
        {visits.length > 3 && <button type="button" onClick={() => setShowAllVisits((p) => !p)} style={{ alignSelf: "flex-start", padding: "6px 2px", background: "transparent", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--admin-accent-text)", fontFamily: F }}>
            {showAllVisits ? "Show fewer visits" : `Show ${visits.length - 3} earlier visits`}
          </button>}
      </div>
      {visitor.truncated && <div style={{ marginTop: 10, fontSize: 11, color: "var(--admin-text-faint)", fontFamily: F }}>
          Showing only the latest {steps.length} events. Export CSV for the full list.
        </div>}
    </div>;
}
function VisitorJourneyTracker({ range }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [total, setTotal] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(/* @__PURE__ */ new Date());
  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/dashboard/page-views/visitors", { params: { range } });
      setVisitors(res.data.visitors);
      setTotal(res.data.total);
      setChartData(res.data.daily ?? []);
      setLastUpdated(/* @__PURE__ */ new Date());
    } catch {
      setError("Could not load visitor journeys. Check that you are signed in and the API is reachable.");
    } finally {
      setLoading(false);
    }
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
            <p style={{ fontSize: 15, fontWeight: 700, margin: 0, fontFamily: F, color: "var(--admin-text)", letterSpacing: "-0.3px" }}>Visitor Journey Tracker</p>
            <p style={{ fontSize: 12, color: "var(--admin-text-faint)", margin: "3px 0 0", fontFamily: F }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block", boxShadow: "0 0 0 2px rgba(16,185,129,0.2)" }} />
                {total} unique visitors tracked{visitors.length < total && ` (showing latest ${visitors.length})`}
              </span>
              <span style={{ color: "var(--admin-border-strong)", margin: "0 6px" }}>·</span>
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
      background: "var(--admin-surface)",
      border: "1px solid var(--admin-border)",
      borderRadius: 10,
      color: loading ? "var(--admin-text-faint)" : "var(--admin-text-sub)",
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
        e.currentTarget.style.borderColor = "var(--admin-border)";
        e.currentTarget.style.color = "var(--admin-text-sub)";
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
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)", margin: 0, fontFamily: F }}>Active Visitors</h3>
              <p style={{ fontSize: 12, color: "var(--admin-text-faint)", margin: "4px 0 0", fontFamily: F }}>Daily unique visitors tracked across your funnels and pages</p>
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
              <CartesianGrid vertical={false} stroke="var(--admin-bg-soft)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--admin-text-faint)", fontFamily: F }} axisLine={false} tickLine={false} dy={5} />
              <YAxis tick={{ fontSize: 11, fill: "var(--admin-text-faint)", fontFamily: F }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} labelStyle={{ fontWeight: 600, marginBottom: 4, color: "#F8FAFC" }} formatter={(val) => [val, "Visitors"]} />
              <Area type="monotone" dataKey="activeVisitors" stroke={COLORS.primary} strokeWidth={2} fillOpacity={1} fill="url(#vGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-text)", marginBottom: 12, fontFamily: F }}>Device Breakdown</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <PieChart width={120} height={120}>
              <Pie data={deviceData} cx={56} cy={56} innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={2} stroke="var(--admin-surface)">
                <Cell fill={COLORS.chart1} />
                <Cell fill={COLORS.chart3} />
                <Cell fill={COLORS.chart2} />
              </Pie>
            </PieChart>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {deviceData.map((d, i) => <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: [COLORS.chart1, COLORS.chart3, COLORS.chart2][i % 3] }} />
                  <span style={{ fontSize: 11, color: "var(--admin-text-faint)", fontFamily: F }}>{d.name} · {d.value}</span>
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
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--admin-text-faint)", pointerEvents: "none" }}>
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
      border: "1px solid var(--admin-border)",
      borderRadius: 10,
      background: "var(--admin-bg-soft)",
      color: "var(--admin-text)",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.15s"
    }}
    onFocus={(e) => {
      e.target.style.borderColor = "#4F46E5";
      e.target.style.background = "var(--admin-surface)";
    }}
    onBlur={(e) => {
      e.target.style.borderColor = "var(--admin-border)";
      e.target.style.background = "var(--admin-bg-soft)";
    }}
  />
        </div>

      </div>

      {
    /* Visitor List */
  }
      {error && <p style={{ fontSize: 13, color: COLORS.danger, fontFamily: F, margin: "0 0 12px" }}>{error}</p>}
      {!error && !loading && filtered.length === 0 && <p style={{ fontSize: 13, color: "var(--admin-text-faint)", fontFamily: F, textAlign: "center", padding: "28px 0", margin: 0 }}>
          {search.trim() ? "No visitors match your search." : "No visitors recorded in this range yet."}
        </p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, border: filtered.length ? "1px solid var(--admin-border)" : "none", borderRadius: 12, overflow: "hidden" }}>
        {displayed.map((visitor, i) => {
    const isExpanded = expanded === visitor.id;
    const conversionTypes = [...new Set((visitor.conversions ?? []).map((c) => c.type))];
    const latest = visitor.steps ? groupVisits(visitor.steps).pop() : null;
    return <div key={visitor.id}>
              <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        background: isExpanded ? "var(--admin-bg-soft)" : "var(--admin-surface)",
        borderBottom: i < displayed.length - 1 ? "1px solid var(--admin-bg-soft)" : "none",
        cursor: "pointer",
        transition: "background 0.1s"
      }}
      onClick={() => setExpanded(isExpanded ? null : visitor.id)}
      onMouseEnter={(e) => {
        if (!isExpanded) e.currentTarget.style.background = "var(--admin-bg-soft)";
      }}
      onMouseLeave={(e) => {
        if (!isExpanded) e.currentTarget.style.background = "var(--admin-surface)";
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

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)", fontFamily: F, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {visitor.email || `Visitor #${visitor.id.slice(-4).toUpperCase()}`}
                  </div>
                  {latest && <div style={{ fontSize: 12, color: "var(--admin-text-sub)", fontFamily: F, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <span style={{ color: "var(--admin-text-faint)" }}>Latest visit: </span>{pathPreview(latest)}
                    </div>}
                  <div style={{ fontSize: 11, color: "var(--admin-text-faint)", fontFamily: F, marginTop: 3 }}>
                    Last seen {visitor.lastSeen} · {visitor.visitCount} visit{visitor.visitCount === 1 ? "" : "s"} · {visitor.visits} page views
                  </div>
                </div>

                {visitor.converted && <span title={visitor.conversions.map((c) => `${c.type} · ${when(c.at)}`).join(", ")} style={{
      fontSize: 11,
      fontWeight: 600,
      padding: "4px 11px",
      borderRadius: 99,
      background: COLORS.successBg,
      color: COLORS.success,
      border: "1px solid color-mix(in srgb, currentColor 30%, transparent)",
      fontFamily: F,
      whiteSpace: "nowrap"
    }}>
                    Converted · {conversionTypes.join(", ")}
                  </span>}

                {
      /* Chevron */
    }
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" style={{ color: "var(--admin-border-strong)", transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {
      /* Expanded Detail */
    }
              {isExpanded && <JourneyDetail visitor={visitor} />}
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
      background: "var(--admin-bg-soft)",
      border: "1px dashed var(--admin-border-strong)",
      borderRadius: 10,
      color: "var(--admin-text-sub)",
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
      e.currentTarget.style.background = "var(--admin-bg-soft)";
      e.currentTarget.style.color = "var(--admin-text-sub)";
      e.currentTarget.style.borderColor = "var(--admin-border-strong)";
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
  TT,
  VisitorJourneyTracker
};
