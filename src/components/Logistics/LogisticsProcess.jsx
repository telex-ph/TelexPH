import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Handshake, RefreshCw, Rocket, Search, Truck } from "lucide-react";
import { COLORS } from "@/constant/styles";
import LogisticsEyebrow from "./LogisticsEyebrow";
import { DISCOVERY_CALL_URL } from "@/constant/links";

// DRAFT intro copy (not from the approved brief): edit freely.
const INTRO_TITLE = "How We Start";
const INTRO_TEXT = "From the first conversation to launch and ongoing review, here is how an engagement takes shape.";

const RED = COLORS.primary; // #a10000
const CHARCOAL = COLORS.dark; // #282828
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };

const STEPS = [
  { title: "Understand Your Needs", text: "We discuss your workload, current challenges, systems, service hours, and priorities.", Icon: Search },
  { title: "Define the Support Model", text: "We agree on scope, team structure, responsibilities, performance measures, and pricing.", Icon: Handshake },
  { title: "Prepare for Delivery", text: "We align training, system access, escalation rules, and readiness before launch.", Icon: Rocket },
  { title: "Review and Improve", text: "We review performance together and address gaps through coaching and process improvements.", Icon: RefreshCw },
];

const N = STEPS.length;
// Each stop sits at the centre of its column: 12.5%, 37.5%, 62.5%, 87.5%.
const stopAt = (i) => (i + 0.5) / N;

const Stop = ({ i, progress }) => {
  const reduce = useReducedMotion();
  const reached = stopAt(i);
  const bg = useTransform(progress, [Math.max(reached - 0.04, 0), reached], ["#e5e7eb", RED]);
  const scale = useTransform(progress, [Math.max(reached - 0.05, 0), reached, reached + 0.06], [1, 1.25, 1]);
  return (
    <motion.span
      aria-hidden
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-4 border-white shadow-md flex items-center justify-center text-xs font-bold text-white"
      style={{ left: `${reached * 100}%`, backgroundColor: reduce ? RED : bg, scale: reduce ? 1 : scale }}
    >
      {i + 1}
    </motion.span>
  );
};

/* Desktop: a road with four stops; the truck drives from stop to stop as you scroll. */
const Route = ({ progress }) => {
  const reduce = useReducedMotion();
  const span = useTransform(progress, [0, 1], [stopAt(0) * 100, stopAt(N - 1) * 100]);
  const left = useTransform(span, (v) => `${v}%`);
  const width = useTransform(span, (v) => `${v - stopAt(0) * 100}%`);
  const full = `${(stopAt(N - 1) - stopAt(0)) * 100}%`;

  return (
    <div aria-hidden className="hidden md:block relative h-20 mb-8">
      {/* the road */}
      <div className="absolute top-1/2 -translate-y-1/2 h-3.5 rounded-full bg-gray-300" style={{ left: `${stopAt(0) * 100}%`, right: `${(1 - stopAt(N - 1)) * 100}%` }} />
      <div className="absolute top-1/2 -translate-y-1/2 h-px" style={{ left: `${stopAt(0) * 100}%`, right: `${(1 - stopAt(N - 1)) * 100}%`, backgroundImage: "repeating-linear-gradient(90deg,#fff 0 10px,transparent 10px 20px)" }} />
      <motion.div className="absolute top-1/2 -translate-y-1/2 h-3.5 rounded-full" style={{ left: `${stopAt(0) * 100}%`, width: reduce ? full : width, backgroundColor: RED }} />
      {STEPS.map((_, i) => <Stop key={i} i={i} progress={progress} />)}
      {!reduce && (
        <motion.div className="absolute top-0 -translate-x-1/2" style={{ left }}>
          <motion.div
            className="text-white rounded-xl px-2.5 py-1.5 shadow-xl"
            style={{ backgroundColor: CHARCOAL }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Truck className="w-6 h-6" strokeWidth={2} />
          </motion.div>
          {/* exhaust puffs */}
          {[0, 1, 2].map((k) => (
            <motion.span key={k} className="absolute top-3 -left-2 w-2 h-2 rounded-full bg-gray-400"
              animate={{ x: [0, -22], opacity: [0.6, 0], scale: [0.6, 1.4] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: k * 0.36, ease: "easeOut" }} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

const Step = ({ s, i, active, reachedAlready }) => {
  const reduce = useReducedMotion();
  const { Icon } = s;
  const lit = active || reachedAlready;
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md border transition-all duration-500"
      style={{ borderColor: lit ? RED : "#f3f4f6", boxShadow: active ? "0 16px 36px rgba(161,0,0,.18)" : undefined }}
    >
      {/* top bar fills once the truck has reached this step */}
      <span aria-hidden className="absolute top-0 left-0 h-1 w-full origin-left transition-transform duration-700" style={{ backgroundColor: RED, transform: lit ? "scaleX(1)" : "scaleX(0)" }} />
      <span aria-hidden className="hidden md:block absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3" style={{ backgroundColor: lit ? RED : "#e5e7eb" }} />
      {/* watermark icon */}
      <Icon aria-hidden className="absolute -right-5 -bottom-5 w-28 h-28 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" strokeWidth={1} style={{ color: CHARCOAL, opacity: 0.06 }} />

      <div className="relative flex items-center gap-3 mb-4">
        <span
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-500"
          style={{ backgroundColor: lit ? RED : "#f3f4f6", color: lit ? "#fff" : CHARCOAL }}
        >
          <Icon className="w-5 h-5" strokeWidth={1.9} />
        </span>
        <span className="md:hidden w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: RED }}>{i + 1}</span>
      </div>
      <h3 className="relative text-2xl uppercase font-bold mb-2 leading-tight" style={{ ...display, color: CHARCOAL }}>{s.title}</h3>
      <p className="relative text-sm leading-relaxed text-gray-600">{s.text}</p>
    </motion.li>
  );
};

const LogisticsProcess = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });
  const [reached, setReached] = useState(reduce ? N - 1 : -1);

  // which step the truck has reached (the stop it is at or has passed)
  useMotionValueEvent(progress, "change", (v) => {
    const idx = v <= 0.005 ? 0 : Math.min(Math.floor(v * (N - 1) + 0.0001) + (v * (N - 1) % 1 > 0.9 ? 1 : 0), N - 1);
    setReached((p) => (p === idx ? p : idx));
  });
  useEffect(() => { if (reached < 0) setReached(0); }, [reached]);

  return (
    <section id="process" className="relative py-16 md:py-24 px-4 bg-gray-50 overflow-hidden">
      {/* faint grid + drifting glows */}
      <div aria-hidden className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(90deg,#282828 0,#282828 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,#282828 0,#282828 1px,transparent 1px,transparent 56px)" }} />
      <motion.div aria-hidden className="absolute -top-28 -right-24 w-[26rem] h-[26rem] rounded-full blur-3xl pointer-events-none" style={{ background: RED, opacity: 0.08 }}
        animate={reduce ? {} : { x: [0, -50, 0], y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center"><LogisticsEyebrow center>{INTRO_TITLE}</LogisticsEyebrow></div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl uppercase font-bold text-center mb-5 leading-[1.02]"
          style={{ ...display, color: CHARCOAL }}
        >
          Built Around Your Operations
        </motion.h2>
        <motion.div className="mx-auto mb-5 h-1 w-16 origin-center" style={{ backgroundColor: RED }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }} />
        <p className="mx-auto mb-14 max-w-2xl text-center text-base md:text-lg leading-relaxed text-gray-600">{INTRO_TEXT}</p>

        <div ref={ref}>
          <Route progress={progress} />

          <ol className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {STEPS.map((s, i) => <Step key={s.title} s={s} i={i} active={i === reached} reachedAlready={i < reached} />)}
          </ol>
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="relative inline-block">
            {!reduce && (
              <motion.span aria-hidden className="absolute -inset-px rounded border-2" style={{ borderColor: RED }}
                animate={{ scale: [1, 1.14], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
            )}
            <motion.a
              href={DISCOVERY_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, boxShadow: "0 12px 30px rgba(161,0,0,.45)" }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded px-8 py-4 text-sm md:text-base font-semibold uppercase tracking-wide text-white"
              style={{ backgroundColor: RED }}
            >
              {!reduce && (
                <motion.span aria-hidden className="absolute inset-y-0 w-10 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  initial={{ left: "-20%" }} animate={{ left: "120%" }} transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 3.2, ease: "easeInOut" }} />
              )}
              <span className="relative">Discuss Your Support Needs</span>
              <span aria-hidden className="relative transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </motion.a>
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default LogisticsProcess;
