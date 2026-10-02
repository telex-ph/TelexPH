import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Headset, ClipboardList, Truck } from "lucide-react";
import { COLORS } from "@/constant/styles";
import LogisticsEyebrow from "./LogisticsEyebrow";

// DRAFT intro copy (not from the approved brief): edit freely.
const INTRO_TITLE = "What We Help With";
const INTRO_TEXT = "Three ways the team can take work off your plate, from front-line customer support to back-office tasks and logistics enquiries.";

const RED = COLORS.primary; // #a10000
const CHARCOAL = COLORS.dark; // #282828
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };

const ITEMS = [
  {
    title: "Customer Support",
    text: "Help customers with enquiries, follow-ups, and issue resolution across your agreed support channels.",
    Icon: Headset,
  },
  {
    title: "Back-Office Support",
    text: "Keep routine administrative work, records, and operational follow-ups organised so your local team can focus on its priorities.",
    Icon: ClipboardList,
  },
  {
    title: "Logistics Customer Support",
    text: "Support shipment enquiries, delivery follow-ups, and exception handling using your systems and agreed escalation rules.",
    Icon: Truck,
    featured: true,
  },
];

/* Card: tilts toward the pointer, a soft spotlight follows it, and the icon floats.
   The featured (logistics) card has a moving light along its edge and links to the landing page. */
const Card = ({ item, index }) => {
  const reduce = useReducedMotion();
  const { title, text, Icon, featured } = item;
  const dark = !!featured;

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 120, damping: 18 });
  const smy = useSpring(my, { stiffness: 120, damping: 18 });
  const rotateY = useTransform(smx, [0, 1], [-7, 7]);
  const rotateX = useTransform(smy, [0, 1], [6, -6]);
  const spot = useMotionTemplate`radial-gradient(260px circle at ${useTransform(smx, [0, 1], ["0%", "100%"])} ${useTransform(smy, [0, 1], ["0%", "100%"])}, ${dark ? "rgba(161,0,0,.35)" : "rgba(161,0,0,.10)"}, transparent 70%)`;

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={{ y: -8 }}
        style={{
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          backgroundColor: dark ? CHARCOAL : "#fff",
          color: dark ? "#fff" : CHARCOAL,
          border: dark ? "none" : "1px solid #e5e7eb",
        }}
        className="group relative h-full rounded-2xl p-8 pt-10 overflow-hidden shadow-lg"
      >
        {featured && <a href="/logistics/landing" aria-label={title} className="absolute inset-0 z-20" />}

        {/* pointer spotlight */}
        <motion.span aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: spot }} />

        {/* featured: a bright arc of light travelling around the edge */}
        {featured && !reduce && (
          <>
            <motion.span
              aria-hidden
              className="absolute left-1/2 top-1/2 w-[200%] aspect-square -translate-x-1/2 -translate-y-1/2 opacity-70"
              style={{ background: "conic-gradient(from 0deg, transparent 0%, transparent 70%, rgba(196,60,60,.95) 86%, transparent 100%)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            <span aria-hidden className="absolute inset-[2px] rounded-[14px]" style={{ backgroundColor: CHARCOAL }} />
          </>
        )}

        {/* top bar that fills in on hover */}
        <span aria-hidden className="absolute top-0 left-0 h-1.5 w-full origin-left scale-x-[0.25] transition-transform duration-500 group-hover:scale-x-100" style={{ backgroundColor: RED }} />
        {/* big step number */}
        <span aria-hidden className="absolute -top-2 right-5 text-[6.5rem] leading-none font-bold select-none" style={{ ...display, color: dark ? "rgba(255,255,255,.07)" : "rgba(40,40,40,.06)" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        {/* watermark icon */}
        <Icon aria-hidden className="absolute -right-8 -bottom-8 w-44 h-44 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" strokeWidth={1} style={{ color: dark ? "#fff" : CHARCOAL, opacity: 0.06 }} />

        <motion.div
          className="relative w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg"
          style={{ backgroundColor: RED }}
          animate={reduce ? {} : { y: [0, -5, 0] }}
          transition={{ duration: 3.4 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ rotate: -8, scale: 1.1 }}
        >
          <Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
        </motion.div>
        <h3 className="relative text-2xl uppercase font-bold mb-3 leading-tight" style={display}>{title}</h3>
        <p className="relative text-sm md:text-[15px] leading-relaxed" style={{ color: dark ? "#d1d5db" : "#4b5563" }}>{text}</p>

        {featured && (
          <span aria-hidden className="relative mt-6 inline-flex w-10 h-10 rounded-full items-center justify-center bg-white text-[#a10000] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
            <ArrowUpRight className="w-5 h-5" />
          </span>
        )}
      </motion.div>
    </motion.li>
  );
};

/* Dashed "conveyor" line with a parcel sliding along it, behind the cards (desktop). */
const Conveyor = () => {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="hidden lg:block absolute left-0 right-0 top-[3.75rem] h-px">
      <div className="absolute inset-x-0 border-t-2 border-dashed" style={{ borderColor: "rgba(161,0,0,.35)" }} />
      {!reduce && (
        <motion.span
          className="absolute -top-1.5 w-3 h-3 rounded-sm"
          style={{ backgroundColor: RED }}
          animate={{ left: ["0%", "100%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
};

const LogisticsHelp = () => (
  <section id="help" className="relative overflow-hidden py-16 md:py-24 px-4 bg-white">
    <div aria-hidden className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(90deg,#282828 0,#282828 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,#282828 0,#282828 1px,transparent 1px,transparent 56px)" }} />
    <motion.div aria-hidden className="absolute -top-32 -left-24 w-[26rem] h-[26rem] rounded-full blur-3xl pointer-events-none" style={{ background: RED, opacity: 0.08 }}
      animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
    <div className="relative max-w-6xl mx-auto">
      <div className="text-center"><LogisticsEyebrow center>{INTRO_TITLE}</LogisticsEyebrow></div>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-6xl uppercase font-bold text-center max-w-3xl mx-auto mb-5 leading-[1.02]"
        style={{ ...display, color: CHARCOAL }}
      >
        Keep Customers Supported. Keep Work Moving.
      </motion.h2>
      <motion.div className="mx-auto mb-5 h-1 w-16 origin-center" style={{ backgroundColor: RED }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }} />
      <p className="mx-auto mb-14 max-w-2xl text-center text-base md:text-lg leading-relaxed text-gray-600">{INTRO_TEXT}</p>

      <div className="relative">
        <Conveyor />
        <ul className="relative grid md:grid-cols-3 gap-6">
          {ITEMS.map((item, i) => <Card key={item.title} item={item} index={i} />)}
        </ul>
      </div>
    </div>
  </section>
);

export default LogisticsHelp;
