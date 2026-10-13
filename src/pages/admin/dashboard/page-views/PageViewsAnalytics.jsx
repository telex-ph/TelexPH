
import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import DashboardLoader, { useInitialLoad } from "@/components/DashboardLoader";
import api from "@/lib/api/axios";
import { WebsitePageViews, COLORS, F } from "./WebsitePageViews";
import { FunnelsTab } from "./FunnelsTab";
import { VisitorJourneyTracker } from "./VisitorJourneyTracker";
const IconDownload = () => <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>;
function RangeToggle({ value, onChange }) {
  return <div style={{
    display: "inline-flex",
    background: "var(--admin-bg-soft)",
    borderRadius: 12,
    padding: 3,
    gap: 2
  }}>
      {["7d", "30d", "90d"].map((o) => <button key={o} onClick={() => onChange(o)} style={{
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
  }}>
          {o}
        </button>)}
    </div>;
}
function DownloadBtn({ onClick, label = "Export CSV", disabled }) {
  return <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "8px 16px",
      fontSize: 12,
      fontWeight: 500,
      background: "var(--admin-surface)",
      border: "1px solid var(--admin-border)",
      borderRadius: 10,
      color: disabled ? "var(--admin-text-faint)" : "var(--admin-text-sub)",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: F,
      whiteSpace: "nowrap",
      opacity: disabled ? 0.5 : 1,
      transition: "all 0.15s ease",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = "var(--admin-bg-soft)";
        e.currentTarget.style.borderColor = "var(--admin-border-strong)";
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = "var(--admin-surface)";
        e.currentTarget.style.borderColor = "var(--admin-border)";
      }
    }}
  >
      <IconDownload />
      {label}
    </button>;
}
function downloadCSV(filename, headers, rows) {
  const escape = (v) => {
    const s = String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const allRows = headers.length ? [headers, ...rows] : rows;
  const csv = allRows.map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
const EMPTY_OVERVIEW = {
  daily: [],
  totals: { views: 0, uniqueVisitors: 0, sessions: 0, avgPagesPerVisit: 0, bounceRate: 0 },
  changes: { views: 0, unique: 0, sessions: 0, bounceRate: 0 },
  topPages: [],
  trafficSources: [],
  devices: [],
  funnels: []
};
function normalizeOverview(data) {
  return {
    daily: data.daily ?? [],
    totals: { ...EMPTY_OVERVIEW.totals, ...data.totals },
    changes: { ...EMPTY_OVERVIEW.changes, ...data.changes },
    topPages: data.topPages ?? [],
    trafficSources: data.trafficSources ?? [],
    devices: data.devices ?? [],
    funnels: data.funnels ?? []
  };
}
function PageViewsAnalytics() {
  const [tab, setTab] = useState("visitors");
  const [range, setRange] = useState("30d");
  const [overview, setOverview] = useState(EMPTY_OVERVIEW);
  const [loading, setLoading] = useState(true);
  const initialLoading = useInitialLoad(loading);
  const [loadError, setLoadError] = useState(null);
  const [downloadingVisitors, setDownloadingVisitors] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    api.get("/dashboard/page-views", { params: { range } }).then((res) => {
      if (!cancelled) {
        setOverview(normalizeOverview(res.data));
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setLoadError("Could not load analytics. Check that you are signed in and the API is reachable.");
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [range]);
  const funnels = overview.funnels;
  const handleDownloadPageViews = () => {
    const rows = [
      ["=== Traffic Over Time ==="],
      ["Date", "Views", "Unique Visitors", "Sessions"],
      ...overview.daily.map((d) => [d.date, d.views, d.unique, d.sessions])
    ];
    downloadCSV(`page-views-${range}.csv`, [], rows);
  };
  const handleDownloadFunnels = () => {
    const sorted = [...funnels].sort((a, b) => b.views - a.views);
    downloadCSV(
      `funnel-clicks-${range}.csv`,
      ["Funnel Name", "URL", "Clicks", "Unique Visitors", "Change (%)"],
      sorted.map((f) => [f.name, f.url, f.views, f.unique, f.change])
    );
  };
  const handleDownloadVisitors = async () => {
    setDownloadingVisitors(true);
    try {
      const res = await api.get("/dashboard/page-views/visitors/download", {
        params: { range },
        responseType: "blob"
      });
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `visitor-journey-${range}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingVisitors(false);
    }
  };
  const TABS = [
    { label: "Visitor Journey", value: "visitors", badge: overview.totals.uniqueVisitors },
    { label: "Website Page Views", value: "pageviews", badge: overview.totals.views },
    { label: "Funnels", value: "funnels", badge: funnels.length }
  ];
  return <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: var(--admin-bg-soft); }
        ::-webkit-scrollbar-thumb { background: var(--admin-border-strong); border-radius: 3px; }
        input[type="search"]::-webkit-search-cancel-button { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ fontFamily: F, color: "var(--admin-text)", paddingTop: 32, display: "flex", flexDirection: "column", gap: "1.25rem", animation: "fadeIn 0.3s ease" }}>

        {
    /* ── Header ── */
  }
        <PageHeader title="Analytics Dashboard" subtitle="Track performance, funnels & visitor journeys" style={{ marginBottom: 4 }} actions={<>
            {tab === "pageviews" && <DownloadBtn onClick={handleDownloadPageViews} label="Export Views" disabled={!overview} />}
            {tab === "funnels" && <DownloadBtn onClick={handleDownloadFunnels} label="Export CSV" disabled={funnels.length === 0} />}
            {tab === "visitors" && <DownloadBtn onClick={handleDownloadVisitors} label={downloadingVisitors ? "Downloading\u2026" : "Export Visitors"} disabled={downloadingVisitors} />}
            <RangeToggle value={range} onChange={setRange} />
        </>} />

        {loadError && <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "color-mix(in srgb, #DC2626 14%, transparent)", border: "1px solid color-mix(in srgb, #DC2626 35%, transparent)", borderRadius: 12 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="1.5" /><path d="M12 8v4M12 16h.01" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <p style={{ fontSize: 13, color: "#DC2626", fontFamily: F, margin: 0 }}>{loadError}</p>
          </div>}

        {
    /* ── Tabs ── */
  }
        <div style={{ display: "flex", gap: 4, background: "var(--admin-bg-soft)", borderRadius: 14, padding: 4, width: "fit-content" }}>
          {TABS.map((t) => <button
    key={t.value}
    onClick={() => setTab(t.value)}
    style={{
      padding: "8px 18px",
      fontSize: 13,
      fontWeight: tab === t.value ? 600 : 400,
      background: tab === t.value ? "var(--admin-surface)" : "transparent",
      border: "none",
      borderRadius: 10,
      color: tab === t.value ? "var(--admin-text)" : "var(--admin-text-faint)",
      cursor: "pointer",
      fontFamily: F,
      display: "flex",
      alignItems: "center",
      gap: 7,
      transition: "all 0.15s",
      boxShadow: tab === t.value ? "0 1px 4px rgba(0,0,0,0.1)" : "none"
    }}
  >
              {t.label}
              {t.badge !== void 0 && <span style={{
    fontSize: 10,
    fontWeight: 700,
    padding: "1px 7px",
    borderRadius: 99,
    background: tab === t.value ? COLORS.primaryMuted : "var(--admin-border)",
    color: tab === t.value ? COLORS.primary : "var(--admin-text-faint)",
    fontFamily: F,
    lineHeight: 1.7
  }}>
                  {initialLoading ? "\u2026" : t.badge}
                </span>}
            </button>)}
        </div>

        {
    /* ── Loading state ── */
  }
        <DashboardLoader isVisible={initialLoading} message="Loading analytics…" />

        {
    /* ── Page Views Tab ── */
  }
        {tab === "pageviews" && !initialLoading && <WebsitePageViews overview={overview} />}

        {
    /* ── Funnels Tab ── */
  }
        {tab === "funnels" && !initialLoading && <FunnelsTab range={range} onRangeChange={setRange} funnels={funnels} />}

        {
    /* ── Visitor Journey Tab ── */
  }
        {tab === "visitors" && !initialLoading && <VisitorJourneyTracker range={range} />}
      </div>
    </>;
}
export {
  PageViewsAnalytics as default
};
