import { motion, useReducedMotion } from "framer-motion";
import { LayoutList, Users, BarChart3, ChefHat, Cpu, Shirt, Armchair, Stethoscope, Car, Plane, Truck, Code2, Sparkles } from "lucide-react";
import { COLORS } from "@/constant/styles";

/* Dark animated cards for the Platform page tabs, same visual language as the About illustrations.
   Wording is limited to what the Platform page itself already says. */
const RED = COLORS.primary;
const RED_LIGHT = "#c43c3c";
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };
const GRID = "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 56px)";

const Card = ({ children, className = "" }) => (
  <div className={`relative mx-auto w-full max-w-[860px] ${className}`}>
    <div aria-hidden className="absolute inset-6 rounded-full opacity-25 blur-3xl" style={{ background: RED }} />
    <div className="relative overflow-hidden rounded-3xl p-4 shadow-2xl shadow-black/25 md:p-6" style={{ background: "linear-gradient(135deg,#1a1a1a 0%,#282828 55%,#4d0a0a 100%)" }}>
      <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: GRID }} />
      <div className="relative">{children}</div>
    </div>
  </div>
);

const Flow = ({ x1, y1, x2, y2, delay = 0 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={RED_LIGHT} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 10"
      animate={reduce ? {} : { strokeDashoffset: [0, -24] }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay }} />
  );
};

/* ---------------------------------------------------------------- platforms */
const SATELLITES = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
  return [320 + Math.cos(a) * 235, 200 + Math.sin(a) * 135];
});

export const PlatformsCard = () => {
  const reduce = useReducedMotion();
  return (
    <Card>
      <svg viewBox="0 0 640 400" role="img" aria-label="A hub connected to 115+ e-commerce platforms across 24 countries" className="mx-auto h-auto w-full max-w-[640px]">
        <defs>
          <linearGradient id="pl-hub" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d41a1a" /><stop offset="1" stopColor="#6e0000" /></linearGradient>
        </defs>
        {SATELLITES.map(([x, y], i) => <Flow key={i} x1="320" y1="200" x2={x} y2={y} delay={i * 0.15} />)}
        {[0, 1].map((i) => (
          <motion.circle key={i} cx="320" cy="200" r="64" fill="none" stroke={RED} strokeWidth="1.5"
            initial={{ opacity: 0.3 }} animate={reduce ? {} : { scale: [1, 1.9], opacity: [0.5, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, delay: i * 1.7, ease: "easeOut" }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        ))}
        {SATELLITES.map(([x, y], i) => (
          <motion.g key={i} animate={reduce ? {} : { y: [0, -5, 0] }} transition={{ duration: 3 + (i % 3) * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}>
            <rect x={x - 28} y={y - 26} width="56" height="52" rx="12" fill="#f3f4f6" />
            <path d={`M${x - 28} ${y - 6} V${y - 14} a12 12 0 0 1 12 -12 h32 a12 12 0 0 1 12 12 V${y - 6} Z`} fill={i % 2 ? "#282828" : RED} />
            <rect x={x - 16} y={y + 2} width="14" height="16" rx="2" fill="#cbd0d6" />
            <rect x={x + 4} y={y + 2} width="12" height="9" rx="2" fill="#cbd0d6" />
          </motion.g>
        ))}
        <circle cx="320" cy="200" r="64" fill="url(#pl-hub)" />
        <circle cx="320" cy="200" r="64" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="1.5" />
        <text x="320" y="206" textAnchor="middle" fontSize="46" fontWeight="700" fill="#fff" style={display}>115+</text>
        <text x="320" y="228" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="2.5" fill="#f3d6d6" style={display}>PLATFORMS</text>
        <rect x="252" y="352" width="136" height="32" rx="16" fill="#2f2f2f" stroke="#5a5a5a" />
        <text x="320" y="373" textAnchor="middle" fontSize="15" fontWeight="700" letterSpacing="2" fill="#fff" style={display}>24 COUNTRIES</text>
      </svg>
    </Card>
  );
};

/* -------------------------------------------------------------------- tools */
const TOOLS = [
  { Icon: LayoutList, label: "Catalog Management" },
  { Icon: Users, label: "CRM" },
  { Icon: BarChart3, label: "Analytics" },
];

export const ToolsCard = () => {
  const reduce = useReducedMotion();
  return (
    <Card>
      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {TOOLS.flatMap(({ Icon, label }, i) => {
          const tile = (
            <motion.div key={label} initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.15 }}
              className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl text-white" style={{ background: RED }}><Icon className="h-8 w-8" strokeWidth={1.6} /></span>
              <span className="text-2xl font-bold uppercase leading-none text-white" style={display}>{label}</span>
            </motion.div>
          );
          if (i === TOOLS.length - 1) return [tile];
          return [tile, (
            <svg key={`f${i}`} viewBox="0 0 40 10" className="mx-auto hidden h-3 w-10 md:block" aria-hidden><Flow x1="2" y1="5" x2="38" y2="5" delay={i * 0.3} /></svg>
          )];
        })}
      </div>
      <div className="mt-5 flex justify-center">
        <span className="rounded-full border border-white/20 bg-[#2f2f2f] px-5 py-2 text-lg font-bold uppercase tracking-[0.15em] text-white" style={display}>20+ Integrated Tools &amp; Platforms</span>
      </div>
    </Card>
  );
};

/* --------------------------------------------------------------- industries */
const INDUSTRIES = [
  [ChefHat, "Kitchen & Home"], [Cpu, "Electronics"], [Shirt, "Fashion & Lifestyle"], [Armchair, "Home & Ergonomics"], [Stethoscope, "Healthcare & Medical"],
  [Car, "Automotive"], [Plane, "Travel & Gov't"], [Truck, "Logistics"], [Code2, "Software"], [Sparkles, "Specialty & Niche"],
];

export const IndustriesCard = () => {
  const reduce = useReducedMotion();
  return (
    <Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {INDUSTRIES.map(([Icon, label], i) => (
          <motion.div key={label} className="relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-5 text-center"
            initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
            {!reduce && (
              <motion.span aria-hidden className="absolute inset-0 rounded-2xl" style={{ background: RED }}
                animate={{ opacity: [0, 0.35, 0, 0] }} transition={{ duration: 10 * 0.6, repeat: Infinity, delay: i * 0.6, times: [0, 0.08, 0.2, 1] }} />
            )}
            <span className="relative flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ background: RED }}><Icon className="h-6 w-6" strokeWidth={1.7} /></span>
            <span className="relative text-lg font-bold uppercase leading-tight text-white" style={display}>{label}</span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

