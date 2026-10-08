
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer/Footer";
import PrintWatermark from "@/shared/PrintWatermark";
import InsightWallet from "@/components/InsightWallet";
import DetailsHeader from "./Resources/DetailsHeader";
import { FaFilePdf } from "react-icons/fa";
import { FONTS, TYPOGRAPHY, FONT_WEIGHTS } from "@/constant/styles";
import { htmlToText, toHtml } from "@/lib/rich-text";
import PageLoader from "@/components/PageLoader";

// Inner markup of formatted case-study text (toolbar output).
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
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
async function getCaseStudyById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/casestudies/${id}`);
    if (!response.ok) throw new Error("Failed to fetch case study");
    return response.json();
  } catch (error) {
    console.error("Error fetching case study:", error);
    return null;
  }
}
async function getAllCaseStudies() {
  try {
    const response = await fetch(`${API_BASE_URL}/casestudies`);
    if (!response.ok) throw new Error("Failed to fetch case studies");
    return response.json();
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return [];
  }
}
const RELATED_FALLBACK_IMG = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800";
function toHttps(url) {
  if (!url) return "";
  return url.startsWith("http://") ? url.replace("http://", "https://") : url;
}
function transformRelated(item) {
  let description = "";
  if (Array.isArray(item.challenge) && item.challenge.length > 0) {
    description = item.challenge[0]?.text || "";
  } else if (Array.isArray(item.sections) && item.sections.length > 0) {
    description = item.sections[0]?.text || "";
  } else if (Array.isArray(item.solution) && item.solution.length > 0) {
    description = item.solution[0]?.text || "";
  }
  description = item.subtitle || htmlToText(description);
  if (description.length > 90) description = description.slice(0, 90) + "\u2026";
  return {
    id: item._id,
    title: item.title || "Untitled Case Study",
    description: description || "Read the full case study.",
    image: toHttps(item.cover) || RELATED_FALLBACK_IMG,
    status: item.status || "Active",
    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }) : ""
  };
}
const FIRST_SECTION_EXTRA = `By centralizing all communication channels into a unified inbox, agents gained full visibility into every customer interaction regardless of where it originated. This eliminated duplicate responses, reduced average handling time, and allowed supervisors to monitor performance in real time. The platform's smart routing also ensured that inquiries were automatically assigned to the most appropriate team member based on topic and availability \u2014 keeping queues balanced and customers satisfied.`;
function CaseStudyDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [study, setStudy] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiData, setIsApiData] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    async function loadCaseStudy() {
      if (!id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const apiData = await getCaseStudyById(id);
      if (apiData) {
        const transformedStudy = {
          title: apiData.title || "Case Study",
          type: "Case Studies",
          image: toHttps(apiData.cover) || RELATED_FALLBACK_IMG,
          challenge: Array.isArray(apiData.challenge) && apiData.challenge.length > 0 ? apiData.challenge.map((c) => c.text).join(" ") : "No challenge information available.",
          solution: Array.isArray(apiData.solution) && apiData.solution.length > 0 ? apiData.solution.map((s) => s.text).join(" ") : "No solution information available.",
          body: Array.isArray(apiData.sections) && apiData.sections.length > 0 ? apiData.sections.filter((section) => section.subtitle !== "Customer Inquiry Management").map((section) => ({ title: section.subtitle || "", text: section.text || "" })) : [{ title: apiData.title || "Case Study", text: "Content not available." }]
        };
        setStudy(transformedStudy);
        setIsApiData(true);
      }
      const all = await getAllCaseStudies();
      if (Array.isArray(all)) {
        setRelated(
          all.filter((item) => item._id !== id && item.status === "active").slice(0, 4).map(transformRelated)
        );
      }
      setIsLoading(false);
      setTimeout(() => setMounted(true), 50);
    }
    loadCaseStudy();
  }, [id]);
  const handlePrintPDF = () => window.print();
  if (isLoading) {
    return <PageLoader />;
  }
  if (!study) {
    return <div className="h-screen w-full flex flex-col items-center justify-center bg-white p-6">
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
      </div>;
  }
  return <div className="min-h-screen bg-white relative">
      {
    /* ── Print-specific font sizes ── */
  }
      <style>{`
        @media screen {
          .drop-cap-p::first-letter {
            font-size: 4.5rem;
            font-weight: 900;
            float: left;
            line-height: 0.8;
            margin-right: 0.75rem;
            margin-top: 0.25rem;
          }
        }
        @media print {
          .print-main-title { font-size: 35px !important; line-height: 1.1 !important; }
          .print-subtitle { font-size: 16px !important; font-family: var(--font-rubik), sans-serif !important; }
          .print-overview-h2 { font-size: 30px !important; margin-bottom: 20px !important; }
          .print-overview-desc { font-size: 16px !important; font-family: var(--font-rubik), sans-serif !important; }
          .print-section-h { font-size: 18px !important; }
          .print-section-desc { font-size: 16px !important; font-family: var(--font-rubik), sans-serif !important; }
          nextjs-portal,
          #__next-build-indicator,
          [data-nextjs-dialog-overlay],
          [data-nextjs-toast],
          body > nextjs-portal,
          chat-widget,
          [id^="lc_"],
          iframe[src*="leadconnectorhq"] { display: none !important; }
        }
      `}</style>
      {
    /* ── Print Watermark ── */
  }
      <PrintWatermark />

      {
    /* PDF only: cover image goes at the very top, above the header */
  }
      <div className="hidden print:block max-w-screen-xl mx-auto px-6 md:px-16 pt-2">
        <img
    src={study.image}
    alt={study.title}
    className="w-full h-[300px] object-cover rounded-2xl"
    onError={(e) => {
      const t = e.target;
      if (t.src !== RELATED_FALLBACK_IMG) t.src = RELATED_FALLBACK_IMG;
    }}
  />
      </div>

      <div><DetailsHeader /></div>



      {
    /* Main grid */
  }
      <div className="max-w-screen-xl mx-auto px-6 md:px-16 pt-6 md:pt-8 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">

          {
    /* ══════════════ MAIN CONTENT ══════════════ */
  }
          <main className="lg:col-span-8">
            {
    /* Hero image — banner above the article */
  }
            <div
    className="mb-10 md:mb-12 rounded-2xl overflow-hidden print:hidden"
    style={{
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease"
    }}
  >
              <img
    src={study.image}
    alt={study.title}
    className="w-full h-[240px] sm:h-[320px] md:h-[420px] object-cover"
    onError={(e) => {
      const t = e.target;
      if (t.src !== RELATED_FALLBACK_IMG) t.src = RELATED_FALLBACK_IMG;
    }}
  />
            </div>

            {study.body[0] && <div
    className="mb-8 pb-8 border-b border-zinc-100"
    style={{
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease"
    }}
  >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[14px] md:text-[16px]" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, color: T.primary }}>Overview</span>
                  <span className="flex-1 h-[1px] bg-zinc-100" />
                  <span className="text-[12px] md:text-[14px]" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.textHint }}>01</span>
                </div>
                <h2
    className="print-overview-h2 text-[22px] md:text-[30px] mb-8 tracking-tight"
    style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold, color: T.textDark, lineHeight: 1.25 }}
  >
                  {study.body[0].title}
                </h2>
                <div className={`drop-cap-p print-overview-desc leading-[1.85] mt-4 text-justify text-[14px] md:text-[16px] ${RICH}`} style={{ fontFamily: FONTS.rubik, fontWeight: FONT_WEIGHTS.regular, color: T.textBody }} dangerouslySetInnerHTML={{ __html: toHtml(study.body[0].text) }} />
                <p className="print-overview-desc leading-[1.85] mt-6 text-justify text-[14px] md:text-[16px]" style={{ fontFamily: FONTS.rubik, fontWeight: FONT_WEIGHTS.regular, color: T.textBody }}>
                  {FIRST_SECTION_EXTRA}
                </p>
              </div>}

            <article className="space-y-10">
              {study.body.slice(1).map((item, idx) => <div
    key={idx}
    className="group"
    style={{
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${0.1 + idx * 0.1}s, transform 0.6s ease ${0.1 + idx * 0.1}s`
    }}
  >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="print-section-h text-[14px] md:text-[16px]" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, color: T.primary }}>{item.title}</span>
                    <span className="flex-1 h-[1px] bg-zinc-100" />
                    <span className="text-[12px] md:text-[14px]" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.textHint }}>0{idx + 2}</span>
                  </div>
                  <div className={`print-section-desc leading-[1.85] mt-4 text-justify text-[14px] md:text-[16px] ${RICH}`} style={{ fontFamily: FONTS.rubik, fontWeight: FONT_WEIGHTS.regular, color: T.textBody }} dangerouslySetInnerHTML={{ __html: toHtml(item.text) }} />
                </div>)}

            </article>

            {
    /* ── Print-only Challenge & Solution cards (hidden on screen, visible in PDF) ── */
  }
            <div className="hidden print:block mt-16 pt-10 border-t border-zinc-100 space-y-6">
              {
    /* Challenge */
  }
              <div
    style={{
      backgroundColor: T.primaryDark,
      borderRadius: "16px",
      padding: "28px 32px"
    }}
  >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: T.whiteAlpha40 }}>The Problem</span>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: T.pinkLight, display: "inline-block" }} />
                </div>
                <h3 style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold, fontSize: "20px", color: T.white, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                  Challenge
                </h3>
                <div style={{ height: "2px", backgroundColor: T.pinkLight, width: "2rem", marginBottom: "14px" }} />
                <div className={RICH} style={{ fontFamily: FONTS.rubik, fontSize: "14px", lineHeight: "1.85", color: T.whiteAlpha75, textAlign: "justify", margin: 0 }} dangerouslySetInnerHTML={{ __html: toHtml(study.challenge) }} />
                <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: `1px solid ${T.whiteAlpha10}` }}>
                  <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: T.whiteAlpha30 }}>Industry Intelligence · 2026</span>
                </div>
              </div>

              {
    /* Solution */
  }
              <div
    style={{
      backgroundColor: T.white,
      border: `1px solid ${T.borderLight}`,
      borderRadius: "16px",
      padding: "28px 32px",
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)"
    }}
  >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: T.textMuted }}>The Resolution</span>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: T.primary, display: "inline-block" }} />
                </div>
                <h3 style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold, fontSize: "20px", color: T.textDark, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                  Solution
                </h3>
                <div style={{ height: "2px", backgroundColor: T.primary, width: "2rem", marginBottom: "14px" }} />
                <div className={RICH} style={{ fontFamily: FONTS.rubik, fontSize: "14px", lineHeight: "1.85", color: T.textBody, textAlign: "justify", margin: 0 }} dangerouslySetInnerHTML={{ __html: toHtml(study.solution) }} />
                <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: `1px solid ${T.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: T.textHint }}>Industry Intelligence · 2026</span>
                  <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: T.primary, fontWeight: FONT_WEIGHTS.medium }}>Resolved ✓</span>
                </div>
              </div>
            </div>

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

          {
    /* ══════════════ SIDEBAR — Article for you ══════════════ */
  }
          {
    /* print:hidden — entire aside (wallet design + article list) is excluded from PDF */
  }
          <aside className="lg:col-span-4 h-fit print:hidden">
            {
    /* ══ Challenge + Solution — original wallet/credit-card design ══ */
  }
            <InsightWallet
    mounted={mounted}
    pocketText="2 Insights"
    a={{ label: "Challenge", kicker: "The Problem", preview: `${htmlToText(study.challenge).slice(0, 52)}…`, html: toHtml(study.challenge) }}
    b={{ label: "Solution", kicker: "The Resolution", preview: `${htmlToText(study.solution).slice(0, 52)}…`, html: toHtml(study.solution), footer: "Resolved ✓" }}
  />

            <div
    style={{
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(32px)",
      transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s"
    }}
  >
              {
    /* Top divider */
  }
              <div style={{ height: "1px", backgroundColor: "#A10000", marginBottom: "20px" }} />
              <h2
    className="mb-6"
    style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold, fontSize: "20px", color: T.textDark }}
  >
                Article for you
              </h2>

              <div className="flex flex-col gap-5">
                {related.length === 0 && <p className="text-sm" style={{ fontFamily: FONTS.rubik, color: T.textHint }}>
                    No related case studies yet.
                  </p>}

                {related.map((item) => <Link
    key={item.id}
    href={`/resources/casestudiescarddetails?id=${item.id}`}
    className="group block rounded-2xl overflow-hidden border border-zinc-100 bg-white hover:shadow-lg transition-shadow"
  >
                    <div className="relative h-[150px] w-full overflow-hidden">
                      <img
    src={item.image}
    alt={item.title}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    onError={(e) => {
      const t = e.target;
      if (t.src !== RELATED_FALLBACK_IMG) t.src = RELATED_FALLBACK_IMG;
    }}
  />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span
    className="bg-white/90 px-2.5 py-1 rounded-full shadow-sm"
    style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: T.textDark }}
  >
                          Case studies
                        </span>
                        {item.status && <span
    className="bg-white/90 px-2.5 py-1 rounded-full shadow-sm"
    style={{
      fontFamily: FONTS.openSans,
      fontWeight: FONT_WEIGHTS.bold,
      fontSize: "10px",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: item.status.toLowerCase() === "active" ? "#16a34a" : item.status.toLowerCase() === "draft" ? "#ea580c" : T.textDark
    }}
  >
                            {item.status}
                          </span>}
                      </div>
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
                        <div className="flex flex-col min-w-0">
                          <span style={{ fontFamily: FONTS.openSans, fontSize: "11px", color: T.textHint }}>
                            {item.date}{item.date ? " \xB7 " : ""}4 min read
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>)}
              </div>

              <Link
    href={`/resources?tab=${encodeURIComponent(study.type)}`}
    className="flex items-center justify-center gap-2 mt-6 w-full py-3 rounded-lg border transition-colors hover:opacity-80"
    style={{
      fontFamily: FONTS.openSans,
      fontWeight: FONT_WEIGHTS.bold,
      fontSize: "13px",
      letterSpacing: "0.04em",
      color: T.primary,
      borderColor: "rgba(161,0,0,0.25)"
    }}
  >
                View All Articles
              </Link>
              {
    /* Bottom divider */
  }
              <div style={{ height: "1px", backgroundColor: "#A10000", marginTop: "24px" }} />
            </div>
          </aside>
        </div>
      </div>

      <div className="mt-16 print:hidden"><Footer /></div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 15mm; size: auto; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
          /* Main content takes full page width; sidebar is hidden via print:hidden utility */
          .lg\\:col-span-8 { grid-column: span 12 / span 12 !important; max-width: 100% !important; }
          h1, h2 { font-size: 22pt !important; }
          .shadow-xl, .shadow-lg, .shadow-md { box-shadow: none !important; }
          .sticky { position: static !important; }
        }
      ` }} />
    </div>;
}
function CaseStudiesCardDetailsPage() {
  return <Suspense
    fallback={<div
      className="h-screen w-full flex items-center justify-center bg-white text-sm"
      style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.textHint }}
    >
          Initializing…
        </div>}
  >
      <CaseStudyDetailsContent />
    </Suspense>;
}
export {
  CaseStudiesCardDetailsPage as default
};
