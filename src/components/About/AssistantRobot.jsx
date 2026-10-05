import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COLORS } from "@/constant/styles";

/* The AI assistant of the What We Offer section. It acts out the services listed next to it: every few seconds it
   demonstrates the next one on a holographic panel, and hovering a service card makes it demonstrate that service.
   It also follows the cursor with its eyes when you come near, celebrates when hovered and moves on when clicked.
   There is no text in the drawing. */
const RED = COLORS.primary;
const GLOW = "#ff6b6b";
const HEART = "M0 6 C-10 -3 -12 -11 -5 -11 C-2 -11 0 -8 0 -7 C0 -8 2 -11 5 -11 C12 -11 10 -3 0 6 Z";

/* The keys match the cards in WhatWeOffer. */
export const DEMOS = ["admin", "ai", "funnel", "website", "automation", "internal", "label", "surveys", "booking", "webdev", "design", "crm"];
const SEQUENCE = ["thumbsup", ...DEMOS];
const ACTION_MS = 4000;
const NEAR_PX = 300;
const SMOOTH = { duration: 0.6, ease: "easeInOut" };
const SLOW = { duration: 3.4, ease: "easeInOut" };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* Arms have two joints. Angles are measured from "hanging straight down" and are positive when the segment swings
   away from the body, so the same numbers describe the left and the right arm.
   s = shoulder, e = elbow (relative to the upper arm), h = hand shape. Every pose lists every value. */
const REST = { s: 6, e: -8, h: "open" };
const P = (o = {}) => ({
  l: { ...REST, ...o.l },
  r: { ...REST, ...o.r },
  head: { rotate: 0, y: 0, ...o.head },
  eyes: { x: 0, y: 0, ...o.eyes },
  body: { y: 0, rotate: 0, ...o.body },
  t: o.t || SMOOTH,
});
const alt = (a, b) => [a, b, a, b, a, b];
/* Both hands work in front of the chest, one a little ahead of the other. */
const WORK = (o = {}) => P({
  l: { s: -14, e: alt(-88, -72), h: "open", ...o.l },
  r: { s: -14, e: alt(-72, -88), h: "open", ...o.r },
  head: { y: [0, 2, 0, 2, 0], ...o.head },
  eyes: { y: 5, ...o.eyes },
  t: SLOW,
});

const POSES = {
  thumbsup: P({ r: { s: 30, e: [118, 126, 118], h: "thumb" }, head: { rotate: [0, 2, 0] }, t: SLOW }),
  cheer: P({ l: { s: alt(140, 152), e: alt(34, 18) }, r: { s: alt(140, 152), e: alt(34, 18) }, head: { y: [0, -6, 0, -6, 0] }, body: { y: [0, -12, 0, -12, 0] }, t: SLOW }),
  admin: WORK({ l: { s: -12, e: alt(-92, -80), h: "point" }, r: { s: -12, e: alt(-80, -92), h: "point" } }),
  ai: WORK({ r: { e: alt(-96, -70), h: "point" } }),
  funnel: WORK({ l: { e: -86 }, r: { e: alt(-100, -80), h: "point" } }),
  website: WORK({ l: { e: alt(-96, -70), h: "point" }, r: { e: alt(-70, -96), h: "point" } }),
  automation: WORK({ l: { e: -88 }, r: { e: -88 }, body: { y: [0, -2, 0, -2, 0] } }),
  internal: WORK({ l: { e: alt(-104, -74) }, r: { e: alt(-74, -104) } }),
  label: WORK({ l: { e: -90 }, r: { s: -8, e: alt(-120, -100) } }),
  surveys: WORK({ l: { s: -18, e: -100 }, r: { e: alt(-96, -78), h: "point" } }),
  booking: WORK({ l: { e: -86 }, r: { e: alt(-100, -78), h: "point" } }),
  webdev: WORK(),
  design: WORK({ l: { e: -86 }, r: { e: alt(-106, -70), h: "point" } }),
  crm: WORK({ l: { e: alt(-100, -76) }, r: { e: alt(-76, -100), h: "point" } }),
};

const SPARKS = [[40, 120, 0], [320, 110, 0.15], [24, 250, 0.3], [338, 240, 0.45], [110, 30, 0.6], [250, 24, 0.75]];

/* A robotic glove. fist, thumb (thumbs-up), point (index finger out) or open. Drawn pointing down from the wrist. */
const Hand = ({ mode: shape }) => {
  const mode = shape === "point" ? "open" : shape; // an extended single finger looked like a rude gesture, so it is an open hand instead
  return (
  <g transform="translate(0 104)">
    <rect x="-9" y="-4" width="18" height="10" rx="3" fill="#3a3a3a" />
    <rect x="-12" y="2" width="24" height="22" rx="10" fill="#262626" stroke="#4d4d4d" strokeWidth="1" />
    <path d="M-7 8 Q0 4 7 8" stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round" />
    {mode === "open" && (
      <g fill="#2e2e2e" stroke="#4d4d4d" strokeWidth="1">
        {[[-11.5, 14], [-4, 18], [3.5, 18], [11, 14]].map(([x, len]) => <rect key={x} x={x - 3} y="18" width="6" height={len} rx="3" />)}
        <rect x="-19" y="6" width="7" height="15" rx="3.5" transform="rotate(24 -15 8)" />
      </g>
    )}
    {mode === "point" && (
      <g fill="#2e2e2e" stroke="#4d4d4d" strokeWidth="1">
        <rect x="-3" y="18" width="6" height="24" rx="3" />
        <path d="M-9 22 H9" stroke="#555" strokeWidth="2" />
      </g>
    )}
    {mode === "thumb" && (
      <g fill="#2e2e2e" stroke="#4d4d4d" strokeWidth="1">
        <motion.rect x="-6" width="12" height="24" rx="6" initial={{ y: 20 }} animate={{ y: [22, 16, 22] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
        <path d="M-9 14 H9 M-9 19 H9" stroke="#555" strokeWidth="2" />
      </g>
    )}
    {mode === "fist" && <path d="M-9 16 H9 M-9 20 H9" stroke="#555" strokeWidth="2" />}
  </g>
  );
};

/* One articulated arm: shoulder cap, upper arm, a mechanical elbow, forearm with a white cuff, and the glove. */
const Arm = ({ u, side, pose, t }) => {
  const sign = side < 0 ? 1 : -1; // left arm: clockwise swings it outward, right arm: counter-clockwise
  const x = side < 0 ? 96 : 264;
  const rot = (v) => (Array.isArray(v) ? v.map((a) => a * sign) : v * sign);
  return (
    <g transform={`translate(${x} 252)`}>
      <motion.g animate={{ rotate: rot(pose.s) }} transition={t} style={{ transformOrigin: "0px 0px" }}>
        <rect x="-12" y="-2" width="24" height="68" rx="12" fill={`url(#${u}-jacket)`} />
        <rect x="-12" y="-2" width="7" height="68" rx="3.5" fill="#fff" opacity=".1" />
        <motion.g animate={{ rotate: rot(pose.e) }} transition={t} style={{ transformOrigin: "0px 62px" }}>
          <rect x="-10" y="58" width="20" height="52" rx="10" fill={`url(#${u}-jacket)`} />
          <rect x="-11.5" y="92" width="23" height="9" rx="3" fill="#f3f4f6" />
          <Hand mode={pose.h} />
          <circle cx="0" cy="62" r="11" fill="#2a2a2a" stroke="#666" strokeWidth="1.5" />
          <circle cx="0" cy="62" r="4" fill={RED} />
        </motion.g>
        <circle cx="0" cy="0" r="15" fill={`url(#${u}-jacket)`} />
        <circle cx="-3" cy="-4" r="4" fill="#fff" opacity=".18" />
      </motion.g>
    </g>
  );
};

/* ------------------------------------------------------------------ holograms: one per service */
const Cube = ({ x, y, s = 16, c = "#fff" }) => (
  <g>
    <polygon points={`${x},${y - s * 0.5} ${x + s},${y} ${x},${y + s * 0.5} ${x - s},${y}`} fill={c} />
    <polygon points={`${x - s},${y} ${x},${y + s * 0.5} ${x},${y + s * 1.5} ${x - s},${y + s}`} fill={c} opacity=".6" />
    <polygon points={`${x + s},${y} ${x},${y + s * 0.5} ${x},${y + s * 1.5} ${x + s},${y + s}`} fill={c} opacity=".35" />
  </g>
);

const Check = ({ x, y, r = 9, delay = 0 }) => (
  <motion.g initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1, 1, 0] }} transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.2, 0.3, 0.85, 1], delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <circle cx={x} cy={y} r={r} fill="#fff" />
    <path d={`M${x - r * 0.45} ${y} l${r * 0.3} ${r * 0.35} l${r * 0.6} -${r * 0.7}`} stroke={RED} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </motion.g>
);

const HOLO = {
  /* the GoHighLevel Admin tuning the system */
  admin: () => (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="22" y={26 + i * 24} width="106" height="6" rx="3" fill="#444" />
          <motion.rect x="22" y={26 + i * 24} height="6" rx="3" fill={GLOW} initial={{ width: 30 }} animate={{ width: [30 + i * 14, 96 - i * 10, 30 + i * 14] }} transition={{ duration: 2.2 + i * 0.4, repeat: Infinity, ease: "easeInOut" }} />
          <motion.circle cy={29 + i * 24} r="8" fill="#fff" stroke={RED} strokeWidth="2.5" initial={{ cx: 52 }} animate={{ cx: [52 + i * 14, 118 - i * 10, 52 + i * 14] }} transition={{ duration: 2.2 + i * 0.4, repeat: Infinity, ease: "easeInOut" }} />
        </g>
      ))}
      <motion.polyline points="104,14 114,8 124,12 134,4" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
    </g>
  ),
  /* AI Builder: a network of nodes lights up */
  ai: () => {
    const N = [[28, 30], [74, 16], [122, 32], [40, 76], [110, 80], [76, 52]];
    const E = [[0, 1], [1, 2], [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [3, 0], [4, 2]];
    return (
      <g>
        {E.map(([a, b], i) => <motion.line key={i} x1={N[a][0]} y1={N[a][1]} x2={N[b][0]} y2={N[b][1]} stroke={GLOW} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 6" animate={{ strokeDashoffset: [0, -16] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />)}
        {N.map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r={i === 5 ? 11 : 7} fill={i === 5 ? "#fff" : GLOW} animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.22 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        ))}
        <circle cx="76" cy="52" r="4" fill={RED} />
      </g>
    );
  },
  /* Funnel Builder: visitors go in, customers come out */
  funnel: () => (
    <g>
      <path d="M16 14 H134 L90 58 V84 H60 V58 Z" fill="rgba(255,107,107,.12)" stroke={GLOW} strokeWidth="2.5" strokeLinejoin="round" />
      {[28, 54, 76, 98, 120].map((x, i) => (
        <motion.circle key={x} cx={x} r="4.5" fill="#fff" initial={{ cy: 4, opacity: 0 }} animate={{ cx: [x, x, 75], cy: [4, 18, 82], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.38, ease: "easeIn" }} />
      ))}
      <Check x={75} y={92} r={8} />
    </g>
  ),
  /* Website Builder: a page assembles itself */
  website: () => (
    <g>
      <rect x="8" y="8" width="134" height="14" rx="5" fill="#333" />
      {[16, 26, 36].map((x, i) => <circle key={x} cx={x} cy="15" r="2.5" fill={i === 0 ? GLOW : "#888"} />)}
      {[[8, 28, 134, 28, GLOW], [8, 62, 64, 34, "#fff"], [78, 62, 64, 34, "#fff"]].map(([x, y, w, h, c], i) => (
        <motion.rect key={i} x={x} y={y} width={w} height={h} rx="6" fill={c} fillOpacity={c === "#fff" ? 0.85 : 0.8}
          initial={{ scaleY: 0 }} animate={{ scaleY: [0, 1, 1, 0] }} transition={{ duration: 3, repeat: Infinity, times: [0, 0.2, 0.85, 1], delay: i * 0.35 }} style={{ transformBox: "fill-box", transformOrigin: "top" }} />
      ))}
    </g>
  ),
  /* Automation: gears turn and a loop runs */
  automation: () => (
    <g>
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "52px 54px" }}>
        <circle cx="52" cy="54" r="26" fill="none" stroke="#fff" strokeWidth="7" strokeDasharray="7 5" opacity=".9" />
        <circle cx="52" cy="54" r="19" fill="rgba(255,255,255,.08)" stroke="#fff" strokeWidth="2" />
        <circle cx="52" cy="54" r="6" fill={RED} />
      </motion.g>
      <motion.g animate={{ rotate: -360 }} transition={{ duration: 4.4, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "104px 40px" }}>
        <circle cx="104" cy="40" r="19" fill="none" stroke={GLOW} strokeWidth="6" strokeDasharray="6 4" />
        <circle cx="104" cy="40" r="13" fill="rgba(255,107,107,.15)" stroke={GLOW} strokeWidth="2" />
        <circle cx="104" cy="40" r="4" fill="#fff" />
      </motion.g>
      <motion.path d="M30 92 Q75 108 122 82" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 7" animate={{ strokeDashoffset: [0, -20] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
    </g>
  ),
  /* Internal Systems: blocks stack into place */
  internal: () => (
    <g>
      {[[75, 62, 0], [50, 48, 0.5], [100, 48, 1], [75, 34, 1.5]].map(([x, y, d], i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ y: [-26, 0, 0], opacity: [0, 1, 1] }} transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.2, 1], delay: d * 0.5, repeatDelay: 0.4 }}>
          <Cube x={x} y={y} s={20} c={i % 2 ? "#fff" : GLOW} />
        </motion.g>
      ))}
    </g>
  ),
  /* White / Gray Label: the tag is rebranded */
  label: () => (
    <g>
      <motion.g animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "75px 6px" }}>
        <line x1="75" y1="6" x2="75" y2="26" stroke="#bbb" strokeWidth="2" />
        <motion.path d="M45 30 H105 Q112 30 112 37 V82 Q112 89 105 89 H45 Q38 89 38 82 V37 Q38 30 45 30 Z" initial={{ fill: "#9ca3af" }} animate={{ fill: ["#9ca3af", "#9ca3af", RED, RED, "#9ca3af"] }} transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.25, 0.5, 0.85, 1] }} />
        <circle cx="75" cy="40" r="5" fill="#150606" />
        <rect x="52" y="54" width="46" height="6" rx="3" fill="#fff" opacity=".85" />
        <rect x="52" y="68" width="30" height="6" rx="3" fill="#fff" opacity=".55" />
      </motion.g>
      <motion.path d="M118 50 q14 -8 14 8 M126 52 l6 -6 l4 8" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3.2, repeat: Infinity }} />
    </g>
  ),
  /* Surveys: answers get ticked */
  surveys: () => (
    <g>
      <rect x="30" y="8" width="90" height="90" rx="9" fill="#f3f4f6" />
      <rect x="55" y="3" width="40" height="12" rx="5" fill="#2a2a2a" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="42" y={26 + i * 22} width="14" height="14" rx="3" fill="none" stroke={RED} strokeWidth="2.5" />
          <motion.path d={`M45 ${33 + i * 22} l4 4 l7 -9`} stroke={RED} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.15, 0.85, 1], delay: i * 0.5 }} />
          <rect x="64" y={29 + i * 22} width={44 - i * 8} height="7" rx="3.5" fill="#cbd0d6" />
        </g>
      ))}
    </g>
  ),
  /* Booking: a slot is picked on the calendar */
  booking: () => (
    <g>
      <rect x="12" y="8" width="126" height="90" rx="9" fill="#f3f4f6" />
      <path d="M12 17 A9 9 0 0 1 21 8 H129 A9 9 0 0 1 138 17 V28 H12 Z" fill={RED} />
      {[0, 1, 2, 3].flatMap((c) => [0, 1].map((r) => <rect key={`${c}-${r}`} x={22 + c * 28} y={38 + r * 27} width="20" height="19" rx="4" fill="#dfe3e8" />))}
      <motion.rect width="20" height="19" rx="4" fill={RED} initial={{ x: 22, y: 38 }} animate={{ x: [22, 78, 106, 50, 22], y: [38, 38, 65, 65, 38] }} transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }} />
      <motion.g animate={{ x: [0, 56, 84, 28, 0], y: [0, 0, 27, 27, 0] }} transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}>
        <path d="M27 47 l5 5 l9 -11" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </g>
  ),
  /* Web Dev: code appears */
  webdev: () => (
    <g>
      <rect x="8" y="8" width="134" height="88" rx="8" fill="#101010" stroke="#444" />
      <motion.polyline points="46,32 30,48 46,64" fill="none" stroke={GLOW} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.4, repeat: Infinity }} />
      <motion.polyline points="104,32 120,48 104,64" fill="none" stroke={GLOW} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.3 }} />
      <line x1="82" y1="30" x2="68" y2="66" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      {[0, 1].map((i) => <motion.rect key={i} x="22" y={76 + i * 9} height="4" rx="2" fill={i ? "#888" : "#fff"} initial={{ width: 6 }} animate={{ width: [6, 90 - i * 30, 6] }} transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: "easeInOut" }} />)}
    </g>
  ),
  /* Design: a curve is drawn on a canvas */
  design: () => (
    <g>
      <rect x="10" y="8" width="130" height="88" rx="9" fill="#f3f4f6" />
      <motion.path d="M24 72 C48 16 88 96 126 34" fill="none" stroke={RED} strokeWidth="6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.55, 0.9, 1], ease: "easeInOut" }} />
      {[RED, "#2a2a2a", GLOW].map((c, i) => <circle key={c} cx={28 + i * 16} cy="84" r="5" fill={c} />)}
      <motion.circle r="6" fill="#fff" stroke={RED} strokeWidth="3" initial={{ cx: 24, cy: 72 }} animate={{ cx: [24, 62, 100, 126], cy: [72, 38, 70, 34], opacity: [1, 1, 1, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />
    </g>
  ),
  /* CRM: a lead moves through the pipeline */
  crm: () => (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${10 + i * 47} 14)`}>
          <rect width="38" height="62" rx="8" fill="#f3f4f6" />
          <circle cx="19" cy="18" r="8" fill={i === 2 ? RED : "#9ca3af"} />
          <rect x="7" y="34" width="24" height="5" rx="2.5" fill="#cbd0d6" />
          <rect x="11" y="44" width="16" height="5" rx="2.5" fill="#dfe3e8" />
        </g>
      ))}
      {[48, 95].map((x) => <path key={x} d={`M${x} 45 h8 m-3 -4 l4 4 l-4 4`} stroke={GLOW} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
      <motion.circle r="7" fill={RED} stroke="#fff" strokeWidth="2.5" initial={{ cx: 29, cy: 88 }} animate={{ cx: [29, 76, 123], opacity: [1, 1, 1] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} cy="88" />
      <Check x={123} y={92} r={8} delay={1.4} />
    </g>
  ),
};

const AssistantRobot = ({ demo = null }) => {
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const [step, setStep] = useState(0);
  const [override, setOverride] = useState(null);
  const [near, setNear] = useState(false);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [boop, setBoop] = useState(0);
  const u = "as" + useId().replace(/[^a-zA-Z0-9]/g, "");

  // walk through the services one after another
  useEffect(() => {
    if (reduce) return undefined;
    const id = setInterval(() => { setOverride(null); setStep((s) => (s + 1) % SEQUENCE.length); }, ACTION_MS);
    return () => clearInterval(id);
  }, [reduce]);

  // follow the cursor with the eyes when it comes close
  useEffect(() => {
    if (reduce) return undefined;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = rootRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0) { setNear(false); return; }
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height * 0.3);
        setNear(Math.hypot(dx, dy) < NEAR_PX);
        setGaze({ x: Math.round(clamp(dx / 25, -8, 8)), y: Math.round(clamp(dy / 35, -5, 5)) });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, [reduce]);

  // a hovered service card wins, then hover/click on the robot, then the cursor, then the walkthrough
  const action = reduce ? "thumbsup" : (demo && POSES[demo] ? demo : override || (near ? "follow" : SEQUENCE[step]));
  const p = reduce ? P() : action === "follow" ? P({ eyes: gaze, head: { rotate: gaze.x * 0.8 }, t: { duration: 0.2 } }) : POSES[action];
  const is = (a) => action === a;
  const happy = is("cheer");
  const holo = HOLO[action];

  return (
    <div ref={rootRef} className="cursor-pointer select-none"
      onPointerEnter={() => { if (!demo) setOverride("cheer"); }}
      onClick={() => { setOverride(null); setStep((s) => (s + 1) % SEQUENCE.length); setBoop((k) => k + 1); }}>
      <svg viewBox="0 0 360 430" role="img" aria-label="An AI assistant" className="h-auto w-full overflow-visible">
        <defs>
          <linearGradient id={`${u}-jacket`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d41a1a" /><stop offset="1" stopColor="#7a0000" /></linearGradient>
          <linearGradient id={`${u}-head`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#cfd4da" /></linearGradient>
          <radialGradient id={`${u}-eye`} cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#ffd2d2" /></radialGradient>
          <filter id={`${u}-glow`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>

        <ellipse cx="180" cy="414" rx="120" ry="10" fill="#000" opacity=".35" />
        {boop > 0 && (
          <motion.circle key={boop} cx="180" cy="260" r="60" fill="none" stroke="#fff" strokeWidth="4" initial={{ opacity: 0.9, scale: 0.4 }} animate={{ opacity: 0, scale: 3 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        )}

        <motion.g animate={reduce ? {} : { y: [0, -6, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
          <motion.g animate={p.body} transition={p.t} style={{ transformOrigin: "180px 392px" }}>
            {/* torso */}
            <path d="M84 238 Q180 208 276 238 L296 392 H64 Z" fill={`url(#${u}-jacket)`} />
            <path d="M150 226 L180 316 L210 226 Z" fill="#fff" />
            <path d="M84 238 Q110 232 150 226 L180 316 L120 392 H64 Z" fill="#000" opacity=".1" />
            <path d="M276 238 Q250 232 210 226 L180 316 L240 392 H296 Z" fill="#fff" opacity=".07" />
            <path d="M152 228 L166 330 M208 228 L194 330" stroke="#282828" strokeWidth="5" fill="none" strokeLinecap="round" />
            <rect x="156" y="326" width="48" height="58" rx="7" fill="#fff" />
            <rect x="156" y="326" width="48" height="12" rx="6" fill={RED} />
            <circle cx="180" cy="352" r="7" fill="#d1d5db" /><rect x="164" y="366" width="32" height="5" rx="2.5" fill="#d1d5db" />

            {/* the hologram for the current service, in front of the torso and under the hands */}
            {holo && (
              <motion.g key={action} initial={{ opacity: 0, y: 12, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45 }} style={{ transformOrigin: "180px 278px" }}>
                <g transform="translate(105 226)">
                  <rect width="150" height="104" rx="12" fill="#150606" fillOpacity=".9" stroke={GLOW} strokeWidth="1.5" />
                  <rect width="150" height="104" rx="12" fill="none" stroke="#fff" strokeOpacity=".15" strokeWidth="1" transform="translate(3 3) scale(.96)" />
                  {holo()}
                </g>
              </motion.g>
            )}

            {/* arms, in front of the torso */}
            <Arm u={u} side={-1} pose={p.l} t={p.t} />
            <Arm u={u} side={1} pose={p.r} t={p.t} />

            {/* neck + head */}
            <rect x="160" y="196" width="40" height="22" rx="6" fill="#282828" />
            <motion.g animate={p.head} transition={p.t} style={{ transformOrigin: "180px 200px" }}>
              <path d="M100 118 C100 40 260 40 260 118" stroke="#282828" strokeWidth="9" fill="none" strokeLinecap="round" />
              <rect x="100" y="76" width="160" height="128" rx="40" fill={`url(#${u}-head)`} />
              <rect x="116" y="98" width="128" height="80" rx="28" fill="#141414" />
              <path d="M128 106 Q180 98 232 106" stroke="#fff" strokeOpacity=".15" strokeWidth="3" fill="none" strokeLinecap="round" />

              <motion.g animate={p.eyes} transition={p.t}>
                {happy ? (
                  [150, 210].map((cx) => <path key={cx} d={`M${cx - 15} 146 Q${cx} 124 ${cx + 15} 146`} stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" />)
                ) : (
                  [150, 210].map((cx) => (
                    <motion.g key={cx} animate={reduce ? {} : { scaleY: [1, 1, 0.1, 1, 1] }} transition={{ duration: 5, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                      <circle cx={cx} cy="138" r="22" fill={RED} opacity=".35" />
                      <circle cx={cx} cy="138" r="13" fill={`url(#${u}-eye)`} />
                    </motion.g>
                  ))
                )}
              </motion.g>
              <path d={happy ? "M156 164 Q180 188 204 164" : "M168 164 Q180 172 192 164"} stroke="#fff" strokeOpacity=".5" strokeWidth="3" fill="none" strokeLinecap="round" />

              <rect x="80" y="112" width="26" height="52" rx="13" fill="#282828" stroke={RED} strokeWidth="3" />
              <rect x="254" y="112" width="26" height="52" rx="13" fill="#282828" stroke={RED} strokeWidth="3" />
              <path d="M90 160 C90 196 118 206 146 198" stroke="#282828" strokeWidth="5" fill="none" strokeLinecap="round" />
              <circle cx="150" cy="197" r="7" fill={RED} />
              <line x1="180" y1="76" x2="180" y2="46" stroke="#282828" strokeWidth="5" strokeLinecap="round" />
              <motion.circle cx="180" cy="40" r="8" fill={RED} animate={reduce ? {} : { opacity: [0.4, 1, 0.4], scale: [1, 1.25, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            </motion.g>
          </motion.g>
        </motion.g>

        {/* cheer sparkles */}
        {happy && SPARKS.map(([x, y, d]) => (
          <motion.path key={`${x}-${y}`} d={`M${x} ${y - 12} L${x + 3} ${y - 3} L${x + 12} ${y} L${x + 3} ${y + 3} L${x} ${y + 12} L${x - 3} ${y + 3} L${x - 12} ${y} L${x - 3} ${y - 3} Z`}
            fill={d % 0.3 === 0 ? "#fff" : GLOW} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: [0, 90] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: d }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        ))}
      </svg>
    </div>
  );
};

export default AssistantRobot;
