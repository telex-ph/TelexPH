
import React, { useState, useEffect } from "react";
import { HiHeart, HiOutlineHeart, HiOutlineLink } from "react-icons/hi2";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope, FaChevronLeft, FaRegCalendarAlt, FaFilePdf } from "react-icons/fa";
import { FONTS, TYPOGRAPHY, FONT_WEIGHTS } from "@/constant/styles";
import InsightWallet from "@/components/InsightWallet";
import { FaqSection, isFaqSection, sanitizeHtml } from "@/components/FaqSection";
import { getApiBaseUrl } from "@/lib/api-base";

const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const API_BASE = getApiBaseUrl();
const T = {
  primary: "#a10000",
  primaryDark: "#7a0000",
  primaryDeep: "#5c0000",
  white: "#ffffff",
  whiteAlpha75: "rgba(255,255,255,0.75)",
  whiteAlpha40: "rgba(255,255,255,0.40)",
  whiteAlpha30: "rgba(255,255,255,0.30)",
  whiteAlpha10: "rgba(255,255,255,0.10)",
  pinkLight: "#ffc5c5",
  pinkMid: "#e88888",
  borderLight: "#e4e4e7",
  textDark: "#0a0a0a",
  textMuted: "rgba(0,0,0,0.35)",
  textBody: "rgba(0,0,0,0.60)",
  textHint: "rgba(0,0,0,0.30)",
  surface: "#fafafa"
};
function readingTime(post) {
  const text = [
    post.shortDescription,
    ...(post.mainContent || []).map((s) => s.content.replace(/<[^>]+>/g, ""))
  ].join(" ");
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}
function LoadingExperience() {
  const [pct, setPct] = useState(0);
  const [dots, setDots] = useState("");
  const [phase, setPhase] = useState(0);
  const [hgAngle, setHgAngle] = useState(0);
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    let count = 0;
    const t = setInterval(() => {
      count = (count + 1) % 4;
      setDots(".".repeat(count));
    }, 500);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    let current = 0;
    let timeout;
    const tick = () => {
      if (current < 99) {
        const jump = current < 30 ? Math.floor(Math.random() * 3) + 1 : current < 70 ? Math.floor(Math.random() * 2) + 1 : 1;
        current = Math.min(99, current + jump);
        setPct(current);
        setFlip(true);
        setTimeout(() => setFlip(false), 120);
      }
      const delay = current < 40 ? 120 : current < 75 ? 200 : current < 90 ? 350 : 600;
      timeout = setTimeout(tick, delay);
    };
    timeout = setTimeout(tick, 300);
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    let p = 0;
    let flp = false;
    let raf;
    const animate = () => {
      if (!flp) {
        p += 0.012;
        setPhase(Math.min(1, p));
        if (p >= 1) {
          flp = true;
          setTimeout(() => {
            flp = false;
            p = 0;
            setHgAngle((a) => a + 180);
          }, 400);
        }
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
  return <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: T.white, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
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
    </div>;
}
function BlogsArticle({ post, onBack, onArticleClick, allBlogs }) {
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (post) {
      setIsLoading(true);
      setMounted(false);
      setLikeCount(post.likeCount || 0);
      checkLikeStatus();
      fetch(`${API_BASE}/blogs/${post._id}`).catch(() => {
      });
      const timer = setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => setMounted(true), 50);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [post?._id]);
  const checkLikeStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/blogs/${post._id}/like-status`);
      const data = await res.json();
      setHasLiked(data.hasLiked);
      setLikeCount(data.likeCount);
    } catch {
    }
  };
  const handleLikeToggle = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch(`${API_BASE}/blogs/${post._id}/like`, { method: hasLiked ? "DELETE" : "POST" });
      const data = await res.json();
      if (res.ok) {
        setLikeCount(data.likeCount);
        setHasLiked(data.hasLiked);
      }
    } catch {
    } finally {
      setIsLiking(false);
    }
  };
  if (!post) return null;
  if (isLoading) return <LoadingExperience />;
  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
  const MAX_MORE_ARTICLES = 5;
  const latestUpdates = allBlogs ? allBlogs.filter((b) => b._id !== post._id).slice(0, MAX_MORE_ARTICLES) : [];
  const mins = readingTime(post);
  const sections = post.mainContent || [];
  const titleWords = (post.title || "").split(" ");
  const splitIndex = Math.ceil(titleWords.length / 2);
  const titleRow1 = titleWords.slice(0, splitIndex).join(" ");
  const titleRow2Words = titleWords.slice(splitIndex);
  const titleRow2Body = titleRow2Words.slice(0, -1).join(" ");
  const titleRow2Last = titleRow2Words[titleRow2Words.length - 1] ?? "";
  const fade = (delay = 0) => ({ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` });
  const RICH = "[&_p]:mb-5 [&_p]:leading-[1.85] [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#a10000] [&_blockquote]:pl-4 [&_blockquote]:mb-5 [&_blockquote]:italic [&_li]:leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-70 [&_strong]:font-bold [&_strong]:text-[#282828]";
  return <div className="min-h-screen bg-white relative" style={{ fontFamily: FONTS.openSans }}>
      <style>{`
        @media screen {
          .drop-cap-p::first-letter { font-size: 4.5rem; font-weight: 900; float: left; line-height: 0.8; margin-right: 0.75rem; margin-top: 0.25rem; }
        }
      `}</style>

      {/* ── Header (same as Case Study details) ── */}
      <section className="w-full bg-white overflow-hidden pt-36 md:pt-44 pb-6 md:pb-8 print:pt-8 print:pb-2">
        <div className="max-w-screen-xl mx-auto px-6 md:px-16">
          <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8 print:mb-4">
            <nav className="flex flex-wrap items-center gap-1 print:hidden" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, fontSize: "10px", textTransform: "uppercase", color: "rgba(0,0,0,0.7)" }}>
              <button onClick={onBack} className="transition-colors hover:text-[#a10000]" style={{ textTransform: "uppercase" }}>Home</button>
              <span className="mx-1 opacity-50">&gt;&gt;</span>
              <button onClick={onBack} className="transition-colors hover:text-[#a10000]" style={{ textTransform: "uppercase" }}>Resources</button>
              <span className="mx-1 opacity-50">&gt;&gt;</span>
              <span className="truncate max-w-[180px] md:max-w-none" style={{ color: T.primary }}>{post.title}</span>
            </nav>
            <button
    onClick={onBack}
    className="print:hidden flex items-center justify-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-5 md:py-2 rounded-full text-white text-[11px] md:text-sm hover:opacity-90 active:scale-95 transition-all w-fit self-start md:self-auto"
    style={{ backgroundColor: T.primary, fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, boxShadow: "0 2px 8px rgba(161,0,0,0.25)" }}
  >
              <FaChevronLeft size={10} />
              Back
            </button>
          </div>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-4 h-[1px]" style={{ background: T.primary }} />
              <span className="text-[10px] md:text-[14px]" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, color: T.primary, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {post.mainCategory || "Blogs"}{post.subcategory ? ` · ${post.subcategory}` : ""}
              </span>
            </div>
            <h1 className="text-[28px] md:text-[48px] mb-3 tracking-tight print:text-[35px]" style={{ fontFamily: FONTS.poppins, fontWeight: 900, color: "#282828", lineHeight: 1.05 }}>
              <span className="block">{titleRow1}</span>
              <span className="block">
                {titleRow2Body && <>{titleRow2Body} </>}
                <span style={{ color: T.primary }}>{titleRow2Last}</span>
              </span>
            </h1>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-1.5 text-[11px] md:text-[13px] mb-4 md:mb-0" style={{ fontFamily: FONTS.openSans, color: "rgba(0,0,0,0.6)" }}>
              <FaRegCalendarAlt size={11} />
              <span>{formatDate(post.createdAt)} {"•"} {mins} min read</span>
            </div>
            <div className="flex items-center gap-2 print:hidden mt-2 md:mt-0">
              {[
    { icon: <FaFacebookF size={11} />, label: "Facebook" },
    { icon: <FaTwitter size={11} />, label: "Twitter" },
    { icon: <FaLinkedinIn size={11} />, label: "LinkedIn" },
    { icon: <FaEnvelope size={11} />, label: "Email" },
    { icon: <HiOutlineLink size={14} />, label: "Copy" }
  ].map((social) => <button
    key={social.label}
    aria-label={social.label}
    className="w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all hover:bg-[rgba(161,0,0,0.08)]"
    style={{ background: "rgba(0,0,0,0.04)", color: T.primary, border: "0.5px solid rgba(161,0,0,0.2)" }}
  >
                  {social.icon}
                </button>)}
              <button
    onClick={handleLikeToggle}
    disabled={isLiking}
    className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-all ml-1 md:ml-2"
    style={{ background: hasLiked ? "rgba(161,0,0,0.1)" : "rgba(161,0,0,0.04)", border: "0.5px solid rgba(161,0,0,0.15)" }}
  >
                {hasLiked ? <HiHeart className="w-3 h-3" style={{ color: T.primary }} /> : <HiOutlineHeart className="w-3 h-3" style={{ color: T.primary }} />}
                <span className="text-[11px] md:text-[13px]" style={{ fontFamily: FONTS.openSans, color: T.primary, letterSpacing: "0.02em" }}>
                  {likeCount} {likeCount === 1 ? "like" : "likes"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main grid ── */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-16 pt-6 md:pt-8 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">

          <main className="lg:col-span-8">
            {post.picture && <div className="mb-10 md:mb-12 rounded-2xl overflow-hidden" style={fade()}>
                <img src={post.picture} alt={post.coverAlt || post.title} className="w-full h-[240px] sm:h-[320px] md:h-[420px] object-cover" />
              </div>}

            {/* Overview — short description, like the first block of a case study */}
            {post.shortDescription && <div className="mb-8 pb-8 border-b border-zinc-100" style={fade()}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[14px] md:text-[16px]" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, color: T.primary }}>Overview</span>
                  <span className="flex-1 h-[1px] bg-zinc-100" />
                  <span className="text-[12px] md:text-[14px]" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.textHint }}>01</span>
                </div>
                <p className="drop-cap-p leading-[1.85] text-justify text-[14px] md:text-[16px]" style={{ fontFamily: FONTS.rubik, fontWeight: FONT_WEIGHTS.regular, color: T.textBody }}>
                  {post.shortDescription}
                </p>
              </div>}

            <article className="space-y-10">
              {sections.map((section, index) => {
    if (isFaqSection(section.title)) {
      return <div key={index}><FaqSection content={section.content} sectionTitle={section.title} /></div>;
    }
    return <div key={index} className="group" style={fade(0.1 + index * 0.1)}>
                    {section.title && <div className="flex items-center gap-3 mb-3">
                        <span className="text-[14px] md:text-[16px]" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, color: T.primary }}>{section.title}</span>
                        <span className="flex-1 h-[1px] bg-zinc-100" />
                        <span className="text-[12px] md:text-[14px]" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium, color: T.textHint }}>0{index + 2}</span>
                      </div>}
                    <div
      className={`leading-[1.85] mt-4 text-justify text-[14px] md:text-[16px] ${RICH}`}
      style={{ fontFamily: FONTS.rubik, fontWeight: FONT_WEIGHTS.regular, color: T.textBody }}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content) }}
    />
                  </div>;
  })}
            </article>

            <div className="mt-20 pt-10 border-t border-zinc-100 flex items-center print:hidden" style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 0.5s" }}>
              <button
    onClick={() => window.print()}
    className="flex items-center gap-2 px-6 py-3 text-white text-sm hover:opacity-85 active:scale-95 transition-all"
    style={{ backgroundColor: T.primary, fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.medium }}
  >
                <FaFilePdf size={13} />
                Export PDF
              </button>
            </div>
          </main>

          {/* ── Sidebar — Article for you ── */}
          <aside className="lg:col-span-4 h-fit print:hidden">
              <InsightWallet
    mounted={mounted}
    pocketText={`${sections.length} Sections`}
    a={{ label: "Overview", kicker: "The Summary", preview: `${(post.shortDescription || "").slice(0, 52)}…`, html: `<p>${esc(post.shortDescription)}</p>` }}
    b={{ label: "Topics", kicker: "What's Inside", preview: `${sections.map((s) => s.title).filter(Boolean).join(", ").slice(0, 52)}…`, html: `<ul>${sections.filter((s) => s.title).map((s) => `<li>${esc(s.title)}</li>`).join("")}</ul>`, footer: `${sections.length} sections` }}
  />
            <div style={fade(0.25)}>
              <div style={{ height: "1px", backgroundColor: T.primary, marginBottom: "20px" }} />
              <h2 className="mb-6" style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold, fontSize: "20px", color: T.textDark }}>Article for you</h2>
              <div className="flex flex-col gap-5">
                {latestUpdates.length === 0 && <p className="text-sm" style={{ fontFamily: FONTS.rubik, color: T.textHint }}>No related articles yet.</p>}
                {latestUpdates.map((item) => <div
    key={item._id}
    onClick={() => {
      onArticleClick(item);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
    className="group block cursor-pointer rounded-2xl overflow-hidden border border-zinc-100 bg-white hover:shadow-lg transition-shadow"
  >
                    <div className="relative h-[150px] w-full overflow-hidden">
                      <img src={item.picture} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-white/90 px-2.5 py-1 rounded-full shadow-sm" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: T.textDark }}>
                          Blogs
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1.5 line-clamp-2" style={{ fontFamily: FONTS.poppins, fontWeight: FONT_WEIGHTS.bold, fontSize: "15px", color: T.textDark, lineHeight: 1.3 }}>{item.title}</h3>
                      <p className="mb-3 line-clamp-2" style={{ fontFamily: FONTS.rubik, fontWeight: 400, fontSize: "13px", color: T.textBody, lineHeight: 1.5 }}>{item.shortDescription}</p>
                      <span style={{ fontFamily: FONTS.openSans, fontSize: "11px", color: T.textHint }}>
                        {formatDate(item.createdAt)} {"·"} {readingTime(item)} min read
                      </span>
                    </div>
                  </div>)}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      ` }} />
    </div>;
}
export {
  BlogsArticle as default
};
