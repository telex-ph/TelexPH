// Overview widgets for the blog list, ported from the Case Study page so both pages share one design.
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const getCalendarDays = (month) => {
  const now = /* @__PURE__ */ new Date();
  const y = now.getFullYear();
  const firstDay = (new Date(y, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(y, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
};
export const StatTile = ({ label, count, gradient, gradientLight, accentColor, accentColorLight, iconPath, change, changeUp, dark }) => <div
  style={{
    background: dark ? gradient : gradientLight,
    padding: "18px 20px 18px 20px",
    borderRadius: 20,
    border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.7)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
    transition: "transform .2s, box-shadow .2s",
    boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.07)",
    minHeight: 130
  }}
>
    <svg
  viewBox="0 0 300 140"
  xmlns="http://www.w3.org/2000/svg"
  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
  preserveAspectRatio="none"
>
      <path d="M300,0 L300,140 C280,140 260,120 255,95 C250,70 265,45 260,20 C257,8 300,0 300,0 Z" fill={dark ? accentColor : accentColorLight} opacity="0.10" />
      <path d="M300,0 L300,140 C270,140 240,115 232,82 C224,50 242,22 235,5 C300,0 300,0 300,0 Z" fill={dark ? accentColor : accentColorLight} opacity="0.14" />
      <path d="M300,0 L300,140 C255,140 215,108 205,70 C195,32 218,8 208,0 Z" fill={dark ? accentColor : accentColorLight} opacity="0.18" />
      <path d="M300,0 L300,140 C238,140 190,100 178,58 C166,16 192,0 182,0 Z" fill={dark ? accentColor : accentColorLight} opacity="0.22" />
      <path d="M300,0 L300,140 C220,140 165,92 152,48 C142,14 165,0 155,0 Z" fill={dark ? accentColor : accentColorLight} opacity="0.28" />
    </svg>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, borderRadius: "0 0 20px 20px", background: dark ? `linear-gradient(to right, ${accentColor}ff, ${accentColor}33)` : `linear-gradient(to right, ${accentColorLight}cc, ${accentColorLight}11)` }} />
    <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", margin: 0, color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", fontFamily: "'Poppins', sans-serif" }}>{label}</p>
      <div style={{ width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.75)", backdropFilter: "blur(6px)", border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.9)", color: dark ? accentColor : accentColorLight, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={iconPath} /></svg>
      </div>
    </div>
    <p style={{ position: "relative", fontSize: 34, fontWeight: 700, margin: "0 0 14px", lineHeight: 1, color: dark ? "#ffffff" : "#111827", fontFamily: "'Poppins', sans-serif", letterSpacing: "-0.02em" }}>{count}</p>
    <div style={{ position: "relative", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: dark ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.65)", backdropFilter: "blur(4px)", border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.9)", color: changeUp ? dark ? "#34d399" : "#059669" : dark ? "#f87171" : "#dc2626", fontFamily: "'Poppins', sans-serif" }}>
        {changeUp ? "\u2191" : "\u2193"} {change.split(" ")[0]}
      </span>
      <span style={{ fontSize: 10, fontWeight: 400, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.38)", fontFamily: "'Poppins', sans-serif" }}>vs last month</span>
    </div>
  </div>;
export const MiniCalendar = ({ records, subtleBg, borderColor, textSecondary, textMuted, onDayClick, onOpenCalendar }) => {
  const now = /* @__PURE__ */ new Date();
  const m = now.getMonth(), y = now.getFullYear(), today = now.getDate();
  const cells = getCalendarDays(m);
  const dateStr = (d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  return <div style={{ padding: 14, borderRadius: 16, background: subtleBg, border: `1px solid ${borderColor}`, flex: 1, fontFamily: "'Poppins', sans-serif" }}>
      <p style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: textSecondary, margin: "0 0 12px", fontFamily: "'Poppins', sans-serif" }}>{MONTHS[m]} {y}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 6 }}>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {cells.map((d, i) => {
    if (!d) return <div key={i} />;
    const isToday = d === today;
    const ds = dateStr(d);
    const hasEv = records.some((r) => r.date === ds);
    return <div key={i} onClick={() => hasEv ? onDayClick(ds) : onOpenCalendar()} style={{ aspectRatio: "1", width: "100%", maxWidth: 40, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 10, borderRadius: 8, cursor: "pointer", fontWeight: isToday ? 700 : 400, background: isToday ? "var(--admin-accent)" : "transparent", color: isToday ? "#fff" : textMuted, fontFamily: "'Poppins', sans-serif", gap: 2 }}>
              {d}
              {hasEv && <div style={{ width: 4, height: 4, borderRadius: "50%", background: isToday ? "rgba(255,255,255,0.8)" : "#3b82f6" }} />}
            </div>;
  })}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${borderColor}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: "var(--admin-accent)" }} />
          <span style={{ fontSize: 10, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>Today</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }} />
          <span style={{ fontSize: 10, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>Has posts</span>
        </div>
      </div>
    </div>;
};

const Backdrop = ({ children }) => <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.48)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e3, padding: 20, fontFamily: "'Poppins', sans-serif" }}>
    {children}
  </div>;
const getStatusStyle = (s) => {
  switch (s?.toLowerCase()) {
    case "published":
      return { bg: "color-mix(in srgb, var(--admin-accent) 10%, transparent)", color: "var(--admin-accent)", border: "1px solid color-mix(in srgb, var(--admin-accent) 25%, transparent)" };
    case "scheduled":
      return { bg: "rgba(124,58,237,0.09)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.22)" };
    default:
      return { bg: "rgba(100,100,100,0.09)", color: "#6b7280", border: "1px solid rgba(100,100,100,0.22)" };
  }
};
export const CalendarModal = ({ isOpen, records, selectedMonthIndex, onClose, onMonthChange, onDateClick, cardBg, borderColor, textPrimary, textMuted, subtleBg }) => {
  if (!isOpen) return null;
  const now = /* @__PURE__ */ new Date();
  const y = now.getFullYear();
  const m = selectedMonthIndex;
  const today = now.getDate();
  const isCurrentMonth = m === now.getMonth();
  const cells = getCalendarDays(m);
  const dateStr = (d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const monthPrefix = `${y}-${String(m + 1).padStart(2, "0")}`;
  const monthEvents = records.filter((r) => r.date.startsWith(monthPrefix));
  return <Backdrop>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, maxWidth: 560, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.28)", overflow: "hidden", fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => onMonthChange(m === 0 ? 11 : m - 1)} style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${borderColor}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: textMuted }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: textPrimary, margin: 0, minWidth: 160, textAlign: "center", fontFamily: "'Poppins', sans-serif" }}>{MONTHS[m]} {y}</h3>
            <button onClick={() => onMonthChange(m === 11 ? 0 : m + 1)} style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${borderColor}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: textMuted }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: subtleBg, color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ padding: "18px 24px 26px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 8 }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: textMuted, fontFamily: "'Poppins', sans-serif" }}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
            {cells.map((d, i) => {
    if (!d) return <div key={i} />;
    const isToday = isCurrentMonth && d === today;
    const ds = dateStr(d);
    const evs = records.filter((r) => r.date === ds);
    return <div key={i} onClick={() => evs.length ? onDateClick(ds) : void 0} style={{ aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 10, cursor: evs.length ? "pointer" : "default", gap: 2, background: isToday ? "var(--admin-accent)" : subtleBg, border: isToday ? "none" : `1px solid transparent` }}>
                  <span style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? "#fff" : textMuted, fontFamily: "'Poppins', sans-serif" }}>{d}</span>
                  {evs.length > 0 && <div style={{ width: 4, height: 4, borderRadius: "50%", background: isToday ? "rgba(255,255,255,0.8)" : "#3b82f6", marginTop: 1 }} />}
                </div>;
  })}
          </div>
          {monthEvents.length > 0 && <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${borderColor}` }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: textMuted, margin: "0 0 10px", fontFamily: "'Poppins', sans-serif" }}>Posts this month</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {monthEvents.map((r) => {
    const st = getStatusStyle(r.status);
    return <div key={r._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 13px", borderRadius: 12, background: subtleBg, border: `1px solid ${borderColor}` }}>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: textPrimary, margin: "0 0 2px", fontFamily: "'Poppins', sans-serif" }}>{r.title}</p>
                        <p style={{ fontSize: 10, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{r.date} · {r.author}</p>
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 600, textTransform: "capitalize", padding: "3px 10px", borderRadius: 20, background: st.bg, color: st.color, border: st.border, whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{r.status}</span>
                    </div>;
  })}
              </div>
            </div>}
        </div>
      </div>
    </Backdrop>;
};
export const DateModal = ({ isOpen, dateStr, studies, onClose, onSelectPost, cardBg, borderColor, textPrimary, textMuted, subtleBg }) => {
  if (!isOpen) return null;
  return <Backdrop>
      <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 24, maxWidth: 460, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.28)", overflow: "hidden", fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Posts on {dateStr}</h3>
            <p style={{ fontSize: 11, color: textMuted, margin: "3px 0 0", fontFamily: "'Poppins', sans-serif" }}>{studies.length} {studies.length === 1 ? "post" : "posts"}</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: subtleBg, color: textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ padding: "16px 22px 22px", display: "flex", flexDirection: "column", gap: 9 }}>
          {studies.map((r) => {
    const st = getStatusStyle(r.status);
    return <div key={r._id} style={{ padding: "12px 14px", borderRadius: 14, border: `1px solid ${borderColor}`, background: subtleBg, cursor: "pointer" }} onClick={() => {
      onSelectPost(r);
      onClose();
    }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: textPrimary, margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{r.title}</p>
                    {r.description && <p style={{ fontSize: 11, color: textMuted, margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{r.description}</p>}
                    <p style={{ fontSize: 11, color: textMuted, margin: 0, fontFamily: "'Poppins', sans-serif" }}>By <strong style={{ color: textMuted, fontFamily: "'Poppins', sans-serif" }}>{r.author}</strong></p>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, textTransform: "capitalize", padding: "3px 10px", borderRadius: 20, background: st.bg, color: st.color, border: st.border, whiteSpace: "nowrap", flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>{r.status}</span>
                </div>
              </div>;
  })}
        </div>
      </div>
    </Backdrop>;
};
