"use client";

import React, { useState } from "react";
import { ChevronRight, ArrowUpRight } from "lucide-react";

const T = {
  primary:      "#a10000",
  primaryDark:  "#7a0000",
  white:        "#ffffff",
  offwhite:     "#f9f9f9",
  borderLight:  "#e4e4e7",
  textDark:     "#0a0a0a",
  textMuted:    "rgba(0,0,0,0.35)",
  textBody:     "rgba(0,0,0,0.60)",
  textHint:     "rgba(0,0,0,0.30)",
  whiteAlpha75: "rgba(255,255,255,0.75)",
  whiteAlpha40: "rgba(255,255,255,0.40)",
  whiteAlpha10: "rgba(255,255,255,0.10)",
  whiteAlpha08: "rgba(255,255,255,0.08)",
  pinkLight:    "#ffc5c5",
  pinkMid:      "#e88888",
};

const F = {
  heading: "'Open Sans', sans-serif",
  sans:    "'Open Sans', sans-serif",
  body:    "'Rubik', sans-serif",
  poppins: "var(--font-poppins), sans-serif",
};
const FW = { bold: 700, semibold: 600, medium: 500, normal: 400 };

const IMGS = {
  exterior:      "/images/usecase1.jpg",
  mainFloor:     "/images/usecase5.jpg",
  mainFloorWide: "/images/usecase2.jpg",
  techTeam:      "/images/usecase3.jpg",
  agents:        "/images/usecase5.jpg",
  dualMonitor:   "/images/usecase3.jpg",
  server:        "/images/usecase4.jpg",
  admin:         "/images/usecase2.jpg",
  studioDesk:    "/images/usecase1.jpg",
  studioGear:    "/images/usecase3.jpg",
  hallway:       "/images/usecase2.jpg",
  conference:    "/images/usecase5.jpg",
  meeting1:      "/images/usecase1.jpg",
  meeting2:      "/images/usecase3.jpg",
} as const;

type ImgKey = keyof typeof IMGS;

const challenges: {
  index: string;
  tag: string;
  title: string;
  sub: string;
  body: string;
  imgKey: ImgKey;
  stat: string;
  statLabel: string;
}[] = [
  {
    index:     "01",
    tag:       "Communication",
    title:     "Fragmented Channels",
    sub:       "The multi-touchpoint trap",
    body:      "Customer inquiries arrive through dozens of disconnected touchpoints — phone, email, live chat, and social — with no unified view. Agents spend more time context-switching than solving problems, leading to longer handle times, duplicate responses, and frustrated customers who feel unheard.",
    imgKey:    "agents",
    stat:      "3.2×",
    statLabel: "longer avg. handle time without a unified inbox",
  },
  {
    index:     "02",
    tag:       "Workforce",
    title:     "Agent Burnout & Attrition",
    sub:       "The invisible cost of repetition",
    body:      "Repetitive, high-volume interactions with no intelligent support layer leaves agents overwhelmed and disengaged. Without AI-assisted workflows or smart knowledge bases, burnout accelerates — driving turnover that costs thousands per replacement hire and erodes institutional knowledge.",
    imgKey:    "mainFloor",
    stat:      "40%",
    statLabel: "of contact center costs tied to agent turnover",
  },
  {
    index:     "03",
    tag:       "Quality",
    title:     "Inconsistent Service Quality",
    sub:       "The human variance problem",
    body:      "Without standardized processes and real-time supervisor oversight, service quality varies dramatically between agents, shifts, and regions. A single poor interaction can undo months of brand-building — and in an era of social media, that experience is rarely kept private.",
    imgKey:    "dualMonitor",
    stat:      "67%",
    statLabel: "of customers leave after just one bad experience",
  },
  {
    index:     "04",
    tag:       "Infrastructure",
    title:     "Escalating Operational Costs",
    sub:       "Scaling without efficiency",
    body:      "Scaling support to meet demand traditionally meant scaling headcount linearly. Without automation, intelligent routing, and self-service deflection, contact centers hemorrhage budget — especially during peak seasons — with no sustainable path to efficiency without compromising experience.",
    imgKey:    "server",
    stat:      "60%",
    statLabel: "of support costs reducible through smart automation",
  },
];

const UseCaseChallenges = () => {
  const [active, setActive] = useState<number>(0);
  const current = challenges[active];

  return (
    <section style={{ backgroundColor: T.offwhite, position: "relative", overflow: "hidden" }}>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 clamp(20px,5vw,64px)" }}>

        {/* SECTION HEADER */}
        <div style={{
          paddingTop: "72px", paddingBottom: "56px",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          flexWrap: "wrap", gap: "24px",
          borderBottom: `1px solid ${T.borderLight}`,
        }}>
          <div>
            <span style={{
              fontFamily: F.sans, fontWeight: FW.bold,
              fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.25em",
              color: T.primary, display: "block", marginBottom: "14px",
            }}>
              — Industry Challenges
            </span>
            <h2 style={{
              fontFamily: F.heading, fontWeight: FW.bold,
              fontSize: "30px",
              color: "#282828", letterSpacing: "-0.025em", lineHeight: 1.15, margin: 0,
            }}>
              The Obstacles We Solve Daily.
            </h2>
          </div>
          <p style={{
            fontFamily: F.body, fontWeight: FW.normal,
            fontSize: "16px", color: T.textBody,
            lineHeight: "1.85", maxWidth: "400px", margin: 0,
          }}>
            Modern customer service is riddled with structural pain points. We identify
            them with precision — and engineer solutions that transform friction into{" "}
            <strong style={{ fontWeight: FW.semibold, color: T.textDark }}>seamless experiences.</strong>
          </p>
        </div>

        {/* TAB NAV */}
        <div style={{
          display: "flex",
          borderBottom: `1px solid ${T.borderLight}`,
          overflowX: "auto",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
          className="no-scrollbar"
        >
          {challenges.map((c, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              fontFamily: F.sans,
              fontWeight: active === i ? FW.medium : FW.normal,
              fontSize: "14px",
              letterSpacing: "0.04em",
              color: active === i ? T.primary : T.textMuted,
              background: "none", border: "none",
              borderBottom: active === i ? `2px solid ${T.primary}` : "2px solid transparent",
              padding: "18px 24px", cursor: "pointer",
              transition: "color 0.2s, border-color 0.2s",
              whiteSpace: "nowrap", marginBottom: "-1px",
            }}>
              <span style={{
                fontFamily: F.sans, fontWeight: FW.medium,
                fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase",
                color: active === i ? T.primary : T.textHint,
                marginRight: "8px",
              }}>
                {c.index}
              </span>
              {c.tag}
            </button>
          ))}
        </div>

        {/* MAIN SPLIT LAYOUT */}
        <div key={active} style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          minHeight: "560px", animation: "challengeFadeIn 0.45s ease",
        }}>

          {/* Image panel */}
          <div style={{ position: "relative", overflow: "hidden", borderRight: `1px solid ${T.borderLight}` }}>
            <img
              src={IMGS[current.imgKey]}
              alt={current.tag}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center", display: "block",
                transition: "transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)" }} />

            <div style={{ position: "absolute", bottom: "32px", left: "32px", right: "32px" }}>
              <div style={{ display: "inline-block", backgroundColor: T.primary, padding: "4px 12px", borderRadius: "3px", marginBottom: "10px" }}>
                <span style={{ fontFamily: F.sans, fontWeight: FW.bold, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: T.white }}>
                  By the numbers
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "14px" }}>
                <span style={{ fontFamily: F.heading, fontWeight: FW.bold, fontSize: "clamp(2.6rem,5vw,3.8rem)", color: T.white, lineHeight: 1, letterSpacing: "-0.03em" }}>
                  {current.stat}
                </span>
                <span style={{ fontFamily: F.body, fontWeight: FW.normal, fontSize: "12px", color: T.whiteAlpha75, lineHeight: "1.5", maxWidth: "200px", paddingBottom: "6px" }}>
                  {current.statLabel}
                </span>
              </div>
            </div>

            <div style={{ position: "absolute", top: "20px", right: "20px", fontFamily: F.heading, fontWeight: FW.bold, fontSize: "88px", color: T.whiteAlpha08, lineHeight: 1, letterSpacing: "-0.05em", userSelect: "none" }}>
              {current.index}
            </div>
          </div>

          {/* Text panel */}
          <div style={{ padding: "56px clamp(28px,4vw,56px)", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: T.white }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <span style={{ fontFamily: F.sans, fontWeight: FW.medium, fontSize: "12px", color: T.primary }}>
                  {current.tag}
                </span>
                <span style={{ flex: 1, height: "1px", backgroundColor: "#f4f4f5" }} />
                <span style={{ fontFamily: F.sans, fontWeight: FW.medium, fontSize: "12px", color: T.textHint }}>
                  {current.index}
                </span>
              </div>

              <h3 style={{
                fontFamily: F.poppins, fontWeight: FW.bold,
                fontSize: "24px",
                color: "#282828", letterSpacing: "-0.025em",
                lineHeight: 1.2, marginBottom: "8px",
              }}>
                {current.title}
              </h3>

              <p style={{
                fontFamily: F.sans, fontWeight: FW.medium,
                fontSize: "10px", letterSpacing: "0.18em",
                textTransform: "uppercase", color: T.textMuted,
                marginBottom: "20px",
              }}>
                {current.sub}
              </p>

              <div style={{ height: "2px", width: "2rem", backgroundColor: T.primary, marginBottom: "24px" }} />

              <p style={{
                fontFamily: F.body, fontWeight: FW.normal,
                fontSize: "1rem", color: T.textBody,
                lineHeight: "1.85", textAlign: "justify",
              }}>
                {current.body}
              </p>
            </div>

            {/* Nav row */}
            <div style={{
              marginTop: "40px", paddingTop: "24px",
              borderTop: `1px solid ${T.borderLight}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {challenges.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)} style={{
                    width: active === i ? "28px" : "8px", height: "8px",
                    borderRadius: "9999px",
                    backgroundColor: active === i ? T.primary : T.borderLight,
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "width 0.3s ease, background-color 0.3s",
                  }} />
                ))}
              </div>

              <button
                onClick={() => setActive((p) => (p + 1) % challenges.length)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "12px 24px",
                  backgroundColor: T.primary, color: T.white,
                  border: "none", borderRadius: "0",
                  cursor: "pointer",
                  fontFamily: F.sans, fontWeight: FW.bold,
                  fontSize: "14px",
                  boxShadow: "0 4px 16px rgba(161,0,0,0.25)",
                  transition: "opacity 0.2s, transform 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                onMouseDown={(e)  => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.96)"; }}
                onMouseUp={(e)    => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              >
                Next Challenge <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* THUMBNAIL STRIP */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: `1px solid ${T.borderLight}` }}>
          {challenges.map((c, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              position: "relative", height: "140px", overflow: "hidden",
              border: "none", borderRight: i < 3 ? `1px solid ${T.borderLight}` : "none",
              cursor: "pointer", padding: 0, background: "none",
            }}>
              <img
                src={IMGS[c.imgKey]}
                alt={c.tag}
                style={{
                  width: "100%", height: "100%",
                  objectFit: "cover", objectPosition: "center",
                  transition: "transform 0.5s ease",
                  filter: active === i ? "none" : "grayscale(60%) brightness(0.72)",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: active === i
                  ? "linear-gradient(to top, rgba(161,0,0,0.55) 0%, transparent 60%)"
                  : "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
                transition: "background 0.3s",
              }} />
              {active === i && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: T.primary }} />
              )}
              <div style={{ position: "absolute", bottom: "14px", left: "14px", right: "14px", textAlign: "left" }}>
                <span style={{
                  display: "block", fontFamily: F.sans, fontWeight: FW.medium,
                  fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase",
                  color: active === i ? T.pinkLight : T.whiteAlpha40, marginBottom: "3px",
                }}>
                  {c.index}
                </span>
                <span style={{
                  fontFamily: F.sans, fontWeight: FW.medium,
                  fontSize: "14px", color: T.white, lineHeight: 1.3,
                }}>
                  {c.tag}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* FOOTER CTA */}
        <div style={{
          paddingTop: "48px", paddingBottom: "72px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "20px",
        }}>
          <p style={{
            fontFamily: F.body, fontWeight: FW.normal,
            fontSize: "16px", color: T.textBody,
            lineHeight: "1.85", maxWidth: "540px", margin: 0,
          }}>
            Every challenge above has a documented resolution. See how Telex Philippines
            has turned these obstacles into{" "}
            <strong style={{ fontWeight: FW.semibold, color: T.textDark }}>measurable outcomes</strong>
            {" "}for clients across industries.
          </p>

          <a href="/resources" style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "12px 24px",
            backgroundColor: T.primary, color: T.white,
            textDecoration: "none",
            fontFamily: F.sans, fontWeight: FW.bold,
            fontSize: "14px",
            borderRadius: "0",
            boxShadow: "0 4px 16px rgba(161,0,0,0.25)",
            transition: "opacity 0.2s", whiteSpace: "nowrap",
          }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
          >
            View Case Studies <ArrowUpRight size={14} />
          </a>
        </div>

      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }

        @keyframes challengeFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .challenges-split  { grid-template-columns: 1fr !important; }
          .challenges-thumbs { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
};

export default UseCaseChallenges;