import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { BarChart3, GraduationCap, ShieldCheck, Settings2, UserCheck, Users } from "lucide-react";
import { COLORS } from "@/constant/styles";
import LogisticsEyebrow from "./LogisticsEyebrow";

// DRAFT intro copy (not from the approved brief): edit freely.
const INTRO_TITLE = "How the Team Is Managed";
const INTRO_TEXT = "Every team comes with the oversight to keep daily work consistent, reviewed, and visible to you.";

const RED = COLORS.primary; // #a10000
const CHARCOAL = COLORS.dark; // #282828
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };

const ICONS = [GraduationCap, UserCheck, ShieldCheck, Settings2, BarChart3];

const INCLUDES = [
  "Agents trained on your processes and systems",
  "Team leadership for daily coordination and coaching",
  "Quality assurance to review work and identify improvements",
  "Operations management for performance reviews and issue escalation",
  "Reporting against agreed measures and service expectations",
];

/* A tiny team chart: one lead, three agents, with pulses travelling down the reporting lines. */
const TeamChart = () => {
  const reduce = useReducedMotion();
  const agents = [60, 160, 260];
  return (
    <div className="relative mt-8 max-w-md" style={{ aspectRatio: "320 / 150" }}>
      <svg aria-hidden viewBox="0 0 320 150" className="absolute inset-0 w-full h-full" fill="none">
        {agents.map((x, i) => {
          const d = `M160 44 C 160 80, ${x} 70, ${x} 104`;
          return (
            <g key={x}>
              <motion.path d={d} stroke="rgba(255,255,255,.35)" strokeWidth="2" strokeDasharray="3 6" strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.5 + i * 0.2 }} />
              {!reduce && (
                <circle r="3.4" fill={RED}>
                  <animateMotion dur="2.6s" repeatCount="indefinite" path={d} begin={`${1.6 + i * 0.7}s`} />
                </circle>
              )}
            </g>
          );
        })}
      </svg>
      {[{ x: 160, y: 22, big: true }, ...agents.map((x) => ({ x, y: 124 }))].map((n, i) => (
        <motion.span
          key={i}
          className="absolute flex items-center justify-center rounded-full border-2 text-white"
          style={{
            left: `${(n.x / 320) * 100}%`, top: `${(n.y / 150) * 100}%`, translate: "-50% -50%",
            width: n.big ? 46 : 36, height: n.big ? 46 : 36,
            backgroundColor: n.big ? RED : "rgba(255,255,255,.1)", borderColor: n.big ? RED : "rgba(255,255,255,.4)",
          }}
          initial={reduce ? false : { scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 240, damping: 13 }}
        >
          {n.big ? <ShieldCheck className="w-5 h-5" strokeWidth={1.9} /> : <Users className="w-4 h-4" strokeWidth={1.9} />}
          {n.big && !reduce && (
            <motion.span aria-hidden className="absolute inset-0 rounded-full border-2 border-[#a10000]"
              animate={{ scale: [1, 1.8], opacity: [0.7, 0] }} transition={{ duration: 2.2, repeat: Infinity }} />
          )}
        </motion.span>
      ))}
    </div>
  );
};

/* Package-tracking style timeline: the red line fills as you scroll, a light rides it, and each
   stop lights up when it reaches the middle of the screen. */
const Timeline = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });

  return (
    <ol ref={ref} className="relative space-y-5 pl-14">
      <span aria-hidden className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-white/15" />
      <motion.span aria-hidden className="absolute left-[19px] top-3 bottom-3 w-0.5 origin-top" style={{ backgroundColor: RED, scaleY: reduce ? 1 : fill }} />
      {!reduce && (
        <motion.span aria-hidden className="absolute left-[14px] w-3 h-3 rounded-full bg-white shadow-[0_0_14px_3px_rgba(196,60,60,.9)]"
          style={{ top: "0.5rem" }} animate={{ top: ["0.5rem", "calc(100% - 1.25rem)"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 }} />
      )}

      {INCLUDES.map((text, i) => {
        const Icon = ICONS[i];
        return (
          <motion.li
            key={text}
            initial={reduce ? false : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            whileHover={{ x: 6 }}
            className="group relative flex items-center gap-4 rounded-xl px-5 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/25 transition-colors"
          >
            <span aria-hidden className="absolute left-0 top-2 bottom-2 w-1 rounded-full origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100" style={{ backgroundColor: RED }} />
            <motion.span
              className="absolute -left-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white border-2"
              initial={reduce ? false : { backgroundColor: CHARCOAL, borderColor: "rgba(255,255,255,.25)", scale: 0.85 }}
              whileInView={{ backgroundColor: RED, borderColor: RED, scale: 1 }}
              viewport={{ once: true, margin: "-35% 0px -35% 0px" }}
              transition={{ duration: 0.4 }}
              style={reduce ? { backgroundColor: RED, borderColor: RED } : undefined}
            >
              {i + 1}
            </motion.span>
            <span className="flex-1 text-gray-100 leading-relaxed">{text}</span>
            <span aria-hidden className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 text-white/70 transition-all duration-300 group-hover:bg-[#a10000] group-hover:text-white group-hover:rotate-[-6deg]">
              <Icon className="w-4.5 h-4.5" strokeWidth={1.8} />
            </span>
          </motion.li>
        );
      })}
    </ol>
  );
};

const LogisticsManaged = () => (
  <section id="management" className="relative overflow-hidden text-white py-16 md:py-24 px-4" style={{ backgroundColor: CHARCOAL }}>
    {/* road-dash edge + faint glow */}
    <div aria-hidden className="absolute top-0 inset-x-0 h-1.5" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${RED} 0 28px, transparent 28px 48px)` }} />
    <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 56px)" }} />
    <motion.div aria-hidden className="absolute -top-32 -left-24 w-[26rem] h-[26rem] rounded-full blur-3xl opacity-25" style={{ background: RED }}
      animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
    <motion.div aria-hidden className="absolute -bottom-40 right-0 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-15" style={{ background: RED }}
      animate={{ x: [0, -40, 0] }} transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }} />

    <div className="relative max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-14">
      <motion.div
        className="md:col-span-5 md:sticky md:top-36 self-start"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
      >
        <LogisticsEyebrow light>{INTRO_TITLE}</LogisticsEyebrow>
        <h2 className="text-4xl md:text-6xl uppercase font-bold leading-[1.02]" style={display}>
          A Team with <span className="whitespace-nowrap">Day-to-Day</span> Management
        </h2>
        <div className="h-1 w-20 mt-6" style={{ backgroundColor: RED }} />
        <p className="mt-5 max-w-md text-base md:text-lg leading-relaxed text-gray-300">{INTRO_TEXT}</p>
        <TeamChart />
      </motion.div>

      <div className="md:col-span-7">
        <p className="font-semibold text-lg mb-6 text-gray-200">Your support model can include:</p>
        <Timeline />
        <motion.p
          className="mt-8 flex items-start gap-4 rounded-xl border-l-4 bg-white/5 px-6 py-5 leading-relaxed text-gray-300"
          style={{ borderColor: RED }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <ShieldCheck aria-hidden className="mt-0.5 w-6 h-6 shrink-0" style={{ color: "#c43c3c" }} strokeWidth={1.8} />
          <span>We agree on responsibilities, staffing, coverage, and reporting before delivery begins. Your team retains the decisions and approvals that need to stay within your business.</span>
        </motion.p>
      </div>
    </div>
  </section>
);

export default LogisticsManaged;
