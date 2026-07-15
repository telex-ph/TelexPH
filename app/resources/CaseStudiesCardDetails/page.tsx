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
  textDark:     "#282828",
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

async function getAllCaseStudies() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/casestudies`);
    if (!response.ok) throw new Error("Failed to fetch case studies");
    return response.json();
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return [];
  }
}

// Deterministic avatar per author/id (matches the Resources listing style)
function avatarFor(seed: string | number) {
  const seedNum =
    typeof seed === "string"
      ? seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : seed;
  const num = (seedNum % 70) + 1;
  return `https://i.pravatar.cc/150?img=${num}`;
}

const RELATED_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800";

// Upgrade insecure http:// image URLs to https:// so they aren't blocked as mixed content
function toHttps(url?: string) {
  if (!url) return "";
  return url.startsWith("http://") ? url.replace("http://", "https://") : url;
}

function transformRelated(item: any) {
  let description = "";
  if (Array.isArray(item.challenge) && item.challenge.length > 0) {
    description = item.challenge[0]?.text || "";
  } else if (Array.isArray(item.sections) && item.sections.length > 0) {
    description = item.sections[0]?.text || "";
  } else if (Array.isArray(item.solution) && item.solution.length > 0) {
    description = item.solution[0]?.text || "";
  }
  description = item.subtitle || description;
  if (description.length > 90) description = description.slice(0, 90) + "…";

  return {
    id: item._id,
    title: item.title || "Untitled Case Study",
    description: description || "Read the full case study.",
    image: toHttps(item.cover) || RELATED_FALLBACK_IMG,
    author: item.author || "Customer Experience Team",
    date: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "",
  };
}

const FIRST_SECTION_EXTRA = `By centralizing all communication channels into a unified inbox, agents gained full visibility into every customer interaction regardless of where it originated. This eliminated duplicate responses, reduced average handling time, and allowed supervisors to monitor performance in real time. The platform's smart routing also ensured that inquiries were automatically assigned to the most appropriate team member based on topic and availability — keeping queues balanced and customers satisfied.`;

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
  const [related, setRelated]     = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiData, setIsApiData] = useState(false);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => {
    async function loadCaseStudy() {
      if (!id) { setIsLoading(false); return; }
      setIsLoading(true);
      const apiData = await getCaseStudyById(id);
      if (apiData) {
        const transformedStudy = {
          title: apiData.title || "Case Study",
          image: toHttps(apiData.cover) || RELATED_FALLBACK_IMG,
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

      // Related case studies for the "Article for you" sidebar
      const all = await getAllCaseStudies();
      if (Array.isArray(all)) {
        setRelated(
          all
            .filter((item: any) => item._id !== id)
            .slice(0, 4)
            .map(transformRelated)
        );
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
            {/* Hero image — banner above the article */}
            <div
              className="mb-10 md:mb-12 rounded-2xl overflow-hidden"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}
            >
              <img
                src={study.image}
                alt={study.title}
                className="w-full h-[240px] sm:h-[320px] md:h-[420px] object-cover"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  if (t.src !== RELATED_FALLBACK_IMG) t.src = RELATED_FALLBACK_IMG;
                }}
              />
            </div>

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
                  <span className="text-sm" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, fontSize: '16px', color: T.primary }}>Overview</span>
                  <span className="flex-1 h-[1px] bg-zinc-100" />
                  <span className="text-sm" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.textHint }}>01</span>
                </div>
                <h2
                  className="text-2xl md:text-3xl mb-8 tracking-tight"
                  style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold, color: T.textDark }}
                >
                  {study.body[0].title}
                </h2>
                <p
                  className="leading-[1.85] mt-4 text-justify first-letter:text-[4.5rem] first-letter:font-black first-letter:float-left first-letter:leading-[0.8] first-letter:mr-3 first-letter:mt-1"
                  style={{ fontFamily: FONTS.rubik, fontWeight: 400, fontSize: '16px', color: T.textBody }}
                >
                  {study.body[0].text}
                </p>
                <p className="leading-[1.85] mt-6 text-justify" style={{ fontFamily: FONTS.rubik, fontWeight: 400, fontSize: '16px', color: T.textBody }}>
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
                    <span className="text-sm" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, fontSize: '16px', color: T.primary }}>{item.title}</span>
                    <span className="flex-1 h-[1px] bg-zinc-100" />
                    <span className="text-sm" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.textHint }}>0{idx + 2}</span>
                  </div>
                  <p className="leading-[1.85] mt-4 text-justify" style={{ fontFamily: FONTS.rubik, fontWeight: 400, fontSize: '16px', color: T.textBody }}>
                    {item.text}
                  </p>
                </div>
              ))}

              {/* Challenge + Solution — stacked "folder" cards (hover to open) */}
              <div
                className="cs-folder"
                title="Hover to open"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(24px)",
                  transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
                }}
              >
                {/* Challenge — maroon, on top */}
                <div
                  className="cs-folder-challenge p-6 md:p-8"
                  style={{
                    backgroundColor: T.primaryDark,
                    borderRadius: "20px",
                    position: "relative",
                    zIndex: 2,
                    boxShadow: "0 8px 40px rgba(122,0,0,0.35)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: T.whiteAlpha40 }}>The Problem</span>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: T.pinkLight }} />
                  </div>
                  <h3 style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, fontSize: "22px", color: T.white, marginBottom: "6px", letterSpacing: "-0.02em" }}>Challenge</h3>
                  <div style={{ height: "2px", backgroundColor: T.pinkLight, width: "2rem", marginBottom: "16px" }} />
                  <p className="text-justify" style={{ fontFamily: FONTS.rubik, fontSize: "14px", lineHeight: "1.85", color: T.whiteAlpha75, margin: 0 }}>
                    {study.challenge}
                  </p>
                </div>

                {/* Solution — white, slides under the maroon card (folder look) */}
                <div
                  className="cs-folder-solution p-6 md:p-8"
                  style={{
                    backgroundColor: T.white,
                    border: `1px solid ${T.borderLight}`,
                    borderRadius: "20px",
                    marginTop: "-20px",
                    position: "relative",
                    zIndex: 1,
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="cs-folder-spacer" style={{ height: "20px" }} />
                  <div className="flex items-center justify-between mb-4">
                    <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: T.textMuted }}>The Resolution</span>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: T.primary }} />
                  </div>
                  <h3 style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, fontSize: "22px", color: T.textDark, marginBottom: "6px", letterSpacing: "-0.02em" }}>Solution</h3>
                  <div style={{ height: "2px", backgroundColor: T.primary, width: "2rem", marginBottom: "16px" }} />
                  <p className="text-justify" style={{ fontFamily: FONTS.rubik, fontSize: "14px", lineHeight: "1.85", color: T.textBody, margin: 0 }}>
                    {study.solution}
                  </p>
                </div>
              </div>
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

          {/* ══════════════ SIDEBAR — Article for you ══════════════ */}
          <aside className="lg:col-span-4 h-fit">
            <div
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(32px)",
                transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s",
              }}
            >
              <h2
                className="mb-6"
                style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold, fontSize: "20px", color: T.textDark }}
              >
                Article for you
              </h2>

              <div className="flex flex-col gap-5">
                {related.length === 0 && (
                  <p className="text-sm" style={{ fontFamily: FONTS.rubik, color: T.textHint }}>
                    No related case studies yet.
                  </p>
                )}

                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/resources/CaseStudiesCardDetails?id=${item.id}`}
                    className="group block rounded-2xl overflow-hidden border border-zinc-100 bg-white hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-[150px] w-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          if (t.src !== RELATED_FALLBACK_IMG) t.src = RELATED_FALLBACK_IMG;
                        }}
                      />
                      <span
                        className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 rounded-full shadow-sm"
                        style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: T.textDark }}
                      >
                        Case studies
                      </span>
                    </div>

                    <div className="p-4">
                      <h3
                        className="mb-1.5 line-clamp-2 transition-colors"
                        style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold, fontSize: "15px", color: T.textDark, lineHeight: 1.3 }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="mb-3 line-clamp-2"
                        style={{ fontFamily: FONTS.rubik, fontWeight: 400, fontSize: "13px", color: T.textBody, lineHeight: 1.5 }}
                      >
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <img
                          src={avatarFor(item.id)}
                          alt={item.author}
                          className="w-7 h-7 rounded-full object-cover bg-gray-200 flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="truncate" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "12px", color: T.textDark }}>
                            {item.author}
                          </span>
                          <span style={{ fontFamily: FONTS.openSans, fontSize: "11px", color: T.textHint }}>
                            {item.date}{item.date ? " · " : ""}4 min read
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="mt-16 print:hidden"><Footer /></div>

      <style jsx global>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Challenge / Solution "folder" open-on-hover animation ── */
        .cs-folder { cursor: pointer; }
        .cs-folder-challenge,
        .cs-folder-solution {
          transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.45s ease, margin 0.45s ease;
          will-change: transform;
        }
        .cs-folder-spacer {
          transition: height 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .cs-folder:hover .cs-folder-challenge {
          transform: translateY(-14px);
          box-shadow: 0 20px 55px rgba(122, 0, 0, 0.45);
        }
        .cs-folder:hover .cs-folder-solution {
          transform: translateY(6px);
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.12);
        }
        .cs-folder:hover .cs-folder-spacer { height: 6px; }

        @media print {
          .cs-folder-challenge, .cs-folder-solution { transform: none !important; box-shadow: none !important; }
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