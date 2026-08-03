
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HiOutlineLink } from "react-icons/hi2";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaHeart,
  FaChevronLeft,
  FaRegCalendarAlt
} from "react-icons/fa";
import { COLORS, FONTS, FONT_WEIGHTS, getColorWithOpacity } from "@/constant/styles";
import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";

const API_BASE =
  import.meta.env.VITE_API_ORIGIN || "/api";
const FALLBACK_DATA = {
  id: 1,
  type: "case studies",
  title: "loading case study",
  subtitle: "please wait while we load the content",
  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
  author: "Customer Experience Team",
  authors: [],
  date: ""
};
const formatAuthors = (authors) => authors.map((a) => a.name).filter(Boolean).join(", ");
async function toggleLikeCaseStudy(id, isLiked) {
  try {
    const method = isLiked ? "DELETE" : "POST";
    const response = await fetch(`${API_BASE}/api/casestudies/${id}/like`, {
      method,
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    if (!response.ok) return { success: false, error: data.error };
    return { success: true, likesCount: data.likesCount, hasLiked: data.hasLiked };
  } catch {
    return { success: false, error: "Failed to toggle like" };
  }
}
async function checkLikeStatus(id) {
  try {
    const response = await fetch(`${API_BASE}/api/casestudies/${id}/like-status`);
    return await response.json();
  } catch {
    return { hasLiked: false, likesCount: 0 };
  }
}
function DetailsHeader() {
  const [showNav, setShowNav] = useState(false);
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const id = searchParams.get("id");
  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        setLoading(true);
        setError(false);
        let response;
        if (slug) {
          response = await fetch(`${API_BASE}/api/casestudies/fetch/${slug}`);
        } else if (id) {
          response = await fetch(`${API_BASE}/api/casestudies/${id}`);
        } else {
          setError(true);
          setLoading(false);
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setCaseStudy(data);
        if (data._id) {
          const likeStatus = await checkLikeStatus(data._id);
          setHasLiked(likeStatus.hasLiked);
          setLikesCount(likeStatus.likesCount);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudy();
  }, [slug, id]);
  const handleLikeToggle = async () => {
    if (isLiking || !caseStudy?._id) return;
    setIsLiking(true);
    const result = await toggleLikeCaseStudy(caseStudy._id, hasLiked);
    if (result.success) {
      setLikesCount(result.likesCount || 0);
      setHasLiked(result.hasLiked || false);
    }
    setIsLiking(false);
  };
  const displayData = caseStudy ? {
    type: "Case studies",
    title: caseStudy.title,
    subtitle: caseStudy.subtitle || "",
    image: caseStudy.cover,
    tags: caseStudy.tags,
    author: formatAuthors(caseStudy.authors || []),
    authors: caseStudy.authors || [],
    date: caseStudy.createdAt ? new Date(caseStudy.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""
  } : FALLBACK_DATA;
  const titleWords = displayData.title.split(" ");
  const splitIndex = Math.ceil(titleWords.length / 2);
  const titleRow1 = titleWords.slice(0, splitIndex).join(" ");
  const titleRow2Words = titleWords.slice(splitIndex);
  const titleRow2Body = titleRow2Words.slice(0, -1).join(" ");
  const titleRow2Last = titleRow2Words[titleRow2Words.length - 1] ?? "";
  return <>
      <div className="print:hidden">
        <Nav openNav={() => setShowNav(true)} />
        <MobileNav showNav={showNav} closeNav={() => setShowNav(false)} />
      </div>

      <section className="w-full bg-white overflow-hidden pt-36 md:pt-44 pb-6 md:pb-8 print:pt-8 print:pb-2">
        <div className="max-w-screen-xl mx-auto px-6 md:px-16">

          {
    /* Top Bar: Breadcrumb + Button */
  }
          <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8 print:mb-4">
            {
    /* Breadcrumb */
  }
            <nav
    className="flex flex-wrap items-center gap-1 print:hidden"
    style={{
      fontFamily: FONTS.openSans,
      fontWeight: FONT_WEIGHTS.bold,
      fontSize: "10px",
      textTransform: "uppercase",
      color: getColorWithOpacity("dark", 0.7)
    }}
  >
              <Link
    href="/"
    className="transition-colors"
    style={{ color: getColorWithOpacity("dark", 0.7) }}
    onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primary}
    onMouseLeave={(e) => e.currentTarget.style.color = getColorWithOpacity("dark", 0.7)}
  >
                Home
              </Link>
              <span className="mx-1 opacity-50">&gt;&gt;</span>
              <Link
    href="/resources"
    className="transition-colors"
    style={{ color: getColorWithOpacity("dark", 0.7) }}
    onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primary}
    onMouseLeave={(e) => e.currentTarget.style.color = getColorWithOpacity("dark", 0.7)}
  >
                Resources
              </Link>
              <span className="mx-1 opacity-50">&gt;&gt;</span>
              <span
    className="truncate max-w-[180px] md:max-w-none"
    style={{ color: "#A10000" }}
  >
                {displayData.title}
              </span>
            </nav>

            <Link
    href="/resources"
    className="print:hidden flex items-center justify-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-5 md:py-2 rounded-full text-white text-[11px] md:text-sm hover:opacity-90 active:scale-95 transition-all w-fit self-start md:self-auto"
    style={{
      backgroundColor: COLORS.primary,
      fontFamily: FONTS.openSans,
      fontWeight: FONT_WEIGHTS.medium,
      boxShadow: "0 2px 8px rgba(161,0,0,0.25)"
    }}
  >
              <FaChevronLeft size={10} />
              Back
            </Link>
          </div>

          <div className="max-w-3xl">

            {
    /* Label */
  }
            <div className="flex items-center gap-2 mb-3">
              <span className="w-4 h-[1px]" style={{ background: "#A10000" }} />
              <span
    className="text-[10px] md:text-[14px]"
    style={{
      fontFamily: FONTS.openSans,
      fontWeight: FONT_WEIGHTS.bold,
      color: "#A10000",
      letterSpacing: "0.04em",
      textTransform: "uppercase"
    }}
  >
                {displayData.type}
              </span>
            </div>

            {
    /* Title */
  }
            <h1
    className="print-main-title text-[28px] md:text-[48px] mb-3 tracking-tight"
    style={{
      fontFamily: FONTS.poppins,
      fontWeight: 900,
      color: "#282828",
      lineHeight: 1.05
    }}
  >
              <span className="block">{titleRow1}</span>
              <span className="block">
                {titleRow2Body && <>{titleRow2Body} </>}
                <span style={{ color: COLORS.primary }}>{titleRow2Last}</span>
              </span>
            </h1>

            {
    /* Subtitle */
  }
            {displayData.subtitle && <p
    className="print-subtitle mb-5 text-[14px] md:text-[16px]"
    style={{
      fontFamily: FONTS.rubik,
      fontWeight: FONT_WEIGHTS.regular,
      color: getColorWithOpacity("dark", 0.7),
      lineHeight: 1.65
    }}
  >
                {displayData.subtitle}
              </p>}

          </div>{
    /* end max-w-3xl */
  }

          {
    /* Author row & Socials */
  }
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
            {
    /* Left: Avatar + Name & Date */
  }
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-0">
              {displayData.authors.length > 0 ? <div className="flex -space-x-2">
                  {displayData.authors.map(
    (a, i) => a.image ? <img
      key={i}
      src={a.image}
      alt={a.name}
      title={a.name}
      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white"
    /> : <div
      key={i}
      title={a.name}
      className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white flex items-center justify-center text-[13px] md:text-[15px] font-bold"
      style={{ background: "#f3f4f6", color: "#374151" }}
    >
                        {a.name?.charAt(0).toUpperCase()}
                      </div>
  )}
                </div> : <img
    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayData.author || "Customer Experience Team")}&background=f3f4f6&color=374151`}
    alt={displayData.author || "Customer Experience Team"}
    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
  />}
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] md:text-[15px]" style={{ fontFamily: FONTS.openSans, fontWeight: FONT_WEIGHTS.bold, color: "#282828" }}>
                  {displayData.author || "Customer Experience Team"}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] md:text-[13px]" style={{ fontFamily: FONTS.openSans, color: getColorWithOpacity("dark", 0.6) }}>
                  <FaRegCalendarAlt size={11} />
                  <span>
                    {displayData.date ? `${displayData.date} \u2022 ` : ""}4 min read
                  </span>
                </div>
              </div>
            </div>

            {
    /* Right (Desktop) / Bottom (Mobile): Social icons + Like — print:hidden */
  }
            <div className="flex items-center gap-2 print:hidden mt-2 md:mt-0">
              {[
    { icon: <FaFacebookF size={11} />, label: "Facebook" },
    { icon: <FaTwitter size={11} />, label: "Twitter" },
    { icon: <FaLinkedinIn size={11} />, label: "LinkedIn" },
    { icon: <FaEnvelope size={11} />, label: "Email" },
    { icon: <HiOutlineLink size={14} />, label: "Copy" }
  ].map((social, idx) => <button
    key={idx}
    aria-label={social.label}
    className="w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all"
    style={{
      background: getColorWithOpacity("dark", 0.04),
      color: "#A10000",
      border: `0.5px solid rgba(161,0,0,0.2)`
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(161,0,0,0.08)";
      e.currentTarget.style.color = "#A10000";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = getColorWithOpacity("dark", 0.04);
      e.currentTarget.style.color = "#A10000";
    }}
  >
                  {social.icon}
                </button>)}
              <button
    onClick={handleLikeToggle}
    disabled={isLiking}
    className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-all ml-1 md:ml-2"
    style={{
      background: "rgba(161,0,0,0.04)",
      border: "0.5px solid rgba(161,0,0,0.15)"
    }}
  >
                <FaHeart size={10} className="md:w-3 md:h-3" style={{ color: COLORS.primary }} />
                <span
    className="text-[11px] md:text-[13px]"
    style={{
      fontFamily: FONTS.openSans,
      color: COLORS.primary,
      letterSpacing: "0.02em"
    }}
  >
                  {likesCount} {likesCount === 1 ? "like" : "likes"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>;
}
export {
  DetailsHeader as default
};
