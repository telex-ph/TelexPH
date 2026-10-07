
import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDarkMode } from "@/pages/admin/dashboard/Layout";
import api from "@/lib/api/axios";
import DashboardLoader, { useInitialLoad } from "@/components/DashboardLoader";
import EngagementMetricsCard from "./dashboard/EngagementMetricsCard";
const STAT_CARD_IMAGES = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80&fit=crop",
  // Total views  — analytics
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80&fit=crop",
  // Today       — office/morning
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80&fit=crop",
  // This week   — planning/desk
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80&fit=crop",
  // This month  — growth chart
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&q=80&fit=crop"
  // This year   — cityscape
];
const STAT_CARD_COLORS = [
  "#1e6e4a",
  // Total views  — green
  "#8b0f0f",
  // Today        — deep red
  "#103f9e",
  // This week    — blue
  "#2d5a3d",
  // This month   — dark green
  "#1e3a5a"
  // This year    — navy
];
function AdminPage() {
  const pathname = usePathname();
  const isPageViewsAnalyticsRoute = pathname === "/admin/dashboard/page-views";
  const { isdarkmode } = useDarkMode();
  const [selecteddate, setselecteddate] = useState("2026-01-28");
  const [engagementloading, setengagementloading] = useState(true);
  const [casestudystats, setcasestudystats] = useState({
    totalAllTime: 0,
    totalUnique: 0,
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0
  });
  const [statsloading, setstatsloading] = useState(true);
  const [error, seterror] = useState(null);
  useEffect(() => {
    const fetchCaseStudyStats = async () => {
      try {
        setstatsloading(true);
        seterror(null);
        const response = await api.get("/dashboard/stats/casestudies-summary");
        setcasestudystats(response.data);
      } catch (error2) {
        if (error2.response?.status !== 401) {
          seterror(error2.response?.data?.message || error2.message || "Unknown error");
        }
      } finally {
        setstatsloading(false);
      }
    };
    fetchCaseStudyStats();
  }, []);
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => seterror(null), 5e3);
      return () => clearTimeout(t);
    }
  }, [error]);
  const initialLoading = useInitialLoad(statsloading || engagementloading);
  const stats = [
    {
      label: "Total views",
      value: casestudystats.totalAllTime.toLocaleString(),
      subValue: `${casestudystats.totalUnique.toLocaleString()} unique visitors`,
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
        </svg>
    },
    {
      label: "Today",
      value: casestudystats.daily.toLocaleString(),
      subValue: "Views in the last 24 hours",
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    },
    {
      label: "This week",
      value: casestudystats.weekly.toLocaleString(),
      subValue: "Views in the last 7 days",
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    },
    {
      label: "This month",
      value: casestudystats.monthly.toLocaleString(),
      subValue: "Views in the last 30 days",
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    },
    {
      label: "This year",
      value: casestudystats.yearly.toLocaleString(),
      subValue: "Views in the last 365 days",
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    }
  ];
  const transactions = [
    { customer: "john smith", date: "jan 25, 2026", amount: "$1,240", status: "completed" },
    { customer: "sarah jones", date: "jan 24, 2026", amount: "$890", status: "pending" },
    { customer: "mike wilson", date: "jan 23, 2026", amount: "$2,150", status: "completed" },
    { customer: "emma davis", date: "jan 22, 2026", amount: "$675", status: "completed" }
  ];
  const regions = [
    { country: "united states", percentage: 85 },
    { country: "united kingdom", percentage: 62 },
    { country: "canada", percentage: 45 },
    { country: "australia", percentage: 30 }
  ];
  return <>
      <DashboardLoader isVisible={initialLoading} message="Loading dashboard…" />
      <style dangerouslySetInnerHTML={{ __html: `
        * { font-family: var(--font-body) !important; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }

        /* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
           STAT CARD \u2014 gradient-over-image
        \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .stat-img-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          /* height scales with viewport */
          height: 116px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: default;
        }
        @media (min-width: 480px)  { .stat-img-card { height: 126px; } }
        @media (min-width: 640px)  { .stat-img-card { height: 134px; } }
        @media (min-width: 1024px) { .stat-img-card { height: 144px; } }

        .stat-img-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.26);
        }
        .stat-img-card .card-photo {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.4s ease;
        }
        .stat-img-card:hover .card-photo { transform: scale(1.06); }
        .stat-img-card .card-overlay   { position: absolute; inset: 0; }
        .stat-img-card .card-body {
          position: relative;
          z-index: 3;
          padding: 11px 12px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        @media (min-width: 480px)  { .stat-img-card .card-body { padding: 12px 14px; } }
        @media (min-width: 640px)  { .stat-img-card .card-body { padding: 13px 15px; } }
        @media (min-width: 1024px) { .stat-img-card .card-body { padding: 14px 16px; } }

        .stat-img-card .card-label {
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.92);
        }
        @media (min-width: 480px)  { .stat-img-card .card-label { font-size: 8.5px; } }
        @media (min-width: 640px)  { .stat-img-card .card-label { font-size: 9px; } }
        @media (min-width: 1024px) { .stat-img-card .card-label { font-size: 9.5px; } }

        .stat-img-card .card-icon-btn {
          width: 25px; height: 25px;
          border-radius: 6px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        @media (min-width: 640px)  { .stat-img-card .card-icon-btn { width: 28px; height: 28px; border-radius: 7px; } }
        @media (min-width: 1024px) { .stat-img-card .card-icon-btn { width: 30px; height: 30px; } }

        .stat-img-card .card-value {
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 12px rgba(0,0,0,0.3);
        }
        @media (min-width: 480px)  { .stat-img-card .card-value { font-size: 32px; } }
        @media (min-width: 640px)  { .stat-img-card .card-value { font-size: 36px; } }
        @media (min-width: 1024px) { .stat-img-card .card-value { font-size: 42px; letter-spacing: -1.5px; } }

        .stat-img-card .card-hint {
          font-size: 8.5px;
          font-weight: 400;
          color: rgba(255,255,255,0.7);
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        @media (min-width: 480px)  { .stat-img-card .card-hint { font-size: 9px; } }
        @media (min-width: 640px)  { .stat-img-card .card-hint { font-size: 10px; } }

        .stat-img-card .card-hint-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.72);
          flex-shrink: 0;
          display: inline-block;
        }
        @media (min-width: 640px) { .stat-img-card .card-hint-dot { width: 5px; height: 5px; } }

        /* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
           PERFORMANCE MINI-CARDS
        \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .perf-mini-card {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          transition: all 0.3s;
          padding: 14px;
        }
        @media (min-width: 480px)  { .perf-mini-card { padding: 16px; border-radius: 14px; } }
        @media (min-width: 640px)  { .perf-mini-card { padding: 18px; } }
        @media (min-width: 1024px) { .perf-mini-card { padding: 20px; border-radius: 16px; } }
        .perf-mini-card:hover { box-shadow: 0 20px 40px rgba(0,0,0,0.15); transform: translateY(-2px); }

        .perf-mini-value {
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 8px;
          line-height: 1;
        }
        @media (min-width: 480px)  { .perf-mini-value { font-size: 22px; } }
        @media (min-width: 640px)  { .perf-mini-value { font-size: 24px; } }
        @media (min-width: 1024px) { .perf-mini-value { font-size: 26px; } }

        /* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
           TABLE PADDING
        \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .tbl-th { padding: 10px 14px; font-size: 9px; }
        .tbl-td { padding: 10px 14px; }
        @media (min-width: 480px)  { .tbl-th { padding: 11px 18px; font-size: 9.5px; } .tbl-td { padding: 11px 18px; } }
        @media (min-width: 640px)  { .tbl-th { padding: 12px 22px; font-size: 10px; }  .tbl-td { padding: 12px 22px; } }
        @media (min-width: 1024px) { .tbl-th { padding: 14px 32px; }                   .tbl-td { padding: 14px 32px; } }

        /* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
           CARD PADDING
        \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .card-inner { padding: 16px; }
        @media (min-width: 480px)  { .card-inner { padding: 20px; } }
        @media (min-width: 640px)  { .card-inner { padding: 24px; } }
        @media (min-width: 1024px) { .card-inner { padding: 32px; } }

        .card-hdr { padding: 14px 16px; }
        @media (min-width: 480px)  { .card-hdr { padding: 16px 20px; } }
        @media (min-width: 640px)  { .card-hdr { padding: 18px 24px; } }
        @media (min-width: 1024px) { .card-hdr { padding: 20px 32px; } }
      ` }} />

      <div
    className={`flex flex-col items-start justify-start space-y-5 sm:space-y-6 lg:space-y-8 pt-8 min-h-screen transition-colors duration-500 bg-[var(--admin-bg)]`}
  >
        {
    /* â”€â”€ Error Toast â”€â”€ */
  }
        {error && <div
    className="fixed top-4 right-3 sm:top-8 sm:right-8 bg-red-600 text-white px-5 py-3 sm:px-8 sm:py-5 rounded-lg shadow-2xl z-50 border-2 border-red-500/20"
    style={{ fontSize: 12, fontWeight: 500, maxWidth: "calc(100vw - 24px)" }}
  >
            {error}
          </div>}

        {
    /* â”€â”€ Header â”€â”€ */
  }
        <div className="w-full max-w-7xl mx-auto">
          <PageHeader
    title={isPageViewsAnalyticsRoute ? "Page views analytics" : "Dashboard overview"}
    subtitle={isPageViewsAnalyticsRoute ? "Case study views, engagement, and traffic metrics" : "Key metrics and performance at a glance"}
    style={{ marginBottom: 0 }}
    actions={<input
    type="date"
    value={selecteddate}
    onChange={(e) => setselecteddate(e.target.value)}
    className={`hidden sm:block px-3 sm:px-5 py-2 sm:py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none bg-[var(--admin-bg-soft)] border-[var(--admin-border)] text-[var(--admin-text)] focus:border-[var(--admin-border-strong)]`}
    style={{ fontSize: 11, fontWeight: 400 }}
  />}
  />
        </div>

        {
    /* â”€â”€ Stat Tiles â”€â”€
          < 480px  → 2 cols  (iPhone SE, Galaxy S8+)
          480–639  → 3 cols  (iPhone XR/12/14, Pixel 7, Galaxy A51/71, Surface Duo)
          640–1023 → 3 cols  (iPad Mini, iPad Air, Surface Pro 7, Nest Hub)
          1024+    → 5 cols  (iPad Pro, Asus Zenbook, Nest Hub Max)
    â”€â”€ */
  }
        <div className="w-full max-w-7xl mx-auto grid grid-cols-2 min-[480px]:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 lg:gap-3">
          {stats.map((s, i) => {
    const hex = STAT_CARD_COLORS[i];
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return <div key={i} className="stat-img-card">
                {
      /* Photo layer */
    }
                <div
      className="card-photo"
      style={{ backgroundImage: `url(${STAT_CARD_IMAGES[i]})` }}
    />

                {
      /* Gradient overlay: left solid → right transparent */
    }
                <div
      className="card-overlay"
      style={{
        background: `linear-gradient(to right,
                      rgb(${r},${g},${b}) 0%,
                      rgb(${r},${g},${b}) 38%,
                      rgba(${r},${g},${b},0.82) 55%,
                      rgba(${r},${g},${b},0.45) 72%,
                      rgba(${r},${g},${b},0.12) 100%
                    )`
      }}
    />

                {
      /* Bottom vignette for readability */
    }
                <div
      className="card-overlay"
      style={{
        background: "linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 55%)"
      }}
    />

                {
      /* Content */
    }
                <div className="card-body">
                  {
      /* Top row: label + icon */
    }
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <span className="card-label">{s.label}</span>
                    <div className="card-icon-btn">{s.icon}</div>
                  </div>

                  {
      /* Bottom: value + subtext */
    }
                  <div>
                    <div className="card-value">{s.value}</div>
                    <div className="card-hint">
                      <span className="card-hint-dot" />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {s.subValue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>;
  })}
        </div>

        {
    /* â”€â”€ Performance + Categories â”€â”€ */
  }
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px] gap-3 sm:gap-4">

            <EngagementMetricsCard onLoadingChange={setengagementloading} />

        {
    /* Popular Categories */
  }
          <div
    className={`card-inner rounded-xl border shadow-sm transition-all duration-500 flex flex-col items-center bg-[var(--admin-surface)] border-[var(--admin-border)]`}
  >
            <div className="w-full" style={{ marginBottom: 20 }}>
              <p
    className={`transition-colors text-[var(--admin-text)]`}
    style={{ fontSize: 13, fontWeight: 600, margin: 0 }}
  >
                Popular Categories
              </p>
              <p
    className={`mt-1 transition-colors text-[var(--admin-text-faint)]`}
    style={{ fontSize: 11, fontWeight: 400, margin: "3px 0 0" }}
  >
                Top content categories by engagement
              </p>
            </div>

            {
    /* Donut */
  }
            <div style={{ position: "relative", width: "min(160px, 44vw)", height: "min(160px, 44vw)", marginBottom: 22 }}>
              <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="18" cy="18" r="16" fill="none" stroke={"var(--admin-bg-hover)"} strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="var(--admin-accent)" strokeWidth="4" strokeDasharray="75, 100" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="15, 100" strokeDashoffset="-75" />
              </svg>
              <div style={{
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }}>
                <span
    className={`transition-colors text-[var(--admin-text)]`}
    style={{ fontSize: 22, fontWeight: 700 }}
  >
                  82%
                </span>
                <span
    className={`uppercase tracking-widest transition-colors text-[var(--admin-text-faint)]`}
    style={{ fontSize: 9, fontWeight: 500 }}
  >
                  Growth
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-4">
              {[
    { label: "Appliances", pct: "75%", color: "var(--admin-accent)" },
    { label: "Accessories", pct: "15%", color: "#f97316" }
  ].map((cat, i) => <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                    <span
    className={`transition-colors text-[var(--admin-text-sub)]`}
    style={{ fontSize: 11, fontWeight: 400 }}
  >
                      {cat.label}
                    </span>
                  </div>
                  <span
    className={`transition-colors text-[var(--admin-text)]`}
    style={{ fontSize: 11, fontWeight: 600 }}
  >
                    {cat.pct}
                  </span>
                </div>)}
            </div>
          </div>
        </div>

        {
    /* â”€â”€ Bottom Row: Transactions + Regional â”€â”€ */
  }
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 pb-6 sm:pb-8">

          {
    /* Recent Transactions */
  }
          <div
    className={`rounded-xl border shadow-sm transition-all duration-500 overflow-hidden bg-[var(--admin-surface)] border-[var(--admin-border)]`}
  >
            {
    /* Card Header */
  }
            <div
    className={`card-hdr flex items-center justify-between border-b transition-all duration-500 bg-[var(--admin-bg-soft)] border-[var(--admin-border)]`}
  >
              <div>
                <p
    className={`transition-colors text-[var(--admin-text)]`}
    style={{ fontSize: 13, fontWeight: 600, margin: 0 }}
  >
                  Recent transactions
                </p>
                <p
    className={`mt-1 transition-colors text-[var(--admin-text-faint)]`}
    style={{ fontSize: 11, fontWeight: 400, margin: "3px 0 0" }}
  >
                  Latest customer orders and payments
                </p>
              </div>
              <button
    className="px-3 sm:px-4 py-1.5 rounded-lg bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)] transition-all shrink-0"
    style={{ fontSize: 10, fontWeight: 500 }}
  >
                View all
              </button>
            </div>

            {
    /* Table */
  }
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 340 }}>
                <thead>
                  <tr className={`border-b transition-all duration-500 border-[var(--admin-border)]`}>
                    {["Customer", "Date", "Amount", "Status"].map((col) => <th
    key={col}
    className={`tbl-th text-left uppercase tracking-widest transition-colors text-[var(--admin-text-faint)]`}
    style={{ fontWeight: 500 }}
  >
                        {col}
                      </th>)}
                  </tr>
                </thead>
                <tbody className={`divide-y transition-all duration-500 divide-[var(--admin-border)]`}>
                  {transactions.map((t, i) => <tr
    key={i}
    className={`transition-all duration-300 hover:bg-[var(--admin-bg-hover)]`}
  >
                      <td className="tbl-td">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div
    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--admin-bg-hover)]`}
    style={{ fontSize: 9, fontWeight: 600, color: "var(--admin-accent)", textTransform: "uppercase" }}
  >
                            {t.customer.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <p
    className={`transition-colors text-[var(--admin-text)] whitespace-nowrap`}
    style={{ fontSize: 11, fontWeight: 500, margin: 0, textTransform: "capitalize" }}
  >
                            {t.customer}
                          </p>
                        </div>
                      </td>
                      <td className="tbl-td">
                        <p
    className={`transition-colors text-[var(--admin-text-faint)] whitespace-nowrap`}
    style={{ fontSize: 11, fontWeight: 400, margin: 0 }}
  >
                          {t.date}
                        </p>
                      </td>
                      <td className="tbl-td">
                        <p
    className={`transition-colors text-[var(--admin-text)]`}
    style={{ fontSize: 12, fontWeight: 600, margin: 0 }}
  >
                          {t.amount}
                        </p>
                      </td>
                      <td className="tbl-td">
                        <span
    className={`px-3 py-1.5 rounded-md whitespace-nowrap ${t.status === "completed" ? "bg-[#00A651] text-white" : "bg-[#B45309] text-white"}`}
    style={{ fontSize: 10, fontWeight: 500 }}
  >
                          {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                        </span>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>

          {
    /* Regional Performance */
  }
          <div
    className={`rounded-xl border shadow-sm transition-all duration-500 overflow-hidden bg-[var(--admin-surface)] border-[var(--admin-border)]`}
  >
            {
    /* Card Header */
  }
            <div
    className={`card-hdr flex items-center justify-between border-b transition-all duration-500 bg-[var(--admin-bg-soft)] border-[var(--admin-border)]`}
  >
              <div>
                <p
    className={`transition-colors text-[var(--admin-text)]`}
    style={{ fontSize: 13, fontWeight: 600, margin: 0 }}
  >
                  Regional performance
                </p>
                <p
    className={`mt-1 transition-colors text-[var(--admin-text-faint)]`}
    style={{ fontSize: 11, fontWeight: 400, margin: "3px 0 0" }}
  >
                  Traffic breakdown by country
                </p>
              </div>
            </div>

            {
    /* Table */
  }
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 280 }}>
                <thead>
                  <tr className={`border-b transition-all duration-500 border-[var(--admin-border)]`}>
                    {["Country", "Share", "Progress"].map((col) => <th
    key={col}
    className={`tbl-th text-left uppercase tracking-widest transition-colors text-[var(--admin-text-faint)]`}
    style={{ fontWeight: 500 }}
  >
                        {col}
                      </th>)}
                  </tr>
                </thead>
                <tbody className={`divide-y transition-all duration-500 divide-[var(--admin-border)]`}>
                  {regions.map((reg, i) => <tr
    key={i}
    className={`transition-all duration-300 hover:bg-[var(--admin-bg-hover)]`}
  >
                      <td className="tbl-td">
                        <p
    className={`uppercase tracking-wide transition-colors text-[var(--admin-text)] whitespace-nowrap`}
    style={{ fontSize: 11, fontWeight: 500, margin: 0 }}
  >
                          {reg.country}
                        </p>
                      </td>
                      <td className="tbl-td">
                        <p
    className={`transition-colors text-[var(--admin-text-sub)]`}
    style={{ fontSize: 12, fontWeight: 600, margin: 0 }}
  >
                          {reg.percentage}%
                        </p>
                      </td>
                      <td className="tbl-td" style={{ minWidth: 100 }}>
                        <div
    style={{
      height: 6,
      width: "100%",
      borderRadius: 99,
      background: "var(--admin-bg-hover)",
      overflow: "hidden"
    }}
  >
                          <div
    style={{
      height: "100%",
      width: `${reg.percentage}%`,
      background: "var(--admin-accent)",
      borderRadius: 99,
      transition: "width .4s ease"
    }}
  />
                        </div>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>;
}
export {
  AdminPage as default
};
