"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Layout, Loader2, AlertCircle, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const DARK_RED = "#a10000";
const HOVER_DARK_RED = "#850000";
const DEFAULT_MAX_WIDTH_CLASS = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
// Points directly to the Express backend (same as ListServices.tsx) to avoid
// Next.js API route proxies that may filter isActive=true by default.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://telexph-admin.onrender.com";

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  "ai-builder": (<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="7.5 4.21 12 6.81 16.5 4.21"/><polyline points="7.5 19.79 7.5 14.6 3 12"/><polyline points="21 12 16.5 14.6 16.5 19.79"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>),
  "automation": (<><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>),
  "booking-appointment": (<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>),
  "courses-products": (<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>),
  "crm": (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>),
  "csr": (<><path d="M20 7h-4a2 2 0 0 1-2-2V3M4 7h4a2 2 0 0 0 2-2V3"/><path d="M12 12h.01"/><path d="M12 8h.01"/><path d="M12 16h.01"/></>),
  "email-marketing": (<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>),
  "funnel-builder": (<><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></>),
  "gray-label": (<><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>),
  "social-media-management": (<><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></>),
  "survey-forms": (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>),
  "tech-support": (<><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>),
  "web-development": (<><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>),
};

const IMAGE_MAP: Record<string, string> = {
  "ai-builder": "/images/services1.webp",
  "automation": "/images/services2.webp",
  "booking-appointment": "/images/services3.webp",
  "courses-products": "/images/services4.webp",
  "crm": "/images/services5.webp",
  "csr": "/images/services6.webp",
  "email-marketing": "/images/services1.webp",
  "funnel-builder": "/images/services2.webp",
  "gray-label": "/images/services3.webp",
  "social-media-management": "/images/services4.webp",
  "survey-forms": "/images/services5.webp",
  "tech-support": "/images/services6.webp",
  "web-development": "/images/services1.webp",
};

const SERVICE_META: Record<string, { detail1: string; detail2: string; detail3: string; blurb: string }> = {
  "ai-builder":              { detail1: "AI Powered",    detail2: "Custom Models",  detail3: "Fast Setup",     blurb: "Build intelligent AI-powered tools tailored to your business with zero technical experience required." },
  "automation":              { detail1: "Workflow",       detail2: "No-Code",        detail3: "24/7 Active",    blurb: "Automate repetitive tasks and workflows so your team can focus on what truly matters." },
  "booking-appointment":     { detail1: "Scheduling",    detail2: "Reminders",      detail3: "Multi-Channel",  blurb: "Let clients book appointments seamlessly with automated reminders and calendar sync." },
  "courses-products":        { detail1: "E-Learning",    detail2: "Payments",       detail3: "Certificates",   blurb: "Create and sell online courses or digital products with built-in payment processing." },
  "crm":                     { detail1: "Contacts",      detail2: "Pipelines",      detail3: "Analytics",      blurb: "Manage leads, track deals, and grow relationships with a powerful CRM system." },
  "csr":                     { detail1: "Support",       detail2: "Ticketing",      detail3: "Live Chat",      blurb: "Deliver exceptional customer service with ticketing, live chat, and support automation." },
  "email-marketing":         { detail1: "Campaigns",     detail2: "Automation",     detail3: "A/B Testing",    blurb: "Launch targeted email campaigns that convert, with smart automation and analytics." },
  "funnel-builder":          { detail1: "Landing Pages", detail2: "Lead Gen",       detail3: "Conversions",    blurb: "Design high-converting sales funnels and landing pages to grow your customer base." },
  "gray-label":              { detail1: "White Label",   detail2: "Branding",       detail3: "Resell Ready",   blurb: "Offer our platform under your own brand and expand your service portfolio effortlessly." },
  "social-media-management": { detail1: "Scheduling",    detail2: "Analytics",      detail3: "Multi-Platform", blurb: "Plan, schedule, and analyze your social media presence across all major platforms." },
  "survey-forms":            { detail1: "Forms",         detail2: "Responses",      detail3: "Reports",        blurb: "Collect valuable feedback and data with custom forms, surveys, and detailed reports." },
  "tech-support":            { detail1: "24/7 Help",     detail2: "Remote Fix",     detail3: "Fast Response",  blurb: "Get reliable technical support whenever you need it — fast, remote, and always available." },
  "web-development":         { detail1: "Custom Dev",    detail2: "Responsive",     detail3: "SEO Ready",      blurb: "Launch beautiful, fast, and SEO-optimized websites built to represent your brand perfectly." },
};

interface ServiceType {
  _id: string;
  serviceId: string;
  title: string;
  imageSrc: string;
  isHighlight: boolean;
  icon: React.ReactNode;
  description: string;
  coverPhoto?: string | null;
}

// ─── Card ─────────────────────────────────────────────────────────────────────

const ServiceCard = ({ service, index = 0 }: { service: ServiceType; index?: number }) => {
  const shouldPrioritize = index < 4;
  // Use native <img> for base64 data URLs and external http/https URLs (e.g. Cloudinary).
  // next/image requires external hostnames to be whitelisted in next.config.ts —
  // using <img> avoids that requirement entirely for dynamically-sourced images.
  const useNativeImg =
    service.imageSrc.startsWith("data:image") ||
    service.imageSrc.startsWith("http://") ||
    service.imageSrc.startsWith("https://");
  const meta = SERVICE_META[service.serviceId] || {
    detail1: "Feature 1", detail2: "Feature 2", detail3: "Feature 3",
    blurb: service.description || "Explore this service to learn how it can help your business grow.",
  };

  return (
    <div
      className="group w-full rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
      style={{
        boxShadow: "0 2px 20px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10" }}>
        {useNativeImg ? (
          <img
            src={service.imageSrc}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading={shouldPrioritize ? "eager" : "lazy"}
          />
        ) : (
          <Image
            src={service.imageSrc}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            priority={shouldPrioritize}
            loading={shouldPrioritize ? "eager" : "lazy"}
            sizes="(max-width: 768px) 90vw, 33vw"
          />
        )}
        <button
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:scale-110 hover:bg-white"
          aria-label="Save service"
          onClick={(e) => e.preventDefault()}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="px-5 pt-4 pb-5">

        {/* Title — Poppins 500 */}
        <h3
          className="text-gray-900 leading-snug line-clamp-1 mb-1"
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "15px" }}
        >
          {service.title}
        </h3>

        {/* Location — Open Sans 400 */}
        <div className="flex items-center gap-1 mb-2">
          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 400, fontSize: "11px", color: "#9ca3af" }}>
            Remote · Digital Service
          </span>
        </div>

        {/* Description — Open Sans 400 */}
        <p
          className="text-gray-500 mb-3 leading-relaxed line-clamp-2"
          style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 400, fontSize: "12px" }}
        >
          {meta.blurb}
        </p>

        {/* Meta row — Open Sans 400 */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          <svg className="w-3 h-3 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {service.icon}
          </svg>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 400, fontSize: "11px", color: "#6b7280" }}>{meta.detail1}</span>
          <span style={{ color: "#d1d5db", fontSize: "11px" }}>·</span>
          <svg className="w-3 h-3 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 400, fontSize: "11px", color: "#6b7280" }}>{meta.detail2}</span>
          <span style={{ color: "#d1d5db", fontSize: "11px" }}>·</span>
          <svg className="w-3 h-3 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 400, fontSize: "11px", color: "#6b7280" }}>{meta.detail3}</span>
        </div>

        <div className="w-full h-px bg-gray-100 mb-4" />

        {/* Learn More — Poppins 400 */}
        <div className="flex justify-end">
          <Link
            href="/services"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white transition-all hover:opacity-90 active:scale-95 shadow-sm"
            style={{ backgroundColor: "#1a1a1a", fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: "13px" }}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── View All Button ──────────────────────────────────────────────────────────

const ViewAllServicesButton: React.FC<{ isLargeScreenHeader?: boolean }> = ({ isLargeScreenHeader = false }) => (
  <div className={isLargeScreenHeader ? "hidden lg:flex" : "flex justify-center mt-10 lg:hidden"}>
    <Link href="/services" className={`flex items-center gap-3 group ${isLargeScreenHeader ? "mt-6 md:mt-0" : ""}`}>
      <button
        className="flex items-center justify-center rounded-full text-white transition-all hover:scale-105 shadow-lg"
        style={{ backgroundColor: DARK_RED, width: isLargeScreenHeader ? "60px" : "44px", height: isLargeScreenHeader ? "60px" : "44px" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = HOVER_DARK_RED)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = DARK_RED)}
      >
        <ArrowUpRight className={`rotate-[15deg] ${isLargeScreenHeader ? "w-6 h-6" : "w-5 h-5"}`} />
      </button>
      <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "16px", color: "#111827" }}
        className="transition-colors group-hover:text-gray-600">
        View All Services
      </span>
    </Link>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const CARDS_PER_PAGE = 3;
const AUTO_INTERVAL = 4000;

function ServicesGrid() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const autoRef = useRef<NodeJS.Timeout | null>(null);
  const isHovering = useRef(false);

  const getImageSource = (item: any): string => {
    // Use inactivePhoto when service is inactive, coverPhoto when active
    const photo = item.isActive
      ? (item.coverPhoto ?? item.inactivePhoto)
      : (item.inactivePhoto ?? item.coverPhoto);

    if (photo && typeof photo === "string" && photo.trim()) {
      const t = photo.trim();
      if (t.startsWith("data:image")) return t;
      if (t.match(/^[A-Za-z0-9+/]+={0,2}$/) && t.length > 100) return `data:image/jpeg;base64,${t}`;
      if (t.startsWith("http://") || t.startsWith("https://")) return t;
      if (t.startsWith("/")) return t;
    }
    return IMAGE_MAP[item.serviceId] || "/images/services1.webp";
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/services`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Failed to load services (${response.status})`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid response format");
      setServices(data.map((item: any) => ({
        _id: item._id,
        serviceId: item.serviceId,
        title: item.name,
        description: item.description,
        imageSrc: getImageSource(item),
        coverPhoto: item.coverPhoto,
        isHighlight: item.serviceId === "tech-support",
        icon: ICON_MAP[item.serviceId] || <Layout className="w-full h-full" />,
      })).sort((a: any, b: any) => {
        // Active services first, inactive last
        const aActive = data.find((d: any) => d._id === a._id)?.isActive ?? false;
        const bActive = data.find((d: any) => d._id === b._id)?.isActive ?? false;
        if (aActive === bActive) return 0;
        return aActive ? -1 : 1;
      }));
    } catch (err: any) {
      setError(err.message || "Could not load services at this time");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  // Total pages: each page shows CARDS_PER_PAGE new cards
  const totalPages = Math.ceil(services.length / CARDS_PER_PAGE);

  const goTo = useCallback((page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  }, [totalPages]);

  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      if (!isHovering.current) setCurrentPage((p) => (p + 1 >= totalPages ? 0 : p + 1));
    }, AUTO_INTERVAL);
  }, [totalPages]);

  useEffect(() => {
    if (services.length > CARDS_PER_PAGE) startAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [services.length, startAuto]);

  return (
    <>
      {/* Load Poppins + Open Sans from Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Open+Sans:wght@400&display=swap');
      `}</style>

      <div id="services" className="bg-white py-16">
        <div className={DEFAULT_MAX_WIDTH_CLASS}>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-14">
            <div>
              <p
                className="mb-3 uppercase tracking-widest flex items-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "12px", color: DARK_RED }}
              >
                <span className="w-8 h-[2px] inline-block" style={{ backgroundColor: DARK_RED }} />
                OUR SERVICES
              </p>
              <h2
                className="text-gray-900 leading-tight max-w-lg"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
              >
                Services Designed to Meet Every Need
              </h2>
            </div>
            <ViewAllServicesButton isLargeScreenHeader={true} />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: DARK_RED }} />
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 400, fontSize: "13px", color: "#6b7280" }}>
              Fetching latest services...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "18px" }} className="text-gray-800 mb-1">Something went wrong</p>
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 400, fontSize: "13px" }} className="text-gray-500 mb-6">{error}</p>
            <button onClick={fetchServices} className="px-6 py-2 text-white rounded-full transition-all"
              style={{ backgroundColor: DARK_RED, fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = HOVER_DARK_RED)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = DARK_RED)}>
              Try Again
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "18px" }} className="text-gray-800">No services available</p>
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 400, fontSize: "13px" }} className="text-gray-500">Check back soon for updates</p>
          </div>
        ) : (
          <div className={DEFAULT_MAX_WIDTH_CLASS}>
            <div
              className="relative px-8"
              onMouseEnter={() => { isHovering.current = true; }}
              onMouseLeave={() => { isHovering.current = false; }}
            >
              {/* Left Arrow */}
              {totalPages > 1 && (
                <button
                  onClick={() => { goTo(currentPage - 1); startAuto(); }}
                  disabled={currentPage === 0}
                  className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ backgroundColor: currentPage === 0 ? "#e5e7eb" : DARK_RED, color: currentPage === 0 ? "#9ca3af" : "#ffffff" }}
                  aria-label="Previous services"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Right Arrow */}
              {totalPages > 1 && (
                <button
                  onClick={() => { goTo(currentPage + 1); startAuto(); }}
                  disabled={currentPage >= totalPages - 1}
                  className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ backgroundColor: currentPage >= totalPages - 1 ? "#e5e7eb" : DARK_RED, color: currentPage >= totalPages - 1 ? "#9ca3af" : "#ffffff" }}
                  aria-label="Next services"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Sliding track */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    width: `${totalPages * 100}%`,
                    transform: `translateX(-${(currentPage / totalPages) * 100}%)`,
                  }}
                >
                  {Array.from({ length: totalPages }).map((_, pageIdx) => (
                    <div
                      key={pageIdx}
                      className="grid grid-cols-3 gap-5"
                      style={{ width: `${100 / totalPages}%`, flexShrink: 0 }}
                    >
                      {services
                        .slice(pageIdx * CARDS_PER_PAGE, pageIdx * CARDS_PER_PAGE + CARDS_PER_PAGE)
                        .map((service, idx) => (
                          <ServiceCard
                            key={service._id}
                            service={service}
                            index={pageIdx * CARDS_PER_PAGE + idx}
                          />
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { goTo(i); startAuto(); }}
                    className="rounded-full h-[7px] transition-all duration-300"
                    style={{ width: i === currentPage ? "26px" : "7px", backgroundColor: i === currentPage ? DARK_RED : "#d1d5db" }}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}

            <ViewAllServicesButton isLargeScreenHeader={false} />
          </div>
        )}
      </div>
    </>
  );
}

export default ServicesGrid;