import { motion, useReducedMotion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { COLORS } from "@/constant/styles";
import { Bento, PortraitSplit, ChatThread, CardStack } from "./LogisticsTestimonialLayouts";
import LogisticsTestimonials, { TESTIMONIALS, Photo } from "./LogisticsTestimonials";

const RED = COLORS.primary;
const CHARCOAL = COLORS.dark;
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };

const Stars = ({ color = RED }) => (
  <div className="flex gap-1" aria-label="5 out of 5 stars">
    {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="w-4 h-4 fill-current" style={{ color }} strokeWidth={0} />)}
  </div>
);

const Header = ({ title = "What Our Clients Say", text = "Hear from the teams who trust TelexPH to run their logistics support day to day.", dark }) => (
  <motion.div
    className="relative max-w-3xl mx-auto text-center mb-12 md:mb-14"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7 }}
  >
    <p aria-hidden className="mb-3 text-xl font-bold italic tracking-[0.2em] leading-none" style={{ color: dark ? "#fff" : RED, ...display }}>///</p>
    <h2 className="text-4xl md:text-6xl uppercase font-bold leading-[1.02]" style={{ ...display, color: dark ? "#fff" : CHARCOAL }}>{title}</h2>
    <div className="mx-auto mt-5 h-1 w-16" style={{ backgroundColor: dark ? "#fff" : RED }} />
    <p className={`mt-5 text-base md:text-lg leading-relaxed ${dark ? "text-white/70" : "text-gray-600"}`}>{text}</p>
  </motion.div>
);

/* Variant 2: three-card grid, lifted middle card, big quote mark. */
const CardGrid = () => {
  const reduce = useReducedMotion();
  return (
    <section id="testimonials" className="relative py-16 md:py-24 px-4 bg-gray-50 overflow-hidden">
      <Header />
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.slice(0, 3).map((t, i) => (
          <motion.figure
            key={i}
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            whileHover={{ y: -8 }}
            className={`relative rounded-3xl bg-white border p-8 flex flex-col ${i === 1 ? "md:-translate-y-4" : ""}`}
            style={{ borderColor: i === 1 ? RED : "#e5e7eb", boxShadow: i === 1 ? "0 20px 40px rgba(161,0,0,.14)" : "0 1px 2px rgba(0,0,0,.04)" }}
          >
            <span className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: RED }}>
              <Quote className="w-6 h-6 text-white" />
            </span>
            <Stars />
            <blockquote className="mt-4 flex-1 leading-relaxed text-gray-700">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
              <Photo src={t.photo} name={t.name} className="w-12 h-12" ring="#e5e7eb" />
              <span>
                <span className="block font-semibold" style={{ color: CHARCOAL }}>{t.name}</span>
                <span className="block text-sm text-gray-500">{t.role}, {t.company}</span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
};

/* Variant 3: dark band with two endlessly scrolling rows of quote cards. */
const Marquee = () => {
  const reduce = useReducedMotion();
  const row = (dir, offset) => {
    const items = [...TESTIMONIALS.slice(offset), ...TESTIMONIALS.slice(0, offset)];
    return (
      <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <motion.div
          className="flex gap-5 shrink-0 pr-5"
          animate={reduce ? {} : { x: dir === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ width: "max-content" }}
        >
          {[...items, ...items, ...items, ...items].map((t, i) => (
            <figure key={i} className="w-[320px] md:w-[380px] shrink-0 rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-sm">
              <Stars color="#fff" />
              <blockquote className="mt-3 text-sm md:text-base leading-relaxed text-white/85">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <Photo src={t.photo} name={t.name} className="w-11 h-11" ring={RED} />
                <span className="text-sm">
                  <span className="block font-semibold text-white">{t.name}</span>
                  <span className="block text-white/55">{t.role}, {t.company}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    );
  };
  return (
    <section id="testimonials" className="relative py-16 md:py-24 overflow-hidden" style={{ background: `linear-gradient(150deg, #141414 0%, ${CHARCOAL} 55%, #3a0a0a 100%)` }}>
      <div aria-hidden className="absolute -top-24 -left-20 w-80 h-80 rounded-full blur-3xl opacity-30" style={{ background: RED }} />
      <div className="px-4"><Header dark /></div>
      <div className="relative space-y-5">{row("left", 0)}{row("right", 2)}</div>
    </section>
  );
};

/* Variant 4: one big pull quote with a stats strip underneath. */
const PullQuote = () => {
  const reduce = useReducedMotion();
  const t = TESTIMONIALS[0];
  // DRAFT numbers: replace with approved figures.
  const stats = [{ v: "98%", l: "Client satisfaction" }, { v: "24/7", l: "Coverage options" }, { v: "50+", l: "Active accounts" }, { v: "5 days", l: "Typical onboarding" }];
  return (
    <section id="testimonials" className="relative py-16 md:py-24 px-4 bg-white overflow-hidden">
      <Header title="Trusted By Logistics Teams" />
      <motion.div
        className="relative max-w-4xl mx-auto text-center"
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
      >
        <span aria-hidden className="absolute -top-10 left-1/2 -translate-x-1/2 text-[12rem] leading-none font-bold select-none" style={{ ...display, color: RED, opacity: 0.1 }}>&ldquo;</span>
        <p className="relative text-2xl md:text-4xl font-semibold leading-snug" style={{ color: CHARCOAL }}>{t.quote}</p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Photo src={t.photo} name={t.name} className="w-20 h-20" ring={RED} />
          <span><span className="block font-semibold" style={{ color: CHARCOAL }}>{t.name}</span><span className="block text-sm text-gray-500">{t.role}, {t.company}</span></span>
        </div>
      </motion.div>
      <div className="max-w-5xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.l}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl border border-gray-200 p-6 text-center bg-gray-50"
          >
            <p className="text-4xl md:text-5xl font-bold" style={{ ...display, color: RED }}>{s.v}</p>
            <p className="mt-1 text-sm text-gray-600">{s.l}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

/* TEMPORARY preview switcher: open the page with ?t=1 to 8. Delete once one is picked. */
const LogisticsTestimonialVariants = () => {
  const v = typeof window === "undefined" ? "1" : new URLSearchParams(window.location.search).get("t");
  if (v === "2") return <CardGrid />;
  if (v === "3") return <Marquee />;
  if (v === "4") return <PullQuote />;
  if (v === "5") return <Bento />;
  if (v === "6") return <PortraitSplit />;
  if (v === "7") return <ChatThread />;
  if (v === "8") return <CardStack />;
  return <LogisticsTestimonials />;
};

export default LogisticsTestimonialVariants;
