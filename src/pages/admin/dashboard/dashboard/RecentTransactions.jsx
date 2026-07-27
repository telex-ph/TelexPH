
import { useState, useEffect } from "react";
import { useDashboardTheme } from "./useDashboardTheme";

const API_BASE =
  import.meta.env.VITE_API_ORIGIN || "https://telexph-admin.onrender.com";
function formatAppointmentDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function formatAppointmentTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
function getInitials(name) {
  if (!name) return "?";
  return name.trim().split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase() ?? "").join("");
}
const STATUS_COLORS = {
  confirmed: "#059669",
  showed: "#3b82f6",
  noshow: "#f97316",
  cancelled: "#dc2626",
  invalid: "#6b7280"
};
function RecentTransactions() {
  const { card, subtleBg, borderColor, textPrimary, textMuted, isdarkmode } = useDashboardTheme();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken") || localStorage.getItem("token") || "";
        const res = await fetch(`${API_BASE}/api/appointments/upcoming`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          credentials: "include"
        });
        if (!res.ok) throw new Error(`Failed to fetch upcoming appointments: ${res.status}`);
        setAppointments(await res.json());
      } catch (err) {
        console.error("Failed to fetch upcoming appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);
  return <div style={{ ...card, padding: "22px 22px" }}>
      {
    /* Header */
  }
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
          Upcoming Appointments
        </p>
        {!loading && appointments.length > 0 && <span
    style={{
      fontSize: 9,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      color: "#800000",
      fontFamily: "'Poppins', sans-serif"
    }}
  >
            Next {appointments.length}
          </span>}
      </div>

      {
    /* Body */
  }
      {loading ? (
    // Skeleton rows
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[0, 1, 2, 3, 4].map((i) => <div
      key={i}
      style={{
        height: 52,
        borderRadius: 12,
        background: subtleBg,
        border: `1px solid ${borderColor}`,
        animation: "pulse 1.5s ease-in-out infinite"
      }}
    />)}
        </div>
  ) : appointments.length === 0 ? <div
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
            No upcoming appointments
          </p>
        </div> : <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {appointments.map((appt) => <div
    key={appt._id}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid transparent",
      transition: "background .15s, border-color .15s",
      cursor: "default",
      fontFamily: "'Poppins', sans-serif"
    }}
    onMouseEnter={(e) => {
      ;
      e.currentTarget.style.background = subtleBg;
      e.currentTarget.style.borderColor = borderColor;
    }}
    onMouseLeave={(e) => {
      ;
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.borderColor = "transparent";
    }}
  >
              {
    /* Avatar + name */
  }
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
    style={{
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: isdarkmode ? "rgba(255,255,255,0.08)" : "#f3f4f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 10,
      fontWeight: 700,
      color: "#800000",
      flexShrink: 0,
      fontFamily: "'Poppins', sans-serif"
    }}
  >
                  {getInitials(appt.name)}
                </div>
                <div>
                  <p
    style={{
      fontSize: 12,
      fontWeight: 500,
      color: isdarkmode ? "#d1d5db" : "#1f2937",
      margin: 0,
      fontFamily: "'Poppins', sans-serif"
    }}
  >
                    {appt.name || appt.email || "Unknown"}
                  </p>
                  <p
    style={{
      fontSize: 10,
      color: textMuted,
      margin: "2px 0 0",
      fontWeight: 400,
      fontFamily: "'Poppins', sans-serif"
    }}
  >
                    {appt.title || appt.calendarName || "Appointment"} · {formatAppointmentDate(appt.startTime)}
                  </p>
                </div>
              </div>

              {
    /* Time + status */
  }
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p
    style={{
      fontSize: 12,
      fontWeight: 600,
      color: textPrimary,
      margin: 0,
      fontFamily: "'Poppins', sans-serif"
    }}
  >
                  {formatAppointmentTime(appt.startTime)}
                </p>
                <p
    style={{
      fontSize: 9,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      color: STATUS_COLORS[appt.appointmentStatus] ?? "#6b7280",
      margin: "2px 0 0",
      fontFamily: "'Poppins', sans-serif"
    }}
  >
                  {appt.appointmentStatus}
                </p>
              </div>
            </div>)}
        </div>}
    </div>;
}
export {
  RecentTransactions as default
};
