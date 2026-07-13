'use client'

import { useState, useEffect } from "react";
import api from "@/lib/api/axios";
import { WebsitePageViews, PageViewsOverviewResponse, COLORS, F } from "./WebsitePageViews";
import { FunnelsTab } from "./FunnelsTab";
import { VisitorJourneyTracker, MOCK_VISITORS } from "./VisitorJourneyTracker";

export type Range = "7d" | "30d" | "90d";
export type Tab = "pageviews" | "funnels" | "visitors";

// ── Icons ───────────────────────────────────────────────────────────
const IconDownload = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ── Shared UI ───────────────────────────────────────────────────────
function RangeToggle({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  return (
    <div style={{
      display: "inline-flex",
      background: "#F1F5F9",
      borderRadius: 12,
      padding: 3,
      gap: 2,
    }}>
      {(["7d", "30d", "90d"] as Range[]).map((o) => (
        <button key={o} onClick={() => onChange(o)} style={{
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
          boxShadow: value === o ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
        }}>
          {o}
        </button>
      ))}
    </div>
  );
}

function DownloadBtn({ onClick, label = "Export CSV", disabled }: { onClick: () => void; label?: string; disabled?: boolean }) {
  return (
    <button
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
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 10,
        color: disabled ? "#94A3B8" : "#475569",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: F,
        whiteSpace: "nowrap",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s ease",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => { if (!disabled) { (e.currentTarget as HTMLElement).style.background = "#F8FAFC"; (e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1"; } }}
      onMouseLeave={(e) => { if (!disabled) { (e.currentTarget as HTMLElement).style.background = "#FFFFFF"; (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"; } }}
    >
      <IconDownload />
      {label}
    </button>
  );
}
// ── Utils ─────────────────────────────────────────────────────────────────────
function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const allRows = headers.length ? [headers, ...rows] : rows;
  const csv = allRows.map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

// Mock data for demo
const MOCK_OVERVIEW: PageViewsOverviewResponse = {
  range: "30d",
  daily: Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      dateKey: d.toISOString().split("T")[0]!,
      views: Math.floor(1200 + Math.random() * 800),
      unique: Math.floor(700 + Math.random() * 400),
      sessions: Math.floor(900 + Math.random() * 500),
    };
  }),
  totals: { views: 38420, uniqueVisitors: 18650, sessions: 25340, avgPagesPerVisit: 3.2, bounceRate: 41.5 },
  changes: { views: 12.4, unique: 8.7, sessions: 10.2, bounceRate: -3.1 },
  topPages: [
    { page: "/", label: "Homepage", section: "Home", views: 12800, change: 15.2 },
    { page: "/services", label: "Our Services", section: "Services", views: 7340, change: 8.1 },
    { page: "/about", label: "About Us", section: "About", views: 4210, change: -2.4 },
    { page: "/contact", label: "Contact", section: "Other", views: 3620, change: 22.7 },
    { page: "/pricing", label: "Pricing Plans", section: "Services", views: 3100, change: 18.5 },
    { page: "/blog", label: "Resources & Blog", section: "Resources", views: 2850, change: 6.3 },
    { page: "/careers", label: "Join Our Team", section: "Careers", views: 1400, change: -5.8 },
    { page: "/why-us", label: "Why Choose Us", section: "Why Us", views: 1100, change: 11.0 },
  ],
  trafficSources: [
    { name: "Organic Search", value: 42, color: COLORS.chart1 },
    { name: "Direct", value: 28, color: COLORS.chart2 },
    { name: "Social Media", value: 18, color: COLORS.chart3 },
    { name: "Referral", value: 12, color: COLORS.chart4 },
  ],
  devices: [
    { device: "Desktop", views: 22000 },
    { device: "Mobile", views: 13500 },
    { device: "Tablet", views: 2920 },
  ],
  funnels: [
    { name: "AI Builder", url: "https://preview.ghl/ai-builder", views: 8400, unique: 6200, conversions: 642, convRate: 7.64, change: 21.4, color: COLORS.chart1 },
    { name: "Automation", url: "https://preview.ghl/automation", views: 7100, unique: 5800, conversions: 548, convRate: 7.71, change: 12.2, color: COLORS.chart2 },
    { name: "Booking & Appointment", url: "https://preview.ghl/booking", views: 6100, unique: 4800, conversions: 348, convRate: 5.71, change: -3.2, color: COLORS.chart3 },
    { name: "Courses/Products", url: "https://preview.ghl/courses", views: 5250, unique: 4100, conversions: 490, convRate: 9.33, change: 14.6, color: COLORS.chart4 },
    { name: "CRM", url: "https://preview.ghl/crm", views: 4700, unique: 3900, conversions: 281, convRate: 5.98, change: 6.8, color: COLORS.chart5 },
    { name: "CSR", url: "https://preview.ghl/csr", views: 4200, unique: 3100, conversions: 224, convRate: 5.33, change: 11.2, color: COLORS.chart1 },
    { name: "Document Signing", url: "https://preview.ghl/document-signing", views: 3800, unique: 2800, conversions: 190, convRate: 5.00, change: 4.5, color: COLORS.chart2 },
    { name: "Email Marketing", url: "https://preview.ghl/email-marketing", views: 3500, unique: 2500, conversions: 175, convRate: 5.00, change: 8.1, color: COLORS.chart3 },
    { name: "Gray-Label", url: "https://preview.ghl/gray-label", views: 3100, unique: 2100, conversions: 124, convRate: 4.00, change: 2.2, color: COLORS.chart4 },
    { name: "Funnel Builder", url: "https://preview.ghl/funnel-builder", views: 2900, unique: 1900, conversions: 150, convRate: 5.17, change: 18.4, color: COLORS.chart5 },
    { name: "SMS", url: "https://preview.ghl/sms", views: 2600, unique: 1600, conversions: 110, convRate: 4.23, change: 3.4, color: COLORS.chart1 },
    { name: "Social Media Management", url: "https://preview.ghl/social-media", views: 2400, unique: 1500, conversions: 100, convRate: 4.16, change: 7.2, color: COLORS.chart2 },
    { name: "Surveys & Forms", url: "https://preview.ghl/surveys", views: 2100, unique: 1200, conversions: 80, convRate: 3.81, change: -1.2, color: COLORS.chart3 },
    { name: "Tech Support", url: "https://preview.ghl/tech-support", views: 1800, unique: 1000, conversions: 65, convRate: 3.61, change: 5.5, color: COLORS.chart4 },
    { name: "Video & Graphics Design", url: "https://preview.ghl/video-graphics", views: 1500, unique: 800, conversions: 45, convRate: 3.00, change: 2.1, color: COLORS.chart5 },
    { name: "Web Development", url: "https://preview.ghl/web-development", views: 1200, unique: 600, conversions: 30, convRate: 2.50, change: 1.5, color: COLORS.chart1 },
    { name: "Website Builder", url: "https://preview.ghl/website-builder", views: 900, unique: 400, conversions: 20, convRate: 2.22, change: -0.5, color: COLORS.chart2 },
    { name: "White-Label", url: "https://preview.ghl/white-label", views: 600, unique: 200, conversions: 10, convRate: 1.66, change: 0.0, color: COLORS.chart3 },
  ],
};

export default function PageViewsAnalytics() {
  const [tab, setTab] = useState<Tab>("visitors");
  const [range, setRange] = useState<Range>("30d");
  const [overview, setOverview] = useState<PageViewsOverviewResponse>(MOCK_OVERVIEW);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [downloadingVisitors, setDownloadingVisitors] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    api
      .get<PageViewsOverviewResponse>("/dashboard/page-views", { params: { range } })
      .then((res) => {
        if (!cancelled) {
          setOverview(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError("Could not load analytics. Check that you are signed in and the API is reachable.");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [range]);

  // Fallback to mock data if there are no real funnel views yet
  const funnels = overview.funnels.length > 0 ? overview.funnels : MOCK_OVERVIEW.funnels;

  const handleDownloadPageViews = () => {
    const rows: (string | number)[][] = [
      ["=== Traffic Over Time ==="],
      ["Date", "Views", "Unique Visitors", "Sessions"],
      ...overview.daily.map((d) => [d.date, d.views, d.unique, d.sessions]),
    ];
    downloadCSV(`page-views-${range}.csv`, [], rows);
  };

  const handleDownloadFunnels = () => {
    const sorted = [...funnels].sort((a, b) => b.views - a.views);
    downloadCSV("ghl-funnels.csv",
      ["Funnel Name", "URL", "Views", "Unique Visitors", "Conversions", "Conv. Rate (%)", "Change (%)"],
      sorted.map((f) => [f.name, f.url, f.views, f.unique, f.conversions, f.convRate, f.change])
    );
  };

  const handleDownloadVisitors = async () => {
    setDownloadingVisitors(true);
    try {
      const res = await api.get("/dashboard/page-views/visitors/download", {
        params: { range },
        responseType: "blob",
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

  const TABS: { label: string; value: Tab; badge?: number }[] = [
    { label: "Visitor Journey", value: "visitors", badge: overview.totals.uniqueVisitors },
    { label: "Website Page Views", value: "pageviews", badge: overview.totals.views },
    { label: "Funnels", value: "funnels", badge: funnels.length },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #F1F5F9; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        input[type="search"]::-webkit-search-cancel-button { display: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ fontFamily: F, color: "#0F172A", display: "flex", flexDirection: "column", gap: "1.25rem", animation: "fadeIn 0.3s ease" }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          paddingBottom: 20,
          borderBottom: "1px solid #E2E8F0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 13,
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(79,70,229,0.25)",
            }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M18 20V10M12 20V4M6 20v-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, fontFamily: F, letterSpacing: "-0.5px", color: "#0F172A" }}>
                Analytics Dashboard
              </h2>
              <p style={{ fontSize: 12, color: "#94A3B8", margin: "3px 0 0", fontFamily: F }}>
                Track performance, funnels & visitor journeys
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {tab === "pageviews" && <DownloadBtn onClick={handleDownloadPageViews} label="Export Views" disabled={!overview} />}
            {tab === "funnels" && <DownloadBtn onClick={handleDownloadFunnels} label="Export CSV" disabled={funnels.length === 0} />}
            {tab === "visitors" && <DownloadBtn onClick={handleDownloadVisitors} label={downloadingVisitors ? "Downloading…" : "Export Visitors"} disabled={downloadingVisitors} />}
            <RangeToggle value={range} onChange={setRange} />
          </div>
        </div>

        {loadError && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 12 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="1.5" /><path d="M12 8v4M12 16h.01" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <p style={{ fontSize: 13, color: "#DC2626", fontFamily: F, margin: 0 }}>{loadError}</p>
          </div>
        )}

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 4, background: "#F1F5F9", borderRadius: 14, padding: 4, width: "fit-content" }}>
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              style={{
                padding: "8px 18px",
                fontSize: 13,
                fontWeight: tab === t.value ? 600 : 400,
                background: tab === t.value ? "#FFFFFF" : "transparent",
                border: "none",
                borderRadius: 10,
                color: tab === t.value ? "#0F172A" : "#64748B",
                cursor: "pointer",
                fontFamily: F,
                display: "flex", alignItems: "center", gap: 7,
                transition: "all 0.15s",
                boxShadow: tab === t.value ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {t.label}
              {t.badge !== undefined && (
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  padding: "1px 7px", borderRadius: 99,
                  background: tab === t.value ? COLORS.primaryMuted : "#E2E8F0",
                  color: tab === t.value ? COLORS.primary : "#64748B",
                  fontFamily: F, lineHeight: 1.7,
                }}>
                  {loading ? "…" : t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Loading state ── */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "24px 0" }}>
            <div style={{ width: 16, height: 16, border: "2px solid #E2E8F0", borderTopColor: COLORS.primary, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <p style={{ fontSize: 13, color: "#94A3B8", fontFamily: F, margin: 0 }}>Loading analytics…</p>
          </div>
        )}

        {/* ── Page Views Tab ── */}
        {tab === "pageviews" && !loading && (
          <WebsitePageViews overview={overview} />
        )}

        {/* ── Funnels Tab ── */}
        {tab === "funnels" && !loading && (
          <FunnelsTab range={range} onRangeChange={setRange} />
        )}

        {/* ── Visitor Journey Tab ── */}
        {tab === "visitors" && !loading && <VisitorJourneyTracker range={range} />}
      </div>
    </>
  );
}
