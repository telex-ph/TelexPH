
import { useDashboardTheme } from "./useDashboardTheme";
function StatTiles({ quickStats, activeServicesCount, quickStatsLoading }) {
  const { textMuted, isdarkmode } = useDashboardTheme();
  const stats = [
    {
      label: "total views",
      value: quickStats.totalViews.toLocaleString(),
      subValue: `${quickStats.totalUniqueViews.toLocaleString()} Unique`,
      accentColor: "var(--admin-accent)",
      accentBg: "var(--admin-accent-soft)",
      accentBorder: "var(--admin-accent-soft)"
    },
    {
      label: "appointments",
      value: quickStats.totalAppointments.toLocaleString(),
      subValue: "All time",
      accentColor: "#3b82f6",
      accentBg: isdarkmode ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.05)",
      accentBorder: isdarkmode ? "rgba(59,130,246,0.3)" : "rgba(59,130,246,0.15)"
    },
    {
      label: "active services",
      value: activeServicesCount.toLocaleString(),
      subValue: "Currently live",
      accentColor: "#059669",
      accentBg: isdarkmode ? "rgba(5,150,105,0.12)" : "rgba(5,150,105,0.05)",
      accentBorder: isdarkmode ? "rgba(5,150,105,0.3)" : "rgba(5,150,105,0.15)"
    },
    {
      label: "clients",
      value: quickStats.totalClients.toLocaleString(),
      subValue: "Registered",
      accentColor: "#f97316",
      accentBg: isdarkmode ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.05)",
      accentBorder: isdarkmode ? "rgba(249,115,22,0.3)" : "rgba(249,115,22,0.15)"
    },
    {
      label: "content",
      value: (quickStats.totalBlogs + quickStats.totalCaseStudies).toLocaleString(),
      subValue: `${quickStats.totalBlogs} blogs \xB7 ${quickStats.totalCaseStudies} case studies`,
      accentColor: "#dc2626",
      accentBg: isdarkmode ? "rgba(220,38,38,0.12)" : "rgba(220,38,38,0.05)",
      accentBorder: isdarkmode ? "rgba(220,38,38,0.3)" : "rgba(220,38,38,0.15)"
    }
  ];
  return <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: 12,
      marginBottom: 20
    }}
  >
      {stats.map((s, i) => <div
    key={i}
    style={{
      padding: "18px 16px",
      borderRadius: 20,
      background: s.accentBg,
      border: `1px solid ${s.accentBorder}`,
      fontFamily: "'Poppins', sans-serif"
    }}
  >
          <p
    style={{
      fontSize: 9,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: textMuted,
      margin: "0 0 10px",
      fontFamily: "'Poppins', sans-serif"
    }}
  >
            {s.label}
          </p>

          {quickStatsLoading ? <div
    style={{
      height: 32,
      borderRadius: 8,
      background: "var(--admin-border)",
      animation: "pulse 1.5s ease-in-out infinite"
    }}
  /> : <>
              <p
    style={{
      fontSize: 28,
      fontWeight: 700,
      color: s.accentColor,
      margin: 0,
      lineHeight: 1,
      fontFamily: "'Poppins', sans-serif"
    }}
  >
                {s.value}
              </p>
              {s.subValue && <p
    style={{
      fontSize: 10,
      color: textMuted,
      margin: "6px 0 0",
      fontWeight: 400,
      fontFamily: "'Poppins', sans-serif"
    }}
  >
                  {s.subValue}
                </p>}
            </>}
        </div>)}
    </div>;
}
export {
  StatTiles as default
};
