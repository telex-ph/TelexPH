import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { COLORS } from "@/constant/styles";
import { DISCOVERY_CALL_URL } from "@/constant/links";

/* Telex palette only: brand red, charcoal and white. */
const RED = COLORS.primary; // #a10000
const RED_LIGHT = "#c43c3c";
const CHARCOAL = COLORS.dark; // #282828
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };

const HEADLINE = "Keep Shipment Enquiries Moving While Your Local Team Focuses on Operations";

const BELT_Y = 360;
const GATE_L = 262, GATE_R = 378; // scanner posts
const PARCEL_TRAVEL = [-90, 700];
const PARCEL_SECONDS = 9;
// fraction of the trip at which a parcel has fully cleared the scanner
const SCANNED_AT = (GATE_R + 8 - PARCEL_TRAVEL[0]) / (PARCEL_TRAVEL[1] - PARCEL_TRAVEL[0]);

/* A parcel riding the belt: after it passes the scanner it picks up a check badge. */
const Parcel = ({ delay, tone }) => {
  const reduce = useReducedMotion();
  const fill = tone === "red" ? RED : tone === "dark" ? "#4b4b4b" : "#f3f4f6";
  return (
    <motion.g
      initial={{ x: PARCEL_TRAVEL[0] }}
      animate={reduce ? { x: 150 + delay * 50 } : { x: PARCEL_TRAVEL }}
      transition={reduce ? { duration: 0 } : { duration: PARCEL_SECONDS, repeat: Infinity, ease: "linear", delay }}
    >
      <rect x="0" y={BELT_Y - 48} width="64" height="48" rx="3" fill={fill} />
      <rect x="0" y={BELT_Y - 48} width="64" height="48" rx="3" stroke="rgba(0,0,0,.25)" />
      <rect x="27" y={BELT_Y - 48} width="10" height="48" fill="rgba(0,0,0,.22)" />
      <rect x="8" y={BELT_Y - 34} width="12" height="8" rx="1" fill="rgba(255,255,255,.7)" />
      {/* scanned badge */}
      <motion.g
        initial={{ opacity: reduce ? 1 : 0 }}
        animate={reduce ? { opacity: 1 } : { opacity: [0, 0, 1, 1] }}
        transition={reduce ? { duration: 0 } : { duration: PARCEL_SECONDS, repeat: Infinity, ease: "linear", delay, times: [0, SCANNED_AT - 0.01, SCANNED_AT + 0.02, 1] }}
      >
        <circle cx="52" cy={BELT_Y - 54} r="10" fill="#fff" />
        <path d={`M47 ${BELT_Y - 54} l4 4 l7 -8`} stroke={RED} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </motion.g>
  );
};

/* Scanner arch over the belt with a red beam that sweeps up and down. */
const Scanner = () => {
  const reduce = useReducedMotion();
  return (
    <g>
      <rect x={GATE_L} y="262" width="12" height={BELT_Y - 262} fill="#4b4b4b" />
      <rect x={GATE_R - 12} y="262" width="12" height={BELT_Y - 262} fill="#4b4b4b" />
      <rect x={GATE_L - 6} y="250" width={GATE_R - GATE_L + 12} height="16" rx="3" fill="#5a5a5a" />
      <rect x={GATE_L - 6} y="250" width={GATE_R - GATE_L + 12} height="4" rx="2" fill="rgba(255,255,255,.3)" />
      <circle cx={(GATE_L + GATE_R) / 2} cy="258" r="3.5" fill={RED_LIGHT} />
      <rect x={GATE_L + 12} y="266" width={GATE_R - GATE_L - 24} height={BELT_Y - 266} fill="url(#beam)" opacity=".5" />
      <motion.rect
        x={GATE_L + 12} width={GATE_R - GATE_L - 24} height="3" rx="1.5" fill={RED_LIGHT}
        initial={{ y: 270 }}
        animate={reduce ? { y: 310 } : { y: [270, BELT_Y - 6, 270] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </g>
  );
};

/* Back wall: storage racks full of boxes. */
const Rack = ({ x, boxes }) => (
  <g>
    <rect x={x} y="196" width="6" height="164" fill="#303030" />
    <rect x={x + 134} y="196" width="6" height="164" fill="#303030" />
    {[196, 250, 304, 358].map((y) => <rect key={y} x={x} y={y} width="140" height="5" fill="#3a3a3a" />)}
    {boxes.map(([bx, by, bw, bh, c], i) => <rect key={i} x={x + bx} y={by} width={bw} height={bh} fill={c} />)}
  </g>
);

/* Typing indicator: three dots pulsing, then the reply lands. */
const Bubble = ({ x, y, mine = false, delay = 0 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.g
      initial={reduce ? false : { opacity: 0, y: 14, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 160, damping: 14 }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      <rect x={x} y={y} width="170" height="56" rx="14" fill={mine ? RED : "#fff"} />
      <line x1={x + 18} x2={x + 130} y1={y + 20} y2={y + 20} stroke={mine ? "rgba(255,255,255,.85)" : "#9ca3af"} strokeWidth="5" strokeLinecap="round" />
      <line x1={x + 18} x2={x + 92} y1={y + 38} y2={y + 38} stroke={mine ? "rgba(255,255,255,.55)" : "#d1d5db"} strokeWidth="5" strokeLinecap="round" />
      {mine && <path d={`M${x + 140} ${y + 36} l7 7 l13 -15`} stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />}
    </motion.g>
  );
};

const Typing = ({ x, y }) => {
  const reduce = useReducedMotion();
  return (
    <g>
      <rect x={x} y={y} width="56" height="30" rx="15" fill="#fff" opacity=".92" />
      {[0, 1, 2].map((i) => (
        <motion.circle key={i} cx={x + 16 + i * 12} cy={y + 15} r="3.2" fill="#6b7280"
          animate={reduce ? {} : { opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </g>
  );
};

/* Delivery tracker: a van drives along the dotted line and lights up each stop. */
const Tracker = () => {
  const reduce = useReducedMotion();
  const stops = [70, 195, 320, 445, 570];
  const T = 8;
  return (
    <g>
      <line x1="70" x2="570" y1="176" y2="176" stroke="rgba(255,255,255,.25)" strokeWidth="3" strokeDasharray="3 9" strokeLinecap="round" />
      {stops.map((cx, i) => (
        <motion.circle key={cx} cx={cx} cy="176" r="9"
          initial={{ fill: reduce ? RED_LIGHT : "#5b5b5b" }}
          animate={reduce ? {} : { fill: ["#5b5b5b", "#5b5b5b", RED_LIGHT, RED_LIGHT] }}
          transition={{ duration: T, repeat: Infinity, ease: "linear", times: [0, Math.max(i / 4 - 0.02, 0), i / 4 + 0.01, 1] }}
        />
      ))}
      <motion.g
        initial={{ x: 70 }}
        animate={reduce ? { x: 320 } : { x: [70, 570] }}
        transition={reduce ? { duration: 0 } : { duration: T, repeat: Infinity, ease: "linear" }}
      >
        <g transform="translate(-15 150.5)">
          <rect x="0" y="4" width="20" height="16" rx="2" fill="#fff" />
          <rect x="0" y="11" width="20" height="3" fill={RED} />
          <path d="M20 8 h6 l5 6 v6 h-11z" fill={RED} />
          <circle cx="7" cy="22" r="3.4" fill="#0d0d0d" />
          <circle cx="26" cy="22" r="3.4" fill="#0d0d0d" />
        </g>
      </motion.g>
    </g>
  );
};

const Scene = ({ mx, my }) => {
  const reduce = useReducedMotion();
  const back = { x: useTransform(mx, [-0.5, 0.5], [-8, 8]), y: useTransform(my, [-0.5, 0.5], [-5, 5]) };
  const mid = { x: useTransform(mx, [-0.5, 0.5], [-14, 14]), y: useTransform(my, [-0.5, 0.5], [-8, 8]) };
  const front = { x: useTransform(mx, [-0.5, 0.5], [-22, 22]), y: useTransform(my, [-0.5, 0.5], [-10, 10]) };
  return (
    <svg aria-hidden viewBox="0 0 640 430" className="w-full h-auto overflow-visible" fill="none">
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={RED_LIGHT} stopOpacity=".55" />
          <stop offset="1" stopColor={RED_LIGHT} stopOpacity="0" />
        </linearGradient>
        <clipPath id="belt-clip"><rect x="0" y="200" width="640" height="230" /></clipPath>
      </defs>

      {/* back wall: racks */}
      <motion.g style={back}>
        <Rack x={14} boxes={[[10, 214, 30, 32, "#4b4b4b"], [44, 224, 26, 22, RED], [76, 210, 34, 36, "#5a5a5a"], [14, 262, 38, 34, "#5a5a5a"], [58, 270, 28, 26, "#4b4b4b"], [92, 258, 36, 38, RED], [18, 316, 30, 36, RED], [54, 322, 38, 30, "#4b4b4b"], [100, 314, 28, 38, "#5a5a5a"]]} />
        <Rack x={486} boxes={[[12, 218, 34, 28, "#5a5a5a"], [52, 208, 30, 38, "#4b4b4b"], [90, 222, 32, 24, RED], [16, 266, 30, 30, RED], [54, 262, 36, 34, "#5a5a5a"], [98, 272, 26, 24, "#4b4b4b"], [14, 320, 38, 32, "#4b4b4b"], [60, 314, 30, 38, "#5a5a5a"], [98, 324, 30, 28, RED]]} />
      </motion.g>

      {/* enquiries coming in and being answered, plus the tracker */}
      <motion.g style={mid}>
        <Bubble x={40} y={14} delay={0.5} />
        <Bubble x={150} y={68} mine delay={0.9} />
        <Bubble x={320} y={14} delay={1.3} />
        <Bubble x={430} y={68} mine delay={1.7} />
        <Typing x={338} y={96} />
        <Tracker />
      </motion.g>

      {/* belt, scanner and parcels */}
      <motion.g style={front}>
        <rect x="0" y={BELT_Y} width="640" height="26" rx="4" fill="#161616" />
        <rect x="0" y={BELT_Y} width="640" height="3" fill="rgba(255,255,255,.18)" />
        <g clipPath="url(#belt-clip)">
          <motion.line
            x1="-20" x2="660" y1={BELT_Y + 13} y2={BELT_Y + 13}
            stroke="#fff" strokeOpacity=".35" strokeWidth="3" strokeDasharray="14 14"
            animate={reduce ? {} : { strokeDashoffset: [0, -28] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
          <Parcel delay={0} tone="light" />
          <Parcel delay={3} tone="red" />
          <Parcel delay={6} tone="dark" />
        </g>
        <Scanner />
        {[40, 130, 220, 310, 400, 490, 580].map((cx) => (
          <circle key={cx} cx={cx} cy={BELT_Y + 40} r="10" fill="#2f2f2f" stroke="rgba(255,255,255,.2)" />
        ))}
        <rect x="20" y={BELT_Y + 48} width="600" height="8" rx="4" fill="#161616" />
      </motion.g>
    </svg>
  );
};

const Word = ({ children, i }) => (
  <span className="inline-block overflow-hidden align-bottom pb-1">
    <motion.span
      className="inline-block"
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

const fade = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.7 },
});

const LogisticsLandingHero = () => {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 20 });
  const my = useSpring(rawY, { stiffness: 60, damping: 20 });

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      onMouseMove={onMove}
      className="relative overflow-hidden text-white"
      style={{ background: `linear-gradient(135deg, #141414 0%, ${CHARCOAL} 60%, #3a0a0a 100%)` }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 56px)" }}
      />
      <div aria-hidden className="absolute -bottom-40 -right-32 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-40" style={{ background: RED }} />
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute inset-y-0 w-1/3 -skew-x-12 opacity-[0.07] pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, #fff, transparent)" }}
          initial={{ left: "-40%" }}
          animate={{ left: "140%" }}
          transition={{ duration: 7, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
        />
      )}

      <div className="relative max-w-6xl mx-auto px-4 pt-36 pb-16 md:pt-44 md:pb-28 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl uppercase font-bold leading-[1.02]" style={display}>
            {HEADLINE.split(" ").map((w, i) => (
              <span key={i}><Word i={i}>{w}</Word>{" "}</span>
            ))}
          </h1>
          <motion.div className="mt-5 h-1 w-20 origin-left" style={{ backgroundColor: RED }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.1, duration: 0.6 }} />
          <motion.p className="mt-6 text-base md:text-lg leading-relaxed text-gray-300" {...fade(1.1)}>
            Explore a managed customer support team in the Philippines for your logistics business.
          </motion.p>
          <motion.p className="mt-3 text-base md:text-lg leading-relaxed text-gray-300" {...fade(1.25)}>
            We help handle routine shipment enquiries, customer follow-ups, and delivery exceptions within your agreed processes.
          </motion.p>
          <motion.div className="mt-9" {...fade(1.4)}>
            <motion.a
              href={DISCOVERY_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, boxShadow: "0 12px 30px rgba(161,0,0,.55)" }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 rounded px-8 py-4 text-sm md:text-base font-semibold uppercase tracking-wide text-white"
              style={{ backgroundColor: RED }}
            >
              Book a 15-Minute Discovery Call
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </motion.a>
          </motion.div>
        </div>

        <div className="md:col-span-6"><Scene mx={mx} my={my} /></div>
      </div>
    </section>
  );
};

export default LogisticsLandingHero;
