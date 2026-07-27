
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Headphones,
  Monitor,
  Calendar,
  BookOpen,
  Users,
  Mail,
  Filter,
  Tag,
  FileText,
  Code,
  Layout,
  Loader2,
  AlertCircle,
  PackageSearch,
  Share2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Clock
} from "lucide-react";
import { FONTS, getColorWithOpacity } from "@/constant/styles";
import { trackOutboundFunnelView } from "@/lib/track-funnel-view";
const API_BASE_URL = "https://telexph-admin.onrender.com/api";
const GHL_SERVICE_URLS = {
  "ai-builder": "https://sites.leadconnectorhq.com/preview/raEir4at50loPjRFkige",
  "csr-customer-service": "https://sites.leadconnectorhq.com/preview/RtlLpk1ZCNSQqgGfLlsJ",
  automation: "https://sites.leadconnectorhq.com/preview/kSgDJd681uGBBpki0vzf",
  "funnel-builder": "https://sites.leadconnectorhq.com/preview/x3fkRBlaj0OvHzOM2bM0",
  "tech-support": "https://sites.leadconnectorhq.com/preview/59VNM2OKoxELqV2T9ueK",
  "website-builder": "https://sites.leadconnectorhq.com/preview/PGpBD03m6a3iIFZySO7h"
};
const GHL_FALLBACK_URL = "https://sites.leadconnectorhq.com/preview/59VNM2OKoxELqV2T9ueK";
const MAROON = "#7B0D1E";
const MAROON_MID = "#9B1D2E";
const MAROON_LIGHT = "#C0392B";
const MAROON_DARK = "#4A0A12";
const FONT_HEADING = "'Poppins', 'Open Sans', sans-serif";
const FONT_BODY = "'Open Sans', 'Poppins', sans-serif";
const FONT_MONO = "'Poppins', monospace";
const ICON_MAP = {
  "ai-builder": PackageSearch,
  automation: Monitor,
  "booking-appointment": Calendar,
  "courses-products": BookOpen,
  crm: Users,
  csr: Headphones,
  "email-marketing": Mail,
  "funnel-builder": Filter,
  "gray-label": Tag,
  "social-media-management": Share2,
  "survey-forms": FileText,
  "tech-support": Monitor,
  "web-development": Code
};
const IMAGE_MAP = {
  "ai-builder": "/images/services1.webp",
  automation: "/images/services2.webp",
  "booking-appointment": "/images/services3.webp",
  "courses-products": "/images/services4.webp",
  crm: "/images/services5.webp",
  csr: "/images/services6.webp",
  "email-marketing": "/images/services1.webp",
  "funnel-builder": "/images/services2.webp",
  "gray-label": "/images/services3.webp",
  "social-media-management": "/images/services4.webp",
  "survey-forms": "/images/services5.webp",
  "tech-support": "/images/services6.webp",
  "web-development": "/images/services1.webp"
};
const ServiceCard = ({ service, index, onSelect, onAuditClick, isSelected }) => {
  const [hovered, setHovered] = useState(false);
  const IconComponent = service.icon;
  const isExternal = service.image.startsWith("http://") || service.image.startsWith("https://") || service.image.startsWith("data:image");
  return <article
    className="group relative flex flex-col overflow-hidden cursor-pointer flex-shrink-0 w-[calc(100%-28px)] sm:w-[340px]"
    onClick={onSelect}
    style={{
      scrollSnapAlign: "center",
      borderRadius: "18px",
      background: "#fff",
      boxShadow: isSelected ? "0 8px 28px rgba(161,0,0,0.13)" : hovered ? "0 8px 24px rgba(0,0,0,0.10)" : "0 2px 8px rgba(0,0,0,0.06)",
      transition: "box-shadow 0.4s ease, transform 0.4s ease",
      transform: hovered || isSelected ? "translateY(-6px)" : "translateY(0)",
      border: isSelected ? "2px solid #a1000040" : `1px solid ${hovered ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.06)"}`
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
  >
      {
    /* ── Image block ── */
  }
      <div className="relative overflow-hidden" style={{ height: "220px", flexShrink: 0 }}>
        <div
    style={{
      position: "absolute",
      inset: 0,
      background: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.65) 100%)`,
      zIndex: 2,
      transition: "opacity 0.4s ease"
    }}
  />
        <div
    style={{
      position: "absolute",
      inset: 0,
      background: `linear-gradient(160deg, rgba(0,0,0,0.25) 0%, transparent 55%)`,
      opacity: hovered ? 1 : 0,
      transition: "opacity 0.4s ease",
      zIndex: 3
    }}
  />
        {!service.isActive && <div
    style={{
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.62)",
      zIndex: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "6px"
    }}
  >
            <Clock size={22} color="#fbbf24" />
            <span
    style={{
      fontFamily: FONT_MONO,
      fontSize: "11px",
      letterSpacing: "0.14em",
      color: "#fbbf24",
      fontWeight: 600,
      textTransform: "uppercase"
    }}
  >
              Coming Soon
            </span>
          </div>}
        {isExternal ? <Image
    src={service.image}
    alt={service.title}
    fill
    className="w-full h-full object-cover"
    style={{
      transition: "transform 0.6s ease",
      transform: hovered ? "scale(1.08)" : "scale(1)"
    }}
    priority={index < 3}
    sizes="(max-width: 640px) 100vw, 340px"
  /> : <Image
    src={service.image}
    alt={service.title}
    fill
    sizes="340px"
    className="object-cover"
    style={{
      transition: "transform 0.6s ease",
      transform: hovered ? "scale(1.08)" : "scale(1)"
    }}
    priority={index < 3}
  />}
        <span
    style={{
      position: "absolute",
      top: "14px",
      right: "14px",
      zIndex: 5,
      fontFamily: FONT_MONO,
      fontSize: "10px",
      letterSpacing: "0.1em",
      color: "#fff",
      opacity: 0.7
    }}
  >
          {String(index + 1).padStart(2, "0")}
        </span>
        {service.isActive && <div
    style={{
      position: "absolute",
      bottom: "14px",
      left: "14px",
      zIndex: 5,
      width: "40px",
      height: "40px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.18)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
      transition: "transform 0.35s ease",
      transform: hovered ? "rotate(8deg) scale(1.1)" : "rotate(0) scale(1)"
    }}
  >
            <IconComponent size={17} color="#fff" />
          </div>}
      </div>
 
      {
    /* ── Content block ── */
  }
      <div style={{ padding: "24px 26px 28px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <div
    style={{
      width: hovered ? "52px" : "28px",
      height: "3px",
      borderRadius: "99px",
      background: `linear-gradient(90deg, #a10000 0%, #c0392b 100%)`,
      marginBottom: "12px",
      transition: "width 0.4s ease"
    }}
  />
        <h3
    style={{
      fontFamily: FONT_HEADING,
      fontWeight: 700,
      fontSize: "16px",
      letterSpacing: "-0.01em",
      color: "#111",
      marginBottom: "9px",
      lineHeight: 1.3
    }}
  >
          {service.title}
        </h3>
        <p
    style={{
      fontFamily: FONT_BODY,
      fontSize: "13.5px",
      color: "#6b7280",
      lineHeight: 1.68,
      flexGrow: 1,
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden"
    }}
  >
          {service.description}
        </p>

        {
    /* ── CTA row ── */
  }
        <div style={{ marginTop: "18px", display: "flex", alignItems: "center", gap: "6px" }}>
          {service.isActive ? <button
    onClick={(e) => {
      e.stopPropagation();
      onAuditClick(service);
    }}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "7px 14px",
      borderRadius: "99px",
      border: "none",
      background: hovered ? "#a10000" : "#a1000014",
      color: hovered ? "#fff" : "#a10000",
      fontFamily: FONT_BODY,
      fontWeight: 600,
      fontSize: "12.5px",
      cursor: "pointer",
      transition: "all 0.25s ease",
      letterSpacing: "0.02em",
      boxShadow: hovered ? "0 4px 14px #a1000033" : "none"
    }}
  >
              Get a Free Audit
              <div
    style={{
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      background: hovered ? "rgba(255,255,255,0.22)" : "#a1000018",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "transform 0.3s ease",
      transform: hovered ? "translate(2px,-2px)" : "translate(0,0)"
    }}
  >
                <ArrowUpRight size={10} color={hovered ? "#fff" : "#a10000"} />
              </div>
            </button> : <span
    style={{
      fontFamily: FONT_BODY,
      fontWeight: 400,
      fontSize: "12.5px",
      color: "#9ca3af",
      letterSpacing: "0.02em"
    }}
  >
              Coming soon
            </span>}
        </div>
      </div>
 
      <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: "linear-gradient(90deg, #a10000 0%, #c0392b 100%)",
      transformOrigin: "left",
      transform: hovered ? "scaleX(1)" : "scaleX(0)",
      transition: "transform 0.4s ease",
      borderBottomLeftRadius: "18px",
      borderBottomRightRadius: "18px"
    }}
  />
    </article>;
};
const FilterButton = ({ label, icon, active, count, onClick, accentColor = "#a10000" }) => {
  const [hovered, setHovered] = useState(false);
  return <button
    onClick={onClick}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    style={{
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
      gap: "5px",
      padding: "clamp(6px, 2vw, 8px) clamp(8px, 3vw, 16px)",
      borderRadius: "10px",
      border: active ? "none" : `1px solid ${accentColor}22`,
      background: active ? accentColor : hovered ? `${accentColor}0d` : "rgba(255,255,255,0.8)",
      color: active ? "#fff" : hovered ? accentColor : "#64748b",
      fontFamily: FONT_BODY,
      fontWeight: 400,
      fontSize: "clamp(10.5px, 3vw, 12.5px)",
      cursor: "pointer",
      transition: "all 0.22s ease",
      boxShadow: active ? `0 6px 16px ${accentColor}33` : hovered ? `0 2px 8px ${accentColor}18` : "none",
      backdropFilter: "blur(8px)",
      whiteSpace: "nowrap"
    }}
  >
      {icon}
      <span>{label}</span>
      <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "18px",
      height: "18px",
      padding: "0 4px",
      borderRadius: "6px",
      background: active ? "rgba(255,255,255,0.22)" : `${accentColor}14`,
      fontSize: "10px",
      fontWeight: 600,
      color: active ? "#fff" : accentColor,
      lineHeight: 1
    }}
  >
        {count}
      </span>
    </button>;
};
const ServiceCarouselPanel = ({ services, loading, error, onRetry, onSelectService, selectedService, onAuditClick }) => {
  const scrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const draggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const [filterMode, setFilterMode] = useState("all");
  const CARD_WIDTH = 340;
  const GAP = 20;
  const STEP = CARD_WIDTH + GAP;
  const filteredServices = services.filter((s) => {
    if (filterMode === "active") return s.isActive;
    if (filterMode === "coming-soon") return !s.isActive;
    return true;
  });
  const activeCount = services.filter((s) => s.isActive).length;
  const comingSoonCount = services.filter((s) => !s.isActive).length;
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, [filterMode]);
  const manualScroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild;
    const step = firstCard ? firstCard.getBoundingClientRect().width + GAP : STEP;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };
  const onPointerDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    if (e.target.closest("button, a")) return;
    isDraggingRef.current = true;
    draggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragScrollLeftRef.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const el = scrollRef.current;
    if (!isDraggingRef.current || !el) return;
    const delta = e.clientX - dragStartXRef.current;
    if (Math.abs(delta) > 5) draggedRef.current = true;
    el.scrollLeft = dragScrollLeftRef.current - delta;
  };
  const endDrag = (e) => {
    const el = scrollRef.current;
    isDraggingRef.current = false;
    el?.releasePointerCapture?.(e.pointerId);
    if (el && draggedRef.current) {
      const firstCard = el.firstElementChild;
      const step = firstCard ? firstCard.getBoundingClientRect().width + GAP : STEP;
      const nearest = Math.round(el.scrollLeft / step) * step;
      el.scrollTo({ left: nearest, behavior: "smooth" });
    }
  };
  const onClickCapture = (e) => {
    if (draggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      draggedRef.current = false;
    }
  };
  const NavBtn = ({ dir }) => {
    const [h, setH] = useState(false);
    return <button
      onClick={() => manualScroll(dir)}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "11px",
        border: `1px solid ${h ? MAROON : "rgba(0,0,0,0.1)"}`,
        background: h ? MAROON : "rgba(255,255,255,0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.22s ease",
        backdropFilter: "blur(8px)",
        boxShadow: h ? `0 6px 16px ${MAROON}44` : "0 2px 8px rgba(0,0,0,0.08)",
        flexShrink: 0
      }}
    >
        {dir === "left" ? <ChevronLeft size={16} color={h ? "#fff" : "#6b7280"} /> : <ChevronRight size={16} color={h ? "#fff" : "#6b7280"} />}
      </button>;
  };
  return <div style={{ display: "flex", flexDirection: "column", gap: "18px", minWidth: 0 }}>
      {
    /* Filter bar */
  }
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div
    className="scrollbar-hide"
    style={{ display: "flex", gap: "6px", flexWrap: "nowrap", overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
  >
          <FilterButton label="All" icon={<Layers size={12} />} active={filterMode === "all"} count={services.length} onClick={() => setFilterMode("all")} accentColor="#a10000" />
          <FilterButton
    label="Active"
    icon={<span style={{ width: "6px", height: "6px", borderRadius: "50%", background: filterMode === "active" ? "#fff" : "#16a34a", display: "inline-block", flexShrink: 0 }} />}
    active={filterMode === "active"}
    count={activeCount}
    onClick={() => setFilterMode("active")}
    accentColor="#16a34a"
  />
          <FilterButton label="Coming Soon" icon={<Clock size={12} />} active={filterMode === "coming-soon"} count={comingSoonCount} onClick={() => setFilterMode("coming-soon")} accentColor="#64748b" />
        </div>
        {!loading && !error && filteredServices.length > 0 && <div className="hidden sm:flex" style={{ gap: "8px" }}>
            <NavBtn dir="left" />
            <NavBtn dir="right" />
          </div>}
      </div>
 
      {
    /* Content states */
  }
      {loading ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "380px", flexDirection: "column", gap: "12px" }}>
          <Loader2 className="animate-spin" size={32} style={{ color: MAROON }} />
          <p style={{ fontFamily: FONT_BODY, color: "#9ca3af", fontSize: "13px" }}>Loading services…</p>
        </div> : error ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "380px", flexDirection: "column", gap: "12px", textAlign: "center" }}>
          <AlertCircle size={36} color="#ef4444" />
          <p style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: "16px", color: "#111" }}>Something went wrong</p>
          <p style={{ fontFamily: FONT_BODY, color: "#6b7280", fontSize: "13px" }}>{error}</p>
          <button onClick={onRetry} style={{ marginTop: "6px", padding: "10px 24px", borderRadius: "99px", background: MAROON, color: "#fff", fontFamily: FONT_BODY, fontWeight: 600, fontSize: "13px", border: "none", cursor: "pointer" }}>
            Try Again
          </button>
        </div> : filteredServices.length === 0 ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "380px", flexDirection: "column", gap: "12px", textAlign: "center" }}>
          <AlertCircle size={36} color="#9ca3af" />
          <p style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: "16px", color: "#111" }}>No services found</p>
          <p style={{ fontFamily: FONT_BODY, color: "#6b7280", fontSize: "13px" }}>{filterMode === "coming-soon" ? "No coming-soon services at the moment." : "Check back soon."}</p>
        </div> : <>
          <div
    style={{
      overflow: "hidden",
      WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
      maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)"
    }}
  >
            <div
    ref={scrollRef}
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
    onPointerUp={endDrag}
    onPointerLeave={endDrag}
    onPointerCancel={endDrag}
    onClickCapture={onClickCapture}
    className="select-none"
    style={{
      display: "flex",
      gap: `${GAP}px`,
      overflowX: "scroll",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      paddingBottom: "14px",
      paddingTop: "8px",
      cursor: "grab",
      touchAction: "pan-y",
      scrollSnapType: "x mandatory"
    }}
  >
              {filteredServices.map((service, index) => <ServiceCard
    key={service._id}
    service={service}
    index={index}
    onSelect={() => onSelectService(service)}
    onAuditClick={onAuditClick}
    isSelected={selectedService?._id === service._id}
  />)}
            </div>
          </div>

          <div className="flex sm:hidden justify-center" style={{ gap: "8px" }}>
            <NavBtn dir="left" />
            <NavBtn dir="right" />
          </div>
        </>}
    </div>;
};
const CSRPanel = ({ selected, onAuditClick }) => {
  const defaultFeatures = [
    "24/7 inquiry handling",
    "Issue resolution & escalation",
    "Client satisfaction tracking",
    "Omnichannel support"
  ];
  const IconComponent = selected?.icon ?? Headphones;
  const titleWords = selected ? selected.title.split(" ") : ["Customer", "Service & Support"];
  const firstWord = titleWords[0];
  const restWords = titleWords.slice(1).join(" ");
  const displayDescription = selected ? selected.description : "Dedicated customer support services to handle inquiries, resolve issues, and improve client satisfaction.";
  return <div
    style={{
      position: "relative",
      width: "100%",
      maxWidth: "400px",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      transition: "all 0.3s ease"
    }}
  >
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <div
    style={{
      width: "64px",
      height: "64px",
      borderRadius: "18px",
      background: `linear-gradient(145deg, #a10000 0%, ${MAROON_MID} 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      border: "2px solid #a1000022",
      transition: "all 0.3s ease"
    }}
  >
          <IconComponent size={28} color="#fff" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: "22px", letterSpacing: "-0.02em", color: "#282828", lineHeight: 1.2 }}>
            {firstWord}
          </span>
          {restWords && <span style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: "22px", letterSpacing: "-0.02em", color: "#a10000", lineHeight: 1.2 }}>
              {restWords}
            </span>}
        </div>
      </div>

 
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <div style={{ width: "40px", height: "3px", borderRadius: "99px", background: "linear-gradient(90deg, #a10000, #c0392b)" }} />
        <div style={{ width: "10px", height: "3px", borderRadius: "99px", background: "#a1000050" }} />
        <div style={{ width: "5px", height: "3px", borderRadius: "99px", background: "#a1000028" }} />
      </div>

      <p style={{ fontFamily: FONTS.rubik, fontSize: "16px", fontWeight: 400, color: getColorWithOpacity("dark", 0.7), lineHeight: 1.75, margin: "0 0 28px 0", maxWidth: "370px", transition: "all 0.3s ease" }}>
        {displayDescription}
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
        {defaultFeatures.map((f, i) => <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: FONT_BODY, fontSize: "16px", color: "#282828", fontWeight: 700 }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#a1000014", border: "1px solid #a1000025", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="#a10000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {f}
          </li>)}
      </ul>

      {selected && selected.isActive && <div style={{ marginBottom: "36px" }}>
          <button
    onClick={() => onAuditClick(selected)}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 24px",
      borderRadius: "99px",
      border: "none",
      background: "#a10000",
      color: "#fff",
      fontFamily: FONT_BODY,
      fontWeight: 600,
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      letterSpacing: "0.02em",
      boxShadow: "0 4px 14px rgba(161, 0, 0, 0.3)"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 6px 20px rgba(161, 0, 0, 0.4)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 14px rgba(161, 0, 0, 0.3)";
    }}
  >
            Get a Free Audit
            <ArrowUpRight size={16} color="#fff" />
          </button>
        </div>}
 
      <div style={{ position: "absolute", bottom: "-24px", right: "-24px", width: "110px", height: "110px", borderRadius: "32px", border: "2px solid #a1000012", zIndex: 0, transform: "rotate(15deg)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "4px", right: "4px", width: "66px", height: "66px", borderRadius: "20px", border: "2px solid #a1000008", zIndex: 0, transform: "rotate(32deg)", pointerEvents: "none" }} />
    </div>;
};
function ServiceFeatures() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const getImageSource = (coverPhoto, inactivePhoto, isActive, serviceId) => {
    const photo = isActive ? coverPhoto : inactivePhoto ?? coverPhoto;
    if (photo && typeof photo === "string" && photo.trim()) {
      const p = photo.trim();
      if (p.startsWith("data:image")) return p;
      if (p.match(/^[A-Za-z0-9+/]+=*$/) && p.length > 100) return `data:image/jpeg;base64,${p}`;
      if (p.startsWith("http://") || p.startsWith("https://")) return p;
      if (p.startsWith("/")) return p;
    }
    return IMAGE_MAP[serviceId] || "/images/services1.webp";
  };
  const handleAuditClick = (service) => {
    const url = GHL_SERVICE_URLS[service.serviceId] ?? GHL_FALLBACK_URL;
    trackOutboundFunnelView(url, { label: service.title });
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/services`, {
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error(`Failed to load services (${response.status})`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid response format");
      const mapped = data.map((item) => ({
        _id: item._id,
        serviceId: item.serviceId,
        title: item.name.toUpperCase(),
        description: item.description,
        icon: ICON_MAP[item.serviceId] || Layout,
        image: getImageSource(item.coverPhoto, item.inactivePhoto, item.isActive, item.serviceId),
        isActive: item.isActive,
        coverPhoto: item.coverPhoto,
        inactivePhoto: item.inactivePhoto
      }));
      const sorted = [...mapped].sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));
      setServices(sorted);
    } catch (err) {
      setError(err.message || "Could not load services at this time");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchServices();
  }, []);
  return <section className="relative overflow-hidden" style={{ padding: "96px 0 112px" }}>
      {
    /* Background (unchanged) */
  }
      <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "#ffffff" }} />
        <div
    style={{
      position: "absolute",
      inset: 0,
      background: `
              radial-gradient(ellipse 60% 50% at 0% 0%,   #f3f4f6 0%, transparent 65%),
              radial-gradient(ellipse 55% 50% at 100% 100%, #f1f2f4 0%, transparent 60%)
            `
    }}
  />
        <svg
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
    viewBox="0 0 1440 900"
  >
          <defs>
            <linearGradient id="grayFill1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#d1d5db" stopOpacity="0.35" /><stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.1" /></linearGradient>
            <linearGradient id="grayFill2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#9ca3af" stopOpacity="0.18" /><stop offset="100%" stopColor="#d1d5db" stopOpacity="0.06" /></linearGradient>
            <linearGradient id="grayFill3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.28" /><stop offset="100%" stopColor="#f3f4f6" stopOpacity="0.08" /></linearGradient>
            <linearGradient id="grayStroke1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#9ca3af" stopOpacity="0.5" /><stop offset="100%" stopColor="#d1d5db" stopOpacity="0.1" /></linearGradient>
            <linearGradient id="grayStroke2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#6b7280" stopOpacity="0.2" /><stop offset="100%" stopColor="#9ca3af" stopOpacity="0.05" /></linearGradient>
            <filter id="grayBlur"><feGaussianBlur stdDeviation="3" /></filter>
            <filter id="grayBlurSm"><feGaussianBlur stdDeviation="1" /></filter>
          </defs>
          <rect x="-140" y="-140" width="500" height="500" rx="90" fill="url(#grayFill1)" transform="rotate(22, 110, 110)" filter="url(#grayBlur)" />
          <circle cx="1390" cy="-80" r="300" fill="url(#grayFill2)" filter="url(#grayBlur)" />
          <circle cx="-50" cy="970" r="240" fill="url(#grayFill3)" filter="url(#grayBlur)" />
          <rect x="1080" y="680" width="460" height="460" rx="100" fill="url(#grayFill1)" transform="rotate(-16, 1310, 910)" filter="url(#grayBlur)" />
          <ellipse cx="720" cy="-60" rx="340" ry="190" fill="url(#grayFill2)" filter="url(#grayBlur)" />
          <rect x="70" y="370" width="130" height="130" rx="20" fill="url(#grayFill1)" transform="rotate(45, 135, 435)" filter="url(#grayBlurSm)" />
          <rect x="910" y="50" width="210" height="210" rx="44" fill="url(#grayFill3)" transform="rotate(12, 1015, 155)" filter="url(#grayBlurSm)" />
          <rect x="550" y="730" width="110" height="110" rx="14" fill="url(#grayFill2)" transform="rotate(45, 605, 785)" filter="url(#grayBlurSm)" />
          <rect x="1340" y="430" width="90" height="90" rx="18" fill="url(#grayFill1)" transform="rotate(-25, 1385, 475)" filter="url(#grayBlurSm)" />
          <circle cx="1310" cy="130" r="190" fill="none" stroke="url(#grayStroke1)" strokeWidth="1.5" />
          <circle cx="1310" cy="130" r="245" fill="none" stroke="url(#grayStroke2)" strokeWidth="1" strokeDasharray="7 13" />
          <circle cx="1310" cy="130" r="300" fill="none" stroke="#e5e7eb" strokeOpacity="0.6" strokeWidth="0.8" strokeDasharray="4 18" />
          <circle cx="130" cy="790" r="160" fill="none" stroke="url(#grayStroke1)" strokeWidth="1.5" />
          <circle cx="130" cy="790" r="210" fill="none" stroke="url(#grayStroke2)" strokeWidth="1" strokeDasharray="6 14" />
          <circle cx="130" cy="790" r="265" fill="none" stroke="#e5e7eb" strokeOpacity="0.5" strokeWidth="0.8" strokeDasharray="3 18" />
          <circle cx="720" cy="450" r="380" fill="none" stroke="#e5e7eb" strokeOpacity="0.8" strokeWidth="1" strokeDasharray="5 22" />
          <circle cx="720" cy="450" r="460" fill="none" stroke="#f3f4f6" strokeOpacity="0.9" strokeWidth="0.7" strokeDasharray="3 26" />
          <rect x="55" y="55" width="110" height="110" rx="20" fill="none" stroke="url(#grayStroke1)" strokeWidth="1.5" transform="rotate(18, 110, 110)" />
          <rect x="1260" y="370" width="85" height="85" rx="16" fill="none" stroke="url(#grayStroke1)" strokeWidth="1.5" transform="rotate(-28, 1302, 412)" />
          <rect x="655" y="795" width="65" height="65" rx="11" fill="none" stroke="url(#grayStroke2)" strokeWidth="1.2" transform="rotate(45, 687, 827)" />
          <rect x="860" y="30" width="50" height="50" rx="10" fill="none" stroke="#d1d5db" strokeOpacity="0.7" strokeWidth="1" transform="rotate(30, 885, 55)" />
          {Array.from({ length: 6 }).map((_, row) => Array.from({ length: 6 }).map((_2, col) => <circle key={`dot-tr-${row}-${col}`} cx={1080 + col * 24} cy={70 + row * 24} r="2.2" fill="#9ca3af" fillOpacity={Math.max(0.04, 0.18 - row * 0.022 - col * 0.01)} />))}
          {Array.from({ length: 6 }).map((_, row) => Array.from({ length: 6 }).map((_2, col) => <circle key={`dot-bl-${row}-${col}`} cx={210 + col * 24} cy={740 + row * 24} r="2.2" fill="#9ca3af" fillOpacity={Math.max(0.03, 0.15 - row * 0.018 - col * 0.01)} />))}
          {Array.from({ length: 4 }).map((_, row) => Array.from({ length: 4 }).map((_2, col) => <circle key={`dot-cr-${row}-${col}`} cx={1200 + col * 20} cy={460 + row * 20} r="1.8" fill="#d1d5db" fillOpacity={Math.max(0.04, 0.14 - row * 0.02)} />))}
          <line x1="0" y1="0" x2="380" y2="280" stroke="#e5e7eb" strokeOpacity="0.9" strokeWidth="1" />
          <line x1="1440" y1="0" x2="1060" y2="320" stroke="#e5e7eb" strokeOpacity="0.9" strokeWidth="1" />
          <line x1="0" y1="900" x2="360" y2="600" stroke="#e5e7eb" strokeOpacity="0.8" strokeWidth="1" />
          <line x1="1440" y1="900" x2="1080" y2="580" stroke="#e5e7eb" strokeOpacity="0.8" strokeWidth="1" />
          <polygon points="1390,210 1425,270 1355,270" fill="none" stroke="#d1d5db" strokeOpacity="0.6" strokeWidth="1.2" />
          <polygon points="75,710 55,750 95,750" fill="none" stroke="#d1d5db" strokeOpacity="0.5" strokeWidth="1" />
          <polygon points="700,44 720,14 740,44" fill="none" stroke="#d1d5db" strokeOpacity="0.5" strokeWidth="1" />
          <polygon points="400,820 418,854 382,854" fill="none" stroke="#e5e7eb" strokeOpacity="0.7" strokeWidth="1" />
        </svg>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)", backgroundSize: "36px 36px", opacity: 0.25 }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, rgba(255,255,255,0.7) 0%, transparent 8%, transparent 92%, rgba(255,255,255,0.7) 100%), linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, transparent 10%, transparent 90%, rgba(255,255,255,0.6) 100%)` }} />
      </div>
 
      {
    /* ── Content ── */
  }
      <div className="relative z-10 mx-auto px-6 lg:px-8" style={{ maxWidth: "1360px" }}>
        <div style={{ marginBottom: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "36px", height: "2px", background: "#a10000", borderRadius: "99px" }} />
            <span style={{ fontFamily: FONTS.openSans, fontSize: "14px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#a10000", fontWeight: 700 }}>
              Our Services
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
            <h2 style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: "clamp(26px, 7vw, 48px)", letterSpacing: "-0.03em", color: "#282828", lineHeight: 1.15, margin: 0 }}>
              Services Designed to<br />
              <span style={{ color: "#a10000" }}>Meet Every Need</span>
            </h2>
            <p style={{ fontFamily: FONTS.rubik, fontSize: "16px", fontWeight: 400, color: getColorWithOpacity("dark", 0.7), lineHeight: 1.75, maxWidth: "400px", margin: 0 }}>
              From customer support to technical assistance, we provide comprehensive solutions that drive your business forward.
            </p>
          </div>
        </div>
 
        {
    /* Two-column layout */
  }
        <div style={{ display: "flex", alignItems: "flex-start", gap: "56px", flexWrap: "wrap" }}>
          <CSRPanel selected={selectedService} onAuditClick={handleAuditClick} />
          <div className="hidden lg:block" style={{ width: "1px", alignSelf: "stretch", flexShrink: 0, background: "linear-gradient(to bottom, transparent, #a1000022 20%, #a1000022 80%, transparent)" }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <ServiceCarouselPanel
    services={services}
    loading={loading}
    error={error}
    onRetry={fetchServices}
    onSelectService={setSelectedService}
    selectedService={selectedService}
    onAuditClick={handleAuditClick}
  />
          </div>
        </div>
      </div>
    </section>;
}
export {
  ServiceFeatures as default
};
