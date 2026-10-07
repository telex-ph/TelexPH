
import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import DashboardLoader, { useInitialLoad } from "@/components/DashboardLoader";
import { useDarkMode } from "@/pages/admin/dashboard/Layout";
function UserManagement() {
  const { isdarkmode } = useDarkMode();
  const [vas, setvas] = useState([]);
  const [stats, setstats] = useState(null);
  const [pagination, setpagination] = useState(null);
  const [isloading, setisloading] = useState(false);
  const initialLoading = useInitialLoad(isloading);
  const [error, seterror] = useState(null);
  const [success, setsuccess] = useState(null);
  const [searchquery, setsearchquery] = useState("");
  const [statusfilter, setstatusfilter] = useState("All");
  const [sortby, setsortby] = useState("Newest");
  const [currentpage, setcurrentpage] = useState(1);
  const pagesize = 10;
  const [selectedva, setselectedva] = useState(null);
  const [showdetailsmodal, setshowdetailsmodal] = useState(false);
  const [showeditmodal, setshoweditmodal] = useState(false);
  const [showconfirmmodal, setshowconfirmmodal] = useState(false);
  const [confirmaction, setconfirmaction] = useState(null);
  const [issubmitting, setissubmitting] = useState(false);
  const [editform, seteditform] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    specialization: "",
    experience: ""
  });
  const [viewmode, setviewmode] = useState("list");
  const cardBg = "var(--admin-surface)";
  const subtleBg = "var(--admin-bg-soft)";
  const borderColor = "var(--admin-border)";
  const textPrimary = "var(--admin-text)";
  const textMuted = "var(--admin-text-faint)";
  const inputBg = "var(--admin-bg-soft)";
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
    width: "100%",
    boxSizing: "border-box",
    ...extra
  });
  const statusFilters = ["All", "PENDING", "VERIFIED", "ACTIVE", "INACTIVE", "REJECTED"];
  const MOCK_VAS = [
    { _id: "1", firstName: "Maria", lastName: "Santos", email: "maria.santos@email.com", contactNumber: "+63 912 345 6789", specialization: "Admin Support", experience: "3 years", status: "ACTIVE", isVerified: true, isActive: true, createdAt: "2024-01-15T08:00:00Z", updatedAt: "2024-03-10T10:00:00Z" },
    { _id: "2", firstName: "Juan", lastName: "dela Cruz", email: "juan.delacruz@email.com", contactNumber: "+63 917 234 5678", specialization: "Data Entry", experience: "1 year", status: "PENDING", isVerified: false, isActive: false, createdAt: "2024-04-02T09:30:00Z" },
    { _id: "3", firstName: "Ana", lastName: "Reyes", email: "ana.reyes@email.com", contactNumber: "+63 918 876 5432", specialization: "Customer Service", experience: "5 years", status: "VERIFIED", isVerified: true, isActive: false, createdAt: "2024-02-20T07:45:00Z", updatedAt: "2024-04-01T11:00:00Z" },
    { _id: "4", firstName: "Carlo", lastName: "Mendoza", email: "carlo.mendoza@email.com", contactNumber: "+63 920 111 2233", specialization: "Social Media Management", experience: "2 years", status: "INACTIVE", isVerified: true, isActive: false, createdAt: "2023-11-05T06:00:00Z", updatedAt: "2024-01-20T09:00:00Z" },
    { _id: "5", firstName: "Liza", lastName: "Bautista", email: "liza.bautista@email.com", contactNumber: "+63 915 999 8877", specialization: "Bookkeeping", experience: "4 years", status: "ACTIVE", isVerified: true, isActive: true, createdAt: "2023-09-12T08:15:00Z", updatedAt: "2024-03-25T14:00:00Z" },
    { _id: "6", firstName: "Paolo", lastName: "Garcia", email: "paolo.garcia@email.com", contactNumber: "+63 921 444 5566", specialization: "Graphic Design", experience: "2 years", status: "REJECTED", isVerified: false, isActive: false, createdAt: "2024-03-18T10:00:00Z" },
    { _id: "7", firstName: "Christine", lastName: "Villanueva", email: "christine.v@email.com", contactNumber: "+63 916 333 2211", specialization: "Content Writing", experience: "3 years", status: "ACTIVE", isVerified: true, isActive: true, createdAt: "2023-12-01T09:00:00Z", updatedAt: "2024-04-05T08:30:00Z" },
    { _id: "8", firstName: "Mark", lastName: "Aquino", email: "mark.aquino@email.com", contactNumber: "+63 919 777 6655", specialization: "Email Management", experience: "1.5 years", status: "PENDING", isVerified: false, isActive: false, createdAt: "2024-04-10T11:00:00Z" },
    { _id: "9", firstName: "Jasmine", lastName: "Flores", email: "jasmine.flores@email.com", contactNumber: "+63 922 555 4433", specialization: "SEO & Research", experience: "6 years", status: "ACTIVE", isVerified: true, isActive: true, createdAt: "2023-07-22T07:00:00Z", updatedAt: "2024-04-08T16:00:00Z" },
    { _id: "10", firstName: "Ramon", lastName: "Torres", email: "ramon.torres@email.com", contactNumber: "+63 913 888 7766", specialization: "IT Support", experience: "4 years", status: "VERIFIED", isVerified: true, isActive: false, createdAt: "2024-01-30T08:00:00Z", updatedAt: "2024-03-15T12:00:00Z" },
    { _id: "11", firstName: "Patricia", lastName: "Navarro", email: "patricia.navarro@email.com", contactNumber: "+63 914 222 1100", specialization: "Project Coordination", experience: "5 years", status: "ACTIVE", isVerified: true, isActive: true, createdAt: "2023-08-14T06:30:00Z", updatedAt: "2024-04-01T09:00:00Z" },
    { _id: "12", firstName: "Kevin", lastName: "Lim", email: "kevin.lim@email.com", contactNumber: "+63 923 666 5544", specialization: "Video Editing", experience: "2 years", status: "INACTIVE", isVerified: true, isActive: false, createdAt: "2023-10-10T10:00:00Z", updatedAt: "2024-02-28T15:00:00Z" }
  ];
  const MOCK_STATS = { total: 12, pending: 2, verified: 2, active: 5, inactive: 2 };
  useEffect(() => {
    setstats(MOCK_STATS);
    redeive("All", "", "Newest", 1);
  }, []);
  useEffect(() => {
    redeive(statusfilter, searchquery, sortby, currentpage);
  }, [statusfilter, sortby, currentpage]);
  useEffect(() => {
    const t = setTimeout(() => {
      setcurrentpage(1);
      redeive(statusfilter, searchquery, sortby, 1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchquery]);
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => seterror(null), 5e3);
      return () => clearTimeout(t);
    }
  }, [error]);
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setsuccess(null), 4e3);
      return () => clearTimeout(t);
    }
  }, [success]);
  const redeive = (overrideFilter, overrideSearch, overrideSort, overridePage) => {
    const sf = overrideFilter ?? statusfilter;
    const sq = overrideSearch ?? searchquery;
    const sb = overrideSort ?? sortby;
    const pg = overridePage ?? currentpage;
    const result = [...MOCK_VAS].filter((v) => sf === "All" || v.status === sf).filter((v) => !sq || `${v.firstName} ${v.lastName} ${v.email}`.toLowerCase().includes(sq.toLowerCase())).sort(
      (a, b) => sb === "Newest" ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    setpagination({ page: pg, limit: pagesize, total: result.length, totalPages: Math.ceil(result.length / pagesize) });
    setvas(result.slice((pg - 1) * pagesize, pg * pagesize));
    setstats({ total: MOCK_VAS.length, pending: MOCK_VAS.filter((v) => v.status === "PENDING").length, verified: MOCK_VAS.filter((v) => v.status === "VERIFIED").length, active: MOCK_VAS.filter((v) => v.status === "ACTIVE").length, inactive: MOCK_VAS.filter((v) => v.status === "INACTIVE").length });
  };
  const performAction = async (type, va) => {
    setissubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const statusMap = { VERIFY: "VERIFIED", REJECT: "REJECTED", ACTIVATE: "ACTIVE", DEACTIVATE: "INACTIVE" };
    const target = MOCK_VAS.find((v) => v._id === va._id);
    if (target) {
      target.status = statusMap[type] ?? target.status;
      target.isVerified = type === "VERIFY" ? true : type === "REJECT" ? false : target.isVerified;
      target.isActive = type === "ACTIVATE" ? true : type === "DEACTIVATE" ? false : target.isActive;
      target.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    setsuccess(`Successfully ${type.toLowerCase()}d ${va.firstName} ${va.lastName}`);
    setshowconfirmmodal(false);
    setshowdetailsmodal(false);
    setissubmitting(false);
    redeive();
  };
  const submitEdit = async () => {
    if (!selectedva) return;
    setissubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const target = MOCK_VAS.find((v) => v._id === selectedva._id);
    if (target) {
      target.firstName = editform.firstName;
      target.lastName = editform.lastName;
      target.email = editform.email;
      target.contactNumber = editform.contactNumber;
      target.specialization = editform.specialization;
      target.experience = editform.experience;
      target.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    setsuccess(`${editform.firstName} ${editform.lastName}'s information updated`);
    setshoweditmodal(false);
    setissubmitting(false);
    redeive();
  };
  const openEdit = (va) => {
    setselectedva(va);
    seteditform({
      firstName: va.firstName,
      lastName: va.lastName,
      email: va.email,
      contactNumber: va.contactNumber,
      specialization: va.specialization || "",
      experience: va.experience || ""
    });
    setshoweditmodal(true);
  };
  const openConfirm = (type, label, va) => {
    setconfirmaction({ type, label, va });
    setshowconfirmmodal(true);
  };
  const getStatusStyle = (status) => {
    const map = {
      PENDING: { bg: "#B45309", color: "#fff" },
      VERIFIED: { bg: "#0066CC", color: "#fff" },
      ACTIVE: { bg: "#059669", color: "#fff" },
      INACTIVE: { bg: "#6b7280", color: "#fff" },
      REJECTED: { bg: "#A10000", color: "#fff" }
    };
    const s = map[status] || { bg: "#6b7280", color: "#fff" };
    return {
      background: s.bg,
      color: s.color,
      padding: "3px 12px",
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 500,
      display: "inline-block",
      whiteSpace: "nowrap",
      fontFamily: "'Poppins', sans-serif"
    };
  };
  const getInitials = (va) => `${va.firstName?.[0] || ""}${va.lastName?.[0] || ""}`.toUpperCase();
  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const statCards = [
    {
      label: "Total VAs",
      value: stats?.total ?? "\u2014",
      subtitle: "All registered VAs",
      iconColor: "#059669",
      dark: false,
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    },
    {
      label: "Pending",
      value: stats?.pending ?? "\u2014",
      subtitle: "Awaiting verification",
      iconColor: "#B45309",
      dark: false,
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      label: "Active",
      value: stats?.active ?? "\u2014",
      subtitle: "Currently active VAs",
      iconColor: "#059669",
      dark: false,
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      label: "Verified",
      value: stats?.verified ?? "\u2014",
      subtitle: "Approved accounts",
      iconColor: "#0066CC",
      dark: false,
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
    },
    {
      label: "Inactive",
      value: stats?.inactive ?? "\u2014",
      subtitle: "Deactivated accounts",
      iconColor: "#fff",
      dark: true,
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
    }
  ];
  return <>
      <style>{`
        .um-row:hover { background: ${"var(--admin-bg-soft)"} !important; }
        .um-pill:hover { opacity: .85 !important; }
        .um-btn:hover  { opacity: .88 !important; }

        .um-stat-grid  { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
        .um-search-row { display: flex; gap: 10px; align-items: center; flex-wrap: nowrap; }
        .um-table-wrap { display: block; }
        .um-table-grid { display: grid; grid-template-columns: 2fr 1.4fr 1fr 1fr 1fr 160px; gap: 16px; }
        .um-edit-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .um-info-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .um-modal-pad  { padding: 32px 36px; }
        .um-pagination { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .um-card-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; }
        .um-card-header-sub { display: block; }
        .um-card-header-count { white-space: nowrap; flex-shrink: 0; }

        /* Mobile rows hidden by default on desktop */
        .um-mobile-row { display: none !important; }

        @media (max-width: 768px) {
          .um-card-header { flex-direction: column; align-items: flex-start; gap: 4px; padding: 14px 16px; }
          .um-card-header-sub { display: none; }
          .um-card-header-count { font-size: 10px !important; }
          .um-mobile-row { display: flex !important; }
          .um-pagination { padding: 12px 16px !important; }
        }
        .um-filter-label { display: inline; }

        @media (max-width: 1024px) {
          .um-stat-grid  { grid-template-columns: repeat(3, 1fr); }
          .um-table-grid { grid-template-columns: 2fr 1.2fr 1fr 1fr 130px; }
        }
        @media (max-width: 768px) {
          .um-stat-grid   { grid-template-columns: repeat(2, 1fr); }
          .um-search-row  { flex-wrap: wrap; }
          .um-search-input { flex: 1 1 100% !important; min-width: 0 !important; }
          .um-filter-controls { display: flex; gap: 8px; align-items: center; flex: 1 1 100%; }
          .um-table-wrap  { display: none; }
          .um-edit-grid   { grid-template-columns: 1fr; }
          .um-info-grid   { grid-template-columns: 1fr; }
          .um-modal-pad   { padding: 20px 18px; }
          .um-pagination  { flex-direction: column; align-items: flex-start; }
          .um-filter-label { display: none; }
        }
        @media (max-width: 480px) {
          .um-stat-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div style={{ fontFamily: "'Poppins', sans-serif", maxWidth: 1200, margin: "0 auto", paddingTop: 32 }}>

        {
    /* â”€â”€ Page header â”€â”€ */
  }
        <PageHeader title="User Management" subtitle="View, verify, and manage Virtual Assistant accounts in real-time." />

        {
    /* â”€â”€ Toast: error â”€â”€ */
  }
        {error && <div style={{ marginBottom: 16, padding: "12px 18px", borderRadius: 14, background: "rgba(139,0,0,0.12)", border: "1px solid rgba(139,0,0,0.25)", color: "#c0392b", fontSize: 12, fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={2} /><line x1="15" y1="9" x2="9" y2="15" strokeWidth={2} /><line x1="9" y1="9" x2="15" y2="15" strokeWidth={2} /></svg>
            {error}
          </div>}
        {success && <div style={{ marginBottom: 16, padding: "12px 18px", borderRadius: 14, background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.25)", color: "#059669", fontSize: 12, fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {success}
          </div>}

        {
    /* â”€â”€ Stat cards â”€â”€ */
  }
        <div className="um-stat-grid" style={{ marginBottom: 24 }}>
          {statCards.map((c, i) => {
    const darkGradients = [
      `radial-gradient(circle at 85% 15%, rgba(5,150,105,0.45) 0%, transparent 55%), radial-gradient(circle at 10% 90%, rgba(5,150,105,0.2) 0%, transparent 45%)`,
      `radial-gradient(circle at 80% 20%, rgba(180,83,9,0.5) 0%, transparent 55%), radial-gradient(circle at 15% 85%, rgba(180,83,9,0.2) 0%, transparent 45%)`,
      `radial-gradient(circle at 90% 10%, rgba(5,150,105,0.5) 0%, transparent 50%), radial-gradient(circle at 5% 80%, rgba(5,150,105,0.22) 0%, transparent 40%)`,
      `radial-gradient(circle at 85% 20%, rgba(0,102,204,0.5) 0%, transparent 55%), radial-gradient(circle at 10% 85%, rgba(0,102,204,0.2) 0%, transparent 45%)`,
      `radial-gradient(circle at 80% 15%, rgba(139,0,0,0.6) 0%, transparent 55%), radial-gradient(circle at 10% 90%, rgba(139,0,0,0.3) 0%, transparent 45%)`
    ];
    const lightGradients = [
      `radial-gradient(circle at 85% 15%, rgba(5,150,105,0.18) 0%, transparent 55%), radial-gradient(circle at 10% 90%, rgba(5,150,105,0.09) 0%, transparent 45%)`,
      `radial-gradient(circle at 80% 20%, rgba(180,83,9,0.18) 0%, transparent 55%), radial-gradient(circle at 15% 85%, rgba(180,83,9,0.09) 0%, transparent 45%)`,
      `radial-gradient(circle at 90% 10%, rgba(5,150,105,0.2) 0%, transparent 50%), radial-gradient(circle at 5% 80%, rgba(5,150,105,0.1) 0%, transparent 40%)`,
      `radial-gradient(circle at 85% 20%, rgba(0,102,204,0.18) 0%, transparent 55%), radial-gradient(circle at 10% 85%, rgba(0,102,204,0.09) 0%, transparent 45%)`,
      `radial-gradient(circle at 80% 15%, rgba(139,0,0,0.18) 0%, transparent 55%), radial-gradient(circle at 10% 90%, rgba(139,0,0,0.09) 0%, transparent 45%)`
    ];
    const gradient = isdarkmode ? darkGradients[i] : lightGradients[i];
    const baseBg = c.dark ? "#2d1f1f" : cardBg;
    return <div key={c.label} style={{
      background: `${gradient}, ${baseBg}`,
      border: `1px solid ${c.dark ? "rgba(139,0,0,0.3)" : borderColor}`,
      borderRadius: 20,
      padding: "20px 22px",
      boxShadow: "var(--admin-shadow-sm)",
      position: "relative",
      overflow: "hidden"
    }}>
              {
      /* Decorative ring */
    }
              <div style={{
      position: "absolute",
      top: -18,
      right: -18,
      width: 80,
      height: 80,
      borderRadius: "50%",
      border: `1.5px solid ${c.iconColor}`,
      opacity: 0.15,
      pointerEvents: "none"
    }} />
              <div style={{
      position: "absolute",
      top: -30,
      right: -30,
      width: 110,
      height: 110,
      borderRadius: "50%",
      border: `1px solid ${c.iconColor}`,
      opacity: 0.08,
      pointerEvents: "none"
    }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, position: "relative" }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: c.dark ? "rgba(255,255,255,0.5)" : textMuted, fontFamily: "'Poppins', sans-serif" }}>{c.label}</span>
                <span style={{ color: c.iconColor }}>{c.icon}</span>
              </div>
              <p style={{ fontSize: 28, fontWeight: 700, color: c.dark ? "#fff" : textPrimary, margin: "0 0 4px", fontFamily: "'Poppins', sans-serif", lineHeight: 1, position: "relative" }}>{c.value}</p>
              <p style={{ fontSize: 10, color: c.dark ? "rgba(255,255,255,0.4)" : textMuted, margin: 0, fontFamily: "'Poppins', sans-serif", position: "relative" }}>{c.subtitle}</p>
            </div>;
  })}
        </div>

        {
    /* â”€â”€ Filters card â”€â”€ */
  }
        <div style={{ background: "transparent", border: "none", borderRadius: 24, padding: "0", marginBottom: 20, boxShadow: "none" }}>
          <div className="um-search-row">
            {
    /* Search */
  }
            <div className="um-search-input" style={{ flex: 1, minWidth: 200, position: "relative" }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: textMuted }} width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={2} /><line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={2} />
              </svg>
              <input
    value={searchquery}
    onChange={(e) => {
      setsearchquery(e.target.value);
      setcurrentpage(1);
      redeive(void 0, e.target.value, void 0, 1);
    }}
    placeholder="Search by name or email..."
    style={{ ...inp({ paddingLeft: 38 }) }}
  />
            </div>

            {
    /* Filter controls — Status + Sort + Toggle */
  }
            <div className="um-filter-controls" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {
    /* Filter by Status dropdown */
  }
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="um-filter-label" style={{ fontSize: 11, color: textMuted, whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>Status</span>
                <select
    value={statusfilter}
    onChange={(e) => {
      setstatusfilter(e.target.value);
      setcurrentpage(1);
      redeive(e.target.value, void 0, void 0, 1);
    }}
    style={inp({ width: "auto", padding: "10px 12px", fontSize: 11, cursor: "pointer" })}
  >
                  {statusFilters.map((s) => <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>)}
                </select>
              </div>

              {
    /* Sort by dropdown */
  }
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="um-filter-label" style={{ fontSize: 11, color: textMuted, whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>Sort by</span>
                <select value={sortby} onChange={(e) => {
    setsortby(e.target.value);
    setcurrentpage(1);
    redeive(void 0, void 0, e.target.value, 1);
  }} style={inp({ width: "auto", padding: "10px 12px", fontSize: 11, cursor: "pointer" })}>
                  <option value="Newest">Newest First</option>
                  <option value="Oldest">Oldest First</option>
                </select>
              </div>

              {
    /* View mode toggle */
  }
              <div style={{ display: "flex", background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 10, padding: 3, gap: 2, flexShrink: 0 }}>
                <button
    onClick={() => setviewmode("card")}
    title="Card view"
    style={{ width: 28, height: 28, borderRadius: 7, border: "none", cursor: "pointer", background: viewmode === "card" ? "var(--admin-accent)" : "transparent", color: viewmode === "card" ? "#fff" : textMuted, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
  >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </button>
                <button
    onClick={() => setviewmode("list")}
    title="List view"
    style={{ width: 28, height: 28, borderRadius: 7, border: "none", cursor: "pointer", background: viewmode === "list" ? "var(--admin-accent)" : "transparent", color: viewmode === "list" ? "#fff" : textMuted, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
  >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {
    /* â”€â”€ Table / Card view â”€â”€ */
  }
        <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, overflow: "hidden", boxShadow: "var(--admin-shadow-sm)" }}>
          {
    /* Card header */
  }
          <div className="um-card-header" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Virtual Assistant records</p>
              <p className="um-card-header-sub" style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontFamily: "'Poppins', sans-serif" }}>All registered VA accounts and their status</p>
            </div>
            {pagination && <span className="um-card-header-count" style={{ fontSize: 11, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>
                Showing <strong style={{ color: textPrimary }}>{(pagination.page - 1) * pagination.limit + 1}</strong> to <strong style={{ color: textPrimary }}>{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> of <strong style={{ color: textPrimary }}>{pagination.total}</strong> results
              </span>}
          </div>

          {
    /* Loading */
  }
          <DashboardLoader isVisible={initialLoading} message="Loading virtual assistants…" />

          {
    /* Empty */
  }
          {!initialLoading && vas.length === 0 && <div style={{ padding: "72px 20px", textAlign: "center" }}>
              <svg style={{ margin: "0 auto 16px", display: "block", color: "var(--admin-border-strong)" }} width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p style={{ fontSize: 14, fontWeight: 500, color: textMuted, margin: "0 0 4px", fontFamily: "'Poppins', sans-serif" }}>No virtual assistants found</p>
              <p style={{ fontSize: 11, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>Try adjusting your filters or search query</p>
            </div>}

          {
    /* â”€â”€ LIST VIEW â”€â”€ */
  }
          {!initialLoading && vas.length > 0 && viewmode === "list" && <>
              {
    /* Desktop table */
  }
              <div className="um-table-wrap">
                {
    /* Header row */
  }
                <div className="um-table-grid" style={{ padding: "11px 24px", background: subtleBg, borderBottom: `1px solid ${borderColor}` }}>
                  {["VA", "Email", "Contact", "Status", "Joined", "Actions"].map((col, i) => <span key={col} style={{ fontSize: 10, fontWeight: 500, color: textMuted, textAlign: i === 5 ? "right" : "left", fontFamily: "'Poppins', sans-serif" }}>
                      {col}
                    </span>)}
                </div>

                {
    /* Data rows */
  }
                {vas.map((va, i) => <div
    key={va._id}
    className="um-row"
    style={{ borderBottom: i < vas.length - 1 ? `1px solid ${borderColor}` : "none", transition: "background .15s" }}
  >
                    <div className="um-table-grid" style={{ alignItems: "center", padding: "14px 24px" }}>
                      {
    /* VA name + avatar */
  }
                      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 12, background: "var(--admin-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                          {va.profilePicture ? <img src={va.profilePicture} alt={va.firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#fff", fontSize: 11, fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>{getInitials(va)}</span>}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{va.firstName} {va.lastName}</p>
                          {va.specialization && <p style={{ fontSize: 10, color: textMuted, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{va.specialization}</p>}
                        </div>
                      </div>
                      <p style={{ fontSize: 11, color: textMuted, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{va.email}</p>
                      <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{va.contactNumber || "\u2014"}</p>
                      <div><span style={getStatusStyle(va.status)}>{va.status}</span></div>
                      <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{formatDate(va.createdAt)}</p>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button className="um-btn" onClick={() => {
    setselectedva(va);
    setshowdetailsmodal(true);
  }} style={{ padding: "5px 12px", borderRadius: 9, border: `1px solid ${borderColor}`, background: "var(--admin-bg-soft)", color: textMuted, fontSize: 10, fontWeight: 500, cursor: "pointer", transition: "all .15s", fontFamily: "'Poppins', sans-serif" }}>View</button>
                        <button className="um-btn" onClick={() => openEdit(va)} style={{ padding: "5px 12px", borderRadius: 9, border: "none", background: "rgba(0,102,204,0.12)", color: "#0066CC", fontSize: 10, fontWeight: 500, cursor: "pointer", transition: "all .15s", fontFamily: "'Poppins', sans-serif" }}>Edit</button>
                        {va.status === "PENDING" && <button className="um-btn" onClick={() => openConfirm("VERIFY", "Verify", va)} style={{ padding: "5px 12px", borderRadius: 9, border: "none", background: "rgba(5,150,105,0.12)", color: "#059669", fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Verify</button>}
                        {(va.status === "VERIFIED" || va.status === "INACTIVE") && <button className="um-btn" onClick={() => openConfirm("ACTIVATE", "Activate", va)} style={{ padding: "5px 12px", borderRadius: 9, border: "none", background: "rgba(5,150,105,0.12)", color: "#059669", fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Activate</button>}
                        {va.status === "ACTIVE" && <button className="um-btn" onClick={() => openConfirm("DEACTIVATE", "Deactivate", va)} style={{ padding: "5px 12px", borderRadius: 9, border: "none", background: "rgba(139,0,0,0.1)", color: "var(--admin-accent)", fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Deactivate</button>}
                      </div>
                    </div>
                  </div>)}
              </div>

              {
    /* Mobile rows — hidden on desktop via CSS, shown on mobile via media query */
  }
              {vas.map((va, i) => <div
    key={`mob-${va._id}`}
    className="um-mobile-row um-row"
    style={{
      borderBottom: i < vas.length - 1 ? `1px solid ${borderColor}` : "none",
      padding: "12px 16px",
      gap: 12,
      alignItems: "flex-start"
    }}
  >
                  {
    /* Avatar */
  }
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: "var(--admin-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", marginTop: 2 }}>
                    {va.profilePicture ? <img src={va.profilePicture} alt={va.firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>{getInitials(va)}</span>}
                  </div>
                  {
    /* Info */
  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {
    /* Name + badge */
  }
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{va.firstName} {va.lastName}</p>
                      <span style={{ ...getStatusStyle(va.status), flexShrink: 0 }}>{va.status}</span>
                    </div>
                    {
    /* Email */
  }
                    <p style={{ fontSize: 11, color: textMuted, margin: "0 0 1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{va.email}</p>
                    {
    /* Specialization + contact */
  }
                    <p style={{ fontSize: 10, color: textMuted, margin: "0 0 8px", fontFamily: "'Poppins', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {[va.specialization, va.contactNumber].filter(Boolean).join(" \xB7 ") || "\u2014"}
                    </p>
                    {
    /* Action buttons */
  }
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      <button className="um-btn" onClick={() => {
    setselectedva(va);
    setshowdetailsmodal(true);
  }} style={{ padding: "4px 11px", borderRadius: 8, border: `1px solid ${borderColor}`, background: "var(--admin-bg-soft)", color: textMuted, fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>View</button>
                      <button className="um-btn" onClick={() => openEdit(va)} style={{ padding: "4px 11px", borderRadius: 8, border: "none", background: "rgba(0,102,204,0.12)", color: "#0066CC", fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Edit</button>
                      {va.status === "PENDING" && <button className="um-btn" onClick={() => openConfirm("VERIFY", "Verify", va)} style={{ padding: "4px 11px", borderRadius: 8, border: "none", background: "rgba(5,150,105,0.12)", color: "#059669", fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Verify</button>}
                      {(va.status === "VERIFIED" || va.status === "INACTIVE") && <button className="um-btn" onClick={() => openConfirm("ACTIVATE", "Activate", va)} style={{ padding: "4px 11px", borderRadius: 8, border: "none", background: "rgba(5,150,105,0.12)", color: "#059669", fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Activate</button>}
                      {va.status === "ACTIVE" && <button className="um-btn" onClick={() => openConfirm("DEACTIVATE", "Deactivate", va)} style={{ padding: "4px 11px", borderRadius: 8, border: "none", background: "rgba(139,0,0,0.1)", color: "var(--admin-accent)", fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Deactivate</button>}
                    </div>
                  </div>
                </div>)}

              {
    /* Pagination footer */
  }
              <div className="um-pagination" style={{ padding: "14px 24px", background: subtleBg, borderTop: `1px solid ${borderColor}` }}>
                <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                  Page <strong style={{ color: textPrimary }}>{pagination?.page}</strong> of <strong style={{ color: textPrimary }}>{pagination?.totalPages}</strong>
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => {
    const np = Math.max(currentpage - 1, 1);
    setcurrentpage(np);
    redeive(void 0, void 0, void 0, np);
  }} disabled={currentpage === 1} style={{ padding: "7px 16px", borderRadius: 10, border: `1px solid ${borderColor}`, background: currentpage === 1 ? "transparent" : subtleBg, color: currentpage === 1 ? textMuted : textPrimary, fontSize: 11, fontWeight: 500, cursor: currentpage === 1 ? "not-allowed" : "pointer", opacity: currentpage === 1 ? 0.4 : 1, fontFamily: "'Poppins', sans-serif" }}>Previous</button>
                  {pagination && Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((pg) => <button key={pg} onClick={() => {
    setcurrentpage(pg);
    redeive(void 0, void 0, void 0, pg);
  }} style={{ width: 32, height: 32, borderRadius: 8, border: pg === currentpage ? "none" : `1px solid ${borderColor}`, background: pg === currentpage ? "var(--admin-accent)" : subtleBg, color: pg === currentpage ? "#fff" : textMuted, fontSize: 11, fontWeight: pg === currentpage ? 600 : 400, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>{pg}</button>)}
                  <button onClick={() => {
    const np = pagination ? Math.min(currentpage + 1, pagination.totalPages) : currentpage;
    setcurrentpage(np);
    redeive(void 0, void 0, void 0, np);
  }} disabled={!pagination || currentpage === pagination.totalPages} style={{ padding: "7px 16px", borderRadius: 10, border: `1px solid ${borderColor}`, background: !pagination || currentpage === pagination.totalPages ? "transparent" : subtleBg, color: !pagination || currentpage === pagination.totalPages ? textMuted : textPrimary, fontSize: 11, fontWeight: 500, cursor: !pagination || currentpage === pagination.totalPages ? "not-allowed" : "pointer", opacity: !pagination || currentpage === pagination.totalPages ? 0.4 : 1, fontFamily: "'Poppins', sans-serif" }}>Next</button>
                </div>
              </div>
            </>}

          {
    /* â”€â”€ CARD VIEW â”€â”€ */
  }
          {!initialLoading && vas.length > 0 && viewmode === "card" && <>
              <div style={{ padding: 24, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                {vas.map((va) => <div
    key={va._id}
    className="um-row"
    style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 20, padding: 20, display: "flex", flexDirection: "column", gap: 14, transition: "all .15s" }}
  >
                    {
    /* Top: avatar + name + status */
  }
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 14, background: "var(--admin-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                        {va.profilePicture ? <img src={va.profilePicture} alt={va.firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>{getInitials(va)}</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>
                          {va.firstName} {va.lastName}
                        </p>
                        <span style={getStatusStyle(va.status)}>{va.status}</span>
                      </div>
                    </div>
                    <div style={{ height: 1, background: borderColor }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
    { icon: <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, value: va.email },
    { icon: <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>, value: va.contactNumber || "\u2014" },
    { icon: <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, value: va.specialization || "\u2014" },
    { icon: <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, value: `Joined ${formatDate(va.createdAt)}` }
  ].map(({ icon, value }, idx) => <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: textMuted, flexShrink: 0 }}>{icon}</span>
                          <span style={{ fontSize: 11, color: textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{value}</span>
                        </div>)}
                    </div>
                    <div style={{ height: 1, background: borderColor }} />
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button className="um-btn" onClick={() => {
    setselectedva(va);
    setshowdetailsmodal(true);
  }} style={{ flex: 1, padding: "7px 10px", borderRadius: 10, border: `1px solid ${borderColor}`, background: "var(--admin-surface)", color: textMuted, fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>View</button>
                      <button className="um-btn" onClick={() => openEdit(va)} style={{ flex: 1, padding: "7px 10px", borderRadius: 10, border: "none", background: "rgba(0,102,204,0.12)", color: "#0066CC", fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Edit</button>
                      {va.status === "PENDING" && <button className="um-btn" onClick={() => openConfirm("VERIFY", "Verify", va)} style={{ flex: 1, padding: "7px 10px", borderRadius: 10, border: "none", background: "rgba(5,150,105,0.12)", color: "#059669", fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Verify</button>}
                      {(va.status === "VERIFIED" || va.status === "INACTIVE") && <button className="um-btn" onClick={() => openConfirm("ACTIVATE", "Activate", va)} style={{ flex: 1, padding: "7px 10px", borderRadius: 10, border: "none", background: "rgba(5,150,105,0.12)", color: "#059669", fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Activate</button>}
                      {va.status === "ACTIVE" && <button className="um-btn" onClick={() => openConfirm("DEACTIVATE", "Deactivate", va)} style={{ flex: 1, padding: "7px 10px", borderRadius: 10, border: "none", background: "rgba(139,0,0,0.1)", color: "var(--admin-accent)", fontSize: 10, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Deactivate</button>}
                    </div>
                  </div>)}
              </div>

              {
    /* Pagination footer */
  }
              <div className="um-pagination" style={{ padding: "14px 24px", background: subtleBg, borderTop: `1px solid ${borderColor}` }}>
                <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                  Page <strong style={{ color: textPrimary }}>{pagination?.page}</strong> of <strong style={{ color: textPrimary }}>{pagination?.totalPages}</strong>
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => {
    const np = Math.max(currentpage - 1, 1);
    setcurrentpage(np);
    redeive(void 0, void 0, void 0, np);
  }} disabled={currentpage === 1} style={{ padding: "7px 16px", borderRadius: 10, border: `1px solid ${borderColor}`, background: currentpage === 1 ? "transparent" : subtleBg, color: currentpage === 1 ? textMuted : textPrimary, fontSize: 11, fontWeight: 500, cursor: currentpage === 1 ? "not-allowed" : "pointer", opacity: currentpage === 1 ? 0.4 : 1, fontFamily: "'Poppins', sans-serif" }}>Previous</button>
                  {pagination && Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((pg) => <button key={pg} onClick={() => {
    setcurrentpage(pg);
    redeive(void 0, void 0, void 0, pg);
  }} style={{ width: 32, height: 32, borderRadius: 8, border: pg === currentpage ? "none" : `1px solid ${borderColor}`, background: pg === currentpage ? "var(--admin-accent)" : subtleBg, color: pg === currentpage ? "#fff" : textMuted, fontSize: 11, fontWeight: pg === currentpage ? 600 : 400, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>{pg}</button>)}
                  <button onClick={() => {
    const np = pagination ? Math.min(currentpage + 1, pagination.totalPages) : currentpage;
    setcurrentpage(np);
    redeive(void 0, void 0, void 0, np);
  }} disabled={!pagination || currentpage === pagination.totalPages} style={{ padding: "7px 16px", borderRadius: 10, border: `1px solid ${borderColor}`, background: !pagination || currentpage === pagination.totalPages ? "transparent" : subtleBg, color: !pagination || currentpage === pagination.totalPages ? textMuted : textPrimary, fontSize: 11, fontWeight: 500, cursor: !pagination || currentpage === pagination.totalPages ? "not-allowed" : "pointer", opacity: !pagination || currentpage === pagination.totalPages ? 0.4 : 1, fontFamily: "'Poppins', sans-serif" }}>Next</button>
                </div>
              </div>
            </>}
        </div>
      </div>

      {
    /* â•â• Details Modal â•â• */
  }
      {showdetailsmodal && selectedva && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16, overflowY: "auto" }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 28, width: "100%", maxWidth: 640, boxShadow: "0 32px 80px rgba(0,0,0,0.32)", fontFamily: "'Poppins', sans-serif", margin: "auto" }}>
            <div className="um-modal-pad">
              {
    /* Header */
  }
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>VA Details</h3>
                  <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0", fontFamily: "'Poppins', sans-serif" }}>Full information for this Virtual Assistant</p>
                </div>
                <button onClick={() => setshowdetailsmodal(false)} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: subtleBg, color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {
    /* Avatar + name */
  }
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: "var(--admin-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                  {selectedva.profilePicture ? <img src={selectedva.profilePicture} alt={selectedva.firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#fff", fontSize: 17, fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>{getInitials(selectedva)}</span>}
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{selectedva.firstName} {selectedva.lastName}</h4>
                  <div style={{ display: "flex", gap: 8, marginTop: 5, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={getStatusStyle(selectedva.status)}>{selectedva.status}</span>
                    {selectedva.isVerified && <span style={{ background: "rgba(0,102,204,0.12)", color: "#0066CC", padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 500 }}>Verified</span>}
                  </div>
                </div>
              </div>

              {
    /* Info grid */
  }
              <div style={{ background: subtleBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: 18, marginBottom: 16 }}>
                <div className="um-info-grid">
                  {[
    { label: "EMAIL", value: selectedva.email },
    { label: "CONTACT", value: selectedva.contactNumber || "\u2014" },
    { label: "SPECIALIZATION", value: selectedva.specialization || "\u2014" },
    { label: "EXPERIENCE", value: selectedva.experience || "\u2014" },
    { label: "JOINED", value: formatDate(selectedva.createdAt) },
    { label: "LAST UPDATED", value: selectedva.updatedAt ? formatDate(selectedva.updatedAt) : "\u2014" }
  ].map(({ label, value }) => <div key={label}>
                      <p style={{ fontSize: 9, fontWeight: 500, color: textMuted, margin: "0 0 4px", letterSpacing: "0.08em", fontFamily: "'Poppins', sans-serif" }}>{label}</p>
                      <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif", wordBreak: "break-word" }}>{value}</p>
                    </div>)}
                </div>
              </div>

              {
    /* Action buttons */
  }
              <div style={{ display: "flex", gap: 8, paddingTop: 16, borderTop: `1px solid ${borderColor}`, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <button onClick={() => {
    setshowdetailsmodal(false);
    openEdit(selectedva);
  }} style={{ padding: "10px 16px", borderRadius: 12, border: "none", background: "rgba(0,102,204,0.12)", color: "#0066CC", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Edit Info</button>
                {selectedva.status === "PENDING" && <>
                    <button onClick={() => {
    setshowdetailsmodal(false);
    openConfirm("VERIFY", "Verify", selectedva);
  }} style={{ padding: "10px 16px", borderRadius: 12, border: "none", background: "rgba(5,150,105,0.12)", color: "#059669", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Verify Account</button>
                    <button onClick={() => {
    setshowdetailsmodal(false);
    openConfirm("REJECT", "Reject", selectedva);
  }} style={{ padding: "10px 16px", borderRadius: 12, border: "none", background: "rgba(139,0,0,0.1)", color: "var(--admin-accent)", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Reject</button>
                  </>}
                {(selectedva.status === "VERIFIED" || selectedva.status === "INACTIVE") && <button onClick={() => {
    setshowdetailsmodal(false);
    openConfirm("ACTIVATE", "Activate", selectedva);
  }} style={{ padding: "10px 16px", borderRadius: 12, border: "none", background: "rgba(5,150,105,0.12)", color: "#059669", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Activate</button>}
                {selectedva.status === "ACTIVE" && <button onClick={() => {
    setshowdetailsmodal(false);
    openConfirm("DEACTIVATE", "Deactivate", selectedva);
  }} style={{ padding: "10px 16px", borderRadius: 12, border: "none", background: "rgba(139,0,0,0.1)", color: "var(--admin-accent)", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Deactivate</button>}
                <button onClick={() => setshowdetailsmodal(false)} style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: "var(--admin-accent)", color: "#fff", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Close</button>
              </div>
            </div>
          </div>
        </div>}

      {
    /* â•â• Edit Modal â•â• */
  }
      {showeditmodal && selectedva && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16, overflowY: "auto" }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 28, width: "100%", maxWidth: 560, boxShadow: "0 32px 80px rgba(0,0,0,0.32)", fontFamily: "'Poppins', sans-serif", margin: "auto" }}>
            <div className="um-modal-pad">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Edit VA Information</h3>
                  <p style={{ fontSize: 12, color: textMuted, margin: "4px 0 0", fontFamily: "'Poppins', sans-serif" }}>Update {selectedva.firstName}'s profile details</p>
                </div>
                <button onClick={() => setshoweditmodal(false)} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: subtleBg, color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="um-edit-grid" style={{ marginBottom: 20 }}>
                {[
    { label: "First Name", key: "firstName", placeholder: "First name" },
    { label: "Last Name", key: "lastName", placeholder: "Last name" },
    { label: "Email", key: "email", placeholder: "email@example.com" },
    { label: "Contact Number", key: "contactNumber", placeholder: "+63 xxx xxx xxxx" },
    { label: "Specialization", key: "specialization", placeholder: "e.g. Data Entry, Admin Support" },
    { label: "Experience", key: "experience", placeholder: "e.g. 2 years" }
  ].map((field) => <div key={field.key}>
                    <label style={{ fontSize: 10, fontWeight: 500, color: textMuted, display: "block", marginBottom: 6, letterSpacing: "0.04em", fontFamily: "'Poppins', sans-serif" }}>
                      {field.label.toUpperCase()}
                    </label>
                    <input
    value={editform[field.key]}
    onChange={(e) => seteditform((prev) => ({ ...prev, [field.key]: e.target.value }))}
    placeholder={field.placeholder}
    style={inp()}
  />
                  </div>)}
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 16, borderTop: `1px solid ${borderColor}`, flexWrap: "wrap" }}>
                <button onClick={() => setshoweditmodal(false)} style={{ padding: "10px 22px", borderRadius: 12, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
                <button onClick={submitEdit} disabled={issubmitting} style={{ padding: "10px 28px", borderRadius: 12, border: "none", background: "var(--admin-accent)", color: "#fff", fontSize: 11, fontWeight: 500, cursor: issubmitting ? "not-allowed" : "pointer", opacity: issubmitting ? 0.7 : 1, fontFamily: "'Poppins', sans-serif" }}>
                  {issubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>}

      {
    /* â•â• Confirm Action Modal â•â• */
  }
      {showconfirmmodal && confirmaction && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, width: "100%", maxWidth: 440, boxShadow: "0 32px 80px rgba(0,0,0,0.32)", fontFamily: "'Poppins', sans-serif" }}>
            <div className="um-modal-pad">
              <div style={{ width: 52, height: 52, borderRadius: 16, background: confirmaction.type === "DEACTIVATE" || confirmaction.type === "REJECT" ? "rgba(139,0,0,0.1)" : "rgba(5,150,105,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                {confirmaction.type === "VERIFY" || confirmaction.type === "ACTIVATE" ? <svg width="24" height="24" fill="none" stroke="#059669" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> : <svg width="24" height="24" fill="none" stroke="var(--admin-accent)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: textPrimary, margin: "0 0 8px", fontFamily: "'Poppins', sans-serif" }}>{confirmaction.label} Account</h3>
              <p style={{ fontSize: 12, color: textMuted, margin: "0 0 20px", lineHeight: 1.6, fontFamily: "'Poppins', sans-serif" }}>
                Are you sure you want to <strong style={{ color: textPrimary }}>{confirmaction.label.toLowerCase()}</strong> the account of{" "}
                <strong style={{ color: textPrimary }}>{confirmaction.va.firstName} {confirmaction.va.lastName}</strong>? This action can be reversed later.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <button onClick={() => setshowconfirmmodal(false)} style={{ padding: "10px 22px", borderRadius: 12, border: `1px solid ${borderColor}`, background: "transparent", color: textMuted, fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
                <button
    onClick={() => performAction(confirmaction.type, confirmaction.va)}
    disabled={issubmitting}
    style={{ padding: "10px 28px", borderRadius: 12, border: "none", background: confirmaction.type === "DEACTIVATE" || confirmaction.type === "REJECT" ? "var(--admin-accent)" : "#059669", color: "#fff", fontSize: 11, fontWeight: 500, cursor: issubmitting ? "not-allowed" : "pointer", opacity: issubmitting ? 0.7 : 1, fontFamily: "'Poppins', sans-serif" }}
  >
                  {issubmitting ? "Processing..." : `Yes, ${confirmaction.label}`}
                </button>
              </div>
            </div>
          </div>
        </div>}
    </>;
}
export {
  UserManagement as default
};
