
import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import DashboardLoader, { useInitialLoad } from "@/components/DashboardLoader";
import EditBlogs from "./EditBlogs";
import { useDarkMode } from "@/pages/admin/dashboard/Layout";
import { htmlToText, toHtml } from "@/lib/rich-text";
import { StatTile, MiniCalendar, CalendarModal, DateModal } from "./BlogOverview";
function ListBlogs() {
  const [blogs, setblogs] = useState([]);
  const [activetab, setactivetab] = useState("All");
  const [viewmode, setviewmode] = useState("grid");
  const [blogtoarchive, setblogtoarchive] = useState(null);
  const [isediting, setisediting] = useState(false);
  const [selectedblog, setselectedblog] = useState(null);
  const [viewingblog, setviewingblog] = useState(null);
  const [currentpage, setcurrentpage] = useState(1);
  const cardsperpage = 8;
  const [search, setsearch] = useState("");
  const [showcalendar, setshowcalendar] = useState(false);
  const [selecteddate, setselecteddate] = useState("");
  const [calmonth, setcalmonth] = useState(new Date().getMonth());
  const [sortby, setsortby] = useState("date-newest");
  const [isloading, setisloading] = useState(true);
  const initialLoading = useInitialLoad(isloading);
  const [error, seterror] = useState(null);
  const [selectedmaincategory, setselectedmaincategory] = useState("All");
  const [selectedsubcategory, setselectedsubcategory] = useState("All");
  const { isdarkmode } = useDarkMode();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
  const categories = {
    "Main Service Categories": ["Customer Experience (CX)", "Back Office Solutions", "Virtual Assistance", "Sales & Lead Generation"],
    "Industry-Specific Insights": ["E-commerce Support", "Real Estate Outsourcing", "Healthcare BPO", "Tech & SaaS Scaling"],
    "Business Growth & Strategy": ["Scale Smarter", "Outsourcing 101", "Cost Optimization"],
    "Company Culture & Updates": ["TelexPH Life", "News & Press Releases"]
  };
  const mainCategories = Object.keys(categories);
  const statusTabs = [
    { label: "All", value: "All" },
    { label: "Published", value: "Published" },
    { label: "Draft", value: "Draft" },
    { label: "Scheduled", value: "Scheduled" }
  ];
  const getAvailableSubcategories = () => {
    if (selectedmaincategory === "All") return Object.values(categories).flat();
    return categories[selectedmaincategory] || [];
  };
  const loadblogs = async () => {
    try {
      setisloading(true);
      seterror(null);
      const queryParams = new URLSearchParams();
      if (selectedmaincategory !== "All") queryParams.append("mainCategory", selectedmaincategory);
      if (selectedsubcategory !== "All") queryParams.append("subcategory", selectedsubcategory);
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/blogs${queryString ? `?${queryString}` : ""}`;
      const response = await fetch(url, { method: "GET", credentials: "include", headers: { "Content-Type": "application/json" } });
      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized - Please login again");
        throw new Error(`Failed to fetch blogs: ${response.status}`);
      }
      const data = await response.json();
      setblogs(data.filter((b) => b.isArchive !== true));
    } catch (err) {
      seterror(err.message || "Failed to load blogs. Please try again later.");
      setblogs([]);
    } finally {
      setisloading(false);
    }
  };
  useEffect(() => {
    loadblogs();
  }, [selectedmaincategory, selectedsubcategory]);
  useEffect(() => {
    setcurrentpage(1);
  }, [activetab, selectedmaincategory, selectedsubcategory, search, sortby]);
  useEffect(() => {
    if (selectedmaincategory !== "All") {
      const avail = getAvailableSubcategories();
      if (selectedsubcategory !== "All" && !avail.includes(selectedsubcategory)) setselectedsubcategory("All");
    }
  }, [selectedmaincategory]);
  const getstatusstyles = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "bg-[var(--admin-accent)] text-white";
      case "scheduled":
        return "bg-[#FF4500] text-white";
      case "draft":
        return "bg-[#ca8a04] text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };
  const formatdate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  const calculatereadingtime = (content) => {
    if (!content || !Array.isArray(content)) return 5;
    const totalwords = content.reduce((acc, section) => acc + htmlToText(section.content).split(/\s+/).length, 0);
    return Math.max(1, Math.ceil(totalwords / 200));
  };
  const getCategoryIcon = (mainCategory) => {
    const iconMap = {
      "Main Service Categories": "\u{1F3AF}",
      "Industry-Specific Insights": "\u{1F4BC}",
      "Business Growth & Strategy": "\u{1F4C8}",
      "Company Culture & Updates": "\u{1F3E2}"
    };
    return iconMap[mainCategory] || "\u{1F4DD}";
  };
  const q = search.trim().toLowerCase();
  const filteredblogs = blogs.filter((blog) => (activetab === "All" || (blog.status || "").toLowerCase() === activetab.toLowerCase()) && (!q || [blog.title, blog.author, blog.shortDescription].some((v) => (v || "").toLowerCase().includes(q)))).sort((a, b) => sortby === "alpha-asc" ? (a.title || "").localeCompare(b.title || "") : sortby === "alpha-desc" ? (b.title || "").localeCompare(a.title || "") : sortby === "date-oldest" ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt));
  const totalPages = Math.ceil(filteredblogs.length / cardsperpage);
  const indexOfLastCard = currentpage * cardsperpage;
  const indexOfFirstCard = indexOfLastCard - cardsperpage;
  const currentblogs = filteredblogs.slice(indexOfFirstCard, indexOfLastCard);
  const handlePageChange = (pageNumber) => {
    setcurrentpage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleedit = (blog) => {
    setselectedblog(blog);
    setisediting(true);
  };
  const closeeditmodal = () => {
    setisediting(false);
    setselectedblog(null);
  };
  const handleview = (blog) => {
    setviewingblog(blog);
  };
  const closeviewmodal = () => {
    setviewingblog(null);
  };
  const handlearchive = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}/archive`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" } });
      if (!response.ok) throw new Error("Failed to archive blog");
      await loadblogs();
      setblogtoarchive(null);
    } catch (err) {
      alert(err.message || "Failed to archive blog");
    }
  };
  const confirmarchive = (id) => {
    setblogtoarchive(id);
  };
  const cancelarchive = () => {
    setblogtoarchive(null);
  };
  const publishedCount = blogs.filter((b) => b.status?.toLowerCase() === "published").length;
  const draftCount = blogs.filter((b) => b.status?.toLowerCase() === "draft").length;
  const scheduledCount = blogs.filter((b) => b.status?.toLowerCase() === "scheduled").length;
  if (isediting && selectedblog) {
    return <EditBlogs blog={selectedblog} onClose={closeeditmodal} onSave={loadblogs} />;
  }
  const dark = isdarkmode;
  const subtleBg = dark ? "rgba(255,255,255,0.03)" : "#f9fafb";
  const borderColor = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const textPrimary = dark ? "#f0f0f0" : "#1f2937";
  const textSecondary = dark ? "#9ca3af" : "#374151";
  const textMuted = "#6b7280";
  const card = { background: "var(--admin-surface)", border: `1px solid ${borderColor}`, borderRadius: 16, boxShadow: dark ? "0 1px 6px rgba(0,0,0,.4)" : "0 1px 6px rgba(0,0,0,.06)" };
  const inp = (o = {}) => ({ width: "100%", padding: "8px 11px", borderRadius: 8, border: `1px solid ${borderColor}`, background: dark ? "#161616" : "#fff", color: textPrimary, fontSize: 11, outline: "none", boxSizing: "border-box", ...o });
  const pill = (sel) => ({ padding: "3px 11px", borderRadius: 20, fontSize: 10, fontWeight: 500, cursor: "pointer", transition: "all .15s", border: sel ? "1px solid color-mix(in srgb, var(--admin-accent) 30%, transparent)" : `1px solid ${borderColor}`, background: sel ? "color-mix(in srgb, var(--admin-accent) 9%, transparent)" : subtleBg, color: sel ? "var(--admin-accent)" : textMuted });
  const ghostBtn = { padding: "4px 9px", borderRadius: 7, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, fontSize: 10, fontWeight: 500, cursor: "pointer" };
  const dangerBtn = { padding: "4px 8px", borderRadius: 7, border: "1px solid rgba(202,138,4,0.3)", background: "rgba(202,138,4,0.08)", color: "#ca8a04", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center" };
  const tagStyle = { fontSize: 8, fontWeight: 500, padding: "2px 7px", borderRadius: 4, background: subtleBg, border: `1px solid ${borderColor}`, color: textMuted };
  const archiveIcon = <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
  const statusStyle = (s) => {
    switch (s?.toLowerCase()) {
      case "published": return { bg: "color-mix(in srgb, var(--admin-accent) 10%, transparent)", color: "var(--admin-accent)", border: "1px solid color-mix(in srgb, var(--admin-accent) 25%, transparent)" };
      case "scheduled": return { bg: "rgba(124,58,237,0.09)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.22)" };
      case "draft": return { bg: "rgba(100,100,100,0.09)", color: "#6b7280", border: "1px solid rgba(100,100,100,0.22)" };
      default: return { bg: "#f3f4f6", color: "#6b7280", border: "1px solid #e5e7eb" };
    }
  };
  const hideBrokenImg = (e) => {
    const el = e.currentTarget;
    el.style.display = "none";
    if (el.parentElement) el.parentElement.style.background = "linear-gradient(135deg,color-mix(in srgb, var(--admin-accent) 18%, transparent),color-mix(in srgb, var(--admin-accent) 4%, transparent))";
  };
  const localDate = (d) => d ? new Date(d).toLocaleDateString("en-CA") : "";
  const events = blogs.map((b) => ({ _id: b._id, blog: b, title: b.title, description: b.shortDescription, author: b.author || "TelexPH Admin", status: b.status, date: localDate(b.scheduledDate && b.status?.toLowerCase() === "scheduled" ? b.scheduledDate : b.createdAt) }));
  const dateEvents = events.filter((e) => e.date === selecteddate);
  const monthChange = (status) => {
    const now = new Date();
    const inMonth = (b, offset) => {
      const d = new Date(b.createdAt), ref = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      return (!status || b.status?.toLowerCase() === status) && d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
    };
    const cur = blogs.filter((b) => inMonth(b, 0)).length, prev = blogs.filter((b) => inMonth(b, -1)).length;
    const pct = prev === 0 ? (cur > 0 ? 100 : 0) : Math.round((cur - prev) / prev * 100);
    return { change: `${pct >= 0 ? "+" : ""}${pct}% from Last Month`, changeUp: pct >= 0 };
  };
  const statTileConfigs = [
    { label: "Total", count: blogs.length, gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)", gradientLight: "linear-gradient(150deg, #c8dcff 0%, #dbeafe 50%, #bdd3ff 100%)", accentColor: "#60a5fa", accentColorLight: "#1d4ed8", iconPath: "M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z", ...monthChange() },
    { label: "Published", count: publishedCount, gradient: "linear-gradient(135deg, #1a1a2e 0%, #1e1b4b 60%, #312e81 100%)", gradientLight: "linear-gradient(150deg, #d8ccff 0%, #e9d5ff 50%, #d4bfff 100%)", accentColor: "#a78bfa", accentColorLight: "#6d28d9", iconPath: "M5 13l4 4L19 7", ...monthChange("published") },
    { label: "Draft", count: draftCount, gradient: "linear-gradient(135deg, #1a1a2e 0%, #1c1917 60%, #292524 100%)", gradientLight: "linear-gradient(150deg, #ffd8a8 0%, #ffedd5 50%, #fecb8a 100%)", accentColor: "#fb923c", accentColorLight: "#c2410c", iconPath: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", ...monthChange("draft") },
    { label: "Schedule", count: scheduledCount, gradient: "linear-gradient(135deg, #1a1a2e 0%, #14532d 60%, #166534 100%)", gradientLight: "linear-gradient(150deg, #a8f0cc 0%, #dcfce7 50%, #90eabc 100%)", accentColor: "#4ade80", accentColorLight: "#15803d", iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", ...monthChange("scheduled") }
  ];
  return <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { font-family: var(--font-body) !important; -webkit-font-smoothing: antialiased; }
        input, textarea, button, select, option,
        input::placeholder, textarea::placeholder { font-family: var(--font-body) !important; }

        /* \u2500\u2500 Stat image card \u2500\u2500 */
        .stat-img-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
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
        .stat-img-card .sic-photo {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          transition: transform 0.4s ease;
        }
        .stat-img-card:hover .sic-photo { transform: scale(1.06); }
        .stat-img-card .sic-overlay { position: absolute; inset: 0; }
        .stat-img-card .sic-body {
          position: relative; z-index: 3;
          padding: 11px 12px; height: 100%;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        @media (min-width: 480px)  { .stat-img-card .sic-body { padding: 12px 14px; } }
        @media (min-width: 640px)  { .stat-img-card .sic-body { padding: 13px 15px; } }
        @media (min-width: 1024px) { .stat-img-card .sic-body { padding: 14px 16px; } }
        .stat-img-card .sic-label {
          font-size: 8px; font-weight: 700;
          letter-spacing: 0.13em; text-transform: uppercase;
          color: rgba(255,255,255,0.92);
        }
        @media (min-width: 480px)  { .stat-img-card .sic-label { font-size: 8.5px; } }
        @media (min-width: 640px)  { .stat-img-card .sic-label { font-size: 9px;   } }
        @media (min-width: 1024px) { .stat-img-card .sic-label { font-size: 9.5px; } }
        .stat-img-card .sic-icon {
          width: 25px; height: 25px; border-radius: 6px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        @media (min-width: 640px)  { .stat-img-card .sic-icon { width: 28px; height: 28px; border-radius: 7px; } }
        @media (min-width: 1024px) { .stat-img-card .sic-icon { width: 30px; height: 30px; } }
        .stat-img-card .sic-value {
          font-size: 28px; font-weight: 800;
          color: #ffffff; line-height: 1;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 12px rgba(0,0,0,0.3);
        }
        @media (min-width: 480px)  { .stat-img-card .sic-value { font-size: 32px; } }
        @media (min-width: 640px)  { .stat-img-card .sic-value { font-size: 36px; } }
        @media (min-width: 1024px) { .stat-img-card .sic-value { font-size: 42px; letter-spacing: -1.5px; } }
        .stat-img-card .sic-hint {
          font-size: 8.5px; font-weight: 400;
          color: rgba(255,255,255,0.7);
          margin-top: 4px; display: flex; align-items: center; gap: 4px;
        }
        @media (min-width: 480px)  { .stat-img-card .sic-hint { font-size: 9px;  } }
        @media (min-width: 640px)  { .stat-img-card .sic-hint { font-size: 10px; } }
        .sic-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: rgba(255,255,255,0.72); 
          flex-shrink: 0; display: inline-block;
        }
        @media (min-width: 640px) { .sic-dot { width: 5px; height: 5px; } }

        /* \u2500\u2500 Filter row stack on mobile \u2500\u2500 */
        .filter-row {
          display: flex; flex-direction: column; gap: 12px; padding: 16px;
        }
        @media (min-width: 640px) {
          .filter-row { flex-direction: row; flex-wrap: wrap; align-items: flex-end; gap: 16px; padding: 16px 24px; }
        }
        @media (min-width: 1024px) { .filter-row { padding: 16px 24px; } }

        /* \u2500\u2500 Status tabs scroll on mobile \u2500\u2500 */
        .status-tabs-row {
          display: flex; align-items: center; gap: 4px; padding: 12px 14px;
          overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none;
        }
        .status-tabs-row::-webkit-scrollbar { display: none; }
        @media (min-width: 640px) { .status-tabs-row { padding: 14px 24px; gap: 6px; } }

        /* \u2500\u2500 Grid: 1col \u2192 2col \u2192 3col \u2500\u2500 */
        .bl-card { transition: transform .18s, box-shadow .18s; }
        .bl-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.10); }
        .bl-card-img { transition: transform .35s ease; }
        .bl-card:hover .bl-card-img { transform: scale(1.04); }
        .bl-row:hover { background: rgba(128,128,128,0.06); }
        .pill-btn:hover { opacity: .78; }
        @media (max-width: 768px) {
          .bl-top-row { grid-template-columns: 1fr !important; }
          .bl-search, .bl-search input { width: 100% !important; }
          .bl-list-header { display: none !important; }
          .bl-list-row { grid-template-columns: 40px 1fr auto !important; }
          .bl-list-author, .bl-list-tags { display: none !important; }
        }

        /* \u2500\u2500 Page wrapper padding \u2500\u2500 */
        .page-wrap { padding: 16px; display: flex; flex-direction: column; gap: 20px; min-height: 100vh; }
        @media (min-width: 480px)  { .page-wrap { padding: 20px; gap: 24px; } }
        @media (min-width: 640px)  { .page-wrap { padding: 24px; gap: 28px; } }
        @media (min-width: 1024px) { .page-wrap { padding: 32px; gap: 32px; } }

      ` }} />

      <div className={`page-wrap transition-colors duration-500 bg-[var(--admin-bg)]`}>

        {
    /* Error Toast */
  }
        {error && <div className="fixed top-4 right-3 sm:top-8 sm:right-8 bg-red-600 text-white px-5 py-3 sm:px-8 sm:py-5 rounded-2xl shadow-2xl z-50 border-2 border-red-500/20" style={{ fontSize: 11, fontWeight: 500, maxWidth: "calc(100vw - 24px)" }}>
            {error}
            <button onClick={loadblogs} className="ml-3 underline">Retry</button>
          </div>}

        {
    /* â”€â”€ Header â”€â”€ */
  }
        <div className="w-full mx-auto" style={{ maxWidth: 1200 }}>
          <PageHeader title="Blog list" subtitle="Manage your blog posts / Create, edit, and organize your articles with ease" style={{ marginBottom: 0 }} />
        </div>

        {/* TOP ROW — same as the Case Study page */}
        <div className="bl-top-row w-full mx-auto" style={{ maxWidth: 1200, display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)", gap: 16, alignItems: "stretch" }}>
          <div style={{ ...card, padding: "22px 22px" }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0 }}>Quick stats</p>
              <p style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontWeight: 400 }}>Current system overview and counts</p>
            </div>
            <div className="bl-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
              {statTileConfigs.map((cfg, idx) => <div key={idx} className="stat-tile" style={{ transition: "transform .18s" }}>
                <StatTile {...cfg} dark={dark} />
              </div>)}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, marginTop: 14, borderTop: `1px solid ${borderColor}` }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: textPrimary, margin: "0 0 2px" }}>Total blogs</p>
                <p style={{ fontSize: 10, color: textMuted, margin: 0, fontWeight: 400 }}>All statuses combined</p>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: textPrimary, lineHeight: 1 }}>{isloading ? "…" : blogs.length}</span>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>entries</span>
              </div>
            </div>
          </div>
          <div style={{ ...card, padding: "22px 22px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0 }}>Timeline & events</p>
                <p style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontWeight: 400 }}>Scheduled and published blog posts</p>
              </div>
              <button onClick={() => setshowcalendar(true)} className="icon-btn" style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${borderColor}`, background: subtleBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: textMuted, flexShrink: 0 }}>
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>
              </button>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <MiniCalendar records={events} subtleBg={subtleBg} borderColor={borderColor} textSecondary={textSecondary} textMuted={textMuted} onDayClick={(ds) => setselecteddate(ds)} onOpenCalendar={() => setshowcalendar(true)} />
            </div>
          </div>
        </div>

        {/* LIBRARY — same layout as the Case Study library */}
        <div className="w-full mx-auto" style={{ ...card, maxWidth: 1200, overflow: "hidden" }}>
          <div className="bl-toolbar" style={{ padding: "13px 18px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0 }}>Blog library</p>
              <p style={{ fontSize: 10, color: textMuted, margin: "2px 0 0", fontWeight: 400 }}>All blog posts and articles</p>
            </div>
            <div style={{ flex: 1 }} />
            <div className="bl-search" style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: textMuted, pointerEvents: "none" }} width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search by title or author..." value={search} onChange={(e) => setsearch(e.target.value)} style={inp({ width: 210, paddingLeft: 30 })} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: textMuted, fontWeight: 400, whiteSpace: "nowrap" }}>Sort by</span>
              <select value={sortby} onChange={(e) => setsortby(e.target.value)} style={inp({ width: "auto", padding: "7px 10px" })}>
                <option value="date-newest">Newest first</option>
                <option value="date-oldest">Oldest first</option>
                <option value="alpha-asc">Name A → Z</option>
                <option value="alpha-desc">Name Z → A</option>
              </select>
            </div>
            <div style={{ width: 1, height: 20, background: borderColor }} />
            <div style={{ display: "flex", border: `1px solid ${borderColor}`, borderRadius: 8, overflow: "hidden" }}>
              {[
                { mode: "grid", d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
                { mode: "list", d: "M4 6h16M4 12h16M4 18h16" }
              ].map(({ mode, d }) => <button key={mode} onClick={() => setviewmode(mode)} style={{ padding: "6px 9px", border: "none", borderRight: mode === "grid" ? `1px solid ${borderColor}` : "none", background: viewmode === mode ? "var(--admin-accent)" : "transparent", color: viewmode === mode ? "#fff" : textMuted, cursor: "pointer", display: "flex", alignItems: "center", transition: "all .15s" }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} /></svg>
                </button>)}
            </div>
          </div>

          <div style={{ display: "flex", padding: "0 18px", borderBottom: `1px solid ${borderColor}`, background: subtleBg, overflowX: "auto" }}>
            {statusTabs.map((tab) => {
              const isActive = activetab === tab.value;
              const count = tab.value === "All" ? blogs.length : blogs.filter((b) => b.status?.toLowerCase() === tab.value.toLowerCase()).length;
              return <button key={tab.value} onClick={() => setactivetab(tab.value)} style={{ padding: "9px 12px", border: "none", borderBottom: isActive ? "2px solid var(--admin-accent)" : "2px solid transparent", background: "transparent", color: isActive ? "var(--admin-accent)" : textMuted, fontSize: 11, fontWeight: isActive ? 600 : 400, cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap" }}>
                {tab.label}
                <span style={{ marginLeft: 5, fontSize: 9, padding: "1px 5px", borderRadius: 10, background: isActive ? "color-mix(in srgb, var(--admin-accent) 10%, transparent)" : isdarkmode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: isActive ? "var(--admin-accent)" : textMuted, fontWeight: 500 }}>{count}</span>
              </button>;
            })}
            <div style={{ flex: 1 }} />
            <span style={{ alignSelf: "center", fontSize: 10, color: textMuted, whiteSpace: "nowrap" }}>
              Showing <strong style={{ color: textSecondary }}>{filteredblogs.length}</strong> of <strong style={{ color: textSecondary }}>{blogs.length}</strong>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderBottom: `1px solid ${borderColor}`, flexWrap: "wrap", background: "var(--admin-surface)" }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: textMuted, marginRight: 2, whiteSpace: "nowrap" }}>Category:</span>
            {["All", ...mainCategories].map((c) => <button key={c} className="pill-btn" onClick={() => setselectedmaincategory(c)} style={pill(selectedmaincategory === c)}>{c}</button>)}
          </div>
          {selectedmaincategory !== "All" && <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderBottom: `1px solid ${borderColor}`, flexWrap: "wrap", background: "var(--admin-surface)" }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: textMuted, marginRight: 2, whiteSpace: "nowrap" }}>Subcategory:</span>
            {["All", ...getAvailableSubcategories()].map((c) => <button key={c} className="pill-btn" onClick={() => setselectedsubcategory(c)} style={pill(selectedsubcategory === c)}>{c}</button>)}
          </div>}

          <DashboardLoader isVisible={initialLoading} message="Loading blogs…" />

          {!initialLoading && currentblogs.length === 0 && <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: textMuted, fontWeight: 500, margin: "0 0 4px" }}>No blogs found</p>
            <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0 }}>{search ? "Try adjusting your search." : "Try adjusting your filters or create a new blog post."}</p>
          </div>}

          {!initialLoading && currentblogs.length > 0 && viewmode === "grid" && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, padding: 16 }}>
            {currentblogs.map((blog) => {
              const st = statusStyle(blog.status);
              return <div key={blog._id} className="bl-card" style={{ border: `1px solid ${borderColor}`, borderRadius: 14, overflow: "hidden", background: "var(--admin-surface)", display: "flex", flexDirection: "column" }}>
                <div style={{ height: 140, position: "relative", overflow: "hidden", flexShrink: 0, background: "#e5e7eb" }}>
                  <img src={blog.picture || "/placeholder-blog.jpg"} alt={blog.title} className="bl-card-img" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={hideBrokenImg} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.38) 100%)" }} />
                  <div style={{ position: "absolute", bottom: 8, left: 8 }}>
                    <span style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "3px 8px", borderRadius: 5, background: "color-mix(in srgb, var(--admin-accent) 88%, transparent)", color: "#fff" }}>Blog</span>
                  </div>
                </div>
                <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{blog.title}</p>
                  {blog.shortDescription && <p style={{ fontSize: 10, color: textMuted, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 400 }}>{blog.shortDescription}</p>}
                  <p style={{ fontSize: 10, color: textMuted, margin: 0, fontWeight: 400 }}>By <span style={{ color: textSecondary, fontWeight: 500 }}>{blog.author || "TelexPH Admin"}</span> · {formatdate(blog.createdAt)}</p>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {[blog.mainCategory, blog.subcategory].filter(Boolean).map((t) => <span key={t} style={tagStyle}>{t}</span>)}
                  </div>
                  <div style={{ flex: 1 }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 9, borderTop: `1px solid ${borderColor}`, marginTop: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 500, padding: "3px 9px", borderRadius: 20, background: st.bg, color: st.color, border: st.border, textTransform: "capitalize" }}>{blog.status}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => handleview(blog)} style={ghostBtn}>View</button>
                      <button onClick={() => handleedit(blog)} style={ghostBtn}>Edit</button>
                      <button onClick={() => confirmarchive(blog._id)} title="Archive" style={dangerBtn}>{archiveIcon}</button>
                    </div>
                  </div>
                </div>
              </div>;
            })}
          </div>}

          {!initialLoading && currentblogs.length > 0 && viewmode === "list" && <div>
            <div className="bl-list-header" style={{ display: "grid", gridTemplateColumns: "48px 2fr 1fr 2fr 110px 130px", gap: 14, padding: "9px 18px", background: subtleBg, fontSize: 9, fontWeight: 600, color: textMuted, textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: `1px solid ${borderColor}` }}>
              <span>Cover</span><span>Title</span><span>Author</span><span>Category</span><span>Status</span><span style={{ textAlign: "right" }}>Actions</span>
            </div>
            {currentblogs.map((blog, i) => {
              const st = statusStyle(blog.status);
              return <div key={blog._id} className="bl-row bl-list-row" style={{ display: "grid", gridTemplateColumns: "48px 2fr 1fr 2fr 110px 130px", gap: 14, alignItems: "center", padding: "10px 18px", borderBottom: i < currentblogs.length - 1 ? `1px solid ${borderColor}` : "none", transition: "background .15s" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#e5e7eb" }}>
                  <img src={blog.picture || "/placeholder-blog.jpg"} alt={blog.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={hideBrokenImg} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{blog.title}</p>
                  {blog.shortDescription && <p style={{ fontSize: 10, color: textMuted, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 400 }}>{blog.shortDescription}</p>}
                </div>
                <p className="bl-list-author" style={{ fontSize: 11, color: textMuted, margin: 0, fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{blog.author || "TelexPH Admin"}</p>
                <div className="bl-list-tags" style={{ display: "flex", gap: 4, flexWrap: "wrap", minWidth: 0 }}>
                  {[blog.mainCategory, blog.subcategory].filter(Boolean).map((t) => <span key={t} style={tagStyle}>{t}</span>)}
                </div>
                <span style={{ fontSize: 9, fontWeight: 500, padding: "3px 9px", borderRadius: 20, background: st.bg, color: st.color, border: st.border, display: "inline-block", whiteSpace: "nowrap", textTransform: "capitalize", justifySelf: "start" }}>{blog.status}</span>
                <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                  <button onClick={() => handleview(blog)} style={ghostBtn}>View</button>
                  <button onClick={() => handleedit(blog)} style={{ ...ghostBtn, border: "none", background: "var(--admin-accent)", color: "#fff" }}>Edit</button>
                  <button onClick={() => confirmarchive(blog._id)} title="Archive" style={dangerBtn}>{archiveIcon}</button>
                </div>
              </div>;
            })}
          </div>}

          {!initialLoading && filteredblogs.length > 0 && <div style={{ padding: "9px 18px", background: subtleBg, borderTop: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", fontSize: 10, color: textMuted, fontWeight: 400 }}>
            <span>
              Showing <strong style={{ color: textSecondary }}>{indexOfFirstCard + 1}</strong>–<strong style={{ color: textSecondary }}>{Math.min(indexOfLastCard, filteredblogs.length)}</strong> of <strong style={{ color: textSecondary }}>{filteredblogs.length}</strong>
              {activetab !== "All" ? ` · filtered by "${activetab}"` : ""}
              {search ? ` · matching "${search}"` : ""}
            </span>
            {totalPages > 1 && <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={() => handlePageChange(currentpage - 1)} disabled={currentpage === 1} style={{ ...ghostBtn, opacity: currentpage === 1 ? 0.4 : 1, cursor: currentpage === 1 ? "not-allowed" : "pointer" }}>Prev</button>
              <span style={{ color: textSecondary, fontWeight: 500 }}>{currentpage} / {totalPages}</span>
              <button onClick={() => handlePageChange(currentpage + 1)} disabled={currentpage === totalPages} style={{ ...ghostBtn, opacity: currentpage === totalPages ? 0.4 : 1, cursor: currentpage === totalPages ? "not-allowed" : "pointer" }}>Next</button>
            </div>}
          </div>}
        </div>
      </div>

      {
    /* â”€â”€ Archive Confirmation Modal â”€â”€ */
  }
      {blogtoarchive && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-8">
          <div className={`rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-sm sm:max-w-md shadow-2xl transition-all duration-500 bg-[var(--admin-surface)]`}>
            <div className="p-8 sm:p-12 text-center">
              <div className="text-5xl sm:text-6xl mb-4">📦</div>
              <h3 className={`mb-2 transition-colors text-[var(--admin-text)]`} style={{ fontSize: 16, fontWeight: 600 }}>Confirm Archive</h3>
              <p className={`mb-6 sm:mb-8 transition-colors text-[var(--admin-text-faint)]`} style={{ fontSize: 11, fontWeight: 400 }}>
                Are you sure you want to archive this blog? It will be hidden from the public but can be recovered later.
              </p>
              <div className="flex gap-3">
                <button onClick={cancelarchive} className={`flex-1 px-5 py-3 rounded-[1.25rem] transition-all bg-[var(--admin-bg-soft)] text-[var(--admin-text)] hover:bg-[var(--admin-bg-hover)]`} style={{ fontSize: 11, fontWeight: 500 }}>Cancel</button>
                <button onClick={() => handlearchive(blogtoarchive)} className="flex-1 px-5 py-3 bg-yellow-500 text-white rounded-[1.25rem] hover:bg-yellow-600 transition-all shadow-lg" style={{ fontSize: 11, fontWeight: 500 }}>Archive</button>
              </div>
            </div>
          </div>
        </div>}

      {
    /* â”€â”€ Blog View Modal â”€â”€ */
  }
      {viewingblog && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-8">
          <div className={`rounded-[1.5rem] sm:rounded-[2.5rem] w-full max-w-3xl max-h-full flex flex-col overflow-hidden shadow-2xl bg-[var(--admin-surface)]`}>
            <div className={`shrink-0 px-5 sm:px-10 py-4 sm:py-5 flex items-center justify-between border-b transition-all duration-500 bg-[var(--admin-surface)] border-[var(--admin-border)]`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-full ${getstatusstyles(viewingblog.status)}`} style={{ fontSize: 9, fontWeight: 500 }}>{viewingblog.status}</span>
                <span className={`transition-colors text-[var(--admin-text-faint)]`} style={{ fontSize: 10, fontWeight: 400 }}>{viewingblog.mainCategory}</span>
                {viewingblog.subcategory && <span className={`transition-colors text-[var(--admin-text-faint)]`} style={{ fontSize: 10, fontWeight: 400 }}>• {viewingblog.subcategory}</span>}
              </div>
              <button onClick={closeviewmodal} className={`p-2 rounded-full transition-colors shrink-0 text-[var(--admin-text-faint)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-hover)]`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="px-5 sm:px-10 py-5 sm:py-6 flex-1 min-h-0 overflow-y-auto">
              {viewingblog.picture && <div className="mb-4 sm:mb-5 rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden">
                  <img src={viewingblog.picture} alt={viewingblog.title} className="w-full h-40 sm:h-52 object-cover" />
                </div>}
              <h1 className={`mb-3 leading-tight transition-colors text-[var(--admin-text)]`} style={{ fontSize: 17, fontWeight: 600 }}>
                {viewingblog.title}
              </h1>
              <div className={`flex items-center gap-4 mb-4 pb-4 border-b transition-colors text-[var(--admin-text-faint)] border-[var(--admin-border)]`} style={{ fontSize: 10 }}>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>{formatdate(viewingblog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{calculatereadingtime(viewingblog.mainContent)} min read</span>
                </div>
              </div>
              <div className="mb-4">
                <p className={`leading-relaxed italic border-l-4 border-[var(--admin-accent)] pl-4 py-1 transition-colors text-[var(--admin-text-sub)]`} style={{ fontSize: 11, fontWeight: 500 }}>
                  {viewingblog.shortDescription}
                </p>
              </div>
              <div>
                {viewingblog.mainContent && Array.isArray(viewingblog.mainContent) && viewingblog.mainContent.map((section, index) => <div key={index} className="mb-4 sm:mb-5">
                    {section.title && <p className={`mb-2 mt-3 transition-colors text-[var(--admin-text)]`} style={{ fontSize: 13, fontWeight: 600 }}>{section.title}</p>}
                    {section.content && <div className={`rta-view leading-relaxed transition-colors text-[var(--admin-text-sub)]`} style={{ fontSize: 11, fontWeight: 400 }} dangerouslySetInnerHTML={{ __html: toHtml(section.content) }} />}
                  </div>)}
              </div>
            </div>

            <div className={`shrink-0 px-5 sm:px-10 py-4 sm:py-5 border-t flex justify-end gap-3 transition-all duration-500 bg-[var(--admin-bg-soft)] border-[var(--admin-border)]`}>
              <button onClick={closeviewmodal} className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-[1.25rem] border-2 transition-all bg-transparent border-[var(--admin-border)] text-[var(--admin-text-sub)] hover:bg-[var(--admin-bg-hover)]`} style={{ fontSize: 11, fontWeight: 500 }}>
                Close
              </button>
              <button onClick={() => {
    closeviewmodal();
    handleedit(viewingblog);
  }} className="px-5 sm:px-8 py-2.5 sm:py-3 bg-[var(--admin-accent)] text-white rounded-[1.25rem] hover:bg-[var(--admin-accent-hover)] transition-all shadow-lg" style={{ fontSize: 11, fontWeight: 500 }}>
                Edit Blog
              </button>
            </div>
          </div>
        </div>}
      <CalendarModal isOpen={showcalendar} records={events} selectedMonthIndex={calmonth} onClose={() => setshowcalendar(false)} onMonthChange={setcalmonth} onDateClick={(ds) => setselecteddate(ds)} cardBg="var(--admin-surface)" borderColor={borderColor} textPrimary={textPrimary} textMuted={textMuted} subtleBg={subtleBg} />
      <DateModal isOpen={!!selecteddate} dateStr={selecteddate} studies={dateEvents} onClose={() => setselecteddate("")} onSelectPost={(e) => handleview(e.blog)} cardBg="var(--admin-surface)" borderColor={borderColor} textPrimary={textPrimary} textMuted={textMuted} subtleBg={subtleBg} />
    </>;
}
export {
  ListBlogs as default
};
