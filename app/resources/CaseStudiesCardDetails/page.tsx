"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer/Footer";
import DetailsHeader from "../components/DetailsHeader";
import { FaFilePdf, FaChevronLeft } from "react-icons/fa";
import { COLORS, FONTS, TYPOGRAPHY, FONT_WEIGHTS, getColorWithOpacity } from "@/constant/styles";

// ─── Theme tokens ────────────────────────────────────────────────────────────
const T = {
  primary:      "#a10000",
  primaryDark:  "#7a0000",
  primaryDeep:  "#5c0000",
  white:        "#ffffff",
  whiteAlpha40: "rgba(255,255,255,0.40)",
  whiteAlpha30: "rgba(255,255,255,0.30)",
  whiteAlpha75: "rgba(255,255,255,0.75)",
  whiteAlpha10: "rgba(255,255,255,0.10)",
  pinkLight:    "#ffc5c5",
  pinkMid:      "#e88888",
  borderLight:  "#e4e4e7",
  textDark:     "#0a0a0a",
  textMuted:    "rgba(0,0,0,0.35)",
  textBody:     "rgba(0,0,0,0.60)",
  textHint:     "rgba(0,0,0,0.30)",
};
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://telexph-admin.onrender.com";

async function getCaseStudyById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/casestudies/${id}`);
    if (!response.ok) throw new Error("Failed to fetch case study");
    return response.json();
  } catch (error) {
    console.error("Error fetching case study:", error);
    return null;
  }
}

const FIRST_SECTION_EXTRA = `By centralizing all communication channels into a unified inbox, agents gained full visibility into every customer interaction regardless of where it originated. This eliminated duplicate responses, reduced average handling time, and allowed supervisors to monitor performance in real time. The platform's smart routing also ensured that inquiries were automatically assigned to the most appropriate team member based on topic and availability — keeping queues balanced and customers satisfied.`;

type SidebarState = "wallet" | "challenge" | "solution" | "both";

// ─── Loading Experience ───────────────────────────────────────────────────────
function LoadingExperience() {
  const [pct, setPct]         = useState(0);
  const [dots, setDots]       = useState("");
  const [phase, setPhase]     = useState(0);
  const [hgAngle, setHgAngle] = useState(0);
  const [flip, setFlip]       = useState(false);

  // Dots animation
  useEffect(() => {
    let count = 0;
    const t = setInterval(() => {
      count = (count + 1) % 4;
      setDots(".".repeat(count));
    }, 500);
    return () => clearInterval(t);
  }, []);

  // Percentage ticker
  useEffect(() => {
    let current = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (current < 99) {
        const jump =
          current < 30 ? Math.floor(Math.random() * 3) + 1
          : current < 70 ? Math.floor(Math.random() * 2) + 1
          : 1;
        current = Math.min(99, current + jump);
        setPct(current);
        setFlip(true);
        setTimeout(() => setFlip(false), 120);
      }
      const delay =
        current < 40 ? 120
        : current < 75 ? 200
        : current < 90 ? 350
        : 600;
      timeout = setTimeout(tick, delay);
    };
    timeout = setTimeout(tick, 300);
    return () => clearTimeout(timeout);
  }, []);

  // Hourglass sand phase
  useEffect(() => {
    let p = 0;
    let flp = false;
    let raf: number;
    const animate = () => {
      if (!flp) {
        p += 0.012;
        setPhase(Math.min(1, p));
        if (p >= 1) {
          flp = true;
          setTimeout(() => {
            flp = false;
            p = 0;
            setHgAngle(a => a + 180);
          }, 400);
        }
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const topH        = Math.max(0, 18 * (1 - phase));
  const botY        = 44 - 18 * phase;
  const botH        = 18 * phase;
  const dripY       = 26 + phase * 6;
  const dripOpacity = phase > 0.05 && phase < 0.95 ? 0.7 : 0;

  const tens = Math.floor(pct / 10);
  const units = pct % 10;

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "40px",
          padding: "32px 48px",
          border: `1px solid ${T.borderLight}`,
          borderRadius: "20px",
          background: T.white,
        }}
      >
        {/* ── Hourglass ── */}
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          style={{
            transform: `rotate(${hgAngle}deg)`,
            transition: "transform 0.5s ease",
            flexShrink: 0,
          }}
        >
          <defs>
            <clipPath id="sand-top-clip">
              <rect x="10" y="8" width="32" height={topH} />
            </clipPath>
            <clipPath id="sand-bot-clip">
              <rect x="10" y={botY} width="32" height={botH} />
            </clipPath>
          </defs>
          <path d="M10 8 Q10 22 26 26 Q42 22 42 8 Z" fill={T.primary} opacity="0.18" clipPath="url(#sand-top-clip)" />
          <path d="M10 8 Q10 22 26 26 Q42 22 42 8 Z" fill={T.primary} opacity="0.5"  clipPath="url(#sand-top-clip)" />
          <path d="M26 26 Q10 30 10 44 L42 44 Q42 30 26 26 Z" fill={T.primary} opacity="0.5" clipPath="url(#sand-bot-clip)" />
          <path
            d="M10 6 L42 6 L42 8 Q42 22 26 26 Q10 30 10 44 L42 44 L42 46 L10 46 L10 44 Q10 30 26 26 Q42 22 42 8 L10 8 Z"
            fill="none" stroke={T.primary} strokeWidth="2.2" strokeLinejoin="round"
          />
          <line x1="8"  y1="6"  x2="44" y2="6"  stroke={T.primary} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8"  y1="46" x2="44" y2="46" stroke={T.primary} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="26" cy={dripY} r="1.5" fill={T.primary} opacity={dripOpacity} />
        </svg>

        {/* ── Text ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          <span style={{ fontFamily: FONTS.openSans, fontSize: "13px", color: T.textMuted, letterSpacing: "0.04em" }}>
            Please wait
          </span>
          <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "26px", color: T.primary, letterSpacing: "-0.01em" }}>
            Loading{dots}
          </span>
        </div>

        {/* ── Percentage counter ── */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>

          {/* Tens digit — static large */}
          <span
            style={{
              fontFamily: FONTS.openSans,
              fontWeight: FONT_WEIGHTS.medium,
              fontSize: "52px",
              color: T.primary,
              lineHeight: 1,
              minWidth: "32px",
              display: "inline-block",
              textAlign: "center",
            }}
          >
            {tens}
          </span>

          {/* Units digit — same size, flickers on change */}
          <span
            style={{
              fontFamily: FONTS.openSans,
              fontWeight: FONT_WEIGHTS.medium,
              fontSize: "52px",
              color: T.primary,
              lineHeight: 1,
              minWidth: "32px",
              display: "inline-block",
              textAlign: "center",
              opacity: flip ? 0.3 : 1,
              transition: flip ? "none" : "opacity 0.12s ease",
            }}
          >
            {units}
          </span>

          {/* Percent symbol */}
          <span
            style={{
              fontFamily: FONTS.openSans,
              fontWeight: FONT_WEIGHTS.medium,
              fontSize: "28px",
              color: T.primary,
              lineHeight: 1,
              marginLeft: "4px",
            }}
          >
            %
          </span>
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

function CaseStudyDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [study, setStudy]         = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiData, setIsApiData] = useState(false);
  const [mounted, setMounted]     = useState(false);
  const [sidebarState, setSidebarState] = useState<SidebarState>("wallet");

  useEffect(() => {
    async function loadCaseStudy() {
      if (!id) { setIsLoading(false); return; }
      setIsLoading(true);
      const apiData = await getCaseStudyById(id);
      if (apiData) {
        const transformedStudy = {
          challenge:
            Array.isArray(apiData.challenge) && apiData.challenge.length > 0
              ? apiData.challenge.map((c: any) => c.text).join(" ")
              : "No challenge information available.",
          solution:
            Array.isArray(apiData.solution) && apiData.solution.length > 0
              ? apiData.solution.map((s: any) => s.text).join(" ")
              : "No solution information available.",
          body:
            Array.isArray(apiData.sections) && apiData.sections.length > 0
              ? apiData.sections
                  .filter((section: any) => section.subtitle !== "Customer Inquiry Management")
                  .map((section: any) => ({ title: section.subtitle || "", text: section.text || "" }))
              : [{ title: apiData.title || "Case Study", text: "Content not available." }],
        };
        setStudy(transformedStudy);
        setIsApiData(true);
      }
      setIsLoading(false);
      setTimeout(() => setMounted(true), 50);
    }
    loadCaseStudy();
  }, [id]);

  const handlePrintPDF = () => window.print();

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return <LoadingExperience />;
  }

  // ── 404 ─────────────────────────────────────────────────────────────────
  if (!study) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white p-6">
        <h1
          className="text-5xl md:text-6xl mb-3 tracking-tight"
          style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, color: T.primary }}
        >
          404
        </h1>
        <p className="text-sm mb-8" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.textHint }}>
          Case Study Not Found
        </p>
        <Link
          href="/resources"
          className="px-8 py-3 text-white hover:opacity-80 transition-opacity text-sm"
          style={{ backgroundColor: T.primary, fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium }}
        >
          Return to Resources
        </Link>
      </div>
    );
  }

  // ── Page ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">

      <div className="print:hidden"><DetailsHeader /></div>

      {/* Progress bar */}
      <div className="w-full h-[3px] bg-zinc-100 print:hidden">
        <div className="h-full w-1/3 transition-all duration-500" style={{ backgroundColor: T.primary }} />
      </div>

      {/* Breadcrumb bar */}
      <div className="border-b border-zinc-100 print:hidden">
        <div className="max-w-screen-xl mx-auto px-6 md:px-16 h-12 flex items-center justify-between">
          <Link
            href="/resources"
            className="flex items-center gap-2 text-sm hover:opacity-60 transition-opacity"
            style={{ color: T.primary, fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium }}
          >
            <FaChevronLeft size={8} />
            Back to Insights
          </Link>
          <span className="text-sm" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.textHint }}>
            Industry Intelligence · 2026
          </span>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">

          {/* ══════════════ MAIN CONTENT ══════════════ */}
          <main className="lg:col-span-8">
            {study.body[0] && (
              <div
                className="mb-8 pb-8 border-b border-zinc-100"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(24px)",
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.primary }}>Overview</span>
                  <span className="flex-1 h-[1px] bg-zinc-100" />
                  <span className="text-sm" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.textHint }}>01</span>
                </div>
                <h2
                  className="text-2xl md:text-3xl mb-8 tracking-tight"
                  style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, color: T.textDark }}
                >
                  {study.body[0].title}
                </h2>
                <p
                  className="text-md md:text-lg leading-[1.85] mt-4 text-justify first-letter:text-[4.5rem] first-letter:font-black first-letter:float-left first-letter:leading-[0.8] first-letter:mr-3 first-letter:mt-1"
                  style={{ fontFamily: FONTS.rubik, color: T.textBody }}
                >
                  {study.body[0].text}
                </p>
                <p className="text-md md:text-lg leading-[1.85] mt-6 text-justify" style={{ fontFamily: FONTS.rubik, color: T.textBody }}>
                  {FIRST_SECTION_EXTRA}
                </p>
              </div>
            )}

            <article className="space-y-10">
              {study.body.slice(1).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="group"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(24px)",
                    transition: `opacity 0.6s ease ${0.1 + idx * 0.1}s, transform 0.6s ease ${0.1 + idx * 0.1}s`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.primary }}>{item.title}</span>
                    <span className="flex-1 h-[1px] bg-zinc-100" />
                    <span className="text-sm" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.textHint }}>0{idx + 2}</span>
                  </div>
                  <p className="text-md md:text-lg leading-[1.85] mt-4 text-justify" style={{ fontFamily: FONTS.rubik, color: T.textBody }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </article>

            <div
              className="mt-20 pt-10 border-t border-zinc-100 flex items-center print:hidden"
              style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 0.5s" }}
            >
              <button
                onClick={handlePrintPDF}
                className="flex items-center gap-2 px-6 py-3 text-white text-sm hover:opacity-85 active:scale-95 transition-all"
                style={{ backgroundColor: T.primary, fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium }}
              >
                <FaFilePdf size={13} />
                Export PDF
              </button>
            </div>
          </main>

          {/* ══════════════ SIDEBAR ══════════════ */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
            <div
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(32px)",
                transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s",
              }}
            >

              {/* ══ WALLET STATE ══ */}
              {sidebarState === "wallet" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "48px", paddingTop: "16px" }}>
                  <div className="cs-wallet">
                    <div className="cs-wallet-back" />

                    {/* Challenge card — maroon, sits behind */}
                    <div
                      className="cs-card cs-challenge"
                      onClick={() => setSidebarState("challenge")}
                      title="Click to view Challenge"
                    >
                      <div className="cs-card-inner">
                        <div className="cs-card-top">
                          <span className="cs-card-label">Challenge</span>
                          <div className="cs-chip" />
                        </div>
                        <div className="cs-card-bottom">
                          <span className="cs-meta-label">The Problem</span>
                          <span className="cs-meta-value">{study.challenge.slice(0, 52)}…</span>
                        </div>
                      </div>
                    </div>

                    {/* Solution card — white, sits on top */}
                    <div
                      className="cs-card cs-solution"
                      onClick={() => setSidebarState("solution")}
                      title="Click to view Solution"
                    >
                      <div className="cs-card-inner">
                        <div className="cs-card-top">
                          <span className="cs-card-label" style={{ color: T.primary }}>Solution</span>
                          <div className="cs-chip cs-chip-light" />
                        </div>
                        <div className="cs-card-bottom">
                          <span className="cs-meta-label" style={{ color: T.primaryDark }}>The Resolution</span>
                          <span className="cs-meta-value" style={{ color: T.primary }}>{study.solution.slice(0, 52)}…</span>
                        </div>
                      </div>
                    </div>

                    {/* Pocket SVG */}
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
                          <div className="cs-balance-real">2 Insights</div>
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

                    {/* Pocket overlay */}
                    <div className="cs-expand-trigger" onClick={() => setSidebarState("both")} />
                  </div>
                </div>
              )}

              {/* ══ CHALLENGE SOLO — maroon, click to return to wallet ══ */}
              {sidebarState === "challenge" && (
                <div style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>
                  <div
                    style={{
                      backgroundColor: T.primaryDark,
                      borderRadius: "20px",
                      padding: "24px",
                      position: "relative",
                      zIndex: 2,
                      boxShadow: `0 8px 40px rgba(122,0,0,0.40)`,
                      transition: "transform 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => setSidebarState("wallet")}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: T.whiteAlpha40 }}>The Problem</span>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: T.pinkLight, display: "inline-block" }} />
                    </div>
                    <h3 style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, fontSize: "22px", color: T.white, marginBottom: "6px", letterSpacing: "-0.02em" }}>
                      Challenge
                    </h3>
                    <div style={{ height: "2px", backgroundColor: T.pinkLight, width: "2rem", marginBottom: "16px" }} />
                    <p style={{ fontFamily: FONTS.rubik, fontSize: "13.5px", lineHeight: "1.85", color: T.whiteAlpha75, textAlign: "justify", margin: 0 }}>
                      {study.challenge}
                    </p>
                    <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: `1px solid ${T.whiteAlpha10}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.whiteAlpha30 }}>Industry Intelligence · 2026</span>
                      <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: T.pinkLight, fontWeight: FONT_WEIGHTS.medium, opacity: 0.6 }}>click to close</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ SOLUTION SOLO — white, click to return to wallet ══ */}
              {sidebarState === "solution" && (
                <div style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>
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
                      cursor: "pointer",
                    }}
                    onClick={() => setSidebarState("wallet")}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: T.textMuted }}>The Resolution</span>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: T.primary, display: "inline-block" }} />
                    </div>
                    <h3 style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, fontSize: "22px", color: T.textDark, marginBottom: "6px", letterSpacing: "-0.02em" }}>
                      Solution
                    </h3>
                    <div style={{ height: "2px", backgroundColor: T.primary, width: "2rem", marginBottom: "16px" }} />
                    <p style={{ fontFamily: FONTS.rubik, fontSize: "13.5px", lineHeight: "1.85", color: T.textBody, textAlign: "justify", margin: 0 }}>
                      {study.solution}
                    </p>
                    <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: `1px solid ${T.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.textHint }}>Industry Intelligence · 2026</span>
                      <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: T.primary, fontWeight: FONT_WEIGHTS.medium, opacity: 0.45 }}>click to close</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ BOTH CARDS ══ */}
              {sidebarState === "both" && (
                <div style={{ animation: "fadeSlideIn 0.4s ease forwards" }}>

                  {/* Challenge card — maroon, on top */}
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
                      cursor: "pointer",
                    }}
                    onClick={() => setSidebarState("challenge")}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: T.whiteAlpha40 }}>The Problem</span>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: T.pinkLight, display: "inline-block" }} />
                    </div>
                    <h3 style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, fontSize: "22px", color: T.white, marginBottom: "6px", letterSpacing: "-0.02em" }}>
                      Challenge
                    </h3>
                    <div style={{ height: "2px", backgroundColor: T.pinkLight, width: "2rem", marginBottom: "16px" }} />
                    <p style={{ fontFamily: FONTS.rubik, fontSize: "13.5px", lineHeight: "1.85", color: T.whiteAlpha75, textAlign: "justify", margin: 0 }}>
                      {study.challenge}
                    </p>
                  </div>

                  {/* Solution card — white, slides under */}
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
                      cursor: "pointer",
                    }}
                    onClick={() => setSidebarState("solution")}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(4px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)";
                    }}
                  >
                    <div style={{ height: "20px" }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: T.textMuted }}>The Resolution</span>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: T.primary, display: "inline-block" }} />
                    </div>
                    <h3 style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, fontSize: "22px", color: T.textDark, marginBottom: "6px", letterSpacing: "-0.02em" }}>
                      Solution
                    </h3>
                    <div style={{ height: "2px", backgroundColor: T.primary, width: "2rem", marginBottom: "16px" }} />
                    <p style={{ fontFamily: FONTS.rubik, fontSize: "13.5px", lineHeight: "1.85", color: T.textBody, textAlign: "justify", margin: 0 }}>
                      {study.solution}
                    </p>
                    <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: `1px solid ${T.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.textHint }}>Industry Intelligence · 2026</span>
                      <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.primary, fontWeight: FONT_WEIGHTS.medium }}>Resolved ✓</span>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </aside>
        </div>
      </div>

      <div className="mt-16 print:hidden"><Footer /></div>

      <style jsx global>{`
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
        @media print {
          @page { margin: 15mm; size: auto; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
          .lg\\:col-span-8 { width: 100% !important; float: none !important; }
          .lg\\:col-span-4 { width: 100% !important; margin-top: 50px; }
          h1, h2 { font-size: 22pt !important; }
          .shadow-xl, .shadow-lg, .shadow-md { box-shadow: none !important; }
          .sticky { position: static !important; }
        }
      `}</style>
    </div>
  );
}

export default function CaseStudiesCardDetailsPage() {
  return (
    <Suspense
      fallback={
        <div
          className="h-screen w-full flex items-center justify-center bg-white text-sm"
          style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.textHint }}
        >
          Initializing…
        </div>
      }
    >
      <CaseStudyDetailsContent />
    </Suspense>
  );
}