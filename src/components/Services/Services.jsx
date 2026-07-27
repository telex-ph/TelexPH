
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Layout, Loader2, AlertCircle, Clock } from "lucide-react";
import { trackOutboundFunnelView } from "@/lib/track-funnel-view";
const DARK_RED = "#a10000";
const HOVER_DARK_RED = "#850000";
const DEFAULT_MAX_WIDTH_CLASS = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
const API_BASE_URL = "https://telexph-admin.onrender.com/api";
const GAP = 24;
const SLIDE_DURATION = 520;
const AUTO_INTERVAL = 3800;
const GHL_SERVICE_URLS = {
  "ai-builder": "https://app.gohighlevel.com/v2/preview/he3Ot8ymGgW3kL2QxH9t",
  csr: "https://app.gohighlevel.com/v2/preview/ibY6nU0jCLIQNHOgScWG",
  automation: "https://app.gohighlevel.com/v2/preview/n6hA9geZeMpPR4znvPAm",
  "funnel-builder": "https://app.gohighlevel.com/v2/preview/oMEKJgm8HwQDG47bxMbc",
  "tech-support": "https://app.gohighlevel.com/v2/preview/DTmridl6UOnMYfnEgY2b",
  "web-development": "https://app.gohighlevel.com/v2/preview/CslyXVQZdPxdsrtvohsu"
};
const GHL_FALLBACK_URL = "https://app.gohighlevel.com/v2/preview/he3Ot8ymGgW3kL2QxH9t";
function getCardsVisible(width) {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 3;
}
function useCardsVisible() {
  const [cardsVisible, setCardsVisible] = useState(3);
  useEffect(() => {
    const update = () => setCardsVisible(getCardsVisible(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cardsVisible;
}
const ICON_MAP = {
  "ai-builder": <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="7.5 4.21 12 6.81 16.5 4.21" /><polyline points="7.5 19.79 7.5 14.6 3 12" /><polyline points="21 12 16.5 14.6 16.5 19.79" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>,
  "automation": <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
  "booking-appointment": <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
  "courses-products": <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
  "crm": <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  "csr": <><path d="M20 7h-4a2 2 0 0 1-2-2V3M4 7h4a2 2 0 0 0 2-2V3" /><path d="M12 12h.01" /><path d="M12 8h.01" /><path d="M12 16h.01" /></>,
  "email-marketing": <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
  "funnel-builder": <><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></>,
  "gray-label": <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></>,
  "social-media-management": <><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></>,
  "survey-forms": <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>,
  "tech-support": <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
  "web-development": <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
  "document-signing": <><path d="M12 22h8a2 2 0 002-2V6l-6-6H6a2 2 0 00-2 2v12a2 2 0 002 2z" /><path d="M14 2v4a2 2 0 002 2h4M16 13H8M16 17H8M10 9H8" /></>,
  "sms": <><path d="M22 16.92v3a2 2 0 01-2.58 1.91L10 18l-2 1v-4H4a2 2 0 01-2-2v-7a2 2 0 012-2h16a2 2 0 012 2v7.92z" /><path d="M8 10h.01M12 10h.01M16 10h.01" /></>,
  "video-graphics-design": <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /><path d="M7 15h6" /></>,
  "website-builder": <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
  "white-label": <><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></>
};
const IMAGE_MAP = {
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
  "document-signing": "/images/services2.webp",
  "sms": "/images/services3.webp",
  "video-graphics-design": "/images/services4.webp",
  "website-builder": "/images/services5.webp",
  "white-label": "/images/services6.webp"
};
const SERVICE_META = {
  "ai-builder": { tag: "AI", detail1: "AI Powered", detail2: "Custom Models", detail3: "Fast Setup", blurb: "Build intelligent AI-powered tools tailored to your business with zero technical experience required." },
  "automation": { tag: "Automation", detail1: "Workflow", detail2: "No-Code", detail3: "24/7 Active", blurb: "Automate repetitive tasks and workflows so your team can focus on what truly matters." },
  "booking-appointment": { tag: "Scheduling", detail1: "Scheduling", detail2: "Reminders", detail3: "Multi-Channel", blurb: "Let clients book appointments seamlessly with automated reminders and calendar sync." },
  "courses-products": { tag: "E-Learning", detail1: "E-Learning", detail2: "Payments", detail3: "Certificates", blurb: "Create and sell online courses or digital products with built-in payment processing." },
  "crm": { tag: "CRM", detail1: "Contacts", detail2: "Pipelines", detail3: "Analytics", blurb: "Manage leads, track deals, and grow relationships with a powerful CRM system." },
  "csr": { tag: "Support", detail1: "Support", detail2: "Ticketing", detail3: "Live Chat", blurb: "Deliver exceptional customer service with ticketing, live chat, and support automation." },
  "email-marketing": { tag: "Marketing", detail1: "Campaigns", detail2: "Automation", detail3: "A/B Testing", blurb: "Launch targeted email campaigns that convert, with smart automation and analytics." },
  "funnel-builder": { tag: "Funnels", detail1: "Landing Pages", detail2: "Lead Gen", detail3: "Conversions", blurb: "Design high-converting sales funnels and landing pages to grow your customer base." },
  "gray-label": { tag: "White Label", detail1: "White Label", detail2: "Branding", detail3: "Resell Ready", blurb: "Offer our platform under your own brand and expand your service portfolio effortlessly." },
  "social-media-management": { tag: "Social", detail1: "Scheduling", detail2: "Analytics", detail3: "Multi-Platform", blurb: "Plan, schedule, and analyze your social media presence across all major platforms." },
  "survey-forms": { tag: "Forms", detail1: "Forms", detail2: "Responses", detail3: "Reports", blurb: "Collect valuable feedback and data with custom forms, surveys, and detailed reports." },
  "tech-support": { tag: "Support", detail1: "24/7 Help", detail2: "Remote Fix", detail3: "Fast Response", blurb: "Get reliable technical support whenever you need it \u2014 fast, remote, and always available." },
  "web-development": { tag: "Development", detail1: "Custom Dev", detail2: "Responsive", detail3: "SEO Ready", blurb: "Launch beautiful, fast, and SEO-optimized websites built to represent your brand perfectly." },
  "document-signing": { tag: "Documents", detail1: "Digital Sign", detail2: "Secure", detail3: "Workflow", blurb: "Streamline your document workflow with secure digital signature solutions." },
  "sms": { tag: "SMS", detail1: "High Open Rate", detail2: "Instant", detail3: "Automation", blurb: "Reach customers directly with powerful SMS marketing and communication solutions." },
  "video-graphics-design": { tag: "Design", detail1: "Professional", detail2: "Video", detail3: "Brand", blurb: "Create stunning visual content and videos that captivate your audience." },
  "website-builder": { tag: "Builder", detail1: "Drag & Drop", detail2: "No Coding", detail3: "Mobile Ready", blurb: "Build professional websites with our intuitive drag-and-drop website builder." },
  "white-label": { tag: "White Label", detail1: "Full Branding", detail2: "Custom Features", detail3: "Revenue Share", blurb: "Offer our complete platform under your brand with full customization options." }
};
const ServiceCard = ({ service, index = 0 }) => {
  const shouldPrioritize = index < 4;
  const useNativeImg = service.imageSrc.startsWith("data:image") || service.imageSrc.startsWith("http://") || service.imageSrc.startsWith("https://");
  const meta = SERVICE_META[service.serviceId] || {
    tag: "Service",
    detail1: "Feature 1",
    detail2: "Feature 2",
    detail3: "Feature 3",
    blurb: service.description || "Explore this service to learn how it can help your business grow."
  };
  return <div
    className="group relative flex flex-col overflow-hidden rounded-2xl bg-white"
    style={{
      fontFamily: "'Open Sans', sans-serif",
      border: "1px solid #f0f0f0",
      transition: "box-shadow 0.3s ease, transform 0.3s ease",
      boxShadow: "0 1px 6px rgba(0,0,0,0.06)"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)";
      e.currentTarget.style.transform = "translateY(-5px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.06)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
      {
    /* Image */
  }
      <div className="relative w-full overflow-hidden aspect-[16/10] sm:aspect-[4/3]">
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
      fontFamily: "'Poppins', sans-serif",
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
        {useNativeImg ? <Image
    src={service.imageSrc}
    alt={service.title}
    fill
    className="object-cover"
    style={{ transition: "transform 0.5s ease" }}
    priority={shouldPrioritize}
    sizes="(max-width: 768px) 90vw, 33vw"
  /> : <Image
    src={service.imageSrc}
    alt={service.title}
    fill
    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
    priority={shouldPrioritize}
    loading={shouldPrioritize ? "eager" : "lazy"}
    sizes="(max-width: 768px) 90vw, 33vw"
  />}

        {
    /* Category pill */
  }
        <div
    style={{
      position: "absolute",
      top: 12,
      left: 12,
      background: "rgba(255,255,255,0.93)",
      borderRadius: "999px",
      padding: "3px 11px",
      fontSize: "10px",
      fontWeight: 600,
      color: DARK_RED,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontFamily: "'Poppins', sans-serif"
    }}
  >
          {meta.tag}
        </div>

        {
    /* Save button */
  }
        <button
    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full"
    style={{ background: "rgba(255,255,255,0.93)", transition: "transform 0.2s" }}
    aria-label="Save service"
    onClick={(e) => e.preventDefault()}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {
    /* Body */
  }
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {
    /* Icon + title */
  }
        <div className="flex items-start gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
          <div
    className="flex-shrink-0 flex items-center justify-center rounded-xl"
    style={{ width: 34, height: 34, background: "#fff5f5", border: "1px solid #fde0e0" }}
  >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={DARK_RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {service.icon}
            </svg>
          </div>
          <h3
    className="flex-1 leading-snug line-clamp-2"
    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "13px", color: "#111827", marginTop: 3 }}
  >
            {service.title}
          </h3>
        </div>

        {
    /* Description */
  }
        <p
    className="line-clamp-2 flex-1 mb-3 sm:mb-4"
    style={{ fontSize: "11.5px", color: "#6b7280", lineHeight: 1.6 }}
  >
          {meta.blurb}
        </p>

        {
    /* Feature chips */
  }
        <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
          {[meta.detail1, meta.detail2, meta.detail3].map((chip) => <span
    key={chip}
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "3px 9px",
      borderRadius: "999px",
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      fontSize: "10px",
      fontWeight: 500,
      color: "#374151",
      fontFamily: "'Poppins', sans-serif"
    }}
  >
              {chip}
            </span>)}
        </div>

        <div style={{ height: 1, background: "#f3f4f6", marginBottom: 12 }} />

        {
    /* Footer */
  }
        <div className="flex items-center justify-between">
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Remote · Digital</span>
          {service.isActive ? <button
    type="button"
    onClick={() => {
      const url = GHL_SERVICE_URLS[service.serviceId] ?? GHL_FALLBACK_URL;
      trackOutboundFunnelView(url, { label: service.title });
      window.open(url, "_blank", "noopener,noreferrer");
    }}
    className="flex items-center gap-1.5 rounded-xl text-white"
    style={{
      backgroundColor: DARK_RED,
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
      fontSize: "12px",
      padding: "7px 14px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s, transform 0.15s"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = HOVER_DARK_RED;
      e.currentTarget.style.transform = "scale(1.04)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = DARK_RED;
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
              <ArrowUpRight width={13} height={13} />
              Get a Free Audit
            </button> : <span
    style={{
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 400,
      fontSize: "12px",
      color: "#9ca3af",
      letterSpacing: "0.02em"
    }}
  >
              Coming soon
            </span>}
        </div>
      </div>
    </div>;
};
const ViewAllServicesButton = ({ isLargeScreenHeader = false }) => <div className={isLargeScreenHeader ? "hidden lg:flex" : "flex justify-center mt-10 lg:hidden"}>
    <Link href="/services" className={`flex items-center gap-3 group ${isLargeScreenHeader ? "mt-6 md:mt-0" : ""}`}>
      <button
  className="flex items-center justify-center rounded-full text-white transition-all hover:scale-105 shadow-lg"
  style={{ backgroundColor: DARK_RED, width: isLargeScreenHeader ? "60px" : "44px", height: isLargeScreenHeader ? "60px" : "44px" }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = HOVER_DARK_RED}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = DARK_RED}
>
        <ArrowUpRight className={`rotate-[15deg] ${isLargeScreenHeader ? "w-6 h-6" : "w-5 h-5"}`} />
      </button>
      <span
  style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "16px", color: "#111827" }}
  className="transition-colors group-hover:text-gray-600"
>
        View All Services
      </span>
    </Link>
  </div>;
function TrackSlider({ extended, index, animated, cardsVisible, busy, onSwipePrev, onSwipeNext, onDragStart, onDragEnd }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const draggedRef = useRef(false);
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setCardWidth((w - GAP * (cardsVisible - 1)) / cardsVisible);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [cardsVisible]);
  useEffect(() => {
    if (!trackRef.current || cardWidth === 0) return;
    const tx = -(index * (cardWidth + GAP));
    trackRef.current.style.transition = animated ? `transform ${SLIDE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)` : "none";
    trackRef.current.style.transform = `translateX(${tx}px)`;
  }, [index, animated, cardWidth]);
  const snapBack = () => {
    if (!trackRef.current) return;
    trackRef.current.style.transition = `transform ${SLIDE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    trackRef.current.style.transform = `translateX(${-(index * (cardWidth + GAP))}px)`;
  };
  const handlePointerDown = (e) => {
    if (busy || cardWidth === 0) return;
    if (e.target.closest("button, a")) return;
    isDraggingRef.current = true;
    draggedRef.current = false;
    startXRef.current = e.clientX;
    onDragStart();
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
      trackRef.current.setPointerCapture(e.pointerId);
    }
  };
  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    const delta = e.clientX - startXRef.current;
    if (Math.abs(delta) > 4) draggedRef.current = true;
    const base = -(index * (cardWidth + GAP));
    trackRef.current.style.transform = `translateX(${base + delta}px)`;
  };
  const endDrag = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const delta = e.clientX - startXRef.current;
    const threshold = Math.max(40, cardWidth * 0.18);
    if (delta <= -threshold) {
      onSwipeNext();
    } else if (delta >= threshold) {
      onSwipePrev();
    } else {
      snapBack();
    }
    onDragEnd();
  };
  return <div
    ref={containerRef}
    style={{ width: "100%", overflow: "hidden", touchAction: "pan-y", cursor: busy ? "default" : "grab" }}
    onPointerDown={handlePointerDown}
    onPointerMove={handlePointerMove}
    onPointerUp={endDrag}
    onPointerCancel={endDrag}
    onClickCapture={(e) => {
      if (draggedRef.current) {
        e.preventDefault();
        e.stopPropagation();
        draggedRef.current = false;
      }
    }}
  >
      <div ref={trackRef} style={{ display: "flex", gap: `${GAP}px`, willChange: "transform" }}>
        {extended.map((service, i) => <div
    key={`${service._id}-${i}`}
    style={{
      flexShrink: 0,
      width: cardWidth > 0 ? `${cardWidth}px` : `calc((100% - ${GAP * (cardsVisible - 1)}px) / ${cardsVisible})`
    }}
  >
            <ServiceCard service={service} index={i} />
          </div>)}
      </div>
    </div>;
}
function ServicesGrid() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardsVisible = useCardsVisible();
  const [index, setIndex] = useState(cardsVisible);
  const [animated, setAnimated] = useState(true);
  const [busy, setBusy] = useState(false);
  const isHovering = useRef(false);
  const autoRef = useRef(null);
  useEffect(() => {
    setAnimated(false);
    setIndex(cardsVisible);
    requestAnimationFrame(() => setAnimated(true));
  }, [cardsVisible]);
  const totalPages = Math.ceil(services.length / cardsVisible);
  const activePage = services.length > 0 ? Math.floor((index - cardsVisible) % services.length / cardsVisible) : 0;
  const extended = services.length > 0 ? [...services.slice(-cardsVisible), ...services, ...services.slice(0, cardsVisible)] : [];
  const slideTo = useCallback((newIndex, withAnim = true) => {
    if (busy) return;
    setAnimated(withAnim);
    setBusy(withAnim);
    setIndex(newIndex);
    if (withAnim) {
      setTimeout(() => {
        setBusy(false);
        setIndex((prev) => {
          const real = services.length;
          if (prev >= cardsVisible + real) return prev - real;
          if (prev < cardsVisible) return prev + real;
          return prev;
        });
        setAnimated(false);
        requestAnimationFrame(() => setAnimated(true));
      }, SLIDE_DURATION + 20);
    }
  }, [busy, services.length, cardsVisible]);
  const advance = useCallback(() => {
    if (!isHovering.current) slideTo(index + cardsVisible);
  }, [index, slideTo, cardsVisible]);
  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    if (services.length > cardsVisible) {
      autoRef.current = setInterval(advance, AUTO_INTERVAL);
    }
  }, [advance, services.length, cardsVisible]);
  useEffect(() => {
    resetAuto();
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [resetAuto]);
  const slideByOne = useCallback((direction) => {
    slideTo(index + direction);
    resetAuto();
  }, [index, slideTo, resetAuto]);
  const goToPage = useCallback((page) => {
    slideTo(cardsVisible + page * cardsVisible);
    resetAuto();
  }, [slideTo, resetAuto, cardsVisible]);
  const getImageSource = (item) => {
    const photo = item.isActive ? item.coverPhoto ?? item.inactivePhoto : item.inactivePhoto ?? item.coverPhoto;
    if (photo && typeof photo === "string" && photo.trim()) {
      const t = photo.trim();
      if (t.startsWith("data:image")) return t;
      if (t.match(/^[A-Za-z0-9+/]+={0,2}$/) && t.length > 100) return `data:image/jpeg;base64,${t}`;
      // Some records store http:// URLs; the deployed site is HTTPS, so the
      // browser blocks those as mixed content. Upgrade them.
      if (t.startsWith("http://")) return t.replace(/^http:\/\//, "https://");
      if (t.startsWith("https://")) return t;
      if (t.startsWith("/")) return t;
    }
    return IMAGE_MAP[item.serviceId] || "/images/services1.webp";
  };
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error(`Failed to load services (${response.status})`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid response format");
      setServices(
        data.map((item) => ({
          _id: item._id,
          serviceId: item.serviceId,
          title: item.name,
          description: item.description,
          imageSrc: getImageSource(item),
          coverPhoto: item.coverPhoto,
          isHighlight: item.serviceId === "tech-support",
          isActive: item.isActive ?? false,
          icon: ICON_MAP[item.serviceId] || <Layout className="w-full h-full" />
        })).sort((a, b) => Number(b.isActive) - Number(a.isActive))
      );
    } catch (err) {
      setError(err.message || "Could not load services at this time");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchServices();
  }, []);
  return <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Open+Sans:wght@400&display=swap');
        .sv-dot { border-radius: 999px; height: 7px; cursor: pointer; border: none; transition: width 0.3s ease, background-color 0.3s ease; padding: 0; }
      `}</style>

      <div id="services" className="bg-white py-16">
        <div className={DEFAULT_MAX_WIDTH_CLASS}>
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

        {loading ? <div className="flex flex-col justify-center items-center h-64 gap-4">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: DARK_RED }} />
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 400, fontSize: "13px", color: "#6b7280" }}>
              Fetching latest services...
            </p>
          </div> : error ? <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "18px" }} className="text-gray-800 mb-1">Something went wrong</p>
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 400, fontSize: "13px" }} className="text-gray-500 mb-6">{error}</p>
            <button
    onClick={fetchServices}
    className="px-6 py-2 text-white rounded-full"
    style={{ backgroundColor: DARK_RED, fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = HOVER_DARK_RED}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = DARK_RED}
  >
              Try Again
            </button>
          </div> : services.length === 0 ? <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "18px" }} className="text-gray-800">No services available</p>
            <p style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 400, fontSize: "13px" }} className="text-gray-500">Check back soon for updates</p>
          </div> : <div className={DEFAULT_MAX_WIDTH_CLASS}>
            <div
    onMouseEnter={() => {
      isHovering.current = true;
    }}
    onMouseLeave={() => {
      isHovering.current = false;
    }}
  >
              <TrackSlider
    extended={extended}
    index={index}
    animated={animated}
    cardsVisible={cardsVisible}
    busy={busy}
    onSwipePrev={() => slideByOne(-1)}
    onSwipeNext={() => slideByOne(1)}
    onDragStart={() => {
      isHovering.current = true;
    }}
    onDragEnd={() => {
      isHovering.current = false;
    }}
  />
            </div>

            {totalPages > 1 && <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }).map((_, i) => <button
    key={i}
    className="sv-dot"
    style={{
      width: i === activePage ? "26px" : "7px",
      backgroundColor: i === activePage ? DARK_RED : "#d1d5db"
    }}
    onClick={() => goToPage(i)}
    aria-label={`Go to slide group ${i + 1}`}
  />)}
              </div>}

            <ViewAllServicesButton isLargeScreenHeader={false} />
          </div>}
      </div>
    </>;
}
var stdin_default = ServicesGrid;
export {
  stdin_default as default
};
