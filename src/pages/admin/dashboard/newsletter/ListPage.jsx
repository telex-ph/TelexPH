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

const mmss = (sec) => (sec >= 3600 ? `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m` : `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`);
const EMPTY_STATS = { views: 0, unique: 0, likes: 0, returning: 0, avgSeconds: 0, readRate: 0, bounceRate: 0, avgScroll: 0, devices: {}, sources: {}, trend: [] };
const top = (obj) => { const [k, v] = Object.entries(obj || {}).sort((a, b) => b[1] - a[1])[0] || []; return v ? k : "-"; };

function Spark({ trend }) {
  const max = Math.max(1, ...trend.map((t) => t.views));
  return <svg width="84" height="24" viewBox={`0 0 ${trend.length * 6} 24`} role="img" aria-label="Views over the last 14 days" style={{ color: "var(--admin-accent)" }}>
      {trend.map((t, i) => <rect key={t.day} x={i * 6} y={24 - Math.max(1, (t.views / max) * 22)} width="4" height={Math.max(1, (t.views / max) * 22)} rx="1" fill="currentColor" opacity={t.views ? 1 : 0.25}><title>{`${t.day}: ${t.views}`}</title></rect>)}
    </svg>;
}

const Tile = ({ label, value, hint }) => <div style={{ ...card, padding: "14px 16px", minWidth: 0 }}>
    <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED }}>{label}</p>
    <p style={{ margin: "6px 0 0", fontSize: 24, fontWeight: 700, color: TEXT, lineHeight: 1 }}>{value}</p>
    {hint && <p style={{ margin: "6px 0 0", fontSize: 10, color: MUTED }}>{hint}</p>}
  </div>;

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
  const [stats, setStats] = useState({ issues: [], totals: null, readRule: null });
  const [loading, setLoading] = useState(true);
  const initialLoading = useInitialLoad(loading);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("All"); // All | Published | Draft | Analytics | Subscribers
  const [dept, setDept] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [mode, setMode] = useState("grid");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [i, s, a] = await Promise.all([api.get("/newsletter/admin/issues"), api.get("/newsletter/admin/subscribers"), api.get("/newsletter/admin/analytics").catch(() => null)]); // the list still works if analytics is down
      setIssues(i.data);
      setSubs(s.data);
      if (a) setStats(a.data);
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
  const byId = Object.fromEntries(stats.issues.map((x) => [x.issueId, x]));
  const statOf = (i) => byId[i._id] || EMPTY_STATS;
  const isIssues = isIssues && tab !== "Analytics";
  const count = (t) => (t === "All" ? issues.length : t === "Subscribers" ? subs.length : t === "Analytics" ? issues.filter((i) => i.status === "published").length : issues.filter((i) => i.status === t.toLowerCase()).length);
  const depts = [...new Set([...NEWSLETTER_DEPARTMENTS, ...issues.map((i) => i.department)])]; // legacy departments stay filterable

  const metricLine = (i) => { const m = statOf(i); return i.status === "published" ? <p style={{ fontSize: 10, color: MUTED, margin: 0 }} title="Unique readers · likes · average time on page · read rate">{m.unique} readers · {m.likes} likes · {mmss(m.avgSeconds)} avg · {m.readRate}% read</p> : null; };
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

      {stats.totals && <div className="w-full mx-auto" style={{ maxWidth: 1200, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
        <Tile label="Total views" value={stats.totals.views.toLocaleString()} hint="Every time an issue was opened" />
        <Tile label="Unique readers" value={stats.totals.visitors.toLocaleString()} hint="Different people (one browser each)" />
        <Tile label="Likes" value={stats.totals.likes.toLocaleString()} />
        <Tile label="Avg time on issue" value={mmss(stats.totals.avgSeconds)} hint="Active time, not tab left open" />
        <Tile label="Read rate" value={`${stats.totals.readRate}%`} hint={stats.readRule ? `${stats.readRule.seconds}s+ and ${stats.readRule.scroll}%+ scrolled` : undefined} />
      </div>}

      <div className="w-full mx-auto" style={{ ...card, maxWidth: 1200, overflow: "hidden" }}>
        <div style={{ padding: "13px 18px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, margin: 0 }}>Newsletter library</p>
            <p style={{ fontSize: 10, color: MUTED, margin: "2px 0 0" }}>All newsletter issues and subscribers</p>
          </div>
          <div style={{ flex: 1 }} />
          {isIssues && <>
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
          {["All", "Published", "Draft", "Analytics", "Subscribers"].map((t) => {
            const on = tab === t;
            return <button key={t} type="button" onClick={() => setTab(t)} style={{ padding: "9px 12px", border: "none", borderBottom: on ? "2px solid var(--admin-accent)" : "2px solid transparent", background: "transparent", color: on ? "var(--admin-accent)" : MUTED, fontSize: 11, fontWeight: on ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>
              {t}<span style={{ marginLeft: 5, fontSize: 9, padding: "1px 5px", borderRadius: 10, background: "rgba(128,128,128,0.12)", fontWeight: 500 }}>{count(t)}</span>
            </button>;
          })}
        </div>

        {isIssues && <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, marginRight: 2 }}>Department:</span>
          {["All", ...depts].map((d) => <button key={d} type="button" onClick={() => setDept(d)} style={pill(dept === d)}>{d}</button>)}
        </div>}

        <DashboardLoader isVisible={initialLoading} message="Loading newsletters…" />

        {!initialLoading && tab === "Analytics" && (() => {
          const rows = issues.filter((i) => i.status === "published").map((i) => ({ i, m: statOf(i) })).sort((a, b) => b.m.views - a.m.views);
          const th = { padding: "10px 12px", textAlign: "left", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: MUTED, whiteSpace: "nowrap" };
          const td = { padding: "10px 12px", fontSize: 12, color: TEXT, whiteSpace: "nowrap" };
          return rows.length === 0
            ? <p style={{ padding: "48px 20px", textAlign: "center", fontSize: 13, color: MUTED, margin: 0 }}>Publish a newsletter to start collecting readers.</p>
            : <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {["Issue", "Views", "Unique", "Likes", "Avg time", "Read rate", "Avg scroll", "Bounce", "Returning", "Top source", "Top device", "Last 14 days"].map((h) => <th key={h} style={th} title={h === "Bounce" ? "Left in under 5 seconds" : h === "Returning" ? "Readers who opened it more than once" : h === "Read rate" ? "Stayed long enough and scrolled far enough to have read it" : undefined}>{h}</th>)}
                </tr></thead>
                <tbody>{rows.map(({ i, m }) => <tr key={i._id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td style={{ ...td, whiteSpace: "normal", minWidth: 200 }}><strong style={{ fontWeight: 600 }}>{i.title}</strong><br /><span style={{ fontSize: 10, color: MUTED }}>{i.department} · {periodLabel(i.period)}</span></td>
                  <td style={td}>{m.views}</td><td style={td}>{m.unique}</td><td style={td}>{m.likes}</td>
                  <td style={td}>{mmss(m.avgSeconds)}</td><td style={td}>{m.readRate}%</td><td style={td}>{m.avgScroll}%</td><td style={td}>{m.bounceRate}%</td><td style={td}>{m.returning}</td>
                  <td style={td}>{top(m.sources)}</td><td style={td}>{top(m.devices)}</td>
                  <td style={td}>{m.trend.length ? <Spark trend={m.trend} /> : "-"}</td>
                </tr>)}</tbody>
              </table></div>;
        })()}

        {!initialLoading && tab === "Subscribers" && (subs.length === 0
          ? <p style={{ padding: "48px 20px", textAlign: "center", fontSize: 13, color: MUTED, margin: 0 }}>No subscribers yet.</p>
          : <table style={{ width: "100%", fontSize: 12, color: TEXT, borderCollapse: "collapse" }}>
              <thead><tr style={{ textAlign: "left", color: MUTED }}><th style={{ padding: "10px 18px" }}>Email</th><th style={{ padding: "10px 18px" }}>Subscribed</th></tr></thead>
              <tbody>{subs.map((s) => <tr key={s._id} style={{ borderTop: `1px solid ${BORDER}` }}><td style={{ padding: "10px 18px" }}>{s.email}</td><td style={{ padding: "10px 18px" }}>{fmtDate(s.createdAt)}</td></tr>)}</tbody>
            </table>)}

        {!initialLoading && isIssues && current.length === 0 && <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: MUTED, fontWeight: 500, margin: "0 0 4px" }}>No newsletters found</p>
            <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{search ? "Try adjusting your search." : <>Try adjusting your filters or <Link to="/admin/dashboard/newsletter" style={{ color: "var(--admin-accent)" }}>add a newsletter</Link>.</>}</p>
          </div>}

        {!initialLoading && isIssues && current.length > 0 && mode === "grid" && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, padding: 16 }}>
            {current.map((i) => <div key={i._id} style={{ border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", background: "var(--admin-surface)", display: "flex", flexDirection: "column" }}>
                <div style={{ height: 140, position: "relative", overflow: "hidden", background: "#e5e7eb" }}>
                  <Cover issue={i} />
                  <span style={{ position: "absolute", bottom: 8, left: 8, fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "3px 8px", borderRadius: 5, background: "color-mix(in srgb, var(--admin-accent) 88%, transparent)", color: "#fff" }}>{i.department}</span>
                </div>
                <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.title}</p>
                  {i.summary && <p style={{ fontSize: 10, color: MUTED, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.summary}</p>}
                  <p style={{ fontSize: 10, color: MUTED, margin: 0 }}>By <span style={{ fontWeight: 500 }}>{i.author}</span> · {periodLabel(i.period)}</p>
                  {metricLine(i)}
                  <div style={{ flex: 1 }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, paddingTop: 9, borderTop: `1px solid ${BORDER}`, marginTop: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 9, fontWeight: 500, padding: "3px 9px", borderRadius: 20, textTransform: "capitalize", ...statusStyle(i.status === "published") }}>{i.status}</span>
                    {actions(i)}
                  </div>
                </div>
              </div>)}
          </div>}

        {!initialLoading && isIssues && current.length > 0 && mode === "list" && <div>
            {current.map((i, n) => <div key={i._id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 18px", borderBottom: n < current.length - 1 ? `1px solid ${BORDER}` : "none", flexWrap: "wrap" }}>
                <div style={{ width: 64, height: 40, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}><Cover issue={i} /></div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: 0 }}>{i.title}</p>
                  <p style={{ fontSize: 10, color: MUTED, margin: "2px 0 0" }}>{i.author} · {i.department} · {periodLabel(i.period)}</p>
                  {metricLine(i)}
                </div>
                <span style={{ fontSize: 9, fontWeight: 500, padding: "3px 9px", borderRadius: 20, textTransform: "capitalize", ...statusStyle(i.status === "published") }}>{i.status}</span>
                {actions(i)}
              </div>)}
          </div>}

        {totalPages > 1 && isIssues && <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: 14, borderTop: `1px solid ${BORDER}` }}>
            {Array.from({ length: totalPages }, (_, n) => <button key={n} type="button" onClick={() => { setPage(n + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={pill(page === n + 1)}>{n + 1}</button>)}
          </div>}
      </div>
    </div>;
}
export {
  NewsletterList as default
};
