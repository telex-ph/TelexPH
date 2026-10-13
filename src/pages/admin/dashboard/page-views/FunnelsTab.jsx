import { useState, useEffect, useMemo } from "react";
import api from "@/lib/api/axios";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
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
function fmt(n) {
  return n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : String(n);
}
function shortUrl(url) {
  return url.replace(/^https?:\/\//, "");
}
async function fetchFunnelSeriesData(url, range) {
  const res = await api.get("/dashboard/page-views/series", { params: { path: url, range } });
  return res.data;
}
const IconEye = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
  </svg>;
const IconUsers = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>;
const IconMap = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="8" y1="2" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16" y1="6" x2="16" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>;
function MetricCard({
  label,
  value,
  change,
  sub,
  icon
}) {
  const up = change >= 0;
  const [hovered, setHovered] = useState(false);
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
      boxShadow: hovered ? "0 8px 25px var(--admin-accent-soft)" : "0 1px 3px rgba(0,0,0,0.04)",
      transform: hovered ? "translateY(-1px)" : "translateY(0)",
      transition: "box-shadow 0.2s ease, transform 0.2s ease",
      cursor: "default"
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
  >
      <div
    style={{
      position: "absolute",
      top: 0,
      right: 0,
      width: 80,
      height: 80,
      background: "radial-gradient(circle at 80% 20%, var(--admin-accent-soft) 0%, transparent 70%)",
      borderRadius: 16
    }}
  />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, color: "var(--admin-text-faint)", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: F }}>
          {label}
        </span>
        {icon && <div style={{ width: 32, height: 32, borderRadius: 10, background: COLORS.primaryMuted, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.primary, flexShrink: 0 }}>
            {icon}
          </div>}
      </div>
      <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, fontFamily: F, letterSpacing: "-1px", color: "var(--admin-text)" }}>
        {value}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {change != null && <span
    style={{
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
    }}
  >
          {up ? "\u2191" : "\u2193"} {Math.abs(change)}%
        </span>}
        {sub && <span style={{ fontSize: 11, color: "var(--admin-text-faint)", fontFamily: F }}>{sub}</span>}
      </div>
    </div>;
}
function RangeToggle({ value, onChange }) {
  return <div style={{ display: "inline-flex", background: "var(--admin-bg-soft)", borderRadius: 12, padding: 3, gap: 2 }}>
      {["7d", "30d", "90d"].map((o) => <button
    key={o}
    onClick={() => onChange(o)}
    style={{
      padding: "6px 14px",
      fontSize: 12,
      fontWeight: value === o ? 600 : 400,
      background: value === o ? "var(--admin-surface)" : "transparent",
      color: value === o ? "var(--admin-text)" : "var(--admin-text-faint)",
      border: "none",
      borderRadius: 9,
      cursor: "pointer",
      fontFamily: F,
      transition: "all 0.15s ease",
      boxShadow: value === o ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
    }}
  >
          {o}
        </button>)}
    </div>;
}
function Card({ children, style }) {
  return <div
    style={{
      background: "var(--admin-surface)",
      border: "1px solid var(--admin-border)",
      borderRadius: 16,
      padding: "22px 24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      ...style
    }}
  >
      {children}
    </div>;
}
function CardHeader({
  title,
  subtitle,
  action
}) {
  return <div style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, margin: 0, fontFamily: F, letterSpacing: "-0.3px", color: "var(--admin-text)" }}>{title}</p>
        {subtitle && <p style={{ fontSize: 12, fontWeight: 400, margin: "4px 0 0", fontFamily: F, color: "var(--admin-text-faint)", lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>;
}
function TblHead({ cols }) {
  return <thead>
      <tr style={{ background: "var(--admin-bg-soft)" }}>
        {cols.map((c, i) => <th
    key={i}
    style={{
      textAlign: c.align ?? "left",
      fontSize: 11,
      fontWeight: 600,
      color: "var(--admin-text-faint)",
      padding: "10px 12px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      fontFamily: F,
      width: c.w,
      whiteSpace: "nowrap",
      borderBottom: "1px solid var(--admin-border)"
    }}
  >
            {c.label}
          </th>)}
      </tr>
    </thead>;
}
function SortToggle({
  options,
  value,
  onChange
}) {
  return <div style={{ display: "inline-flex", background: "var(--admin-bg-soft)", borderRadius: 10, padding: 3, gap: 2 }}>
      {options.map((o) => <button
    key={o.value}
    onClick={() => onChange(o.value)}
    style={{
      padding: "4px 11px",
      fontSize: 11,
      fontWeight: value === o.value ? 600 : 400,
      background: value === o.value ? "var(--admin-surface)" : "transparent",
      color: value === o.value ? "var(--admin-text)" : "var(--admin-text-faint)",
      border: "none",
      borderRadius: 7,
      cursor: "pointer",
      fontFamily: F,
      whiteSpace: "nowrap",
      transition: "all 0.12s ease",
      boxShadow: value === o.value ? "0 1px 3px rgba(0,0,0,0.08)" : "none"
    }}
  >
          {o.label}
        </button>)}
    </div>;
}
function EmptyRow({ colSpan, message }) {
  return <tr>
      <td colSpan={colSpan} style={{ padding: "40px 0", textAlign: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--admin-bg-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="var(--admin-border-strong)" strokeWidth="1.5" />
              <path d="M8 12h8M8 16h5" stroke="var(--admin-border-strong)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: 13, color: "var(--admin-text-faint)", fontFamily: F }}>{message}</span>
        </div>
      </td>
    </tr>;
}
function FunnelDetailView({
  funnel,
  range,
  onRangeChange,
  onBack,
  fetchSeries
}) {
  const [activeMetric, setActiveMetric] = useState("views");
  const [seriesData, setSeriesData] = useState([]);
  const [seriesTotals, setSeriesTotals] = useState({ views: funnel.views, unique: funnel.unique });
  const [seriesLoading, setSeriesLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setSeriesLoading(true);
    fetchSeries(funnel.url, range).then((res) => {
      if (cancelled) return;
      setSeriesData(res.daily);
      setSeriesTotals(res.totals);
    }).catch(() => {
      if (!cancelled) setSeriesData([]);
    }).finally(() => {
      if (!cancelled) setSeriesLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [funnel.url, range, fetchSeries]);
  const mc = { views: funnel.color, unique: COLORS.teal };
  const metricLabel = { views: "Clicks", unique: "Unique visitors" };
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  return <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {
    /* Header */
  }
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
    onClick={onBack}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 14px",
      fontSize: 12,
      fontWeight: 500,
      background: "var(--admin-surface)",
      border: "1px solid var(--admin-border)",
      borderRadius: 10,
      color: "var(--admin-text-sub)",
      cursor: "pointer",
      fontFamily: F,
      transition: "all 0.15s",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
    }}
  >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, margin: 0, fontFamily: F, color: "var(--admin-text)" }}>{funnel.name}</p>
            <p style={{ fontSize: 11, color: "var(--admin-text-faint)", margin: "3px 0 0", fontFamily: F_MONO }}>
              {shortUrl(funnel.url)}
            </p>
          </div>
        </div>
        <RangeToggle value={range} onChange={onRangeChange} />
      </div>

      {
    /* Metric cards */
  }
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
        <MetricCard label="Clicks" value={fmt(seriesTotals.views)} change={funnel.change} sub="vs prev period" icon={<IconEye />} />
        <MetricCard label="Unique visitors" value={fmt(seriesTotals.unique)} sub="this period" icon={<IconUsers />} />
      </div>

      {
    /* Area chart */
  }
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
          <CardHeader title="Clicks over time" subtitle="Daily clicks on this funnel link" />
          <div style={{ display: "flex", gap: 6 }}>
            {["views", "unique"].map((m) => <button
    key={m}
    onClick={() => setActiveMetric(m)}
    style={{
      padding: "5px 12px",
      fontSize: 11,
      fontWeight: activeMetric === m ? 600 : 400,
      borderRadius: 8,
      border: `1px solid ${activeMetric === m ? mc[m] + "60" : "var(--admin-border)"}`,
      background: activeMetric === m ? mc[m] + "15" : "transparent",
      color: activeMetric === m ? mc[m] : "var(--admin-text-faint)",
      cursor: "pointer",
      fontFamily: F,
      transition: "all 0.12s"
    }}
  >
                {metricLabel[m]}
              </button>)}
          </div>
        </div>

        {seriesLoading ? <div style={{ height: 180 }} /> : seriesData.length === 0 ? <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-text-faint)", fontSize: 13, fontFamily: F }}>
            No clicks recorded for this period.
          </div> : <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={seriesData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={mc[activeMetric]} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={mc[activeMetric]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--admin-bg-soft)" />
              <XAxis
    dataKey="date"
    tick={{ fontSize: 11, fill: "var(--admin-text-faint)", fontFamily: F }}
    axisLine={false}
    tickLine={false}
    interval={Math.max(Math.floor(days / 8) - 1, 0)}
    dy={8}
  />
              <YAxis
    tick={{ fontSize: 11, fill: "var(--admin-text-faint)", fontFamily: F }}
    axisLine={false}
    tickLine={false}
    tickFormatter={(v) => fmt(Number(v))}
    width={36}
  />
              <Tooltip
    contentStyle={TT}
    formatter={(v) => [Number(v).toLocaleString(), activeMetric]}
    labelStyle={{ marginBottom: 4, fontWeight: 600, fontSize: 12 }}
  />
              <Area
    type="monotone"
    dataKey={activeMetric}
    stroke={mc[activeMetric]}
    strokeWidth={2.5}
    fillOpacity={1}
    fill="url(#fGrad)"
    dot={false}
    activeDot={{ r: 4, strokeWidth: 0, fill: mc[activeMetric] }}
  />
            </AreaChart>
          </ResponsiveContainer>}
      </Card>

      <style>{``}</style>
    </div>;
}
function FunnelsTab({
  range,
  onRangeChange,
  funnels = []
}) {
  const [sortBy, setSortBy] = useState("views");
  const [selectedFunnel, setSelectedFunnel] = useState(null);
  const [funnelSearch, setFunnelSearch] = useState("");
  const filteredFunnels = useMemo(() => {
    const q = funnelSearch.trim().toLowerCase();
    if (!q) return funnels;
    return funnels.filter(
      (f) => f.name.toLowerCase().includes(q) || f.url.toLowerCase().includes(q)
    );
  }, [funnels, funnelSearch]);
  const sorted = useMemo(
    () => [...filteredFunnels].sort((a, b) => b[sortBy] - a[sortBy]),
    [filteredFunnels, sortBy]
  );
  if (selectedFunnel) {
    return <FunnelDetailView
      funnel={selectedFunnel}
      range={range}
      onRangeChange={onRangeChange}
      onBack={() => setSelectedFunnel(null)}
      fetchSeries={fetchFunnelSeriesData}
    />;
  }
  const totalViews = funnels.reduce((s, f) => s + f.views, 0);

  const maxViews = sorted.length ? Math.max(...sorted.map((f) => f.views), 1) : 1;
  const barData = [...filteredFunnels].sort((a, b) => b.views - a.views).slice(0, 8).map((f) => ({
    name: f.name.length > 16 ? f.name.slice(0, 14) + "\u2026" : f.name,
    views: f.views
  }));
  const PALETTE = [
    COLORS.chart1,
    COLORS.chart3,
    COLORS.chart2,
    COLORS.chart4,
    COLORS.chart5,
    COLORS.chart1,
    COLORS.chart3,
    COLORS.chart2
  ];
  return <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {
    /* Summary metric cards */
  }
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
        <MetricCard label="Funnel clicks" value={fmt(totalViews)} sub="selected range" icon={<IconEye />} />
        <MetricCard label="Funnels clicked" value={String(funnels.length)} sub="selected range" icon={<IconMap />} />
      </div>
      <p style={{ fontSize: 12, color: "var(--admin-text-faint)", fontFamily: F, margin: 0 }}>
        These are clicks on funnel links from the website. What visitors do on the funnel pages themselves (opt-ins, purchases) is not tracked here.
      </p>

      {funnels.length === 0 ? <Card>
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "var(--admin-text-faint)", fontFamily: F, margin: 0 }}>
              No funnel links were clicked in this period.
            </p>
          </div>
        </Card> : <>
          {
    /* Charts row */
  }
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
            {
    /* Bar chart */
  }
            <Card>
              <CardHeader
    title="Top funnels by clicks"
    subtitle="Top 8 funnel links ranked by clicks"
  />
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{ top: 4, right: 4, left: 0, bottom: 44 }} barSize={18}>
                  <CartesianGrid vertical={false} stroke="var(--admin-bg-soft)" />
                  <XAxis
    dataKey="name"
    tick={{ fontSize: 11, fill: "var(--admin-text-faint)", fontFamily: F }}
    axisLine={false}
    tickLine={false}
    angle={-32}
    textAnchor="end"
    interval={0}
  />
                  <YAxis
    tick={{ fontSize: 11, fill: "var(--admin-text-faint)", fontFamily: F }}
    axisLine={false}
    tickLine={false}
    tickFormatter={(v) => fmt(Number(v))}
    width={36}
  />
                  <Tooltip
    contentStyle={TT}
    formatter={(v) => [Number(v).toLocaleString(), "Clicks"]}
    cursor={{ fill: "var(--admin-accent-soft)" }}
  />
                  <Bar dataKey="views" radius={[6, 6, 0, 0]}>
                    {barData.map((_, i) => <Cell key={i} fill={PALETTE[i % 8]} opacity={0.9} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

          </div>

          {
    /* Table */
  }
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
              <CardHeader
    title="All funnel links"
    subtitle="Every funnel link visitors clicked on the website"
  />
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                {
    /* Search */
  }
                <div style={{ position: "relative" }}>
                  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--admin-text-faint)", pointerEvents: "none" }}
  >
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <input
    type="search"
    value={funnelSearch}
    onChange={(e) => setFunnelSearch(e.target.value)}
    placeholder="Search funnels…"
    style={{
      paddingLeft: 32,
      paddingRight: 12,
      paddingTop: 8,
      paddingBottom: 8,
      fontSize: 12,
      fontFamily: F,
      border: "1px solid var(--admin-border)",
      borderRadius: 10,
      background: "var(--admin-bg-soft)",
      color: "var(--admin-text)",
      outline: "none",
      minWidth: 180
    }}
  />
                </div>
                <SortToggle
    options={[
      { label: "Clicks", value: "views" },
      { label: "Change", value: "change" }
    ]}
    value={sortBy}
    onChange={setSortBy}
  />
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <TblHead
    cols={[
      { label: "Funnel Page" },
      { label: "Clicks", align: "right", w: 80 },
      { label: "Unique", align: "right", w: 80 },
      { label: "", w: 120 },
      { label: "Change", align: "right", w: 75 },
      { label: "", align: "center", w: 90 }
    ]}
  />
              <tbody>
                {sorted.length === 0 && <EmptyRow colSpan={6} message="No funnels found." />}
                {sorted.map((row, i) => {
    const barPct = Math.round(row.views / maxViews * 100);
    return <TableRow
      key={i}
      row={row}
      barPct={barPct}
      onView={() => setSelectedFunnel(row)}
    />;
  })}
              </tbody>
            </table>
          </Card>
        </>}
    </div>;
}
function TableRow({
  row,
  barPct,
  onView
}) {
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  return <tr
    style={{ borderBottom: "1px solid var(--admin-bg-soft)", background: hovered ? "var(--admin-bg-soft)" : "transparent", transition: "background 0.1s" }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
  >
      <td style={{ padding: "13px 12px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, fontFamily: F, color: "var(--admin-text)" }}>{row.name}</div>
        <div style={{ fontSize: 11, color: "var(--admin-text-faint)", fontFamily: F_MONO, marginTop: 2, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {shortUrl(row.url)}
        </div>
      </td>
      <td style={{ textAlign: "right", padding: "13px 12px", fontSize: 14, fontWeight: 700, fontFamily: F, color: "var(--admin-text)" }}>
        {row.views.toLocaleString()}
      </td>
      <td style={{ textAlign: "right", padding: "13px 12px", fontSize: 12, color: "var(--admin-text-faint)", fontFamily: F }}>
        {row.unique.toLocaleString()}
      </td>
      <td style={{ padding: "13px 12px", verticalAlign: "middle" }}>
        <div style={{ height: 5, borderRadius: 3, background: "var(--admin-bg-soft)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${barPct}%`, borderRadius: 3, background: `linear-gradient(90deg, ${row.color}80, ${row.color})` }} />
        </div>
      </td>
      <td style={{ textAlign: "right", padding: "13px 12px" }}>
        <span style={{
    fontSize: 11,
    fontWeight: 600,
    color: row.change >= 0 ? COLORS.success : COLORS.danger,
    background: row.change >= 0 ? COLORS.successBg : COLORS.dangerBg,
    padding: "3px 8px",
    borderRadius: 99,
    fontFamily: F
  }}>
          {row.change >= 0 ? "+" : ""}{row.change}%
        </span>
      </td>
      <td style={{ textAlign: "center", padding: "13px 12px" }}>
        <button
    onClick={onView}
    style={{
      fontSize: 11,
      fontWeight: 600,
      color: COLORS.primary,
      background: btnHovered ? "color-mix(in srgb, #4F46E5 26%, transparent)" : COLORS.primaryMuted,
      padding: "4px 10px",
      border: "none",
      borderRadius: 7,
      cursor: "pointer",
      fontFamily: F,
      transition: "all 0.12s"
    }}
    onMouseEnter={() => setBtnHovered(true)}
    onMouseLeave={() => setBtnHovered(false)}
  >
          View →
        </button>
      </td>
    </tr>;
}
export {
  COLORS,
  F,
  F_MONO,
  FunnelDetailView,
  FunnelsTab,
  TT
};
