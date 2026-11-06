import { useState, useEffect, useMemo } from "react";
import DashboardLoader, { useInitialLoad } from "@/components/DashboardLoader";
import { periodLabel } from "@/components/NewsletterView";
import api from "@/lib/api/axios";
import { BORDER, MUTED, TEXT, card, inp, pill, mmss, Tile } from "./ui";

// Analytics tab of the newsletter list: date range, per-issue table you can tick and total, and a day / week / month breakdown.
const API_URL = "/newsletter/admin/analytics";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const EMPTY = { views: 0, unique: 0, likes: 0, returning: 0, avgSeconds: 0, readRate: 0, bounceRate: 0, avgScroll: 0, devices: {}, sources: {}, trend: [] };
const PRESETS = [["7d", "Last 7 days", "day"], ["30d", "Last 30 days", "day"], ["90d", "Last 90 days", "week"], ["month", "This month", "day"], ["last", "Last month", "day"], ["year", "This year", "month"], ["all", "All time", "month"]];

const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
function presetRange(p) {
  const n = new Date();
  const y = n.getFullYear();
  const m = n.getMonth();
  const back = (k) => ymd(new Date(y, m, n.getDate() - k));
  const today = ymd(n);
  if (p === "7d") return { from: back(6), to: today };
  if (p === "30d") return { from: back(29), to: today };
  if (p === "90d") return { from: back(89), to: today };
  if (p === "month") return { from: ymd(new Date(y, m, 1)), to: today };
  if (p === "last") return { from: ymd(new Date(y, m - 1, 1)), to: ymd(new Date(y, m, 0)) };
  if (p === "year") return { from: `${y}-01-01`, to: today };
  return { from: "", to: "" };
}

// "Nov 6", "Nov 3–9" (week starting Monday), "Nov 2026"
function bucketLabel(b, group) {
  const [y, m, d] = b.split("-").map(Number);
  if (group === "month") return `${MONTHS[m - 1]} ${y}`;
  if (group === "week") {
    const e = new Date(Date.UTC(y, m - 1, d + 6));
    return e.getUTCMonth() === m - 1 ? `${MONTHS[m - 1]} ${d}–${e.getUTCDate()}` : `${MONTHS[m - 1]} ${d} – ${MONTHS[e.getUTCMonth()]} ${e.getUTCDate()}`;
  }
  return `${MONTHS[m - 1]} ${d}`;
}

const top = (obj) => { const [k, v] = Object.entries(obj || {}).sort((a, b) => b[1] - a[1])[0] || []; return v ? k : "-"; };

function Delta({ cur, prev }) {
  if (prev == null || (!prev && !cur)) return null;
  if (!prev) return <span style={{ fontSize: 10, fontWeight: 600, color: "var(--admin-success)" }}>new</span>;
  const p = Math.round(((cur - prev) / prev) * 100);
  if (!p) return <span style={{ fontSize: 10, color: MUTED }}>no change</span>;
  return <span title={`Was ${prev.toLocaleString()} in the previous period`} style={{ fontSize: 10, fontWeight: 600, color: p > 0 ? "var(--admin-success)" : "var(--admin-danger)" }}>{p > 0 ? "▲" : "▼"} {Math.abs(p)}%</span>;
}

function Legend({ color, label, dot }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, color: MUTED }}>
      <span style={{ width: dot ? 8 : 10, height: dot ? 8 : 10, borderRadius: dot ? "50%" : 2, background: color }} />{label}
    </span>;
}

// Views as bars, new readers as a line. One transparent column per bucket carries the hover tooltip.
function Chart({ series, group }) {
  const W = 800, H = 240, L = 40, R = 12, T = 12, B = 26;
  const n = series.length;
  const raw = Math.max(1, ...series.map((s) => Math.max(s.views, s.readers)));
  const mag = 10 ** Math.floor(Math.log10(raw));
  const max = raw <= 4 ? 4 : [1, 2, 4, 8, 10].find((k) => k * mag >= raw) * mag; // tidy top so the 4 gridlines land on round numbers
  const iw = W - L - R, ih = H - T - B;
  const step = iw / n;
  const x = (i) => L + step * i + step / 2;
  const y = (v) => T + ih - (v / max) * ih;
  const every = Math.ceil(n / 8);
  const line = series.map((s, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(s.readers).toFixed(1)}`).join(" ");
  return <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Views and new readers over time" style={{ width: "100%", height: "auto", display: "block" }}>
      {[0, 1, 2, 3, 4].map((k) => {
        const v = (max / 4) * k;
        return <g key={k}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} style={{ stroke: "var(--admin-border)" }} strokeWidth="1" strokeDasharray={k ? "3 4" : undefined} />
            <text x={L - 6} y={y(v) + 3} textAnchor="end" fontSize="10" style={{ fill: "var(--admin-text-sub)" }}>{Math.round(v).toLocaleString()}</text>
          </g>;
      })}
      {series.map((s, i) => <rect key={s.bucket} x={x(i) - Math.max(1, step * 0.7) / 2} y={y(s.views)} width={Math.max(1, step * 0.7)} height={Math.max(0, T + ih - y(s.views))} rx={Math.min(3, step / 4)} style={{ fill: "var(--admin-accent)" }} opacity="0.85" />)}
      {n > 1 && <path d={line} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" style={{ stroke: "var(--admin-info)" }} />}
      {n <= 62 && series.map((s, i) => <circle key={s.bucket} cx={x(i)} cy={y(s.readers)} r="2.5" style={{ fill: "var(--admin-info)" }} />)}
      {series.map((s, i) => i % every === 0 && <text key={s.bucket} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" style={{ fill: "var(--admin-text-sub)" }}>{bucketLabel(s.bucket, group)}</text>)}
      {series.map((s, i) => <rect key={`h${s.bucket}`} x={L + step * i} y={T} width={step} height={ih} fill="transparent">
          <title>{`${bucketLabel(s.bucket, group)}\nViews: ${s.views}\nNew readers: ${s.readers}\nLikes: ${s.likes}`}</title>
        </rect>)}
    </svg>;
}

function Spark({ trend }) {
  const n = trend.length;
  if (n < 2) return <span style={{ fontSize: 10, color: MUTED }}>-</span>;
  const max = Math.max(1, ...trend.map((t) => t.views));
  const pts = trend.map((t, i) => `${((i / (n - 1)) * 88 + 1).toFixed(1)},${(23 - (t.views / max) * 20).toFixed(1)}`);
  return <svg width="90" height="26" viewBox="0 0 90 26" role="img" aria-label="Views over the selected period" style={{ display: "block" }}>
      <polyline points={pts.join(" ")} fill="none" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" style={{ stroke: "var(--admin-accent)" }} />
    </svg>;
}

function Breakdown({ title, data }) {
  const rows = Object.entries(data || {}).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  const total = rows.reduce((s, [, v]) => s + v, 0);
  return <div style={{ ...card, padding: "14px 16px", minWidth: 0 }}>
      <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 600, color: TEXT }}>{title}</p>
      {rows.length === 0 && <p style={{ margin: 0, fontSize: 11, color: MUTED }}>No data in this period.</p>}
      <div style={{ display: "grid", gap: 9 }}>
        {rows.map(([k, v]) => <div key={k}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: TEXT, marginBottom: 3 }}><span>{k}</span><span style={{ color: MUTED }}>{v.toLocaleString()} · {Math.round((v / total) * 100)}%</span></div>
            <div style={{ height: 6, borderRadius: 4, background: "var(--admin-bg-soft)" }}><div style={{ height: "100%", width: `${(v / total) * 100}%`, borderRadius: 4, background: "var(--admin-accent)" }} /></div>
          </div>)}
      </div>
    </div>;
}

const COLS = [
  ["views", "Views", (m) => m.views.toLocaleString(), "Every time the issue was opened"],
  ["unique", "Unique", (m) => m.unique.toLocaleString(), "Different people (one browser each)"],
  ["likes", "Likes", (m) => m.likes.toLocaleString()],
  ["avgSeconds", "Avg time", (m) => mmss(m.avgSeconds), "Active time on the page"],
  ["readRate", "Read rate", (m) => `${m.readRate}%`, "Stayed long enough and scrolled far enough to have read it"],
  ["avgScroll", "Avg scroll", (m) => `${m.avgScroll}%`],
  ["bounceRate", "Bounce", (m) => `${m.bounceRate}%`, "Left in under 5 seconds"],
  ["returning", "Returning", (m) => m.returning.toLocaleString(), "Readers who opened it more than once"]
];

export default function NewsletterAnalytics({ issues }) {
  const [preset, setPreset] = useState("30d");
  const [range, setRange] = useState(() => presetRange("30d"));
  const [group, setGroup] = useState("day");
  const [selected, setSelected] = useState(() => new Set());
  const [sort, setSort] = useState({ key: "views", dir: -1 });
  const [all, setAll] = useState(null); // every issue
  const [sel, setSel] = useState(null); // just the ticked issues, for the totals
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const initialLoading = useInitialLoad(loading);

  const ready = (!range.from && !range.to) || (range.from && range.to); // a half-filled custom range waits
  const params = { ...(range.from && range.to ? { from: range.from, to: range.to } : {}), group };
  const key = JSON.stringify(params);
  const ids = [...selected].sort().join(",");

  // Filters keep the old numbers on screen while the new ones load, and a stale answer never overwrites a newer one.
  useEffect(() => {
    if (!ready) return undefined;
    let live = true;
    api.get(API_URL, { params })
      .then((r) => { if (live) { setAll(r.data); setError(""); } })
      .catch((e) => { if (live) setError(e.response?.data?.error || "Failed to load analytics."); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!ready || !ids) { setSel(null); return undefined; }
    let live = true;
    api.get(API_URL, { params: { ...params, issues: ids } }).then((r) => { if (live) setSel(r.data); }).catch(() => {});
    return () => { live = false; };
  }, [key, ids]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (p, g) => { setPreset(p); setRange(presetRange(p)); setGroup(g); };
  const setDate = (k, v) => { setPreset("custom"); setRange((r) => ({ ...r, [k]: v })); };

  const published = useMemo(() => issues.filter((i) => i.status === "published"), [issues]);
  const byId = useMemo(() => Object.fromEntries((all?.issues || []).map((x) => [x.issueId, x])), [all]);
  const rows = useMemo(() => published.map((i) => ({ i, m: byId[i._id] || EMPTY })).sort((a, b) => sort.dir * (a.m[sort.key] - b.m[sort.key])), [published, byId, sort]);
  const view = sel || all; // tiles, chart and breakdown follow the ticked issues when there are any
  const ticked = selected.size;
  const toggle = (id) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allTicked = rows.length > 0 && ticked === rows.length;

  const th = { padding: "10px 12px", textAlign: "left", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: MUTED, whiteSpace: "nowrap" };
  const td = { padding: "10px 12px", fontSize: 12, color: TEXT, whiteSpace: "nowrap" };

  if (all && !all.series) return <p role="alert" style={{ padding: "48px 20px", textAlign: "center", fontSize: 13, color: "var(--admin-danger)", margin: 0 }}>The server is still on the old analytics version (no date filter yet). Deploy the latest telexph-admin, then reload.</p>;
  if (published.length === 0) return <p style={{ padding: "48px 20px", textAlign: "center", fontSize: 13, color: MUTED, margin: 0 }}>Publish a newsletter to start collecting readers.</p>;

  const t = view?.totals;
  const prev = view?.previous;
  const r = view?.range;
  const groupWord = { day: "Day", week: "Week", month: "Month" }[r?.group || group];
  const sumSeries = (k) => (view?.series || []).reduce((n, s) => n + s[k], 0);

  return <div style={{ padding: 16, display: "grid", gap: 16 }}>
      <DashboardLoader isVisible={initialLoading} message="Loading analytics…" />

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {PRESETS.map(([p, label, g]) => <button key={p} type="button" onClick={() => pick(p, g)} style={pill(preset === p)}>{label}</button>)}
        <div style={{ flex: 1 }} />
        <label style={{ fontSize: 10, color: MUTED, display: "flex", alignItems: "center", gap: 5 }}>From
          <input type="date" value={range.from} max={range.to || undefined} onChange={(e) => setDate("from", e.target.value)} style={inp} />
        </label>
        <label style={{ fontSize: 10, color: MUTED, display: "flex", alignItems: "center", gap: 5 }}>To
          <input type="date" value={range.to} min={range.from || undefined} onChange={(e) => setDate("to", e.target.value)} style={inp} />
        </label>
        <div style={{ display: "flex", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }} role="group" aria-label="Group by">
          {[["day", "Daily"], ["week", "Weekly"], ["month", "Monthly"]].map(([g, label]) => <button key={g} type="button" aria-pressed={group === g} onClick={() => setGroup(g)} style={{ padding: "6px 11px", border: "none", fontSize: 10, fontWeight: 600, cursor: "pointer", background: (r?.group || group) === g ? "var(--admin-accent)" : "transparent", color: (r?.group || group) === g ? "var(--admin-text-on-accent)" : MUTED }}>{label}</button>)}
        </div>
      </div>

      {error && <p role="alert" style={{ color: "var(--admin-danger)", fontSize: 12, margin: 0 }}>{error}</p>}

      {view && <>
        <p style={{ margin: 0, fontSize: 11, color: MUTED }}>
          {ticked ? <><strong style={{ color: TEXT }}>{ticked} selected issue{ticked > 1 ? "s" : ""}</strong> · <button type="button" onClick={() => setSelected(new Set())} style={{ border: "none", background: "none", padding: 0, color: "var(--admin-accent-text)", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>clear</button></> : <strong style={{ color: TEXT }}>All published issues</strong>}
          {" · "}{r.ranged ? `${bucketLabel(r.from, "day")}, ${r.from.slice(0, 4)} to ${bucketLabel(r.to, "day")}, ${r.to.slice(0, 4)}` : "All time"}{prev ? " · compared with the period right before" : ""}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          <Tile label="Views" value={t.views.toLocaleString()} delta={<Delta cur={t.views} prev={prev?.views} />} hint="Every time an issue was opened" />
          <Tile label="Unique readers" value={t.visitors.toLocaleString()} delta={<Delta cur={t.visitors} prev={prev?.visitors} />} hint="Each person counted once" />
          <Tile label="Likes" value={t.likes.toLocaleString()} delta={<Delta cur={t.likes} prev={prev?.likes} />} />
          <Tile label="Avg time on issue" value={mmss(t.avgSeconds)} delta={<Delta cur={t.avgSeconds} prev={prev?.avgSeconds} />} hint="Active time, not tab left open" />
          <Tile label="Read rate" value={`${t.readRate}%`} delta={<Delta cur={t.readRate} prev={prev?.readRate} />} hint={all?.readRule ? `${all.readRule.seconds}s+ and ${all.readRule.scroll}%+ scrolled` : undefined} />
          <Tile label="Bounce rate" value={`${t.bounceRate}%`} hint="Left in under 5 seconds" />
        </div>

        <div style={{ ...card, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 8 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: TEXT }}>{groupWord === "Day" ? "Daily" : `${groupWord}ly`} views and new readers</p>
            <div style={{ flex: 1 }} />
            <Legend color="var(--admin-accent)" label="Views" />
            <Legend color="var(--admin-info)" label="New readers" dot />
          </div>
          {view.series.length ? <Chart series={view.series} group={r.group} /> : <p style={{ fontSize: 12, color: MUTED }}>No activity yet.</p>}
          <p style={{ margin: "8px 0 0", fontSize: 10, color: MUTED }}>New readers = people who opened an issue for the first time in that {groupWord.toLowerCase()}. Days follow UTC.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          <Breakdown title="Where readers come from" data={t.sources} />
          <Breakdown title="Devices" data={t.devices} />
        </div>
      </>}

      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: TEXT }}>Per newsletter</p>
          <p style={{ margin: "2px 0 0", fontSize: 10, color: MUTED }}>Tick issues to total them. Click a column to sort.</p>
        </div>
        <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>
            <th style={{ ...th, width: 34 }}><input type="checkbox" aria-label="Select all issues" checked={allTicked} onChange={() => setSelected(allTicked ? new Set() : new Set(rows.map(({ i }) => i._id)))} /></th>
            <th style={th}>Issue</th>
            {COLS.map(([k, label, , hint]) => <th key={k} style={{ ...th, cursor: "pointer" }} title={hint} aria-sort={sort.key === k ? (sort.dir < 0 ? "descending" : "ascending") : "none"} onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? -s.dir : -1 }))}>{label}{sort.key === k ? (sort.dir < 0 ? " ↓" : " ↑") : ""}</th>)}
            <th style={th}>Top source</th><th style={th}>Top device</th><th style={th}>Trend</th>
          </tr></thead>
          <tbody>{rows.map(({ i, m }) => <tr key={i._id} style={{ borderTop: `1px solid ${BORDER}`, background: selected.has(i._id) ? "var(--admin-accent-soft)" : undefined, opacity: m.views || m.unique ? 1 : 0.55 }}>
            <td style={td}><input type="checkbox" aria-label={`Select ${i.title}`} checked={selected.has(i._id)} onChange={() => toggle(i._id)} /></td>
            <td style={{ ...td, whiteSpace: "normal", minWidth: 200 }}><strong style={{ fontWeight: 600 }}>{i.title}</strong><br /><span style={{ fontSize: 10, color: MUTED }}>{i.department} · {periodLabel(i.period)}</span></td>
            {COLS.map(([k, , fmt]) => <td key={k} style={td}>{fmt(m)}</td>)}
            <td style={td}>{top(m.sources)}</td><td style={td}>{top(m.devices)}</td>
            <td style={td}><Spark trend={m.trend} /></td>
          </tr>)}</tbody>
          {t && <tfoot><tr style={{ borderTop: `2px solid ${BORDER}`, background: "var(--admin-bg-soft)" }}>
            <td style={td} />
            <td style={{ ...td, fontWeight: 700 }}>{ticked ? `Total · ${ticked} selected` : `Total · all ${rows.length} issues`}</td>
            <td style={{ ...td, fontWeight: 700 }}>{t.views.toLocaleString()}</td>
            <td style={{ ...td, fontWeight: 700 }} title="Each person counted once, even if they read several issues">{t.visitors.toLocaleString()}</td>
            <td style={{ ...td, fontWeight: 700 }}>{t.likes.toLocaleString()}</td>
            <td style={{ ...td, fontWeight: 700 }}>{mmss(t.avgSeconds)}</td>
            <td style={{ ...td, fontWeight: 700 }}>{t.readRate}%</td>
            <td style={{ ...td, fontWeight: 700 }}>{t.avgScroll}%</td>
            <td style={{ ...td, fontWeight: 700 }}>{t.bounceRate}%</td>
            <td style={{ ...td, fontWeight: 700 }}>{t.returning.toLocaleString()}</td>
            <td style={td}>{top(t.sources)}</td><td style={td}>{top(t.devices)}</td><td style={td} />
          </tr></tfoot>}
        </table></div>
      </div>

      {view && view.series.length > 0 && <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: TEXT }}>By {groupWord.toLowerCase()}</p>
          <p style={{ margin: "2px 0 0", fontSize: 10, color: MUTED }}>Switch Daily, Weekly or Monthly above. Totals match the cards.</p>
        </div>
        <div style={{ overflow: "auto", maxHeight: 360 }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: `1px solid ${BORDER}`, position: "sticky", top: 0, background: "var(--admin-surface)" }}>
            {[groupWord, "Views", "New readers", "Likes"].map((h) => <th key={h} style={th}>{h}</th>)}
          </tr></thead>
          <tbody>{[...view.series].reverse().map((s) => <tr key={s.bucket} style={{ borderTop: `1px solid ${BORDER}`, opacity: s.views || s.readers || s.likes ? 1 : 0.5 }}>
            <td style={td}>{bucketLabel(s.bucket, r.group)}</td><td style={td}>{s.views.toLocaleString()}</td><td style={td}>{s.readers.toLocaleString()}</td><td style={td}>{s.likes.toLocaleString()}</td>
          </tr>)}</tbody>
          <tfoot><tr style={{ borderTop: `2px solid ${BORDER}`, background: "var(--admin-bg-soft)" }}>
            <td style={{ ...td, fontWeight: 700 }}>Total</td>
            <td style={{ ...td, fontWeight: 700 }}>{sumSeries("views").toLocaleString()}</td><td style={{ ...td, fontWeight: 700 }}>{sumSeries("readers").toLocaleString()}</td><td style={{ ...td, fontWeight: 700 }}>{sumSeries("likes").toLocaleString()}</td>
          </tr></tfoot>
        </table></div>
      </div>}
    </div>;
}
