// "Wallet" card used in the sidebar of Case Study and Blog details: two cards that expand on click.
import { useState } from "react";
import { FONTS, TYPOGRAPHY, FONT_WEIGHTS } from "@/constant/styles";

const RICH = "[&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-current [&_blockquote]:pl-4 [&_blockquote]:mb-4 [&_blockquote]:italic [&_h3]:font-bold [&_h3]:text-[1.15em] [&_h3]:mt-4 [&_h3]:mb-2";
const T = {
  primary: "#a10000",
  primaryDark: "#7a0000",
  primaryDeep: "#5c0000",
  white: "#ffffff",
  whiteAlpha40: "rgba(255,255,255,0.40)",
  whiteAlpha30: "rgba(255,255,255,0.30)",
  whiteAlpha75: "rgba(255,255,255,0.75)",
  whiteAlpha10: "rgba(255,255,255,0.10)",
  pinkLight: "#ffc5c5",
  pinkMid: "#e88888",
  borderLight: "#e4e4e7",
  textDark: "#282828",
  textMuted: "rgba(0,0,0,0.35)",
  textBody: "rgba(0,0,0,0.60)",
  textHint: "rgba(0,0,0,0.30)"
};

/** a / b: { label, kicker, preview, html, footer? } — b.footer shows on the expanded second card. */
export default function InsightWallet({ a, b, pocketText, mounted = true }) {
  const [folderState, setFolderState] = useState("wallet");
  return <>
            <div
    className="mb-12"
    style={{
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s"
    }}
  >
              {
    /* ══ WALLET STATE ══ */
  }
              {folderState === "wallet" && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "48px", paddingTop: "16px" }}>
                  <div className="cs-wallet">
                    <div className="cs-wallet-back" />

                    {
    /* Challenge card — maroon, sits behind */
  }
                    <div
    className="cs-card cs-challenge"
    onClick={() => setFolderState("challenge")}
    title={`Click to view ${a.label}`}
  >
                      <div className="cs-card-inner">
                        <div className="cs-card-top">
                          <span className="cs-card-label">{a.label}</span>
                          <div className="cs-chip" />
                        </div>
                        <div className="cs-card-bottom">
                          <span className="cs-meta-label">{a.kicker}</span>
                          <span className="cs-meta-value">{a.preview}…</span>
                        </div>
                      </div>
                    </div>

                    {
    /* Solution card — white, sits on top */
  }
                    <div
    className="cs-card cs-solution"
    onClick={() => setFolderState("solution")}
    title={`Click to view ${b.label}`}
  >
                      <div className="cs-card-inner">
                        <div className="cs-card-top">
                          <span className="cs-card-label" style={{ color: T.primary }}>{b.label}</span>
                          <div className="cs-chip cs-chip-light" />
                        </div>
                        <div className="cs-card-bottom">
                          <span className="cs-meta-label" style={{ color: T.primaryDark }}>{b.kicker}</span>
                          <span className="cs-meta-value" style={{ color: T.primary }}>{b.preview}…</span>
                        </div>
                      </div>
                    </div>

                    {
    /* Pocket SVG */
  }
                    <div className="cs-pocket">
                      <svg viewBox="0 0 340 190" fill="none" style={{ width: "340px", height: "190px" }}>
                        <path
    d="M 0 24 C 0 12, 6 12, 12 12 C 24 12, 30 30, 48 30 L 292 30 C 310 30, 316 12, 328 12 C 334 12, 340 12, 340 24 L 340 145 C 340 188, 316 192, 292 192 L 48 192 C 24 192, 0 188, 0 145 Z"
    fill={T.primary}
  />
                        <path
    d="M 10 26 C 10 19, 14 19, 18 19 C 28 19, 33 35, 48 35 L 292 35 C 307 35, 312 19, 322 19 C 326 19, 330 19, 330 26 L 330 145 C 330 182, 314 184, 292 184 L 48 184 C 30 184, 10 184, 10 145 Z"
    stroke={T.primaryDark}
    strokeWidth="1.5"
    strokeDasharray="7 5"
  />
                      </svg>
                      <div className="cs-pocket-content">
                        <div style={{ position: "relative", height: "32px", width: "100%" }}>
                          <div className="cs-balance-stars">••••••</div>
                          <div className="cs-balance-real">{pocketText}</div>
                        </div>
                        <div style={{ color: T.pinkMid, fontSize: "13px", fontWeight: 500, fontFamily: FONTS.openSans }}>
                          Industry Intelligence · 2026
                        </div>
                        <div className="cs-eye-wrapper">
                          <svg className="cs-eye cs-eye-slash" width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                            <line x1="3" y1="3" x2="21" y2="21" />
                          </svg>
                          <svg className="cs-eye cs-eye-open" width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {
    /* Pocket overlay */
  }
                    <div className="cs-expand-trigger" onClick={() => setFolderState("both")} />
                  </div>
                </div>}

              {
    /* ══ CHALLENGE SOLO — maroon, click to return to wallet ══ */
  }
              {folderState === "challenge" && <div style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>
                  <div
    style={{
      backgroundColor: T.primaryDark,
      borderRadius: "20px",
      padding: "24px",
      position: "relative",
      zIndex: 2,
      boxShadow: `0 8px 40px rgba(122,0,0,0.40)`,
      transition: "transform 0.3s ease",
      cursor: "pointer"
    }}
    onClick={() => setFolderState("wallet")}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: T.whiteAlpha40 }}>{a.kicker}</span>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: T.pinkLight, display: "inline-block" }} />
                    </div>
                    <h3 style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, fontSize: "22px", color: T.white, marginBottom: "6px", letterSpacing: "-0.02em" }}>
                      {a.label}
                    </h3>
                    <div style={{ height: "2px", backgroundColor: T.pinkLight, width: "2rem", marginBottom: "16px" }} />
                    <div className={RICH} style={{ fontFamily: FONTS.rubik, fontSize: "14px", lineHeight: "1.85", color: T.whiteAlpha75, textAlign: "justify", margin: 0 }} dangerouslySetInnerHTML={{ __html: a.html }} />
                    <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: `1px solid ${T.whiteAlpha10}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: T.whiteAlpha30 }}>Industry Intelligence · 2026</span>
                      <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: T.pinkLight, fontWeight: FONT_WEIGHTS.medium, opacity: 0.6 }}>click to close</span>
                    </div>
                  </div>
                </div>}

              {
    /* ══ SOLUTION SOLO — white, click to return to wallet ══ */
  }
              {folderState === "solution" && <div style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>
                  <div
    style={{
      backgroundColor: T.white,
      border: `1px solid ${T.borderLight}`,
      borderRadius: "20px",
      padding: "24px",
      position: "relative",
      zIndex: 1,
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer"
    }}
    onClick={() => setFolderState("wallet")}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)";
    }}
  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: T.textMuted }}>{b.kicker}</span>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: T.primary, display: "inline-block" }} />
                    </div>
                    <h3 style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, fontSize: "22px", color: T.textDark, marginBottom: "6px", letterSpacing: "-0.02em" }}>
                      {b.label}
                    </h3>
                    <div style={{ height: "2px", backgroundColor: T.primary, width: "2rem", marginBottom: "16px" }} />
                    <div className={RICH} style={{ fontFamily: FONTS.rubik, fontSize: "14px", lineHeight: "1.85", color: T.textBody, textAlign: "justify", margin: 0 }} dangerouslySetInnerHTML={{ __html: b.html }} />
                    <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: `1px solid ${T.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: T.textHint }}>Industry Intelligence · 2026</span>
                      <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: T.primary, fontWeight: FONT_WEIGHTS.medium, opacity: 0.45 }}>click to close</span>
                    </div>
                  </div>
                </div>}

              {
    /* ══ BOTH CARDS ══ */
  }
              {folderState === "both" && <div style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>

                  {
    /* Challenge card — maroon, on top */
  }
                  <div
    style={{
      backgroundColor: T.primaryDark,
      borderRadius: "20px",
      padding: "24px",
      position: "relative",
      zIndex: 2,
      boxShadow: `0 8px 40px rgba(122,0,0,0.40)`,
      marginBottom: "0",
      transition: "transform 0.3s ease",
      cursor: "pointer"
    }}
    onClick={() => setFolderState("challenge")}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: T.whiteAlpha40 }}>{a.kicker}</span>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: T.pinkLight, display: "inline-block" }} />
                    </div>
                    <h3 style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, fontSize: "22px", color: T.white, marginBottom: "6px", letterSpacing: "-0.02em" }}>
                      {a.label}
                    </h3>
                    <div style={{ height: "2px", backgroundColor: T.pinkLight, width: "2rem", marginBottom: "16px" }} />
                    <div className={RICH} style={{ fontFamily: FONTS.rubik, fontSize: "14px", lineHeight: "1.85", color: T.whiteAlpha75, textAlign: "justify", margin: 0 }} dangerouslySetInnerHTML={{ __html: a.html }} />
                  </div>

                  {
    /* Solution card — white, slides under */
  }
                  <div
    style={{
      backgroundColor: T.white,
      border: `1px solid ${T.borderLight}`,
      borderRadius: "20px",
      padding: "24px",
      marginTop: "-16px",
      position: "relative",
      zIndex: 1,
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer"
    }}
    onClick={() => setFolderState("solution")}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(4px)";
      e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)";
    }}
  >
                    <div style={{ height: "20px" }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: T.textMuted }}>{b.kicker}</span>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: T.primary, display: "inline-block" }} />
                    </div>
                    <h3 style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, fontSize: "22px", color: T.textDark, marginBottom: "6px", letterSpacing: "-0.02em" }}>
                      {b.label}
                    </h3>
                    <div style={{ height: "2px", backgroundColor: T.primary, width: "2rem", marginBottom: "16px" }} />
                    <div className={RICH} style={{ fontFamily: FONTS.rubik, fontSize: "14px", lineHeight: "1.85", color: T.textBody, textAlign: "justify", margin: 0 }} dangerouslySetInnerHTML={{ __html: b.html }} />
                    <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: `1px solid ${T.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: T.textHint }}>Industry Intelligence · 2026</span>
                      <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: T.primary, fontWeight: FONT_WEIGHTS.medium }}>{b.footer}</span>
                    </div>
                  </div>

                </div>}
            </div>
    <style dangerouslySetInnerHTML={{ __html: `
        .cs-wallet {
          position: relative;
          width: 340px;
          height: 270px;
          cursor: pointer;
          perspective: 1200px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          transition: transform 0.4s ease;
        }
        .cs-wallet:hover { transform: translateY(-6px); }
        @keyframes slideIntoPocket {
          0%   { transform: translateY(-120px); opacity: 0; }
          100% { transform: translateY(0);      opacity: 1; }
        }
        .cs-wallet-back {
          position: absolute;
          bottom: 0;
          width: 340px;
          height: 235px;
          background: ${T.primaryDeep};
          border-radius: 26px 26px 72px 72px;
          z-index: 5;
          box-shadow: inset 0 28px 40px rgba(0,0,0,0.4), inset 0 6px 18px rgba(0,0,0,0.5);
        }
        .cs-card {
          position: absolute;
          width: 316px;
          height: 172px;
          left: 12px;
          border-radius: 18px;
          padding: 22px;
          color: ${T.white};
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.25), 0 -4px 18px rgba(0,0,0,0.12);
          transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1);
          animation: slideIntoPocket 0.8s cubic-bezier(0.2,0.8,0.2,1) backwards;
          cursor: pointer;
        }
        .cs-card-inner { display: flex; flex-direction: column; justify-content: space-between; height: 100%; }
        .cs-card-top   { display: flex; justify-content: space-between; align-items: center; }
        .cs-card-label { font-size: 12px; text-transform: uppercase; letter-spacing: 2.5px; font-weight: 600; }
        .cs-chip {
          width: 38px; height: 28px;
          background: rgba(255,255,255,0.20);
          border-radius: 5px;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .cs-chip-light { background: rgba(161,0,0,0.10); border-color: rgba(161,0,0,0.12); }
        .cs-card-bottom { display: flex; flex-direction: column; gap: 5px; }
        .cs-meta-label  { font-size: 9px; opacity: 0.65; text-transform: uppercase; letter-spacing: 1.2px; }
        .cs-meta-value  { font-size: 12px; font-weight: 600; letter-spacing: 0.3px; line-height: 1.4; }
        .cs-challenge { background: ${T.primaryDark}; bottom: 88px; z-index: 10; animation-delay: 0.1s; }
        .cs-solution  { background: ${T.white}; color: ${T.primary}; bottom: 56px; z-index: 20; animation-delay: 0.2s; }
        .cs-pocket {
          position: absolute; bottom: 0; width: 340px; height: 190px; z-index: 40;
          filter: drop-shadow(0 18px 28px rgba(161,0,0,0.40));
        }
        .cs-pocket-content {
          position: absolute; top: 52px; width: 100%; text-align: center;
          z-index: 50; display: flex; flex-direction: column; align-items: center; gap: 9px;
        }
        .cs-balance-stars {
          color: ${T.pinkMid}; font-size: 24px; letter-spacing: 5px; transition: 0.3s;
          position: absolute; left: 50%; transform: translateX(-50%);
        }
        .cs-balance-real {
          color: ${T.pinkLight}; font-size: 22px; font-weight: 600; opacity: 0;
          position: absolute; left: 50%; transform: translate(-50%, 10px);
          transition: 0.3s; white-space: nowrap;
        }
        .cs-eye-wrapper { margin-top: 9px; height: 22px; width: 22px; position: relative; opacity: 0.35; transition: 0.3s; }
        .cs-eye { position: absolute; top: 0; left: 0; stroke: ${T.pinkLight}; transition: 0.3s; }
        .cs-eye-open { opacity: 0; }
        .cs-expand-trigger { position: absolute; bottom: 0; left: 0; width: 100%; height: 190px; z-index: 30; cursor: pointer; }
        .cs-wallet:hover .cs-eye-wrapper       { opacity: 1; }
        .cs-wallet:hover .cs-challenge          { transform: translateY(-72px) rotate(-3deg); }
        .cs-wallet:hover .cs-solution           { transform: translateY(-12px); }
        .cs-card:hover                          { z-index: 100 !important; transition-delay: 0s !important; }
        .cs-wallet:hover .cs-challenge:hover    { transform: translateY(-66px) scale(1.05) rotate(0); }
        .cs-wallet:hover .cs-solution:hover     { transform: translateY(-66px) scale(1.05) rotate(0); }
        .cs-wallet:hover .cs-balance-stars      { opacity: 0; }
        .cs-wallet:hover .cs-balance-real       { opacity: 1; transform: translate(-50%, 0); }
        .cs-wallet:hover .cs-eye-slash          { opacity: 0; transform: scale(0.5); }
        .cs-wallet:hover .cs-eye-open           { opacity: 1; transform: scale(1.1); }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
    ` }} />
  </>;
}
