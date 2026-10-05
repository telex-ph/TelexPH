
import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Poppins, Open_Sans } from "next/font/google";
import HighLevelMessage from "./HighLevelMessage";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-poppins",
  display: "swap"
});
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-open-sans",
  display: "swap"
});

const RED = "#a10000";
const GLOW = "#ff4d4d";
const HEART = "M0 6 C-10 -3 -12 -11 -5 -11 C-2 -11 0 -8 0 -7 C0 -8 2 -11 5 -11 C12 -11 10 -3 0 6 Z";

/* The robot picks a routine at random every few seconds. It also reacts to you: it follows the cursor with its eyes
   when you come close, celebrates when hovered, and does something new each time it is clicked. */
const ACTIONS = ["wave", "look", "nod", "type", "think", "idea", "scan", "point", "chat", "call", "salute", "dance", "charge", "wink", "heart", "highfive", "sleep", "cheer"];
const ACTION_MS = 3400;
const NEAR_PX = 340;
const SMOOTH = { duration: 0.6, ease: "easeInOut" };
const SLOW = { duration: 2.8, ease: "easeInOut" };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pickNext = (prev) => {
  let n;
  do { n = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]; } while (n === prev);
  return n;
};

// every pose lists every value, so the previous routine never leaves anything behind
const P = (o = {}) => ({
  l: { rotate: 0, ...o.l },
  r: { rotate: 0, ...o.r },
  head: { rotate: 0, y: 0, ...o.head },
  eyes: { x: 0, y: 0, ...o.eyes },
  body: { y: 0, rotate: 0, ...o.body },
  t: o.t || SMOOTH,
});

const POSES = {
  wave: P({ l: { rotate: [0, -32, 4, -32, 4, 0] }, t: SLOW }),
  look: P({ head: { rotate: [0, -6, 6, 0] }, eyes: { x: [0, -6, 6, 0] }, t: SLOW }),
  nod: P({ head: { y: [0, 5, 0, 5, 0] }, t: SLOW }),
  type: P({ l: { rotate: [-30, -46, -30, -46, -30, -46] }, r: { rotate: [46, 30, 46, 30, 46, 30] }, head: { y: [0, 2, 0, 2, 0] }, eyes: { y: 3 }, t: SLOW }),
  think: P({ head: { rotate: -7 }, eyes: { x: -4, y: -4 } }),
  idea: P({ r: { rotate: -150 }, head: { rotate: -4, y: -2 }, eyes: { y: -4 } }),
  scan: P({ head: { rotate: [-6, 6, -6, 6, -6] }, eyes: { x: [-4, 4, -4, 4, -4] }, t: SLOW }),
  point: P({ r: { rotate: -88 }, head: { rotate: 4 }, eyes: { x: 5 } }),
  chat: P({ l: { rotate: [0, -22, 0, -22, 0] }, r: { rotate: [0, 22, 0, 22, 0] }, head: { rotate: [0, -3, 3, -3, 0] }, t: SLOW }),
  call: P({ l: { rotate: 160 }, head: { rotate: 3 }, eyes: { x: -3 } }),
  salute: P({ r: { rotate: [0, 150, 150, 150, 150, 150] }, head: { rotate: -3 }, t: SLOW }),
  dance: P({ l: { rotate: [60, 0, 60, 0, 60, 0] }, r: { rotate: [0, -60, 0, -60, 0, -60] }, head: { rotate: [-5, 5, -5, 5, -5, 5] }, body: { y: [0, -6, 0, -6, 0, -6], rotate: [-4, 4, -4, 4, -4, 4] }, t: SLOW }),
  charge: P({ l: { rotate: 14 }, r: { rotate: -14 }, body: { rotate: [-1.5, 1.5] }, t: { duration: 0.08, repeat: 34, repeatType: "mirror" } }),
  wink: P({ head: { rotate: 5 }, eyes: { x: 2 } }),
  heart: P({ l: { rotate: -50 }, r: { rotate: 50 }, head: { rotate: [0, 4, -4, 0] }, body: { y: [0, -4, 0, -4, 0] }, t: SLOW }),
  highfive: P({ r: { rotate: -105 }, head: { rotate: 3 }, eyes: { x: 5 } }),
  sleep: P({ head: { rotate: 12, y: 6 }, body: { y: 3 }, eyes: { y: 2 }, t: { duration: 1.2, ease: "easeInOut" } }),
  cheer: P({ l: { rotate: [0, 150, 130, 150, 130, 150] }, r: { rotate: [0, -150, -130, -150, -130, -150] }, head: { y: [0, -5, 0, -5, 0] }, body: { y: [0, -9, 0, -9, 0] }, t: SLOW }),
};

/* One arm: a segmented capsule with a shoulder joint and a hand. Mirrored for the other side. */
const Arm = ({ u, x, flip = false, pose, t }) => (
  <motion.g style={{ transformBox: "fill-box", transformOrigin: "50% 8%" }} animate={pose} transition={t}>
    <g transform={flip ? `translate(${x} 0) scale(-1 1)` : `translate(${x} 0)`}>
      <rect x="-9" y="124" width="18" height="52" rx="9" fill={`url(#${u}-shell)`} stroke="#8d96a1" strokeWidth="1" />
      <rect x="-9" y="146" width="18" height="6" fill={RED} />
      <rect x="-5" y="130" width="3" height="40" rx="1.5" fill="#fff" opacity=".7" />
      <circle cx="0" cy="126" r="10" fill="#222" stroke="#6b6b6b" strokeWidth="1.5" />
      <circle cx="0" cy="126" r="4" fill={RED} />
      <circle cx="0" cy="126" r="1.8" fill={GLOW} />
      <circle cx="0" cy="178" r="10.5" fill={`url(#${u}-shell)`} stroke="#8d96a1" strokeWidth="1" />
      <path d="M-5 174 Q0 170 5 174" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".8" />
    </g>
  </motion.g>
);

const PARTICLES = [[22, 190, 0], [150, 196, 0.8], [40, 150, 1.6], [138, 130, 2.4], [92, 200, 3.1]];
const SPARKS = [[18, 30, 0], [162, 24, 0.15], [8, 100, 0.3], [172, 96, 0.45], [60, 4, 0.6], [124, 2, 0.75]];

const PeekingRobot = ({ showMessage = true }) => {
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const [current, setCurrent] = useState("wave");
  const [override, setOverride] = useState(null);
  const [near, setNear] = useState(false);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [boop, setBoop] = useState(0);
  // the robot is rendered twice in the hero (one copy is hidden), so SVG ids must be unique per instance
  const u = "pr" + useId().replace(/[^a-zA-Z0-9]/g, "");

  // pick a new routine every few seconds
  useEffect(() => {
    if (reduce) return undefined;
    const id = setInterval(() => { setOverride(null); setCurrent((c) => pickNext(c)); }, ACTION_MS);
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
        if (r.width === 0) { setNear(false); return; } // the hidden copy
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height * 0.3);
        setNear(Math.hypot(dx, dy) < NEAR_PX);
        setGaze({ x: Math.round(clamp(dx / 30, -6, 6)), y: Math.round(clamp(dy / 40, -4, 4)) });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, [reduce]);

  const action = reduce ? "wave" : override || (near ? "follow" : current);
  const p = reduce
    ? P()
    : action === "follow"
      ? P({ eyes: gaze, head: { rotate: gaze.x * 0.7 }, t: { duration: 0.2 } })
      : POSES[action];
  const is = (a) => action === a;
  const happy = is("cheer");
  const loving = is("heart");
  const sleeping = is("sleep");
  const winking = is("wink");

  return <motion.div
    ref={rootRef}
    initial={{ x: -250 }}
    animate={{ x: -50 }}
    transition={{ duration: 1, delay: 2, ease: "easeOut" }}
    className={`absolute bottom-0 left-0 z-50 cursor-pointer ${poppins.variable} ${openSans.variable}`}
    whileHover={{ x: 0 }}
    onHoverStart={() => setOverride("cheer")}
    onClick={() => { setOverride(pickNext(action)); setBoop((k) => k + 1); }}
  >
      <div className="relative w-[180px] h-[220px]">
        <motion.div
    animate={reduce ? {} : { y: [0, -12, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    className="relative w-full h-full"
  >
          <svg viewBox="0 0 180 220" className="h-full w-full overflow-visible" role="img" aria-label="TelexPH assistant robot">
            <defs>
              <linearGradient id={`${u}-shell`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.5" stopColor="#e6eaef" />
                <stop offset="1" stopColor="#a9b1bb" />
              </linearGradient>
              <linearGradient id={`${u}-visor`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3a1010" />
                <stop offset="1" stopColor="#0b0404" />
              </linearGradient>
              <linearGradient id={`${u}-glass`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity=".28" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`${u}-beam`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={GLOW} stopOpacity=".55" />
                <stop offset="1" stopColor={GLOW} stopOpacity="0" />
              </linearGradient>
              <radialGradient id={`${u}-eye`} cx=".5" cy=".4" r=".6">
                <stop offset="0" stopColor="#ffe5e5" />
                <stop offset="0.45" stopColor={GLOW} />
                <stop offset="1" stopColor="#b30000" />
              </radialGradient>
              <radialGradient id={`${u}-core`} cx=".5" cy=".5" r=".5">
                <stop offset="0" stopColor="#fff" />
                <stop offset="0.35" stopColor={GLOW} />
                <stop offset="1" stopColor="#6e0000" />
              </radialGradient>
              <radialGradient id={`${u}-pad`} cx=".5" cy=".5" r=".5">
                <stop offset="0" stopColor={GLOW} stopOpacity=".7" />
                <stop offset="1" stopColor={GLOW} stopOpacity="0" />
              </radialGradient>
              <clipPath id={`${u}-clip`}><rect x="44" y="40" width="92" height="48" rx="22" /></clipPath>
              <filter id={`${u}-glow`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
            </defs>

            {/* glowing landing pad */}
            <ellipse cx="90" cy="212" rx="70" ry="10" fill={`url(#${u}-pad)`} />
            <motion.ellipse cx="90" cy="212" rx="46" ry="6" fill="none" stroke={GLOW} strokeWidth="1.5" animate={reduce ? { opacity: 0.5 } : { rx: [34, 62], opacity: [0.8, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }} />
            <motion.ellipse cx="90" cy="212" rx="38" ry="5" fill="#000" animate={reduce ? { opacity: 0.35 } : { opacity: [0.45, 0.25, 0.45] }} transition={{ duration: 3, repeat: Infinity }} />

            {/* rising data particles */}
            {!reduce && PARTICLES.map(([x, y, d]) => (
              <motion.circle key={x} cx={x} cy={y} r="2" fill="#fff" initial={{ opacity: 0 }} animate={{ y: [0, -60], opacity: [0, 0.8, 0] }} transition={{ duration: 3.4, repeat: Infinity, delay: d, ease: "easeOut" }} />
            ))}

            {/* a click sends out a ring */}
            {boop > 0 && (
              <motion.circle key={boop} cx="90" cy="120" r="30" fill="none" stroke="#fff" strokeWidth="3" initial={{ opacity: 0.9, scale: 0.4 }} animate={{ opacity: 0, scale: 3 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            )}

            {/* everything that moves with the body */}
            <motion.g animate={p.body} transition={p.t} style={{ transformOrigin: "90px 200px" }}>
              {/* antenna with signal rings */}
              <line x1="90" y1="14" x2="90" y2="30" stroke="#8a929c" strokeWidth="4" strokeLinecap="round" />
              {!reduce && [0, 1].map((i) => (
                <motion.circle key={i} cx="90" cy="10" r="6" fill="none" stroke={GLOW} strokeWidth="1.5"
                  initial={{ opacity: 0 }} animate={{ scale: [1, 3.2], opacity: [0.8, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * 1.1, ease: "easeOut" }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              ))}
              <motion.circle cx="90" cy="10" r="6" fill={GLOW} animate={reduce ? {} : { opacity: sleeping ? 0.25 : [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <circle cx="88" cy="8" r="1.8" fill="#fff" opacity=".9" />

              {/* arms behind the body */}
              <Arm u={u} x={36} pose={p.l} t={p.t} />
              <Arm u={u} x={144} flip pose={p.r} t={p.t} />

              {/* body */}
              <rect x="40" y="108" width="100" height="94" rx="38" fill={`url(#${u}-shell)`} stroke="#8d96a1" strokeWidth="1.2" />
              <path d="M52 124 Q90 112 128 124" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M48 176 Q90 196 132 176" stroke="#b3bac3" strokeWidth="1.5" fill="none" />
              <path d="M58 118 V150 M122 118 V150" stroke="#b3bac3" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="76" y="100" width="28" height="14" rx="6" fill="#2a2a2a" />
              <rect x="82" y="104" width="16" height="2.5" rx="1.2" fill={RED} />

              {/* chest core */}
              <circle cx="90" cy="156" r="26" fill="#1a1a1a" stroke="#6b6b6b" strokeWidth="1.5" />
              <circle cx="90" cy="156" r="22.5" fill="none" stroke="#333" strokeWidth="1" />
              <motion.circle cx="90" cy="156" r="20" fill="none" stroke={RED} strokeWidth="4" strokeDasharray="14 10" strokeLinecap="round"
                animate={reduce ? {} : { rotate: 360 }} transition={{ duration: happy || is("charge") ? 2 : sleeping ? 20 : 8, repeat: Infinity, ease: "linear" }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              <motion.circle cx="90" cy="156" r="12" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1" strokeDasharray="3 5"
                animate={reduce ? {} : { rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              <motion.circle cx="90" cy="156" r="13" fill={GLOW} filter={`url(#${u}-glow)`}
                animate={reduce ? { opacity: 0.5 } : { opacity: is("think") || is("charge") ? [0.2, 1, 0.2, 1, 0.2] : sleeping ? 0.15 : [0.35, 0.85, 0.35] }} transition={{ duration: is("think") || is("charge") ? 1.4 : 2, repeat: Infinity }} />
              <circle cx="90" cy="156" r="9" fill={`url(#${u}-core)`} opacity={sleeping ? 0.5 : 1} />
              <circle cx="87" cy="153" r="2.2" fill="#fff" opacity=".9" />
              {[72, 90, 108].map((cx, i) => (
                <motion.circle key={cx} cx={cx} cy="192" r="3" fill={i === 1 ? "#fff" : GLOW}
                  animate={reduce ? {} : { opacity: sleeping ? 0.2 : [0.25, 1, 0.25] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }} />
              ))}

              {/* head: nods, tilts and looks around */}
              <motion.g animate={p.head} transition={p.t} style={{ transformOrigin: "90px 104px" }}>
                <rect x="30" y="28" width="120" height="78" rx="32" fill={`url(#${u}-shell)`} stroke="#8d96a1" strokeWidth="1.2" />
                <path d="M44 38 Q90 26 136 38" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M36 92 Q90 108 144 92" stroke="#b3bac3" strokeWidth="1.5" fill="none" />
                {/* ears */}
                <rect x="16" y="52" width="16" height="32" rx="8" fill="#222" stroke={RED} strokeWidth="2.5" />
                <rect x="148" y="52" width="16" height="32" rx="8" fill="#222" stroke={RED} strokeWidth="2.5" />
                <motion.circle cx="24" cy="68" r="2.4" fill={GLOW} animate={reduce ? {} : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.6, repeat: Infinity }} />
                <motion.circle cx="156" cy="68" r="2.4" fill={GLOW} animate={reduce ? {} : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.8 }} />

                {/* visor */}
                <rect x="44" y="40" width="92" height="48" rx="22" fill={`url(#${u}-visor)`} stroke="#555" strokeWidth="1.5" />
                <g clipPath={`url(#${u}-clip)`}>
                  {!reduce && !sleeping && <motion.rect y="40" width="14" height="48" fill={GLOW} opacity=".18" animate={{ x: [30, 150] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }} />}
                  {[48, 56, 64, 72, 80].map((y) => <line key={y} x1="44" x2="136" y1={y} y2={y} stroke="#fff" strokeOpacity=".04" />)}
                  <path d="M44 40 H100 L74 88 H44 Z" fill={`url(#${u}-glass)`} />
                </g>

                {/* eyes: glance around, follow the cursor, squint, wink, close or turn into hearts */}
                <motion.g animate={p.eyes} transition={p.t}>
                  {loving ? (
                    [68, 112].map((cx, i) => (
                      <motion.g key={cx} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                        <path transform={`translate(${cx} 66) scale(1.5)`} d={HEART} fill={GLOW} filter={`url(#${u}-glow)`} opacity=".7" />
                        <path transform={`translate(${cx} 66) scale(1.2)`} d={HEART} fill="#ffd9d9" />
                      </motion.g>
                    ))
                  ) : happy ? (
                    [68, 112].map((cx) => (
                      <g key={cx}>
                        <path d={`M${cx - 10} 68 Q${cx} 52 ${cx + 10} 68`} stroke={GLOW} strokeWidth="5" fill="none" strokeLinecap="round" filter={`url(#${u}-glow)`} opacity=".7" />
                        <path d={`M${cx - 10} 68 Q${cx} 52 ${cx + 10} 68`} stroke="#ffd9d9" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                      </g>
                    ))
                  ) : sleeping ? (
                    [68, 112].map((cx) => <path key={cx} d={`M${cx - 10} 64 Q${cx} 70 ${cx + 10} 64`} stroke="#ffd9d9" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity=".8" />)
                  ) : (
                    [68, 112].map((cx, i) => (
                      winking && i === 1 ? (
                        <g key={cx}>
                          <path d={`M${cx - 10} 66 Q${cx} 56 ${cx + 10} 66`} stroke={GLOW} strokeWidth="5" fill="none" strokeLinecap="round" filter={`url(#${u}-glow)`} opacity=".7" />
                          <path d={`M${cx - 10} 66 Q${cx} 56 ${cx + 10} 66`} stroke="#ffd9d9" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                        </g>
                      ) : (
                        <motion.g key={cx} animate={reduce ? {} : { scaleY: [1, 1, 0.1, 1, 1] }} transition={{ duration: 5, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1], delay: i * 0.05 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                          <ellipse cx={cx} cy="64" rx="13" ry="14" fill={GLOW} opacity=".5" filter={`url(#${u}-glow)`} />
                          <ellipse cx={cx} cy="64" rx="8.5" ry="9.5" fill={`url(#${u}-eye)`} />
                          <ellipse cx={cx} cy="64" rx="3" ry="3.4" fill="#2b0000" opacity=".55" />
                          <circle cx={cx - 3} cy="60" r="2.4" fill="#fff" opacity=".9" />
                        </motion.g>
                      )
                    ))
                  )}
                </motion.g>
                <path d={happy || loving || winking ? "M74 76 Q90 92 106 76" : is("think") || sleeping ? "M82 80 H98" : "M80 78 Q90 84 100 78"} stroke={GLOW} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".9" />
              </motion.g>

              {/* thinking: a thought bubble with working dots */}
              {is("think") && (
                <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} style={{ transformOrigin: "128px 10px" }}>
                  <circle cx="118" cy="26" r="2.5" fill="#fff" opacity=".85" />
                  <circle cx="124" cy="16" r="3.5" fill="#fff" opacity=".9" />
                  <rect x="118" y="-22" width="52" height="30" rx="15" fill="#fff" />
                  {[134, 144, 154].map((cx, i) => (
                    <motion.circle key={cx} cx={cx} cy="-7" r="3.2" fill={RED} animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </motion.g>
              )}

              {/* idea: a light bulb switches on above the head */}
              {is("idea") && (
                <motion.g initial={{ opacity: 0, scale: 0.2, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 12 }} style={{ transformOrigin: "90px -10px" }}>
                  <motion.circle cx="90" cy="-18" r="22" fill="#fff" filter={`url(#${u}-glow)`} animate={{ opacity: [0.25, 0.6, 0.25] }} transition={{ duration: 0.9, repeat: Infinity }} />
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                    const a = (-90 + (i - 3) * 32) * Math.PI / 180;
                    return <motion.line key={i} x1={90 + Math.cos(a) * 20} y1={-18 + Math.sin(a) * 20} x2={90 + Math.cos(a) * 28} y2={-18 + Math.sin(a) * 28} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.08 }} />;
                  })}
                  <circle cx="90" cy="-18" r="12" fill="#fff" />
                  <path d="M85 -16 L90 -22 L95 -16 M90 -22 V-8" stroke={RED} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="84" y="-6" width="12" height="6" rx="2" fill="#8a929c" />
                </motion.g>
              )}

              {/* typing: a holographic screen in front of the chest */}
              {is("type") && (
                <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <rect x="44" y="112" width="92" height="50" rx="9" fill="#1a0707" fillOpacity=".78" stroke={GLOW} strokeWidth="1.5" />
                  {[0, 1, 2].map((i) => (
                    <motion.rect key={i} x="54" y={122 + i * 11} height="5" rx="2.5" fill={i === 1 ? "#fff" : GLOW}
                      initial={{ width: 8 }} animate={{ width: [8, 58 - i * 10, 8] }} transition={{ duration: 1.1 + i * 0.25, repeat: Infinity, ease: "easeInOut" }} />
                  ))}
                  <motion.rect x="116" y="148" width="6" height="7" fill="#fff" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                </motion.g>
              )}

              {/* scanning: a beam sweeps out of the visor */}
              {is("scan") && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: [-24, 24, -24, 24, -24] }} transition={{ duration: 2.8, ease: "easeInOut" }} style={{ transformOrigin: "112px 64px" }}>
                  <polygon points="112,64 230,28 230,100" fill={`url(#${u}-beam)`} />
                  <line x1="112" y1="64" x2="230" y2="64" stroke="#fff" strokeOpacity=".5" strokeWidth="1" strokeDasharray="3 5" />
                </motion.g>
              )}

              {/* chat: customer-support style bubbles pop out one after another */}
              {is("chat") && (
                <g>
                  <motion.g initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1, 1, 0.9] }} transition={{ duration: 2.6, times: [0, 0.15, 0.85, 1], repeat: Infinity }} style={{ transformOrigin: "30px -16px" }}>
                    <rect x="2" y="-34" width="54" height="26" rx="13" fill="#fff" />
                    <path d="M16 -9 L12 -1 L26 -9 Z" fill="#fff" />
                    {[18, 29, 40].map((cx, i) => <motion.circle key={cx} cx={cx} cy="-21" r="3" fill="#9ca3af" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />)}
                  </motion.g>
                  <motion.g initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.3, 0.3, 1, 1, 0.9] }} transition={{ duration: 2.6, times: [0, 0.3, 0.45, 0.85, 1], repeat: Infinity }} style={{ transformOrigin: "140px -22px" }}>
                    <rect x="112" y="-42" width="60" height="28" rx="14" fill={RED} />
                    <path d="M158 -15 L164 -7 L148 -15 Z" fill={RED} />
                    <path d="M128 -28 l6 6 l12 -12" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.g>
                </g>
              )}

              {/* on a call: sound waves leave the headset */}
              {is("call") && [0, 1, 2].map((i) => (
                <motion.path key={i} d={`M${8 - i * 7} ${54 - i * 6} Q${-2 - i * 9} 68 ${8 - i * 7} ${82 + i * 6}`} stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round"
                  initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }} />
              ))}

              {/* charging: a battery fills while lightning crackles around the core */}
              {is("charge") && (
                <g>
                  <g>
                    <rect x="62" y="-26" width="50" height="22" rx="5" fill="none" stroke="#fff" strokeWidth="2.5" />
                    <rect x="112" y="-20" width="5" height="10" rx="1.5" fill="#fff" />
                    <motion.rect x="66" y="-22" height="14" rx="2" fill={GLOW} initial={{ width: 4 }} animate={{ width: [4, 42] }} transition={{ duration: 2.6, ease: "easeOut" }} />
                  </g>
                  {[[48, 130, 60, 142, 50, 146, 64, 160], [132, 130, 120, 142, 130, 146, 116, 160], [90, 120, 84, 132, 94, 134, 88, 146]].map((pts, i) => (
                    <motion.polyline key={i} points={`${pts[0]},${pts[1]} ${pts[2]},${pts[3]} ${pts[4]},${pts[5]} ${pts[6]},${pts[7]}`} fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      animate={{ opacity: [0, 1, 0, 1, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.17 }} />
                  ))}
                </g>
              )}

              {/* high five: ripples around the open hand */}
              {is("highfive") && [0, 1].map((i) => (
                <motion.circle key={i} cx="194" cy="113" r="12" fill="none" stroke="#fff" strokeWidth="2.5" initial={{ opacity: 0 }}
                  animate={{ opacity: [0.9, 0], scale: [0.6, 2.2] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.55, ease: "easeOut" }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              ))}

              {/* sleeping: Zzz */}
              {sleeping && [[126, 22, 0, 14], [140, 8, 0.7, 18], [156, -8, 1.4, 22]].map(([x, y, d, size]) => (
                <motion.text key={x} x={x} y={y} fontSize={size} fontWeight="900" fill="#fff" fontFamily="var(--font-poppins), sans-serif"
                  initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0], y: [0, -14] }} transition={{ duration: 2.1, repeat: Infinity, delay: d, ease: "easeOut" }}>z</motion.text>
              ))}

              {/* dancing: music notes float up */}
              {is("dance") && [[18, 84, 0], [150, 70, 0.5], [30, 40, 1]].map(([x, y, d]) => (
                <motion.g key={x} initial={{ opacity: 0 }} animate={{ y: [0, -40], x: [0, 8, -4], opacity: [0, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: d, ease: "easeOut" }}>
                  <ellipse cx={x} cy={y} rx="4.5" ry="3.4" fill="#fff" transform={`rotate(-20 ${x} ${y})`} />
                  <path d={`M${x + 3.8} ${y - 1} V${y - 15} Q${x + 10} ${y - 12} ${x + 9} ${y - 7}`} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
                </motion.g>
              ))}

              {/* in love: hearts drift upward */}
              {loving && [[12, 70, 0], [158, 56, 0.45], [34, 20, 0.9], [140, 14, 1.35]].map(([x, y, d]) => (
                <motion.path key={x} transform={`translate(${x} ${y})`} d={HEART} fill={d === 0 || d === 0.9 ? GLOW : "#fff"}
                  initial={{ opacity: 0 }} animate={{ y: [0, -34], opacity: [0, 1, 0], scale: [0.6, 1.1, 0.8] }} transition={{ duration: 1.9, repeat: Infinity, delay: d, ease: "easeOut" }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              ))}
            </motion.g>

            {/* cheering: sparkles burst around the robot */}
            {happy && SPARKS.map(([x, y, d]) => (
              <motion.path key={`${x}-${y}`} d={`M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2} Z`}
                fill={d % 0.3 === 0 ? "#fff" : GLOW} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: [0, 90] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: d }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            ))}
          </svg>
        </motion.div>
      </div>

      {showMessage && <HighLevelMessage />}
    </motion.div>;
};
var stdin_default = PeekingRobot;
export {
  stdin_default as default
};
