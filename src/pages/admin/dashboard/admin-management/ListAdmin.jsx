
import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import DashboardLoader, { useInitialLoad } from "@/components/DashboardLoader";
import EditAdmin from "./EditAdmin";
import { useDarkMode } from "@/pages/admin/dashboard/Layout";
function ListAdmin() {
  const [admins, setAdmins] = useState([]);
  const [adminToArchive, setAdminToArchive] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [viewingAdmin, setViewingAdmin] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const initialLoading = useInitialLoad(isLoading);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("Name A\u2192Z");
  const cardsPerPage = 8;
  const { isdarkmode } = useDarkMode();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
  const pageBg = "var(--admin-bg)";
  const cardBg = "var(--admin-surface)";
  const subtleBg = "var(--admin-bg-soft)";
  const borderColor = "var(--admin-border)";
  const textPrimary = "var(--admin-text)";
  const textMuted = "var(--admin-text-faint)";
  const inputBg = "var(--admin-bg-soft)";
  const departments = {
    1: "Compliance",
    2: "Innovation",
    3: "Marketing",
    4: "Recruitment",
    5: "Human Resources"
  };
  const roles = {
    1: "Main Administrator",
    2: "Administrator"
  };
  const departmentIcons = {
    1: "\u2696\uFE0F",
    2: "\u{1F4A1}",
    3: "\u{1F4E2}",
    4: "\u{1F465}",
    5: "\u{1F91D}"
  };
  const departmentList = Object.entries(departments).map(([k, v]) => ({ id: parseInt(k), name: v }));
  const roleList = Object.entries(roles).map(([k, v]) => ({ id: parseInt(k), name: v }));
  const inp = (extra = {}) => ({
    padding: "10px 14px",
    borderRadius: 12,
    border: `1.5px solid ${borderColor}`,
    background: inputBg,
    color: textPrimary,
    fontSize: 12,
    fontWeight: 400,
    outline: "none",
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: 0,
    transition: "border-color .15s",
    ...extra
  });
  const getRoleBadgeStyle = (role) => {
    const map = { 1: "var(--admin-accent)", 2: "#FF4500" };
    return {
      background: map[role] || "#6b7280",
      color: "#fff",
      padding: "3px 12px",
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 500,
      display: "inline-block",
      whiteSpace: "nowrap",
      fontFamily: "'Poppins', sans-serif",
      letterSpacing: 0
    };
  };
  const getDeptBadgeStyle = () => ({
    background: "var(--admin-bg-hover)",
    color: textMuted,
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 500,
    display: "inline-block",
    whiteSpace: "nowrap",
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: 0
  });
  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const getUserInitials = (admin) => `${admin.firstName?.charAt(0) || ""}${admin.lastName?.charAt(0) || ""}`.toUpperCase();
  const loadAdmins = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error(`Failed to fetch admins: ${response.status}`);
      setAdmins(await response.json());
    } catch (err) {
      setError(err.message || "Failed to load admins.");
      setAdmins([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadAdmins();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDepartment, selectedRole, searchQuery, activeTab, sortBy]);
  const getFilteredAdmins = () => {
    let f = admins;
    if (activeTab === "Active") f = f.filter((a) => !a.isArchived);
    if (activeTab === "Inactive") f = f.filter((a) => a.isArchived);
    if (selectedDepartment !== "All") f = f.filter((a) => a.department === parseInt(selectedDepartment));
    if (selectedRole !== "All") f = f.filter((a) => a.role === parseInt(selectedRole));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      f = f.filter(
        (a) => `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q) || a.contactNumber?.toLowerCase().includes(q)
      );
    }
    f = [...f].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      if (sortBy === "Name A\u2192Z") return nameA.localeCompare(nameB);
      if (sortBy === "Name Z\u2192A") return nameB.localeCompare(nameA);
      if (sortBy === "Newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "Oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return 0;
    });
    return f;
  };
  const filteredAdmins = getFilteredAdmins();
  const totalPages = Math.ceil(filteredAdmins.length / cardsPerPage);
  const currentCards = filteredAdmins.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage);
  const allCount = admins.length;
  const activeCount = admins.filter((a) => !a.isArchived).length;
  const inactiveCount = admins.filter((a) => a.isArchived).length;
  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setIsEditing(true);
  };
  const closeEdit = () => {
    setIsEditing(false);
    setSelectedAdmin(null);
  };
  const handleSave = () => {
    loadAdmins();
    closeEdit();
  };
  const handleView = (admin) => setViewingAdmin(admin);
  const closeView = () => setViewingAdmin(null);
  const handleArchive = async (id) => {
    try {
      const r = await fetch(`${API_BASE_URL}/users/${id}/archive`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (!r.ok) throw new Error("Failed to archive admin");
      loadAdmins();
      setAdminToArchive(null);
    } catch (e) {
      console.error(e);
      alert("Failed to archive admin");
    }
  };
  if (isEditing && selectedAdmin) {
    return <EditAdmin admin={selectedAdmin} onClose={closeEdit} onSave={handleSave} />;
  }
  return <>
      <style>{`
        *, *::before, *::after { font-family: var(--font-body) !important; letter-spacing: 0 !important; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        input, textarea, select, option, button { font-family: var(--font-body) !important; letter-spacing: 0 !important; }
        input:focus, textarea:focus, select:focus { border-color: var(--admin-accent) !important; outline: none !important; box-shadow: none !important; }
        .la-row:hover { background: ${"var(--admin-bg-soft)"} !important; }
        .la-pill:hover { opacity: .78; }
        .la-card:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.28) !important; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>

      <div style={{ minHeight: "100vh", background: pageBg, padding: "32px", fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

          {
    /* â”€â”€ Error toast â”€â”€ */
  }
          {error && <div style={{ position: "fixed", top: 28, right: 28, background: "#dc2626", color: "#fff", padding: "14px 24px", borderRadius: 20, fontSize: 12, fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.22)", zIndex: 100, fontFamily: "'Poppins', sans-serif", letterSpacing: 0, display: "flex", alignItems: "center", gap: 12 }}>
              {error}
              <button onClick={() => {
    setError(null);
    loadAdmins();
  }} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "4px 10px", borderRadius: 8, fontSize: 11, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Retry</button>
            </div>}

          {
    /* â”€â”€ Page header â”€â”€ */
  }
          <PageHeader title="Admin Management" subtitle="Manage your team administrators, roles, and permissions." style={{ marginBottom: 4 }} />

          {
    /* â”€â”€ Summary stat cards â”€â”€ */
  }
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {[
    {
      label: "TOTAL ADMINS",
      value: admins.length,
      subtitle: "All accounts",
      overlay: "linear-gradient(135deg, rgba(60,0,0,0.88) 0%, rgba(100,0,0,0.75) 100%)",
      // Server rack / data center — admin panel vibe
      bg: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=60",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                  </svg>
    },
    {
      label: "ACTIVE",
      value: activeCount,
      subtitle: "Can log in",
      overlay: "linear-gradient(135deg, rgba(0,50,20,0.88) 0%, rgba(0,80,30,0.75) 100%)",
      // Team working / active collaboration
      bg: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=60",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
    },
    {
      label: "INACTIVE",
      value: inactiveCount,
      subtitle: "Disabled accounts",
      overlay: "linear-gradient(135deg, rgba(0,25,80,0.90) 0%, rgba(0,40,110,0.78) 100%)",
      // Lock / security — access control vibe
      bg: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=60",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
    },
    {
      label: "FILTERED",
      value: filteredAdmins.length,
      subtitle: "Current view",
      overlay: "linear-gradient(135deg, rgba(30,20,0,0.90) 0%, rgba(70,45,0,0.80) 100%)",
      // Analytics / dashboard screen — data overview vibe
      bg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=60",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
    }
  ].map((card, i) => <div
    key={i}
    className="stat-card"
    style={{
      borderRadius: 18,
      overflow: "hidden",
      position: "relative",
      minHeight: 148,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "18px 20px 16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.20)",
      transition: "transform .2s, box-shadow .2s",
      cursor: "default"
    }}
  >
                {
    /* Background image */
  }
                <div style={{
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${card.bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 0
  }} />
                {
    /* Color overlay */
  }
                <div style={{
    position: "absolute",
    inset: 0,
    background: card.overlay,
    zIndex: 1
  }} />

                {
    /* Top: label + icon */
  }
                <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <span style={{
    fontSize: 10,
    fontWeight: 600,
    color: "rgba(255,255,255,0.80)",
    letterSpacing: "0.08em",
    fontFamily: "'Poppins', sans-serif",
    textTransform: "uppercase"
  }}>
                    {card.label}
                  </span>
                  <div style={{
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.92)",
    flexShrink: 0
  }}>
                    {card.icon}
                  </div>
                </div>

                {
    /* Value */
  }
                <div style={{ position: "relative", zIndex: 2 }}>
                  <p style={{
    fontSize: 54,
    fontWeight: 700,
    color: "#ffffff",
    margin: "4px 0 0",
    lineHeight: 1,
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: "-2px"
  }}>
                    {card.value}
                  </p>
                </div>

                {
    /* Subtitle */
  }
                <div style={{ position: "relative", zIndex: 2 }}>
                  <p style={{
    fontSize: 11,
    color: "rgba(255,255,255,0.68)",
    margin: "8px 0 0",
    fontWeight: 400,
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: 0,
    display: "flex",
    alignItems: "center",
    gap: 5
  }}>
                    <span style={{ fontSize: 16, lineHeight: 1 }}>•</span>
                    {card.subtitle}
                  </p>
                </div>
              </div>)}
          </div>

          {
    /* â”€â”€ Filters card â”€â”€ */
  }
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, padding: "24px", boxShadow: "var(--admin-shadow-sm)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: "0 0 10px", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Filter by Department</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["All", ...departmentList.map((d) => d.id.toString())].map((val) => {
    const sel = selectedDepartment === val;
    const label = val === "All" ? "All Departments" : `${departmentIcons[parseInt(val)]} ${departments[parseInt(val)]}`;
    return <button key={val} className="la-pill" onClick={() => setSelectedDepartment(val)} style={{ padding: "5px 14px", borderRadius: 8, border: sel ? "none" : `1px solid ${borderColor}`, background: sel ? "var(--admin-accent)" : subtleBg, color: sel ? "#fff" : textMuted, fontSize: 11, fontWeight: sel ? 500 : 400, cursor: "pointer", transition: "all .15s", boxShadow: sel ? "0 2px 8px color-mix(in srgb, var(--admin-accent) 30%, transparent)" : "none", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                        {label}
                      </button>;
  })}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 500, color: textMuted, margin: "0 0 10px", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Filter by Role</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["All", ...roleList.map((r) => r.id.toString())].map((val) => {
    const sel = selectedRole === val;
    const label = val === "All" ? "All Roles" : roles[parseInt(val)];
    return <button key={val} className="la-pill" onClick={() => setSelectedRole(val)} style={{ padding: "5px 14px", borderRadius: 8, border: sel ? "none" : `1px solid ${borderColor}`, background: sel ? "var(--admin-accent)" : subtleBg, color: sel ? "#fff" : textMuted, fontSize: 11, fontWeight: sel ? 500 : 400, cursor: "pointer", transition: "all .15s", boxShadow: sel ? "0 2px 8px color-mix(in srgb, var(--admin-accent) 30%, transparent)" : "none", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                        {label}
                      </button>;
  })}
                </div>
              </div>
            </div>
          </div>

          {
    /* â”€â”€ Main content card â”€â”€ */
  }
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: "hidden", boxShadow: "var(--admin-shadow-sm)" }}>

            {
    /* â•â• TOOLBAR â•â• */
  }
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", background: cardBg }}>

              <div style={{ position: "relative", flexShrink: 0 }}>
                <svg style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: textMuted, pointerEvents: "none" }} width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
    type="text"
    placeholder="Search admins..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    style={inp({ paddingLeft: 32, width: 180, fontSize: 11 })}
  />
              </div>

              <div style={{ width: 1, height: 28, background: borderColor, flexShrink: 0 }} />

              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {[
    { key: "All", count: allCount },
    { key: "Active", count: activeCount },
    { key: "Inactive", count: inactiveCount }
  ].map(({ key, count }) => {
    const sel = activeTab === key;
    return <button
      key={key}
      className="la-pill"
      onClick={() => setActiveTab(key)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        borderRadius: 8,
        border: sel ? "none" : `1px solid ${borderColor}`,
        background: sel ? "var(--admin-accent)" : subtleBg,
        color: sel ? "#fff" : textMuted,
        fontSize: 11,
        fontWeight: sel ? 600 : 400,
        cursor: "pointer",
        transition: "all .15s",
        boxShadow: sel ? "0 2px 8px color-mix(in srgb, var(--admin-accent) 30%, transparent)" : "none",
        fontFamily: "'Poppins', sans-serif",
        letterSpacing: 0
      }}
    >
                      {key}
                      <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 18,
      height: 18,
      borderRadius: 6,
      padding: "0 4px",
      background: sel ? "rgba(255,255,255,0.22)" : "var(--admin-border-strong)",
      color: sel ? "#fff" : textMuted,
      fontSize: 10,
      fontWeight: 600,
      fontFamily: "'Poppins', sans-serif"
    }}>
                        {count}
                      </span>
                    </button>;
  })}
              </div>

              <div style={{ width: 1, height: 28, background: borderColor, flexShrink: 0 }} />

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: textMuted, fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0, whiteSpace: "nowrap" }}>Sort by</span>
                <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    style={inp({ padding: "6px 10px", fontSize: 11, cursor: "pointer", minWidth: 130 })}
  >
                  <option value="Name A→Z">Name A → Z</option>
                  <option value="Name Z→A">Name Z → A</option>
                  <option value="Newest">Newest First</option>
                  <option value="Oldest">Oldest First</option>
                </select>
              </div>

              <div style={{ flex: 1 }} />

              <span style={{ fontSize: 11, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0, whiteSpace: "nowrap" }}>
                Showing <strong style={{ color: textPrimary }}>{filteredAdmins.length}</strong> of <strong style={{ color: textPrimary }}>{allCount}</strong>
              </span>

              <div style={{ width: 1, height: 28, background: borderColor, flexShrink: 0 }} />

              <div style={{ display: "flex", gap: 4 }}>
                {["list", "grid"].map((mode) => <button
    key={mode}
    className="la-pill"
    onClick={() => setViewMode(mode)}
    style={{
      width: 32,
      height: 32,
      borderRadius: 8,
      border: "none",
      background: viewMode === mode ? "var(--admin-accent)" : subtleBg,
      color: viewMode === mode ? "#fff" : textMuted,
      cursor: "pointer",
      transition: "all .15s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: viewMode === mode ? "0 2px 8px color-mix(in srgb, var(--admin-accent) 30%, transparent)" : "none"
    }}
  >
                    {mode === "grid" ? <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> : <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>}
                  </button>)}
              </div>
            </div>

            {
    /* â”€â”€ Card header â”€â”€ */
  }
            <div style={{ padding: "18px 24px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Administrator records</p>
                <p style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>All registered admin accounts and their details</p>
              </div>
              <span style={{ fontSize: 11, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                Showing <strong style={{ color: textPrimary }}>{currentCards.length}</strong> of <strong style={{ color: textPrimary }}>{filteredAdmins.length}</strong> admins
              </span>
            </div>

            {
    /* â”€â”€ Loading â”€â”€ */
  }
            <DashboardLoader isVisible={initialLoading} message="Loading administrators…" />

            {
    /* â”€â”€ Empty â”€â”€ */
  }
            {!initialLoading && filteredAdmins.length === 0 && <div style={{ padding: "72px 20px", textAlign: "center" }}>
                <svg style={{ margin: "0 auto 16px", display: "block", color: "var(--admin-border-strong)" }} width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p style={{ fontSize: 14, fontWeight: 500, color: textMuted, margin: "0 0 4px", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>No administrators found</p>
                <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Try adjusting your filters or search</p>
              </div>}

            {
    /* â•â• LIST VIEW â•â• */
  }
            {!initialLoading && filteredAdmins.length > 0 && viewMode === "list" && <>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1.4fr 140px", gap: 16, padding: "11px 24px", background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
                  {["Administrator", "Department", "Role", "Contact", "Actions"].map((col, i) => <span key={col} style={{ fontSize: 10, fontWeight: 500, color: textMuted, textAlign: i === 4 ? "right" : "left", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{col}</span>)}
                </div>

                {currentCards.map((admin, i) => <div
    key={admin._id}
    className="la-row"
    onClick={() => handleView(admin)}
    style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1.4fr 140px", gap: 16, alignItems: "center", padding: "14px 24px", borderBottom: i < currentCards.length - 1 ? `1px solid ${borderColor}` : "none", transition: "background .15s", cursor: "pointer" }}
  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--admin-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 600, flexShrink: 0, overflow: "hidden", fontFamily: "'Poppins', sans-serif" }}>
                        {admin.profilePicture ? <img src={admin.profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getUserInitials(admin)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{admin.firstName} {admin.lastName}</p>
                        <p style={{ fontSize: 11, color: textMuted, margin: "2px 0 0", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{admin.email}</p>
                      </div>
                    </div>
                    <div><span style={getDeptBadgeStyle()}>{departmentIcons[admin.department]} {departments[admin.department] || "\u2014"}</span></div>
                    <div><span style={getRoleBadgeStyle(admin.role)}>{roles[admin.role] || "\u2014"}</span></div>
                    <div><p style={{ fontSize: 12, fontWeight: 400, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{admin.contactNumber || "\u2014"}</p></div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }} onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => {
    e.stopPropagation();
    handleEdit(admin);
  }} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${borderColor}`, background: "var(--admin-bg-soft)", color: textMuted, fontSize: 11, fontWeight: 500, cursor: "pointer", transition: "all .15s", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Edit</button>
                      <button onClick={(e) => {
    e.stopPropagation();
    setAdminToArchive(admin._id);
  }} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(220,38,38,0.2)", background: isdarkmode ? "rgba(220,38,38,0.08)" : "rgba(220,38,38,0.05)", color: "#dc2626", fontSize: 11, fontWeight: 500, cursor: "pointer", transition: "all .15s", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Disable</button>
                    </div>
                  </div>)}
              </>}

            {
    /* â•â• GRID VIEW â•â• */
  }
            {!initialLoading && filteredAdmins.length > 0 && viewMode === "grid" && <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {currentCards.map((admin) => <div key={admin._id} className="la-card" onClick={() => handleView(admin)} style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, overflow: "hidden", cursor: "pointer", transition: "all .2s" }}>
                    <div style={{ padding: "18px 20px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--admin-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 600, flexShrink: 0, overflow: "hidden", fontFamily: "'Poppins', sans-serif" }}>
                        {admin.profilePicture ? <img src={admin.profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getUserInitials(admin)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{admin.firstName} {admin.lastName}</p>
                        <p style={{ fontSize: 11, color: textMuted, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{admin.email}</p>
                      </div>
                    </div>
                    {[
    { label: "Department", val: `${departmentIcons[admin.department] || ""} ${departments[admin.department] || "\u2014"}` },
    { label: "Contact", val: admin.contactNumber || "\u2014" }
  ].map(({ label, val }) => <div key={label} style={{ display: "grid", gridTemplateColumns: "80px 1fr", borderBottom: `1px solid ${borderColor}` }}>
                        <div style={{ padding: "10px 14px", borderRight: `1px solid ${borderColor}` }}><span style={{ fontSize: 10, fontWeight: 500, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{label}</span></div>
                        <div style={{ padding: "10px 14px" }}><span style={{ fontSize: 11, color: textPrimary, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{val}</span></div>
                      </div>)}
                    <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", borderBottom: `1px solid ${borderColor}` }}>
                      <div style={{ padding: "10px 14px", borderRight: `1px solid ${borderColor}` }}><span style={{ fontSize: 10, fontWeight: 500, color: textMuted, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Role</span></div>
                      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center" }}><span style={getRoleBadgeStyle(admin.role)}>{roles[admin.role] || "\u2014"}</span></div>
                    </div>
                    <div style={{ padding: "12px 16px", display: "flex", gap: 8 }} onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => {
    e.stopPropagation();
    handleEdit(admin);
  }} style={{ flex: 1, padding: "7px", borderRadius: 8, border: `1px solid ${borderColor}`, background: isdarkmode ? "rgba(255,255,255,0.06)" : cardBg, color: textMuted, fontSize: 11, fontWeight: 500, cursor: "pointer", transition: "all .15s", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Edit</button>
                      <button onClick={(e) => {
    e.stopPropagation();
    setAdminToArchive(admin._id);
  }} style={{ flex: 1, padding: "7px", borderRadius: 8, border: "1px solid rgba(220,38,38,0.2)", background: isdarkmode ? "rgba(220,38,38,0.08)" : "rgba(220,38,38,0.05)", color: "#dc2626", fontSize: 11, fontWeight: 500, cursor: "pointer", transition: "all .15s", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Disable</button>
                    </div>
                  </div>)}
              </div>}

            {
    /* â”€â”€ Pagination â”€â”€ */
  }
            {!initialLoading && filteredAdmins.length > 0 && totalPages > 1 && <div style={{ padding: "14px 24px", background: subtleBg, borderTop: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: 11, color: textMuted, fontWeight: 400, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                  Page <strong style={{ color: textPrimary }}>{currentPage}</strong> of <strong style={{ color: textPrimary }}>{totalPages}</strong>
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1} style={{ padding: "7px 16px", borderRadius: 10, border: `1px solid ${borderColor}`, background: currentPage === 1 ? "transparent" : subtleBg, color: currentPage === 1 ? textMuted : textPrimary, fontSize: 11, fontWeight: 500, cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.4 : 1, transition: "all .15s", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Previous</button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((pg) => <button key={pg} onClick={() => setCurrentPage(pg)} style={{ width: 32, height: 32, borderRadius: 8, border: pg === currentPage ? "none" : `1px solid ${borderColor}`, background: pg === currentPage ? "var(--admin-accent)" : subtleBg, color: pg === currentPage ? "#fff" : textMuted, fontSize: 11, fontWeight: pg === currentPage ? 600 : 400, cursor: "pointer", transition: "all .15s", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{pg}</button>)}
                  <button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages} style={{ padding: "7px 16px", borderRadius: 10, border: `1px solid ${borderColor}`, background: currentPage === totalPages ? "transparent" : subtleBg, color: currentPage === totalPages ? textMuted : textPrimary, fontSize: 11, fontWeight: 500, cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.4 : 1, transition: "all .15s", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Next</button>
                </div>
              </div>}

          </div>
        </div>
      </div>

      {
    /* â•â• Disable Confirm Modal â•â• */
  }
      {adminToArchive && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 32, width: "100%", maxWidth: 460, boxShadow: "0 32px 80px rgba(0,0,0,0.32)", fontFamily: "'Poppins', sans-serif", overflow: "hidden" }}>
            <div style={{ padding: "32px 36px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Disable Account</h3>
                  <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>This action will restrict system access.</p>
                </div>
                <button onClick={() => setAdminToArchive(null)} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: subtleBg, color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, padding: "20px 22px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: isdarkmode ? "rgba(220,38,38,0.12)" : "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="22" height="22" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <p style={{ fontSize: 12, color: textPrimary, margin: 0, lineHeight: 1.6, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>
                  Are you sure you want to disable this administrator's account? They will no longer be able to access the system.
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button onClick={() => setAdminToArchive(null)} style={{ padding: "11px 28px", borderRadius: 14, border: `1px solid ${borderColor}`, background: subtleBg, color: textMuted, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif", letterSpacing: 0, transition: "all .15s" }}>Cancel</button>
                <button onClick={() => handleArchive(adminToArchive)} style={{ padding: "11px 32px", borderRadius: 14, border: "none", background: "#dc2626", color: "#fff", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif", letterSpacing: 0, transition: "all .15s" }}>Disable</button>
              </div>
            </div>
          </div>
        </div>}

      {
    /* â•â• View Admin Modal â•â• */
  }
      {viewingAdmin && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20, overflowY: "auto" }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 32, width: "100%", maxWidth: 600, boxShadow: "0 32px 80px rgba(0,0,0,0.32)", fontFamily: "'Poppins', sans-serif" }}>
            <div style={{ padding: "32px 36px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Administrator Details</h3>
                  <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>Complete profile information</p>
                </div>
                <button onClick={closeView} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: subtleBg, color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <span style={getRoleBadgeStyle(viewingAdmin.role)}>{roles[viewingAdmin.role] || "\u2014"}</span>
                <span style={getDeptBadgeStyle()}>{departmentIcons[viewingAdmin.department]} {departments[viewingAdmin.department] || "\u2014"}</span>
              </div>
              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 18, padding: "24px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${borderColor}` }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--admin-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 600, flexShrink: 0, overflow: "hidden", fontFamily: "'Poppins', sans-serif" }}>
                    {viewingAdmin.profilePicture ? <img src={viewingAdmin.profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getUserInitials(viewingAdmin)}
                  </div>
                  <div>
                    <p style={{ fontSize: 20, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{viewingAdmin.firstName} {viewingAdmin.lastName}</p>
                    <p style={{ fontSize: 12, color: textMuted, margin: "3px 0 0", fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{departments[viewingAdmin.department]}</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
    { label: "EMAIL ADDRESS", val: viewingAdmin.email },
    { label: "CONTACT NUMBER", val: viewingAdmin.contactNumber || "\u2014" },
    { label: "CREATED DATE", val: viewingAdmin.createdAt ? formatDate(viewingAdmin.createdAt) : "\u2014" }
  ].map(({ label, val }) => <div key={label}>
                      <p style={{ fontSize: 10, fontWeight: 500, color: textMuted, margin: "0 0 4px", fontFamily: "'Poppins', sans-serif", letterSpacing: "0.06em" }}>{label}</p>
                      <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", letterSpacing: 0 }}>{val}</p>
                    </div>)}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 20, borderTop: `1px solid ${borderColor}` }}>
                <button onClick={closeView} style={{ padding: "11px 24px", borderRadius: 14, border: `1px solid ${borderColor}`, background: subtleBg, color: textMuted, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif", letterSpacing: 0, transition: "all .15s" }}>Close</button>
                <button onClick={() => {
    closeView();
    handleEdit(viewingAdmin);
  }} style={{ padding: "11px 32px", borderRadius: 14, border: "none", background: "var(--admin-accent)", color: "#fff", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif", letterSpacing: 0, transition: "all .15s" }}>Edit Admin</button>
              </div>
            </div>
          </div>
        </div>}
    </>;
}
export {
  ListAdmin as default
};
