
import { useState } from "react";
function RenewModal({ plan, onClose, onConfirm }) {
  return <div style={{ position: "fixed", inset: 0, background: "rgba(10,0,0,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e3, padding: 20 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 22, boxShadow: "0 40px 100px rgba(0,0,0,0.28)", width: "100%", maxWidth: 420, padding: 32 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fff0f0", border: "2px solid #f0c0c0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#800000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 8, letterSpacing: "-0.01em" }}>Renew Subscription</div>
          <div style={{ fontSize: 13, color: "#444", lineHeight: 1.6, fontWeight: 400 }}>You're about to renew <strong style={{ color: "#800000", fontWeight: 700 }}>{plan.tier}</strong>. Your billing cycle will restart.</div>
        </div>
        <div style={{ background: "#f8f6f6", border: "1px solid #e8e4e4", borderRadius: 12, padding: "16px 20px", marginBottom: 22 }}>
          {["Plan", "Price", "Billing"].map((k, i) => <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? "1px solid #eee" : "none" }}>
              <span style={{ fontSize: 12, color: "#666", fontWeight: 400 }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{[plan.tier, plan.priceLabel, plan.billing][i]}</span>
            </div>)}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: "0 0 110px", background: "#fff", color: "#555", border: "1.5px solid #d5d0d0", borderRadius: 12, padding: "12px", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "Poppins,sans-serif" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, background: "linear-gradient(135deg,#800000,#a02020)", color: "#fff", border: "none", borderRadius: 12, padding: "12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins,sans-serif" }}>↻ Confirm Renewal</button>
        </div>
      </div>
    </div>;
}
function PayModal({ plan, onClose, onConfirm }) {
  const [method, setMethod] = useState("card");
  const methods = [
    { id: "card", label: "Credit / Debit Card", icon: "M1 4h22v16H1zM1 10h22" },
    { id: "bank", label: "Bank Transfer", icon: "M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" },
    { id: "wallet", label: "E-Wallet", icon: "M21 12V7H5a2 2 0 0 1 0-4h14v4M21 12v5H5a2 2 0 0 0 0 4h14v-4" }
  ];
  return <div style={{ position: "fixed", inset: 0, background: "rgba(10,0,0,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e3, padding: 20 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 22, boxShadow: "0 40px 100px rgba(0,0,0,0.28)", width: "100%", maxWidth: 440, padding: 32 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.01em" }}>Make a Payment</div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 2, fontWeight: 400 }}>{plan.tier}</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#800000", letterSpacing: "-0.02em" }}>{plan.priceLabel}</div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Payment Method</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          {methods.map((m) => <div key={m.id} onClick={() => setMethod(m.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 15px", borderRadius: 11, border: `1.5px solid ${method === m.id ? "#800000" : "#ddd"}`, background: method === m.id ? "#fff5f5" : "#fff", cursor: "pointer" }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: method === m.id ? "#fff0f0" : "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={method === m.id ? "#800000" : "#666"} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={m.icon} /></svg>
              </div>
              <span style={{ fontSize: 13, color: method === m.id ? "#800000" : "#333", fontWeight: method === m.id ? 600 : 400 }}>{m.label}</span>
              <div style={{ marginLeft: "auto", width: 16, height: 16, borderRadius: "50%", border: `2px solid ${method === m.id ? "#800000" : "#bbb"}`, background: method === m.id ? "#800000" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {method === m.id && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
              </div>
            </div>)}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: "0 0 110px", background: "#fff", color: "#555", border: "1.5px solid #d5d0d0", borderRadius: 12, padding: "12px", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "Poppins,sans-serif" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, background: "linear-gradient(135deg,#800000,#a02020)", color: "#fff", border: "none", borderRadius: 12, padding: "12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins,sans-serif" }}>Pay {plan.priceLabel} →</button>
        </div>
      </div>
    </div>;
}
function EditModal({ plan, onClose, onSave }) {
  const [name, setName] = useState(plan.name);
  const [billing, setBilling] = useState(plan.billing);
  return <div style={{ position: "fixed", inset: 0, background: "rgba(10,0,0,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e3, padding: 20 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 22, boxShadow: "0 40px 100px rgba(0,0,0,0.28)", width: "100%", maxWidth: 420, padding: 32 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 4, letterSpacing: "-0.01em" }}>Edit Subscription</div>
        <div style={{ fontSize: 12, color: "#555", marginBottom: 24, fontWeight: 400 }}>{plan.tier}</div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Display Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", border: "1.5px solid #ddd", borderRadius: 10, padding: "11px 14px", fontSize: 13, color: "#1a1a2e", outline: "none", fontFamily: "Poppins,sans-serif", fontWeight: 400 }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Billing Cycle</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["Monthly", "Yearly"].map((b) => <button key={b} onClick={() => setBilling(b)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${billing === b ? "#800000" : "#ddd"}`, background: billing === b ? "#fff5f5" : "#fff", color: billing === b ? "#800000" : "#444", fontWeight: billing === b ? 700 : 400, fontSize: 13, cursor: "pointer", fontFamily: "Poppins,sans-serif" }}>{b}</button>)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: "0 0 110px", background: "#fff", color: "#555", border: "1.5px solid #d5d0d0", borderRadius: 12, padding: "12px", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "Poppins,sans-serif" }}>Cancel</button>
          <button onClick={() => onSave({ name, billing })} style={{ flex: 1, background: "linear-gradient(135deg,#800000,#a02020)", color: "#fff", border: "none", borderRadius: 12, padding: "12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins,sans-serif" }}>Save Changes</button>
        </div>
      </div>
    </div>;
}
function DotsMenu({ plan, onClose, onAction, triggerRect }) {
  const items = [
    { label: "View Details", icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6" },
    { label: "Download Invoice", icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" },
    { label: "Cancel Subscription", icon: "M18 6L6 18M6 6l12 12", danger: true }
  ];
  const top = triggerRect ? triggerRect.bottom + window.scrollY + 6 : 0;
  const left = triggerRect ? triggerRect.right + window.scrollX - 190 : 0;
  return <div style={{ position: "fixed", inset: 0, zIndex: 999 }} onClick={onClose}>
      <div style={{ position: "absolute", top, left, background: "#fff", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", border: "1px solid #e8e4e4", padding: 6, minWidth: 190 }} onClick={(e) => e.stopPropagation()}>
        {items.map((item) => <button key={item.label} onClick={() => {
    onAction(item.label);
    onClose();
  }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 9, border: "none", background: "transparent", cursor: "pointer", fontSize: 12, color: item.danger ? "#dc2626" : "#1a1a2e", fontFamily: "Poppins,sans-serif", textAlign: "left", fontWeight: 500 }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={item.danger ? "#dc2626" : "#555"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            {item.label}
          </button>)}
      </div>
    </div>;
}
export {
  DotsMenu,
  EditModal,
  PayModal,
  RenewModal
};
