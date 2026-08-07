
import { useDashboardTheme } from "./useDashboardTheme";
function ActiveServicesCard({ activeServices, servicesLoading }) {
  const { card, subtleBg, borderColor, textPrimary, textMuted, isdarkmode } = useDashboardTheme();
  return <div style={{ ...card, padding: "22px 22px" }}>
      {
    /* Header */
  }
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <p
    style={{
      fontSize: 13,
      fontWeight: 600,
      color: textPrimary,
      margin: 0,
      fontFamily: "'Poppins', sans-serif"
    }}
  >
          Active Services
        </p>
        {!servicesLoading && <span
    style={{
      fontSize: 10,
      fontWeight: 600,
      color: "#059669",
      background: isdarkmode ? "rgba(5,150,105,0.12)" : "rgba(5,150,105,0.08)",
      border: "1px solid rgba(5,150,105,0.2)",
      borderRadius: 99,
      padding: "2px 10px",
      fontFamily: "'Poppins', sans-serif"
    }}
  >
            {activeServices.length} active
          </span>}
      </div>

      {
    /* Body */
  }
      {servicesLoading ? <SkeletonGrid subtleBg={subtleBg} borderColor={borderColor} /> : activeServices.length === 0 ? <EmptyState subtleBg={subtleBg} borderColor={borderColor} textMuted={textMuted} /> : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {activeServices.map((svc) => <ServiceRow key={svc._id} svc={svc} subtleBg={subtleBg} borderColor={borderColor} textPrimary={textPrimary} textMuted={textMuted} isdarkmode={isdarkmode} />)}
        </div>}
    </div>;
}
function SkeletonGrid({ subtleBg, borderColor }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {[0, 1, 2, 3].map((i) => <div
    key={i}
    style={{
      padding: "16px 14px",
      borderRadius: 14,
      background: subtleBg,
      border: `1px solid ${borderColor}`,
      height: 72,
      animation: "pulse 1.5s ease-in-out infinite"
    }}
  />)}
    </div>;
}
function EmptyState({ subtleBg, borderColor, textMuted }) {
  return <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 120,
      borderRadius: 14,
      background: subtleBg,
      border: `1px dashed ${borderColor}`
    }}
  >
      <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
        No active services found
      </p>
    </div>;
}
function ServiceRow({ svc, subtleBg, borderColor, textPrimary, textMuted, isdarkmode }) {
  return <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 12px",
      borderRadius: 12,
      background: subtleBg,
      border: `1px solid ${borderColor}`,
      fontFamily: "'Poppins', sans-serif"
    }}
  >
      {
    /* Cover photo or initial fallback */
  }
      <div
    style={{
      width: 36,
      height: 36,
      borderRadius: 10,
      overflow: "hidden",
      flexShrink: 0,
      background: "var(--admin-accent-soft)",
      border: "1px solid color-mix(in srgb, var(--admin-accent) 15%, transparent)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
        {svc.coverPhoto ? <img src={svc.coverPhoto} alt={svc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 13, fontWeight: 700, color: "var(--admin-accent)" }}>
            {svc.name.charAt(0)}
          </span>}
      </div>

      {
    /* Name + badge */
  }
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
    style={{
      fontSize: 11,
      fontWeight: 600,
      color: textPrimary,
      margin: 0,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontFamily: "'Poppins', sans-serif"
    }}
  >
          {svc.name}
        </p>
        <p
    style={{
      fontSize: 9,
      color: textMuted,
      margin: "2px 0 0",
      fontWeight: 400,
      fontFamily: "'Poppins', sans-serif"
    }}
  >
          {svc.badge}
        </p>
      </div>

      {
    /* Active pill */
  }
      <span
    style={{
      fontSize: 8,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      color: "#059669",
      background: isdarkmode ? "rgba(5,150,105,0.12)" : "rgba(5,150,105,0.08)",
      border: "1px solid rgba(5,150,105,0.2)",
      borderRadius: 99,
      padding: "2px 8px",
      flexShrink: 0,
      fontFamily: "'Poppins', sans-serif"
    }}
  >
        active
      </span>
    </div>;
}
export {
  ActiveServicesCard as default
};
