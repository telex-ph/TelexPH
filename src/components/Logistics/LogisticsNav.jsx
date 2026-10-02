import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import { HiBars3BottomRight } from "react-icons/hi2";
import { RiCloseFill } from "react-icons/ri";
import TopBar from "./LogisticsTopBar";
import { DISCOVERY_CALL_URL } from "@/constant/links";

/* Tabs mirror the sections of the page you are on: each one jumps to that section. */
const HOME_PAGE_TABS = [
  { label: "What We Help With", href: "#help" },
  { label: "Management", href: "#management" },
  { label: "How We Start", href: "#process" },
];
const LANDING_PAGE_TABS = [
  { label: "Support Scope", href: "#support" },
  { label: "Management", href: "#management" },
  { label: "FAQs", href: "#faqs" },
  { label: "Get Started", href: "#start" },
];
export const isLandingPath = () =>
  typeof window !== "undefined" && window.location.pathname.replace(/\/$/, "") === "/logistics/landing";
export const getLogisticsTabs = () => (isLandingPath() ? LANDING_PAGE_TABS : HOME_PAGE_TABS);

/* Each logistics page links to the other one: /logistics -> landing page, landing page -> /logistics. */
export const LANDING_TAB = { label: "Logistics Customer Support", href: "/logistics/landing" };
export const HOME_TAB = { label: "Logistics", href: "/logistics" };

const BUTTON_TEXT = "Book a 15-Minute Discovery Call";

const jumpTo = (e, href) => {
  const el = document.querySelector(href);
  if (!el) return;
  e.preventDefault();
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: "smooth" });
};

/* Same look as the Telex header (top bar, logo block, red wedge) with logistics tabs. */
const LogisticsNav = () => {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });
  const onLanding = isLandingPath();
  const tabs = getLogisticsTabs();
  const otherPage = onLanding ? HOME_TAB : LANDING_TAB;

  // highlight the tab whose section is currently under the header
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      let current = "";
      for (const t of tabs) {
        const el = document.querySelector(t.href);
        if (el && el.getBoundingClientRect().top <= 170) current = t.href;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [tabs]);

  return (
    <nav className="fixed w-full z-[1000] top-0">
      <TopBar />
      <div className={`relative bg-white transition-shadow duration-300 ${scrolled ? "shadow-xl" : "shadow-md"}`}>
        <div className="relative h-[60px] lg:h-[80px] flex items-stretch">
          <a href="/" aria-label="TelexPH" className="bg-gray-800 flex items-center justify-center h-full relative z-10 pl-3 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-20 w-auto lg:w-[350px]">
            <Image src="/images/Weblogo.webp" alt="Logo" width={250} height={50} className="object-contain w-[140px] sm:w-[180px] lg:w-[250px] h-auto" priority />
          </a>
          <div className="h-full z-30 w-[40px] lg:w-[60px] -ml-[20px] lg:-ml-[30px] relative block">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden bg-[#a10000]" style={{ clipPath: "polygon(50% 0, 100% 0, 50% 100%, 0 100%)" }}>
              {!reduce && (
                <motion.span aria-hidden className="absolute inset-y-0 w-4 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                  initial={{ left: "-40%" }} animate={{ left: "140%" }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }} />
              )}
            </div>
          </div>

          <div className="flex flex-grow items-center justify-end h-full pl-4 pr-4 sm:pl-6 sm:pr-8">
            <div className="hidden min-[1400px]:flex items-center space-x-7 h-full">
              <a href={otherPage.href} className="group relative py-1 text-gray-700 font-open-sans-bold text-[13px] whitespace-nowrap uppercase tracking-wide transition-colors hover:text-[#a10000]">
                {otherPage.label}
                <span aria-hidden className="absolute left-0 right-0 -bottom-0.5 h-[3px] origin-left scale-x-0 bg-[#a10000] transition-transform duration-300 group-hover:scale-x-100" />
              </a>
              {tabs.map((t) => {
                const on = active === t.href;
                return (
                  <a key={t.href} href={t.href} onClick={(e) => jumpTo(e, t.href)}
                    className={`group relative py-1 font-open-sans-bold text-[13px] whitespace-nowrap uppercase tracking-wide transition-colors hover:text-[#a10000] ${on ? "text-[#a10000]" : "text-gray-700"}`}>
                    {t.label}
                    <span aria-hidden className={`absolute left-0 right-0 -bottom-0.5 h-[3px] origin-left bg-[#a10000] transition-transform duration-300 ${on ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                  </a>
                );
              })}
            </div>
            <div className="flex items-center ml-auto min-[1400px]:ml-8">
              <span className="relative hidden min-[1400px]:inline-block">
                {!reduce && (
                  <motion.span aria-hidden className="absolute -inset-px rounded border-2 border-[#a10000]"
                    animate={{ scale: [1, 1.12], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
                )}
                <a
                  href={DISCOVERY_CALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden whitespace-nowrap bg-[#a10000] hover:bg-red-700 text-white px-6 py-2.5 text-sm font-open-sans-bold transition-all hover:-translate-y-0.5 hover:shadow-lg rounded"
                >
                  {!reduce && (
                    <motion.span aria-hidden className="absolute inset-y-0 w-8 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      initial={{ left: "-20%" }} animate={{ left: "120%" }} transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 3.6, ease: "easeInOut" }} />
                  )}
                  <span className="relative">{BUTTON_TEXT}</span>
                  <span aria-hidden className="relative inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </span>
              <button onClick={() => setOpen((v) => !v)} aria-label="Menu" className="min-[1400px]:hidden text-gray-700 p-2">
                {open ? <RiCloseFill className="w-6 h-6" /> : <HiBars3BottomRight className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        <motion.div aria-hidden className="absolute left-0 right-0 bottom-0 h-[3px] origin-left bg-[#a10000]" style={{ scaleX: reduce ? 0 : progress }} />

        <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} className="min-[1400px]:hidden bg-white border-t border-gray-100 shadow-lg px-6 py-3 flex flex-col">
            <a href={otherPage.href} className="py-3 text-sm font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100">
              {otherPage.label}
            </a>
            {tabs.map((t) => (
              <a
                key={t.href}
                href={t.href}
                onClick={(e) => { jumpTo(e, t.href); setOpen(false); }}
                className="py-3 text-sm font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100"
              >
                {t.label}
              </a>
            ))}
            <a
              href={DISCOVERY_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 mb-2 text-center bg-[#a10000] text-white px-4 py-3 text-sm font-bold rounded"
            >
              {BUTTON_TEXT}
            </a>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default LogisticsNav;
