"use client";

import React, { useState, useEffect, useRef } from "react";
import { HiHeart, HiOutlineHeart } from "react-icons/hi2";
import { FONTS, TYPOGRAPHY, FONT_WEIGHTS } from "@/constant/styles";

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const T = {
  primary:      "#a10000",
  primaryDark:  "#7a0000",
  primaryDeep:  "#5c0000",
  white:        "#ffffff",
  whiteAlpha75: "rgba(255,255,255,0.75)",
  whiteAlpha40: "rgba(255,255,255,0.40)",
  whiteAlpha30: "rgba(255,255,255,0.30)",
  whiteAlpha10: "rgba(255,255,255,0.10)",
  pinkLight:    "#ffc5c5",
  pinkMid:      "#e88888",
  borderLight:  "#e4e4e7",
  textDark:     "#0a0a0a",
  textMuted:    "rgba(0,0,0,0.35)",
  textBody:     "rgba(0,0,0,0.60)",
  textHint:     "rgba(0,0,0,0.30)",
  surface:      "#fafafa",
};

interface IContentSection {
  title: string;
  content: string;
}

interface IBlog {
  _id: string;
  title: string;
  slug: string;
  author: string;
  mainCategory: string;
  subcategory: string;
  shortDescription: string;
  mainContent: IContentSection[];
  picture: string;
  status: "published" | "draft" | "scheduled";
  likeCount: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
}

interface BlogsArticleProps {
  post: IBlog | null;
  onBack: () => void;
  onArticleClick: (post: IBlog) => void;
  allBlogs: IBlog[];
}

// ─── Estimate reading time ────────────────────────────────────────────────────
function readingTime(post: IBlog): number {
  const text = [
    post.shortDescription,
    ...(post.mainContent || []).map(s => s.content.replace(/<[^>]+>/g, "")),
  ].join(" ");
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

// ─── LoadingExperience ────────────────────────────────────────────────────────
function LoadingExperience() {
  const [pct, setPct]         = useState(0);
  const [dots, setDots]       = useState("");
  const [phase, setPhase]     = useState(0);
  const [hgAngle, setHgAngle] = useState(0);
  const [flip, setFlip]       = useState(false);

  useEffect(() => {
    let count = 0;
    const t = setInterval(() => { count = (count + 1) % 4; setDots(".".repeat(count)); }, 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let current = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (current < 99) {
        const jump = current < 30 ? Math.floor(Math.random() * 3) + 1 : current < 70 ? Math.floor(Math.random() * 2) + 1 : 1;
        current = Math.min(99, current + jump);
        setPct(current); setFlip(true); setTimeout(() => setFlip(false), 120);
      }
      const delay = current < 40 ? 120 : current < 75 ? 200 : current < 90 ? 350 : 600;
      timeout = setTimeout(tick, delay);
    };
    timeout = setTimeout(tick, 300);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let p = 0; let flp = false; let raf: number;
    const animate = () => {
      if (!flp) {
        p += 0.012; setPhase(Math.min(1, p));
        if (p >= 1) { flp = true; setTimeout(() => { flp = false; p = 0; setHgAngle(a => a + 180); }, 400); }
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const topH = Math.max(0, 18 * (1 - phase));
  const botY = 44 - 18 * phase;
  const botH = 18 * phase;
  const dripY = 26 + phase * 6;
  const dripOpacity = phase > 0.05 && phase < 0.95 ? 0.7 : 0;
  const tens = Math.floor(pct / 10);
  const units = pct % 10;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: T.white, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(20px,4vw,40px)", padding: "clamp(20px,4vw,32px) clamp(24px,6vw,48px)", border: `1px solid ${T.borderLight}`, borderRadius: "20px", background: T.white, flexWrap: "wrap", justifyContent: "center" }}>
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ transform: `rotate(${hgAngle}deg)`, transition: "transform 0.5s ease", flexShrink: 0 }}>
          <defs>
            <clipPath id="sand-top-clip-ba"><rect x="10" y="8" width="32" height={topH} /></clipPath>
            <clipPath id="sand-bot-clip-ba"><rect x="10" y={botY} width="32" height={botH} /></clipPath>
          </defs>
          <path d="M10 8 Q10 22 26 26 Q42 22 42 8 Z" fill={T.primary} opacity="0.18" clipPath="url(#sand-top-clip-ba)" />
          <path d="M10 8 Q10 22 26 26 Q42 22 42 8 Z" fill={T.primary} opacity="0.5" clipPath="url(#sand-top-clip-ba)" />
          <path d="M26 26 Q10 30 10 44 L42 44 Q42 30 26 26 Z" fill={T.primary} opacity="0.5" clipPath="url(#sand-bot-clip-ba)" />
          <path d="M10 6 L42 6 L42 8 Q42 22 26 26 Q10 30 10 44 L42 44 L42 46 L10 46 L10 44 Q10 30 26 26 Q42 22 42 8 L10 8 Z" fill="none" stroke={T.primary} strokeWidth="2.2" strokeLinejoin="round" />
          <line x1="8" y1="6" x2="44" y2="6" stroke={T.primary} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="46" x2="44" y2="46" stroke={T.primary} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="26" cy={dripY} r="1.5" fill={T.primary} opacity={dripOpacity} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          <span style={{ fontFamily: FONTS.openSans, fontSize: "13px", color: T.textMuted }}>Please wait</span>
          <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "clamp(20px,4vw,26px)", color: T.primary }}>Loading{dots}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
          <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "clamp(36px,8vw,52px)", color: T.primary, lineHeight: 1, minWidth: "32px", display: "inline-block", textAlign: "center" }}>{tens}</span>
          <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "clamp(36px,8vw,52px)", color: T.primary, lineHeight: 1, minWidth: "32px", display: "inline-block", textAlign: "center", opacity: flip ? 0.3 : 1, transition: flip ? "none" : "opacity 0.12s ease" }}>{units}</span>
          <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "clamp(20px,4vw,28px)", color: T.primary, lineHeight: 1, marginLeft: "4px" }}>%</span>
        </div>
      </div>
    </div>
  );
}

// ─── FaqItem ──────────────────────────────────────────────────────────────────
function FaqItem({ question, answer, isOpen, onToggle }: {
  question: string; answer: string; index: number; isOpen: boolean; onToggle: () => void;
}) {
  const answerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => { if (answerRef.current) setHeight(isOpen ? answerRef.current.scrollHeight : 0); }, [isOpen]);

  return (
    <div style={{ borderRadius: "14px", border: `1px solid ${T.borderLight}`, background: T.white, overflow: "hidden", transition: "all 0.3s", boxShadow: isOpen ? "0 2px 12px rgba(0,0,0,0.06)" : "none" }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
        <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "14px", color: T.textDark, lineHeight: 1.5, flex: 1 }}>{question}</span>
        <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", background: isOpen ? T.primary : T.textDark, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.25s" }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="2" y1="6" x2="10" y2="6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="6" y1="2" x2="6" y2="10" stroke="white" strokeWidth="1.8" strokeLinecap="round" style={{ transformOrigin: "6px 6px", transform: isOpen ? "scaleY(0)" : "scaleY(1)", transition: "transform 0.25s ease" }} />
          </svg>
        </span>
      </button>
      <div style={{ height: `${height}px` }} className="overflow-hidden transition-[height] duration-300 ease-in-out">
        <div ref={answerRef}>
          <div style={{ margin: "0 20px", height: "1px", background: T.borderLight }} />
          <div className="px-5 py-4">
            <div style={{ fontFamily: FONTS.rubik, fontSize: "13.5px", color: T.textBody, lineHeight: "1.85" }}
              className="[&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:mb-3 [&_li]:leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold [&_script]:hidden"
              dangerouslySetInnerHTML={{ __html: answer }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FaqSection ───────────────────────────────────────────────────────────────
function FaqSection({ content, sectionTitle }: { content: string; sectionTitle: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = React.useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const items: { question: string; answer: string }[] = [];
    const h3s = doc.querySelectorAll("h3");
    if (h3s.length > 0) {
      h3s.forEach(h3 => {
        const question = h3.textContent?.trim() || "";
        let answerHtml = ""; let sibling = h3.nextElementSibling;
        while (sibling && sibling.tagName !== "H3") { answerHtml += sibling.outerHTML; sibling = sibling.nextElementSibling; }
        if (question) items.push({ question, answer: answerHtml });
      });
      return items;
    }
    const paragraphs = Array.from(doc.querySelectorAll("p"));
    if (paragraphs.length > 0) {
      const hasQA = paragraphs.some(p => /^Q[:\s]/i.test(p.textContent?.trim() || ""));
      if (hasQA) {
        let i = 0;
        while (i < paragraphs.length) {
          const pText = paragraphs[i].textContent?.trim() || "";
          if (/^Q[:\s]/i.test(pText)) {
            const strong = paragraphs[i].querySelector("strong, b");
            let question = strong ? strong.textContent?.trim() || "" : pText;
            question = question.replace(/^Q:\s*/i, "").trim();
            let answerHtml = "";
            if (i + 1 < paragraphs.length) { answerHtml = paragraphs[i + 1].outerHTML.replace(/^(<p[^>]*>)\s*A:\s*/i, "$1"); i += 2; } else i += 1;
            if (question) items.push({ question, answer: answerHtml });
          } else i += 1;
        }
        if (items.length > 0) return items;
      }
    }
    const lis = doc.querySelectorAll("li");
    if (lis.length > 0) {
      lis.forEach(li => {
        const strong = li.querySelector("strong, b");
        if (strong) { const q = strong.textContent?.trim() || ""; strong.remove(); items.push({ question: q, answer: li.innerHTML.trim() }); }
        else { const t = li.textContent?.trim() || ""; if (t) items.push({ question: t, answer: "" }); }
      });
      return items;
    }
    return [];
  }, [content]);

  return (
    <div className="my-10">
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px" }}>
        <div style={{ width: "4px", height: "28px", backgroundColor: T.primary, borderRadius: "2px", flexShrink: 0, marginTop: "4px" }} />
        <h2 className="text-xl sm:text-2xl tracking-tight" style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, color: T.textDark, margin: 0 }}>
          {sectionTitle || "Frequently Asked Questions"}
        </h2>
      </div>
      {faqs.length > 0 ? (
        <div className="space-y-2">
          {faqs.map((faq, i) => <FaqItem key={i} index={i} question={faq.question} answer={faq.answer} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />)}
        </div>
      ) : (
        <div style={{ fontFamily: FONTS.rubik, fontSize: "13.5px", color: T.textBody, lineHeight: "1.85" }}
          className="[&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:font-bold [&_script]:hidden"
          dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </div>
  );
}

function isFaqSection(title: string): boolean {
  const l = title.toLowerCase();
  return l.includes("frequently asked") || l.includes("faq") || l.includes("common question") || l.includes("questions about");
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BlogsArticle({ post, onBack, onArticleClick, allBlogs }: BlogsArticleProps) {
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked]   = useState(false);
  const [isLiking, setIsLiking]   = useState(false);
  const [mounted, setMounted]     = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (post) {
      setIsLoading(true); setMounted(false);
      setLikeCount(post.likeCount || 0);
      checkLikeStatus();
      fetch(`https://telexph-admin.onrender.com/api/blogs/${post._id}`).catch(() => {});
      const timer = setTimeout(() => { setIsLoading(false); setTimeout(() => setMounted(true), 50); }, 900);
      return () => clearTimeout(timer);
    }
  }, [post?._id]);

  const checkLikeStatus = async () => {
    try {
      const res = await fetch(`https://telexph-admin.onrender.com/api/blogs/${post!._id}/like-status`);
      const data = await res.json();
      setHasLiked(data.hasLiked); setLikeCount(data.likeCount);
    } catch {}
  };

  const handleLikeToggle = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch(`https://telexph-admin.onrender.com/api/blogs/${post!._id}/like`, { method: hasLiked ? "DELETE" : "POST" });
      const data = await res.json();
      if (res.ok) { setLikeCount(data.likeCount); setHasLiked(data.hasLiked); }
    } catch {}
    finally { setIsLiking(false); }
  };

  if (!post)     return null;
  if (isLoading) return <LoadingExperience />;

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
  const latestUpdates = allBlogs ? allBlogs.filter(b => b._id !== post._id).slice(0, 4) : [];
  const mins = readingTime(post);

  return (
    <div style={{ background: T.white, fontFamily: FONTS.openSans }} className="min-h-screen">

      {/* ── Reading progress bar ── */}
      <div className="w-full h-[3px] bg-zinc-100">
        <div className="h-full w-1/3 transition-all duration-500" style={{ backgroundColor: T.primary }} />
      </div>

      {/* ── Breadcrumb bar ── */}
      <div className="border-b border-zinc-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-16 min-h-12 py-2 flex flex-wrap items-center justify-between gap-2">
          <nav className="flex items-center gap-1 text-sm flex-wrap" aria-label="Breadcrumb">
            <button onClick={onBack} className="hover:opacity-60 transition-opacity" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.primary }}>Home</button>
            <span style={{ color: T.textHint, margin: "0 2px" }}>›</span>
            <button onClick={onBack} className="hover:opacity-60 transition-opacity" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.primary }}>Resources</button>
            <span style={{ color: T.textHint, margin: "0 2px" }}>›</span>
            <span className="hidden sm:inline" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.textHint }}>
              {post.title.length > 48 ? post.title.slice(0, 48) + "…" : post.title}
            </span>
            <span className="inline sm:hidden" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.textHint }}>Article</span>
          </nav>
          <span className="text-sm" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.textHint }}>
            {post.mainCategory} · {new Date(post.createdAt).getFullYear()}
          </span>
        </div>
      </div>

      {/* ══ FULL-WIDTH HERO ══ */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.7s ease",
          background: T.textDark,
          minHeight: "clamp(300px, 48vw, 540px)",
        }}
      >
        {/* Hero image */}
        <img
          src={post.picture}
          alt={post.title}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.42 }}
        />
        {/* Dark gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.72) 100%)" }} />

        {/* Hero text */}
        <div
          className="relative max-w-screen-xl mx-auto px-4 sm:px-6 md:px-16 flex flex-col justify-end"
          style={{ minHeight: "clamp(300px, 48vw, 540px)", paddingBottom: "clamp(28px, 5vw, 60px)" }}
        >
          {/* ── Back button — sits directly above the pills ── */}
          <button
            onClick={onBack}
            className="group flex items-center gap-2 w-fit mb-5"
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            >
              <path d="M10 3L5 8L10 13" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{
              fontFamily: FONTS.openSans,
              fontWeight: FONT_WEIGHTS.medium,
              fontSize: "12px",
              color: "rgba(255,255,255,0.75)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}>
              Back to Industry-Specific Insights
            </span>
          </button>

          {/* Category + subcategory pills */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "11px", color: T.white, background: T.primary, padding: "4px 14px", borderRadius: "100px", textTransform: "uppercase" }}>
              {post.mainCategory}
            </span>
            {post.subcategory && (
              <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "11px", color: "rgba(255,255,255,0.8)", padding: "4px 14px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.3)" }}>
                {post.subcategory}
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            className="tracking-tight mb-5"
            style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, color: T.white, fontSize: "clamp(22px, 4vw, 46px)", lineHeight: 1.18, maxWidth: "800px" }}
          >
            {post.title}
          </h1>

          {/* Author row */}
          <div className="flex flex-wrap items-center gap-3">
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "2px solid rgba(255,255,255,0.25)" }}>
              <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "13px", color: T.white }}>
                {(post.author || "T").charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p style={{ fontFamily: FONTS.rubik, fontSize: "13.5px", color: T.white, fontWeight: FONT_WEIGHTS.bold, margin: 0 }}>
                {post.author || "TelexPH Admin"}
              </p>
              <p style={{ fontFamily: FONTS.openSans, fontSize: "11px", fontWeight: FONT_WEIGHTS.medium, color: "rgba(255,255,255,0.55)", margin: 0 }}>
                {formatDate(post.createdAt)} · {mins} min read
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MAIN LAYOUT ══ */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-16 py-10 md:py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-20">

          {/* ══ ARTICLE BODY ══ */}
          <main className="lg:col-span-8">

            {/* Lead paragraph with pull-quote style */}
            <div
              className="mb-10 pb-10 border-b border-zinc-100"
              style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}
            >
              <div style={{ borderLeft: `3px solid ${T.primary}`, paddingLeft: "20px" }}>
                <p
                  className="text-base md:text-lg leading-[1.85] text-justify first-letter:text-[4rem] first-letter:font-black first-letter:float-left first-letter:leading-[0.85] first-letter:mr-3 first-letter:mt-1"
                  style={{ fontFamily: FONTS.rubik, color: T.textBody }}
                >
                  {post.shortDescription}
                </p>
              </div>
            </div>

            {/* Content sections */}
            <article className="space-y-12">
              {post.mainContent && post.mainContent.map((section, index) => {
                if (isFaqSection(section.title)) {
                  return <div key={index}><FaqSection content={section.content} sectionTitle={section.title} /></div>;
                }
                return (
                  <div
                    key={index}
                    style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.6s ease ${0.1 + index * 0.08}s, transform 0.6s ease ${0.1 + index * 0.08}s` }}
                  >
                    {section.title && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
                        <div style={{ width: "4px", minHeight: "28px", backgroundColor: T.primary, borderRadius: "2px", flexShrink: 0, marginTop: "5px" }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                            <h2
                              className="text-xl sm:text-2xl tracking-tight"
                              style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, color: T.textDark, margin: 0 }}
                            >
                              {section.title}
                            </h2>
                            <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "12px", color: T.textHint, flexShrink: 0 }}>
                              0{index + 1}
                            </span>
                          </div>
                          <div style={{ height: "1px", background: T.borderLight, marginTop: "10px" }} />
                        </div>
                      </div>
                    )}
                    <div
                      className="text-base md:text-lg leading-[1.85] text-justify [&_p]:mb-5 [&_p]:leading-[1.85] [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-70 [&_strong]:font-bold [&_script]:hidden"
                      style={{ fontFamily: FONTS.rubik, color: T.textBody }}
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                );
              })}
            </article>

            {/* Author bio card */}
            <div
              className="mt-14"
              style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 0.6s", background: T.surface, border: `1px solid ${T.borderLight}`, borderRadius: "16px", padding: "clamp(16px,4vw,24px)", display: "flex", gap: "16px", alignItems: "flex-start" }}
            >
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "18px", color: T.white }}>
                  {(post.author || "T").charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, fontSize: "10px", textTransform: "uppercase", color: T.textMuted, margin: "0 0 4px" }}>Written by</p>
                <p style={{ fontFamily: TYPOGRAPHY.heading.fontFamily, fontWeight: TYPOGRAPHY.heading.fontWeight, fontSize: "16px", color: T.textDark, margin: "0 0 6px" }}>
                  {post.author || "TelexPH Admin"}
                </p>
                <p style={{ fontFamily: FONTS.rubik, fontSize: "13px", color: T.textBody, margin: 0, lineHeight: 1.6 }}>
                  Content contributor at TelexPH — sharing insights on customer service, industry intelligence, and business solutions.
                </p>
              </div>
            </div>
          </main>

          {/* ══ SIDEBAR ══ */}
          <aside className="lg:col-span-4 h-fit">
            <div
              className="lg:sticky lg:top-8 space-y-5"
              style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s" }}
            >

              {/* Article Info card */}
              <div style={{ border: `1px solid ${T.borderLight}`, borderRadius: "16px", overflow: "hidden" }}>
                <div style={{ background: T.primary, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: FONTS.openSans, fontSize: "11px", fontWeight: FONT_WEIGHTS.medium, textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>Article Info</span>
                  <span style={{ fontFamily: FONTS.openSans, fontSize: "11px", fontWeight: FONT_WEIGHTS.medium, color: "rgba(255,255,255,0.5)" }}>{mins} min read</span>
                </div>
                <div style={{ padding: "20px" }}>
                  <div className="space-y-3">
                    {[
                      { label: "Published", value: formatDate(post.createdAt), highlight: false },
                      { label: "Category",  value: post.mainCategory,          highlight: true  },
                      { label: "Author",    value: post.author || "TelexPH Admin", highlight: false },
                      { label: "Likes",     value: `${likeCount} ${likeCount === 1 ? "like" : "likes"}`, highlight: true },
                    ].map(({ label, value, highlight }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", paddingBottom: "10px", borderBottom: `1px solid ${T.borderLight}` }}>
                        <span style={{ fontFamily: FONTS.rubik, fontSize: "13px", color: T.textMuted, flexShrink: 0 }}>{label}</span>
                        <span style={{ fontFamily: FONTS.openSans, fontSize: "13px", fontWeight: FONT_WEIGHTS.medium, color: highlight ? T.primary : T.textDark, textAlign: "right" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleLikeToggle}
                    disabled={isLiking}
                    className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 text-sm transition-all ${isLiking ? "opacity-50 cursor-not-allowed" : "hover:opacity-85 active:scale-95"}`}
                    style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, background: hasLiked ? T.primary : "transparent", color: hasLiked ? T.white : T.primary, border: `1px solid ${T.primary}`, borderRadius: "8px" }}
                  >
                    {hasLiked ? <HiHeart className="w-4 h-4" /> : <HiOutlineHeart className="w-4 h-4" />}
                    <span>{hasLiked ? "Liked!" : "Like this article"}</span>
                  </button>
                </div>
              </div>

              {/* More Articles card */}
              {latestUpdates.length > 0 && (
                <div style={{ border: `1px solid ${T.borderLight}`, borderRadius: "16px", overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontFamily: FONTS.openSans, fontSize: "11px", fontWeight: FONT_WEIGHTS.medium, textTransform: "uppercase", color: T.textDark }}>More Articles</span>
                    <div style={{ flex: 1, height: "1px", background: T.borderLight }} />
                  </div>
                  <div style={{ padding: "8px 0" }}>
                    {latestUpdates.map((item, idx) => (
                      <div
                        key={item._id}
                        className="group cursor-pointer"
                        onClick={() => { onArticleClick(item); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        style={{ display: "flex", gap: "12px", alignItems: "center", padding: "10px 20px", borderBottom: idx < latestUpdates.length - 1 ? `1px solid ${T.borderLight}` : "none", transition: "background 0.2s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = T.surface}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                      >
                        <div style={{ width: 56, height: 56, borderRadius: "8px", background: T.borderLight, flexShrink: 0, overflow: "hidden" }}>
                          <img src={item.picture} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontFamily: FONTS.openSans, fontSize: "10px", fontWeight: FONT_WEIGHTS.medium, textTransform: "uppercase", color: T.primary, display: "block", marginBottom: "3px" }}>
                            {item.mainCategory}
                          </span>
                          <h4 className="line-clamp-2" style={{ fontFamily: FONTS.openSans, fontSize: "13px", fontWeight: FONT_WEIGHTS.bold, lineHeight: 1.4, color: T.textDark }}>
                            {item.title}
                          </h4>
                        </div>
                        <span style={{ color: T.textHint, fontSize: "18px", flexShrink: 0 }}>›</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer stamp */}
              <p style={{ fontFamily: FONTS.openSans, fontSize: "10px", textTransform: "uppercase", color: T.textHint, textAlign: "center", padding: "4px 0" }}>
                Industry Intelligence · {new Date(post.createdAt).getFullYear()}
              </p>

            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}