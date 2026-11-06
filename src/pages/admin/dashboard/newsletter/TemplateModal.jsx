import { useEffect, useMemo } from "react";
import NewsletterDesign from "@/components/NewsletterDesign";
import { TEMPLATES } from "@/lib/newsletter-default-template";

// "Choose a template": every template drawn as a small picture of the real design. Clicking one picks it and closes.
const W = 300; // preview width in px; the design is laid out at 1200px and shrunk to fit
const SCALE = W / 1200;
const SLOTS = { active: null, onPick() {} }; // makes empty photo slots show as boxes, as they will look once photos are added

export default function TemplateModal({ open, value, onPick, onClose }) {
  const designs = useMemo(() => TEMPLATES.map((t) => t.make()), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return <div role="dialog" aria-modal="true" aria-label="Choose a template" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 3000, background: "rgba(0,0,0,0.62)", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(1100px, 100%)", maxHeight: "calc((100vh - 24px) / var(--admin-zoom, 1))", display: "flex", flexDirection: "column", background: "var(--admin-bg)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--admin-shadow-lg)" }}>
        <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid var(--admin-border)", background: "var(--admin-surface)" }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 16, color: "var(--admin-text)" }}>Choose a template</h2>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--admin-text-sub)" }}>The AI will put your content into the one you pick. Wording here is only a sample.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ minWidth: 48, minHeight: 36, border: "1px solid var(--admin-border)", borderRadius: 8, background: "var(--admin-surface)", color: "var(--admin-text)", cursor: "pointer", fontSize: 18 }}>&times;</button>
        </header>
        <div style={{ overflowY: "auto", padding: 18, display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${W + 24}px, 1fr))`, gap: 16, justifyItems: "center" }}>
          {TEMPLATES.map((t, i) => {
            const on = t.id === value;
            return <button key={t.id} type="button" aria-pressed={on} onClick={() => { onPick(t.id); onClose(); }} style={{ width: W + 24, padding: 12, display: "grid", gap: 10, textAlign: "left", cursor: "pointer", fontFamily: "inherit", borderRadius: 10, background: "var(--admin-surface)", border: `2px solid ${on ? "var(--admin-accent)" : "var(--admin-border)"}` }}>
                <div aria-hidden="true" style={{ width: W, height: 340, overflow: "hidden", position: "relative", background: "#fff", borderRadius: 6, border: "1px solid var(--admin-border)" }}>
                  <div style={{ width: 1200, padding: "28px 44px", boxSizing: "border-box", transform: `scale(${SCALE})`, transformOrigin: "top left", pointerEvents: "none" }}>
                    <NewsletterDesign design={designs[i]} edit={SLOTS} />
                  </div>
                </div>
                <div>
                  <strong style={{ fontSize: 14, color: "var(--admin-text)" }}>{t.name}{on && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: "var(--admin-accent-text)", background: "var(--admin-accent-soft)", borderRadius: 6, padding: "2px 8px" }}>Selected</span>}</strong>
                  <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.5, color: "var(--admin-text-sub)" }}>{t.desc}</p>
                </div>
              </button>;
          })}
        </div>
      </div>
    </div>;
}
