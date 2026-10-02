import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { CheckCircle2, Headset, Mail, TriangleAlert, Users } from "lucide-react";
import { COLORS } from "@/constant/styles";
import LogisticsEyebrow from "./LogisticsEyebrow";
import { DISCOVERY_CALL_URL } from "@/constant/links";

// DRAFT section title (matches the "Get Started" tab): edit freely.
const INTRO_TITLE = "Get Started";

const RED = COLORS.primary; // #a10000
const CHARCOAL = COLORS.dark; // #282828
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };

/* A support map: an enquiry comes in, gets triaged, and either resolves or is escalated to
   the right internal team. Icons only (no labels); packets keep flowing along the routes. */
const W = 400, H = 320;
const NODES = {
  inbox: { x: 56, y: 160, Icon: Mail },
  triage: { x: 168, y: 160, Icon: Headset },
  done: { x: 336, y: 78, Icon: CheckCircle2, solid: true },
  flag: { x: 248, y: 256, Icon: TriangleAlert },
  team: { x: 350, y: 256, Icon: Users },
};
const ROUTES = [
  { d: "M56 160 L168 160", delay: 0.4 },
  { d: "M168 160 C 232 160, 250 78, 336 78", delay: 0.9 },
  { d: "M168 160 C 190 160, 196 256, 248 256", delay: 1.3 },
  { d: "M248 256 L350 256", delay: 1.7 },
];

const Node = ({ id, index }) => {
  const reduce = useReducedMotion();
  const { x, y, Icon, solid } = NODES[id];
  return (
    <motion.div
      className="absolute flex items-center justify-center rounded-2xl border"
      style={{
        left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, width: "15%", aspectRatio: "1 / 1", translate: "-50% -50%",
        background: solid ? "#fff" : "rgba(255,255,255,.12)", borderColor: solid ? "#fff" : "rgba(255,255,255,.4)",
        backdropFilter: "blur(4px)", color: solid ? RED : "#fff",
      }}
      initial={reduce ? false : { opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 + index * 0.25, type: "spring", stiffness: 220, damping: 14 }}
    >
      {!reduce && (
        <motion.span
          aria-hidden className="absolute inset-0 rounded-2xl border-2 border-white"
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: 1.2 + index * 0.5, repeatDelay: 1.2 }}
        />
      )}
      <Icon className="w-1/2 h-1/2" strokeWidth={1.8} />
    </motion.div>
  );
};

const SupportMap = () => {
  const reduce = useReducedMotion();
  return (
    <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" fill="none">
        <g stroke="#fff" opacity=".12">
          {[...Array(7)].map((_, i) => <line key={`h${i}`} x1="0" x2={W} y1={i * 53} y2={i * 53} />)}
          {[...Array(9)].map((_, i) => <line key={`v${i}`} y1="0" y2={H} x1={i * 50} x2={i * 50} />)}
        </g>
        {ROUTES.map((r, i) => (
          <g key={i}>
            <motion.path
              d={r.d} stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="2 8"
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: r.delay, ease: "easeInOut" }}
            />
            {!reduce && [0, 1].map((k) => (
              <circle key={k} r="4.2" fill={CHARCOAL} stroke="#fff" strokeWidth="1.4">
                <animateMotion dur="2.6s" repeatCount="indefinite" path={r.d} begin={`${2.2 + i * 0.35 + k * 1.3}s`} />
              </circle>
            ))}
          </g>
        ))}
      </svg>
      {Object.keys(NODES).map((id, i) => <Node key={id} id={id} index={i} />)}
    </div>
  );
};

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const LogisticsCta = () => {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sx = useSpring(rawX, { stiffness: 80, damping: 18 });
  const sy = useSpring(rawY, { stiffness: 80, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-3, 3]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [2.5, -2.5]);

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <section id="start" className="bg-white py-12 md:py-20 px-4" style={{ perspective: 1400 }}>
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY }}
        className="relative max-w-6xl mx-auto overflow-hidden rounded-3xl p-[2px] shadow-2xl"
      >
        {/* a bright arc of light chasing around the card's edge */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-1/2 w-[220%] aspect-square -translate-x-1/2 -translate-y-1/2"
            style={{ background: `conic-gradient(from 0deg, transparent 0%, transparent 72%, rgba(255,255,255,.9) 86%, transparent 100%)` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />
        )}

        <div
          className="relative overflow-hidden rounded-[22px] text-white px-6 py-12 md:px-14 md:py-16 grid md:grid-cols-12 gap-10 md:gap-14 items-center"
          style={{ background: `linear-gradient(135deg, ${RED} 0%, #7a0000 100%)` }}
        >
          {/* drifting glows + floating specks */}
          <motion.div aria-hidden className="absolute -top-32 -right-24 w-[26rem] h-[26rem] rounded-full blur-3xl bg-white opacity-15"
            animate={reduce ? {} : { x: [0, -40, 0], y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div aria-hidden className="absolute -bottom-40 -left-24 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-40"
            style={{ background: "#3a0000" }}
            animate={reduce ? {} : { x: [0, 40, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
          {!reduce && [12, 30, 48, 66, 84].map((left, i) => (
            <motion.span key={i} aria-hidden className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-white/60"
              style={{ left: `${left}%` }}
              animate={{ y: [0, -420], opacity: [0, 0.8, 0] }}
              transition={{ duration: 7 + i, repeat: Infinity, delay: i * 1.3, ease: "linear" }} />
          ))}

          <div className="relative md:col-span-7">
            <motion.div {...rise()}><LogisticsEyebrow light slash="#fff">{INTRO_TITLE}</LogisticsEyebrow></motion.div>
            <motion.h2 className="text-4xl md:text-6xl uppercase font-bold leading-[1.02]" style={display} {...rise(0.05)}>
              Let’s Map the Support Your Business Needs
            </motion.h2>
            <motion.div className="mt-5 h-1 w-16 bg-white origin-left" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }} />
            <motion.p className="mt-6 text-base md:text-lg leading-relaxed text-white/90 max-w-xl" {...rise(0.1)}>
              Tell us where enquiries and follow-ups are taking time from your team. We’ll discuss the scope and assess a suitable support model.
            </motion.p>
            <motion.div className="mt-9" {...rise(0.2)}>
              <span className="relative inline-block">
                {/* expanding outline ring behind the button */}
                {!reduce && (
                  <motion.span aria-hidden className="absolute -inset-px rounded border-2 border-white"
                    animate={{ scale: [1, 1.14], opacity: [0.7, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
                )}
                <motion.a
                  href={DISCOVERY_CALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, boxShadow: "0 14px 34px rgba(0,0,0,.35)" }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded px-8 py-4 text-sm md:text-base font-semibold uppercase tracking-wide bg-white"
                  style={{ color: RED }}
                >
                  {/* shine sweeping across the button */}
                  {!reduce && (
                    <motion.span aria-hidden className="absolute inset-y-0 w-10 -skew-x-12 bg-gradient-to-r from-transparent via-red-200/70 to-transparent"
                      initial={{ left: "-20%" }} animate={{ left: "120%" }}
                      transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 3.2, ease: "easeInOut" }} />
                  )}
                  <span className="relative">Book a 15-Minute Discovery Call</span>
                  <span aria-hidden className="relative transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </motion.a>
              </span>
            </motion.div>
          </div>

          <motion.div className="relative md:col-span-5" {...rise(0.15)}>
            <SupportMap />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default LogisticsCta;
