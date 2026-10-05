import { motion, useReducedMotion } from "framer-motion";
import { COLORS } from "@/constant/styles";

/* Hero illustrations for the About info pages. Same visual language as the logistics hero:
   charcoal shapes on a dark ground, brand red for the live parts, small looping animations. */
const RED = COLORS.primary;
const RED_LIGHT = "#c43c3c";
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };

/* Dotted line with dashes flowing along it: data, power or a connection that is live. */
const Flow = ({ x1, y1, x2, y2, color = RED_LIGHT, delay = 0, speed = 1.2 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 10"
      animate={reduce ? {} : { strokeDashoffset: [0, -24] }} transition={{ duration: speed, repeat: Infinity, ease: "linear", delay }} />
  );
};

/* Status light that blinks. */
const Led = ({ x, y, delay = 0, color = "#fff", r = 2.6 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.circle cx={x} cy={y} r={r} fill={color}
      animate={reduce ? { opacity: 0.8 } : { opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.6, repeat: Infinity, delay }} />
  );
};

/* ---------------------------------------------------------------- hardware */
const PROVIDERS = [["GLOBE", 120], ["PLDT", 320], ["STARLINK", 520]];
const CYCLE = 9; // seconds for the failover highlight to visit all three providers

const HardwareScene = () => {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 640 440" role="img" aria-label="Backup power, workstations and three internet providers" className="h-auto w-full">
      <defs>
        <linearGradient id="hw-screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#262626" /><stop offset="1" stopColor="#4a0d0d" /></linearGradient>
      </defs>

      {/* three providers feeding one router */}
      {PROVIDERS.map(([name, x], i) => (
        <g key={name}>
          <Flow x1={x} y1="66" x2="320" y2="128" delay={i * 0.3} />
          <rect x={x - 54} y="26" width="108" height="38" rx="19" fill="#f3f4f6" />
          <motion.rect x={x - 54} y="26" width="108" height="38" rx="19" fill="none" stroke={RED} strokeWidth="3"
            initial={{ opacity: reduce ? (i === 0 ? 1 : 0) : 0 }}
            animate={reduce ? {} : { opacity: [0, 1, 1, 0, 0, 0] }}
            transition={{ duration: CYCLE, repeat: Infinity, delay: i * (CYCLE / 3), times: [0, 0.05, 0.3, 0.35, 0.5, 1] }} />
          <text x={x} y="50" textAnchor="middle" fontSize="15" fontWeight="700" letterSpacing="1.5" fill="#282828" style={display}>{name}</text>
        </g>
      ))}
      <rect x="268" y="128" width="104" height="28" rx="7" fill="#4b4b4b" />
      <rect x="268" y="128" width="104" height="5" rx="2.5" fill="rgba(255,255,255,.25)" />
      {[286, 304, 322, 340].map((x, i) => <Led key={x} x={x} y="145" delay={i * 0.25} color={i === 3 ? RED_LIGHT : "#fff"} />)}
      <Flow x1="320" y1="156" x2="320" y2="202" delay={0.2} />

      {/* workstation */}
      <rect x="232" y="202" width="176" height="116" rx="9" fill="#2f2f2f" stroke="#5a5a5a" strokeWidth="2" />
      <rect x="242" y="212" width="156" height="96" rx="4" fill="url(#hw-screen)" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.rect key={i} x={254 + i * 22} width="14" rx="2" fill={i % 2 ? "#e5e7eb" : RED_LIGHT}
          initial={{ y: 286 - 30, height: 30 }}
          animate={reduce ? {} : { y: [286 - 24 - i * 6, 286 - 60 + i * 3, 286 - 24 - i * 6], height: [24 + i * 6, 60 - i * 3, 24 + i * 6] }}
          transition={{ duration: 3 + i * 0.35, repeat: Infinity, ease: "easeInOut" }} />
      ))}
      <rect x="252" y="219" width="54" height="16" rx="8" fill="#fff" opacity=".92" />
      <text x="279" y="231" textAnchor="middle" fontSize="12" fontWeight="700" fill={RED} style={display}>64GB RAM</text>
      <rect x="310" y="318" width="20" height="22" fill="#3a3a3a" />
      <rect x="276" y="340" width="88" height="8" rx="4" fill="#4b4b4b" />

      {/* tower */}
      <rect x="470" y="248" width="84" height="148" rx="8" fill="#303030" stroke="#5a5a5a" strokeWidth="2" />
      <rect x="480" y="258" width="64" height="6" rx="3" fill="rgba(255,255,255,.2)" />
      <circle cx="512" cy="318" r="22" fill="#222" stroke="#5a5a5a" strokeWidth="2" />
      <motion.g animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <path d="M512 318 L512 298 A20 20 0 0 1 529 308 Z M512 318 L531 324 A20 20 0 0 1 515 338 Z M512 318 L497 332 A20 20 0 0 1 494 310 Z" fill="#6b6b6b" />
      </motion.g>
      <text x="512" y="372" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="1" fill="#e5e7eb" style={display}>i5 · RYZEN 7</text>
      <Led x="540" y="266" color={RED_LIGHT} />
      <Flow x1="470" y1="300" x2="408" y2="300" color="#e5e7eb" delay={0.4} />

      {/* backup power: UPS + generator */}
      {[236, 288].map((y, i) => (
        <g key={y}>
          <rect x="36" y={y} width="140" height="44" rx="6" fill="#383838" stroke="#5a5a5a" strokeWidth="1.5" />
          {[0, 1, 2, 3].map((n) => <rect key={n} x={48 + n * 16} y={y + 24} width="11" height="10" rx="1.5" fill={RED_LIGHT} opacity={0.35 + n * 0.2} />)}
          <Led x="156" y={y + 12} delay={i * 0.4} />
          <text x="50" y={y + 16} fontSize="12" fontWeight="700" letterSpacing="1.5" fill="#d1d5db" style={display}>UPS</text>
        </g>
      ))}
      <rect x="36" y="342" width="140" height="54" rx="6" fill="#303030" stroke="#5a5a5a" strokeWidth="1.5" />
      <rect x="44" y="350" width="64" height="38" rx="3" fill="#222" />
      {[0, 1, 2, 3].map((n) => <line key={n} x1={52 + n * 14} x2={52 + n * 14} y1="354" y2="384" stroke="#444" strokeWidth="3" />)}
      <motion.path d="M150 354 L138 370 H148 L140 386 L158 366 H148 Z" fill={RED_LIGHT}
        animate={reduce ? {} : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.8, repeat: Infinity }} />
      <text x="120" y="338" fontSize="12" fontWeight="700" letterSpacing="1.5" fill="#d1d5db" style={display}>GENERATOR</text>
      <Flow x1="176" y1="300" x2="232" y2="300" delay={0.1} />
      <Flow x1="106" y1="342" x2="106" y2="332" delay={0.2} />

      {/* floor */}
      <rect x="20" y="398" width="600" height="8" rx="4" fill="#1a1a1a" />
    </svg>
  );
};

/* -------------------------------------------------------------- compliance */
const Doc = ({ x, y, title, delay }) => {
  const reduce = useReducedMotion();
  return (
    <motion.g initial={reduce ? false : { opacity: 0, y: y + 16 }} animate={{ opacity: 1, y }} transition={{ delay, type: "spring", stiffness: 110, damping: 14 }}>
      <rect x={x} y="0" width="150" height="190" rx="12" fill="#f3f4f6" />
      <rect x={x} y="0" width="150" height="34" rx="12" fill={RED} />
      <rect x={x} y="20" width="150" height="14" fill={RED} />
      <text x={x + 14} y="23" fontSize="15" fontWeight="700" letterSpacing="1" fill="#fff" style={display}>{title}</text>
      {[54, 72, 90, 108, 126].map((ly, i) => <rect key={ly} x={x + 14} y={ly} width={i % 2 ? 90 : 122} height="6" rx="3" fill="#cbd0d6" />)}
      <circle cx={x + 124} cy="162" r="13" fill="#fff" stroke={RED} strokeWidth="2.5" />
      <path d={`M${x + 117} 162 l5 5 l9 -11`} stroke={RED} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* scan line */}
      {!reduce && (
        <motion.rect x={x + 8} width="134" height="3" rx="1.5" fill={RED_LIGHT} initial={{ y: 44 }} animate={{ y: [44, 150, 44] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay }} />
      )}
    </motion.g>
  );
};

const ComplianceScene = () => {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 640 440" role="img" aria-label="Privacy policy and terms protected by a shield" className="h-auto w-full">
      <defs>
        <linearGradient id="cs-shield" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d41a1a" /><stop offset="1" stopColor="#6e0000" /></linearGradient>
      </defs>
      {[0, 1, 2].map((i) => (
        <motion.circle key={i} cx="320" cy="220" r="150" fill="none" stroke={RED} strokeWidth="1.5"
          initial={{ opacity: 0.25 }} animate={reduce ? {} : { scale: [0.55, 1.15], opacity: [0.5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, delay: i * 1.5, ease: "easeOut" }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      ))}
      <g transform="translate(36 120)"><Doc x={0} y={0} title="GDPR" delay={0.1} /></g>
      <g transform="translate(454 120)"><Doc x={0} y={0} title="NDA" delay={0.25} /></g>

      <Flow x1="190" y1="226" x2="250" y2="226" delay={0.1} color="#e5e7eb" />
      <Flow x1="450" y1="226" x2="390" y2="226" delay={0.3} color="#e5e7eb" />

      <motion.g animate={reduce ? {} : { y: [0, -9, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <path d="M320 92 L410 126 V212 C410 268 372 308 320 332 C268 308 230 268 230 212 V126 Z" fill="url(#cs-shield)" />
        <path d="M320 92 L410 126 V212 C410 268 372 308 320 332 Z" fill="#fff" opacity=".07" />
        <path d="M320 108 L396 136 V212 C396 260 364 294 320 316 C276 294 244 260 244 212 V136 Z" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.5" />
        <rect x="288" y="196" width="64" height="50" rx="8" fill="#fff" />
        <path d="M300 196 V184 a20 20 0 0 1 40 0 V196" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
        <circle cx="320" cy="217" r="6.5" fill={RED} /><rect x="317" y="219" width="6" height="15" rx="3" fill={RED} />
      </motion.g>

      <rect x="262" y="372" width="116" height="30" rx="15" fill="#2f2f2f" stroke="#5a5a5a" />
      <text x="320" y="392" textAnchor="middle" fontSize="14" fontWeight="700" letterSpacing="2" fill="#fff" style={display}>GDPR</text>
    </svg>
  );
};

/* -------------------------------------------------------------- operations */
const Agent = ({ x, delay }) => {
  const reduce = useReducedMotion();
  return (
    <motion.g animate={reduce ? {} : { y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay, ease: "easeInOut" }}>
      <circle cx={x} cy="330" r="17" fill="#e5e7eb" />
      <path d={`M${x - 17} 328 a17 17 0 0 1 34 0`} fill="none" stroke={RED} strokeWidth="4" />
      <rect x={x + 10} y="330" width="14" height="5" rx="2.5" fill={RED} />
      <path d={`M${x - 28} 392 a28 28 0 0 1 56 0 Z`} fill={RED} opacity=".9" />
      <path d={`M${x - 28} 392 a28 28 0 0 1 56 0 Z`} fill="#fff" opacity=".08" />
    </motion.g>
  );
};

const OperationsScene = () => {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 640 440" role="img" aria-label="A managed support team with a live performance dashboard" className="h-auto w-full">
      {/* dashboard */}
      <rect x="110" y="30" width="420" height="262" rx="16" fill="#2f2f2f" stroke="#5a5a5a" strokeWidth="2" />
      <rect x="110" y="30" width="420" height="34" rx="16" fill="#3a3a3a" />
      <rect x="110" y="48" width="420" height="16" fill="#3a3a3a" />
      {[130, 148, 166].map((cx, i) => <circle key={cx} cx={cx} cy="47" r="5" fill={i === 0 ? RED_LIGHT : "#6b6b6b"} />)}

      {/* KPI bars */}
      {[["ACCURACY", 0.92], ["SLA", 0.78], ["PRODUCTIVITY", 0.86]].map(([label, v], i) => (
        <g key={label}>
          <text x="136" y={102 + i * 36} fontSize="12" fontWeight="700" letterSpacing="1.5" fill="#d1d5db" style={display}>{label}</text>
          <rect x="226" y={92 + i * 36} width="190" height="9" rx="4.5" fill="#444" />
          <motion.rect x="226" y={92 + i * 36} height="9" rx="4.5" fill={i === 1 ? "#e5e7eb" : RED_LIGHT}
            initial={{ width: reduce ? 190 * v : 0 }} animate={{ width: 190 * v }} transition={{ duration: 1.4, delay: 0.3 + i * 0.2, ease: "easeOut" }} />
        </g>
      ))}

      {/* trend line */}
      <rect x="140" y="204" width="360" height="68" rx="8" fill="#262626" />
      <motion.path d="M152 258 C186 258 190 236 224 236 S270 252 304 238 S356 214 390 220 S450 228 488 214"
        fill="none" stroke={RED_LIGHT} strokeWidth="3.5" strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, delay: 0.6, ease: "easeInOut" }} />
      <motion.circle r="5" fill="#fff" initial={{ cx: 488, cy: 214, opacity: 0 }} animate={reduce ? { cx: 488, cy: 214, opacity: 1 } : { opacity: [0, 1] }} transition={{ delay: 2.8, duration: 0.4 }} />

      {/* side card: tickets resolved */}
      <rect x="436" y="80" width="76" height="100" rx="10" fill="#262626" />
      <text x="474" y="118" textAnchor="middle" fontSize="30" fontWeight="700" fill="#fff" style={display}>99%</text>
      <text x="474" y="138" textAnchor="middle" fontSize="11" letterSpacing="1.5" fill="#9ca3af" style={display}>ACCURACY</text>
      <Led x="474" y="158" color={RED_LIGHT} r="3.5" />

      {/* conversation bubbles with an escalation arrow */}
      <motion.g initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, type: "spring", stiffness: 140, damping: 14 }}>
        <rect x="26" y="150" width="120" height="44" rx="12" fill="#fff" />
        <rect x="40" y="164" width="76" height="5" rx="2.5" fill="#9ca3af" /><rect x="40" y="176" width="48" height="5" rx="2.5" fill="#d1d5db" />
      </motion.g>
      <motion.g initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, type: "spring", stiffness: 140, damping: 14 }}>
        <rect x="496" y="226" width="120" height="44" rx="12" fill={RED} />
        <rect x="510" y="240" width="64" height="5" rx="2.5" fill="rgba(255,255,255,.85)" /><rect x="510" y="252" width="40" height="5" rx="2.5" fill="rgba(255,255,255,.5)" />
        <path d="M584 252 l6 6 l11 -12" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </motion.g>
      <Flow x1="146" y1="172" x2="110" y2="172" color="#e5e7eb" />

      {/* the team */}
      <Flow x1="320" y1="292" x2="320" y2="322" delay={0.2} />
      <Agent x={150} delay={0} /><Agent x={250} delay={0.5} /><Agent x={390} delay={1} /><Agent x={490} delay={1.5} />
      {/* team lead */}
      <circle cx="320" cy="316" r="9" fill="#fff" /><path d="M320 316 m-9 0 a9 9 0 0 1 18 0" fill="none" stroke={RED} strokeWidth="3" />
      <rect x="20" y="396" width="600" height="8" rx="4" fill="#1a1a1a" />
    </svg>
  );
};

/* Small firewall appliance for the security card: front panel with port and status lights. */
export const FirewallVisual = () => {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 360 150" role="img" aria-label="Network firewall appliance" className="h-auto w-full">
      <rect x="10" y="40" width="340" height="76" rx="10" fill="#3a3a3a" stroke="#5a5a5a" strokeWidth="2" />
      <rect x="10" y="40" width="340" height="8" rx="4" fill="rgba(255,255,255,.18)" />
      <path d="M44 62 L62 56 L80 62 V80 C80 90 72 96 62 100 C52 96 44 90 44 80 Z" fill={RED} />
      <path d="M54 78 l6 6 l10 -12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => <rect key={n} x={110 + n * 26} y="62" width="18" height="22" rx="3" fill="#222" stroke="#666" />)}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => <Led key={n} x={119 + n * 26} y="96" delay={n * 0.2} color={n % 3 === 2 ? RED_LIGHT : "#fff"} />)}
      <circle cx="326" cy="78" r="12" fill="#222" stroke="#666" strokeWidth="2" />
      <Flow x1="180" y1="116" x2="180" y2="146" delay={0.2} />
      {!reduce && <motion.rect x="104" y="58" width="3" height="30" rx="1.5" fill={RED_LIGHT} initial={{ x: 104 }} animate={{ x: [104, 306, 104] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} opacity=".7" />}
    </svg>
  );
};

/* --------------------------------------------------------------- about us */
const STEPS = [60, 100, 140, 180, 220];
const AboutUsScene = () => {
  const reduce = useReducedMotion();
  const top = (i) => 330 - STEPS[i];
  return (
    <svg viewBox="0 0 640 400" role="img" aria-label="Growth rising toward a global reach: Scale Smarter" className="h-auto w-full">
      <defs>
        <linearGradient id="au-bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a5a5a" /><stop offset="1" stopColor="#2f2f2f" /></linearGradient>
        <linearGradient id="au-red" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d41a1a" /><stop offset="1" stopColor="#6e0000" /></linearGradient>
      </defs>

      {/* steps of growth */}
      {STEPS.map((h, i) => (
        <motion.rect key={i} x={50 + i * 78} width="56" rx="6" fill={i === STEPS.length - 1 ? "url(#au-red)" : "url(#au-bar)"} stroke="#6b6b6b" strokeWidth="1.2"
          initial={{ y: reduce ? 330 - h : 330, height: reduce ? h : 0 }} animate={{ y: 330 - h, height: h }} transition={{ duration: 0.9, delay: 0.2 + i * 0.18, ease: "easeOut" }} />
      ))}
      {/* people on the steps */}
      {STEPS.map((h, i) => (
        <motion.g key={i} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.18 }}>
          <circle cx={78 + i * 78} cy={top(i) - 26} r="8" fill="#e5e7eb" />
          <path d={`M${66 + i * 78} ${top(i) - 4} a12 12 0 0 1 24 0 Z`} fill={i === STEPS.length - 1 ? "#fff" : RED} />
        </motion.g>
      ))}
      {/* trend line */}
      <motion.path d={`M78 ${top(0) - 40} L156 ${top(1) - 40} L234 ${top(2) - 40} L312 ${top(3) - 40} L390 ${top(4) - 40}`} fill="none" stroke={RED_LIGHT} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 1.3, ease: "easeInOut" }} />
      <Flow x1="410" y1="120" x2="448" y2="124" delay={0.2} />

      {/* global reach */}
      <motion.g animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx="530" cy="150" r="96" fill="none" stroke="#5a5a5a" strokeWidth="1.5" strokeDasharray="4 8" />
      </motion.g>
      <circle cx="530" cy="150" r="76" fill="#262626" stroke="#6b6b6b" strokeWidth="2" />
      <ellipse cx="530" cy="150" rx="30" ry="76" fill="none" stroke="#4b4b4b" strokeWidth="1.5" />
      <ellipse cx="530" cy="150" rx="58" ry="76" fill="none" stroke="#4b4b4b" strokeWidth="1.5" />
      <line x1="454" y1="150" x2="606" y2="150" stroke="#4b4b4b" strokeWidth="1.5" />
      <ellipse cx="530" cy="112" rx="66" ry="12" fill="none" stroke="#4b4b4b" strokeWidth="1.5" />
      <ellipse cx="530" cy="188" rx="66" ry="12" fill="none" stroke="#4b4b4b" strokeWidth="1.5" />
      {[[500, 120], [560, 132], [520, 178], [574, 172], [492, 150]].map(([x, y], i) => (
        <g key={i}>
          <motion.circle cx={x} cy={y} r="9" fill={RED} initial={{ opacity: 0.2 }} animate={reduce ? {} : { scale: [1, 2.2], opacity: [0.5, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          <circle cx={x} cy={y} r="4.5" fill={i === 0 ? "#fff" : RED_LIGHT} />
        </g>
      ))}

      {/* ground + tagline */}
      <rect x="30" y="334" width="580" height="8" rx="4" fill="#1a1a1a" />
      <rect x="226" y="356" width="188" height="34" rx="17" fill="#2f2f2f" stroke="#5a5a5a" />
      <text x="320" y="378" textAnchor="middle" fontSize="16" fontWeight="700" letterSpacing="3" fill="#fff" style={display}>SCALE SMARTER</text>
    </svg>
  );
};

export const ABOUT_SCENES = { about: AboutUsScene, hardware: HardwareScene, compliance: ComplianceScene, operations: OperationsScene };
