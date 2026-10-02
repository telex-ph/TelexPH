import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Clock, FileText, PackageSearch, PhoneCall, TriangleAlert } from "lucide-react";
import { COLORS } from "@/constant/styles";

const RED = COLORS.primary; // #a10000
const CHARCOAL = COLORS.dark; // #282828
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };

// DRAFT intro copy (not from the approved brief): edit freely.
const INTRO_TITLE = "What the Team Handles";
const INTRO_TEXT = "From shipment-status enquiries to delivery exceptions, this is the day-to-day work the team can take on within your agreed processes.";

const SCOPE = [
  "Shipment-status enquiries using information in your systems",
  "Customer follow-ups on outstanding delivery concerns",
  "Ticket documentation and updates",
  "Escalation of delivery exceptions to the right internal team",
  "Additional service-hour coverage based on agreed staffing and requirements",
];

const ICONS = [PackageSearch, PhoneCall, FileText, TriangleAlert, Clock];

// Card look, in order: light, charcoal, light, red, light.
const LOOKS = [
  { bg: "#f3f4f6", fg: CHARCOAL, num: RED },
  { bg: CHARCOAL, fg: "#fff", num: "#fff" },
  { bg: "#f3f4f6", fg: CHARCOAL, num: RED },
  { bg: RED, fg: "#fff", num: "#fff" },
  { bg: "#f3f4f6", fg: CHARCOAL, num: RED },
];

const STEP_VH = 55; // scroll distance per card
const NAV_H = "7.5rem"; // Telex fixed header (top bar + nav)
const PIN_H = `min(calc(100vh - ${NAV_H}), 44rem)`; // max height of the pinned block
const STAGE_H = "min(24rem, calc(100vh - 25rem))";
const ease = (t) => 1 - Math.pow(1 - t, 3);

/* Dashed route that fills as the cards advance, with a marker riding the filled part. */
const ROUTE_D = "M20 110 C 110 110, 90 30, 200 60 S 320 120, 380 30";
const Route = ({ progress }) => {
  const pathRef = useRef(null);
  const [pt, setPt] = useState({ x: 20, y: 110 });
  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    const { x, y } = el.getPointAtLength(len * progress);
    setPt({ x, y });
  }, [progress]);
  return (
    <svg aria-hidden viewBox="0 0 400 140" className="w-full h-auto overflow-visible" fill="none">
      <path ref={pathRef} d={ROUTE_D} stroke="rgba(255,255,255,.25)" strokeWidth="3" strokeDasharray="3 9" strokeLinecap="round" />
      <path d={ROUTE_D} stroke={RED} strokeWidth="3.5" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} style={{ transition: "stroke-dashoffset .3s" }} />
      <circle cx="20" cy="110" r="8" fill="#fff" />
      <path d="M380 6 a18 18 0 0 1 18 18 c0 14 -18 30 -18 30 s-18 -16 -18 -30 a18 18 0 0 1 18 -18z" fill="#fff" />
      <circle cx="380" cy="24" r="6" fill={CHARCOAL} />
      {/* marker */}
      <circle cx={pt.x} cy={pt.y} r="14" fill="#fff" opacity=".18" />
      <circle cx={pt.x} cy={pt.y} r="6.5" fill="#fff" stroke={RED} strokeWidth="3" style={{ transition: "cx .3s, cy .3s" }} />
    </svg>
  );
};

/* One pinned stage: the left panel stays put and each card rises from below, one after
   another, as the page scrolls (scroll progress drives the transforms). */
const LogisticsScope = () => {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;
      const { top, height } = track.getBoundingClientRect();
      const span = height - stage.offsetHeight;
      const stuckAt = parseFloat(getComputedStyle(stage).top) || 0;
      setProgress(span > 0 ? Math.min(Math.max((stuckAt - top) / span, 0), 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const n = SCOPE.length;
  const scrolled = progress * (n - 1);
  const active = Math.min(Math.round(scrolled), n - 1);

  return (
    <section id="support" className="px-4 bg-white">

      <div ref={trackRef} className="max-w-6xl mx-auto" style={{ height: `calc(${PIN_H} + ${(n - 1) * STEP_VH}vh)` }}>
        <div
          ref={stageRef}
          className="sticky flex flex-col justify-center"
          style={{ top: `calc(${NAV_H} + (100vh - ${NAV_H} - ${PIN_H}) / 2)`, height: PIN_H }}
        >
          <div className="text-center mb-5 md:mb-6">
            <p aria-hidden className="mb-1 text-lg font-bold italic tracking-[0.2em] leading-none" style={{ color: RED, ...display }}>///</p>
            <h3 className="text-3xl md:text-5xl uppercase font-bold leading-[1.02]" style={{ ...display, color: CHARCOAL }}>{INTRO_TITLE}</h3>
            <div className="mx-auto mt-3 h-1 w-14" style={{ backgroundColor: RED }} />
            <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base leading-relaxed text-gray-600">{INTRO_TEXT}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6" style={{ height: STAGE_H }}>
            <div
              className="rounded-3xl p-6 md:p-10 flex flex-col justify-between text-white overflow-hidden relative min-h-[11rem]"
              style={{ background: `linear-gradient(160deg, #141414 0%, ${CHARCOAL} 60%, #3a0a0a 100%)` }}
            >
              <div aria-hidden className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 36px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 36px)" }} />
              <motion.div aria-hidden className="absolute -bottom-16 -right-12 w-56 h-56 rounded-full blur-3xl bg-[#a10000] opacity-40" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
              <div aria-hidden className="absolute inset-x-4 bottom-10 opacity-80 pointer-events-none hidden sm:block">
                <Route progress={scrolled / (n - 1)} />
              </div>
              <h2 className="relative text-4xl md:text-6xl uppercase font-bold leading-[0.95]" style={display}>
                Support for the Work Around Every Delivery
              </h2>
              <div className="relative flex gap-1.5 mt-6" aria-hidden>
                {SCOPE.map((_, i) => (
                  <span key={i} className="h-0.5 flex-1 rounded-full transition-colors duration-300" style={{ backgroundColor: i <= active ? "#fff" : "rgba(255,255,255,.2)" }} />
                ))}
              </div>
            </div>

            <ul className="relative" style={{ clipPath: "inset(-40px -40px 0 -40px)" }}>
              {SCOPE.map((item, i) => {
                const look = LOOKS[i];
                const Icon = ICONS[i];
                const isActive = i === active;
                const onRed = look.bg === RED;
                const t = i === 0 ? 1 : ease(Math.min(Math.max(scrolled - (i - 1), 0), 1));
                return (
                  <li
                    key={item}
                    className="absolute inset-0 overflow-hidden rounded-3xl p-6 md:p-10 flex items-center gap-5 md:gap-8 will-change-transform"
                    style={{
                      backgroundColor: look.bg,
                      color: look.fg,
                      zIndex: i + 1,
                      transform: `translateY(${(1 - t) * 110}%) scale(${1 - 0.035 * Math.min(Math.max(scrolled - i, 0), 4)})`,
                      transformOrigin: "top center",
                      boxShadow: "0 -12px 30px rgba(40,40,40,.15)",
                    }}
                  >
                    <Icon aria-hidden className="absolute -right-6 -bottom-6 w-44 h-44 md:w-56 md:h-56 pointer-events-none" strokeWidth={1} style={{ color: look.fg, opacity: 0.07 }} />
                    <span aria-hidden className="absolute top-0 left-0 h-1.5 transition-all duration-500" style={{ width: isActive ? "100%" : "0%", backgroundColor: onRed || look.bg === CHARCOAL ? "#fff" : RED, opacity: 0.85 }} />
                    <span className="relative text-6xl md:text-9xl font-bold leading-none" style={{ ...display, color: look.num }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="relative flex-1">
                      <span
                        className="mb-3 inline-flex w-10 h-10 md:w-12 md:h-12 rounded-xl items-center justify-center"
                        style={{ backgroundColor: onRed || look.bg === CHARCOAL ? "rgba(255,255,255,.16)" : RED, color: "#fff" }}
                      >
                        <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.9} />
                      </span>
                      <span className="block text-lg md:text-2xl font-semibold leading-snug">{item}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="mt-6 text-sm md:text-base text-gray-600">
            The final scope depends on your systems, enquiry volume, access requirements, and operating procedures.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LogisticsScope;
