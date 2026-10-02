import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { COLORS } from "@/constant/styles";
import { DISCOVERY_CALL_URL } from "@/constant/links";

/* Telex palette only: brand red, charcoal and white. */
const RED = COLORS.primary; // #a10000
const RED_LIGHT = "#c43c3c";
const CHARCOAL = COLORS.dark; // #282828
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };

const HEADLINE = "Managed Offshore Teams for Growing Businesses";

const ROUTE = "M80 130 C 190 -30, 450 -30, 565 120";
const STARS = [[40, 40], [120, 22], [210, 58], [300, 18], [380, 50], [470, 24], [540, 62], [600, 30], [160, 90], [430, 84], [70, 80], [590, 90]];
const WINDOWS = [[22, 300], [34, 300], [22, 312], [76, 282], [88, 282], [76, 296], [150, 270], [162, 270], [150, 284], [162, 284], [520, 290], [532, 290], [520, 304], [590, 276], [602, 276]];

/* A shipping container with a lit top face and a shaded side, so the stack reads as 3D. */
const Container = ({ x, y, fill, shade, rib = "rgba(0,0,0,.22)", delay = 0 }) => {
  const reduce = useReducedMotion();
  const w = 104, h = 46, d = 12;
  return (
    <motion.g
      initial={reduce ? false : { y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 + delay, type: "spring", stiffness: 130, damping: 15 }}
    >
      <polygon points={`${x},${y} ${x + d},${y - d} ${x + w + d},${y - d} ${x + w},${y}`} fill="rgba(255,255,255,.35)" />
      <polygon points={`${x + w},${y} ${x + w + d},${y - d} ${x + w + d},${y + h - d} ${x + w},${y + h}`} fill={shade} />
      <rect x={x} y={y} width={w} height={h} fill={fill} />
      {[...Array(8)].map((_, i) => (
        <line key={i} x1={x + 11 + i * 11.5} x2={x + 11 + i * 11.5} y1={y + 5} y2={y + h - 5} stroke={rib} strokeWidth="2" />
      ))}
      <rect x={x} y={y} width={w} height="4" fill="rgba(0,0,0,.18)" />
      <rect x={x} y={y + h - 4} width={w} height="4" fill="rgba(0,0,0,.18)" />
      <line x1={x + w - 8} x2={x + w - 8} y1={y + 5} y2={y + h - 5} stroke="rgba(255,255,255,.55)" strokeWidth="2" />
    </motion.g>
  );
};

const Wheel = ({ cx, cy }) => {
  const reduce = useReducedMotion();
  return (
    <g>
      <circle cx={cx} cy={cy} r="10" fill="#0d0d0d" />
      <motion.g style={{ transformOrigin: `${cx}px ${cy}px` }} animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}>
        <circle cx={cx} cy={cy} r="5" fill="#9ca3af" />
        <line x1={cx - 5} x2={cx + 5} y1={cy} y2={cy} stroke="#0d0d0d" strokeWidth="1.6" />
        <line x1={cx} x2={cx} y1={cy - 5} y2={cy + 5} stroke="#0d0d0d" strokeWidth="1.6" />
      </motion.g>
    </g>
  );
};

const ROAD_X = 0, ROAD_W = 640;

const Truck = () => {
  const reduce = useReducedMotion();
  return (
    <motion.g
      initial={{ x: -262 }}
      animate={reduce ? { x: 260 } : { x: [-262, 660] }}
      transition={reduce ? { duration: 0 } : { duration: 12, repeat: Infinity, ease: "linear", delay: 1 }}
    >
      {/* speed lines */}
      {[360, 372, 384].map((y, i) => <line key={y} x1={-30 - i * 14} x2={-8 - i * 6} y1={y} y2={y} stroke="rgba(255,255,255,.35)" strokeWidth="2" strokeLinecap="round" />)}
      {/* trailer */}
      <rect x="0" y="348" width="140" height="46" rx="3" fill="#fff" />
      <rect x="0" y="366" width="140" height="9" fill={RED} />
      <rect x="0" y="392" width="140" height="5" fill={CHARCOAL} />
      {/* cab */}
      <path d="M144 362 h22 l16 17 v18 h-38z" fill={RED} />
      <path d="M150 366 h13 l9 11 h-22z" fill="#cfd8dc" />
      <rect x="144" y="392" width="40" height="6" fill={CHARCOAL} />
      <Wheel cx={20} cy={400} />
      <Wheel cx={46} cy={400} />
      <Wheel cx={160} cy={400} />
      {/* headlight beam */}
      <polygon points="182,382 250,370 250,398" fill="rgba(255,255,255,.14)" />
    </motion.g>
  );
};

/* Gantry crane at the left with a container swinging gently on its cable. */
const Crane = () => {
  const reduce = useReducedMotion();
  return (
    <g opacity=".9">
      <line x1="30" x2="30" y1="118" y2="346" stroke="#4b4b4b" strokeWidth="6" />
      <line x1="214" x2="214" y1="118" y2="346" stroke="#4b4b4b" strokeWidth="6" />
      <line x1="30" x2="214" y1="150" y2="150" stroke="#3a3a3a" strokeWidth="3" />
      <line x1="30" x2="214" y1="220" y2="220" stroke="#3a3a3a" strokeWidth="3" />
      <rect x="14" y="108" width="216" height="12" rx="2" fill="#5a5a5a" />
      <rect x="14" y="108" width="216" height="3" fill="rgba(255,255,255,.3)" />
      <motion.g style={{ transformOrigin: "120px 124px" }} animate={reduce ? {} : { rotate: [-3.5, 3.5, -3.5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="108" y="120" width="24" height="10" fill={RED} />
        <line x1="120" x2="120" y1="130" y2="205" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="96" x2="120" y1="232" y2="205" stroke="#cbd5e1" strokeWidth="1.5" />
        <line x1="144" x2="120" y1="232" y2="205" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="84" y="228" width="72" height="30" rx="2" fill={RED} />
        <rect x="84" y="228" width="72" height="4" fill="rgba(0,0,0,.2)" />
        {[...Array(5)].map((_, i) => <line key={i} x1={96 + i * 12} x2={96 + i * 12} y1="234" y2="254" stroke="rgba(0,0,0,.22)" strokeWidth="2" />)}
      </motion.g>
    </g>
  );
};

const Plane = () => {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <g>
      <g transform="scale(1.35)">
        {/* wings (swept back) */}
        <path d="M5 0 L-5 -19 L-10 -19 L-4 0 Z" fill="#e5e7eb" />
        <path d="M5 0 L-5 19 L-10 19 L-4 0 Z" fill="#cfd4da" />
        {/* tailplanes */}
        <path d="M-11 0 L-17 -7 L-20 -7 L-15 0 Z" fill="#e5e7eb" />
        <path d="M-11 0 L-17 7 L-20 7 L-15 0 Z" fill="#cfd4da" />
        {/* fuselage */}
        <path d="M18 0 C 14 -3.4, -12 -3.4, -17 -1.4 L -17 1.4 C -12 3.4, 14 3.4, 18 0 Z" fill="#fff" />
        {/* cockpit + red stripe + engines */}
        <path d="M18 0 C 16 -1.6, 13 -2.2, 11 -2.2 L 11 2.2 C 13 2.2, 16 1.6, 18 0 Z" fill="#9aa3ad" />
        <rect x="-12" y="-0.7" width="20" height="1.4" fill={RED} />
        <ellipse cx="-1" cy="-9" rx="3.4" ry="1.7" fill="#9aa3ad" />
        <ellipse cx="-1" cy="9" rx="3.4" ry="1.7" fill="#9aa3ad" />
      </g>
      <animateMotion dur="9s" repeatCount="indefinite" path={ROUTE} rotate="auto" begin="1s" />
    </g>
  );
};

const Scene = ({ mx, my }) => {
  const reduce = useReducedMotion();
  // three depth layers drift by different amounts as the pointer moves
  const back = { x: useTransform(mx, [-0.5, 0.5], [-8, 8]), y: useTransform(my, [-0.5, 0.5], [-5, 5]) };
  const mid = { x: useTransform(mx, [-0.5, 0.5], [-16, 16]), y: useTransform(my, [-0.5, 0.5], [-9, 9]) };
  const front = { x: useTransform(mx, [-0.5, 0.5], [-26, 26]), y: useTransform(my, [-0.5, 0.5], [-12, 12]) };

  return (
    <svg aria-hidden viewBox="0 0 640 430" className="w-full h-auto overflow-visible" fill="none">
      {/* sky: stars + route + plane */}
      <motion.g style={back}>
        {STARS.map(([cx, cy], i) => (
          <motion.circle key={i} cx={cx} cy={cy} r="1.8" fill="#fff" animate={reduce ? {} : { opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 2.5 + (i % 4), repeat: Infinity, delay: i * 0.3 }} />
        ))}
        <motion.path d={ROUTE} stroke={RED_LIGHT} strokeWidth="3" strokeDasharray="3 10" strokeLinecap="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, delay: 0.3, ease: "easeInOut" }} />
        {[[80, 130], [565, 120]].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="8" fill="#fff" />
            <motion.circle cx={cx} cy={cy} r="8" stroke={RED_LIGHT} strokeWidth="2" style={{ transformBox: "fill-box", transformOrigin: "center" }} animate={reduce ? {} : { scale: [1, 3.5], opacity: [0.7, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.8 }} />
          </g>
        ))}
        <Plane />
        {/* warehouse skyline */}
        <rect x="0" y="262" width="110" height="84" fill="#1b1b1b" />
        <polygon points="0,262 55,236 110,262" fill="#202020" />
        <rect x="130" y="252" width="86" height="94" fill="#1d1d1d" />
        <rect x="486" y="270" width="150" height="76" fill="#1b1b1b" />
        <polygon points="486,270 561,244 636,270" fill="#202020" />
        {WINDOWS.map(([wx, wy], i) => (
          <motion.rect key={i} x={wx} y={wy} width="7" height="6" rx="1" fill="#fff" animate={reduce ? { opacity: 0.4 } : { opacity: [0.15, 0.7, 0.15] }} transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.25 }} />
        ))}
      </motion.g>

      {/* crane + container stack */}
      <motion.g style={mid}>
        <Crane />
        <Container x={232} y={300} fill={RED} shade="#6e0000" delay={0.0} />
        <Container x={348} y={300} fill="#f3f4f6" shade="#b8bcc2" rib="rgba(0,0,0,.14)" delay={0.1} />
        <Container x={464} y={300} fill="#4b4b4b" shade="#2c2c2c" rib="rgba(0,0,0,.3)" delay={0.2} />
        <Container x={290} y={254} fill="#f3f4f6" shade="#b8bcc2" rib="rgba(0,0,0,.14)" delay={0.3} />
        <Container x={406} y={254} fill={RED} shade="#6e0000" delay={0.4} />
        <Container x={348} y={208} fill="#4b4b4b" shade="#2c2c2c" rib="rgba(0,0,0,.3)" delay={0.5} />
      </motion.g>

      {/* road + truck */}
      <motion.g style={front}>
        <defs>
          <clipPath id="road-clip"><rect x={ROAD_X} y="300" width={ROAD_W} height="130" /></clipPath>
        </defs>
        <rect x={ROAD_X} y="346" width={ROAD_W} height="70" fill="#141414" />
        <rect x={ROAD_X} y="346" width={ROAD_W} height="3" fill="rgba(255,255,255,.2)" />
        <g clipPath="url(#road-clip)">
        <motion.line
          x1="-60" x2="700" y1="408" y2="408"
          stroke="#fff" strokeOpacity=".55" strokeWidth="3" strokeDasharray="26 22"
          animate={reduce ? {} : { strokeDashoffset: [0, -48] }}
          transition={{ duration: 1.0, repeat: Infinity, ease: "linear" }}
        />
        <Truck />
        </g>
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
      transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
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

const LogisticsHero = () => {
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
      {/* faint grid, red glow, slow light sweep */}
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

      {/* road-dash edge along the bottom */}
      <div aria-hidden className="absolute bottom-0 inset-x-0 h-1.5" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${RED} 0 28px, transparent 28px 48px)` }} />

      <div className="relative max-w-6xl mx-auto px-4 pt-36 pb-16 md:pt-44 md:pb-28 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl uppercase font-bold leading-[1.02]" style={display}>
            {HEADLINE.split(" ").map((w, i) => (
              <span key={i}><Word i={i}>{w}</Word>{" "}</span>
            ))}
          </h1>
          <motion.div className="mt-5 h-1 w-20 origin-left" style={{ backgroundColor: RED }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.6 }} />
          <motion.p className="mt-6 text-base md:text-lg leading-relaxed text-gray-300" {...fade(0.9)}>
            Build your customer support and back-office capacity with a Philippine-based team supported by quality assurance, team leadership, and operations management.
          </motion.p>
          <motion.p className="mt-3 text-base md:text-lg leading-relaxed text-gray-300" {...fade(1.05)}>
            For businesses around the world, we help shape the right support model around your workflows, service hours, and customer needs.
          </motion.p>
          <motion.div className="mt-9" {...fade(1.2)}>
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

export default LogisticsHero;
