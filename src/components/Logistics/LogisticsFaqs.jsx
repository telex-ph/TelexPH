import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CircleHelp, MapPin, Plug, Plus, Tag, Timer } from "lucide-react";
import { COLORS } from "@/constant/styles";

const RED = COLORS.primary; // #a10000
const CHARCOAL = COLORS.dark; // #282828
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };

// DRAFT intro copy (not from the approved brief): edit freely.
const INTRO_TITLE = "Frequently Asked Questions";
const INTRO_TEXT = "Quick answers on where the team is based, the systems it uses, how pricing works, and how soon you can start.";

export const FAQS = [
  { q: "Where is the delivery team based?", a: "Our delivery team is based in the Philippines.", Icon: MapPin },
  { q: "Can the team use our existing systems?", a: "We assess your systems, training needs, and access requirements before confirming the setup.", Icon: Plug },
  { q: "How is pricing determined?", a: "Pricing depends on the work involved, staffing, service hours, management requirements, and tools needed.", Icon: Tag },
  { q: "How quickly can we start?", a: "We confirm the timeline after reviewing recruitment, training, system access, and onboarding requirements.", Icon: Timer },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};

/* Drifting question marks behind the section. */
const FLOATERS = [
  { left: "6%", top: "18%", size: 64, d: 9 },
  { left: "90%", top: "12%", size: 90, d: 12 },
  { left: "84%", top: "70%", size: 56, d: 10 },
  { left: "3%", top: "76%", size: 80, d: 13 },
  { left: "48%", top: "92%", size: 44, d: 8 },
];

/* Left panel: a big icon for whichever question is open, so the panel answers along with the list. */
const Spotlight = ({ active }) => {
  const reduce = useReducedMotion();
  const current = FAQS[active];
  const Icon = current ? current.Icon : CircleHelp;

  return (
    <div
      className="relative mx-auto w-full max-w-[300px] aspect-square rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl"
      style={{ background: `linear-gradient(150deg, #141414 0%, ${CHARCOAL} 55%, #3a0a0a 100%)` }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 36px),repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 36px)" }}
      />
      <div aria-hidden className="absolute -bottom-20 -right-16 w-56 h-56 rounded-full blur-3xl opacity-40" style={{ background: RED }} />

      {/* pulsing rings */}
      {!reduce && [0, 1].map((i) => (
        <motion.span key={i} aria-hidden className="absolute w-32 h-32 rounded-3xl border-2 border-white/40"
          animate={{ scale: [1, 1.9], opacity: [0.5, 0] }} transition={{ duration: 2.8, repeat: Infinity, delay: i * 1.4, ease: "easeOut" }} />
      ))}

      {/* the active question's icon */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={reduce ? false : { scale: 0.5, rotate: -14, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { scale: 0.6, rotate: 12, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="relative w-32 h-32 rounded-3xl flex items-center justify-center shadow-xl"
          style={{ backgroundColor: RED }}
        >
          <Icon className="w-16 h-16 text-white" strokeWidth={1.6} />
        </motion.div>
      </AnimatePresence>

      {/* counter + dots */}
      <div className="absolute bottom-5 inset-x-6 flex items-end justify-between">
        <span className="text-4xl font-bold leading-none text-white tabular-nums" style={display}>
          {String(Math.max(active, 0) + 1).padStart(2, "0")}
          <span className="text-lg text-white/50"> / {String(FAQS.length).padStart(2, "0")}</span>
        </span>
        <span className="flex gap-1.5" aria-hidden>
          {FAQS.map((_, i) => (
            <span key={i} className="h-1.5 rounded-full transition-all duration-300" style={{ width: i === active ? 22 : 8, backgroundColor: i === active ? "#fff" : "rgba(255,255,255,.3)" }} />
          ))}
        </span>
      </div>
    </div>
  );
};

const Item = ({ item, open, onToggle, index }) => {
  const reduce = useReducedMotion();
  const { Icon } = item;
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      whileHover={{ x: open ? 0 : 4 }}
      className="relative rounded-2xl bg-white overflow-hidden border transition-shadow"
      style={{ borderColor: open ? RED : "#e5e7eb", boxShadow: open ? "0 12px 32px rgba(161,0,0,.14)" : "0 1px 2px rgba(0,0,0,.04)" }}
    >
      {/* accent bar on the left grows when the item opens */}
      <span aria-hidden className="absolute left-0 top-0 bottom-0 w-1.5 origin-top transition-transform duration-300" style={{ backgroundColor: RED, transform: open ? "scaleY(1)" : "scaleY(0)" }} />
      <button onClick={onToggle} aria-expanded={open} className="w-full flex items-center gap-4 text-left px-5 md:px-6 py-5">
        <span
          className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300"
          style={{ backgroundColor: open ? RED : "#f3f4f6", color: open ? "#fff" : CHARCOAL }}
        >
          <Icon className="w-5 h-5" strokeWidth={1.9} />
        </span>
        <span className="flex-1 font-semibold text-base md:text-lg" style={{ color: CHARCOAL }}>{item.q}</span>
        <span
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
          style={{ backgroundColor: open ? RED : "#f3f4f6", color: open ? "#fff" : CHARCOAL, transform: open ? "rotate(45deg)" : "none" }}
        >
          <Plus className="w-5 h-5" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pl-[4.75rem] md:pl-[5.25rem] pr-6 pb-6 leading-relaxed text-gray-600">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const LogisticsFaqs = () => {
  const reduce = useReducedMotion();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faqs" className="relative py-16 md:py-24 px-4 bg-gray-50 overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* faint grid + drifting question marks */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(90deg,#282828 0,#282828 1px,transparent 1px,transparent 56px),repeating-linear-gradient(0deg,#282828 0,#282828 1px,transparent 1px,transparent 56px)" }}
      />
      {FLOATERS.map((f, i) => (
        <motion.span
          key={i} aria-hidden
          className="absolute font-bold select-none pointer-events-none"
          style={{ left: f.left, top: f.top, fontSize: f.size, color: RED, opacity: 0.07, ...display }}
          animate={reduce ? {} : { y: [0, -18, 0], rotate: [-8, 8, -8] }}
          transition={{ duration: f.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
        >
          ?
        </motion.span>
      ))}

      <motion.div
        className="relative max-w-3xl mx-auto text-center mb-12 md:mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
      >
        <p aria-hidden className="mb-3 text-xl font-bold italic tracking-[0.2em] leading-none" style={{ color: RED, ...display }}>///</p>
        <h2 className="text-4xl md:text-6xl uppercase font-bold leading-[1.02]" style={{ ...display, color: CHARCOAL }}>{INTRO_TITLE}</h2>
        <div className="mx-auto mt-5 h-1 w-16" style={{ backgroundColor: RED }} />
        <p className="mt-5 text-base md:text-lg leading-relaxed text-gray-600">{INTRO_TEXT}</p>
      </motion.div>

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-12 items-center">
        <motion.div
          className="md:col-span-4 hidden md:block"
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <Spotlight active={openIndex} />
        </motion.div>
        <div className="md:col-span-8 space-y-4">
          {FAQS.map((item, i) => (
            <Item key={item.q} item={item} index={i} open={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogisticsFaqs;
