import { useEffect, useMemo, useState } from "react";
import DashboardLoader, { useInitialLoad } from "@/components/DashboardLoader";
import api from "@/lib/api/axios";
import { Card, CardHeader, EmptyRow, TblHead } from "./WebsitePageViews";
const CHANNEL_LABELS = {
  facebook: "Facebook",
  linkedin: "LinkedIn",
  email: "Email",
  instagram: "Instagram",
  search: "Search",
  chatgpt: "ChatGPT",
  "telexph-website": "telexph.com",
  direct: "Direct",
  other: "Other",
  unknown: "Unknown"
};
const channelLabel = (c) => CHANNEL_LABELS[c] ?? c;
const cell = { padding: "12px", fontSize: 12, color: "var(--admin-text)", verticalAlign: "top" };
const sub = { fontSize: 11, color: "var(--admin-text-sub)", marginTop: 2 };
const when = (date, timeZone) => new Date(date).toLocaleString("en-US", { timeZone, month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const bookedDay = (date) => new Date(date).toLocaleDateString("en-US", { timeZone: "Asia/Manila", month: "short", day: "numeric", year: "numeric" });
function BookingRow({ b }) {
  return <tr style={{ borderBottom: "1px solid var(--admin-bg-soft)" }}>
      <td style={{ ...cell, whiteSpace: "nowrap" }}>{bookedDay(b.bookedAt)}</td>
      <td style={cell}>{b.site}</td>
      <td style={cell}>
        <div style={{ fontWeight: 600 }}>{b.name}</div>
        <div style={sub}><a href={`mailto:${b.email}`} style={{ color: "var(--admin-accent-text)" }}>{b.email}</a></div>
        {(b.company || b.phone) && <div style={sub}>{b.company || b.phone}</div>}
      </td>
      <td style={{ ...cell, whiteSpace: "nowrap" }}>
        {b.startAt ? <>
            {b.timezone && <div>{when(b.startAt, b.timezone)} <span style={sub}>client</span></div>}
            <div style={b.timezone ? sub : void 0}>{when(b.startAt, "Asia/Manila")} PH</div>
          </> : "—"}
      </td>
      <td style={cell}>
        <div style={{ fontWeight: 600 }}>{channelLabel(b.channel)}</div>
        {b.lastChannel !== b.channel && <div style={sub}>last: {channelLabel(b.lastChannel)}</div>}
        {(b.utmCampaign || b.utmContent) && <div style={sub}>{[b.utmCampaign, b.utmContent].filter(Boolean).join(" / ")}</div>}
      </td>
      <td style={cell}>{b.purpose || (b.agentsNeeded ? `${b.agentsNeeded} agents` : "—")}</td>
    </tr>;
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
    return () => {
      cancelled = true;
    };
  }, [range]);
  const channels = useMemo(() => {
    const counts = /* @__PURE__ */ new Map();
    for (const b of bookings) counts.set(b.channel, (counts.get(b.channel) || 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [bookings]);
  return <>
      <DashboardLoader isVisible={initialLoading} message="Loading bookings…" />
      {!initialLoading && <Card>
          <CardHeader
    title="Bookings"
    subtitle="Calls booked on the itsjena and intl forms"
    action={channels.length > 0 && <span style={{ fontSize: 12, color: "var(--admin-text-sub)" }}>
                {channels.map(([c, n]) => `${channelLabel(c)} ${n}`).join(" · ")}
              </span>}
  />
          {error && <p style={{ fontSize: 12, color: "var(--admin-danger)", margin: "0 0 12px" }}>{error}</p>}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <TblHead cols={[{ label: "Booked" }, { label: "Site" }, { label: "Who" }, { label: "Call" }, { label: "From" }, { label: "Details" }]} />
              <tbody>
                {bookings.length === 0 && <EmptyRow colSpan={6} message="No bookings in this period." />}
                {bookings.map((b) => <BookingRow key={b._id} b={b} />)}
              </tbody>
            </table>
          </div>
        </Card>}
    </>;
}
export {
  BookingsTab
};
