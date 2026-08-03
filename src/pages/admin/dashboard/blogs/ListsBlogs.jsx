
import { useState, useEffect } from "react";
import EditBlogs from "./EditBlogs";
import { useDarkMode } from "@/pages/admin/dashboard/Layout";
const STAT_CARD_IMAGES = [
  "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=500&q=80&fit=crop",
  // Total blogs  â€” open notebook
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&q=80&fit=crop",
  // Published    â€” laptop writing
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=80&fit=crop",
  // Draft        â€” pen + paper
  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&q=80&fit=crop"
  // Scheduled    â€” planner/calendar
];
const STAT_CARD_COLORS = [
  "#1e6e4a",
  // Total blogs  â€” green
  "#8b0f0f",
  // Published    â€” deep red
  "#92580a",
  // Draft        â€” amber
  "#103f9e"
  // Scheduled    â€” blue
];
function ListBlogs() {
  const [blogs, setblogs] = useState([]);
  const [activetab, setactivetab] = useState("All");
  const [viewmode, setviewmode] = useState("grid");
  const [blogtoarchive, setblogtoarchive] = useState(null);
  const [isediting, setisediting] = useState(false);
  const [selectedblog, setselectedblog] = useState(null);
  const [viewingblog, setviewingblog] = useState(null);
  const [currentpage, setcurrentpage] = useState(1);
  const cardsperpage = 6;
  const [isloading, setisloading] = useState(true);
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
  }, [activetab, selectedmaincategory, selectedsubcategory]);
  useEffect(() => {
    if (selectedmaincategory !== "All") {
      const avail = getAvailableSubcategories();
      if (selectedsubcategory !== "All" && !avail.includes(selectedsubcategory)) setselectedsubcategory("All");
    }
  }, [selectedmaincategory]);
  const getstatusstyles = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "bg-[#800000] text-white";
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
    const totalwords = content.reduce((acc, section) => acc + (section.content || "").split(/\s+/).length, 0);
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
  const filteredblogs = activetab === "All" ? blogs : blogs.filter((blog) => (blog.status || "").toLowerCase() === activetab.toLowerCase());
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
  const blogStats = [
    {
      label: "Total Blogs",
      value: blogs.length.toLocaleString(),
      subValue: `${(publishedCount + draftCount).toLocaleString()} active posts`,
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
    },
    {
      label: "Published",
      value: publishedCount.toLocaleString(),
      subValue: "Live on the website",
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    },
    {
      label: "Draft",
      value: draftCount.toLocaleString(),
      subValue: "Unpublished drafts",
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    },
    {
      label: "Scheduled",
      value: scheduledCount.toLocaleString(),
      subValue: "Queued for publishing",
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    }
  ];
  if (isediting && selectedblog) {
    return <EditBlogs blog={selectedblog} onClose={closeeditmodal} onSave={loadblogs} />;
  }
  return <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { font-family: 'Poppins', sans-serif !important; -webkit-font-smoothing: antialiased; }
        input, textarea, button, select, option,
        input::placeholder, textarea::placeholder { font-family: 'Poppins', sans-serif !important; }

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

        /* \u2500\u2500 Table: hide columns on small screens \u2500\u2500 */
        @media (max-width: 767px) {
          .tbl-col-category { display: none; }
          .tbl-col-date     { display: none; }
          .tbl-col-read     { display: none; }
        }
        @media (max-width: 1023px) {
          .tbl-col-read { display: none; }
        }

        /* \u2500\u2500 Table cell padding \u2500\u2500 */
        .tbl-th { padding: 12px 14px; font-size: 9px; }
        .tbl-td { padding: 12px 14px; }
        @media (min-width: 640px)  { .tbl-th { padding: 14px 20px; font-size: 10px; } .tbl-td { padding: 14px 20px; } }
        @media (min-width: 1024px) { .tbl-th { padding: 18px 32px; }                  .tbl-td { padding: 18px 32px; } }

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
        .blog-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 560px)  { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .blog-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; } }

        /* \u2500\u2500 Page wrapper padding \u2500\u2500 */
        .page-wrap { padding: 16px; display: flex; flex-direction: column; gap: 20px; min-height: 100vh; }
        @media (min-width: 480px)  { .page-wrap { padding: 20px; gap: 24px; } }
        @media (min-width: 640px)  { .page-wrap { padding: 24px; gap: 28px; } }
        @media (min-width: 1024px) { .page-wrap { padding: 32px; gap: 32px; } }

        /* \u2500\u2500 List view blog image \u2500\u2500 */
        .list-blog-img { width: 48px; height: 48px; border-radius: 10px; }
        @media (min-width: 640px) { .list-blog-img { width: 56px; height: 56px; border-radius: 12px; } }

        /* \u2500\u2500 Action buttons \u2500\u2500 */
        .action-btn-sm { padding: 6px 10px; font-size: 10px; border-radius: 10px; }
        @media (min-width: 640px)  { .action-btn-sm { padding: 8px 16px; font-size: 11px; border-radius: 14px; } }
        @media (min-width: 1024px) { .action-btn-sm { padding: 10px 20px; border-radius: 16px; } }
      ` }} />

      <div className={`page-wrap transition-colors duration-500 ${isdarkmode ? "bg-[#0f0f0f]" : "bg-[#f8f9fa]"}`}>

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
        <div className="w-full max-w-7xl mx-auto">
          <h2 className={`tracking-tight transition-colors ${isdarkmode ? "text-white" : "text-gray-800"}`} style={{ fontSize: 16, fontWeight: 500 }}>
            Blog Management
          </h2>
          <p className={`mt-1 transition-colors ${isdarkmode ? "text-gray-500" : "text-gray-400"}`} style={{ fontSize: 11, fontWeight: 400 }}>
            Manage and organize your blog posts
          </p>
        </div>

        {
    /* â”€â”€ Stats Cards â”€â”€ */
  }
        <div className="w-full max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 lg:gap-3">
          {blogStats.map((s, i) => {
    const hex = STAT_CARD_COLORS[i];
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return <div key={i} className="stat-img-card">
                {
      /* Photo layer */
    }
                <div className="sic-photo" style={{ backgroundImage: `url(${STAT_CARD_IMAGES[i]})` }} />
                {
      /* Gradient: solid left â†’ transparent right (shows photo on right side) */
    }
                <div className="sic-overlay" style={{
      background: `linear-gradient(to right,
                    rgb(${r},${g},${b}) 0%,
                    rgb(${r},${g},${b}) 38%,
                    rgba(${r},${g},${b},0.82) 55%,
                    rgba(${r},${g},${b},0.45) 72%,
                    rgba(${r},${g},${b},0.12) 100%
                  )`
    }} />
                {
      /* Bottom vignette for readability */
    }
                <div className="sic-overlay" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 55%)" }} />
                {
      /* Content */
    }
                <div className="sic-body">
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <span className="sic-label">{s.label}</span>
                    <div className="sic-icon">{s.icon}</div>
                  </div>
                  <div>
                    <div className="sic-value">{s.value}</div>
                    <div className="sic-hint">
                      <span className="sic-dot" />
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
    /* â”€â”€ Filters â”€â”€ */
  }
        <div className="w-full max-w-7xl mx-auto">
          <div className={`rounded-2xl border transition-all duration-500 overflow-hidden ${isdarkmode ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200"}`}>

            {
    /* Status tabs */
  }
            <div className={`status-tabs-row border-b ${isdarkmode ? "border-white/5" : "border-gray-100"}`}>
              <span style={{ fontSize: 10, fontWeight: 500, color: isdarkmode ? "#6b7280" : "#9ca3af", marginRight: 8, flexShrink: 0 }}>
                Status
              </span>
              {statusTabs.map((tab) => {
    const count = tab.value === "All" ? blogs.length : blogs.filter((b) => b.status?.toLowerCase() === tab.value.toLowerCase()).length;
    const isActive = activetab === tab.value;
    return <button
      key={tab.value}
      onClick={() => setactivetab(tab.value)}
      style={{
        fontSize: 11,
        fontWeight: isActive ? 500 : 400,
        padding: "5px 12px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        transition: "all 0.2s",
        background: isActive ? "#800000" : "transparent",
        color: isActive ? "#ffffff" : isdarkmode ? "#9ca3af" : "#6b7280",
        boxShadow: isActive ? "0 2px 8px rgba(128,0,0,0.3)" : "none",
        whiteSpace: "nowrap",
        flexShrink: 0
      }}
    >
                    {tab.label} ({count})
                  </button>;
  })}
            </div>

            {
    /* Category dropdowns + view toggle */
  }
            <div className="filter-row">
              <div style={{ flex: 1, minWidth: 160 }}>
                <label style={{ display: "block", fontSize: 10, fontWeight: 500, color: isdarkmode ? "#6b7280" : "#9ca3af", marginBottom: 6 }}>
                  Main Category
                </label>
                <select
    value={selectedmaincategory}
    onChange={(e) => setselectedmaincategory(e.target.value)}
    style={{
      width: "100%",
      fontSize: 11,
      padding: "9px 14px",
      borderRadius: 10,
      border: isdarkmode ? "1.5px solid rgba(255,255,255,0.1)" : "1.5px solid #e5e7eb",
      background: isdarkmode ? "#202020" : "#f9fafb",
      color: isdarkmode ? "#d1d5db" : "#374151",
      outline: "none",
      appearance: "auto",
      cursor: "pointer"
    }}
  >
                  <option value="All">All Categories</option>
                  {mainCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div style={{ flex: 1, minWidth: 160 }}>
                <label style={{ display: "block", fontSize: 10, fontWeight: 500, color: isdarkmode ? "#6b7280" : "#9ca3af", marginBottom: 6 }}>
                  Subcategory
                </label>
                <select
    value={selectedsubcategory}
    onChange={(e) => setselectedsubcategory(e.target.value)}
    disabled={selectedmaincategory === "All"}
    style={{
      width: "100%",
      fontSize: 11,
      padding: "9px 14px",
      borderRadius: 10,
      border: isdarkmode ? "1.5px solid rgba(255,255,255,0.1)" : "1.5px solid #e5e7eb",
      background: isdarkmode ? "#202020" : "#f9fafb",
      color: isdarkmode ? "#d1d5db" : "#374151",
      outline: "none",
      appearance: "auto",
      cursor: selectedmaincategory === "All" ? "not-allowed" : "pointer",
      opacity: selectedmaincategory === "All" ? 0.45 : 1
    }}
  >
                  <option value="All">All Subcategories</option>
                  {getAvailableSubcategories().map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 500, color: isdarkmode ? "#6b7280" : "#9ca3af", marginRight: 4 }}>View</span>
                {[
    { mode: "grid", icon: <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { mode: "list", icon: <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> }
  ].map(({ mode, icon }) => <button
    key={mode}
    onClick={() => setviewmode(mode)}
    style={{
      padding: 7,
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s",
      background: viewmode === mode ? "#800000" : isdarkmode ? "rgba(255,255,255,0.05)" : "#f3f4f6",
      color: viewmode === mode ? "#fff" : isdarkmode ? "#9ca3af" : "#6b7280",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: viewmode === mode ? "0 2px 8px rgba(128,0,0,0.3)" : "none"
    }}
  >
                    {icon}
                  </button>)}
              </div>
            </div>
          </div>
        </div>

        {
    /* â”€â”€ Blog Content â”€â”€ */
  }
        <div className="w-full max-w-7xl mx-auto">
          {isloading ? <div className="p-16 sm:p-20 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-red-900 border-t-transparent" />
              <p className={`mt-5 transition-colors ${isdarkmode ? "text-gray-400" : "text-gray-600"}`} style={{ fontSize: 12, fontWeight: 400 }}>Loading blogs...</p>
            </div> : currentblogs.length === 0 ? <div className={`rounded-[2rem] border p-14 sm:p-20 text-center transition-all duration-500 ${isdarkmode ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200"}`}>
              <div className="text-5xl sm:text-6xl mb-4">ðŸ“</div>
              <p className={`mb-2 transition-colors ${isdarkmode ? "text-gray-400" : "text-gray-600"}`} style={{ fontSize: 13, fontWeight: 500 }}>No blogs found</p>
              <p className={`transition-colors ${isdarkmode ? "text-gray-500" : "text-gray-400"}`} style={{ fontSize: 11, fontWeight: 400 }}>Try adjusting your filters or create a new blog post</p>
            </div> : viewmode === "grid" ? (
    /* â”€â”€ GRID VIEW â”€â”€ */
    <div className="blog-grid">
              {currentblogs.map((blog) => <div
      key={blog._id}
      className={`rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full ${isdarkmode ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200"}`}
    >
                  <div className="relative h-36 sm:h-44 overflow-hidden group flex-shrink-0">
                    <img src={blog.picture || "/placeholder-blog.jpg"} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full ${getstatusstyles(blog.status)}`} style={{ fontSize: 9, fontWeight: 500 }}>
                        {blog.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                      <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#800000] text-white rounded-lg" style={{ fontSize: 9, fontWeight: 500 }}>
                        {getCategoryIcon(blog.mainCategory)} {blog.mainCategory}
                      </span>
                      {blog.subcategory && <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#800000]/70 text-white rounded-lg" style={{ fontSize: 9, fontWeight: 500 }}>
                          {blog.subcategory}
                        </span>}
                    </div>

                    <p className={`mb-1.5 line-clamp-2 transition-colors ${isdarkmode ? "text-white" : "text-gray-800"}`} style={{ fontSize: 12, fontWeight: 600 }}>
                      {blog.title}
                    </p>

                    <p className={`mb-3 line-clamp-2 flex-grow transition-colors ${isdarkmode ? "text-gray-400" : "text-gray-500"}`} style={{ fontSize: 10, fontWeight: 400 }}>
                      {blog.shortDescription}
                    </p>

                    <div className={`flex items-center gap-3 mb-3 pb-3 border-t pt-3 transition-colors ${isdarkmode ? "text-gray-500 border-white/10" : "text-gray-400 border-gray-100"}`} style={{ fontSize: 9 }}>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatdate(blog.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{calculatereadingtime(blog.mainContent)} min read</span>
                      </div>
                    </div>

                    <div className="flex gap-1.5 sm:gap-2">
                      <button
      onClick={() => handleview(blog)}
      className={`flex-1 py-2 sm:py-2.5 rounded-[0.75rem] sm:rounded-[1rem] transition-all flex items-center justify-center gap-1.5 ${isdarkmode ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
      style={{ fontSize: 10, fontWeight: 500 }}
    >
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      <button
      onClick={() => handleedit(blog)}
      className="flex-1 py-2 sm:py-2.5 bg-[#800000] text-white rounded-[0.75rem] sm:rounded-[1rem] hover:bg-[#600000] transition-all flex items-center justify-center gap-1.5"
      style={{ fontSize: 10, fontWeight: 500 }}
    >
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
      onClick={() => confirmarchive(blog._id)}
      className={`px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-[0.75rem] sm:rounded-[1rem] transition-all flex items-center justify-center ${isdarkmode ? "bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50" : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"}`}
      title="Archive"
    >
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>)}
            </div>
  ) : (
    /* â”€â”€ LIST VIEW â”€â”€ */
    <div className={`rounded-[1.5rem] sm:rounded-[2rem] border overflow-hidden shadow-xl transition-all duration-500 ${isdarkmode ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200"}`}>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ minWidth: 360 }}>
                  <thead className={`border-b transition-all duration-500 ${isdarkmode ? "bg-[#202020] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                    <tr>
                      {[
      { label: "Blog", cls: "" },
      { label: "Category", cls: "tbl-col-category" },
      { label: "Status", cls: "" },
      { label: "Date", cls: "tbl-col-date" },
      { label: "Read Time", cls: "tbl-col-read" },
      { label: "Actions", cls: "text-right" }
    ].map((col) => <th
      key={col.label}
      className={`tbl-th text-left uppercase tracking-widest transition-colors ${col.cls} ${isdarkmode ? "text-gray-500" : "text-gray-400"}`}
      style={{ fontWeight: 500 }}
    >
                          {col.label}
                        </th>)}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isdarkmode ? "divide-white/5" : "divide-gray-100"}`}>
                    {currentblogs.map((blog) => <tr key={blog._id} className={`transition-all duration-300 ${isdarkmode ? "hover:bg-[#202020]" : "hover:bg-gray-50"}`}>
                        <td className="tbl-td">
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div className="list-blog-img overflow-hidden flex-shrink-0">
                              <img src={blog.picture || "/placeholder-blog.jpg"} alt={blog.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className={`line-clamp-1 transition-colors ${isdarkmode ? "text-white" : "text-gray-800"}`} style={{ fontSize: 12, fontWeight: 500, maxWidth: 160 }}>
                                {blog.title}
                              </p>
                              <p className={`mt-0.5 line-clamp-1 transition-colors ${isdarkmode ? "text-gray-400" : "text-gray-500"}`} style={{ fontSize: 10, fontWeight: 400, maxWidth: 160 }}>
                                {blog.shortDescription}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="tbl-td tbl-col-category">
                          <div className="flex flex-col gap-1">
                            <span className="px-2.5 py-1 bg-[#800000] text-white rounded-full w-fit" style={{ fontSize: 9, fontWeight: 500 }}>{blog.mainCategory}</span>
                            {blog.subcategory && <span className="px-2.5 py-1 bg-[#800000]/60 text-white rounded-full w-fit" style={{ fontSize: 9, fontWeight: 500 }}>{blog.subcategory}</span>}
                          </div>
                        </td>
                        <td className="tbl-td">
                          <span className={`px-3 py-1.5 rounded-full ${getstatusstyles(blog.status)}`} style={{ fontSize: 9, fontWeight: 500, whiteSpace: "nowrap" }}>
                            {blog.status}
                          </span>
                        </td>
                        <td className="tbl-td tbl-col-date">
                          <p className={`transition-colors ${isdarkmode ? "text-white" : "text-gray-800"} whitespace-nowrap`} style={{ fontSize: 11, fontWeight: 500, margin: 0 }}>
                            {formatdate(blog.createdAt)}
                          </p>
                        </td>
                        <td className="tbl-td tbl-col-read">
                          <p className={`transition-colors ${isdarkmode ? "text-gray-400" : "text-gray-500"}`} style={{ fontSize: 11, fontWeight: 400 }}>
                            {calculatereadingtime(blog.mainContent)} min
                          </p>
                        </td>
                        <td className="tbl-td text-right">
                          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                            <button onClick={() => handleview(blog)} className={`action-btn-sm transition-all hover:shadow-lg ${isdarkmode ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} style={{ fontWeight: 500 }}>
                              View
                            </button>
                            <button onClick={() => handleedit(blog)} className="action-btn-sm bg-[#800000] text-white hover:bg-[#600000] transition-all hover:shadow-lg" style={{ fontWeight: 500 }}>
                              Edit
                            </button>
                            <button
      onClick={() => confirmarchive(blog._id)}
      className={`action-btn-sm transition-all flex items-center gap-1 hover:shadow-lg ${isdarkmode ? "bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50" : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"}`}
      style={{ fontWeight: 500 }}
    >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                              <span className="hidden sm:inline">Archive</span>
                            </button>
                          </div>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && <div className={`px-4 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t transition-all duration-500 ${isdarkmode ? "bg-[#202020] border-white/5" : "bg-gray-50 border-gray-200"}`}>
                  <p className={`transition-colors ${isdarkmode ? "text-gray-400" : "text-gray-600"}`} style={{ fontSize: 10, fontWeight: 400 }}>
                    Showing <strong>{indexOfFirstCard + 1}</strong>â€“<strong>{Math.min(indexOfLastCard, filteredblogs.length)}</strong> of <strong>{filteredblogs.length}</strong>
                  </p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handlePageChange(currentpage - 1)} disabled={currentpage === 1} className={`px-4 py-2 rounded-[0.875rem] transition-all ${currentpage === 1 ? "opacity-40 cursor-not-allowed" : isdarkmode ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} style={{ fontSize: 10, fontWeight: 500 }}>
                      Prev
                    </button>
                    <span className={`transition-colors ${isdarkmode ? "text-white" : "text-gray-800"}`} style={{ fontSize: 10, fontWeight: 500 }}>
                      {currentpage} / {totalPages}
                    </span>
                    <button onClick={() => handlePageChange(currentpage + 1)} disabled={currentpage === totalPages} className={`px-4 py-2 rounded-[0.875rem] transition-all ${currentpage === totalPages ? "opacity-40 cursor-not-allowed" : isdarkmode ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} style={{ fontSize: 10, fontWeight: 500 }}>
                      Next
                    </button>
                  </div>
                </div>}
            </div>
  )}

          {
    /* Grid pagination */
  }
          {viewmode === "grid" && totalPages > 1 && <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8 flex-wrap">
              <button onClick={() => handlePageChange(currentpage - 1)} disabled={currentpage === 1} className={`px-4 py-2 rounded-[0.875rem] transition-all ${currentpage === 1 ? "opacity-40 cursor-not-allowed" : isdarkmode ? "bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] border border-white/5" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"}`} style={{ fontSize: 10, fontWeight: 500 }}>
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => <button key={index + 1} onClick={() => handlePageChange(index + 1)} className={`px-3 py-2 rounded-[0.875rem] transition-all ${currentpage === index + 1 ? "bg-[#800000] text-white shadow-md" : isdarkmode ? "bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] border border-white/5" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"}`} style={{ fontSize: 10, fontWeight: currentpage === index + 1 ? 500 : 400 }}>
                  {index + 1}
                </button>)}
              <button onClick={() => handlePageChange(currentpage + 1)} disabled={currentpage === totalPages} className={`px-4 py-2 rounded-[0.875rem] transition-all ${currentpage === totalPages ? "opacity-40 cursor-not-allowed" : isdarkmode ? "bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] border border-white/5" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"}`} style={{ fontSize: 10, fontWeight: 500 }}>
                Next
              </button>
            </div>}
        </div>
      </div>

      {
    /* â”€â”€ Archive Confirmation Modal â”€â”€ */
  }
      {blogtoarchive && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-8">
          <div className={`rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-sm sm:max-w-md shadow-2xl transition-all duration-500 ${isdarkmode ? "bg-[#1a1a1a]" : "bg-white"}`}>
            <div className="p-8 sm:p-12 text-center">
              <div className="text-5xl sm:text-6xl mb-4">ðŸ“¦</div>
              <h3 className={`mb-2 transition-colors ${isdarkmode ? "text-white" : "text-gray-800"}`} style={{ fontSize: 16, fontWeight: 600 }}>Confirm Archive</h3>
              <p className={`mb-6 sm:mb-8 transition-colors ${isdarkmode ? "text-gray-400" : "text-gray-500"}`} style={{ fontSize: 11, fontWeight: 400 }}>
                Are you sure you want to archive this blog? It will be hidden from the public but can be recovered later.
              </p>
              <div className="flex gap-3">
                <button onClick={cancelarchive} className={`flex-1 px-5 py-3 rounded-[1.25rem] transition-all ${isdarkmode ? "bg-white/10 text-gray-200 hover:bg-white/20" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} style={{ fontSize: 11, fontWeight: 500 }}>Cancel</button>
                <button onClick={() => handlearchive(blogtoarchive)} className="flex-1 px-5 py-3 bg-yellow-500 text-white rounded-[1.25rem] hover:bg-yellow-600 transition-all shadow-lg" style={{ fontSize: 11, fontWeight: 500 }}>Archive</button>
              </div>
            </div>
          </div>
        </div>}

      {
    /* â”€â”€ Blog View Modal â”€â”€ */
  }
      {viewingblog && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-8 overflow-y-auto">
          <div className={`rounded-[1.5rem] sm:rounded-[2.5rem] w-full max-w-3xl shadow-2xl my-4 sm:my-8 transition-all duration-500 ${isdarkmode ? "bg-[#1a1a1a]" : "bg-white"}`}>
            <div className={`sticky top-0 px-5 sm:px-10 py-4 sm:py-5 rounded-t-[1.5rem] sm:rounded-t-[2.5rem] flex items-center justify-between z-10 border-b transition-all duration-500 ${isdarkmode ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200"}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-full ${getstatusstyles(viewingblog.status)}`} style={{ fontSize: 9, fontWeight: 500 }}>{viewingblog.status}</span>
                <span className={`transition-colors ${isdarkmode ? "text-gray-400" : "text-gray-500"}`} style={{ fontSize: 10, fontWeight: 400 }}>{viewingblog.mainCategory}</span>
                {viewingblog.subcategory && <span className={`transition-colors ${isdarkmode ? "text-gray-500" : "text-gray-400"}`} style={{ fontSize: 10, fontWeight: 400 }}>â€¢ {viewingblog.subcategory}</span>}
              </div>
              <button onClick={closeviewmodal} className={`p-2 rounded-full transition-colors shrink-0 ${isdarkmode ? "text-gray-400 hover:text-gray-300 hover:bg-white/5" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="px-5 sm:px-10 py-5 sm:py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {viewingblog.picture && <div className="mb-4 sm:mb-5 rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden">
                  <img src={viewingblog.picture} alt={viewingblog.title} className="w-full h-40 sm:h-52 object-cover" />
                </div>}
              <h1 className={`mb-3 leading-tight transition-colors ${isdarkmode ? "text-white" : "text-gray-900"}`} style={{ fontSize: 17, fontWeight: 600 }}>
                {viewingblog.title}
              </h1>
              <div className={`flex items-center gap-4 mb-4 pb-4 border-b transition-colors ${isdarkmode ? "text-gray-500 border-white/10" : "text-gray-400 border-gray-200"}`} style={{ fontSize: 10 }}>
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
                <p className={`leading-relaxed italic border-l-4 border-[#800000] pl-4 py-1 transition-colors ${isdarkmode ? "text-gray-300" : "text-gray-600"}`} style={{ fontSize: 11, fontWeight: 500 }}>
                  {viewingblog.shortDescription}
                </p>
              </div>
              <div>
                {viewingblog.mainContent && Array.isArray(viewingblog.mainContent) && viewingblog.mainContent.map((section, index) => <div key={index} className="mb-4 sm:mb-5">
                    {section.title && <p className={`mb-2 mt-3 transition-colors ${isdarkmode ? "text-white" : "text-gray-900"}`} style={{ fontSize: 13, fontWeight: 600 }}>{section.title}</p>}
                    {section.content && <div className={`leading-relaxed whitespace-pre-wrap transition-colors ${isdarkmode ? "text-gray-300" : "text-gray-600"}`} style={{ fontSize: 11, fontWeight: 400 }}>
                        {section.content.split("\n").map((paragraph, pIndex) => paragraph.trim() && <p key={pIndex} className="mb-3">{paragraph}</p>)}
                      </div>}
                  </div>)}
              </div>
            </div>

            <div className={`sticky bottom-0 px-5 sm:px-10 py-4 sm:py-5 rounded-b-[1.5rem] sm:rounded-b-[2.5rem] border-t flex justify-end gap-3 transition-all duration-500 ${isdarkmode ? "bg-[#202020] border-white/5" : "bg-gray-50 border-gray-200"}`}>
              <button onClick={closeviewmodal} className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-[1.25rem] border-2 transition-all ${isdarkmode ? "bg-transparent border-white/10 text-gray-300 hover:bg-white/5" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"}`} style={{ fontSize: 11, fontWeight: 500 }}>
                Close
              </button>
              <button onClick={() => {
    closeviewmodal();
    handleedit(viewingblog);
  }} className="px-5 sm:px-8 py-2.5 sm:py-3 bg-[#800000] text-white rounded-[1.25rem] hover:bg-[#600000] transition-all shadow-lg" style={{ fontSize: 11, fontWeight: 500 }}>
                Edit Blog
              </button>
            </div>
          </div>
        </div>}
    </>;
}
export {
  ListBlogs as default
};
