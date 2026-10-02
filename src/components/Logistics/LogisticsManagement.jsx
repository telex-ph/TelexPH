import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ClipboardCheck, Gauge, MessageSquareText, Moon, Sun } from "lucide-react";
import { COLORS } from "@/constant/styles";
import LogisticsEyebrow from "./LogisticsEyebrow";

// DRAFT section title (from the brief's section label): edit freely.
const INTRO_TITLE = "Management";

const RED = COLORS.primary; // #a10000
const RED_LIGHT = "#c43c3c";
const CHARCOAL = COLORS.dark; // #282828
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };

/* "You set the expectations": three service-level sliders you can drag. They drift on their own
   until you touch one, then they stay where you leave them. */
const ROWS = [
  { Icon: Gauge, start: 30, d: 6 },
  { Icon: ClipboardCheck, start: 72, d: 8 },
  { Icon: MessageSquareText, start: 50, d: 7 },
];

const Slider = ({ Icon, value, onChange, index }) => (
  <div className="flex items-center gap-4">
    <span className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-white">
      <Icon className="w-5 h-5" strokeWidth={1.8} />
    </span>
    <div className="relative flex-1 h-6 flex items-center">
      <div className="absolute inset-x-0 h-2 rounded-full bg-white/15" />
      <div className="absolute left-0 h-2 rounded-full" style={{ width: `${value}%`, backgroundColor: RED_LIGHT }} />
      <span className="absolute top-1/2 w-5 h-5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white shadow-md border-4 pointer-events-none" style={{ left: `${value}%`, borderColor: RED }} />
      <input
        type="range" min="5" max="100" value={Math.round(value)}
        aria-label={`Service expectation ${index + 1}`}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
      />
    </div>
    <span className="w-9 text-right text-sm font-semibold tabular-nums text-white/80">{Math.round(value)}</span>
  </div>
);

const Sliders = () => {
  const reduce = useReducedMotion();
  const [vals, setVals] = useState(ROWS.map((r) => r.start));
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (reduce || touched) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const t = (now - t0) / 1000;
      setVals(ROWS.map((r, i) => 55 + 32 * Math.sin((t / r.d) * Math.PI * 2 + i * 1.7)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, touched]);

  const set = (i, v) => { setTouched(true); setVals((p) => p.map((x, k) => (k === i ? v : x))); };

  return (
    <div className="space-y-4">
      {ROWS.map((r, i) => <Slider key={i} Icon={r.Icon} value={vals[i]} index={i} onChange={(v) => set(i, v)} />)}
    </div>
  );
};

/* "We manage the daily work": a 24-hour dial. A sun/moon rides the rim as the hand sweeps, and
   each hour tick lights up once it has been covered. */
const Dial = () => {
  const reduce = useReducedMotion();
  const [hour, setHour] = useState(0);

  useEffect(() => {
    if (reduce) { setHour(24); return; }
    const id = setInterval(() => setHour((h) => (h + 1) % 25), 500);
    return () => clearInterval(id);
  }, [reduce]);

  const angle = (hour / 24) * Math.PI * 2;
  const night = hour < 6 || hour >= 18;
  const sx = 100 + Math.sin(angle) * 86;
  const sy = 100 - Math.cos(angle) * 86;

  return (
    <div className="relative mx-auto w-full max-w-[220px]">
      <svg aria-hidden viewBox="0 0 200 200" className="w-full h-auto" fill="none">
        <circle cx="100" cy="100" r="86" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
        {[...Array(24)].map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const long = i % 6 === 0;
          const r1 = long ? 70 : 76;
          const lit = i < hour;
          return (
            <line key={i} x1={100 + Math.sin(a) * r1} y1={100 - Math.cos(a) * r1} x2={100 + Math.sin(a) * 84} y2={100 - Math.cos(a) * 84}
              stroke={lit ? RED_LIGHT : long ? "#fff" : "rgba(255,255,255,.35)"} strokeWidth={long ? 3 : 1.8} strokeLinecap="round" style={{ transition: "stroke .3s" }} />
          );
        })}
        {/* coverage arc follows the hand */}
        <circle cx="100" cy="100" r="58" stroke="rgba(255,255,255,.08)" strokeWidth="10" />
        <circle
          cx="100" cy="100" r="58" stroke={RED} strokeWidth="10" strokeLinecap="round"
          style={{ rotate: "-90deg", transformOrigin: "100px 100px", transition: "stroke-dashoffset .5s linear" }}
          pathLength="1" strokeDasharray="1" strokeDashoffset={1 - hour / 24}
        />
        <line x1="100" y1="100" x2={100 + Math.sin(angle) * 54} y2={100 - Math.cos(angle) * 54} stroke="#fff" strokeWidth="4" strokeLinecap="round" style={{ transition: "all .5s linear" }} />
        <circle cx="100" cy="100" r="7" fill="#fff" />
      </svg>
      {/* sun / moon on the rim */}
      <div
        className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center shadow-lg"
        style={{ left: `${(sx / 200) * 100}%`, top: `${(sy / 200) * 100}%`, backgroundColor: night ? CHARCOAL : "#fff", color: night ? "#fff" : RED, border: `2px solid ${night ? "#fff" : RED}`, transition: "left .5s linear, top .5s linear, background-color .4s" }}
      >
        {night ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </div>
    </div>
  );
};

/* "Reporting / visibility": bars that rise and fall, with a heartbeat line beneath. */
const Pulse = () => {
  const reduce = useReducedMotion();
  const bars = [0.5, 0.8, 0.6, 0.95, 0.7, 0.85, 0.55, 0.9];
  return (
    <div>
      <div className="flex items-end gap-2 h-14">
        {bars.map((b, i) => (
          <motion.span key={i} className="flex-1 rounded-t" style={{ backgroundColor: i % 3 === 0 ? RED_LIGHT : "rgba(255,255,255,.35)", height: `${b * 100}%`, transformOrigin: "bottom" }}
            animate={reduce ? {} : { scaleY: [1, 0.55 + ((i * 37) % 40) / 100, 1] }} transition={{ duration: 2.4 + (i % 4) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }} />
        ))}
      </div>
      <svg aria-hidden viewBox="0 0 300 30" className="mt-3 w-full h-6" fill="none">
        <motion.path
          d="M0 15 H70 L82 3 L96 27 L108 9 L118 15 H190 L202 5 L214 25 L224 15 H300"
          stroke={RED_LIGHT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={reduce ? { pathLength: 1 } : { pathLength: [0, 1, 1], opacity: [1, 1, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const LogisticsManagement = () => {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sx = useSpring(rawX, { stiffness: 80, damping: 18 });
  const sy = useSpring(rawY, { stiffness: 80, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);
  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <section id="management" className="relative overflow-hidden text-white py-16 md:py-24 px-4" style={{ backgroundColor: CHARCOAL }}>
      {/* road-dash edge, grid, drifting glows */}
      <div aria-hidden className="absolute top-0 inset-x-0 h-1.5" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${RED} 0 28px, transparent 28px 48px)` }} />
      <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 56px)" }} />
      <motion.div aria-hidden className="absolute -bottom-40 -left-32 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-30" style={{ background: RED }}
        animate={reduce ? {} : { x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div aria-hidden className="absolute -top-40 right-0 w-[26rem] h-[26rem] rounded-full blur-3xl opacity-20" style={{ background: RED }}
        animate={reduce ? {} : { x: [0, -40, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-14 items-center">
        <div className="md:col-span-7">
          <motion.div {...rise()}><LogisticsEyebrow light>{INTRO_TITLE}</LogisticsEyebrow></motion.div>
          <motion.h2 className="text-4xl md:text-6xl uppercase font-bold leading-[1.02]" style={display} {...rise()}>
            You Set the Service Expectations.{" "}
            <span style={{ color: RED_LIGHT }}>We Manage the Team’s Daily Work.</span>
          </motion.h2>
          <motion.div className="mt-5 h-1 w-20 origin-left" style={{ backgroundColor: RED }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }} />
          <motion.p className="mt-7 text-base md:text-lg leading-relaxed text-gray-300" {...rise(0.1)}>
            We agree on responsibilities and escalation rules, then build the support structure around them. Team leadership, quality reviews, coaching, and reporting help you maintain visibility over the work.
          </motion.p>
          <motion.p className="mt-4 rounded-xl border-l-4 bg-white/5 px-6 py-5 text-base md:text-lg leading-relaxed text-gray-300" style={{ borderColor: RED }} {...rise(0.2)}>
            Coverage options—including after-hours or round-the-clock support—are assessed during discovery and confirmed in the proposal.
          </motion.p>
        </div>

        <motion.div className="md:col-span-5" style={{ perspective: 1200 }} {...rise(0.15)}>
          <motion.div
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY }}
            className="relative rounded-3xl bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-sm shadow-2xl"
          >
            {/* live badge */}
            <span aria-hidden className="absolute top-4 right-5 flex items-center gap-1.5">
              <motion.span className="w-2 h-2 rounded-full" style={{ backgroundColor: RED_LIGHT }} animate={reduce ? {} : { opacity: [1, 0.2, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
            </span>
            <Sliders />
            <div className="my-6 h-px bg-white/10" />
            <Dial />
            <div className="my-6 h-px bg-white/10" />
            <Pulse />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LogisticsManagement;
