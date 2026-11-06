// Look shared by the newsletter list and its analytics tab. Colors are admin theme tokens only.
export const BORDER = "var(--admin-border)";
export const MUTED = "var(--admin-text-sub)";
export const TEXT = "var(--admin-text)";
export const card = { background: "var(--admin-surface)", border: `1px solid ${BORDER}`, borderRadius: 16, boxShadow: "0 1px 6px rgba(0,0,0,.06)" };
export const inp = { padding: "8px 11px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "var(--admin-surface)", color: TEXT, fontSize: 11, outline: "none", boxSizing: "border-box" };
export const pill = (sel) => ({ padding: "3px 11px", borderRadius: 20, fontSize: 10, fontWeight: 500, cursor: "pointer", border: sel ? "1px solid color-mix(in srgb, var(--admin-accent) 30%, transparent)" : `1px solid ${BORDER}`, background: sel ? "color-mix(in srgb, var(--admin-accent) 9%, transparent)" : "transparent", color: sel ? "var(--admin-accent-text)" : MUTED });

export const mmss = (sec) => (sec >= 3600 ? `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m` : `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`);

export const Tile = ({ label, value, hint, delta }) => <div style={{ ...card, padding: "14px 16px", minWidth: 0 }}>
    <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED }}>{label}</p>
    <p style={{ margin: "6px 0 0", fontSize: 24, fontWeight: 700, color: TEXT, lineHeight: 1, display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>{value}{delta}</p>
    {hint && <p style={{ margin: "6px 0 0", fontSize: 10, color: MUTED }}>{hint}</p>}
  </div>;
