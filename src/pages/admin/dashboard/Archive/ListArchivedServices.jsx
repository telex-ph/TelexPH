
import { useState, useEffect, useCallback } from "react";
import { useDarkMode } from "@/pages/admin/dashboard/Layout";
const departments = {
  1: "Compliance",
  2: "Innovation",
  3: "Marketing",
  4: "Recruitment",
  5: "Human Resources"
};
const roles = { 1: "Main Administrator", 2: "Administrator" };
const getDeptIcon = (d) => ({ 1: "\u2696\uFE0F", 2: "\u{1F4A1}", 3: "\u{1F4E2}", 4: "\u{1F465}", 5: "\u{1F91D}" })[d] || "\u{1F464}";
const getInitials = (a) => `${a.firstName?.charAt(0) || ""}${a.lastName?.charAt(0) || ""}`.toUpperCase();
const FONT = "'Poppins', sans-serif";
function ListArchivedServices() {
  const { isdarkmode } = useDarkMode();
  const [activefilter, setactivefilter] = useState("All");
  const [searchquery, setsearchquery] = useState("");
  const [sortmode, setsortmode] = useState("date-newest");
  const [viewmode, setviewmode] = useState("grid");
  const [archivedblogs, setarchivedblogs] = useState([]);
  const [archivedcasestudies, setarchivedcasestudies] = useState([]);
  const [archivedadmins, setarchivedadmins] = useState([]);
  const [isloading, setisloading] = useState(true);
  const [error, seterror] = useState(null);
  const [restoringid, setrestoringid] = useState(null);
  const [successmsg, setsuccessmsg] = useState(null);
  const [currentRole, setcurrentRole] = useState(null);
  const [confirmrestore, setconfirmrestore] = useState(null);
  const isMainAdmin = currentRole === 1;
  const API = import.meta.env.VITE_API_URL || "/api";
  const pageBg = isdarkmode ? "#0f0f0f" : "#f8f9fa";
  const cardBg = isdarkmode ? "#1a1a1a" : "#ffffff";
  const subtleBg = isdarkmode ? "#202020" : "#f9fafb";
  const borderColor = isdarkmode ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const textPrimary = isdarkmode ? "#f0f0f0" : "#1f2937";
  const textMuted = isdarkmode ? "#6b7280" : "#6b7280";
  const inputBg = isdarkmode ? "#202020" : "#f9fafb";
  const fetchBlogs = useCallback(async () => {
    const r = await fetch(`${API}/blogs?includeArchived=true`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
    if (!r.ok) throw new Error(`Failed to fetch blogs: ${r.status}`);
    setarchivedblogs((await r.json()).filter((b) => b.isArchive === true));
  }, [API]);
  const fetchCaseStudies = useCallback(async () => {
    const r = await fetch(`${API}/casestudies?includeArchived=true`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
    if (!r.ok) throw new Error(`Failed to fetch case studies: ${r.status}`);
    setarchivedcasestudies((await r.json()).filter((cs) => cs.isArchived === true));
  }, [API]);
  const fetchAdmins = useCallback(async () => {
    const r = await fetch(`${API}/users/archived`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
    if (!r.ok) throw new Error(`Failed to fetch admins: ${r.status}`);
    setarchivedadmins(await r.json());
  }, [API]);
  const loadAll = useCallback(async () => {
    try {
      setisloading(true);
      seterror(null);
      const r = await fetch(`${API}/users/me`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (!r.ok) throw new Error("Failed to fetch current user");
      const u = await r.json();
      const role = u.role;
      setcurrentRole(role);
      await Promise.all([fetchBlogs(), fetchCaseStudies()]);
      if (role === 1) await fetchAdmins();
    } catch (e) {
      seterror(e.message || "Failed to load archived items");
    } finally {
      setisloading(false);
    }
  }, [API, fetchBlogs, fetchCaseStudies, fetchAdmins]);
  useEffect(() => {
    loadAll();
  }, [loadAll]);
  useEffect(() => {
    if (successmsg) {
      const t = setTimeout(() => setsuccessmsg(null), 3500);
      return () => clearTimeout(t);
    }
  }, [successmsg]);
  const restoreBlog = async (id) => {
    try {
      setrestoringid(id);
      const r = await fetch(`${API}/blogs/${id}/restore`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (!r.ok) {
        const d = await r.json();
        throw new Error(d.error || "Failed to restore blog");
      }
      setarchivedblogs((p) => p.filter((b) => b._id !== id));
      setsuccessmsg("Blog restored successfully!");
      setconfirmrestore(null);
    } catch (e) {
      seterror(e.message || "Failed to restore blog");
    } finally {
      setrestoringid(null);
    }
  };
  const restoreCS = async (id) => {
    try {
      setrestoringid(id);
      const r = await fetch(`${API}/casestudies/${id}/restore`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (!r.ok) {
        const d = await r.json();
        throw new Error(d.error || "Failed to restore case study");
      }
      setarchivedcasestudies((p) => p.filter((cs) => cs._id !== id));
      setsuccessmsg("Case study restored successfully!");
      setconfirmrestore(null);
    } catch (e) {
      seterror(e.message || "Failed to restore case study");
    } finally {
      setrestoringid(null);
    }
  };
  const restoreAdmin = async (id) => {
    try {
      setrestoringid(id);
      const r = await fetch(`${API}/users/${id}/restore`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (!r.ok) {
        const d = await r.json();
        throw new Error(d.error || "Failed to restore admin");
      }
      setarchivedadmins((p) => p.filter((a) => a._id !== id));
      setsuccessmsg("Admin account restored successfully!");
      setconfirmrestore(null);
    } catch (e) {
      seterror(e.message || "Failed to restore admin");
    } finally {
      setrestoringid(null);
    }
  };
  const doRestore = () => {
    if (!confirmrestore) return;
    if (confirmrestore.type === "blog") restoreBlog(confirmrestore.id);
    else if (confirmrestore.type === "casestudy") restoreCS(confirmrestore.id);
    else restoreAdmin(confirmrestore.id);
  };
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const getStatusBadge = (s) => {
    const map = {
      published: { bg: "#00A651", color: "#fff" },
      active: { bg: "#00A651", color: "#fff" },
      draft: { bg: isdarkmode ? "#3a3a3a" : "#e5e7eb", color: isdarkmode ? "#9ca3af" : "#6b7280" },
      scheduled: { bg: "#8b5cf6", color: "#fff" },
      completed: { bg: "#0066CC", color: "#fff" }
    };
    const key = s?.toLowerCase() || "";
    const style = map[key] || { bg: isdarkmode ? "#3a3a3a" : "#e5e7eb", color: isdarkmode ? "#9ca3af" : "#6b7280" };
    return {
      background: style.bg,
      color: style.color,
      padding: "3px 12px",
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 500,
      display: "inline-block",
      whiteSpace: "nowrap",
      fontFamily: FONT
    };
  };
  const getTypeBadge = (t) => {
    const map = {
      blog: { bg: "#8B0000", color: "#fff" },
      casestudy: { bg: "#0066CC", color: "#fff" },
      admin: { bg: "#4B0082", color: "#fff" }
    };
    const s = map[t];
    return {
      background: s.bg,
      color: s.color,
      padding: "3px 12px",
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 500,
      display: "inline-block",
      whiteSpace: "nowrap",
      fontFamily: FONT
    };
  };
  const getRoleBadge = (role) => ({
    background: role === 1 ? "#8B0000" : "#B45309",
    color: "#fff",
    padding: "3px 12px",
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 500,
    display: "inline-block",
    whiteSpace: "nowrap",
    fontFamily: FONT
  });
  const applySort = (list) => {
    const s = [...list];
    const getName = (x) => x.title || `${x.firstName || ""} ${x.lastName || ""}`;
    const getDate = (x) => new Date(x.updatedAt || x.createdAt).getTime();
    switch (sortmode) {
      case "alpha-asc":
        return s.sort((a, b) => getName(a).localeCompare(getName(b)));
      case "alpha-desc":
        return s.sort((a, b) => getName(b).localeCompare(getName(a)));
      case "date-newest":
        return s.sort((a, b) => getDate(b) - getDate(a));
      case "date-oldest":
        return s.sort((a, b) => getDate(a) - getDate(b));
      default:
        return s;
    }
  };
  const getItems = () => {
    const blogs = archivedblogs.map((b) => ({ ...b, _type: "blog" }));
    const cases = archivedcasestudies.map((c) => ({ ...c, _type: "casestudy" }));
    const admins = archivedadmins.map((a) => ({ ...a, _type: "admin" }));
    let items2 = activefilter === "All" ? [...blogs, ...cases] : activefilter === "Blogs" ? blogs : activefilter === "CaseStudy" ? cases : admins;
    if (searchquery.trim()) {
      const q = searchquery.toLowerCase();
      items2 = items2.filter((it) => {
        if (it._type === "admin")
          return `${it.firstName} ${it.lastName}`.toLowerCase().includes(q) || it.email.toLowerCase().includes(q) || (departments[it.department] || "").toLowerCase().includes(q);
        const authorMatch = it._type === "casestudy" ? (it.authors || []).some((a) => a.name.toLowerCase().includes(q)) : (it.author || "").toLowerCase().includes(q);
        return (it.title || "").toLowerCase().includes(q) || authorMatch;
      });
    }
    return applySort(items2);
  };
  const items = getItems();
  const totB = archivedblogs.length;
  const totC = archivedcasestudies.length;
  const totA = archivedadmins.length;
  const filterOptions = [
    { label: "All", value: "All", count: totB + totC },
    { label: "Blogs", value: "Blogs", count: totB },
    { label: "Case Studies", value: "CaseStudy", count: totC },
    ...isMainAdmin ? [{ label: "Admins", value: "Admin", count: totA }] : []
  ];
  const statCards = [
    {
      label: "Total Archived",
      value: totB + totC + (isMainAdmin ? totA : 0),
      subtitle: `${filterOptions.length - 1} content type${filterOptions.length - 1 !== 1 ? "s" : ""}`,
      iconColor: "#059669",
      dark: false,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
    },
    {
      label: "Blogs",
      value: totB,
      subtitle: "Archived blog posts",
      iconColor: "#8B0000",
      dark: false,
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
    },
    {
      label: "Case Studies",
      value: totC,
      subtitle: "Archived case studies",
      iconColor: "#0066CC",
      dark: false,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    },
    ...isMainAdmin ? [{
      label: "Admins",
      value: totA,
      subtitle: "Archived admin accounts",
      iconColor: "#fff",
      dark: true,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    }] : []
  ];
  const inp = (extra = {}) => ({
    padding: "10px 14px",
    borderRadius: 12,
    border: `1.5px solid ${borderColor}`,
    background: inputBg,
    color: textPrimary,
    fontSize: 12,
    fontWeight: 400,
    outline: "none",
    fontFamily: FONT,
    transition: "border-color .15s",
    ...extra
  });
  const Spinner = () => <div style={{ width: 11, height: 11, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "arc-spin 0.8s linear infinite" }} />;
  const RestoreIcon = () => <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>;
  const rBtn = (loading) => ({
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 14px",
    borderRadius: 10,
    border: "none",
    background: "#059669",
    color: "#fff",
    fontSize: 11,
    fontWeight: 500,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.65 : 1,
    transition: "opacity 0.15s",
    whiteSpace: "nowrap",
    fontFamily: FONT
  });
  const RBtn = ({ loading, onClick, disabled }) => <button className="arc-rbtn" onClick={onClick} disabled={disabled} style={rBtn(loading)}>
      {loading ? <><Spinner /><span className="arc-rbtn-label">Restoring...</span></> : <><RestoreIcon /><span className="arc-rbtn-label">Restore</span></>}
    </button>;
  if (isloading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: pageBg, fontFamily: FONT }}>
      <style>{`@keyframes arc-spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 44, height: 44, border: "4px solid #800000", borderTopColor: "transparent", borderRadius: "50%", animation: "arc-spin 0.8s linear infinite", margin: "0 auto 16px", display: "inline-block" }} />
        <p style={{ fontSize: 12, color: textMuted, fontWeight: 400, fontFamily: FONT }}>Loading archived content...</p>
      </div>
    </div>;
  return <div style={{ minHeight: "100vh", background: pageBg, padding: "clamp(16px, 4vw, 32px)", fontFamily: FONT }}>
      <style>{`
        @keyframes arc-spin { to { transform: rotate(360deg) } }
        .arc-row:hover { background: ${isdarkmode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"} !important; }
        .arc-card { transition: transform .18s, box-shadow .18s, border-color .18s; }
        .arc-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,${isdarkmode ? ".35" : ".09"}) !important; border-color: ${isdarkmode ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.12)"} !important; }
        .arc-pill:hover { opacity: .78; }
        .arc-rbtn:hover { opacity: .82 !important; }

        /* \u2500\u2500 Responsive \u2500\u2500 */
        .arc-stat-grid { display: grid; grid-template-columns: repeat(${isMainAdmin ? 4 : 3}, 1fr); gap: 16px; }
        @media (max-width: 900px) {
          .arc-stat-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
        @media (max-width: 540px) {
          .arc-stat-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
        }

        .arc-filters { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; padding: 4px 0; }
        .arc-filter-row { display: contents; }
        @media (max-width: 640px) {
          .arc-filters { flex-direction: column; align-items: stretch !important; gap: 8px !important; }
          .arc-filter-divider { display: none !important; }
          .arc-search-wrap { width: 100% !important; }
          .arc-search-wrap input { width: 100% !important; box-sizing: border-box !important; }
          .arc-filter-row { display: flex !important; gap: 8px !important; width: 100% !important; align-items: center !important; }
          .arc-filter-row > div { flex: 1; min-width: 0; }
          .arc-filter-row > div select { width: 100%; box-sizing: border-box; }
          .arc-filter-row > div > span { display: none !important; }
          .arc-view-toggle { margin-left: auto !important; align-self: flex-end !important; }
        }

        .arc-list-grid { display: grid; grid-template-columns: 90px 3fr 1.2fr 1.4fr 110px 110px; gap: 12px; }
        @media (max-width: 860px) {
          .arc-list-grid { grid-template-columns: 60px 2fr 110px 110px !important; }
          .arc-list-author, .arc-list-category { display: none !important; }
        }
        @media (max-width: 560px) {
          .arc-list-grid { grid-template-columns: 2fr 100px !important; }
          .arc-list-date, .arc-list-author, .arc-list-category, .arc-list-status { display: none !important; }
        }

        .arc-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 12px; padding: 16px; }
        .arc-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 12px; padding: 16px; }
        @media (max-width: 640px) {
          .arc-card-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; padding: 12px !important; }
          .arc-card-img { height: 100px !important; }
          .arc-card-body { padding: 10px !important; }
          .arc-card-title { font-size: 10px !important; }
          .arc-card-meta { font-size: 9px !important; }
          .arc-card-footer { padding-top: 8px !important; }
        }
        @media (max-width: 360px) {
          .arc-card-grid { grid-template-columns: 1fr !important; }
        }

        .arc-record-header { display: flex; align-items: center; justify-content: space-between; }
        @media (max-width: 480px) {
          .arc-record-header { flex-direction: column; align-items: flex-start !important; gap: 4px; }
        }

        /* Restore button: icon-only on mobile */
        .arc-rbtn .arc-rbtn-label { display: inline; }
        @media (max-width: 640px) {
          .arc-rbtn .arc-rbtn-label { display: none !important; }
          .arc-rbtn { padding: 7px !important; border-radius: 9px !important; }
        }

        /* Restore modal: full-screen sheet on mobile */
        .arc-modal-wrap { padding: 24px; align-items: center; }
        .arc-modal-box { border-radius: 32px; max-width: 440px; width: 100%; }
        .arc-modal-inner { padding: 32px 36px; }
        .arc-modal-handle { display: none; }
        @media (max-width: 480px) {
          .arc-modal-wrap { padding: 0 !important; align-items: flex-end !important; }
          .arc-modal-box { border-radius: 24px 24px 0 0 !important; max-width: 100% !important; width: 100% !important; }
          .arc-modal-inner { padding: 16px 20px 36px !important; }
          .arc-modal-handle { display: block !important; }
          .arc-modal-title { font-size: 16px !important; }
          .arc-modal-item-box { padding: 14px 16px !important; border-radius: 14px !important; }
          .arc-modal-item-title { font-size: 13px !important; }
          .arc-modal-actions { gap: 8px !important; }
          .arc-modal-actions button { padding: 13px 0 !important; font-size: 13px !important; border-radius: 12px !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

        {
    /* â”€â”€ Toasts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  }
        {successmsg && <div style={{ position: "fixed", top: 28, right: 28, background: "#059669", color: "#fff", padding: "14px 24px", borderRadius: 20, fontSize: 12, fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.22)", zIndex: 50, fontFamily: FONT }}>
            ✓ {successmsg}
          </div>}
        {error && <div style={{ position: "fixed", top: 28, right: 28, background: "#dc2626", color: "#fff", padding: "14px 24px", borderRadius: 20, fontSize: 12, fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.22)", zIndex: 50, display: "flex", alignItems: "center", gap: 12, fontFamily: FONT }}>
            {error}
            <button onClick={() => seterror(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 11, textDecoration: "underline", fontFamily: FONT }}>Dismiss</button>
          </div>}

        {
    /* â”€â”€ Page Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  }
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: FONT }}>
              Archived Content
            </h2>
            <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0", fontWeight: 400, fontFamily: FONT }}>
              Manage archived blogs, case studies{isMainAdmin ? ", and admin accounts" : ""}. Restore items to make them visible again.
            </p>
          </div>
          <button
    onClick={loadAll}
    style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 12, background: "#8B0000", color: "#ffffff", fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer", fontFamily: FONT, transition: "opacity .15s, transform .15s", boxShadow: "0 2px 8px rgba(139,0,0,0.3)" }}
    onMouseOver={(e) => {
      e.currentTarget.style.opacity = "0.85";
      e.currentTarget.style.transform = "translateY(-1px)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.opacity = "1";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {
    /* â”€â”€ Divider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  }
        <div style={{ height: 1, background: borderColor, width: "100%" }} />

        {
    /* â”€â”€ Stat Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  }
        <div className="arc-stat-grid">
          {statCards.map((card, i) => {
    const gradients = [
      { from: "#059669", to: "#047857", accent: "#34d399", mid: "#05966988" },
      { from: "#8B0000", to: "#6b0000", accent: "#fca5a5", mid: "#8B000088" },
      { from: "#0066CC", to: "#004fa3", accent: "#93c5fd", mid: "#0066CC88" },
      { from: "#2d4a35", to: "#1a2e20", accent: "#86efac", mid: "#2d4a3588" }
    ];
    const g = gradients[i] || gradients[0];
    return <div
      key={i}
      style={{ position: "relative", paddingTop: 14, cursor: "pointer", transition: "transform .2s" }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
                {
      /* Folder tab */
    }
                <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "55%",
      height: 20,
      background: g.from,
      borderRadius: "8px 8px 0 0",
      opacity: 0.9
    }} />

                {
      /* Card body */
    }
                <div style={{
      borderRadius: "0 10px 10px 10px",
      overflow: "hidden",
      position: "relative",
      height: 145,
      boxShadow: `0 4px 20px ${g.from}44`
    }}>
                  {
      /* Background image */
    }
                  <img
      src={card.image}
      alt=""
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
    />

                  {
      /* Gradient overlay: solid on left fading to transparent on right */
    }
                  <div style={{
      position: "absolute",
      inset: 0,
      background: `linear-gradient(to right, ${g.from} 0%, ${g.from} 45%, ${g.mid} 70%, transparent 100%)`
    }} />

                  {
      /* Dark vignette on far right edge */
    }
                  <div style={{
      position: "absolute",
      inset: 0,
      background: `linear-gradient(to left, rgba(0,0,0,0.18) 0%, transparent 40%)`
    }} />

                  {
      /* Folder-shaped translucent overlay — raised on left, steps down to right */
    }
                  <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
      viewBox="0 0 300 145"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
                    {
      /* Folder body — raised on left, tab notch cuts down toward the right */
    }
                    <path
      d="M0,46 L125,46 C140,46 145,58 155,68 C165,78 170,78 185,78 L300,78 L300,145 L0,145 Z"
      fill="rgba(255,255,255,0.13)"
    />
                    {
      /* Subtle top edge highlight */
    }
                    <path
      d="M0,46 L125,46 C140,46 145,58 155,68 C165,78 170,78 185,78 L300,78"
      fill="none"
      stroke="rgba(255,255,255,0.30)"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
                  </svg>

                  {
      /* Icon — top right corner, glassmorphism */
    }
                  <div style={{
      position: "absolute",
      top: 12,
      right: 14,
      zIndex: 3,
      width: 34,
      height: 34,
      borderRadius: 10,
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.25)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      boxShadow: "0 2px 12px rgba(0,0,0,0.18)"
    }}>
                    {card.icon}
                  </div>

                  {
      /* Content (left side) */
    }
                  <div style={{ position: "relative", zIndex: 2, padding: "14px 18px", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", width: "72%" }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {card.label}
                    </p>
                    <div>
                      <p style={{ fontSize: 36, fontWeight: 700, color: "#fff", margin: "0 0 3px", lineHeight: 1, fontFamily: FONT, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                        {card.value}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: g.accent, flexShrink: 0 }} />
                        <p style={{ fontSize: 10, fontWeight: 400, color: "rgba(255,255,255,0.7)", margin: 0, fontFamily: FONT }}>
                          {card.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>;
  })}
        </div>

        {
    /* â”€â”€ Filters Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  }
        <div className="arc-filters">

          {
    /* Row 1: Search (full width on mobile) */
  }
          <div className="arc-search-wrap" style={{ position: "relative", width: 240, flexShrink: 0 }}>
            <svg style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: textMuted, pointerEvents: "none" }} width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
    type="text"
    placeholder={activefilter === "Admin" ? "Search by name or email..." : "Search by title or author..."}
    value={searchquery}
    onChange={(e) => setsearchquery(e.target.value)}
    style={{ ...inp({ paddingLeft: 34, width: "100%", boxSizing: "border-box" }) }}
    onFocus={(e) => e.target.style.borderColor = "#800000"}
    onBlur={(e) => e.target.style.borderColor = borderColor}
  />
          </div>

          {
    /* Desktop divider */
  }
          <div className="arc-filter-divider" style={{ width: 1, height: 28, background: borderColor, flexShrink: 0 }} />

          {
    /* Row 2 on mobile: Filter + Sort side by side */
  }
          <div className="arc-filter-row">
            {
    /* Filter by */
  }
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 11, color: textMuted, fontWeight: 400, whiteSpace: "nowrap", fontFamily: FONT }}>Filter by</span>
              <select
    value={activefilter}
    onChange={(e) => setactivefilter(e.target.value)}
    style={inp({ padding: "9px 12px", fontSize: 11, cursor: "pointer" })}
    onFocus={(e) => e.target.style.borderColor = "#800000"}
    onBlur={(e) => e.target.style.borderColor = borderColor}
  >
                {filterOptions.map((f) => <option key={f.value} value={f.value}>
                    {f.label} ({f.count})
                  </option>)}
              </select>
            </div>

            {
    /* Sort by */
  }
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 11, color: textMuted, fontWeight: 400, whiteSpace: "nowrap", fontFamily: FONT }}>Sort by</span>
              <select
    value={sortmode}
    onChange={(e) => setsortmode(e.target.value)}
    style={inp({ padding: "9px 12px", fontSize: 11, cursor: "pointer" })}
    onFocus={(e) => e.target.style.borderColor = "#800000"}
    onBlur={(e) => e.target.style.borderColor = borderColor}
  >
                <option value="date-newest">Newest First</option>
                <option value="date-oldest">Oldest First</option>
                <option value="alpha-asc">Name A → Z</option>
                <option value="alpha-desc">Name Z → A</option>
              </select>
            </div>
          </div>

          {
    /* Row 3 on mobile: View toggle right-aligned */
  }
          <div className="arc-view-toggle" style={{ marginLeft: "auto", display: "flex", border: `1.5px solid ${borderColor}`, borderRadius: 12, overflow: "hidden", background: inputBg }}>
            {[
    ["grid", "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"],
    ["list", "M4 6h16M4 12h16M4 18h16"]
  ].map(([m, d], i) => <button
    key={m}
    onClick={() => setviewmode(m)}
    style={{ padding: "8px 12px", borderTop: "none", borderBottom: "none", borderRight: "none", borderLeftWidth: i > 0 ? 1 : 0, borderLeftStyle: "solid", borderLeftColor: borderColor, background: viewmode === m ? "#800000" : "transparent", color: viewmode === m ? "#fff" : textMuted, cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center" }}
  >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                </svg>
              </button>)}
          </div>
        </div>

        {
    /* â”€â”€ Content Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  }
        <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: "hidden", boxShadow: isdarkmode ? "none" : "0 2px 12px rgba(0,0,0,0.05)" }}>

          {
    /* Card header */
  }
          <div className="arc-record-header" style={{ padding: "18px 24px", borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: FONT }}>Archived records</p>
              <p style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontWeight: 400, fontFamily: FONT }}>
                {activefilter === "All" ? "All content types" : `Filtered by ${activefilter}`}{searchquery ? ` \xB7 matching "${searchquery}"` : ""}
              </p>
            </div>
            <span style={{ fontSize: 11, color: textMuted, fontFamily: FONT }}>
              Showing <strong style={{ color: textPrimary, fontFamily: FONT }}>{items.length}</strong> item{items.length !== 1 ? "s" : ""}
            </span>
          </div>

          {
    /* Empty */
  }
          {items.length === 0 && <div style={{ padding: "72px 20px", textAlign: "center" }}>
              <svg style={{ margin: "0 auto 16px", display: "block", color: isdarkmode ? "#374151" : "#d1d5db" }} width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <p style={{ fontSize: 14, fontWeight: 500, color: textMuted, margin: "0 0 4px", fontFamily: FONT }}>No archived items found</p>
              <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0, fontFamily: FONT }}>
                {searchquery ? "Try adjusting your search query." : "Archived content will appear here."}
              </p>
            </div>}

          {
    /* â”€â”€ GRID VIEW — Compact vertical cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  }
          {items.length > 0 && viewmode === "grid" && <div className="arc-card-grid">
              {items.map((item) => {
    const isAdmin = item._type === "admin";
    const isBlog = item._type === "blog";
    const blog = isBlog ? item : null;
    const cs = !isBlog && !isAdmin ? item : null;
    const admin = isAdmin ? item : null;
    const loading = restoringid === item._id;
    const coverImage = isAdmin ? admin?.profilePicture : isBlog ? blog?.picture : cs?.cover;
    const title = isAdmin ? `${admin?.firstName} ${admin?.lastName}` : item.title || "";
    const subtitle = isAdmin ? admin?.email : isBlog ? blog?.shortDescription : cs?.subtitle;
    const author = isAdmin ? `${admin?.firstName} ${admin?.lastName}` : isBlog ? blog?.author || "" : (cs?.authors || []).map((a) => a.name).join(", ");
    const date = fmtDate(item.updatedAt || item.createdAt);
    const status = isAdmin ? admin?.role === 1 ? "Main Admin" : "Admin" : item.status || "";
    const accentColor = isAdmin ? "#4B0082" : isBlog ? "#8B0000" : "#0066CC";
    const type = isAdmin ? "admin" : isBlog ? "blog" : "casestudy";
    return <div key={item._id} className="arc-card" style={{
      background: cardBg,
      border: `1px solid ${borderColor}`,
      borderRadius: 14,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxShadow: isdarkmode ? "0 1px 4px rgba(0,0,0,.3)" : "0 2px 8px rgba(0,0,0,.06)"
    }}>
                    {
      /* Cover image */
    }
                    <div className="arc-card-img" style={{ position: "relative", height: 120, overflow: "hidden", flexShrink: 0, background: isdarkmode ? "#111" : "#f3f4f6" }}>
                      {coverImage ? <img src={coverImage} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => {
      e.target.style.display = "none";
    }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: `${accentColor}15` }}>
                            <span style={{ fontSize: 30, fontWeight: 700, color: accentColor, fontFamily: FONT }}>{title.charAt(0).toUpperCase()}</span>
                          </div>}
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 55%)" }} />
                      <div style={{ position: "absolute", top: 8, left: 8 }}>
                        <span style={getTypeBadge(type)}>{isAdmin ? "Admin" : isBlog ? "Blog" : "Case Study"}</span>
                      </div>
                    </div>

                    {
      /* Content body */
    }
                    <div className="arc-card-body" style={{ padding: "11px 13px", display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
                      <p className="arc-card-title" style={{ fontSize: 11, fontWeight: 700, color: textPrimary, margin: 0, lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontFamily: FONT, textTransform: "uppercase" }}>
                        {title}
                      </p>
                      {subtitle && <p className="arc-card-meta" style={{ fontSize: 10, color: textMuted, margin: 0, fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: FONT }}>
                          {subtitle}
                        </p>}
                      <p className="arc-card-meta" style={{ fontSize: 10, color: textMuted, margin: 0, fontFamily: FONT }}>
                        By <span style={{ fontWeight: 600, color: textPrimary }}>{author}</span> · {date}
                      </p>

                      {
      /* Tags / Category */
    }
                      {!isAdmin && isBlog && blog?.mainCategory && <span style={{ fontSize: 9, fontWeight: 500, padding: "2px 7px", borderRadius: 5, background: isdarkmode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", color: textMuted, width: "fit-content", fontFamily: FONT }}>
                          {blog.mainCategory}
                        </span>}
                      {!isAdmin && !isBlog && cs?.tags?.length ? <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                          {cs.tags.slice(0, 2).map((t) => <span key={t} style={{ fontSize: 9, fontWeight: 500, padding: "2px 6px", borderRadius: 4, background: isdarkmode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", color: textMuted, fontFamily: FONT }}>{t}</span>)}
                          {cs.tags.length > 2 && <span style={{ fontSize: 9, color: textMuted, fontFamily: FONT }}>+{cs.tags.length - 2}</span>}
                        </div> : null}
                      {isAdmin && admin && <span style={{ fontSize: 10, color: textMuted, fontFamily: FONT }}>{getDeptIcon(admin.department)} {departments[admin.department]}</span>}

                      <div style={{ flex: 1 }} />

                      {
      /* Footer */
    }
                      <div className="arc-card-footer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 9, borderTop: `1px solid ${borderColor}`, marginTop: 2 }}>
                        <span style={isAdmin ? getRoleBadge(admin.role) : getStatusBadge(status)}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                        <RBtn loading={loading} onClick={() => setconfirmrestore({ id: item._id, title, type })} disabled={loading} />
                      </div>
                    </div>
                  </div>;
  })}
            </div>}

          {
    /* â”€â”€ LIST VIEW — Timeline / zebra rows â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  }
          {items.length > 0 && viewmode === "list" && <>
              {
    /* Column headers */
  }
              <div className="arc-list-grid" style={{ padding: "10px 22px", background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
                <span className="arc-list-date" style={{ fontSize: 10, fontWeight: 600, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: FONT }}>Date</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: FONT }}>Title / Name</span>
                <span className="arc-list-author" style={{ fontSize: 10, fontWeight: 600, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: FONT }}>Author</span>
                <span className="arc-list-category" style={{ fontSize: 10, fontWeight: 600, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: FONT }}>Category</span>
                <span className="arc-list-status" style={{ fontSize: 10, fontWeight: 600, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: FONT }}>Status</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: textMuted, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right", fontFamily: FONT }}>Action</span>
              </div>

              {items.map((item, idx) => {
    const isAdmin = item._type === "admin";
    const isBlog = item._type === "blog";
    const blog = isBlog ? item : null;
    const cs = !isBlog && !isAdmin ? item : null;
    const admin = isAdmin ? item : null;
    const loading = restoringid === item._id;
    const coverImage = isAdmin ? admin?.profilePicture : isBlog ? blog?.picture : cs?.cover;
    const title = isAdmin ? `${admin?.firstName} ${admin?.lastName}` : item.title || "";
    const author = isAdmin ? admin?.email || "" : isBlog ? blog?.author || "" : (cs?.authors || []).map((a) => a.name).join(", ");
    const date = fmtDate(item.updatedAt || item.createdAt);
    const status = item.status || "";
    const accentColor = isAdmin ? "#4B0082" : isBlog ? "#8B0000" : "#0066CC";
    const type = isAdmin ? "admin" : isBlog ? "blog" : "casestudy";
    const isEven = idx % 2 === 0;
    return <div key={item._id} className="arc-row arc-list-grid" style={{
      alignItems: "center",
      padding: "12px 22px",
      background: isEven ? isdarkmode ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.012)" : "transparent",
      borderBottom: `1px solid ${borderColor}`,
      transition: "background .15s"
    }}>

                    {
      /* Date column */
    }
                    <div className="arc-list-date" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: textPrimary, fontFamily: FONT }}>
                        {new Date(item.updatedAt || item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <span style={{ fontSize: 10, color: textMuted, fontFamily: FONT }}>
                        {new Date(item.updatedAt || item.createdAt).getFullYear()}
                      </span>
                    </div>

                    {
      /* Title / Name */
    }
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, overflow: "hidden", background: `${accentColor}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {coverImage ? <img src={coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => {
      e.target.style.display = "none";
    }} /> : <span style={{ fontSize: 13, fontWeight: 700, color: accentColor, fontFamily: FONT }}>{title.charAt(0)}</span>}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <span style={getTypeBadge(type)}>{isAdmin ? "Admin" : isBlog ? "Blog" : "Case Study"}</span>
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: FONT }}>{title}</p>
                      </div>
                    </div>

                    {
      /* Author */
    }
                    <div className="arc-list-author" style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 12, color: textPrimary, fontWeight: 500, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: FONT }}>{author}</p>
                    </div>

                    {
      /* Category / Dept / Tags */
    }
                    <div className="arc-list-category">
                      {isAdmin && admin ? <span style={{ fontSize: 10, color: textMuted, fontFamily: FONT }}>{getDeptIcon(admin.department)} {departments[admin.department]}</span> : isBlog && blog?.mainCategory ? <span style={{ fontSize: 9, fontWeight: 500, padding: "2px 8px", borderRadius: 5, background: `${accentColor}14`, color: accentColor, fontFamily: FONT }}>{blog.mainCategory}</span> : cs?.tags?.length ? <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {cs.tags.slice(0, 2).map((t) => <span key={t} style={{ fontSize: 9, fontWeight: 500, padding: "2px 6px", borderRadius: 4, background: `${accentColor}14`, color: accentColor, fontFamily: FONT }}>{t}</span>)}
                          {cs.tags.length > 2 && <span style={{ fontSize: 9, color: textMuted, fontFamily: FONT }}>+{cs.tags.length - 2}</span>}
                        </div> : <span style={{ fontSize: 11, color: textMuted, fontFamily: FONT }}>—</span>}
                    </div>

                    {
      /* Status */
    }
                    <div className="arc-list-status">
                      {isAdmin && admin ? <span style={getRoleBadge(admin.role)}>{admin.role === 1 ? "Main Admin" : "Admin"}</span> : <span style={getStatusBadge(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>}
                    </div>

                    {
      /* Action */
    }
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <RBtn loading={loading} onClick={() => setconfirmrestore({ id: item._id, title, type })} disabled={loading} />
                    </div>
                  </div>;
  })}

              <div style={{ padding: "11px 22px", background: subtleBg, borderTop: `1px solid ${borderColor}` }}>
                <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0, fontFamily: FONT }}>
                  {items.length} item{items.length !== 1 ? "s" : ""} displayed
                  {activefilter !== "All" && ` \xB7 filtered by "${activefilter}"`}
                  {searchquery && ` \xB7 matching "${searchquery}"`}
                </p>
              </div>
            </>}
        </div>

      </div>

      {
    /* â”€â”€ Confirm Restore Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  }
      {confirmrestore && <div className="arc-modal-wrap" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", zIndex: 50 }}>
          <div className="arc-modal-box" style={{ background: cardBg, border: `1px solid ${borderColor}`, boxShadow: "0 32px 80px rgba(0,0,0,0.32)", fontFamily: FONT, alignSelf: "auto" }}>
            <div className="arc-modal-inner">
              {
    /* Drag handle (visible on mobile) */
  }
              <div style={{ width: 36, height: 4, borderRadius: 2, background: isdarkmode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)", margin: "0 auto 20px" }} className="arc-modal-handle" />

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h3 className="arc-modal-title" style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: FONT }}>Restore Item</h3>
                  <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0", fontWeight: 400, fontFamily: FONT }}>This item will be restored and made active again</p>
                </div>
                <button onClick={() => setconfirmrestore(null)} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: subtleBg, color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div style={{ marginBottom: 16 }}>
                <span style={getTypeBadge(confirmrestore.type)}>
                  {confirmrestore.type === "blog" ? "Blog" : confirmrestore.type === "casestudy" ? "Case Study" : "Admin"}
                </span>
              </div>

              <div className="arc-modal-item-box" style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, padding: "20px 22px", marginBottom: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 6px", textTransform: "uppercase", fontFamily: FONT }}>
                  {confirmrestore.type === "blog" ? "Blog Post" : confirmrestore.type === "casestudy" ? "Case Study" : "Admin Account"}
                </p>
                <p className="arc-modal-item-title" style={{ fontSize: 15, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: FONT }}>{confirmrestore.title}</p>
              </div>

              <p style={{ fontSize: 12, color: textMuted, lineHeight: 1.6, margin: "0 0 20px", fontWeight: 400, fontFamily: FONT }}>
                This action can be undone by archiving it again at any time.
              </p>

              <div className="arc-modal-actions" style={{ display: "flex", gap: 10, paddingTop: 16, borderTop: `1px solid ${borderColor}` }}>
                <button
    onClick={() => setconfirmrestore(null)}
    disabled={!!restoringid}
    style={{ flex: 1, padding: "11px 0", borderRadius: 14, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: FONT }}
  >
                  Cancel
                </button>
                <button
    onClick={doRestore}
    disabled={!!restoringid}
    style={{ flex: 2, padding: "11px 0", borderRadius: 14, border: "none", background: "#059669", color: "#fff", fontSize: 12, fontWeight: 500, cursor: restoringid ? "not-allowed" : "pointer", opacity: restoringid ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT }}
  >
                  {restoringid ? <><Spinner /><span>Restoring...</span></> : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v5h5" /></svg>Restore</>}
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
}
export {
  ListArchivedServices as default
};
