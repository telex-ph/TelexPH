function Ico({ d, size = 16, sw = 1.2 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>;
}
const S = {
  overlay: { position: "fixed", inset: 0, background: "rgba(10,0,0,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e3, padding: 20 },
  modal: { background: "#fff", borderRadius: 22, boxShadow: "0 40px 100px rgba(0,0,0,0.28)", width: "100%", maxHeight: "90vh", overflowY: "auto" },
  closeBtn: { position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" },
  backBtn: { background: "#f0eeee", border: "none", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#555", flexShrink: 0 },
  primaryBtn: { width: "100%", background: "linear-gradient(135deg,#800000,#a02020)", color: "#fff", border: "none", borderRadius: 12, padding: "13px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins,sans-serif", letterSpacing: "0.01em" },
  secondaryBtn: { flex: "0 0 120px", background: "#fff", color: "#555", border: "1.5px solid #d5d0d0", borderRadius: 12, padding: "13px 20px", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "Poppins,sans-serif" },
  fieldLabel: { display: "block", fontSize: 11, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 },
  optionBtn: { background: "#fff", border: "1.5px solid #ddd", borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "#444", cursor: "pointer", fontFamily: "Poppins,sans-serif", transition: "all 0.15s", textAlign: "center" },
  optionActive: { background: "#fff5f5", border: "1.5px solid #800000", color: "#800000", fontWeight: 600 }
};
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  *,*::before,*::after{font-family:'Poppins',sans-serif;box-sizing:border-box;}

  .tab-btn{border:none;background:transparent;border-radius:8px;padding:7px 20px;font-size:12px;font-weight:500;color:#666;cursor:pointer;transition:all 0.18s;font-family:'Poppins',sans-serif;letter-spacing:0.01em;}
  .tab-btn.active{background:#fff;color:#800000;box-shadow:0 1px 4px rgba(0,0,0,0.1);font-weight:700;}

  .cat-tab{border:1px solid #d8d4d4;background:#fff;border-radius:8px;padding:7px 16px;font-size:12px;color:#555;cursor:pointer;transition:all 0.15s;font-family:'Poppins',sans-serif;font-weight:500;display:flex;align-items:center;gap:6px;letter-spacing:0.01em;}
  .cat-tab.active{background:#800000;border-color:#800000;color:#fff;font-weight:600;}
  .cat-tab:hover:not(.active){border-color:#b08080;color:#800000;}

  .price-card{border-radius:16px;padding:0;overflow:hidden;border:1px solid #e0dcdc;background:#fff;box-shadow:0 4px 16px rgba(0,0,0,0.07),0 1px 4px rgba(0,0,0,0.04);transition:all 0.25s cubic-bezier(0.25,0.46,0.45,0.94);position:relative;display:flex;flex-direction:column;}
  .price-card:hover{box-shadow:0 16px 48px rgba(128,0,0,0.15),0 4px 16px rgba(128,0,0,0.08);transform:translateY(-5px);border-color:#e8b8b8;}
  .price-card.featured{border-color:#800000;box-shadow:0 8px 32px rgba(128,0,0,0.22),0 2px 8px rgba(128,0,0,0.1);}
  .price-card.featured:hover{box-shadow:0 20px 56px rgba(128,0,0,0.3),0 6px 20px rgba(128,0,0,0.16);transform:translateY(-6px);}

  .gs-btn{width:100%;border:none;border-radius:10px;padding:11px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.18s;font-family:'Poppins',sans-serif;margin-top:4px;display:flex;align-items:center;justify-content:center;gap:6px;letter-spacing:0.01em;}
  .gs-plain{background:#800000;color:#fff;}.gs-plain:hover{background:#6a0000;box-shadow:0 4px 14px rgba(128,0,0,0.3);}
  .gs-featured{background:#fff;color:#800000;}.gs-featured:hover{background:#fff5f5;}

  .chip{border:1px solid #d8d4d4;background:#fff;border-radius:8px;padding:5px 14px;font-size:12px;color:#555;cursor:pointer;transition:all 0.15s;white-space:nowrap;font-weight:500;font-family:'Poppins',sans-serif;}
  .chip.on{background:#800000;border-color:#800000;color:#fff;font-weight:600;}
  .chip:hover:not(.on){border-color:#c09090;color:#800000;}

  .act-btn{border:1px solid #d8c8c8;color:#800000;background:#fff;border-radius:7px;padding:5px 14px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s;white-space:nowrap;font-family:'Poppins',sans-serif;}
  .act-btn:hover{background:#800000;color:#fff;border-color:#800000;}
  .act-btn.dim{color:#bbb;border-color:#eee;cursor:not-allowed;background:#fafafa;pointer-events:none;}
  .act-btn.ghost{color:#666;border-color:#d8d4d4;}.act-btn.ghost:hover{background:#f5f5f5;color:#333;border-color:#bbb;}

  .dots{background:#fff;border:1px solid #d8d4d4;border-radius:7px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#888;transition:all 0.15s;flex-shrink:0;}
  .dots:hover{border-color:#c09090;color:#800000;background:#fff8f8;}

  .s-table{width:100%;background:#fff;border:1.5px solid #e0dcdc;border-radius:14px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.04);}
  .s-thead{display:grid;grid-template-columns:2.5fr 1.4fr 1fr 1.4fr 180px;padding:0 20px;border-bottom:1px solid #e8e4e4;background:#f8f6f6;}
  .s-thead-cell{font-size:11px;color:#555;padding:12px 0;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;}
  .s-row{display:grid;grid-template-columns:2.5fr 1.4fr 1fr 1.4fr 180px;padding:14px 20px;align-items:center;border-bottom:1px solid #f5f2f2;cursor:pointer;transition:background 0.12s;}
  .s-row:hover{background:#fdfbfb;}
  .s-expand{border-top:1px solid #ede8e8;background:linear-gradient(180deg,#fffcfc 0%,#fff 100%);padding:16px 20px;animation:fadeSlide 0.2s ease;}
  @keyframes fadeSlide{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}

  .status-badge{display:inline-flex;align-items:center;gap:5px;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;}
  .perk-tag{display:inline-flex;align-items:center;gap:4px;background:#fff5f5;border:1px solid #f0d0d0;color:#800000;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:500;}
  .new-badge{background:#fff0f0;border:1px solid #f0c8c8;color:#800000;border-radius:5px;padding:2px 7px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-left:6px;}

  @media(max-width:768px){.s-thead{display:none;}.s-row{grid-template-columns:1fr 1fr;gap:6px;}.cards-grid{grid-template-columns:1fr!important;}}
`;
export {
  GLOBAL_CSS,
  Ico,
  S
};
