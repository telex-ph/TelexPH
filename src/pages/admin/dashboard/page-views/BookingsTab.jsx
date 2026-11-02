import { useEffect, useMemo, useState } from "react";
import DashboardLoader, { useInitialLoad } from "@/components/DashboardLoader";
import api from "@/lib/api/axios";
import { keepIfSame, onSilentRefresh } from "@/lib/silent-refresh";
import { Card, CardHeader } from "./WebsitePageViews";
const CHANNEL_LABELS = {
  facebook: "Facebook",
  linkedin: "LinkedIn",
  email: "Email",
  instagram: "Instagram",
  search: "Search",
  chatgpt: "ChatGPT",
  "telexph-website": "telexph.com",
  direct: "Direct",
  other: "Other"
};
// Bookings imported from GHL are stored as "unknown"; the team reads them as Direct.
const channelOf = (c) => !c || c === "unknown" ? "direct" : c;
const channelLabel = (c) => CHANNEL_LABELS[channelOf(c)] ?? c;
const initials = (name) => name.trim().split(/\s+/).slice(0, 2).map((n) => n[0]?.toUpperCase() ?? "").join("") || "?";
const when = (date, timeZone) => new Date(date).toLocaleString("en-US", { timeZone, month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const bookedDay = (date) => new Date(date).toLocaleDateString("en-US", { timeZone: "Asia/Manila", month: "short", day: "numeric", year: "numeric" });
const label = { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--admin-text-sub)", margin: "0 0 6px" };
const sub = { fontSize: 11, color: "var(--admin-text-sub)", marginTop: 2, overflowWrap: "anywhere" };
function Pill({ children, soft }) {
  return <span style={{
    display: "inline-block",
    padding: "2px 9px",
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap",
    background: soft ? "var(--admin-bg-soft)" : "var(--admin-accent-soft)",
    color: soft ? "var(--admin-text-sub)" : "var(--admin-accent-text)"
  }}>{children}</span>;
}
function TimeRow({ zone, date, timeZone }) {
  return <div style={{ display: "grid", gridTemplateColumns: "50px 1fr", alignItems: "baseline", gap: 6, fontSize: 12, color: "var(--admin-text)", marginTop: 3 }}>
      <span style={{ ...label, margin: 0 }}>{zone}</span>
      <span style={{ whiteSpace: "nowrap" }}>{when(date, timeZone)}</span>
    </div>;
}
function BookingRow({ b }) {
  return <div
    style={{ display: "flex", flexWrap: "wrap", gap: 14, padding: 14, borderRadius: 14, border: "1px solid var(--admin-border)", background: "var(--admin-surface)", transition: "background .15s, border-color .15s" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "var(--admin-bg-soft)";
      e.currentTarget.style.borderColor = "var(--admin-border-strong)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "var(--admin-surface)";
      e.currentTarget.style.borderColor = "var(--admin-border)";
    }}
  >
      <div style={{ flex: "2 1 210px", minWidth: 0, display: "flex", gap: 12 }}>
        <div style={{
    width: 38,
    height: 38,
    flexShrink: 0,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    background: "linear-gradient(135deg, var(--admin-accent), var(--admin-accent-hover))",
    color: "var(--admin-text-on-accent)"
  }}>{initials(b.name)}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--admin-text)", textTransform: "capitalize" }}>{b.name}</span>
            <Pill soft={b.site === "intl"}>{b.site}</Pill>
          </div>
          <div style={sub}><a href={`mailto:${b.email}`} style={{ color: "var(--admin-accent-text)" }}>{b.email}</a></div>
          {(b.company || b.phone) && <div style={sub}>{b.company || b.phone}</div>}
          <div style={sub}>Booked {bookedDay(b.bookedAt)}</div>
        </div>
      </div>

      <div style={{ flex: "1 1 150px" }}>
        <p style={label}>Call</p>
        {b.startAt ? <>
            {b.timezone && <TimeRow zone="Client" date={b.startAt} timeZone={b.timezone} />}
            <TimeRow zone="PH" date={b.startAt} timeZone="Asia/Manila" />
            <TimeRow zone="NZ" date={b.startAt} timeZone="Pacific/Auckland" />
          </> : <span style={{ fontSize: 12, color: "var(--admin-text-sub)" }}>—</span>}
      </div>

      <div style={{ flex: "1 1 85px" }}>
        <p style={label}>From</p>
        <Pill>{channelLabel(b.channel)}</Pill>
        {channelOf(b.lastChannel) !== channelOf(b.channel) && <div style={sub}>last: {channelLabel(b.lastChannel)}</div>}
        {(b.utmCampaign || b.utmContent) && <div style={sub}>{[b.utmCampaign, b.utmContent].filter(Boolean).join(" / ")}</div>}
      </div>

      <div style={{ flex: "1 1 95px" }}>
        <p style={label}>Details</p>
        <div style={{ fontSize: 12, color: "var(--admin-text)" }}>{b.purpose || (b.agentsNeeded ? `${b.agentsNeeded} agents` : "—")}</div>
      </div>
    </div>;
}
function BookingsTab({ range }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialLoading = useInitialLoad(loading);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.get("/dashboard/bookings", { params: { range } }).then((res) => {
      if (!cancelled) setBookings(res.data.bookings);
    }).catch(() => {
      if (!cancelled) setError("Could not load bookings. Check that you are signed in and the API is reachable.");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    const stopRefresh = onSilentRefresh(() => {
      api.get("/dashboard/bookings", { params: { range } }).then((res) => {
        if (!cancelled) setBookings((prev) => keepIfSame(prev, res.data.bookings));
      }).catch(() => {
      });
    });
    return () => {
      cancelled = true;
      stopRefresh();
    };
  }, [range]);
  const channels = useMemo(() => {
    const counts = /* @__PURE__ */ new Map();
    for (const b of bookings) {
      const c = channelOf(b.channel);
      counts.set(c, (counts.get(c) || 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [bookings]);
  return <>
      <DashboardLoader isVisible={initialLoading} message="Loading bookings…" />
      {!initialLoading && <Card>
          <CardHeader
    title="Bookings"
    subtitle="Calls booked on the itsjena and intl forms"
    action={channels.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 6 }}>
                {channels.map(([c, n]) => <Pill key={c}>{channelLabel(c)} {n}</Pill>)}
              </div>}
  />
          {error && <p style={{ fontSize: 12, color: "var(--admin-danger)", margin: "0 0 12px" }}>{error}</p>}
          {bookings.length === 0 ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 120, borderRadius: 14, background: "var(--admin-bg-soft)", border: "1px dashed var(--admin-border-strong)" }}>
              <p style={{ fontSize: 12, color: "var(--admin-text-sub)", margin: 0 }}>No bookings in this period.</p>
            </div> : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {bookings.map((b) => <BookingRow key={b._id} b={b} />)}
            </div>}
        </Card>}
    </>;
}
export {
  BookingsTab
};
