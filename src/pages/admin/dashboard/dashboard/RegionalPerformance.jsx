
import { useDashboardTheme } from "./useDashboardTheme";
function RegionalPerformance() {
  const { card, textPrimary, textMuted } = useDashboardTheme();
  return <div style={{ ...card, padding: "22px 22px", display: "flex", flexDirection: "column" }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: "0 0 18px", fontFamily: "'Poppins', sans-serif" }}>
        Pending Payments
      </p>

      {
    /* Centered empty state */
  }
      <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10
    }}
  >
        {
    /* Checkmark icon */
  }
        <div
    style={{
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "rgba(5,150,105,0.1)",
      border: "1px solid rgba(5,150,105,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }}
  >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 9.5L7.5 13L14 6" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p style={{ fontSize: 12, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
          All clear!
        </p>
        <p style={{ fontSize: 10, fontWeight: 400, color: textMuted, margin: 0, textAlign: "center", lineHeight: 1.5, fontFamily: "'Poppins', sans-serif" }}>
          No pending payments at the moment.
        </p>
      </div>
    </div>;
}
export {
  RegionalPerformance as default
};
