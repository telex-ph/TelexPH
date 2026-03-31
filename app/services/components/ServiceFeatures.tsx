"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { COLORS, FONT_CLASSES } from "@/constant/styles";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const VISIBLE_COUNT = 6;

const ICON_MAP: Record<string, any> = {
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
  "web-development": Code,
};

const IMAGE_MAP: Record<string, string> = {
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
  "web-development": "/images/services1.webp",
};

const ACCENT_COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

interface ServiceType {
  _id: string;
  serviceId: string;
  title: string;
  description: string;
  icon: any;
  image: string;
  accentColor: string;
  isActive: boolean;
  coverPhoto?: string | null;
  inactivePhoto?: string | null;
}

/* ─── Portrait Card ───────────────────────────────────────────── */
const PortraitCard: React.FC<{
  service: ServiceType;
  index: number;
  isActive: boolean;
  onClick: () => void;
}> = ({ service, index, isActive, onClick }) => {
  const IconComponent = service.icon;
  const isExternal =
    service.image.startsWith("http://") ||
    service.image.startsWith("https://") ||
    service.image.startsWith("data:image");

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "pointer",
        flexShrink: 0,
        width: isActive ? "clamp(200px, 28vw, 300px)" : "clamp(100px, 13vw, 160px)",
        height: "clamp(340px, 46vw, 500px)",
        transition: "width 0.55s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease",
        boxShadow: isActive
          ? `0 32px 72px -12px ${service.accentColor}50, 0 8px 32px rgba(0,0,0,0.18)`
          : "0 4px 20px rgba(0,0,0,0.12)",
      }}
    >
      {/* Background image */}
      {isExternal ? (
        <img
          src={service.image}
          alt={service.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
            transition: "transform 0.6s ease",
            transform: isActive ? "scale(1.04)" : "scale(1)",
          }}
        />
      ) : (
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 50vw, 28vw"
          style={{
            objectFit: "cover",
            objectPosition: "center top",
            transition: "transform 0.6s ease",
            transform: isActive ? "scale(1.04)" : "scale(1)",
          }}
        />
      )}

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.0) 80%)",
          zIndex: 2,
        }}
      />

      {/* Accent color wash on active */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(160deg, ${service.accentColor}42 0%, transparent 55%)`,
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.5s ease",
          zIndex: 3,
        }}
      />

      {/* Icon pill — top left */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          zIndex: 5,
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconComponent size={17} color="#fff" />
      </div>

      {/* Index number — top right */}
      <span
        style={{
          position: "absolute",
          top: "18px",
          right: "16px",
          zIndex: 5,
          fontFamily: "'DM Mono', monospace",
          fontSize: "10px",
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.55)",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Bottom content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 5,
          padding: "20px 18px",
        }}
      >
        <div
          style={{
            width: isActive ? "36px" : "20px",
            height: "2px",
            borderRadius: "99px",
            background: service.accentColor,
            marginBottom: "10px",
            transition: "width 0.4s ease",
          }}
        />
        <h3
          style={{
            fontFamily: "'Clash Display', 'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: isActive ? "15px" : "11px",
            letterSpacing: "-0.01em",
            color: "#fff",
            marginBottom: "4px",
            lineHeight: 1.25,
            transition: "font-size 0.4s ease",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {service.title}
        </h3>
        <div
          style={{
            overflow: "hidden",
            maxHeight: isActive ? "30px" : "0px",
            opacity: isActive ? 1 : 0,
            transition: "max-height 0.5s ease, opacity 0.4s ease",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              color: "rgba(255,255,255,0.68)",
              letterSpacing: "0.01em",
            }}
          >
            {service.isActive ? "Active Service" : "Coming Soon"}
          </span>
        </div>
      </div>

      {/* Active left border accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "3px",
          background: service.accentColor,
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.4s ease",
          zIndex: 6,
          borderTopLeftRadius: "20px",
          borderBottomLeftRadius: "20px",
        }}
      />
    </div>
  );
};

/* ─── Show All Button ─────────────────────────────────────────── */
const ShowAllButton: React.FC<{
  showAll: boolean;
  onClick: () => void;
  total: number;
}> = ({ showAll, onClick, total }) => {
  const [hovered, setHovered] = useState(false);
  const accent = COLORS.primary || "#6366f1";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginTop: "48px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", maxWidth: "320px" }}>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #e2e8f0)" }} />
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#cbd5e1" }} />
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, #e2e8f0)" }} />
      </div>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "13px 32px",
          borderRadius: "14px",
          border: "none",
          background: hovered ? accent : "#fff",
          color: hovered ? "#fff" : "#374151",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: "14px",
          letterSpacing: "0.01em",
          cursor: "pointer",
          transition: "all 0.25s ease",
          transform: hovered ? "translateY(-1px)" : "translateY(0)",
          boxShadow: hovered
            ? `0 12px 28px ${accent}40`
            : "0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        <span>{showAll ? "Show Less" : "View All Services"}</span>
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "6px",
            background: hovered ? "rgba(255,255,255,0.2)" : "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {showAll
            ? <ChevronUp size={13} color={hovered ? "#fff" : "#64748b"} />
            : <ChevronDown size={13} color={hovered ? "#fff" : "#64748b"} />}
        </div>
      </button>
    </div>
  );
};

/* ─── Main Component ──────────────────────────────────────────── */
export default function ServiceFeatures() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const getImageSource = (
    coverPhoto: string | null | undefined,
    inactivePhoto: string | null | undefined,
    isActive: boolean,
    serviceId: string
  ): string => {
    const photo = isActive ? coverPhoto : inactivePhoto ?? coverPhoto;
    if (photo && typeof photo === "string" && photo.trim()) {
      const p = photo.trim();
      if (p.startsWith("data:image")) return p;
      if (p.match(/^[A-Za-z0-9+/]+=*$/) && p.length > 100)
        return `data:image/jpeg;base64,${p}`;
      if (p.startsWith("http://") || p.startsWith("https://")) return p;
      if (p.startsWith("/")) return p;
    }
    return IMAGE_MAP[serviceId] || "/images/services1.webp";
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/services`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Failed to load services (${response.status})`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid response format");

      const mapped: ServiceType[] = data.map((item: any, index: number) => ({
        _id: item._id,
        serviceId: item.serviceId,
        title: item.name.toUpperCase(),
        description: item.description,
        icon: ICON_MAP[item.serviceId] || Layout,
        image: getImageSource(item.coverPhoto, item.inactivePhoto, item.isActive, item.serviceId),
        accentColor: ACCENT_COLORS[index % ACCENT_COLORS.length],
        isActive: item.isActive,
        coverPhoto: item.coverPhoto,
        inactivePhoto: item.inactivePhoto,
      }));

      const sorted = [...mapped].sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));
      setServices(sorted);
    } catch (err: any) {
      setError(err.message || "Could not load services at this time");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const visibleServices = showAll ? services : services.slice(0, VISIBLE_COUNT);
  const hasMore = services.length > VISIBLE_COUNT;
  const activeService = visibleServices[activeIndex] ?? null;

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? visibleServices.length - 1 : i - 1));
  }, [visibleServices.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === visibleServices.length - 1 ? 0 : i + 1));
  }, [visibleServices.length]);

  useEffect(() => {
    if (activeIndex >= visibleServices.length && visibleServices.length > 0) {
      setActiveIndex(visibleServices.length - 1);
    }
  }, [visibleServices.length]);

  useEffect(() => {
    if (mobileScrollRef.current) {
      const card = mobileScrollRef.current.children[activeIndex] as HTMLElement;
      if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIndex]);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #f8f9ff 0%, #f0f4ff 50%, #faf8ff 100%)",
        padding: "96px 0 112px",
      }}
    >
      {/* Blobs */}
      <div style={{ position: "absolute", top: "-120px", left: "-120px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, #6366f122 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, #f59e0b18 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #00000008 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

      <div className="relative z-10 mx-auto" style={{ maxWidth: "1300px", padding: "0 24px" }}>

        {/* Section header */}
        <div style={{ marginBottom: "56px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "36px", height: "2px", background: COLORS.primary || "#6366f1", borderRadius: "99px" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: COLORS.primary || "#6366f1", fontWeight: 500 }}>
              Our Services
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
            <h2 style={{ fontFamily: "'Clash Display', 'DM Sans', sans-serif", fontWeight: 700, fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.1, margin: 0 }}>
              Services Designed to
              <br />
              <span style={{ color: COLORS.primary || "#6366f1" }}>Meet Every Need</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#64748b", lineHeight: 1.75, maxWidth: "380px", margin: 0 }}>
              From customer support to technical assistance, we provide comprehensive solutions that drive your business forward.
            </p>
          </div>
        </div>

        {/* States */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "16px" }}>
            <Loader2 className="animate-spin" size={40} style={{ color: COLORS.primary || "#6366f1" }} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#9ca3af", fontSize: "14px" }}>Loading our services…</p>
          </div>
        ) : error ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0", gap: "12px", textAlign: "center" }}>
            <AlertCircle size={44} color="#ef4444" />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "18px", color: "#111" }}>Something went wrong</p>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>{error}</p>
            <button onClick={fetchServices} style={{ marginTop: "8px", padding: "12px 28px", borderRadius: "99px", background: COLORS.primary || "#6366f1", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px", border: "none", cursor: "pointer" }}>
              Try Again
            </button>
          </div>
        ) : services.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0", gap: "12px", textAlign: "center" }}>
            <AlertCircle size={44} color="#9ca3af" />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "18px", color: "#111" }}>No services available</p>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>Check back soon for updates.</p>
          </div>
        ) : (
          <>
            {/* ══════════════════════════════════
                DESKTOP — portrait fan + left panel
            ══════════════════════════════════ */}
            <div className="hidden md:flex" style={{ gap: "48px", alignItems: "center" }}>

              {/* Left description panel */}
              <div style={{ flexShrink: 0, width: "240px" }}>
                {activeService && (
                  <div key={activeService._id} style={{ animation: "fadeSlideIn 0.38s ease" }}>
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "16px",
                        background: `${activeService.accentColor}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <activeService.icon size={24} color={activeService.accentColor} />
                    </div>

                    <div style={{ width: "40px", height: "3px", borderRadius: "99px", background: activeService.accentColor, marginBottom: "16px" }} />

                    <h3 style={{ fontFamily: "'Clash Display', 'DM Sans', sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.025em", color: "#0f172a", marginBottom: "14px", lineHeight: 1.2 }}>
                      {activeService.title}
                    </h3>

                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#64748b", lineHeight: 1.8, marginBottom: "28px" }}>
                      {activeService.description}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: activeService.accentColor, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        Learn more
                      </span>
                      <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: activeService.accentColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ArrowUpRight size={13} color="#fff" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation arrows */}
                <div style={{ display: "flex", gap: "10px", marginTop: "40px", alignItems: "center" }}>
                  <button
                    onClick={prev}
                    aria-label="Previous service"
                    style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1.5px solid #e2e8f0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", transition: "all 0.2s ease" }}
                    onMouseEnter={(e) => { const b = e.currentTarget; b.style.background = activeService?.accentColor || "#6366f1"; b.style.borderColor = "transparent"; }}
                    onMouseLeave={(e) => { const b = e.currentTarget; b.style.background = "#fff"; b.style.borderColor = "#e2e8f0"; }}
                  >
                    <ChevronLeft size={18} color="#374151" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next service"
                    style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1.5px solid #e2e8f0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", transition: "all 0.2s ease" }}
                    onMouseEnter={(e) => { const b = e.currentTarget; b.style.background = activeService?.accentColor || "#6366f1"; b.style.borderColor = "transparent"; }}
                    onMouseLeave={(e) => { const b = e.currentTarget; b.style.background = "#fff"; b.style.borderColor = "#e2e8f0"; }}
                  >
                    <ChevronRight size={18} color="#374151" />
                  </button>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#94a3b8", letterSpacing: "0.05em" }}>
                    {String(activeIndex + 1).padStart(2, "0")} / {String(visibleServices.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Portrait card fan */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  overflow: "hidden",
                  padding: "20px 0",
                }}
              >
                {visibleServices.map((service, index) => (
                  <PortraitCard
                    key={service._id}
                    service={service}
                    index={index}
                    isActive={index === activeIndex}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════
                MOBILE — info panel + scroll strip
            ══════════════════════════════════ */}
            <div className="md:hidden">
              {/* Info panel */}
              {activeService && (
                <div key={activeService._id} style={{ marginBottom: "28px", padding: "0 4px", animation: "fadeSlideIn 0.38s ease" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `${activeService.accentColor}16`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                    <activeService.icon size={22} color={activeService.accentColor} />
                  </div>
                  <div style={{ width: "32px", height: "3px", borderRadius: "99px", background: activeService.accentColor, marginBottom: "12px" }} />
                  <h3 style={{ fontFamily: "'Clash Display', 'DM Sans', sans-serif", fontWeight: 700, fontSize: "20px", letterSpacing: "-0.02em", color: "#0f172a", marginBottom: "10px", lineHeight: 1.25 }}>
                    {activeService.title}
                  </h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#64748b", lineHeight: 1.75 }}>
                    {activeService.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "12px", color: activeService.accentColor, letterSpacing: "0.04em", textTransform: "uppercase" }}>Learn more</span>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: activeService.accentColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ArrowUpRight size={12} color="#fff" />
                    </div>
                  </div>
                </div>
              )}

              {/* Portrait scroll strip */}
              <div
                ref={mobileScrollRef}
                style={{ display: "flex", gap: "10px", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "8px", scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {visibleServices.map((service, index) => (
                  <div
                    key={service._id}
                    onClick={() => setActiveIndex(index)}
                    style={{
                      position: "relative",
                      borderRadius: "18px",
                      overflow: "hidden",
                      cursor: "pointer",
                      flexShrink: 0,
                      scrollSnapAlign: "start",
                      width: index === activeIndex ? "55vw" : "30vw",
                      height: "260px",
                      transition: "width 0.5s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease",
                      boxShadow: index === activeIndex
                        ? `0 20px 48px -10px ${service.accentColor}45`
                        : "0 2px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    {service.image.startsWith("http") || service.image.startsWith("data:") ? (
                      <img src={service.image} alt={service.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                    ) : (
                      <Image src={service.image} alt={service.title} fill sizes="55vw" style={{ objectFit: "cover", objectPosition: "center top" }} />
                    )}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.08) 60%)" }} />
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${service.accentColor}35 0%, transparent 55%)`, opacity: index === activeIndex ? 1 : 0.3, transition: "opacity 0.4s" }} />
                    <div style={{ position: "absolute", top: "12px", left: "12px", width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <service.icon size={15} color="#fff" />
                    </div>
                    <div style={{ position: "absolute", bottom: "14px", left: "14px", right: "14px" }}>
                      <div style={{ width: index === activeIndex ? "28px" : "16px", height: "2px", borderRadius: "99px", background: service.accentColor, marginBottom: "8px", transition: "width 0.4s" }} />
                      <p style={{ fontFamily: "'Clash Display', 'DM Sans', sans-serif", fontWeight: 700, fontSize: index === activeIndex ? "13px" : "11px", color: "#fff", lineHeight: 1.2, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", transition: "font-size 0.4s" }}>
                        {service.title}
                      </p>
                    </div>
                    <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "3px", background: service.accentColor, opacity: index === activeIndex ? 1 : 0, transition: "opacity 0.4s", borderTopLeftRadius: "18px", borderBottomLeftRadius: "18px" }} />
                  </div>
                ))}
              </div>

              {/* Mobile nav */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "20px", padding: "0 4px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={prev} aria-label="Previous" style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1.5px solid #e2e8f0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
                    <ChevronLeft size={16} color="#374151" />
                  </button>
                  <button onClick={next} aria-label="Next" style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1.5px solid #e2e8f0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
                    <ChevronRight size={16} color="#374151" />
                  </button>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {visibleServices.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      style={{ width: i === activeIndex ? "24px" : "7px", height: "7px", borderRadius: "99px", background: i === activeIndex ? (activeService?.accentColor || COLORS.primary || "#6366f1") : "#d1d5db", border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 }}
                      aria-label={`Go to service ${i + 1}`}
                    />
                  ))}
                </div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#94a3b8" }}>
                  {String(activeIndex + 1).padStart(2, "0")}/{String(visibleServices.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Show All */}
            {hasMore && (
              <ShowAllButton
                showAll={showAll}
                onClick={() => { setShowAll((prev) => !prev); setActiveIndex(0); }}
                total={services.length}
              />
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}