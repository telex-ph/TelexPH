
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VA_LIST } from "../BrowseVAs/data";
import { TIME_SLOTS, MOCK_RECORDINGS, REC_STATUS_STYLE, getCalendarDays } from "./data";
function InterviewRecordingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vaId = searchParams.get("vaId");
  const va = vaId ? VA_LIST.find((v) => v.id === vaId) : null;
  const [view, setView] = useState("schedule");
  const calDays = getCalendarDays();
  const [selectedDay, setSelectedDay] = useState(calDays[1].date);
  const [selectedTime, setSelectedTime] = useState(null);
  const [booked, setBooked] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const confirmBooking = () => {
    if (selectedTime) setBooked(true);
  };
  return <div style={{ fontFamily: "'Poppins', sans-serif", padding: "24px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, color: "#666", fontWeight: 500, margin: "0 0 2px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Virtual Assistant</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: 0, letterSpacing: "-0.02em" }}>Interview Recording</h2>
        <p style={{ fontSize: 13, color: "#555", fontWeight: 400, margin: "3px 0 0" }}>
          {va ? <>Scheduling with <strong style={{ color: "#800000" }}>{va.name}</strong></> : "Schedule interviews and review past recordings."}
        </p>
      </div>

      {
    /* Tab switcher */
  }
      <div style={{ display: "inline-flex", background: "#f5f3f3", borderRadius: 10, padding: 4, gap: 2, marginBottom: 24, border: "1px solid #ece8e8" }}>
        {["schedule", "recordings"].map((v, idx) => <button
    key={v}
    onClick={() => setView(v)}
    style={{ border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 12, fontFamily: "'Poppins', sans-serif", fontWeight: 500, cursor: "pointer", background: view === v ? "#800000" : "transparent", color: view === v ? "#fff" : "#888", transition: "all 0.15s" }}
  >
            {idx === 0 ? "\u{1F4C5} Schedule Interview" : `\u{1F3A5} Recordings (${MOCK_RECORDINGS.length})`}
          </button>)}
      </div>

      {view === "schedule" && <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 460px", minWidth: 320 }}>
            {!va && <div style={{ background: "#fffbf0", border: "1px solid #f0d8a0", borderRadius: 12, padding: "12px 18px", marginBottom: 18, fontSize: 12.5, color: "#7a5c00" }}>
                No VA selected. <button onClick={() => router.push("/client/dashboard/BrowseVAs")} style={{ background: "none", border: "none", color: "#800000", fontWeight: 700, cursor: "pointer", padding: 0, textDecoration: "underline", fontFamily: "inherit", fontSize: "inherit" }}>Browse VAs</button> or pick one from your <button onClick={() => router.push("/client/dashboard/Shortlisted")} style={{ background: "none", border: "none", color: "#800000", fontWeight: 700, cursor: "pointer", padding: 0, textDecoration: "underline", fontFamily: "inherit", fontSize: "inherit" }}>shortlist</button> first.
              </div>}

            {booked && va ? <div style={{ background: "#fff", border: "1.5px solid #bbf0d0", borderRadius: 16, padding: "28px 26px", textAlign: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#f0fdf4", border: "1px solid #bbf0d0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#16a34a" }}>
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>Interview confirmed</div>
                <p style={{ fontSize: 13, color: "#666", margin: "0 0 4px" }}>with <strong>{va.name}</strong></p>
                <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
                  {new Date(selectedDay).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })} at {selectedTime}
                </p>
                <p style={{ fontSize: 11.5, color: "#aaa", margin: "14px 0 0" }}>A calendar invite has been sent to your email.</p>
              </div> : <>
                <div style={{ background: "#fff", border: "1.5px solid #e0dcdc", borderRadius: 14, padding: "20px 22px", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Pick a date</div>
                  <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                    {calDays.map((d) => <button
    key={d.date}
    onClick={() => setSelectedDay(d.date)}
    disabled={d.isWeekend}
    style={{
      flex: "0 0 52px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      padding: "10px 0",
      borderRadius: 10,
      cursor: d.isWeekend ? "not-allowed" : "pointer",
      background: selectedDay === d.date ? "#800000" : "#fff",
      border: `1.5px solid ${selectedDay === d.date ? "#800000" : "#e0dcdc"}`,
      opacity: d.isWeekend ? 0.4 : 1
    }}
  >
                        <span style={{ fontSize: 9, fontWeight: 600, color: selectedDay === d.date ? "rgba(255,255,255,0.8)" : "#888", textTransform: "uppercase" }}>{d.label}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: selectedDay === d.date ? "#fff" : "#1a1a2e" }}>{d.day}</span>
                      </button>)}
                  </div>
                </div>

                <div style={{ background: "#fff", border: "1.5px solid #e0dcdc", borderRadius: 14, padding: "20px 22px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Available times</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))", gap: 8 }}>
                    {TIME_SLOTS.map((slot) => <button
    key={slot.time}
    disabled={!slot.available}
    onClick={() => setSelectedTime(slot.time)}
    style={{
      padding: "10px 8px",
      borderRadius: 9,
      fontSize: 12,
      fontWeight: 600,
      cursor: slot.available ? "pointer" : "not-allowed",
      background: selectedTime === slot.time ? "#800000" : slot.available ? "#fff" : "#f5f3f3",
      color: selectedTime === slot.time ? "#fff" : slot.available ? "#333" : "#ccc",
      border: `1.5px solid ${selectedTime === slot.time ? "#800000" : "#e0dcdc"}`
    }}
  >
                        {slot.time}
                      </button>)}
                  </div>
                </div>
              </>}
          </div>

          {!booked && <div style={{ width: 284, flexShrink: 0 }}>
              <div style={{ background: "#fff", border: "1px solid #e0dcdc", borderRadius: 14, padding: "18px 20px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Summary</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                  {[
    { label: "VA", value: va?.name ?? "\u2014" },
    { label: "Type", value: "Discovery Call" },
    { label: "Duration", value: "30 minutes" },
    { label: "Format", value: "Google Meet / Zoom" },
    { label: "Date", value: selectedDay ? new Date(selectedDay).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "\u2014" },
    { label: "Time", value: selectedTime ?? "\u2014" }
  ].map((s) => <div key={s.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: "#aaa" }}>{s.label}</span>
                      <span style={{ color: "#1a1a2e", fontWeight: 600, textAlign: "right", maxWidth: 150 }}>{s.value}</span>
                    </div>)}
                </div>
                <button
    disabled={!selectedTime || !va}
    onClick={confirmBooking}
    style={{ width: "100%", padding: "11px 0", background: selectedTime && va ? "#800000" : "#f0edec", color: selectedTime && va ? "#fff" : "#ccc", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: "'Poppins', sans-serif", cursor: selectedTime && va ? "pointer" : "not-allowed" }}
  >
                  Confirm Interview
                </button>
                <div style={{ textAlign: "center", fontSize: 10, color: "#bbb", marginTop: 8 }}>A calendar invite will be sent to your email.</div>
              </div>
            </div>}
        </div>}

      {view === "recordings" && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MOCK_RECORDINGS.map((rec) => <RecordingRow key={rec.id} rec={rec} isPlaying={playingId === rec.id} onToggle={() => setPlayingId((p) => p === rec.id ? null : rec.id)} />)}
        </div>}
    </div>;
}
function RecordingRow({ rec, isPlaying, onToggle }) {
  const st = REC_STATUS_STYLE[rec.status];
  const playable = rec.status === "completed";
  return <div style={{ background: "#fff", border: "1.5px solid #e0dcdc", borderRadius: 14, overflow: "hidden" }}>
      <div
    onClick={() => playable && onToggle()}
    style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", cursor: playable ? "pointer" : "default" }}
  >
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#800000,#c05050)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {rec.vaAvatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{rec.title}</div>
          <div style={{ fontSize: 11.5, color: "#888", marginTop: 2 }}>{rec.vaName} · {rec.date} · {rec.duration}</div>
        </div>
        <span style={{ background: st.bg, color: st.color, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{st.label}</span>
        {playable && <div style={{ width: 34, height: 34, borderRadius: "50%", background: isPlaying ? "#800000" : "#fff5f5", border: "1px solid #f0c8c8", display: "flex", alignItems: "center", justifyContent: "center", color: isPlaying ? "#fff" : "#800000", flexShrink: 0 }}>
            {isPlaying ? <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg> : <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>}
          </div>}
      </div>
      {isPlaying && <div style={{ borderTop: "1px solid #f0eeee", background: "#0a0a0a", aspectRatio: "16/6", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
          Playing recording — {rec.title}
        </div>}
    </div>;
}
export {
  InterviewRecordingPage as default
};
