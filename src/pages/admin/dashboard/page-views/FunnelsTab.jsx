import { useState, useEffect, useMemo, useCallback } from "react";
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
const HIDDEN_URL_IDS = /* @__PURE__ */ new Set(["j75vK2OgfTrH7fTMvtSm"]);
function getUrlId(url) {
  return url.split("/").pop() ?? "";
}
function fmt(n) {
  return n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : String(n);
}
async function fetchFunnelsData(range) {
  try {
    const response = await fetch(`/api/page-views/funnels?range=${range}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) {
      console.error("Failed to fetch funnels data:", response.status);
      return [];
    }
    const data = await response.json();
    return data.funnels || [];
  } catch (error) {
    console.error("Error fetching funnels data:", error);
    return [];
  }
}
async function fetchFunnelSeriesData(url, range) {
  try {
    const response = await fetch(`/api/page-views/funnels/${encodeURIComponent(url)}?range=${range}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) {
      console.error("Failed to fetch funnel series data:", response.status);
      return {
        daily: [],
        totals: { views: 0, unique: 0, conversions: 0 }
      };
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching funnel series data:", error);
    return {
      daily: [],
      totals: { views: 0, unique: 0, conversions: 0 }
    };
  }
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
const IconActivity = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const IconPercent = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="6.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17.5" cy="17.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
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
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 16,
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      position: "relative",
      overflow: "hidden",
      boxShadow: hovered ? "0 8px 25px rgba(79,70,229,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
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
      background: "radial-gradient(circle at 80% 20%, rgba(79,70,229,0.05) 0%, transparent 70%)",
      borderRadius: 16
    }}
  />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: F }}>
          {label}
        </span>
        {icon && <div style={{ width: 32, height: 32, borderRadius: 10, background: COLORS.primaryMuted, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.primary, flexShrink: 0 }}>
            {icon}
          </div>}
      </div>
      <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, fontFamily: F, letterSpacing: "-1px", color: "#0F172A" }}>
        {value}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
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
        </span>
        {sub && <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: F }}>{sub}</span>}
      </div>
    </div>;
}
function RangeToggle({ value, onChange }) {
  return <div style={{ display: "inline-flex", background: "#F1F5F9", borderRadius: 12, padding: 3, gap: 2 }}>
      {["7d", "30d", "90d"].map((o) => <button
    key={o}
    onClick={() => onChange(o)}
    style={{
      padding: "6px 14px",
      fontSize: 12,
      fontWeight: value === o ? 600 : 400,
      background: value === o ? "#FFFFFF" : "transparent",
      color: value === o ? "#0F172A" : "#64748B",
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
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
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
        <p style={{ fontSize: 14, fontWeight: 700, margin: 0, fontFamily: F, letterSpacing: "-0.3px", color: "#0F172A" }}>{title}</p>
        {subtitle && <p style={{ fontSize: 12, fontWeight: 400, margin: "4px 0 0", fontFamily: F, color: "#94A3B8", lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>;
}
function TblHead({ cols }) {
  return <thead>
      <tr style={{ background: "#F8FAFC" }}>
        {cols.map((c, i) => <th
    key={i}
    style={{
      textAlign: c.align ?? "left",
      fontSize: 11,
      fontWeight: 600,
      color: "#94A3B8",
      padding: "10px 12px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      fontFamily: F,
      width: c.w,
      whiteSpace: "nowrap",
      borderBottom: "1px solid #E2E8F0"
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
  return <div style={{ display: "inline-flex", background: "#F1F5F9", borderRadius: 10, padding: 3, gap: 2 }}>
      {options.map((o) => <button
    key={o.value}
    onClick={() => onChange(o.value)}
    style={{
      padding: "4px 11px",
      fontSize: 11,
      fontWeight: value === o.value ? 600 : 400,
      background: value === o.value ? "#FFFFFF" : "transparent",
      color: value === o.value ? "#0F172A" : "#64748B",
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
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="#CBD5E1" strokeWidth="1.5" />
              <path d="M8 12h8M8 16h5" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: 13, color: "#94A3B8", fontFamily: F }}>{message}</span>
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
  const [seriesTotals, setSeriesTotals] = useState({
    views: funnel.views,
    unique: funnel.unique,
    conversions: funnel.conversions
  });
  const [seriesLoading, setSeriesLoading] = useState(true);
  const generateLocalSeries = useCallback(
    (range2, funnel2) => {
      const days2 = range2 === "7d" ? 7 : range2 === "30d" ? 30 : 90;
      const result = [];
      const now = /* @__PURE__ */ new Date();
      for (let i = days2 - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("en", { month: "short", day: "numeric" });
        const base = Math.round(funnel2.views / days2);
        const views = Math.max(0, base + Math.round((Math.random() - 0.4) * base * 0.7));
        const unique = Math.round(views * 0.78);
        const conversions = Math.round(views * (funnel2.convRate / 100));
        result.push({ date: label, views, unique, conversions });
      }
      return result;
    },
    []
  );
  useEffect(() => {
    let cancelled = false;
    setSeriesLoading(true);
    if (fetchSeries) {
      fetchSeries(funnel.url, range).then((res) => {
        if (cancelled) return;
        setSeriesData(res.daily);
        setSeriesTotals(res.totals);
      }).catch(() => {
        if (!cancelled) setSeriesData([]);
      }).finally(() => {
        if (!cancelled) setSeriesLoading(false);
      });
    } else {
      const daily = generateLocalSeries(range, funnel);
      const totals = {
        views: daily.reduce((s, d) => s + d.views, 0),
        unique: daily.reduce((s, d) => s + d.unique, 0),
        conversions: daily.reduce((s, d) => s + d.conversions, 0)
      };
      setSeriesData(daily);
      setSeriesTotals(totals);
      setSeriesLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, [funnel.url, range, fetchSeries, generateLocalSeries, funnel]);
  const mc = {
    views: funnel.color,
    unique: COLORS.teal,
    conversions: COLORS.violet
  };
  const urlId = getUrlId(funnel.url);
  const isHidden = HIDDEN_URL_IDS.has(urlId);
  const convRateStr = (seriesTotals.views > 0 ? seriesTotals.conversions / seriesTotals.views * 100 : 0).toFixed(2);
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
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 10,
      color: "#475569",
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
            <p style={{ fontSize: 15, fontWeight: 700, margin: 0, fontFamily: F, color: "#0F172A" }}>{funnel.name}</p>
            <p style={{ fontSize: 11, color: "#94A3B8", margin: "3px 0 0", fontFamily: F_MONO }}>
              {isHidden ? "\u2014" : `ghl/preview/${urlId}`}
            </p>
          </div>
        </div>
        <RangeToggle value={range} onChange={onRangeChange} />
      </div>

      {
    /* Metric cards */
  }
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
        <MetricCard label="Total views" value={fmt(seriesTotals.views)} change={funnel.change} sub="vs prev period" icon={<IconEye />} />
        <MetricCard label="Unique visitors" value={fmt(seriesTotals.unique)} change={0} sub="this period" icon={<IconUsers />} />
        <MetricCard label="Conversions" value={fmt(seriesTotals.conversions)} change={0} sub="this period" icon={<IconActivity />} />
        <MetricCard label="Conv. rate" value={`${convRateStr}%`} change={0} sub="this period" icon={<IconPercent />} />
      </div>

      {
    /* Area chart */
  }
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
          <CardHeader title="Traffic over time" subtitle="Daily traffic breakdown for this funnel page" />
          <div style={{ display: "flex", gap: 6 }}>
            {["views", "unique", "conversions"].map((m) => <button
    key={m}
    onClick={() => setActiveMetric(m)}
    style={{
      padding: "5px 12px",
      fontSize: 11,
      fontWeight: activeMetric === m ? 600 : 400,
      borderRadius: 8,
      border: `1px solid ${activeMetric === m ? mc[m] + "60" : "#E2E8F0"}`,
      background: activeMetric === m ? mc[m] + "15" : "transparent",
      color: activeMetric === m ? mc[m] : "#64748B",
      cursor: "pointer",
      fontFamily: F,
      transition: "all 0.12s"
    }}
  >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>)}
          </div>
        </div>

        {seriesLoading ? <div style={{ height: 180 }} /> : seriesData.length === 0 ? <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", fontSize: 13, fontFamily: F }}>
            No traffic data for this period.
          </div> : <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={seriesData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={mc[activeMetric]} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={mc[activeMetric]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#F1F5F9" />
              <XAxis
    dataKey="date"
    tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: F }}
    axisLine={false}
    tickLine={false}
    interval={Math.max(Math.floor(days / 8) - 1, 0)}
    dy={8}
  />
              <YAxis
    tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: F }}
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
  onRangeChange
}) {
  const [sortBy, setSortBy] = useState("views");
  const [selectedFunnel, setSelectedFunnel] = useState(null);
  const [funnelSearch, setFunnelSearch] = useState("");
  const [funnels, setFunnels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadFunnels = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchFunnelsData(range);
        setFunnels(data);
      } catch (err) {
        setError("Failed to load funnel data");
        setFunnels([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadFunnels();
  }, [range]);
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
  const totalUnique = funnels.reduce((s, f) => s + f.unique, 0);
  const totalConversions = funnels.reduce((s, f) => s + f.conversions, 0);
  const avgConvRate = funnels.length ? (funnels.reduce((s, f) => s + f.convRate, 0) / funnels.length).toFixed(2) : "0.00";
  const maxViews = sorted.length ? Math.max(...sorted.map((f) => f.views), 1) : 1;
  const barData = [...filteredFunnels].sort((a, b) => b.views - a.views).slice(0, 8).map((f) => ({
    name: f.name.length > 16 ? f.name.slice(0, 14) + "\u2026" : f.name,
    views: f.views,
    conversions: f.conversions
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
  const funnelChartData = [
    { name: "Total Views", value: totalViews, fill: COLORS.chart1, label: "100%" },
    { name: "Unique Visitors", value: totalUnique, fill: COLORS.chart2, label: totalViews > 0 ? `${(totalUnique / totalViews * 100).toFixed(1)}%` : "0%" },
    { name: "Conversions", value: totalConversions, fill: COLORS.chart3, label: totalUnique > 0 ? `${(totalConversions / totalUnique * 100).toFixed(1)}%` : "0%" }
  ];
  if (isLoading && funnels.length === 0) return null;
  if (error) {
    return <Card>
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4m0 4h.01M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontSize: 13, color: "#DC2626", fontFamily: F, fontWeight: 500 }}>{error}</span>
            <button
      onClick={() => window.location.reload()}
      style={{
        padding: "8px 16px",
        fontSize: 12,
        fontWeight: 500,
        background: COLORS.primary,
        color: "#FFFFFF",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontFamily: F,
        transition: "all 0.15s ease"
      }}
    >
              Retry
            </button>
          </div>
        </div>
      </Card>;
  }
  return <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {
    /* Summary metric cards */
  }
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
        <MetricCard label="Total funnel views" value={fmt(totalViews)} change={0} sub="vs prev period" icon={<IconEye />} />
        <MetricCard label="Unique visitors" value={fmt(totalUnique)} change={0} sub="selected range" icon={<IconUsers />} />
        <MetricCard label="Total conversions" value={fmt(totalConversions)} change={0} sub="this period" icon={<IconActivity />} />
        <MetricCard label="Avg. conv. rate" value={`${avgConvRate}%`} change={0} sub="across funnels" icon={<IconPercent />} />
        <MetricCard label="Active funnels" value={String(funnels.length)} change={0} sub="tracked URLs" icon={<IconMap />} />
      </div>

      {funnels.length === 0 ? <Card>
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#94A3B8", fontFamily: F, margin: 0 }}>
              No funnel or external preview URLs in this period.
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
    title="Top funnels by views"
    subtitle="Top 8 funnel pages ranked by total traffic"
  />
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{ top: 4, right: 4, left: 0, bottom: 44 }} barSize={18}>
                  <CartesianGrid vertical={false} stroke="#F1F5F9" />
                  <XAxis
    dataKey="name"
    tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: F }}
    axisLine={false}
    tickLine={false}
    angle={-32}
    textAnchor="end"
    interval={0}
  />
                  <YAxis
    tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: F }}
    axisLine={false}
    tickLine={false}
    tickFormatter={(v) => fmt(Number(v))}
    width={36}
  />
                  <Tooltip
    contentStyle={TT}
    formatter={(v, n) => [Number(v).toLocaleString(), n === "views" ? "Views" : "Conversions"]}
    cursor={{ fill: "rgba(79,70,229,0.04)" }}
  />
                  <Bar dataKey="views" radius={[6, 6, 0, 0]}>
                    {barData.map((_, i) => <Cell key={i} fill={PALETTE[i % 8]} opacity={0.9} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {
    /* Funnel drop-off chart */
  }
            <Card>
              <CardHeader
    title="Conversion Funnel"
    subtitle="Drop-off across all tracked funnel pages"
  />
              <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 10 }}>
                {funnelChartData.map((step, i) => {
    const pct = i === 0 ? 100 : step.value / funnelChartData[0].value * 100;
    return <div key={step.name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#475569", fontFamily: F }}>{step.name}</span>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", fontFamily: F }}>
                            {step.value.toLocaleString()}
                          </span>
                          <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 6, fontFamily: F }}>
                            ({step.label})
                          </span>
                        </div>
                      </div>
                      <div style={{ height: 32, background: "#F1F5F9", borderRadius: 8, overflow: "hidden", position: "relative" }}>
                        <div
      style={{
        height: "100%",
        width: `${pct}%`,
        background: `linear-gradient(90deg, ${step.fill}99, ${step.fill})`,
        transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
    />
                      </div>
                      {i < funnelChartData.length - 1 && <div style={{ display: "flex", justifyContent: "center", height: 12 }}>
                          <div style={{ width: 1, borderLeft: "2px dashed #E2E8F0" }} />
                        </div>}
                    </div>;
  })}
              </div>
            </Card>
          </div>

          {
    /* Table */
  }
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
              <CardHeader
    title="All GHL funnel pages"
    subtitle="Complete list of GoHighLevel funnel pages and their metrics"
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
    style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }}
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
      border: "1px solid #E2E8F0",
      borderRadius: 10,
      background: "#F8FAFC",
      color: "#0F172A",
      outline: "none",
      minWidth: 180
    }}
  />
                </div>
                <SortToggle
    options={[
      { label: "Views", value: "views" },
      { label: "Conversions", value: "conversions" },
      { label: "Conv. %", value: "convRate" },
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
      { label: "Views", align: "right", w: 80 },
      { label: "Unique", align: "right", w: 80 },
      { label: "", w: 120 },
      { label: "Conversions", align: "right", w: 100 },
      { label: "Conv. %", align: "right", w: 80 },
      { label: "Change", align: "right", w: 75 },
      { label: "", align: "center", w: 60 }
    ]}
  />
              <tbody>
                {sorted.length === 0 && <EmptyRow colSpan={8} message="No funnels found." />}
                {sorted.map((row, i) => {
    const barPct = Math.round(row.views / maxViews * 100);
    const urlId = getUrlId(row.url);
    const isHidden = HIDDEN_URL_IDS.has(urlId);
    const rate = row.convRate;
    const rateColor = rate >= 7 ? { bg: COLORS.successBg, text: COLORS.success } : rate >= 5.5 ? { bg: COLORS.warningBg, text: COLORS.warning } : { bg: COLORS.dangerBg, text: COLORS.danger };
    return <TableRow
      key={i}
      row={row}
      barPct={barPct}
      isHidden={isHidden}
      urlId={urlId}
      rateColor={rateColor}
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
  isHidden,
  urlId,
  rateColor,
  onView
}) {
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  return <tr
    style={{ borderBottom: "1px solid #F1F5F9", background: hovered ? "#FAFBFF" : "transparent", transition: "background 0.1s" }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
  >
      <td style={{ padding: "13px 12px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, fontFamily: F, color: "#0F172A" }}>{row.name}</div>
        <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: F_MONO, marginTop: 2, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {isHidden ? "\u2014" : `ghl/preview/${urlId}`}
        </div>
      </td>
      <td style={{ textAlign: "right", padding: "13px 12px", fontSize: 14, fontWeight: 700, fontFamily: F, color: "#0F172A" }}>
        {row.views.toLocaleString()}
      </td>
      <td style={{ textAlign: "right", padding: "13px 12px", fontSize: 12, color: "#64748B", fontFamily: F }}>
        {row.unique.toLocaleString()}
      </td>
      <td style={{ padding: "13px 12px", verticalAlign: "middle" }}>
        <div style={{ height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${barPct}%`, borderRadius: 3, background: `linear-gradient(90deg, ${row.color}80, ${row.color})` }} />
        </div>
      </td>
      <td style={{ textAlign: "right", padding: "13px 12px", fontSize: 14, fontWeight: 700, fontFamily: F, color: "#0F172A" }}>
        {row.conversions.toLocaleString()}
      </td>
      <td style={{ textAlign: "right", padding: "13px 12px" }}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: rateColor.bg, color: rateColor.text, fontFamily: F }}>
          {row.convRate}%
        </span>
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
      background: btnHovered ? "#DDE5FF" : COLORS.primaryMuted,
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
function FunnelDashboard() {
  const [range, setRange] = useState("30d");
  return <div style={{ fontFamily: F, minHeight: "100vh", background: "#F8FAFC", padding: "24px" }}>
      <FunnelsTab
    range={range}
    onRangeChange={setRange}
  />
    </div>;
}
export {
  COLORS,
  F,
  F_MONO,
  FunnelDetailView,
  FunnelsTab,
  TT,
  FunnelDashboard as default
};
