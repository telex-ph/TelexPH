import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "@/lib/api/axios";

const RANGES = [
  { key: "today", label: "Today" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "annually", label: "Annually" },
  { key: "custom", label: "Custom" },
];
const RESOURCES = [
  { key: "all", label: "All" },
  { key: "blog", label: "Blogs" },
  { key: "casestudy", label: "Case Studies" },
];
const RESOURCE_SUBTITLE = {
  all: "Views and Likes from Blogs & Case Studies",
  blog: "Views and Likes from Blogs Only",
  casestudy: "Views and Likes from Case Studies Only",
};

const pad = (n) => String(n).padStart(2, "0");
const toInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const daysAgo = (n) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
};

// The API buckets by range length (<=1 day: hourly, <=31: daily, else monthly).
function rangeParams(range, from, to) {
  const now = new Date();
  if (range === "today") return { start: daysAgo(0), end: now };
  if (range === "weekly") return { start: daysAgo(6), end: now };
  if (range === "monthly") return { start: daysAgo(29), end: now };
  if (range === "annually") return { start: daysAgo(364), end: now };
  return { start: new Date(`${from}T00:00:00`), end: new Date(`${to}T23:59:59`) };
}

const pill = (active) =>
  `px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg transition-all ${
    active
      ? "bg-[var(--admin-accent)] text-[var(--admin-text-on-accent)] shadow-md"
      : "text-[var(--admin-text-sub)] hover:bg-[var(--admin-bg-hover)]"
  }`;

function PillGroup({ items, value, onChange }) {
  return (
    <div className="flex gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-md border bg-[var(--admin-bg-soft)] border-[var(--admin-border)]">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onChange(it.key)}
          className={pill(value === it.key)}
          style={{ fontSize: 11, fontWeight: value === it.key ? 600 : 400, whiteSpace: "nowrap" }}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

const dateInput =
  "px-3 py-1.5 rounded-lg border focus:outline-none bg-[var(--admin-bg-soft)] border-[var(--admin-border)] text-[var(--admin-text)]";

/**
 * Views + likes chart. Only the very first fetch reports `loading` (the page
 * overlay covers it); changing a filter keeps the current chart on screen
 * until the new data swaps in — no loading state.
 */
export default function EngagementMetricsCard({ onLoadingChange }) {
  const [data, setData] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(false);
  const [resource, setResource] = useState("all");
  const [range, setRange] = useState("monthly");
  const [from, setFrom] = useState(() => toInput(daysAgo(29)));
  const [to, setTo] = useState(() => toInput(new Date()));

  const customInvalid = range === "custom" && (!from || !to || from > to);

  useEffect(() => {
    onLoadingChange?.(initialLoading);
  }, [initialLoading, onLoadingChange]);

  useEffect(() => {
    if (customInvalid) return;
    let stale = false;
    const { start, end } = rangeParams(range, from, to);
    const qs = new URLSearchParams({
      resourceType: resource,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
    api
      .get(`/dashboard/engagement-metrics?${qs}`)
      .then((res) => {
        if (stale) return;
        setData(res.data);
        setError(false);
      })
      .catch(() => !stale && setError(true))
      .finally(() => !stale && setInitialLoading(false));
    return () => {
      stale = true; // a newer filter click wins over a slower earlier response
    };
  }, [resource, range, from, to, customInvalid]);

  return (
    <div className="card-inner rounded-xl border shadow-sm bg-[var(--admin-surface)] border-[var(--admin-border)]">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-[var(--admin-text)]" style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>
            Engagement Metrics
          </p>
          <p className="text-[var(--admin-text-faint)]" style={{ fontSize: 11, margin: "3px 0 0" }}>
            {RESOURCE_SUBTITLE[resource]}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {[
            { color: "var(--admin-accent)", label: "views" },
            { color: "#6b7280", label: "likes" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
              <span className="text-[var(--admin-text-faint)]" style={{ fontSize: 11 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <PillGroup items={RANGES} value={range} onChange={setRange} />
        <PillGroup items={RESOURCES} value={resource} onChange={setResource} />
      </div>

      {range === "custom" && (
        <div className="flex flex-wrap items-center gap-2 mb-4" style={{ fontSize: 11 }}>
          <input type="date" value={from} max={to || toInput(new Date())} onChange={(e) => setFrom(e.target.value)} className={dateInput} />
          <span className="text-[var(--admin-text-faint)]">to</span>
          <input type="date" value={to} min={from} max={toInput(new Date())} onChange={(e) => setTo(e.target.value)} className={dateInput} />
          {customInvalid && <span className="text-[var(--admin-danger)]">Pick a start date that is on or before the end date.</span>}
        </div>
      )}

      {error && <p className="text-[var(--admin-danger)] mb-2" style={{ fontSize: 11 }}>Couldn't refresh the chart. Showing the last loaded data.</p>}

      <div style={{ height: "clamp(180px, 28vw, 280px)", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--admin-accent)" stopOpacity={0.12} />
                <stop offset="95%" stopColor="var(--admin-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-bg-hover)" />
            <XAxis
              dataKey="name" axisLine={false} tickLine={false} dy={10}
              interval="preserveStartEnd" minTickGap={18}
              tick={{ fontSize: 10, fill: "var(--admin-text-faint)", fontWeight: 400 }}
            />
            <YAxis
              axisLine={false} tickLine={false} width={30} allowDecimals={false}
              tick={{ fontSize: 10, fill: "var(--admin-text-faint)", fontWeight: 400 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 14, border: "1px solid var(--admin-border)", boxShadow: "0 4px 16px rgba(0,0,0,.10)",
                fontSize: 12, backgroundColor: "var(--admin-surface)", color: "var(--admin-text)",
              }}
            />
            <Area type="monotone" dataKey="views" stroke="var(--admin-accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorviews)" isAnimationActive={false} />
            <Area type="monotone" dataKey="likes" stroke="#6b7280" strokeWidth={2} fill="transparent" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
