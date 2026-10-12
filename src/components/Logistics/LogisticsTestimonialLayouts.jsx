import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, MessageCircle, Quote, Star, TrendingUp } from "lucide-react";
import { COLORS } from "@/constant/styles";
import { TESTIMONIALS, Photo } from "./LogisticsTestimonials";

const RED = COLORS.primary;
const CHARCOAL = COLORS.dark;
const display = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };
const DARK_BG = `linear-gradient(150deg, #141414 0%, ${CHARCOAL} 55%, #3a0a0a 100%)`;

const Stars = ({ color = RED, size = "w-4 h-4" }) => (
  <div className="flex gap-1" aria-label="5 out of 5 stars">
    {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${size} fill-current`} style={{ color }} strokeWidth={0} />)}
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

const fadeUp = (reduce, i = 0) => ({
  initial: reduce ? false : { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, delay: i * 0.1 },
});

/* Layout 5: bento grid. Mixed tile sizes: hero quote, rating, stat, photo, small quotes. */
export const Bento = () => {
  const reduce = useReducedMotion();
  const [a, b, c, d] = TESTIMONIALS;
  // DRAFT numbers: replace with approved figures.
  return (
    <section id="testimonials" className="relative py-16 md:py-24 px-4 bg-gray-50 overflow-hidden">
      <Header />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-6 md:auto-rows-[minmax(150px,auto)] gap-4">
        <motion.div {...fadeUp(reduce, 0)} className="md:col-span-4 md:row-span-2 relative rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col justify-between shadow-xl" style={{ background: DARK_BG }}>
          <div aria-hidden className="absolute -bottom-20 -right-16 w-64 h-64 rounded-full blur-3xl opacity-40" style={{ background: RED }} />
          <Quote aria-hidden className="absolute top-6 right-8 w-20 h-20 text-white/10" strokeWidth={1.2} />
          <Stars color="#fff" size="w-5 h-5" />
          <p className="relative my-6 text-xl md:text-3xl font-semibold leading-snug text-white">&ldquo;{a.quote}&rdquo;</p>
          <div className="relative flex items-center gap-4">
            <Photo src={a.photo} name={a.name} className="w-14 h-14" ring={RED} />
            <span><span className="block font-semibold text-white">{a.name}</span><span className="block text-sm text-white/60">{a.role}, {a.company}</span></span>
          </div>
        </motion.div>

        <motion.div {...fadeUp(reduce, 1)} className="md:col-span-2 rounded-3xl p-6 flex flex-col justify-center text-center text-white" style={{ backgroundColor: RED }}>
          <p className="text-6xl font-bold leading-none" style={display}>4.9</p>
          <div className="mt-3 flex justify-center"><Stars color="#fff" /></div>
          <p className="mt-2 text-sm text-white/80">Average client rating</p>
        </motion.div>

        <motion.div {...fadeUp(reduce, 2)} className="md:col-span-2 rounded-3xl bg-white border border-gray-200 p-6 flex flex-col justify-center">
          <TrendingUp className="w-6 h-6" style={{ color: RED }} />
          <p className="mt-2 text-5xl font-bold leading-none" style={{ ...display, color: CHARCOAL }}>98%</p>
          <p className="mt-1 text-sm text-gray-600">Client retention</p>
        </motion.div>

        {[b, c].map((t, i) => (
          <motion.figure key={i} {...fadeUp(reduce, 3 + i)} whileHover={{ y: -6 }} className="md:col-span-3 rounded-3xl bg-white border border-gray-200 p-6 flex flex-col justify-between">
            <blockquote className="text-gray-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <Photo src={t.photo} name={t.name} className="w-11 h-11" ring="#e5e7eb" />
              <span><span className="block font-semibold" style={{ color: CHARCOAL }}>{t.name}</span><span className="block text-sm text-gray-500">{t.role}, {t.company}</span></span>
            </figcaption>
          </motion.figure>
        ))}

        <motion.figure {...fadeUp(reduce, 5)} className="md:col-span-6 rounded-3xl bg-white border border-gray-200 p-6 flex flex-col md:flex-row md:items-center gap-5">
          <Photo src={d.photo} name={d.name} className="w-16 h-16" ring={RED} />
          <blockquote className="flex-1 text-lg font-medium leading-snug" style={{ color: CHARCOAL }}>&ldquo;{d.quote}&rdquo;</blockquote>
          <figcaption className="text-sm text-gray-500 md:text-right"><span className="block font-semibold" style={{ color: CHARCOAL }}>{d.name}</span>{d.role}, {d.company}</figcaption>
        </motion.figure>
      </div>
    </section>
  );
};

/* Layout 6: photo-forward split. Big portrait on the left, quote on the right, thumbnail strip to switch. */
export const PortraitSplit = () => {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  const total = TESTIMONIALS.length;
  return (
    <section id="testimonials" className="relative py-16 md:py-24 px-4 bg-white overflow-hidden">
      <Header />
      <motion.div {...fadeUp(reduce)} className="max-w-6xl mx-auto grid md:grid-cols-12 gap-8 md:gap-12 items-center">
        <div className="md:col-span-5 relative">
          <div aria-hidden className="absolute -inset-3 rounded-[2rem] rotate-3" style={{ backgroundColor: RED, opacity: 0.12 }} />
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl" style={{ background: DARK_BG }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={i}
                src={t.photo}
                alt={t.name}
                initial={reduce ? false : { opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </AnimatePresence>
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="font-semibold text-lg">{t.name}</p>
              <p className="text-sm text-white/70">{t.role}, {t.company}</p>
            </div>
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold" style={{ color: CHARCOAL }}>
              <BadgeCheck className="w-4 h-4" style={{ color: RED }} /> Verified client
            </span>
          </div>
        </div>

        <div className="md:col-span-7">
          <Quote className="w-14 h-14" style={{ color: RED }} strokeWidth={1.4} />
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={reduce ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35 }}>
              <p className="mt-4 text-2xl md:text-4xl font-semibold leading-snug" style={{ color: CHARCOAL }}>{t.quote}</p>
              <div className="mt-6 flex items-center gap-4"><Stars /><span className="text-sm font-semibold" style={{ color: RED }}>{t.result}</span></div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex gap-3">
              {TESTIMONIALS.map((x, n) => (
                <button key={n} onClick={() => setI(n)} aria-label={`Show testimonial ${n + 1}`} className="rounded-full transition-all" style={{ opacity: n === i ? 1 : 0.5, transform: n === i ? "scale(1.1)" : "none" }}>
                  <Photo src={x.photo} name={x.name} className="w-14 h-14" ring={n === i ? RED : "#e5e7eb"} />
                </button>
              ))}
            </div>
            <span className="ml-auto flex gap-2">
              {[{ Icon: ChevronLeft, n: i - 1, l: "Previous" }, { Icon: ChevronRight, n: i + 1, l: "Next" }].map(({ Icon, n, l }) => (
                <button key={l} onClick={() => setI((n + total) % total)} aria-label={l} className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center transition-colors hover:text-white" style={{ color: CHARCOAL }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = RED; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; }}>
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* Layout 7: chat conversation. Quotes appear as message bubbles, like a support thread. */
export const ChatThread = () => {
  const reduce = useReducedMotion();
  return (
    <section id="testimonials" className="relative py-16 md:py-24 px-4 bg-gray-50 overflow-hidden">
      <Header title="Straight From Our Clients" text="Real feedback, in their own words." />
      <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-gray-200 shadow-xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 text-white" style={{ background: DARK_BG }}>
          <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: RED }}><MessageCircle className="w-5 h-5" /></span>
          <span><span className="block font-semibold leading-tight">Client Feedback</span><span className="block text-xs text-white/60">{TESTIMONIALS.length} messages</span></span>
        </div>
        <div className="p-5 md:p-8 space-y-6">
          {TESTIMONIALS.map((t, i) => {
            const right = i % 2 === 1;
            return (
              <motion.div
                key={i}
                initial={reduce ? false : { opacity: 0, x: right ? 40 : -40, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className={`flex items-end gap-3 ${right ? "flex-row-reverse" : ""}`}
              >
                <Photo src={t.photo} name={t.name} className="w-11 h-11" ring={right ? RED : "#e5e7eb"} />
                <div className={`max-w-[80%] ${right ? "items-end text-right" : ""}`}>
                  <p className="mb-1 text-xs text-gray-500"><span className="font-semibold" style={{ color: CHARCOAL }}>{t.name}</span> · {t.role}, {t.company}</p>
                  <div
                    className={`px-5 py-3 leading-relaxed text-left ${right ? "rounded-2xl rounded-br-sm text-white" : "rounded-2xl rounded-bl-sm text-gray-700 bg-gray-100"}`}
                    style={right ? { backgroundColor: RED } : undefined}
                  >
                    {t.quote}
                  </div>
                  <div className={`mt-1.5 flex ${right ? "justify-end" : ""}`}><Stars size="w-3.5 h-3.5" /></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* Layout 8: card stack. Click the deck (or Next) to send the top card to the back. */
export const CardStack = () => {
  const reduce = useReducedMotion();
  const [order, setOrder] = useState(TESTIMONIALS.map((_, i) => i));
  const next = () => setOrder(([first, ...rest]) => [...rest, first]);
  const prev = () => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
  return (
    <section id="testimonials" className="relative py-16 md:py-24 px-4 bg-white overflow-hidden">
      <Header title="Loved By Our Clients" />
      <div className="max-w-xl mx-auto">
        <div className="relative h-[400px] md:h-[360px]">
          {order.map((idx, pos) => {
            const t = TESTIMONIALS[idx];
            const top = pos === 0;
            return (
              <motion.figure
                key={idx}
                layout={!reduce}
                onClick={top ? next : undefined}
                animate={{ y: pos * 18, scale: 1 - pos * 0.05, opacity: pos > 2 ? 0 : 1, rotate: top ? 0 : (pos % 2 ? 1.5 : -1.5) }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className={`absolute inset-x-0 top-0 rounded-3xl p-8 md:p-10 border flex flex-col justify-between shadow-xl ${top ? "cursor-pointer" : "pointer-events-none"}`}
                style={{ zIndex: order.length - pos, ...(top ? { background: DARK_BG, borderColor: "transparent" } : { background: "#fff", borderColor: "#e5e7eb" }) }}
              >
                {top && <Quote aria-hidden className="absolute top-6 right-8 w-16 h-16 text-white/10" strokeWidth={1.2} />}
                <Stars color={top ? "#fff" : RED} size="w-5 h-5" />
                <blockquote className={`my-5 text-lg md:text-2xl font-semibold leading-snug ${top ? "text-white" : ""}`} style={top ? undefined : { color: CHARCOAL }}>&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="flex items-center gap-3">
                  <Photo src={t.photo} name={t.name} className="w-12 h-12" ring={RED} />
                  <span><span className={`block font-semibold ${top ? "text-white" : ""}`} style={top ? undefined : { color: CHARCOAL }}>{t.name}</span><span className={`block text-sm ${top ? "text-white/60" : "text-gray-500"}`}>{t.role}, {t.company}</span></span>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
        <div className="mt-24 flex items-center justify-center gap-4">
          <button onClick={prev} aria-label="Previous testimonial" className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center" style={{ color: CHARCOAL }}><ChevronLeft className="w-5 h-5" /></button>
          <span className="text-sm text-gray-500">Click the card to see the next one</span>
          <button onClick={next} aria-label="Next testimonial" className="w-11 h-11 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: RED }}><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
    </section>
  );
};
