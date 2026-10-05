import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HiChevronRight } from "react-icons/hi2";
import { Mail, MapPin, Phone } from "lucide-react";
import FooterLogo from "@/components/Footer/FooterLogo";
import FooterBottom from "@/components/Footer/FooterBottom";
import { getLogisticsTabs } from "./LogisticsNav";
import { DISCOVERY_CALL_URL } from "@/constant/links";
import { COLORS } from "@/constant/styles";

const RED = COLORS.primary; // #a10000
const WIDTH = "w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8";

const Truck = ({ fill = "#fff", scale = 1 }) => (
  <svg viewBox="0 0 120 44" className="h-9 w-auto" style={{ transform: `scale(${scale})`, transformOrigin: "bottom left" }}>
    <rect x="0" y="4" width="76" height="30" rx="2" fill={fill} />
    <rect x="0" y="18" width="76" height="6" fill={RED} />
    <path d="M80 12 h14 l10 12 v10 h-24z" fill={RED} />
    <path d="M84 15 h8 l6 8 h-14z" fill="#cfd8dc" />
    {[14, 32, 92].map((cx) => (
      <g key={cx}><circle cx={cx} cy="36" r="6" fill="#111" /><circle cx={cx} cy="36" r="2.4" fill="#9ca3af" /></g>
    ))}
  </svg>
);

/* The top of the footer is a small harbour at night: skyline, a crane, a plane crossing the sky,
   and trucks driving along the road. */
const Harbour = () => {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="relative h-28 sm:h-32 overflow-hidden" style={{ background: "linear-gradient(180deg, #1c1c1c 0%, #161616 100%)" }}>
      {/* stars */}
      {[8, 20, 33, 47, 58, 70, 83, 93].map((l, i) => (
        <motion.span key={i} className="absolute w-[3px] h-[3px] rounded-full bg-white" style={{ left: `${l}%`, top: `${8 + ((i * 17) % 38)}%` }}
          animate={reduce ? { opacity: 0.4 } : { opacity: [0.15, 0.9, 0.15] }} transition={{ duration: 2.4 + (i % 4), repeat: Infinity, delay: i * 0.3 }} />
      ))}

      {/* plane crossing the sky */}
      {!reduce && (
        <motion.svg viewBox="0 0 50 24" className="absolute top-3 h-5 w-auto" initial={{ x: "-10vw" }} animate={{ x: "110vw" }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear", repeatDelay: 3 }}>
          <path d="M5 12 L-1 3 L2 3 L8 11 Z M5 12 L-1 21 L2 21 L8 13 Z" fill="#cfd4da" transform="translate(14 0)" />
          <path d="M46 12 C 42 8.5, 12 8.5, 8 10.6 L 8 13.4 C 12 15.5, 42 15.5, 46 12 Z" fill="#fff" />
          <rect x="14" y="11.4" width="24" height="1.2" fill={RED} />
        </motion.svg>
      )}

      {/* skyline silhouette */}
      <svg viewBox="0 0 1200 70" preserveAspectRatio="none" className="absolute bottom-10 inset-x-0 w-full h-14" fill="#222">
        <path d="M0 70 V40 h40 V28 h30 V40 h40 V20 h50 V40 h60 V32 h36 V40 h70 V14 h24 V40 h60 V30 h50 V40 h80 V24 h40 V40 h60 V34 h46 V40 h70 V18 h30 V40 h60 V28 h44 V40 h60 V22 h36 V40 h80 V70 Z" />
      </svg>
      {/* crane */}
      <svg viewBox="0 0 120 80" className="absolute bottom-10 left-[6%] h-20 w-auto" fill="none" stroke="#3a3a3a" strokeWidth="3">
        <line x1="20" y1="80" x2="20" y2="10" /><line x1="76" y1="80" x2="76" y2="10" />
        <line x1="4" y1="12" x2="116" y2="12" strokeWidth="4" />
        <line x1="20" y1="34" x2="76" y2="34" strokeWidth="2" />
        <motion.g animate={reduce ? {} : { x: [0, 52, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
          <line x1="40" y1="14" x2="40" y2="40" strokeWidth="1.5" stroke="#6b6b6b" />
          <rect x="30" y="40" width="20" height="10" fill={RED} stroke="none" />
        </motion.g>
      </svg>

      {/* road */}
      <div className="absolute bottom-0 inset-x-0 h-10 bg-[#0f0f0f] border-t border-white/10" />
      <motion.div
        className="absolute bottom-[18px] inset-x-0 h-0.5"
        style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.5) 0 22px, transparent 22px 44px)" }}
        animate={reduce ? {} : { backgroundPositionX: ["0px", "-44px"] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div className="absolute bottom-[6px] left-0" initial={{ x: "-20vw" }}
        animate={reduce ? { x: "40vw" } : { x: ["-20vw", "110vw"] }} transition={reduce ? { duration: 0 } : { duration: 14, repeat: Infinity, ease: "linear" }}>
        <Truck />
      </motion.div>
      {!reduce && (
        <motion.div className="absolute bottom-[6px] left-0" initial={{ x: "110vw" }} animate={{ x: "-25vw" }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 5 }}>
          <div style={{ transform: "scaleX(-1)" }}><Truck fill="#e5e7eb" scale={0.8} /></div>
        </motion.div>
      )}
    </div>
  );
};

const jumpTo = (e, href) => {
  const el = document.querySelector(href);
  if (!el) {
    // on the legal pages the sections live on the landing page
    e.preventDefault();
    window.location.href = `/logistics${href}`;
    return;
  }
  e.preventDefault();
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: "smooth" });
};

const CONTACTS = [
  { Icon: Phone, label: "Call Us Directly?", value: "0449504196", href: "tel:0449504196" },
  { Icon: Mail, label: "For Support?", value: "careers@telexph.com", href: "mailto:careers@telexph.com" },
  { Icon: MapPin, label: "Our Location", value: "Guimba, Nueva Ecija, Philippines" },
];

const Heading = ({ children }) => (
  <div className="mb-5">
    <h3 className="font-poppins-black mb-2 text-base text-white">{children}</h3>
    <motion.div className="h-1 w-12 origin-left bg-[#a10000]" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} />
  </div>
);

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, delay },
});

const LogisticsFooter = () => {
  const reduce = useReducedMotion();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop((prev) => { const next = window.scrollY > 300; return prev === next ? prev : next; });
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer className="relative bg-[#282828] text-white overflow-hidden">
      <Harbour />

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 p-3 bg-[#a10000] hover:bg-[#8a0000] rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* faint grid + red glow */}
      <div aria-hidden className="absolute inset-0 top-28 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 56px)" }} />
      <motion.div aria-hidden className="absolute -bottom-32 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-25 pointer-events-none" style={{ background: RED }}
        animate={reduce ? {} : { x: [0, 40, 0], y: [0, -20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />

      <div className={`${WIDTH} relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 py-14 md:py-16`}>
        <motion.div className="flex flex-col gap-8" {...rise()}>
          <motion.div whileHover={{ scale: 1.04 }} className="self-start origin-left"><FooterLogo /></motion.div>
          <span className="relative inline-block self-start">
            {!reduce && (
              <motion.span aria-hidden className="absolute -inset-px rounded border-2" style={{ borderColor: RED }}
                animate={{ scale: [1, 1.12], opacity: [0.7, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
            )}
            <a
              href={DISCOVERY_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: RED }}
            >
              {!reduce && (
                <motion.span aria-hidden className="absolute inset-y-0 w-8 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  initial={{ left: "-20%" }} animate={{ left: "120%" }} transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 3.4, ease: "easeInOut" }} />
              )}
              <span className="relative">Book a 15-Minute Discovery Call</span>
              <span aria-hidden className="relative transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </a>
          </span>
        </motion.div>

        <motion.div {...rise(0.1)}>
          <Heading>Explore</Heading>
          <ul className="flex flex-col gap-1">
            {getLogisticsTabs().map((t, i) => (
              <li key={t.href}>
                <a
                  href={t.href}
                  onClick={(e) => jumpTo(e, t.href)}
                  className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-300 transition-all hover:bg-white/5 hover:text-white max-w-[16rem]"
                >
                  <span className="w-6 text-xs font-semibold tabular-nums text-[#c43c3c]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">{t.label}</span>
                  <HiChevronRight className="w-3.5 h-3.5 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...rise(0.2)}>
          <Heading>Need Help?</Heading>
          <ul className="space-y-4">
            {CONTACTS.map(({ Icon, label, value, href }) => {
              const body = (
                <>
                  <span className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-white transition-all duration-300 group-hover:bg-[#a10000] group-hover:rotate-[-6deg]">
                    <Icon className="w-5 h-5" strokeWidth={1.8} />
                  </span>
                  <span>
                    <span className="block text-xs sm:text-sm text-gray-300">{label}</span>
                    <span className="block text-sm sm:text-base font-medium text-white">{value}</span>
                  </span>
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} className="group flex items-center gap-3 transition-transform hover:translate-x-1">{body}</a>
                  ) : (
                    <div className="group flex items-center gap-3">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>

      <div className="relative"><FooterBottom privacyHref="/logistics/privacy-policy" termsHref="/logistics/terms-and-conditions" /></div>
    </footer>
  );
};

export default LogisticsFooter;
