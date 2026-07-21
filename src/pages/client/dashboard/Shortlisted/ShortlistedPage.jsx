
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VA_LIST, AVAILABILITY_COLORS } from "../BrowseVAs/data";
import VAProfileModal from "../BrowseVAs/VAProfileModal";
const SHORTLIST_KEY = "telexph_shortlisted_va_ids";
function Stars({ rating }) {
  return <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => <svg key={i} width={11} height={11} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? "#f59e0b" : "#e5e7eb"} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>)}
    </span>;
}
function ShortlistCard({ va, onOpen, onRemove }) {
  const avail = AVAILABILITY_COLORS[va.availability];
  return <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f0edec", padding: 20, display: "flex", flexDirection: "column", gap: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", position: "relative" }}>
      <button
    onClick={(e) => {
      e.stopPropagation();
      onRemove();
    }}
    title="Remove from shortlist"
    style={{ position: "absolute", top: 16, right: 16, width: 30, height: 30, borderRadius: 9, background: "#fff5f5", border: "1.5px solid #f0c8c8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#800000" }}
  >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>
      </button>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#800000,#c05050)", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {va.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingRight: 30 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1a2e", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{va.name}</div>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 5 }}>{va.role}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Stars rating={va.rating} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#1a1a2e" }}>{va.rating}</span>
            <span style={{ fontSize: 10, color: "#aaa" }}>({va.reviews})</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 5, background: avail.bg, borderRadius: 20, padding: "3px 9px", width: "fit-content" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: avail.dot }} />
        <span style={{ fontSize: 10, fontWeight: 600, color: avail.color }}>{va.availability}</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {va.skills.slice(0, 4).map((s) => <span key={s} style={{ fontSize: 10, background: "#f5f3f3", color: "#555", borderRadius: 5, padding: "2px 7px", border: "1px solid #ece8e8" }}>{s}</span>)}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
    onClick={onOpen}
    style={{ flex: 1, padding: "10px 0", background: "#fff", color: "#800000", border: "1.5px solid #d5d0d0", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
  >
          View Profile
        </button>
        <button
    onClick={onOpen}
    disabled={va.availability === "On Leave"}
    style={{ flex: 1, padding: "10px 0", background: va.availability === "On Leave" ? "#f0edec" : "#800000", color: va.availability === "On Leave" ? "#bbb" : "#fff", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: va.availability === "On Leave" ? "not-allowed" : "pointer" }}
  >
          Schedule
        </button>
      </div>
    </div>;
}
function ShortlistedPage() {
  const router = useRouter();
  const [shortlisted, setShortlisted] = useState([]);
  const [activeVA, setActiveVA] = useState(null);
  const [toast, setToast] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SHORTLIST_KEY);
      if (saved) setShortlisted(JSON.parse(saved));
    } catch {
    }
    setLoaded(true);
  }, []);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };
  const removeFromShortlist = (vaId) => {
    setShortlisted((prev) => {
      const next = prev.filter((id) => id !== vaId);
      try {
        localStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
      } catch {
      }
      return next;
    });
    showToast("Removed from shortlist");
    setActiveVA(null);
  };
  const vas = VA_LIST.filter((v) => shortlisted.includes(v.id));
  return <div style={{ fontFamily: "'Poppins', sans-serif", padding: "24px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`}</style>

      {toast && <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#1a1a2e", color: "#fff", borderRadius: 12, padding: "12px 22px", fontSize: 13, fontWeight: 600, zIndex: 2e3, boxShadow: "0 8px 32px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          {toast}
        </div>}

      <div style={{ marginBottom: 22, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: 11, color: "#666", fontWeight: 500, margin: "0 0 2px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Virtual Assistant</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: 0, letterSpacing: "-0.02em" }}>Shortlisted</h2>
          <p style={{ fontSize: 13, color: "#555", fontWeight: 400, margin: "3px 0 0" }}>Your saved candidates, ready to schedule or hire.</p>
        </div>
        <button
    onClick={() => router.push("/client/dashboard/BrowseVAs")}
    style={{ background: "#800000", border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}
  >
          Browse more VAs <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>

      {!loaded ? null : vas.length === 0 ? <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", border: "1px dashed #e0dcdc", borderRadius: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#fff5f5", border: "1px solid #f0c8c8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#800000" }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>No VAs shortlisted yet</div>
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 20px" }}>Save candidates while browsing to compare them here later.</p>
          <button
    onClick={() => router.push("/client/dashboard/BrowseVAs")}
    style={{ background: "#800000", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}
  >
            Browse VAs →
          </button>
        </div> : <>
          <div style={{ fontSize: 11.5, color: "#aaa", marginBottom: 16 }}>
            <strong style={{ color: "#1a1a2e" }}>{vas.length}</strong> VA{vas.length !== 1 ? "s" : ""} shortlisted
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {vas.map((va) => <ShortlistCard key={va.id} va={va} onOpen={() => setActiveVA(va)} onRemove={() => removeFromShortlist(va.id)} />)}
          </div>
        </>}

      {activeVA && <VAProfileModal
    va={activeVA}
    isShortlisted={true}
    onClose={() => setActiveVA(null)}
    onToggleShortlist={() => removeFromShortlist(activeVA.id)}
    onSchedule={() => router.push(`/client/dashboard/InterviewRecording?vaId=${activeVA.id}`)}
    onHire={() => showToast(`Hire request flow for ${activeVA.name} coming soon`)}
  />}
    </div>;
}
export {
  ShortlistedPage as default
};
