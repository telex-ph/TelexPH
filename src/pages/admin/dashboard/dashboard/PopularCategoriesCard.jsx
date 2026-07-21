
import { useDashboardTheme } from "./useDashboardTheme";
function PopularCategoriesCard() {
  const { card, textPrimary, textMuted, isdarkmode } = useDashboardTheme();
  const categories = [];
  const hasData = categories.length > 0;
  return <div
    style={{
      ...card,
      padding: "22px 22px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}
  >
      <p
    style={{
      width: "100%",
      fontSize: 13,
      fontWeight: 600,
      color: textPrimary,
      margin: "0 0 4px",
      fontFamily: "'Poppins', sans-serif"
    }}
  >
        Top Services
      </p>
      <p
    style={{
      width: "100%",
      fontSize: 9,
      fontWeight: 400,
      color: textMuted,
      margin: "0 0 18px",
      fontFamily: "'Poppins', sans-serif"
    }}
  >
        By revenue
      </p>

      {
    /* Donut chart */
  }
      <div style={{ position: "relative", width: 160, height: 160, marginBottom: 20 }}>
        <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
          {
    /* Empty track */
  }
          <circle
    cx="18"
    cy="18"
    r="16"
    fill="none"
    stroke={isdarkmode ? "#2a2a2a" : "#f3f4f6"}
    strokeWidth="4"
  />
          {
    /* Render slices only when data exists */
  }
          {hasData && (() => {
    let offset = 0;
    return categories.map((cat, i) => {
      const slice = <circle
        key={i}
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke={cat.color}
        strokeWidth="4"
        strokeDasharray={`${cat.pct}, 100`}
        strokeDashoffset={-offset}
      />;
      offset += cat.pct;
      return slice;
    });
  })()}
        </svg>

        {
    /* Center label */
  }
        <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 2
    }}
  >
          {hasData ? <>
              <span style={{ fontSize: 22, fontWeight: 700, color: textPrimary, fontFamily: "'Poppins', sans-serif" }}>
                {categories.reduce((s, c) => s + c.pct, 0)}%
              </span>
              <span style={{ fontSize: 9, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: textMuted, fontFamily: "'Poppins', sans-serif" }}>
                Total
              </span>
            </> : <>
              <span style={{ fontSize: 9, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: textMuted, textAlign: "center", lineHeight: 1.5, fontFamily: "'Poppins', sans-serif" }}>
                No revenue
              </span>
              <span style={{ fontSize: 9, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: textMuted, textAlign: "center", lineHeight: 1.5, fontFamily: "'Poppins', sans-serif" }}>
                data yet
              </span>
            </>}
        </div>
      </div>

      {
    /* Empty state message */
  }
      {!hasData && <p
    style={{
      fontSize: 10,
      fontWeight: 400,
      color: textMuted,
      margin: 0,
      textAlign: "center",
      lineHeight: 1.6,
      fontFamily: "'Poppins', sans-serif"
    }}
  >
          No total revenue as of now.
          <br />
          <span style={{ fontSize: 9, opacity: 0.7 }}>
            Data will appear once services generate revenue.
          </span>
        </p>}

      {
    /* Legend — only shown when data exists */
  }
      {hasData && <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          {categories.map((cat, i) => <div
    key={i}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: 11,
      fontFamily: "'Poppins', sans-serif"
    }}
  >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                <span style={{ color: isdarkmode ? "#9ca3af" : "#6b7280", fontWeight: 400, fontFamily: "'Poppins', sans-serif" }}>
                  {cat.label}
                </span>
              </div>
              <span style={{ fontWeight: 600, color: textPrimary, fontFamily: "'Poppins', sans-serif" }}>
                {cat.pct}%
              </span>
            </div>)}
        </div>}
    </div>;
}
export {
  PopularCategoriesCard as default
};
