import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// ── Types ──────────────────────────────────────────────────────────────────────
export type Range = "7d" | "30d" | "90d";

export interface TopPageRow {
  page: string;
  label: string;
  section: string;
  views: number;
  change: number;
}

export interface PageViewsOverviewResponse {
  range: string;
  daily: { date: string; dateKey: string; views: number; unique: number; sessions: number }[];
  totals: {
    views: number;
    uniqueVisitors: number;
    sessions: number;
    avgPagesPerVisit: number;
    bounceRate: number;
  };
  changes: {
    views: number;
    unique: number;
    sessions: number;
    bounceRate: number;
  };
  topPages: TopPageRow[];
  trafficSources: { name: string; value: number; color: string }[];
  devices: { device: string; views: number }[];
  funnels: any[]; // handled in FunnelsTab
}

export const F = "'DM Sans', 'Outfit', 'system-ui', sans-serif";
export const F_MONO = "'JetBrains Mono', 'Fira Code', monospace";

export const COLORS = {
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
  chart5: "#EC4899",
};

export const TT: React.CSSProperties = {
  background: "#0F172A",
  border: "none",
  borderRadius: 10,
  fontSize: 12,
  color: "#F8FAFC",
  padding: "10px 14px",
  fontFamily: F,
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
};

const sectionColors: Record<string, { bg: string; text: string; dot: string }> = {
  Home: { bg: "#EEF2FF", text: "#4338CA", dot: "#4F46E5" },
  About: { bg: "#F5F3FF", text: "#6D28D9", dot: "#7C3AED" },
  Services: { bg: "#ECFDF5", text: "#065F46", dot: "#059669" },
  "Why Us": { bg: "#FFFBEB", text: "#92400E", dot: "#D97706" },
  Resources: { bg: "#FFF1F2", text: "#9F1239", dot: "#E11D48" },
  Careers: { bg: "#F0FDF4", text: "#14532D", dot: "#16A34A" },
  Other: { bg: "#F8FAFC", text: "#475569", dot: "#94A3B8" },
};

function rowSectionColors(section: string) {
  return sectionColors[section] ?? sectionColors.Other!;
}

const ALL_SECTIONS = ["All", "Home", "About", "Services", "Why Us", "Resources", "Careers"] as const;

// ── Icons ───────────────────────────────────────────────────────────
const IconEye = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconUsers = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconActivity = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconTrending = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconPercent = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="6.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17.5" cy="17.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

// ── Shared UI ───────────────────────────────────────────────────────
function MetricCard({ label, value, change, sub, icon }: { label: string, value: string, change: number, sub?: string, icon?: React.ReactNode }) {
  const up = change >= 0;
  return (
    <div style={{
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
      transition: "box-shadow 0.2s ease, transform 0.2s ease",
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 25px rgba(79,70,229,0.08)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: "radial-gradient(circle at 80% 20%, rgba(79,70,229,0.05) 0%, transparent 70%)", borderRadius: 16 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: F }}>{label}</span>
        {icon && (
          <div style={{ width: 32, height: 32, borderRadius: 10, background: COLORS.primaryMuted, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.primary, flexShrink: 0 }}>
            {icon}
          </div>
        )}
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
          display: "flex", alignItems: "center", gap: 3,
        }}>
          {up ? "↑" : "↓"} {Math.abs(change)}%
        </span>
        {sub && <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: F }}>{sub}</span>}
      </div>
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 16,
      padding: "22px 24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, margin: 0, fontFamily: F, letterSpacing: "-0.3px", color: "#0F172A" }}>{title}</p>
        {subtitle && <p style={{ fontSize: 12, fontWeight: 400, margin: "4px 0 0", fontFamily: F, color: "#94A3B8", lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function TblHead({ cols }: { cols: { label: string; align?: "left" | "right" | "center"; w?: number }[] }) {
  return (
    <thead>
      <tr style={{ background: "#F8FAFC" }}>
        {cols.map((c, i) => (
          <th key={i} style={{
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
            borderBottom: "1px solid #E2E8F0",
            ...(i === 0 ? { borderRadius: "8px 0 0 0" } : {}),
          }}>
            {c.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function SortToggle<T extends string>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div style={{
      display: "inline-flex",
      background: "#F1F5F9",
      borderRadius: 10,
      padding: 3,
      gap: 2,
    }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
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
          boxShadow: value === o.value ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
        }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
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
    </tr>
  );
}

// ── TopPagesCard ──────────────────────────────────────────────────────────────

function TopPagesCard({ topPages }: { topPages: TopPageRow[] }) {
  const [activeSection, setActiveSection] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"views" | "change">("views");

  const filtered = useMemo(() => {
    const list = activeSection === "All" ? topPages : topPages.filter((p) => p.section === activeSection);
    return [...list].sort((a, b) => sortBy === "views" ? b.views - a.views : b.change - a.change);
  }, [activeSection, sortBy, topPages]);

  const maxViews = filtered.length ? Math.max(...filtered.map((p) => p.views), 1) : 1;

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <CardHeader title="Top pages" subtitle="Most visited pages across your site" />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: F }}>Sort by</span>
          <SortToggle
            options={[{ label: "Views", value: "views" as const }, { label: "Change", value: "change" as const }]}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {ALL_SECTIONS.map((sec) => {
          const active = sec === activeSection;
          const col = sec !== "All" ? (sectionColors[sec] ?? sectionColors.Other) : null;
          return (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                fontSize: 12,
                fontWeight: active ? 600 : 400,
                borderRadius: 99,
                border: `1px solid ${active && col ? col.dot + "50" : "#E2E8F0"}`,
                background: active && col ? col.bg : active ? "#F1F5F9" : "transparent",
                color: active && col ? col.text : active ? "#0F172A" : "#64748B",
                cursor: "pointer",
                fontFamily: F,
                transition: "all 0.12s ease",
              }}
            >
              {col && <div style={{ width: 6, height: 6, borderRadius: "50%", background: active ? col.dot : "#CBD5E1", flexShrink: 0 }} />}
              {sec}
            </button>
          );
        })}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <TblHead cols={[
          { label: "Page" },
          { label: "Section", w: 100 },
          { label: "Views", align: "right", w: 90 },
          { label: "", w: 160 },
          { label: "vs prev", align: "right", w: 75 },
        ]} />
        <tbody>
          {filtered.length === 0 && (
            <EmptyRow colSpan={5} message="No page view data for this period yet." />
          )}
          {filtered.map((row, i) => {
            const col = rowSectionColors(row.section);
            const barPct = Math.round((row.views / maxViews) * 100);
            return (
              <tr key={i} style={{ borderBottom: "1px solid #F1F5F9", transition: "background 0.1s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#FAFBFF"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                <td style={{ padding: "13px 12px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: F, lineHeight: 1.4, color: "#0F172A" }}>{row.label}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: F_MONO, marginTop: 2 }}>{row.page}</div>
                </td>
                <td style={{ padding: "13px 12px" }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 99,
                    background: col.bg,
                    color: col.text,
                    whiteSpace: "nowrap",
                    fontFamily: F,
                  }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: col.dot }} />
                    {row.section}
                  </span>
                </td>
                <td style={{ textAlign: "right", padding: "13px 12px", fontSize: 14, fontWeight: 700, fontFamily: F, whiteSpace: "nowrap", color: "#0F172A" }}>
                  {row.views.toLocaleString()}
                </td>
                <td style={{ padding: "13px 12px", verticalAlign: "middle" }}>
                  <div style={{ height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${barPct}%`, borderRadius: 3, background: `linear-gradient(90deg, ${col.dot}99, ${col.dot})`, transition: "width 0.3s ease" }} />
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
                    fontFamily: F,
                    whiteSpace: "nowrap",
                  }}>{row.change >= 0 ? "+" : ""}{row.change}%</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

// ── WebsitePageViews ─────────────────────────────────────────────────────────

export function WebsitePageViews({ overview }: { overview: PageViewsOverviewResponse }) {
  const [activeMetric, setActiveMetric] = useState<"views" | "unique" | "sessions">("views");
  
  const data = overview.daily;
  const totals = overview.totals;
  const changes = overview.changes;
  const topPages = overview.topPages;
  const trafficSources = overview.trafficSources;
  const deviceData = overview.devices;

  const fmt = (n: number) => n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n >= 1_000 ? (n / 1_000).toFixed(1) + "K" : String(n);
  const metricColor: Record<string, string> = { views: COLORS.chart1, unique: COLORS.chart2, sessions: COLORS.chart3 };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <MetricCard label="Total views" value={fmt(totals.views)} change={changes.views} sub="vs prev period" icon={<IconEye />} />
        <MetricCard label="Unique visitors" value={fmt(totals.uniqueVisitors)} change={changes.unique} sub="vs prev period" icon={<IconUsers />} />
        <MetricCard label="Sessions" value={fmt(totals.sessions)} change={changes.sessions} sub="vs prev period" icon={<IconActivity />} />
        <MetricCard label="Pages / visit" value={String(totals.avgPagesPerVisit)} change={0} sub="this period" icon={<IconTrending />} />
        <MetricCard label="Bounce rate" value={`${totals.bounceRate}%`} change={changes.bounceRate} sub="vs prev period" icon={<IconPercent />} />
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
          <CardHeader title="Engagement over time" subtitle="Views, unique visitors and sessions over the selected period" />
          <div style={{ display: "flex", gap: 6 }}>
            {(["views", "unique", "sessions"] as const).map((m) => (
              <button key={m} onClick={() => setActiveMetric(m)} style={{
                padding: "5px 12px", fontSize: 11, fontWeight: activeMetric === m ? 600 : 400,
                borderRadius: 8, border: `1px solid ${activeMetric === m ? metricColor[m]! + "60" : "#E2E8F0"}`,
                background: activeMetric === m ? metricColor[m]! + "15" : "transparent",
                color: activeMetric === m ? metricColor[m] : "#64748B",
                cursor: "pointer", fontFamily: F, transition: "all 0.12s",
              }}>
                {m === "unique" ? "Unique" : m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metricColor[activeMetric]} stopOpacity={0.18} />
                <stop offset="95%" stopColor={metricColor[activeMetric]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="0" stroke="#F1F5F9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: F }} axisLine={false} tickLine={false} interval={Math.max(Math.floor(data.length / 8) - 1, 0)} dy={8} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: F }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v)} width={38} />
            <Tooltip contentStyle={TT} formatter={(v) => [Number(v ?? 0).toLocaleString(), activeMetric]} labelStyle={{ marginBottom: 4, fontWeight: 600, fontSize: 12 }} />
            <Area type="monotone" dataKey={activeMetric} stroke={metricColor[activeMetric]} strokeWidth={2.5} fillOpacity={1} fill="url(#cGrad)" dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: metricColor[activeMetric] }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <TopPagesCard topPages={topPages} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Card>
          <CardHeader title="Traffic sources" subtitle="Where visitors are coming from" />
          {trafficSources.length === 0 ? (
            <p style={{ fontSize: 12, color: "#94A3B8", fontFamily: F, margin: 0 }}>No traffic data yet.</p>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <PieChart width={120} height={120}>
                <Pie data={trafficSources} cx={56} cy={56} innerRadius={36} outerRadius={55} dataKey="value" strokeWidth={3} stroke="#FFFFFF">
                  {trafficSources.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {trafficSources.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 9, height: 9, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "#475569", fontFamily: F }}>{s.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: F, color: "#0F172A" }}>{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Devices" subtitle="Views split by device type" />
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={deviceData} margin={{ top: 0, right: 0, left: -18, bottom: 0 }} barSize={22}>
              <CartesianGrid vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="device" tick={{ fontSize: 11, fill: "#64748B", fontFamily: F }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: F }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(Number(v))} />
              <Tooltip contentStyle={TT} formatter={(v) => [Number(v).toLocaleString(), "views"]} cursor={{ fill: "rgba(79,70,229,0.04)" }} />
              <Bar dataKey="views" radius={[6, 6, 0, 0]}>
                {deviceData.map((_, i) => <Cell key={i} fill={[COLORS.chart1, COLORS.chart3, COLORS.chart2][i]} opacity={0.9} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </>
  );
}
