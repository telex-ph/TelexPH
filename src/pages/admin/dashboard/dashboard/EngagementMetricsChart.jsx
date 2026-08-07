
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useDashboardTheme } from "./useDashboardTheme";
import MiniCalendarDropdown from "./MiniCalendarDropdown";
const TIME_FILTERS = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "6months", label: "6 Months" },
  { key: "custom", label: "Custom" }
];
function EngagementMetricsChart({
  engagementdata,
  resourceFilter,
  onResourceFilterChange,
  timeFilter,
  onTimeFilterChange,
  dailyPickedDate,
  onDailyPickedDateChange,
  weeklyPickedDate,
  onWeeklyPickedDateChange,
  customDateRange,
  onCustomDateRangeChange,
  isLoading
}) {
  const { card, cardBg, borderColor, textPrimary, textMuted, subtleBg, isdarkmode } = useDashboardTheme();
  const resourceSubtitleMap = {
    all: "Views and Likes from Blogs & Case Studies",
    blog: "Views and Likes from Blogs Only",
    casestudy: "Views and Likes from Case Studies Only"
  };
  const timeSubtitleMap = {
    daily: "Hourly breakdown",
    weekly: "7-day breakdown",
    monthly: "Last 30 days",
    "6months": "Last 6 months",
    custom: customDateRange.startDate && customDateRange.endDate ? `${customDateRange.startDate} \u2192 ${customDateRange.endDate}` : "Select a date range"
  };
  const pillGroup = {
    display: "flex",
    gap: 6,
    padding: 6,
    borderRadius: 12,
    background: subtleBg,
    border: `1px solid ${borderColor}`,
    flexWrap: "wrap"
  };
  const pillBtn = (active) => ({
    padding: "4px 14px",
    borderRadius: 8,
    border: "none",
    background: active ? "var(--admin-accent)" : "transparent",
    color: active ? "#fff" : textMuted,
    fontSize: 10,
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    transition: "all .15s",
    fontFamily: "'Poppins', sans-serif",
    whiteSpace: "nowrap"
  });
  return <div style={{ ...card, padding: "22px 22px", marginBottom: 20 }}>

      {
    /* ── Title + subtitle ────────────────────────────────────────────────── */
  }
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
          Engagement Metrics
        </p>
        <p style={{ fontSize: 10, color: textMuted, margin: "3px 0 0", fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>
          {resourceSubtitleMap[resourceFilter]} · {timeSubtitleMap[timeFilter]}
        </p>
      </div>

      {
    /* ── Controls row ────────────────────────────────────────────────────── */
  }
      <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 20,
      paddingBottom: 16,
      borderBottom: `1px solid ${borderColor}`
    }}
  >
        {
    /* Left: time period pills + optional date picker for daily / weekly */
  }
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={pillGroup}>
            {TIME_FILTERS.map(({ key, label }) => <button
    key={key}
    className="pill-btn-filter"
    onClick={() => onTimeFilterChange(key)}
    style={pillBtn(timeFilter === key)}
  >
                {label}
              </button>)}
          </div>

          {
    /* Daily: pick a specific day */
  }
          {timeFilter === "daily" && <MiniCalendarDropdown
    value={dailyPickedDate}
    onChange={onDailyPickedDateChange}
    mode="day"
    placeholder="Pick a day"
    maxDate={(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}
  />}

          {
    /* Weekly: pick a specific week */
  }
          {timeFilter === "weekly" && <MiniCalendarDropdown
    value={weeklyPickedDate}
    onChange={onWeeklyPickedDateChange}
    mode="week"
    placeholder="Pick a week"
    maxDate={(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}
  />}
        </div>

        {
    /* Right: resource type pills + legend */
  }
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={pillGroup}>
            {["all", "blog", "casestudy"].map((f) => <button
    key={f}
    className="pill-btn-filter"
    onClick={() => onResourceFilterChange(f)}
    style={pillBtn(resourceFilter === f)}
  >
                {f === "all" ? "All" : f === "blog" ? "Blogs" : "Case Studies"}
              </button>)}
          </div>

          {
    /* Legend */
  }
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {[
    { color: "var(--admin-accent)", label: "views" },
    { color: "#6b7280", label: "likes" }
  ].map((l) => <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: textMuted, fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>
                  {l.label}
                </span>
              </div>)}
          </div>
        </div>
      </div>

      {
    /* ── Custom date range row ────────────────────────────────────────────── */
  }
      {timeFilter === "custom" && <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      gap: 10,
      marginBottom: 20,
      padding: "12px 14px",
      borderRadius: 12,
      background: subtleBg,
      border: `1px solid ${borderColor}`,
      flexWrap: "wrap"
    }}
  >
          <MiniCalendarDropdown
    label="From"
    value={customDateRange.startDate}
    onChange={(d) => onCustomDateRangeChange({ ...customDateRange, startDate: d })}
    mode="day"
    placeholder="Start date"
    maxDate={customDateRange.endDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]}
  />

          <span style={{ fontSize: 12, color: textMuted, fontFamily: "'Poppins', sans-serif", paddingBottom: 6 }}>→</span>

          <MiniCalendarDropdown
    label="To"
    value={customDateRange.endDate}
    onChange={(d) => onCustomDateRangeChange({ ...customDateRange, endDate: d })}
    mode="day"
    placeholder="End date"
    minDate={customDateRange.startDate || void 0}
    maxDate={(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}
  />

          {
    /* Clear */
  }
          {(customDateRange.startDate || customDateRange.endDate) && <button
    onClick={() => onCustomDateRangeChange({ startDate: "", endDate: "" })}
    style={{
      fontSize: 9,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      color: "var(--admin-accent)",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "'Poppins', sans-serif",
      paddingBottom: 6,
      flexShrink: 0
    }}
  >
              Clear
            </button>}

          {isLoading && <span style={{ fontSize: 9, fontStyle: "italic", color: textMuted, fontFamily: "'Poppins', sans-serif", marginLeft: "auto", paddingBottom: 6 }}>
              fetching…
            </span>}
        </div>}

      {
    /* ── Chart ───────────────────────────────────────────────────────────── */
  }
      <div style={{ height: 280, width: "100%", position: "relative" }}>
        {isLoading && <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: 12,
      background: "var(--admin-bg-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
      backdropFilter: "blur(2px)"
    }}
  >
            <span style={{ fontSize: 11, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>Loading…</span>
          </div>}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={engagementdata}>
            <defs>
              <linearGradient id="colorviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--admin-accent)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="var(--admin-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={"var(--admin-bg-hover)"} />
            <XAxis
    dataKey="name"
    axisLine={false}
    tickLine={false}
    tick={{ fontSize: 10, fill: textMuted, fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
    dy={10}
  />
            <YAxis
    axisLine={false}
    tickLine={false}
    tick={{ fontSize: 10, fill: textMuted, fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
  />
            <Tooltip
    contentStyle={{
      borderRadius: 14,
      border: `1px solid ${borderColor}`,
      boxShadow: "0 4px 16px rgba(0,0,0,.10)",
      fontSize: 12,
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: cardBg,
      color: textPrimary
    }}
  />
            <Area type="monotone" dataKey="views" stroke="var(--admin-accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorviews)" />
            <Area type="monotone" dataKey="likes" stroke="#6b7280" strokeWidth={2} fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>;
}
export {
  EngagementMetricsChart as default
};
