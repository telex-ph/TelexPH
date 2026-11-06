import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import DashboardLoader, { useInitialLoad } from "@/components/DashboardLoader";
import { periodLabel } from "@/components/NewsletterView";
import api from "@/lib/api/axios";
import { NEWSLETTER_DEPARTMENTS } from "@/data/newsletter-departments";

// Same look as the blog list: toolbar (search, sort, grid/list), status tabs with counts, department pills.
const BORDER = "var(--admin-border)";
const MUTED = "var(--admin-text-sub)";
const TEXT = "var(--admin-text)";
const card = { background: "var(--admin-surface)", border: `1px solid ${BORDER}`, borderRadius: 16, boxShadow: "0 1px 6px rgba(0,0,0,.06)" };
const inp = { padding: "8px 11px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "var(--admin-surface)", color: TEXT, fontSize: 11, outline: "none", boxSizing: "border-box" };
const pill = (sel) => ({ padding: "3px 11px", borderRadius: 20, fontSize: 10, fontWeight: 500, cursor: "pointer", border: sel ? "1px solid color-mix(in srgb, var(--admin-accent) 30%, transparent)" : `1px solid ${BORDER}`, background: sel ? "color-mix(in srgb, var(--admin-accent) 9%, transparent)" : "transparent", color: sel ? "var(--admin-accent)" : MUTED });
const ghost = { padding: "4px 9px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 10, fontWeight: 500, cursor: "pointer" };
const danger = { ...ghost, color: "var(--admin-danger)", borderColor: "color-mix(in srgb, var(--admin-danger) 35%, transparent)" };
const statusStyle = (published) => published
  ? { background: "color-mix(in srgb, var(--admin-accent) 10%, transparent)", color: "var(--admin-accent)", border: "1px solid color-mix(in srgb, var(--admin-accent) 25%, transparent)" }
  : { background: "rgba(100,100,100,0.09)", color: "#6b7280", border: "1px solid rgba(100,100,100,0.22)" };
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-");
const PER_PAGE = 8;
const SORTS = {
  newest: (a, b) => b.period.localeCompare(a.period) || new Date(b.createdAt) - new Date(a.createdAt),
  oldest: (a, b) => a.period.localeCompare(b.period) || new Date(a.createdAt) - new Date(b.createdAt),
  az: (a, b) => a.title.localeCompare(b.title),
  za: (a, b) => b.title.localeCompare(a.title)
};

function Cover({ issue }) {
  const src = issue.coverUrl || issue.pages?.[0]?.imageUrl;
  return src
    ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
    : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,color-mix(in srgb, var(--admin-accent) 18%, transparent),color-mix(in srgb, var(--admin-accent) 4%, transparent))" }} />;
}

function NewsletterList() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialLoading = useInitialLoad(loading);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("All"); // All | Published | Draft | Subscribers
  const [dept, setDept] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [mode, setMode] = useState("grid");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [i, s] = await Promise.all([api.get("/newsletter/admin/issues"), api.get("/newsletter/admin/subscribers")]);
      setIssues(i.data);
      setSubs(s.data);
    } catch (e) {
      setError(e.response?.data?.error || "Failed to load newsletters.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [tab, dept, search, sort]);

  const toggle = async (i) => {
    try { await api.patch(`/newsletter/admin/issues/${i._id}`, { status: i.status === "published" ? "draft" : "published" }); await load(); }
    catch (e) { setError(e.response?.data?.error || "Failed to update issue."); }
  };
  const remove = async (i) => {
    if (!window.confirm(`Delete "${i.title}"? This can't be undone.`)) return;
    try { await api.delete(`/newsletter/admin/issues/${i._id}`); await load(); }
    catch (e) { setError(e.response?.data?.error || "Failed to delete issue."); }
  };
  const edit = (i) => navigate(`/admin/dashboard/newsletter?edit=${i._id}`);

  const q = search.trim().toLowerCase();
  const shown = issues
    .filter((i) => (tab === "All" || i.status === tab.toLowerCase()) && (dept === "All" || i.department === dept)
      && (!q || [i.title, i.author, i.summary].some((v) => (v || "").toLowerCase().includes(q))))
    .sort(SORTS[sort]);
  const totalPages = Math.ceil(shown.length / PER_PAGE);
  const current = shown.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const count = (t) => (t === "All" ? issues.length : t === "Subscribers" ? subs.length : issues.filter((i) => i.status === t.toLowerCase()).length);
  const depts = [...new Set([...NEWSLETTER_DEPARTMENTS, ...issues.map((i) => i.department)])]; // legacy departments stay filterable

  const actions = (i) => <div style={{ display: "flex", gap: 4 }}>
      {i.status === "published" && <Link to={`/resources/newsletter/${i.slug}`} target="_blank" rel="noreferrer" style={{ ...ghost, textDecoration: "none" }}>View</Link>}
      <button type="button" onClick={() => edit(i)} style={ghost}>Edit</button>
      <button type="button" onClick={() => toggle(i)} style={ghost}>{i.status === "published" ? "Unpublish" : "Publish"}</button>
      <button type="button" onClick={() => remove(i)} style={danger}>Delete</button>
    </div>;

  return <div className="w-full" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="w-full mx-auto" style={{ maxWidth: 1200 }}>
        <PageHeader title="Newsletter list" subtitle="Manage your newsletter issues / Edit, publish, and organize them with ease" />
      </div>
      {error && <p role="alert" style={{ color: "var(--admin-danger)", fontSize: 12, margin: 0 }}>{error}</p>}

      <div className="w-full mx-auto" style={{ ...card, maxWidth: 1200, overflow: "hidden" }}>
        <div style={{ padding: "13px 18px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, margin: 0 }}>Newsletter library</p>
            <p style={{ fontSize: 10, color: MUTED, margin: "2px 0 0" }}>All newsletter issues and subscribers</p>
          </div>
          <div style={{ flex: 1 }} />
          {tab !== "Subscribers" && <>
            <input type="text" placeholder="Search by title or author..." aria-label="Search newsletters" value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inp, width: 210 }} />
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by" style={inp}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">Name A → Z</option>
              <option value="za">Name Z → A</option>
            </select>
            <div style={{ display: "flex", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
              {[["grid", "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"], ["list", "M4 6h16M4 12h16M4 18h16"]].map(([m, d]) => <button key={m} type="button" aria-label={`${m} view`} onClick={() => setMode(m)} style={{ padding: "6px 9px", border: "none", background: mode === m ? "var(--admin-accent)" : "transparent", color: mode === m ? "#fff" : MUTED, cursor: "pointer", display: "flex" }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} /></svg>
              </button>)}
            </div>
          </>}
        </div>

        <div style={{ display: "flex", padding: "0 18px", borderBottom: `1px solid ${BORDER}`, overflowX: "auto" }}>
          {["All", "Published", "Draft", "Subscribers"].map((t) => {
            const on = tab === t;
            return <button key={t} type="button" onClick={() => setTab(t)} style={{ padding: "9px 12px", border: "none", borderBottom: on ? "2px solid var(--admin-accent)" : "2px solid transparent", background: "transparent", color: on ? "var(--admin-accent)" : MUTED, fontSize: 11, fontWeight: on ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>
              {t}<span style={{ marginLeft: 5, fontSize: 9, padding: "1px 5px", borderRadius: 10, background: "rgba(128,128,128,0.12)", fontWeight: 500 }}>{count(t)}</span>
            </button>;
          })}
        </div>

        {tab !== "Subscribers" && <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, marginRight: 2 }}>Department:</span>
          {["All", ...depts].map((d) => <button key={d} type="button" onClick={() => setDept(d)} style={pill(dept === d)}>{d}</button>)}
        </div>}

        <DashboardLoader isVisible={initialLoading} message="Loading newsletters…" />

        {!initialLoading && tab === "Subscribers" && (subs.length === 0
          ? <p style={{ padding: "48px 20px", textAlign: "center", fontSize: 13, color: MUTED, margin: 0 }}>No subscribers yet.</p>
          : <table style={{ width: "100%", fontSize: 12, color: TEXT, borderCollapse: "collapse" }}>
              <thead><tr style={{ textAlign: "left", color: MUTED }}><th style={{ padding: "10px 18px" }}>Email</th><th style={{ padding: "10px 18px" }}>Subscribed</th></tr></thead>
              <tbody>{subs.map((s) => <tr key={s._id} style={{ borderTop: `1px solid ${BORDER}` }}><td style={{ padding: "10px 18px" }}>{s.email}</td><td style={{ padding: "10px 18px" }}>{fmtDate(s.createdAt)}</td></tr>)}</tbody>
            </table>)}

        {!initialLoading && tab !== "Subscribers" && current.length === 0 && <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: MUTED, fontWeight: 500, margin: "0 0 4px" }}>No newsletters found</p>
            <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{search ? "Try adjusting your search." : <>Try adjusting your filters or <Link to="/admin/dashboard/newsletter" style={{ color: "var(--admin-accent)" }}>add a newsletter</Link>.</>}</p>
          </div>}

        {!initialLoading && tab !== "Subscribers" && current.length > 0 && mode === "grid" && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, padding: 16 }}>
            {current.map((i) => <div key={i._id} style={{ border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", background: "var(--admin-surface)", display: "flex", flexDirection: "column" }}>
                <div style={{ height: 140, position: "relative", overflow: "hidden", background: "#e5e7eb" }}>
                  <Cover issue={i} />
                  <span style={{ position: "absolute", bottom: 8, left: 8, fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "3px 8px", borderRadius: 5, background: "color-mix(in srgb, var(--admin-accent) 88%, transparent)", color: "#fff" }}>{i.department}</span>
                </div>
                <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.title}</p>
                  {i.summary && <p style={{ fontSize: 10, color: MUTED, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.summary}</p>}
                  <p style={{ fontSize: 10, color: MUTED, margin: 0 }}>By <span style={{ fontWeight: 500 }}>{i.author}</span> · {periodLabel(i.period)}</p>
                  <div style={{ flex: 1 }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, paddingTop: 9, borderTop: `1px solid ${BORDER}`, marginTop: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 9, fontWeight: 500, padding: "3px 9px", borderRadius: 20, textTransform: "capitalize", ...statusStyle(i.status === "published") }}>{i.status}</span>
                    {actions(i)}
                  </div>
                </div>
              </div>)}
          </div>}

        {!initialLoading && tab !== "Subscribers" && current.length > 0 && mode === "list" && <div>
            {current.map((i, n) => <div key={i._id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 18px", borderBottom: n < current.length - 1 ? `1px solid ${BORDER}` : "none", flexWrap: "wrap" }}>
                <div style={{ width: 64, height: 40, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}><Cover issue={i} /></div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: 0 }}>{i.title}</p>
                  <p style={{ fontSize: 10, color: MUTED, margin: "2px 0 0" }}>{i.author} · {i.department} · {periodLabel(i.period)}</p>
                </div>
                <span style={{ fontSize: 9, fontWeight: 500, padding: "3px 9px", borderRadius: 20, textTransform: "capitalize", ...statusStyle(i.status === "published") }}>{i.status}</span>
                {actions(i)}
              </div>)}
          </div>}

        {totalPages > 1 && tab !== "Subscribers" && <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: 14, borderTop: `1px solid ${BORDER}` }}>
            {Array.from({ length: totalPages }, (_, n) => <button key={n} type="button" onClick={() => { setPage(n + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={pill(page === n + 1)}>{n + 1}</button>)}
          </div>}
      </div>
    </div>;
}
export {
  NewsletterList as default
};
